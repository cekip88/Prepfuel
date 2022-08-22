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

	}
	async define(){
		const _ = this;
		_.componentName = 'TestPage';
		G_Bus.on(_,[
			'isGrid','showResults','showSummary','changeSection','setWrongAnswer','setCorrectAnswer','changeQuestion',
			'jumpToQuestion','jumpToQuestion','saveBookmark','saveNote','changeInnerQuestionId','showForm','deleteNote',
			'editNote','showTestLabelModal','startTimer','updateStorageTest','saveReport','changeTestSection','enterGridAnswer',
			'resetTest','domReady','changePracticeTest','changeTestResultsTab',
		]);
		//TestModel = new TestModel();
		_.isLastQuestion = false;
		_.isJump = false;
		_.storageTest = Model.getTestFromStorage();
		_.types = {
			'Multiple Choice':'standart',
			'text':'standart',
			'text and images':'graphic',
			'text-image':'graphic',
			'Full Passage and Questions (450 words)':'',
			'passage':'passage',
			4:'compare',
			'Grid-In':'grid',
			'grid-in':'grid'
		};
		_.questionStep = 1;
		
		_.rawQuestionPos = 0;
		_.questionPos = 0;
		
		_.currentPos = 0;
		_.currentQuestionPos = 0;
		_.innerQuestionId = 1;
		_.subSection = 'tests-list';
		
		_.sectionColors = [
			'80,205,137','4,200,200'
		]
		_.datasPos = 0;
		
		_.letters = [
			'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
		];
		
		_.set({
			currentSection: 'welcome'
		});
	}
	async domReady(){
		const _ = this;
		if(_.subSection == 'tests-list'){
		
		
			//console.log('Current Question: ',_.currentQuestion);
			_.fillTestsList();
		}
	}
	
	clearData(){
		const _ = this;
		_.isLastQuestion = false;
		_.isJump = false;
		_.questionStep = 1;
		_.rawQuestionPos = 0;
		_.questionPos = 0;
		_.currentPos = 0;
		_.currentQuestionPos = 0;
		_.innerQuestionId = 1;
		_.subSection = 'tests-list';
		_.datasPos = 0;
	}
	async fillTestsBody(){
		const _ = this;
		let
			pickList = _.f('#testPickList'),
			buttonCont = _.f('#test-pick-button-cont');
		pickList.innerHTML = '<img src="/img/loader.gif" alt="Loading...">';
		if(Model.test['status'] == 'finished'){
			let summary = await Model.getTestSummary();
			_.clear(pickList);
			pickList.append(_.markup(_.resultsTabBodyTpl(summary)));
		}else{
			_.clear(pickList);
			pickList.append(_.markup(_.testPickTpl()));
		}
		_.clear(buttonCont);
		if(!Model.test['resultId']) return void 0;
		
		buttonCont.append(_.markup(_.resetButtonTpl()));
	}
	async fillTestsList(){
		const _ = this;
		await Model.getStudentTests(); // requests all user tests
		_.set({
			currentQuestion: Model.firstQuestion,
		});
		_.currentQuestion = Model.firstQuestion;
		let
			container = _.f('#testAsideList');
		container.innerHTML = '<img src="/img/loader.gif" alt="Loading...">';
		let tests = Model.tests;
		if(!tests) return void 0;
		_.clear(container);
		tests.forEach( (test,i)=>{
			container.append(_.markup(_.testListAsideItemTpl(test,i+1)));
		});
		
		_.fillTestsBody();
	}
	
	
	
	get questionsPages(){return Model.currentSection['subSections'][Model.currentSubSectionPos]['questionData']}
	get questionsLength(){
		const _ = this;
		return Model.questionsLength;//currentSection['subSections'][Model.currentSubSectionPos]['questionData'].length;
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
		_.subSection = section;
	
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
		if(section == 'directions') {
			_.f('#directionsQuestion').textContent = _.questionPos+1;
		}
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
	async resetTest({item}){
		const _ = this;
		localStorage.removeItem('resultId');
		localStorage.removeItem('test');
		localStorage.removeItem('_id');
		item.innerHTML = '<img src="/img/loader.gif" alt="Loading...">';
		await Model.resetTest(item.getAttribute('data-id'));
		item.textContent = 'Test reseted';
		_.fillTestsList();
	}
	// Change current question
	async changeQuestion({ item, event }){
		const _ = this;
		let
			dir = item.getAttribute('data-dir');
		if(_.isJump){
			_.questionPos = Model.currentQuestionDataPosById(_._$.currentQuestion['_id'])
		}
		let index = _.questionPos;
		if( dir == 'prev' ){
			if( index == 0 ){
				return void 0;
			}
		//	_.currentPos-=1;
		//	_.datasPos-=1;
			_.questionPos-=1;
			_._$.currentQuestion=  Model.questions[index-1];
		}
		if( dir == 'next' ){
			if( index == _.questionsLength.length-1 ){
				await _.saveAnswerToDB();
				Model.finishTest({});
				Model.getTestResultsByResultId();
				return void 0;
			}
			if( !Model.isFinished() ){
				await _.saveAnswerToDB()
			}
			//_.currentPos+=1;
			//_.datasPos+=1;
			_.questionPos+=1;
			_._$.currentQuestion=  Model.questions[index+1];
		}
		_.isJump = false;
	}
	async jumpToQuestion({item,event}){
		const _ = this;
		_.isJump = true;
		
		let
			jumpQuestionPos = Model.currentQuestionPosById(item.parentNode.getAttribute('data-question-id')),
			questionPageId = item.parentNode.getAttribute('data-questionpage-id');
		if( _.questionPos == jumpQuestionPos ) return void 0;
		_.questionPos = jumpQuestionPos;
		await _.saveAnswerToDB();
		
		if(questionPageId !== '-1'){
			jumpQuestionPos = Model.currentQuestionDataPosById(questionPageId);
			_._$.currentQuestion = Model.questions[jumpQuestionPos];
		}else{
			_._$.currentQuestion = Model.allquestions[jumpQuestionPos];
		}
		
		location.hash= item.parentNode.getAttribute('data-question-id');
	
	}
	changeTestSection({item}){
		const _ = this;
		let pos = item.getAttribute('data-section-pos');
		if(_.f('.questions-nav-list .active'))	_.f('.questions-nav-list .active').classList.remove('active');
		//item.classList.add('active');
		_.f('.questions-nav-btn')[pos].classList.add('active');
		
		Model.changeSectionPos(parseInt(pos));
		_.questionPos = 0;
		_.datasPos = 0;
		_.sectionChanged = true;
		_._$.currentQuestion = Model.currentQuestionData(_.datasPos);
		_.isJump = false;
		_.f('#test-section-name').textContent = Model.currentSection.sectionName;
	}

	async changePracticeTest({item}){
		const _ = this;
		_.clearData();
		let
			pos = parseInt(item.getAttribute('data-pos'));
		_.f('.test-aside-btn.active').classList.remove('active');
		item.classList.add('active');
		let pickList = _.f('#testPickList');
		pickList.innerHTML = '<img src="/img/loader.gif" alt="Loading...">';
		await Model.changeTest(pos);
		_._$.currentQuestion = await Model.firstQuestion;
		_.fillTestsBody();
	}
	
	
	isGrid(){
		const _ = this;
		return _._$.currentQuestion.type == 'grid-in';
	}
	showResults(data){
		//console.log('Results info: ',data);
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
	async fillCheckedAnswers(){
		const _ = this;
		let test = await Model.getTestResults();//Model.getTestFromStorage();
	
		for(let t in test){
			if( test[t]['answer'] == 'O') continue;
			let
				currentTestObj = test[t],
				questionId= currentTestObj['questionId']; // if request was not in local storage, try another prop for questionId
			if(currentTestObj['bookmark']) {
				let listAnswerItem = _.f(`.questions-list .questions-item[data-question-id="${questionId}"]`);
				if(listAnswerItem) listAnswerItem.classList.add('checked');
			}
			if(currentTestObj['answer']) {
				let listAnswerItemVariant = _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`);
				if(listAnswerItemVariant)
				_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent = currentTestObj['answer'].toUpperCase();
			}
			_.fillAnswer(questionId,currentTestObj)
		}
		_.setActions(['bookmark','note']);
	}
	markAnswers(){
		const _ = this;
		let
			questionItems = _.f('.questions-item'),
			serverQuestions = Model.allquestions,
			cnt = 0;
		for(let item of questionItems){
			let
				id = item.getAttribute('data-question-id'),
				serverQuestion = serverQuestions[cnt],
				variant = item.querySelector('.questions-variant').textContent;
			if(Model.testServerAnswers && Model.testServerAnswers[id]){
				serverQuestion['correctAnswer'] = '4'; // stub, delete in the future
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
		if(!item) return void 0;
		let
			questionId = item.getAttribute('data-question-id'),
			bookmarked = item.classList.contains('active');
			
		Model.saveTestToStorage({
			questionId: questionId,
			bookmark: !bookmarked
		});
		item.classList.toggle('active');
		if(!_.isGrid())
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
		let answerList = _.f(`.answer-block[data-question-id="${_.innerQuestionId}"]`);
		_.clear(answerList);
		answerList.append(_.markup(_.noteTplFromForm(formData)));
		G_Bus.trigger('modaler','closeModal');
		// Show active note button
		_.f(`.note-button[data-question-id="${_.innerQuestionId}"]`).classList.add('active');
	}
		// Нижнего переднего рычага задний сайлентблоки
	
	setActions(types = ['bookmark']){
		//='bookmark'
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
			if(_.isJump){
				_.questionPos = Model.currentQuestionDataPosById(_._$.currentQuestion['_id'])
			}
			let questionData = Model.currentQuestionData(_.questionPos);
			console.log(_.questionPos,questionData);
			if(_._$.currentQuestion['questions']) questionData = _._$.currentQuestion;
			let handle = async (answer)=>{
				return await Model.saveAnswer({
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
					resolve(await handle(answer));
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
			if(Model.currentSectionPos == 1){
				_.changeSkipButtonToFinish();
			}else{
				_.changeSkipButtonToNextSection();
			}
			
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
		_.f('.skip-to-question-title').textContent = 'Finish test';
		_.f('.skip-to-question').textContent = '';
		let btn = _.f('.skip-to-question-button');
		btn.classList.add('button-blue');
		btn.setAttribute('data-click',`${this.componentName}:changeSection`);
		btn.setAttribute('section',`score`);
	}
	changeSkipButtonToNextSection(pos){
		const _ = this;
		_.f('.skip-to-question-title').textContent = 'Next section';
		_.f('.skip-to-question').textContent = '';
		let btn = _.f('.skip-to-question-button');
		btn.classList.add('button-blue');
		btn.setAttribute('data-click',`${this.componentName}:changeTestSection`);
		btn.setAttribute('data-section-pos',1);
		
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

	fillAnswer(questionId,currentTestObj){
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
			shower.children[index].textContent = '';
			input.value = '';
		}else{
			btn.classList.add('active');
			_.setCorrectAnswer({item:item,type:'grid'})
		}
		
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
	
	getStep(){
		const _ = this;
		let pos = 0;
		Model.questions.find((item,index)=> {
			if( item['questions']){
				let findedInQuestions = false;
				item['questions'].find((item,index)=> {
					if( item['_id'] == _._$.currentQuestion['_id'] ){
						pos = index;
						findedInQuestions = true;
						return true;
					}
				});
				if(!findedInQuestions){ pos = index;}
			}
			if( item['_id'] == _._$.currentQuestion['_id'] ){
				pos = index;
				return true;
			}
		});
		//_.questionPos = pos;
		let cnt = 0;
		for(let i = 0; i <= pos;i++){
			if(Model.questions[i]){
				if(Model.questions[i]['questions']){
					cnt+=Model.questions[i]['questions'].length;
				}else{
					cnt+=1;
				}
			}
		}
		return cnt;
	}
	getPrevStepCnt(){
		const _ = this;
		return _.getStep()-1;
	}
	getNextStepCnt(){
		const _ = this;
		return _.getStep()+1;
	}
	async getQuestionFields(currentQuestion){
		let
			output = document.createElement('div');
			output.innerHTML = currentQuestion['questionText'];
		let
			handle = async () => await MathJax.typesetPromise([output]).then( () => {
				if(output.innerHTML != 'undefined'){
					return output.innerHTML;
				}
				return '';
			} ),
			text = await handle();
		output.innerHTML = currentQuestion['questionIntro'];
		let intro = await handle();
		output.innerHTML = currentQuestion['questionContent'];
		let content =  await handle();
		output.innerHTML = currentQuestion['title'];
		let title =  await handle();
		return { title,text,intro,content };
	}

	// practice test results
	getFirstLetters(string){
		const _ = this;
		let words = string.split(' ');
		let resultString = '';
		for (let i = 0; i < words.length; i++) {
			resultString += words[i][0].toUpperCase();
		}
		return resultString;
	}
	practiceTestResultsFill(){
		const _ = this;
		let results = Model.getPracticeTestResults();

		let asideCont = _.f('#practiceTestResultsAside');
		_.clear(asideCont);
		asideCont.append(_.markup(_.resultsAsideButtonsTpl(results)));

		let body = _.f('#testResultBlock');
		_.clear(body);
		body.append(_.markup(_.resultsTabBodyTpl(results[0])))
	}
	async changeTestResultsTab({item}){
		const _ = this;
		let
			body = _.f('#testResultBlock'),
			cont = item.closest('ul'),
			id = item.getAttribute('data-id');

		let active = cont.querySelector('.active');
		if (item == active) return;

		_.clear(body);
		body.append(_.markup('<img src="/img/loader.gif">'))
		let info = await Model.getPracticeTestResults(id);

		active.classList.remove('active');
		item.classList.add('active');
		_.clear(body);
		if (info) body.append(_.markup(_.resultsTabBodyTpl(info)))
	}
	// end practice test results

	async init(){
		const _ = this;
		_._( async (obj)=>{
			let cont = _.f('.tt-ii');
			if(!cont) return;
			_.clear(cont);
			cont.append(
				_.markup(await _.getQuestionTpl()),
				_.markup(_.questionFooter())
			);
			_.fillCheckedAnswers();
			_.isLastQuestion = false;
			_.setActions(['bookmark','note']);
			if( _.questionPos < Model.allQuestionsLength ){
				_.f('.skip-to-question').textContent = _.getNextStepCnt();
			}
			if( _.questionPos == _.questionsLength - 1 ){
				if(Model.currentSectionPos == 1){
					_.changeSkipButtonToFinish();
				}else{
					_.changeSkipButtonToNextSection();
				}
				_.isLastQuestion = true;
			}else if(_.questionPos > 0){
				_.removeBackToQuestionBtn();
				_.addBackToQuestionBtn(_.getPrevStepCnt());
			}
			

			G_Bus.trigger(_.componentName,'updateStorageTest'); // update test info in storage

			_.currentQuestion = _._$.currentQuestion;//['questions'][0]//Model.innerQuestion(_.questionPos);
			if(_.sectionChanged) {
				let questionCont = _.f('.questions-list');
				_.clear(questionCont);
				_.f('#questions-length').textContent = Model.allQuestionsLength;
				questionCont.append(_.markup(_.questionsList()));
			}
			
			
			if(Model.isFinished()) {
				if(_.sectionChanged){
					_.sectionChanged = false;
				}
				_.markAnswers();
				_.markCorrectAnswer();
				return void 0;
			}

			// work on marked answers
			let currentStorageTest = _.storageTest[ _.currentQuestion['_id'] ];
			_.sectionChanged = false;
			if(!currentStorageTest) return void 0;
			if(currentStorageTest['answer']){
				// mark choosed answer
		
				if(!_.isGrid()){
					let answerItem = _.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['questionId']}"][data-variant="${currentStorageTest['answer']}"]`);
					if (answerItem) answerItem.classList.add('active');
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
