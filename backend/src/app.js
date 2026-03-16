const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRouter = require("./routes/auth.routes");
const chatRouter = require("./routes/chat.routes");
const messageRouter = require("./routes/message.routes");
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

const app = express();

// 1. GLOBAL MIDDLEWARE
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Limit requests from same API
// const limiter = rateLimit({
//     max: 100, // Limit each IP to 100 requests per windowMs
//     windowMs: 60 * 60 * 1000, // 1 hour
//     message: "Too many requests from this IP, please try again in an hour!"
// });
// app.use("/api", limiter);

// 2. ROUTES
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// app.use("/api/images", require("./routes/image.routes"));
// app.use("/api/videos", require("./routes/video.routes"));
// app.use("/api/websites", require("./routes/website.routes"));
// app.use("/api/documents", require("./routes/upload.routes"));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        service: "LovellyLilly AI"
    });
});

// Handle undefined routes with Express 5 explicit splat syntax
// app.all("/:path*", (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
