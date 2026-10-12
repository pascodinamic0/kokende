import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outIcons = path.join(root, 'public', 'icons');
const outSplash = path.join(root, 'public', 'splash');
fs.mkdirSync(outIcons, { recursive: true });
fs.mkdirSync(outSplash, { recursive: true });

const brand = { r: 225, g: 29, b: 72 }; // #E11D48

async function markSvg(size) {
  const r = Math.round(size * 0.22);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#E11D48"/>
  <path d="M${size * 0.28} ${size * 0.62} L${size * 0.42} ${size * 0.32} L${size * 0.52} ${size * 0.48} L${size * 0.62} ${size * 0.28} L${size * 0.72} ${size * 0.55}"
    fill="none" stroke="#fff" stroke-width="${size * 0.07}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${size * 0.72}" cy="${size * 0.55}" r="${size * 0.06}" fill="#fff"/>
  <circle cx="${size * 0.28}" cy="${size * 0.62}" r="${size * 0.05}" fill="#fff"/>
</svg>`);
}

async function pngFromSvg(svg, size, file) {
  await sharp(svg).resize(size, size).png().toFile(file);
}

const svg48 = await markSvg(512);
await fs.promises.writeFile(path.join(outIcons, 'mark.svg'), await markSvg(48));
await fs.promises.writeFile(path.join(root, 'public', 'icon.svg'), await markSvg(128));

await pngFromSvg(svg48, 192, path.join(outIcons, 'icon-192.png'));
await pngFromSvg(svg48, 512, path.join(outIcons, 'icon-512.png'));
await pngFromSvg(svg48, 180, path.join(root, 'public', 'apple-touch-icon.png'));
await pngFromSvg(svg48, 32, path.join(outIcons, 'favicon-32.png'));

async function maskable(size, file) {
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  const innerSvg = await markSvg(inner);
  const innerPng = await sharp(innerSvg).resize(inner, inner).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: brand },
  })
    .composite([{ input: innerPng, left: pad, top: pad }])
    .png()
    .toFile(file);
}

await maskable(192, path.join(outIcons, 'maskable-192.png'));
await maskable(512, path.join(outIcons, 'maskable-512.png'));

const splashSizes = [
  [750, 1334],
  [1170, 2532],
  [1179, 2556],
  [1290, 2796],
  [1080, 2340],
];

for (const [w, h] of splashSizes) {
  const markSize = Math.round(Math.min(w, h) * 0.22);
  const mark = await sharp(await markSvg(markSize)).resize(markSize, markSize).png().toBuffer();
  await sharp({
    create: { width: w, height: h, channels: 3, background: brand },
  })
    .composite([
      {
        input: mark,
        left: Math.round((w - markSize) / 2),
        top: Math.round((h - markSize) / 2 - h * 0.04),
      },
    ])
    .png()
    .toFile(path.join(outSplash, `splash-${w}x${h}.png`));
}

console.log('icons + splash generated');
