const mongoose= require('mongoose');

const productSchema= mongoose.Schema({
    _id:mongoose.Schema.ObjectId,
    name:{type: String, required: true, minlength: 3, maxlength: 100},
    price : {type: Number, required: true, min: 0.01, max: 10000},
    productImage:{type: String, required: true}
});

module.exports=mongoose.model('Product',productSchema);