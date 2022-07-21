export const view = {
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
							{title:'Verbal Reasoning',class:'small'},
							{title:'Quantitative Reasoning',class:'small'},
							{title:'Reading Comprehension',class:'active small'},
							{title:'Mathematics Achievement',class:'small'},
							{title:'Essay'},
						]
					}
				})}
				<div class="block">
					${_.sectionHeaderTpl({
						title: 'Your Diagnostics Recomendations',
						subtitle: ['Take these 4 quizzes or a full test to unlock your practice recommendations','Today’s schedule: 5 / 10 questions completed'],
						gap: false,
						titlesData: {
							titleCls: 'practice-title practice-block-title',
							subtitleCls: 'practice-block-subtitle'
						}
					})}
					<ul class="practice-quiz-list loader-parent">
						<img src="/img/loader.gif" alt="">
					</ul>
				</div>
			</div>
		`
	},
	quizItemsTpl(quizData){
		const _ = this;
		let quizItems = [];
		for (let quiz of quizData) {
			quizItems.push(_.markup(_.quizItemTpl(quiz)))
		}
		return quizItems;
	},
	quizItemTpl(quiz){
		const _ = this;
		return `
			<li class="practice-quiz-item" data-id="${quiz['_id']}">
				<h6 class="practice-quiz-item-title">${quiz['title']}</h6>
				<span class="practice-quiz-item-status :${quiz['status'] == 'completed' ? 'completed' : ''}">${quiz['status']}</span>
				<button 
					class="practice-quiz-item-button" 
					data-click="${_.componentName}:${quiz['status'] == 'completed' ? 'reviewTask' : 'startTask'}"
				>
					${quiz['status'] == 'completed' ? 'Review' : 'Start task'}
				</button>
			</li>
		`;
	},
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
}