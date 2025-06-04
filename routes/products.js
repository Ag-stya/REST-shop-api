const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const Product= require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Controller=require('../controllers/products')
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');

    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname)

    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        //accept a file
        return cb(null,true);
    }
    else{
        //reject a file
        cb(null,false);
    }
};

// Set up multer for file uploads
const upload= multer({storage: storage,
    limits:{
        fileSize:1024*1024*5 //5MB
    },
    fileFilter: fileFilter
});

router.get('/',Controller.products_get_all);

// POSTING A NEW PRODUCT
router.post('/',checkAuth,upload.single('productImage'),Controller.products_create_product);
   //CREATES A NEW PROJECT INSTANCE WITH A GENERATED ObjectID
   

//GET A SINGLE PRODUCT BY ID
router.get('/:productId', Controller.products_get_product);

//PATCH(UPDATE) A PRODUCT BY ID
router.patch('/:productId', checkAuth,Controller.products_update_product);

//DELETE A PRODUCT BY ID
router.delete('/:productId',checkAuth, Controller.products_delete_product);

module.exports= router;