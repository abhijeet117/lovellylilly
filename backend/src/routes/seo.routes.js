const express = require('express');
const { runSeoAgent } = require('../agents/seo.agent');
const SeoReport = require('../models/SeoReport.model');
const { protect } = require('../middleware/auth');
const seoValidator = require('../validators/seo.validator');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const router = express.Router();

// POST /api/seo/analyze — scrape URL, analyze SEO, save to MongoDB
router.post(
  '/analyze',
  protect,
  seoValidator.analyzeUrl,
  validate,
  asyncHandler(async (req, res, next) => {
    const { url } = req.body;

    const result = await runSeoAgent(url, req.user._id);

    if (!result.success) {
      return next(new AppError(result.error || 'SEO analysis failed', 422));
    }

    res.json({ success: true, data: result.analysis });
  })
);

// GET /api/seo/history — fetch past reports for authenticated user (newest first)
router.get(
  '/history',
  protect,
  seoValidator.getHistory,
  validate,
  asyncHandler(async (req, res) => {
    const page  = req.query.page  || 1;
    const limit = req.query.limit || 10;
    const skip  = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      SeoReport.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('url score grade createdAt'),
      SeoReport.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

module.exports = router;
