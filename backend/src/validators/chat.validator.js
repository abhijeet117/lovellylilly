const { body, param } = require("express-validator");

exports.renameChat = [
    param("chatId").isMongoId().withMessage("Invalid chat ID"),
    body("title").trim().notEmpty().withMessage("Title is required")
];

exports.chatIdOnly = [
    param("chatId").isMongoId().withMessage("Invalid chat ID")
];
