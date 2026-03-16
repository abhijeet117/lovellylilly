const Message = require("../models/Message.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getMessages = asyncHandler(async (req, res, next) => {
    // Check if the chat belongs to the user (implicit via query)
    const messages = await Message.find({ chat: req.params.chatId, user: req.user.id })
        .sort("createdAt");

    res.status(200).json({
        status: "success",
        results: messages.length,
        data: { messages }
    });
});
