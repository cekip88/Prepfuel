import { G_Bus }    from "../../../../libs/G_Control.js";
import { Model }    from "./model.js";
import {StudentPage} from "../../student.page.js";

export class ScheduleModule extends StudentPage{
	constructor() {
		super();
		this.moduleStructure = {
			'header':'simpleHeader',
			'header-tabs': null,
			//'body-tabs':'dashboard-tabs',
			'body':'body',
		};
	}
	define(){
		const _ = this;
		_.componentName = 'Schedule';
		_.set({
			currentStep: 1,
			daysPerWeek: [],
			numberOfQuestions: 5,
			totalQuestionsCnt : 0
		});
		_.minStep = 1;
		_.maxStep = 3;
		_.testDate = new Date();
		
		_.practiceTests = [];
		_.practiceAt = '4:00 PM';
		
		
		_.questionsTarget= 10;
		_.totalWeeks = 15;
		
		
		_.practiceRowsCnt = 0;
		_.practiceRows = [];
		G_Bus.on(_, [
			'changeSchedulePage',
			'changeScheduleDate',
			'addPracticeRow',
			'removePracticeRow',
			'changeDay',
			'changeNumberOfQuestions',
			'finishSchedule','domReady'
		]);
	}
	
	domReady(){
		const _ = this;
	}
	
	
	finishSchedule({item}) {
		const _ = this;
		Model.finishSchedule({
			testDate: _.testDate,
			practiceDays: _._$.daysPerWeek,
			practiceTime: _.practiceAt,
			practiceSkill: _._$.numberOfQuestions,
			practiceTests: _.practiceTests
		});
	}
	changeNumberOfQuestions({item}) {
		const _ = this;
		_._$.numberOfQuestions = parseInt(item.value[0]);
	}
	changeDay({item}) {
		const _ = this;
		let checkedValues = item.value;
		_._$.daysPerWeek = checkedValues;
	}
	addPracticeRow({item}){
		const _ = this;
		_.practiceRowsCnt++;
		if(_.practiceRowsCnt > 4) {
			_.practiceRowsCnt = 4;
			return void 0;
		}
		let
			rowsCont = _.f('#shedule-rows');
		rowsCont.append(_.markup(_.practiceTestRow()));
		
	}
	removePracticeRow({item}){
		const _ = this;
	}
	changeSchedulePage({item}){
		const _ = this;
		let direction = item.getAttribute('direction');

		if(direction === 'next'){
			if(_._$.currentStep < _.maxStep){
				_._$.currentStep++;
			}
		} else {
			if(_._$.currentStep > _.minStep){
				_._$.currentStep--;
			}
		}
	}
	changeScheduleDate({item}){
		this.testDate = item.value;
	}
	
	changeBtnToCreate() {
		const _ = this;
		let btn = 	_.f('#schedule-next-btn');
		btn.textContent = 'Create';
		btn.setAttribute('data-click',`${this.componentName}:finishSchedule`);
	}
	changeBtnToNext() {
		const _ = this;
		let btn = 	_.f('#schedule-next-btn');
		btn.textContent = 'Next';
		btn.setAttribute('data-click',`${this.componentName}:changeSchedulePage`);
	}
	
	init(){
		const _ = this;
		_._( ({currentStep})=>{
			if(!_.initedUpdate){
			//	_.innerCont = _.f('.test-inner');
				return void 0;
			}
			_.innerCont = _.f('.test-inner');
			_.f('#step-item').textContent = currentStep;
			if(currentStep  === 1 ){
				_.innerCont.innerHTML = _.stepOneTpl();
			}
			if(currentStep  === 2 ){
				let
					scheduleDate = _.f('#schedule-date');
				if(!_.testDate){
					scheduleDate.doValidate();
					currentStep--;
				}else{
					_.innerCont.innerHTML = _.stepTwoTpl();
				}
			}
			if(currentStep  === 3 ){
				let practiceRows = _.f('#shedule-rows .practice-schedule-row');
				_.practiceRows = [];
				_.practiceTests = [];
				for(let row of practiceRows){
					_.practiceRows.push(row);
					let
						date = row.querySelector('.schedule-date').value,
						time = row.querySelector('.schedule-time').value;

					_.practiceTests.push({date:`${date}T${time}:00Z`});
				}
				_.innerCont.innerHTML = _.stepThreeTpl();
				_.changeBtnToCreate();
			}
			
			_.f('.pagination-links .active').classList.remove('active');
			_.f(`.pagination-links .pagination-link:nth-child(${currentStep-1})`).classList.add('done');
			_.f(`.pagination-links .pagination-link:nth-child(${currentStep})`).classList.add('active');
			
			
		},['currentStep']);
		_._(({daysPerWeek,numberOfQuestions}) => {
			if(!_.initedUpdate) {
				return void 0;
			}
			_.f('#daysPerWeek').textContent = daysPerWeek.length;
			_.f('#totalQuestionsCnt').textContent = daysPerWeek.length * numberOfQuestions;
		}, ["daysPerWeek",'numberOfQuestions']);
	}
}