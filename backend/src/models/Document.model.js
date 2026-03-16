const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: String,
    sizeBytes: Number,
    gridfsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    parsedText: {
        type: String,
        select: false // Avoid returning large text by default
    },
    pageCount: Number,
    wordCount: Number,
    status: {
        type: String,
        enum: ["processing", "ready", "failed"],
        default: "processing",
        index: true
    },
    chatHistory: [{
        role: {
            type: String,
            enum: ["user", "assistant"]
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes
documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, status: 1 });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
