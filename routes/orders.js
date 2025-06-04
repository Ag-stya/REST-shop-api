const express= require("express");
const router = express.Router();
const mongoose= require('mongoose');
const Order= require('../models/order')
const Product= require('../models/product')
const checkAuth= require('../middleware/check-auth');

const Controller= require('../controllers/orders')

router.get('/',checkAuth,Controller.orders_get_all);

router.post('/',checkAuth,Controller.orders_create_order);

router.get('/:orderId',checkAuth,Controller.orders_get_order);


router.delete('/:orderId',checkAuth,Controller.orders_delete_order);



module.exports= router;
