export const adminView = {
	navigationInit() {
		const _ = this;
		let list = _.f('.navigate-list');
		if (!list) return;
		_.setActiveNavItem(list);
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
		label.style = `opacity:1;width: ${width}px;left: ${x}px;transition: .35s ease`;
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
		return `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo" href="/">
						<img src="/img/logo.svg" alt="">
					</a>
					<div class="head-control">
						<div class="head-info">
							<span class="head-name">${this.super_$.firstName}</span>
							<span class="head-position">${this.super_$.role}</span>
						</div>
						<button class="head-user" data-click="AdminPage:showUserList">
							<span class="head-user-letter">${this.super_$.firstName[0].toUpperCase()}</span>
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
	sectionHeaderTpl({title,subtitle,buttonsData,gap = true}){
		let tpl = buttonsData ? `<div class="section-header ${gap ? 'block-gap' : ''}">` : '';
		
		if (!title && subtitle) {
			tpl += `<h6 class="admin-subtitle ${!buttonsData && gap ? "block-gap" : ''}"><span>${subtitle}</span></h6>`
		} else if (!subtitle && title) {
			tpl += `<h5 class="admin-title ${!buttonsData && gap ? "block-gap" : ''}"><span>${title}</span></h5>`
		} else if (title && subtitle) {
			tpl += `
				<div ${!buttonsData && gap ? 'class="block-gap"' : ''}>
					<h5 class="admin-title"><span>${title}</span></h5>
					<h6 class="admin-subtitle"><span>${subtitle}</span></h6>
				</div>
			`
		}
		
		if (buttonsData) {
			tpl += `<div class="section-buttons">`;
			let buttonAction = buttonsData.action, pos = 0;
			for(let button of buttonsData['buttons']){
				tpl += `<button ${buttonAction} class="section-button ${button['active'] ?? ''}" data-pos="${pos}"><span>${button['title']}</span></button>`;
				pos++;
			}
		/*	for (let key in buttons) {
				tpl += `<button class="section-button ${buttons[key]}"><span>${key}</span></button>`
			}*/
			tpl += '</div>';
		}
		
		tpl += buttonsData ? '</div>' : '';
		return tpl
	},
};