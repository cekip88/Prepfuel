export const view = {
	practiceTabs(){
		const _ = this;
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active" data-click="${_.componentName}:changeSection" section="practice"><span>Practice & Recommendations</span></button>
					<button class="subnavigate-button" data-click="${_.componentName}:changeSection" section="reports"><span>Reports</span></button>
				</div>
			</div>
		`;
	},
	adminFooter(){
		const _ = this;
		return `
			<div hidden>
				
			</div>
		`
	},

	practiceBody(){
		const _ = this;
		return `
			<div class="section">
				${_.sectionHeaderTpl({
					title: 'Practice by section',
					titlesData: {
						titleCls: 'practice-title',
					},
					buttonsData:{
						action:`data-click="${_.componentName}:changePracticeTab"`,
						buttons:[
							{title:'Verbal Reasoning',class:'active small'},
							{title:'Quantitative Reasoning',class:'small'},
							{title:'Reading Comprehension',class:'small'},
							{title:'Mathematics Achievement',class:'small'},
							{title:'Essay'},
						]
					}
				})}
				<div class="practice-inner" id="bodyInner"></div>
			</div>
		`
	},

	practiceTasksTpl(headerData){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl(headerData)}
				<ul class="practice-task-list loader-parent">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
		`
	},
	taskItemsTpl(taskData){
		const _ = this;
		let taskItems = [];
		for (let taskInfo of taskData.items) {
			taskItems.push(_.markup(_.taskItemTpl(taskInfo,taskData.color)))
		}
		return taskItems;
	},
	taskItemTpl(task,color){
		const _ = this;
		return `
			<li 
				class="practice-task-item" 
				style="background-color: rgba(${color},.05)" 
				data-id="${task['_id']}"
			>
				<h6 
					class="practice-task-item-title"
					style="color: rgb(${color});"
				>
					${task.icon ? '<div class="icon"><svg style="fill:rgb(' + color + ')"><use xlink:href="#' + task.icon + '"></use></svg></div>' : ''}
					<span class="text">
						${task['title']}
						${task['status'] == 'locked' ? '<span><svg><use xlink:href="#lock"></use></svg> Unlock by completing tasks</span>' : ''}
					</span>
				</h6>
				<div class="practice-task-item-actions">
					<span 
						class="practice-task-item-status 
						${task['status'] == 'completed' ? 'completed' : ''}"
						style="
							color:rgb(${task['status'] == 'locked' ? '126, 130, 153' : color});
							${task['status'] != 'completed' && task['status' != 'locked'] ? 'border: 1px solid rgb(' + color + ');' : ''}
							${task['status'] == 'completed' ? 'background-color:rgba(' + color + ',.15)' : ''}
							${task['status'] == 'locked' ? 'background-color:#fff;' : ''}
						"
					>
						${task['status'].substr(0,1).toUpperCase() + task['status'].substr(1)}
					</span>
					<button 
						class="practice-task-item-button" 
						data-click="${_.componentName}:${task['status'] == 'completed' ? 'reviewTask' : 'startTask'}"
						style="background-color:rgb(${color});"
					>
						${task['status'] == 'completed' ? 'Review' : 'Start task'}
					</button>
				</div>
			</li>
		`;
	},

	practiceAchievementTpl(){
		const _ = this;
		let tpl = `
			<div class="block">
				${_.sectionHeaderTpl({
					title:'All Mathematics Achievement practice', 
					titlesData: {
						titleCls: 'practice-title practice-block-title'
					}
				})}
				<ul class="practice-achievement-list loader-parent">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
		`;
		return tpl;
	},
	achievementItemsTpl(itemsInfo){
		const _ = this;
		let tpl = `
			<li class="practice-achievement-item">
				<h3 class="practice-achievement-title">${itemsInfo.title}</h3>
				<div class="practice-table-head">
					<span class="info">
						<span class="level">Level</span>
						<span class="practice-table-head-title">Sections and skills</span>  
					</span>
					<span class="videoTd">How-to examples</span>
				</div>
				<ul>
		`;
		for (let item of itemsInfo.items) {
			tpl += `
				<li class="practice-table-row">
					<div class="info">
						<div class="icon"><svg><use xlink:href="#graphic-${item.level}"></use></svg></div>
						<h5 class="practice-table-row-title">${item.title}</h5>
					</div>
					<button class="button"><span>Practice</span></button>
					<button class="video">
						<svg><use xlink:href="#play"></use></svg>
						<span>Video example</span>
					</button>
				</li>
			`;
		}
		tpl += `</ul></li>`;
		return tpl;
	},

	reportsBody(){
		const _ = this;
		let tpl = `
			<div class="section">
				${_.sectionHeaderTpl({
					title: 'Report by section',
					titlesData: {
						titleCls: 'practice-title',
					},
					buttonsData:{
						action:`data-click="${_.componentName}:changePracticeTab"`,
						buttons:[
							{title:'Verbal Reasoning',class:'active small',pos:4},
							{title:'Quantitative Reasoning',class:'small',pos:5},
							{title:'Reading Comprehension',class:'small',pos:6},
							{title:'Mathematics Achievement',class:'small',pos:7},
						]
					}
				})}
				<div class="practice-inner" id="bodyInner">
					
				</div>
			</div>
		`;
		return tpl;
	},

	reportsAchievemntTpl(){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl({
					title: 'Summary',
					titlesData: {titleCls: 'practice-title practice-block-title'}
				})}
				<ul class="practice-reports-summary loader-parent" id="summaryList">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
			<div class="block">
				${_.sectionFilterTpl({
					icon: 'dots',
					title: 'Feb 18, 2022',
					buttonsData: [
						{title:'All Time'},
						{title:'Today',cls: 'active'},
						{title:'Week'},
						{title:'Month'},
						{title:'Last Session'},
					]
				})}
				<div class="practice-table-head">
					<span class="info">
						<span class="sort level">
						Level
						<div class="sort-buttons">
							<button></button>
							<button></button>
						</div>
					</span>
					<span class="practice-table-head-title">Sections and skills</span>
					</span>
					<span class="questions_count">Questions Answered</span>
					<span class="time">Total Time</span>
					<span class="accuracy">Accuracy</span>
				</div>
				<ul class="practice-reports-table loader-parent" id="reports-table"><img src="/img/loader.gif" alt=""></ul>
			</div>
		`
	},
	summaryBlockFill(info){
		const _ = this;
		let tpl = '';
		for (let item of info) {
			tpl += `
				<li class="practice-reports-summary-item" ${item.color ? 'style="border-color:rgb(' + item.color + ')"' : ""}>
					<h6 class="practice-reports-summary-title" ${item.color ? 'style="color:rgb(' + item.color + ');"' : ''}>${item.value}</h6>
					<p class="practice-reports-summary-text" ${item.color ? 'style="color:rgb(' + item.color + ');"' : ''}>${item.title}</p>
				</li>
			`
		}
		return tpl;
	},
	reportsTableFill(tableInfo){
		const _ = this;
		let tpl = '';
		for (let item of tableInfo) {
			tpl += `
				<li class="practice-reports-table-item">
					<h3 class="practice-reports-table-title">${item.title}</h3>
					<h4 class="practice-reports-table-subtitle">Category</h4>
			`;
			for (let row of item.items) {
				tpl += _.reportTableItemFill(row);
			}
			tpl += '</li>'
		}
		return tpl;
	},
	reportTableItemFill(rowInfo){
		const _ = this;
		return `
			<div class="practice-table-row">
				<div class="info">
					<div class="icon"><svg><use xlink:href="#${rowInfo.icon}"></use></svg></div>
					<h6 class="practice-table-row-subtitle">${rowInfo.title}</h6>
				</div>
				<div class="text questions_count"><span class="onMobile">Question Answered: </span>${rowInfo['questions_answered']}</div>
				<div class="text time"><span class="onMobile">Total Time: </span>${rowInfo['total_time']}</div>
				<div class="progress"><span>Progress</span><span>${rowInfo.progress}%</span><div class="progress-line"><span style="width: ${rowInfo.progress}%;"></span></div></div>
			</div>
		`
	},
}