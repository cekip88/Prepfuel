import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class DashboardModule extends StudentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'dashboardTabs',
			'body':'dashboardBody',
		};
	}


	async asyncDefine(){
		const _ = this;
		_.set({
			dashSchedule: await Model.getDashSchedule()
		});
	}
	
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
	//	G_Bus.on(_,['changeModule'])
	}
	/*async changeModule({item}){
		const _ = this;
		let
			module = item.getAttribute('module');
		let innerModule = await _.getModule({
			'pageName':'student',
			'name': module
		});
		let tpl = innerModule.render();
		_.renderPart({part:'header',content: _.markup(G.blocks.get('header').render('simple'),false)});
		_.renderPart({part:'header-tabs',content: []});
		_.renderPart({part:'body-tabs',content: []});
		_.renderPart({part:'body',content: _.markup(tpl,false)});
	}*/
	async init() {
		const _ = this;
		
	}
/*	render(params){
		const _ = this;
		//_.header = blocks['header'];

	//	_.headerBlock = params['blocks']['header'];
		_.fillModuleStucture();
	/!*	_.fillPartsPage(	[
			{ part:'body-tabs', content:_.markup(_.dashboardTabsTpl(),false)},
			{ part:'body', content: _.markup(initTpl,false)}]
		);*!/



	}*/
	
}