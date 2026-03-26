/**
 * convert-photos.mjs
 *
 * Конвертирует фото продуктов (JPG/JPEG/PNG/HEIC/WEBP) в WebP
 * и раскладывает по структуре R2: photos/{sku}/{view}.webp
 *
 * Использование:
 *   node scripts/convert-photos.mjs <папка с фото>
 *
 * Пример структуры входящих файлов (любой из вариантов):
 *   input/tmotor-u8-lite/main.jpg
 *   input/tmotor-u8-lite/angle.jpeg
 *   input/tmotor-u8-lite/top.heic
 *
 * Или просто бросить все фото одного продукта в папку и указать --sku:
 *   node scripts/convert-photos.mjs ./input/tmotor-u8-lite --sku tmotor-u8-lite
 *
 * Результат: photos/tmotor-u8-lite/main.webp, angle.webp, ...
 * Потом загрузить папку photos/ в R2.
 *
 * Зависимости:
 *   npm install sharp   (один раз)
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff'];
const OUT_DIR   = './photos';

// WebP настройки: качество 85 — хороший баланс размер/качество для каталога
const WEBP_OPTIONS = { quality: 85, effort: 4 };

// Размер: 800×800 px, object-fit contain (добавляет padding до квадрата)
const TARGET_SIZE = 800;

async function convertFile(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'contain',
      background: { r: 17, g: 30, b: 54, alpha: 1 }, // var(--bg-card) #111E36
    })
    .webp(WEBP_OPTIONS)
    .toFile(outputPath);
}

async function processDir(dir, sku) {
  const files = await readdir(dir);
  const images = files.filter(f => SUPPORTED.includes(path.extname(f).toLowerCase()));

  if (images.length === 0) {
    console.log(`  No supported images found in ${dir}`);
    return;
  }

  const outDir = path.join(OUT_DIR, sku);
  await mkdir(outDir, { recursive: true });

  for (const file of images) {
    const ext    = path.extname(file);
    const base   = path.basename(file, ext);
    const input  = path.join(dir, file);
    const output = path.join(outDir, `${base}.webp`);

    process.stdout.write(`  ${file} → ${sku}/${base}.webp ... `);
    try {
      await convertFile(input, output);
      const stat = await import('fs').then(m => m.promises.stat(output));
      console.log(`✓  (${(stat.size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const skuFlag = args.indexOf('--sku');
const inputArg = args.find(a => !a.startsWith('--'));

if (!inputArg) {
  console.error(`
Usage:
  # Папка содержит подпапки с именами SKU:
  node scripts/convert-photos.mjs ./input

  # Одна папка для конкретного SKU:
  node scripts/convert-photos.mjs ./input/my-photos --sku tmotor-u8-lite
`);
  process.exit(1);
}

const explicitSku = skuFlag !== -1 ? args[skuFlag + 1] : null;

if (explicitSku) {
  // Режим: одна папка → один SKU
  console.log(`\nConverting "${inputArg}" → ${OUT_DIR}/${explicitSku}/\n`);
  await processDir(inputArg, explicitSku);
} else {
  // Режим: каждая подпапка = SKU
  const entries = await readdir(inputArg, { withFileTypes: true });
  const dirs    = entries.filter(e => e.isDirectory());

  if (dirs.length === 0) {
    // Плоская папка — используем имя папки как SKU
    const sku = path.basename(inputArg);
    console.log(`\nNo subdirectories found. Using folder name as SKU: "${sku}"\n`);
    await processDir(inputArg, sku);
  } else {
    console.log(`\nFound ${dirs.length} product folder(s):\n`);
    for (const d of dirs) {
      console.log(`→ ${d.name}`);
      await processDir(path.join(inputArg, d.name), d.name);
    }
  }
}

console.log(`\nDone. Upload the "${OUT_DIR}/" folder to your R2 bucket.\n`);
