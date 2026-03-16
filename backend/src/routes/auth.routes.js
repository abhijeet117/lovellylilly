const express = require("express");
const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authValidator.register, validate, authController.register);
router.post("/login", authValidator.login, validate, authController.login);
router.post("/logout", authController.logout);

router.get("/get-me", protect, authController.getMe);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authValidator.forgotPassword, validate, authController.forgotPassword);
router.post("/reset-password/:token", authValidator.resetPassword, validate, authController.resetPassword);

module.exports = router;
