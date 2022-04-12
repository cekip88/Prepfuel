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
		let rawResponse = await fetch('/api/auth/login',{
			method: 'POST',
			body: JSON.stringify(formData)
		});
		if( rawResponse.status == 200 ){
			let response = rawResponse.json();
			if(response['status'] == 'success'){
				_.setRouteFromString('test');
			}
		}else{
			_.setRouteFromString('test');
		}
	}
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPage([
			_.markup(_.header.render()),
			_.markup(`
				<div class="section">
					<form data-submit="doLogin">
						<g-input class="g-form-item" type="email" placeholder="Email" required></g-input>
						<g-input class="g-form-item" type="password" placeholder="Password" required></g-input>
						<br><br>
						<button class="button-blue">Submit</button>
					</form>
				</div>
			`),
		]);
	}
}
export { LoginPage }