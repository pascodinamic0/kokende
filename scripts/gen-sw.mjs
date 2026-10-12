import fs from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
let sha = process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || '';
if (!sha) {
  try {
    sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
  } catch {}
}
const version = `${(sha || 'dev').slice(0, 8)}-${Date.now().toString(36)}`;

function list(dir) {
  const p = root + 'public/' + dir;
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).map((f) => `/${dir}/${f}`);
}

const precache = [
  '/',
  '/demo',
  '/manifest.webmanifest',
  '/icon.svg',
  '/apple-touch-icon.png',
  ...list('icons'),
  ...list('splash'),
];

const tpl = fs.readFileSync(root + 'scripts/sw-template.js', 'utf8');
fs.writeFileSync(
  root + 'public/sw.js',
  tpl.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache)),
);
console.log('sw.js generated', version, precache.length, 'precached');
