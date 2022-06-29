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
			<div class="pagination pagination-top fill">
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
	usersBodyRowsTpl(usersData){
		const _ = this;
		let trs = [];
		console.log(usersData);
		usersData = usersData['response'];
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['user']['_id']);
			tr.innerHTML = _.usersBodyRowTpl(item['course'],item['user']);
			trs.push(tr);
		}
		return trs;
	},
	usersBodyRowTpl(course,rowData){
		const _ = this;
		let tpl = `
				<td>
					<div class="tbl-item">
						<div class="users-photo-icon">
							<img src="/img/${rowData.avatar}" alt="">
						</div>
						<div class="users-info">
							<h6 class="users-info-name">${rowData.firstName} ${rowData.lastName}</h6>
							<span class="users-info-email">${rowData.email}</span>
						</div>
					</div>
				</td>
				<td>
					<div class="tbl-item">
						<div class="users-course brown">${course}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right">
					<div class="users-date">${_.createdAtFormat(rowData.createdAt)}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right">
					<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use> 
						</svg>
					</button>
					<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#trash"></use>
						</svg>
					</button>
					<button class="users-btn button profile" data-click="${_.componentName}:showProfile">Profile</button>
				</div>
			</td>
		`
		return tpl;
	},
	usersBody() {
		const _ = this;
		return `
			<div class="section users-page">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Students <span class="users-count"></span></h2>
						<div class="block-header-item block-header-search"><svg><use xlink:href="#search"></use></svg><g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input></div>
						<div class="block-header-item block-header-date"><svg><use xlink:href="#calendar"></use></svg><g-input class="block-header-input block-header-date" type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input></div>
						<div class="block-header-item block-header-select"><g-select class="select block-header-select" action="testChange" name="testField" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="Course" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" ><input type="hidden" name="testField" slot="value"></g-select></div>
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
									<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
							<div class="tbl-item">Courses</div>
							<div class="tbl-item right"><span>date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
							<div class="tbl-item right">Action</div>
						</div>
						<div class="table-cont loader-parent">
							<table class="table">
								<tbody class="tbl-body"></tbody>
							</table>
						</div>
					</div>
				</div>
				${_.addingStudent()}
				
			</div>
		`;
	},
	removeCourseTpl(){
		const _ = this;
		return `
			<div hidden>
				<div class="modal-block student-profile-remove-popup" id="removeForm">
					<h6 class="modal-title">
						<span>Removing course</span>
					</h6>
					<p class="modal-text">Are you sure want to remove this course?</p>
					<div class="modal-row">
						<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
						<button class="button-red" data-click="${_.componentName}:removeCourse"><span>Remove</span></button>
					</div>
				</div>
			</div>
		`;
	},
	assignStudent(){
		const _ = this;
		return `
			<div hidden>
				<div class="admin-modal"	id="assignForm">
					<div class="block test-block adding-block">
					<div class="test-header">
						<h5 class="block-title test-title adding-header-title">
							<span>Assign Course</span>
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
										<h5 class="adding-list-title">Application School List</h5>
										<h6 class="adding-list-subtitle">Schools Info</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">3</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Test Information</h5>
										<h6 class="adding-list-subtitle">Set Test Info</h6>
									</div>
								</li>
								<li class="adding-list-item">
									<strong class="adding-list-digit">4</strong>
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
						<button class="test-footer-back step-prev-btn" data-click="${_.componentName}:changePrevStep" type="assign" step="1">
							<span>Cancel</span>
						</button>
						<button class="button-blue step-next-btn" data-click="${_.componentName}:changeNextStep" type='assign' step="2">
							<span>Next</span>
						</button>
					</div>
				</div>
				</div>
			</div>
		`;
	},
	assignStepTwo(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Application School List</h3>
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
	assignStepFour(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Summary</h3>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Course & plan</strong>
						<button class="adding-summary-btn" data-click="${_.componentName}:jumpToStep" type='assign' step="1">Edit</button>
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
						<strong class="adding-summary-title">Application School List</strong>
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='assign' step="2">Edit</button>
					</div>
					<ul class="adding-summary-list">
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
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='assign' step="3">Edit</button>
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
						<button class="test-footer-back step-prev-btn" data-click="modaler:closeModal" type="adding">
							<span>Cancel</span>
						</button>
						<button class="button-blue step-next-btn" data-click="${_.componentName}:changeNextStep" type="adding" step="2">
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
					<button class="adding-button">SSAT</button>
					<button class="adding-button active">SHSAT</button>
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
							<g-input type="text" name="first_name" class="g-form-item" classname="form-input adding-inpt"></g-input>
						</div>
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">Last name</label>
							</div>
							<g-input type="text" name="last_name" class="g-form-item" classname="form-input adding-inpt"></g-input>
						</div>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<g-input type="text" name="email" class="g-form-item" classname="form-input adding-inpt"></g-input>
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
		return `
			<h3 class="adding-title">Parent Information</h3>
			<div class="adding-section">
				<div class="adding-label">Select the way of adding a parent</div>
				<div class="adding-buttons">
					<button class="adding-button" data-click="${_.componentName}:assignParent">Assign from base</button>
					<button class="adding-button active" data-click="${_.componentName}:addNewParent">Add new parent</button>
					<button class="adding-button">Skip for now</button>
				</div>
			</div>
			<div class="adding-assign-body">
				${_.assignNewParent()}
			</div>
		`;
	},
	assignParentTpl(){
		const _ = this;
		return `
			<div class="block" id="assignParent">
				<div class="block-header">
					<h2 class="block-title">Parents <span class="users-count"></span></h2>
					<div class="block-header-item block-header-search">
						<svg><use xlink:href="#search"></use></svg>
						<g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input>
					</div>
					<div class="block-header-item block-header-date">
						<svg><use xlink:href="#calendar"></use></svg>
						<g-input class="block-header-input block-header-date" type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input>
					</div>
					<div class="block-header-item block-header-select">
						<g-select class="select block-header-select" action="testChange" name="testField" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="All Parents" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" style="--class:select block-header-select; --action:testChange; --name:testField; --classname:filter-select; --arrowsvg:img/sprite.svg#select-arrow;"><input type="hidden" name="testField" slot="value"></g-select>
					</div>
				</div>
				${_.pagination()}
				<div class="tbl">
					<div class="tbl-head">
						<div class="tbl-item"> 
							<span>USER Name</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item">
							<span>Students</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item right"><span>date Registered</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item right">Action</div>
					</div>
					<div class="table-cont loader-parent">
						<table class="table">
							<tbody class="tbl-body"></tbody>
						</table>
					</div>
				</div>
			</div>
		`
	},
	parentsBodyRowsTpl(usersData){
		const _ = this;
		let trs = [];
		usersData = usersData['response'];
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			tr.innerHTML = _.parentsBodyRowTpl(item);
			trs.push(tr);
		}
		return trs;
	},
	parentsBodyRowTpl(rowData){
		const _ = this;
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="parent-table-avatar">
						<span>${rowData.firstName.substr(0,1)}</span>
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData.firstName} ${rowData.lastName}</h6>
						<span class="users-info-email">${rowData.email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item parent-table-students-block">`;

		if (rowData.students.length) {
			tpl += `<div class="parent-table-students">`;
			for (let item of rowData.students) {
				if(rowData.students.length) {
					tpl += `<div class="parent-table-student"><img src="../../../../../img/${item.avatar}"></div>`
				}
			}
			tpl += `
				</div>
				<div class="parent-table-students-count">${rowData.students.length} student${rowData.students.length > 1 ? 's' : ''}</div>`
		} else {
			tpl += `<div class="parent-table-students-empty">No Students</div>`
		}

		tpl += `
				</div>
			</td>
			<td>
				<div class="tbl-item right">
					<div class="users-date">${_.createdAtFormat(rowData.createdAt)}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right actions">
					<button class="users-btn button profile">Profile</button>
					<button class="users-btn button-blue profile">Assign</button>
				</div>
			</td>
		`
		return tpl;
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
						<g-input type='date' class="select adding-select" name="have_registered" classname="adding-select" icon="false" xlink="select-arrow-bottom" placeholder="Press to choose your official test date"></g-input>
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
	addingStepSix(){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Summary</h3>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Course & plan</strong>
						<button class="adding-summary-btn" data-click="${_.componentName}:jumpToStep" type='adding' step="1">Edit</button>
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
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='adding' step="2">Edit</button>
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
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='adding' step="3">Edit</button>
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
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='adding' step="4">Edit</button>
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
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='adding' step="5">Edit</button>
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
			</div>
		`;
	},
	
	///
	emptyCourseInfo(){
		const _ = this;
		return `
			<h5 class="student-profile-course-empty">Currently, there is no ISEE course assign to this student</h5>
			<button  class="student-profile-course-empty-btn" data-click="${_.componentName}:showAssignPopup">Assign SHSAT Course</button>
		`;
	},
	courseInfo(){
		const _ = this;
		return `
			<div class="adding-section">
				<h4 class="adding-subtitle withmar">Course & Test Information</h4>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Course</label>
					</div>
					<g-input type="text" name="email" class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Official test date</label>
					</div>
					<g-input type="text" name="email" class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
			</div>
			<div class="adding-section">
				<h4 class="adding-subtitle withmar">Application School List</h4>
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
			<div class="adding-section">
				<h4 class="adding-subtitle withmar">Membership Plan</h4>
				<div class="student-profile-plan">
					<h5 class="student-profile-plan-title">Free</h5>
					<div class="student-profile-plan-price">$0.00 per month</div>
					<button class="student-profile-plan-edit">Edit</button>
				</div>
			</div>
			<button class="student-profile-remove" data-click="${_.componentName}:showRemovePopup">Remove This Course</button>
		`;
	},
	profile(){
		const _ = this;
		return `
			<div class="section">
				${_.breadCrumbs()}
				<div class="block">
					${_.sectionHeaderTpl({
						title: 'Student Profile',
						buttons:{
							'Personal Info':'active',
							'Parents Info':'',
							'Activity History':'',
							'Notifications':'',
						}
					})}
					<div class="student-profile-row">
						<div class="student-profile-left">
							<h4 class="admin-block-graytitle">Student Personal Info</h4>
							<div class="adding-avatar">
								<label for="avatar">
									<strong class="adding-avatar-letter">K</strong>
									<span class="adding-avatar-link">Select Avatar</span>
									<input type="file">
								</label>
							</div>
							<div class="adding-section">
								<div class="adding-inpt-row">
									<div class="adding-inpt small">
										<div class="form-label-row">
											<label class="form-label">First name</label>
										</div>
										<g-input type="text" name="first_name" class="g-form-item" classname="form-input adding-inpt"></g-input>
									</div>
									<div class="adding-inpt small">
										<div class="form-label-row">
											<label class="form-label">Last name</label>
										</div>
										<g-input type="text" name="last_name" class="g-form-item" classname="form-input adding-inpt"></g-input>
									</div>
								</div>
								<div class="adding-inpt">
									<div class="form-label-row">
										<label class="form-label">Email</label>
									</div>
									<g-input type="text" name="email" class="g-form-item" classname="form-input adding-inpt"></g-input>
									</div>
								<div class="adding-inpt">
									<div class="form-label-row">
										<label class="form-label">Date registered</label>
									</div>
									<g-input type="text" name="email" class="g-form-item" classname="form-input adding-inpt"></g-input>
									</div>
							</div>
							<div class="adding-section">
								<h4 class="adding-subtitle">Password</h4>
								<p class="adding-text">Students' password can be changed by a linked parent or by admin manually</p>
								<button class="adding-generate student-profile-send">Send Link To A Parent To Reset Password</button>
								<button class="student-profile-change">Change Manually</button>
							</div>
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
						</div>
						<div class="student-profile-right">
							<h4 class="admin-block-graytitle">Courses & Plans</h4>
							<div class="student-profile-courses-btns">
								<button class="student-profile-courses-btn">ISEE</button>
								<button class="student-profile-courses-btn">SSAT</button>
								<button class="student-profile-courses-btn active">SHSAT</button>
							</div>
							<div class="student-profile-course-info">
								${ _.courseInfo() }
							</div>
						</div>
					</div>
					<div class="student-profile-footer">
						<button class="student-profile-delete">Delete User Profile</button>
						<div class="student-profile-actions">
							<button class="test-footer-back" data-click="AdminPage:changeSection" section="/admin/users">
								<span>Discard</span>
							</button>
							<button class="button-blue">
								<span>Save Changes</span>
							</button>
						</div>
					</div>
				</div>
				${_.assignStudent()}
				${_.removeCourseTpl()}
			</div>
		`;
	},
	breadCrumbs(){
		const _ = this;
		return `
			<div class="breadcrumbs">
				<a href="#" class="breadcrumbs-item">Users</a>
				<span class="breadcrumbs-delimiter">/</span>
				<a href="#" class="breadcrumbs-item">Students</a>
				<span class="breadcrumbs-delimiter">/</span>
				<strong class="breadcrumbs-current">Brooklyn Simmons Profile</strong>
			</div>
		`;
	}
	
}
