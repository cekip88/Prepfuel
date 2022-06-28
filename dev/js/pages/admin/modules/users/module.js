import {G_Bus} from "../../../../libs/G_Control.js";
import {Model} from "./model.js";
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
		_.studentsInfo = await Model.getUsers('student');
		console.log(_.studentsInfo);
	}
	define() {
		const _ = this;
		_.componentName = 'UsersModule';
		_.maxStep = 6;
		_.maxAssignStep = 4;
		_.minStep = 1;

		_.subSection = 'Students';

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
				'domReady'
			]);
	}
	handleErrors({method,data}){
		const _ = this;
		if( method == 'getUsers'){
			console.log('Users not found ',data);
		}
	}
	
	domReady(){
		const _ = this;
		if (_.subSection === 'Students') {
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
	async usersTableFill(){
		const _ = this;
		let tbody = _.f('.tbl-body');
		tbody.append(..._.usersBodyRowsTpl(_.studentsInfo));
		_.connectTableHead();
	}
	connectTableHead(){
		const _ = this;
		let
			cont = _.f('.tbl'),
			head = cont.querySelector('.tbl-head'),
			ths = head.querySelectorAll('.tbl-item'),
			table = cont.querySelector('TABLE'),
			row = table.querySelector('TR'),
			tds = row.querySelectorAll('.tbl-item');

		ths.forEach( (item,index) =>		item.style = `width:${tds[index].getBoundingClientRect().width}px;`)
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