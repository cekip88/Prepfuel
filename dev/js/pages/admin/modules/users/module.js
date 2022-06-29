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
				'assignParent','addNewParent'
			]);
	}
	fillData({handlers,data}){
		const _ = this;
		_[handlers](data);
	}
	handleErrors({method,data}){
		const _ = this;
		if( method == 'getUsers'){
			console.log('Users not found ',data);
		}
	}
	
	async domReady(){
		const _ = this;
		
		_.fillBlock('.users-page');
		if (_.subSection === 'student') {
			_.usersTableFill();
			//
		}
		_._( _.handleAddingSteps.bind(_),[ 'addingStep' ]);
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ]);
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
	async fillBlock(block){
		const _ = this;
		let content = _.f(`${block} .users-count`);
		content.classList.add('loader-parent')
		content.innerHTML = "<img src='/img/loader.gif' class='loader'>";
		let usersData = await Model.getUsers(_.subSection);
		content.textContent = `(${usersData['total']})`
	}
	async usersTableFill(){
		const _ = this;
		let
			tbody = _.f('.tbl-body');
		tbody.innerHTML = "<img src='/img/loader.gif' class='loader'>";
		let
			usersData = await Model.getUsers(_.subSection),
			tableData = _.usersBodyRowsTpl(usersData);
		_.clear(tbody);
		tbody.append(...tableData);
		_.connectTableHead();


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
			row = table.querySelector('TR'),
			tds = row.querySelectorAll('.tbl-item');
		ths.forEach(function (item,index){
			item.style = `width:${tds[index].getBoundingClientRect().width}px;`
		})
	}

	addNewParent({item}){
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.append(_.markup(_.assignNewParent()))
	}
	assignParent({item}){
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.add('adding-assign-body-full')
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
	
	handleAddingSteps(){
		const _ = this;
		if(!_.initedUpdate) return void 0;
		let
			addingBody = _.f('.adding-body'),
			stepsObj = {
				1: _.addingStepOne(),
				2: _.addingStepTwo(),
				3: _.addingStepThree(),
				4: _.addingStepFour(),
				5: _.addingStepFive(),
				6: _.addingStepSix()
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
		addingBody.append( _.markup(stepsObj[ _._$.addingStep ]) );
		
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

	addStudent({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
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
		stepBtn.setAttribute('type',`adding`);
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
	}
	
	
	init(){}
	
}