const express = require('express');
const Order= require('../models/order')
const Product= require('../models/product')
const mongoose= require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product','name price')
        .exec()
        .then(docs=>{
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc=>{
                    return{
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
               
            });

        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        })
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
exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product','name price')
            .exec()
            .then(order=>{
                res.status(200).json({
                    order: order,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
    
                });
            })
            .catch(err=>{
                res.status(500).json({
                    error:err
                });
            });
};


exports.orders_delete_order = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
        .exec()
        .then(result=>{
            if(!Order){
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                message: 'order deleted',
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body:{
                        productId:'ID',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            });
        })
};

