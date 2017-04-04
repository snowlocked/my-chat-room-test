/**
 *初始化mysql,创建连接池
 */

var mysql = require('mysql');
// 使用连接池，提升性能
var pool = mysql.createPool({
	host:'127.0.0.1',
	port:3306,
	user:'root',
	password:'root',
	database:'user',
	char_set:'utf8'
});

module.exports = pool;
