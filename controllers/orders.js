const express = require('express');
const Order= require('../models/order')
const Product= require('../models/product')
const mongoose= require('mongoose');
const redisClient = require('../redis/cacheClient');


exports.orders_get_all = async (req, res, next) => {
  const cacheKey = 'orders:all';
  const TTL = 60; // 1 minute

  try {
    const cachedOrders = await redisClient.get(cacheKey);
    if (cachedOrders) {
      console.log(' Serving cached order list from Redis');
      return res.status(200).json(JSON.parse(cachedOrders));
    }

    const docs = await Order.find()
      .select('product quantity _id')
      .populate('product', 'name price');

    const response = {
      count: docs.length,
      orders: docs.map(doc => ({
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + doc._id
        }
      }))
    };

    await redisClient.setEx(cacheKey, TTL, JSON.stringify(response));
    console.log(' Cached order list in Redis');

    res.status(200).json(response);
  } catch (err) {
    console.error('Error in GET /orders:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.orders_create_order= (req, res, next) => {
    const productId = req.body.productId;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        // Treat invalid ObjectId same as not found
        return res.status(404).json({
            message: "Product not found"
        });
    }

    Product.findById(req.body.productId)
        .then(product=>{
            if(!product){
                return res.status(404).json({
                    message: "Product not found"
                });
            }

    
            const order=new Order({
            _id: new  mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product: req.body.productId
            });
            return order.save() 
        })    
        .then(result =>{
            if(!result) return;
            res.status(201).json({result: result,
                message: 'Order was created',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quanityt : result.quantity,
                },
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+ result._id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.orders_get_order = async (req, res, next) => {
    const orderId= req.params.orderId;
    const cacheKey = `order:${orderId}`;
    const TTL = 120;
    try{
        const cachedOrder= await redisClient.get(cacheKey);
        if(cachedOrder){
            console.log(`Cache hit for order ${orderId} with cacheKey ${cacheKey}`);
            return res.status(200).json(JSON.parse(cachedOrder));
        }
        const order= await Order.findById(orderId)
            .populate('product', 'name price')
            .select('product quantity _id')
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }
        const response={
            order,request:{
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        };
        await redisClient.setEx(cacheKey, TTL,JSON.stringify(response));   
        console.log(`Cached order ${orderId} with cacheKey ${cacheKey}in Redis`);
        res.status(200).json(response);
    }
    catch(err){
        console.error(`Error retrieving order ${orderId}:`, err);
        res.status(500).json({
            error: err.message || 'Internal Server Error'
        });
    }




    // Order.findById(req.params.orderId)
    //     .populate('product','name price')
    //         .exec()
    //         .then(order=>{
    //             res.status(200).json({
    //                 order: order,
    //                 request:{
    //                     type: 'GET',
    //                     url: 'http://localhost:3000/orders'
    //                 }
    
    //             });
    //         })
    //         .catch(err=>{
    //             res.status(500).json({
    //                 error:err
    //             });
    //         });
};


exports.orders_delete_order = async (req, res, next) => {

    const orderId = req.params.orderId;

    try {
        const result = await Order.deleteOne({ _id: orderId });

        if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Order not found" });
        }

        // 🧹 Invalidate Redis cache
        await redisClient.del(`order:${orderId}`);
        console.log(` Redis cache invalidated for order ${orderId}`);

        res.status(200).json({
        message: 'Order deleted',
        request: {
            type: 'POST',
            url: 'http://localhost:3000/orders',
            body: {
            productId: 'ID',
            quantity: 'Number'
            }
        }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

