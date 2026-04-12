const { body } = require("express-validator");

const ALLOWED_THEMES = ["light", "dark", "sand", "ocean"];
const ALLOWED_MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "mistral-large-latest", "mistral-medium", "gemini-1.5-pro", "gemini-1.5-flash"];

exports.updateProfile = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Name cannot be empty")
        .isLength({ max: 80 }).withMessage("Name cannot exceed 80 characters")
        .matches(/^[a-zA-Z\s\-'.]+$/).withMessage("Name contains invalid characters"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
    body("avatar")
        .optional()
        .custom((val) => {
            // Allow empty string (removal), or a valid HTTPS URL, or a data URI (base64 img)
            if (val === "" || val === null) return true;
            if (/^https?:\/\//i.test(val)) return true;
            if (/^data:image\/(jpeg|png|gif|webp);base64,/.test(val)) return true;
            throw new Error("Invalid avatar format");
        }),
    body("preferences.theme")
        .optional()
        .isIn(ALLOWED_THEMES).withMessage("Invalid theme"),
    body("preferences.defaultModel")
        .optional()
        .isIn(ALLOWED_MODELS).withMessage("Invalid model selection"),
    body("preferences.voiceLanguage")
        .optional()
        .trim()
        .matches(/^[a-z]{2}-[A-Z]{2}$/).withMessage("Voice language must be in format en-US"),
    body("preferences.notifications.email")
        .optional()
        .isBoolean().withMessage("Email notification preference must be a boolean"),
    body("preferences.notifications.browser")
        .optional()
        .isBoolean().withMessage("Browser notification preference must be a boolean"),
];

exports.changePassword = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("New password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("New password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("New password must contain at least one number")
        .matches(/[^A-Za-z0-9]/).withMessage("New password must contain at least one special character")
        .custom((val, { req }) => {
            if (val === req.body.currentPassword) {
                throw new Error("New password must be different from current password");
            }
            return true;
        })
];

exports.createApiKey = [
    body("name")
        .trim()
        .notEmpty().withMessage("Key name is required")
        .isLength({ max: 60 }).withMessage("Key name cannot exceed 60 characters")
        .matches(/^[a-zA-Z0-9\s\-_]+$/).withMessage("Key name contains invalid characters")
];
