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
			.on(_,['showUserList','changeSection','navigate'])
	}
	asyncDefine(){
		const _ = this;

	}
	switchSubNavigate(){
		const _ = this;
		let cont = _.f('.subnavigate');
		if(!cont.querySelector(`[section="${_.subSection}"]`)) return 0;
		if(cont.querySelector('.active'))	cont.querySelector('.active').classList.remove('active');
		cont.querySelector(`[section="${_.subSection}"]`).classList.add('active')
	}
	showUserList({item}) {
		const _ = this;
		item.classList.toggle('show');
	}
	navigate(clickData){
		const _ = this;
		let
			list = clickData.item,
			target = clickData.event.target,
			btn = _.ascent(target,'.navigate-item','navigate-list');
		_.showActiveNavItem(btn,list);
		_.changeActiveNavItem(btn);
	}
	changeSection({item,event}){
		const _ = this;
		let
			section = item.getAttribute('section'),
			tpl = section.split('/')[2];
		if(_.currentSection == section) return void 0;
		if(section) history.pushState(null, null, section);
		_.moduleRender([tpl]);
		_.currentSection = section;
	}
	async moduleRender(params){
		const _ = this;
		let module = await _.getModule({
			'pageName':'admin',
			'name': params[0],
			'structure':_.pageStructure
		});
		if(!module._$){
			module._$ = {};
		}
		module.super_$ = _._$;
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
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params.length > 0){
			await _.moduleRender(params);
			_.currentSection = '/admin/' + params[0];
		}

		setTimeout(()=>{
			_.navigationInit();
		},1500)
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
}