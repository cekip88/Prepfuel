import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";

class HeaderBlock extends G{
	define(){
		const _ = this;
		_.componentName = 'header';
		_.me = JSON.parse(localStorage.getItem('me'));
		let userType= 'parent';
		_.set({
			firstName: _.me[userType] ? _.me[userType]['user']['firstName'] : _.me['firstName'],
			lastName: _.me[userType] ? _.me[userType]['user']['lastName'] : _.me['lastName'],
			role: _.me[userType] ? _.me[userType]['user']['role'] : _.me['role'],
		});
		G_Bus
			.on(_,['showUserList','rerender','fullHeader','changeTitle']);
	}
	showUserList({item}) {
		const _ = this;
		item.classList.toggle('show');
	}
	init(){
		const _ = this;
		_.changeTitle();
	}
	changeTitle(){
		const _ = this;
		let
			paths = location.pathname.split('/'),
			last = paths[paths.length - 1];
		document.title = 'Prepfuel - ' + last[0].toUpperCase() + last.substr(1);
	}
	rerender(){
		const _ = this;
		let header = _.f('G-HEADER');
		_.me = JSON.parse(localStorage.getItem('me'));
		let userType= 'parent';
		_._$.firstName = _.me[userType] ? _.me[userType]['user']['firstName'] : _.me['firstName'];
		_._$.lastName = _.me[userType] ? _.me[userType]['user']['lastName'] : _.me['lastName'];
		_._$.role = _.me[userType] ? _.me[userType]['user']['role'] : _.me['role'];
		let tpl = _.fullHeader();
		header.innerHTML = tpl;
	}
	fullHeader(){
		const _ = this;
		if (!this._$.firstName) this._$.firstName = _._$.me.firstName;
		if (!this._$.role) this._$.role = _._$.me.role;

		let tpl = `<header class="head">
			<div class="section">
				<div class="head-row">
					<div class="head-logo">
						<img src="/img/logo.svg" alt="">
					</div>
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
		let id,profileButton;
		if (this._$.role == 'admin'){
			id = _.me.admin._id;
			profileButton = `<strong data-click="AdminPage:toProfile" data-id="${id}">Profile</strong>`;
		} if (this._$.role == 'student') {
			profileButton = `<strong>My Profile</strong>`;
		} else if (this._$.role == 'parent') {
			profileButton = `<strong>Account Settings</strong>`;
		}

		tpl += `
						<div class="head-info">
							<span class="head-name">${this._$.firstName}</span>
							<span class="head-position">${this._$.role}</span>
						</div>
						<button class="head-user" data-click="${_.componentName}:showUserList">
							<span>${this._$.firstName[0].toUpperCase()}</span>
							<span class="head-user-list">
								${profileButton}
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
					<div class="head-logo" style="margin: auto">
						<img src="/img/logo.svg" alt="">
					</div>
				</div>
			</div>
		</header>`;
	}
	
	render(type = 'full'){
		return this[`${type}Header`]();
	}
}
export { HeaderBlock }