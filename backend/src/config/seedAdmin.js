/**
 * Auto-seeds the admin account on first startup.
 * Runs only in development OR when SEED_ADMIN=true is set.
 * Safe to call every restart — uses upsert, never duplicates.
 */
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL    = "admin@lovelylilly.ai";
const ADMIN_PASSWORD = "AdminPassword123!";
const ADMIN_NAME     = "LovellyLilly Admin";

const seedAdmin = async () => {
    try {
        // Lazy-require to avoid circular deps at module load time
        const User = require("../models/User.model");

        const existing = await User.findOne({ email: ADMIN_EMAIL }).select("_id role");

        if (existing) {
            // Ensure the existing account always has role=admin and is verified
            if (existing.role !== "admin") {
                await User.updateOne(
                    { _id: existing._id },
                    { $set: { role: "admin", isEmailVerified: true } }
                );
                console.log("✅  Admin role restored for:", ADMIN_EMAIL);
            }
            return; // already set up, nothing else to do
        }

        // Create fresh admin account with pre-hashed password
        // (bypasses pre-save hook to avoid double-hashing)
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await User.collection.insertOne({
            name:            ADMIN_NAME,
            email:           ADMIN_EMAIL,
            password:        passwordHash,
            role:            "admin",
            isEmailVerified: true,
            isBanned:        false,
            preferences: {
                theme:         "dark",
                defaultModel:  "gpt-4o",
                voiceLanguage: "en-US",
                notifications: { email: true, browser: true },
            },
            apiKeys:      [],
            totalQueries: 0,
            lastActiveAt: new Date(),
            createdAt:    new Date(),
            updatedAt:    new Date(),
        });

        console.log("✅  Admin account created:", ADMIN_EMAIL);
    } catch (err) {
        // Non-fatal — log and continue. The app works without the seed.
        console.warn("⚠️  seedAdmin skipped:", err.message);
    }
};

module.exports = seedAdmin;
