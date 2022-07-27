export const view = {
	dashboardBody(params){
		const _ = this;
		return `
			<div class="section">
				<div class="block student-main">
					<h1 class="main-title"><span>Today's goal</span><strong>Choose your practice schedule</strong></h1>
					<p class="student-main-text">
						Based on your test date, we'll put together a practice plan
						to ensure you're ready for the real deal.
					</p>
					<button class="button-blue" data-click="StudentPage:changeSection;" section="/student/schedule" ><span>Choose your practice schedule</span></button>
				</div>
			</div>
		`;
	},
	dashboardTabs(){
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active"><span>Overview</span></button>
					<button class="subnavigate-button"><span>Report by Section</span></button>
					<button class="subnavigate-button"><span>Practice Test</span></button>
					<button class="subnavigate-button"><span>Trouble Spots</span></button>
					<button class="subnavigate-button"><span>Achievements</span></button>
					<button class="subnavigate-button"><span>Activity</span></button>
				</div>
			</div>
		`;
	},
	welcomeTpl(){
		const _ = this;
		return `<section class="login">
			<div class="login-full login-success">
				<div class="login-left-logo">
					<svg width="144" height="173" viewBox="0 0 144 173" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g filter="url(#filter0_d_2566_126400)">
							<path
							d="M66.0623 40C90.3042 50.838 97.8241 72.9803 85.7088 95.7556C84.452 98.2445 82.9386 100.6 81.1923 102.785C73.9886 111.391 69.5174 120.752 73.4354 133C61.7378 129.191 51.9823 124.394 44.9819 115.322C39.2009 107.871 38.5686 99.5089 42.4753 91.2472C44.8916 86.1391 48.595 81.5752 51.9823 76.9335C55.6745 71.8254 60.0555 67.1616 63.375 61.8536C67.3495 55.4352 69.4835 48.3617 66.0623 40Z"
							fill="#00A3FF"/>
							<path
							d="M96.1094 77.0334C106.779 92.4243 108.53 111.968 89.3348 123.517C85.5297 125.815 82.0295 128.614 78.0437 131.457C75.6613 126.415 76.3275 121.785 78.2018 117.309C79.2675 114.542 80.7562 111.951 82.6166 109.625C90.4865 100.397 94.7319 89.7481 96.1094 77.0334Z"
							fill="#00A3FF"/>
						</g>
						<defs>
							<filter id="filter0_d_2566_126400" x="0" y="0" width="144" height="173" filterUnits="userSpaceOnUse"
							        color-interpolation-filters="sRGB">
								<feFlood flood-opacity="0" result="BackgroundImageFix"/>
								<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								               result="hardAlpha"/>
								<feOffset/>
								<feGaussianBlur stdDeviation="20"/>
								<feColorMatrix type="matrix" values="0 0 0 0 0.219948 0 0 0 0 0.278529 0 0 0 0 0.429167 0 0 0 0.1 0"/>
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2566_126400"/>
								<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2566_126400" result="shape"/>
							</filter>
						</defs>
					</svg>
				</div>
				<h2 class="login-main-title"><span>Welcome to Prepfuel</span></h2>
				<div class="login-main-subtitle">
					<span>Help your child succeed</span>
					<span>with our adaptive learning technology.</span>
				</div>
				<button class="button-blue" data-click="${_.componentName}:changeSection" section="addingStudent">
					<span>Add a Student</span>
				</button>
				<img class="login-success-img" src="/img/confirmation-on-white.png" alt=""/>
				<div class="login-success-bgc">
					<img src="/img/success-bgc-2,5.png" alt=""/>
					<img src="/img/success-bgc-1.png" alt=""/>
					<img src="/img/success-bgc-2.png" alt=""/>
					<img src="/img/success-bgc-3.png" alt=""/>
					<img src="/img/success-bgc-4.png" alt="">
					<img src="/img/success-bgc-5.png" alt=""/>
					<img src="/img/success-bgc-6.png" alt=""/>
					<img src="/img/success-bgc-7.png" alt=""/>
					<img src="/img/success-bgc-8.png" alt=""/>
				</div>
			</div>
		</section>`
	},
	badgeTpl(){
		const _ = this;
		return `
			<div id="g-set-inner">
			
			</div>
		`;
	},
	addingStudentTpl(){
		const _ = this;
	}
	
}