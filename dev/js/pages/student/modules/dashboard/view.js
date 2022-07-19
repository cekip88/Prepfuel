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
			testDate = new Date(dashSchedule['test']['date']),
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		let tpl = `
			${_.sectionHeaderTpl({
				title: '',
				buttons: [{'title':"delete"},{'title':'edit'}]
			})}
			<ul class="schedule-list">`;
		for (let key in dashSchedule) {
			let item = dashSchedule[key];
			tpl += `
				<li class="schedule-item">
					<h5 class="schedule-title"><span>Next Practice</span></h5>
					<div class="icon ${key}">
						${_.drawCircleGraphic(item,'yellow')}
						<span class="count">${item['daysLeft']}</span>
						<div class="info">
							<i>Day${item['daysLeft'] > 1 ? 's' : ''}</i>
							<span>until next practice</span>
						</div>
					</div>
				</li>`;
		}
		let testData = {'test1':{'daysLeft':1},'test2':{'daysLeft':2}};
		for (let key in testData) {
			let item = testData[key];
			tpl += `
				<li class="schedule-item">
					<h5 class="schedule-title"><span>Next Practice</span></h5>
					<div class="icon ${key}">
						${_.drawCircleGraphic(item,'yellow')}
						<span class="count">${item['daysLeft']}</span>
						<div class="info">
							<i>Day${item['daysLeft'] > 1 ? 's' : ''}</i>
							<span>until next practice</span>
						</div>
					</div>
				</li>`;
		}
		tpl += '</ul>';
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