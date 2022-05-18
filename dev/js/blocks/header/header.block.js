import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";

class HeaderBlock extends G{
		define(){
		const _ = this;
		_.set({
			firstName: localStorage.getItem('firstName'),
			lastName: localStorage.getItem('lastName'),
			role: localStorage.getItem('role'),
		});
	}
	init(){
		const _ = this;
	}
	fullHeader(){
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
							<div class="head-info">
								<span class="head-name">${this._$.firstName}</span>
								<span class="head-position">${this._$.role}</span>
							</div>
							<button class="head-user" data-click="router:logout">
								<span>${this._$.firstName[0].toUpperCase()}</span>
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