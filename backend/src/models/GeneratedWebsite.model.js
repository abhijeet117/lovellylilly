const mongoose = require("mongoose");

const generatedWebsiteSchema = new mongoose.Schema({
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
    title: String,
    htmlContent: String,
    cssContent: String,
    jsContent: String,
    fullHtml: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["landing-page", "portfolio", "saas", "blog", "e-commerce", "dashboard", "other"],
        default: "landing-page"
    },
    isSaved: {
        type: Boolean,
        default: false,
        index: true
    },
    previewSnapshot: String // base64
}, {
    timestamps: true
});

// Indexes
generatedWebsiteSchema.index({ user: 1, createdAt: -1 });
generatedWebsiteSchema.index({ user: 1, isSaved: 1 });

const GeneratedWebsite = mongoose.model("GeneratedWebsite", generatedWebsiteSchema);

module.exports = GeneratedWebsite;
