const { body, param } = require("express-validator");

const VALID_TYPES = ["landing-page", "portfolio", "saas", "blog", "e-commerce", "dashboard", "other"];

exports.generateWebsite = [
    body("prompt")
        .trim()
        .notEmpty().withMessage("Prompt is required")
        .isLength({ min: 10, max: 2000 }).withMessage("Prompt must be between 10 and 2000 characters"),
    body("type")
        .optional()
        .isIn(VALID_TYPES).withMessage(`Type must be one of: ${VALID_TYPES.join(", ")}`)
];

exports.websiteIdOnly = [
    param("websiteId")
        .isMongoId().withMessage("Invalid website ID")
];
