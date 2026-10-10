/**
 * Integrity & Architecture Test Suite for Aayush Bhatta's Portfolio
 * Run via: node test/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let failures = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failures++;
  }
}

console.log('=== Running Portfolio Integrity Test Suite ===\n');

// 1. Check core files exist
console.log('[1/4] Core Assets Verification');
const coreFiles = ['index.html', 'site.webmanifest', 'apple-touch-icon.png', 'favicon.png', 'sitemap.xml', 'robots.txt'];
coreFiles.forEach(file => {
  assert(fs.existsSync(path.join(ROOT_DIR, file)), `File exists: ${file}`);
});

// 2. Validate index.html contents
console.log('\n[2/4] HTML & Accessibility Validation');
const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

assert(htmlContent.includes('<title>Aayush Bhatta'), 'HTML has correct title');
assert(htmlContent.includes('rel="apple-touch-icon"'), 'Apple Touch Icon link present');
assert(htmlContent.includes('rel="manifest"'), 'Web app manifest link present');

// 3. Validate Schema.org JSON-LD
console.log('\n[3/4] Schema.org Knowledge Graph Validation');
const schemaMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(schemaMatch !== null, 'Found application/ld+json script tag');
if (schemaMatch) {
  try {
    const schema = JSON.parse(schemaMatch[1]);
    assert(schema['@type'] === 'Person', 'Schema @type is Person');
    assert(schema.name === 'Aayush Bhatta', 'Schema name is Aayush Bhatta');
  } catch (err) {
    assert(false, `Schema JSON parsing failed: ${err.message}`);
  }
}

// 4. Validate Web App Manifest and Icon Assets
console.log('\n[4/4] Web App Manifest and Icon Assets');
const manifestContent = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'site.webmanifest'), 'utf8'));
assert(manifestContent.name && manifestContent.short_name, 'Manifest contains valid app name & short_name');
assert(Array.isArray(manifestContent.icons) && manifestContent.icons.length >= 2, 'Manifest defines icon array');
manifestContent.icons.forEach(icon => {
  const iconPath = path.join(ROOT_DIR, icon.src);
  assert(fs.existsSync(iconPath), `Manifest icon exists: ${icon.src} (${icon.sizes})`);
});

console.log('\n==============================================');
if (failures === 0) {
  console.log('✓ All integrity tests PASSED successfully!\n');
  process.exit(0);
} else {
  console.error(`✗ ${failures} test(s) failed.\n`);
  process.exit(1);
}
