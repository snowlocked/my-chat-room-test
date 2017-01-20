(function(){
	// get some relevant node
	var randomNode = common.getIdNode('random'),
		registerNode = common.getIdNode('register'),
		loginNode = common.getIdNode('login');
	var random = common.randomNNumber(4);
	randomNode.innerHTML = random;
	// set random Number
	randomNode.addEventListener('click',function(){
		this.innerHTML = common.randomNNumber(4);
	});
	// register a new user
	registerNode.addEventListener('click',function(){
		location.href = 'register.html';
	});
	// login operate
	loginNode.addEventListener('click',function(){
		var data = common.getFormData('login-form');
		console.log(data);
		if(data.name==''){
			alert('please input your name');
			return;
		}
		if(data.verification!=randomNode.innerHTML){
			alert('the verification code is wrong,please type it again!');
			return;
		}
		$.ajax({
			url:'/loginAction',
			type:'POST',
			data:data,
			success:function(json){
				if(json.code==1){
					sessionStorage.name = json.data.username;
					location.href='chat.html?userid='+json.data.userid
				}else{
					alert(json.message);
				}
			},
			error:function(error){
				// console.log(error);
			}
		});
	});
})()