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
		document.title = 'Prepfuel - Tests';
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
			'editNote','showTestLabelModal','updateStorageTest','saveReport','changeTestSection','enterGridAnswer',
			'resetTest','domReady','changePracticeTest','changeTestResultsTab','showConfirmModal','pauseTest',
			"startTest"
		]);
		//TestModel = new TestModel();
		_.isLastQuestion = false;
		_.isJump = false;
		//_.storageTest = Model.getTestFromStorage();
		_.storageTest = Model.testServerAnswers;
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
		_.startedTest = false;
		_.questionStep = 1;
		_.testTime = 180;
		_.rawQuestionPos = 0;
		_.questionPos = 0;
		_.changedType = 'fromLastQuestion'; // 'fromTab'
		_.changeSectionFromLastQuestion = false;
		_.currentPos = 0;
		_.currentQuestionPos = 0;
		_.innerQuestionId = 1;
		_.subSection = 'tests-list';
		_.lastSkippedQuestion= {
			'data-questionPage-id': -1
		};
		_.calcedTime = false;
		_.sectionColors = [
			'80,205,137','4,200,200'
		]
		_.datasPos = 0;
		_.sectionPos =0;
		_.letters = [
			'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
		];
		
		_.set({
			currentSection: 'welcome'
		});
	}
	async domReady(){
		const _ = this;
		_.navigationInit();
		if(_.subSection == 'tests-list'){
			//console.log('Current Question: ',_.currentQuestion);
			if(_.abortGetStudentTests){
				_.abortGetStudentTests.abort();
			}
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
		_.changedType = 'fromLastQuestion';
		_.storageTest = {};
		_.lastSkippedQuestion= {
			'data-questionPage-id': -1
		};
		Model.currentSectionPos = 0;
		_.sectionPos =0;
		_.sectionChanged = false;
		_.calcedTime = false;
		clearInterval(_.timerInterval);
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
		_.abortGetStudentTests = new AbortController();
		_.abortGetStudentTests.name = 'getStudentTests';
		_.addAbortController(_.abortGetStudentTests);
		await Model.getStudentTests('practice',_.abortGetStudentTests.signal); // requests all user tests
/*		_.set({
			currentQuestion: Model.firstQuestion,
		});
		_.currentQuestion = Model.firstQuestion;*/
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
	
	calcTestTime(){
		const _ = this;
		console.log(_.resultObj);
		return  new Promise( (resolve,reject)=>{
			if(!_.resultObj){
				resolve(0);
				return void 0;
			}
			
			if(!_.calcedTime){
				_.minus = 0;
				if(_.resultObj['pauses'].length){
					for(let i = 1; i < _.resultObj['pauses'].length;i++){
						let pause = _.resultObj['pauses'][i];
						_.minus+= new Date(pause['pausedAt']).getTime() - new Date(_.resultObj['pauses'][i-1]['continuedAt']).getTime();
					}
				}
			}
			resolve(_.testTime-Math.round(_.minus/60000));
		})
		
	}
	get timerTime(){
		const _ = this;
		if(!_.resultObj) return void 0;
		let
			createdAt = _.resultObj['testStartedAt'],
			startTime = new Date(createdAt).getTime(),
			nowTime =new Date().getTime(),
			currentTime = nowTime - startTime;
		if(_.resultObj['pauses'].length){
			let lastContinue = _.resultObj['pauses'][_.resultObj['pauses'].length-1]['continuedAt'];
			currentTime = nowTime - new Date(lastContinue).getTime();
		}
		return _.testTime - Math.round(currentTime/60000);
	}
	get questionsPages(){return Model.currentSection['subSections'][Model.currentSubSectionPos]['questionData']}
	get questionsLength(){
		const _ = this;
		return Model.questionsLength;//currentSection['subSections'][Model.currentSubSectionPos]['questionData'].length;
		return Model.questions.length;
	}
	
	
	// Change section welcome->directions->questions etc
	async setTimerTime(){
		const _ = this;
		if(_.resultObj){
			_.testTime = await _.calcTestTime();
			_.set({
				timerTime: _.timerTime
			});
		}
	}
	async changeSection({item,event}){
		const _ = this;
		let
			continuedData = null,
			isPaused = item.hasAttribute('data-is-paused');
		if(item.hasAttribute('data-section-pos')){
			_.sectionPos = parseInt(item.getAttribute('data-section-pos'));
			Model.changeSectionPos(_.sectionPos);
		}
		if(item.hasAttribute('data-result-id')) {
			_.resultId = item.getAttribute('data-result-id');
			Model.changeSectionPos(0);
		}
		let section = item.getAttribute('section');
		_.moduleStructure = {
			'header':'simpleHeader',
			'body': _.flexible(section),
		};
		_.subSection = section;
		if(section == 'score') {
			G_Bus.trigger('modaler','closeModal');
			if(!Model.isFinished()){
				 if(_.isLastQuestion){
					 console.log('Last answer saved',await _.saveAnswerToDB());
				 }
				console.log('Test finished',await Model.finishTest({}));
				
				//console.log('Test result data', await Model.getTestResultsByResultId());
				//_._$.currentQuestion = Model.questions[0];
				_.moduleStructure['body'] = _.flexible(section);
			//	_._$.currentQuestion = Model.firstQuestion;
				await _.render();
				
				return void 0;
			}
		}
		await Model.getTest();
		Model.test['resultId'] = _.resultId;
		let results = await Model.getTestResults(_.resultId);
		if(section == 'directions') {
			// start of test
			if(isPaused) {
				let
					sectionPos = results['resultObj']['questionsState']['sectionPos'];
				Model.changeSectionPos(parseInt(sectionPos));
				_.sectionPos = sectionPos;
			}
			if(!_.startedTest) {
				if(_.resultId == 'null'){
					let startObj = await Model.start();
					_.resultId = startObj['resultId'];
				}
			}
			if(isPaused){
				await Model.setContinue();
				let
					questionDataId = results['resultObj']['questionsState']['sectionId'],
					sectionPos = results['resultObj']['questionsState']['sectionPos'];
		//		Model.changeSectionPos(parseInt(sectionPos));
				continuedData = Model.currentQuestionDataByQuestionDataId(questionDataId);
				if( continuedData['questions'].length > 1){
					_._$.currentQuestion = continuedData;
				}else{
					_._$.currentQuestion = continuedData['questions'][0];
				}
				_.questionPos = Model.currentQuestionDataPosById(_._$.currentQuestion['_id']);
			}else{
				_._$.currentQuestion = await Model.firstQuestion;
			}
			
			_.storageTest = results['testResults'];
			_.resultObj = results['resultObj'];
			if(results['status'] === 'finished') {
				section = 'score';
				_.moduleStructure['body'] = _.flexible(section);
				Model.getTestResultsByResultId();
			}
		}
		
		if( (section == 'questions') && (Model.isFinished()) ){
			let results = await Model.getTestResults(_.resultId);
			await Model.getTest();
			_._$.currentQuestion = await Model.firstQuestion;
			_.storageTest = results['testResults'];
		}

		await _.render();
		if(section == 'directions') {
			let isContinue = item.hasAttribute('data-dir');
			let type = 'Continue to ';
			if(isContinue){
				type = 'Back to question';
			}
			let
				pp = _.getStep(),
				questionData = Model.currentQuestionData(_.questionPos),
				directionsBtn = _.f('#directions-btn');
			if(continuedData){
				questionData = continuedData;
			}
			if(questionData){
				if(questionData['type'] == 'passage'){
					let pos = `${pp[0]}-${pp[1]}`;
					if(pp[0] > pp[1]){
						pp[0] = pp[1];
					}
					if(pp[0] == pp[1]){
						pos = pp[0];
					}
					directionsBtn.innerHTML = `${type}s <strong id="directionsQuestion" style="margin:0 5px"> ${pos} </strong> ${!isContinue ? ' questions': ''}`;
				}else{
					directionsBtn ? directionsBtn.innerHTML = `${type} <strong id="directionsQuestion" style="margin:0 5px"> ${pp[0]-1}</strong> ${!isContinue ? ' question': ''}`: '';
				}
			}else{
				if(pp[0] > pp[1]){
					directionsBtn.innerHTML = `${type} <strong id="directionsQuestion" style="margin: 0 5px"> ${pp[1]}</strong> ${!isContinue ? ' question': ''}`;
				}else{
					directionsBtn.innerHTML = `${type} <strong id="directionsQuestion" style="margin:0 5px"> ${pp[0]}-${pp[1]}</strong> ${!isContinue ? ' question': ''}`;
				}
			}
		//	_.f('#directionsQuestion').textContent = _.getStep()[0]-1//_.questionPos+1;
			_.tickTimer();
			if(!Model.isFinished()){
				_.resultObj['pauses'].unshift({
					'continuedAt': _.resultObj['testStartedAt']
				});
				_.setTimerTime();
			}
		}
		if(section == 'questions'){
			_.fillCheckedAnswers();
			_.fillDisabledAnswers();
			
			if(Model.isFinished()){
			//	_.f('.test-timer').textContent ='';
				let headerBtn = _.f('.header-question-btn');
				headerBtn.textContent = 'Exit this review';
				headerBtn.setAttribute('data-click',`${_.componentName}:changeSection`);
				headerBtn.setAttribute('section',"score");
				await Model.getTestResults(_.resultId);
				_.markAnswers();
				_.markCorrectAnswer();
			}else{
			//	_.setTimerTime();
				_.f('.test-timer-value').textContent = _.timerTime;
			}
		}
		
	}
	
	//
	async startTest({item}){
		const _ = this;
		
	}
	async resetTest({item}){
		const _ = this;
		localStorage.removeItem('resultId');
		localStorage.removeItem('test');
		localStorage.removeItem('_id');
		
		item.innerHTML = '<img src="/img/loader.gif" alt="Loading...">';
		await Model.resetTest(item.getAttribute('data-id'));
		item.textContent = 'Test reseted';
		_.fillTestsList();
		_.clearData();
		location.reload()
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
			if( !Model.isFinished() ){
				await _.saveAnswerToDB()
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
		
		if(!Model.isFinished()){
			await _.saveAnswerToDB();
		}
		if(questionPageId !== '-1'){
			jumpQuestionPos = Model.currentQuestionDataPosById(questionPageId);
			_._$.currentQuestion = Model.questions[jumpQuestionPos];
		}else{
			_._$.currentQuestion = Model.allquestions[jumpQuestionPos];
		}
		_.questionPos = jumpQuestionPos;
		location.hash = item.parentNode.getAttribute('data-question-id');
	
	}
	async changeTestSection({item}){
		const _ = this;
		let
			changedType = item.getAttribute('data-changed-type'),
			pos = item.getAttribute('data-section-pos');
		if(_.f('.questions-nav-list .active'))	_.f('.questions-nav-list .active').classList.remove('active');
		//item.classList.add('active');
		_.f('.questions-nav-btn')[pos].classList.add('active');
		if(!Model.isFinished()){
			await _.saveAnswerToDB();
		}
		Model.changeSectionPos(parseInt(pos));
	
		_.datasPos = 0;
		_.sectionChanged = true;
		_.questionPos = 0;
		if(_.isLastQuestion){
			_.changeSectionFromLastQuestion = true;
		}else{
			if( changedType == 'fromTab'){
				_.changeSectionFromLastQuestion = false;
			}
		}
			//	_._$.currentQuestion = Model.currentQuestionData(_.datasPos);
		_.sectionPos = pos;
		let cnt = 1;
		
		if(pos == '0'){
			_.f('#question-cnt-start').textContent = cnt;
			_.f('#questions-length').textContent = cnt+Model.allQuestionsLength-1;
			if(_.changeSectionFromLastQuestion){
			//	let currentQuestion = Model.allquestions[Model.allquestions.length-1];
			_._$.currentQuestion = Model.questionsDatas[Model.questionsDatas.length-1];
			_.questionPos = Model.questionsDatas.length-1;
			}else{
				_._$.currentQuestion = Model.questionsDatas[0];
			}
		}else{
			_._$.currentQuestion = Model.questionsDatas[0];
			 cnt = 58;
			_.f('#question-cnt-start').textContent = cnt;
			_.f('#questions-length').textContent = cnt+Model.allQuestionsLength-1;
		}
		_.isLastQuestion = false;
		_.changedType = changedType;
		_.isJump = false;
		_.f('#test-section-name').textContent = Model.currentSection.sectionName;
		
		
		
		_.fillCheckedAnswers();
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
		_.startedTest = await Model.changeTest(pos);
		//_._$.currentQuestion = await Model.firstQuestion;
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
	
	async showConfirmModal({item}){
		const _ = this;
		if( _.subSection != 'directions' ){
			G_Bus.trigger('modaler','showModal',{
				target: '#finish',
				type: 'html'
			});
			
			let
				notAnsweredCnt = 0,
				test = Model.testServerAnswers;
			_.f('#finish-minutes').textContent = _.timerTime;
			for(let prop in test){
				if(test[prop]['answer'] == 'O') notAnsweredCnt++
			}
			_.f('#finish-questions-length').textContent = notAnsweredCnt;
			return void 0;
		}
		_.changeSection({
			item: item
		});
		
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
	
	async pauseTest({item}){
		const _ = this;
		await _.saveAnswerToDB();
		Model.setPause(_._$.currentQuestion);
		location.reload();
	}
	tickTimer(){
		const _ = this;
	/*	_.set({
			timerTime: _.timerTime
		})*/
		_.timerInterval = setInterval(  ()=>{
			_.set({
				timerTime: _.timerTime
			})
		},1000*60);
	}
	
	
	/* Work with note */
	editNote({item}){
		const _ = this;
		let questionId= item.getAttribute('data-question-id');
		
		let note = Model.testServerAnswers[questionId]['note'];
		
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
	
	async fillDisabledAnswers(){
		const _ = this;
		let storageTestHandle = (currentStorageTest)=>{
			if(!currentStorageTest) return void 0;
			if(currentStorageTest['answer']){
				if(currentStorageTest['answer'] != 'O'){
					_.fillAnswer(currentStorageTest['questionId'],currentStorageTest);
					if(!_.isLastQuestion)	_.changeSkipButtonToNext();
				}
			}
			if(currentStorageTest['disabledAnswers']){
				// mark disabled answer
				for(let dis of currentStorageTest['disabledAnswers']){
					let item = _.f(`.answer-list .answer-item[data-question-id="${currentStorageTest['questionId']}"][data-variant="${dis}"]`);
					item.classList.remove('active');
					item.setAttribute('disabled', 'disabled');
				}
			}
		};
		if(_._$.currentQuestion['questions']){
			for(let cc of _._$.currentQuestion['questions']){
				storageTestHandle(Model.testServerAnswers[cc['_id']]);
			}
		}else{
			storageTestHandle(Model.testServerAnswers[_._$.currentQuestion['_id']]);
		}
	}
	async fillCheckedAnswers(){
		const _ = this;
		let test = await Model.getTestResults(_.resultId);//Model.getTestFromStorage();
		test = test['testResults'];
		for(let t in test){
			//if(( test[t]['answer'] == 'O') && (!test[t]['bookmark']) && (!test[t]['note'])  && (!test[t]['disabledAnswers']) ) continue;
			let
				currentTestObj = test[t],
				questionId= currentTestObj['questionId']; // if request was not in local storage, try another prop for
			
			if(currentTestObj['bookmark']) {
				let listAnswerItem = _.f(`.questions-list .questions-item[data-question-id="${questionId}"]`);
				if(listAnswerItem) listAnswerItem.classList.add('checked');
			}
			if(currentTestObj['answer'] && (currentTestObj['answer'] != 'O')) {
				let listAnswerItemVariant = _.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`);
				if( questionId == _._$.currentQuestion['_id']){
					_.fillAnswer(questionId,currentTestObj)
					_.changeSkipButtonToNext();
				}
				if(listAnswerItemVariant){
					_.f(`.questions-list .questions-item[data-question-id="${questionId}"] .questions-variant`).textContent = currentTestObj['answer'].toUpperCase();
				}
			}
			
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
				//console.log(serverQuestion['correctAnswer']);
				//serverQuestion['correctAnswer'] = 'B'; // stub, delete in the future
				if(Model.testServerAnswers[id]['answer'] != 'O'){
					let
						answer = Model.testServerAnswers[id]['answer'].toUpperCase(),
						serverAnswer = serverQuestion['correctAnswer'].toUpperCase();
					if(answer.trim() === serverAnswer.trim()){
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
		gformData['questionId'] = _._$.currentQuestion['_id'];
		Model.sendReport(gformData);
		G_Bus.trigger('modaler','closeModal');
	}
	saveBookmark({item}){
		const _ = this;
		if(!item) return void 0;
		let
			questionId = item.getAttribute('data-question-id'),
			bookmarked = item.classList.contains('active');
/*		Model.saveTestToStorage({
			questionId: questionId,
			bookmark: !bookmarked
		});*/
		item.classList.toggle('active');
	
		if(!_.isGrid()){
			if(_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`))
				_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.toggle('checked');
		}else{
			_.f(`.bookmarked-button[data-question-id="${questionId}"]`).classList.toggle('checked');
			_.f(`.questions-list .questions-item[data-question-id="${questionId}"]`).classList.toggle('checked');
		}
		
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
		formData['_id'] = _.innerQuestionId;
		answerList.append(_.markup(_.noteTplFromForm(formData)));
		G_Bus.trigger('modaler','closeModal');
		// Show active note button
		_.f(`.note-button[data-question-id="${_.innerQuestionId}"]`).classList.add('active');
	}
		// Нижнего переднего рычага задний сайлентблоки
	
	async setActions(types = ['bookmark']){
		//='bookmark'
		const _ = this;
		let test = await Model.getTestResults(_.resultId);
		test = test['testResults'];
		let handle = (currentTest)=>{
			
			if(currentTest) {
				types.forEach( type => {
					if(currentTest[type]) {
						(type == 'bookmark') ? type+='ed' : '';
						if(_.f(`.${type}-button[data-question-id="${currentTest['questionId']}"]`))  _.f(`.${type}-button[data-question-id="${currentTest['questionId']}"]`).classList.add('active')
					}
				});
			}
		};
		if(_._$.currentQuestion['questions']){
			// / > 2
			if(_._$.currentQuestion.questions.length){
				for(let q of _._$.currentQuestion.questions) {
					handle(test[q['_id']]);
				}
			}
		}else{
			let currentTest = test[_._$.currentQuestion['_id']];
			handle(currentTest);
		}
	
	}
	
	changeInnerQuestionId({item}){
		const _ = this;
		_.innerQuestionId = item.getAttribute('data-question-id');
	}

	async saveAnswerToDB(){
		const _ = this;
		return new Promise(  async (resolve) => {
			let outArr = [];
			let questionPos = 0;
			if(_.isJump){
				if( (_._$.currentQuestion['questions']) && (_._$.currentQuestion['questions'].length == 1) ){
					_.questionPos = Model.currentQuestionDataPosById(_._$.currentQuestion['questions'][0]['_id'])
				}else{
					_.questionPos = Model.currentQuestionDataPosById(_._$.currentQuestion['_id'])
				}
			}
			let questionData = Model.currentQuestionData(questionPos);
			if(_._$.currentQuestion['questions']) questionData = _._$.currentQuestion;
			
			let handle = async (answer)=>{
				//console.log(answer);
				if(!answer['questionId']) {
					console.log('QuestionId not found ');
					return void 0;
				}
				let testSaved =  await Model.saveAnswer({
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
				return testSaved;
			}
			if(questionData['questions'].length > 1){
				for(let quest of questionData['questions']){
					let answer = _.storageTest[quest['_id']];
					if(!answer){
						answer = {};
						let
							bookmarkedButton = _.f(`.bookmarked-button[data-question-id="${quest['_id']}"]`);
						if(!answer['bookmark']){
							_.saveBookmark({
								item: bookmarkedButton
							});
							answer['bookmark'] = true;
						}else{
							answer['bookmark'] = false;
						}
						answer['questionId'] = quest['_id'];
					}else if(answer['answer'] == 'O'){
						let bookmarkedButton = _.f(`.bookmarked-button[data-question-id="${quest['_id']}"]`);
						if(!answer['bookmark']){
							if(!bookmarkedButton.classList.contains('active')){
								_.saveBookmark({
									item: bookmarkedButton
								});
							}
							answer['bookmark'] = true;
						}else{
							if(!bookmarkedButton.classList.contains('active')){
								_.saveBookmark({
									item: bookmarkedButton
								});
							}
							answer['bookmark'] = true;
						}
					}else{
						let bookmarkedButton = _.f(`.bookmarked-button[data-question-id="${quest['_id']}"]`);
						answer['bookmark'] = bookmarkedButton.classList.contains('active');
					}
					outArr.push(await handle(answer))
				}
				resolve(outArr);
			}else{
				let currentQuestion = _._$.currentQuestion;
				if(currentQuestion['questions']){
					currentQuestion = _._$.currentQuestion['questions'][0];
				}
				let answer = _.storageTest[currentQuestion['_id']];
				
				if(answer && (answer['answer'] != 'O')){
					// if user choosed answer save it to db
					answer['bookmark'] = _.f(`.bookmarked-button[data-question-id="${answer['questionId']}"]`).classList.contains('active');
					resolve(await handle(answer));
				}else{
					// else set bookmarked this answer
					let currentBookmark = _.f(`.bookmarked-button[data-question-id="${answer['questionId']}"]`);
					if(!answer)	answer = {};
					if((!answer['bookmark']) && (! currentBookmark.classList.contains('active'))){
						_.saveBookmark({
							item: _.f('.bookmarked-button')
						});
						answer['bookmark'] = true;
					}
					if(currentBookmark.classList.contains('active')){
						answer['bookmark'] = true;
					}else{
						_.saveBookmark({
							item: _.f('.bookmarked-button')
						});
						answer['bookmark'] = true;
					}
					
					resolve(await handle(answer));
					resolve('Answer not found in storageTest');
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
		if(answer.classList.contains('active')) return void 0;
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
		let questionTitle = _.f('.skip-to-question-title'),
			questionNumber = _.f('.skip-to-question');
		let questionEnd = 'question';
		
		if(questionNumber && (questionNumber.textContent.indexOf('-') > -1)){
			questionEnd = 'questions';
		}
		questionTitle.textContent = `Next to ${questionEnd}`;
		let btn = _.f('.skip-to-question-button');
		btn.className= 'skip-to-question-button button-blue';
		btn.setAttribute('data-click',`${this.componentName}:changeQuestion`);
	}
	changeNextButtonToSkip(pos){
		const _ = this;
		let questionEnd = 'question';
		if(pos.indexOf('-') > -1){
			questionEnd = 'questions';
		}
		_.f('.skip-to-question-title').textContent = `Skip to ${questionEnd} ${pos}`;
		let btn = _.f('.skip-to-question-button');
		btn.className= 'button skip-to-question-button';
		btn.setAttribute('data-click',`${this.componentName}:changeQuestion`);
	}

	changeSkipButtonToFinish(pos){
		const _ = this;
		let skipBtn = _.f('.skip-to-question');
		_.f('.skip-to-question-title').textContent = 'Finish test';
		if(skipBtn) skipBtn.textContent = '';
		let btn = _.f('.skip-to-question-button');
		btn.classList.add('button-blue');
	//	btn.setAttribute('data-click',`${this.componentName}:changeSection`);
		btn.setAttribute('data-click',`${this.componentName}:showConfirmModal`);
		//btn.setAttribute('section',`score`);
	}
	changeSkipButtonToNextSection(pos){
		const _ = this;
		_.f('.skip-to-question-title').textContent = 'Next section';
		_.f('.skip-to-question').textContent = '';
		let btn = _.f('.skip-to-question-button');
		btn.classList.add('button-blue');
		btn.setAttribute('data-click',`${this.componentName}:changeTestSection`);
		btn.setAttribute('data-section-pos',1);
		btn.setAttribute('data-changed-type','fromLastQuestion');
		
	}

	addBackToQuestionBtn(pos){
		const _ = this;
		let questionData = Model.currentQuestionData(_.questionPos-1);
		let questPos = `${pos[0]}-${pos[1]}`;
		if(pos[0] == pos[1]) questPos = pos[0];
		if(questionData){
			if(questionData['type'] != 'passage'){
				questPos = pos[0]-1;
			}
		}
		let questionEnd = 'question';
		if((typeof questPos == 'string') && questPos.indexOf('-') > -1){
			questionEnd = 'questions';
		}
		if(pos == -1){
			_.f('.test-footer .dir-button').after(
				_.markup(`
					<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeTestSection" data-section-pos="0">
						<span>Back to the previous section</span>
					</button>`
			))
		}else{
			_.f('.test-footer .dir-button').after(
				_.markup(`
					<button class="test-footer-back back-to-question-button" data-click="${this.componentName}:changeQuestion" data-dir="prev">
						<span>Back to ${questionEnd} ${questPos}</span>
					</button>`
				)
			)
		}
		
	}
	removeBackToQuestionBtn(){
		const _ = this;
		
		if(_.f('.back-to-question-button')){
			_.f('.back-to-question-button').remove();
		}
	}
	setGridAnswer(value,classN='.grid.empty'){
		const _ = this;
		if( !value.length ) return void 0;
		let
			answerText = value;
		if(!answerText) return void 0;
		let	answerDigits = (typeof answerText == 'string') ? answerText.split('') :  answerText;
		let
			className = classN;//   '.grid.empty';
		
		answerDigits.forEach( (digit,index) => {
			let currentCol = _.f(`${className} [data-col="${index+1}"] .grid-button`);
			currentCol.forEach( (item) => {
				if(item.textContent.trim() == digit){
					item.classList.add('active');
				}
			});
			let inputValue = _.f(`${className} .grid-input span:nth-child(${index+1})`);
			if(digit != '_') inputValue.textContent = digit;
		})
	}
	fillAnswer(questionId,currentTestObj){
		const _ = this
		if(_.isGrid()){
			_.setGridAnswer(currentTestObj['answer'])
		}else{
			if(_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`)){
				_.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${currentTestObj['answer']}"]`).classList.add('active');
			}
		}
	}

	enterGridAnswer({item,event}){
		const _ = this;
		let btn = event.target;
		if (btn.tagName !== 'BUTTON') return void 0;
		if(btn.classList.contains('high')) return void 0;
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
		let activeBtn = item.querySelector(`.grid-col:nth-child(${index + 1}) .active`);
		if (activeBtn) {
			activeBtn.classList.remove('active');
			//	input.value = '';
			shower.children[index].textContent = '';
		}else{
			btn.classList.add('active');
		}
		for (let i = 0; i < shower.childElementCount; i++) {
			input.value += (shower.children[i].textContent ?? '*');
		}
		_.setCorrectAnswer({item:item,type:'grid'});
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
	
	getStepPos(){
		const _ = this;
		let pos = 0;
		let currentQuestion;
		currentQuestion = _._$.currentQuestion;
		if(_.sectionChanged){
			if(_._$.currentQuestion['questions'].length > 1 ){
				currentQuestion = _._$.currentQuestion;
			}else{
				currentQuestion = _._$.currentQuestion['questions'][0];
			}
		}
		Model.questions.find((item,index)=> {
			if( item['questions']){
				let findedInQuestions = false;
				item['questions'].find((item,index)=> {
					if( item['_id'] == currentQuestion['_id'] ){
						pos = index;
						findedInQuestions = true;
						return true;
					}
				});
				if(!findedInQuestions){ pos = index;}
			}
			if( item['_id'] == currentQuestion['_id'] ){
				pos = index;
				return true;
			}
		});
		return pos;
	}
	getQuestionNum(pos){
		const _ = this;
		let cnt = 0,cntFirst=1,cntLen=0;
		for(let i = 0; i <= pos;i++){
			if(Model.questions[i]){
				if(Model.questions[i]['questions']){
					cnt+=Model.questions[i]['questions'].length;
					if(i == pos){
						cntLen = Model.questions[i]['questions'].length;
					}
				}else{
					cnt+=1;
				}
			}
		}
		//if(cntFirst < 1){ cntFirst =0;}
		cntFirst = (cnt+1) - cntLen;
		let amount = 0;
		if(_.sectionPos == 1){
			amount = 57;
		}
		return [cntFirst+amount,cnt+amount];
	}
	getStep(){
		const _ = this;
		let pos = _.getStepPos();
		let cnt =  _.getQuestionNum(pos);
		return cnt;
	}
	getPrevStepCnt(){
		const _ = this;
		let pos = _.getStepPos();
	
		return _.getQuestionNum(pos-1);
	}
	getNextStepCnt(){
		const _ = this;
		let pos = _.getStepPos();
		return _.getQuestionNum(pos+1);
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
		_._( async ({currentQuestion})=>{

			let cont = _.f('.tt-ii');
			if(!cont) return;
			let questionCntPos = 1;
			_.clear(cont);
			if( (currentQuestion['questions']) && (currentQuestion['questions'].length == 1) ){
				_.questionPos = Model.currentQuestionDataPosById(currentQuestion['questions'][0]['_id'])
			}else{
				_.questionPos = Model.currentQuestionDataPosById(currentQuestion['_id'])
			}
			//console.log(_.questionPos, _.questionsLength,currentQuestion);
			
			_.isLastQuestion = false;
			if( _.questionPos == _.questionsLength - 1 ) {
				_.isLastQuestion = true;
			}
			cont.append(
				_.markup(await _.getQuestionTpl()),
				_.markup(_.questionFooter())
			);
			_.setActions(['bookmark','note']);
			
			if( _.questionPos < _.questionsLength ){
				let
					skipBtn = _.f('.skip-to-question'),
					pp = _.getNextStepCnt(),
					questionData = Model.currentQuestionData(_.questionPos+1);
				if(questionData){
					if(questionData['type'] == 'passage'){
						if(pp[0] > pp[1]){
							pp[0] = pp[1];
						}
						skipBtn.textContent = `${pp[0]}-${pp[1]}`;
					}else{
						if(skipBtn) skipBtn.textContent = `${pp[0]-1}`;
					}
				}
			}
			if( _.questionPos == _.questionsLength - 1 ){
				if(Model.currentSectionPos == 1){
					if(!Model.isFinished()){
					}else{
						_.changeSkipButtonToFinish();
					}
					
				}else{
					_.removeBackToQuestionBtn();
					_.addBackToQuestionBtn(_.getPrevStepCnt());
					_.changeSkipButtonToNextSection();
				}
			}else if(_.questionPos > 0){
				_.removeBackToQuestionBtn();
				_.addBackToQuestionBtn(_.getPrevStepCnt());
			}else if( (Model.currentSectionPos == 1) && (_.questionPos == 0)){
				_.addBackToQuestionBtn(-1);
			}
			G_Bus.trigger(_.componentName,'updateStorageTest'); // update test info in storage
			_.currentQuestion = _._$.currentQuestion;
			if(_.sectionChanged) {
				let questionCont = _.f('.questions-list');
				_.clear(questionCont);
			//	_.f('#questions-length').textContent = questionCntPos+Model.allQuestionsLength;
				questionCont.append(_.markup(_.questionsList()));
				if(!_.f('.back-to-question-button')) {
					_.addBackToQuestionBtn(-1);
				}
			}else{
				//_.removeBackToQuestionBtn();
			}
			if(Model.isFinished()) {
				if(_.sectionChanged){
					_.sectionChanged = false;
				}
				_.markAnswers();
				_.markCorrectAnswer();
				//return void 0;
			}
			// work on marked answers
			_.sectionChanged = false;
		_.fillDisabledAnswers()
		},['currentQuestion']);
		
		_._( ({timerTime})=>{
			if(!_.initedUpdate) return void 0;
			
			let timerValue = _.f('.test-timer-value');
			if(!timerValue) return void 0;
			
			timerValue.textContent = timerTime;
		},['timerTime'])
	}
	
	
}
