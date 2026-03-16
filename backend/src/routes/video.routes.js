const express = require("express");
const videoController = require("../controllers/video.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", videoController.generateVideo);
router.get("/:videoId/status", videoController.checkVideoStatus);
router.get("/", videoController.getMyVideos);
router.delete("/:videoId", videoController.deleteVideo);

module.exports = router;
