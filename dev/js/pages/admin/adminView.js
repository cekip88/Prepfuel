export const adminView = {
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
			route = location.pathname.split('/')[2],
			container = list.closest('.navigate'),
			activeItemSelector = container.getAttribute('data-active'),
			newActiveBtn = list.querySelector(`.${route}`),
			activeBtn = list.querySelector('.active');
		if(!newActiveBtn) {
			_.f('.navigate-label').style = `display:block;width: 0px;left: 999999px;`;
		}
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
	showActiveNavItem(btn){
		let
			width = btn.clientWidth,
			x = btn.offsetLeft,
			label = this.f('.navigate-label');
		if(!label) return void 'Navigate label not found';
		label.style = `opacity:1;width: ${width}px;left: ${x}px;`;
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
	fullHeader(){
		const _ = this;
		//console.log(_._$,_);
		return `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo" href="/">
						<img src="/img/logo.svg" alt="">
					</a>
					<div class="head-control">
						<div class="head-info">
							<span class="head-name">${this._$.firstName}</span>
							<span class="head-position">${this._$.role}</span>
						</div>
						<button class="head-user" data-click="AdminPage:showUserList">
							<span class="head-user-letter">${this._$.firstName[0].toUpperCase()}</span>
							<span class="head-user-list">
								<strong data-click="AdminPage:changeSection" section="/admin/profile">Profile</strong>
								<strong data-click="router:logout">Log Out</strong>
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>`;
	},
	adminTabs(){
		const _ = this;
		return `
			<section class="navigate" data-active=".navigate-item:nth-child(1)" data-tabs=".dashboard-tabs">
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
	
};