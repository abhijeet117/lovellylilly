const { body } = require("express-validator");

exports.updateProfile = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("preferences.theme").optional().isIn(["light", "dark"]).withMessage("Invalid theme"),
    body("preferences.defaultModel").optional().notEmpty().withMessage("Default model is required"),
    body("preferences.voiceLanguage").optional().notEmpty().withMessage("Voice language is required")
];

exports.changePassword = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters long")
];
