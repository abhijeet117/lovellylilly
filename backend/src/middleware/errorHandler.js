const AppError = require("../utils/AppError");
const securityLogger = require("./securityLogger");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const match = (err.errmsg || err.message || "").match(/(["'])(\\?.)*?\1/);
    const value = match ? match[0] : "unknown";
    return new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    return new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
};

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
    new AppError("Your token has expired. Please log in again.", 401);

const sendErrorDev = (err, res) => {
    // Development: full details for debugging
    res.status(err.statusCode).json({
        status: err.status,
        error:  err,
        message: err.message,
        stack:  err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Trusted, known errors — safe to share message with client
        res.status(err.statusCode).json({
            status:  err.status,
            message: err.message
        });
    } else {
        // Unknown errors — log internally, never leak details to client
        securityLogger.error("unhandled_server_error", {
            message: err.message,
            stack:   err.stack
        });
        res.status(500).json({
            status:  "error",
            message: "Something went wrong. Please try again later."
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status     = err.status     || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
        error.message = err.message;

        if (error.name === "CastError")        error = handleCastErrorDB(error);
        if (error.code === 11000)              error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")  error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        // Log all 5xx errors in production
        if (err.statusCode >= 500) {
            securityLogger.error("server_error", {
                url:    req.originalUrl,
                method: req.method,
                ip:     req.ip,
                message: err.message,
                code:    error.statusCode
            });
        }

        sendErrorProd(error, res);
    }
};
