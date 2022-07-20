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
		_.scheduleColors = {
			'practiceTest':'#FFA621',
			'test':'#009EF6',
			'ISEE':'#4AB58E',
			'skillTest':'#4AB58E',
		};
		G_Bus
		.on(_,['domReady','deleteSchedule']);
	}
	async deleteSchedule({item}){
		const _ = this;
		let response = await Model.deleteSchedule();
		console.log(response);
	}
	
	
	async domReady() {
		const _ = this;
		if( _.subSection === 'overview' ){
			_.fillScheduleBlock();
		}
	}
	

	// Show methods
	async fillScheduleBlock(){
		const _ = this;
		let schedule =  await Model.getDashSchedule();
		console.log(schedule);
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
			radius = 67,
			daysLeft = item['daysLeft'] <= 0 ? 0 : item['daysLeft'],
			circleWidth = 2 * Math.PI * radius,
			width = daysLeft > 10 ? 0 : circleWidth - (daysLeft / 10 * circleWidth),
			strokeDasharray = `${width} ${circleWidth - width}`;

		svg = `<circle style="stroke:${color}" stroke-dasharray="${strokeDasharray}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = `<circle style="opacity: .2;stroke:${color}" stroke-dasharray="${circleWidth} 0" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		return svg;
	}
	// end show methods
	

	async init() {
		const _ = this;
		
	}
	
}