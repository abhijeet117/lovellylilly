const express = require("express");
const websiteController = require("../controllers/website.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", websiteController.generateWebsite);
router.get("/:websiteId/preview", websiteController.previewWebsite);
router.get("/", websiteController.getMyWebsites);
router.delete("/:websiteId", websiteController.deleteWebsite);

module.exports = router;
