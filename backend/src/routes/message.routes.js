const express = require("express");
const messageController = require("../controllers/message.controller");
const chatValidator = require("../validators/chat.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/:chatId", chatValidator.chatIdOnly, validate, messageController.getMessages);

module.exports = router;
