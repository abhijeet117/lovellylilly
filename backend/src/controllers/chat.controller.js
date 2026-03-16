const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getChats = asyncHandler(async (req, res, next) => {
    const chats = await Chat.find({ user: req.user.id }).sort("-lastMessageAt");
    res.status(200).json({ status: "success", results: chats.length, data: { chats } });
});

exports.deleteChat = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user.id });

    if (!chat) {
        return next(new AppError("No chat found with that ID", 404));
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: req.params.chatId });

    res.status(204).json({ status: "success", data: null });
});

exports.renameChat = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOneAndUpdate(
        { _id: req.params.chatId, user: req.user.id },
        { title: req.body.title },
        { new: true, runValidators: true }
    );

    if (!chat) {
        return next(new AppError("No chat found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { chat } });
});

exports.toggleSave = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user.id });

    if (!chat) {
        return next(new AppError("No chat found with that ID", 404));
    }

    chat.isSaved = !chat.isSaved;
    await chat.save();

    res.status(200).json({ status: "success", data: { chat } });
});
