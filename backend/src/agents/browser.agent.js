const { scrapeMultiple, extractUrls } = require('../services/pinchtab.service');

const runBrowserAgent = async (userMessage) => {
  const urls = extractUrls(userMessage);
  if (urls.length === 0) return null;

  const results = await scrapeMultiple(urls);
  const successful = results.filter(r => r.success);
  if (successful.length === 0) return null;

  const context = successful.map(r =>
    `## Content from: ${r.url}\nTitle: ${r.title}\n\n${r.text}`
  ).join('\n\n---\n\n');

  return { type: 'url_scrape', urls, results: successful, context };
};

module.exports = { runBrowserAgent };
