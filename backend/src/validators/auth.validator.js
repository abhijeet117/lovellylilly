const { body } = require("express-validator");

// Reusable strong-password validator
const strongPassword = body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character");

const strongNewPassword = body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character");

exports.register = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 80 }).withMessage("Name cannot exceed 80 characters")
        .matches(/^[a-zA-Z\s\-'.]+$/).withMessage("Name contains invalid characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Please provide a valid email")
        .normalizeEmail(),
    strongPassword
];

exports.login = [
    body("email")
        .trim()
        .isEmail().withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
];

exports.forgotPassword = [
    body("email")
        .trim()
        .isEmail().withMessage("Please provide a valid email")
        .normalizeEmail()
];

exports.resetPassword = [strongNewPassword];

exports.firebaseAuth = [
    body("idToken")
        .trim()
        .notEmpty().withMessage("Firebase ID token is required")
        .isLength({ min: 100, max: 4096 }).withMessage("Invalid Firebase ID token format")
];
