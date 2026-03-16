const mongoose = require("mongoose");

const generatedVideoSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
        index: true
    },
    videoUrl: String,
    thumbnailUrl: String,
    duration: Number,
    aspectRatio: String,
    model: String,
    operationId: String,
    errorMessage: String
}, {
    timestamps: true
});

// Indexes
generatedVideoSchema.index({ user: 1, createdAt: -1 });
generatedVideoSchema.index({ status: 1, createdAt: -1 });

const GeneratedVideo = mongoose.model("GeneratedVideo", generatedVideoSchema);

module.exports = GeneratedVideo;
