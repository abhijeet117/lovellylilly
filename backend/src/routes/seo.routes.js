const express = require('express');
const { runSeoAgent } = require('../agents/seo.agent');
const SeoReport = require('../models/SeoReport.model');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/seo/analyze — scrape URL, analyze SEO, save to MongoDB
router.post('/analyze', protect, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // Basic URL format guard
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ success: false, error: 'URL must start with http:// or https://' });
    }

    const result = await runSeoAgent(url, req.user._id);

    if (!result.success) {
      return res.status(422).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result.analysis });
  } catch (err) {
    console.error('[SEO Route] analyze error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/seo/history — fetch past reports for authenticated user (newest first)
router.get('/history', protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      SeoReport.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('url score grade createdAt'),
      SeoReport.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[SEO Route] history error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
