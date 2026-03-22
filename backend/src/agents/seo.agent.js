const cheerio = require('cheerio');
const { scrapeUrl } = require('../services/pinchtab.service');
const SeoReport = require('../models/SeoReport.model');

const runSeoAgent = async (url, userId = null) => {
  // Step 1: Scrape the page with PinchTab
  const scraped = await scrapeUrl(url);
  if (!scraped.success) {
    return { success: false, error: `Cannot access ${url}: ${scraped.error || 'Unknown error'}` };
  }

  // Step 2: Parse HTML with Cheerio (falls back to raw text if no HTML)
  const $ = cheerio.load(scraped.html || scraped.text || '');
  const issues = { critical: [], high: [], medium: [], low: [] };

  // ── Meta Title ──────────────────────────────────────────────────────────────
  const title = $('title').text().trim();
  if (!title) {
    issues.critical.push({
      type: 'Missing Meta Title',
      impact: 'Google cannot show your page in search results',
      fix: `<title>LovellyLilly — AI Thinking Companion | Ask Anything</title>`
    });
  } else if (title.length < 50 || title.length > 60) {
    issues.high.push({
      type: `Meta Title length: ${title.length} chars (ideal 50–60)`,
      current: title,
      fix: 'Adjust title to 50–60 characters for optimal CTR'
    });
  }

  // ── Meta Description ─────────────────────────────────────────────────────────
  const desc = $('meta[name="description"]').attr('content') || '';
  if (!desc) {
    issues.critical.push({
      type: 'Missing Meta Description',
      impact: 'Google auto-generates poor snippets, reducing click-through rate',
      fix: `<meta name="description" content="LovellyLilly is your AI thinking companion — built for depth, nuance, and genuine intellectual exchange.">`
    });
  } else if (desc.length < 150 || desc.length > 160) {
    issues.medium.push({
      type: `Meta Description: ${desc.length} chars (ideal 150–160)`,
      current: desc,
      fix: 'Adjust description to 150–160 characters'
    });
  }

  // ── H1 Tag ───────────────────────────────────────────────────────────────────
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.critical.push({
      type: 'Missing H1 Tag',
      impact: 'Major ranking signal missing — Google needs H1 for page topic',
      fix: 'Add exactly one <h1> containing your primary keyword'
    });
  } else if (h1Count > 1) {
    issues.high.push({
      type: `Multiple H1 tags (${h1Count} found)`,
      impact: 'Dilutes keyword signal, confuses crawlers',
      fix: 'Keep exactly 1 H1 per page — demote others to H2/H3'
    });
  }

  // ── Images Missing Alt Text ───────────────────────────────────────────────────
  const imgsNoAlt = $('img:not([alt]), img[alt=""]').length;
  if (imgsNoAlt > 0) {
    issues.medium.push({
      type: `${imgsNoAlt} image${imgsNoAlt > 1 ? 's' : ''} missing alt text`,
      impact: 'Accessibility failure + missed image-search ranking opportunity',
      fix: 'Add descriptive alt="…" to all <img> tags, e.g. alt="LovellyLilly AI chat interface"'
    });
  }

  // ── Open Graph Tags ───────────────────────────────────────────────────────────
  if (!$('meta[property="og:title"]').attr('content')) {
    issues.high.push({
      type: 'Open Graph tags missing',
      impact: 'Poor link previews on Twitter, LinkedIn, WhatsApp, Slack',
      fix: `<meta property="og:title" content="LovellyLilly — AI Thinking Companion">
<meta property="og:description" content="Your AI thinking companion for depth and nuance.">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="${url}">`
    });
  }

  // ── Canonical Tag ─────────────────────────────────────────────────────────────
  if (!$('link[rel="canonical"]').attr('href')) {
    issues.medium.push({
      type: 'Missing Canonical Tag',
      impact: 'Risk of duplicate-content penalties across page variants',
      fix: `<link rel="canonical" href="${url}">`
    });
  }

  // ── Robots Meta ───────────────────────────────────────────────────────────────
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  if (robotsMeta.includes('noindex')) {
    issues.critical.push({
      type: 'Page is set to noindex',
      impact: 'This page will NOT appear in Google search results',
      fix: 'Remove <meta name="robots" content="noindex"> or change to "index, follow"'
    });
  }

  // ── Viewport Meta ─────────────────────────────────────────────────────────────
  if (!$('meta[name="viewport"]').attr('content')) {
    issues.high.push({
      type: 'Missing viewport meta tag',
      impact: 'Page will not be mobile-friendly — hurts mobile rankings',
      fix: '<meta name="viewport" content="width=device-width, initial-scale=1">'
    });
  }

  // ── Score Calculation ─────────────────────────────────────────────────────────
  const deductions =
    issues.critical.length * 25 +
    issues.high.length * 12 +
    issues.medium.length * 6 +
    issues.low.length * 2;

  const score = Math.max(0, 100 - deductions);
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  const analysis = {
    url,
    score,
    grade,
    issues,
    totalIssues:
      issues.critical.length +
      issues.high.length +
      issues.medium.length +
      issues.low.length,
    scannedAt: new Date().toISOString()
  };

  // Step 3: Save to MongoDB (fire-and-forget — never block the response)
  if (userId) {
    SeoReport.create({ user: userId, url, score, grade, report: analysis })
      .catch(err => console.error('[SEO Agent] Save failed:', err.message));
  }

  return { success: true, analysis };
};

module.exports = { runSeoAgent };
