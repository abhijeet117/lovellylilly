const express = require("express");
const adminController = require("../controllers/admin.controller");
const adminValidator = require("../validators/admin.validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.use(protect, adminAuth);

router.get("/stats", adminController.getStats);
router.get("/users", adminValidator.getUsers, validate, adminController.getUsers);
router.get("/logs", adminController.getQueryLogs);

router.post("/users/:userId/ban", adminValidator.userIdOnly, validate, adminController.banUser);
router.post("/users/:userId/unban", adminValidator.userIdOnly, validate, adminController.unbanUser);
router.delete("/users/:userId", adminValidator.userIdOnly, validate, adminController.deleteUser);
router.post("/users/:userId/make-admin", adminValidator.userIdOnly, validate, adminController.makeAdmin);

module.exports = router;
