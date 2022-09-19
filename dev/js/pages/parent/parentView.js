export const parentView = {
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
						<button class="navigate-item dashboard" data-click="ParentPage:changeSection;ParentPage:navigate" section="/parent/dashboard"><span>Student Academic Profile</span></button>
						<button class="navigate-item practice" data-click="ParentPage:changeSection" section="/parent/students"><span>Students</span></button>
						<div class="navigate-label">
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