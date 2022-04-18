import { G_Bus } from "../../libs/G_Control.js";
import  TestModel from "./TestModel.js";
import { _front } from "../../libs/_front.js";

class TestPage extends _front{
	constructor() {
		super();
		const _ = this;
	}
	async asyncDefine(){
		const _ = this;
		_.set({
			test: await _.model.getTest(),
		});
		_.set({
			currentQuestionId: _._$.test.questions[0].id,
		})
		_.set({
			currentQuestion: _._$.test.questions[0],
		})
	}
	async define(){
		const _ = this;
		G_Bus
			.on('changeSection',_.changeSection.bind(_))
			//.on('changeSection',_.render.bind(_))
			.on('setWrongAnswer',_.setWrongAnswer.bind(_))
			.on('setCorrectAnswer',_.setCorrectAnswer.bind(_))
			.on('changeQuestion',_.changeQuestion.bind(_))
			.on('jumpToQuestion',_.jumpToQuestion.bind(_))
			.on('setBookmark',_.setBookmark.bind(_))
			.on('setNote',_.setNote.bind(_))
		_.model = new TestModel();
		_.storageTest = _.model.getTestFromStorage();
		_.aplahabet = ['A','B','C','D','E',"F","G"];
		_.set({
			
			currentSection: 'welcome'
		});
		
		
	}
	get test(){
		const _ = this;
		return _._$.test;
	}
	
	
	fillCheckedAnswers(){
		const _ = this;
		let test = _.model.getTestFromStorage();
		for(let t in test){
			let currentTestObj = test[t],
			questionId= currentTestObj['id'];
			if(currentTestObj['bookmarked']) _.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.add('checked');
			if(currentTestObj['answer']) _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent = currentTestObj['answer'].toUpperCase();
			
		}
	}
	
	setBookmark({item,event}){
		const _ = this;
		let bookmarked = item.classList.contains('active');
		_.model.saveTestToStorage({
			id: _._$.currentQuestion['id'],
			bookmarked: !bookmarked
		});
		item.classList.toggle('active');
		_.f(`.questions-list .questions-item[data-question-id="${_._$.currentQuestion['id']}"]`).classList.toggle('checked');
	}
	async setNote({item:form,event}){
		const _ = this;
		let formData = await _.formDataCapture(form);
		_.model.saveTestToStorage({
			id: _._$.currentQuestion['id'],
			note: formData['text']
		})
	}
	async changeSection({item,event}){
		const _ = this;
		let section = item.getAttribute('section');
		_._$.currentSection = section;
		_.renderPart({part:'body',content: await _.flexible()});
		if(section == 'questions'){
			_.fillCheckedAnswers()
		}
	}
	jumpToQuestion({item,event}){
		const _ = this;
		let
			currentQuestionPos = _.model.currentPos(_._$.currentQuestion['id']),
			jumpQuestionPos = _.model.currentPos(item.parentNode.getAttribute('data-question-id'));
		if(currentQuestionPos == jumpQuestionPos) return;
		_._$.currentQuestion = _.test['questions'][jumpQuestionPos];
	}
	changeQuestion({ item, event }){
		const _ = this;
		let index = _.model.currentPos(_._$.currentQuestion['id']);
		if( index == _.test.questions.length-1){
			return void 0;
		}
		_._$.currentQuestion= _.test['questions'][index+1];
	}
	welcomeHeader(){
		const _ = this;
		return `
			<div class="section-header">
				<h1 class="title">${_.test['sections']['welcome'].headerTitle}</h1>
				<button class="button-white">
					<span>Don’t start this section now</span>
				</button>
			</div>
		`;
	}
	welcomeInner(){
		const _ = this;
		return `
			<h6 class="test-subtitle">
				<span>${_.test['sections']['welcome'].innerTitle}</span>
			</h6>
			<p class="test-text">
				${_.test['sections']['welcome'].innerDescription}
			</p>
		`;
	}
	
