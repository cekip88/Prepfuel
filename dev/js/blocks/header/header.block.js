import { G_Bus } from "../../libs/G_Control.js";
import { _front } from "../../libs/_front.js";

class HeaderBlock extends _front{
		define(){
		const _ = this;
		_.set({
			headerName: 'Sean'
		});
	}
	init(){
		const _ = this;
		_._( ()=>{
			_.f('.head-name').textContent = _._$.headerName;
		},['headerName']);
	}
	render(){
		return `
			<header class="head">
				<div class="section">
					<div class="head-row">
						<a class="head-logo" href="#">
							<img src="img/logo.svg" alt="">
						</a>
						<div class="head-control">
							<a class="head-button" href="./studentDashboard.html">
								<svg>
									<use xlink:href="img/sprite.svg#bell"></use>
								</svg>
							</a>
							<button class="head-button">
								<svg>
									<use xlink:href="img/sprite.svg#chat"></use>
								</svg>
							</button>
							<div class="head-info">
								<span class="head-name">${this._$.headerName}</span>
								<span class="head-position">Student</span>
							</div>
							<button class="head-user">
								<span>S</span>
							</button>
						</div>
					</div>
				</div>
			</header>
		`;
	}
}
export { HeaderBlock }