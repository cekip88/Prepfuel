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
	}
	define() {
		const _ = this;
		_.componentName = 'UsersModule';
		_.maxStep = 6;
		_.maxAssignStep = 4;
		_.minStep = 1;
		_.coursePos = 0;
		_.studentInfo = {};
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
				'domReady','fillData',
				'assignParent','addNewParent',
				'changeTestType','changeStudentLevel',
				'fillStudentInfo','createStudent'
			]);
	}
	async createStudent(){
		const _ = this;
		console.log(await Model.createStudent(_.studentInfo));
	}
	fillStudentInfo({item}){
		const _ = this;
		let
			prop = item.getAttribute('name'),
			value = item.value;
		if( typeof value == 'object'){
			value = value+'';
			console.log(value);
		}
		_['studentInfo'][prop] = value;
	}
	fillData({handlers,data}){
		const _ = this;
		_[handlers](data);
	}
	handleErrors({method,data}){
		const _ = this;
		console.log(method,data);
		if( method == 'getUsers'){
			console.log('Users not found ',data);
		}
	}
	async addStudent({item}){
		const _ = this;
		let stepOneData = await Model.addingStepOneData();
		_['studentInfo'].course = stepOneData[0]['_id'];
		_['studentInfo'].level = stepOneData[0]['levels'][0]['_id'];
		_.f('#addingForm').querySelector('.adding-body').innerHTML = _.addingStepOne(stepOneData);
		
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	}
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
		levelButtons.innerHTML = _.levelButtons(stepData[pos]);
	}
	async domReady(){
		const _ = this;
		if (_.subSection === 'student') {
			let tableData = await Model.getUsers(_.subSection);
			_.usersTableFill(tableData);
			//
		}
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
	flexible(){
		const _ = this;
		if(_.subSection === 'students') {
			return 'usersBody';
		} else if (_.subSection === 'parents') {
			return '';
		} else if (_.subSection === 'payments') {
			return '';
		}
	}

	async usersTableFill(usersData){
		const _ = this;
		let
			tbody = _.f('.tbl-body');
		_.clear(tbody);
		_.fillDataByClass({className:`.gusers-count`,data:`${usersData ? usersData['total'] : 0}`});
		if(!usersData) {
			return void 'no users data';
		}
		
		let
			tableData = _.usersBodyRowsTpl(usersData);
		tbody.append(...tableData);
		_.connectTableHead();
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

	addNewParent({item}){
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');
		cont.append(_.markup(_.assignNewParent()))
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
		_.parentsTableFill();
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
	async parentsTableFill(){
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
	async handleAddingSteps(){
		const _ = this;
		if(!_.initedUpdate){
			return void 0;
		}
		let
			addingBody = _.f('.adding-body');
			addingBody.innerHTML = '<img src="/img/loader.gif">';
		let	stepsObj = {
				1: _.addingStepOne.bind(_,await Model.addingStepOneData()),
				2: _.addingStepTwo.bind(_,await Model.addingStepTwoData()),
				3: _.addingStepThree.bind(_,await Model.addingStepThreeData()),
				4: _.addingStepFour.bind(_,await Model.addingStepFourData()),
				5: _.addingStepFive.bind(_),
				6: _.addingStepSix.bind(_)
			};
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
		addingBody.append( _.markup(stepsObj[ _._$.addingStep ]()) );
		
		_.f('.adding-list-item.active').classList.remove('active');
		_.f(`.adding-list-item:nth-child(${_._$.addingStep})`).classList.add('active');
	}
	handleAssignSteps(){
		const _ = this;
		if(!_.initedUpdate) return void 0;
		let
		addingBody = _.f('.adding-body'),
		stepsObj = {
			1: _.addingStepOne(),
			2: _.assignStepTwo(),
			3: _.addingStepFive(),
			4: _.assignStepFour(),
		};
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
		
		addingBody.append( _.markup( stepsObj[ _._$.assignStep ] ) );
		
		_.f('.adding-list-item.active').classList.remove('active');
		_.f(`.adding-list-item:nth-child(${ _._$.assignStep })`).classList.add('active');
	}
	
	createdAtFormat(value,format = 'month DD, YYYY'){
		value = value.split('T')[0].split('-');
		let
			year = value[0],
			month = value[1],
			day = value[2],
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

		let res = format;
		res = res.replace('DD',day)
		res = res.replace('MM',month)
		res = res.replace('YYYY',year)
		res = res.replace('month',months[parseInt(month) - 1]);
		return res;
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

	
	
	showAssignPopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#assignForm'});
	}

	async showProfile({item}){
		const _ = this;
		_.subSection = item.getAttribute('section');
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body': 'profile',
		};
		await _.render();
	}
	
	showRemovePopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removeForm','closeBtn':'hide'});
	}
	
	removeCourse({item}) {
		const _ = this;
		let courseInfo = _.f('.student-profile-course-info');
		_.clear(courseInfo);
		courseInfo.innerHTML = _.emptyCourseInfo();
		G_Bus.trigger('modaler','closeModal');
	}
	showSuccessPopup(){
		const _ =  this;
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
	}
	setSubmitBtn() {
		const _ = this;
		let stepBtn = _.f('.step-next-btn');
		stepBtn.textContent = 'Submit';
		stepBtn.setAttribute('data-click',`${_.componentName}:createStudent`);
	}
	
	
	init(){
		const _ = this;
		_._( _.handleAddingSteps.bind(_),[ 'addingStep' ]);
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ]);
		
		
		
	}
	
}