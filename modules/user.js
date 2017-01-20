var db = require('./db.module');

var User = module.exports;

//保存数据
User.add = function(sql, args, next, callback) {
	db.insert(sql, args, next, function(err, res) {
		if (err) next();
		callback.apply(null, [err, res]);
	});
};

//根据用户名得到用户信息
User.getUserByUserName = function(sql, args, next, callback) {
	db.query(sql, args, next, function(err, res) {
		if (err) next();
		callback.apply(null, [err, res]);
	});
};
// register new user
User.registerNewUser = function(sql, args, next, callback) {
	db.query(sql, args, next, function(err, res) {
		if (err) next();
		callback.apply(null, [err, res]);
	});
};