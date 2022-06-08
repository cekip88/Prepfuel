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
		return _.headerBlock.render('full');
	},
	studentTabs(){
		const _ = this;
		return `
			<section class="navigate" data-active=".navigate-item:nth-child(1)" data-tabs=".dashboard-tabs">
				<div class="section">
					<nav class="navigate-list" data-click="StudentPage:navigate">
						<button class="navigate-item dashboard" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/dashboard"><span>Dashboard</span></button>
						<button class="navigate-item practice" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/practice"><span>Practice</span></button>
						<button class="navigate-item tests" data-click="StudentPage:changeSection;StudentPage:navigate" section="/student/tests"><span>Tests</span></button>
						<button class="navigate-item review" data-click="StudentPage:changeSection" section="/student/review"><span>Review</span></button>
						<button class="navigate-item bookmarks" data-click="StudentPage:changeSection" section="/student/bookmarks"><span>Bookmarks&Notes</span></button>
						<button class="navigate-item tips" data-click="StudentPage:changeSection" section="/student/tips"><span>Tips&Strategies</span></button>
						<div class="navigate-label" style="width: 210px;left: 15px;">
							<div class="navigate-label-left"></div>
							<div class="navigate-label-right"></div>
						</div>
					</nav>
					</div>
			</section>
			`;
	},
}