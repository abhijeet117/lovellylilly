const { chromium } = require('playwright');

const BASE = 'http://localhost:5173';
const API = 'http://localhost:5000/api';

const results = [];
let passed = 0;
let failed = 0;

function log(test, status, detail = '') {
  const icon = status === 'PASS' ? '✓' : '✗';
  if (status === 'PASS') passed++;
  else failed++;
  const msg = `${icon} ${test}${detail ? ' — ' + detail : ''}`;
  results.push(msg);
  console.log(msg);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // ═══════════════════════════════════════
  // 1. HEALTH CHECK
  // ═══════════════════════════════════════
  try {
    const res = await page.request.get(`${API}/health`);
    const body = await res.json();
    if (body.status === 'online' && body.service === 'LovellyLilly AI') {
      log('API Health', 'PASS');
    } else {
      log('API Health', 'FAIL', JSON.stringify(body));
    }
  } catch (e) {
    log('API Health', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 2. LANDING PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const title = await page.title();
    if (title.includes('LovellyLilly')) {
      log('Landing Page Load', 'PASS');
    } else {
      log('Landing Page Load', 'FAIL', `title: ${title}`);
    }
  } catch (e) {
    log('Landing Page Load', 'FAIL', e.message);
  }

  // 2a. Navbar exists
  try {
    const nav = await page.locator('#nav').isVisible();
    log('Navbar Visible', nav ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Navbar Visible', 'FAIL', e.message);
  }

  // 2b. Theme switcher
  try {
    const swatches = await page.locator('.sw').count();
    log('Theme Swatches (4)', swatches === 4 ? 'PASS' : 'FAIL', `found ${swatches}`);
  } catch (e) {
    log('Theme Swatches', 'FAIL', e.message);
  }

  // 2c. Click theme switcher (ocean)
  try {
    await page.locator('.sw[data-t="ocean"]').click();
    await page.waitForTimeout(500);
    const theme = await page.locator('html').getAttribute('data-theme');
    log('Theme Switch (ocean)', theme === 'ocean' ? 'PASS' : 'FAIL', `theme=${theme}`);
    // switch back
    await page.locator('.sw[data-t="dark"]').click();
    await page.waitForTimeout(300);
  } catch (e) {
    log('Theme Switch', 'FAIL', e.message);
  }

  // 2d. Custom cursor elements
  try {
    const dot = await page.locator('#cur-dot').count() > 0 ? true : false;
    const ring = await page.locator('#cur-ring').count() > 0 ? true : false;
    const halo = await page.locator('#cur-halo').count() > 0 ? true : false;
    log('Custom Cursor Elements', dot && ring && halo ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Custom Cursor Elements', 'FAIL', e.message);
  }

  // 2e. Hero section
  try {
    const hero = await page.locator('#hero').isVisible();
    log('Hero Section', hero ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Hero Section', 'FAIL', e.message);
  }

  // 2f. Scroll progress bar
  try {
    const sp = await page.locator('#scroll-progress').count() > 0 ? true : false;
    log('Scroll Progress Bar', sp ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Scroll Progress Bar', 'FAIL', e.message);
  }

  // 2g. Feature cards
  try {
    const cards = await page.locator('[data-feature-card]').count();
    log('Feature Cards (6)', cards === 6 ? 'PASS' : 'FAIL', `found ${cards}`);
  } catch (e) {
    log('Feature Cards', 'FAIL', e.message);
  }

  // 2h. Pricing cards
  try {
    const pricing = await page.locator('[data-pricing-card]').count();
    log('Pricing Cards (3)', pricing === 3 ? 'PASS' : 'FAIL', `found ${pricing}`);
  } catch (e) {
    log('Pricing Cards', 'FAIL', e.message);
  }

  // 2i. Ticker
  try {
    const ticker = await page.locator('[data-ticker]').isVisible();
    log('Ticker', ticker ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Ticker', 'FAIL', e.message);
  }

  // 2j. CTA section
  try {
    const cta = await page.locator('#cta').count() > 0 ? true : false;
    log('CTA Section', cta ? 'PASS' : 'FAIL');
  } catch (e) {
    log('CTA Section', 'FAIL', e.message);
  }

  // 2k. Nav links
  try {
    const links = await page.locator('.nav-links a').count();
    log('Nav Links (5)', links === 5 ? 'PASS' : 'FAIL', `found ${links}`);
  } catch (e) {
    log('Nav Links', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 3. NAVIGATION — Login page
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const heading = await page.locator('.auth-form-h').textContent();
    log('Login Page Loads', heading.includes('Sign In') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Login Page', 'FAIL', e.message);
  }

  // 3a. Login form elements
  try {
    const emailInput = await page.locator('input[type="email"]').isVisible();
    const passInput = await page.locator('input[type="password"]').isVisible();
    const submitBtn = await page.locator('.f-submit').isVisible();
    log('Login Form Elements', emailInput && passInput && submitBtn ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Login Form Elements', 'FAIL', e.message);
  }

  // 3b. OAuth buttons
  try {
    const oauth = await page.locator('.oauth-btn').count();
    log('OAuth Buttons (2)', oauth === 2 ? 'PASS' : 'FAIL', `found ${oauth}`);
  } catch (e) {
    log('OAuth Buttons', 'FAIL', e.message);
  }

  // 3c. Forgot password link
  try {
    const forgot = await page.locator('a[href="/forgot-password"]').isVisible();
    log('Forgot Password Link', forgot ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Forgot Password Link', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 4. SIGNUP PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/signup`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const heading = await page.locator('.auth-form-h').textContent();
    log('Signup Page Loads', heading.includes('Create Account') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Signup Page', 'FAIL', e.message);
  }

  // 4a. Signup form elements
  try {
    const firstName = await page.locator('input[placeholder="Amara"]').isVisible();
    const email = await page.locator('input[type="email"]').isVisible();
    const password = await page.locator('input[placeholder="Min. 8 characters"]').isVisible();
    log('Signup Form Fields', firstName && email && password ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Signup Form Fields', 'FAIL', e.message);
  }

  // 4b. Password strength meter
  try {
    await page.locator('input[placeholder="Min. 8 characters"]').fill('Test123!@');
    await page.waitForTimeout(300);
    const strBar = await page.locator('.str-fill').isVisible();
    log('Password Strength Meter', strBar ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Password Strength Meter', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 5. FORGOT PASSWORD PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/forgot-password`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const heading = await page.locator('.auth-form-h').textContent();
    log('Forgot Password Page', heading.includes('Forgot Password') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Forgot Password Page', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 6. VERIFY EMAIL PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/verify-email`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const heading = await page.locator('.auth-form-h').textContent();
    log('Verify Email Page', heading.includes('Check Your Inbox') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Verify Email Page', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 7. AUTH FLOW — Register & Login
  // ═══════════════════════════════════════
  const testEmail = `test_${Date.now()}@lovelylilly.test`;
  const testPass = 'TestPassword123!';

  // 7a. Register
  try {
    const res = await page.request.post(`${API}/auth/register`, {
      data: { name: 'Test User', email: testEmail, password: testPass }
    });
    const body = await res.json();
    if (res.status() === 201 && body.status === 'success') {
      log('Register API', 'PASS');
    } else {
      log('Register API', 'FAIL', `${res.status()} ${JSON.stringify(body)}`);
    }
  } catch (e) {
    log('Register API', 'FAIL', e.message);
  }

  // 7b. Login
  try {
    const res = await page.request.post(`${API}/auth/login`, {
      data: { email: testEmail, password: testPass }
    });
    const body = await res.json();
    if (res.status() === 200 && body.data?.user) {
      log('Login API', 'PASS');
    } else {
      log('Login API', 'FAIL', `${res.status()} ${JSON.stringify(body)}`);
    }
  } catch (e) {
    log('Login API', 'FAIL', e.message);
  }

  // 7c. Get Me (authenticated)
  try {
    const res = await page.request.get(`${API}/auth/get-me`);
    const body = await res.json();
    if (body.data?.user?.email === testEmail) {
      log('Get Me API', 'PASS');
    } else {
      log('Get Me API', 'FAIL', `${res.status()} ${JSON.stringify(body).substring(0, 100)}`);
    }
  } catch (e) {
    log('Get Me API', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 8. AUTHENTICATED PAGES
  // ═══════════════════════════════════════

  // 8a. Dashboard
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    const container = await page.locator('.dashboard-container').isVisible();
    log('Dashboard Page', container ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Dashboard Page', 'FAIL', e.message);
  }

  // 8b. Chat Input
  try {
    const chatInput = await page.locator('textarea[placeholder="Ask anything..."]').isVisible();
    log('Chat Input Visible', chatInput ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Chat Input', 'FAIL', e.message);
  }

  // 8c. Web search toggle
  try {
    const globe = await page.locator('button').filter({ has: page.locator('svg') }).nth(1);
    const isVisible = await globe.isVisible();
    log('Web Search Toggle', isVisible ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Web Search Toggle', 'FAIL', e.message);
  }

  // 8d. Suggestion buttons
  try {
    const suggestions = await page.locator('.dashboard-suggestion-btn').count();
    log('Suggestion Buttons (4)', suggestions === 4 ? 'PASS' : 'FAIL', `found ${suggestions}`);
  } catch (e) {
    log('Suggestion Buttons', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 9. CHAT API ENDPOINTS
  // ═══════════════════════════════════════
  try {
    const res = await page.request.get(`${API}/chats`);
    const body = await res.json();
    log('Get Chats API', res.status() === 200 ? 'PASS' : 'FAIL', `status=${res.status()}`);
  } catch (e) {
    log('Get Chats API', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 10. USER PROFILE API
  // ═══════════════════════════════════════
  try {
    const res = await page.request.get(`${API}/user/profile`);
    const body = await res.json();
    log('Get Profile API', res.status() === 200 && body.data?.user ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Get Profile API', 'FAIL', e.message);
  }

  // 10b. Update profile
  try {
    const res = await page.request.patch(`${API}/user/profile`, {
      data: { name: 'Updated Test User' }
    });
    const body = await res.json();
    log('Update Profile API', body.data?.user?.name === 'Updated Test User' ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Update Profile API', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 11. SETTINGS PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Settings Page Loads', heading.includes('Settings') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Settings Page', 'FAIL', e.message);
  }

  // 11a. Settings tabs
  try {
    const tabs = await page.locator('button').filter({ hasText: /Profile|Security|Billing|API Keys|Notifications/ }).count();
    log('Settings Tabs (5)', tabs === 5 ? 'PASS' : 'FAIL', `found ${tabs}`);
  } catch (e) {
    log('Settings Tabs', 'FAIL', e.message);
  }

  // 11b. Sign Out button
  try {
    const signOut = await page.locator('button').filter({ hasText: 'Sign Out' }).isVisible();
    log('Sign Out Button', signOut ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Sign Out Button', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 12. STUDIO PAGES
  // ═══════════════════════════════════════

  // 12a. Image Studio
  try {
    await page.goto(`${BASE}/studio/image`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Image Studio Page', heading.includes('Image Studio') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Image Studio Page', 'FAIL', e.message);
  }

  // 12b. Video Studio
  try {
    await page.goto(`${BASE}/studio/video`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Video Studio Page', heading.includes('Video Studio') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Video Studio Page', 'FAIL', e.message);
  }

  // 12c. Website Builder
  try {
    await page.goto(`${BASE}/studio/website`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Website Builder Page', heading.includes('Website Builder') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Website Builder Page', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 13. DOCUMENTS PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/documents`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Documents Page', heading.includes('Document') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Documents Page', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 14. ADMIN PAGE
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const heading = await page.locator('h1').first().textContent();
    log('Admin Page Loads', heading.includes('Admin') ? 'PASS' : 'FAIL', heading);
  } catch (e) {
    log('Admin Page', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 15. SIDEBAR NAVIGATION
  // ═══════════════════════════════════════
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);
    const sidebarItems = await page.locator('aside div[style]').filter({ hasText: /New Chat|Image|Video|Website|Documents|Settings/ }).count();
    log('Sidebar Nav Items', sidebarItems >= 5 ? 'PASS' : 'FAIL', `found ${sidebarItems}`);
  } catch (e) {
    log('Sidebar Nav', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 16. AUTH — Logout
  // ═══════════════════════════════════════
  try {
    const res = await page.request.post(`${API}/auth/logout`);
    const body = await res.json();
    log('Logout API', body.status === 'success' ? 'PASS' : 'FAIL');
  } catch (e) {
    log('Logout API', 'FAIL', e.message);
  }

  // 16b. After logout, dashboard should redirect to login
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1500);
    const url = page.url();
    log('Protected Route Redirect', url.includes('/login') ? 'PASS' : 'FAIL', url);
  } catch (e) {
    log('Protected Route Redirect', 'FAIL', e.message);
  }

  // ═══════════════════════════════════════
  // 17. CONSOLE ERRORS CHECK
  // ═══════════════════════════════════════
  const criticalErrors = errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('404') &&
    !e.includes('net::') &&
    !e.includes('WebSocket') &&
    !e.includes('401') &&
    !e.includes('Unauthorized') &&
    !e.includes('Failed to load resource')
  );
  log('Console Errors', criticalErrors.length === 0 ? 'PASS' : 'FAIL',
    criticalErrors.length > 0 ? `${criticalErrors.length} errors: ${criticalErrors.slice(0,3).join('; ')}` : 'clean');

  // ═══════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════
  await browser.close();

  console.log('\n' + '═'.repeat(50));
  console.log('PLAYWRIGHT TEST RESULTS');
  console.log('═'.repeat(50));
  results.forEach(r => console.log(r));
  console.log('═'.repeat(50));
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('═'.repeat(50));

  process.exit(failed > 0 ? 1 : 0);
})();
