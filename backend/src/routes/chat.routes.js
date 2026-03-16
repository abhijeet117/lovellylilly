const express = require("express");
const chatController = require("../controllers/chat.controller");
const chatValidator = require("../validators/chat.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", chatController.getChats);
router.delete("/:chatId", chatValidator.chatIdOnly, validate, chatController.deleteChat);
router.patch("/:chatId/rename", chatValidator.renameChat, validate, chatController.renameChat);
router.patch("/:chatId/save", chatValidator.chatIdOnly, validate, chatController.toggleSave);

module.exports = router;
