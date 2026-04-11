import sharp from 'sharp';
import { copyFileSync } from 'fs';

const input = 'public/images/amd-logo.png';

await sharp(input).resize(32, 32).toFile('public/favicon-32x32.png');
await sharp(input).resize(16, 16).toFile('public/favicon-16x16.png');
await sharp(input).resize(180, 180).toFile('public/apple-touch-icon.png');
await sharp(input).resize(192, 192).toFile('public/android-chrome-192x192.png');
await sharp(input).resize(512, 512).toFile('public/android-chrome-512x512.png');

copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');

console.log('✅ Favicons generated successfully!');
