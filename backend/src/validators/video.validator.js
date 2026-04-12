const { body, param, query } = require("express-validator");

const VALID_RATIOS = ["16:9", "9:16", "1:1"];

exports.generateVideo = [
    body("prompt")
        .trim()
        .notEmpty().withMessage("Prompt is required")
        .isLength({ min: 10, max: 1000 }).withMessage("Prompt must be between 10 and 1000 characters"),
    body("aspectRatio")
        .optional()
        .isIn(VALID_RATIOS).withMessage(`Aspect ratio must be one of: ${VALID_RATIOS.join(", ")}`)
];

exports.videoIdOnly = [
    param("videoId")
        .isMongoId().withMessage("Invalid video ID")
];

exports.getVideos = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
];
