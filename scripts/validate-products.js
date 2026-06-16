#!/usr/bin/env node

/**
 * Validates the bilingual products.json before build.
 * Each localizable field is an object { en, uk }.
 * Run: node scripts/validate-products.js
 * Exit code: 0 = valid, 1 = invalid
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_FIELDS = ['id', 'name', 'category', 'image', 'description', 'specs'];
const LANGS = ['en', 'uk'];
let hasErrors = false;

function loadJSON(path) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf-8'));
}

function isLangObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) && LANGS.every((l) => l in v);
}

function validate() {
  let products, categories;
  try {
    products = loadJSON('src/data/products.json');
    categories = loadJSON('src/data/categories.json');
  } catch (err) {
    console.error('❌ Failed to read data files:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(products)) {
    console.error('❌ products.json must be an array');
    process.exit(1);
  }

  const allowedCategories = categories.map((c) => c.id).filter((id) => id !== 'all');

  products.forEach((product, index) => {
    const prefix = `Product #${index + 1} (id: ${product.id || 'unknown'})`;

    for (const field of REQUIRED_FIELDS) {
      if (!(field in product)) {
        console.error(`❌ ${prefix}: Missing required field "${field}"`);
        hasErrors = true;
      }
    }

    // Bilingual fields must carry both languages
    for (const field of ['name', 'description', 'specs']) {
      if (product[field] !== undefined && !isLangObject(product[field])) {
        console.error(`❌ ${prefix}: "${field}" must be an object with keys ${LANGS.join(', ')}`);
        hasErrors = true;
      }
    }

    // specs.<lang> must be a non-empty object
    if (isLangObject(product.specs)) {
      for (const l of LANGS) {
        const s = product.specs[l];
        if (typeof s !== 'object' || s === null || Array.isArray(s) || Object.keys(s).length === 0) {
          console.error(`❌ ${prefix}: "specs.${l}" must have at least one key-value pair`);
          hasErrors = true;
        }
      }
    }

    if (product.category && !allowedCategories.includes(product.category)) {
      console.error(`❌ ${prefix}: Invalid category "${product.category}". Allowed: ${allowedCategories.join(', ')}`);
      hasErrors = true;
    }

    if (product.images !== undefined) {
      if (!Array.isArray(product.images) || product.images.some((img) => typeof img !== 'string')) {
        console.error(`❌ ${prefix}: "images" must be an array of strings`);
        hasErrors = true;
      }
    }
  });

  if (hasErrors) {
    console.error(`\n❌ Validation failed. Fix the errors above and try again.`);
    process.exit(1);
  }

  console.log(`✓ products.json is valid (${products.length} products, ${allowedCategories.length} categories)`);
}

validate();
