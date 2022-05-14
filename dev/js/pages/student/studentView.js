export const studentView = {
	// methods to navigate blocks from main nav and sub main nav
	navigationInit(list) {
		const _ = this;
		if (!list) return;
		setTimeout( ()=>{
			_.setActiveNavItem(list);
		},100)
		window.addEventListener('resize',()=>{
			let activeBtn = list.querySelector('.active');
			if (activeBtn) _.showActiveNavItem(activeBtn,list);
		})
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
			container = list.closest('.navigate'),
			activeItemSelector = container.getAttribute('data-active'),
			newActiveBtn = list.querySelector(activeItemSelector),
			activeBtn = list.querySelector('.active');
		if (newActiveBtn) {
			container.removeAttribute('data-active');
			_.navigate({item:list, event:{target:newActiveBtn}})
		} else if (activeBtn){
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
	showActiveNavItem(btn,list){
		let
			width = btn.clientWidth,
			x = btn.offsetLeft,
			label = list.querySelector('.navigate-label');
		label.style = `display:block;width: ${width}px;left: ${x}px;`;
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
	tabsTpl(){
			const _ = this;
			return `
				<section class="navigate" data-active=".navigate-item:nth-child(1)" data-tabs=".dashboard-tabs">
					<div class="section">
						<nav class="navigate-list" data-click="${_.componentName}:changeSection;${_.componentName}:navigate;">
							<button class="navigate-item active" section="/student/dashboard"><span>Dashboard</span></button>
							<button class="navigate-item" section="/student/practice"><span>Practice</span></button>
							<button class="navigate-item" section="/student/tests"><span>Tests</span></button>
							<button class="navigate-item" section="/student/review"><span>Review</span></button>
							<button class="navigate-item" section="/student/bookmarks"><span>Bookmarks&Notes</span></button>
							<button class="navigate-item" section="/student/tips"><span>Tips&Strategies</span></button>
							<div class="navigate-label" style="width: 210px;left: 15px;">
								<div class="navigate-label-left"></div>
								<div class="navigate-label-right"></div>
							</div>
						</nav>
						</div>
					<div class="subnavigate">
            <div class="section">
              <button class="subnavigate-button active"><span>Overview</span></button>
              <button class="subnavigate-button"><span>Tutoring Sessions</span></button>
              <button class="subnavigate-button"><span>Recent Activity</span></button>
              <button class="subnavigate-button"><span>Achievements</span></button>
            </div>
          </div>
				</section>
			`;
		},
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
					<button class="button-blue" data-click="${_.componentName}:changeSection;" section="/student/create-schedule" ><span>Choose your practice schedule</span></button>
				</div>
			</div>
`;
	}
	
}