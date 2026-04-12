const crypto = require("crypto");
const User = require("../models/User.model");
const VerificationToken = require("../models/VerificationToken.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");
const emailService = require("../services/email.service");
const securityLogger = require("../middleware/securityLogger");

const isDevelopmentMode = process.env.NODE_ENV !== "production";

// Sets JWT in a secure httpOnly cookie — does NOT expose token in the JSON body
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    };

    res.cookie("token", token, cookieOptions);

    // Strip sensitive fields before sending user object
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    user.passwordChangedAt = undefined;

    // Never send the raw token in the response body — use the httpOnly cookie only
    res.status(statusCode).json({
        status: "success",
        data: { user }
    });
};

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return next(new AppError("Email already in use", 400));
    }

    const user = await User.create({ name, email, password });

    if (isDevelopmentMode) {
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
        securityLogger.info("user_registered", { userId: user._id, email: user.email, env: "development" });
        return sendTokenResponse(user, 201, res);
    }

    // Create email verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await VerificationToken.create({
        user: user._id,
        token: hashedToken,
        type: "email_verification",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    try {
        await emailService.sendVerificationEmail(user.email, user.name, rawToken);
        securityLogger.info("user_registered", { userId: user._id, email: user.email, emailSent: true });
        res.status(201).json({
            status: "success",
            message: "Verification email sent! Please check your inbox."
        });
    } catch (err) {
        securityLogger.error("email_send_failed", { userId: user._id, error: err.message });
        res.status(201).json({
            status: "success",
            message: "User registered, but verification email failed to send."
        });
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Fetch user including lockout and attempt fields
    const user = await User.findOne({ email: email.toLowerCase() })
        .select("+password +loginAttempts +lockUntil");

    // Generic error message — never reveal whether the email exists
    const genericError = new AppError("Incorrect email or password", 401);

    if (!user) {
        securityLogger.warn("login_failed_no_user", { email, ip: req.ip });
        return next(genericError);
    }

    // Account lockout check
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
        securityLogger.warn("login_blocked_lockout", { userId: user._id, ip: req.ip });
        return next(new AppError(`Account temporarily locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`, 429));
    }

    const isPasswordCorrect = await user.comparePassword(password, user.password);
    if (!isPasswordCorrect) {
        await user.incrementLoginAttempts();
        securityLogger.warn("login_failed_bad_password", { userId: user._id, ip: req.ip, attempts: user.loginAttempts + 1 });
        return next(genericError);
    }

    if (!isDevelopmentMode && !user.isEmailVerified) {
        return next(new AppError("Please verify your email before logging in", 403));
    }

    // Successful login — reset failed attempts
    await user.resetLoginAttempts();
    securityLogger.info("login_success", { userId: user._id, ip: req.ip });

    sendTokenResponse(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    });
    if (req.user) securityLogger.info("logout", { userId: req.user._id });
    res.status(200).json({ status: "success", message: "Logged out successfully" });
};

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError("User no longer exists. Please log in again.", 401));
    }
    res.status(200).json({ status: "success", data: { user } });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const tokenRecord = await VerificationToken.findOne({
        token: hashedToken,
        type: "email_verification",
        expiresAt: { $gt: new Date() }
    });

    if (!tokenRecord) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    await User.findByIdAndUpdate(tokenRecord.user, { isEmailVerified: true });
    await VerificationToken.deleteOne({ _id: tokenRecord._id });

    securityLogger.info("email_verified", { userId: tokenRecord.user });
    res.status(200).json({ status: "success", message: "Email verified successfully! You can now log in." });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Always return same message regardless of whether email exists (prevent enumeration)
    const successResponse = {
        status: "success",
        message: "If an account with that email exists, a password reset link has been sent."
    };

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        securityLogger.warn("forgot_password_no_user", { email, ip: req.ip });
        return res.status(200).json(successResponse);
    }

    // Invalidate any existing password reset tokens
    await VerificationToken.deleteMany({ user: user._id, type: "password_reset" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await VerificationToken.create({
        user: user._id,
        token: hashedToken,
        type: "password_reset",
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    try {
        await emailService.sendPasswordResetEmail(user.email, user.name, rawToken);
        securityLogger.info("password_reset_requested", { userId: user._id, ip: req.ip });
    } catch (err) {
        securityLogger.error("reset_email_failed", { userId: user._id, error: err.message });
    }

    res.status(200).json(successResponse);
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const tokenRecord = await VerificationToken.findOne({
        token: hashedToken,
        type: "password_reset",
        expiresAt: { $gt: new Date() }
    });

    if (!tokenRecord) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    const user = await User.findById(tokenRecord.user);
    if (!user) return next(new AppError("User no longer exists", 404));

    user.password = req.body.password;
    // passwordChangedAt is set by the pre-save hook
    await user.save();

    // Invalidate the used reset token
    await VerificationToken.deleteOne({ _id: tokenRecord._id });

    // Clear the auth cookie — user must log in fresh with new password
    res.cookie("token", "none", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    });

    securityLogger.info("password_reset_complete", { userId: user._id, ip: req.ip });
    res.status(200).json({ status: "success", message: "Password reset successful! You can now log in with your new password." });
});

// ── Firebase OAuth ─────────────────────────────────────────────────────────
// Called after Google / GitHub sign-in on the frontend.
// Receives a Firebase ID token, verifies it, then finds-or-creates the user
// in our own database and issues our standard session cookie.
exports.firebaseAuth = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;
    if (!idToken) return next(new AppError("Firebase ID token is required", 400));

    const firebaseService = require("../services/firebase.service");

    let decoded;
    try {
        decoded = await firebaseService.verifyIdToken(idToken);
    } catch (err) {
        return next(new AppError(err.message || "Invalid Firebase token", 401));
    }

    const { uid, email, name, picture, email_verified } = decoded;

    if (!email) {
        return next(new AppError("No email associated with this account", 400));
    }

    // Find existing user or create new one (no password needed — OAuth user)
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        user = await User.create({
            name:            name || email.split("@")[0],
            email:           email.toLowerCase(),
            password:        uid + process.env.JWT_SECRET, // non-guessable; field is required by schema
            isEmailVerified: email_verified ?? true,
            avatar:          picture || undefined,
        });
        securityLogger.info("firebase_user_created", { userId: user._id, provider: decoded.firebase?.sign_in_provider });
    } else {
        // Sync avatar if user doesn't have one yet
        if (!user.avatar && picture) {
            user.avatar = picture;
            await user.save({ validateBeforeSave: false });
        }
        // Trust Firebase's email verification
        if (!user.isEmailVerified && email_verified) {
            user.isEmailVerified = true;
            await user.save({ validateBeforeSave: false });
        }
    }

    if (user.isBanned) {
        return next(new AppError("Your account has been suspended. Please contact support.", 403));
    }

    securityLogger.info("firebase_login", { userId: user._id, provider: decoded.firebase?.sign_in_provider, ip: req.ip });
    sendTokenResponse(user, 200, res);
});

// ── Resend Email Verification ──────────────────────────────────────────────
exports.resendVerification = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Same opaque response whether the user exists or not
    const successResponse = {
        status: "success",
        message: "If that email is registered and unverified, a new verification link has been sent."
    };

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.isEmailVerified) {
        return res.status(200).json(successResponse);
    }

    // Delete any existing verification tokens for this user
    await VerificationToken.deleteMany({ user: user._id, type: "email_verification" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await VerificationToken.create({
        user:      user._id,
        token:     hashedToken,
        type:      "email_verification",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    try {
        await emailService.sendVerificationEmail(user.email, user.name, rawToken);
        securityLogger.info("verification_email_resent", { userId: user._id, ip: req.ip });
    } catch (err) {
        securityLogger.error("resend_email_failed", { userId: user._id, error: err.message });
    }

    res.status(200).json(successResponse);
});
