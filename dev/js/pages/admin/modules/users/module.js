import {G_Bus} from "../../../../libs/G_Control.js";
import {Model}  from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class UsersModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body':'usersBody',
			'footer':'adminFooter'
		}
	}

	async asyncDefine(){
		const _ = this;
		Model.currentUsersType = 'student';

		//_.studentsInfo =
		//G_Bus.trigger(_.componentName,'showSuccessPopup','Course has been successfully removed')
		//G_Bus.trigger(_.componentName,'showErrorPopup','Error, try again later')
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
		_.validationsSteps = [/*2,3,4,5*/];

		_.set({
			addingStep : 1,
			assignStep : 1,
		});

		G_Bus
			.on(_,[
				'handleErrors',
				'addStudent','showAssignPopup',
				'changeNextStep','changePrevStep','jumpToStep',
				'showProfile','showRemovePopup','removeCourse',
				'domReady',
				'assignParent','addNewParent','assignCourse','skipParent',
				'changeTestType','changeStudentLevel',
				'fillStudentInfo','createStudent',
				'fillParentInfo','assignStudentToParent',
				'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
				'showSuccessPopup','showErrorPopup','closePopup',
				'generatePassword',
			]);
	}
	async assignCourse({item}) {
		const _ = this;
		let response = await Model.assignCourse(_.studentInfo);
		if(!response){
			return void 0;
		}
		
		G_Bus.trigger('modaler','closeModal');
		
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
		let response = await Model.createStudent(_.studentInfo);

		if (!response) {

			return;
		}

		_.studentInfo = {};
		_.parentInfo = {};
		_.parents = {};
		_.metaInfo = {};

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger(_.componentName,'showSuccessPopup','Student has been successfully added');

		let users = await Model.getUsers({role:_.subSection,page: 1,update: true});
		_.fillUserTable(users);
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
			tbody = _.f('.tbl-body'),
			total = usersData['total'],
			limit = usersData['limit'];

		_.clear(tbody);

		_.fillDataByClass({className:`.gusers-count`,data:`${usersData ? total : 0}`});
		_.fillDataByClass({className:`.gusers-limit`,data:`${usersData ? (limit <= total ? limit : total) : 0}`});

		if(!usersData) {
			return void 'no users data';
		}
		
		let
		tableData = _.usersBodyRowsTpl(usersData);
		tbody.append(...tableData);
		_.connectTableHead();
	}
	async fillParentBlock(usersData){
		const _ = this;
		let
			total = usersData['total'],
			limit = usersData['limit'];

		_.fillDataByClass({className:`#assignParent .users-count`,data:`${usersData ? total : 0}`});
		_.fillDataByClass({className:`#assignParent .gusers-count`,data:`${usersData ? total : 0}`});
		_.fillDataByClass({className:`#assignParent .gusers-limit`,data:`${usersData ? (limit <= total ? limit : total) : 0}`});

		if(!usersData) {
			return void 'no users data';
		}
	}
	async fillParentsTable(parentsData){
		const _ = this;
		
		let tbody = _.f(`#assignParent .tbl-body`);
		let tableData = _.parentsBodyRowsTpl(parentsData);
		_.clear(tbody)
		tbody.append(...tableData);
		_.connectTableHead('#assignParent');
	}
	// Fill methods end
	
	// Adding methods
	async addStudent({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
		let stepTpl;
		if(_._$.addingStep == 1 ){
			let stepOneData = await Model.addingStepOneData();
			if (!_.studentInfo.course) _['studentInfo'].course = stepOneData[0]['_id'];
			if (!_.studentInfo.level) _['studentInfo'].level = stepOneData[0]['levels'][0]['_id'];
			stepTpl = _.addingStepOne(stepOneData);
		} else if(_._$.addingStep == 2 ){
			let stepData = await Model.addingStepTwoData();
			stepTpl = _.addingStepTwo(stepData);
		} else if(_._$.addingStep == 3 ){
			let stepData = await Model.addingStepThreeData();
			stepTpl = _.addingStepThree(stepData);
		} else if(_._$.addingStep == 4 ){
			let stepData = await Model.addingStepFourData();
			stepTpl = _.addingStepFour(stepData);
		} else if(_._$.addingStep == 5 ){
			stepTpl = _.addingStepFive();
		} else if(_._$.addingStep == 6 ){
			stepTpl = _.addingStepSix();
		}

		_.f('#addingForm .adding-body').innerHTML = stepTpl;
	}
	addNewParent({item}) {
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');
		cont.append(_.markup(_.assignNewParent()))

		_.metaInfo.parentAddType = 'adding';
	}
	async selectAvatar(clickData) {
		const _ = this;

		let listCont = _.f('.avatars-list');
		if (!listCont.children.length ) {
			_.avatars = await Model.step2;
			listCont.append(_.markup(_.avatarsItemsTpl()));
		}

		let activeAvatar = listCont.querySelector('.active');
		if (activeAvatar) activeAvatar.classList.remove('active');
		let avatarInfo = _.studentInfo ? _.studentInfo.avatar : null;
		if (avatarInfo) {
			listCont.querySelector(`[value="${avatarInfo['_id'] ?? avatarInfo}"]`).classList.add('active');
		}

		let callback = clickData.item.getAttribute('data-callback');
		if (callback) {
			_.f('#avatars').setAttribute('data-callback',callback);
		}

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#avatars'});
	}
	pickAvatar({item}) {
		const _ = this;
		let listCont = item.closest('.avatars-list');
		let activeBtn = listCont.querySelector('.active');
		if (activeBtn) activeBtn.classList.remove('active');
		item.classList.add('active')

		let avatarName = item.getAttribute('title');
		_['metaInfo'].avatarName = avatarName;
		_['metaInfo'].avatar = item.value;
	}
	confirmAvatar({item}){
		const _ = this;

		_['studentInfo'].avatar = _['metaInfo'].avatar;
		_['studentInfo'].avatarName = _['metaInfo'].avatarName;

		let img = _.markup(`<img src="/img/${_['studentInfo'].avatarName}.svg">`)
		let avatarCont = _.f('.adding-avatar-letter');
		_.clear(avatarCont);
		avatarCont.append(img);

		_.closeAvatar({item})
	}
	closeAvatar({item}){
		const _ = this;
		let
			modalCont = item.closest('.avatars'),
			callback = modalCont.getAttribute('data-callback');

		G_Bus.trigger('modaler','closeModal');

		if (callback) {
			modalCont.removeAttribute('data-callback');
			_[callback]({item})
		}
	}
	// Adding methods end
	
	// Change methods
	changeStudentLevel({item}) {
		const _ = this;
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		_['studentInfo'].level = item.getAttribute('data-id');
	}
	async changeTestType({item}) {
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
	async showProfile({item}) {
		const _ = this;
		let
			studentId = item.getAttribute('data-id'),
			currentStudent = Model.studentsData.response.filter( student => student['_id'] == studentId )[0];
		_.studentInfo = Object.assign(_.studentInfo,currentStudent['user']);
		_.studentInfo['currentSchool'] = currentStudent['currentSchool'];
		_.studentInfo['currentPlan'] = currentStudent['currentPlan'];
		_.studentInfo['grade'] = currentStudent['grade'];
		_.studentInfo['studentId'] = studentId;
		
		_.subSection = item.getAttribute('section');
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body': 'profile',
			'footer': 'adminFooter'
		};
		await _.render();
		_.f('.student-profile-course-info').innerHTML = _.courseInfo(await Model.addingStepFourData());
	}
	showRemovePopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removeForm','closeBtn':'hide'});
	}
	showSuccessPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'green')));
	}
	showErrorPopup(text) {
		const _ =  this;
		_.closePopup();
		_.f('BODY').append(_.markup(_.successPopupTpl(text,'red')));
	}
	closePopup(clickData) {
		const _ = this;
		let label;
		if (clickData && clickData.item) label = clickData.item.closest('.label');
		else label = _.f('.label');
		if (label) label.remove();
	}
	// Show methods end
	
	// Validation methods
	nextStepBtnValidation(){
		const _ = this;
		let stepBtn = _.f(`#addingForm .step-next-btn`);
		if (_.validationsSteps.indexOf(_._$.addingStep) >= 0) {
			if (!_.stepValidation()) {
				stepBtn.setAttribute('disabled',true);
				return void 0;
			}
		}
		stepBtn.removeAttribute('disabled')
	}
	stepValidation(){
		const _ = this;
		if (_._$.addingStep == 2) {
			return _.stepTwoValidation();
		} else if (_._$.addingStep == 3) {
			return _.stepThreeValidation();
		}
	}
	stepTwoValidation(){
		const _ = this;
		if (_.studentInfo.firstName) {
			if (_.studentInfo.lastName) {
				if (_.studentInfo.email) {
					if (_.studentInfo.avatar) {
						if (_.studentInfo.password) {
							if (_.studentInfo.cpass) {
								if (_.studentInfo.cpass == _.studentInfo.password) {
									return true;
								} else {
									_.showErrorPopup('Password and Repeat password must match');
									setTimeout(_.closePopup.bind(_),3000)
								}
							}
						}
					}
				}
			}
		}
		return false;
	}
	stepThreeValidation(){
		const _ = this;
		if (_.metaInfo && _.metaInfo.parentAddType == 'addNewParent') {
		
		}
	}
	// Validation methods end
	
	
	
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
			let tableData = await Model.getUsers({role:_.subSection});
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

	connectTableHead(selector) {
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
	skipParent ({item}) {
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');

		_.metaInfo.parentAddType = 'skip'
		cont.append(_.markup(_.skipParentTpl()))
	}
	async assignParent(clickData = null) {
		const _ = this;
		if (clickData) {
			let item = clickData.item;
			item.parentElement.querySelector('.active').classList.remove('active');
			item.classList.add('active')
		}

		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.add('full')
		cont.append(_.markup(_.assignParentTpl()))

		let usersData = await Model.getUsers({role: 'parent'});
		_.parents = usersData;

		_.fillParentBlock(usersData);
		_.fillParentsTable(usersData);

		_.metaInfo.parentAddType = 'assign';
	}
	assignStudentToParent({item}) {
		const _ = this;
		if (_.studentInfo['parentId']) {
			item.closest('.table').querySelector(`.users-btn[data-id="${_.studentInfo['parentId']}"]`).textContent = 'Assign';
		}

		item.textContent = 'Assigned';
		_.studentInfo['parentId'] = item.getAttribute('data-id');

		_.parentInfo = {};
	}
	
	removeCourse({item}) {
		const _ = this;
		let courseInfo = _.f('.student-profile-course-info');
		_.clear(courseInfo);
		courseInfo.innerHTML = _.emptyCourseInfo();
		G_Bus.trigger('modaler','closeModal');
	}

	generatePassword(){
		const _ = this;
		let
			len = Math.ceil((Math.random() * 8)) + 8,
			inputs = _.f('G-INPUT[type="password"]'),
			symbols = ['!','#', '$', '&', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
			password = '',
			input;

		for (let i = 0; i < len; i++) {
			let number = Math.ceil(Math.random() * 66);
			password += symbols[number];
		}

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].value = password.toString();
			G_Bus.trigger(_.componentName,inputs[i].getAttribute('data-input').split(':')[1],{item:inputs[i]})
			if (!i) {
				input = inputs[i].shadow.querySelector('INPUT');
				input.type = 'text';
				input.select();
				document.execCommand("copy");
			}
		}
		G_Bus.trigger(_.componentName,'showSuccessPopup','Password Generated and Copied')

		setTimeout(()=>{
			G_Bus.trigger(_.componentName,'closePopup');
			input.type = 'password';
		},2000)
	}




	setCancelBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-prev-btn`);
		stepBtn.setAttribute('data-click', 'modaler:closeModal');
		stepBtn.textContent = 'Cancel';
	}
	setPrevBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-prev-btn`);
		stepBtn.setAttribute('data-click',`${_.componentName}:changePrevStep`);
		stepBtn.setAttribute('step',`2`);
		stepBtn.textContent = 'Back';
	}
	setNextBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-next-btn`);
		stepBtn.textContent = 'Next';
		stepBtn.className = 'button-blue step-next-btn';
		stepBtn.setAttribute('data-click',`${_.componentName}:changeNextStep`);
	}
	setSubmitBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-next-btn`);
		stepBtn.className = 'button-blue button-green step-next-btn';
		stepBtn.textContent = 'Submit';
		if(type === 'adding') {
			stepBtn.setAttribute('data-click',`${_.componentName}:createStudent`);
		}
		if(type = 'assign'){
			stepBtn.setAttribute('data-click',`${_.componentName}:assignCourse`);
		}
		
	}
	changeNextStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			if(_.maxStep > _._$.addingStep) _._$.addingStep++;
			_.nextStepBtnValidation();
		}else{
			if(_.maxAssignStep > _._$.assignStep) _._$.assignStep++;
		}
	}
	changePrevStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			if(_._$.addingStep > _.minStep) _._$.addingStep--;
			_.nextStepBtnValidation();
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
	async handleAddingSteps() {
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
			addingBody = _.f('#addingForm .adding-body');
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
		
		_.f('#addingForm .adding-list-item.active').classList.remove('active');
		_.f(`#addingForm .adding-list-item:nth-child(${_._$.addingStep})`).classList.add('active');
	}
	async handleAssignSteps() {
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
			addingBody = _.f('#assignForm .adding-body');
		_.clear(addingBody);
		if(_._$.assignStep == _.minStep){
			_.setCancelBtn('assign');
		}else{
			_.setPrevBtn('assign');
		}
		if(_._$.assignStep == _.maxAssignStep){
			_.setSubmitBtn('assign');
		}else{
			_.setNextBtn('assign');
		}
		
		addingBody.append( _.markup( _.stepsAssignObj[ _._$.assignStep ]() ) );
		
		_.f('#assignForm .adding-list-item.active').classList.remove('active');
		_.f(`#assignForm .adding-list-item:nth-child(${ _._$.assignStep })`).classList.add('active');
	}
	
	init(){
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep']);
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ]);
		console.log(Model);
	}
	
}