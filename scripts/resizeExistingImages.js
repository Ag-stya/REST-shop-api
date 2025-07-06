// scripts/resizeExistingImages.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../uploads');
const files = fs.readdirSync(inputDir);

files.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);

  // Only process images
  if (!file.match(/\.(jpg|jpeg|png)$/i)) return;

  const resizedName = `resized_${file}`;
  const outputPath = path.join(inputDir, resizedName);

  try {
    await sharp(inputPath)
      .resize(600)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    console.log(`✅ Resized: ${file} → ${resizedName}`);

    // Optional: delete old file after resizing
    // fs.unlinkSync(inputPath);
  } catch (err) {
    console.error(`❌ Failed to resize ${file}:`, err.message);
  }
});
