import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";

class StudentPage extends G{
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
	
	getHeaderType(route){
		const _ = this;
		let
			headerType = 'full',
			routesWithoutHeader = ['schedule'];
		if(routesWithoutHeader.indexOf(route) > -1){
			headerType = 'simple';
		}
		return headerType;
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
	changeSection({item}){
		const _ = this;
		let
			section = item.getAttribute('section'),
			tpl = section.split('/')[2];
		if(section) history.pushState(null, null, section);
		_.renderPart({part:'body',content: _.markup(_[`${tpl}Tpl`](),false)});
	}
	
	
	
	
	async render(blockData){
		const _ = this;
		let
			initTpl = _.dashboardTpl(),
			params = blockData['params'];
		_.header = await _.getBlock({name:'header'},'blocks')
		let type = _.getHeaderType(params[0]);
		let parts = [
			{ part:'header', content:_.markup(_.header.render(type),false)},
		];
		if(type == 'full'){
			parts.push(	{ part:'header-tabs', content:_.markup(_.tabsTpl(),false)});
		}
		
		

		if(params.length > 0){
			let module = await _.getModule({
				'pageName':'student',
				'name': params[0]
			});
			initTpl = module.render();
		}
		parts.push({ part:'body', content: _.markup(initTpl,false)});
		
		
		_.fillPartsPage(parts);
		
		_.navigationInit(document.querySelector('.navigate-list'));
	}
	
	
	init(){
		const _ = this;
		
	}
	
}

export { StudentPage }