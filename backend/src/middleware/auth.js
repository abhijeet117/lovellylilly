const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../models/User.model");

exports.protect = asyncHandler(async (req, res, next) => {
    // 1. Extract token from httpOnly cookie OR Authorization header
    let token;
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in. Please log in to get access.", 401));
    }

    // 2. Verify token signature and expiry
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new AppError("Invalid or expired token. Please log in again.", 401));
    }

    // 3. Check user still exists
    const currentUser = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!currentUser) {
        return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // 4. Reject token if password was changed AFTER it was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("Your password was recently changed. Please log in again.", 401));
    }

    // 5. Reject banned accounts
    if (currentUser.isBanned) {
        return next(new AppError("Your account has been suspended. Please contact support.", 403));
    }

    req.user = currentUser;
    next();
});
