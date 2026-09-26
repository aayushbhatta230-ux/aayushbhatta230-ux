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
console.log('[1/5] Core Assets Verification');
const coreFiles = ['index.html', 'style.css', 'script.js', 'site.webmanifest', 'sitemap.xml', 'robots.txt'];
coreFiles.forEach(file => {
  assert(fs.existsSync(path.join(ROOT_DIR, file)), `File exists: ${file}`);
});

// 2. Validate index.html contents
console.log('\n[2/5] HTML & Accessibility Validation');
const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

assert(htmlContent.includes('<title>Aayush Bhatta'), 'HTML has correct title');
assert(htmlContent.includes('class="skip-link"'), 'Screen reader skip-link present');
assert(htmlContent.includes('aria-label="Introduction and overview"'), 'Section ARIA labels present');
assert(!htmlContent.includes('transition-indicator-pill'), 'No AI transition badge pills in DOM');

// 3. Validate Schema.org JSON-LD
console.log('\n[3/5] Schema.org Knowledge Graph Validation');
const schemaMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(schemaMatch !== null, 'Found application/ld+json script tag');
if (schemaMatch) {
  try {
    const schema = JSON.parse(schemaMatch[1]);
    assert(schema['@type'] === 'Person', 'Schema @type is Person');
    assert(schema.name === 'Aayush Bhatta', 'Schema name is Aayush Bhatta');
    assert(Array.isArray(schema.knowsAbout) && schema.knowsAbout.length > 0, 'Schema defines knowsAbout competencies');
    assert(Array.isArray(schema.award) && schema.award.length > 0, 'Schema defines award list');
  } catch (err) {
    assert(false, `Schema JSON parsing failed: ${err.message}`);
  }
}

// 4. Validate referenced images exist
console.log('\n[4/5] Media & Image References Validation');
const imgMatches = [...htmlContent.matchAll(/src="(assets\/images\/[^"]+)"/g)];
assert(imgMatches.length > 0, `Found ${imgMatches.length} referenced local images`);
imgMatches.forEach(m => {
  const relPath = m[1];
  const fullPath = path.join(ROOT_DIR, relPath);
  assert(fs.existsSync(fullPath), `Image asset exists: ${relPath}`);
});

// 5. JavaScript syntax check
console.log('\n[5/5] JavaScript Engine Syntax Verification');
const { execSync } = require('child_process');
try {
  execSync('node -c script.js', { cwd: ROOT_DIR });
  assert(true, 'script.js compiles cleanly with zero syntax errors');
} catch (err) {
  assert(false, `script.js syntax check failed: ${err.message}`);
}

console.log('\n==============================================');
if (failures === 0) {
  console.log('✓ All integrity tests PASSED successfully!\n');
  process.exit(0);
} else {
  console.error(`✗ ${failures} test(s) failed.\n`);
  process.exit(1);
}
