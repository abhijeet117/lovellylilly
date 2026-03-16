const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true
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
    avatar: String,
    preferences: {
        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "dark"
        },
        defaultModel: {
            type: String,
            default: "gpt-4o"
        },
        voiceLanguage: {
            type: String,
            default: "en-US"
        }
    },
    totalQueries: {
        type: Number,
        default: 0
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
userSchema.index({ role: 1, createdAt: 1 });
userSchema.index({ isEmailVerified: 1, createdAt: 1 });

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
