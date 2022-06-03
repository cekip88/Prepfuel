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
/*		_.set({
			currentPage: 1
		});
		_.maxPage = 3;*/
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


		//G_Bus.trigger('router','changePage',section);
		//_.renderPart({part:'body',content: _.markup(_[`${tpl}Tpl`](),false)});
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
		module.render({
			structure: _.pageStructure
		});
	}
	async init(blockData){
		const _ = this;
		_.createPageStructure(_.pageStructure);
		let
			initTpl = '',
			params = blockData['params'];
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params.length > 0){
			_.moduleRender(params);
		}

	}
	
}

export { StudentPage }