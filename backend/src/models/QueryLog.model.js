const mongoose = require("mongoose");

const queryLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    query: String,
    model: String,
    tokensUsed: Number,
    responseTimeMs: Number,
    usedWebSearch: Boolean,
    queryMode: String,
    status: {
        type: String,
        enum: ["success", "error", "timeout"],
        default: "success"
    },
    errorMessage: String,
    ipAddress: String
}, {
    timestamps: true
});

// Indexes
queryLogSchema.index({ createdAt: -1 });
queryLogSchema.index({ user: 1, createdAt: -1 });
queryLogSchema.index({ status: 1, createdAt: -1 });

const QueryLog = mongoose.model("QueryLog", queryLogSchema);

module.exports = QueryLog;
