const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const QueryLog = require("../models/QueryLog.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getStats = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalQueries = await Message.countDocuments({ role: "assistant" });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    // Recent 7 days queries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentQueries = await QueryLog.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Queries per day for the past 7 days
    const queryTrend = await QueryLog.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        status: "success",
        data: { totalUsers, totalQueries, verifiedUsers, bannedUsers, recentQueries, queryTrend }
    });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search
        ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
        : {};

    const [users, total] = await Promise.all([
        User.find(query).sort("-createdAt").skip(skip).limit(limit),
        User.countDocuments(query)
    ]);

    res.status(200).json({
        status: "success",
        results: users.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: { users }
    });
});

exports.getQueryLogs = asyncHandler(async (req, res, next) => {
    const logs = await QueryLog.find()
        .populate("user", "name email")
        .sort("-createdAt")
        .limit(100);
    res.status(200).json({ status: "success", results: logs.length, data: { logs } });
});

exports.banUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError("User not found", 404));
    if (user.role === "admin") return next(new AppError("Cannot ban an admin user", 403));

    user.isBanned = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: "success", message: "User banned successfully", data: { user } });
});

exports.unbanUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError("User not found", 404));

    user.isBanned = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: "success", message: "User unbanned successfully", data: { user } });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError("User not found", 404));
    if (user.role === "admin") return next(new AppError("Cannot delete an admin user", 403));

    // Cascade delete user data
    await Promise.all([
        Chat.deleteMany({ user: user._id }),
        Message.deleteMany({ user: user._id }),
        QueryLog.deleteMany({ user: user._id }),
        User.findByIdAndDelete(user._id)
    ]);

    res.status(204).json({ status: "success", data: null });
});

exports.makeAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role: "admin" },
        { new: true, runValidators: true }
    );
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ status: "success", data: { user } });
});
