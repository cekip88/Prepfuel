export const view = {
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
	dashboardFooter(){
		const _ = this;
		return `
			<div hidden>
				${_.selectAvatarTpl()}
				${_.addCardForm()}
				${_.addBillingAddress()}
				${_.registerSuccessPopup()}
			</div>
		`;
	},

	registerSuccessPopup(){
		return `
			<div id="congratulationsPopup">
				<h3 class="title">Thank You!</h3>
				<p class="text">New student successfully added</p>
				<button class="button-blue" data-click="modaler:closeModal">Continue</button>
			</div>
		`
	},

	addingStudentTpl(){
		const _ = this;
		return `
			<div class="section parent" id="parent">
				<div class="test-block">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Adding a Student</span>
						</h5>
					</div>
					<div class="parent-adding-inner">
						<div class="block adding-list">
							<button class="adding-list-item active" data-click="${_.componentName}:addingStep" step="1">
								<strong class="adding-list-digit">1</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Course & Plan</h5>
									<h6 class="adding-list-subtitle">Set Type of a Test & Membership </h6>
								</div>
							</button>
							<button class="adding-list-item" data-click="${_.componentName}:addingStep" step="2">
								<strong class="adding-list-digit">2</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Account Settings</h5>
									<h6 class="adding-list-subtitle">Setup Student Account Settings</h6>
								</div>
							</button>
							<button class="adding-list-item" data-click="${_.componentName}:addingStep" step="3">
								<strong class="adding-list-digit">3</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">School Information</h5>
									<h6 class="adding-list-subtitle">Student’s School Related Info</h6>
								</div>
							</button>
							<button class="adding-list-item" data-click="${_.componentName}:addingStep" step="4">
								<strong class="adding-list-digit">4</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Test Information</h5>
									<h6 class="adding-list-subtitle">Set Test Info</h6>
								</div>
							</button>
							<button class="adding-list-item" data-click="${_.componentName}:addingStep" step="5">
								<strong class="adding-list-digit">5</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Billing Details</h5>
									<h6 class="adding-list-subtitle">Set Your Payment Methods</h6>
								</div>
							</button>
							<button class="adding-list-item" data-click="${_.componentName}:addingStep" step="6">
								<strong class="adding-list-digit">6</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Make Payment</h5>
									<h6 class="adding-list-subtitle">Review and <Confirm></Confirm></h6>
								</div>
							</button>
						</div>
						<div class="block parent-adding-body">
							<div id="parent-adding-body"><img src="/img/loader.gif"></div>
							<div class="test-footer">
								<button class="button back" data-click="${_.componentName}:addingStep" step="0">
									<span>Back</span>
								</button>
								<button class="button-blue step-next-btn" data-click="${_.componentName}:addingStep" step="2">
									<span>Next</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	},
	addingStepOne(){
		const _ = this;
		let
			courses = _.wizardData['courses'],
			tpl = `
				<h3 class="adding-title">Course & Plan</h3>
				<h5 class="parent-adding-subtitle">
					<span>If you need more info, please </span>
					<a href="#">Contact Our Support</a>
				</h5>
				<div class="adding-section">
					<div class="adding-label">What test is the student purchasing?</div>
					<div class="adding-buttons">
		`;
		courses.forEach( (item,cnt) => {
			let activeClass = '';
			if(_.studentInfo['course']){
				if(_.studentInfo['course'] == item._id) activeClass = 'active';
			}
			tpl += `
				<button class="adding-button ${ activeClass }" pos="${cnt}" data-click="${_.componentName}:changeTestType" data-id="${item._id}">
					<span>${item.title}</span>
				</button>
			`;
		});
		tpl+=	`
				</div>
			</div>
			<div class="adding-section">
				<div class="adding-label">What level of the test student plan to take?</div>
				<div class="adding-buttons level-buttons loader-parent">
					${_.levelButtons(courses[_.coursePos])}
				</div>
			</div>
			<div class="adding-section">
				<div class="adding-label">Type of membership?</div>
				<div class="adding-buttons">
					<button class="adding-button active" data-type="monthly" data-click="${_.componentName}:changePayMethod">Pay Monthly</button>
					<button class="adding-button" data-type="yearly" data-click="${_.componentName}:changePayMethod">Pay Yearly</button>
				</div>
			</div>
			<div class="adding-section parent-adding-section">
				<div class="adding-label">Which plan do you prefer?</div>
				<div class="parent-adding-plan">
					<span class="adding-plan active">
						<h5 class="adding-plan-title">App</h5>
						<h6 class="adding-plan-subtitle">Best for self-preparation</h6>
						<span class="adding-plan-price">
						 <em>$</em><strong>20</strong><i>/ Mon</i>
						</span>
						<ul class="adding-plan-list">
							<li class="adding-plan-item"><span>Skill Practice</span></li>
							<li class="adding-plan-item"><span>Practice Tests</span></li>
							<li class="adding-plan-item none"><span>Homeworks & Quizzes</span></li>
							<li class="adding-plan-item none"><span>Classroom Activities</span></li>
							<li class="adding-plan-item none"><span>Private Tutor</span></li>
						</ul>
					</span>
				</div>
			</div>
		`;
		return tpl;
	},
	addingStepTwo(){
		const _ = this;
		return `
			<div class="adding-center passwords">
				<h3 class="adding-title">Account Settings</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<button data-click="${_.componentName}:selectAvatar">
							<strong class="adding-avatar-letter">${_.studentInfo.avatarName ? '<img src="/img/' + _.studentInfo.avatarName + '.svg">' : 'K'}</strong>
							<span class="adding-avatar-link">Select Avatar</span>
						</button>
					</div>
				</div>
				<div class="adding-section">
					<div class="adding-inpt-row">
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">First name</label>
							</div>
							<g-input type="text" value="${_.studentInfo['firstName'] ?? ''}" name="firstName" class="g-form-item" classname="form-input adding-inpt" data-input="${_.componentName}:fillStudentInfo"></g-input>
						</div>
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">Last name</label>
							</div>
							<g-input type="text" value="${_.studentInfo['lastName'] ?? ''}" name="lastName" class="g-form-item" data-input="${_.componentName}:fillStudentInfo" classname="form-input adding-inpt"></g-input>
						</div>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
							<g-input type="text" name="email" value="${_.studentInfo['email'] ?? ''}" class="g-form-item" data-outfocus="${_.componentName}:checkEmail" data-input="${_.componentName}:fillStudentInfo" classname="form-input adding-inpt"></g-input>
							<span class="form-label-desc" style="display:none;">Email is not free</span>
						</div>
				</div>
				<div class="adding-section">
					<h4 class="adding-subtitle">Password</h4>
					<p class="adding-text">Password will be sent to a student via email invitation to the platform</p>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Password</label>
						</div>
						<g-input 
							type="password" 
							name="password" 
							match="addingStepTwo"
							value="${_.studentInfo['password'] ?? ''}" 
							data-outfocus="${_.componentName}:validatePassword" 
							data-input="${_.componentName}:fillStudentInfo" 
							class="g-form-item" 
							classname="form-input"
						></g-input>
						<span class="form-label-desc">8+ characters, with min. one number, one uppercase letter and one special character</span>
					</div>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Repeat password</label>
						</div>
						<g-input 
							type="password" 
							name="cpass"  
							match="addingStepTwo"
							value="${_.studentInfo['cpass'] ?? ''}" 
							data-outfocus="${_.componentName}:validatePassword" 
							data-input="${_.componentName}:fillStudentInfo" 
							class="g-form-item" classname="form-input"
						></g-input>
						<span class="form-label-desc" style="display:none;">Password does not match</span>
					</div>
				</div>
				<button class="adding-generate" data-click="${_.componentName}:generatePassword">Generate Password</button>
			</div>
		`;
	},
	addingStepThree(){
		const _ = this;
		let gradeActive;
		if(_.studentInfo.grade) gradeActive = `_id:${_.studentInfo.grade}`;
		let gradeItems = _.createSelectItems(_.wizardData['grades'], 'value:_id;text:grade', gradeActive);
		return `
			<div class="adding-center">
				<h3 class="adding-title">School Information</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">Your current school</h4>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Current school</label>
						</div>
						<g-input type="text" value="${_.studentInfo.currentSchool ?? ''}" name="currentSchool" data-input="${_.componentName}:fillStudentInfo" class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Grade</label>
						</div>
						<g-select class="select adding-select" name="grade" classname="adding-select" data-change="${_.componentName}:fillStudentInfo" arrowsvg="/img/sprite.svg#select-arrow-bottom" title=""
						 items='${JSON.stringify(gradeItems)}'></g-select>
					</div>
				</div>
				${_.choiseSelectStudent(_.wizardData)}
			</div>
		`;
	},
	addingStepFour(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Test Information</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">Registered Official Test Date</h4>
					<div class="adding-inpt adding-radio-row">
						<div class="form-label-row">
							<input type="radio" id="have_registered" class="adding-radio" name="registered" data-change="${_.componentName}:skipTestDate" ${_.studentInfo.testDatePicked ? 'checked' : ''}>
							<label class="form-label adding-label-have" for="have_registered">Have registered</label>
						</div>
						<g-input disabled type='date' format="month DD, YYYY" value="${_.studentInfo.testDate ?? ''}" data-change="${_.componentName}:fillStudentInfo" class="select adding-select" name="testDate" classname="adding-select" icon="false" xlink="select-arrow-bottom" placeholder="Press to choose your official test date"></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<input type="radio" id="have_yet" class="adding-radio" name="registered" data-change="${_.componentName}:skipTestDate" ${!_.studentInfo.testDatePicked ? 'checked' : ''}>
							<label class="form-label adding-label-have" for="have_yet">Have not registered yet</label>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	addingStepFive(){
		const _ = this;
		let tpl = `
			<div class="billing-inner parent-adding-billing">
				<h3 class="adding-title">Billing Details</h3>
				<div class="billing-block">
					<h3 class="billing-title">Payment Methods</h3>
					<div class="billing-block-inner loader-parent" id="cards">
						<img src='/img/loader.gif' class='loader'>
					</div>
					<button class="button-white-blue wide" data-click="${_.componentName}:showAddCard">
						<svg class="button-icon big"><use xlink:href="#plus2"></use></svg>
						<span>Add New Card</span>
					</button>
				</div>
				<div class="billing-block">
					<h3 class="billing-title">Billing Addresses</h3>
					<div class="billing-block-inner loader-parent" id="billing-addresses">
						<img src='/img/loader.gif' class='loader'>
					</div>
					<button class="button-white-blue wide" data-click="${_.componentName}:showAddBillingAddress">
						<svg class="button-icon big"><use xlink:href="#plus2"></use></svg>
						<span>Add New Address</span>
					</button>
				</div>
			</div>
		`;
		return tpl;
	},
	addingStepSix(){
		const _ = this;
		//if (_.studentInfo.testDatePicked) testDate = _.createdAtFormat(_.studentInfo['testDate']);
		//let schoolTitles = [_.metaInfo.firstSchool,_.metaInfo.secondSchool,_.metaInfo.thirdSchool];
		//_.addingSummarySchoolsTpl(schoolTitles)
		let items = [{text: 'Discount',active: true}];
		return `
			<div class="adding-center">
				<h3 class="adding-title">Make Payment</h3>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">DETAILS overview</strong>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>Chosen Course:</span>
							<strong>${_.metaInfo.course}</strong>
							<button class="adding-summary-btn" data-click="${_.componentName}:addingStep" step="1">Edit</button>
						</li>
						<li class="adding-summary-item">
							<span>Membership:</span>
							<strong>${_.metaInfo.paymentMethod}</strong>
							<button class="adding-summary-btn" data-click="${_.componentName}:addingStep" step="1">Edit</button>
						</li>
						<li class="adding-summary-item">
							<span>Plan:</span>
							<strong>FREE</strong>
							<button class="adding-summary-btn" data-click="${_.componentName}:addingStep" step="1">Edit</button>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<g-select name="discount-type" classname="adding-summary-select" items=${JSON.stringify(items)}></g-select>
					</div>
					<table class="adding-summary-table">
						<thead>
							<tr>
								<th>Course</th>
								<th>Membership</th>
								<th>Plan</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>${_.metaInfo.course}</td>
								<td>${_.studentInfo.paymentMethod}</td>
								<td>Free</td>
								<td>$ 0.00</td>
							</tr>
							<tr>
								<td colspan="3"></td>
								<td>
									<ul class="adding-summary-table-list">
										<li>
											<span>Subtotal:</span>
											<strong>$ 0.00</strong>
										</li>
										<li>
											<span>VAT 0%</span>
											<strong> 0.00</strong>
										</li>
										<li>
											<span>Subtotal + VAT:</span>
											<strong>$ 0.00</strong>
										</li>
										<li>
											<span>Total:</span>
											<strong>$ 0.00</strong>
										</li>
									</ul>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="adding-section adding-summary-final">
					<div class="adding-summary-text">By pressing Purchase, you acknowledge that you have read and agree to our <a href="#">Terms of service</a></div>
					<div class="adding-summary-text">Your membership will be renewed automatically.</div>
					<div class="adding-summary-text">You may cancel online anytime.</div>
				</div>
			</div>
		`;
	},

//steps auxiliary tpls
	levelButtons(stepData){
		const _ = this;
		let tpl = ``;
		stepData['levels'].forEach( (item,count) => {
			let activeClass = '';
			if(_.studentInfo['level']){
				if(_.studentInfo['level'] == item._id){
					activeClass = 'active';
				}
			} else if (!count) {
				activeClass = 'active';
			}
			tpl += `
				<button class="adding-button ${ activeClass }" data-id="${item._id}" data-click="${_.componentName}:changeStudentLevel">
					${item.title}
				</button>
			`;
		});
		return tpl;
	},

	selectAvatarTpl(){
		const _ = this;
		let tpl = `
			<div class="avatars" id="avatars">
				<h3 class="avatars-title title">Select Avatar</h3>
				<ul class="avatars-list"></ul>
				<div class="avatars-buttons">
					<button class="button" data-click="${_.componentName}:closeAvatar">Discard</button>
					<button class="button-blue" data-click="${_.componentName}:confirmAvatar">Save</button>
				</div>
			</div>
		`;
		return tpl;
	},
	avatarsItemsTpl(){
		const _ = this;
		let tpl = '';
		for (let item of _.avatars) {
			tpl += _.avatarsItemTpl(item);
		}
		return tpl;
	},
	avatarsItemTpl(item){
		const _ = this;
		let imgTitle = item.avatar.split('.')[0];
		return `
				<li class="avatars-item">
					<button data-click="${_.componentName}:pickAvatar" title="${imgTitle}" value="${item['_id']}">
						<img src="/img/${imgTitle}.svg" alt="${imgTitle}">
					</button>
				</li>`
	},

	createSelectItems(items,template,active){
		const _ = this;
		let outItems = [];
		let templateSplit = template.split(';');
		for (let item of items) {
			let arrItem = {};
			templateSplit.forEach(( spl) => {
				let
					splitItem = spl.split(':'),
					selectProp = splitItem[0],
					dataProp = splitItem[1];
				arrItem[selectProp] = item[dataProp];
				if(active){
					let activeSplit = active.split(':'),
						activeProp = activeSplit[0],
						activeValue = activeSplit[1];
					if(item[activeProp] == activeValue){
						arrItem['active'] = true;
					}
				}
			});
			outItems.push(arrItem);
		}
		return outItems;
	},
	choiseSelectStudent(choiceData,title='School you are interested in applying to'){
		const _ = this;
		let activeFirst,activeSecond,activeThird;

		if(_.studentInfo.firstSchool) activeFirst = `_id:${_.studentInfo.firstSchool}`;
		if(_.studentInfo.secondSchool) activeSecond = `_id:${_.studentInfo.secondSchool}`;
		if(_.studentInfo.thirdSchool) activeThird = `_id:${_.studentInfo.thirdSchool}`;
		let
			firstItems = _.createSelectItems(choiceData['schools'],"value:_id;text:school",activeFirst),
			secondItems = _.createSelectItems(choiceData['schools'],"value:_id;text:school",activeSecond),
			thirdItems = _.createSelectItems(choiceData['schools'],"value:_id;text:school",activeThird);
		return `
			<div class="adding-section">
					<h4 class="adding-subtitle withmar">${title}</h4>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">First choice</label>
						</div>
						<g-select class="select adding-select" name="firstSchool" data-change="${_.componentName}:fillStudentInfo" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title=""
						items='${JSON.stringify(firstItems)}'></g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Second choice</label>
						</div>
						<g-select class="select adding-select" name="secondSchool" data-change="${_.componentName}:fillStudentInfo" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title=""
						items='${JSON.stringify(secondItems)}'></g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Third choice</label>
						</div>
						<g-select class="select adding-select" name="thirdSchool" data-change="${_.componentName}:fillStudentInfo" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title=""
						items='${JSON.stringify(thirdItems)}'></g-select>
					</div>
				</div>
		`;
	},

	fillParentCardsTpl(cardsInfo){
		const _ = this;
		let tpl = '';
		for (let item of cardsInfo) {
			tpl += `
			<div class="billing-item">
				<div class="billing-item-row alc">
					<h6 class="billing-item-title billing-item-name">${item.name}</h6>
					${item.primary ? '<div class="billing-item-primary">Primary</div>' : ''}
				</div>
				<div class="billing-item-row billing-item-body">
					<div class="billing-item-card">
						<div class="billing-item-card-img"><img src="/img/${item.type}.png"></div>
						<div class="billing-item-info">
							<strong>${item.type} **** ${item.number.substr(item.number.length - 4)}</strong>
							<em>Card expires at ${item.date}</em>
						</div>
					</div>
					<div class="billing-item-row billing-item-actions">
						<button class="test-footer-back">Delete</button>
						<button class="button">Edit</button>
					</div>
				</div>
			</div>
		`;
		}
		return tpl;
	},
	fillParentAddressTpl(addressesInfo){
		const _ = this;
		let tpl = '';
		for (let item of addressesInfo) {
			tpl += `
			<div class="billing-item">
				<div class="billing-item-row alc">
					<h6 class="billing-item-title">${item.title}</h6>
					${item.primary ? '<div class="billing-item-primary">Primary</div>' : ''}
				</div>
				<div class="billing-item-row billing-item-body">
					<div class="billing-item-info">
						<span>${item.line1} ${item.line2}</span>
						<span>${item.state} ${item.postcode}</span>
						<span>${item.country}</span>
					</div>
					<div class="billing-item-row billing-item-actions">
						<button class="test-footer-back">Delete</button>
						<button class="button">Edit</button>
					</div>
				</div>
			</div>
		`;
		}
		return tpl;
	},

	addCardForm(){
		const _ = this;
		let tpl = `
		<div class="block addCard" id="addCard">
			<div class="test-header"></div>
			<div class="addCard-inner">
				<h5 class="title">Add New Card</h5>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">Name on Card</label>
					</div>
					<g-input 
						type="text" 
						name="card-name" 
						class="g-form-item" 
						data-input="${_.componentName}:fillCardInfo"
						className="form-input adding-inpt"
					></g-input>
				</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">Card Number</label>
					</div>
					<g-input 
						type="text" 
						name="card-number" 
						class="g-form-item" 
						data-input="${_.componentName}:fillCardInfo"
						className="form-input adding-inpt"
					></g-input>
				</div>
					<div class="addCard-row">
						<div class="adding-inpt">
						<div class="form-label-row">
							<label class="addCard-label">Expiration Date</label>
						</div>
						<g-input 
							type="text" 
							name="card-date" 
							class="g-form-item" 
							data-input="${_.componentName}:fillCardInfo"
							className="form-input adding-inpt"
						></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="addCard-label">CVV Code</label>
						</div>
						<g-input 
							type="text" 
							name="card-cvv" 
							class="g-form-item" 
							data-input="${_.componentName}:fillCardInfo"
							className="form-input adding-inpt"
						></g-input>
					</div>
				</div>
				<label for="card-primary" class="notifications-list-item-label addCard-row adding-inpt">
					<div class="notifications-list-item-action">
						<input id="card-primary" type="checkbox">
						<span class="notifications-list-item-action-btn"></span>
					</div>
					<span class="addCard-checkbox-text">Make Card Primary</span>
				</label>
				<div class="addCard-row jcfe addCard-footer">
					<button class="test-footer-back" data-click="modaler:closeModal">Cancel</button>
					<button class="button-blue">Save Card</button>
				</div>
			</div>
		</div>
		`;
		return tpl;
	},
	addBillingAddress(){
		const _ = this;
		let tpl = `
		<div class="block addCard" id="addBillingAddress">
			<div class="test-header"></div>
			<div class="addCard-inner">
				<h5 class="title">Add New Billing Address</h5>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">Address Line 1</label>
					</div>
					<g-input 
						type="text" 
						name="billing-address-line-1" 
						class="g-form-item" 
						data-input="${_.componentName}:fillBillingAddressInfo"
						className="form-input adding-inpt"
					></g-input>
				</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">Address Line 2</label>
					</div>
					<g-input 
						type="text" 
						name="billing-address-line-2" 
						class="g-form-item" 
						data-input="${_.componentName}:fillBillingAddressInfo"
						className="form-input adding-inpt"
					></g-input>
				</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">City</label>
					</div>
					<g-input 
						type="text" 
						name="billing-address-city" 
						class="g-form-item" 
						data-input="${_.componentName}:fillBillingAddressInfo"
						className="form-input adding-inpt"
					></g-input>
				</div>
					<div class="addCard-row">
						<div class="adding-inpt">
						<div class="form-label-row">
							<label class="addCard-label">State</label>
						</div>
						<g-select 
							type="text" 
							name="billing-address-state" 
							class="g-form-item" 
							title
							arrowsvg="/img/sprite.svg#select-arrow-bottom"
							data-change="${_.componentName}:fillBillingAddressInfo"
							className="adding-select"
							items='[
								{"value":"alabama","text":"Alabama"},
								{"value":"alaska","text":"Alaska"},
								{"value":"california","text":"California"},
								{"value":"delaware","text":"Delaware"}
							]'
						></g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="addCard-label">Postcode</label>
						</div>
						<g-input 
							type="text" 
							name="billing-address-postcode" 
							class="g-form-item" 
							data-input="${_.componentName}:fillBillingAddressInfo"
							className="form-input adding-inpt"
						></g-input>
					</div>
				</div>
				<label for="billing-address-primary" class="notifications-list-item-label addCard-row adding-inpt">
					<div class="notifications-list-item-action">
						<input id="billing-address-primary" type="checkbox">
						<span class="notifications-list-item-action-btn"></span>
					</div>
					<span class="addCard-checkbox-text">Make Address Primary</span>
				</label>
				<div class="addCard-row jcfe addCard-footer">
					<button class="test-footer-back" data-click="modaler:closeModal">Cancel</button>
					<button class="button-blue">Save Address</button>
				</div>
			</div>
		</div>
		`;
		return tpl;
	},
//end staps auxiliary tpls


// dashboard
	dashboardTabs(){
		const _ = this;
		let tpl = `
			<div class="subnavigate parent">
				<div class="section">`;
		for (let i = 0; i < _.me['parent']['students']['length']; i++) {
			let student = _.me['parent']['students'][i];
			let img;
			if (student['user']['avatar']) {
				img = `<div class="subnavigate-button-img" data-id="${student['user']['avatar']}"></div>`
			}
			tpl += `
				<button class="subnavigate-button${ !i ? ' active' : ''}" data-click="${_.componentName}:changeStudent" data-index="${i}">
					${img ?? ''}<span>${student['user']['firstName']} ${student['user']['lastName']}</span>
				</button>
			`;
		}
		tpl += `
					<button class="button-blue" data-click="${_.componentName}:changeSection" section="addingStudent">
						<span>Add student</span>
						<svg class="button-icon"><use xlink:href="#plus"></use></svg>
					</button>
				</div>
			</div>
		`;
		return tpl;
	},
	dashboardBodyTpl(){
		const _ = this;
		let tpl = `
			<div class="section">
				<div class="section-header">
					${_.sectionHeaderTpl({
						title: 'Student Academic Profile',
						gap: false
					})}
					<div class="section-header-select">
						<span>Switch Course</span>
						<g-select
							class="select filter-select" 
							className="filter-select section-header-select course-select"
							arrowsvg="/img/sprite.svg#select-arrow-bottom"
							items=${JSON.stringify([
								{text:'ISEE', active:true},
								{text:'SHSAT'}
							])}></g-select>
					</div>
				</div>
				<div class="block block-gap parent" id="studentProfile">
					<img src="/img/loader.gif" alt="">
				</div>
				<div class="block block-gap">
					${_.profileSubnavigate()}
				</div>
			</div>
			<div class="section">
					${_.sectionHeaderTpl({title: 'Dashboard',gap:false})}
					<div class="row">
						<div class="col">
							<div class="block block-gap" id="scheduleCont">
								<div class="block-title-control">
									<h5 class="block-title"><span>Practice Schedule</span></h5>
									<button class="button" data-click="${_.componentName}:deleteSchedule"><span>Delete</span></button>
									<button class="button" data-click="${_.componentName}:editSchedule"><span>Edit</span></button>
								</div>
								<ul class="schedule-list loader-parent" id="scheduleList">
									<img src="/img/loader.gif">
								</ul>
								${_.scheduleFooterTpl()}
							</div>
							<div class="block block-gap loader-parent" id="starsBlock">
								<img src="/img/loader.gif" alt="">
							</div>
						</div>
					</div>
				</div>
		`;
		return tpl;
	},
	studentProfileTpl( studentInfo ){
		const _ = this;
		let tpl = `
			<div class="df aifs">
				<div class="parent-student-avatar">
					<img data-id="${studentInfo['user']['avatar']}" data-type="avatars" data-title="avatar">
				</div>
				<div class="parent-student-info">
					<div class="unit df aic jcsb">
						<div class="item">
							<span class="strong">${studentInfo['user']['firstName']} ${studentInfo['user']['lastName']}</span>
							<span class="text">${studentInfo['user']['email']}</span>
						</div>
						<div class="item">
							<span class="strong">${studentInfo['currentSchool']}</span>
							<span class="text">School</span>
						</div>
						<div class="item">
							<span class="strong">${studentInfo['grade']['grade']}</span>
							<span class="text">Grade</span>
						</div>
						<div class="item">
							<span class="strong">${studentInfo['currentPlan']['course']['title']}</span>
							<span class="text">Course</span>
						</div>
						<div class="item buttons last">
							<button class="button">Edit Course</button>
							<button class="button-blue">Edit Profile</button>
							<button class="button button-hide" data-click="${_.componentName}:hideProfile">
								<svg><use xlink:href="#select-arrow-bottom"></use></svg>
							</button>
						</div>
					</div>
					<div class="unit">
						<span class="text">APPLICATION SCHOOL LIST</span>
						<div class="df aic jcsb">`;
		if ( studentInfo['currentPlan']['firstSchool'] ){
			tpl += `
				<div class="item">
					<span class="strong" data-id="${studentInfo['currentPlan']['firstSchool']}" data-type="schools" data-title="school">${studentInfo['currentSchool']}</span>
					<span class="text">1st choice</span>
				</div>
			`;
		}
		if ( studentInfo['currentPlan']['secondSchool'] ){
			tpl += `
				<div class="item">
					<span class="strong" data-id="${studentInfo['currentPlan']['secondSchool']}" data-type="schools" data-title="school">${studentInfo['currentSchool']}</span>
					<span class="text">2nd choice</span>
				</div>
			`;
		}
		if ( studentInfo['currentPlan']['thirdSchool'] ){
			tpl += `
				<div class="item last">
					<span class="strong" data-id="${studentInfo['currentPlan']['thirdSchool']}" data-type="schools" data-title="school">${studentInfo['currentSchool']}</span>
					<span class="text">3rd choice</span>
				</div>
			`;
		}
		tpl += `
						</div>
					</div>
					<div class="unit">
						<span class="text">CLASSES</span>
						<div class="df aic jcsb">
							
						</div>
					</div>
				</div>
			</div>
		`;
		return tpl;
	},
	profileSubnavigate(){
		const _ = this;
		let buttons = [
			{text:'Dashboard'},
			{text:'Report by Section'},
			{text:'Practice Test'},
			{text:'Trouble Spots'},
			{text:'Achievements'},
			{text:'Activity'},
		];
		let tpl = `
			<div class="subnavigate">
				<div class="section">`;
		for (let i = 0; i < buttons['length']; i++) {
			let button = buttons[i];
			tpl += `
				<button class="subnavigate-button${ !i ? ' active' : ''}" data-click="${_.componentName}:changeStudent" data-index="${i}">
					<span>${button['text']}</span>
				</button>
			`;
		}
		tpl += `
				</div>
			</div>
		`;
		return tpl;
	},

// schedule methods
	scheduleBlock(dashSchedule){
		const _ = this;
		return 
		if (!dashSchedule) return null;
		let
			practiceDate = dashSchedule['practiceTest'] ? new Date(dashSchedule['practiceTest']['date']) : undefined,
			testDate = dashSchedule['test'] ? new Date(dashSchedule['test']['date']) : undefined;
		let tpl = ``;
		let itemsData = _.fillScheduleItemsTpl(dashSchedule);
		for (let item of itemsData) {
			tpl += _.scheduleItemTpl(item);
		}
		return tpl;
	},
	scheduleFooterTpl(){
		const _ = this;
		return `
			<div class="schedule-footer">
				<button class="schedule-footer-button active">
					<span class="icon"><svg><use xlink:href="#calendar-transparent"></use></svg></span>
					<span class="text">Calendar</span>
					<span class="arrow"></span>
				</button>
				<button class="schedule-footer-button">
					<span class="icon"><svg><use xlink:href="#list"></use></svg></span>
					<span class="text">Schedule</span>
					<span class="arrow"></span>
				</button>
				<button class="schedule-footer-button last">
					<span class="icon"><svg><use xlink:href="#question"></use></svg></span>
					<span class="text">Practice Schedule FAQ</span>
				</button>
			</div>
		`
	},

	starsBlockTpl(starsData){
		const _ = this;
		let tpl = `
			<div class="stars">
				<div class="block-title-control">
					<h5 class="block-title"><span>Stars</span></h5>
					<button class="button"><span>What are stars?</span></button>
				</div>
				<div class="stars-row">
					<div class="stars-circle circle" data-radius="106,134" data-borders="28">
						<div class="circle-count">
							<svg class="circle-count-icon">
								<use xlink:href="#stars"></use>
							</svg><span class="circle-count-title">${_.setInteger(starsData['total'])}</span>
						</div>
					</div>
					<ul class="stars-info">`;
		for( let item of starsData['items'] ){
			tpl += `
				<li class="stars-info-item">
					<div class="stars-info-img" style="background-color:rgba(${item['color']},.1);">
						<svg style="fill:rgb(${item['color']});">
							<use xlink:href="#stars"></use>
						</svg>
					</div>
					<div class="stars-info-text">
						<strong>${_.setInteger(item['count'])}</strong>
						<span>${item['title']}</span>
					</div>
				</li>
			`;
		}
		tpl += `</ul>
				</div>
			</div>
		`;
		return tpl;
	}
}