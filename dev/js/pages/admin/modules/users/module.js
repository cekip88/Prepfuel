import {G_Bus} from "../../../../libs/G_Control.js";
import {Model}  from "./model.js";
import {AdminPage} from "../../admin.page.js";
// Открывается саммари если не обновляешь страницу
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
		_.activityHeaderData = [
			{title:'40h:35min:57sec',info:'Total time spent in App'},
			{title:'28min:30sec',info:'Average time spent per session'},
			{title:'86',info:'Number of sessions'},
			{title:'Sunday March 17, 2022',info:'Last session'},
		]
		_.activityData = [
			{course:'ISEE',color:'turquoise',date:'2022-03-17',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-16',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'SHSAT',color:'blue',date:'2022-03-15',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-14',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-13',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
		];

		//_.studentsInfo =
		//G_Bus.trigger(_.componentName,'showSuccessPopup','Course has been successfully removed')
		//G_Bus.trigger(_.componentName,'showErrorPopup','Error, try again later')
	}
	define(){
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
		_.parentSkipped =  false;
		_.set({
			addingStep : 1,
			assignStep : 1,
			test: 'sdsadsadsad'
		});

		G_Bus
			.on(_,[
				'handleErrors',
				'addStudent','showAssignPopup','showRemoveUserPopup','removeUser',
				'showRemoveParentPopup','removeParent',
				'changeNextStep','changePrevStep','jumpToStep',
				'showRemovePopup','removeCourse',
				'domReady',
				'assignParent','addNewParent','assignCourse','skipParent',
				'changeTestType','changeStudentLevel','changeSection',
				'fillStudentInfo','createStudent','skipTestDate',
				'fillParentInfo','assignStudentToParent',
				'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
				'showSuccessPopup','showErrorPopup','closePopup',
				'generatePassword','changeProfileTab','updateStudent'
			]);
	}
	async domReady(data){
		const _ = this;
		_.wizardData = await Model.wizardData;
		if (_.subSection === 'student') {
			let
				item,update= false;
			if(data){
				item = data.item;
				update = item.hasAttribute('rerender');
			}
			let tableData = await Model.getUsers({role:_.subSection,update: update});
			_.fillUserTable(tableData);

			_.currentPage = 'main';
			_.studentInfo = {};
		//
			//
		}
		if(_.subSection == 'profile'){
			_.fillProfile(data);
			_.currentPage = 'profile';
			_._$.assignStep = 1;
		}
		if(_.subSection == 'parent'){
			let
				item,update= false;
			if(data){
				item = data.item;
				update = item.hasAttribute('rerender');
			}
			let tableData = await Model.getUsers({role:_.subSection,update: update});
			_.fillBodyParentsTable(tableData);
		}
	}
	
	clearData(){
		const _ = this;
		_.studentInfo = {};
		_.parentInfo = {};
		_.parents = {};
		_.metaInfo = {};
		_.parentSkipped = false;
		_.coursePos = 0;
	}
	
	async createParent(){
		const _ = this;
		
	}
	async createStudent(){
		const _ = this;
		if(!_.parentSkipped){
			if(!_.studentInfo['parentId']){
				let parent = await Model.createParent(_.parentInfo);
				_.studentInfo['parentId'] = parent['_id'];
			}
		}
		let response = await Model.createStudent(_.studentInfo);
		if (!response) {
			return void 0;
		}
		_.clearData();
		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger(_.componentName,'showSuccessPopup','Student has been successfully added');
		_._$.addingStep = 1;
		let users = await Model.getUsers({role:_.subSection,page: 1,update: true});
		_.fillUserTable(users);
	}
	async updateStudent({item}){
		const _ = this;
		let response = await Model.updateStudent({
			'studentId': _.studentInfo['studentId'],
			'firstName': _.studentInfo['firstName'],
			"lastName": _.studentInfo['lastName'],
			"email": _.studentInfo['email'],
			"password": _.studentInfo['password'],
			"avatar": _.studentInfo['avatar'],
			"grade": _.studentInfo['grade'],
			"currentSchool": _.studentInfo['currentSchool']
		});
		if(!response) return void 0;

		item.setAttribute('rerender',true);
		item.setAttribute('section','student');
		G_Bus.trigger(_.componentName,'changeSection',{item})
		_.showSuccessPopup('Student profile updated')
	}
	// Fill methods
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
			value = value + '';
		}
		if( (prop == 'firstSchool') || (prop == 'secondSchool')|| (prop == 'thirdSchool')|| (prop == 'grade')){
			_.metaInfo[prop] = item.textContent;
		}
		_['studentInfo'][prop] = value;
	}
	skipTestDate({item}){
		const _ = this;
		_.studentInfo.testDatePicked = (item.id === 'have_registered');
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
			tbody = _.f('#usersBody .tbl-body'),
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
	async fillBodyParentsTable(parentsData){
		const _ = this;
		let
			tbody = _.f(`#bodyParents .tbl-body`),
			tableData = _.parentsBodyRowsTpl(parentsData,'single'),
			total = parentsData['total'],
			limit = parentsData['limit'];
		
		_.fillDataByClass({className:`.gusers-count`,data:`${parentsData ? total : 0}`});
		_.fillDataByClass({className:`.gusers-limit`,data:`${parentsData ? (limit <= total ? limit : total) : 0}`});
		_.clear(tbody)
		tbody.append(...tableData);
		_.connectTableHead('#bodyParents');
	}
	async fillProfile(profileData) {
		const _ = this;
		let studentId;
		if(profileData['item']){
			studentId = profileData['item'].getAttribute('data-id');
			_.subSection = profileData['item'].getAttribute('section');
		}else{
			studentId = profileData['studentId'];
		}
		let
			currentStudent = Model.studentsData.response.filter( student => student['_id'] == studentId )[0];
		_.studentInfo = Object.assign({},currentStudent['user']);
		_.studentInfo['currentSchool'] = currentStudent['currentSchool'];
		_.studentInfo['currentPlan'] = currentStudent['currentPlan'];
		_.studentInfo['grade'] = currentStudent['grade']['_id'];
		_.studentInfo['studentId'] = currentStudent._id;
		
		_.f('.student-profile-inner').innerHTML = _.personalInfo();
		_._$.addingStep = 1;

		if (currentStudent['currentPlan']){
			_.studentInfo['firstSchool'] = currentStudent['currentPlan'].firstSchool ? currentStudent['currentPlan'].firstSchool['_id'] : '';
			_.studentInfo['secondSchool'] = currentStudent['currentPlan'].secondSchool ? currentStudent['currentPlan'].secondSchool['_id'] : '';
			_.studentInfo['thirdSchool'] = currentStudent['currentPlan'].thirdSchool ? currentStudent['currentPlan'].thirdSchool['_id'] : '';
			_.f('.student-profile-course-info').innerHTML = _.courseInfo(await Model.getWizardData());
		} else _.f('.student-profile-course-info').innerHTML = _.emptyCourseInfo();
		_.f('.breadcrumbs').innerHTML = _.breadCrumbsTpl();
	}
	async fillParentsInfoTable(parentsData){
		const _ = this;
		let tbody = _.f(`.parents-info-table .tbl-body`);
		let tableData = _.parentsBodyRowsTpl(parentsData,'parentsInfo');
		_.clear(tbody)
		tbody.append(...tableData);
		_.connectTableHead('.student-profile-inner');
	}
	fillActivityTable(){
		const _ = this;
		let table = _.f('.activity-table .tbl-body');
		_.clear(table);
		table.append(..._.activityBodyRowsTpl(_.activityData));
	}
	// Fill methods end

	// Adding methods
	async addStudent({item}) {
		const _ = this;
		
		_._$.addingStep = _._$.addingStep;
	
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	
	}
	addNewParent({item}) {
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');
		cont.append(_.markup(_.assignNewParent()))
		_.parentSkipped =  false;
		_.metaInfo.parentAddType = 'adding';
	}
	async selectAvatar(clickData) {
		const _ = this;

		let listCont = _.f('.avatars-list');
		if (!listCont.children.length ) {
			_.avatars = await Model.wizardData['avatars'];
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
		let
			listCont = item.closest('.avatars-list'),
			activeBtn = listCont.querySelector('.active');
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
		if(item.parentNode.querySelector('.active')) 	item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		_['studentInfo'].level = item.getAttribute('data-id');
	}
	async changeTestType({item}) {
		const _ = this;
		if(item.parentNode.querySelector('.active'))  item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let
			pos = parseInt(item.getAttribute('pos')),
			levelButtons = item.closest('.adding-body').querySelector('.level-buttons');
		_.clear(levelButtons);
		levelButtons.innerHTML = '<img src="/img/loader.gif">';
		let stepData = await Model.getWizardData();
		_.coursePos = pos;
		_['studentInfo'].course = stepData['courses'][pos]['_id'];
		_['studentInfo'].level = stepData['courses'][pos]['levels'][0]['_id'];
		_['metaInfo'].course = stepData['courses'][pos]['title'];
		_['metaInfo'].level = stepData['courses'][pos]['levels'][0]['title'];
		levelButtons.innerHTML = _.levelButtons(stepData['courses'][pos]);
	}
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render(struct,{item});
		_.switchSubNavigate()
	}
	async changeProfileTab({item}) {
		const _ = this;
		let pos = item.getAttribute('data-pos');
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let studentInner = _.f('.student-profile-inner');
		studentInner.classList.remove('short')
		if(pos == 0){
			_.fillProfile({studentId:_.studentInfo['studentId']});
		}
		if(pos == 1){
			studentInner.innerHTML = _.parentsInfo();
			let parentsData = await Model.getUsers({role: 'parent'});
			_.fillParentsInfoTable(parentsData);
		}
		if(pos == 2){
			studentInner.innerHTML = _.activityHistory();
			_.fillActivityTable();
			_.connectTableHead('.activity-table')
		}
		if(pos == 3){
			studentInner.classList.add('short');
			let notifications = await Model.getAdminNotifications();
			studentInner.innerHTML = _.notifications(notifications);
		}
	}
	
	flexible(){
		const _ = this;
		if(_.subSection === 'profile') {
			return {
				'body': 'profile'
			};
		}
		if(_.subSection === 'student') {
			return {
				'body': 'usersBody'
			};
		} else if (_.subSection === 'parent') {
			return {
				'body': 'parentsBody'
			};
		} else if (_.subSection === 'admins') {
			return '';
		}
	}
	// Change methods end
	
	// Show methods
	async showAssignPopup({item}) {
		const _ = this;
		_._$.assignStep = _._$.assignStep;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#assignForm'});
	}

	
	showRemovePopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removeForm','closeBtn':'hide'});
	}
	showRemoveUserPopup({item}){
		const _ = this;
		_.studentInfo['studentId'] = item.getAttribute('data-id');
		//_.metaInfo['sourse'] = '';
		G_Bus.trigger('modaler','showModal', {item:item,type:'html',target:'#removeUserForm','closeBtn':'hide'});
	}
	showRemoveParentPopup({item}){
		const _ = this;
		_.parentInfo['parentId'] = item.getAttribute('data-id');
		G_Bus.trigger('modaler','showModal', {item:item,type:'html',target:'#removeParentForm','closeBtn':'hide'});
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
		cont.append(_.markup(_.skipParentTpl()));
		_.parentSkipped=  true;
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
		_.parentSkipped =  false;
		_.metaInfo.parentAddType = 'assign';
	}
	assignStudentToParent({item}) {
		const _ = this;
		if (_.studentInfo['parentId']) {
			item.closest('.table').querySelector(`.users-btn[data-id="${_.studentInfo['parentId']}"]`).textContent = 'Assign';
		}

		item.textContent = 'Assigned';
		_.studentInfo['parentId'] = item.getAttribute('data-id');
		let currentParent = Model.parentsData.response.filter( parent => parent['_id'] == _.studentInfo['parentId'] )[0];
		_.parentInfo = currentParent['user'];
	}
	async assignCourse({item}) {
		const _ = this;
		let response = await Model.assignCourse(_.studentInfo);
		if(!response)	return void 0;
		_.studentInfo['currentPlan'] = response['currentPlan'];
		let wizardData = await Model.getWizardData();
		_.f('.student-profile-course-info').innerHTML = _.courseInfo(wizardData);
		G_Bus.trigger('modaler','closeModal');
		_.showSuccessPopup('Course has been successfully assigned');
	}
	
	
	async removeCourse({item}) {
		const _ = this;
		let courseInfo = _.f('.student-profile-course-info');
		_.clear(courseInfo);
		await Model.removeCourse({
			studentId:_.studentInfo['studentId'],
			planId:_.studentInfo.currentPlan['_id'],
		});
		courseInfo.innerHTML = _.emptyCourseInfo();
		G_Bus.trigger('modaler','closeModal');
		_.studentInfo.firstSchool = null;
		_.studentInfo.secondSchool = null;
		_.studentInfo.thirdSchool = null;
		_.studentInfo.testDate = null;
		_.studentInfo.testDatePicked = false;
		_._$.assignStep = 1;
	}
	async removeUser({item}){
		const _ = this;
		let response = await Model.removeStudent(_.studentInfo['studentId']);
		if (!response) return;
		
		if (_.currentPage == 'profile') {
			item.setAttribute('rerender',true);
			item.setAttribute('section','student');
			G_Bus.trigger(_.componentName,'changeSection',{item})
		} else {
			_.f(`TR[user-id="${_.studentInfo['studentId']}"]`).remove();
		}
		G_Bus.trigger('modaler','closeModal',{item})
		_.showSuccessPopup('Student profile deleted')
	}
	async removeParent({item}){
		const _ = this;
		let response = await Model.removeParent(_.parentInfo['parentId']);
		if (!response) return;
		_.f(`TR[user-id="${parentId}"]`).remove();
		G_Bus.trigger('modaler','closeModal',{item})
		_.showSuccessPopup('Parent profile deleted')
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

		setTimeout(()=>{input.type = 'password'},2000)
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
		if(type == 'assign'){
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
	async handleAddingSteps({addingStep}) {
		const _ = this;
		if(!_.initedUpdate){
			let wizardData = await Model.getWizardData();
			_.stepsObj = {
				1: _.addingStepOne.bind(_,wizardData),
				2: _.addingStepTwo.bind(_,wizardData),
				3: _.addingStepThree.bind(_,wizardData),
				4: _.addingStepFour.bind(_,wizardData),
				5: _.addingStepFive.bind(_),
				6: _.addingStepSix.bind(_)
			};
			return void 0;
		}
		let
			addingBody = _.f('#addingForm .adding-body');
		if (!addingBody) return void 0;
		addingBody.innerHTML = '<img src="/img/loader.gif">';
		_.clear(addingBody);
		
		if(addingStep == _.minStep){
			_.setCancelBtn();
		}else{
			_.setPrevBtn();
		}
		if(addingStep == _.maxStep){
			_.setSubmitBtn();
		}else{
			_.setNextBtn();
		}
		if(addingStep == 1 ){
			let stepOneData = await Model.wizardData;
			if (!_.studentInfo.course) _['studentInfo'].course = stepOneData['courses'][0]['_id'];
			if (!_.studentInfo.level) _['studentInfo'].level = stepOneData['courses'][0]['levels'][0]['_id'];
			if (!_['metaInfo'].course) _['metaInfo'].course = stepOneData['courses'][0]['title'];
			if (!_['metaInfo'].level) _['metaInfo'].level = stepOneData['courses'][0]['levels'][0]['title'];
		}
		addingBody.append( _.markup( _.stepsObj[ addingStep ]() ) );
		
		_.f('#addingForm .adding-list-item.active').classList.remove('active');
		_.f(`#addingForm .adding-list-item:nth-child(${addingStep})`).classList.add('active');
	}
	async handleAssignSteps({assignStep}) {
		const _ = this;
		if(!_.initedUpdate){
			let wizardData = await Model.getWizardData();
			_.stepsAssignObj = {
				1: _.addingStepOne.bind(_,wizardData),
				2: _.assignStepTwo.bind(_,wizardData),
				3: _.addingStepFive.bind(_),
				4: _.assignStepFour.bind(_),
			};
			return void 0;
		}
		let
			addingBody = _.f('#assignForm .adding-body');
		if (!addingBody) return void 0;
		_.clear(addingBody);
		
		if (assignStep === 1) {
			let wizardData = await Model.getWizardData();
			_['studentInfo'].course = wizardData['courses'][0]['_id'];
			_['studentInfo'].level = wizardData['courses'][0]['levels'][0]['_id'];
			_['metaInfo'].course = wizardData['courses'][0]['title'];
			_['metaInfo'].level = wizardData['courses'][0]['levels'][0]['title'];
		}
		if ( assignStep == _.minStep){
			_.setCancelBtn('assign');
		}else{
			_.setPrevBtn('assign');
		}
		if ( assignStep == _.maxAssignStep){
			_.setSubmitBtn('assign');
		}else{
			_.setNextBtn('assign');
		}
		addingBody.append( _.markup( _.stepsAssignObj[ assignStep ]() ) );
		
		_.f('#assignForm .adding-list-item.active').classList.remove('active');
		_.f(`#assignForm .adding-list-item:nth-child(${ assignStep })`).classList.add('active');
	}
	
	async init(){
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep'] );
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ] );
	}
	
}