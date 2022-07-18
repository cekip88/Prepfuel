import {G_Bus} from "../../../../libs/G_Control.js";
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
	/*	_.set({
			dashSchedule: await Model.getDashSchedule()
		});*/
	}
	
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.subSection = 'overview';
		G_Bus
			.on(_,['domReady']);
	}
	async domReady() {
		const _ = this;
		if(_.subSection == 'overview'){
			let schedule =  await Model.getDashSchedule();
			console.log(schedule);
		}
		
	}
	async init() {
		const _ = this;
		
	}
	
}