/**
 * Seed script — creates (or resets) the admin account.
 * Usage:  node scripts/seed-admin.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const ADMIN_EMAIL    = "admin@lovelylilly.ai";
const ADMIN_PASSWORD = "AdminPassword123!";
const ADMIN_NAME     = "Admin";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected to MongoDB");

  // Dynamically load the model so the schema is registered
  const User = require("../src/models/User.model");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      $set: {
        name:            ADMIN_NAME,
        email:           ADMIN_EMAIL,
        password:        passwordHash,
        role:            "admin",
        isEmailVerified: true,
        isBanned:        false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`✅  Admin user ready — _id: ${admin._id}`);
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
  console.log("✅  Done.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
