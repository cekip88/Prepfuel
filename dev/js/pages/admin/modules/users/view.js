export const view = {
	usersBodyTabs(){
		const _ = this;
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active" data-click="${_.componentName}:changeSection" section="student"><span>Students</span></button>
					<button class="subnavigate-button" data-click="${_.componentName}:changeSection" section="parent"><span>Parents</span></button>
					<button class="subnavigate-button" data-click="${_.componentName}:changeSection" section="admin"><span>Admins</span></button>
				</div>
			</div>
		`;
	},
	pagination(count = null,limit = null){
		const _ = this;
		return `
			<div class="pagination pagination-top fill">
				<div class="pagination-info">
					<span>
						1 - 
						<i class="gusers-limit">${limit !== null ? limit : "<img src='/img/loader.gif' class='loader'>"}</i>
						 of 
						<i class="gusers-count ">${count !== null ? count : "<img src='/img/loader.gif' class='loader'>"}</i>
					</span>
				</div>
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
	usersBodyRowsTpl(usersData,from='users'){
		const _ = this;
		let trs = [];
		if(usersData['response'])	usersData = usersData['response'];
		if(!usersData) return void 0;
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			if(from === 'users') {
				tr.innerHTML = _.usersBodyRowTpl(item['currentPlan'], item['user'], item);
			}else{
				tr.innerHTML = _.studentsBodyRowTpl(item['currentPlan'], item['user'], item);
			}
			trs.push(tr);
		}
		return trs;
	},
	usersBodyRowTpl(plan,rowData,user){
		const _ = this;
		let course = plan && plan['course'] ? plan['course'].title + ' ' + plan['level']['title'] : '';
		let avatar = rowData.avatar ? rowData.avatar.avatar.split('.')[0] : '';
		let tpl = `
				<td>
					<div class="tbl-item">
						<div class="users-photo-icon">
							${avatar ? '<img src="/img/' + avatar + '.svg" alt="' + avatar + '">' : ''}
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
				<div class="tbl-item">
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
					<button class="users-btn button" data-click="${_.componentName}:showRemoveUserPopup"  data-id="${user._id}">
						<svg class="button-icon">
							<use xlink:href="#trash"></use>
						</svg>
					</button>
					<button class="users-btn button profile" data-click="${_.componentName}:changeSection" section="profile" data-id="${user._id}">Profile</button>
				</div>
			</td>
		`
		return tpl;
	},
	studentsBodyRowTpl(plan,rowData,user){
		
		const _ = this;
		let course = plan && plan['course'] ? plan['course'].title + ' ' + plan['level']['title'] : '';
		let avatar = rowData.avatar ? rowData.avatar.avatar.split('.')[0] : '';
		let tpl = `
				<td>
					<div class="tbl-item">
						<div class="users-photo-icon">
							${avatar ? '<img src="/img/' + avatar + '.svg" alt="' + avatar + '">' : ''}
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
		`
		return tpl;
	},
	usersBody(){
		const _ = this;
		return `
			<div class="section users-page" id="usersBody">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Students (<span class="users-count gusers-count"><img src='/img/loader.gif' class='loader'></span>)</h2>
						<div class="block-header-item block-header-search">
							<svg><use xlink:href="#search"></use></svg>
							<g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-date">
							<svg><use xlink:href="#calendar"></use></svg>
							<g-input class="block-header-input block-header-date" range previous type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-select" multiple>
							<g-select
								class="select"
								multiple="true"
								name="testField"
								classname="filter-select table-filter" 
								arrowsvg="/img/sprite.svg#select-arrow" 
								title="Course"
								items="[
									{&quot;value&quot;:0,&quot;text&quot;:&quot;ISEE Middle&quot;},
									{&quot;value&quot;:1,&quot;text&quot;:&quot;ISEE Lower&quot;},
									{&quot;value&quot;:2,&quot;text&quot;:&quot;ISEE Upper&quot;,&quot;active&quot;:true},
									{&quot;value&quot;:3,&quot;text&quot;:&quot;SSAT Middle&quot;,&quot;active&quot;:true},
									{&quot;value&quot;:4,&quot;text&quot;:&quot;SSAT Upper&quot;},
									{&quot;value&quot;:5,&quot;text&quot;:&quot;SHSAT 8th&quot;,&quot;active&quot;:true},
									{&quot;value&quot;:6,&quot;text&quot;:&quot;SHSAT 9th&quot;,&quot;active&quot;:true}
								]"></g-select>
						</div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:addStudent"><span>Add Student</span>
							<svg class="button-icon large">
								<use xlink:href="#plus2"></use>
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
							<div class="tbl-item"><span>date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
							<div class="tbl-item right">Action</div>
						</div>
						<div class="table-cont table-cont-students loader-parent">
							<table class="table">
								<thead class="tbl-head">
									<tr>
										<th>
											<div class="tbl-item">
												<span>USER Name</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div> 
											</div>
										</th>
										<th><div class="tbl-item">Courses</div></th>
										<th>
											<div class="tbl-item">
												<span>date Registered</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div> 
											</div>
										</th>
										<th><div class="tbl-item right">Action</div></th>
									</tr>
								</thead>
								<tbody class="tbl-body"><tr><td><img src='/img/loader.gif' class='loader'></td></tr></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	
	removeCourseTpl(){
		const _ = this;
		return `
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
		`;
	},
	removeUserTpl(){
		const _ = this;
		return `
			<div class="modal-block student-profile-remove-popup" id="removeUserForm">
				<h6 class="modal-title">
					<span>Delete student profile</span>
				</h6>
				<p class="modal-text">Are you sure you want to delete this student profile?</p>
				<div class="modal-row">
					<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
					<button class="button-red" data-click="${_.componentName}:removeUser"><span>Remove</span></button>
				</div>
			</div>
		`;
	},
	removeParentTpl(){
		const _ = this;
		return `
			<div class="modal-block student-profile-remove-popup" id="removeParentForm">
				<h6 class="modal-title">
					<span>Delete parent profile</span>
				</h6>
				<p class="modal-text">Are you sure you want to delete this parent profile?</p>
				<div class="modal-row">
					<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
					<button class="button-red" data-click="${_.componentName}:removeParent"><span>Remove</span></button>
				</div>
			</div>
		`;
	},
	assignStudent(){
		const _ = this;
		return `
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
							<div class="adding-body"></div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back step-prev-btn" data-click="${_.componentName}:changePrevStep" type="assign" step="1">
							<span>Cancel</span>
						</button>
						<button class="button-blue step-next-btn" data-click="${_.componentName}:changeNextStep" type='assign'  step="2">
							<span>Next</span>
						</button>
					</div>
				</div>
				</div>
		`;
	},
	
	choiseSelectStudent(choiceData,title='School you are interested in applying to'){
		const _ = this;
		let activeFirst,activeSecond,activeThird;

		if(_.studentInfo.firstSchool) activeFirst = `_id:${_.studentInfo.firstSchool}`;
		if(_.studentInfo.secondSchool) activeSecond = `_id:${_.studentInfo.secondSchool}`;
		if(_.studentInfo.thirdSchool) activeThird = `_id:${_.studentInfo.thirdSchool}`;
		let
			firstItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeFirst),
			secondItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeSecond),
			thirdItems = _.createSelectItems(choiceData.schools,"value:_id;text:school",activeThird);
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

	assignStepTwo(stepData){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Application School List</h3>
				${_.choiseSelectStudent(stepData)}
			</div>
		`;
	},
	assignStepFour(){
		const _ = this;

		let testDate = 'Have not registered yet';
		if (_.studentInfo.testDatePicked) testDate = _.createdAtFormat(_.studentInfo['testDate']);
		let schoolTitles = [_.metaInfo.firstSchool,_.metaInfo.secondSchool,_.metaInfo.thirdSchool];
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
							<strong>${_.metaInfo.course}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Chosen Level:</span>
							<strong>${_.metaInfo.level}</strong>
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
					<ul class="adding-summary-list">${_.addingSummarySchoolsTpl(schoolTitles)}</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Test Information</strong>
						<button class="adding-summary-btn"  data-click="${_.componentName}:jumpToStep" type='assign' step="3">Edit</button>
					</div>
					<ul class="adding-summary-list">
						<li class="adding-summary-item">
							<span>Registered Official Test Date:</span>
							<strong>${testDate}</strong>
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
	addingSummarySchoolsTpl(schoolTitles){
		const _ = this;
		if (!schoolTitles.length) return;
		let tpl = '', i = -1,titles = ['First Choice','Second Choice','Third Choice']
		for (let schoolTitle of schoolTitles) {
			i++;
			if (!schoolTitle) continue;
			tpl += `
				<li class="adding-summary-item">
					<span>${titles[i]}:</span>
					<strong>${schoolTitle}</strong>
				</li>`;
		}
		return tpl;
	},
	addingStudent(){
		const _ = this;
		return `
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
							<div class="adding-body"><img src="/img/loader.gif"></div>
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
		`;
	},
	levelButtons(stepData){
		const _ = this;
			let tpl = ``;
		stepData.levels.forEach( (item) => {
			let activeClass = '';
			if(_.studentInfo['level']){
				if(_.studentInfo['level'] == item._id){
					activeClass = 'active';
				}
			}
			tpl+=`<button class="adding-button ${ activeClass }" data-id="${item._id}" data-click="${_.componentName}:changeStudentLevel">${item.title}</button>`;
		});
		return tpl;
	},
	
	// Adding steps
	addingStepOne(stepData){
		const _ = this;
		let
			courses = stepData['courses'],
			tpl = `
				<h3 class="adding-title">Course & Plan</h3>
				<div class="adding-section">
					<div class="adding-label">What test is the student purchasing?</div>
					<div class="adding-buttons">
		`;
		courses.forEach( (item,cnt) => {
			let activeClass = '';
			if(_.studentInfo['course']){
				if(_.studentInfo['course'] == item._id){
					activeClass = 'active';
				}
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
		return tpl;
	},
	addingStepTwo() {
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Account Settings</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<button data-click="${_.componentName}:selectAvatar" data-callback="addStudent">
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
						<g-input type="text" name="email"  value="${_.studentInfo['email'] ?? ''}" class="g-form-item" data-input="${_.componentName}:fillStudentInfo" classname="form-input adding-inpt"></g-input>
						</div>
				</div>
				<div class="adding-section">
					<h4 class="adding-subtitle">Password</h4>
					<p class="adding-text">Password will be sent to a student via email invitation to the platform</p>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Password</label>
						</div>
						<g-input type="password" name="password"  value="${_.studentInfo['password'] ?? ''}" data-input="${_.componentName}:fillStudentInfo" class="g-form-item" classname="form-input"></g-input>
					</div>
					<p class="adding-text">8+ characters, with min. one number, one uppercase letter and one special character</p>
					<div class="adding-inpt small">
						<div class="form-label-row">
							<label class="form-label">Repeat password</label>
						</div>
						<g-input type="password" name="cpass"  value="${_.studentInfo['cpass'] ?? ''}" data-input="${_.componentName}:fillStudentInfo" class="g-form-item" classname="form-input"></g-input>
					</div>
				</div>
				<button class="adding-generate" data-click="${_.componentName}:generatePassword">Generate Password</button>
			</div>
		`;
	},
	addingStepThree() {
		const _ = this;
		let width = '';
		if (_.metaInfo && _.metaInfo.parentAddType && _.metaInfo.parentAddType == 'assign') width = 'full';
		let tpl =  `
			<h3 class="adding-title">Parent Information</h3>
			<div class="adding-section">
				<div class="adding-label">Select the way of adding a parent</div>
				<div class="adding-buttons">
					<button class="adding-button ${_.metaInfo && _.metaInfo.parentAddType == 'assign' ? 'active' : ''}" data-click="${_.componentName}:assignParent">Assign from base</button>
					<button class="adding-button ${(_.metaInfo && _.metaInfo.parentAddType == 'adding') || !_.metaInfo || !_.metaInfo.parentAddType ? 'active' : ''}" data-click="${_.componentName}:addNewParent">Add new parent</button>
					<button class="adding-button ${_.metaInfo && _.metaInfo.parentAddType == 'skip' ? 'active' : ''}" data-click="${_.componentName}:skipParent">Skip for now</button>
				</div>
			</div>
			<div class="adding-assign-body ${width} parent-adding-table">`;
		if (!_.metaInfo || !_.metaInfo.parentAddType || _.metaInfo.parentAddType == 'adding') {
			tpl += _.assignNewParent();
		} else if (_.metaInfo.parentAddType == 'assign') {
			tpl += _.assignParentTpl(true);
			} else if(_.metaInfo.parentAddType == 'assigned') {
			tpl += _.assignedParent(_.currentParent)
		} else {
			tpl += _.skipParentTpl();
		}
		tpl += `</div>`;
		return tpl;
	},
	addingStepFour(stepData){
		const _ = this;
		let gradeActive;
		if(_.studentInfo.grade) gradeActive = `_id:${_.studentInfo.grade}`;
		let gradeItems = _.createSelectItems(stepData.grades, 'value:_id;text:grade', gradeActive);
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
				${_.choiseSelectStudent(stepData)}
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
							<input type="radio" id="have_registered" class="adding-radio" name="registered" data-change="${_.componentName}:skipTestDate" ${_.studentInfo.testDatePicked ? 'checked' : ''}>
							<label class="form-label adding-label-have" for="have_registered">Have registered</label>
						</div>
						<g-input type='date' format="month DD, YYYY" value="${_.studentInfo.testDate ?? ''}" data-change="${_.componentName}:fillStudentInfo" class="select adding-select" name="testDate" classname="adding-select" icon="false" xlink="select-arrow-bottom" placeholder="Press to choose your official test date"></g-input>
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
	addingStepSix(){
		const _ = this;
		let testDate = 'Have not registered yet';
		if (_.studentInfo.testDatePicked) testDate = _.createdAtFormat(_.studentInfo['testDate']);
		let schoolTitles = [_.metaInfo.firstSchool,_.metaInfo.secondSchool,_.metaInfo.thirdSchool];
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
							<strong>${_.metaInfo.course}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Chosen Level:</span>
							<strong>${_.metaInfo.level}</strong>
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
							<strong>${_.studentInfo.firstName ?? ''}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Last Name:</span>
							<strong>${_.studentInfo.lastName ?? ''}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Email:</span>
							<strong>${_.studentInfo.email ?? ''}</strong>
						</li>
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Parent Information</strong>
						<button class="adding-summary-btn" data-click="${_.componentName}:jumpToStep" type='adding' step="3">Edit</button>
					</div>
					<ul class="adding-summary-list">
						${_.parentSkipped ? _.parentSkippedTpl() : _.parentTpl()}
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
							<strong>${_.studentInfo.currentSchool ?? ''}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Grade:</span>
							<strong>${_.metaInfo.grade ?? ''}</strong>
						</li>
						${_.addingSummarySchoolsTpl(schoolTitles)}
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
							<strong>${testDate}</strong>
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
	// Adding steps end
	
	skipParentTpl(){
		return `<h2 class="parent-skip">You can assign or add parent later</h2>`
	},
	assignParentTpl(asked = false){
		const _ = this;
		let
			count = asked ? _.parents.total : null,
			limit = asked ? _.parents.limit : null;
		if (count < limit) limit = count;
		let tpl = `
			<div class="block" id="assignParent">
				<div class="block-header">
					<h2 class="block-title">Parents (<span class="users-count">${count ?? ''}</span>)</h2>
					<div class="block-header-item block-header-search">
						<svg><use xlink:href="#search"></use></svg>
						<g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input>
					</div>
					<div class="block-header-item block-header-date">
						<svg><use xlink:href="#calendar"></use></svg>
						<g-input class="block-header-input block-header-date" type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input>
					</div>
					<div class="block-header-item block-header-select">
						<g-select class="select" action="testChange" name="testField" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="All Parents" items="[{&quot;value&quot;:1,&quot;text&quot;:&quot;option 1&quot;},{&quot;value&quot;:2,&quot;text&quot;:&quot;option 2&quot;},{&quot;value&quot;:3,&quot;text&quot;:&quot;option 3&quot;}]" style="--class:select block-header-select; --action:testChange; --name:testField; --classname:filter-select; --arrowsvg:img/sprite.svg#select-arrow;"><input type="hidden" name="testField" slot="value"></g-select>
					</div>
				</div>
				${_.pagination(count,limit)}
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
							<thead class="tbl-head">
								<tr>
									<th>
										<div class="tbl-item">
											<span>USER Name</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div> 
										</div>
									</th>
									<th>
										<div class="tbl-item">
											<span>Students</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div> 
										</div>
									</th>
									<th>
										<div class="tbl-item right">
											<span>date Registered</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div> 
										</div>
									</th>
									<th><div class="tbl-item right">Action</div></th>
								</tr>
							</thead>
							<tbody class="tbl-body">`;
		if (asked) {
			for (let item of _.parents.response) {
				tpl += '<tr class="tbl-row">' + _.parentsBodyRowTpl(item) + '</tr>';
			}
		} else tpl += `<tr class="tbl-row"><td><img src='/img/loader.gif' class='loader'></td></tr>`;
		tpl += `</tbody>
				</table>
			</div>
			</div>
			</div>
		`
		return tpl;
	},
	parentsBodyRowsTpl(usersData,type='adding'){
		const _ = this;
		let trs = [];
		usersData = usersData['response'];
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			if(type=='adding'){
				tr.innerHTML = _.parentsBodyRowTpl(item);
			} else if(type == 'single') {
				tr.innerHTML = _.subSection == 'parent' ? _.parentsSingleBodyRowTpl(item) : _.adminSingleBodyRowTpl(item);
			}else {
				tr.innerHTML = _.parentsInfoRow(item);
			}
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
						<span>${rowData['user'].firstName.substr(0,1)}</span>
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData['user'].firstName} ${rowData['user'].lastName}</h6>
						<span class="users-info-email">${rowData['user'].email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item parent-table-students-block">`;
		if (rowData.students.length) {
			tpl += `<div class="parent-table-students">`;
			for (let item of rowData.students) {
				if(rowData.students.length) {
					let avatar = item.user.avatar ? item.user.avatar.avatar : '';
					tpl += `<div class="parent-table-student">${avatar ? '<img src="/img/' + avatar + '.svg">' : ''}</div>`
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
					<button class="users-btn button profile" data-click="${_.componentName}:showPopupParentProfile" data-id="${rowData['_id']}">Profile</button>
					<button 
						class="users-btn button-blue"
						data-id="${rowData['_id']}"  
						data-click=${_.componentName}:assignStudentToParent
					>
						${_.studentInfo['parentId'] && _.studentInfo['parentId'] == rowData['_id'] ? 'Assigned' : 'Assign'}
					</button>
				</div>
			</td>
		`
		return tpl;
	},
	parentsSingleBodyRowTpl(rowData){
		const _ = this;
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="parent-table-avatar">
						<span>${rowData['user'].firstName.substr(0,1)}</span>
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData['user'].firstName} ${rowData['user'].lastName}</h6>
						<span class="users-info-email">${rowData['user'].email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item parent-table-students-block">`;
					if (rowData.students.length) {
						tpl += `<div class="parent-table-students">`;
						for (let item of rowData.students) {
							if(rowData.students.length) {
								let avatar = item.user.avatar ? item.user.avatar.avatar : '';
								tpl += `<div class="parent-table-student">${avatar ? '<img src="/img/' + avatar + '.svg">' : ''}</div>`
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
				<div class="tbl-item">
					<div class="users-date">${_.createdAtFormat(rowData.createdAt)}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right actions">
					<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use>
						</svg>
					</button>
					<button class="users-btn button" data-click="${_.componentName}:showRemoveParentPopup"  data-id="${rowData._id}">
						<svg class="button-icon">
							<use xlink:href="#trash"></use>
						</svg>
					</button>
					<button class="users-btn button profile">Profile</button>
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
								${this.super_$.firstName[0].toUpperCase()}
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
					<g-input type="text" name="firstName" value="${_.parentInfo.firstName ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Last name</label>
					</div>
					<g-input type="text" name="lastName" value="${_.parentInfo.lastName ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<g-input type="email" name="email" value="${_.parentInfo.email ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Phone Number</label>
					</div>
					<g-input type="email" name="phone" value="${_.parentInfo.phone ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
			</div>
			<div class="adding-section">
				<h4 class="adding-subtitle">Password</h4>
				<p class="adding-text">Password will be sent to a student via email invitation to the platform</p>
				<div class="adding-inpt small">
					<div class="form-label-row">
						<label class="form-label">Password</label>
					</div>
					<g-input type="password" name="password" value="${_.parentInfo.password ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input"></g-input>
				</div>
				<p class="adding-text">8+ characters, with min. one number, one uppercase letter and one special character</p>
				<div class="adding-inpt small">
					<div class="form-label-row">
						<label class="form-label">Repeat password</label>
					</div>
					<g-input type="password" name="cpass" value="${_.parentInfo.cpass ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input"></g-input>
				</div>
			</div>
			<button class="adding-generate" data-click="${_.componentName}:generatePassword">Generate Password</button>
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
	
	parentSkippedTpl(){
		const _ = this;
		return `
			<li class="adding-summary-item">
				<strong>Skipped for now</strong>
			</li>
		`;
	},
	parentTpl(){
		const _ = this;
		return `
			<li class="adding-summary-item">
				<span>First Name:</span>
				<strong>${_.parentInfo.firstName ?? ''}</strong>
			</li>
			<li class="adding-summary-item">
				<span>Last Name:</span>
				<strong>${_.parentInfo.lastName ?? ''}</strong>
			</li>
			<li class="adding-summary-item">
				<span>Email:</span>
				<strong>${_.parentInfo.email ?? ''}</strong>
			</li>
		`;
	},
	
	


	///
	emptyCourseInfo(){
		const _ = this;
		return `
			<h5 class="student-profile-course-empty">Currently, there is no ISEE course assign to this student</h5>
			<button  class="student-profile-course-empty-btn" data-click="${_.componentName}:showAssignPopup">
				<svg class="button-icon">
					<use xlink:href="#plus"></use>
				</svg>
				<span>Assign SHSAT Course</span>
			</button>
		`;
	},
	courseInfo(choiceData){
		const _ = this;
		let
			plan = _.studentInfo["currentPlan"],
			course = plan && plan['course'] ? plan['course'].title : '',
			testDate = plan && plan['testDate'] ? _.createdAtFormat(plan['testDate']) : '';
		return `
			<div class="adding-section">
				<h4 class="adding-subtitle withmar">Course & Test Information</h4>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Course</label>
					</div>
					<g-input type="text" name="course" value='${course}' class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Official test date</label>
					</div>
					<g-input type="date" name="testDate" format="month DD, YYYY" icon="false" value="${testDate}" class="g-form-item" classname="form-input adding-inpt"></g-input>
					</div>
			</div>
			${_.choiseSelectStudent(choiceData,'Application School List')}
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
	
	notifications(notifications){
		const _ = this;
		let tpl = `
			<h1 class="title">Notifications</h1>
			<ul class="student-notifications-list">`;
			for(let notification of notifications){
				let id = Math.random().toString(36).substr(2, 9);
				tpl+=`<li class="student-notifications-list-item">
					<label for="${id}" class="student-notifications-list-item-label">
						<div class="student-notifications-list-item-content">
							<h5 class="student-notifications-list-item-title">${notification['title']}</h5>
							<h6 class="student-notifications-list-item-subtitle">${notification['subtitle']}</h6>
						</div>
						<div class="student-notifications-list-item-action">
							<input id="${id}" type="checkbox">
							<span class="student-notifications-list-item-action-btn"></span>
						</div>
					</label>
				</li>`
			}
			`</ul>
		`;
			return tpl;
	},
	activityHistory(){
		const _ = this;
		let tpl = `
			<div class="activity-header-list">${_.activityHistoryHeaderTpl(_.activityHeaderData)}</div>
			<div class="activity-table">${_.activityTableTpl()}</div>
		`;
		return tpl;
	},
	activityHistoryHeaderTpl(headerData){
		let tpl = '',colors = ['violet','turquoise','blue','brown'],icons = ['newClock','activity','equalizer','calendar'];
		for (let i = 0; i < headerData.length; i++) {
			tpl += `
				<div class="activity-header-block">
					<div class="activity-header-icon ${colors[i]}">
						<svg><use xlink:href="#${icons[i]}"></use></svg>
					</div>
					<div class="activity-header-info">
						<div class="activity-header-title">${headerData[i].title}</div>
						<div class="activity-header-text">${headerData[i].info}</div>
					</div>
				</div>
			`
		}
		return tpl;
	},
	activityBodyRowsTpl(activityData){
		const _ = this;
		let trs = [];
		if(!activityData.length) return void 0;
		for(let item of activityData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			tr.innerHTML = _.activityBodyRowTpl(item);
			trs.push(tr);
		}
		return trs;
	},
	activityBodyRowTpl(rowData){
		const _ = this;
		let date = _.createdAtFormat(rowData.date);
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="users-course ${rowData.color}">${rowData.course}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-date">${date}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-date">${rowData.timeIn}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-date">${rowData.timeOut}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-date">${rowData.duration}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right">
					<button class="users-btn button profile">Details</button>
				</div>
			</td>
		`
		return tpl;
	},
	activityTableTpl(){
		return `
			<div class="tbl">
				<div class="tbl-head">
					<div class="tbl-item"><span>Course</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div> 
					</div>
					<div class="tbl-item"><span>Date</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item">Time in</div>
					<div class="tbl-item">time out</div>
					<div class="tbl-item"><span>session duration</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item right">Action</div>
				</div>
				<div class="table-cont table-cont-students loader-parent">
					<table class="table">
						<thead class="tbl-head">
							<tr>
								<th>
									<div class="tbl-item">
										<span>Course</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th>
									<div class="tbl-item "><span>Date</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>
									</div>
								</th>
								<th><div class="tbl-item">Time in</div></th>
								<th><div class="tbl-item">time out</div></th>
								<th>
									<div class="tbl-item"><span>session duration</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>
									</div>
								</th>
								<th><div class="tbl-item right">Action</div></th>
							</tr>
						</thead>
						<tbody class="tbl-body"><tr><td><img src='/img/loader.gif' class='loader'></td></tr></tbody>
					</table>
				</div>
			</div>
		`
	},
	parentsInfoRow(rowData){
		const _ = this;
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="parent-table-avatar">
						<span>${rowData['user'].firstName.substr(0,1)}</span>
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData['user'].firstName} ${rowData['user'].lastName}</h6>
						<span class="users-info-email">${rowData['user'].email}</span>
					</div>
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
					<button
						class="users-btn button-blue profile"
						data-id="${rowData['_id']}"
						data-click=${_.componentName}:deleteParent
					>
						<svg><use xlink:href="#close"></use></svg>
					</button>
				</div>
			</td>
		`
		return tpl;
	},
	
	addParentPopup(){
		const _ = this;
		return `
			<div id="add-parent">
				<div class="block test-block adding-block">
					<div class="test-header">
						<h5 class="block-title test-title adding-header-title">
							<span>Adding a Parent</span>
						</h5>
					</div>
					<div class="adding-inner">
						<div class="adding-row">
							<ol class="adding-list">
								<li class="adding-list-item active">
									<strong class="adding-list-digit">1</strong>
									<div class="adding-list-desc">
										<h5 class="adding-list-title">Parent Information</h5>
										<h6 class="adding-list-subtitle">Assign Or Add a Parent</h6>
									</div>
								</li>
							</ol>
							<div class="adding-body parent-popup-body"><img src="/img/loader.gif"></div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back step-prev-btn" data-click="modaler:closeModal">
							<span>Cancel</span>
						</button>
						<button class="button-blue step-next-btn">
							<span>Submit</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	
	headerParentAddingFromProfile(){
		const _ = this;
		return `
			<div class="adding-section">
				<div class="adding-label">Select the way of adding a parent</div>
				<div class="adding-buttons">
					<button class="adding-button" data-click="${_.componentName}:assignParent" type="assign">Assign from base</button>
					<button class="adding-button active" data-click="${_.componentName}:addNewParent" type="adding">Add new parent</button>
				</div>
			</div>
		`;
	},
	parentAddingFromProfile(from='profile'){
		const _ = this;
		let width = '';
		if (_.metaInfo && _.metaInfo.parentAddType && _.metaInfo.parentAddType == 'assign') width = 'full';
		let tpl =  `
			<h3 class="adding-title">Parent Information</h3>
			${from == 'profile' ? _.headerParentAddingFromProfile() : ''}
			<div class="adding-assign-body ${width} parent-adding-table">`;
				if (!_.metaInfo.parentAddType || _.metaInfo.parentAddType == 'adding') {
					tpl += _.assignNewParent();
				} else if (_.metaInfo.parentAddType == 'assign') {
					tpl += _.assignParentTpl(true);
				}
		tpl += `</div>`;
		return tpl;
	},
	assignedParent(parentInfo){
		const _ = this;
		let studentsTpl = ``,students = parentInfo.students;
		if (students.length) {
			studentsTpl += `<div class="parent-table-students">`;
			for (let item of students) {
				if(students.length) {
					let avatar = item.user.avatar ? item.user.avatar.avatar : '';
					studentsTpl += `<div class="parent-table-student">${avatar ? '<img src="/img/' + avatar + '.svg">' : ''}</div>`
				}
			}
			studentsTpl += `
				</div>
				<div class="parent-table-students-count">${students.length} student${students.length > 1 ? 's' : ''}</div>`
		} else {
			studentsTpl += `<div class="parent-table-students-empty">No Students</div>`
		}
		return `
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
						<div class="tbl-item right">
						<span>Date Registered</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item right">Action</div>
					</div>
					<div class="table-cont">
						<table class="table">
							<thead class="tbl-head">
								<tr>
									<th>
										<div class="tbl-item">
											<span>USER Name</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>
										</div>
									</th>
									<th>
										<div class="tbl-item">
											<span>Students</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>
										</div>
									</th>
									<th>
										<div class="tbl-item right">
											<span>date Registered</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>
										</div>
									</th>
									<th><div class="tbl-item right">Action</div></th>
								</tr>
							</thead>
							<tbody class="tbl-body">
								<tr>
									<td>
										<div class="tbl-item">
											<div class="parent-table-avatar">
												<span>${parentInfo['user']['firstName'].toUpperCase()[0]}</span>
											</div>
											<div class="users-info">
												<h6 class="users-info-name">${parentInfo['user']['firstName']} ${parentInfo['user']['lastName']}</h6>
												<span class="users-info-email">${parentInfo['user']['email']}</span>
											</div>
										</div>
									</td>
									<td>
									 ${studentsTpl}
									</td>
									<td>
										<div class="tbl-item right">
											<div class="users-date">${_.createdAtFormat(parentInfo.createdAt)}</div>
										</div>
									</td>
									<td>
										<div class="tbl-item right actions">
											<button class="users-btn button profile" data-click="${_.componentName}:showParentProfile">Profile</button>
											<button
												class="users-btn button-red"
												data-id="${parentInfo['_id']}"
												data-click=${_.componentName}:removeAssignedParent
											>Remove</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
				</div>
			</div>
		`;
	},
	parentsInfo(){
		const _ = this;
		return `
			<div class="tbl">
				<div class="tbl-head">
					<div class="tbl-item"><span>USER Name</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item right"><span>Date Registered</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item right">Action</div>
				</div>
				<div class="table-cont loader-parent parents-info-table">
					<table class="table">
						<thead class="tbl-head">
							<tr>
								<th>
									<div class="tbl-item">
										<span>USER Name</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>
									</div>
								</th>
								<th><div class="tbl-item">Courses</div></th>
								<th>
									<div class="tbl-item right">
										<span>date Registered</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>
									</div>
								</th>
								<th><div class="tbl-item right">Action</div></th>
							</tr>
						</thead>
						<tbody class="tbl-body"><tr><td><img src='/img/loader.gif' class='loader'></td></tr></tbody>
					</table>
					<button class="button-link blue" data-click="${_.componentName}:showAddParentPopup" from="profile">
						<svg>
							<use xlink:href="#plus2"></use>
						</svg>
						<span>Add parent</span>
					</button>
				</div>
			</div>
		`;
	},

	
	personalInfo(){
		const _ = this;
		let gradeActive;
		if(_.studentInfo.grade) gradeActive = `_id:${_.studentInfo.grade}`;
		let gradeItems = _.createSelectItems(_.wizardData.grades, 'value:_id;text:grade', gradeActive);
		return `
			<div class="student-profile-row">
				<div class="student-profile-left">
					<h4 class="admin-block-graytitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<button data-click="${_.componentName}:selectAvatar">
							<strong class="adding-avatar-letter">${_.studentInfo.avatar ? '<img src="/img/' + _.studentInfo.avatar.avatar + '.svg">' : _.studentInfo.firstName.substr(0,1)}</strong>
							<span class="adding-avatar-link">${_.studentInfo.avatar ? 'Change' : 'Select'} Avatar</span>
						</button>
					</div>
					<div class="adding-section">
						<div class="adding-inpt-row">
							<div class="adding-inpt small">
								<div class="form-label-row">
									<label class="form-label">First name</label>
								</div>
								<g-input type="text" name="firstName"  data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["firstName"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
							</div>
							<div class="adding-inpt small">
								<div class="form-label-row">
									<label class="form-label">Last name</label>
								</div>
								<g-input type="text" name="lastName"  data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["lastName"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
							</div>
						</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Email</label>
							</div>
							<g-input type="text" name="email"  data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["email"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
							</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Date registered</label>
							</div>
							<g-input type="text" name="testDate"  data-input="${_.componentName}:fillStudentInfo"  value='${_.createdAtFormat(_.studentInfo["createdAt"])}' class="g-form-item" classname="form-input adding-inpt"></g-input>
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
							<g-input type="text" name="currentSchool"  data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["currentSchool"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
						</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Grade</label>
							</div>
							<g-select class="select adding-select" name="grade"  data-change="${_.componentName}:fillStudentInfo" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course"
							items=${JSON.stringify(gradeItems)}></g-select>
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
					<div class="student-profile-course-info loader-parent"><img src='/img/loader.gif' class='loader'></div>
				</div>
			</div>
			<div class="student-profile-footer">
				<button class="student-profile-delete" data-click="${_.componentName}:showRemoveUserPopup" data-id="${_.studentInfo['studentId']}">Delete User Profile</button>
				<div class="student-profile-actions">
					<button class="test-footer-back" data-click="${_.componentName}:changeSection" section="student" rerender>
						<span>Discard</span>
					</button>
					<button class="button-blue" data-click="${_.componentName}:updateStudent">
						<span>Save Changes</span>
					</button>
				</div>
			</div>
		`;
	},
	profile(){
		const _ = this;
		return `
			<div class="section">
				<div class="breadcrumbs"></div>
				<div class="block">
					${_.sectionHeaderTpl({
						title: 'Student Profile',
						buttonsData:{
							action:`data-click="${_.componentName}:changeProfileTab"`,
							buttons:[
								{title:'Personal Info',active:'active',},
								{title:'Parents Info'},
								{title:'Activity History'},
								{title:'Notifications'}
							]
						}
					})}
					<div class="student-profile-inner"><img src="/img/loader.gif"></div>
				</div>
			</div>
		`;
	},
	breadCrumbsTpl(crumbs){
		const _ = this;
		let tpl = ``;
		for (let i = 0; i < crumbs.length; i++) {
			if (i < crumbs.length - 1) {
				tpl += `
					<a href="${crumbs[i].href ?? '#'}" class="breadcrumbs-item">${crumbs[i].title}</a>
					<span class="breadcrumbs-delimiter">/</span>
				`
			} else {
				tpl += `<strong class="breadcrumbs-current">${crumbs[i].title}</strong>`
			}
		}
		return tpl;
	},

	parentProfileFromAddStudent(){
		const _ = this;
		return `
			<div id="parent-profile-popup">
				<div class="block test-block adding-block">
					${_.sectionHeaderTpl({
						title: 'Parent Profile',
						buttonsData:{
							action:`data-click="${_.componentName}:changeParentPopupProfileTab"`,
							buttons:[
								{title:'Personal Info',active:'active',},
								{title:'Students'}
							]
						}
					})}
					<div class="adding-inner">
						<div class="adding-row">
							<div class="parent-popup-profile-body adding-center"><img src="/img/loader.gif"></div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back step-prev-btn">
							<span>Back</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	parentPersonalInfoTpl(parentInfo){
		const _ = this;
		return `
			<div class="adding-section">
				<h4 class="adding-subtitle">Parent Personal Info</h4>
				<div class="adding-avatar">
					<div class="profile-img-row">
						<div class="profile-img">
							<div class="profile-img-letter">
								${this.super_$.firstName[0].toUpperCase()}
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
					<g-input type="text" name="firstName" value="${_.parentInfo.firstName ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Last name</label>
					</div>
					<g-input type="text" name="lastName" value="${_.parentInfo.lastName ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<g-input type="email" name="email" value="${_.parentInfo.email ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Phone Number</label>
					</div>
					<g-input type="email" name="phone" value="${_.parentInfo.phone ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
			</div>
		`;
	},
	parentChildesInfoTpl(childes){
		const _ = this;
		return `
			<div class="section users-page" id="parentsStudentTable">
				<div class="block">
					<div class="tbl">
						<div class="tbl-head">
							<div class="tbl-item"><span>USER Name</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
							<div class="tbl-item">Courses</div>
							<div class="tbl-item right"><span>Date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
						</div>
						<div class="table-cont table-cont-students loader-parent">
							<table class="table">
								<thead class="tbl-head">
									<tr>
										<th>
											<div class="tbl-item">
												<span>USER Name</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div>
											</div>
										</th>
										<th><div class="tbl-item">Courses</div></th>
										<th>
											<div class="tbl-item right">
												<span>Date Registered</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div>
											</div>
										</th>
									</tr>
								</thead>
								<tbody class="tbl-body"><tr><td><img src='/img/loader.gif' class='loader'></td></tr></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	adminFooter(){
		const _ = this;
		return `
			<div hidden>
				${_.addingStudent()}
				${_.assignStudent()}
				${_.removeCourseTpl()}
				${_.removeUserTpl()}
				${_.removeParentTpl()}
				${_.selectAvatarTpl()}
				${_.addParentPopup()}
				${_.parentProfileFromAddStudent()}
			</div>
		`
	},
	

	// Parents Page
	parentsBody(){
		const _ = this;
		let filterSelectOptions = [
			{
				value: 1, text: 'All parents',active:true
			},{
				value: 2, text: 'No students',
			},{
				value: 3, text: 'With students',
			}
		];
		return `
			<div class="section users-page" id="bodyParents">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Parents (<span class="users-count gusers-count"><img src='/img/loader.gif' class='loader'></span>)</h2>
						<div class="block-header-item block-header-search">
							<svg><use xlink:href="#search"></use></svg>
							<g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-date">
							<svg><use xlink:href="#calendar"></use></svg>
							<g-input class="block-header-input block-header-date"  type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-select">
							<g-select class="select" action="testChange" name="testField" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="All Parents"
							items='${JSON.stringify(filterSelectOptions)}'></g-select>
						</div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:showAddParentPopup" from="body">
							<span>Add Parent</span>
							<svg class="button-icon large">
								<use xlink:href="#plus2"></use>
							</svg>
						</button>
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
			        <div class="tbl-item"><span>date Registered</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item right">Action</div>
			      </div>
			      <div class="table-cont loader-parent">
			        <table class="table">
			          <thead class="tbl-head">
			          <tr>
			            <th>
			              <div class="tbl-item">
			                <span>USER Name</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th>
			              <div class="tbl-item">
			                <span>Students</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th>
			              <div class="tbl-item">
			                <span>date Registered</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th><div class="tbl-item right">Action</div></th>
			          </tr>
			          </thead>
			          <tbody class="tbl-body">
							</div>
					</div>
			</div>
		`;
	},

	//admins page
	adminsBody(){
		const _ = this;
		let filterSelectOptions = [
			{
				value: 1, text: 'All Roles',active:true
			},{
				value: 2, text: 'No students',
			},{
				value: 3, text: 'With students',
			}
		];
		let tpl = `
			<div class="section users-page" id="bodyAdmins">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Admins (<span class="users-count gusers-count"><img src='/img/loader.gif' class='loader'></span>)</h2>
						<div class="block-header-item block-header-search">
							<svg><use xlink:href="#search"></use></svg>
							<g-input class="block-header-input" type="text" placeholder="Search" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-date">
							<svg><use xlink:href="#calendar"></use></svg>
							<g-input class="block-header-input block-header-date"  type="date" icon="false" format="month DD, YYYY" classname="form-input form-search"></g-input>
						</div>
						<div class="block-header-item block-header-select">
							<g-select class="select" action="testChange" name="testField" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="All Admins"
							items='${JSON.stringify(filterSelectOptions)}'></g-select>
						</div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:showAddAdminPopup" from="body">
							<span>Add Admin</span>
							<svg class="button-icon large">
								<use xlink:href="#plus2"></use>
							</svg>
						</button>
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
			        <div class="tbl-item">Role</div>
			        <div class="tbl-item"><span>date Registered</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item right">Action</div>
			      </div>
			      <div class="table-cont loader-parent">
			        <table class="table">
			          <thead class="tbl-head">
			          <tr>
			            <th>
			              <div class="tbl-item">
			                <span>USER Name</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th>
			              <div class="tbl-item">Role</div>
			            </th>
			            <th>
			              <div class="tbl-item">
			                <span>date Registered</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th><div class="tbl-item right">Action</div></th>
			          </tr>
			          </thead>
			          <tbody class="tbl-body">
							</div>
					</div>
			</div>
		`;
		return tpl;
	},
	adminSingleBodyRowTpl(rowData){
		const _ = this;
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="table-admin-title">
						<div class="parent-table-avatar">
							<span>${rowData['user'].firstName.substr(0,1)}</span>
						</div>
						<div class="users-info">
							<h6 class="users-info-name">${rowData['user'].firstName} ${rowData['user'].lastName}</h6>
							<span class="users-info-email">${rowData['user'].email}</span>
						</div>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-course ${rowData.user.role == 'admin' ? 'blue' : 'violet'}">${rowData.user.role}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">
					<div class="users-date">${_.createdAtFormat(rowData.createdAt)}</div>
				</div>
			</td>
			<td>
				<div class="tbl-item right actions">
					<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use>
						</svg>
					</button>
					<button class="users-btn button" data-click="${_.componentName}:showRemoveParentPopup"  data-id="${rowData._id}">
						<svg class="button-icon">
							<use xlink:href="#trash"></use>
						</svg>
					</button>
					<button class="users-btn button profile" data-click="${_.componentName}:changeSection" section="adminProfile" data-id="${rowData._id}">Profile</button>
				</div>
			</td>
		`
		return tpl;
	},
	adminProfile(){
		const _ = this;
		return `
			<div class="section">
				<div class="breadcrumbs"></div>
				<div class="block">
					${_.sectionHeaderTpl({
						title: 'Admin Profile',
						buttonsData:{
							action:`data-click="${_.componentName}:changeProfileTab"`,
							buttons:[
								{title:'Personal Info',active:'active',},
								{title:'Activity History'}
							]
						}
					})}
					<div class="student-profile-inner"><img src="/img/loader.gif"></div>
				</div>
			</div>
		`;
	},
	adminProfileInner(){
		const _ = this;
		let tpl = `
			<div class="adding-center">
				<div class="adding-section">
				<h4 class="adding-subtitle">Admin Personal  Info</h4>
				<div class="adding-avatar">
					<div class="profile-img-row">
						<div class="profile-img">
							<div class="profile-img-letter">
								${this.super_$.firstName[0].toUpperCase()}
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
					<g-input type="text" value="${_.adminInfo.firstName ?? ''}" name="firstName" data-input="${_.componentName}:fillAdminInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Last name</label>
					</div>
					<g-input type="text" name="lastName" value="${_.adminInfo.lastName ?? ''}" data-input="${_.componentName}:fillAdminInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<g-input type="email" name="email" value="${_.adminInfo.email ?? ''}" data-input="${_.componentName}:fillAdminInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Role</label>
					</div>
					<g-select
						class="select"
						name="testField"
						className="form-row-select"
						classname="filter-select table-filter"
						arrowsvg="/img/sprite.svg#select-arrow"
						title="Role"
						items=`;
		if (_.adminInfo.role == 'admin') {
			tpl += `"[
				{&quot;value&quot;:0,&quot;text&quot;:&quot;Admin&quot;,&quot;active&quot;:&quot;true&quot;},
				{&quot;value&quot;:1,&quot;text&quot;:&quot;Super Admin&quot;}
			]"`;
		} else if (_.adminInfo.role == 'superAdmin') {
			tpl += `"[
				{&quot;value&quot;:0,&quot;text&quot;:&quot;Admin&quot;,&quot;active&quot;:&quot;true&quot;},
				{&quot;value&quot;:1,&quot;text&quot;:&quot;Super Admin&quot;}
			]"`;
		}

		tpl += `></g-select>
				</div>
			</div>
		`;
		return tpl;
	}
}
