/**
 * Checks that every page on this GitHub Pages site redirects to aayushifty.is-a.dev.
 * Run via: node test/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOME = 'https://aayushifty.is-a.dev/';
const REDIRECTS = {
  'index.html': HOME,
  '404.html': HOME,
  'aayush-bhatta/index.html': HOME + 'aayush-bhatta/',
  'aayush-bhatta.html': HOME + 'aayush-bhatta/',
  'who-is-aayush-bhatta/index.html': HOME + 'aayush-bhatta/',
  'who-is-aayush-bhatta.html': HOME + 'aayush-bhatta/',
};
let failures = 0;

for (const [file, target] of Object.entries(REDIRECTS)) {
  const html = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
  const ok = html.includes(`rel="canonical" href="${target}"`) && html.includes(`url=${target}"`);
  console.log(`  ${ok ? '✓' : '✗ FAIL:'} ${file} -> ${target}`);
  if (!ok) failures++;
}

process.exit(failures ? 1 : 0);
