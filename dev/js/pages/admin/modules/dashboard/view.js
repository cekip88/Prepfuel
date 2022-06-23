export const view = {
	dashboardTabs(){
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
	dashboardUsersStats({title,subtite,countText}){
		return `
			<div class="block">
				<div class="">
					<h5 class="admin-title"><span>${title}</span></h5>
					<h6 class="admin-subtitle"><span>${subtite}</span></h6>
				</div>
				<div class="stars-circle circle">
					<div class="circle-count">
						<span class="circle-count-title"></span>
						<span class="circle-count-text">${countText}</span>
					</div>
				</div>
				<ul class="stars-info"></ul>
			</div>
		`
	},
	adminCalendarTpl(){
		return `
			<div class="calendar-row admin-calendar block-gap">
				<div class="admin-calendar-icon">
					<svg><use xlink:href="#calendar"></use></svg>
				</div>
				<g-input
					class="admin-calendar"
					type="date" 
					classname="input-date admin-calendar"
					required="" 
					placeholder="Choose date from" 
					style="position:relative;"
					format="month DD, YYYY"
					icon="false"
				></g-input>
				<span>to</span>
				<g-input 
					class="admin-calendar"
					type="date" 
					classname="input-date admin-calendar" 
					required="" 
					placeholder="Choose date to" 
					style="position:relative;"
					format="month DD, YYYY"
					icon="false"
				></g-input>
			</div>
		`
	},
	averageTime(){
		const _ = this;
		return `
			<div class="block">
				<div class="section-header block-gap">
					<div>
						<h5 class="admin-title"><span>Average time spent per session</span></h5>
						<h6 class="admin-subtitle"><span>Students spent in app over 20 minutes on average</span></h6>
					</div>
					<div class="section-buttons">
						<button class="section-button active"><span>Today</span></button>
						<button class="section-button"><span>Week</span></button>
						<button class="section-button"><span>Month</span></button>
						<button class="section-button"><span>6 Month</span></button>
						<button class="section-button"><span>1 Year</span></button>
						<button class="section-button"><span>All</span></button>
					</div>
				</div>
				${_.adminCalendarTpl()}
				<div class="block-gap">
					<h2 class="block-main-title">20 minutes</h2>
					<h5 class="block-main-subtitle">Average time spent per session</h5>
				</div>
				<img src="../../../../../img/averageWidget.png" alt="">
			</div>
		`
	},
	practiceTestStats(){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl({
					title:'Practice Test Stats',
					subtitle:'More than 6k+ tests taken',
					buttons:{'Week':'','Month':'','6 Month':'','1 Year':'active','All':''}
				})}
				${_.adminCalendarTpl()}
				<div class="stat-cards">
					<div class="stat-block block-gap">
						<h6 class="stat-block-title">The number of practice tests taken</h6>
						<ul class="stat-list">
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item turquoise">
										<h6 class="stat-col-item-title">2.3</h6>
										<p class="stat-col-item-text">Average<br>taken</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item turquoise">
										<h6 class="stat-col-item-title">6,800</h6>
										<p class="stat-col-item-text">Total<br>taken</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item viol-blue">
										<h6 class="stat-col-item-title">1.8</h6>
										<p class="stat-col-item-text">Average<br>completed</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item viol-blue">
										<h6 class="stat-col-item-title">5,300</h6>
										<p class="stat-col-item-text">Total<br>completed</p>
									</li>
								</ul>
							</li>
						</ul>
					</div>
					<div class="stat-block">
						<h6 class="stat-block-title">The practice test stat</h6>
						<ul class="stat-list">
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item red">
										<p class="stat-col-item-text">Practice Test 1</p>
									</li>
									<li class="stat-col-item red">
										<h6 class="stat-col-item-title">2800</h6>
										<p class="stat-col-item-text">Taken</p>
									</li>
									<li class="stat-col-item red">
										<h6 class="stat-col-item-title">1800</h6>
										<p class="stat-col-item-text">Completed</p>
									</li>
									<li class="stat-col-item red">
										<h6 class="stat-col-item-title">1000</h6>
										<p class="stat-col-item-text">Avg. Score</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item maroon">
										<p class="stat-col-item-text">Practice Test 2</p>
									</li>
									<li class="stat-col-item maroon">
										<h6 class="stat-col-item-title">2000</h6>
										<p class="stat-col-item-text">Taken</p>
									</li>
									<li class="stat-col-item maroon">
										<h6 class="stat-col-item-title">1800</h6>
										<p class="stat-col-item-text">Completed</p>
									</li>
									<li class="stat-col-item maroon">
										<h6 class="stat-col-item-title">1200</h6>
										<p class="stat-col-item-text">Avg. Score</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item blue">
										<p class="stat-col-item-text">Practice Test 3</p>
									</li>
									<li class="stat-col-item blue">
										<h6 class="stat-col-item-title">1100</h6>
										<p class="stat-col-item-text">Taken</p>
									</li>
									<li class="stat-col-item blue">
										<h6 class="stat-col-item-title">900</h6>
										<p class="stat-col-item-text">Completed</p>
									</li>
									<li class="stat-col-item blue">
										<h6 class="stat-col-item-title">1300</h6>
										<p class="stat-col-item-text">Avg. Score</p>
									</li>
								</ul>
							</li>
							<li class="stat-col">
								<ul class="stat-col-list">
									<li class="stat-col-item viol">
										<p class="stat-col-item-text">Practice Test 4</p>
									</li>
									<li class="stat-col-item viol">
										<h6 class="stat-col-item-title">900</h6>
										<p class="stat-col-item-text">Taken</p>
									</li>
									<li class="stat-col-item viol">
										<h6 class="stat-col-item-title">800</h6>
										<p class="stat-col-item-text">Completed</p>
									</li>
									<li class="stat-col-item viol">
										<h6 class="stat-col-item-title">1400</h6>
										<p class="stat-col-item-text">Avg. Score</p>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		`
	},
	sectionHeaderTpl({title,subtitle,buttons,gap = true}){
		const _ = this;
		let tpl = `<div class="section-header ${gap ? 'block-gap' : ''}">`;
		if (!title && subtitle) {
			tpl += `<h6 class="admin-subtitle"><span>${subtitle}</span></h6>`
		} else if (!subtitle && title) {
			tpl += `<h5 class="admin-title"><span>${title}</span></h5>`
		} else if (title && subtitle) {
			tpl += `
				<div>
					<h5 class="admin-title"><span>${title}</span></h5>
					<h6 class="admin-subtitle"><span>${subtitle}</span></h6>
				</div>
			`
		}
		tpl += `<div class="section-buttons">`;
		for (let key in buttons) {
			tpl += `<button class="section-button ${buttons[key]}"><span>${key}</span></button>`
		}
		tpl += `</div>
			</div>
		`;
		return tpl
	},
	topStudentsListTpl(data){
		const _ = this;
		let tpl = `<ul class="topStudents-list">`;
		for (let i = 0; i < data.length; i++) {
			tpl += `
				<li class="topStudents-item block-gap">
					<div class="topStudents-icon">
						<img src="../../../../../img/${data[i]['icon']}.svg" alt="">
					</div>
					<div class="topStudents-info">
						<h6 class="topStudents-name">${data[i]['name']}</h6>
						<div class="topStudents-test">${data[i]['testInfo']}</div>
					</div>
					<div class="topStudents-points"><strong>${data[i]['points']}</strong><span>Points</span></div>
				</li>
		`
		}
		tpl += `
			</ul>
			<button class="button topStudents-button">Show More Results</button>
		`;
		return tpl;
	},
	dashboardBody(){
		const _ = this;
		let tpl = `
			<div class="section admin">
				<div class="row full">
					<div class="col stats t260 d384 user-stats">
						${_.dashboardUsersStats({title:'Users Stats',subtite:'More than 7k+ students',countText:'Total Students Registered'})}
					</div>
					<div class="col t456 tl716 d792">
						${_.averageTime()}
					</div>
				</div>
				${_.sectionHeaderTpl({title:'Course',buttons:{'ISEE':'active','SSAT':'','SHSAT':''},gap:false})}
				<div class="row full">
					<div class="col stats t260 d384 system-stats">
						${_.dashboardUsersStats({title:'Stars Earned In The System',subtite:'More than 800k+ stars earned by students',countText:'Stars Earned by Students'})}
					</div>
					<div class="col t456 tl716 d792">
						${_.practiceTestStats()}
					</div>
				</div>
				<div class="row full">
					<div class="col d690">
						<div class="block">
							${_.sectionHeaderTpl(_.averageTestScoreData)}
							${_.adminCalendarTpl()}
							<div class="block-gap">
								<h2 class="block-main-title">20 minutes</h2>
								<h5 class="block-main-subtitle">Average time spent per session</h5>
							</div>
							<img src="../../../../../img/averageTestWidget.png" alt="">
						</div>
					</div>
					<div class="col d486">
						<div class="block">
							<div>
								<h5 class="admin-title"><span>The largest test score improvement</span></h5>
								<h6 class="admin-subtitle"><span>Top 5 students</span></h6>
							</div>
							${_.topStudentsListTpl([
								{'name':'Ricky Hunt','icon':'yellow-boy','testInfo':'Practice Test 2 - March 26, 2022','points':'+ 550'},
								{'name':'Jane Cooper','icon':'red-afro-girl','testInfo':'Practice Test 4 - March 26, 2022','points':'+ 530'},
								{'name':'Cameron Williamson','icon':'green-with-blue-hair-boy','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
								{'name':'Guy Hawkins','icon':'gray-boy','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
								{'name':'blue-girl','icon':'blue-girl','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
							])}
						</div>
					</div>
				</div>
			</div>
		`
		return tpl;
	}
}