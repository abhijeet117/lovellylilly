const express = require("express");
const imageController = require("../controllers/image.controller");
const imageValidator = require("../validators/image.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", imageValidator.generateImage, validate, imageController.generateImage);
router.get("/", imageValidator.getImages, validate, imageController.getMyImages);
router.delete("/:imageId", imageValidator.deleteImage, validate, imageController.deleteImage);

module.exports = router;
