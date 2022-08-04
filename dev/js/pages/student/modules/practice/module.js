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
		
		_.set({
			currentQuestion: null
		})
		
		G_Bus.on(_,[
			'domReady',
			'changeSection',
			'changePracticeTab','startPractice','jumpToQuestion',
			'startTest','enterGridAnswer','checkAnswer','setCorrectAnswer'
		])
	}
	get questionsLength(){
		const _ = this;
		return _.skillTests.length;
	}
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
		_.skillTests = await Model.getSkillPractice(conceptName,currentCategory);
		_.f('#question-header-title').textContent = currentConcept['concept'];
		_.f('#question-pagination').append(_.markup(_.questionNavigation()));
		
		_._$.currentQuestion = _.skillTests[_.questionPos];
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
	//end fill methods
	
	async startTest({item}){
		const _ = this;
		let
			concept = item.getAttribute('data-id'),
			category = item.getAttribute('data-category');
		let response = await Model.start(concept,category);
		console.log(response);
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
	
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render(struct,{item});
	}
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
	async getQuestionTpl(){
		const _ = this;
		return await _[`${_.types[_._$.currentQuestion['type']]}Question`]();
	}
	startPractice(){
		const _ = this;
	}
	// end change methods
	
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
			answerVariant = input.value;
		}
		_.f('#check-answer-btn').removeAttribute('disabled');
		
		Model.saveTestToStorage({
			questionId: questionId,
			answer: answerVariant
		});
		G_Bus.trigger(_.componentName,'updateStorageTest');
	}
	checkAnswer({item}){
		const _ = this;
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
	async init(){
		const _ = this;
		
		_._( async ({currentQuestion})=>{
			if(!_.initedUpdate){
				return void 'not inited yet';
			}
			
			let questionBody = _.f('#question-inner-body');
			
			questionBody.innerHTML = await _.getQuestionTpl();
			
			let storageQuestions = Model.getTestFromStorage();
			console.log(currentQuestion['questions']);
		/*	if(storageQuestions[currentQuestion['questions'][0]['_id']]){
				console.log('Here');
			}*/
			
		})
	
	}
	
	
}