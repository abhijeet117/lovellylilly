const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: "success", data: { user } });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
    // Prevent password updates here
    if (req.body.password) {
        return next(new AppError("This route is not for password updates. Please use /password-update", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ status: "success", data: { user: updatedUser } });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.comparePassword(currentPassword, user.password))) {
        return next(new AppError("Your current password is wrong", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: "success", message: "Password updated successfully" });
});

exports.deleteAccount = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);
    
    // Cleanup user data
    await Chat.deleteMany({ user: req.user.id });
    await Message.deleteMany({ user: req.user.id });
    
    res.cookie("token", "none", { expires: new Date(0), httpOnly: true });
    res.status(204).json({ status: "success", data: null });
});
