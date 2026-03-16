const express = require("express");
const adminController = require("../controllers/admin.controller");
const { protect } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.use(protect, adminAuth);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/logs", adminController.getQueryLogs);

module.exports = router;
