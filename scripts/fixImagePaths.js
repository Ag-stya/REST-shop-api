// scripts/fixImagePaths.js
const mongoose = require('mongoose');
const Product = require('../models/product'); // adjust path if needed
require('dotenv').config();

const fixPaths = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = await Product.find();
    for (const product of products) {
      if (
        product.productImage &&
        product.productImage.includes('resized_uploads/')
      ) {
        const filename = product.productImage.split('/').pop();
        product.productImage = `uploads/resized_${filename}`;
        await product.save();
        console.log(`✅ Updated: ${product.name}`);
      }
    }

    console.log('🎉 All image paths fixed.');
    process.exit();
  } catch (err) {
    console.error('❌ Error fixing paths:', err);
    process.exit(1);
  }
};

fixPaths();
