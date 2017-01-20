var db = module.exports;
var pool = null;
var curd = {};

curd.init = function() {
	if (!pool) {
		pool = require('./init_mysql');
	}
};


curd.query = function(sql, args, next, callback) {
	pool.getConnection(function(err, conn) {
		if (err) {
			next(err);
		}
		conn.query(sql, args, function(err, res) {
			if (err) {
				next(err);
			} else {
				pool.releaseConnection(conn);
				callback.apply(null, [err, res]);
			}
		});
	});
};

curd.end = function() {
	pool.end();
}


db.end = function() {
	curd.end();
}

curd.init();
db.insert = curd.query;
db.update = curd.query;
db.delete = curd.query;
db.query = curd.query;