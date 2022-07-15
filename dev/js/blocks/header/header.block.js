import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";

class HeaderBlock extends G{
	define(){
		const _ = this;
		_.componentName = 'header';
		_.set({
			firstName: localStorage.getItem('firstName'),
			lastName: localStorage.getItem('lastName'),
			role: localStorage.getItem('role'),
		});
		G_Bus
			.on(_,['showUserList'])
	}
	showUserList({item}) {
		const _ = this;
		item.classList.toggle('show');
	}
	init(){
		const _ = this;
	}
	fullHeader(){
		const _ = this;
		return `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo" href="/">
						<img src="/img/logo.svg" alt="">
					</a>
					<div class="head-control">
						<a class="head-button" href="./studentDashboard.html">
							<svg>
								<use xlink:href="/img/sprite.svg#bell"></use>
							</svg>
						</a>
						<button class="head-button">
							<svg>
								<use xlink:href="/img/sprite.svg#chat"></use>
							</svg>
						</button>
						<div class="head-select-block"><span>Course</span>
							<g-select class="g-select select head-select" classname="head-select" items='[{"text":"ISEE","value":"isee","active":true},{"text":"SSAT","value":"ssat"},{"text":"SAT","value":"sat"},{"text":"ACT","value":"act"}]'><input type="hidden" name="null" slot="value" value="isee"></g-select>
						</div>
						<div class="head-info">
							<span class="head-name">${this._$.firstName}</span>
							<span class="head-position">${this._$.role}</span>
						</div>
						<button class="head-user" data-click="${_.componentName}:showUserList">
							<span>${this._$.firstName[0].toUpperCase()}</span>
							<span class="head-user-list">
								<strong data-click="StudentPage:changeSection" section="/student/profile">Profile</strong>
								<strong data-click="router:logout">Log Out</strong>
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>`;
	}
	simpleHeader(){
		return `<header class="head">
			<div class="section">
				<div class="head-row">
					<a class="head-logo" href="/" style="margin: auto">
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