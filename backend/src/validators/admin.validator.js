const { param, query } = require("express-validator");

exports.userIdOnly = [
    param("userId").isMongoId().withMessage("Invalid user ID"),
];

exports.getUsers = [
    query("q").optional().trim().isLength({ max: 100 }).withMessage("Search query too long"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];
