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
	pagination(role = this.subSection){
		const _ = this;
		return `
			<div class="pagination pagination-top fill" role="${role}">
				<img src="/img/loader.gif" alt="">
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
				tr.innerHTML = _.usersBodyRowTpl(item['plans'], item['user'], item);
			} else {
				tr.innerHTML = _.studentsBodyRowTpl(item['plans'], item['user'], item);
			}
			trs.push(tr);
		}
		return trs;
	},
	usersPlansTpl(plans){
		const _ = this;
		let ans = [];
		if (!plans || !plans.length) return [];
		for (let item of plans) {
			let
				course = item.level.levelTag,
				courseWords = item.level.levelTag.split(' '),
				courseCls = `${courseWords[0]}-${courseWords[1]}`;
			ans.push({course,courseCls});
		}
		return ans;
	},
	usersBodyRowTpl(plans,rowData,user){
		const _ = this;
		let coursesData = _.usersPlansTpl(plans);
		let avatar = rowData.avatar ? rowData.avatar.avatar : '';
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="users-photo-icon">
						${avatar ? '<img src="/img/' + avatar + '.png" alt="' + avatar + '">' : ''}
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData.firstName} ${rowData.lastName}</h6>
						<span class="users-info-email">${rowData.email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">`;
		for (let courseData of coursesData) {
			tpl += `<div class="users-course ${courseData.courseCls ?? ''}">${courseData.course ?? ''}</div>`;
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
				<div class="tbl-item right">
					<!--<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use> 
						</svg>
					</button>-->
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
	studentsBodyRowTpl(plans,rowData,user){
		const _ = this;
		let coursesData = _.usersPlansTpl(plans);
		let avatar = rowData.avatar ? rowData.avatar.avatar : '';
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="users-photo-icon">
						${avatar ? '<img src="/img/' + avatar + '.png" alt="' + avatar + '">' : ''}
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData.firstName} ${rowData.lastName}</h6>
						<span class="users-info-email">${rowData.email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item">`;
		for (let courseData of coursesData) {
			tpl += `<div class="users-course ${courseData.courseCls ?? ''}">${courseData.course ?? ''}</div>`
		}
		tpl += `
			</div>
		</td>
			<td>
				<div class="tbl-item right">
					<div class="users-date">${_.createdAtFormat(user.createdAt)}</div>
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
						<div class="filter" role="student"><img src="/img/loader.gif" alt=""></div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:addStudent"><span>Add Student</span>
							<svg class="button-icon large">
								<use xlink:href="#plus2"></use>
							</svg>
						</button> 
					</div>
					${_.pagination('student')}
					<div class="tbl">
						<div class="tbl-head">
							<div class="tbl-item"><span>USER Name</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div> 
							</div>
							<div class="tbl-item">Courses</div>
							<div class="tbl-item"><span>date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="createdAt_desc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="createdAt_asc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
													<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div> 
											</div>
										</th>
										<th><div class="tbl-item">Courses</div></th>
										<th>
											<div class="tbl-item">
												<span>date Registered</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="createdAt_desc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="createdAt_asc" role="student"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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

	filterTpl(subSection = this.subSection){
		const _ = this;
		let tpl;
		if (subSection === 'student') {
			let options = [];
			for (let courseData of _.wizardData.courses) {
				for (let option of courseData['levels']) {
					let optionTitle = courseData.title + ' ' + option.title;
					options.push({value:option._id,text:optionTitle});
				}
			}
			tpl = `
				<div class="block-header-item block-header-search">
					<svg><use xlink:href="#search"></use></svg>
					<g-input 
						class="block-header-input search-user" 
						type="text" 
						name="search" 
						placeholder="Search" 
						classname="form-input form-search" 
						data-input="${_.componentName}:searchUsers" 
						role="student"
					></g-input>
				</div>
				<div class="block-header-item block-header-date">
					<svg><use xlink:href="#calendar"></use></svg>
					<g-input 
						class="block-header-input block-header-date" 
						name="dates" 
						range 
						previous 
						type="date" 
						icon="false" 
						format="month DD, YYYY" 
						classname="form-input form-search" 
						data-change="${_.componentName}:filterUsersByDates"
					></g-input>
				</div>
				<div class="block-header-item block-header-select" multiple>
					<g-select
						class="select"
						data-change="${_.componentName}:searchUsers"
						multiple="true"
						name="level"
						classname="filter-select table-filter" 
						arrowsvg="/img/sprite.svg#select-arrow" 
						title="Course"
						items='${JSON.stringify(options)}'
					></g-select>
				</div>
			`;
			return tpl;
		} else if (subSection === 'parent') {
			let options = [
				{text:'All parents',value:undefined},
				{text:'No Students',value:false},
				{text:'With Students',value:true}
			];
			tpl = `
				<div class="block-header-item block-header-search">
					<svg><use xlink:href="#search"></use></svg>
					<g-input 
						class="block-header-input" 
						type="text" 
						name="search" 
						placeholder="Search" 
						classname="form-input form-search" 
						data-input="${_.componentName}:searchUsers"
					></g-input>
				</div>
				<div class="block-header-item block-header-date">
					<svg><use xlink:href="#calendar"></use></svg>
					<g-input 
						class="block-header-input block-header-date" 
						range 
						previous 
						name="searchDates"
						type="date" 
						icon="false" 
						format="month DD, YYYY" 
						classname="form-input form-search"
						data-change="${_.componentName}:filterUsersByDates"
					></g-input>
				</div>
				<div class="block-header-item block-header-select">
					<g-select 
						class="select" 
						data-change="${_.componentName}:searchUsers" 
						name="hasStudents" 
						classname="filter-select table-filter" 
						arrowsvg="/img/sprite.svg#select-arrow" 
						title="All Parents"
						items='${JSON.stringify(options)}'></g-select>
				</div>
			`;
		} else if (subSection === 'admin') {
			let options = [{text:'Superadmin',value:'superadmin'},{text:'Admin',value:'admin'}];
			tpl = `
				<div class="block-header-item block-header-search">
					<svg><use xlink:href="#search"></use></svg>
					<g-input class="block-header-input" type="text" name="search" placeholder="Search" classname="form-input form-search" data-input="${_.componentName}:searchUsers"></g-input>
				</div>
				<div class="block-header-item block-header-date">
					<svg><use xlink:href="#calendar"></use></svg>
					<g-input class="block-header-input block-header-date" name="dates" range previous type="date" icon="false" format="month DD, YYYY" classname="form-input form-search" data-change="${_.componentName}:filterUsersByDates"></g-input>
				</div>
				<div class="block-header-item block-header-select">
					<g-select class="select" data-change="${_.componentName}:searchUsers" name="hasStudents" classname="filter-select table-filter" arrowsvg="/img/sprite.svg#select-arrow" title="All Parents"
					items='${JSON.stringify(options)}'></g-select>
				</div>
			`;
		}
		return tpl;
	},
	paginationTpl({limit,total,page}){
		const _ = this;
		let lastPage = Math.ceil(total / limit);
		let buttonsCount = lastPage < 5 ? lastPage : 5;
		let tpl = `
			<div class="pagination-info">
				<span>
					<i class="gusers-page">1</i> - 
					<i class="gusers-limit">${limit > total ? total : limit}</i>
					 of 
					<i class="gusers-count ">${total}</i>
				</span>
			</div>
			<div class="pagination-links"> 
				<button class="pagination-arrow pagination-prev" data-click="${_.componentName}:paginate" value="${page - 1}" ${page < 2 ? 'disabled': ''}>
					<svg class="arrow">
						<use xlink:href="#arrow-left-transparent"></use>
					</svg>
				</button><div class="pagination-inner" data-total="${total}" data-limit="${limit}">`;
		let index = page <= 3 ? 1 : page - 2;
		if (index > lastPage - 4) index = lastPage - 4;
		if (lastPage < 5) index = 1;
		for (let i = 0; i < buttonsCount; i++, index++) {
			tpl += `<button class="pagination-link${page == index ? ' active' : ''}" value="${index}" data-click="${_.componentName}:paginate">${index}</button>`;
		}
		tpl += `
				</div>
				<button class="pagination-arrow pagination-next" data-click="${_.componentName}:paginate" value="${page + 1}" ${page >= lastPage ? 'disabled': ''}>
					<svg class="arrow">
						<use xlink:href="#arrow-right-transparent"></use>
					</svg>
				</button>
			</div>
			<div class="pagination-end">
				<span>Jump to</span>
				<input class="pagination-jump-to" type="text" value="1" limit="${lastPage}" data-change="${_.componentName}:paginateTo">
			</div>
		`;

		return tpl;
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
	removedCourseTpl(){
		const _ = this;
		return `
			<div class="modal-block student-profile-remove-popup" id="removedCourse">
				<h6 class="modal-title">
					<span>Assign a Course</span>
				</h6>
				<p class="modal-text">Please assign a course to this student. At least one course must be assigned to a student</p>
				<div class="modal-row">
					<button class="button" type="button" data-click="modaler:closeModal"><span>Ok</span></button>
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
	removeAdminTpl(){
		const _ = this;
		return `
			<div class="modal-block student-profile-remove-popup" id="removeAdminForm">
				<h6 class="modal-title">
					<span>Delete admin profile</span>
				</h6>
				<p class="modal-text">Are you sure you want to delete this admin profile?</p>
				<div class="modal-row">
					<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
					<button class="button-red" data-click="${_.componentName}:removeAdmin"><span>Remove</span></button>
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
			<div class="admin-modal" id="assignForm">
				<div class="block adding-block">
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
						<button class="button-blue step-next-btn" data-click="${_.componentName}:changeNextStep" type='assign' step="2">
							<span>Next</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},

	choiceSelectStudent(choiceData,title='School you are interested in applying to'){
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
				</li>`
	},

	assignStepTwo(stepData){
		const _ = this;
		return `
			<div class="adding-center">
				<h3 class="adding-title">Application School List</h3>
				${_.choiceSelectStudent(stepData)}
			</div>
		`;
	},
	assignStepFour(){
		const _ = this;
		let testDate = 'Have not registered yet';
		console.log(_.courseData[_.courseData.currentPlan])
		if (_.courseData[_.courseData.currentPlan].testDatePicked) testDate = _.createdAtFormat(_.courseData[_.courseData.currentPlan].testDate);
		let schoolTitles = [
			_.courseData[_.courseData.currentPlan].firstSchool.school,
			_.courseData[_.courseData.currentPlan].secondSchool.school,
			_.courseData[_.courseData.currentPlan].thirdSchool.school,
		];
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
							<strong>${_.courseData[_.courseData.currentPlan].course.title}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Chosen Level:</span>
							<strong>${_.courseData[_.courseData.currentPlan].level.title}</strong>
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
			<div class="admin-modal" id="addingForm">
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
		let
			tpl = ``,
			curPlan = _.courseData[_.courseData.currentPlan] ?? _.studentInfo.currentPlan;

		stepData.levels.forEach( (item,index) => {
			let activeClass = '';
			if (curPlan && curPlan['level']) {
				if(curPlan['level']._id == item._id) activeClass = 'active';
			} else {
				if (!index) activeClass = 'active';
			}
			tpl += `<button class="adding-button ${ activeClass }" data-id="${item._id}" data-click="${_.componentName}:changeStudentLevel">${item.title}</button>`;
		});
		return tpl;
	},
	changePassword(){
		const _ = this;
		let tpl = `
			<div class="block password passwords" id="changePassword">
				<div class="test-header">
					<h5 class="block-title bigPop-title">
						<span>Change Password</span>
					</h5>
				</div>
				<div class="password-inner">
					<h6 class="password-title">Password</h6>
					<span class="password-desc">Password will be sent to a user via email invitation to the platform</span>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Password</label>
						</div>
						<g-input 
							type="password" 
							name="password" 
							match="changePassword"
							class="g-form-item" 
							data-outfocus="${_.componentName}:validatePassword"
							className="form-input adding-inpt"
						></g-input>
						<span class="form-label-desc">8+ characters, with min. one number, one uppercase letter and one special character</span>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<label class="form-label">Repeat password</label>
						</div>
						<g-input 
							type="password" 
							name="confirm_password" 
							match="changePassword"
							class="g-form-item" 
							data-outfocus="${_.componentName}:validatePassword" 
							className="form-input adding-inpt"
						></g-input>
					<span class="form-label-desc" style="display:none;">Password does not match</span>
					</div>
					<button class="adding-generate" data-click="${_.componentName}:generatePassword">Generate Password</button>
				</div>
				<div class="student-profile-footer">
					<div class="student-profile-actions sb">
						<button class="test-footer-back" data-click="modaler:closeModal">
							<span>Back</span>
						</button>
						<button class="button-blue" data-click="${_.componentName}:saveChangePassword">
							<span>Save</span>
						</button>
					</div>
				</div>
			</div>
		`;
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
					<div class="adding-buttons course-buttons">
		`;
		courses.forEach( (item,cnt) => {
			let activeClass = '';
			if(item.title === _.courseData.currentPlan){
				_.coursePos = cnt;
				activeClass = 'active';
			}
			tpl += `
				<button 
					class="adding-button ${ activeClass }" 
					pos="${cnt}" 
					data-click="${_.componentName}:changeTestType" 
					data-id="${item._id}"
					${_.courseAction === 'assign' && !activeClass.length ? 'disabled' : ''}
				>
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
			<div class="adding-center passwords">
				<h3 class="adding-title">Account Settings</h3>
				<div class="adding-section">
					<h4 class="adding-subtitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<button data-click="${_.componentName}:selectAvatar" data-callback="addStudent">
							<strong class="adding-avatar-letter">
								${_.studentInfo.avatarName ? '<img src="/img/' + _.studentInfo.avatarName + '.png">' : 'K'}
							</strong>
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
	addingStepThree() {
		/* <button class="adding-button ${_.metaInfo && _.metaInfo.parentAddType == 'skip' ? 'active' : ''}" data-click="${_.componentName}:skipParent">Skip for now</button>*/
		const _ = this;
		let width = '';
		//<button class="adding-button ${_.metaInfo && _.metaInfo.parentAddType == 'skip' ? 'active' : ''}" data-click="${_.componentName}:skipParent">Skip for now</button>
		if (_.metaInfo && _.metaInfo.parentAddType && _.metaInfo.parentAddType == 'assign') width = 'full';
		let tpl =  `
			<h3 class="adding-title">Parent Information</h3>
			<div class="adding-section">
				<div class="adding-label">Select the way of adding a parent</div>
				<div class="adding-buttons">
					<button 
						class="adding-button 
						${_.metaInfo && _.metaInfo.parentAddType == 'assign' ? 'active' : ''}" 
						data-click="${_.componentName}:assignParent"
					>Assign from the base</button>
					<button 
						class="adding-button 
						${(_.metaInfo && _.metaInfo.parentAddType == 'adding') || !_.metaInfo || !_.metaInfo.parentAddType ? 'active' : ''}" 
						data-click="${_.componentName}:addNewParent"
					>Add new parent</button>
				</div>
			</div>
			<div class="adding-assign-body ${width} parent-adding-table">`;
		if (!_.metaInfo || !_.metaInfo.parentAddType || _.metaInfo.parentAddType == 'adding') {
			tpl += _.assignNewParent();
		} else if (_.metaInfo.parentAddType == 'assign') {
			tpl += _.metaInfo.parentAssigned ? _.assignedParent(_.currentParent) : _.assignParentTpl(true);
		} else {
			tpl += _.skipParentTpl();
		}
		tpl += `</div>`;
		return tpl;
	},
	addingStepFour(stepData){
		const _ = this;
		let gradeActive;
		if(_.studentInfo.grade) gradeActive = `_id:${_.studentInfo.grade._id}`;
		let gradeItems = _.createSelectItems(stepData.grades, 'value:_id;text:grade', gradeActive);
		let curSchoolValue = _.studentInfo.currentSchool ?? '';
		let tpl = `
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
								value="${curSchoolValue}"
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
				${_.choiceSelectStudent(stepData)}
			</div>
		`;
		return tpl;
	},
	liveSelectOptions(schools){
		const _ = this;
		let tpl = '';
		for (let item of schools) {
			tpl += `<button class="search-select-option${_.studentInfo.currentSchool == item.school ? ' active' : ''}">${item.school}</button>`;
		}
		return tpl;
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
							<strong>${_.courseData[curCourseTitle].course.title}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Chosen Level:</span>
							<strong>${_.courseData[curCourseTitle].level.title}</strong>
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
							<strong>${_.studentInfo.firstName}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Last Name:</span>
							<strong>${_.studentInfo.lastName}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Email:</span>
							<strong>${_.studentInfo.email}</strong>
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
							<strong>${_.studentInfo.currentSchool}</strong>
						</li>
						<li class="adding-summary-item">
							<span>Grade:</span>
							<strong>${_.studentInfo.grade.grade}</strong>
						</li>
						${_.addingSummarySchoolsTpl(schoolTitles)}
					</ul>
				</div>
				<div class="adding-section">
					<div class="adding-summary">
						<strong class="adding-summary-title">Test Information</strong>
						<button class="adding-summary-btn" data-click="${_.componentName}:jumpToStep" type='adding' step="5">Edit</button>
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
					<div class="filter" role="addingParent">${_.filterTpl('parent')}</div>
				</div>
				${_.pagination('addingParent')}
				<div class="tbl">
					<div class="tbl-head">
						<div class="tbl-item"> 
							<span>USER Name</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item">
							<span>Students</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="students_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="students_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>
						</div>
						<div class="tbl-item right"><span>date Registered</span>
							<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="createdAt_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="createdAt_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div> 
										</div>
									</th>
									<th>
										<div class="tbl-item">
											<span>Students</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="students_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="students_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div> 
										</div>
									</th>
									<th>
										<div class="tbl-item right">
											<span>date Registered</span>
											<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="createdAt_desc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="createdAt_asc" role="addingParent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
		`;
		return tpl;
	},
	parentsBodyRowsTpl({usersData,type = 'adding',role}){
		const _ = this;
		if (!role) role = _.subSection;
		let trs = [];
		usersData = usersData['response'];
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className = 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			if(type=='adding'){
				tr.innerHTML = _.parentsBodyRowTpl(item);
			} else if(type == 'single') {
				tr.innerHTML = role === 'parent' ? _.parentsSingleBodyRowTpl(item) : _.adminSingleBodyRowTpl(item);
			} else {
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
					<div class="parent-table-avatar">`;
		if (!rowData['user'].photo){
			tpl += `<span>${rowData['user'].firstName.substr(0,1)}</span>`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${rowData.user.photo}" class="user-photo">`;
		}
		tpl += `
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
					let avatar = item.user && item.user.avatar ? item.user.avatar.avatar : '';
					tpl += `<div class="parent-table-student">
						${avatar ? '<img src="/img/' + avatar + '.png">' : ''}
					</div>`
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
					<div class="parent-table-avatar">`;
		if (!rowData['user'].photo){
			tpl += `<span>${rowData['user'].firstName.substr(0,1)}</span>`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${rowData.user.photo}" class="user-photo">`;
		}
		tpl += `
					</div>
					<div class="users-info">
						<h6 class="users-info-name">${rowData['user'].firstName} ${rowData['user'].lastName}</h6>
						<span class="users-info-email">${rowData['user'].email}</span>
					</div>
				</div>
			</td>
			<td>
				<div class="tbl-item parent-table-students-block">`;
					if (rowData.students && rowData.students.length) {
						tpl += `<div class="parent-table-students">`;
						for (let item of rowData.students) {
							if(rowData.students.length) {
								let avatar = item.user && item.user.avatar ? item.user.avatar.avatar : '';
								tpl += `<div class="parent-table-student">
									${avatar ? '<img src="/img/' + avatar + '.png">' : ''}
								</div>`
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
					<!--<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use>
						</svg>
					</button>-->
					<button 
						class="users-btn button" 
						${rowData.students && rowData.students.length ? 'disabled' : ''} 
						data-click="${_.componentName}:showRemoveParentPopup" 
						data-id="${rowData._id}"
					>
						<svg class="button-icon">
							<use xlink:href="#trash"></use>
						</svg>
					</button>
					<button class="users-btn button profile" data-click="${_.componentName}:changeSection" data-id="${rowData._id}" section="parentProfile">Profile</button>
				</div>
			</td>
		`
		return tpl;
	},
	assignNewParent(){
		const _ = this;
		let parentInfo = !_.parentInfo.type || _.parentInfo.type !== 'assigned' ? _.parentInfo : {};
		return `
			<div class="adding-section">
				<h4 class="adding-subtitle">Parent Personal Info</h4>
				<div class="adding-avatar">
					<label class="profile-img-row file-cont">
						<input 
							type="file" 
							class="file" 
							data-change="${_.componentName}:uploadPhoto;${_.componentName}:fillParentInfo"
							role="parent"
							accept="image/png, image/gif, image/jpeg, image/jpg"
						>
						<div class="profile-img">
							<div class="profile-img-letter">
								${this.super_$.firstName[0].toUpperCase()}
							</div>
						</div>
						<div class="profile-img-desc">
							Allowed *.jpeg,*.jpg, *.png, *.gif<br>
							Max size of 3.1 MB
						</div>
					</label>
				</div>
			</div>
			<div class="adding-section">
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">First name</label>
					</div>
					<g-input 
						type="text" 
						name="firstName"
						data-required
						value="${parentInfo.firstName ?? ''}" 
						data-input="${_.componentName}:fillParentInfo" 
						class="g-form-item" 
						classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Last name</label>
					</div>
					<g-input 
						type="text" 
						name="lastName"
						data-required 
						value="${parentInfo.lastName ?? ''}" 
						data-input="${_.componentName}:fillParentInfo" 
						class="g-form-item" 
						classname="form-input profile-form-input"></g-input>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Email</label>
					</div>
					<div class="profile-form-row-input">
						<g-input 
							type="email" 
							data-required
							data-outfocus="${_.componentName}:checkEmail" 
							name="email" value="${parentInfo.email ?? ''}" 
							data-input="${_.componentName}:fillParentInfo" 
							class="g-form-item" 
							classname="form-input profile-form-input"></g-input>
						<span class="form-label-desc" style="display:none;">Email is not free</span>
					</div>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Phone Number</label>
					</div>
					<g-input 
						type="phone" 
						name="phone" 
						value="${parentInfo.phone ?? ''}" 
						data-input="${_.componentName}:fillParentInfo" 
						class="g-form-item" 
						classname="form-input profile-form-input"></g-input>
				</div>
			</div>
			<div class="adding-section passwords">
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
						match="assignNewParent"
						value="${parentInfo.password ?? ''}" 
						data-outfocus="${_.componentName}:validatePassword" 
						data-callback="${_.componentName}:fillParentInfo"
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
						match="assignNewParent"
						data-required
						value="${parentInfo.cpass ?? ''}" 
						data-outfocus="${_.componentName}:validatePassword" 
						data-callback="${_.componentName}:fillParentInfo"
						class="g-form-item" 
						classname="form-input"
					></g-input>
					<span class="form-label-desc" style="display:none;">Password does not match</span>
				</div>
				<button class="adding-generate" data-click="${_.componentName}:generatePassword">Generate Password</button>
			</div>
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
				<span>Assign ${_.courseData.currentPlan} Course</span>
			</button>
		`;
	},
	courseInfo(choiceData,plan = this.courseData[this.courseData.currentPlan]){
		const _ = this;
		let
			courseData,
			course = '',
			level = '',
			testDate = plan && plan['testDate'] ? _.createdAtFormat(plan['testDate']) : '';

		if (plan && plan.course) {
			if (plan.course.title) {
				course = plan.course.title;
				level = plan.level ? plan.level.title : '';
			} else {
				courseData = plan && plan['course'] ? choiceData.courses.find((item)=>{if (item._id == plan.course) return item}) : '';
				course = courseData ? courseData.title : '';
				level = courseData ? courseData.levels.find((item)=>{if (item._id == plan.level) return item}).title  : '';
			}
		}

		return `
			<div class="adding-section">
				<h4 class="adding-subtitle withmar">Course & Test Information</h4>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Course</label>
					</div>
					<g-input type="text" name="course" value='${course} ${level}' class="g-form-item" classname="form-input adding-inpt" disabled></g-input>
					</div>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="form-label">Official test date</label>
					</div>
					<g-input 
						type="date" 
						name="testDate" 
						format="month DD, YYYY" 
						icon="false" 
						value="${testDate}" 
						class="g-form-item" 
						classname="form-input adding-inpt"
						data-change="${_.componentName}:fillStudentInfo"
					></g-input>
					</div>
			</div>
			${_.choiceSelectStudent(choiceData,'Application School List')}
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

	notifications(notifications,{title,types,subtitle}){
		const _ = this;
		let tpl = `
			<div class="parentsBodyRowsTplnotifications-list-title-row">
				<div>
					<h1 class="title">${title}</h1>
					${subtitle ? '<h3 class="notifications-list-subtitle">' + subtitle + '</h3>' : ''}
				</div>`
		if (types && types.length) {
			tpl += `<div class="notifications-list-titles">`;
			for (let type of types) {
				tpl += `<span class="notifications-list-titles-item">${type}</span>`
			}
			tpl += '</div>';
		}
		tpl += `</div>
			<ul class="notifications-list">`;
			for(let notification of notifications){
				let id = Math.random().toString(36).substr(2, 9);
				tpl+=`<li class="notifications-list-item">
					<div class="notifications-list-item-content">
						<h5 class="notifications-list-item-title">${notification['title']}</h5>
						<h6 class="notifications-list-item-subtitle">${notification['subtitle']}</h6>
					</div>`;
				if (Array.isArray(types) && types.length) {
					for (let type of types) {
						tpl += `
						<label for="${type + id}" class="notifications-list-item-label">
							<h6 class="notifications-list-item-label-title">${type}</h6>
							<div class="notifications-list-item-action">
								<input id="${type + id}" type="checkbox">
								<span class="notifications-list-item-action-btn"></span>
							</div>
						</label>
					`;
					}
				} else {
					tpl += `
						<label for="${id}" class="notifications-list-item-label">
							<div class="notifications-list-item-action">
								<input id="${id}" type="checkbox">
								<span class="notifications-list-item-action-btn"></span>
							</div>
						</label>
					`;
				}
				tpl += `</li>`
			}
			`</ul>
		`;
			return tpl;
	},
	notificationsNavigation(navData){
		const _ = this;
		let tpl = `<ul class="notifications-navigate-list">`;
		let i = 0;
		for (let type of navData) {
			tpl += `
				<li class="notifications-navigate-item">
					<button 
						class="notifications-navigate-button ${!i ? 'active' : ''}" 
						data-pos="${i}"
						data-click="${_.componentName}:notificationNavigate">
						${type.title}
					</button>
				</li>
			`;
			i++;
		}
		tpl += `</ul>`;
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
					<button class="users-btn button profile" data-click="${_.componentName}:showHistoryDetails">Details</button>
				</div>
			</td>
		`
		return tpl;
	},
	activityTableTpl(){
		const _ = this;
		return `
			<div class="tbl">
				<div class="tbl-head">
					<div class="tbl-item"><span>Course</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div> 
					</div>
					<div class="tbl-item"><span>Date</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item">Time in</div>
					<div class="tbl-item">time out</div>
					<div class="tbl-item"><span>session duration</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th>
									<div class="tbl-item "><span>Date</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>
									</div>
								</th>
								<th><div class="tbl-item">Time in</div></th>
								<th><div class="tbl-item">time out</div></th>
								<th>
									<div class="tbl-item"><span>session duration</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
	activityHistoryDetailsTpl(detailsData){
		const _ = this;
		let tpl = `
			
		`;
		return tpl;
	},
	parentsInfoRow(rowData){
		const _ = this;
		let tpl = `
			<td>
				<div class="tbl-item">
					<div class="parent-table-avatar">`;
		if (!rowData['user'].photo){
			tpl += `<span>${rowData['user'].firstName.substr(0,1)}</span>`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${rowData.user.photo}" class="user-photo">`;
		}
		tpl += `
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
					<button 
						class="users-btn button profile" 
						data-click="UsersModule:showPopupParentProfile" 
						data-id="${rowData._id}"
					>Profile</button>
					<!--<button
						class="users-btn button-blue profile"
						data-id="${rowData['_id']}"
						data-click=${_.componentName}:deleteParent
					>
						<svg class="button-icon"><use xlink:href="#close"></use></svg>
					</button>-->
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
							<div class="adding-body parent-popup-body">
								<img src="/img/loader.gif">
							</div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back step-prev-btn" data-click="modaler:closeModal">
							<span>Cancel</span>
						</button>
						<button class="button-blue step-next-btn" data-click="${_.componentName}:createNewParent">
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
					studentsTpl += `<div class="parent-table-student">
						${avatar ? '<img src="/img/' + avatar + '.png">' : ''}
					</div>`
				}
			}
			studentsTpl += `
				</div>
				<div class="parent-table-students-count">${students.length} student${students.length > 1 ? 's' : ''}</div>`
		} else {
			studentsTpl += `<div class="parent-table-students-empty">No Students</div>`
		}
		let tpl = `
			<div class="tbl">
				<div class="tbl-head">
						<div class="tbl-item">
							<span>USER Name</span>
							<!--<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>-->
						</div>
						<div class="tbl-item">
							<span>Students</span>
							<!--<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>-->
						</div>
						<div class="tbl-item">
						<span>Date Registered</span>
							<!--<div class="tbl-sort-btns">
								<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							</div>-->
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
											<!--<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>-->
										</div>
									</th>
									<th>
										<div class="tbl-item">
											<span>Students</span>
											<!--<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>-->
										</div>
									</th>
									<th>
										<div class="tbl-item">
											<span>date Registered</span>
											<!--<div class="tbl-sort-btns">
												<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											</div>-->
										</div>
									</th>
									<th><div class="tbl-item right">Action</div></th>
								</tr>
							</thead>
							<tbody class="tbl-body">
								<tr>
									<td>
										<div class="tbl-item">
											<div class="parent-table-avatar">`;
		if (!parentInfo.user.photo) {
			tpl += `<span>${parentInfo['user']['firstName'].toUpperCase()[0]}</span>`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${parentInfo['user'].photo}" class="user-photo">`;
		}
		tpl += `
											</div>
											<div class="users-info">
												<h6 class="users-info-name">${parentInfo['user']['firstName']} ${parentInfo['user']['lastName']}</h6>
												<span class="users-info-email">${parentInfo['user']['email']}</span>
											</div>
										</div>
									</td>
									<td>
										<div class="tbl-item notDF">
											${studentsTpl}
										</div>
									</td>
									<td>
										<div class="tbl-item">
											<div class="users-date">${_.createdAtFormat(parentInfo.createdAt)}</div>
										</div>
									</td>
									<td>
										<div class="tbl-item right actions">
											<button class="users-btn button profile" data-id="${parentInfo._id}" data-click="${_.componentName}:showPopupParentProfile">Profile</button>
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
		return tpl;
	},
	parentsInfo(){
		const _ = this;
		return `
			<div class="tbl">
				<div class="tbl-head">
					<div class="tbl-item"><span>USER Name</span>
						<!--<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>-->
					</div>
					<div class="tbl-item right"><span>Date Registered</span>
						<!--<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>-->
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
										<!--<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>-->
									</div>
								</th>
								<th>
									<div class="tbl-item right">
										<span>date Registered</span>
										<!--<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div>-->
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

		let currentCourse;
		if (!_.isEmpty(_.studentInfo['currentPlan'])) {
			if (_.studentInfo['currentPlan']['course']) {
				if (_.studentInfo['currentPlan']['course'].title) {
					currentCourse = _.studentInfo['currentPlan']['course'].title;
				}
			}
		}
		if (!currentCourse) currentCourse = 'ISEE';

		return `
			<div class="student-profile-row student-profile-body">
				<div class="student-profile-left">
					<h4 class="admin-block-graytitle">Student Personal Info</h4>
					<div class="adding-avatar">
						<button data-click="${_.componentName}:selectAvatar">
							<strong class="adding-avatar-letter">
								${_.studentInfo.avatar ? '<img src="/img/' + _.studentInfo.avatar.avatar + '.png">' : _.studentInfo.firstName.substr(0,1)}
							</strong>
							<span class="adding-avatar-link">${_.studentInfo.avatar ? 'Change' : 'Select'} Avatar</span>
						</button>
					</div>
					<div class="adding-section">
						<div class="adding-inpt-row">
							<div class="adding-inpt small">
								<div class="form-label-row">
									<label class="form-label">First name</label>
								</div>
								<g-input type="text" name="firstName" data-required data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["firstName"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
							</div>
							<div class="adding-inpt small">
								<div class="form-label-row">
									<label class="form-label">Last name</label>
								</div>
								<g-input type="text" name="lastName" data-required data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["lastName"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
							</div>
						</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Email</label>
							</div>
							<g-input 
								type="email" 
								name="email" 
								data-required 
								data-outfocus="${_.componentName}:checkEmail" 
								data-input="${_.componentName}:fillStudentInfo" 
								value='${_.studentInfo["email"]}'
								data-value='${_.studentInfo["email"]}' 
								class="g-form-item" 
								classname="form-input adding-inpt"></g-input>
							</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Date registered</label>
							</div>
							<g-input type="text" name="testDate"  data-input="${_.componentName}:fillStudentInfo"  value='${_.createdAtFormat(_.studentInfo["createdAt"])}' class="g-form-item" classname="form-input adding-inpt" disabled></g-input>
							</div>
					</div>
					<div class="adding-section">
						<h4 class="adding-subtitle">Password</h4>
						<p class="adding-text">Students' password can be changed by a linked parent or by admin manually</p>
						<button class="adding-generate student-profile-send" data-click="${_.componentName}:sendResetPassword" role="student">Send Link To A Parent To Reset Password</button>
						<button class="student-profile-change" data-click="${_.componentName}:showChangePassword">Change Manually</button>
					</div>
					<div class="adding-section">
						<h4 class="adding-subtitle withmar">Your current school</h4>
						<div class="adding-inpt small">
							<div class="form-label-row">
								<label class="form-label">Current school</label>
							</div>
							<g-input type="text" name="currentSchool" data-required data-input="${_.componentName}:fillStudentInfo" value='${_.studentInfo["currentSchool"]}' class="g-form-item" classname="form-input adding-inpt"></g-input>
						</div>
						<div class="adding-inpt">
							<div class="form-label-row">
								<label class="form-label">Grade</label>
							</div>
							<g-select class="select adding-select" name="grade" data-required data-change="${_.componentName}:fillStudentInfo" classname="adding-select" arrowsvg="/img/sprite.svg#select-arrow-bottom" title="Course"
							items=${JSON.stringify(gradeItems)}></g-select>
						</div>
					</div>
				</div>
				<div class="student-profile-right">
					<h4 class="admin-block-graytitle">Courses & Plans</h4>
					<div class="student-profile-courses-btns">
						<button class="student-profile-courses-btn${currentCourse == 'ISEE' ? ' active' : ''}" data-click="${_.componentName}:changeCurrentCourse" value="ISEE">ISEE</button>
						<button class="student-profile-courses-btn${currentCourse == 'SSAT' ? ' active' : ''}" data-click="${_.componentName}:changeCurrentCourse" value="SSAT">SSAT</button>
						<button class="student-profile-courses-btn${currentCourse == 'SHSAT' ? ' active' : ''}" data-click="${_.componentName}:changeCurrentCourse" value="SHSAT">SHSAT</button>
					</div>
					<div class="student-profile-course-info loader-parent"><img src='/img/loader.gif' class='loader'></div>
				</div>
			</div>
			<div class="student-profile-footer">
				<button class="student-profile-delete" data-click="${_.componentName}:showRemoveUserPopup" data-id="${_.studentInfo['_id']}">Delete User Profile</button>
				<div class="student-profile-actions">
					<button class="test-footer-back" data-click="${_.componentName}:changeSection" section="${_.prevSubSection}" ${_.prevSubSection == 'parentProfile' ? 'data-outerId=' + _.parentInfo['outerId'] : '' } rerender>
						<span>Discard</span>
					</button>
					<button class="button-blue" data-click="${_.componentName}:updateStudent" section="${_.prevSubSection}">
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
						title: 'Student Personal Profile',
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
						<button class="test-footer-back step-prev-btn" data-click="${_.componentName}:cancelParentProfile" type="adding" ste="2">
							<span>Back</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	parentPersonalInfoTpl(parentInfo){
		const _ = this;
		let tpl = `
			<div class="adding-section">
				<h4 class="adding-subtitle">Parent Personal Info</h4>
				<div class="adding-avatar">
					<div class="profile-img-row">
						<div class="profile-img">`;
		if (!_.parentInfo.photo) {
			tpl += `
				<div class="profile-img-letter">
					${_.parentInfo.firstName[0].toUpperCase()}
				</div>
			`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${_.parentInfo.photo}" class="user-photo">`;
		}
		tpl += `
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
					<div class="profile-form-row-input">
						<g-input 
							type="email" 
							data-outfocus="${_.componentName}:checkEmail" 
							name="email" 
							value="${_.parentInfo.email ?? ''}" 
							data-value="${_.parentInfo.email ?? ''}" 
							data-input="${_.componentName}:fillParentInfo" 
							data-required
							class="g-form-item" 
							classname="form-input profile-form-input"></g-input>
						<span class="form-label-desc" style="display:none;">Email is not free</span>
					</div>
				</div>
				<div class="profile-form-row">
					<div class="form-label-row">
						<label class="form-label">Phone Number</label>
					</div>
					<g-input type="phone" name="phone" value="${_.parentInfo.phone ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
				</div>
			</div>
		`;
		return tpl;
	},
	parentChildesInfoTpl(){
		const _ = this;
		return `
			<div class="section users-page" id="parentsStudentTable">
				<div class="block">
					<div class="tbl">
						<div class="tbl-head">
							<div class="tbl-item"><span>USER Name</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_desc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_asc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
								</div>
							</div>
							<div class="tbl-item">Courses</div>
							<div class="tbl-item right"><span>Date Registered</span>
								<div class="tbl-sort-btns">
									<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="createdAt_desc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
									<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="createdAt_asc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
													<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_desc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_asc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
												</div>
											</div>
										</th>
										<th><div class="tbl-item">Courses</div></th>
										<th>
											<div class="tbl-item right">
												<span>Date Registered</span>
												<div class="tbl-sort-btns">
													<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="createdAt_desc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
													<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="createdAt_asc" role="studentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
				${_.historyDetailsTpl()}
				${_.addingStudent()}
				${_.changePassword()}
				${_.assignStudent()}
				${_.removeCourseTpl()}
				${_.removedCourseTpl()}
				${_.removeUserTpl()}
				${_.removeAdminTpl()}
				${_.removeParentTpl()}
				${_.selectAvatarTpl()}
				${_.addParentPopup()}
				${_.parentProfileFromAddStudent()}
				${_.addCardForm()}
				${_.addBillingAddress()}
			</div>
		`
	},

	historyDetailsTpl(){
		const _ = this;
		let tpl = `
			<div class="block bigPop activity" id="historyDetails">
				<div class="test-header">
					<h5 class="block-title bigPop-title">
						<span>Session Details</span>
					</h5>
				</div>
				<ul class="details-header-list">
					<li class="details-header-item blue">
						<h6 class="details-header-item-title">March 17, 2022</h6>
						<span class="details-header-item-desc">Date</span>
					</li>
					<li class="details-header-item green">
						<h6 class="details-header-item-title">10:00 AM</h6>
						<span class="details-header-item-desc">Time In</span>
					</li>
					<li class="details-header-item orange">
						<h6 class="details-header-item-title">10:45 AM</h6>
						<span class="details-header-item-desc">Time Out</span>
					</li>
					<li class="details-header-item red">
						<h6 class="details-header-item-title">00:45:40</h6>
						<span class="details-header-item-desc">Session Duration</span>
					</li>
				</ul>
				<ul class="details-list">
					<li class="details-item">
						<div class="details-item-icon"><svg><use xlink:href="#graphic-3"></use></svg></div>
						<h6 class="details-item-title">
							Practice Mathematics Achievement completed. 
							<strong>Algebra, Equations, and Inequalities</strong>
						</h6>
						<p class="details-item-text">Start time - 10:02 AM;  End time - 10:12 AM</p>
						<p class="details-item-text">Total questions answered - 30</p>
						<p class="details-item-text">Total questions correct - 20/30</p>
						<div class="details-item-achieve stars orange">
							<div class="details-item-achieve-title">Stars earned:</div>
							<div class="details-item-achieve-info">
								<div class="details-item-achieve-icon"><svg><use xlink:href="#stars"></use></svg></div>
								<div>
									<div class="details-item-achieve-info-title">+150</div>
									<div class="details-item-achieve-subtitle">Skills Practice</div>
								</div>
							</div>
						</div>
						<div class="details-item-achieve">
							<div class="details-item-achieve-title">Badge earned:</div>
							<div class="details-item-achieve-info">
								<div class="details-item-achieve-icon blue">
									<span>15</span>
									<svg><use xlink:href="#graphic-3"></use></svg>
								</div>
								<div>
									<div class="details-item-achieve-subtitle">15 Skills Mastered</div>
								</div>
							</div>
							<div class="details-item-achieve-info">
								<div class="details-item-achieve-icon red">
									<span>30</span>
									<svg><use xlink:href="#calendar"></use></svg>
								</div>
								<div>
									<div class="details-item-achieve-subtitle">30-Day Streak</div>
								</div>
							</div>
						</div>
					</li>
					<li class="details-item">
						<div class="details-item-icon"><svg><use xlink:href="#badge"></use></svg></div>
						<h6 class="details-item-title">
							Test completed. 
							<strong>Practice test 1</strong>
						</h6>
						<p class="details-item-text">Start time - 10:22 AM;  End time - 10:45 AM</p>
						<p class="details-item-text">Total questions answered - 30</p>
						<p class="details-item-text">Total questions correct - 30/30</p>
						<div class="details-item-achieve stars blue">
							<div class="details-item-achieve-title">Stars earned:</div>
							<div class="details-item-achieve-info">
								<div class="details-item-achieve-icon"><svg><use xlink:href="#stars"></use></svg></div>
								<div>
									<div class="details-item-achieve-info-title">+150</div>
									<div class="details-item-achieve-subtitle">Skills Practice</div>
								</div>
							</div>
						</div>
						<div class="details-item-achieve">
							<div class="details-item-achieve-title">Badge earned:</div>
							<div class="details-item-achieve-info">
								<div class="details-item-achieve-icon green">
									<span>First</span>
									<svg><use xlink:href="#badge"></use></svg>
								</div>
								<div>
									<div class="details-item-achieve-subtitle">First Practice Test</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		`;
		return tpl;
	},
	// Parents Page
	parentsBody(){
		const _ = this;
		return `
			<div class="section users-page" id="bodyParents">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Parents (<span class="users-count gusers-count"><img src='/img/loader.gif' class='loader'></span>)</h2>
						<div class="filter"><img src="/img/loader.gif" alt=""></div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:showAddParentPopup" from="body">
							<span>Add Parent</span>
							<svg class="button-icon large">
								<use xlink:href="#plus2"></use>
							</svg>
						</button>
					</div>
					${_.pagination('parent')}
					<div class="tbl">
			      <div class="tbl-head">
			        <div class="tbl-item">
			          <span>USER Name</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="parent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="parent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item">
			          <span>Students</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="parent" value="students_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="parent" value="students_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item"><span>date Registered</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="parent" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="parent" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item right">Action</div>
			      </div>
			      <div class="table-cont table-cont-parents loader-parent">
			        <table class="table">
			          <thead class="tbl-head">
			          <tr>
			            <th>
			              <div class="tbl-item">
			                <span>USER Name</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="parent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="parent"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th>
			              <div class="tbl-item">
			                <span>Students</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="parent" value="students_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="parent" value="students_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                </div>
			              </div>
			            </th>
			            <th>
			              <div class="tbl-item">
			                <span>date Registered</span>
			                <div class="tbl-sort-btns">
			                  <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="parent" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="parent" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
	parentProfile(){
		const _ = this;
		return `
			<div class="section">
				<div class="breadcrumbs"></div>
				<div class="block">
					${_.sectionHeaderTpl({
						title: 'Parent Personal Profile',
						buttonsData:{
							action:`data-click="${_.componentName}:changeProfileTab"`,
							buttons:[
								{title:'Personal Info',active:'active',pos:6},
								{title:'Students',pos:12},
								{title:'Billing',pos:11},
								{title:'Billing History'},
								{title:'Activity History',pos:9},
								{title:'Notifications',pos:10},
							]
						}
					})}
					<div class="parent-profile-inner"><img src="/img/loader.gif"></div>
				</div>
			</div>
		`;
	},
	parentsProfileInner(){
		const _ = this;
		let tpl = `
			<div class="adding-center wide">
				<div class="adding-section">
					<h4 class="adding-subtitle">${_.subSection === 'parentProfile' ? 'Parent' : 'Admin'} Personal  Info</h4>
					<div class="adding-avatar">
						<label class="profile-img-row file-cont">
							<input 
								type="file" 
								class="file" 
								data-change="${_.componentName}:uploadPhoto"
								role="parent"
								accept="image/png, image/gif, image/jpeg, image/jpg"
							>
							<div class="profile-img">`;
		if (!_.parentInfo.photo) {
			tpl += `
				<div class="profile-img-letter">
					${this.super_$.firstName[0].toUpperCase()}
				</div>
			`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${_.parentInfo.photo}" class="user-photo">`
		}
		tpl += `
							</div>
							<div class="profile-img-desc">
								Allowed *.jpeg,*.jpg, *.png, *.gif<br>
								Max size of 3.1 MB
							</div>
						</label>
					</div>
				</div>
				<div class="adding-section">
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">First name</label>
						</div>
						<g-input type="text" value="${_.parentInfo.firstName ?? ''}" data-required name="firstName" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Last name</label>
						</div>
						<g-input type="text" name="lastName" value="${_.parentInfo.lastName ?? ''}" data-required data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<div class="profile-form-row-input">
							<g-input 
								type="email" 
								name="email" 
								value="${_.parentInfo.email ?? ''}" 
								data-value="${_.parentInfo.email ?? ''}" 
								data-required
								data-outfocus="${_.componentName}:checkEmail"
								data-input="${_.componentName}:fillParentInfo" 
								class="g-form-item" 
								classname="form-input profile-form-input"></g-input>
							<span class="form-label-desc" style="display:none;">Email is not free</span>
						</div>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Phone</label>
						</div>
						<g-input type="phone" name="phone" value="${_.parentInfo.phone ?? ''}" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
					</div>
					<div class="admin-profile-line"></div>
					<div class="admin-profile-password">
						<h3 class="admin-profile-password-title">Change Password</h3>
						<button class="admin-profile-password-link" data-click="${_.componentName}:sendResetPassword" role="parent">
							<svg><use xlink:href="#mail"></use></svg>
							<span>Send Link To Reset Password</span>
						</button>
						<button class="admin-profile-password-button" role="parent" data-click="${_.componentName}:showChangePassword">
							<svg><use xlink:href="#edit-transparent"></use></svg>
							<span>Change Manually</span>
						</button>
					</div>
				</div>
			</div>
			<div class="student-profile-footer">
				<button 
					class="student-profile-delete" 
					${_.parentInfo['students'] && _.parentInfo['students'].length ? 'disabled' : ''} 
					data-click="${_.componentName}:showRemoveParentPopup" 
					data-id="${_.parentInfo['_id']}"
				>Delete User Profile</button>
				<div class="student-profile-actions">
					<button class="test-footer-back" data-click="${_.componentName}:changeSection" section="parent" rerender>
						<span>Discard</span>
					</button>
					<button class="button-blue" data-click="${_.componentName}:updateParent">
						<span>Save Changes</span>
					</button>
				</div>
			</div>
		`;
		return tpl;
	},
	billingsTpl(){
		const _ = this;
		let tpl = `
			<div class="billing-inner">
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
	parentsStudentsTpl(){
		const _ = this;
		let tpl = `
			<div class="tbl">
				<div class="tbl-head">
					<div class="tbl-item">
						<span>USER Name</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_desc" role="parentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_asc" role="parentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div> 
					</div>
					<div class="tbl-item">Courses</div>
					<div class="tbl-item">
						<span>date Registered</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" role="parentProfile" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" role="parentProfile" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_desc" role="parentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" value="firstName_asc" role="parentProfile"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th><div class="tbl-item">Courses</div></th>
								<th>
									<div class="tbl-item">
										<span>date Registered</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top" data-click="${_.componentName}:sortParentStudentsBy" role="parentProfile" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortParentStudentsBy" role="parentProfile" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th><div class="tbl-item right">Action</div></th>
							</tr>
						</thead>
						<tbody class="tbl-body">
							<tr><td class="loader-parent"><img src="/img/loader.gif" alt=""></td></tr>
						</tbody>
					</table>
				</div>
			</div>
		`;
		return tpl;
	},
	parentsStudentsRowsTpl(studentsData){
		const _ = this;
		let tpl = '';
		for (let item of studentsData) {
			tpl += `
				<tr class="tbl-row" user-id="${item['_id']}">
					<td>
						<div class="tbl-item">
							<div class="users-photo-icon">
								<img src="${item.user.avatar ? '/img/' + item.user.avatar.avatar + '.png' : ''}">
							</div>
							<div class="users-info">
								<h6 class="users-info-name">${item.user.firstName} ${item.user.lastName}</h6>
								<span class="users-info-email">${item.user.email}</span>
							</div>
						</div>
					</td>
					<td>
						<div class="tbl-item">`;
			if (item.plans && item.plans.length){
				for (let unit of item.plans) {
					tpl += `<div class="users-course ${unit.course ? unit.course.title + '-' + unit.level.title.split(' ')[0] : ''}">${unit.course.title} ${unit.level.title.split(' ')[0]}</div>`;
				}
			}
			tpl += `
					</div>
				</td>
				<td>
					<div class="tbl-item">
						<div class="users-date">${_.createdAtFormat(item.updatedAt.split('T')[0])}</div>
					</div>
				</td>
				<td>
					<div class="tbl-item right actions">
						<button class="users-btn button profile" data-click="UsersModule:changeSection" data-id="${item._id}" section="profile">Profile</button>
						<button class="users-btn button-blue profile" data-id="${item._id}" data-click="UsersModule:removeUser">
							<svg class="button-icon"><use xlink:href="#close"></use></svg>
						</button>
					</div>
				</td>
			</tr>`;
		}
		return tpl;
	},

	//admins page
	adminsBody(){
		const _ = this;
		let tpl = `
			<div class="section users-page" id="bodyAdmins">
				<div class="block">
					<div class="block-header">
						<h2 class="block-title">Admins (<span class="users-count gusers-count"><img src='/img/loader.gif' class='loader'></span>)</h2>
						<div class="filter"><img src="/img/loader.gif" alt=""></div>
						<button class="block-header-item button-blue" data-click="${_.componentName}:showAddAdminPopup" from="body">
							<span>Add Admin</span>
							<svg class="button-icon large"><use xlink:href="#plus2"></use></svg>
						</button>
					</div>
					${_.pagination('admin')}
					<div class="tbl">
			      <div class="tbl-head">
			        <div class="tbl-item">
			          <span>USER Name</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="admin"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="admin"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			          </div>
			        </div>
			        <div class="tbl-item">Role</div>
			        <div class="tbl-item"><span>date Registered</span>
			          <div class="tbl-sort-btns">
			            <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="admin" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			            <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="admin" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
			                  <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" value="firstName_desc" role="admin"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" value="firstName_asc" role="admin"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
			                  <button class="tbl-sort-btn top" data-click="${_.componentName}:sortBy" role="admin" value="createdAt_desc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
			                  <button class="tbl-sort-btn bottom" data-click="${_.componentName}:sortBy" role="admin" value="createdAt_asc"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
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
						<div class="parent-table-avatar">`;
		if (!rowData['user'].photo){
			tpl += `<span>${rowData['user'].firstName.substr(0,1)}</span>`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${rowData.user.photo}" class="user-photo">`;
		}
		tpl += `
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
					<!--<button class="users-btn button">
						<svg class="button-icon">
							<use xlink:href="#write"></use>
						</svg>
					</button>-->
					<button class="users-btn button" 
						data-click="${_.componentName}:showRemoveParentPopup" 
						data-id="${rowData._id}"
					>
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
						title: 'Admin Personal Profile',
						buttonsData:{
							action:`data-click="${_.componentName}:changeProfileTab"`,
							buttons:[
								{title:'Personal Info',active:'active',pos:4},
								{title:'Activity History',pos:5}
							]
						}
					})}
					<div class="admin-profile-inner"><img src="/img/loader.gif"></div>
				</div>
			</div>
		`;
	},
	adminProfileInner(){
		const _ = this;
		let tpl = `
			<div class="adding-center wide">
				<div class="adding-section">
					<h4 class="adding-subtitle">Admin Personal  Info</h4>
					<div class="adding-avatar">
						<label class="profile-img-row file-cont">
							<input 
								type="file" 
								class="file" 
								data-change="${_.componentName}:uploadPhoto"
								role="admin"
								accept="image/png, image/gif, image/jpeg, image/jpg"
							>
							<div class="profile-img">`;
		if (!_.adminInfo.photo) {
			tpl += `
				<div class="profile-img-letter">
					${this.super_$.firstName[0].toUpperCase()}
				</div>
			`;
		} else {
			tpl += `<img src="${_.getBackUrl()}${_.adminInfo.photo}" class="user-photo">`;
		}
		tpl += `
							</div>
							<div class="profile-img-desc">
								Allowed *.jpeg,*.jpg, *.png, *.gif<br>
								Max size of 3.1 MB
							</div>
						</label>
					</div>
				</div>
				<div class="adding-section">
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">First name</label>
						</div>
						<g-input 
							type="text" 
							value="${_.adminInfo.firstName ?? ''}" 
							data-required
							name="firstName" 
							data-input="${_.componentName}:fillAdminInfo" 
							class="g-form-item" 
							classname="form-input profile-form-input"></g-input>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Last name</label>
						</div>
						<g-input 
							type="text" 
							name="lastName" 
							value="${_.adminInfo.lastName ?? ''}" 
							data-required
							data-input="${_.componentName}:fillAdminInfo" 
							class="g-form-item" 
							classname="form-input profile-form-input"></g-input>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Email</label>
						</div>
						<div class="profile-form-row-input">
							<g-input 
								type="email" 
								data-outfocus="${_.componentName}:checkEmail" 
								name="email" 
								value="${_.adminInfo.email ?? ''}" 
								data-value="${_.adminInfo.email ?? ''}" 
								data-required
								data-input="${_.componentName}:fillAdminInfo" 
								class="g-form-item" 
								classname="form-input profile-form-input"></g-input>
							<span class="form-label-desc" style="display:none;">Email is not free</span>
						</div>
					</div>
					<div class="profile-form-row">
						<div class="form-label-row">
							<label class="form-label">Role</label>
						</div>
						<g-select
							class="select"
							name="role"
							className="form-row-select filter-select table-filter"
							data-change="${_.componentName}:fillAdminInfo"
							arrowsvg="/img/sprite.svg#select-arrow"
							title="Role"
							items="[
								{&quot;value&quot;:&quot;admin&quot;,&quot;text&quot;:&quot;Admin&quot;${_.adminInfo.role == 'admin' ? ',&quot;active&quot;:&quot;true&quot;' : ''}},
								{&quot;value&quot;:&quot;super_admin&quot;,&quot;text&quot;:&quot;Super Admin&quot;${_.adminInfo.role == 'superAdmin' ? ',&quot;active&quot;:&quot;true&quot;' : ''}}
						]"></g-select>
					</div>
					<div class="admin-profile-line"></div>
					<div class="admin-profile-password">
						<h3 class="admin-profile-password-title">Change Password</h3>
						<button class="admin-profile-password-link" data-click="${_.componentName}:sendResetPassword" role="admin">
							<svg><use xlink:href="#mail"></use></svg>
							<span>Send Link To Reset Password</span>
						</button>
						<button class="admin-profile-password-button" role="admin" data-click="${_.componentName}:showChangePassword">
							<svg><use xlink:href="#edit-transparent"></use></svg>
							<span>Change Manually</span>
						</button>
					</div>
				</div>
			</div>
			<div class="student-profile-footer">
				<button class="student-profile-delete" data-click="${_.componentName}:showRemoveAdminPopup" data-id="${_.adminInfo['_id']}">Delete User Profile</button>
				<div class="student-profile-actions">
					<button class="test-footer-back" data-click="${_.componentName}:changeSection" section="admin" rerender>
						<span>Discard</span>
					</button>
					<button class="button-blue" data-click="${_.componentName}:updateAdmin">
						<span>Save Changes</span>
					</button>
				</div>
			</div>
		`;
		return tpl;
	}
}
