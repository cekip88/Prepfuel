import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";

export class DashboardModule extends G{
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		G_Bus.on(_,['changeModule'])
	}
	async changeModule({item}){
		const _ = this;
		let
			module = item.getAttribute('module');
		let innerModule = await _.getModule({
			'pageName':'student',
			'name': module
		});
		let tpl = innerModule.render();
		_.renderPart({part:'header',content: _.markup(_.header.render('simple'),false)});
		_.renderPart({part:'header-tabs',content: []});
		_.renderPart({part:'dashboard-tabs',content: []});
		_.renderPart({part:'body',content: _.markup(tpl,false)});
	}
	async init() {
		const _ = this;
		let schedules = await Model.getSchedules();
		Model.getSchedule(schedules[0]['_id']);
		//6284be308e932a712a707192
	}
	render(blocks){
		const _ = this;
		let initTpl = _.dashboardTpl();
		_.header = blocks['header'];
		_.fillPartsPage(	[
			{ part:'dashboard-tabs', content:_.markup(_.dashboardTabsTpl(),false)},
			{ part:'body', content: _.markup(initTpl,false)}]
		);
	}
	
}