import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";

class HeaderBlock extends G{
	define(){
		const _ = this;
		_.componentName = 'header';
		_.me = JSON.parse(localStorage.getItem('me'));
		_.set({
			firstName: _.me['parent'] ? _.me['parent']['user']['firstName'] : _.me['firstName'],
			lastName: _.me['parent'] ? _.me['parent']['user']['lastName'] : _.me['lastName'],
			role: _.me['parent'] ? _.me['parent']['user']['role'] : _.me['role'],
		});
		G_Bus
			.on(_,['showUserList','rerender','fullHeader'])
	}
	showUserList({item}) {
		const _ = this;
		item.classList.toggle('show');
	}
	init(){
		const _ = this;
	}
	rerender(){
		const _ = this;
		let header = _.f('G-HEADER');
		_.me = JSON.parse(localStorage.getItem('me'));
		_._$.firstName = _.me['parent'] ? _.me['parent']['user']['firstName'] : _.me['firstName'];
		_._$.lastName = _.me['parent'] ? _.me['parent']['user']['lastName'] : _.me['lastName'];
		_._$.role = _.me['parent'] ? _.me['parent']['user']['role'] : _.me['role'];
		let tpl = _.fullHeader();
		header.innerHTML = tpl;
	}
	fullHeader(){
		const _ = this;
		let tpl = `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo">
						<img src="/img/logo.svg" alt="">
					</a>
					<div class="head-control">
					`;
		if (_._$.role === 'student') {
			tpl += `
						<a class="head-button" href="./studentDashboard.html">
							<svg>
								<use xlink:href="/img/sprite.svg#bell"></use>
							</svg>
						</a>
						<button class="head-button">
							<svg>
								<use xlink:href="#chat"></use>
							</svg>
						</button>`;
		}
		let courses = localStorage.getItem('courses');
		if (courses) {
			courses = JSON.parse(courses);
			let coursesArr = [],index = 0;
			for (let course of courses) {
				let data = {
					text: `${course.course.title} ${course.level.title.split(' ')[0]}`,
					value: course.level._id
				};
				if (!index) {
					data.active = true;
					index++;
				}
				coursesArr.push(data);
			}
			if (coursesArr.length) {
				tpl += `
					<div class="head-select-block"><span>Course</span>
						<g-select 
							${coursesArr.length === 1 ? 'disabled' : ''}
							class="g-select select head-select" 
							classname="head-select" 
							items='${JSON.stringify(coursesArr)}'
						></g-select>
					</div>
				`;
			}
		}
		let profileTitle = 'Profile';
		if (this._$.role == 'student') profileTitle = 'My Profile';
		else if (this._$.role == 'parent') profileTitle = 'Account Settings';
		tpl += `
						<div class="head-info">
							<span class="head-name">${this._$.firstName}</span>
							<span class="head-position">${this._$.role}</span>
						</div>
						<button class="head-user" data-click="${_.componentName}:showUserList">
							<span>${this._$.firstName[0].toUpperCase()}</span>
							<span class="head-user-list">
								<strong data-click="StudentPage:changeSection" section="/student/profile">${profileTitle}</strong>
								${this._$.role == 'parent' ? '<strong data-click="Dashboard:changeSection" section="/parent/billing_history">Billing History</strong>' : ''}
								<strong data-click="router:logout">Log Out</strong>
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>`;
		return tpl;
	}
	simpleHeader(){
		return `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo" style="margin: auto">
						<img src="/img/logo.svg" alt="">
					</a>
				</div>
			</div>
		</header>`;
	}
	
	render(type = 'full'){
		return this[`${type}Header`]();
	}
}
export { HeaderBlock }