var user = require('../modules/user');
// 用户登录和注册
module.exports = {
	/**
	 * [login 登录]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
    login: function(req, res, next) {
        // console.log(req);
        var username = req.body.name;
        var password = req.body.password;
        // console.log(username);
        var sql = "SELECT * FROM userinfo WHERE username = ?";
        var args = [username];
        user.getUserByUserName(sql, args, next, function(err, result) {
            if (err) next(err);
            var data = {},
                len = result.length;
            if (len == 1 && result[0].password == password) {
                data = {
                    code: 1,
                    message: 'ok',
                    detail: 'ok',
                    data: result[0]
                }
            } else if (len == 1) {
                data = {
                    code: 10001,
                    message: 'The password is wrong,please retype it',
                    detail: 'not allow login',
                    data: 'please check your password'
                }
            } else {
                data = {
                    code: 10000,
                    message: 'User name is not exist',
                    detail: 'not allow login',
                    data: 'please try again or register'
                }
            }
            res.json(data);
        });
    },
    /**
     * [register 注册]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    register: function(req, res, next) {
        var postData = req.body,
            sql = "INSERT INTO userinfo (username,password) VALUES (?,?)",
            args = [postData.name, postData.password];
        if (postData.password != postData.confirm_password) {
            res.json({
                code: 10000,
                data: 'please retype your password',
                message: 'please confirm your password',
                detail: 'please check your password'
            });
            return;
        };
        var searchSql = "SELECT * FROM userinfo WHERE username = ?";
        user.getUserByUserName(searchSql, [postData.name], next, function(err, result) {
            if (err) next(err);
            var len = result.length;
            if (len > 0) {
                res.json({
                    code: 10001,
                    data: 'please use another user name',
                    message: 'the user name is used,please retry another name',
                    detail: 'please use another name register'
                })
            } else {
                user.registerNewUser(sql, args, next, function(err, result) {
                    if (err) next(err);
                    res.json({
                        code: 1,
                        message: 'register success!',
                        detail: 'ok',
                        data: result
                    });
                })
            }
        })
    },
    /**
     * [checkLogin check the user is login or not]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    checkLogin:function(req,res,next){
    	var param = req.query || req.params,
    		sql="SELECT * FROM userinfo WHERE userid = ?",
    		args=[param.userid];
    	user.getUserByUserName(sql,args,next,function(err,result){
    		if(err) next(err);
    		var len = result.length;
            if(len==1&&result[0].username==param.username){
            	res.json({
            		code:1,
            		message:'allow chat',
            		detail:'is login',
            		data:result[0]
            	})
            }else if(len==1){
            	res.json({
            		code:10000,
            		message:'not allow chat',
            		detail:'user name is not correct',
            		data:result[0]
            	})
            }else{
            	res.json({
            		code:10001,
            		message:'not allow chat',
            		detail:'user id is not exist!',
            		data:'not have this user information'
            	});
            }
    	})
    }
}
