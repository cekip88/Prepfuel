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

	sectionHeaderTpl({title,subtitle,buttons,gap = true}){
		let tpl = buttons ? `<div class="section-header ${gap ? 'block-gap' : ''}">` : '';

		if (!title && subtitle) {
			tpl += `<h6 class="admin-subtitle ${!buttons && gap ? "block-gap" : ''}"><span>${subtitle}</span></h6>`
		} else if (!subtitle && title) {
			tpl += `<h5 class="admin-title ${!buttons && gap ? "block-gap" : ''}"><span>${title}</span></h5>`
		} else if (title && subtitle) {
			tpl += `
				<div ${!buttons && gap ? 'class="block-gap"' : ''}>
					<h5 class="admin-title"><span>${title}</span></h5>
					<h6 class="admin-subtitle"><span>${subtitle}</span></h6>
				</div>
			`
		}

		if (buttons) {
			tpl += `<div class="section-buttons">`;
			for (let key in buttons) {
				tpl += `<button class="section-button ${buttons[key]}"><span>${key}</span></button>`
			}
			tpl += '</div>';
		}

		tpl += buttons ? '</div>' : '';
		return tpl
	},

	usersStatsTpl({title,subtitle,countText}){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl({title,subtitle,gap:false})}
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
	statsInfoTpl({cls,value,title}){
		return `
			<li class="stars-info-item ${cls}">
				<div class="stars-info-img">
					<svg>
						<use xlink:href="#user"></use>
					</svg>
				</div>
				<div class="stars-info-text"><strong>${value}</strong><span>${title}</span></div>
			</li>
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

	averageBlockTpl({info,header}){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl(header)}
				${_.adminCalendarTpl()}
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
				${_.adminCalendarTpl()}
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
	skillsLevelStatsItemTpl({title,role,list,max = 4000}){
		const _ = this;
		let
			step = parseInt(max) / 8,
			value = max;
		let tpl = `
			<li class="skills-level-item">
			<h6 class="skills-level-subtitle">${title}</h6>
			<h6 class="skills-level-role"># ${role}</h6>
			<div class="skills-level-graphic-cont">
				<div class="skills-level-graphic-gradations">`;
		for (let i = 0; i < 9; i++) {
			tpl += `<span>${value}</span>`;
			value -= step;
		}
		tpl += `</div><div class="skills-level-values"></div></div></li>`;
		return tpl;
	},
	skillsLevelStatsValueTpl({title,value}){
		const _ = this;
		let tpl = `
			<div class="skills-level-unit">
				<div class="skills-level-value" style="height: ${value}px;"></div>
				<div class="skills-level-value-title">${title}</div>
			</div>
		`;
		return tpl;
	},

	studentDashboardBody(){
		const _ = this;
		let tpl = `
			<div class="admin">
				<div class="section ">
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
						${_.sectionHeaderTpl(_.skillsLevelStatsTplData)}
					</div>
				</div>
			</div>
		`
		return tpl;
	}
}