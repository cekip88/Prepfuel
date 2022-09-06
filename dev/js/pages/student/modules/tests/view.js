import	{ Model } from "./model.js";
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
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}"><span>Delete</span></button>
				</div>
			</div>`;
		return tpl;
	},
	noteTpl(question){
		const _ = this;
		let tpl = ``;
		if(!_.storageTest) return tpl;
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
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote;${this.componentName}:changeInnerQuestionId" data-question-id="${question['_id']}"><span>Delete</span></button>
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
			if(!currentQuestion['correctAnswer'])  currentQuestion['correctAnswer'] = 'B'; // stub and delete in future
			if( (currentQuestion['correctAnswer'].toUpperCase() !== answeredQuestion['answer'].toUpperCase())  && (answeredQuestion['answer'].toUpperCase() == answer.toUpperCase()) ) {
				status = 'incorrect';
			}
			output.innerHTML = question['answers'][answer];
			
			let
				text = await MathJax.typesetPromise([output]).then( () => output.innerHTML);
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
	
	
	/* Cacrass templates*/
	directionsCarcass(){
		const _ = this;
		return `
			<div class="section">
				<div class="section-header">
					<h1 class="title">${Model.currentSection['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${Model.test.testTime}</span> minutes left</div>
					<button class="button-white"	data-click="${this.componentName}:showConfirmModal" section="score"><span>Finish this test</span></button>
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
							<span>Continue to <strong id="directionsQuestion">1</strong> question</span>
						</button>
					</div>
				</div>
			</div>
			<div hidden>
				${_.confirmFinishTpl()}
			</div>
		`;
	},
	welcomeCarcass(){
		const _ = this;
		return	`
			<div class="section">
				<div class="section-header">
					<h1 class="title">Welcome</h1>
					<button class="button-white" data-click="StudentPage:changeSection" section="/student/tests">
						<span>Don’t start this test now</span>
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
				${_.confirmFinishTpl()}
			</div>
		`;
	},

	/* Cacrass templates*/
	async scoreCarcass(){
		const _ = this;
		let summaries = await Model.getTestSummary();
		clearInterval(_.timerInterval);
		let tpl = `
				<div class="section">
				<div class="section-header">
					<h2 class="title">Practice Test Score - Section Name</h2>
					<button class="button-white" data-click="StudentPage:changeSection" section="/student/tests">
						<span>Exit this test</span>
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
		`;
		if(summaries){
			for(let sum of summaries){
				let summary = sum['result']
				tpl+=`
					<p class="test-text">
						${sum['title']}
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
				`;
			}
		}
		
		tpl+=`</div>
					<div class="test-footer">
						<a class="test-footer-back" data-click="${_.componentName}:changeSection" section="questions">
							<span>Review this test</span>
						</a>
						<!--button class="button-blue"><span>Start the next section: Quantitative Reasoning</span></button -->
					</div>
				</div>
			</div>`;
		return tpl;
	},
	questionHeader(){
		const _ = this;
		return new Promise( (resolve) =>{ resolve(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">Practice test ${Model.test['testNumber']} &mdash; <strong id="test-section-name">${Model.currentSection.sectionName}</strong></h1>
					<div class="test-timer"><span class="test-timer-value">${Model.test.testTime}</span> minutes left</div>
					<button class="button-white header-question-btn" data-click="${this.componentName}:showConfirmModal" section="score"><span>Finish this test</span></button>
				</div>
			</div>
	`)});
	},
	questionFooter(){
		const _ = this;
		let
			pos,
			pp = _.getNextStepCnt(),
			questionData = Model.currentQuestionData(_.questionPos+1);

		if(questionData){
			if(questionData['type'] == 'passage'){
				if(pp[0] > pp[1]){
					pp[0] = pp[1];
				}
				pos = `${pp[0]}-${pp[1]}`;
			}else{
				pos = `${pp[0]-1}`;
			}
		}
		return `
			<div class="test-footer">
				<button class="test-footer-button dir-button" data-click="${this.componentName}:changeSection" section="directions">
					<span>Directions</span>
				</button>
				${ _.questionPos>0 ?_.addBackToQuestionBtnTpl(_.getPrevStepCnt()) : ''}
				<button class="button skip-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="next">
					<span><em class="skip-to-question-title">Skip to questions</em> <b class="skip-to-question">${pos}</b></span>
				</button>
			</div>
			`;
	},
	addBackToQuestionBtnTpl(pos){
		const _ = this;
		let questionData = Model.currentQuestionData(_.questionPos-1);
		let questPos = `${pos[0]}`;
		if(questionData){
			if(questionData['type'] != 'passage'){
				questPos = pos[0]-1;
			}else{
				questPos = `${pos[0]}-${pos[1]}`
			}
		}
		if(pos == -1){
			return `
				<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeTestSection" data-section-pos="0">
					<span>Back to the previous section</span>
				</button>`;
		}else{
			return `<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="prev">
						<span>Back to questions ${questPos}</span>
					</button>`;
		}
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
			tpl += `<button class="questions-nav-btn${i === 0 ? ' active' : ''}"  data-section-pos="${i}"  data-click="${_.componentName}:changeTestSection"  data-changed-type="fromTab">${section.sectionName}</button>`
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
					<h6 class="questions-list-title"><span>Question 1 - <i class="questions-length" id="questions-length">${Model.allQuestionsLength}</i></span></h6>
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
				<h5 class="block-title test-title"><span>Question ${_.getStep()[0]-1} of ${_.questionsLength}</span></h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner ">
			<div class="test-row">
				<div class="test-col wide">
					`;
		if(currentQuestion['questionImages']){
			for(let fileLink of currentQuestion['questionImages']){
				tpl+=`<img src="${fileLink}" alt="">`;
			}
		}
		let correctAns = currentQuestion.correctAnswer.split('');
	//	let correctAns = '-1234'.split(''); // stub delete in future
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
			<div class="answer-block" data-question-id="${currentQuestion['_id']}">${_.noteTpl(currentQuestion)}</div>
			${Model.isFinished() ? await _.explanationAnswer(currentQuestion) : ''}
			</div>
				<div class="test-col narrow grid empty"  data-click="${_.componentName}:enterGridAnswer">
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
				<div class="test-col narrow grid correct"  hidden data-click="${_.componentName}:enterGridAnswer">
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
				<div class="test-col narrow grid incorrect"  hidden data-click="${_.componentName}:enterGridAnswer">
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
					<div class="grid-row ans" data-question-id="${currentQuestion['_id']}">
				`;
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
			</div>`;
		return tpl;
	},
	async compareQuestion(){
		const _ = this;
		let
			currentQuestion = _._$.currentQuestion['questions'][0],
			tpl= `
				<div class="test-header">
					<h5 class="block-title test-title"><span>Question ${_.getStep()[0]-1} of ${_.questionsLength}</span></h5>
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
			<div class="answer-block" data-question-id="${currentQuestion['_id']}">${_.noteTpl(currentQuestion)}</div>
			${Model.isFinished() ? await _.explanationAnswer(currentQuestion) : ''}
			</div>
		`;
		return tpl;
	},
	async markCorrectAnswer(){
		const _ = this;
		let isGrid = await G_Bus.trigger(_.componentName,'isGrid');
	
		let handle = ( questionId,correctVariant )=>{
			if(isGrid){
				let
					id = questionId,
					question = _._$.currentQuestion,
					ans =   _.storageTest[id]['answer'];
				
				if( _._$.currentQuestion['questions']){
					question = _._$.currentQuestion['questions'][0];
				}
				
				if(_.storageTest[id]['answer'] != 'O'){
					if(typeof  _.storageTest[id]['answer'] == 'object'){
						ans =   _.storageTest[id]['answer'].join('');
						ans = ans.replaceAll('_','');
					}else{
						ans =  _.storageTest[id]['answer'];
					}
				}
		/*		let answeredQuestion = Model.allquestions[_.questionPos]
				*/
				if(question['correctAnswer'].trim() == ans.trim()){
					_.f('.grid.empty').setAttribute('hidden','hidden');
					_.f('.grid.correct').removeAttribute('hidden');
					_.setGridAnswer(ans.split(''),'.grid.correct');
				}else{
					_.f('.grid.empty').setAttribute('hidden','hidden');
					_.f('.grid.incorrect').removeAttribute('hidden');
					if(ans != 'O')
					_.setGridAnswer(ans.split(''),'.grid.incorrect');
				}
			}else{
			//	console.log(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${correctVariant}"]`);
				let
					answerItem = _.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${correctVariant}"]`);
				if(!answerItem) return void 0;
				answerItem.classList.remove('wrong');
				answerItem.classList.add('correct');
			}
		};
		if(_._$.currentQuestion['questions']){
			for(let question of _._$.currentQuestion['questions']){
				let
					answeredQuestion = Model.allquestions[_.questionPos],//Model.questions[question['id']],
				correctVariant = question['correctAnswer'];//answeredQuestion['correctAnswer'];
	//			correctVariant = 'A'; // stub, delete in future
				console.log(question,answeredQuestion);
				handle(question['_id'],correctVariant.toLowerCase());
			}
		}else{
			let
				currentQuestion = _._$.currentQuestion,
				answeredQuestion = Model.allquestions[_.questionPos],
				correctVariant = currentQuestion['correctAnswer'];//answeredQuestion['correctAnswer'];
			handle(currentQuestion['_id'],correctVariant.toLowerCase());
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
							<span>Question ${_.getStep()[0]-1} of ${_.questionsLength}</span>
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
					<div class="answer-block" data-question-id="${currentQuestion['_id']}">${_.noteTpl(currentQuestion)}</div>
					${Model.isFinished() ? await _.explanationAnswer(currentQuestion) : ''}
				</div>
			</div>`;
		return tpl;
	},
	async passageQuestion(){
		const _ = this;
		/*<p class="test-text"><span>${question['title']}</span></p>
		* <p class="test-left-text">${_._$.currentQuestion['passageType'}</p>
		* */
		let tpl= `
			<div class="test-inner test-row">
				<div class="test-col">
					<div class="test-left">
						<p class="test-left-text">${_._$.currentQuestion['passageText']}</p>
					</div>
				</div>
				<div class="test-col">
					<div class="test-right" >
				`,
		cnt = 0;
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
				<ul class="answer-list" data-question-id="${question['_id']}" >
			`;
			for(let answer in question['answers']){
				let ans = question['answers'][answer];
				tpl+= await _.answerTpl(question,answer);
			}
			tpl+=`</ul>
				<div class="answer-block" data-question-id="${question['_id']}">${_.noteTpl(question)}</div>
				${Model.isFinished() ? await _.explanationAnswer(question) : ''}
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
					<span>Question ${_.getStep('arr')[0]-1} of ${Model.allQuestionsLength}</span>
					<strong style="font-size:10px;margin-left: 15px">${_._$.currentQuestion['questionId']}</strong>
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
			tpl+=await _.answerTpl(currentQuestion,answer)
			// active disabled
			;
		}
		tpl+=`
			</ul>
			<div class="answer-block" data-question-id="${currentQuestion['_id']}">${_.noteTpl(currentQuestion)}</div>
			${Model.isFinished() ? await _.explanationAnswer(currentQuestion) : ''}
		</div>`;
		return tpl;
	},
	/* Questions tpls */
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
	resultsAsideButtonsTpl(resultsInfo){
		const _ = this;
		let tpl = ``
		for (let i = 0; i < resultsInfo.length; i++) {
			let item = resultsInfo[i];
			tpl += `
				<li class="test-aside-item">
					<button data-pos="0" class="test-aside-btn ${ !i ? 'active' : ''}" data-id="${item._id}" data-click="${_.componentName}:changeTestResultsTab">
						<h6 class="test-aside-btn-title">${item.title}</h6>
						<span class="test-aside-btn-results">
							<span>${item.total}</span>`;
			for (let subItem of item.lessons) {
				tpl += `<span style="color: rgba(${subItem.color},1)">${subItem.value} ${_.getFirstLetters(subItem.title)}</span>`
			}
			tpl += `</span>
						<div class="test-aside-btn-date">
							<svg>
								<use xlink:href="#calendar"></use>
							</svg>
							<span>Monday, July 20</span>
						</div>
					</button>
				</li>
			`;
			}
		return tpl;
	},
	resultsTabBodyTpl(summary){
		const _ = this;
		let tpl = `
			<div class="test-tabs-body">
				<h5 class="block-title test-title">
					<span>${Model.test['testType']} ${Model.test['testNumber']} Score</span>
				</h5>
				<div class="test-results">
					<div class="total">
						<span>Total</span>
					<div class="total-value" id="test-result-total">${summary[0]['result']['score']+summary[1]['result']['score']}</div>
				</div>
				<div class="test-results-list">
		`;
		let cnt=0;
		for (let result of summary) {
			tpl += `
			<div class="test-results-item" style="background-color:rgba(${_.sectionColors[cnt]},.2);color:rgb(${_.sectionColors[cnt]})">
				<h6 class="test-results-item-title">${result['title']}</h6>
				<span class="test-results-item-value">${result['result']['score']}</span>
				<button class="test-results-item-button" style="background-color:rgb(${_.sectionColors[cnt]})" data-test-id="${Model.test['_id']}" data-click="${_.componentName}:changeSection" section="questions">Review this test</button>
			</div>
			`;
			cnt++;
		}
		tpl += `
				</div>
			</div>
			<button class="show-score">
				<span>Show Score Breakdown</span>
				<svg><use xlink:href="#select-arrow-bottom"></use></svg>
			</button>
			${_.showScore()}
		`;
		return tpl;
	},
	showScore(){
		const _ = this;
		return '';
	},
	
	testPickTpl(test){
		const _ = this;
		let status = "Start", section = 'welcome';
		if(Model.test['status'] == 'in progress'){
			status = "Continue";
			section = "directions";
		}
		if(Model.test['status'] == 'finished'){
			section = 'questions';
			status = "Review";
		}
		
		let tpl = `
			<h5 class="block-title test-title">
				<span>Start Practice Test </span>
			</h5>
			<p class="test-text">
				<span>After completing a section, you can stop or review</span>
			</p>
			<ul class="test-pick-list shsat " >
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
				<button class="button" data-test-id="${Model.test['_id']}" data-click="${_.componentName}:changeSection" section="${section}"><span>${status} this test</span></button>
			</li>
			</ul>
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
							<div id="testPickList">
								<img src="/img/loader.gif" alt="">
							</div>
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
									<button class="button"><span>Review this test</span></button>
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
		/*<div class="test-aside-btn-date">
						<svg><use xlink:href="#calendar"></use></svg><span>${_.createdAtFormat(test['createdAt'])}</span>
					</div>*/
		return `
			<li class="test-aside-item">
				<button data-pos="${i-1}" class="test-aside-btn ${i-1 == Model.currentTestPos ? 'active' : ''}" data-id="${test['_id']}" data-click="${_.componentName}:changePracticeTest">
					<h6 class="test-aside-btn-title">Practice test ${test['testNumber']}</h6><span class="test-aside-btn-desc">0 of ${test['sections'].length} sections complete</span>
					
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
	},
	
	confirmFinishTpl(){
		const _ = this;
		/*
		* 	_.lastSkippedQuestion= {
					'data-questionPage-id': _._$.currentQuestion['type'] == 'passage' ?_._$.currentQuestion['_id'] : -1,
					'data-question-id': _._$.currentQuestion['questions'][0]['_id']
				}
		*
		* */
		return `
			 <div class="modal modal-block finish" id="finish" slot="modal-item">
              <h6 class="modal-title"><span>Are you sure you want to finish this test</span></h6>
              <p class="modal-text">
                You have <span id="finish-minutes"></span> minutes left to work on the <span id="finish-questions-length"></span> questions you haven’t answered, and to double-check your other answers.
                You will not able to return later to answer more questions if you finish this test.
              </p>
              <div class="modal-row">
	              <button class="button" data-click="${_.componentName}:changeSection" section="score">Yes, I’m done with this test</button>
	              <button class="button-blue" data-click="modaler:closeModal;${_.componentName}:jumpToQuestion">
	               No, take me to my first skipped question
	              </button>
		
              </div>
            </div>
		`;
	}
}