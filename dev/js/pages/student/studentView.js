export const studentView = {
	// methods to navigate blocks from main nav and sub main nav
	simpleHeader(){
		const _ = this;
		return _.headerBlock.render('simple');
	},
	studentTabs(){
		const _ = this;
		return `
			<section class="navigate" data-active=".navigate-item:nth-child(1)" data-tabs=".dashboard-tabs">
				<div class="section">
					<nav class="navigate-list">
						<button class="navigate-item dashboard" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/dashboard"><span>Dashboard</span></button>
						<button class="navigate-item practice" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/practice"><span>Practice</span></button>
						<button class="navigate-item tests" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/tests"><span>Tests</span></button>
						<button class="navigate-item review" data-click="StudentPage:changeSection" section="/student/review"><span>Review</span></button>
						<button class="navigate-item bookmarks" data-click="StudentPage:changeSection" section="/student/bookmarks"><span>Bookmarks&Notes</span></button>
						<button class="navigate-item tips-button" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/tips"><span>Tips&Strategies</span></button>
						<div class="navigate-label">
							<div class="navigate-label-left"></div>
							<div class="navigate-label-right"></div>
						</div>
					</nav>
				</div>
			</section> 
		`;
	},
}