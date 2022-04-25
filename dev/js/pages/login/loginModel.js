import {G_Bus} from "../../libs/G_Bus.js";

export default class loginModel{
	constructor() {
		this.componentName = 'LoginPage';
	}
	async doLogin(formData){
		const _ = this;
		let rawResponse = await fetch(`https://live-prepfuelbackend-mydevcube.apps.devinci.co/api/auth/login`,{
			method: 'POST',
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(formData)
		});
		if( rawResponse.status == 200 ){
			let response = await rawResponse.json();
			if(response['status'] == 'success'){
				G_Bus.trigger('router','changePage','/test')
				G_Bus.trigger(_.componentName,'loginSuccess',response['token']);
			}else{
				G_Bus.trigger(_.componentName,'loginError',{
					"response": response,
					"formData": formData
				})
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