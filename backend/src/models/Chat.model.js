const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Chat must belong to a user"],
        index: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    isSaved: {
        type: Boolean,
        default: false,
        index: true
    },
    messageCount: {
        type: Number,
        default: 0
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    model: String,
    queryMode: {
        type: String,
        enum: ["search", "think", "create", "generate-image", "generate-video", "build-website"],
        default: "think"
    }
}, {
    timestamps: true
});

// Compound Indexes
chatSchema.index({ user: 1, lastMessageAt: -1 });
chatSchema.index({ user: 1, isSaved: 1 });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
