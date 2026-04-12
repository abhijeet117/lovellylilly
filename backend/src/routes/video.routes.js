const express = require("express");
const videoController = require("../controllers/video.controller");
const videoValidator = require("../validators/video.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", videoValidator.generateVideo, validate, videoController.generateVideo);
router.get("/:videoId/status", videoValidator.videoIdOnly, validate, videoController.checkVideoStatus);
router.get("/", videoValidator.getVideos, validate, videoController.getMyVideos);
router.delete("/:videoId", videoValidator.videoIdOnly, validate, videoController.deleteVideo);

module.exports = router;
