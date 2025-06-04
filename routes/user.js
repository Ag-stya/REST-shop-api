const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const User= require('../models/user');

const Controller= require('../controllers/users');

router.post('/signup',Controller.users_signup);

router.post('/login', Controller.users_login);


router.delete("/:userId",Controller.users_delete_user);


module.exports=router;