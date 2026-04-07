#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimizes images to WebP and compressed JPEG formats
 * Usage: npm run optimize-images
 */

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/assets/images');
const destDir = path.join(__dirname, '../public/images');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

(async () => {
  try {
    console.log('🖼️  Starting image optimization...');

    // Check if source directory exists
    if (!fs.existsSync(srcDir)) {
      console.log(`⚠️  Source directory not found: ${srcDir}`);
      console.log('📁 Creating source directory...');
      fs.mkdirSync(srcDir, { recursive: true });
      console.log('✅ Source directory created. Add images to optimize.');
      process.exit(0);
    }

    // Get list of images
    const files = fs.readdirSync(srcDir);
    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

    if (imageFiles.length === 0) {
      console.log('⚠️  No images found to optimize');
      process.exit(0);
    }

    console.log(`📊 Found ${imageFiles.length} images to optimize`);

    // Optimize to WebP
    console.log('🔄 Converting to WebP...');
    await imagemin([`${srcDir}/*.{jpg,jpeg,png}`], {
      destination: destDir,
      plugins: [imageminWebp({ quality: 75 })],
    });
    console.log('✅ WebP conversion complete');

    // Optimize JPG
    console.log('🔄 Optimizing JPEG...');
    await imagemin([`${srcDir}/*.jpg`, `${srcDir}/*.jpeg`], {
      destination: destDir,
      plugins: [imageminMozjpeg({ quality: 80 })],
    });
    console.log('✅ JPEG optimization complete');

    // Copy original PNGs (already optimized by imagemin)
    console.log('🔄 Optimizing PNG...');
    await imagemin([`${srcDir}/*.png`], {
      destination: destDir,
      plugins: [],
    });
    console.log('✅ PNG optimization complete');

    console.log('');
    console.log('✅ Image optimization completed successfully!');
    console.log(`📁 Optimized images saved to: ${destDir}`);
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Update HTML/CSS to use WebP with fallback:');
    console.log('   <picture>');
    console.log('     <source srcset="image.webp" type="image/webp" />');
    console.log('     <img src="image.jpg" alt="description" loading="lazy" />');
    console.log('   </picture>');
    console.log('');
  } catch (error) {
    console.error('❌ Error optimizing images:', error.message);
    process.exit(1);
  }
})();
