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
		for (let item of itemsData) {
			if (!item) continue;
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
	scheduleFooterTpl(){
		const _ = this;
		return `
			<div class="schedule-footer">
				<button class="schedule-footer-button active">
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