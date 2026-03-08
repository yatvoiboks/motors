#!/usr/bin/env node

/**
 * Validates products.json before build.
 * Ensures all required fields exist for each product.
 * Run: node scripts/validate-products.js
 * Exit code: 0 = valid, 1 = invalid
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_FIELDS = ['id', 'name', 'category', 'image', 'description', 'specs'];
const ALLOWED_CATEGORIES = ['motors', 'propellers', 'escs', 'vtol', 'fixed-wing', 'systems'];

let hasErrors = false;

function validate() {
  const dataPath = resolve(process.cwd(), 'src/data/products.json');
  let products;

  try {
    const raw = readFileSync(dataPath, 'utf-8');
    products = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to read products.json:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(products)) {
    console.error('❌ products.json must be an array');
    process.exit(1);
  }

  products.forEach((product, index) => {
    const prefix = `Product #${index + 1} (id: ${product.id || 'unknown'})`;

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in product)) {
        console.error(`❌ ${prefix}: Missing required field "${field}"`);
        hasErrors = true;
      }
    }

    // Validate specs is object with at least one entry
    if (product.specs !== undefined) {
      if (typeof product.specs !== 'object' || product.specs === null || Array.isArray(product.specs)) {
        console.error(`❌ ${prefix}: "specs" must be an object`);
        hasErrors = true;
      } else if (Object.keys(product.specs).length === 0) {
        console.error(`❌ ${prefix}: "specs" must have at least one key-value pair`);
        hasErrors = true;
      }
    }

    // Validate category
    if (product.category && !ALLOWED_CATEGORIES.includes(product.category)) {
      console.error(`❌ ${prefix}: Invalid category "${product.category}". Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
      hasErrors = true;
    }

    // Validate images array if present
    if (product.images !== undefined) {
      if (!Array.isArray(product.images)) {
        console.error(`❌ ${prefix}: "images" must be an array`);
        hasErrors = true;
      } else if (product.images.some((img) => typeof img !== 'string')) {
        console.error(`❌ ${prefix}: "images" array must contain only strings (paths)`);
        hasErrors = true;
      }
    }
  });

  if (hasErrors) {
    console.error(`\n❌ Validation failed. Fix the errors above and try again.`);
    process.exit(1);
  }

  console.log(`✓ products.json is valid (${products.length} products)`);
}

validate();
