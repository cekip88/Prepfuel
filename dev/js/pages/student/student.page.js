import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";
import GModaler         from "../../components/modaler/modaler.component.js";

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

		_.showForm('schedule-result')
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
		G_Bus.trigger('router','changePage',section);
		//_.renderPart({part:'body',content: _.markup(_[`${tpl}Tpl`](),false)});
	}
	showForm(id){
		this.f(`#${id}`).reset();
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: `#${id}`
		});
	}
	
	async render(blockData){
		const _ = this;
		let
			initTpl = '',
			params = blockData['params'];
		_.header = await _.getBlock({name:'header'},'blocks')
		let parts = [
			{ part:'header', content:_.markup(_.header.render('full'),false)},
		];
		parts.push(	{ part:'header-tabs', content:_.markup(_.tabsTpl(),false)});
		_.fillPartsPage(parts,true);
		if(params.length > 0){
			let module = await _.getModule({
				'pageName':'student',
				'name': params[0]
			});
			initTpl = module.render({
				header: _.header
			});
		}
		
		_.navigationInit(document.querySelector('.navigate-list'));
	}
	
	
	init(){
		const _ = this;
		
	}
	
}

export { StudentPage }