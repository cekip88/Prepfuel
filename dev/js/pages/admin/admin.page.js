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
		if(section) history.pushState(null, null, section);
		_.moduleRender([tpl]);
	}
	async moduleRender(params){
		const _ = this;
		let module = await _.getModule({
			'pageName':'admin',
			'name': params[0],
			'structure':_.pageStructure
		});
		//module.headerBlock = _.header;
		if(!module._$){
			module._$ = {};
		}
		Object.assign(module._$,_._$);
		return Promise.resolve(module.render({
			structure: _.pageStructure,
		}));
	}
	
	async init(blockData) {
		const _ = this;
		let
			params = blockData['params'];
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params.length > 0){
			await _.moduleRender(params);
		}

		setTimeout(()=>{
			_.navigationInit();
		},350)
		// this._( callback );
		
	}
	
}