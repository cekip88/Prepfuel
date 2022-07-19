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

	// Show methods
	async fillScheduleBlock(){
		const _ = this;
		let schedule =  await Model.getDashSchedule();
		let
			scheduleTpl = _.scheduleBlock(schedule),
			scheduleCont = document.querySelector('#scheduleCont');
		_.clear(scheduleCont)
		scheduleCont.append(_.markup(scheduleTpl))
	}
	drawCircleGraphic(item,color){
		const _ = this;
		let
			svg = `</svg>`,
			radius = 67;

		let circleWidth = 2 * Math.PI * radius;
		let width = circleWidth - (item['daysLeft'] / 10 * circleWidth);
		let strokeDasharray = `${width} ${circleWidth - width}`;
		svg = `<circle class="${color}" stroke-dasharray="${strokeDasharray}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = `<circle style="opacity: .2;" class="${color}" stroke-dasharray="${circleWidth} 0" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		return svg;
	}
	// end show methods
	
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
			_.fillScheduleBlock();
		}
		
	}
	async init() {
		const _ = this;
		
	}
	
}