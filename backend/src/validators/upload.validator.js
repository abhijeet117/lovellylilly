const { param, body } = require("express-validator");

exports.documentIdOnly = [
    param("documentId").isMongoId().withMessage("Invalid document ID")
];

exports.chatWithDoc = [
    param("documentId").isMongoId().withMessage("Invalid document ID"),
    // Accept either 'question' or 'message' but at least one must be present
    body("question")
        .optional()
        .trim()
        .isLength({ min: 1, max: 2000 }).withMessage("Question must be between 1 and 2000 characters")
        .escape(),       // HTML-encode special chars to prevent stored XSS
    body("message")
        .optional()
        .trim()
        .isLength({ min: 1, max: 2000 }).withMessage("Message must be between 1 and 2000 characters")
        .escape(),
    // At least one must be provided
    body().custom((body) => {
        if (!body.question && !body.message) {
            throw new Error("A question or message is required");
        }
        return true;
    })
];
