import { G_Bus } from "../../libs/G_Control.js";
import  TestModel from "./TestModel.js";
import { G } from "../../libs/G.js";
import Modaler from "../../components/modaler/modaler.component.js";
class TestPage extends G{
	constructor() {
		super();
		const _ = this;
	}
	async asyncDefine(){
		const _ = this;
		let tests =	await _.model.getTests(),
			currentTest = tests['tests'],
			currentTestId = currentTest[0]['_id'];
		_.set({
			test: await _.model.getTest(currentTestId),
		});
		_.set({
			currentQuestion: _.model.firstQuestion,
		})
	}
	async define(){
		const _ = this;
		_.componentName = 'TestPage';
		G_Bus
			.on(_,'showResults')
			.on(_,'showSummary')
			.on(_,'changeSection')
			.on(_,'setWrongAnswer')
			.on(_,'setCorrectAnswer')
			.on(_,'changeQuestion')
			.on(_,'jumpToQuestion')
			.on(_,'saveBookmark')
			.on(_,'saveNote')
			.on(_,'changeInnerQuestionId')
			.on(_,'showForm')
			.on(_,'deleteNote')
			.on(_,'editNote')
			.on(_,'showTestLabelModal')
			.on(_,'startTimer')
			.on(_,'updateStorageTest')
		_.model = new TestModel();
		_.storageTest = _.model.getTestFromStorage();
		_.types = {
			1:'standart',
			2:'graphic',
			3:'passage',
			4:'compare',
			5:'grid'
		};
		_.questionPos = 1;
		_.currentPos = 0;
		_.innerQuestionId = 1;
		_.set({
			currentSection: 'welcome'
		});
	}
	get test(){
		return this._$.test;
	}
	get questionsPages(){
		return this.test['sections']['questionPages'];
	}
	get questionsLength(){
		const _ = this;
		let outPos = 0;
		for(let i=0;i < _.test['sections']['questionPages'].length;i++){
			outPos+= _.test['sections']['questionPages'][i]['questions'].length;
		}
		return outPos;
	}
	
	showResults(data){
		console.log(data);
	}
	showSummary(data){
		console.log(data);
	}
	
	updateStorageTest(){
		const _ = this;
		_.storageTest = _.model.getTestFromStorage();
	}
	
