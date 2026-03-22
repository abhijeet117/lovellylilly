const mongoose = require('mongoose');

const seoReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F']
  },
  report: {
    type: Object
  }
}, { timestamps: true });

// Index for quickly fetching a user's history sorted by newest
seoReportSchema.index({ user: 1, createdAt: -1 });

const SeoReport = mongoose.model('SeoReport', seoReportSchema);

module.exports = SeoReport;
