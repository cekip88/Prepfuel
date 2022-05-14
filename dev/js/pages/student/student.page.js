import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";

class StudentPage extends G{
	define(){
		const _ = this;
		_.set({});
		_.componentName = 'StudentPage';
		
		G_Bus
			.on(_,'changeSection')
			.on(_,'navigate')
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
		let section = item.getAttribute('section'),
		part = (section == 'reset') ? 'row' : 'right';
		if(section == 'welcome'){
			_.welcomeTpl();
		}else
			_.renderPart({part:part,content: _.markup(_[`${section}Tpl`](),false)});
	}
	async render(blockData){
		const _ = this;
		let initTpl = _.dashboardTpl();
		let params = blockData['params'];
		if(params.length > 0){
			initTpl = _[`${params[0]}Tpl`](params);
		}
		
		
		
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPartsPage([
			{ part:'header', content:_.markup(_.header.render(),false)},
			{ part:'header-tabs', content:_.markup(_.tabsTpl(),false)},
			{ part:'body', content: _.markup(initTpl,false)}
		]);
		_.navigationInit(document.querySelector('.navigate-list'));
	}
}

export { StudentPage }