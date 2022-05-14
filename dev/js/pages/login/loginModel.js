import {G_Bus} from "../../libs/G_Bus.js";
import { env } from "/env.js"
class _loginModel{
	constructor() {
		this.componentName = 'LoginPage';
		
		this.baseHeaders = {
			headers:{
				"Content-type": "application/json"
			}
		}
		this.endpoints = {
			'login': `${env.backendUrl}/auth/login`,
			'register': `${env.backendUrl}/auth/register`,
			'forgot': `${env.backendUrl}/auth/forgot-password`,
			'reset': `${env.backendUrl}/auth/reset-password`,
		};
		
	}
	isSuccessStatus(status){
		return (status < 300);
	}
	isSuccessResponse(response){
		return response['status'] == 'success';
	}
	isFailResponse(response){
		return response['status'] == 'fail';
	}
	
	async doLogin(formData){
		const _ = this;
		let rawResponse = await fetch(_.endpoints['login'],{
			method: 'POST',
			..._.baseHeaders,
			body: JSON.stringify(formData),
			
		});
		if(_.isSuccessStatus(rawResponse.status)){
			let response = await rawResponse.json();
			
			if( _.isSuccessResponse(response) ){
				await G_Bus.trigger(_.componentName,'loginSuccess',response);
				await G_Bus.trigger('router','changePage','/test');
			}else{
				G_Bus.trigger(_.componentName,'loginFail',{
					"response": response,
					"formData": formData
				});
			}
		}
	}
	async doRegister(formData){
		const _ = this;
		let rawResponse = await fetch(_.endpoints['register'],{
			method: 'POST',
			..._.baseHeaders,
			body: JSON.stringify(formData),
		});
		if( _.isSuccessStatus(rawResponse.status) ){
			let response = await rawResponse.json();
			if( _.isSuccessResponse(response) ){
				await G_Bus.trigger(_.componentName,'registerSuccess',response['token']);
			}
		}else{
			let response = await rawResponse.json();
			G_Bus.trigger(_.componentName,'registerFail',{
				"response": response,
				"formData": formData
			});
		}
	}
	async doForgot(formData){
		const _ = this;
		let rawResponse = await fetch(_.endpoints['forgot'],{
			method: 'POST',
			..._.baseHeaders,
			body: JSON.stringify(formData),
		});
		if( _.isSuccessStatus(rawResponse.status) ){
			let response = await rawResponse.json();
			console.log(response)
			if( _.isSuccessResponse(response) ){
				await G_Bus.trigger(_.componentName,'forgotSuccess',response['token']);
			}else{
				G_Bus.trigger(_.componentName,'forgotFail',{
					"response": response,
					"formData": formData
				});
			}
		}
	}
	async doReset(formData){
		const _ = this;
		let rawResponse = await fetch(`${_.endpoints['reset']}/${formData['token']}`,{
			method: 'POST',
			..._.baseHeaders,
			body: JSON.stringify(formData),
		});
		if( _.isSuccessStatus(rawResponse.status) ){
			let response = await rawResponse.json();
			if( _.isSuccessResponse(response) ){
				await G_Bus.trigger(_.componentName,'resetSuccess',response['token']);
			}
		}else{
			let response = await rawResponse.json();
			G_Bus.trigger(_.componentName,'resetFail',{
				"response": response,
				"formData": formData
			});
			console.error(response);
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
export const loginModel = new _loginModel();