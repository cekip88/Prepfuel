import { G_Bus }    from "../../../../libs/G_Control.js";
import { G }        from "../../../../libs/G.js";
import { Model }    from "./model.js";
import Modaler        from "../../../../components/modaler/modaler.component.js";
import GInput         from "../../../../components/input/input.component.js";
import {StudentPage} from "../../student.page.js";
export class TestsModule extends StudentPage{
	constructor() {
		super();
		const _ = this;
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs': 'studentTabs',
			'body':'testsBody',
		};
	}
	async asyncDefine(){
		const _ = this;
		await Model.getTests(); // requests all user tests
		_.currentQuestion = Model.firstQuestion;
		console.log('Current Question: ',_.currentQuestion);
		_.set({
			currentQuestion: Model.firstQuestion,
		});
		
	}
	async define(){
		const _ = this;
		_.componentName = 'TestPage';
		G_Bus.on(_,[
			'isGrid','showResults','showSummary','changeSection','setWrongAnswer','setCorrectAnswer','changeQuestion',
			'jumpToQuestion','jumpToQuestion','saveBookmark','saveNote','changeInnerQuestionId','showForm','deleteNote',
			'editNote','showTestLabelModal','startTimer','updateStorageTest','saveReport','changeTestSection','enterGridAnswer',
			'resetTest'
		]);
		//TestModel = new TestModel();
		_.isLastQuestion = false;
		_.storageTest = Model.getTestFromStorage();
		_.types = {
			'text only':'standart',
			'text and images':'graphic',
			'passage':'passage',
			4:'compare',
			'grid in':'grid'
		};
		
		_.questionPos = 0;
		_.currentPos = 0;
		_.currentQuestionPos = 0;
		_.innerQuestionId = 1;
		
		_.datasPos = 0;
		
		_.set({
			currentSection: 'welcome'
		});
	}
	
	get questionsPages(){return Model.currentSection['subSections'][0]['questionDatas']}
	get questionsLength(){
		const _ = this;
		return Model.currentSection['subSections'][0]['questionDatas'].length;
		return Model.questions.length;
	}
	
	
	// Change section welcome->directions->questions etc
	async changeSection({item,event}){
		const _ = this;
		let section = item.getAttribute('section');
		_.moduleStructure = {
			'header':'simpleHeader',
			'body': _.flexible(section),
		};
		
		if(section == 'score') {
		
			if(!Model.isFinished()){
				console.log('Last answer saved',await _.saveAnswerToDB());
				console.log('Test finished',await Model.finishTest({}));
				console.log('Test result data', await Model.getTestResultsByResultId());
				//_._$.currentQuestion = Model.questions[0];
				_.moduleStructure['body'] = _.flexible(section);
				await _.render();
				return void 0;
			}
		}
		if(section == 'directions') {
			// start of test
			let started = await Model.start();
			if(!started) return void 0;
			let results = await Model.getTestResults();
			if(results['status'] === 'finished'){
				section = 'score';
				_.moduleStructure['body'] = _.flexible(section);
				Model.getTestResultsByResultId();
			}
		}
	//	_._$.currentSection = section;
		await _.render();
		if(section == 'questions'){

			_.fillCheckedAnswers();
			if(Model.isFinished()){
				await Model.getTestResults();
				_.markAnswers();
				_.markCorrectAnswer();
			}
		}
		
	}
	
	//
	resetTest({item}){
		const _ = this;
		localStorage.removeItem('resultId');
		localStorage.removeItem('test');
		localStorage.removeItem('_id');
		item.textContent = 'Test reseted';
	}
	// Change current question
	async changeQuestion({ item, event }){
		const _ = this;
		let dir = item.getAttribute('data-dir');
		let index = _.questionPos;

		if(dir == 'prev'){
			if( index == 0){
				return void 0;
			}
		//	_.currentPos-=1;
			_.datasPos-=1;
			_.questionPos-=1;
			_._$.currentQuestion=  Model.questions[index-1]; //_.questionsPages[index-1];
		}
		if(dir== 'next'){
			if( index == _.questionsLength.length-1){
				await _.saveAnswerToDB();
				Model.finishTest({});
				Model.getTestResultsByResultId();
				return void 0;
			}
			if(!Model.isFinished()){
				let test = await _.saveAnswerToDB();
			}
			//_.currentPos+=1;
			_.datasPos+=1;
			_.questionPos+=1;
			_._$.currentQuestion=  Model.questions[index+1]; //_.questionsPages[index+1];
		}
		
	}
	jumpToQuestion({item,event}){
		const _ = this;
		let
		jumpQuestionPos = Model.currentQuestionPosById(item.parentNode.getAttribute('data-question-id'));
		if(_.questionPos == jumpQuestionPos) return void 0;
		_.questionPos = jumpQuestionPos;
		_._$.currentQuestion = Model.questions[jumpQuestionPos];
	}
	changeTestSection({item}){
		const _ = this;
		let pos = item.getAttribute('data-section-pos');
		
		_.f('.questions-nav-list .active').classList.remove('active');
		item.classList.add('active');
		Model.changeSectionPos(parseInt(pos));
		_.questionPos = 0;
		_.datasPos = 0;
		_.sectionChanged = true;
		_._$.currentQuestion = Model.currentQuestionData(_.datasPos);
		
	
		

	}

	
	
	isGrid(){
		const _ = this;
		return _._$.currentQuestion.type == 'grid in';
	}
	showResults(data){
		console.log('Results info: ',data);
	}
	showSummary(data){
		console.log('Summary info: ',data);
	}
	
	updateStorageTest(){
		const _ = this;
		_.storageTest = Model.getTestFromStorage();
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
		Model.start();
	}
	/* Work with note */
	editNote({item}){
		const _ = this;
		let questionId= item.getAttribute('data-question-id');
		let note = _.storageTest[questionId]['note'];
		
		G_Bus.trigger('modaler','showModal',{
			type:'html',
			target:'#note'
		});
		_.f('#note textarea').value = note;
	}
	deleteNote({item}){
		const _ = this;
		let questionId= item.getAttribute('data-question-id');
		delete _.storageTest[questionId]['note'];
		Model.saveTestToStorage({
			questionId: questionId,
			note: null
		});
		item.parentNode.parentNode.remove();
		_.f('.note-button').classList.remove('active');
	}
	/* Work with note end */
	fillCheckedAnswers(){
		const _ = this;
		let test = Model.getTestFromStorage();
		for(let t in test){
			let
				currentTestObj = test[t],
				questionId= currentTestObj['questionId']; // if request was not in local storage, try another prop for questionId

			if(currentTestObj['bookmarked']) {
				let listAnswerItem = _.f(`.questions-list .questions-item[data-question-id="${questionId}"]`);
				if(listAnswerItem) listAnswerItem.classList.add('checked');
			}
			if(currentTestObj['answer']) {
				let listAnswerItemVariant = _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`);
				if(listAnswerItemVariant)
				_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent = currentTestObj['answer'].toUpperCase();
			}
		}
		_.setActions(['bookmarked','note']);
	}
	markAnswers(){
		const _ = this;
		let
			questionItems = _.f('.questions-item'),
			serverQuestions = Model.questions,
			cnt = 0;
		for(let item of questionItems){
			let
				id = item.getAttribute('data-question-id'),
				serverQuestion = serverQuestions[cnt],
				variant = item.querySelector('.questions-variant').textContent;
			if(Model.testServerAnswers && Model.testServerAnswers[id]){
				if(Model.testServerAnswers[id]['answer']){
					let
						answer = Model.testServerAnswers[id]['answer'].toUpperCase(),
						serverAnswer = serverQuestion['correctAnswer'].toUpperCase();
					if(answer === serverAnswer){
						item.classList.add('correct')
					}else{
						item.classList.add('wrong')
					}
				}
			}else{
				item.classList.add('wrong');
			}
			cnt++;
		}
		
	}
	
	async saveReport({item:form,event}){
		event.preventDefault();
		const _ = this;
		let gformData = await _.gFormDataCapture(form);
		Model.saveTestToStorage({
			questionId: _._$.currentQuestion['_id'],
			report: gformData
		});
		G_Bus.trigger(_.componentName,'updateStorageTest')
		G_Bus.trigger('modaler','closeModal');
	}
	saveBookmark({item}){
		const _ = this;
		let
			questionId = item.getAttribute('data-question-id'),
			bookmarked = item.classList.contains('active');
			
		Model.saveTestToStorage({
			questionId: questionId,
			bookmarked: !bookmarked
		});
		item.classList.toggle('active');
		_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.toggle('checked');
	}
	async saveNote({item:form,event}){
		const _ = this;
		event.preventDefault();
		let formData = await _.formDataCapture(form);
		Model.saveTestToStorage({
			questionId: _.innerQuestionId,
			note: formData['text']
		});
		G_Bus.trigger(_.componentName,'updateStorageTest')
		let answerList = _.f(`.answer-list[data-question-id="${_.innerQuestionId}"]`);
		if(answerList.nextElementSibling) {
			if(answerList.nextElementSibling.classList.contains('note-block')){
				answerList.nextElementSibling.remove();
			}
		}
		answerList.after(_.markup(_.noteTpl(_._$.currentQuestion)));
		G_Bus.trigger('modaler','closeModal');
		// Show active note button
		_.f(`.note-button[data-question-id="${_.innerQuestionId}"]`).classList.add('active');
	}
		// Нижнего переднего рычага задний сайлентблоки
	
	setActions(types = ['bookmarked']){
		//='bookmarked'
		
		const _ = this;
		let handle = (currentTest)=>{
			if(currentTest) {
				types.forEach( type => {
					if(currentTest[type]) {
						if(_.f(`.${type}-button[data-question-id="${currentTest['questionId']}"]`))  _.f(`.${type}-button[data-question-id="${currentTest['questionId']}"]`).classList.add('active')
					}
				});
			}
		};
		if(_._$.currentQuestion['questions']){
			if(_._$.currentQuestion.questions.length > 2){
				for(let q of _._$.currentQuestion.questions) {
					handle(_.storageTest[q['_id']]);
				}
			}
		}
		let currentTest = _.storageTest[_._$.currentQuestion['_id']];
		handle(currentTest);
	}
	
	changeInnerQuestionId({item}){
		const _ = this;
		_.innerQuestionId = item.getAttribute('data-question-id');
	}
	

	

	async saveAnswerToDB(){
		const _ = this;
		//_.currentQuestion = _._$.currentQuestion['questions'][0];// Model.innerQuestion(_.questionPos);
		return new Promise(  async (resolve) => {
			let questionData = Model.currentQuestionData(_.questionPos);
			let handle = (answer)=>{
				return Model.saveAnswer({
					answer:{
						sectionName: Model.currentSection['sectionName'],
						subSectionName: Model.currentSection['subSections'][0]['subSectionName'],
						questionDatasId: Model.currentQuestionData(_.datasPos)['_id'],
						questionId: answer['questionId'],
						answer: answer['answer'],
						bookmark: answer['bookmark'],
						disabledAnswers: answer['disabledAnswers'],
						note: answer['note'],
						report: answer['report']
					}
				});
			}
			if(questionData['questions'].length > 1){
				for(let i=0; i < questionData['questions'].length;i++){
					let quest = questionData['questions'][i];
					let answer = _.storageTest[quest['_id']];
					if(!answer){
						let bookmarkedButton = _.f(`.bookmarked-button[data-question-id="${quest['_id']}"]`);
						_.saveBookmark({
							item: bookmarkedButton
						});
						continue;
					}
					resolve(handle(answer));
				}
			}else{
				let answer = _.storageTest[_._$.currentQuestion['_id']];
				if(answer){
					// if user choosed answer save it to db
					resolve(handle(answer));
				}else{
					// else set bookmarked this answer

					_.saveBookmark({
						item: _.f('.bookmarked-button')
					});
					resolve(true);
				}
			}
		});
	}

	setWrongAnswer({item,event}){
		const _ = this;
		let
			answer = item.parentNode,
			questionId =  answer.getAttribute('data-question-id'),
			currentTest = _.storageTest[questionId],
			variant = answer.getAttribute('data-variant'),
			obj  = {
				questionId: questionId
			};
		if(answer.hasAttribute('disabled')){
			answer.removeAttribute('disabled');
			if(currentTest['disabledAnswers']){
				currentTest['disabledAnswers'].splice(currentTest['disabledAnswers'].indexOf(variant),1);
				G_Bus.trigger(_.componentName,'updateStorageTest')
			}
		}else{
			if(answer.classList.contains('active')){
				Model.saveTestToStorage({
					questionId: questionId,
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
		Model.saveTestToStorage(obj);
		G_Bus.trigger(_.componentName,'updateStorageTest')
	}
	setCorrectAnswer({item,event,type='simple'}){
		const _ = this;
		let
			answer,
			ul,
			answerVariant,
			questionId = item.parentNode.getAttribute('data-question-id'),
			listAnswerValue = _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`);
		if(type == 'simple'){
			answer = item.parentNode;
			ul = answer.parentNode;
			answerVariant = item.getAttribute('data-variant');
			if(answer.hasAttribute('disabled')) return void 0;
			if(ul.querySelector('.active')) ul.querySelector('.active').classList.remove('active');
			answer.classList.add('active');
			listAnswerValue.textContent =  answerVariant.toUpperCase();
		}else{
			let input = item.querySelector('#grid-value');
			questionId =  input.getAttribute('data-question-id');
			listAnswerValue = _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`)
			answerVariant = input.value;
			listAnswerValue.textContent = answerVariant;
		}
		Model.saveTestToStorage({
			questionId: questionId,
			answer: answerVariant
		});
		if(!Model.isFinished()){
			_.changeSkipButtonToNext();
		}
		if(_.isLastQuestion){
			_.changeSkipButtonToFinish();
		}
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

	enterGridAnswer({item,event}){
		const _ = this;
		let btn = event.target;
		if (btn.tagName !== 'BUTTON') return void 0;

		let
			col = btn.closest('.grid-col'),
			parent = col.parentElement,
			index = 0;

		for (let i = 0; i < parent.childElementCount; i++) {
			let unit = parent.children[i];
			if (unit === col) index = i;
		}

		let
			input = item.querySelector('#grid-value'),
			shower = item.querySelector('.grid-input');

		shower.children[index].textContent = btn.textContent;
		input.value = '';
		for (let i = 0; i < shower.childElementCount; i++) {
			input.value += (shower.children[i].textContent ?? '*');
		}

		let activeBtn = item.querySelector(`.grid-col:nth-child(${index + 1}) .active`);
		if (activeBtn) {
			activeBtn.classList.remove('active');
		}
		btn.classList.add('active');
		_.setCorrectAnswer({item:item,type:'grid'})
	}
	
	async getQuestionTpl(){
		const _ = this;
		return await _[`${_.types[_._$.currentQuestion['type']]}Question`]();
	}
	flexible(section){
		const _ = this;
		// welcome | directions | questions
		return `${section}Carcass`;
	}
	async init(){
		const _ = this;
		_._( async ()=>{
			let cont = _.f('.tt-ii');
			if(!cont) return;
			_.clear(cont);
			//_.questionPos = Model.questionPos(_.currentPos);
			cont.append(
				_.markup(await _.getQuestionTpl()),
				_.markup(_.questionFooter())
			);
			_.isLastQuestion = false;
			_.setActions(['bookmarked','note']);
			let step = 2,
					len = Model.currentQuestionData(_.datasPos)['questions'].length;
			if( len > 1 ){
				step= len;
			}
			if(_.questionPos < _.questionsLength){
				_.f('.skip-to-question').textContent = _.questionPos+step;
			}
			if(_.questionPos == _.questionsLength-1){
				_.changeSkipButtonToFinish();
				_.isLastQuestion = true;
			}else if(_.questionPos > 0){
				_.removeBackToQuestionBtn();
				_.addBackToQuestionBtn(_.questionPos-1);
			}
			

			G_Bus.trigger(_.componentName,'updateStorageTest'); // update test info in storage

			_.currentQuestion = _._$.currentQuestion;//['questions'][0]//Model.innerQuestion(_.questionPos);
			if(_.sectionChanged) {
				let questionCont = _.f('.questions-list');
				_.clear(questionCont);
				questionCont.append(_.markup(_.questionsList()));
			}
			if(Model.isFinished()) {
				if(_.sectionChanged){
					_.fillCheckedAnswers();
					_.sectionChanged = false;
				}
				_.markAnswers();
				_.markCorrectAnswer();
				return void 0;
			}

			// work on marked answers
			
			let currentStorageTest = _.storageTest[_.currentQuestion['_id']];
			
			if(!currentStorageTest) return void 0;
			if(currentStorageTest['answer']){
				// mark choosed answer
				if(!_.isGrid()){
					_.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['questionId']}"][data-variant="${currentStorageTest['answer']}"]`).classList.add('active');
				}else{
					console.log('Grid answer: ',currentStorageTest['answer']);
				}
				_.changeSkipButtonToNext();
			}
			if(currentStorageTest['disabledAnswers']){
				// mark disabled answer
				for(let dis of currentStorageTest['disabledAnswers']){
					let item = _.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['questionId']}"][data-variant="${dis}"]`);
					item.classList.remove('active');
					item.setAttribute('disabled', 'disabled');
				}
			}
			
		
		
			
		},['currentQuestion']);
	}
	
}
