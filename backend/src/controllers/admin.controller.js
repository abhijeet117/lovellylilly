const User = require("../models/User.model");
const Message = require("../models/Message.model");
const QueryLog = require("../models/QueryLog.model");
const asyncHandler = require("../middleware/asyncHandler");

exports.getStats = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalQueries = await Message.countDocuments({ role: "assistant" });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Recent 7 days queries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentQueries = await QueryLog.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
        status: "success",
        data: {
            totalUsers,
            totalQueries,
            verifiedUsers,
            recentQueries
        }
    });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({ status: "success", results: users.length, data: { users } });
});

exports.getQueryLogs = asyncHandler(async (req, res, next) => {
    const logs = await QueryLog.find().populate("user", "name email").sort("-createdAt").limit(100);
    res.status(200).json({ status: "success", results: logs.length, data: { logs } });
});
