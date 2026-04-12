const { createLogger, format, transports } = require("winston");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

// Log to console always; in production also write to files
const loggerTransports = [
    new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, ...meta }) => {
                const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
                return `[${timestamp}] ${level}: ${message}${metaStr}`;
            })
        )
    })
];

if (isProd) {
    loggerTransports.push(
        new transports.File({
            filename: path.join(process.cwd(), "logs", "security.log"),
            maxsize: 5 * 1024 * 1024, // 5MB per file
            maxFiles: 10,
            tailable: true
        }),
        new transports.File({
            filename: path.join(process.cwd(), "logs", "errors.log"),
            level: "error",
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
            tailable: true
        })
    );
}

const logger = createLogger({
    level: isProd ? "warn" : "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: loggerTransports,
    exitOnError: false
});

module.exports = logger;
