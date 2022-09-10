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
			"Practice":'#FFA621',
			"Practice test":'#009EF6',
			'SHSAT':'#4AB58E',
			'SSAT':'#4AB58E',
			'ISEE':'#4AB58E',
		};
		_.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		G_Bus
		.on(_,['domReady','deleteSchedule','showCalendar']);
	}
	async deleteSchedule({item}){
		const _ = this;
		let response = await Model.deleteSchedule();
		if (response.status == 'success') {
			await _.fillScheduleBlock()
		}
	}
	
	
	async domReady() {
		const _ = this;
		_.navigationInit();
		if( _.subSection === 'overview' ){
			_.fillScheduleBlock();
		}
	}
	

	// Show methods
	async fillScheduleBlock(){
		const _ = this;
		let scheduleList = document.querySelector('#scheduleList');
		_.clear(scheduleList);
		scheduleList.classList.add('loader-parent');
		scheduleList.append(_.markup(`<img src="/img/loader.gif">`))

		let scheduleCont = scheduleList.closest('#scheduleCont');
		let schedule = await Model.getDashSchedule();
		let scheduleButtons = _.f('.block-title-control button');
		let scheduleFooter = scheduleList.nextElementSibling;
		_.clear(scheduleList);
		let calendar = scheduleCont.querySelector('.calendar');
		if (calendar) calendar.remove();

		if (_.isEmpty(schedule)) {
			scheduleButtons.forEach(function (item){item.setAttribute('style','display:none;')});
			scheduleFooter.classList.add('schedule-hidden');
			scheduleList.append(_.markup(`<li class="block-empty-text">The practice schedule has not been created yet.</li>`))
		} else {
			scheduleButtons.forEach(function (item){item.removeAttribute('style')});
			scheduleFooter.classList.remove('schedule-hidden');
			let scheduleTpl = _.scheduleBlock(schedule);
			scheduleList.append(_.markup(scheduleTpl));
			_.practiceCalendar(scheduleCont);
		}
		scheduleList.classList.remove('loader-parent');
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
				info = `<div class="info">Day${item['daysLeft'] == 1 ? '' : 's'} until ${item.title}</div>`
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
	showCalendar({item}){
		const _ = this;
		let calendar = item.closest('#scheduleCont').querySelector('.calendar');
		if (item.classList.contains('active')) {
			item.classList.remove('active');
			calendar.classList.remove('active');
		} else {
			item.classList.add('active');
			calendar.classList.add('active');
		}
	}
	// end show methods


	async practiceCalendar(cont){
		const _ = this;
		let schedule = await Model.getSchedule();
		console.log(schedule)
		let dates = _.calendarDatesPrepare(schedule);
		console.log(dates)


		let tpl = _.calendarTpl();
		for (let date of dates.months) {
			tpl += _.calendarMonthTpl(date,schedule,dates);
		}
		tpl += `
			</div>`;
		cont.append(_.markup(tpl))
	}
	calendarDatesPrepare(schedule){
		const _ = this;
		let curDate = new Date();
		let dates = {
			currentDate: {
				date: curDate,
				timeStamp: curDate.getTime(),
			},
			monthsTitles: ['January','February','March','April','May','June','July','August','September','October','November','December'],
			months: [],
			practiceTests: [],
		};

		let curMonth = dates.currentDate.date.getMonth() + 1;
		let curDateDay = dates.currentDate.date.getDate();
		let startDateStr = dates.currentDate.date.getFullYear().toString() + '-' + (curMonth < 10 ? '0' + curMonth : curMonth) + '-' + (curDateDay < 10 ? '0' + curDateDay : curDateDay);
		dates.startDate = {date: new Date(startDateStr)};
		dates.startDate.timeStamp = dates.startDate.date.getTime();

		let endDate,endDateType;
		if (schedule.testDate) {
			endDate = new Date(schedule.testDate);
			endDateType = 'final';
		} else {
			endDate = new Date(schedule.practiceTests[schedule.practiceTests.length - 1].date);
			endDateType = 'practice'
		}
		dates.endDate = {date: endDate,type: endDateType};
		dates.endDate.timeStamp = dates.endDate.date.getTime();
		dates.endDate.dateStr = endDate.getFullYear().toString() + '-' + (endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1) + '-' + (endDate.getDate() + 1 < 10 ? '0' + endDate.getDate() : endDate.getDate())

		let timeStamp = dates.startDate.timeStamp;
		let itemMonth = dates.startDate.date.getMonth() + 1;
		let itemYear = dates.startDate.date.getFullYear();
		while(timeStamp < dates.endDate.timeStamp) {
			let itemDate = new Date(itemYear + '-' + itemMonth + '-' + '01');
			timeStamp = itemDate.getTime();
			let dateData = {
				date: itemDate,
				timeStamp: itemDate.getTime(),
				length: _.getMonthLength(itemMonth,itemYear)
			};
			itemMonth++;
			if (itemMonth == 13) {
				itemMonth = 1;
				itemYear++;
			}
			if (itemMonth < 10) itemMonth = '0' + itemMonth;
			dates.months.push(dateData);
		}
		dates.months.splice(dates.months.length - 1);

		for (let key in schedule.practiceTests) {
			let practiceTestDate = schedule.practiceTests[key].date.split('T')[0];
			dates.practiceTests.push(practiceTestDate);
		}
		return dates;
	}
	getMonthLength(month,year){
		let long = [1,3,5,7,8,10,12];
		if (long.indexOf(parseInt(month)) >= 0) {
			return 31;
		} else if (parseInt(month) === 2) {
			return year % 4 ? 28 : 29;
		}
		return 30;
	}

	async init() {
		const _ = this;
	}
	
}