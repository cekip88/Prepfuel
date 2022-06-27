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
	define() {
		const _ = this;
		_.componentName = 'UsersModule';
		_.maxStep = 6;
		_.maxAssignStep = 4;
		_.minStep = 1;
		_.set({
			addingStep : 1,
			assignStep : 1
		});
		G_Bus
			.on(_,[
				'addStudent','changeNextStep','showAssignPopup',
				'changePrevStep','jumpToStep',
				'showProfile','showRemovePopup','removeCourse',
				'changeAssignPrevStep','changeAssignNextStep','jumpToAssignStep'
			]);
	}
	changeAssignNextStep({item}){
		const _ = this;
		if(_.maxAssignStep > _._$.assignStep)	_._$.assignStep++;
	}
	changeAssignPrevStep({item}){
		const _ = this;
		if(_._$.assignStep > _.minStep)	_._$.assignStep--;
	}
	changeNextStep({item}) {
		const _ = this;
		if(_.maxStep > _._$.addingStep)	_._$.addingStep++;
	}
	changePrevStep({item}) {
		const _ = this;
		if(_._$.addingStep > _.minStep)	_._$.addingStep--;
	}
	jumpToStep({item}) {
		const _ = this;
		let step = parseInt(item.getAttribute('step'));
		_._$.addingStep = step;
	}
	jumpToAssignStep({item}) {
		const _ = this;
		let step = parseInt(item.getAttribute('step'));
		_._$.assignStep = step;
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
	
	init() {
		const _ = this;
		_._( () => {
			if(!_.initedUpdate) return void 0;
			let addingBody = _.f('.adding-body');
			_.clear(addingBody)
			_.f('.adding-list-item.active').classList.remove('active');
			if(_._$.addingStep == 1){
				addingBody.append(_.markup(_.addingStepOne()));
			}
			if(_._$.addingStep == 2){
				addingBody.append(_.markup(_.addingStepTwo()));
			}
			if(_._$.addingStep == 3){
				addingBody.append(_.markup(_.addingStepThree()))
			}
			if(_._$.addingStep == 4){
				addingBody.append(_.markup(_.addingStepFour()))
			}
			if(_._$.addingStep == 5){
				addingBody.append(_.markup(_.addingStepFive()));
			}
			if(_._$.addingStep == 6){
				addingBody.append(_.markup(_.addingStepSix()))
			}
			_.f(`.adding-list-item:nth-child(${_._$.addingStep})`).classList.add('active');
			
		},['addingStep']);
		
		_._( ()=>{
			if(!_.initedUpdate) return void 0;
			let addingBody = _.f('.adding-body');
			_.clear(addingBody)
			_.f('.adding-list-item.active').classList.remove('active');
			if(_._$.assignStep == 1){
				addingBody.append(_.markup(_.addingStepOne()));
			}
			if(_._$.assignStep == 2){
				addingBody.append(_.markup(_.assignStepTwo()));
			}
			if(_._$.assignStep == 3){
				addingBody.append(_.markup(_.addingStepFive()))
			}
			if(_._$.assignStep == 4){
				addingBody.append(_.markup(_.assignStepFour()))
			}
			_.f(`.adding-list-item:nth-child(${_._$.assignStep})`).classList.add('active');
		},['assignStep']);
	}
	
}