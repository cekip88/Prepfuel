import {G_Bus} from "../../libs/G_Bus.js";

export default class loginModel{
	constructor() {
		this.componentName = 'LoginPage';
	}
	
	isSuccessResponse(response){
		return response['status'] == 'success';
	}
	isFailResponse(response){
		return response['status'] == 'fail';
	}
	
	async doLogin(formData){
		const _ = this;
		let rawResponse = await fetch(`https://live-prepfuelbackend-mydevcube.apps.devinci.co/api/auth/login`,{
			method: 'POST',
			headers:{
				"Content-type": "application/json"
			},
			body: JSON.stringify(formData),
		});
		if( rawResponse.status == 200 ){
			let response = await rawResponse.json();
			if( _.isSuccessResponse(response) ){
			//	await G_Bus.trigger(_.componentName,'loginSuccess',response['token']);
				await G_Bus.trigger('router','changePage','/test');
				
			}else{
				G_Bus.trigger(_.componentName,'loginFail',{
					"response": response,
					"formData": formData
				});
			}
		}
	}
	async isLogin(){
		const _ = this;
		return new Promise( (resolve) =>{
			if(localStorage.getItem('token')){
				G_Bus.trigger('router','changePage','/test');
				resolve(true);
			}
			resolve(false);
		})
	}
}