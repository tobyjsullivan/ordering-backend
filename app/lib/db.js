'use strict'

var pg = require('pg');

// Connection pool settings
var config = {
	max: 10,
	idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

pool.on('error', function(err, client) {
	console.log('DATABASE ERROR:', err.message, err.stack);
});

var query = function (sql, params) {
	return new Promise(function(resolve, reject) {
		pool.connect(function(err, client, done) {
			if (err) {
				console.log('SQL Client error:', err);
				reject(err.message);
			}

			client.query(sql, params, function(err, result) {
				done();

				if (err) {
					console.log('SQL Query error:', err);
					reject(err.message);
				} else {
					resolve(result);
				}
			});
		});
	});
};

module.exports = {
	pool: pool,
	query: query
};
