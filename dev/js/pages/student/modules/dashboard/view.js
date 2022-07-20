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
					<img src="/img/loader.gif">
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
		let
			practiceDate = dashSchedule['practiceTest'] ? new Date(dashSchedule['practiceTest']['date']) : undefined,
			testDate = dashSchedule['test'] ? new Date(dashSchedule['test']['date']) : undefined,
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		let tpl = `
			<div class="block-title-control">
				<h5 class="block-title"><span>Practice Schedule</span></h5>
				<button class="button" data-click="${_.componentName}:deleteSchedule"><span>Delete</span></button>
				<button class="button" data-click="${_.componentName}:editSchedule"><span>Edit</span></button>
			</div>
			<ul class="schedule-list">`;
		//dashSchedule = {'practice': {'daysLeft':2},'ISEE': {'daysLeft':14}}
		for (let key in dashSchedule) {
			let item = dashSchedule[key];
			let title = `Next ${dashSchedule[key].title}`;
			if (key == 'practice') title += ' practice';
			if (key == 'test') title = 'Your ISEE Date';
			tpl += `
				<li class="schedule-item">
					<h5 class="schedule-title"><span>${title}</span></h5>
					<div class="icon ${key}">
						${_.drawCircleGraphic(item,_.scheduleColors[key])}
						<span class="count">${item['daysLeft']}</span>
						<div class="info">
							<i>Day${item['daysLeft'] == 1 ? '' : 's'}</i>
							<span>until next practice</span>
						</div>
					</div>
				</li>`;
		}
		tpl += `
			</ul>
			<div class="schedule-footer">
				<button class="schedule-footer-button">
					<span class="icon"><svg><use xlink:href="#calendar-transparent"></use></svg></span>
					<span class="text">Calendar</span>
					<span class="arrow"></span>
				</button>
			</div>
		`;
		return tpl;
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