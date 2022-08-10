import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class PracticeModule extends StudentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'practiceTabs',
			'body':'practiceBody',
			'footer':'studentFooter'
		};
	}
	// Getters
	get questionsLength(){
		const _ = this;
		return _.skillTests.length;
	}
	
	
	// Setters
	async asyncDefine(){
		const _ = this;

	}
	define() {
		const _ = this;
		_.componentName = 'practice';
		_.section = 'Mathematics';
		_.subSection = 'mathematics';
		_.activeTab = null;
		_.storageTest = Model.getTestFromStorage();
		_.questionPos = 0;
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
		_.innerQuestionId = 1;
		_.answerVariant = {};
		_.set({
			currentQuestion: null
		})
		
		G_Bus.on(_,[
			'domReady','changeSection','changePracticeTab','jumpToQuestion',
			'startTest','enterGridAnswer','checkAnswer','setCorrectAnswer',
			'showForm','saveBookmark','saveNote','saveBookmark','changeInnerQuestionId',
			'showTestLabelModal','editNote','deleteNote','saveReport',
		])
	}

	
	// Work with dom
	async domReady(data){
		const _ = this;
		
		if( _.subSection == 'mathematics' ){
			_.fillMathematicsSection();
		}
		if( _.subSection == 'welcome' ){
			_.fillWelcomeSection(data);
		}
		if( _.subSection == 'directions' ){
			_.fillDirectionsSection(data)
		}
		if( _.subSection == 'questions' ){
			_.fillQuestionSection(data);
		}
		
	}
	
	
	// Fill methods
	async fillMathematicsSection(){
		const _ = this;
		let inner = _.f('#bodyInner');
		_.clear(inner)
		inner.append(_.markup(_.practiceTasksTpl()));
		let skills = await Model.getSectionCategories('math');
		_.rcAchievementFill(skills);
		
	}
	async fillEnglishSection(){
		const _ = this;
		let inner = _.f('#bodyInner');
		_.clear(inner);
		/*let headerData = {
			title: 'Your Diagnostics Recomendations',
			subtitle: ['Take these 4 quizzes or a full test to unlock your practice recommendations','Today’s schedule: 5 / 10 questions completed'],
			gap: false,
			titlesData: {
				titleCls: 'practice-title practice-block-title',
				subtitleCls: 'practice-block-subtitle'
			}
		}*/
		inner.append(_.markup(_.practiceTasksTpl()));
		let skills = await Model.getSectionCategories('english');
		
		_.rcAchievementFill(skills);
	}
	async fillWelcomeSection({item}){
		const _ = this;
		let
			conceptName = item.getAttribute('data-id'),
			{currentConcept} = Model.getCurrentConcept(conceptName);
		_.f('#welcome-header-title').textContent = currentConcept['concept'];
		_.f('#welcome-btn').setAttribute('data-id',currentConcept['concept']);
	}
	async fillDirectionsSection({item}){
		const _ = this;
		let
			conceptName = item.getAttribute('data-id'),
			{currentConcept} = Model.getCurrentConcept(conceptName);
		_.f('#directions-header-title').textContent = currentConcept['concept'];
		_.f('#directions-btn').setAttribute('data-id',currentConcept['concept']);
		_.f('#directions-btn').setAttribute('data-category',currentConcept['category']);
	}
	async fillQuestionSection({item}){
		const _ = this;
		let
			conceptName = item.getAttribute('data-id'),
			{currentConcept,currentCategory} = Model.getCurrentConcept(conceptName);
		
		let response = await Model.start(currentConcept['concept'],currentCategory);

		
		_.skillTests = await Model.getSkillPractice(conceptName,currentCategory);
		_.f('#question-header-title').textContent = currentConcept['concept'];
		_.f('.questions-length').textContent = _.questionsLength;
		_.f('#question-pagination').append(_.markup(_.questionNavigation()));
		
		_._$.currentQuestion = _.skillTests[_.questionPos];
		
	}
	fillNote(currentAnswers){
		const _ = this;
		currentAnswers.forEach( answer => {
			if(answer['note']){
				_.f(`#note-field-${answer['questionId']}`).append(_.markup(_.noteTpl(answer)));
				_.f(`.note-button[data-question-id="${answer['questionId']}"]`).classList.add('active');
			}
		});
	}
	fillExplanation(currentQuestion) {
		const _ = this;
		currentQuestion['questions'].forEach(  async (question)=>{
			if(_.f(`#explanation-field-${question['_id']}`))	_.f(`#explanation-field-${question['_id']}`).append(_.markup(await _.explanationAnswer(question)));
		});
	}
	
	async fillCheckedAnswers(){
		const _ = this;
		let test = await Model.getTestResults();
		for(let t in test){
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
	async rcQuizFill(){
		const _ = this;
		let quizData = await Model.getQuizInfo();
		let cont = _.f('.practice-task-list');
		let itemsTpl = _.taskItemsTpl(quizData);
		_.clear(cont);
		if (!itemsTpl.length) return;
		cont.append(...itemsTpl);
	}
	async rcPracticeFill(){
		const _ = this;
		let practiceData = await Model.getPracticeInfo();
		let cont = _.f('.practice-task-list');
		let itemsTpl = _.taskItemsTpl(practiceData);
		_.clear(cont);
		if (!itemsTpl.length) return;
		cont.append(...itemsTpl);
	}
	async rcAchievementFill(achieveData){
		const _ = this;
		//let achieveData = await Model.getAchievementInfo();
		let cont = _.f('.practice-task-list');
		_.clear(cont)
		for (let item of achieveData) {
			let listTpl = _.achievementItemsTpl(item);
			if (!listTpl) continue;
			cont.append(_.markup(listTpl));
		}
	}
	
	
	// Getters
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
		return pos+1;
	}
	getPrevStepCnt(){
		const _ = this;
		return _.getStep()-1;
	}
	getNextStepCnt(){
		const _ = this;
		return _.getStep()+1;
	}
	async getQuestionTpl(){
		const _ = this;
		return await _[`${_.types[_._$.currentQuestion['type']]}Question`]();
	}
	
	
	// Save methods
	async saveReport({item:form,event}){
		event.preventDefault();
		const _ = this;
		let gformData = await _.gFormDataCapture(form);
		let
			//questionId = form.getAttribute('data-question-id'),
			questionId = _.innerQuestionId;
		if(!_.answerVariant[questionId]){
			_.answerVariant[questionId] = {};
		}
		_.answerVariant[questionId]['report'] = gformData;
		G_Bus.trigger('modaler','closeModal');
		console.log(_.answerVariant);
	}
	saveBookmark({item}){
		const _ = this;
		let
			questionId = item.getAttribute('data-question-id'),
			bookmarked = item.classList.contains('active');
		if(!_.answerVariant[questionId]){
			_.answerVariant[questionId] = {};
		}
		_.answerVariant[questionId]['bookmark'] = !bookmarked;
		item.classList.toggle('active');
	}
	async saveNote({item:form,event}){
		const _ = this;
		event.preventDefault();
		let formData = await _.formDataCapture(form);
		formData['_id'] = _.innerQuestionId;
		if(!_.answerVariant[_.innerQuestionId]){
			_.answerVariant[_.innerQuestionId] = {};
		}
		_.answerVariant[_.innerQuestionId]['note'] = formData['text'];
	
		let noteField = _.f(`#note-field-${_.innerQuestionId}`);
		_.clear(noteField);
		noteField.append(_.markup(_.noteTplFromForm(formData)));
		G_Bus.trigger('modaler','closeModal');
		// Show active note button
		_.f(`.note-button[data-question-id="${_.innerQuestionId}"]`).classList.add('active');
		_.setAvailableCheckBtn();
	}

	
	// navigate methods
	switchSubNavigate(){
		const _ = this;
		let cont = _.f('.subnavigate');
		if(!cont.querySelector(`[section="${_.subSection}"]`)) return 0;
		if(cont.querySelector('.active'))	cont.querySelector('.active').classList.remove('active');
		cont.querySelector(`[section="${_.subSection}"]`).classList.add('active')
	}
	async changePracticeTabsssss({item}) {
		const _ = this;
		_.activeTab = item.getAttribute('data-pos');
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let inner = _.f('#bodyInner');
		if (_.activeTab == 0){
			_.clear(inner)
		}
		else if (_.activeTab == 2){
			_.clear(inner)
			let headerData = {
				title: 'Your Diagnostics Recomendations',
				subtitle: ['Take these 4 quizzes or a full test to unlock your practice recommendations','Today’s schedule: 5 / 10 questions completed'],
				gap: false,
				titlesData: {
					titleCls: 'practice-title practice-block-title',
					subtitleCls: 'practice-block-subtitle'
				}
			}
			inner.append(_.markup(_.practiceTasksTpl(headerData)))
			_.rcQuizFill();
		}
		else if (_.activeTab == 3){
			_.clear(inner)
			let headerData = {
				title: 'Your Diagnostics Recomendations',
				subtitle: ['Skills recommended for you based on your past practice and frequency on the exam','Today’s schedule: 5 / 10 questions completed'],
				gap: false,
				icon: {
					href:'graphic-2',
					color: '0,175,175',
				},
				titlesData: {
					titleCls: 'practice-title practice-block-title',
					subtitleCls: 'practice-block-subtitle'
				}
			}
			inner.append(_.markup(_.practiceTasksTpl(headerData)))
			_.rcPracticeFill();
			inner.append(_.markup(_.practiceAchievementTpl()));
			_.rcAchievementFill();
		}
		else if (_.activeTab == 7){
			_.clear(inner);
			inner.append(_.markup(_.reportsAchievemntTpl()));

			let summaryInfo = await Model.getSummaryInfo();
			let summaryBlock = inner.querySelector('#summaryList');
			_.clear(summaryBlock)
			summaryBlock.append(_.markup(_.summaryBlockFill(summaryInfo)));

			let reportsInfo = Model.getReports();
			let reportsCont = inner.querySelector('#reports-table');
			_.clear(reportsCont);
			reportsCont.append(_.markup(_.reportsTableFill(reportsInfo)))

		}
	}
	async changePracticeTab({item}){
		const _ = this;
		let pos = item.getAttribute('data-pos');
		if(item.parentNode.querySelector('.active')){
			item.parentNode.querySelector('.active').classList.remove('active');
		}
		item.classList.add('active');
		
		if(pos == 0){
			_.fillMathematicsSection();
		}
		if(pos == 1){
			_.fillEnglishSection();
		}
	}
	changeActiveTab(){
		const _ = this;
		let
		btn = _.f('.section-button[data-pos="${_.activeTab}"]'),
		tempBtn = undefined;
		
		if (_.activeTab == 3) {
			tempBtn = _.f('.section-button[data-pos="7"]');
		} else if (_.activeTab == 7) {
			tempBtn = _.f('.section-button[data-pos="3"]');
		}
		
		return tempBtn ?? btn ?? _.f('.section-button')[0];
	}
	jumpToQuestion({item}){
		const _ = this;
		let questionPos = item.getAttribute('data-pos');
		_._$.currentQuestion =  Model.skillTest[questionPos];// Model.allquestions[questionPos];//['questions'][0];
		_.f('.pagination-link.active').classList.remove('active');
		item.classList.add('active');
	}
	// end navigate methods


	//change methods
	changeInnerQuestionId({item}){
		const _ = this;
		_.innerQuestionId = item.getAttribute('data-question-id');
	}
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render(struct,{item});
	}
	// end change methods
	
	
	// Show / hide / enter
	enterGridAnswer({item,event}){
		const _ = this;
		let btn = event.target;
		if (btn.tagName !== 'BUTTON') return void 0;
		
		let
			testRow = item.parentNode,
			grids = testRow.querySelectorAll('.grid'),
			col = btn.closest('.grid-col'),
			parent = col.parentElement,
			index = 0,
			pos = parseInt(col.getAttribute('data-col')) - 1;
		
		for (let i = 0; i < parent.childElementCount; i++) {
			let unit = parent.children[i];
			if (unit === col) index = i;
		}
		
		let
			input = item.querySelector('#grid-value'),
			shower = item.querySelector('.grid-input'),
			gridValue =  ['_','_','_','_','_'];
		if(input.value) gridValue =  input.value.split('');
		//shower.children[index].textContent = btn.textContent;

		grids.forEach( (grid) =>{
			let
				input = grid.querySelector('#grid-value'),
				shower = grid.querySelector('.grid-input');
			if(input.value) gridValue =  input.value.split('');
			shower.children[index].textContent = btn.textContent;
		})
		let activeBtn = item.querySelector(`.grid-col:nth-child(${index + 1}) .active`);
		
		if (activeBtn) {
			activeBtn.classList.remove('active');
			shower.children[index].textContent = '';
			gridValue[pos] =  '_';
			input.value = gridValue.join('');
		}else{
			btn.classList.add('active');
			gridValue[pos] =  btn.textContent;
			input.value = gridValue.join('');
			_.setCorrectAnswer({item:item,type:'grid'})
		}
		
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
			questionId = item.parentNode.getAttribute('data-question-id');
		if(type == 'simple'){
			answer = item.parentNode;
			ul = answer.parentNode;
			answerVariant = item.getAttribute('data-variant');
			if(answer.hasAttribute('disabled')) return void 0;
			if(ul.querySelector('.active')) ul.querySelector('.active').classList.remove('active');
			answer.classList.add('active');
		}else{
			let input = item.querySelector('#grid-value');
			questionId =  input.getAttribute('data-question-id');
			answerVariant = input.value.split('');
		}
		if(!_.answerVariant[questionId]){
			_.answerVariant[questionId] = {};
		}
		_.answerVariant[questionId]['answer'] = answerVariant;
		
		_.setAvailableCheckBtn();
		
		G_Bus.trigger(_.componentName,'updateStorageTest');
	}
	setActions(types = ['bookmark']){
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
	showForm(clickData){
		let btn = clickData.item,
		id = btn.getAttribute('data-id');
		this.f(`#${id}`).reset();
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: `#${id}`
		});
	}
	showTestLabelModal(clickData){
		let btn = clickData.item,
		target = btn.nextElementSibling;
		target.classList.toggle('active')
	}
	setAvailableCheckBtn(){
		const _ = this;
		_.f('#check-answer-btn').removeAttribute('disabled');
	}
	setDisableCheckBtn(){
		const _ = this;
		_.f('#check-answer-btn').setAttribute('disabled','disabled');
	}
	setBookmark(answers){
		const _ = this;
		answers.forEach( answer =>{
			if(answer['bookmark']){
				_.f(`.bookmarked-button[data-question-id="${answer['questionId']}"]`).classList.add('active');
			}
		})
	}
	// Templates
	flexible(){
		const _ = this;
		
		if(_.subSection === 'mathematics') {
			return {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body-tabs':'practiceTabs',
				'body': 'practiceBody'
			}
		}
		if(_.subSection === 'welcome') {
			return {
				'header':'simpleHeader',
				'header-tabs':null,
				'body-tabs':null,
				'body': 'welcomeCarcass'
			}
		}
		if(_.subSection === 'directions') {
			return {
				'body': 'directionsCarcass'
			}
		}
		if(_.subSection === 'questions') {
			return {
				'body': 'questionsCarcass'
			}
		}else if (_.subSection === 'reports') {
			return {
				'body': 'reportsBody'
			}
		}
	}
	
	// Other methods
	isGrid(){
		const _ = this;
		return _._$.currentQuestion.type == 'grid-in';
	}
	async checkAnswer({item}){
		const _ = this;
		for(let id in _.answerVariant){
			let answerObj = {
				"questionId": id,
				"questionDatasId": _._$.currentQuestion['_id'],
				"answer": _.answerVariant[id]['answer'],
			};
			if(_.answerVariant[id]['note']){
				answerObj['note'] = _.answerVariant[id]['note'];
			}
			if(_.answerVariant[id]['bookmark']){
				answerObj['bookmark'] = _.answerVariant[id]['bookmark'];
			}
			let response = await Model.saveAnswer({
				"answer": answerObj,
				"category": Model.currentCategory,
				"concept": Model.currentConcept['concept']
			});
			
			_.setDisableCheckBtn();
			
			_._$.currentQuestion['questions'].forEach( question => {
				let ans =   _.answerVariant[id]['answer'];
				if(_.isGrid()){
					ans =   _.answerVariant[id]['answer'].join('');
					ans = ans.replaceAll('_','');
				}
			
				if(question['correctAnswer'] == ans){
					_.f('#question-pagination .active').classList.add('done');
					if( _.isGrid()){
						_.f('.grid.empty').setAttribute('hidden','hidden');
						_.f('.grid.correct').removeAttribute('hidden');
					}
				}else{
					_.f('#question-pagination .active').classList.add('error');
					if( _.isGrid()){
						_.f('.grid.empty').setAttribute('hidden','hidden');
						_.f('.grid.incorrect').removeAttribute('hidden');
					}
					
				}
			});
			
		}
		
	}
	async startTest({item}){
		const _ = this;
		let
			concept = item.getAttribute('data-id'),
			category = item.getAttribute('data-category');
		let response = await Model.start(concept,category);
	}
	setGridAnswer(value){
		const _ = this;
		if( !value.length ) return void 0;
		let
			answerObject = value[0],
			answerText = answerObject.answer;
		if(!answerText) return void 0;
		let	answerDigits = (typeof answerText == 'string') ? answerText.split('') :  answerText;
		let
			className = '.grid.correct',
			correctAnswer = _._$.currentQuestion['questions'][0]['correctAnswer'],
			ans =   _.answerVariant[answerObject['questionId']]['answer'].join('');
		ans = ans.replaceAll('_','');
		
		if( correctAnswer != ans) className = '.grid.incorrect';
		_.f('.grid.empty').setAttribute('hidden','hidden');
		if( className == '.grid.correct'){
			_.f('.grid.correct').removeAttribute('hidden');
		}else{
			_.f('.grid.incorrect').removeAttribute('hidden');
		}
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
	setLetterAnswer(currentAnswers){
		const _ = this;
		_._$.currentQuestion['questions'].forEach( question =>{
			let correctAnswer = question['correctAnswer'];
			currentAnswers.forEach( answer => {
				if(answer['questionId'] == question['_id'] ) 	answer['correctAnswer'] = correctAnswer;
			});
		});
		currentAnswers.forEach( answer => {
			if( answer['answer'] == answer['correctAnswer'] ){
				_.f(`.answer-item[data-variant="${answer['answer']}"][data-question-id="${answer['questionId']}"]`).classList.add('correct');
			}else{
				_.f(`.answer-item[data-variant="${answer['answer']}"][data-question-id="${answer['questionId']}"]`).classList.add('incorrect');
				_.f(`.answer-item[data-variant="${answer['correctAnswer']}"][data-question-id="${answer['questionId']}"]`).classList.add('correct');
			}
		});
	}
	/* Work with note */
	editNote({item}){
		const _ = this;
		let questionId= item.getAttribute('data-question-id');
		let note = _.answerVariant[questionId]['note'];
		G_Bus.trigger('modaler','showModal',{
			type:'html',
			target:'#note'
		});
		_.f('#note textarea').value = note;
	}
	deleteNote({item}){
		const _ = this;
		let questionId = item.getAttribute('data-question-id');
		_.answerVariant[questionId]['note'] = "";

		item.parentNode.parentNode.remove();
		_.f(`.note-button[data-question-id="${questionId}"]`).classList.remove('active');
		_.setAvailableCheckBtn();
	}
	/* Work with note end */
	
	// inited methods
	async init() {
		const _ = this;
		
		_._( async ({currentQuestion})=>{
			if( !_.initedUpdate ){
				return void 'not inited yet';
			}
			_.answerVariant = {};
			let questionBody = _.f('#question-inner-body');
			questionBody.innerHTML = await _.getQuestionTpl();
			let
				rawAnswers = await Model.getTestResults(),
				placedAnswers = {};
			if(!rawAnswers.length) return void  'No answers from Server';

			rawAnswers.forEach( (item) => {
				if(!placedAnswers[item.questionDatasId]) placedAnswers[item.questionDatasId] = [];
				placedAnswers[item.questionDatasId].push({
					questionId: item.questionId,
					answer: item.answer,
					note: item.note,
					bookmark: item.bookmark
				});
			});
			let currentAnswers = placedAnswers[currentQuestion['_id']];
			if(!currentAnswers)	return  void 'No current answers';
			currentAnswers.forEach( answer =>{
				if(!_.answerVariant[answer.questionId]) _.answerVariant[answer.questionId] = {};
				_.answerVariant[answer.questionId] = answer;
			});
			
			if( _.isGrid() ){
				_.setGridAnswer(currentAnswers);
			} else{
				_.setLetterAnswer(currentAnswers);
			}
			
			_.fillExplanation(currentQuestion);
			_.fillNote(currentAnswers);
			_.setBookmark(currentAnswers)
			_.setDisableCheckBtn();
			
		})
	
	}
	
	
}