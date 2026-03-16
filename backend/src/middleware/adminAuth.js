const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        next(new AppError("You do not have permission to perform this action", 403));
    }
};
