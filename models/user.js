const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{
        type: String,
        required:true,
        unique: true, // Basic email validation
        minlength: 5,
        maxlength: 100,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  

    },
    password:{
        type:String,
        required:true,
        minlength: 6,
        maxlength: 100
    }
});

module.exports=mongoose.model('User',userSchema);