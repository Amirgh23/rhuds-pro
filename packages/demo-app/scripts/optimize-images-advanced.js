#!/usr/bin/env node

/**
 * Advanced Image Optimization Script
 * Converts images to WebP and AVIF formats with responsive sizing
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/images-optimized');

// Image sizes for responsive images
const SIZES = [320, 640, 1024, 1280, 1920];

// Supported image extensions
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Get all images from source directory
 */
function getImages() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`Source directory not found: ${SOURCE_DIR}`);
    return [];
  }

  return fs.readdirSync(SOURCE_DIR).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
  });
}

/**
 * Optimize single image to multiple formats and sizes
 */
async function optimizeImage(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const basename = path.parse(filename).name;

  console.log(`\n📸 Optimizing: ${filename}`);

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}px`);

    // Generate responsive sizes
    for (const size of SIZES) {
      if (size > metadata.width) continue;

      // WebP format
      await sharp(inputPath)
        .resize(size, Math.round((size / metadata.width) * metadata.height), {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(path.join(OUTPUT_DIR, `${basename}-${size}w.webp`));

      // AVIF format
      await sharp(inputPath)
        .resize(size, Math.round((size / metadata.width) * metadata.height), {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .avif({ quality: 75 })
        .toFile(path.join(OUTPUT_DIR, `${basename}-${size}w.avif`));

      console.log(`   ✓ Generated ${size}w versions (WebP, AVIF)`);
    }

    // Generate original size versions
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(path.join(OUTPUT_DIR, `${basename}.webp`));

    await sharp(inputPath)
      .avif({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, `${basename}.avif`));

    console.log(`   ✓ Generated original size versions`);
  } catch (error) {
    console.error(`   ✗ Error optimizing ${filename}:`, error.message);
  }
}

/**
 * Main optimization process
 */
async function main() {
  console.log('🚀 Starting Advanced Image Optimization...\n');

  ensureOutputDir();
  const images = getImages();

  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${images.length} image(s) to optimize\n`);

  for (const image of images) {
    await optimizeImage(image);
  }

  console.log('\n✅ Image optimization complete!');
  console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
