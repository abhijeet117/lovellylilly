const express = require("express");
const userController = require("../controllers/user.controller");
const userValidator = require("../validators/user.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/profile", userController.getProfile);
router.patch("/profile", userValidator.updateProfile, validate, userController.updateProfile);
router.patch("/password", userValidator.changePassword, validate, userController.changePassword);
router.delete("/account", userController.deleteAccount);

module.exports = router;
