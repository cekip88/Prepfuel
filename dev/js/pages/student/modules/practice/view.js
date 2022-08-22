import {Model} from "./model.js";
import {G_Bus} from "../../../../libs/G_Bus.js";

export const view = {
	
	noteTplFromForm(question){
		const _ = this;
		let tpl = `<div class="test-label-block note-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${question.text}
					</p>
				</div>
				<button class="test-label-button" data-click="${this.componentName}:showTestLabelModal">
					<svg>
						<use xlink:href="#three-dots"></use>
					</svg>
				</button>
				<div class="test-label-modal">
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote" data-question-id="${question['_id']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote" data-question-id="${question['_id']}"><span>Delete</span></button>
				</div>
			</div>`;
	//	}
		return tpl;
	},
	noteTpl(question){
		const _ = this;
		let tpl = `<div class="test-label-block note-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${question.note}
					</p>
				</div>
				<button class="test-label-button" data-click="${this.componentName}:showTestLabelModal">
					<svg>
						<use xlink:href="#three-dots"></use>
					</svg>
				</button>
				<div class="test-label-modal">
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['questionId']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['questionId']}"><span>Delete</span></button>
				</div>
			</div>`;
	//	}
		return tpl;
	},
	async answerTpl(question,answer){
		const _ = this;
		let output = document.createElement('div');
		output.innerHTML = question['answers'][answer];
		let text = await MathJax.typesetPromise([output]).then( () => output.innerHTML);
		let
		currentQuestionId = question['_id'],
		tpl = `
				<li class="answer-item" data-question-id="${currentQuestionId}" data-variant="${answer}">
					<button class="answer-button" data-click="${this.componentName}:setCorrectAnswer" data-variant="${answer}">
						<span class="answer-variant">${answer}</span>
						<span class="answer-value">${text}</span>
					</button>
					<button class="answer-wrong" data-click="${this.componentName}:setWrongAnswer">
						<svg>
							<use xlink:href="#dismiss-circle"></use>
						</svg>
					</button>
				</li>`;
		if(Model.isFinished()){
			//console.log(Model);
			let
				status = 'wrong',answeredQuestion,
				currentQuestion = _._$.currentQuestion;
			if( Model.testServerAnswers ){
				answeredQuestion = Model.testServerAnswers[currentQuestionId]
			}
			if(currentQuestion['type'] == 'passage'){
				currentQuestion = currentQuestion.questions.find( question => question['_id'] == currentQuestionId )
			}
			if( answeredQuestion && answeredQuestion['answer']){
				if(currentQuestion['correctAnswer']){
					if( (currentQuestion['correctAnswer'].toUpperCase() !== answeredQuestion['answer'].toUpperCase())	&& (answeredQuestion['answer'].toUpperCase() == answer.toUpperCase()) ) {
						status = 'incorrect';
					}
				}
			}
			output.innerHTML = question['answers'][answer];
			let text = await MathJax.typesetPromise([output]).then( () => output.innerHTML);
			tpl = `
					<li class="answer-item ${status}" data-question-id="${question['_id']}" data-variant="${answer}">
						<button class="answer-button">
							<span class="answer-variant">${answer}</span>
							<span class="answer-value">${text}</span>
						</button>
						<div class="answer-review-icon">
							<svg>
								<use xlink:href="/img/sprite.svg#${status}"></use>
							</svg>
						</div>
					</li>
				`;
		}
		return tpl;
	},
	actionsTpl(question){
		return `
			<button class="test-header-button bookmarked-button" data-click="${this.componentName}:saveBookmark" data-question-id="${question['_id']}">
				<svg>
					<use xlink:href="#bookmark-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#bookmark"></use>
				</svg>
				<span>Bookmark</span>
			</button>
			<button class="test-header-button note-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}" data-id="note">
				<svg>
					<use xlink:href="#edit-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#edit"></use>
				</svg>
				<span>Note</span>
			</button>
			<button class="test-header-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}" data-id="report">
				<svg>
					<use xlink:href="#error-circle"></use>
				</svg><span>Report</span>
			</button>
		`;
	},
	async explanationAnswer(currentQuestion){
		const _ = this;
		let
			output = document.createElement('div');
			output.innerHTML = currentQuestion['explanationText'];
		let
		handle = async () => await MathJax.typesetPromise([output]).then( () => {
			if(output.innerHTML != 'undefined'){
				return output.innerHTML;
			}
			return '';
		});
		let text = await handle();
		return `
			<div class="test-label-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#lamp"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<h5 class="test-label-title">
						<span>Explanation to correct answer</span>
					</h5>
					<p>${text}</p>
				</div>
			</div>`;
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
							{title: 'Mathematics',class:'active small'},
							{title: 'English Language Arts',class:'small'}
						]
					}
				})}
				<div class="practice-inner" id="bodyInner">
				
				</div>
			</div>
		`
	},

	quizessTasksTpl(headerData){
		const _ = this;
		return `
			<div class="block">
				${_.sectionHeaderTpl(headerData)}
				<ul class="quizess-task-list practice-task-list loader-parent">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
		`;
	},
	practiceTasksTpl(){
		const _ = this;
		return `
			<div class="block">
				<ul class="practices-task-list loader-parent">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
		`;
	},
	taskItemsTpl(taskDataItems){
		const _ = this;
		let taskItems = [];
		
		for (let taskInfo of taskDataItems) {
			taskItems.push(_.markup(_.taskItemTpl(taskInfo)))
		}
		return taskItems;
	},
	taskItemTpl(task,color='80, 20, 208'){
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
						">
					 ${task['status']  ? 'Completed' : 'Yet to start'}
					</span>
					<button 
						class="practice-task-item-button"
						data-subject="${task.subject}"
						data-id="${task.title}"
						data-num="${task.num}"
						section = "quizDirections"
						data-click="${_.componentName}:changeSection;${_.componentName}:setQuizInfo"
						style="background-color:rgb(${color});"
					>
						${task['status'] == 'completed' ? 'Review' : 'Start task'}
					</button>
				</div>
			</li>
		`;
		//	data-click="${_.componentName}:${task['status'] == 'completed' ? 'reviewTask' : 'startQuiz'}"
		//
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
		for (let item of itemsInfo.concepts) {
			tpl += `
				<li class="practice-table-row">
					<div class="info">
						<div class="icon"><svg><use xlink:href="#graphic-1"></use></svg></div>
						<h5 class="practice-table-row-title">${item.concept}</h5>
					</div>
					<button class="button" data-click="${_.componentName}:changeSection;" section="welcome" data-id="${item.concept}" data-category="${itemsInfo['category']}"><span>Practice</span></button>
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
	
	
	/* Cacrass templates*/

	welcomeCarcass(){
		const _ = this;
		return	`
			<div class="section">
				<div class="section-header">
					<h1 class="title" id="welcome-header-title"></h1>
					<button class="button-white" data-click="${this.componentName}:changeSection" section="mathematics">
						<span>Don’t start this section now</span>
					</button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title" id="welcome-title">How-to examples</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle">
							<span id="welcome-subtitle">Brush up on your foundations!</span>
						</h6>
						<p class="test-text" id="welcome-text">
							Check out these resources before diving into practice to help reinforce the concepts, level up in this skill, and ultimately boost your scores!
						</p>
						<ul class="practice-desc-list">
							<li class="practice-desc-item">
								<button class="practice-desc-item-button" data-id="video" data-click="showModal">
									<div class="img">
										<svg>
											<use xlink:href="#video-clip"></use>
										</svg>
									</div>
									<div class="desc">
										<h6 class="desc-title">Section, concept</h6><span class="desc-text">Video</span>
									</div>
								</button>
							</li>
							<li class="practice-desc-item">
								<button class="practice-desc-item-button" data-id="video" data-click="showModal">
									<div class="img">
										<svg>
											<use xlink:href="#video-clip"></use>
										</svg>
									</div>
									<div class="desc">
										<h6 class="desc-title">Section, concept</h6><span class="desc-text">Video</span>
									</div>
								</button>
							</li>
							<li class="practice-desc-item">
								<button class="practice-desc-item-button" data-id="article" data-click="showModal">
									<div class="img">
										<svg>
											<use xlink:href="#hwcompleted"></use>
										</svg>
									</div>
									<div class="desc">
										<h6 class="desc-title">Section, concept</h6><span class="desc-text">Video</span>
									</div>
								</button>
							</li>
							<li class="practice-desc-item">
								<button class="practice-desc-item-button" data-id="video" data-click="showModal">
									<div class="img">
										<svg>
											<use xlink:href="#play-icon"></use>
										</svg>
									</div>
									<div class="desc">
										<h6 class="desc-title">Section, concept</h6><span class="desc-text">Video</span>
									</div>
								</button>
							</li>
						</ul>
					</div>
					<div class="test-footer">
						<button class="button-blue" id="welcome-btn"	type="button" data-click="${this.componentName}:changeSection" section="directions">
							<span>Start skill practice</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	directionsCarcass(){
		const _ = this;
		return `
			<div class="section">
				<div class="section-header">
					<h1 class="title" id="directions-header-title"></h1>
					<button class="button-white"	data-click="${this.componentName}:changeSection" section="mathematics"><span>Exit this practice</span></button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Directions</span>
						</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle"><span id="directions-inner-title"></span></h6>
						<p class="test-text" id="directions-inner-text">
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue"	id="directions-btn" data-click="${this.componentName}:changeSection" section="questions">
							<span>Continue to <strong id="directionsQuestion">first</strong> question</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	async questionsCarcass(){
		const _ = this;
		return	`
			${await _.questionHeader()}
			<div class="section">
				<div class="block test-block" id="question-body">
					<div id="question-inner-body" style="overflow: hidden"><img src="/img/loader.gif" class="loader"></div>
					${_.questionFooter()}
				</div>
			</div>
			<div hidden>
				<form class="modal report" slot="modal-item" id="report" data-submit="${_.componentName}:saveReport">
					<h6 class="modal-title"><span>Report a mistake in this question</span></h6>
					<p class="modal-text">Remember to read through the explanations and double check your answer. Thanks for your help!</p>
					<p class="modal-text">What’s wrong</p>
					<div class="check-list">
						<g-input type='radio' class="g-form-item" name="answer" items='[
						{"value":"wrong","text":"The answer is wrong"},
						{"value":"typo","text":"I caught a typo."},
						{"value":"confus","text":"The question or explanations are confusing or unclear."},
						{"value":"broken","text":"Something isn’t working / something seems broken."}]'></g-input>
					</div>
					<h6 class="modal-title"><span>Description of issue</span></h6>
					<textarea class="modal-area g-form-item" name="description"></textarea>
					<div class="modal-row end">
						<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
						<button class="button-blue"><span>Submit Issue</span></button>
					</div>
				</form>
				<form class="modal note"	slot="modal-item" id="note" data-submit="${this.componentName}:saveNote">
						<h6 class="modal-title"><span>Note</span></h6>
						<textarea class="modal-area" name="text"></textarea>
						<div class="modal-row end">
							<button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
							<button class="button-blue"><span>Save</span></button>
						</div>
					</form>
			</div>
		`;
	},
	
	/* Cacrass templates*/
	async scoreCarcass(){
		const _ = this;
		let summary = await Model.getTestSummary();
		return	`
			<div class="section">
				<div class="section-header">
					<h2 class="title">Practice Test Score - Section Name</h2>
					<button class="button-white" data-click="StudentPage:changeSection" section="/student/tests">
						<span>Exit this section</span>
					</button>
				</div>
			</div>
			<div class="section">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Complete</span></h5>
					</div>
					<div class="test-inner">
						<h5 class="block-title test-title">
							<span>You finished ${Model.test['testType']} ${Model.test['testNumber']}</span>
						</h5>
						<p class="test-text">
							${Model.test['description'] ?? ''}
						</p>
					<div class="test-result">
						<div class="test-result-block violet">
							<h6 class="test-result-title"><span>Questions Answered</span></h6>
							<p class="test-result-score">${summary['answered']}</p>
						</div>
						<div class="test-result-block turquoise">
							<h6 class="test-result-title"><span>Questions Correct</span></h6>
							<p class="test-result-score">${summary['correct']}</p>
						</div>
						<div class="test-result-block gray">
							<h6 class="test-result-title"><span>Not answered</span></h6>
							<p class="test-result-score">${summary['notAnswered']}</p>
						</div>
						<div class="test-result-block green">
							<h6 class="test-result-title"><span>Score</span></h6>
							<p class="test-result-score">${summary['score']}</p>
						</div>
						<div class="test-result-block blue">
							<h6 class="test-result-title"><span>Stars for section of the Test</span></h6>
						<p class="test-result-score">+${summary['stars']}</p>
						<div class="test-result-img">
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
						</div>
					</div>
					</div>
					</div>
					<div class="test-footer">
						<a class="test-footer-back" data-click="${_.componentName}:changeSection" section="questions">
							<span>Review this section</span>
						</a>
						<!--button class="button-blue"><span>Start the next section: Quantitative Reasoning</span></button -->
					</div>
				</div>
			</div>
		`;
	},
	questionHeader(){
		const _ = this;
		return new Promise( (resolve) =>{resolve(`
			<div class="section">
				<div class="section-header">
					<h1 class="title" id="question-header-title">Concept name</strong></h1>
					<button class="button-white" data-click="${this.componentName}:changeSection" section="mathematics"><span>Exit this practice</span></button>
				</div>
			</div>
	`)});
	},
	questionNavigation(pos=0){
		const _ = this;
		let tpl = ``;
		for(let i=0; i < _.questionsLength; i++){
			if(pos == i){
				tpl+=`<a class="pagination-link active" data-pos="${i}"	data-click="${_.componentName}:jumpToQuestion"><span>${i+1}</span></a>`;
			}else{
				tpl+=`<a class="pagination-link" data-pos="${i}" data-click="${_.componentName}:jumpToQuestion"><span>${i+1}</span></a>`;
			}
		}
		return tpl;
	},
	questionFooter(){
		const _ = this;
		return `
			<div class="test-footer" style="padding-bottom: 0">
				<a class="test-footer-button" id='directions-btn' data-click="${this.componentName}:changeSection" section="directions">
					<span>Directions</span>
				</a>
				<div class="pagination pagination-top">
								<div class="pagination-info"><span>Do <strong class="questions-length"></strong> questions</span></div>
								<div class="pagination-links" id="question-pagination"></div>
							</div>
			<a class="button-blue" disabled="" id="check-answer-btn" data-click="${_.componentName}:checkAnswer"><span>Check answer</span></a>
			</div>`;
	},
	
	
	/* Questions tpls */
	gridDigitButtons(){
		const _ = this;
		let tpl = ``;
		for(let i=0; i < 10; i++){
			tpl+=`<button class="grid-button">${i}</button>`;
		}
		return tpl;
	},

	async gridQuestion(){
		const _ = this;
		let currentQuestion;
		if(_._$.currentQuestion['questions']){
			currentQuestion = _._$.currentQuestion['questions'][0]
		}else {
			currentQuestion = _._$.currentQuestion;
		}
		let
			{ title, text, intro, content } = await _.getQuestionFields(currentQuestion),
		tpl =	`
			<div class="test-header">
				<h5 class="block-title test-title"><span>Question ${_.questionPos+1} of ${_.questionsLength}</span></h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner test-row">
				<div class="test-col wide">
					`;
		if(currentQuestion['questionImages']){
			for(let fileLink of currentQuestion['questionImages']){
				if(fileLink == 'No') continue;
				tpl+=`<img src="${fileLink}" alt="">`;
			}
		}
		let correctAns = currentQuestion.correctAnswer.split('');
		tpl+=`
			<p class="test-text">
				<span>${intro}</span>
			</p>
			<p class="test-text">
				<span>${text}</span>
			</p>
			<p class="test-text">
				<span>${content}</span>
			</p>
			<div class="answer-list"></div>
			<div id="note-field-${currentQuestion['_id']}"></div>
			<div id="explanation-field-${currentQuestion['_id']}"></div>
			</div>
				<div class="test-col narrow grid empty" data-click="${_.componentName}:enterGridAnswer">
					<div class="grid-row">
						<input id="grid-value" type="hidden" data-question-id="${currentQuestion['_id']}">
						<div class="grid-input">
						<span> </span>
						<span> </span>
						<span> </span>
						<span> </span>
						<span> </span>
					</div>
					</div>
					<div class="grid-row">
						<div class="grid-col" data-col="1">
							<button class="grid-button">-</button>
						</div>
						<div class="grid-col"	data-col="2">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="3">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="4">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="5">
							<button class="grid-button">.</button>
						</div>
					</div>
					<div class="grid-row">
						<div class="grid-col"	data-col="1">
							<button class="grid-button high"> </button>
						</div>
						<div class="grid-col"	data-col="2">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="3">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="4">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="5">
							${_.gridDigitButtons()}
						</div>
					</div>
				</div>
				<div class="test-col narrow grid correct" hidden data-click="${_.componentName}:enterGridAnswer">
					<div class="marker">
						<span>Correct</span>
						<svg><use xlink:href="#correct"></use></svg>
					</div>
					<div class="grid-row">
						<input id="grid-value" type="hidden" data-question-id="${currentQuestion['_id']}">
						<div class="grid-input">
							<span> </span>
							<span> </span>
							<span> </span>
							<span> </span>
							<span> </span>
						</div>
					</div>
					<div class="grid-row">
						<div class="grid-col" data-col="1">
							<button class="grid-button">-</button>
						</div>
						<div class="grid-col"	data-col="2">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="3">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="4">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="5">
							<button class="grid-button">.</button>
						</div>
					</div>
					<div class="grid-row">
						<div class="grid-col"	data-col="1">
							<button class="grid-button high"></button>
						</div>
						<div class="grid-col"	data-col="2">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="3">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="4">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="5">
							${_.gridDigitButtons()}
						</div>
					</div>
				</div>
				<div class="test-col narrow grid incorrect" hidden data-click="${_.componentName}:enterGridAnswer">
					<div class="marker">
						<span>Incorrect</span>
						<svg><use xlink:href="#incorrect"></use></svg>
					</div>
					<div class="grid-row">
						<input id="grid-value" type="hidden" data-question-id="${currentQuestion['_id']}">
						<div class="grid-input">
							<span> </span>
							<span> </span>
							<span> </span>
							<span> </span>
							<span> </span>
						</div>
					</div>
					<div class="grid-row">
						<div class="grid-col" data-col="1">
							<button class="grid-button">-</button>
						</div>
						<div class="grid-col"	data-col="2">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="3">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="4">
							<button class="grid-button">.</button>
						</div>
						<div class="grid-col"	data-col="5">
							<button class="grid-button">.</button>
						</div>
					</div>
					<div class="grid-row last">
						<div class="grid-col"	data-col="1">
							<button class="grid-button high"></button>
						</div>
						<div class="grid-col"	data-col="2">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="3">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="4">
							${_.gridDigitButtons()}
						</div>
						<div class="grid-col"	data-col="5">
							${_.gridDigitButtons()}
						</div>
					</div>
					<span class="grid-title">Correct answer:</span>
					<div class="grid-row ans" data-question-id="${currentQuestion['_id']}">`;
		for (let i = 0; i < 5; i++) {
			let curAns = '';
			if (correctAns[0] == '-') {
				curAns = correctAns[i] ?? '';
			} else {
				curAns = correctAns[i - 1] ?? '';
			}
			tpl += `
				<div class="grid-col" data-col="${i + 1}" >
					<button class="grid-button" style="background-color: rgb(var(--green-light));color:rgb(var(--green-dark))">${ curAns }</button>
				</div>
			`
		}
		tpl += `
					</div>
				</div>
			</div>
		`;
		return tpl;
	},
	async compareQuestion(){
		const _ = this;
		let
		currentQuestion = _._$.currentQuestion['questions'][0],
		tpl= `
				<div class="test-header">
					<h5 class="block-title test-title"><span>Question ${_.questionPos} of ${_.questionsLength}</span></h5>
					${_.actionsTpl(currentQuestion)}
				</div>
				<div class="test-inner middle">
					<p class="test-text"><span>${currentQuestion['mathFormula']}</span></p>
					<div class="test-row">
						<div class="test-col mini">
							<h6 class="test-col-title"><span>Column A</span></h6>
							<p class="test-text">${_._$.currentQuestion['columnLeft']}</p>
						</div>
						<div class="line"></div>
						<div class="test-col mini">
							<h6 class="test-col-title"><span>Column B</span></h6>
							<p class="test-text">${_._$.currentQuestion['columnRight']}</p>
						</div>
					</div>
					<ul class="answer-list" data-question-id="${currentQuestion['_id']}">`;
		for(let answer in	currentQuestion['answers']){
			tpl+=await _.answerTpl(currentQuestion,answer);
		}
		tpl+=`</ul>
			<div id="note-field-${currentQuestion['_id']}"></div>
			<div id="explanation-field-${currentQuestion['_id']}"></div>
			</div>
		`;
		return tpl;
	},
	async markCorrectAnswer(){
		const _ = this;
		let isGrid = await G_Bus.trigger(_.componentName,'isGrid');
		if(isGrid){
			return void 0;
		}
		let handle = ( questionId,correctVariant )=>{
			let
			answerItem = _.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${correctVariant}"]`);
			if(!answerItem) return void 0;
			answerItem.classList.remove('wrong');
			answerItem.classList.add('correct');
		};
		if(_._$.currentQuestion['questions']){
			if(_._$.currentQuestion['questions'].length > 1){
				for(let question of _._$.currentQuestion['questions']){
					let
					answeredQuestion = Model.allquestions[_.questionPos],//Model.questions[question['id']],
					correctVariant = answeredQuestion['correctAnswer'];
					//	correctVariant = '4'; // stub, delete in future
					handle(question['_id'],correctVariant);
				}
			}
		}else{
			let
			currentQuestion = _._$.currentQuestion,
			answeredQuestion = Model.allquestions[_.questionPos],
			correctVariant = answeredQuestion['correctAnswer'];
			handle(currentQuestion['_id'],correctVariant);
		}
		
	},
	async graphicQuestion(){
		const _ = this;
		let currentQuestion;
		if(_._$.currentQuestion['questions']){
			currentQuestion = _._$.currentQuestion['questions'][0]
		}else {
			currentQuestion = _._$.currentQuestion;
		}
		let { text,intro,content } = await _.getQuestionFields(currentQuestion),
		tpl= `
				<div class="test-row test-inner">
					<div class="test-col">
						<div class="test-left">
			`;
		for(let fileLink of currentQuestion['questionImages']){
			tpl+=`<img src="${fileLink}" alt="">`;
		}
		tpl+=`</div>
				</div>
				<div class="test-col">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Question ${_.questionPos+1} of ${_.questionsLength}</span>
							<strong style="font-size:10px;margin-left: 15px">${_._$.currentQuestion['questionId']}</strong>
						</h5>
						${_.actionsTpl(currentQuestion)}
					</div>
					<p class="test-text"><span>${intro}</span></p>
					<p class="test-text"><span>${text}</span></p>
					<ul class="answer-list" data-question-id="${currentQuestion['_id']}">
				`;
		for(let answer in	currentQuestion['answers']){
			tpl+=await _.answerTpl(currentQuestion,answer);
		}
		tpl+=`
				</ul>
				<div id="note-field-${currentQuestion['_id']}"></div>
				<div id="explanation-field-${currentQuestion['_id']}"></div>
			</div>
		</div>`;
		return tpl;
	},
	async passageQuestion(){
		const _ = this;
		/*<p class="test-text"><span>${question['title']}</span></p>*/
		let tpl= `
			<div class="test-inner test-row">
				<div class="test-col">
					<div class="test-left">
						<p class="test-left-text">${_._$.currentQuestion['questionDataId']}</p>
						<p class="test-left-text">${_._$.currentQuestion['passageText']}</p>
					</div>
				</div>
				<div class="test-col">
					<div class="test-right">
						<p class="test-text">${_._$.currentQuestion['questionDataId']}</p>
		`;
		let cnt = 0;
		for(let question of _._$.currentQuestion['questions']){
			tpl+= `
				<div class="test-sec" id="${question['_id']}">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Question ${cnt+1} of ${_._$.currentQuestion['questions'].length}</span>
						<strong style="font-size:10px;margin-left: 15px">${question['questionId']}</strong>
						</h5>
						${_.actionsTpl(question)}
					</div>
					<p class="test-text"><span>${question['questionText']}</span></p>
					<ul class="answer-list" data-question-id="${question['_id']}" >`;
			for(let answer in question['answers']){
				let ans = question['answers'][answer];
				tpl+= await _.answerTpl(question,answer);
			}
			tpl+=`</ul>
				<div id="note-field-${question['_id']}"></div>
				<div id="explanation-field-${question['_id']}"></div>
			</div>`;
			cnt++;
		}
		tpl+=`</div>
				</div>
			</div>`;
		return tpl;
	},
	async standartQuestion(){
		const _ = this;
		let currentQuestion;
		if(_._$.currentQuestion['questions']){
			currentQuestion = _._$.currentQuestion['questions'][0]
		}else {
			currentQuestion = _._$.currentQuestion;
		}
		let
			{ text,intro,content } = await _.getQuestionFields(currentQuestion),
		tpl = `
			<div class="test-header">
				<h5 class="block-title test-title ddss">
					<span>Question ${_.getStep()} of ${Model.allQuestionsLength}</span>
					<strong style="font-size:10px;margin-left: 15px">${currentQuestion['questionId']}</strong>
				</h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner middle">
				<p class="test-text">
					${intro}
				</p>
				<p class="test-text">
					${content != 'undefined' ? content : ''}
				</p>
				<p class="test-text">
					${text}
				</p>
			<ul class="answer-list" data-question-id="${currentQuestion['_id']}">
		`;
		for(let answer in	currentQuestion['answers']){
			tpl+=await _.answerTpl(currentQuestion,answer);
		}
		tpl+=`
			</ul>
			<div id="note-field-${currentQuestion['_id']}"></div>
			<div id="explanation-field-${currentQuestion['_id']}"></div>
		</div>`;
		return tpl;
	},
	/* Questions tpls */
	
	skillSummary(summary,category,concept){
		const _ = this;
		return `
			<div class="test-inner">
				<h5 class="block-title test-title"><span>You finished ${concept}</span></h5>
				<p class="test-text">Description text about rules at the real test - if there will be break or not etc.</p>
				<div class="test-result">
					<div class="test-result-block half violet">
						<h6 class="test-result-title"><span>Questions Answered</span></h6>
						<p class="test-result-score">${summary['answered']}</p>
					</div>
					<div class="test-result-block half turquoise">
						<h6 class="test-result-title"><span>Questions Correct</span></h6>
						<p class="test-result-score">${summary['correct']}</p>
					</div>
					<div class="test-result-block half gold">
						<h6 class="test-result-title"><span>Stars for section of the Test</span></h6>
						<p class="test-result-score">+${summary['stars']}</p>
						<div class="test-result-img">
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
						</div>
					</div>
					<div class="test-result-block blue half">
						<h6 class="test-result-title"><span>Skill Level: Converting between decimals, fractions, and percents</span></h6>
						<p class="test-result-score">${summary['level']}</p>
						<div class="test-result-img solo">
							<svg>
								<use xlink:href="#graphic-3"></use>
							</svg>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}