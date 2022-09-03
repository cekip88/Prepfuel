import { G_Bus }    from "../../../../libs/G_Control.js";
import { Model }    from "./model.js";
import {StudentPage} from "../../student.page.js";

export class ScheduleModule extends StudentPage{
	constructor() {
		super();
		const _ = this;
		_.me = JSON.parse(localStorage.getItem('me'));
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
		_.datePicked = true;
		
		
		_.questionsTarget= 10;
		_.totalWeeks = 15;
		
		
		_.practiceRowsCnt = 0;
		_.practiceRows = [];
		G_Bus.on(_, [
			'changeSchedulePage',
			'changeScheduleDate',
			'changePracticeTime',
			'addPracticeRow',
			'removePracticeRow',
			'changeDay',
			'changeNumberOfQuestions',
			'finishSchedule','domReady',
			'skipTestDate',
		]);
	}
	
	domReady(){
		const _ = this;
	}
	
	finishSchedule({item}) {
		const _ = this;
		Model.finishSchedule({
			testDate: _.datePicked ? _.testDate : null,
			practiceDays: _._$.daysPerWeek,
			practiceTime: _.practiceAt.toString(),
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
		if(_.practiceRowsCnt === 4){
			item.setAttribute('style','display:none;')
		}
		let rowsCont = _.f('#shedule-rows');
		rowsCont.append(_.markup(_.practiceTestRow()));
	}
	removePracticeRow({item}){
		const _ = this;
		_.practiceRowsCnt--;
		item.closest('.practice-schedule-row').remove();
		_.f('.button-lightblue').removeAttribute('style');
	}
	changeSchedulePage({item}){
		const _ = this;
		let direction = item.getAttribute('direction');

		if(direction === 'next'){
			if(_._$.currentStep < _.maxStep){
				if (_._$.currentStep === 2) {
					if (_.practiceRowsCnt) _._$.currentStep++;
				} else _._$.currentStep++;
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
	changePracticeTime({item}){
		this.practiceAt = item.value;
	}
	
	changeBtnToCreate() {
		const _ = this;
		let btn = _.f('#schedule-next-btn');
		btn.textContent = 'Create';
		btn.setAttribute('data-click',`${this.componentName}:finishSchedule`);
	}
	changeBtnToNext() {
		const _ = this;
		let btn = _.f('#schedule-next-btn');
		btn.textContent = 'Next';
		btn.setAttribute('data-click',`${this.componentName}:changeSchedulePage`);
	}
	skipTestDate({item}){
		const _ = this;
		let dateInput = _.f('#schedule-date');
		if (item.checked) {
			dateInput.setAttribute('disabled',true);
			_.datePicked = false;
		} else {
			dateInput.removeAttribute('disabled');
			_.datePicked = true;
		}
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
			if(currentStep === 1 ){
				let practiceRows = document.querySelectorAll('#shedule-rows .practice-schedule-row');
				_.practiceRows = [];
				_.practiceTests = [];
				for(let row of practiceRows){
					_.practiceRows.push(row);
					let
						date = row.querySelector('.schedule-date').value,
						time = row.querySelector('.schedule-time').value;

					_.practiceTests.push({date:`${date}T${time}:00Z`});
				}
				_.innerCont.innerHTML = _.stepOneTpl();
				_.changeBtnToNext();
			}
			if(currentStep === 2 ){
				let dateInput = _.f('#schedule-date');
				_.testDate = dateInput ? dateInput.value : _.testDate;
				_.innerCont.innerHTML = _.stepTwoTpl();
				_.changeBtnToNext();
			}
			if(currentStep === 3 ){
				let practiceRows = document.querySelectorAll('#shedule-rows .practice-schedule-row');
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

			let pagination = _.f('.pagination-links'),
				prevPaginationLink = pagination.querySelector(`.pagination-link:nth-child(${currentStep - 1})`);
			pagination.querySelector('.active').classList.remove('active');
			prevPaginationLink ? prevPaginationLink.classList.add('done') : '';
			pagination.querySelector(`.pagination-link:nth-child(${currentStep})`).classList.add('active');
			
			
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