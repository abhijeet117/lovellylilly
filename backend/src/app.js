const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { clean: cleanXss } = require("xss-clean/lib/xss");
const hpp = require("hpp");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const securityLogger = require("./middleware/securityLogger");

// Route imports
const authRouter    = require("./routes/auth.routes");
const chatRouter    = require("./routes/chat.routes");
const messageRouter = require("./routes/message.routes");
const userRouter    = require("./routes/user.routes");
const adminRouter   = require("./routes/admin.routes");
const executeRouter = require("./routes/execute.routes");
const seoRouter     = require("./routes/seo.routes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const contentSecurityPolicyDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://image.pollinations.ai"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"]
};

if (isProduction) {
    contentSecurityPolicyDirectives.upgradeInsecureRequests = [];
}

const sanitizeXssInput = (value) => {
    if (Array.isArray(value)) {
        return value.map(sanitizeXssInput);
    }

    if (value && typeof value === "object") {
        for (const [key, nestedValue] of Object.entries(value)) {
            value[key] = sanitizeXssInput(nestedValue);
        }
        return value;
    }

    if (typeof value === "string") {
        return cleanXss(value);
    }

    return value;
};

// ─── 1. SECURITY HEADERS ─────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: contentSecurityPolicyDirectives
    },
    hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    crossOriginEmbedderPolicy: false // allow third-party embeds in generated websites
}));

// ─── 2. LOGGING ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    // Concise production access log
    app.use(morgan("combined", {
        stream: { write: (msg) => securityLogger.info("http_access", { log: msg.trim() }) }
    }));
}

// ─── 3. CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl) only in dev
        if (!origin && process.env.NODE_ENV !== "production") return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ─── 4. BODY PARSING ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));          // tightened from 10mb
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// ─── 5. INPUT SANITIZATION ────────────────────────────────────────────────────
// Prevent NoSQL injection — sanitize mutable request objects in place.
app.use((req, res, next) => {
    for (const key of ["body", "params", "headers", "query"]) {
        if (req[key]) {
            mongoSanitize.sanitize(req[key], { replaceWith: "_" });
        }
    }
    next();
});

// Prevent XSS — sanitize mutable request objects in place for Express 5.
app.use((req, res, next) => {
    for (const key of ["body", "query", "params"]) {
        if (req[key]) {
            sanitizeXssInput(req[key]);
        }
    }
    next();
});

// Prevent HTTP Parameter Pollution attacks
app.use(hpp({
    whitelist: ["sort", "fields", "page", "limit", "filter"]
}));

// ─── 6. RATE LIMITING ─────────────────────────────────────────────────────────
const makeLimit = (max, windowMin, message) => rateLimit({
    max,
    windowMs: windowMin * 60 * 1000,
    message: { status: "error", message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip)  // per-user when authenticated
});

// Auth endpoints — tightest limits to block brute-force
const authLimiter = makeLimit(15, 15, "Too many auth requests, please try again in 15 minutes.");

// AI generation — expensive endpoints, strict per-user limits
const aiLimiter = makeLimit(30, 60, "AI generation limit reached. Try again in an hour.");

// Document operations — moderate
const docLimiter = makeLimit(50, 60, "Document operation limit reached. Try again later.");

// General API — broad catch-all
const apiLimiter = makeLimit(300, 60, "Too many requests. Try again in an hour.");

// Apply in order from most to least specific
app.use("/api/auth/login",          authLimiter);
app.use("/api/auth/register",       authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/images",              aiLimiter);
app.use("/api/videos",              aiLimiter);
app.use("/api/websites",            aiLimiter);
app.use("/api/documents",           docLimiter);
app.use("/api",                     apiLimiter);

// ─── 7. ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRouter);
app.use("/api/chats",     chatRouter);
app.use("/api/messages",  messageRouter);
app.use("/api/user",      userRouter);
app.use("/api/admin",     adminRouter);
app.use("/api/execute",   executeRouter);
app.use("/api/seo",       seoRouter);

app.use("/api/images",    require("./routes/image.routes"));
app.use("/api/videos",    require("./routes/video.routes"));
app.use("/api/websites",  require("./routes/website.routes"));
app.use("/api/documents", require("./routes/upload.routes"));

// Health check — minimal, no sensitive info exposed
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        service: "LovellyLilly AI",
        timestamp: new Date().toISOString()
    });
});

// ─── 8. ERROR HANDLING ────────────────────────────────────────────────────────
// Catch-all for undefined routes
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
