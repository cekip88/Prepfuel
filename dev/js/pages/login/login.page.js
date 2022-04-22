import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";
import loginModel from "./loginModel.js";
import GInput from "../../components/input/input.component.js";

class LoginPage extends G{
	constructor() {
		super();
	}
	define(){
		const _ = this;
		_.componentName = 'LoginPage';
		_.model = new loginModel();
		G_Bus
			.on(_,'doLogin')
	}
	async doLogin({item:form,event}){
		const _ = this;
		let formData = _.prepareForm(form);
		if(!formData){return void 0}

		let token = await _.model.doLogin(formData);
		_.storageSave('token',token);
	}
	async init(){
		const _ = this;
	}
	async render(){
		const _ = this;
		if(await _.model.isLogin()){
			return void 0;
		}
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPage([
			_.markup(_.header.render()),
			_.markup(`
				<div class="section">
					<form data-submit="${_.componentName}:doLogin">
						<g-input class="g-form-item"  name="email" type="email" placeholder="Email" required></g-input>
						<g-input class="g-form-item" name='password' type="password" placeholder="Password" required></g-input>
						<br><br>
						<button class="button-blue">Submit</button>
					</form>
				</div>
			`),
		]);
	}
}
export { LoginPage }