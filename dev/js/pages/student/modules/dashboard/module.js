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
			"skill test":'#FFA621',
			"practice test":'#009EF6',
			'isee':'#4AB58E',
		};
		_.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
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
		_.navigationInit();
		if( _.subSection === 'overview' ){
			_.fillScheduleBlock();
		}
	}
	

	// Show methods
	/*async fillScheduleBlock(){
		const _ = this;
		let
			schedule = await Model.getDashSchedule(),
			scheduleList = document.querySelector('#scheduleList');
		_.clear(scheduleList)

		let scheduleTpl = _.scheduleBlock(schedule);
		scheduleList.append(_.markup(scheduleTpl))
	}*/
	async fillScheduleBlock(){
		console.log('fillScheduleBlock')
		const _ = this;
		let
			list = document.querySelector('#scheduleList'),
			footer = list.nextElementSibling;

		list.classList.add('loader-parent');
		list.append(_.markup(`<img src="/img/loader.gif">`))

		let scheduleData = await Model.getSchedule();
		_.clear(list);

		if (_.isEmpty(scheduleData)) {
			footer.classList.add('schedule-hidden');
			list.append(_.markup(`<li class="block-empty-text">Student has not created the practice schedule yet.</li>`))
		} else {
			footer.classList.remove('schedule-hidden');
			let tpl = _.scheduleBlock(scheduleData);
			list.append(_.markup(tpl));
		}
		list.classList.remove('loader-parent');
	}
	drawCircleGraphic(item,color){
		const _ = this;
		let
			svg = `</svg>`,
			radius = 67,
			progress = item['progressBar'],
			circleWidth = 2 * Math.PI * radius,
			width = (progress / 100 * circleWidth),
			strokeDasharray = `${width} ${circleWidth - width}`;

		svg = `<circle style="stroke:${color}" stroke-dasharray="${strokeDasharray}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = `<circle style="opacity: .2;stroke:${color}" stroke-dasharray="${circleWidth} 0" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		return svg;
	}
	fillScheduleItemsTpl(dashSchedule){
		const _ = this;
		let schData = [
			dashSchedule['skillTest'],
			dashSchedule['practiceTest'],
			dashSchedule['test'],
		];
		let data = [];
		for (let item of schData) {
			if (!item) continue;
			let title = `Next ${item.title}`;
			let info = '', count = '';


			if (item['title'] === 'isee') {
				title = 'Your ISEE Date';
			}
			if (item['title'] === 'skill test') {
				title = 'Next practice';
			}
			if (item['title'] === "practice test") {
				title = 'Next Practice Test';
			}


			if (item['daysLeft'] <= 0) {
				count = 'Today';
				if (item['title'] === 'isee') {
					info = '<div class="info">Good luck</div>';
				}
			} else {
				count = item['daysLeft'];
				if (item['title'] === 'isee') {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until ISEE test
						</div>`
				}
				if (item['title'] === 'skill test') {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until next practice
						</div>`
				}
				if (item['title'] === "practice test") {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until next practice test
						</div>`
				}
			}
			data.push({info,count,item,title});
		}
		return data;
	}
	// end show methods
	

	async init() {
		const _ = this;
	}
	
}