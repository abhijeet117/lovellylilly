const { body, query } = require("express-validator");

exports.analyzeUrl = [
    body("url")
        .trim()
        .notEmpty().withMessage("URL is required")
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage("URL must be a valid http:// or https:// address")
        .isLength({ max: 2048 }).withMessage("URL must be under 2048 characters"),
];

exports.getHistory = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50")
        .toInt(),
];
