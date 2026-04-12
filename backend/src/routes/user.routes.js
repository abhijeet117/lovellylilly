const express = require("express");
const multer = require("multer");
const userController = require("../controllers/user.controller");
const userValidator = require("../validators/user.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

// In-memory multer for avatar uploads (stored as base64 in MongoDB)
const avatarUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Only JPG, PNG, GIF, and WEBP images are allowed"), false);
    }
});

const router = express.Router();

router.use(protect);

router.get("/profile",  userController.getProfile);
router.patch("/profile", userValidator.updateProfile, validate, userController.updateProfile);
router.patch("/password", userValidator.changePassword, validate, userController.changePassword);
router.post("/avatar", avatarUpload.single("avatar"), userController.uploadAvatar);
router.delete("/account", userController.deleteAccount);

// API key management — validator added to createApiKey
router.get("/api-keys",           userController.getApiKeys);
router.post("/api-keys",          userValidator.createApiKey, validate, userController.createApiKey);
router.delete("/api-keys/:keyId", userController.deleteApiKey);

module.exports = router;
