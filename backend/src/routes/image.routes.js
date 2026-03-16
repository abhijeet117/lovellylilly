const express = require("express");
const imageController = require("../controllers/image.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", imageController.generateImage);
router.get("/", imageController.getMyImages);
router.delete("/:imageId", imageController.deleteImage);

module.exports = router;
