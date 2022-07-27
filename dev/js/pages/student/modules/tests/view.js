import	{ Model } from "./model.js";
import {G_Bus} from "../../../../libs/G_Bus.js";
export const view = {
	noteTpl(question){
		const _ = this;
		let tpl = ``;
		if(!_.storageTest[question['_id']]) return tpl;
		if(_.storageTest[question['_id']].note) {
			tpl = `<div class="test-label-block note-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${_.storageTest[question['_id']].note}
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
		}
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
			if( answeredQuestion ){
				if(currentQuestion['correctAnswer']){
					if( (currentQuestion['correctAnswer'].toUpperCase() !== answeredQuestion['answer'].toUpperCase())  && (answeredQuestion['answer'].toUpperCase() == answer.toUpperCase()) ) {
						status = 'incorrect';
					}
				}
			}
				tpl = `
					<li class="answer-item ${status}" data-question-id="${question['_id']}" data-variant="${answer}">
						<button class="answer-button">
							<span class="answer-variant">${answer}</span>
							<span class="answer-value">${question['answers'][answer]}</span>
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
	
	
	/* Cacrass templates*/
	directionsCarcass(){
		const _ = this;
		return `
			<div class="section">
				<div class="section-header">
					<h1 class="title">${Model.currentSection['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${Model.test.testTime}</span> minutes left</div>
					<button class="button-white"	data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
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
						<h6 class="test-subtitle"><span>${Model.currentSection['directions'].innerTitle}</span></h6>
						<p class="test-text">
							${Model.currentSection['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue"	data-click="${this.componentName}:changeSection" section="questions">
							<span>Continue to first question</span>
						</button>
					</div>
				</div>
			</div>
		`;
	},
	welcomeCarcass(){
		const _ = this;
		return	`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${Model.currentSection['welcome'].headerTitle}</h1>
					<button class="button-white" data-click="StudentPage:changeSection" section="/student/tests">
						<span>Don’t start this section now</span>
					</button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${Model.currentSection['welcome'].innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle">
							<span>${Model.currentSection['welcome'].innerTitle}</span>
						</h6>
						<p class="test-text">
							${Model.currentSection['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="${this.componentName}:changeSection" section="directions">
							<span>Let’s go, start the timer!</span>
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
		 <div class="section row">
				<div class="col wide">
					<div class="block test-block tt-ii">
						${await _.getQuestionTpl()}
						${_.questionFooter()}
					</div>
				</div>
					${_.questionsListCont()}
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
						<!--<div class="check-item">
							<input type="radio" name="answer" id="report-wrong">
							<label class="check-label" for="report-wrong"><span class="check-label-icon radio"></span><span class="check-label-text">The answer is wrong.</span></label>
						</div>
						<div class="check-item">
							<input type="radio" name="answer" id="report-typo">
							<label class="check-label" for="report-typo"><span class="check-label-icon radio"></span><span class="check-label-text">I caught a typo.</span></label>
						</div>
						<div class="check-item">
							<input type="radio" name="answer" id="report-confusing">
							<label class="check-label" for="report-confusing"><span class="check-label-icon radio"></span><span class="check-label-text">The question or explanations are confusing or unclear.</span></label>
						</div>
						<div class="check-item">
							<input type="radio" name="answer" id="report-broken">
							<label class="check-label" for="report-broken"><span class="check-label-icon radio"></span><span class="check-label-text">Something isn’t working / something seems broken.</span></label>
						</div>-->
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
					<h1 class="title">${Model.test.testStandard}-${Model.test.testGrade} &mdash; ${Model.currentSection.sectionName}</h1>
					<div class="test-timer"><span class="test-timer-value">${Model.test.testTime}</span> minutes left</div>
					<button class="button-white" data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
				</div>
			</div>
	`)});
	},
	questionFooter(){
		return `
			<div class="test-footer">
				<button class="test-footer-button dir-button" data-click="${this.componentName}:changeSection" section="directions">
					<span>Directions</span>
				</button>
				<button class="button skip-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="next">
					<span><em class="skip-to-question-title">Skip to questions</em> <b class="skip-to-question">${Model.currentQuestionData(0)['questions'].length+1}</b></span>
				</button>
			</div>`;
	},

	questionsListNavTabs(){
		const _ = this;
		let tpl = `
			<div class="questions-nav">
				<h6 class="questions-list-title">Click on to go to the question</h6>
				<div class="questions-nav-list">`,
			sections = Model.test.sections;
		for (let i = 0; i < sections.length; i++) {
			let section = sections[i];
			tpl += `<button class="questions-nav-btn${i === 0 ? ' active' : ''}"  data-section-pos="${i}"  data-click="${_.componentName}:changeTestSection" >${section.sectionName}</button>`
		}
		tpl += `
				</div>
			</div>`;
		return tpl;
	},
	questionsList(){
		const _ = this;
		let
			tpl = ``,
			cnt = 1;
		for(let questionPage of _.questionsPages){
			for(let question of questionPage['questions']){
				tpl+=`
					<li class="questions-item" data-questionPage-id="${questionPage['type'] == 'passage' ? questionPage['_id'] : -1 }" data-question-id="${question._id}" >
						<span class="questions-number">${cnt++}</span>
						<button class="questions-variant" data-click="${this.componentName}:jumpToQuestion"></button>
						<div class="questions-bookmark">
							<svg>
								<use xlink:href="#bookmark-transparent"></use>
							</svg>
							<svg>
								<use xlink:href="#bookmark"></use>
							</svg>
						</div>
					</li>
				`;
			}
		}
		return tpl;
	},
	questionsListCont(){
		const _ = this;
		let tpl =	`
			<div class="col narrow">
				<div class="block questions">
				<h5 class="block-title small"><span>Questions</span></h5>
				${Model.test.testStandard == "SHSAT" ? _.questionsListNavTabs() : ''}
				<div class="questions-cont">
					<h6 class="questions-list-title"><span>Question 1 - <i class="questions-length">${Model.allQuestionsLength}</i></span></h6>
					<ul class="questions-list">
						${_.questionsList()}
					</ul>
			</div>
				<button class="questions-button" data-click="${this.componentName}:scrollForMore">
					<svg>
						<use xlink:href="#arrow-bottom"></use>
					</svg>
					<span>Scroll for more</span>
					<svg>
						<use xlink:href="#arrow-bottom"></use>
					</svg>
				</button>
			</div>
			</div>
			</div>
		`;
		return tpl;
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
	gridQuestion(){
		const _ = this;
		let
			currentQuestion = _._$.currentQuestion,
			tpl =	`
			<div class="test-header">
				<h5 class="block-title test-title"><span>Question ${_.questionPos+1} of ${_.questionsLength}</span></h5>
				${_.actionsTpl(_._$.currentQuestion)}
			</div>
			<div class="test-inner test-row">
				<div class="test-col wide">
					`;
		if(currentQuestion['questionImages']){
			for(let fileLink of currentQuestion['questionImages']){
				tpl+=`<img src="${fileLink}" alt="">`;
			}
		}
		tpl+=`
			<p class="test-text">
				<span>${currentQuestion['title']}</span>
			</p>
			<p class="test-text">
				<span>${currentQuestion['questionText']}</span>
			</p>
			<br><br>
			</div>
				<div class="test-col narrow grid" data-click="TestPage:enterGridAnswer">
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
				<div class="grid-col">
				<button class="grid-button">-</button>
			</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
			</div>
			<div class="grid-row">
				<div class="grid-col">
					<button class="grid-button high"></button>
				</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
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
			${_.noteTpl(currentQuestion)}
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
		let handle = (questionId,correctVariant)=>{
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
						answeredQuestion = Model.questions[_.questionPos],//Model.questions[question['id']],
					correctVariant = answeredQuestion['correctAnswer'];
					handle(question['_id'],correctVariant);
				}
			}
		}else{
			let
				currentQuestion = _._$.currentQuestion,
				answeredQuestion = Model.questions[_.questionPos],
				correctVariant = answeredQuestion['correctAnswer'];
			handle(currentQuestion['_id'],correctVariant);
		}
		
	},
	async graphicQuestion(){
		const _ = this;
		
		let
			currentQuestion = _._$.currentQuestion,//['questions'][0],
		tpl= `
				<div class="test-row test-inner">
					<div class="test-col">
						<div class="test-left">
			`;
		let output = document.createElement('div');
		output.innerHTML = currentQuestion['questionText'];
		let text = await MathJax.typesetPromise([output]).then( () => output.innerHTML);
		for(let fileLink of currentQuestion['questionImages']){
			tpl+=`<img src="${fileLink}" alt="">`;
		}
		tpl+=`</div>
				</div>
				<div class="test-col">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Question ${_.questionPos+1} of ${_.questionsLength}</span>
						</h5>
						${_.actionsTpl(currentQuestion)}
					</div>
					<p class="test-text"><span>${currentQuestion['title']}</span></p>
					<p class="test-text"><span>${text}</span></p>
					<ul class="answer-list" data-question-id="${currentQuestion['_id']}">
				`;
		for(let answer in	currentQuestion['answers']){
			tpl+=await _.answerTpl(currentQuestion,answer);
		}
		tpl+=`
					</ul>
					${_.noteTpl(currentQuestion)}
				</div>
			</div>`;
		return tpl;
	},
	async passageQuestion(){
		const _ = this;
		let tpl= `
			<div class="test-inner test-row">
				<div class="test-col">
					<div class="test-left">
						<p class="test-left-text">${_._$.currentQuestion['passageType']}</p>
						<p class="test-left-text">${_._$.currentQuestion['passageText']}</p>
					</div>
				</div>
				<div class="test-col">
					<div class="test-right" >
						<p class="test-text">${_._$.currentQuestion['passageType']}</p>
				`;
		let cnt = _.questionPos;
		//allQuestionsLength()
		for(let question of _._$.currentQuestion['questions']){
			tpl+= `
					<div class="test-sec">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Question ${cnt+1} of ${_._$.currentQuestion['questions'].length}</span></h5>
						${_.actionsTpl(question)}
					</div>
					<p class="test-text"><span>${question['title']}</span></p>
					<ul class="answer-list" data-question-id="${question['_id']}" id="${question['_id']}">`;
			for(let answer in question['answers']){
				let ans = question['answers'][answer];
				tpl+= await _.answerTpl(question,answer);
			}
			tpl+=`</ul>${_.noteTpl(question)}</div>`;
			cnt++;
		}
		
		tpl+=`</div>
				</div>
			</div>`;
		return tpl;
	},
	async standartQuestion(){
		const _ = this;
		let
			currentQuestion = _._$.currentQuestion,
			output = document.createElement('div');
		if(!currentQuestion['title']) currentQuestion = currentQuestion['questions'][0];
		output.innerHTML = currentQuestion['questionText'];
		MathJax.texReset();
		MathJax.typesetClear();
		let
			text = await MathJax.typesetPromise([output]).then( () => output.innerHTML),
			tpl = `
			<div class="test-header">
				<h5 class="block-title test-title ddss">
					<span>Question ${_.getStep()} of ${Model.allQuestionsLength}</span>
				</h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner middle">
				<p class="test-text">
					${currentQuestion['title']}
				</p>
				<p class="test-text">
					${text}
				</p>
			<ul class="answer-list" data-question-id="${currentQuestion['_id']}">
		`;
		for(let answer in	currentQuestion['answers']){
			tpl+=await _.answerTpl(currentQuestion,answer)
			// active disabled
			;
		}
		tpl+=`
			</ul>
			${_.noteTpl(currentQuestion)}
		</div>`;
		return tpl;
	},
	/* Questions tpls */
	explanationAnswer(){
		const _ = this;
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
					<p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
				</div>
			</div>`;
	},
	
	
	
	testScoreHeaderTpl(){
		const _ = this;
		return `
			<div class="section">
				<div class="block">
					<h1 class="title">Test Scores</h1>
					<p class="test-text test-header-text">Your test scores will appear here once you complete your first practice test.</p>
				</div>
			</div>
		`;
	},
	
	
	testPickTpl(test){
		const _ = this;
		let status = "Start";
		if(Model.test['status'] == 'in progress') status = "Continue";
		if(Model.test['status'] == 'finished') status = "Review";
		let tpl = `
			<li class="test-pick-item green">
				<div class="test-pick-time"><span id="testTime">180</span><span>min</span></div>
				<ul class="test-pick-desc">
				`;
			for(let section of Model.test.sections){
				let questionCnt = 0;
				for(let sectionData of section['subSections'][0]['questionData']){
					if(!sectionData['questions']) continue;
					questionCnt+=sectionData['questions'].length;
				}
				tpl+=`
					<li class="test-pick-desc-item">
						<h6 class="test-pick-title">${section['sectionName']}</h6>
						<p class="text">${questionCnt} questions</p>
					</li>
				`;
			}
		tpl+= `
				</ul>
				<button class="button" data-test-id="${Model.test['_id']}" data-click="${_.componentName}:changeSection" section="welcome"><span>${status} this test</span></button>
			</li>
		`;
			return tpl;
	},
	resetButtonTpl(){
		const _ = this;
		return `
			<h5 class="title"><span>Reset Practice Test </span></h5>
			<p class="text">You can discard your current progress and re-take this test from the beginning</p>
			<button class="button" id="testResetBtn"  data-click="${_.componentName}:resetTest" data-id="${Model.test['resultId']}"><span>Reset this test</span></button>`;
	},
	tempTestListTpl(){
		const _ = this;
		return `
			<div class="section">
				<div class="block test-row">
					${_.testListAsideTpl()}
					<div class="test-tabs">
						<div class="test-tabs-body">
							<h5 class="block-title test-title">
								<span>Start Practice Test </span>
							</h5>
							<p class="test-text">
								<span>After completing a section, you can stop or review</span>
							</p>
							<ul class="test-pick-list shsat loader-parent" id="testPickList">
								<img src="/img/loader.gif" alt="">
							</ul>
							<div class="test-pick-result" id="test-pick-button-cont">
								<img src="/img/loader.gif" alt="">
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	testListTpl(){
		const _ = this;
		return `
			<div class="section">
				<div class="block test-row">
					${_.testListAsideTpl()}
					<div class="test-tabs">
						<div class="test-tabs-body">
							<h5 class="block-title test-title"><span>Start Practice test 1</span></h5>
							<p class="test-text"><span>After completing a section, you can stop or review</span></p>
							<ul class="test-pick-list">
								<li class="test-pick-item red done">
									<div class="test-pick-time"><span>20</span><span>min</span></div>
									<div class="test-pick-desc">
										<h6 class="test-pick-title">Verbal Reasoning</h6>
										<p class="text">40 questions</p>
									</div>
									<button class="button"><span>Review this section</span></button>
								</li>
								<li class="test-pick-item blue">
									<div class="test-pick-time"><span>35</span><span>min</span></div>
									<div class="test-pick-desc">
										<h6 class="test-pick-title">Quantitative Reasoning</h6>
										<p class="text">37 questions</p>
									</div>
									<button class="button"><span>Start this section</span></button>
								</li>
								<li class="test-pick-item violet disabled">
									<div class="test-pick-time"><span>35</span><span>min</span></div>
									<div class="test-pick-desc">
										<h6 class="test-pick-title">Reading Comprehension</h6>
										<p class="text">36 questions</p>
										<p class="text">
											<svg>
												<use xlink:href="#lock"></use>
											</svg>Complete previous sections to unlock
										</p>
									</div>
								</li>
								<li class="test-pick-item turquoise disabled">
									<div class="test-pick-time"><span>40</span><span>min</span></div>
									<div class="test-pick-desc">
										<h6 class="test-pick-title">Mathematics Achievement</h6>
										<p class="text">47 questions</p>
										<p class="text">
											<svg>
												<use xlink:href="#lock"></use>
											</svg>Complete previous sections to unlock
										</p>
									</div>
								</li>
							</ul>
							<ul class="test-pick-list">
								<li class="test-pick-item brown disabled">
									<div class="test-pick-time"><span>30</span><span>min</span></div>
									<div class="test-pick-desc">
										<h6 class="test-pick-title">Essay (Optional)</h6>
										<p class="text">Your essay is not scored</p>
										<p class="text">
											<svg>
												<use xlink:href="#lock"></use>
											</svg>Complete previous sections to unlock
										</p>
									</div>
								</li>
							</ul>
							<div class="test-pick-result">
								<h5 class="title"><span>Reset Practice test 1</span></h5>
								<p class="text">You can discard your current progress and re-take this test from the beginning</p>
								<button class="button" disabled=""><span>Reset this test</span></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	
	
	testListAsideItemTpl(test,i){
		const _ = this;
		return `
			<li class="test-aside-item">
				<button data-pos="${i-1}" class="test-aside-btn ${i == 1 ? 'active' : ''}" data-id="${test['_id']}" data-click="${_.componentName}:changePracticeTest">
					<h6 class="test-aside-btn-title">Practice test ${test['testNumber']}</h6><span class="test-aside-btn-desc">0 of 4 sections complete</span>
					<div class="test-aside-btn-date">
						<svg>
							<use xlink:href="#calendar"></use>
						</svg><span>${_.createdAtFormat(test['createdAt'])}</span>
					</div>
				</button>
			</li>
		`;
	},
	
	testListAsideTpl(){
		const _ = this;
		return `
			<div class="test-aside">
				<h5 class="test-aside-title">Tests</h5>
				<ul class="test-aside-list" id="testAsideList">
					<img src="/img/loader.gif" alt="">
				</ul>
			</div>
		`;
	},


	testsBody(){
		const _ = this;
		//${_.testScoreHeaderTpl()}
		//${/*_.tempTestListTpl()*/}
		return `
			${_.testScoreHeaderTpl()}
			${_.tempTestListTpl()}
		`;
	}
	
	
}