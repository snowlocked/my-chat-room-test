var express = require('express');
var router  = express.Router();
var login = require('../controllers/login.con');


router.post('/', function(req, res,next) {
	// console.log(req);
	login.login(req,res,next);
    // res.render('loginAction');
});

router.post('/register',function(req,res,next){
	login.register(req,res,next);
});

router.get('/checkLogin',function(req,res,next){
	login.checkLogin(req,res,next);
});
module.exports = router;