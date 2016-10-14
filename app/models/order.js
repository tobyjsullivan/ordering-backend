'use strict'

var randomstring = require('randomstring');
var db = require('../lib/db.js');
const Address = require('./address.js');
const LineItem = require('./line-item.js');

function generateId() {
	return 'ord-'+randomstring.generate(10);
}

function addToDb(order) {
	var sql = 'INSERT INTO orders (order_id, full_name, phone, address_line_1, address_line_2, address_city, address_postal_code, created_date) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())';
	var params = [
			order.id,
			order.fullName,
			order.phone,
			order.address.line1,
			order.address.line2,
			order.address.city,
			order.address.postalCode];

	return db.query(sql, params)
		.then(function(result) {
			console.log('Insert complete');
			return order;
		});
}

class Order {
	constructor() {
		console.log('Creating an order');
		this._lineItems = [];
	}

	addLineItem(lineItem) {
		if (!(lineItem instanceof LineItem)) {
			throw "lineItem must be an instance of LineItem.";
		}

		lineItem.order = this;

		this._lineItems.push(lineItem);
	}

	create() {
		var p = new Promise(function(resolve, reject) {
			if (this.id) {
				throw "Order already exits";
			}

			this.id = generateId();
			resolve(this);	
		}.bind(this));

		var pDb = p.then(function(order) {
				return addToDb(order);
			})
			.then(function(order) {
				console.log('Order added to DB', order.id);
				return order;
			});

		var pLineItems = p.then(function(order) {
				var promises = [];
				for (var li of order._lineItems) {
					console.log('Creating line item...');
					promises.push(li.create());
				};

				return Promise.all(promises);
			});

		return Promise.all([pDb, pLineItems])
			.then(function(list) {
				return list[0];
			});
	}
}

module.exports = Order;
