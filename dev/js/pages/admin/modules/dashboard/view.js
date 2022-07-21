export const view = {
	dashboardTabs(){
		const _ = this;
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active" data-click="${_.componentName}:changeSection" section="students"><span>Students</span></button>
					<button class="subnavigate-button" data-click="${_.componentName}:changeSection" section="parents"><span>Parents</span></button>
					<button class="subnavigate-button" data-click="${_.componentName}:changeSection" section="payments"><span>Payments</span></button>
				</div>
			</div>
		`;
	},

	usersStatsTpl({title,subtitle,countText}){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl({title,subtitle,gap:false})}
				${_.circleGraphicTpl(countText)}
				<ul class="stars-info"></ul>
			</div>
		`
	},
	circleGraphicTpl(countText){
		return `
			<div class="stars-circle circle">
				<div class="circle-count">
					<span class="circle-count-title"></span>
					<span class="circle-count-text">${countText}</span>
				</div>
			</div>
		`
	},
	statsInfoTpl({cls,value,title,icon}){
		return `
			<li class="stars-info-item ${cls}">
				<div class="stars-info-img">
					<svg>
						<use xlink:href="#${icon}"></use>
					</svg>
				</div>
				<div class="stars-info-text"><strong>${value}</strong><span>${title}</span></div>
			</li>
		`
	},

	adminCalendarTpl(data){
		const _ = this;
		return `
			<div class="calendar-row admin-calendar block-gap">
				<div class="admin-calendar-icon">
					<svg><use xlink:href="#calendar"></use></svg>
				</div>
				${_.dateFrom('Month DD, YYYY')}
				${_.dateTo('Month DD, YYYY',data['buttons'])}
			</div>
		`
	},

	averageBlockTpl({info,header}){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl(header)}
				${_.adminCalendarTpl(header)}
				<div class="block-gap">
					<h2 class="block-main-title">${info['title']}</h2>
					<h5 class="block-main-subtitle">${info['subtitle']}</h5>
				</div>
				<img src="../../../../../img/${info['graphic']}" alt="">
			</div>
		`
	},

	practiceTestStatsTpl({header,blocks}){
		const _ = this;
		let tpl = `
			<div class="block">
				${_.sectionHeaderTpl(header)}
				${_.adminCalendarTpl(header)}
				<div class="stat-cards">
	`;
		for (let i = 0; i < blocks.length; i++) {
			tpl += _.practiceTestStatsBlockTpl(blocks[i]);
		}

		tpl += `</div></div>`;
		return tpl;
	},
	practiceTestStatsBlockTpl({title,gap = true,list}){
		const _ = this;
		let tpl = `
			<div class="stat-block ${gap ? 'block-gap' : ''}">
				<h6 class="stat-block-title">${title}</h6>
				<ul class="stat-list">`;
		for (let i = 0; i < list.length; i++) {
			tpl += `<li class="stat-col"><ul class="stat-col-list">`;

			for (let j = 0; j < list[i].length; j++) {
				tpl += _.practiceTestStatsBlockItemTpl(list[i][j]);
			}

			tpl += `</ul></li>`;
		}
		tpl += '</ul></div>';
		return tpl;
	},
	practiceTestStatsBlockItemTpl({value,desc,color = ''}){
		return `
			<li class="stat-col-item ${color}">
				${value ? '<h6 class="stat-col-item-title">' + value + '</h6>' : ''}
				${desc ? '<p class="stat-col-item-text">' + desc + '</p>' : ''}
			</li>
		`
	},

	topStudentsListTpl({header,info}){
		const _ = this;
		let tpl = `
			<div class="block">
				${_.sectionHeaderTpl(header)}
				<ul class="topStudents-list">
		`;

		for (let i = 0; i < info.length; i++) {
			tpl += `
				<li class="topStudents-item block-gap">
					<div class="topStudents-icon">
						<img src="../../../../../img/${info[i]['icon']}.svg" alt="">
					</div>
					<div class="topStudents-info">
						<h6 class="topStudents-name">${info[i]['name']}</h6>
						<div class="topStudents-test">${info[i]['testInfo']}</div>
					</div>
					<div class="topStudents-points">
						<strong>${info[i]['points']}</strong>
						<span>Points</span>
					</div>
				</li>
			`
		}

		tpl += `
				</ul>
				<button class="button results">Show More Results</button>
			</div>
		`;
		return tpl;
	},

	dashTableTpl({header,info}){
		const _ = this;
		let tpl = '<div class="block">';
		tpl += _.sectionHeaderTpl(header);
		tpl += '<div class="admin-dashboard-table-cont">';
		tpl += _.dashTableHeadTpl(info['tableHead']);
		tpl += _.dashTableBodyTpl(info['tableBody']);
		tpl += '</div>';
		tpl += `
				<button class="button results">Show More Results</button>
			</div>
		`;
		return tpl;
	},
	dashTableHeadTpl(data){
		let tpl = '<table class="admin-dashboard-table"><thead><tr>';
		for (let i = 0; i < data.length; i++) {
			tpl += `<th><div class="admin-dashboard-table-th">${data[i]}</div></th>`;
		}
		tpl += '</tr></thead>';
		return tpl;
	},
	dashTableBodyTpl(data){
		const _ = this;
		let tpl = '<tbody>';
		for (let i = 0; i < data.length; i++) {
			tpl += _.dashTableRowTpl(data[i]);
		}
		tpl += '</tbody></table>';
		return tpl;
	},
	dashTableRowTpl(data){
		const _ = this;
		let tpl = '<tr>';
		for (let i = 0; i < data.length; i++) {
			let
				item = data[i],
				title = item['title'] ?? null,
				button = item['button'] ? `<button class="button">${item['button'].text}</button>` : null,
				color = '',text = '';

			if (title) {
				if (title['type'] == 'number') text = title['text'].toString().replace(_.division, '$&,');
				else if (title['type'] == 'percent') {
					color = 'green';
					if (title['text'] < 70) color = 'yellow';
					if (title['text'] < 50) color = 'orange';
					if (title['text'] < 20) color = 'red';
					text = title['text'] + '%';
				} else text = title['text'];
			}

			tpl += `
				<td><div class="admin-dashboard-table-td${item['text'] ? ' desc' : ''}">
					${title ? '<strong' + (color ? ` class="${color}"` : '') + '>' + text + '</strong>' : ''}
					${item['text'] ? '<span>' + item['text'] + '</span>' : ''}
					${button ?? ''}
				</div></td>
			`
		}
		tpl += '</tr>';
		return tpl;
	},

	skillsLevelStatsBlockTpl({title,blocks}){
		const _ = this;
		let tpl = `<div><h5 class="skills-level-title">${title}</h5><ul class="skills-level-list">`;

		for (let i = 0; i < blocks.length; i++) {
			tpl += _.skillsLevelStatsItemTpl(blocks[i]);
		}

		tpl += '</ul></div>';
		return tpl;
	},
	skillsLevelStatsItemTpl({title,role,max = 4000}){
		const _ = this;
		let
			step = parseInt(max) / 8,
			value = max;
		let tpl = `
			<li class="skills-level-item">
			${title ? '<h6 class="skills-level-subtitle">' + title + '</h6>' : ''}
			<h6 class="skills-level-role"><span>${role}</span></h6>
			<div class="skills-level-graphic-cont">
				<div class="skills-level-graphic-gradations">`;
		for (let i = 0; i < 9; i++) {
			tpl += `<span>${value}</span>`;
			value -= step;
		}
		tpl += `</div><div class="skills-level-values"></div></div></li>`;
		return tpl;
	},
	skillsLevelStatsValueTpl({title,value,values = []}){
		const _ = this;
		let tpl = `
			<div class="skills-level-unit">`;

		if (value) {
			tpl += `<div class="skills-level-value ${value.color}" style="height:${value.height}px;"></div>`
		} else if (values.length) {
			tpl += `<div class="skills-level-value-row">`
			for (let i = 0; i < values.length; i++) {
				tpl += `<div class="skills-level-value ${values[i].color} count-${values.length}" style="height:${values[i].height}px;"></div>`
			}
			tpl += `</div>`
		}

		tpl += `
				<div class="skills-level-value-title">${title}</div>
			</div>
		`;
		return tpl;
	},

	studentDashboardBody(){
		const _ = this;
		let tpl = `
			<div class="admin">
				<div class="section">
					<div class="row full">
						<div class="col stats t260 d384 user-stats">
							${_.usersStatsTpl(_.userStats['info'])}
						</div>
						<div class="col t456 tl716 d792">
							${_.averageBlockTpl(_.averageTimeSpentData)}
						</div>
					</div>
					${_.sectionHeaderTpl(_.coursesVariants)}
					<div class="row full">
						<div class="col stats t260 d384 system-stats">
							${_.usersStatsTpl(_.systemStats['info'])}
						</div>
						<div class="col t456 tl716 d792">
							${_.practiceTestStatsTpl(_.practiceTestStatsData)}
						</div>
					</div>
					<div class="row full">
						<div class="col d690">
							${_.averageBlockTpl(_.averageTestScoreData)}
						</div>
						<div class="col d486">
							${_.topStudentsListTpl(_.studentsTop)}
						</div>
					</div>
					${_.dashTableTpl(_.mostWatchedVideosData)}
					${_.dashTableTpl(_.mostCompQuestionsData)}
					${_.dashTableTpl(_.mostSimpleQuestionsData)}
					<div class="block skills-level">
						${_.sectionHeaderTpl(_.skillsLevelStatsHeaderData)}
					</div>
				</div>
			</div>
		`
		return tpl;
	},

	newUsersStatisticTpl({header}){
		const _ = this;
		let tpl = `
			<div class="block block-gap newUsers">
				${_.sectionHeaderTpl(header)}
				${_.adminCalendarTpl(header)}
				<ul class="newUsers-list"></ul>
			</div>
		`;
		return tpl;
	},
	newUsersStatisticFillTpl({parents,students}){
		let tpl = `
			<li class="newUsers-item parents block-gap">
				<div class="newUsers-icon"><svg><use xlink:href="#addUser"></use></svg></div>
				<div class="newUsers-info">
					<strong>+${parents}</strong>
					<span>Parents registered this month</span>
				</div>
			</li>
			<li class="newUsers-item students">
				<div class="newUsers-icon"><svg><use xlink:href="#users"></use></svg></div>
				<div class="newUsers-info">
					<strong>+${students}</strong>
					<span>Students added this month</span>
				</div>
			</li>`
		return tpl;
	},

	parentsDashboardBody(){
		const _ = this;
		let tpl = `
			<div class="admin">
				<div class="section">
					<div class="row">
						<div class="col stats t260 d384 user-stats">
							${_.usersStatsTpl(_.parentStats['info'])}
						</div>
						<div class="col t456 tl716 d792">
							${_.newUsersStatisticTpl(_.newUsersStatisticData)}
							${_.averageBlockTpl(_.averageTimeSpentData)}
						</div>
					</div>
				</div>
			</div>
		`;
		return tpl;
	},

	purchasedCoursesAndPlansTpl(){
		const _ = this;
		let tpl = `
			<div class="block comGraph block-gap">
				${_.sectionHeaderTpl(_.purchasedCoursesAndPlansHeaderData)}
				${_.adminCalendarTpl(_.purchasedCoursesAndPlansHeaderData)}
			</div>
		`;
		return tpl;
	},
	comGraphRowTpl({circleData,linesData}){
		const _ = this;
		return `
			<div class="comGraph-row">
				${_.comGraphCircleTpl(circleData)}
				${_.comGraphLinesTpl(linesData)}
			</div>
		`;
	},
	comGraphCircleTpl({title,subtitle,list}){
		const _ = this;
		let tpl = `
			<div class="comGraph-circle">
				<h4 class="comGraph-circle-title">${title}</h4>
				<h6 class="block-medium-subtitle block-gap">${subtitle}</h6>
				<div class="comGraph-circle-row">
					<div class="stars-circle" data-radius="50" data-borders="16"></div>
					<div class="comGraph-circle-info">`;
		for (let i = 0; i < list.length; i++) {
			tpl += _.markerInfoTpl(list[i]);
		}
		tpl += `</div>
				</div>
			</div>
		`;
		return tpl;
	},
	markerInfoTpl({title,value,color}){
		const _ = this;
		return `
			<div class="marker-info-row ${color}">
				<div class="marker-info-indicator"></div>
				<h6 class="marker-info-title">${title}</h6>
				<div class="marker-info-value">${typeof value == "number" ? value.toString().replace(_.division, '$&,') : value}</div>
			</div>
		`
	},
	comGraphLinesTpl(data){
		const _ = this;
		let tpl = `
			<ul class="comGraph-lines-cont">
				${_.skillsLevelStatsItemTpl(data)}
			</ul>
		`;
		return tpl;
	},


	canceledPlansTpl(){
		const _ = this;
		let tpl = `
			<div class="block">
				${_.sectionHeaderTpl(_.plansCanceledHeader)}
				${_.adminCalendarTpl(_.plansCanceledHeader)}
				<div class="block-gap">
					<h4 class="block-main-title">${_.canceledPlansData.title}</h4>
					<h5 class="block-medium-subtitle">${_.canceledPlansData.subtitle}</h5>
				</div>
				${_.plansBlockInnerTpl(_.canceledPlansData)}
				<div class="plansBlock-reasons">
					<h4 class="block-medium-subtitle block-gap">Reasons</h4>
					${_.plansBlockReasonsTpl(_.canceledPlansData.reasons)}
				</div>
			</div>
		`;
		return tpl;
	},
	refundsBlockTpl(){
		const _ = this;
		let tpl = `
			<div class="block refunds">
				${_.sectionHeaderTpl(_.refundsHeader)}
				${_.adminCalendarTpl(_.refundsHeader)}
				<div class="block-gap">
					<h4 class="block-main-title">${_.refundsData.title}</h4>
					<h5 class="block-medium-subtitle">${_.refundsData.subtitle}</h5>
				</div>
				${_.plansBlockInnerTpl(_.refundsData)}
				<div class="plansBlock-reasons">
					<h4 class="admin-payment-subtitle block-gap">Reasons</h4>
					${_.plansBlockReasonsTpl(_.refundsData.reasons)}
				</div>
				${_.perCourseTpl(_.refundsData.perCourse)}
				${_.perPlanTpl(_.refundsData.perPlan)}
			</div>
		`;
		return tpl;
	},
	plansBlockInnerTpl(fillingData){
		const _ = this;
		return `
			<div>
				<div class="block-gap">
					<img src="../../../../../img/refundByPlan.png" alt="">
				</div>
				<div class="plansBlock-info">${_.plansBlockInfoinnerTpl(fillingData.plansInfo)}</div>
			</div>
		`
	},
	plansBlockInfoinnerTpl(refundsInfo){
		const _ = this;
		let tpl = '';
			for (let i = 0; i < refundsInfo.length; i++) {
				tpl += `<div class="plansBlock-info-col block-gap">`
				for (let j = 0; j < refundsInfo[i].infos.length; j++) {
					tpl += _.markerInfoTpl(refundsInfo[i].infos[j]);
				}
				tpl += '</div>'
			}
		return tpl;
	},
	plansBlockReasonsTpl(refundsReasonsData){
		const _ = this;
		let tpl = ``;
		for (let i = 0; i < refundsReasonsData.length; i++) {
			tpl += _.plansBlockReasonsRowTpl(refundsReasonsData[i])
		}
		return tpl;
	},
	plansBlockReasonsRowTpl({colors,title}){
		const _ = this;
		let tpl = `
			<div class="plansBlock-reasons-block">
				<div class="plansBlock-reasons-row">
					<div class="plansBlock-reasons-row-colors">
		`;
		for (let i = 0; i < colors.length; i++) {
			tpl += `<div class="${colors[i]}"></div>`
		}
		tpl += `</div><span>${colors.length}</span></div><h5 class="plansBlock-reasons-title">${title}</h5></div>`
		return tpl;
	},

	perCourseTpl(blockData){
		const _ = this;
		let tpl = `
			<div class="perItemBlock perCourse">
				<h4 class="admin-payment-subtitle block-gap">${blockData.title}</h4>
				<div class="perItemBlock-inner">
					${_.circleGraphicTpl(blockData.circleText)}
					<ul class="perItemBlock-list"></ul>
				</div>
			</div>
		`;
		return tpl;
	},
	perCourseRowTpl(rowData){
		const _ = this;
		let tpl = `
			<li class="perItemBlock-course-item">
				<div class="perItemBlock-course-item-color ${rowData.color}"></div>
				<div class="perItemBlock-course-item-text">
					<strong class="perItemBlock-course-item-value">$${_.setInteger(rowData.value)}</strong>
					<h5 class="perItemBlock-course-item-title">${rowData.title}</h5>
				</div>
			</li>
		`;
		return tpl;
	},
	perPlanTpl(blockData){
		const _ = this;
		let tpl = `
			<div class="perItemBlock perPlan">
				<h4 class="admin-payment-subtitle block-gap">${blockData.title}</h4>
				<div class="perItemBlock-inner">
					${_.circleGraphicTpl(blockData.circleText)}
					<ul class="perItemBlock-list"></ul>
				</div>
			</div>
		`;
		return tpl;
	},
	perPlanRowTpl(rowData){
		const _ = this;
		let tpl = `
			<li class="perItemBlock-course-item">
				<div class="perItemBlock-course-item-color ${rowData.color}"></div>
				<div class="perItemBlock-course-item-text">
					<strong class="perItemBlock-course-item-value">$${_.setInteger(rowData.value)}</strong>
					<h5 class="perItemBlock-course-item-title">${rowData.title}</h5>
				</div>
			</li>
		`;
		return tpl;
	},
	revenueBlockTpl(){
		const _ = this;
		let tpl = `
			<div class="block block-gap revenue">
				${_.sectionHeaderTpl(_.revenueHeader)}
				${_.adminCalendarTpl(_.revenueHeader)}
				<div class="block-gap">
					<h4 class="block-main-title">${_.revenueData.title}</h4>
					<h6 class="block-main-subtitle">${_.revenueData.subtitle}</h6>
				</div>
				<div class="revenue-graphic">
					<img src="../../../../../img/revenue-chart.png" alt="">
				</div>
				${_.perCourseTpl(_.revenueData.perCourse)}
				${_.perPlanTpl(_.revenueData.perPlan)}
			</div>
		`;
		return tpl;
	},
	sampleTpl(){
		const _ = this;
		let tpl = `
			
		`;
		return tpl;
	},

	paymentsDashboardBody(){
		const _ = this;
		let tpl = `
			<div class="admin">
				<div class="section">
					<div class="row">
						<div class="col t50 d690">
							${_.purchasedCoursesAndPlansTpl()}
							${_.refundsBlockTpl()}
						</div>
						<div class="col t50 d486">
							${_.revenueBlockTpl()}
							${_.canceledPlansTpl()}
						</div>
					</div>
				</div>
			</div>
		`;
		return tpl;
	},
}