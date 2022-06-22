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
					<div class="pagination pagination-top">
					<div class="pagination-info"><span>1 - 100 of 7300</span></div>
					<div class="pagination-links"><a class="pagination-arrow pagination-prev" href="#">
					    <svg class="arrow">
					      <use xlink:href="#arrow-left-transparent"></use>
					    </svg></a><a class="pagination-link active" href="#"><span>1</span></a><a class="pagination-link" href="#"><span>2</span></a><a class="pagination-link" href="#"><span>3</span></a><a class="pagination-link" href="#"><span>4</span></a><a class="pagination-link" href="#"><span>5</span></a><a class="pagination-arrow pagination-next" href="#">
					    <svg class="arrow">
					      <use xlink:href="#arrow-right-transparent"></use>
					    </svg></a></div>
					<div class="pagination-end">
					<span>Jump to</span>
					  <input type="text" value="1">
					</div>
					</div>
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
				<div class="admin-modal"  id="addingForm">
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
							</div>
						</div>
					</div>
					<div class="test-footer">
						<button class="test-footer-back" data-click="AdminPage:changeSection" section="/admin/dashboard">
							<span>Cancel</span>
						</button>
						<button class="button-blue">
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
	},
	addingStepTwo() {
		const _ = this;
	},
	addingStepThree() {
		const _ = this;
	},
	addingStepFour() {
		const _ = this;
	},
	addingStepFive(){
		const _ = this;
	},
	addingStepSix() {
		const _ = this;
	}
};