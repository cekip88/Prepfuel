
import { G_Bus }      from "../../libs/G_Control.js";
import { G }          from "../../libs/G.js";
import { loginModel } from "./loginModel.js";
import GInput         from "../../components/input/input.component.js";

class LoginPage extends G{
	constructor() {
		super();
		const _ = this;
		let gRow= document.createElement('g-row'),
				gLeft = document.createElement('g-left'),
				gRight = document.createElement('g-right');
		gRow.className = 'login';
		gLeft.className = 'login-left';
		gRight.className = 'login-right';
		_.pageStructure = {
			'row':{
				id:'',
				container: gRow
			},
			'left':{
				id:'',
				parent: 'row',
				container: gLeft
			},
			'right':{
				id:'',
				parent: 'row',
				container: gRight
			},
		};
		_.moduleStructure = {
		//	'row':'rowTpl',
			'left':'leftTpl',
			'right':'loginTpl',
		};
	}
	define(){
		const _ = this;
		_.componentName = 'LoginPage';
		G_Bus
			.on(_,[
				'doFormAction',
				'loginSuccess',
				'loginFail',
				'registerFail',
				'forgotSuccess',
				'forgotFail',
				'resetSuccess',
				'resetFail',
				'changeSection',
				'changeAgree'
		]);
	}
	async doFormAction({item:form,event:e}){
		/**
		 * @param { string } handle - form attribute for LoginModel action exmp 'doLogin'
		 * @param { object } formData - capture form data
		 * @return void;
		 */
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
			//_.welcomeTpl();
		}else{
			_.moduleStructure['right'] = `${section}Tpl`;
		}
		_.render();
	}

	changeAgree({item}){
		const _ = this;
		let accountBtn = _.f('#create-account-btn');
		if(!item.value.length) accountBtn.setAttribute('disabled',true);
		else accountBtn.removeAttribute('disabled');
	}
	loginSuccess(response){
		const _ = this;
		_.storageSave('authorization','true');
		for(let prop in response['user']){
			if (prop == 'student') continue;
			_.storageSave(prop,response['user'][prop]);
		}
		console.log(response.user)

		if (response.user.student) _.storageSave('courses',response.user.student.plans);
		else {
			if (localStorage.getItem('courses')) localStorage.removeItem('courses')
		}

		return Promise.resolve(response);
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
	async init(blockData){
		const _ = this;
/*		let initTpl = _.loginTpl();
		let params = blockData['params'];
		if(params){
			if(params.length > 0){
				initTpl = _[`${params[0]}Tpl`](params);
			}
		}
		_.welcomeTpl(initTpl);*/
		
		_.render();
	}
}
export { LoginPage }