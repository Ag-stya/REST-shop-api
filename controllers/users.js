const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const User= require('../models/user');


exports.users_signup=(req,res,next)=>{
    User.find({email:req.body.email})
            .exec()
            .then(user=>{
                if(user.length>=1){
                    return res.status(409).json({
                        message: 'Email already exists'
                    });
                }
                else{
                    bcrypt.hash(req.body.password, 10, (err,hash)=>{
                        if(err){
                            return res.status(500).json({
                                error:err
                            });
                        }
                        else{
                            const user= new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            user.save()
                                .then(result=>{
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User created'
                                    });
                                })
                                .catch(err=>{
                                    console.log(err);
                                    res.status(500).json({
                                        error:err
                                    });
                                });
                        }
                
                    }); 
    
                }      
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
};


exports.users_login=(req,res,next)=>{
    User.findOne({
        email: req.body.email
    })
        .exec()
        .then(user=>{
            if(!user){
                return res.status(401).json({
                    message: "Authentication Failed"
                });
            }
            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message: "Authentication Failed"
                    });
                }
                if(result){
                    const token=jwt.sign({
                    email:user.email,
                    userId: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                },
                   
                );  
                    return res.status(200).json({
                        message: "Authentication Successful",
                        token: token

                    });
                }
                return res.status(401).json({
                    message: "Authentication Failed"
                });
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
};

exports.users_delete_user=(req,res,next)=>{
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'User deleted',
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/user/signup',
                    body:{
                        email: 'String',
                        password: 'String'
                    }
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