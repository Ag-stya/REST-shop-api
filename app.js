require('dotenv').config();
const connectDB = require('./config/db');
connectDB(); // Connect MongoDB

console.log('Loaded password:', process.env.MONGO_ATLAS_PW);


const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser=require('body-parser');





const productRoutes = require('./routes/products');
const orderRoutes= require('./routes/orders');
const userRoutes = require('./routes/user');




app.use((req,res,next)=>{
    res.header('ACCESS-CONTROL-ALLOW-ORIGIN','*');
    res.header('ACCESS-CONTROL-ALLOW-HEADERS',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('ACCESS-CONTROL-ALLOW-METHODS','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});



app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req,resp,next)=>{
    const error= new Error('Not found');
    error.status= (404);
    next(error);
});

// 500 for all other kinds of errors
app.use((error,req,resp,next)=>{
    resp.status(error.status || 500);
    resp.json({
        error:{
            message: error.message
        }
    });
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

module.exports = app;


// body parser supports URL encoded bodies and JSON data