	async directionsHeader(){
		const _ = this;
		return new Promise( (resolve) =>{resolve(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${_._$.test.time}</span> minutes left</div>
					<button class="button-white"><span>Finish this section</span></button>
				</div>
			</div>
		`)});
	}
	async directionsCarcas(){
		const _ = this;
		return _.markup(`
			${await _.directionsHeader()}
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
						<button class="button-blue"  data-click="changeSection" section="questions">
							<span>Continue to first question</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	}

	
	welcomeCarcas(){
		const _ = this;
		return  _.markup(`
			<div class="section">
				${_.welcomeHeader()}
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${_.test['sections']['welcome'].innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						${_.welcomeInner()}
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="changeSection" section="directions">
							<span>Let’s go, start the timer!</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	}
	setWrongAnswer({item,event}){
		let answer = item.parentNode;
		if(answer.hasAttribute('disabled')){
			answer.removeAttribute('disabled')
		}else{
			answer.setAttribute('disabled',true);
		}
	}
	setCorrectAnswer({item,event}){
		const _ = this;
		console.log('here');
		let
			answer = item.parentNode,
			ul = answer.parentNode,
			answerVariant = item.querySelector('.answer-variant').textContent,
			questionId =  parseInt(answer.getAttribute('data-question-id'));
		if(ul.querySelector('.active')) ul.querySelector('.active').classList.remove('active');
		answer.classList.add('active');
		_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent =  answerVariant.toUpperCase();
		_.model.saveTestToStorage({
			id: questionId,
			answer: answerVariant
		});
		
	}
	explanationAnswer(){
		const _ = this;
		return `<div class="test-label-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="img/sprite.svg#lamp"></use>
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
	note(){
		const _ = this;
		return `<div class="test-label-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="img/sprite.svg#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${_.storageTest[_._$.currentQuestion['id'].note]}
					</p>
				</div>
				<button class="test-label-button" data-click="showTestLabelModal">
					<svg>
						<use xlink:href="img/sprite.svg#three-dots"></use>
					</svg>
				</button>
				<div class="test-label-modal">
					<button class="test-label-modal-button"><span>Edit</span></button>
					<button class="test-label-modal-button"><span>Delete</span></button>
				</div>
			</div>`;
	}
	standartQuestion(){
		const _ = this;
		let tpl = `
			<p class="test-text">
				${_._$.currentQuestion['title']}
			</p>
			<p class="test-text">
				${_._$.currentQuestion['description']}
			</p>
			<ul class="answer-list">
		`;
		for(let answer in  _._$.currentQuestion['answers']){
			tpl+=
			// active disabled
			`<li class="answer-item " data-question-id="${_._$.currentQuestion['id']}">
				<button class="answer-button" data-click="setCorrectAnswer">
					<span class="answer-variant">${answer}</span>
					<span class="answer-value">${_._$.currentQuestion['answers'][answer]}</span>
				</button>
				<button class="answer-wrong" data-click="setWrongAnswer">
					<svg>
						<use xlink:href="img/sprite.svg#dismiss-circle"></use>
					</svg>
				</button>
			</li>`;
		}
		tpl+=`
			</ul>
			${ _.storageTest[_._$.currentQuestion['id']] ? (_.storageTest[_._$.currentQuestion['id']].note ? _.note() : ''): ''}
		`;
		return tpl;
	}
	questionsList(){
		const _ = this;
		let tpl =  `
			<div class="col narrow">
				<div class="block questions">
				<h5 class="block-title small"><span>Questions</span></h5>
				<div class="questions-cont">
					<h6 class="questions-list-title"><span>Question 1 - ${_.test.questions.length}</span></h6>
					<ul class="questions-list">
	`;
		let cnt = 1;
		for(let question of _.test.questions){
			tpl+=`
				<li class="questions-item" data-question-id="${question.id}">
					<span class="questions-number">${cnt++}</span>
					<button class="questions-variant" data-click="jumpToQuestion"></button>
					<div class="questions-bookmark">
						<svg>
							<use xlink:href="img/sprite.svg#bookmark-transparent"></use>
						</svg>
						<svg>
							<use xlink:href="img/sprite.svg#bookmark"></use>
						</svg>
					</div>
				</li>
			`;
		}
		tpl+=`
			</ul>
			<button class="questions-button">
				<svg>
					<use xlink:href="img/sprite.svg#arrow-bottom"></use>
				</svg>
				<span>Scroll for more</span>
				<svg>
					<use xlink:href="img/sprite.svg#arrow-bottom"></use>
				</svg>
			</button>
			</div>
			</div>
			</div>
		`;
		return tpl;
	}
	async questionsCarcass(){
		const _ = this;
		return  _.markup(`
	   ${await _.directionsHeader()}
     <div class="section row">
        <div class="col wide">
          <div class="block test-block">
            <div class="test-header">
              <h5 class="block-title test-title">
                <span>Question 1 of ${_.test.questions.length}</span>
              </h5>
              <button class="test-header-button bookmarked-button" data-click="setBookmark">
                <svg>
                  <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                </svg>
                <svg>
                  <use xlink:href="img/sprite.svg#bookmark"></use>
                </svg>
                <span>Bookmark</span>
              </button>
              <button class="test-header-button active" data-click="showForm" data-id="note">
                <svg>
                  <use xlink:href="img/sprite.svg#edit-transparent"></use>
                </svg>
                <svg>
                  <use xlink:href="img/sprite.svg#edit"></use>
                </svg><span>Note</span>
              </button>
              <button class="test-header-button" data-click="showForm" data-id="report">
                <svg>
                  <use xlink:href="img/sprite.svg#error-circle"></use>
                </svg><span>Report</span>
              </button>
            </div>
            <div class="test-inner middle">
              ${_.standartQuestion()}
            </div>
            <div class="test-footer">
              <button class="test-footer-button" data-click="changeSection" section="directions">
                <span>Directions</span>
              </button>
              <button class="button" data-click="changeQuestion">
                <span>Skip to questions <b class="skip-to-question">2</b></span>
              </button>
            </div>
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
            <button class="button" type="button" data-click="closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Submit Issue</span></button>
          </div>
        </form>
        <form class="modal note" slot="modal-item" id="note" data-submit="setNote">
          <h6 class="modal-title"><span>Note</span></h6>
          <textarea class="modal-area" name="text"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Save</span></button>
          </div>
        </form>
      </div>
		`,false);
	}
	flexible(){
		const _ = this;
		if(_._$.currentSection == 'welcome'){
			return _.welcomeCarcas()
		}
		if(_._$.currentSection == 'directions'){
			return _.directionsCarcas()
		}
		if(_._$.currentSection == 'questions'){
			return _.questionsCarcass();
		}
	}
	async init(){
		const _ = this;
		_._( ()=>{
			let cont = _.f('.test-inner.middle');
			if(!cont) return;
			_.clear(cont);
			let questionTpl = _.standartQuestion();
		
			cont.append(
				_.markup(questionTpl)
			);
			_.f('.bookmarked-button').classList.remove('active')
			let currentTest = _.storageTest[_._$.currentQuestion['id']];
			if(currentTest){
				if(currentTest['bookmarked']){
					_.f('.bookmarked-button').classList.add('active')
				}
			}
			let nextQuestionPos = _.model.currentPos(_._$.currentQuestion['id'])+2;
			_.f('.skip-to-question').textContent = nextQuestionPos;
		},['currentQuestion']);
	}
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPartsPage([
			{part:'header', content:_.markup(_.header.render(),false)},
			{part:'body', content: await _.flexible()}
		]);
	}
}
export { TestPage }