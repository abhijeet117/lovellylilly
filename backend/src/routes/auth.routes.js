const express = require("express");
const authController = require("../controllers/auth.controller");
const authValidator  = require("../validators/auth.validator");
const validate       = require("../middleware/validate");
const { protect }    = require("../middleware/auth");
const rateLimit      = require("express-rate-limit");

const router = express.Router();

// Tight rate limit specifically for resend — prevents email bombing
const resendLimiter = rateLimit({
    max: 3,
    windowMs: 15 * 60 * 1000, // 3 resends per 15 minutes
    message: { status: "error", message: "Too many resend requests. Please wait 15 minutes before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── Email/password auth ────────────────────────────────────────────────────
router.post("/register",         authValidator.register,         validate, authController.register);
router.post("/login",            authValidator.login,            validate, authController.login);
router.post("/logout",                                                     authController.logout);
router.get( "/get-me",           protect,                                  authController.getMe);

// ── Email verification ────────────────────────────────────────────────────
router.get( "/verify-email/:token",                                        authController.verifyEmail);
router.post("/resend-verification", resendLimiter, authValidator.forgotPassword, validate, authController.resendVerification);

// ── Password reset ────────────────────────────────────────────────────────
router.post("/forgot-password",  authValidator.forgotPassword,  validate, authController.forgotPassword);
router.post("/reset-password/:token", authValidator.resetPassword, validate, authController.resetPassword);

// ── Firebase OAuth (Google / GitHub / etc.) ───────────────────────────────
router.post("/firebase",         authValidator.firebaseAuth,    validate, authController.firebaseAuth);

module.exports = router;
