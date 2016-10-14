'use strict'

var express = require('express');
var Order = require('../models/order.js');
var LineItem = require('../models/line-item.js');
var Address = require('../models/address.js');

var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'This is Orders!' });
});

function respError(res, message, status) {
	res.status(status || 500);
	res.json({ error: message });
}

router.post('/', function(req, res) {
	var json = req.body;
	console.log('Incoming order: ', json);

	if (!json['fullName']) {
		respError(res, 'Your request must include a value for [fullName].', 400);
		return;
	}

	if (!json['phone']) {
		respError(res, 'Your request must include a value for [phone].', 400);
		return;
	}

	if (!json['address']) {
		respError(res, 'Your request must include a value for [address].', 400);
		return;
	}

	if (!json['address']['line1']) {
		respError(res, 'Your request must include a value for [address][line1].', 400);
		return;
	}

	if (!json['address']['city']) {
		respError(res, 'Your request must include a value for [address][city].', 400);
		return;
	}

	if (!json['address']['postalCode']) {
		respError(res, 'Your request must include a value for [address][postalCode].', 400);
		return;
	}

	if (!json['lineItems']) {
		respError(res, 'Your request must include a value for [lineItems].', 400);
		return;
	}

	var order = new Order();
	order.fullName = json['fullName'];
	order.phone = json['phone'];
	var address = new Address();
	address.line1 = json['address']['line1'];
	address.line2 = json['address']['line2'] || null;
	address.city = json['address']['city'];
	address.postalCode = json['address']['postalCode'];
	order.address = address;

	for (var item of json['lineItems']) {
		if (!item['value']) {
			respError(res, 'lineItem is malformed', 400);
			return;
		}

		var li = new LineItem();
		li.value = item['value'];
		order.addLineItem(li);
	}

	order.create()
		.then(function(order) {
			console.log('Order created.');
			res.status(201);
			res.json({ order_id: order.id });
		})
		.catch(function(err) {
			console.log('Error:', err);
			respError(res, err, 400);
		});
});

module.exports = router;
