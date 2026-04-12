const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS   = 15 * 60 * 1000; // 15 minutes

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true,
        maxlength: [80, "Name cannot exceed 80 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        index: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isBanned: {
        type: Boolean,
        default: false,
        index: true
    },
    avatar: String,
    bio: {
        type: String,
        maxlength: [500, "Bio cannot exceed 500 characters"]
    },
    preferences: {
        theme: {
            type: String,
            enum: ["light", "dark", "sand", "ocean"],
            default: "dark"
        },
        defaultModel: {
            type: String,
            default: "gpt-4o"
        },
        voiceLanguage: {
            type: String,
            default: "en-US"
        },
        notifications: {
            email: { type: Boolean, default: true },
            browser: { type: Boolean, default: true }
        }
    },
    apiKeys: [{
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        keyHash: { type: String, required: true, select: false },
        prefix: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        lastUsedAt: Date,
    }],
    totalQueries: {
        type: Number,
        default: 0
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    // Security: track password changes to invalidate old JWTs
    passwordChangedAt: {
        type: Date,
        select: false
    },
    // Security: login lockout after repeated failures
    loginAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    lockUntil: {
        type: Date,
        select: false
    }
}, {
    timestamps: true
});

// Indexes
userSchema.index({ role: 1, createdAt: 1 });
userSchema.index({ isEmailVerified: 1, createdAt: 1 });
userSchema.index({ isBanned: 1 });

// Hash password before saving — also record timestamp of change
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
    // Record when password was changed so old JWTs are rejected
    if (!this.isNew) {
        this.passwordChangedAt = new Date(Date.now() - 1000); // 1s buffer for JWT issuance timing
    }
});

// Compare plaintext password against stored hash
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Returns true if password was changed AFTER the JWT was issued
userSchema.methods.changedPasswordAfter = function(jwtIssuedAt) {
    if (this.passwordChangedAt) {
        const changedTs = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jwtIssuedAt < changedTs;
    }
    return false;
};

// Increment failed login attempts; lock account when threshold reached
userSchema.methods.incrementLoginAttempts = function() {
    // If a previous lock has expired, reset and start fresh
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set:   { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.lockUntil) {
        updates.$set = { lockUntil: Date.now() + LOCK_DURATION_MS };
    }
    return this.updateOne(updates);
};

// Reset login attempts on successful authentication
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set:   { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
