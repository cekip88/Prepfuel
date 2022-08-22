export const adminView = {
	navigationInit() {
		const _ = this;
		let list = _.f('.navigate-list'),
			label = _.f('.navigate-label');
		if (!list) return;
		_.setActiveNavItem(list);
		window.addEventListener('resize',()=>{
			let activeBtn = list.querySelector('.active');
			if (activeBtn) _.showActiveNavItem(activeBtn,list);
		})
		label.classList.add('active');
	},
	subnavigate(clickData){
		const _ = this;
		if (!clickData) return;
		let
		target = clickData.event.target,
		btn = _.ascent(target,'.subnavigate-button','subnavigate');
		
		_.changeActiveNavItem(btn);
	},
	setActiveNavItem(list){
		const _ = this;
		let
			route = location.pathname.split('/')[2],
			newActiveBtn = list.querySelector(`.${route}`),
			activeBtn = list.querySelector('.active'),
			label = this.f('.navigate-label');


		if(!newActiveBtn) {
			_.f('.navigate-label').style = `display:block;width: 0px;left: 999999px;`;
		}
		if (newActiveBtn) {
			label.style = `width: ${newActiveBtn.clientWidth}px;left:${newActiveBtn.offsetLeft}px;`
			_.navigate({item:list, event:{target:newActiveBtn}})
		} else if (activeBtn){
			label.style = `width: ${activeBtn.clientWidth}px;left:${activeBtn.offsetLeft}px;`
			_.navigate({item:list, event:{target:activeBtn}})
		}
	},
	changeActiveNavItem(item){
		const _ = this;
		let
			cont = item.parentElement,
			curItem = cont.querySelector('.active');
		_.removeCls(curItem,'active');
		item.classList.add('active')
	},
	showActiveNavItem(btn){
		let
			width = btn.clientWidth,
			x = btn.offsetLeft,
			label = this.f('.navigate-label');

		if(!label) return void 'Navigate label not found';
		label.style = `width: ${width}px;left: ${x}px;`
	},
	changeTab(btn,parentCls){
		const _ = this;
		let
			list = btn.parentElement.children,
			parent = btn.closest('.' + parentCls),
			targetSelector = parent.getAttribute('data-tabs'),
			tabsContainer = _.f(targetSelector);
		
		if (!targetSelector || !tabsContainer) return;
		
		_.removeCls(tabsContainer.querySelector(`${targetSelector}>.active`),'active');
		for (let i = 0; i < list.length; i++) {
			if (list[i] === btn && tabsContainer.children[i]) tabsContainer.children[i].classList.add('active');
		}
	},
	simpleHeader(){
		const _ = this;
		return _.headerBlock.render('simple');
	},

	adminTabs(){
		const _ = this;
		return `
			<section class="navigate" data-tabs=".dashboard-tabs">
				<div class="section">
					<nav class="navigate-list" data-click="AdminPage:navigate">
						<button class="navigate-item dashboard" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/dashboard"><span>Analytics Dashboard</span></button>
						<button class="navigate-item users" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/users"><span>Users</span></button>
						<button class="navigate-item courses" data-click="AdminPage:changeSection;AdminPage:navigate" section="/admin/courses"><span>Courses</span></button>
						<button class="navigate-item history" data-click="AdminPage:changeSection" section="/admin/history"><span>Billing history</span></button>
						<button class="navigate-item reports" data-click="AdminPage:changeSection" section="/admin/reports"><span>Reports</span></button>
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