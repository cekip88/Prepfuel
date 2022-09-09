export const view = {
	dashboardBody(params){
		const _ = this;
		return `
			<div class="section">
				<div class="block student-main">
					<h1 class="main-title"><span>Today's goal</span><strong>Choose your practice schedule</strong></h1>
					<p class="student-main-text">
						Based on your test date, we'll put together a practice plan
						to ensure you're ready for the real deal.
					</p>
					<button class="button-blue" data-click="StudentPage:changeSection;" section="/student/schedule" ><span>Choose your practice schedule</span></button>
				</div>
			</div>
			<div class="section row">
				<div class="block col" id="scheduleCont">
					<div class="block-title-control">
						<h5 class="block-title"><span>Practice Schedule</span></h5>
						<button class="button" data-click="${_.componentName}:deleteSchedule"><span>Delete</span></button>
						<button class="button" data-click="${_.componentName}:editSchedule"><span>Edit</span></button>
					</div>
					<ul class="schedule-list loader-parent" id="scheduleList"></ul>
					${_.scheduleFooterTpl()}
				</div>
			</div>
		`;
	},
	dashboardBodyFilled(params){
		const _ = this;
		return `
			<div class="section">
				<div class="block student-main">
					<h1 class="main-title">
						<span>Today's practice complete</span>
						<strong>10 questions answered!</strong>
					</h1>
					<p class="student-main-text">
						Nice job completing today's practice.
						We'll see you again <strong>Monday at 5:00 PM.</strong>
					</p>
					<button class="button-blue" data-click="StudentPage:changeSection;" section="/student/schedule" ><span>Or continue practicing</span></button>
				</div>
			</div>
			<br><br>
		`;
	},
	scheduleBlock(dashSchedule){
		const _ = this;
		if (!dashSchedule) return null;
		let
			practiceDate = dashSchedule['practiceTest'] ? new Date(dashSchedule['practiceTest']['date']) : undefined,
			testDate = dashSchedule['test'] ? new Date(dashSchedule['test']['date']) : undefined;
		let tpl = ``;
		let itemsData = _.fillScheduleItemsTpl(dashSchedule);
		if (!itemsData || !itemsData.length) return;
		for (let item of itemsData) {
			//console.log(item)
			tpl += _.scheduleItemTpl(item);
		}
		return tpl;
	},
	scheduleItemTpl({title,count,info,item}){
		const _ = this;
		return `
			<li class="schedule-item">
				<h5 class="schedule-title"><span>${title}</span></h5>
				<div class="inner">
					<span class="count">${count}</span>
					${info}
					${_.drawCircleGraphic(item, _.scheduleColors[item.title])}
				</div>
			</li>
		`
	},
	calendarTpl(){
		const _ = this;
		let tpl = `
			<div class="calendar schedule">
				<div class="calendar-row">
					<div class="calendar-day">Su</div>
					<div class="calendar-day">Mo</div>
					<div class="calendar-day">Tu</div>
					<div class="calendar-day">We</div>
					<div class="calendar-day">Th</div>
					<div class="calendar-day">Fri</div>
					<div class="calendar-day">Sa</div>
				</div>`;
		return tpl;
	},
	calendarMonthTpl(dateInfo,schedule,dates){
		const _ = this;
		let days = ['s','m','t','w','th','f','sa'];
		let month = dateInfo.date.getMonth() + 1;
		let year = dateInfo.date.getFullYear();
		let dateStr = year.toString() + '-' + (month < 10 ? '0' + month : month) + '-';
		let curMonth = dates.currentDate.date.getMonth() + 1;
		let curYear = dates.currentDate.date.getFullYear();
		let curDate = dates.currentDate.date.getDate();
		let toShow = true;
		let pastDayFlag = dates.currentDate.timeStamp >= dateInfo.timeStamp;
		let currentDateStr = curYear.toString() + '-' + (curMonth < 10 ? '0' + curMonth : curMonth) + '-' + (curDate < 10 ? '0' + curDate : curDate);
		let tpl = `
			<div class="calendar-title">
				<span>${dates.monthsTitles[dateInfo.date.getMonth()]}</span>
			</div>
			<div class="calendar-inner">
		`;
		let firstDay = dateInfo.date.getDay();
		for (let i = 0; i < firstDay; i++) {
			tpl += '<div class="calendar-btn"></div>';
		}
		for(let i = 1; i <= dateInfo.length; i++) {
			let dateString = dateStr + (i < 10 ? '0' + i : i);
			let weekDay = days[(i - 1 + firstDay) % 7];
			if (dateString == currentDateStr) {
				pastDayFlag = false;
			}
			tpl += `<div class="calendar-btn${pastDayFlag ? ' fill' : ''}${dateString == currentDateStr ? ' current' : ''}"><span>${i}</span>`;
			if (dateString == dates.endDate.dateStr) {
				if (dates.endDate.type == 'practice') tpl += `<svg class="calendar-svg blue"><use xlink:href='#badge'></use></svg>`;
				else tpl += `<svg class="calendar-svg green"><use xlink:href='#badge'></use></svg>`;
				toShow = false;
			}
			if (toShow) {
				if (dates.practiceTests.indexOf(dateString) >= 0) tpl += `<svg class="calendar-svg blue"><use xlink:href='#badge'></use></svg>`;
				else if (schedule.practiceDays.indexOf(weekDay) >= 0) tpl += `<svg class="calendar-svg gold"><use xlink:href='#tablet'></use></svg>`;
			}
			tpl += `</div>`;
		}
		tpl += `</div>`;
		return tpl;
	},
	scheduleFooterTpl(){
		const _ = this;
		return `
			<div class="schedule-footer">
				<button class="schedule-footer-button" data-click="${_.componentName}:showCalendar">
					<span class="icon"><svg><use xlink:href="#calendar-transparent"></use></svg></span>
					<span class="text">Calendar</span>
					<span class="arrow"></span>
				</button>
				<button class="schedule-footer-button">
					<span class="icon"><svg><use xlink:href="#list"></use></svg></span>
					<span class="text">Schedule</span>
					<span class="arrow"></span>
				</button>
				<button class="schedule-footer-button last">
					<span class="icon"><svg><use xlink:href="#question"></use></svg></span>
					<span class="text">Practice Schedule FAQ</span>
				</button>
			</div>
		`
	},
	dashboardTabs(){
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active"><span>Overview</span></button>
					<button class="subnavigate-button"><span>Recent Activity</span></button>
					<button class="subnavigate-button"><span>Achievements</span></button>
				</div>
			</div>
		`;
	},
}