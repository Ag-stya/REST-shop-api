const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User= require('../models/user');
const Controller= require('../controllers/users');
const checkAuth=require('../middleware/check-auth');
const redisClient= require('../redis/cacheClient');

router.post('/signup',Controller.users_signup);

router.post('/login', Controller.users_login);


router.delete("/:userId",Controller.users_delete_user);

router.post('/logout',checkAuth, async(req, res)=>{
    try{
        const token= req.token;
        const expiresIn=req.userData.exp- Math.floor(Date.now() / 1000);
        if(expiresIn>0){
            await redisClient.setEx(`blacklisted:${token}`, expiresIn, 'blacklisted');
            console.log(`Token ${token} blacklisted for ${expiresIn} seconds`);
        }
        res.status(200).json({
            message:"Logged out successfully"
        });
    }
    catch(err){
        console.error('Error in POST /logout:', err);
        res.status(500).json({
            error: err.message || 'Logout failed'
        });
    }
});


module.exports=router;