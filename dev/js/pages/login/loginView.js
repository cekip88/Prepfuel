export const loginView = {
	resetTpl(){
		const _ = this;
		let
				token = _.resetData.pathParts[_.resetData.pathParts.length - 1],
				email = _.resetData.params.email;
		return `
			<form class="login-form passwords" data-submit="${_.componentName}:doFormAction" data-handle="doReset">
				<h2 class="login-title"><span>Reset Password</span></h2>
				<h5 class="login-subtitle"><span>Please enter your new password</span></h5>
				<input type="hidden" class="g-form-item" name="token" value="${token}">
				<input type="hidden" class="g-form-item" name='email' value="${email}">
				<div class="form-block">
					<div class="form-label-row">
						<label class="form-label">Password</label>
					</div>
					<g-input class="g-form-item pwd" type="password" data-outfocus="${_.componentName}:validatePassword" name="password" classname="form-input" required></g-input>
					<span class="form-block-comment">8+ characters, with min. one number, one uppercase letter and one special character</span>
				</div>
				<div class="form-block">
					<div class="form-label-row">
						<label class="form-label">Confirm password</label>
					</div>
					<g-input class="g-form-item pwd" type="password" data-outfocus="${_.componentName}:validatePassword" name="confirmation" classname="form-input" required></g-input>
				</div>
				<div class="form-block row">
				<button class="button-blue"><span>Reset Password</span></button></div>
			</form>
			<div class="login-bottom">
				<a class="link" href="#"><span>Contact Us</span></a>
			</div>
		`;
	},
	removeTpl(){
		const _ = this;
		let
			parentId = _.removeData.params.parentid,
			role = _.removeData.params.removeduser;

		return `
			<div class="removeForm-bgc">
				<form class="removeForm" data-submit="${_.componentName}:doFormAction" data-handle="sendRemoveAnswers" section="removeEnd">
					<h2 class="login-title"><span>We’re sorry to see you go</span></h2>
					<input type="hidden" class="g-form-item" name="parentId" value="${parentId}">
					<input type="hidden" class="g-form-item" name="role" value="${role}">
					<p class="removeForm-text">
						Before you go, we are interested in a learning more about why you decide to leave, please let us know the reason you are leaving.
					</p>
					<p class="removeForm-text">
						Your responses will be kept confidential and will not be used for any purpose other than research conducted by our company.
					</p>
					<div class="radio" data-click="${_.componentName}:radio;${_.componentName}:enableTextarea" target="reason-text">
						<input type="hidden" name="reason" id="reason">
						<button class="radio-button" type="button">Technical issues</button>
						<button class="radio-button" type="button">Too expensive</button>
						<button class="radio-button" type="button">Switching to another product</button>
						<button class="radio-button" type="button">Not sure how to use the data & tools</button>
						<button class="radio-button" type="button">Missing features I need</button>
						<button class="radio-button" type="button" data-other>Other (please explain below)</button>
					</div>
					<div class="form-block">
						<textarea class="g-form-item form-input" disabled id="reason-text" name="comment" placeholder="Anything you want to share? (Optional)"></textarea>
					</div>
					<div class="form-block row">
					<button class="button-blue center"><span>Submit</span></button></div>
				</form>
			</div>
			<div class="login-bottom">
				<a class="link" href="#"><span>Contact Us</span></a>
			</div>
		`;
	},
	removeEndTpl(){
		const _ = this;
		return `
			<div class="removeForm-bgc">
				<div class="removeForm">
					<p class="removeForm-text">
						Thank you for taking the time to complete the questionnaire and submitting it back to us.
					</p>
					<p class="removeForm-text">
						Your participation is important to us.
					</p>
					<p class="removeForm-text">
						Your feedback and suggestions will help us improve the Prepfuel.
					</p>
		`;
	},
	passwordChangedTpl(){
		const _ = this;
		return `
			<div class="login-full login-success">
				<h2 class="login-main-title"><span>Password is changed</span></h2>
				<div class="login-main-subtitle">
					<span>Your password is successfully changed.</span>
					<span>Please Sign in to your account</span>
				</div>
				<a class="button-blue narrow" data-click="${_.componentName}:changeSection" section="login"><span>Sign In</span></a>
				<img class="login-success-img" src="/img/S_multitasking.png" alt="">
			</div>
		`;
	},
	welcomeTpl(initTpl=this.loginTpl()){
		const _ =  this;
	/*	_.fillPartsPage([
			{ part:'row', content: _.markup(_.rowTpl(),false)},
			{ part:'left', parent:'.login', content: _.markup(_.leftTpl(),false)},
			{ part:'right', parent:'.login', content: _.markup(initTpl,false)}
		],true);*/
	},
	registerTpl(){
		const _ = this;
		return `
		<div class="login-right">
			<form class="login-form" data-submit="${_.componentName}:doFormAction" data-handle="doRegister">
				<h2 class="login-title"><span>Sign Up to Prepfuel</span></h2>
				<h5 class="login-subtitle">
					<span>Already have an account?</span>
					<a class="link" data-click="${_.componentName}:changeSection" section="login"><span>Sign In</span></a>
				</h5>
				<div class="login-row">
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">First Name</label>
						</div>
						<g-input
							type="text"
							class="g-form-item"
							className="form-input" 
							data-required 
							name="firstName"
						></g-input>
					</div>
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">Last Name</label>
						</div>
						<g-input 
							type="text" 
							class="g-form-item" 
							className="form-input" 
							data-required 
							name="lastName"
						></g-input>
					</div>
				</div>
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<g-input 
							type="email" 
							class="g-form-item" 
							name="email"
							className="form-input"
							data-outfocus="${_.componentName}:checkEmail"
							data-required 
						></g-input>
					</div>
					<div class="form-block passwords">
						<div class="form-label-row">
							<label class="form-label">Password</label>
						</div>
						<g-input 
							type="password" 
							class="g-form-item" 
							className="form-input" 
							data-required 
							name="password"
							data-outfocus="${_.componentName}:validatePassword"
						></g-input>
						<span class="form-block-comment">8+ characters, with min. one number, one uppercase letter and one special character</span>
					</div>
				<div class="form-block">
					<div class="form-checkbox-row">
						<label class="form-checkbox-label">
							<g-input 
								type="checkbox" 
								class="" 
								data-required 
								items='[{"value":1,"text":""}]' 
								data-change="${_.componentName}:changeAgree"
							></g-input>
							<span class="form-checkbox-label-text">I agree to the</span>
						</label>
						<a class="link" href="#"><span>Terms &amp; Conditions</span></a>
						<span>and</span>
						<a class="link" href="#"><span>Privacy Policy</span></a>
					</div>
				</div>
				<div class="form-block">
					<button class="button-blue" id="create-account-btn" disabled>
						<span>Create account</span>
					</button>
					<span class="login-span">or</span>
					<a class="button-lightblue" href="https://live-prepfuelbackend-mydevcube.apps.devinci.co//api/auth/google">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"></path>
							<path d="M10.2002 19.9314C12.9537 19.9314 15.2653 19.0456 16.9537 17.5175L13.7356 15.0814C12.8744 15.6683 11.7186 16.078 10.2002 16.078C7.5034 16.078 5.2145 14.3396 4.39857 11.9368L4.27897 11.9467L1.13101 14.3274L1.08984 14.4392C2.76686 17.6946 6.21158 19.9314 10.2002 19.9314Z" fill="#34A853"></path>
							<path d="M4.3965 11.9366C4.18121 11.3165 4.05661 10.6521 4.05661 9.96559C4.05661 9.27902 4.18121 8.61467 4.38517 7.9946L4.37947 7.86254L1.19206 5.4436L1.08778 5.49208C0.3966 6.84299 0 8.36002 0 9.96559C0 11.5712 0.3966 13.0881 1.08778 14.439L4.3965 11.9366Z" fill="#FBBC05"></path>
							<path d="M10.2002 3.85336C12.1152 3.85336 13.4069 4.66168 14.1435 5.33717L17.0216 2.59107C15.254 0.985496 12.9537 0 10.2002 0C6.21158 0 2.76686 2.23672 1.08984 5.49214L4.38724 7.99466C5.2145 5.59183 7.5034 3.85336 10.2002 3.85336Z" fill="#EB4335"></path>
						</svg>
						<span>Continue with Google</span>
					</a>
				</div>
			</form>
		</div>
		`;
	},
	forgotDoneTpl(){
		const _ = this;
		return `
			<div class="login-full login-success">
				<h2 class="login-main-title"><span>We sent a password reset link to your email.</span></h2>
				<div class="login-main-subtitle"><span>Please check your inbox and spam folders.</span></div>
				<div class="form-checkbox-row login-checkbox">
					<span>Didn’t receive an email? </span>
					<button class="link" data-click="${_.componentName}:resend">Resend</button>
				</div>
				<div class="form-checkbox-row login-checkbox">
					<button class="button-blue" data-click="${_.componentName}:changeSection" section="login" style="width: 480px;max-width:80vw;">Back to Sign in</button>
				</div>
				<img class="login-success-img" src="/img/S_email.png" alt="">
			</div>
		`;
	},
	forgotDoneStudent(){
		const _ = this;
		return `
			<div class="login-full login-success">
				<h2 class="login-main-title"><span>We sent a password reset link to your Parent's email.</span></h2>
				<div class="login-main-subtitle"><span>Please ask your Parent to check their inbox and spam folders.</span></div>
				<div class="form-checkbox-row login-checkbox">
					<span>Didn’t receive an email? </span>
					<button class="link" data-click="${_.componentName}:resend">Resend</button>
				</div>
				<div class="form-checkbox-row login-checkbox">
					<button class="button-blue" data-click="${_.componentName}:changeSection" section="login" style="width: 480px;max-width:80vw;">Back to Sign in</button>
				</div>
				<img class="login-success-img" src="/img/S_email.png" alt="">
			</div>
		`;
	},
	forgotTpl(){
		const _ = this;
		//
		return `<form class="login-form" data-submit="${_.componentName}:doFormAction" data-handle="doForgot" section="forgotDone">
					<h2 class="login-title">
						<span>Forgot Password?</span>
					</h2>
					<h5 class="login-subtitle">
						<span>Enter the email address you used to sign up and we'll send</span>
						<span>you a link to reset your password.</span>
					</h5>
					<div class="form-block">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<g-input 
							class="g-form-item" 
							type="email" 
							name="email" 
							className="form-input"
							required
						></g-input>
					</div>
					<div class="form-block row">
						<a class="button-lightblue" data-click="${_.componentName}:changeSection" section="login" type="button">
							<span>Back</span>
						</a>
						<button class="button-blue" section="reset">
							<span>Reset Password</span>
						</button>
					</div>
				</form>`;
	},
	leftTpl(){
		const _ = this;
		return `
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
			<img class="login-left-img" src="/img/S_confirmation.png" alt="">
		`;
	},
	loginTpl(){
		const _ = this;
		let loginData = localStorage.getItem('loginData');
		if (loginData) loginData = JSON.parse(loginData);
		return `
			<form class="login-form" data-submit="${_.componentName}:doFormAction" data-handle="doLogin">
				<h2 class="login-title">
					<span>Sign In to Prepfuel</span>
				</h2>
				<h5 class="login-subtitle">
					<span>New Here?</span>
					<a class="link" data-click="${_.componentName}:changeSection" section="register">
						<span>Create an Account</span>
					</a>
				</h5>
				<div class="form-block">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<g-input 
						class="g-form-item" 
						type="email" 
						data-keydown="${_.componentName}:formInputHandle" 
						value="${loginData ? loginData.email : ''}" 
						name="email" 
						className="form-input" 
						required
					></g-input>
				</div>
				<div class="form-block">
					<div class="form-label-row">
						<label class="form-label">Password</label>
						<a class="link" data-click="${this.componentName}:changeSection" section="forgot">
							<span>Forgot Password?</span>
						</a>
					</div>
					<g-input 
						class="g-form-item" 
						type="password" 
						data-keydown="${_.componentName}:formInputHandle" 
						name="password"  
						className="form-input"  
						value="${loginData ? loginData.password : ''}" 
						required
					></g-input>
				</div>
				<div class="form-block">
					<g-input type="checkbox" class="g-form-item" items='[{"value":"1","text":"Remember me","checked":${loginData ? true : false}}]' name="remember"></g-input>
				</label>
			</div>
				<div class="form-block">
					<button class="button-blue">
						<span>Sign In</span>
					</button>
					<span class="login-span">or</span>
					<a href="https://live-prepfuelbackend-mydevcube.apps.devinci.co/api/auth/google" class="button-lightblue">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"></path>
							<path d="M10.2002 19.9314C12.9537 19.9314 15.2653 19.0456 16.9537 17.5175L13.7356 15.0814C12.8744 15.6683 11.7186 16.078 10.2002 16.078C7.5034 16.078 5.2145 14.3396 4.39857 11.9368L4.27897 11.9467L1.13101 14.3274L1.08984 14.4392C2.76686 17.6946 6.21158 19.9314 10.2002 19.9314Z" fill="#34A853"></path>
							<path d="M4.3965 11.9366C4.18121 11.3165 4.05661 10.6521 4.05661 9.96559C4.05661 9.27902 4.18121 8.61467 4.38517 7.9946L4.37947 7.86254L1.19206 5.4436L1.08778 5.49208C0.3966 6.84299 0 8.36002 0 9.96559C0 11.5712 0.3966 13.0881 1.08778 14.439L4.3965 11.9366Z" fill="#FBBC05"></path>
							<path d="M10.2002 3.85336C12.1152 3.85336 13.4069 4.66168 14.1435 5.33717L17.0216 2.59107C15.254 0.985496 12.9537 0 10.2002 0C6.21158 0 2.76686 2.23672 1.08984 5.49214L4.38724 7.99466C5.2145 5.59183 7.5034 3.85336 10.2002 3.85336Z" fill="#EB4335"></path>
						</svg>
						<span>Continue with Google</span>
					</a>
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
		`;
	},
	rowTpl(initTpl){
		const _ = this;
		return `
			<section class='login'>
			</section>
		`;
	},
	registerSuccessTpl(){
		const _ = this;
		return `
			<main>
        <section class="login">
          <div class="login-full login-success">
            <h2 class="login-main-title"><span>Thanks for signing up!</span></h2>
            <div class="login-main-subtitle"><span>Please check your inbox messages and confirm your email address to finish your account setup.</span></div>
            <div class="form-checkbox-row login-checkbox">
              <button class="link" data-click="${_.componentName}:changeSection" section="login">Login</button>
						</div>
						<img class="login-success-img" src="img/S_email.png" alt=""/>
          </div>
        </section>
      </main>
		`
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
}