'use strict'

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ordersController = require('./app/controllers/orders_controller.js');

var app = express();
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.use('/orders/', ordersController);

app.listen(port);
console.log('Server is running. Port ', port);
