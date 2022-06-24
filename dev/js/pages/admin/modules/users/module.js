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
		_.set({
			addingStep : 1
		});
		G_Bus
			.on(_,['addStudent','changeAddingStep']);
	}
	
	changeAddingStep({item}) {
		const _ = this;
		if(_.maxStep > _._$.addingStep)	_._$.addingStep++;
	}
	
	addStudent({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	}
	
	
	init() {
		const _ = this;
		_._( () => {
			if(!_.initedUpdate) return void 0;
			let addingBody = _.f('.adding-body');
			_.clear(addingBody)
			_.f('.adding-list-item.active').classList.remove('active');
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
			
		},['addingStep'])
		
	}
	
}