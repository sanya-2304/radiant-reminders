const express = require('express');
const user_route = express.Router();
const userCont = require('../controllers/userController');

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.get('/register', userCont.registerLoad);
user_route.post('/register', userCont.register);
user_route.get('/home', userCont.home);
user_route.get('/new-quote', userCont.newQuote); 

module.exports = user_route;
