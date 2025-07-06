require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product'); // update path as needed

mongoose.connect(process.env.MONGO_URI);

const updateImagePaths = async () => {
  try {
    const products = await Product.find();

    for (const product of products) {
      if (product.productImage && !product.productImage.startsWith('resized_')) {
        const updatedPath = 'resized_' + product.productImage;
        await Product.updateOne({ _id: product._id }, { productImage: updatedPath });
        console.log(`Updated product ${product.name}`);
      }
    }

    console.log(' All image paths updated!');
    mongoose.disconnect();
  } catch (err) {
    console.error(' Error updating images:', err.message);
    mongoose.disconnect();
  }
};

updateImagePaths();