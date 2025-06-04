const express = require('express');
const Order= require('../models/order')
const Product= require('../models/product')
const mongoose= require('mongoose');

exports.products_get_all=(req,res,next)=>{
    //idhar saare products frrom DB laenge
        Product.find().select('name price _id productImage').exec().then(docs =>{
            const response= {
                count: docs.length,
                products: docs.map(doc=>{
                    return{
                        _id: doc._id,
                        name:doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            console.log(docs);
            if(docs.length>0){
                res.status(200).json(response);
            }
            else{
                res.status(404).json({
                    message:"no entries found"
                })
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error:{
                    name:err.name,
                    message: err.message
                }
            });
        })
        
    
        
};


exports.products_create_product=(req,res,next)=>{
    console.log(req.file);
        const product= new Product({
            _id: new mongoose.Types.ObjectId(),
            name : req.body.name,
            price: req.body.price,
            productImage: req.file.path
        });
        // save the product to the database
        product.save()
            .then(result=>{
                //LOG THE SAVED PRODUCT TO THE SERVER CONSOLE
                console.log('Product saved successfully',result);
    
                res.status(201).json({
                    message: 'Handling POSt requests to /products ( Product Created)',
                    createdProduct: {
                        id:result._id,
                        name:result.name,
                        price: result.price,
                        request:{
                            type: 'GET',
                            //Link to the newly created product 
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
            
                });
            })
            .catch(err=>{
                //LOG THE ERROR TO THE SERVER CONSOLE
                console.log('ERROR SAVING THE PRODUCT',err)
                res.status(500).json({
                    error:{
                        name:err.name,
                        message: err.message
                    }
                });
            });
        
};

exports.products_get_product=(req,res,next)=>{
    const id= req.params.productId;
        console.log('Received productID from URL:',id,"(Type:", typeof id,")");
        //CHECK FOR VALID ObjectId fromat
        if(!mongoose.Types.ObjectId.isValid(id)){
            console.log("Invalid ObjectId fromat for:", id);
            return res.status(400).json({
                message:" Invalid productId fromat",
                receivedId: id
            })
    
        }
        Product.findById(id)
        .select('name price _id productImage') //select only specific fields
        .exec()   //exec returns  promise, allowing then and catch
        .then(doc=>{
            //log the retrieved  document to the server console
            console.log("FROM DATABASE:"+doc);
    
            //check if the document was found(not null)
            if(doc){
                //if found, send the document with 200 OK status
                res.status(200).json(doc);
            }else{
                console.log('no valid entry found for the requested productId:' ,id)
                res.status(404).json({
                    messsage: "No valid entry found for this id"
                })
            }
            
        })
        .catch(err=>{
            console.log("Error fetching the product by id",err);
            res.status(500).json({
                name: err.name,
                messsage: err.messsage,
                //USEFUL FOR CAST ERRORS
                kind: err.kind,
                value: err.value,
                path: err.path,
                stringValue: err.stringValue
    
    
            });
        });
};


exports.products_update_product=(req,res,next)=>{
    const id = req.params.productId;
        const updateOptions = {};
        for(const ops of req.body){
            updateOptions[ops.propName]= ops.value;
        }
        Product.findByIdAndUpdate({_id:id}, {$set: updateOptions})
            .exec()
            .then(result =>{
                console.log(result);
                res.status(200).json({
                    result: 'Product updated successfully',
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ id,
                        body:{
                            name : 'String',
                            price: 'Number'
                        }
                    }
                
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    name: err.name,
                    messsage: err.messsage,
    
                })
            });

};

exports.products_delete_product=(req,res,next)=>{
    const id= req.params.productId;
    const mongoose= require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format detected for ID:", id);
            return res.status(400).json({
                message: "Invalid product ID format. Please provide a valid 24-character hexadecimal string.",
                receivedId: id
            });
    }



    Product.deleteOne({_id:id})
        .exec()
        .then(result=>{
            res.status(200).json({
                result : 'Product deleted successfully',
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body:{
                        name:'String',
                        price:'Number'
                    }
                }
            });
                
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:{
                    name:err.name,
                    message: err.message
                }
            });
        })
};