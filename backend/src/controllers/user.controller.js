const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const securityLogger = require("../middleware/securityLogger");

// ── Whitelist helper — prevents mass assignment attacks ───────────────────────
// Only these top-level and nested paths can be changed by the user themselves
const ALLOWED_PROFILE_FIELDS = ["name", "bio", "avatar"];
const ALLOWED_PREF_FIELDS = ["theme", "defaultModel", "voiceLanguage", "notifications"];

function filterAllowedFields(body) {
    const safe = {};
    for (const field of ALLOWED_PROFILE_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            safe[field] = body[field];
        }
    }
    // Nested preferences
    if (body.preferences && typeof body.preferences === "object") {
        safe.preferences = {};
        for (const pref of ALLOWED_PREF_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(body.preferences, pref)) {
                safe.preferences[pref] = body.preferences[pref];
            }
        }
        if (Object.keys(safe.preferences).length === 0) delete safe.preferences;
    }
    return safe;
}

exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: "success", data: { user } });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
    // Block password changes here — dedicated endpoint only
    if (req.body.password || req.body.role || req.body.isBanned || req.body.isEmailVerified) {
        return next(new AppError("That operation is not permitted on this route.", 400));
    }

    // Strip to allowed fields only — prevents privilege escalation
    const safeUpdate = filterAllowedFields(req.body);

    // Handle avatar removal
    let mongoUpdate;
    if (Object.prototype.hasOwnProperty.call(req.body, "avatar") && (req.body.avatar === "" || req.body.avatar === null)) {
        const { avatar, ...rest } = safeUpdate;
        mongoUpdate = Object.keys(rest).length
            ? { $set: rest, $unset: { avatar: "" } }
            : { $unset: { avatar: "" } };
    } else {
        mongoUpdate = { $set: safeUpdate };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, mongoUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ status: "success", data: { user: updatedUser } });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.comparePassword(currentPassword, user.password))) {
        securityLogger.warn("password_change_wrong_current", { userId: user._id, ip: req.ip });
        return next(new AppError("Your current password is wrong", 401));
    }

    user.password = newPassword;
    await user.save(); // pre-save hook sets passwordChangedAt + hashes

    securityLogger.info("password_changed", { userId: user._id, ip: req.ip });

    // Force client to re-authenticate with new password
    res.cookie("token", "none", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    });

    res.status(200).json({ status: "success", message: "Password updated successfully. Please log in again." });
});

exports.deleteAccount = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);
    await Chat.deleteMany({ user: userId });
    await Message.deleteMany({ user: userId });

    res.cookie("token", "none", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    });

    securityLogger.info("account_deleted", { userId });
    res.status(204).json({ status: "success", data: null });
});

exports.uploadAvatar = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("No file uploaded", 400));
    }

    const allowedMime = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMime.includes(req.file.mimetype)) {
        return next(new AppError("Only JPG, PNG, GIF, and WEBP images are allowed", 400));
    }

    if (req.file.size > 2 * 1024 * 1024) {
        return next(new AppError("Image must be smaller than 2MB", 400));
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: dataUrl },
        { new: true }
    );

    res.status(200).json({
        status: "success",
        data: { user: updatedUser, avatarUrl: dataUrl }
    });
});

// ── API Key management ─────────────────────────────────────────────────────
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const generateApiKey = () => {
    const raw = crypto.randomBytes(36).toString("base64url");
    return "llk_" + raw; // ~52 chars total
};

exports.getApiKeys = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("apiKeys");
    // Only return prefix + metadata — never expose the hash
    const keys = (user.apiKeys || []).map(k => ({
        id: k.id,
        name: k.name,
        prefix: k.prefix,
        createdAt: k.createdAt,
        lastUsedAt: k.lastUsedAt
    }));
    res.status(200).json({ status: "success", data: { keys } });
});

exports.createApiKey = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return next(new AppError("Key name is required", 400));
    }

    const user = await User.findById(req.user.id).select("+apiKeys.keyHash");

    if ((user.apiKeys || []).length >= 10) {
        return res.status(400).json({ status: "fail", message: "Maximum 10 API keys allowed. Revoke an existing key first." });
    }

    const rawKey = generateApiKey();
    const keyHash = await bcrypt.hash(rawKey, 10);
    const prefix = rawKey.slice(0, 12);
    const id = crypto.randomUUID();

    user.apiKeys = user.apiKeys || [];
    user.apiKeys.push({ id, name: name.trim().slice(0, 60), keyHash, prefix });
    await user.save({ validateBeforeSave: false });

    securityLogger.info("api_key_created", { userId: req.user.id, keyId: id });

    // Return full raw key ONCE — never stored in plaintext
    res.status(201).json({
        status: "success",
        data: { id, name: name.trim(), prefix, fullKey: rawKey, createdAt: new Date() },
        message: "Store this key securely — it will not be shown again."
    });
});

exports.deleteApiKey = asyncHandler(async (req, res) => {
    const { keyId } = req.params;
    const user = await User.findById(req.user.id);
    const before = (user.apiKeys || []).length;
    user.apiKeys = (user.apiKeys || []).filter(k => k.id !== keyId);

    if (user.apiKeys.length === before) {
        return res.status(404).json({ status: "fail", message: "API key not found" });
    }

    await user.save({ validateBeforeSave: false });
    securityLogger.info("api_key_revoked", { userId: req.user.id, keyId });
    res.status(200).json({ status: "success", message: "API key revoked" });
});
