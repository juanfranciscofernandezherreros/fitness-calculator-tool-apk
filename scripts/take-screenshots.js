#!/usr/bin/env node
/**
 * take-screenshots.js
 * -------------------
 * Generates fresh screenshots of every screen in www/index.html and saves
 * them to the screenshot/ folder, replacing any existing images.
 *
 * Usage:
 *   node scripts/take-screenshots.js
 *
 * Requirements:
 *   npm install playwright           (or: npx playwright ...)
 *   A Chromium/Chrome binary must be reachable. The script tries, in order:
 *     1. The CHROME_PATH environment variable
 *     2. /usr/bin/google-chrome
 *     3. /usr/bin/chromium
 *     4. /usr/bin/chromium-browser
 *     5. Let Playwright find its own bundled browser
 */

'use strict';

const { chromium } = require('playwright');
const path  = require('path');
const fs    = require('fs');

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT          = path.resolve(__dirname, '..');
const INDEX_HTML    = path.join(ROOT, 'www', 'index.html');
const SCREENSHOT_DIR = path.join(ROOT, 'screenshot');

// ── Viewport: typical Android phone (390 × 844) ────────────────────────────
const VIEWPORT = { width: 390, height: 844 };

// ── Executable search list ─────────────────────────────────────────────────
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return undefined; // let Playwright use its bundled browser
}

// ── Helper: wait a bit ────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  // 1. Clean existing screenshots
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  const existing = fs.readdirSync(SCREENSHOT_DIR)
    .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
  for (const f of existing) {
    fs.unlinkSync(path.join(SCREENSHOT_DIR, f));
    console.log(`  deleted  ${f}`);
  }

  // 2. Launch browser
  const executablePath = findChrome();
  console.log(`\nLaunching Chrome: ${executablePath || '(playwright bundled)'}`);
  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const context = await browser.newContext({ viewport: VIEWPORT });
  const page    = await context.newPage();

  const fileUrl = 'file://' + INDEX_HTML;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await sleep(600);

  async function shot(name, opts = {}) {
    const file = path.join(SCREENSHOT_DIR, name);
    await page.screenshot({ path: file, fullPage: opts.fullPage || false });
    console.log(`  saved    ${name}`);
  }

  // ── Step 0: Welcome / Home ──────────────────────────────────────────────
  await shot('01-inicio.png');

  // ── Step 1: Sex selection ───────────────────────────────────────────────
  await page.evaluate(() => window.wizardGoTo(1));
  await sleep(350);
  await shot('02-paso1-sexo.png');

  // ── Step 2: Weight + Height ─────────────────────────────────────────────
  await page.evaluate(() => window.wizardGoTo(2));
  await sleep(350);
  await shot('03-paso2-peso-altura.png');

  // ── Step 3: Neck + Waist measurements ──────────────────────────────────
  await page.evaluate(() => window.wizardGoTo(3));
  await sleep(350);
  await shot('04-paso3-medidas.png');

  // ── Step 4: Calories / activity level ──────────────────────────────────
  await page.evaluate(() => window.wizardGoTo(4));
  await sleep(350);
  await shot('05-paso4-calorias.png');

  // ── Step 5: Optional extras ─────────────────────────────────────────────
  await page.evaluate(() => window.wizardGoTo(5));
  await sleep(350);
  await shot('06-paso5-medidas-opcionales.png');

  // ── Results: trigger calculation with default slider values ────────────
  await page.evaluate(() => window.wizardCalculate());
  await sleep(1500); // allow charts to render
  await shot('07-resultados-top.png');
  await shot('07-resultados-full.png', { fullPage: true });

  // ── FAQ: back to home, open first accordion item ───────────────────────
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await sleep(400);
  await page.evaluate(() => {
    const btn = document.querySelector('.faq-question');
    if (btn) btn.click();
  });
  await sleep(400);
  await shot('faq-screenshot.png');

  await browser.close();
  console.log('\nAll screenshots saved to:', SCREENSHOT_DIR);
})().catch(err => {
  console.error('\nFailed:', err.message);
  process.exit(1);
});
