const express = require('express');
const { runCode, extractCodeBlock } = require('../services/coderunner.service');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/execute/run — protected, runs JS code in a secure V8 sandbox
router.post('/run', protect, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Code is required' });

    const result = await runCode(extractCodeBlock(code));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
