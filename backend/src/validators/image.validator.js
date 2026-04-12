const { body, param, query } = require("express-validator");

const VALID_STYLES = ["realistic", "cinematic", "anime", "oil-painting", "digital-art", "watercolor"];
const VALID_RATIOS = ["1:1", "16:9", "9:16"];

exports.generateImage = [
    body("prompt")
        .trim()
        .notEmpty().withMessage("Prompt is required")
        .isLength({ min: 3, max: 1000 }).withMessage("Prompt must be between 3 and 1000 characters"),
    body("style")
        .optional()
        .isIn(VALID_STYLES).withMessage(`Style must be one of: ${VALID_STYLES.join(", ")}`),
    body("aspectRatio")
        .optional()
        .isIn(VALID_RATIOS).withMessage(`Aspect ratio must be one of: ${VALID_RATIOS.join(", ")}`),
];

exports.deleteImage = [
    param("imageId").isMongoId().withMessage("Invalid image ID"),
];

exports.getImages = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
];
