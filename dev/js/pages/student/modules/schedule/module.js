import { G_Bus }    from "../../../../libs/G_Control.js";
import { G }        from "../../../../libs/G.js";
import { Model }    from "./model.js";

export class ScheduleModule extends G{
	define(){
		const _ = this;
		_.componentName = 'StudentPage';
		_.set({
			currentStep: 1,
			daysPerWeek: [],
			numberOfQuestions: 5,
			totalQuestionsCnt : 0
		});
		_.minStep = 1;
		_.maxStep = 3;
		_.testDate = '';
		
		_.practiceDates = [];
		_.practiceAt = '4:00 PM';
		
		
		_.questionsTarget= 10;
		_.totalWeeks = 15;
		
		
		_.practiceRowsCnt = 0;
		_.practiceRows = [];
		G_Bus.on(_,[
			'changeSchedulePage',
			'changeScheduleDate',
			'addPracticeRow',
			'removePracticeRow',
			'changeDay',
			'changeNumberOfQuestions',
			'finishSchedule'
		]);
	}
	
	finishSchedule({item}) {
		const _ = this;
		Model.finishSchedule({
			date: _.testDate,
			days: _._$.daysPerWeek,
			time: _.practiceAt,
			skill: _._$.numberOfQuestions,
			practiceDates: _.practiceDates
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
		_._( ()=>{
			if(!_.initedUpdate){
				_.innerCont = _.f('.test-inner');
				return void 0;
			}
			//
			_.f('#step-item').textContent = _._$.currentStep;
			if(_._$.currentStep  === 1 ){
				_.innerCont.innerHTML = _.stepOneTpl();
			}
			if(_._$.currentStep  === 2 ){
				let
					scheduleDate = _.f('#schedule-date');
				if(!_.testDate){
					scheduleDate.doValidate();
					_._$.currentStep--;
				}else{
					_.innerCont.innerHTML = _.stepTwoTpl();
				}
			}
			if(_._$.currentStep  === 3 ){
				let practiceRows = _.f('#shedule-rows .practice-schedule-row');
				_.practiceRows = [];
				_.practiceDates = [];
				for(let row of practiceRows){
					_.practiceRows.push(row);
					let
						date = row.querySelector('.schedule-date').value,
						time = row.querySelector('.schedule-time').value;
					_.practiceDates.push(`${date}T${time}:00Z`);
				}
				_.innerCont.innerHTML = _.stepThreeTpl();
				_.changeBtnToCreate();
			}
			
			_.f('.pagination-links .active').classList.remove('active');
			_.f(`.pagination-links .pagination-link:nth-child(${_._$.currentStep-1})`).classList.add('done');
			_.f(`.pagination-links .pagination-link:nth-child(${_._$.currentStep})`).classList.add('active');
			
			
		},['currentStep']);
		_._(() => {
			if(!_.initedUpdate) {
				return void 0;
			}
			_.f('#daysPerWeek').textContent = _._$.daysPerWeek.length;
			_.f('#totalQuestionsCnt').textContent = _._$.daysPerWeek.length * _._$.numberOfQuestions;
		}, ["daysPerWeek",'numberOfQuestions']);
		
	}
	render(){
		return this.createscheduleTpl();
	}
}