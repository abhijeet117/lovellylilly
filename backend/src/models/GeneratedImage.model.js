const mongoose = require("mongoose");

const generatedImageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    prompt: {
        type: String,
        required: true
    },
    revisedPrompt: String,
    imageUrl: {
        type: String, // base64 or URL
        required: true
    },
    model: String,
    aspectRatio: {
        type: String,
        enum: ["1:1", "16:9", "9:16"],
        default: "1:1"
    },
    style: {
        type: String,
        default: "realistic"
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    generationTimeMs: Number
}, {
    timestamps: true
});

// Index for user history
generatedImageSchema.index({ user: 1, createdAt: -1 });

const GeneratedImage = mongoose.model("GeneratedImage", generatedImageSchema);

module.exports = GeneratedImage;
