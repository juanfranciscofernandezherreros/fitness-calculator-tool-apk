#!/usr/bin/env node
/**
 * test_pdf.js
 * -----------
 * Playwright test that verifies:
 *   1. The wizard calculation produces results in the DOM.
 *   2. The in-app PDF viewer opens automatically after calculation.
 *   3. The viewer contains the expected report sections.
 *   4. html2pdf is loaded and can be called to produce a Blob
 *      (confirms PDF generation works, without needing a file system).
 *   5. The "⬇ PDF" download button exists in the viewer header.
 *
 * Usage:
 *   node scripts/test_pdf.js
 */

'use strict';

const { chromium } = require('playwright');
const path  = require('path');

const ROOT       = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(ROOT, 'www', 'index.html');
const FILE_URL   = 'file://' + INDEX_HTML;

// Typical Android phone viewport
const VIEWPORT = { width: 390, height: 844 };

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log('  ✅  ' + label);
    passed++;
  } else {
    console.error('  ❌  FAIL: ' + label);
    failed++;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('\n🧪  PDF generation & viewer test\n');

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    // Intercept external CDN scripts so tests work offline
    // (we still need html2pdf; if the CDN is reachable the real script loads)
  });
  const page = await context.newPage();

  // Capture console errors to help debug failures
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(FILE_URL, { waitUntil: 'networkidle' });
  await sleep(600);

  // ── 1. Navigate wizard to step 5 and trigger calculation ──────────────────
  await page.evaluate(() => {
    window.wizardGoTo(1);
  });
  await sleep(350);

  // Select "hombre" (male)
  await page.evaluate(() => {
    var radio = document.querySelector('input[name="sexo"][value="hombre"]');
    if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await sleep(400); // auto-advance goes to step 2

  // Jump straight to step 5 (sliders already have default values)
  await page.evaluate(() => window.wizardGoTo(5));
  await sleep(400);

  // Click the calculate button
  await page.evaluate(() => window.wizardCalculate());

  // Wait up to 3 s for the results container to be populated
  await page.waitForFunction(
    () => document.getElementById('results-container') &&
          document.getElementById('results-container').innerHTML.length > 200,
    { timeout: 3000 }
  );

  // ── 2. Results container has content ──────────────────────────────────────
  const resultsHTML = await page.$eval('#results-container', el => el.innerHTML);
  assert(resultsHTML.length > 200, 'Results container has content after calculation');

  // ── 3. #contenido-informe exists inside results ────────────────────────────
  const contenidoExists = await page.$eval(
    '#contenido-informe',
    el => !!el && el.innerHTML.length > 100
  ).catch(() => false);
  assert(contenidoExists, '#contenido-informe is present and non-empty');

  // ── 4. PDF viewer opens automatically (within 1.5 s of calculation) ────────
  await sleep(1000); // let the 800 ms setTimeout fire
  const viewerVisible = await page.$eval(
    '#pdf-viewer-overlay',
    el => window.getComputedStyle(el).display !== 'none'
  ).catch(() => false);
  assert(viewerVisible, 'PDF viewer overlay is visible after calculation');

  // ── 5. Viewer body contains report content ────────────────────────────────
  const viewerBodyContent = await page.$eval(
    '#pdf-viewer-body',
    el => el.innerHTML.length
  ).catch(() => 0);
  assert(viewerBodyContent > 100, 'PDF viewer body contains report content');

  // ── 6. Viewer header download button exists ────────────────────────────────
  const downloadBtnExists = await page.$('#btn-viewer-download') !== null;
  assert(downloadBtnExists, '"⬇ PDF" download button is present in viewer header');

  // ── 7. html2pdf library is loaded ────────────────────────────────────────
  // Give external CDN scripts some extra time to load
  await sleep(1500);
  const html2pdfLoaded = await page.evaluate(() => typeof window.html2pdf === 'function');
  if (html2pdfLoaded) {
    assert(true, 'html2pdf library is loaded from CDN');
  } else {
    // CDN may be unreachable in offline/sandbox environments — warn but do not fail
    console.warn('  ⚠️   html2pdf not loaded (CDN unavailable) — skipping PDF blob tests');
  }

  // ── 8. PDF blob can be generated via html2pdf ─────────────────────────────
  if (html2pdfLoaded) {
    const blobOk = await page.evaluate(() => {
      return new Promise(function (resolve) {
        var el = document.getElementById('contenido-informe');
        if (!el) { resolve(false); return; }
        var opts = {
          margin: [10, 10, 10, 10],
          filename: 'test.pdf',
          image: { type: 'jpeg', quality: 0.8 },
          html2canvas: { scale: 1, useCORS: true, logging: false, backgroundColor: '#fff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opts).from(el).output('blob')
          .then(function (blob) {
            resolve(blob instanceof Blob && blob.size > 100);
          })
          .catch(function () { resolve(false); });
      });
    });
    assert(blobOk, 'html2pdf produces a non-empty PDF Blob from #contenido-informe');
  } else {
    console.log('  ⚠️   Skipped PDF blob test (html2pdf not loaded — CDN unavailable)');
  }

  // ── 9. Close viewer button works ──────────────────────────────────────────
  await page.evaluate(() => {
    var btn = document.querySelector('.btn-pdf-viewer-close');
    if (btn) btn.click();
  });
  await sleep(200);
  const viewerHidden = await page.$eval(
    '#pdf-viewer-overlay',
    el => el.style.display === 'none'
  ).catch(() => false);
  assert(viewerHidden, 'Viewer is hidden after clicking close button');

  await browser.close();

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log('  Passed: ' + passed + '  |  Failed: ' + failed);
  if (consoleErrors.length) {
    console.warn('\n  ⚠️  Browser console errors:\n    ' + consoleErrors.join('\n    '));
  }
  console.log('─────────────────────────────────────────\n');

  process.exit(failed > 0 ? 1 : 0);
})().catch(err => {
  console.error('\n💥 Test runner crashed:', err.message);
  process.exit(1);
});
