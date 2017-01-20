window.onload = function() {
    var myChat = new MyChat();
    myChat.init();
};
var MyChat = function() {
    this.socket = null;
};

MyChat.prototype = {
    init: function() {
        var that = this;
        $.ajax({
        	url:'loginAction/checkLogin',
        	type:'GET',
        	data:{
        		userid:common.getUrlParam('userid'),
        		username:sessionStorage.name
        	},
        	success:function(json){
        		console.log(json);
        		if(json.code==1){
        			that.joinChat();
        		}else{
        			alert(json.message);
        			location.href='index.html';
        		}
        	}
        })
    },
    joinChat:function(){
    	var that = this;
    	this.socket = io.connect();
    	this.socket.on('connect', function() {});
    	var userName = sessionStorage.name;
    	// record login user name
    	this.socket.emit('login',userName);
    	// if the user is login status,return login html
    	this.socket.on('nickExisted', function() {
            alert('the user is already login');
            location.href = 'index.html';
        });
        // the login success operation
        this.socket.on('loginSuccess', function() {
            common.getIdNode('messageInput').focus();
        });
        // fail to connection operation
        this.socket.on('error', function(err) {
            alert('fail to connect');
            location.href = index.html;
        });
        // connect system success and show message
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewMsg('system ', msg, 'red');
            common.getIdNode('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        // show new message
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });
        // send an img
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });
        // send message button
        common.getIdNode('sendBtn').addEventListener('click', function() {
            var messageInput = common.getIdNode('messageInput'),
                msg = messageInput.value,
                color = common.getIdNode('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
                return;
            };
        }, false);
        // listen the message input operation
        common.getIdNode('messageInput').addEventListener('keyup', function(e) {
            var messageInput = common.getIdNode('messageInput'),
                msg = messageInput.value,
                color = common.getIdNode('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
            };
        }, false);
        // clear the dialog message
        common.getIdNode('clearBtn').addEventListener('click', function() {
            common.getIdNode('historyMsg').innerHTML = '';
        }, false);
        // choose an img and send it
        common.getIdNode('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = common.getIdNode('colorStyle').value;
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        // init emoji content
        this._initialEmoji();
        common.getIdNode('emoji').addEventListener('click', function(e) {
            var emojiwrapper = common.getIdNode('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        // hide the emoji content
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = common.getIdNode('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        // send some emoji content
        common.getIdNode('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = common.getIdNode('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    /**
     * [_initialEmoji init emoji]
     * @return {[type]} [description]
     */
    _initialEmoji: function() {
        var emojiContainer = common.getIdNode('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    /**
     * [_displayNewMsg send an img]
     * @param  {[type]} user  [description]
     * @param  {[type]} msg   [description]
     * @param  {[type]} color [description]
     * @return {[type]}       [description]
     */
    _displayNewMsg: function(user, msg, color) {
        var container = common.getIdNode('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    /**
     * [_displayImage show img]
     * @param  {[type]} user    [description]
     * @param  {[type]} imgData [description]
     * @param  {[type]} color   [description]
     * @return {[type]}         [description]
     */
    _displayImage: function(user, imgData, color) {
        var container = common.getIdNode('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    /**
     * [_showEmoji show emoji]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = common.getIdNode('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
}
