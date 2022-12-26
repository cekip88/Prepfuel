export const view = {
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
							<div class="adding-list-item active">
								<strong class="adding-list-digit">1</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Course & Plan</h5>
									<h6 class="adding-list-subtitle">Set Type of a Test & Membership </h6>
								</div>
							</div>
							<div class="adding-list-item">
								<strong class="adding-list-digit">2</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Account Settings</h5>
									<h6 class="adding-list-subtitle">Setup Student Account Settings</h6>
								</div>
							</div>
							<div class="adding-list-item">
								<strong class="adding-list-digit">3</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">School Information</h5>
									<h6 class="adding-list-subtitle">Student’s School Related Info</h6>
								</div>
							</div>
							<div class="adding-list-item">
								<strong class="adding-list-digit">4</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Test Information</h5>
									<h6 class="adding-list-subtitle">Set Test Info</h6>
								</div>
							</div>
							<div class="adding-list-item">
								<strong class="adding-list-digit">5</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Billing Details</h5>
									<h6 class="adding-list-subtitle">Set Your Payment Methods</h6>
								</div>
							</div>
							<div class="adding-list-item">
								<strong class="adding-list-digit">6</strong>
								<div class="adding-list-desc">
									<h5 class="adding-list-title">Make Payment</h5>
									<h6 class="adding-list-subtitle">Review and Confirm</h6>
								</div>
							</div>
						</div>
						<div class="block parent-adding-body">
							<div id="parent-adding-body"><img src="/img/loader.gif"></div>
							<div class="test-footer">
								<button 
									class="button back" 
									data-click="${_.componentName}:addingStep" 
									step="0"
								>
									<span>Back</span>
								</button>
								<button 
									class="button-blue step-next-btn" 
									data-click="${_.componentName}:addingStep" 
									step="2"
								>
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
					<!--<div class="adding-label">What test is the student purchasing?</div>-->
					<div class="adding-label">What test is the student registering for?</div>
					<div class="adding-buttons">
		`;
		_.coursePos = 2;
		courses.forEach( (item,cnt) => {
			let activeClass = '';
			if (item.title !== 'SHSAT') return;
			if(item.title === _.courseData.currentPlan){
				_.coursePos = cnt;
				activeClass = 'active';
			}
			tpl += `
				<button 
					class="adding-button ${ activeClass } active" 
					pos="${cnt}" 
					data-click="${_.componentName}:changeTestType" 
					data-id="${item._id}"
					${_.courseAction === 'assign' && !activeClass.length ? 'disabled' : ''}
				>
					<span>${item.title}</span>
				</button>
			`;
		});
		let memType = _.studentInfo['paymentMethod'] ? _.studentInfo['paymentMethod'].type : 'monthly';
		tpl += `
				</div>
			</div>
			<div class="adding-section">
				<!--<div class="adding-label">What level of the test student plan to take?</div>-->
				<div class="adding-label">What level of the test does your student plan to take?</div>
				<div class="adding-buttons level-buttons loader-parent">
					${_.levelButtons(courses[_.coursePos])}
				</div>
			</div>
			<!--<div class="adding-section">
				<div class="adding-label">Type of membership?</div>
				<div class="adding-buttons">
					<button 
						class="adding-button ${memType == 'monthly' ? 'active' : ''}" 
						data-type="monthly" 
						data-click="${_.componentName}:changePayMethod"
					>Pay Monthly</button>
					<button 
						class="adding-button ${memType == 'yearly' ? 'active' : ''}" 
						data-type="yearly" 
						data-click="${_.componentName}:changePayMethod"
					>Pay Yearly</button>
				</div>
			</div>-->
			<!--<div class="adding-section parent-adding-section">
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
			</div>-->
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
							<strong class="adding-avatar-letter">${_.studentInfo.avatarName ? '<img src="/img/' + _.studentInfo.avatarName + '.png">' : 'K'}</strong>
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
							<g-input
								type="text"
								value="${_.studentInfo['firstName'] ?? ''}"
								name="firstName"
								class="g-form-item"
								data-required
								classname="form-input adding-inpt"
								data-input="${_.componentName}:fillStudentInfo"></g-input>
						</div>
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">Last name</label>
							</div>
							<g-input
								type="text"
								value="${_.studentInfo['lastName'] ?? ''}"
								name="lastName"
								data-required
								class="g-form-item"
								data-input="${_.componentName}:fillStudentInfo"
								classname="form-input adding-inpt"></g-input>
						</div>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
							<g-input
								type="email"
								data-required
								name="email"
								value="${_.studentInfo['email'] ?? ''}"
								data-value="${_.studentInfo['email'] ?? ''}"
								class="g-form-item"
								data-outfocus="${_.componentName}:checkEmail"
								data-input="${_.componentName}:fillStudentInfo"
								classname="form-input adding-inpt"></g-input>
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
							data-required
							match="addingStepTwo"
							value="${_.studentInfo['password'] ?? ''}"
							data-outfocus="${_.componentName}:validatePassword"
							data-callback="${_.componentName}:fillStudentInfo"
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
							data-required
							match="addingStepTwo"
							value="${_.studentInfo['cpass'] ?? ''}"
							data-outfocus="${_.componentName}:validatePassword"
							data-callback="${_.componentName}:fillStudentInfo"
							class="g-form-item" classname="form-input"
						></g-input>
						<span class="form-label-desc" style="display:none;">Password does not match</span>
					</div>
				</div>
				<button
					class="adding-generate"
					data-click="${_.componentName}:generatePassword">Generate Password</button>
			</div>
		`;
	},
	addingStepThree(){
		const _ = this;
		let gradeActive;
		if(_.studentInfo.grade) gradeActive = `_id:${_.studentInfo.grade._id}`;
		let gradeItems = _.createSelectItems(_.wizardData.grades, 'value:_id;text:grade', gradeActive);
		let currentSchool = _.studentInfo.currentSchool ?? '';
		if( currentSchool.school) currentSchool = _.studentInfo.currentSchool.school;
		return `
			<div class="adding-center">
				<h3 class="adding-title">School Information</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">Your current school</h4>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Current school</label>
						</div>
						<div class="search-select">
							<g-input
								type="text" 
								value="${currentSchool ?? ''}"
								data-required
								name="currentSchool"
								data-input="${_.componentName}:liveSearch"
								data-click="${_.componentName}:showSelect"
								class="g-form-item" 
								classname="form-input adding-inpt"
							></g-input>
							<div class="search-select-options" data-click="${_.componentName}:liveSearchInsert"></div>
						</div>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Grade</label>
						</div>
						<g-select 
							class="select adding-select" 
							name="grade" 
							classname="adding-select" 
							data-required
							data-change="${_.componentName}:fillStudentInfo" 
							arrowsvg="/img/sprite.svg#select-arrow-bottom" 
							title=""
							items='${JSON.stringify(gradeItems)}'></g-select>
					</div>
				</div>
				${_.choiceSelectStudent(_.wizardData)}
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
							<input 
								type="radio" 
								id="have_registered" 
								class="adding-radio" 
								name="registered" 
								data-change="${_.componentName}:skipTestDate" 
								${_.courseData[_.courseData.currentPlan].testDatePicked ? 'checked' : ''}>
							<label class="form-label adding-label-have" for="have_registered">Have registered</label>
						</div>
						<g-input 
							${_.courseData[_.courseData.currentPlan].testDatePicked ? '' : 'disabled'} 
							type='date' 
							format="month DD, YYYY" 
							value="${_.courseData[_.courseData.currentPlan].testDate ?? ''}" 
							data-change="${_.componentName}:fillStudentInfo" 
							class="select adding-select" 
							name="testDate" 
							classname="adding-select" 
							icon="false" 
							xlink="select-arrow-bottom" 
							placeholder="Press to choose your official test date"
						></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<input type="radio" id="have_yet" class="adding-radio" name="registered" data-change="${_.componentName}:skipTestDate" ${!_.courseData[_.courseData.currentPlan].testDatePicked ? 'checked' : ''}>
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
		let testDate = 'Have not registered yet';
		let curCourseTitle = _.courseData.currentPlan;
		if (_.courseData[_.courseData.currentPlan].testDatePicked) testDate = _.createdAtFormat(_.courseData[curCourseTitle]['testDate']);
		let schoolTitles = [
			_.courseData[curCourseTitle].firstSchool.school,
			_.courseData[curCourseTitle].secondSchool.school,
			_.courseData[curCourseTitle].thirdSchool.school
		];
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
							<strong>${_.courseData[curCourseTitle].course.title} ${_.courseData[curCourseTitle].level.title}</strong>
							<button class="adding-summary-btn" data-click="${_.componentName}:addingStep" step="1">Edit</button>
						</li>
						<li class="adding-summary-item">
							<span>Membership:</span>
							<strong>${_.studentInfo.paymentMethod[0].toUpperCase() + _.studentInfo.paymentMethod.substr(1)}</strong>
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
								<td>${_.courseData[curCourseTitle].course.title}</td>
								<td>${_.studentInfo.paymentMethod[0].toUpperCase() + _.studentInfo.paymentMethod.substr(1)}</td>
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
	liveSelectOptions(schools){
		const _ = this;
		let tpl = '';
		for (let item of schools) {
			tpl += `<button class="search-select-option${_.studentInfo.currentSchool == item.school ? ' active' : ''}">${item.school}</button>`;
		}
		return tpl;
	},

	levelButtons(stepData){
		const _ = this;
		let tpl = ``;
		let curPlan = _.courseData[_.courseData.currentPlan];
		let activeClass = false;
		let markered = false;
		stepData['levels'].forEach( (item) => {
			if(curPlan['level']){
				if(item._id == curPlan['level']._id){
					activeClass = true;
				}
			}
			tpl += `
				<button 
					class="adding-button${ activeClass && !markered ? ' active' : '' }" 
					data-id="${item._id}" 
					data-click="${_.componentName}:changeStudentLevel">
					${item.title}
				</button>
			`;
			if (activeClass) markered = true;
		});
		if (!activeClass) {
			let firstHalf = tpl.substring(0,tpl.indexOf('adding-button'));
			let secondHalf = tpl.substring(tpl.indexOf('adding-button'));
			tpl = firstHalf + ' active ' + secondHalf;
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
	registerSuccessPopup(){
		return `
			<div id="congratulationsPopup">
				<h3 class="title">Thank You!</h3>
				<p class="text">New student successfully added</p>
				<button class="button-blue" section="/parent/dashboard" data-click="ParentPage:changeSection;modaler:closeModal">Continue</button>
			</div>
		`
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
					<img src="/img/${imgTitle}.png" alt="${imgTitle}">
				</button>
			</li>
		`;
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
	choiceSelectStudent(choiceData,title= 'School you are interested in applying to'){
		const _ = this;
		let
			plan = _.courseData[_.courseData.currentPlan],
			activeFirst,activeSecond,activeThird;

		if (plan) {
			if(plan.firstSchool) activeFirst = `_id:${plan.firstSchool._id ?? plan.firstSchool}`;
			if(plan.secondSchool) activeSecond = `_id:${plan.secondSchool._id ?? plan.secondSchool}`;
			if(plan.thirdSchool) activeThird = `_id:${plan.thirdSchool._id ?? plan.thirdSchool}`;
		}

		let
			firstItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeFirst),
			secondItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeSecond),
			thirdItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeThird),
			selectFunction = 'fillStudentInfo';
		return `
			<div class="adding-section selects-cont">
				<h4 class="adding-subtitle withmar">${title}</h4>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">First choice</label>
					</div>
					<g-select 
						class="select adding-select" 
						name="firstSchool" 
						exceptions='${JSON.stringify(['Have not decided yet'])}'
						data-change="${_.componentName}:${selectFunction}" 
						data-required
						classname="adding-select" 
						arrowsvg="/img/sprite.svg#select-arrow-bottom" 
						title=""
						items='${JSON.stringify(firstItems)}'></g-select>
				</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Second choice</label>
					</div>
					<g-select 
						class="select adding-select" 
						name="secondSchool" 
						exceptions='${JSON.stringify(['Have not decided yet'])}'
						data-required
						data-change="${_.componentName}:${selectFunction}" 
						classname="adding-select" 
						arrowsvg="/img/sprite.svg#select-arrow-bottom" 
						title=""
						items='${JSON.stringify(secondItems)}'></g-select>
				</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Third choice</label>
					</div>
					<g-select 
						class="select adding-select" 
						name="thirdSchool" 
						exceptions='${JSON.stringify(['Have not decided yet'])}'
						data-required
						data-change="${_.componentName}:${selectFunction}" 
						classname="adding-select" 
						arrowsvg="/img/sprite.svg#select-arrow-bottom" 
						title=""
						items='${JSON.stringify(thirdItems)}'></g-select>
				</div>
			</div>
		`;
	},

	addingStudentFooter(){
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
}