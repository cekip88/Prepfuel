export const view = {
	usersBodyTabs(){
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active"><span>Students</span></button>
					<button class="subnavigate-button"><span>Parents</span></button>
					<button class="subnavigate-button"><span>Payments</span></button>
				</div>
			</div>
		`;
	},
	pagination(){
		const _ = this;
		return `
			<div class="pagination pagination-top">
				<div class="pagination-info"><span>1 - 100 of 7300</span></div>
				<div class="pagination-links">
					<a class="pagination-arrow pagination-prev" href="#">
						<svg class="arrow">
							<use xlink:href="#arrow-left-transparent"></use>
						</svg>
					</a>
					<a class="pagination-link active" href="#"><span>1</span></a>
					<a class="pagination-link" href="#"><span>2</span></a>
					<a class="pagination-link" href="#"><span>3</span></a>
					<a class="pagination-link" href="#"><span>4</span></a>
					<a class="pagination-link" href="#"><span>5</span></a>
					<a class="pagination-arrow pagination-next" href="#">
					<svg class="arrow">
						<use xlink:href="#arrow-right-transparent"></use>
					</svg>
					</a>
				</div>
				<div class="pagination-end">
					<span>Jump to</span>
					<input type="text" value="1">
				</div>
			</div>
		`;
	},
	usersBody() {
		const _ = this;
		return `
			<div class="section users-page">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Students (7,300)</h2>
						<g-input class="block-header-input" type="text" value="Search" classname="form-input form-search"></g-input>
						<g-input class="block-header-input block-header-date" type="date" classname="form-input form-search"></g-input>
						<g-select class="select block-header-select" action="testChange" name="testField" classname="filter-select" arrowsvg="/img/sprite.svg#select-arrow" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" style="--class:select block-header-select; --action:testChange; --name:testField; --classname:filter-select; --arrowsvg:img/sprite.svg#select-arrow;"><input type="hidden" name="testField" slot="value"></g-select>
						<button class="button-blue" data-click="${_.componentName}:addStudent"><span>Add Student</span>
							<svg class="button-icon">
								<use xlink:href="#plus"></use>
							</svg>
						</button>
					</div>
					${_.pagination()}
					<div class="tbl">
						<div class="tbl-head">
							<div class="tbl-item"><span>USER Name</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"></button>
									<button class="tbl-sort-btn bottom"></button>
								</div>
							</div>
							<div class="tbl-item">Courses</div>
							<div class="tbl-item"><span>date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"></button>
									<button class="tbl-sort-btn bottom"></button>
								</div>
							</div>
							<div class="tbl-item">Action</div>
						</div>
						<table class="table">
							<thead>
								<tr>
									<th class="tbl-h"></th>
									<th class="tbl-h"></th>
									<th class="tbl-h"></th>
									<th class="tbl-h"></th>
								</tr>
							</thead>
							<tbody class="tbl-body">
								<tr class="tbl-row">
									<td>
										<div class="tbl-item">
											<div class="users-photo-icon"><img src="/img/green-boy.svg" alt="">
											</div>
											<div class="users-info">
												<h6 class="users-info-name">Brooklyn Simmons</h6><span class="users-info-email">exmplm@example.com</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-course violet">ISEE U</div>
											<div class="users-course brown">SHSAT 9th</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">March 17, 2022</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<button class="users-btn">
												<svg>
													<use xlink:href="#write"></use>
												</svg>
											</button>
											<button class="users-btn">
												<svg>
													<use xlink:href="#trash"></use>
												</svg>
											</button>
											<button class="users-btn">Profile</button>
										</div>
									</td>
								</tr>
								<tr class="tbl-row">
									<td>
										<div class="tbl-item">
											<div class="users-photo-icon"><img src="/img/red-boy.svg" alt="">
											</div>
											<div class="users-info">
												<h6 class="users-info-name">Wade Warren</h6><span class="users-info-email">exmplm@example.com</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-course blue">ISEE M</div>
											<div class="users-course turquoise">SSAT M</div>
											<div class="users-course red">SHSAT 8th</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">March 17, 2022</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<button class="users-btn">
												<svg>
													<use xlink:href="#write"></use>
												</svg>
											</button>
											<button class="users-btn">
												<svg>
													<use xlink:href="#trash"></use>
												</svg>
											</button>
											<button class="users-btn">Profile</button>
										</div>
									</td>
								</tr>
								<tr class="tbl-row">
									<td>
										<div class="tbl-item">
											<div class="users-photo-icon"><img src="/img/gray-boy.svg" alt="">
											</div>
											<div class="users-info">
												<h6 class="users-info-name">Cameron Williamson</h6><span class="users-info-email">exmplm@example.com</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-course blue">ISEE M</div>
											<div class="users-course turquoise">SSAT M</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">March 17, 2022</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<button class="users-btn">
												<svg>
													<use xlink:href="#write"></use>
												</svg>
											</button>
											<button class="users-btn">
												<svg>
													<use xlink:href="#trash"></use>
												</svg>
											</button>
											<button class="users-btn">Profile</button>
										</div>
									</td>
								</tr>
								<tr class="tbl-row">
									<td>
										<div class="tbl-item">
											<div class="users-photo-icon"><img src="/img/red-girl.svg" alt="">
											</div>
											<div class="users-info">
												<h6 class="users-info-name">Leslie Alexander</h6><span class="users-info-email">exmplm@example.com</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-course gold">ISEE L</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">March 17, 2022</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<button class="users-btn">
												<svg>
													<use xlink:href="#write"></use>
												</svg>
											</button>
											<button class="users-btn">
												<svg>
													<use xlink:href="#trash"></use>
												</svg>
											</button>
											<button class="users-btn">Profile</button>
										</div>
									</td>
								</tr>
								<tr class="tbl-row">
									<td>
										<div class="tbl-item">
											<div class="users-photo-icon"><img src="/img/blue-girl.svg" alt="">
											</div>
											<div class="users-info">
												<h6 class="users-info-name">Kristin Watson</h6><span class="users-info-email">exmplm@example.com</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-course turquoise">SSAT M</div>
											<div class="users-course red">SHSAT 8th</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">March 17, 2022</div>
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<button class="users-btn">
												<svg>
													<use xlink:href="#write"></use>
												</svg>
											</button>
											<button class="users-btn">
												<svg>
													<use xlink:href="#trash"></use>
												</svg>
											</button>
											<button class="users-btn">Profile</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				${_.addingStudent()}
			</div>
		`;
	},
	addingStudent(){
		const _ = this;
		return `
			<div hidden>
				<div class="admin-modal"	id="addingForm">
					<div class="block test-block adding-block">
					<div class="test-header">
						<h5 class="block-title test-title adding-header-title">
							<span>Adding a Student</span>
						</h5>
					</div>
					<div class="adding-inner">
						<div class="adding-row">
							<ol class="adding-list">
								<li class="adding-list-item active">
									<strong class="adding-list-digit">1</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Course & Plan</h5>
										<h6 class="adding-list-subtitle">Set Type of a Test & Membership </h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">2</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Account Settings</h5>
										<h6 class="adding-list-subtitle">Setup Student Account Settings</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">3</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Parent Information</h5>
										<h6 class="adding-list-subtitle">Assign Or Add a Parent</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">4</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">School Information</h5>
										<h6 class="adding-list-subtitle">Student's School Related Info</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">5</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Test Information</h5>
										<h6 class="adding-list-subtitle">Set Test Info</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">6</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Summary</h5>
										<h6 class="adding-list-subtitle">Review and Confirm</h6>
									</div>
								</li>
							</ol>
							<div class="adding-body">
								${_.addingStepOne()}
							</div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back" data-click="${_.componentName}:changeAddingStep" step="1">
							<span>Cancel</span>
						</button>
						<button class="button-blue" data-click="${_.componentName}:changeAddingStep" step="2">
							<span>Next</span>
						</button>
					</div>
				</div>
				</div>
			</div>
		`;
		
	},
	addingStepOne(){
		const _ = this;
		return `
			<h3 class="adding-title">Course & Plan</h3>
			<div class="adding-section">
				<div class="adding-label">What test is the student purchasing?</div>
				<div class="adding-buttons">
					<button class="adding-button">ISEE</button>
					<button class="adding-button active">SSAT</button>
					<button class="adding-button">SHSAT</button>
				</div>
			</div>
			<div class="adding-section">
				<div class="adding-label">What level of the test student plan to take?</div>
				<div class="adding-buttons">
					<button class="adding-button active">Middle (5-7th Grade)</button>
					<button class="adding-button">Upper (8-11th Grade)</button>
				</div>
			</div>
			<div class="adding-section">
				<div class="adding-label">Type of membership?</div>
				<div class="adding-buttons">
					<button class="adding-button disabled">Pay Monthly</button>
					<button class="adding-button disabled">Pay Yearly</button>
				</div>
			</div>
			<div class="adding-section">
				<div class="adding-label">Type of a plan?</div>
				<div class="adding-plan-row">
					<span class="adding-plan active">
						<h5 class="adding-plan-title">Free</h5>
						<h6 class="adding-plan-subtitle">Best for self-preparation</h6>
						<span class="adding-plan-price">
						 <em>$</em><strong>0</strong><i>/ Mon</i>
						</span>
						<ul class="adding-plan-list">
							<li class="adding-plan-item"><span>Skill Practice</span></li>
							<li class="adding-plan-item"><span>Practice Tests</span></li>
							<li class="adding-plan-item feat"><span>Feature</span></li>
							<li class="adding-plan-item feat"><span>Feature</span></li>
							<li class="adding-plan-item feat"><span>Feature</span></li>
						</ul>
					</span>
					<span class="adding-plan">
						<h5 class="adding-plan-title">App</h5>
						<h6 class="adding-plan-subtitle">Best for self-preparation</h6>
						<span class="adding-plan-price">
						 <em>$</em><strong>20</strong><i>/ Mon</i>
						</span>
						<ul class="adding-plan-list">
							<li class="adding-plan-item"><span>Skill Practice</span></li>
							<li class="adding-plan-item"><span>Practice Tests</span></li>
							<li class="adding-plan-item"><span>Feature</span></li>
							<li class="adding-plan-item"><span>Feature</span></li>
							<li class="adding-plan-item"><span>Feature</span></li>
						</ul>
					</span>
				</div>
			</div>
		`;
	},
	addingStepTwo() {
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Account Settings</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<label for="avatar">
							<strong class="adding-avatar-letter">K</strong>
							<span class="adding-avatar-link">Select Avatar</span>
							<input type="file">
						</label>
					</div>
				</div>
				<div class="adding-section">
					<div class="adding-inpt-row">
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">First name</label>
							</div>
							<g-input type="text" name="first_name" class="g-form-item" classname="form-input"></g-input>
						</div>
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">Last name</label>
							</div>
							<g-input type="text" name="last_name" class="g-form-item" classname="form-input"></g-input>
						</div>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<g-input type="text" name="email" class="g-form-item" classname="form-input"></g-input>
						</div>
				</div>
				<div class="adding-section">
					<h4 class="adding-subtitle">Password</h4>
					<p class="adding-text">Password will be sent to a student via email invitation to the platform</p>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Password</label>
						</div>
						<g-input type="password" name="pass" class="g-form-item" classname="form-input"></g-input>
					</div>
					<p class="adding-text">8+ characters, with min. one number, one uppercase letter and one special character</p>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Repeat password</label>
						</div>
						<g-input type="password" name="cpass" class="g-form-item" classname="form-input"></g-input>
					</div>
				</div>
				<button class="adding-generate">Generate Password</button>
			</div>
		`;
	},
	addingStepThree() {
		const _ = this;
		return`
			<h3 class="adding-title">Parent Information</h3>
			<div class="adding-section">
				<div class="adding-label">Select the way of adding a parent</div>
				<div class="adding-buttons">
					<button class="adding-button">Assign from base</button>
					<button class="adding-button active">Add new parent</button>
					<button class="adding-button">Skip for now</button>
				</div>
			</div>
			<div class="adding-assign-body">
					${_.assignNewParent()}
			</div>
		`;
	},
	assignFromBase(){
		const _ = this;
	},
	assignNewParent(){
		const _ = this;
		return `
			<div class="adding-section">
				<h4 class="adding-subtitle">Parent Personal Info</h4>
				<div class="adding-avatar">
					<div class="profile-img-row">
						<div class="profile-img">
							<div class="profile-img-letter">
								${this._$.firstName[0].toUpperCase()}
							</div>
						</div>
						<div class="profile-img-desc">
							Allowed *.jpeg,*.jpg, *.png, *.gif<br>
							Max size of 3.1 MB
						</div>
					</div>
				</div>
			</div>
			<div class="adding-section">
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">First name</label>
					</div>
					<g-input type="text" name="first_name" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Last name</label>
					</div>
					<g-input type="text" name="last_name" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<g-input type="email" name="email" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Phone Number</label>
					</div>
					<g-input type="email" name="phone" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
			</div>
			<div class="adding-section">
				<h4 class="adding-subtitle">Password</h4>
				<p class="adding-text">Password will be sent to a student via email invitation to the platform</p>
				<div class="adding-inpt small">
					<div class="form-label-row">
						<label class="form-label">Password</label>
					</div>
					<g-input type="password" name="pass" class="g-form-item" classname="form-input"></g-input>
				</div>
				<p class="adding-text">8+ characters, with min. one number, one uppercase letter and one special character</p>
				<div class="adding-inpt small">
					<div class="form-label-row">
						<label class="form-label">Repeat password</label>
					</div>
					<g-input type="password" name="cpass" class="g-form-item" classname="form-input"></g-input>
				</div>
			</div>
			<button class="adding-generate">Generate Password</button>
		`;
	},
	addingStepFour(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">School Information</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">Your current school</h4>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Current school</label>
						</div>
						<g-input type="text" name="current_school" class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Grade</label>
						</div>
						<g-select class="select adding-select" name="grade" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;Have not decided yet&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ">
						<input type="hidden" name="testField" slot="value"></g-select>
					</div>
				</div>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">School you are interested in applying to</h4>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">First choice</label>
						</div>
						<g-select class="select adding-select" name="first_choise" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;Have not decided yet&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ">
						<input type="hidden" name="first_choise" slot="value"></g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Second choice</label>
						</div>
						<g-select class="select adding-select" name="second_choise" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ">
						<input type="hidden" name="second_choise" slot="value"></g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Third choice</label>
						</div>
						<g-select class="select adding-select" name="third_choise" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ">
						<input type="hidden" name="third_choise" slot="value"></g-select>
					</div>
				</div>
			</div>
		`;
	},
	addingStepFive(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Test Information</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle withmar">Registered Official Test Date</h4>
					<div class="adding-inpt adding-radio-row">
						<div class="form-label-row">
							<input type="radio" id="have_registered" class="adding-radio" name="registered" checked>
							<label class="form-label adding-label-have" for="have_registered">Have registered</label>
						</div>
						<g-select class="select adding-select" name="have_registered" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Press to choose your official test date" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ">
							<input type="hidden" name="have_registered" slot="value">
						</g-select>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<input type="radio" id="have_yet" class="adding-radio" name="registered">
							<label class="form-label adding-label-have" for="have_yet">Have not registered yet</label>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	addingStepSix() {
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Summary</h3>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Course & plan</strong>
						<button class="adding-summary-btn">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>Chosen Course:</span>
							<strong>SHSAT</strong>
						</li>
						<li class="adding-summary-item">
							<span>Chosen Level:</span>
							<strong>Middle (5-7th Grade)</strong>
						</li>
						<li class="adding-summary-item">
							<span>Plan:</span>
							<strong>FREE</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Account Settings</strong>
						<button class="adding-summary-btn">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>First Name:</span>
							<strong>Darlene</strong>
						</li>
						<li class="adding-summary-item">
							<span>Last Name:</span>
							<strong>Robertson</strong>
						</li>
						<li class="adding-summary-item">
							<span>Email:</span>
							<strong>exmplm@example.com</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Parent Information</strong>
						<button class="adding-summary-btn">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<strong>Skipped for now</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">School Information</strong>
						<button class="adding-summary-btn">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>Current School:</span>
							<strong>Scholars' Academy</strong>
						</li>
						<li class="adding-summary-item">
							<span>Grade:</span>
							<strong>7th</strong>
						</li>
						<li class="adding-summary-item">
							<span>First Choice:</span>
							<strong>Am. Studies/ Lehman</strong>
						</li>
						<li class="adding-summary-item">
							<span>Second Choice:</span>
							<strong>Have not decided yet</strong>
						</li>
						<li class="adding-summary-item">
							<span>Third Choice:</span>
							<strong>Have not decided yet</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Test Information</strong>
						<button class="adding-summary-btn">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>Registered Official Test Date:</span>
							<strong>May 17, 2023</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Discount</strong>
						<button class="adding-summary-btn">Edit</button>
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
								<td>SHSAT</td>
								<td>-</td>
								<td>Free</td>
								<td>$ 0.00</td>
							</tr>
							<tr>
								<td colspan="3"></td>
								<td>
									<ul class="adding-table-list">
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
			</div>
		`;
	}
};