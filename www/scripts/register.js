(function(){
	var randomNode = common.getIdNode('random'),
		registerNode = common.getIdNode('register');
	var random = common.randomNNumber(4);
	randomNode.innerHTML = random;
	// set random Number
	randomNode.addEventListener('click',function(){
		this.innerHTML = common.randomNNumber(4);
	});

	registerNode.addEventListener('click',function(){
		var data = common.getFormData('register-form');
		// console.log(data);
		if(data.name==''){
			alert('please input your name');
			return;
		}
		if(data.password.length<6){
			alert('your password is too short');
			return;
		}
		if(data.password.length>50){
			alert('your password is too long')
		}
		if(data.password!=data.confirm_password){
			alert('please confirm your password');
			return;
		}
		if(data.verification!=randomNode.innerHTML){
			alert('the verification code is wrong,please type it again!');
			return;
		}
		// register new user
		$.ajax({
			url:'/loginAction/register',
			type:'POST',
			data:data,
			success:function(json){
				// console.log(json);
				alert(json.message);
				if(json.code==1){
					location.href='index.html'
				}
			},
			error:function(error){
				console.log(error);
			}
		})
	});
})()