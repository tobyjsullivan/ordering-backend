'use strict'

var randomstring = require('randomstring');
var db = require('../lib/db.js');

function generateId() {
	return 'lin-'+randomstring.generate(10);
}

function addToDb(lineItem) {
	var sql = 'INSERT INTO line_items (line_item_id, order_id, user_value) VALUES ($1, $2, $3);';
	var params = [
		lineItem.id,
		lineItem.order.id,
		lineItem.value
	];

	return db.query(sql, params)
		.then(function(result) {
			console.log('Insert complete', 'LineItem');
			return lineItem;
		});
}

class LineItem {
	create() {
		console.log('LineItem.create called.');
		return new Promise(function(resolve, reject) {
			if (this.id) {
				throw "LineItem already exits";
			}

			this.id = generateId();
			resolve(this);
		}.bind(this))
			.then(function(lineItem) {
				console.log('Adding line item to db', lineItem.id);
				return addToDb(lineItem);
			})
			.then(function(lineItem) {
				console.log('LineItem added to DB', lineItem.id);
				return lineItem;
			})
			.catch(function(err) {
				console.log("ERROR!", err);
			});
	}
}

module.exports = LineItem;
