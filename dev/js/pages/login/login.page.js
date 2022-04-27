import { G_Bus } from "../../libs/G_Control.js";
import { G } from "../../libs/G.js";
import loginModel from "./loginModel.js";
import GInput from "../../components/input/input.component.js";

class LoginPage extends G{
	constructor() {
		super();
	}
	define(){
		const _ = this;
		_.componentName = 'LoginPage';
		_.model = new loginModel();
		G_Bus
			.on(_,'doLogin')
			.on(_,'loginSuccess')
			.on(_,'loginFail')
	}
	loginSuccess(token){
		const _ = this;
		_.storageSave('token',token);
		return Promise.resolve(token);
	}
	loginFail({response,formData}){
		const _ = this;
		let msg = response['message'];
		_.f('g-input[name="email"]').doValidate(msg);
		_.f('g-input[name="password"]').doValidate(msg);
	}
	left(){
		const _ = this;
		return `
			<div class="login-left">
				<div class="login-left-logo">
					<svg width="81" height="117" viewBox="0 0 81 117" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M33.0779 0C63.3803 13.6349 72.7801 41.4913 57.6359 70.1441C56.065 73.2754 54.1732 76.2387 51.9904 78.9872C42.9858 89.8141 37.3967 101.591 42.2942 117C27.6723 112.208 15.4779 106.173 6.72735 94.7595C-0.498928 85.3856 -1.2893 74.866 3.59408 64.4722C6.61444 58.046 11.2438 52.3042 15.4779 46.4647C20.0932 40.0384 25.5693 34.171 29.7188 27.4933C34.6869 19.4185 37.3544 10.5195 33.0779 0Z" fill="white"></path>
						<path d="M70.6338 46.5903C83.9714 65.953 86.1591 90.5404 62.1655 105.069C57.4092 107.961 53.0339 111.482 48.0517 115.058C45.0737 108.716 45.9064 102.89 48.2493 97.2601C49.5814 93.7786 51.4423 90.5186 53.7678 87.5927C63.6052 75.9835 68.912 62.5862 70.6338 46.5903Z" fill="url(#paint0_linear_2566_125989)"></path>
						<defs>
						<linearGradient id="paint0_linear_2566_125989" x1="55.6713" y1="79.8352" x2="83.9472" y2="79.8352" gradientUnits="userSpaceOnUse">
						<stop stop-color="#3445E5"></stop>
						<stop offset="1" stop-color="#DCFDFD"></stop>
						</linearGradient>
						</defs>
					</svg>
				</div>
				<h2 class="login-main-title">
					<span>Welcome to Prepfuel</span>
				</h2>
				<div class="login-main-subtitle">
					<span>Help your child succeed</span>
					<span>with our adaptive learning technology.</span>
				</div>
				<img class="login-left-img" src="img/S_confirmation.png" alt="">
		</div>
		`;
	}
	right(){
		const _ = this;
		return `
			<div class="login-right">
				<form class="login-form" data-submit="${_.componentName}:doLogin">
					<h2 class="login-title" data-click="${_.componentName}:testClick">
						<span>Sing In to Prepfuel</span>
					</h2>
					<h5 class="login-subtitle">
						<span>New Here?</span>
						<a class="link" href="#">
							<span>Create an Account</span>
						</a>
					</h5>
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<g-input class="g-form-item" type="email" name="email" className="form-input" required></g-input>
					</div>
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">Password</label>
							<a class="link" href="#">
								<span>Forgot Password?</span>
							</a> 
						</div>
						<g-input class="g-form-item" type="password" name="password"  className="form-input" required></g-input>
					</div>
					<div class="form-block">
						<g-input type="checkbox" class="g-form-item" items='[{"value":1,"text":"Remember me"}]' name="remember"></g-input>
					</label>
				</div>
					<div class="form-block">
						<button class="button-blue">
							<span>Sign In</span>
						</button>
						<span class="login-span">or</span>
						<button class="button-lightblue">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"></path>
								<path d="M10.2002 19.9314C12.9537 19.9314 15.2653 19.0456 16.9537 17.5175L13.7356 15.0814C12.8744 15.6683 11.7186 16.078 10.2002 16.078C7.5034 16.078 5.2145 14.3396 4.39857 11.9368L4.27897 11.9467L1.13101 14.3274L1.08984 14.4392C2.76686 17.6946 6.21158 19.9314 10.2002 19.9314Z" fill="#34A853"></path>
								<path d="M4.3965 11.9366C4.18121 11.3165 4.05661 10.6521 4.05661 9.96559C4.05661 9.27902 4.18121 8.61467 4.38517 7.9946L4.37947 7.86254L1.19206 5.4436L1.08778 5.49208C0.3966 6.84299 0 8.36002 0 9.96559C0 11.5712 0.3966 13.0881 1.08778 14.439L4.3965 11.9366Z" fill="#FBBC05"></path>
								<path d="M10.2002 3.85336C12.1152 3.85336 13.4069 4.66168 14.1435 5.33717L17.0216 2.59107C15.254 0.985496 12.9537 0 10.2002 0C6.21158 0 2.76686 2.23672 1.08984 5.49214L4.38724 7.99466C5.2145 5.59183 7.5034 3.85336 10.2002 3.85336Z" fill="#EB4335"></path>
							</svg>
							<span>Continue with Google</span>
						</button>
					</div>
				</form>
				<div class="login-bottom">
					<a class="link" href="#">
						<span>Terms</span>
					</a>
					<a class="link" href="#">
						<span>Plans</span>
					</a>
					<a class="link" href="#">
						<span>Contact Us</span>
					</a>
				</div>
			</div>
		`;
	}
	row(){
		const _ = this;
		return `
			<section class='login'>
				${_.left()}
				${_.right()}
			</section>
		`;
	}
	async doLogin({item:form,event}){
		const _ = this;
		event.preventDefault()
		let formData = _.prepareForm(form);
		if(!formData){return void 0}
		await _.model.doLogin(formData);
	}
	async init(){
		const _ = this;
	}
	async render(){
		const _ = this;
		if(await _.model.isLogin()){
			return void 0;
		}
		_.fillPage([
			_.markup(_.row()),
		]);
	}
}
export { LoginPage }