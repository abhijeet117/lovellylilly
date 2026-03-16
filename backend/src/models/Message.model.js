const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: [true, "Message must belong to a chat"],
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Message must belong to a user"],
        index: true
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sources: [{
        title: String,
        url: String,
        domain: String,
        snippet: String,
        favicon: String
    }],
    hasWebSearch: {
        type: Boolean,
        default: false
    },
    isVoiceMessage: {
        type: Boolean,
        default: false
    },
    systemPromptVersion: {
        type: String,
        default: "v1.0"
    },
    queryMode: {
        type: String,
        enum: ["search", "think", "create", "generate-image", "generate-video", "build-website"]
    },
    followUpSuggestions: [String],
    tokensUsed: Number,
    responseTimeMs: Number,
    model: String
}, {
    timestamps: true
});

// Compound Indexes
messageSchema.index({ chat: 1, createdAt: 1 });
messageSchema.index({ user: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
