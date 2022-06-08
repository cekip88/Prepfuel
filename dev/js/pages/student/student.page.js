/**
	* @module StudentPage
**/
import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";
import GModaler         from "../../components/modaler/modaler.component.js";

class StudentPage extends G{
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
	define(){
		const _ = this;
		_.componentName = 'StudentPage';
		G_Bus
			.on(_,['changeSection','navigate'])
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
	showForm(id){
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: `#${id}`
		});
	}


	async moduleRender(params){
		const _ = this;
		let module = await _.getModule({
			'pageName':'student',
			'name': params[0],
			'structure':_.pageStructure
		});
		module.headerBlock = _.header;
		return Promise.resolve(module.render({
			structure: _.pageStructure
		}));
	}
	async init(blockData){
		const _ = this;
		let
			params = blockData['params'];
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params.length > 0){
			await _.moduleRender(params);
		}
		_.navigationInit(_.f('.navigate-list'))
	}
	
}

export { StudentPage }