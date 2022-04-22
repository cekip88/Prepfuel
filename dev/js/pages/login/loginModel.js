import {G_Bus} from "../../libs/G_Bus.js";

export default class loginModel{
	constructor() {}
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

				G_Bus.trigger('router','changePage','/test');
				return response['token'];
			}
		}else{
			throw new Error(await rawResponse.text());
		}
	}
}