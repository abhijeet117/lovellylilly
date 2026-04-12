const express = require("express");
const websiteController = require("../controllers/website.controller");
const websiteValidator = require("../validators/website.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", websiteValidator.generateWebsite, validate, websiteController.generateWebsite);

// Sandboxed preview — strict CSP prevents scripts from reaching external origins
router.get("/:websiteId/preview", websiteValidator.websiteIdOnly, validate, (req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src * data:; connect-src 'none'; frame-ancestors 'self';"
    );
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
}, websiteController.previewWebsite);
router.get("/", websiteController.getMyWebsites);
router.delete("/:websiteId", websiteValidator.websiteIdOnly, validate, websiteController.deleteWebsite);

module.exports = router;
