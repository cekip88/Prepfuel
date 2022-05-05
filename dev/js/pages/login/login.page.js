import { G_Bus }      from "../../libs/G_Control.js";
import { G }          from "../../libs/G.js";
import { loginModel } from "./loginModel.js";
import GInput         from "../../components/input/input.component.js";

class LoginPage extends G{
	constructor() {
		super();
	}
	define(){
		const _ = this;
		_.componentName = 'LoginPage';
		G_Bus
			.on(_,'doFormAction')
			.on(_,'loginSuccess')
			.on(_,'loginFail')
			//.on(_,'registerSuccess')
			.on(_,'registerFail')
			.on(_,'forgotSuccess')
			.on(_,'forgotFail')
			.on(_,'resetSuccess')
			.on(_,'resetFail')
			.on(_,'changeSection');
		
	}
	async doFormAction({item:form,event:e}){
		const _ = this;
		e.preventDefault();
		let handle = form.getAttribute('data-handle');
		let formData = _.prepareForm(form);
		if(!formData){return void 0}
		await loginModel[handle](formData);
	}
	changeSection({item,event}){
		const _ = this;
		let section = item.getAttribute('section'),
				part = (section == 'reset') ? 'row' : 'right';
		if(section == 'welcome'){
			_.welcomeTpl();
		}else
		_.renderPart({part:part,content: _.markup(_[`${section}Tpl`](),false)});
	}

	
	loginSuccess(token){
		const _ = this;
		_.storageSave('authorization','true');
		return Promise.resolve(token);
	}
	loginFail({response,formData}){
		const _ = this;
		let msg = response['message'];
		_.f('g-input[name="email"]').doValidate(msg);
		_.f('g-input[name="password"]').doValidate(msg);
	}
	forgotSuccess(){
		const _ = this;
		_.renderPart({part:'row',content: _.markup(_[`forgotDoneTpl`](),false)});
	}
	forgotFail(){
		const _ = this;
	}
	
	
	registerFail({response}){
		this.handleErrors({response});
	}
	resetSuccess(){
		const _ = this;
		_.renderPart({part:'row',content: _.markup(_[`passwordChangedTpl`](),false)});
	}
	
	resetFail({response}){
		this.handleErrors({response});
	}
	
	
	
	async init(){
		const _ = this;
	}
	
	async render(blockData){
		const _ = this;
		let initTpl = _.loginTpl();
		let params = blockData['params'];
		if(params.length > 0){
			initTpl = _[`${params[0]}Tpl`](params);
		}
		_.welcomeTpl(initTpl);
	}
}
export { LoginPage }