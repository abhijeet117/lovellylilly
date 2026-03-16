const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../middleware/multer");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("document"), uploadController.uploadDocument);
router.get("/", uploadController.getMyDocs);
router.delete("/:documentId", uploadController.deleteDoc);
router.post("/:documentId/chat", uploadController.chatWithDoc);

module.exports = router;
