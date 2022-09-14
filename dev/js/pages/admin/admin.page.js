import  {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { AdminModel } from "./adminModel.js";

export class AdminPage extends G {
	constructor() {
		super();
		this.pageStructure = {
			'header':{
				id:'',
				container: document.createElement('g-header')
			},
			'header-tabs':{
				id:'',
				container: document.createElement('g-header-tabs')
			},
			'body-tabs':{
				id:'',
				container: document.createElement('g-body-tabs')
			},
			'body':{
				id:'',
				container: document.createElement('g-body')
			},
			'footer': {
				id:'',
				container: document.createElement('g-footer')
			}
		};
	}
	define() {
		const _ = this;
		_.componentName = 'AdminPage';
		_.set({
			firstName: localStorage.getItem('firstName'),
			lastName: localStorage.getItem('lastName'),
			role: localStorage.getItem('role'),
		});
		
		G_Bus
			.on(_,['showUserList','changeSection','navigate','toProfile'])
	}
	asyncDefine(){
		const _ = this;

	}
	switchSubNavigate(){
		const _ = this;
		let cont = _.f('.subnavigate');
		if(!cont.querySelector(`[section="${_.subSection}"]`)) return 0;
		let activeItem = cont.querySelector('.active');
		if(activeItem) activeItem.classList.remove('active');
		cont.querySelector(`[section="${_.subSection}"]`).classList.add('active')
	}
	showUserList({item}) {
		const _ = this;
		item.classList.toggle('show');
	}

	async changeSection({item,event}){
		const _ = this;
		_.triggerAbortController()
		let
			section = item.getAttribute('section'),
			tpl = section.split('/')[2];
		if(_.currentSection == section) return void 0;
		if(section) history.pushState(null, null, section);
		await _.moduleRender({module:tpl});
		_.currentSection = section;
		return true;
	}
	async moduleRender(params){
		const _ = this;
		let module = await _.getModule({
			'pageName':'admin',
			'name': params['module'],
			'structure':_.pageStructure
		});
		if(!module._$){
			module._$ = {};
		}
		module.super_$ = _._$;
		module.abortControllers = _.abortControllers;
		return Promise.resolve(module.render());
	}
	createdAtFormat(value,format = 'month DD, YYYY'){
		if (!value) return 'No date'
		value = value.split('T')[0].split('-');
		let
			year = value[0],
			month = value[1],
			day = value[2],
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		
		let res = format;
		res = res.replace('DD',day)
		res = res.replace('MM',month)
		res = res.replace('YYYY',year)
		res = res.replace('month',months[parseInt(month) - 1]);
		return res;
	}
	fullHeader(){
		const _ = this;
		let tpl = G_Bus.trigger('header','fullHeader');
		return tpl;
	}
	async init(blockData) {
		const _ = this;
		let
			params = blockData['params'];
		if(blockData && blockData['params']){
			params = blockData['params'];
		}
		if(params['redirect']){
			await _.getMe();
		}
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params){
			await _.moduleRender(params);
			_.currentSection = '/admin/' + params['module'];
		}
	}

	showSuccessPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'green')));
		setTimeout(_.closePopup.bind(_),3000)
	}
	closePopup(clickData) {
		const _ = this;
		let label;
		if (clickData && clickData.item) label = clickData.item.closest('.label');
		else label = _.f('.label');
		if (label) label.remove();
	}
	showErrorPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'red')));
		setTimeout(_.closePopup.bind(_),3000);
	}

	async toProfile({item}){
		const _ = this;
		let btn = document.querySelector('.navigate-list [section="/admin/users"]');
		let methods = btn.getAttribute('data-click').split(';');
		for (let method of methods) {
			await G_Bus.trigger(_.componentName, method.split(':')[1], {item: btn});
		}

		let navBtn = document.querySelector('.subnavigate [section="admin"]');
		navBtn.parentElement.querySelector('.active').classList.remove('active');
		navBtn.classList.add('active');

		btn = document.createElement('BUTTON');
		btn.setAttribute('section','adminProfile');
		btn.setAttribute('data-id',item.getAttribute('data-id'));
		G_Bus.trigger('UsersModule','changeSection',{item:btn})
		item.closest('.head-user').classList.remove('show');
	}
}
