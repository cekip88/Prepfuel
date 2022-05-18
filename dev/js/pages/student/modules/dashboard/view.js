export const view = {
	dashboardTpl(params){
		const _ = this;
		return `
			<div class="section">
				<div class="block student-main">
					<h1 class="main-title"><span>Today's goal</span><strong>Choose your practice schedule</strong></h1>
					<p class="student-main-text">
						Based on your test date, we'll put together a practice plan
						to ensure you're ready for the real deal.
					</p>
					<button class="button-blue" data-click="${_.componentName}:changeModule;" module="schedule" ><span>Choose your practice schedule</span></button>
				</div>
			</div>
	`;
	},
	
	dashboardTabsTpl(){
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active"><span>Overview</span></button>
					<button class="subnavigate-button"><span>Tutoring Sessions</span></button>
					<button class="subnavigate-button"><span>Recent Activity</span></button>
					<button class="subnavigate-button"><span>Achievements</span></button>
				</div>
			</div>
		`;
	}
}