	showTestLabelModal(clickData){
		let btn = clickData.item,
			target = btn.nextElementSibling;
		target.classList.toggle('active')
	}
	showForm(clickData){
		let btn = clickData.item,
		id = btn.getAttribute('data-id');
		this.f(`#${id}`).reset();
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: `#${id}`
		});
	}
	startTimer({item}){
		const _ = this;
		_.model.start();
	}
	/* Work with note */
	editNote({item}){
		const _ = this;
		let questionId= parseInt(item.getAttribute('data-question-id'));
		let note = _.storageTest[questionId]['note'];
		
		G_Bus.trigger('modaler','showModal',{
			type:'html',
			target:'#note'
		});
		_.f('#note textarea').value = note;
	}
	deleteNote({item}){
		const _ = this;
		let questionId= parseInt(item.getAttribute('data-question-id'));
		delete _.storageTest[questionId]['note'];
		_.model.saveTestToStorage({
			id: questionId,
			note: null
		});
		item.parentNode.parentNode.remove();
		_.f('.note-button').classList.remove('active');
	}
	/* Work with note end */
	fillCheckedAnswers(){
		const _ = this;
		let test = _.model.getTestFromStorage();
		for(let t in test){
			let currentTestObj = test[t],
			questionId= currentTestObj['id'];
			if(currentTestObj['bookmarked']) {
				_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.add('checked');
			}
			if(currentTestObj['answer']) {
				_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent = currentTestObj['answer'].toUpperCase();
			}
		}
		
		_.setActions()
		_.setActions('note')
	}
	
	saveBookmark({item,event}){
		const _ = this;
		let questionId = parseInt(item.getAttribute('data-question-id'));
		let bookmarked = item.classList.contains('active');
		_.model.saveTestToStorage({
			id: questionId,
			bookmarked: !bookmarked
		});
		item.classList.toggle('active');
		_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.toggle('checked');
	}
	async saveNote({item:form,event}){
		const _ = this;
		event.preventDefault();
		let formData = await _.formDataCapture(form);
		_.model.saveTestToStorage({
			id: _.innerQuestionId,
			note: formData['text']
		});
		G_Bus.trigger(_.componentName,'updateStorageTest')
		let question = _.model.innerQuestion(_.innerQuestionId);
	
		// Add note after answer list
		let answerList = _.f(`.answer-list[data-question-id="${question['id']}"]`);
		if(answerList.nextElementSibling) {
			if(answerList.nextElementSibling.classList.contains('note-block')){
				answerList.nextElementSibling.remove();
			}
		}
		answerList.after(_.markup(_.noteTpl(question)));
		G_Bus.trigger('modaler','closeModal');
		// Show active note button
		_.f(`.note-button[data-question-id="${question['id']}"]`).classList.add('active');
		// Нижнего переднего рычага задний сайлентблоки
	}
	
	setActions(type='bookmarked'){
		const _ = this;
		let handle = (currentTest)=>{
			if(currentTest) {
				if(currentTest[type]) {
					_.f(`.${type}-button[data-question-id="${currentTest['id']}"]`).classList.add('active')
				}
			}
		};
		if(_._$.currentQuestion.questions.length > 2){
			for(let q of _._$.currentQuestion.questions) {
				handle(_.storageTest[q['id']]);
			}
		}
		let currentTest = _.storageTest[_._$.currentQuestion['questions'][0]['id']];
		handle(currentTest);
	}
	changeInnerQuestionId({item}){
		const _ = this;
		_.innerQuestionId = parseInt(item.getAttribute('data-question-id'));
	}
	async changeSection({item,event}){
		const _ = this;
		let section = item.getAttribute('section');
		if(section == 'directions') {
			_.model.start();
		}
		_._$.currentSection = section;
		_.renderPart({part:'body',content: await _.flexible(section)});
		if(section == 'questions'){
			_.fillCheckedAnswers();
			
			_.model.getTestResults();
		}
	}
	
	jumpToQuestion({item,event}){
		const _ = this;
		let
			currentQuestionPos = _.currentPos,
			jumpQuestionPos = _.model.currentPos(item.parentNode.getAttribute('data-question-id'));
		if(currentQuestionPos == jumpQuestionPos) return void 0;
		_.currentPos = jumpQuestionPos;
		_._$.currentQuestion = _.test['sections']['questionPages'][jumpQuestionPos];
	}
	saveAnswerToDB(){
		const _ = this;
		_.currentQuestion = _.model.innerQuestion(_.questionPos);
		_.currentPage = _.model.currentPage(_.currentPos);
		let handle = (answer)=>{
			_.model.saveAnswer({
				answer:{
					questionPageId: _.currentPage['pageId'],
					questionId: answer['id'],
					answer: answer['answer'],
					disabledAnswers: answer['disabledAnswers'],
					note: answer['note']
				}
			})
		}
		if(parseInt(_.currentPage['type']) !== 5){
			if(_.currentPage['questions'].length > 1){
				for(let quest of _.currentPage['questions']){
					let answer = _.storageTest[quest['id']];
					if(!answer) continue;
					handle(answer)
				}
			}else{
				let answer = _.storageTest[_.currentQuestion['id']];
				handle(answer);
			}
		}
		
	}
	changeQuestion({ item, event }){
		const _ = this;
		let dir = item.getAttribute('data-dir');
		let index = _.currentPos;
	
		_.saveAnswerToDB();
		if(dir == 'prev'){
			if( index == 0){
				return void 0;
			}
			_.currentPos-=1;
			_._$.currentQuestion= _.questionsPages[index-1];
		}else{
			if( index == _.questionsPages.length-1){
				return void 0;
			}
			_.currentPos+=1;
			_._$.currentQuestion= _.questionsPages[index+1];
		}
		
	}
	
	questionHeader(){
		const _ = this;
		return new Promise( (resolve) =>{resolve(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">Practice Test - Section Name</h1>
					<div class="test-timer"><span class="test-timer-value">${_.test.time}</span> minutes left</div>
					<button class="button-white" data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
				</div>
			</div>
	`)});
	}
	questionFooter(){
		return `
		<div class="test-footer">
			<button class="test-footer-button dir-button" data-click="${this.componentName}:changeSection" section="directions">
				<span>Directions</span>
			</button>
			<button class="button skip-to-question-button" data-click="${this.componentName}:changeQuestion">
				<span><em class="skip-to-question-title">Skip to questions</em> <b class="skip-to-question">2</b></span>
			</button>
		</div>`;
	}
	
	
 /* Cacrass templates*/
	async directionsCarcass(){
		const _ = this;
		return _.markup(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${_.test.time}</span> minutes left</div>
					<button class="button-white"  data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
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
						<h6 class="test-subtitle"><span>${_.test['sections']['directions'].innerTitle}</span></h6>
						<p class="test-text">
							${_.test['sections']['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue"  data-click="${this.componentName}:changeSection" section="questions">
							<span>Continue to first question</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	}
	welcomeCarcass(){
		const _ = this;
		return  _.markup(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['welcome'].headerTitle}</h1>
					<button class="button-white">
						<span>Don’t start this section now</span>
					</button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${_.test['sections']['welcome'].innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle">
							<span>${_.test['sections']['welcome'].innerTitle}</span>
						</h6>
						<p class="test-text">
							${_.test['sections']['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="${this.componentName}:changeSection" section="directions">
							<span>Let’s go, start the timer!</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	}
	async questionsCarcass(){
		const _ = this;
		return  _.markup(`
	   ${await _.questionHeader()}
     <div class="section row">
        <div class="col wide">
          <div class="block test-block tt-ii">
              ${_.getQuestionTpl()}
              ${_.questionFooter()}
          </div>
        </div>
        ${_.questionsList()}
      </div>
     <div hidden>
        <form class="modal report" slot="modal-item" id="report">
          <h6 class="modal-title"><span>Report a mistake in this question</span></h6>
          <p class="modal-text">Remember to read through the explanations and double check your answer. Thanks for your help!</p>
          <p class="modal-text">What’s wrong</p>
          <div class="check-list">
            <div class="check-item">
              <input type="radio" name="report" id="report-wrong">
              <label class="check-label" for="report-wrong"><span class="check-label-icon radio"></span><span class="check-label-text">The answer is wrong.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-typo">
              <label class="check-label" for="report-typo"><span class="check-label-icon radio"></span><span class="check-label-text">I caught a typo.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-confusing">
              <label class="check-label" for="report-confusing"><span class="check-label-icon radio"></span><span class="check-label-text">The question or explanations are confusing or unclear.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-broken">
              <label class="check-label" for="report-broken"><span class="check-label-icon radio"></span><span class="check-label-text">Something isn’t working / something seems broken.</span></label>
            </div>
          </div>
          <h6 class="modal-title"><span>Description of issue</span></h6>
          <textarea class="modal-area"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Submit Issue</span></button>
          </div>
        </form>
        <form class="modal note"  slot="modal-item" id="note" data-submit="${this.componentName}:saveNote">
          <h6 class="modal-title"><span>Note</span></h6>
          <textarea class="modal-area" name="text"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Save</span></button>
          </div>
        </form>
      </div>
		`,false);
	}
	async scoreCarcass(){
		const _ = this;
		let response = await _.model.getTestSummary();
		return  _.markup(`
			<div class="section">
				<div class="section-header">
					<h2 class="title">Practice Test Score - Section Name</h2>
					<button class="button-white">
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
							<span>You finished ${_.test['title']}</span>
						</h5>
						<p class="test-text">
							Description text about rules at the real test - if there will be break or not etc.
						</p>
					<div class="test-result">
						<div class="test-result-block violet">
							<h6 class="test-result-title"><span>Questions Answered</span></h6>
							<p class="test-result-score">${response['summary']['questionsAnswered']}</p>
						</div>
						<div class="test-result-block turquoise">
							<h6 class="test-result-title"><span>Questions Correct</span></h6>
							<p class="test-result-score">${response['summary']['questionsCorrect']}</p>
						</div>
						<div class="test-result-block gray">
							<h6 class="test-result-title"><span>Not answered</span></h6>
							<p class="test-result-score">${response['summary']['questionsNotAnswered']}</p>
						</div>
						<div class="test-result-block green">
							<h6 class="test-result-title"><span>Score</span></h6>
							<p class="test-result-score">${response['summary']['totalScore']}</p>
						</div>
						<div class="test-result-block blue">
							<h6 class="test-result-title"><span>Stars for section of the Test</span></h6>
						<p class="test-result-score">+150</p>
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
					<div class="test-footer"><a class="test-footer-back" href="./test-review-correct.html"><span>Review this section</span></a>
					<button class="button-blue"><span>Start the next section: Quantitative Reasoning</span></button>
					</div>
				</div>
			</div>
		`,false);
	}
	/* Cacrass templates*/

	setWrongAnswer({item,event}){
		const _ = this;
		let
			answer = item.parentNode,
			questionId =  parseInt(answer.getAttribute('data-question-id')),
			currentTest = _.storageTest[questionId],
			variant = answer.getAttribute('data-variant'),
			obj  = {
				id: questionId
			};
		if(answer.hasAttribute('disabled')){
			answer.removeAttribute('disabled');
			if(currentTest['disabledAnswers']){
				console.log(currentTest['disabledAnswers'].indexOf(variant));
				currentTest['disabledAnswers'].splice(currentTest['disabledAnswers'].indexOf(variant),1);
				G_Bus.trigger(_.componentName,'updateStorageTest')
			}
		}else{
			if(answer.classList.contains('active')){
				_.model.saveTestToStorage({
					id: questionId,
					answer: null
				});
				answer.classList.remove('active');
				G_Bus.trigger(_.componentName,'updateStorageTest')
			}
			
			if(!currentTest){
				obj['disabledAnswers'] = [];
			}else{
				if(!currentTest['disabledAnswers']){
					obj['disabledAnswers'] = [];
				}else{
					obj['disabledAnswers'] = currentTest['disabledAnswers'];
				}
			}
			if(obj['disabledAnswers'].indexOf(variant) < 0) obj['disabledAnswers'].push(variant)
			answer.setAttribute('disabled',true);
		}
		_.model.saveTestToStorage(obj);
		G_Bus.trigger(_.componentName,'updateStorageTest')
	}
	setCorrectAnswer({item,event}){
		const _ = this;
		let
			answer = item.parentNode,
			ul = answer.parentNode,
			answerVariant = item.querySelector('.answer-variant').textContent,
			questionId =  parseInt(answer.getAttribute('data-question-id'));
		if(answer.hasAttribute('disabled')) return;
		if(ul.querySelector('.active')) ul.querySelector('.active').classList.remove('active');
		answer.classList.add('active');
		_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent =  answerVariant.toUpperCase();
		_.model.saveTestToStorage({
			id: questionId,
			answer: answerVariant
		});
		_.f('.skip-to-question-title').textContent = 'Next to question';
		_.f('.skip-to-question-button').className= 'skip-to-question-button button-blue';
		G_Bus.trigger(_.componentName,'updateStorageTest')
	}
	
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
	}
	
	noteTpl(question){
		const _ = this;
		let tpl = ``;
		if(!_.storageTest[question['id']]) return tpl;
		if(_.storageTest[question['id']].note) {
		  tpl = `<div class="test-label-block note-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${_.storageTest[question['id']].note}
					</p>
				</div>
				<button class="test-label-button" data-click="${this.componentName}:showTestLabelModal">
					<svg>
						<use xlink:href="#three-dots"></use>
					</svg>
				</button>
				<div class="test-label-modal">
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote" data-question-id="${question['id']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote" data-question-id="${question['id']}"><span>Delete</span></button>
				</div>
			</div>`;
		}
		return tpl;
	}
	answerTpl(question,answer){
		return `
			<li class="answer-item" data-question-id="${question['id']}" data-variant="${answer}">
				<button class="answer-button" data-click="${this.componentName}:setCorrectAnswer">
					<span class="answer-variant">${answer}</span>
					<span class="answer-value">${question['answers'][answer]}</span>
				</button>
				<button class="answer-wrong" data-click="${this.componentName}:setWrongAnswer">
					<svg>
						<use xlink:href="#dismiss-circle"></use>
					</svg>
				</button>
			</li>`
	}
	actionsTpl(question){
		return `
			<button class="test-header-button bookmarked-button" data-click="${this.componentName}:saveBookmark" data-question-id="${question['id']}">
				<svg>
					<use xlink:href="#bookmark-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#bookmark"></use>
				</svg>
				<span>Bookmark</span>
			</button>
			<button class="test-header-button note-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['id']}" data-id="note">
				<svg>
					<use xlink:href="#edit-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#edit"></use>
				</svg>
				<span>Note</span>
			</button>
			<button class="test-header-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['id']}" data-id="report">
				<svg>
					<use xlink:href="#error-circle"></use>
				</svg><span>Report</span>
			</button>
		`;
	}
	
	
	/* Questions tpls */
	gridDigitButtons(){
		const _ = this;
		let tpl = ``;
		for(let i=0; i < 10; i++){
			tpl+=`<button class="grid-button">${i}</button>`;
		}
		return tpl;
	}
	gridQuestion(){
		const _ = this;
		let currentQuestion = _._$.currentQuestion['questions'][0];
		let tpl =  `
			<div class="test-header">
				<h5 class="block-title test-title"><span>Question ${_.questionPos} of ${_.questionsLength}</span></h5>
				${_.actionsTpl(_._$.currentQuestion['questions'][0])}
			</div>
			<div class="test-inner test-row">
				<div class="test-col wide">
					`;
			for(let fileLink of _._$.currentQuestion['files']){
				tpl+=`<img src="${fileLink}" alt="">`;
			}
			tpl+=`
					<p class="test-text">
						<span>${currentQuestion['mathFormula']}</span>
					</p>
					<p class="test-text">
						<span>${currentQuestion['questionText']}</span>
					</p>
					<br><br>
			</div>
				<div class="test-col narrow grid">
			<div class="grid-row">
				<input class="grid-input" type="text" disabled="">
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
	}
	compareQuestion(){
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
					<ul class="answer-list" data-question-id="${currentQuestion['id']}">`;
				for(let answer in  currentQuestion['answers']){
					tpl+=_.answerTpl(currentQuestion,answer);
				}
			tpl+=`</ul>
			${_.noteTpl(currentQuestion)}
			</div>
		`;
		return tpl;
	}
	graphicQuestion(){
		const _ = this;
		let
			currentQuestion = _._$.currentQuestion['questions'][0],
			tpl= `
				<div class="test-row test-inner">
					<div class="test-col">
						<div class="test-left">
			`;
			for(let fileLink of _._$.currentQuestion['files']){
				tpl+=`<img src="${fileLink}" alt="">`;
			}
			tpl+=`</div>
				</div>
				<div class="test-col">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Question ${_.questionPos} of ${_.questionsLength}</span>
						</h5>
						${_.actionsTpl(currentQuestion)}
					</div>
					<p class="test-text"><span>${currentQuestion['mathFormula']}</span></p>
					<p class="test-text"><span>${currentQuestion['questionText']}</span></p>
					<ul class="answer-list" data-question-id="${currentQuestion['id']}">
				`;
			for(let answer in  currentQuestion['answers']){
					tpl+=_.answerTpl(currentQuestion,answer);
				}
			tpl+=`
					</ul>
					${_.noteTpl(currentQuestion)}
				</div>
			</div>`;
		return tpl;
	}
	passageQuestion(){
		const _ = this;
		let tpl= `
			<div class="test-inner test-row">
				<div class="test-col">
					<div class="test-left">
						<p class="test-left-text">${_._$.currentQuestion['title']}</p>
						<p class="test-left-text">${_._$.currentQuestion['textPassage']}</p>
					</div>
				</div>
				<div class="test-col">
					<div class="test-right">
						<p class="test-text">${_._$.currentQuestion['description']}</p>
				`;
			let cnt = 0;
			for(let question of _._$.currentQuestion['questions']){
				tpl+= `
					<div class="test-sec">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Question ${_.model.questionPos(_.currentPos)+cnt++} of 40</span></h5>
						${_.actionsTpl(question)}
					</div>
					<p class="test-text"><span>${question['questionText']}</span></p>
					<ul class="answer-list" data-question-id="${question['id']}">`;
					for(let answer in question['answers']){
						let ans = question['answers'][answer];
						tpl+=_.answerTpl(question,answer);
					}
				tpl+=`</ul>${_.noteTpl(question)}</div>`;
			}
		tpl+=`</div>
				</div>
			</div>`;
		return tpl;
	}
	standartQuestion(){
		const _ = this;
		let currentQuestion = _._$.currentQuestion['questions'][0];
		let tpl = `
			<div class="test-header">
				<h5 class="block-title test-title">
					<span>Question ${_.questionPos} of ${_.questionsLength}</span>
				</h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner middle">
				<p class="test-text">
					${currentQuestion['mathFormula']}
				</p>
				<p class="test-text">
					${currentQuestion['questionText']}
				</p>
			<ul class="answer-list" data-question-id="${currentQuestion['id']}">
		`;
		for(let answer in  currentQuestion['answers']){
			tpl+=_.answerTpl(currentQuestion,answer)
			// active disabled
			;
		}
		tpl+=`
			</ul>
			${_.noteTpl(currentQuestion)}
		</div>`;
		return tpl;
	}
	/* Questions tpls */

	fillAnswer(){
		const _ = this
		if(_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`)){
			_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`).classList.add('active');
		}
	}
	
	questionsList(){
		const _ = this;
		let tpl =  `
			<div class="col narrow">
				<div class="block questions">
				<h5 class="block-title small"><span>Questions</span></h5>
				<div class="questions-cont">
					<h6 class="questions-list-title"><span>Question 1 - ${_.questionsLength}</span></h6>
					<ul class="questions-list">
		`;
		let cnt = 1;
		for(let questionPage of _.questionsPages){
			for(let question of questionPage['questions']){
				tpl+=`
					<li class="questions-item" data-question-id="${question.id}">
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
		tpl+=`
			</ul>
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
	}
	
	getQuestionTpl(){
		const _ = this;
		return _[`${_.types[_._$.currentQuestion['type']]}Question`]();
	}
	flexible(section){
		const _ = this;
		// welcome | directions | questions
		return _[`${section}Carcass`]();
	}
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPartsPage([
			{ part:'header', content:_.markup(_.header.render(),false)},
			{ part:'body', content: await _.flexible('welcome')}
		]);
	}
	async init(){
		const _ = this;
		_._( ()=>{
			let cont = _.f('.tt-ii');
			if(!cont) return;
			_.clear(cont);
			_.questionPos = _.model.questionPos(_.currentPos);
			cont.append(
				_.markup(_.getQuestionTpl()),
				_.markup(_.questionFooter())
			);
			_.setActions();
			_.setActions('note');
			let step = 1,
					len = _.test['sections']['questionPages'][_.currentPos]['questions'].length;
			
			if( len > 1 ){
				step= len;
			}
			
			if(_.questionPos < _.questionsLength){
				_.f('.skip-to-question').textContent = _.questionPos+step;
			}
			if(_.questionPos == _.questionsLength){
				_.f('.skip-to-question-title').textContent = 'Finish this section';
				_.f('.skip-to-question').textContent = '';
				_.f('.skip-to-question-button').classList.add('button-blue');
			}
			if(_.currentPos > 0){
				if(_.f('.back-to-question-button')){
					_.f('.back-to-question-button').remove();
				}
				_.f('.test-footer .dir-button').after(
					_.markup(`<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="prev"><span>Back to question ${_.questionPos-1}</span></button>`)
				)
			}
			G_Bus.trigger(_.componentName,'updateStorageTest');
			_.currentQuestion = _.model.innerQuestion(_.questionPos);
			let currentStorageTest = _.storageTest[_.currentQuestion['id']];
			if(currentStorageTest){
				if(currentStorageTest['answer']){
					_.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['id']}"][data-variant="${currentStorageTest['answer']}"]`).classList.add('active');
				}
				if(currentStorageTest['disabledAnswers']){
					for(let dis of currentStorageTest['disabledAnswers']){
						let item = _.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['id']}"][data-variant="${dis}"]`);
						item.classList.remove('active');
						item.setAttribute('disabled', 'disabled');
					}
				}
			}
			
		
			
		},['currentQuestion']);
		
	}
	
}
export { TestPage }