require('dotenv').config();
const connectDB = require('./config/db');
connectDB(); // Connect MongoDB

console.log('Loaded password:', process.env.MONGO_ATLAS_PW);

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors= require('cors');

app.use(cors()); // Enable CORS for all routes

// Import the Redis rate limiter middleware
const rateLimiter = require('./middleware/rateLimiter');

// Apply rate limiter middleware globally before any routes
app.use(rateLimiter);

// CORS HEADERS
app.use((req, res, next) => {
    res.header('ACCESS-CONTROL-ALLOW-ORIGIN', '*');
    res.header(
        'ACCESS-CONTROL-ALLOW-HEADERS',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('ACCESS-CONTROL-ALLOW-METHODS', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// LOGGING, FILE SERVING, PARSERS
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  ROUTES
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/user', require('./routes/user'));

// 404 HANDLER
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// GENERAL ERROR HANDLER
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
