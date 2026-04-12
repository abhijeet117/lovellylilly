/**
 * Validates required and recommended environment variables at startup.
 * Call once at the top of server.js after dotenv.config().
 */
const validateEnv = () => {
    const required = [
        "MONGO_URI",
        "JWT_SECRET",
        "JWT_EXPIRES_IN",
        "CLIENT_URL"
    ];

    const recommended = [
        "MISTRAL_API_KEY",
        "GEMINI_API_KEY",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "EMAIL_HOST",
        "EMAIL_USER",
        "EMAIL_PASS"
    ];

    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error("\n❌  FATAL: Missing required environment variables:");
        missing.forEach((key) => console.error(`   - ${key}`));
        console.error("\nCopy .env.example to .env and fill in all required values.\n");
        process.exit(1);
    }

    const missingRec = recommended.filter((key) => !process.env[key]);
    if (missingRec.length > 0) {
        console.warn("\n⚠️  Warning: Missing recommended environment variables (some features may be disabled):");
        missingRec.forEach((key) => console.warn(`   - ${key}`));
        console.warn("");
    }

    // ── Production-only security checks ──────────────────────────────────────
    if (process.env.NODE_ENV === "production") {
        const weakSecrets = ["secret", "your-jwt-secret", "password", "changeme", "default", "dev"];

        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            console.error("❌  FATAL: JWT_SECRET must be at least 32 characters in production.");
            process.exit(1);
        }
        if (weakSecrets.includes((process.env.JWT_SECRET || "").toLowerCase())) {
            console.error("❌  FATAL: JWT_SECRET is using a weak/default value. Use a cryptographically random secret.");
            process.exit(1);
        }
        if (!process.env.CLIENT_URL.startsWith("https://")) {
            console.error("❌  FATAL: CLIENT_URL must use HTTPS in production.");
            process.exit(1);
        }
        if (!process.env.MONGO_URI.startsWith("mongodb+srv://") && !process.env.MONGO_URI.startsWith("mongodb://")) {
            console.error("❌  FATAL: MONGO_URI appears invalid.");
            process.exit(1);
        }
        console.log("✅  Environment validation passed (production mode).");
    }
};

module.exports = validateEnv;
