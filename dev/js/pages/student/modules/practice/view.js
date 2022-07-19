export const view = {
	practiceBody(){
		const _ = this;
		return `
			<div class="section">
				${_.sectionHeaderTpl({
					title: 'Practice by section',
					buttonsData:{
						action:`data-click="${_.componentName}:changePracticeTab"`,
						buttons:[
							{title:'Verbal Reasoning'},
							{title:'Quantitative Reasoning'},
							{title:'Reading Comprehension',active:'active',},
							{title:'Mathematics Achievement'},
							{title:'Essay'},
						]
					}
				})}
				<div class="block">
					
				</div>
			</div>
		`
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