import {G_Bus} from "../../../../libs/G_Control.js";
import Model  from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class UsersModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body':'usersBody'
		}
	}

	async asyncDefine(){
		const _ = this;
		Model.currentUsersType = 'student';

		//_.studentsInfo =
		G_Bus.trigger(_.componentName,'showErrorPopup','Course has been successfully removed')
	}
	define() {
		const _ = this;
		_.componentName = 'UsersModule';
		_.maxStep = 6;
		_.maxAssignStep = 4;
		_.minStep = 1;
		_.coursePos = 0;
		_.parentInfo = {};
		_.studentInfo = {};
		_.metaInfo = {};
		_.subSection = 'student';

		_.set({
			addingStep : 1,
			assignStep : 1
		});
		G_Bus
			.on(_,[
				'handleErrors',
				'addStudent','showAssignPopup',
				'changeNextStep','changePrevStep','jumpToStep',
				'showProfile','showRemovePopup','removeCourse',
				'domReady',
				'assignParent','addNewParent',
				'changeTestType','changeStudentLevel',
				'fillStudentInfo','createStudent',
				'fillParentInfo','assignStudentToParent',
				'selectAvatar','pickAvatar',
				'showSuccessPopup','showErrorPopup','closePopup',
			]);
	}
	async createParent(){
		const _ = this;
		
	}
	async createStudent(){
		const _ = this;
		if(!_.studentInfo['parentId']){
			let parent = await Model.createParent(_.parentInfo);
			_.studentInfo['parentId'] = parent['_id'];
		}
		await Model.createStudent(_.studentInfo);
		_.studentInfo = {};
		_.parentInfo = {};
	}
	/*
	* Fill methods
	* */
	fillParentInfo({item}){
		const _ = this;
		let
			prop = item.getAttribute('name'),
			value = item.value;
		if( typeof value == 'object'){
			value = value+'';
		}
		_['parentInfo'][prop] = value;
	}
	fillStudentInfo({item}){
		const _ = this;
		let
			prop = item.getAttribute('name'),
			value = item.value;
		if( typeof value == 'object'){
			value = value+'';
		}
		_['studentInfo'][prop] = value;
	}
	fillDataByClass({className,data}){
		const _ = this;
		let
		conts = _.f(`${className}`);
		if(conts.length){
			conts.forEach( item=>{
				item.textContent = data;
			});
		}else{
			conts.textContent = data;
		}
	}
	async fillUserTable(usersData){
		const _ = this;
		let
			tbody = _.f('.tbl-body');
		_.clear(tbody);
		_.fillDataByClass({className:`.gusers-count`,data:`${usersData ? usersData['total'] : 0}`});
		_.fillDataByClass({className:`.gusers-limit`,data:`${usersData ? usersData['limit'] : 0}`});
		if(!usersData) {
			return void 'no users data';
		}
		
		let
		tableData = _.usersBodyRowsTpl(usersData);
		tbody.append(...tableData);
		_.connectTableHead();
	}
	async fillParentBlock(){
		const _ = this;
		let content = _.f(`#assignParent .users-count`);
		content.classList.add('loader-parent')
		content.innerHTML = "<img src='/img/loader.gif' class='loader'>";
		let usersData = await Model.getParents();
		console.log(usersData['total'])
		content.textContent = `(${usersData['total']})`
	}
	async fillParentsTable(){
		const _ = this;
		let tcont = _.f(`#assignParent .table-cont`);
		tcont.innerHTML += "<img src='/img/loader.gif' class='loader'>";
		
		let tbody = tcont.querySelector('.tbl-body');
		let tableData = _.parentsBodyRowsTpl(await Model.getParents());
		_.clear(tbody)
		tcont.querySelector('.loader').remove();
		tcont.classList.remove('loader-parent');
		tbody.append(...tableData);
		_.connectTableHead('#assignParent');
	}
	// Fill methods end
	
	// Adding methods
	async addStudent({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
		let stepTpl;
		if(_._$.addingStep == 1 ){
			let stepOneData = await Model.addingStepOneData();
			_['studentInfo'].course = stepOneData[0]['_id'];
			_['studentInfo'].level = stepOneData[0]['levels'][0]['_id'];
			stepTpl = _.addingStepOne(stepOneData);
		}
		if(_._$.addingStep == 2 ){
			let stepData = await Model.addingStepTwoData();
			stepTpl = _.addingStepTwo(stepData);
		}

		_.f('#addingForm').querySelector('.adding-body').innerHTML = stepTpl;
		
		
	}
	addNewParent({item}){
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');
		cont.append(_.markup(_.assignNewParent()))
	}
	async selectAvatar(){
		const _ = this;
		let avatarsModal = _.f('.avatars');

		if (!avatarsModal) {
			let avatars = await Model.step2;
			avatarsModal = _.markupElement(_.selectAvatarTpl(avatars));
			_.f('[hidden]').append(avatarsModal);
		}

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger('modaler','showModal', {type:'html',target:'.avatars'});
	}
	pickAvatar({item}){
		const _ = this;
		let activeBtn = item.closest('.avatars-list').querySelector('.active');
		if (activeBtn) activeBtn.classList.remove('active');
		item.classList.add('active')

		let img = _.markup(`<img src="/img/${item.getAttribute('title')}.svg">`)
		let avatarCont = _.f('.adding-avatar-letter');
		_.clear(avatarCont);
		avatarCont.append(img);

		_['studentInfo'].avatar = item.value;

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	}
	// Adding methods end
	
	// Change methods
	changeStudentLevel({item}){
		const _ = this;
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		_['studentInfo'].level = item.getAttribute('data-id');
	}
	async changeTestType({item}){
		const _ = this;
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let
		pos = parseInt(item.getAttribute('pos')),
		levelButtons = _.f('.level-buttons');
		_.clear(levelButtons);
		levelButtons.innerHTML = '<img src="/img/loader.gif">';
		let stepData = await Model.addingStepOneData();
		_.coursePos = pos;
		_['studentInfo'].course = stepData[pos]['_id'];
		_['studentInfo'].level = stepData[pos]['levels'][0]['_id'];
		_['metaInfo'].course = stepData[pos]['title'];
		_['metaInfo'].level = stepData[pos]['levels'][0]['title'];
		levelButtons.innerHTML = _.levelButtons(stepData[pos]);
	}
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body': _.flexible(),
		};
		await _.render();
	}
	// Change methods end
	
	// Show methods
	async showAssignPopup({item}) {
		const _ = this;
		let stepOneData = await Model.addingStepOneData();
		_['studentInfo'].course = stepOneData[0]['_id'];
		_['studentInfo'].level = stepOneData[0]['levels'][0]['_id'];
		_['metaInfo'].course = stepOneData[0]['title'];
		_['metaInfo'].level = stepOneData[0]['levels'][0]['title'];
		_.f('#assignForm').querySelector('.adding-body').innerHTML = _.addingStepOne(stepOneData);
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#assignForm'});
	}
	async showProfile({item}){
		const _ = this;
		let
			studentId = item.getAttribute('data-id'),
			currentStudent = Model.usersData['response'].filter( student => student['_id'] == studentId )[0];
		_.studentInfo = Object.assign(_.studentInfo,currentStudent['user']);
		_.studentInfo['currentSchool'] = currentStudent['currentSchool'];
		_.studentInfo['currentPlan'] = currentStudent['currentPlan'];
		_.studentInfo['grade'] = currentStudent['grade'];
		
		_.subSection = item.getAttribute('section');
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body': 'profile',
		};
		await _.render();
		_.f('.student-profile-course-info').innerHTML = _.courseInfo(await Model.addingStepFourData());
	}
	showRemovePopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removeForm','closeBtn':'hide'});
	}
	showSuccessPopup(text){
		const _ =  this;
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'green')));
	}
	showErrorPopup(text){
		const _ =  this;
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'red')));
	}
	closePopup({item}){
		item.closest('.label').remove();
	}


	// Show methods end
	
	handleErrors({method,data}){
		const _ = this;
		console.log(method,data);
		if( method == 'getUsers'){
			console.log('Users not found ',data);
		}
	}
	
	async domReady(){
		const _ = this;
		if (_.subSection === 'student') {
			let tableData = await Model.getUsers(_.subSection);
			_.fillUserTable(tableData);
			//
		}
	}
	
	flexible(){
		const _ = this;
		if(_.subSection === 'student') {
			return 'usersBody';
		} else if (_.subSection === 'parents') {
			return '';
		} else if (_.subSection === 'payments') {
			return '';
		}
	}

	
	connectTableHead(selector){
		const _ = this;
		let
			cont = _.f(`${selector ?? ''} .tbl`);
		if (!cont) return
		let
			head = cont.querySelector('.tbl-head'),
			ths = head.querySelectorAll('.tbl-item'),
			table = cont.querySelector('TABLE'),
			row = table.querySelector('TBODY TR'),
			tds = row.querySelectorAll('.tbl-item');
		ths.forEach(function (item,index){
			let w = tds[index].getBoundingClientRect().width;
			item.style = `width:${w}px;flex: 0 0 ${w}px;`
		})
	}
	assignParent({item}){
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.add('full')
		cont.append(_.markup(_.assignParentTpl()))

		_.fillParentBlock();
		_.fillParentsTable();
	}
	assignStudentToParent({item}){
		const _ = this;
		item.textContent = 'Assigned';
		_.studentInfo['parentId'] = item.getAttribute('data-id');
	}
	
	removeCourse({item}) {
		const _ = this;
		let courseInfo = _.f('.student-profile-course-info');
		_.clear(courseInfo);
		courseInfo.innerHTML = _.emptyCourseInfo();
		G_Bus.trigger('modaler','closeModal');
	}
	
	
	
	setCancelBtn(){
		const _ = this;
		let stepBtn = _.f('.step-prev-btn');
		stepBtn.setAttribute('data-click', 'modaler:closeModal');
		stepBtn.textContent = 'Cancel';
	}
	setPrevBtn() {
		const _ = this;
		let stepBtn = _.f('.step-prev-btn');
		stepBtn.setAttribute('data-click',`${_.componentName}:changePrevStep`);
		stepBtn.setAttribute('step',`2`);
		stepBtn.textContent = 'Back';
	}
	setNextBtn() {
		const _ = this;
		let stepBtn = _.f('.step-next-btn');
		stepBtn.textContent = 'Next';
		stepBtn.setAttribute('data-click',`${_.componentName}:changeNextStep`);
	}
	setSubmitBtn() {
		const _ = this;
		let stepBtn = _.f('.step-next-btn');
		stepBtn.textContent = 'Submit';
		stepBtn.setAttribute('data-click',`${_.componentName}:createStudent`);
	}
	changeNextStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			if(_.maxStep > _._$.addingStep) _._$.addingStep++;
		}else{
			if(_.maxAssignStep > _._$.assignStep) _._$.assignStep++;
		}
	}
	changePrevStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			if(_._$.addingStep > _.minStep) _._$.addingStep--;
		}else{
			if(_._$.assignStep > _.minStep) _._$.assignStep--;
		}
	}
	jumpToStep({item}) {
		const _ = this;
		let
		type = item.getAttribute('type'),
		step = parseInt(item.getAttribute('step'));
		if( type == 'adding' ){
			_._$.addingStep = step;
		}else{
			_._$.assignStep = step;
		}
	}
	async handleAddingSteps(){
		const _ = this;
		if(!_.initedUpdate){
			_.stepsObj = {
				1: _.addingStepOne.bind(_,await Model.addingStepOneData()),
				2: _.addingStepTwo.bind(_,await Model.addingStepTwoData()),
				3: _.addingStepThree.bind(_,await Model.addingStepThreeData()),
				4: _.addingStepFour.bind(_,await Model.addingStepFourData()),
				5: _.addingStepFive.bind(_),
				6: _.addingStepSix.bind(_)
			};
			return void 0;
		}
		let
			addingBody = _.f('.adding-body');
		addingBody.innerHTML = '<img src="/img/loader.gif">';
		
		_.clear(addingBody);
		
		if(_._$.addingStep == _.minStep){
			_.setCancelBtn();
		}else{
			_.setPrevBtn();
		}
		if(_._$.addingStep == _.maxStep){
			_.setSubmitBtn();
		}else{
			_.setNextBtn();
		}
		addingBody.append( _.markup(_.stepsObj[ _._$.addingStep ]()) );
		
		_.f('.adding-list-item.active').classList.remove('active');
		_.f(`.adding-list-item:nth-child(${_._$.addingStep})`).classList.add('active');
	}
	async handleAssignSteps(){
		const _ = this;
		if(!_.initedUpdate){
			_.stepsAssignObj = {
				1: _.addingStepOne.bind(_,await Model.addingStepOneData()),
				2: _.assignStepTwo.bind(_,await Model.addingStepFourData()),
				3: _.addingStepFive.bind(_),
				4: _.assignStepFour.bind(_),
			};
			return void 0;
		}
		let
			addingBody = _.f('.adding-body');
		_.clear(addingBody);
		if(_._$.assignStep == _.minStep){
			_.setCancelBtn();
		}else{
			_.setPrevBtn();
		}
		if(_._$.assignStep == _.maxAssignStep){
			_.setSubmitBtn();
		}else{
			_.setNextBtn();
		}
		
		addingBody.append( _.markup( _.stepsAssignObj[ _._$.assignStep ]() ) );
		
		_.f('.adding-list-item.active').classList.remove('active');
		_.f(`.adding-list-item:nth-child(${ _._$.assignStep })`).classList.add('active');
	}
	
	init(){
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep']);
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ]);
		console.log(Model);
	}
	
}