const crypto = require("crypto");
const User = require("../models/User.model");
const VerificationToken = require("../models/VerificationToken.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");
const emailService = require("../services/email.service");

const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };

    res.cookie("token", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: { user }
    });
};

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("Email already in use", 400));
    }

    const user = await User.create({ name, email, password });

    // Create verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await VerificationToken.create({
        user: user._id,
        token: hashedToken,
        type: "email_verification",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send email
    try {
        await emailService.sendVerificationEmail(user.email, user.name, rawToken);
        res.status(201).json({
            status: "success",
            message: "Verification email sent! Please check your inbox."
        });
    } catch (err) {
        // Fallback if email fails - in real app would handle differently
        console.error("Email failed:", err);
        res.status(201).json({
            status: "success",
            message: "User registered, but verification email failed to send."
        });
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    if (!user.isEmailVerified) {
        return next(new AppError("Please verify your email before logging in", 403));
    }

    sendTokenResponse(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ status: "success", message: "Logged out successfully" });
};

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: "success", data: { user } });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const tokenRecord = await VerificationToken.findOne({
        token: hashedToken,
        type: "email_verification"
    });

    if (!tokenRecord) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    await User.findByIdAndUpdate(tokenRecord.user, { isEmailVerified: true });
    await VerificationToken.deleteOne({ _id: tokenRecord._id });

    res.status(200).json({ status: "success", message: "Email verified successfully! You can now log in." });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return same success message for security
    const successResponse = {
        status: "success",
        message: "If an account with that email exists, a password reset link has been sent."
    };

    if (!user) return res.status(200).json(successResponse);

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
    } catch (err) {
        console.error("Reset email failed:", err);
    }

    res.status(200).json(successResponse);
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const tokenRecord = await VerificationToken.findOne({
        token: hashedToken,
        type: "password_reset"
    });

    if (!tokenRecord) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    const user = await User.findById(tokenRecord.user);
    if (!user) return next(new AppError("User no longer exists", 404));

    user.password = req.body.password;
    await user.save();

    await VerificationToken.deleteOne({ _id: tokenRecord._id });

    // Clear existing token cookie
    res.cookie("token", "none", { expires: new Date(0), httpOnly: true });

    res.status(200).json({ status: "success", message: "Password reset successful! You can now log in with your new password." });
});
