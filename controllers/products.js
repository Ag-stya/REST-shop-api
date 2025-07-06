const Product = require('../models/product');
const mongoose = require('mongoose');
const redisClient = require('../redis/cacheClient'); 
const { response } = require('../app');

const CACHE_KEY = 'products:all';
const CACHE_TTL = 60; // 1 minute

// GET all products with Redis cache
exports.products_get_all = async (req, res, next) => {
  try {
    const cached = await redisClient.get(CACHE_KEY);

    if (cached) {
      console.log('Serving from Redis cache');
      return res.status(200).json(JSON.parse(cached));
    }

    const products = await Product.find().select('_id name price productImage');

    const response = {
      count: products.length,
      products: products.map(prod => ({
        ...prod.toObject(),
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${prod._id}`,
        },
      })),
    };

    await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(response));
    console.log('Saved to Redis');

    res.status(200).json(response);
  } catch (err) {
    console.error('Cache Error:', err);
    res.status(500).json({ error: err.message });
  }
};

//Create product and invalidate cache
exports.products_create_product = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file?.path,
    });

    const result = await product.save();
    await redisClient.del(CACHE_KEY); // invalidate cache

    res.status(201).json({
      message: 'Product created',
      createdProduct: {
        ...result.toObject(),
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID (no caching yet)
exports.products_get_product = async (req, res, next) => {
    const productId = req.params.productId;
    const cacheKey=`product:${productId}`;
    const TTL=120;
    try {
        const cachedProduct=await redisClient.get(cacheKey);
        if (cachedProduct) {
            console.log(`Serving from Redis cache  for product-${productId}`)
            return res.status(200).json(JSON.parse(cachedProduct));
        }
        else{
            console.log(`Fetching product-${productId} from MongoDB`);
            const id = req.params.productId;
            const product = await Product.findById(id).select('name price _id productImage');
            if (product) {
                res.status(200).json({
                    product,
                    request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products',
                    },
                });
                await redisClient.setEx(cacheKey,TTL,JSON.stringify(response)); // Cache the product
                console.log(`Product-${productId} cached for ${TTL} seconds`);
                res.status(200).json(response);
            } 
            else {

                res.status(404).json({ message: 'No valid entry found' });
            }
        }
        
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
  }
};

// Update product and invalidate cache
exports.products_update_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    await Product.updateOne({ _id: id }, { $set: updateOps });
    await redisClient.del(CACHE_KEY); //invalidate cache
    await redisClient.del(`product:${id}`);        //invalidate specific product cache

    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${id}`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete product and invalidate cache
exports.products_delete_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    await Product.deleteOne({ _id: id });
    await redisClient.del(CACHE_KEY); //invalidate cache
    await redisClient.del(`product:${id}`);  

    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: { name: 'String', price: 'Number' },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
