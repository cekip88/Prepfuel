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
				'changeAgree',
				'formInputHandle',
				'checkEmail','validatePassword',
		]);
	}

	formInputHandle({item,event}){
		const _ = this;

		if (event.keyCode === 13) {
			let form = item.closest('FORM');
			G_Bus.trigger(_.componentName,'doFormAction',{item:form})
		}
	}

	async checkEmail({item}){
		const _ = this;
		let value = item.value;
		if (!value) {
			item.doValidate("Email can't be empty");
			return false;
		}
		let
			dogPos = value.indexOf('@'),
			dotPos = value.lastIndexOf('.');
		if (dogPos <= 0 || dotPos <= 0 || dogPos > dotPos || dotPos == value.length - 1) {
			item.doValidate("Incorrect email");
			return false;
		}
		let response = await loginModel.checkEmail(value);
		if (!response) {
			item.doValidate("Email can't be empty");
			return false;
		}
		if (response.substr(response.length - 4) !== 'free') {
			item.doValidate('User with this email address already exists')
			return false;
		}
		return true;
	}
	
	async doFormAction({item:form,event:e}){
		console.log('login','doFormAction')
		/**
		 * @param { string } handle - form attribute for LoginModel action exmp 'doLogin'
		 * @param { object } formData - capture form data
		 * @return void;
		 */
		const _ = this;
		if (e) e.preventDefault();
		let handle = form.getAttribute('data-handle');
		let formData = _.prepareForm(form);
		if(!formData) return void 0;

		/*let validation = await _.formValidation(form);
		if (!validation) return void 0;*/

		if (handle == 'doLogin') {
			let remember = form.querySelector('[name="remember"]');
			if (remember.value.length) {
				let loginData = {
					email: formData.email,
					password: formData.password
				}
				localStorage.setItem('loginData',JSON.stringify(loginData));
			}
			else localStorage.removeItem('loginData');
		}
		await loginModel[handle](formData);
		/*let resp = await loginModel[handle](formData);
		console.log(resp)
		if (handle == 'doRegister') {
			if (resp.status == 'success') _.showSuccessPopup(resp.message)
		}*/
	}
	showSuccessPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'green')));
		setTimeout(_.closePopup.bind(_),3000)
	}
	showErrorPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'red')));
		setTimeout(_.closePopup.bind(_),3000);
	}
	closePopup(clickData) {
		const _ = this;
		let label;
		if (clickData && clickData.item) label = clickData.item.closest('.label');
		else label = _.f('.label');
		if (label) label.remove();
	}
	async formValidation(cont){
		const _ = this;
		let inputs = cont.querySelectorAll(`[data-required]`);
		let validate = true;

		if (inputs.length) {
			for (let item of inputs) {
				if (item.hasAttribute('data-outfocus')) {
					let rawvalidate = await _[item.getAttribute('data-outfocus').split(':')[1]]({item});
					if (!rawvalidate) {
						validate = false;
					}
				} else if (item.tagName == 'G-SELECT') {
					if (!item.value.length) {
						validate = false;
						item.doValidate("This field can't be empty");
					}
				} else if (!item.value) {
					validate = false;
					item.doValidate("This field can't be empty");
				}

			}
		}
		return validate;
	}
	validatePassword({item}){
		const _ = this;
		let
			cont = item.closest('.passwords'),
			inputs = cont.querySelectorAll('G-INPUT[type="password"]'),
			text = item.nextElementSibling,
			validate;

		if (item == inputs[0]) {
			validate = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(item.value);
		} else {
			validate = (item.value === inputs[0].value);
		}

		if (validate) {
			item.setMarker();
			text.removeAttribute('style');
			if (item == inputs[1]) text.setAttribute('style','display:none;')
		} else {
			item.setMarker('red');
			text.style = 'color: red;';
		}
		return validate
	}
	changeSection({item,event}){
		const _ = this;
		let
			section = item.getAttribute('section'),
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
		console.log('login','loginSuccess')
		const _ = this;
		_.storageSave('authorization','true');
		for(let prop in response['user']){
			_.storageSave(prop,response['user'][prop]);
		}

		if (response.user.student) _.storageSave('courses',response.user.student.plans);
		else {
			if (localStorage.getItem('courses')) localStorage.removeItem('courses')
		}
		return Promise.resolve(response);
	}
	loginFail({response,formData}){
		const _ = this;
		let msg = response['error'];
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