const fetch = require('node-fetch');

const PINCHTAB_BASE = process.env.PINCHTAB_URL || 'http://localhost:9867';
let instanceId = null;

const getOrCreateInstance = async () => {
  if (instanceId) {
    try {
      await fetch(`${PINCHTAB_BASE}/instances/${instanceId}`);
      return instanceId;
    } catch {
      instanceId = null;
    }
  }

  const res = await fetch(`${PINCHTAB_BASE}/instances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: 'lovelylilly-default' })
  }).then(r => r.json());

  instanceId = res.id;
  return instanceId;
};

const scrapeUrl = async (url, options = {}) => {
  try {
    const id = await getOrCreateInstance();

    await fetch(`${PINCHTAB_BASE}/instances/${id}/navigate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    await new Promise(r => setTimeout(r, options.waitMs || 2000));

    const textResult = await fetch(`${PINCHTAB_BASE}/instances/${id}/text`)
      .then(r => r.json());

    const snapshot = await fetch(
      `${PINCHTAB_BASE}/instances/${id}/snapshot?filter=content`
    ).then(r => r.json()).catch(() => ({}));

    return {
      success: true,
      url,
      title: snapshot.title || '',
      text: textResult.text?.slice(0, 4000) || '',
      tool: 'pinchtab',
      scrapedAt: new Date().toISOString()
    };
  } catch (err) {
    return { success: false, url, error: err.message };
  }
};

const scrapeMultiple = async (urls) => {
  const results = await Promise.allSettled(
    urls.slice(0, 3).map(url => scrapeUrl(url))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
};

const extractUrls = (text) => {
  const regex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  return [...new Set(text.match(regex) || [])];
};

module.exports = { scrapeUrl, scrapeMultiple, extractUrls };
