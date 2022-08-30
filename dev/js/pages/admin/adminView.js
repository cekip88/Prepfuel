export const adminView = {
	simpleHeader(){
		const _ = this;
		return _.headerBlock.render('simple');
	},
	adminTabs(){
		const _ = this;
		return `
			<section class="navigate" data-tabs=".dashboard-tabs">
				<div class="section">
					<nav class="navigate-list">
						<button class="navigate-item dashboard" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/dashboard"><span>Analytics Dashboard</span></button>
						<button class="navigate-item users" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/users"><span>Users</span></button>
						<button class="navigate-item courses" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/courses"><span>Courses</span></button>
						<button class="navigate-item history" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/history"><span>Billing history</span></button>
						<button class="navigate-item reports" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/reports"><span>Reports</span></button>
						<div class="navigate-label" style="width: 210px;left: 15px;">
							<div class="navigate-label-left"></div>
							<div class="navigate-label-right"></div>
						</div>
					</nav>
					</div>
			</section>
			`;
	},
	successPopupTpl(text,color){
		const _ = this;
		return `
			<div class="success-label label ${color}">
				<svg><use xlink:href="#checkmark-reverse"></use></svg>
				<span>${text}</span>
				<button data-click="${_.componentName}:closePopup">
					<svg><use xlink:href="#close-transparent"></use></svg>
				</button>
			</div>`
	},
};