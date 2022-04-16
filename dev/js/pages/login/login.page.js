import { G_Bus } from "../../libs/G_Control.js";
import { _front } from "../../libs/_front.js";

class LoginPage extends _front{
	define(){
		const _ = this;
		_.set({
			test: 'ss'
		});
		G_Bus.on('doLogin',_.doLogin.bind(_))
	}
	async doLogin({item:form,event}){
		const _ = this;
		let formData = _.prepareForm(form);
		if(!formData){return void 0}
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
				_.storageSave('token',response['token']);
				_.setRouteFromString('test');
			}
		}else{
			throw new Error(await rawResponse.text());
		}
		
	}
	async init(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPage([
			_.markup(_.header.render()),
			_.markup(`
				<div class="section">
					<form data-submit="doLogin">
						<g-input class="g-form-item"  name="email" type="email" placeholder="Email" required></g-input>
						<g-input class="g-form-item" name='password' type="password" placeholder="Password" required></g-input>
						<br><br>
						<button class="button-blue">Submit</button>
					</form>
				</div>
			`),
		]);
	}
	async render(){
	
	}
}
export { LoginPage }