const { SKILL_REGISTRY } = require('./registry');

const detectSlashCommand = (message) => {
  const match = message.match(/^\/([a-zA-Z-]+)\s*(.*)/s);
  if (!match) return null;

  const command = match[1].toLowerCase();
  const rest = match[2].trim();

  if (command === 'help') return { isHelp: true };

  const skill = SKILL_REGISTRY[command];
  if (!skill) return null;

  return { skill, command, cleanMessage: rest || message, isSlash: true };
};

const autoDetectSkills = (message) => {
  const msgLower = message.toLowerCase();
  const matched = [];

  for (const [key, skill] of Object.entries(SKILL_REGISTRY)) {
    const score = skill.triggers.reduce((total, trigger) =>
      total + (msgLower.includes(trigger.toLowerCase()) ? 1 : 0), 0);
    if (score > 0) matched.push({ key, skill, score });
  }

  return matched.sort((a, b) => b.score - a.score).slice(0, 3);
};

const buildSystemPrompt = (skills) => {
  if (!skills.length) {
    return `You are LovellyLilly — a thoughtful AI companion built for depth and nuance.
    Answer precisely and helpfully.`;
  }

  const skillList = skills.map(s => `${s.skill.icon} ${s.skill.name}`).join('\n');
  const prompts = skills.map(s => s.skill.systemPrompt).join('\n\n---\n\n');

  return `You are LovellyLilly with these expert modes active:
${skillList}

${prompts}

Combine all expertise. Be precise, complete, and actionable.`;
};

const getHelpMessage = () => {
  return `# LovellyLilly Skills

💡 **Auto-detection ON** — just describe what you need, skills activate automatically!

**🏗️ PLANNING**
  \`/plan\`      → Feature implementation blueprint
  \`/architect\` → System design + diagrams

**💻 CODING**
  \`/tdd\`       → Test-driven development
  \`/frontend\`  → React/TypeScript expert
  \`/backend\`   → Node.js/Express expert
  \`/coding\`    → General code help

**🔍 REVIEW**
  \`/review\`    → Code review + bug finding
  \`/security\`  → Security audit (OWASP)

**🧪 TESTING**
  \`/e2e\`       → Playwright E2E tests

**🗄️ DATABASE**
  \`/db\`        → MongoDB/Mongoose optimization

**🌐 BROWSER**
  \`/browse\`    → Scrape any URL (PinchTab)

**▶️ CODE RUNNER**
  \`/run\`       → Execute code safely (secure-exec)

**📈 SEO**
  \`/seo\`       → Website SEO audit + exact fixes

**🎨 DESIGN**
  \`/design\`    → UI/UX + complete code

**✍️ CONTENT**
  \`/write\`     → Articles, blogs, emails
  \`/research\`  → Deep research + analysis
  \`/pitch\`     → Investor pitch materials

**🚀 DEVOPS**
  \`/deploy\`    → Docker, CI/CD, GitHub Actions

**🎤 VOICE**
  \`/voice\`     → Conversational spoken-word mode

**Examples:**
\`/design dark SaaS dashboard banao\`
\`/seo https://mysite.com\`
\`/run console.log("hello world")\`
Or just type normally — auto-detection karta hai! 🤖`;
};

module.exports = {
  SKILL_REGISTRY,
  detectSlashCommand,
  autoDetectSkills,
  buildSystemPrompt,
  getHelpMessage,
};
