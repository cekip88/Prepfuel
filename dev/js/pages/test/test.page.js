import { G_Bus }      from "../../libs/G_Control.js";
import { TestModel }  from "./TestModel.js";
import { G }          from "../../libs/G.js";
import Modaler        from "../../components/modaler/modaler.component.js";

class TestPage extends G{
	constructor() {
		super();
		const _ = this;
	}
	async asyncDefine(){
		const _ = this;
		let tests =	await TestModel.getTests(),
			currentTest = tests['tests'],
			currentTestId = currentTest[0]['_id'];
		_.set({
			test: await TestModel.getTest(currentTestId),
		});
		console.log(_._$.test)
		_.set({
			currentQuestion: TestModel.firstQuestion,
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
		//TestModel = new TestModel();
		_.storageTest = TestModel.getTestFromStorage();
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
		_.storageTest = TestModel.getTestFromStorage();
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
		TestModel.start();
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
		TestModel.saveTestToStorage({
			id: questionId,
			note: null
		});
		item.parentNode.parentNode.remove();
		_.f('.note-button').classList.remove('active');
	}
	/* Work with note end */
	fillCheckedAnswers(){
		const _ = this;
		let test = TestModel.getTestFromStorage();
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
	
	saveBookmark({item}){
		const _ = this;
		let questionId = parseInt(item.getAttribute('data-question-id'));
		let bookmarked = item.classList.contains('active');
		TestModel.saveTestToStorage({
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
		TestModel.saveTestToStorage({
			id: _.innerQuestionId,
			note: formData['text']
		});
		G_Bus.trigger(_.componentName,'updateStorageTest')
		let question = TestModel.innerQuestion(_.innerQuestionId);
	
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
			TestModel.start();
		}
		_._$.currentSection = section;
		_.renderPart({part:'body',content: await _.flexible(section)});
		if(section == 'questions'){
			_.fillCheckedAnswers();
			
			TestModel.getTestResults();
		}
	}
	changeQuestion({ item, event }){
		const _ = this;
		let dir = item.getAttribute('data-dir');
		let index = _.currentPos;
		
		if(dir == 'prev'){
			if( index == 0){
				return void 0;
			}
			_.currentPos-=1;
			_._$.currentQuestion= _.questionsPages[index-1];
		}else{
			if( index == _.questionsPages.length-1){
				TestModel.finishTest();
				return void 0;
			}
			_.saveAnswerToDB();
			_.currentPos+=1;
			_._$.currentQuestion= _.questionsPages[index+1];
		}

	}
	jumpToQuestion({item,event}){
		const _ = this;
		let
			currentQuestionPos = _.currentPos,
			jumpQuestionPos = TestModel.currentPos(item.parentNode.getAttribute('data-question-id'));
		if(currentQuestionPos == jumpQuestionPos) return void 0;
		_.currentPos = jumpQuestionPos;
		_._$.currentQuestion = _.test['sections']['questionPages'][jumpQuestionPos];
	}
	saveAnswerToDB(){
		const _ = this;
		_.currentQuestion = TestModel.innerQuestion(_.questionPos);
		_.currentPage = TestModel.currentPage(_.currentPos);
		let handle = (answer)=>{
			TestModel.saveAnswer({
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
					if(!answer){
						let bookmarkedButton = _.f(`.bookmarked-button[data-question-id="${quest['id']}"]`);
						_.saveBookmark({
							item: bookmarkedButton
						});
						continue;
					}
					handle(answer);
				}
			}else{
				let answer = _.storageTest[_.currentQuestion['id']];
				if(answer){
					// if user choosed answer save it to db
					handle(answer);
				}else{
					// else set bookmarked this answer
					_.saveBookmark({
						item: _.f('.bookmarked-button')
					});


				}
			}
		}
		
	}

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
				TestModel.saveTestToStorage({
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
		TestModel.saveTestToStorage(obj);
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
		TestModel.saveTestToStorage({
			id: questionId,
			answer: answerVariant
		});
		_.changeSkipButtonToNext();
		G_Bus.trigger(_.componentName,'updateStorageTest')
	}

	changeSkipButtonToNext(){
		const _ = this;
		_.f('.skip-to-question-title').textContent = 'Next to question';
		let btn = _.f('.skip-to-question-button');
		btn.className= 'skip-to-question-button button-blue';
		btn.setAttribute('data-click',`${this.componentName}:changeQuestion`);
	}
	changeNextButtonToSkip(pos){
		const _ = this;
		_.f('.skip-to-question-title').textContent = `Skip to questions ${pos}`;
		let btn = _.f('.skip-to-question-button');
		btn.className= 'button skip-to-question-button';
		btn.setAttribute('data-click',`${this.componentName}:changeQuestion`);
	}
	changeSkipButtonToFinish(pos){
		const _ = this;
		_.f('.skip-to-question-title').textContent = 'Finish this section';
		_.f('.skip-to-question').textContent = '';
		let btn = _.f('.skip-to-question-button');
		btn.classList.add('button-blue');
		btn.setAttribute('data-click',`${this.componentName}:changeSection`);
		btn.setAttribute('section',`score`);
	}

	addBackToQuestionBtn(pos){
		const _ = this;
		_.f('.test-footer .dir-button').after(
			_.markup(`
				<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="prev">
					<span>Back to question ${pos}</span>
				</button>`
			)
		)
	}
	removeBackToQuestionBtn(){
		const _ = this;
		if(_.f('.back-to-question-button')){
			_.f('.back-to-question-button').remove();
		}
	}

	fillAnswer(){
		const _ = this
		if(_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`)){
			_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`).classList.add('active');
		}
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
			_.questionPos = TestModel.questionPos(_.currentPos);
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
				_.changeSkipButtonToFinish();
			}
			if(_.currentPos > 0){
				_.removeBackToQuestionBtn();
				_.addBackToQuestionBtn(_.questionPos-1);
			}

			G_Bus.trigger(_.componentName,'updateStorageTest'); // update test info in storage
			_.currentQuestion = TestModel.innerQuestion(_.questionPos);


			// work on marked answers

			let currentStorageTest = _.storageTest[_.currentQuestion['id']];
			if(currentStorageTest){
				if(currentStorageTest['answer']){
					// mark choosed answer
					_.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['id']}"][data-variant="${currentStorageTest['answer']}"]`).classList.add('active');
					_.changeSkipButtonToNext();
				}
				if(currentStorageTest['disabledAnswers']){
					// mark disabled answer
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