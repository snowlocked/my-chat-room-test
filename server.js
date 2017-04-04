var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    users = [];

// var routes = require('./routes/index');
var login = require('./routes/login');
// var backManagement = require('./routes/backManagement');
//get the post require param
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//specify the html we will use
app.use('/', express.static(__dirname + '/www'));
app.use('/loginAction', login);

//bind the server to the 80 port
//server.listen(3000);//for local test
server.listen(process.env.PORT || 10001);//publish to heroku
//server.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);//publish to openshift
//console.log('server started on port'+process.env.PORT || 3000);
//handle the socket
io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        console.log(nickname);
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        // console.log(socket);
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        // console.log('imgData:'+imgData);
        // console.log('color:'+color);
        // console.log('nickname'+socket.nickname);
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});
