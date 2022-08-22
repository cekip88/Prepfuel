export const parentView = {
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
	simpleHeader(){
		const _ = this;
		return _.headerBlock.render('simple');
	},
	studentTabs(){
		const _ = this;
		return `
			<section class="navigate" data-active=".navigate-item:nth-child(1)" data-tabs=".dashboard-tabs">
				<div class="section">
					<nav class="navigate-list" data-click="StudentPage:navigate">
						<button class="navigate-item dashboard" data-click="StudentPage:changeSection;StudentPage:navigate" section="/parent/dashboard"><span>Student Academic Profile</span></button>
						<button class="navigate-item practice" data-click="StudentPage:changeSection;StudentPage:navigate" section="/parent/students"><span>Students</span></button>
						<div class="navigate-label" style="left: 15px;">
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