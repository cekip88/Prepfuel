export const view = {
	header(){
		return this.headerBlock.render('simple');
	},
	body(){
		const _ = this;
		return `
			<section class="test">
				<div class="section">
					<div class="section-header">
						<h2 class="title">Create your practice schedule</h2>
						<button class="button-white" data-click="StudentPage:changeSection" section="/student/dashboard">
							<span>Exit creating your schedule</span>
						</button>
					</div>
				</div>
				<div class="section">
					<div class="block test-block">
						<div class="test-header">
							<h3 class="block-title test-title"><span>Step <i id="step-item">1</i> of 3 - Choose your test date</span></h3>
						</div>
						<div class="test-inner narrow">
								${_.stepOneTpl()}
						</div>
					<div class="test-footer">
						<div class="pagination pagination-top">
							<div class="pagination-info"><span>${_.maxStep} steps</span></div>
							<div class="pagination-links">
								<a class="pagination-link active" href="#"><span>1</span></a>
								<a class="pagination-link" href="#"><span>2</span></a>
								<a class="pagination-link" href="#"><span>3</span></a>
							</div>
						</div>
						<button type='button' class="button" id="schedule-prev-btn" data-click="${_.componentName}:changeSchedulePage" direction="back">
							<span>Back</span>
						</button>
						<button type='button' class="button-blue " id="schedule-next-btn" data-click="${_.componentName}:changeSchedulePage" direction="next">
							<span>Next</span>
						</button>
					</div>
				</div>
			</div>
			</section>
		`;
	},
	stepOneTpl(){
		const _ = this;

		let curPlanTitle = '';
		if(_.me.student && _.me.student.currentPlan) curPlanTitle = _.me.student.currentPlan.course.title;
		else if (_.me.currentPlan) curPlanTitle = _.me.currentPlan.course.title;

		return `
			<h4 class="test-subtitle"><span>Choose your test date</span></h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">What is your test date?</p>
			</div>
			<div class="practice-schedule-row aifs">
				<div class="practice-schedule-row">
					<div class="blue-icon"><svg><use xlink:href="#badge"></use></svg></div>
					<h5 class="practice-schedule-title">Your ${curPlanTitle} Date</h5>
				</div>
				<div class="practice-schedule-date" style="padding-top: 3px;">
					<div class="adding-inpt adding-radio-row">
						<g-input 
							type="date" 
							class="input-date" 
							icon=false 
							id='schedule-date' 
							placeholder="Choose your test date" 
							value="${_.testDate}" 
							format="weekDay, month DD, YYYY" 
							${!_.datePicked ? "disabled='true'" : ''}
							data-change="${_.componentName}:changeScheduleDate"
						></g-input>
					</div>
					<div class="adding-inpt">
						<div class="form-label-row">
							<input 
								type="checkbox" 
								id="have_yet" 
								class="adding-radio" 
								name="registered" 
								data-change="${_.componentName}:skipTestDate" 
								${!_.datePicked ? 'checked' : ''}
							>
							<label class="form-label adding-label-have adding-label-checkbox" for="have_yet">Skip date</label>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	stepTwoTpl(){
		const _ = this;
		let rows = '';
		for (let item of _.practiceTests) {
			rows += _.practiceTestRow(item)
		}
		return `
			<h4 class="test-subtitle"><span>Practice test days</span></h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">Preparing for the ${_.me.student.currentPlan ? _.me.student.currentPlan.course.title : ''} is like preparing for a marathon. You wouldn’t wait until the big day to try running a marathon for the first time!</p>
				<p class="test-subtitle small">&nbsp;</p>
				<p class="test-subtitle small">With 15 weeks left until your test, we recommend that you take at least 6 full practice tests (set aside 3-4 hours each) before test day.</p>
				<p class="test-subtitle small">For more information on planning your practice, you can checkout our Tips and Strategies section.</p>
			</div>
			<div class="practice-schedule-rows">
				<div id="schedule-rows">
					${rows}
				</div>
				<div class="practice-schedule-row">
					<div class="blue-icon">
						<svg>
							<use xlink:href="#badge"></use>
						</svg>
					</div>
					<h5 class="practice-schedule-title">Your ${_.me.student.currentPlan ? _.me.student.currentPlan.course.title : ''} Date</h5>
					<div class="practice-schedule-date"><span>${_.datePicked ? _.testDate : 'Date skipped'}</span></div>
				</div>
			</div>
			<button class="button-lightblue" data-click="${_.componentName}:addPracticeRow" ${_.practiceRowsCnt == 4 ? 'style="display:none;"' : ''}>
				<svg class="button-icon">
				<use xlink:href="#plus"></use>
				</svg>
				<span>Schedule more practice tests</span>
			</button>
		`;
	},
	stepThreeTpl(){
		const _ = this;
		let days = [
			{"value":"S","text":"S","disabled":true},
			{"value":"M","text":"M"},
			{"value":"T","text":"T"},
			{"value":"W","text":"W"},
			{"value":"Th","text":"Th"},
			{"value":"F","text":"F"},
			{"value":"Sa","text":"Sa","disabled":true}];
		let times = [
			{"text":"01:00 PM","value":"01:00 PM"},
			{"text":"02:00 PM","value":"02:00 PM"},
			{"text":"03:00 PM","value":"03:00 PM"},
			{"text":"04:00 PM","value":"04:00 PM"},
			{"text":"05:00 PM","value":"05:00 PM"},
			{"text":"06:00 PM","value":"06:00 PM"},
			{"text":"07:00 PM","value":"07:00 PM"},
			{"text":"08:00 PM","value":"08:00 PM","active":true},
			{"text":"09:00 PM","value":"09:00 PM"},
			{"text":"10:00 PM","value":"10:00 PM"},
			{"text":"11:00 PM","value":"11:00 PM"},
			{"text":"12:00 AM","value":"12:00 AM"},
			{"text":"01:00 AM","value":"01:00 AM"},
			{"text":"02:00 AM","value":"02:00 AM"},
			{"text":"03:00 AM","value":"03:00 AM"},
			{"text":"04:00 AM","value":"04:00 AM"},
			{"text":"05:00 AM","value":"05:00 AM"},
			{"text":"06:00 AM","value":"06:00 AM"},
			{"text":"07:00 AM","value":"07:00 AM"},
			{"text":"08:00 AM","value":"08:00 AM"},
			{"text":"09:00 AM","value":"09:00 AM"},
			{"text":"10:00 AM","value":"10:00 AM"},
			{"text":"11:00 AM","value":"11:00 AM"},
			{"text":"12:00 PM","value":"12:00 PM"},
		];
		let questions = [
			{"text":"5 questions","value":5,"active":true},
			{"text":"10 questions","value":10}
		];
		return `
			<h4 class="test-subtitle">
				<span>Skill practice plan</span>
			</h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">When preparing for a marathon, you also have to do sprints, strength work, and other exercises. For the ${_.me.student.currentPlan ? _.me.student.currentPlan.course.title : ''}, in addition to practice tests, you will also work on individual skills and short timed "mini-sections".</p>
				<p class="test-subtitle small">&nbsp;</p>
				<p class="test-subtitle small">With 15 weeks left until your test, we recommend you do skill practice 1.25 hours/week (hardcore: 3-5 hours/week).</p>
				<p class="test-subtitle small">15 minutes × 5 days = 1.25 hours/week</p>
				<p class="test-subtitle small">(Recommended)</p>
			</div>
			<div class="practice-schedule-rows">
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Practice on</h5>
					<div class="practice-schedule-right">
						<g-input 
							class="inpt-checkbox inpt-days" 
							data-change="${_.componentName}:changeDay" 
							type="checkbox" 
							name="day" 
							classname="inpt-days" 
							items='${JSON.stringify(days)}'
						></g-input>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Number of questions</h5>
					<div class="practice-schedule-right">
						<g-select class="g-select-gray" 
							disabled 
							data-change="${_.componentName}:changeNumberOfQuestions" 
							items='${JSON.stringify(questions)}' 
							value="5" 
							classname="g-select-gray" 
						></g-select>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Practice at</h5>
					<div class="practice-schedule-right">
						<g-select 
							class="g-select-gray" 
							data-change="${_.componentName}:changePracticeTime"
							items='${JSON.stringify(times)}' 
							classname="g-select-gray"
						></g-select>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Daily target</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title">10 questions</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Days per week</h5>
					<div class="practice-schedule-dots"></div>
					<span class="practice-schedule-title"><i id="daysPerWeek">${_._$.daysPerWeek.length}</i> days / week</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Total weeks</h5>
					<div class="practice-schedule-dots"></div>
					<span class="practice-schedule-title">15 weeks</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Questions completed to date</h5>
					<div class="practice-schedule-dots"></div>
					<span class="practice-schedule-title"><i id="totalQuestionsCnt">${_._$.totalQuestionsCnt}</i> questions</span>
				</div>
				<div class="practice-schedule-row">
					<div class="line"></div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title bold">Goal (total practice until test date)</h5>
					<div class="practice-schedule-dots"></div>
					<span class="practice-schedule-title">50 questions</span>
				</div>
			</div>
		`;
	},
	practiceTestRow(item = null){
		const _ = this;
		let dateStr = _.startDate;
		let options = [
			{"text":"01:00 PM","value":"01:00 PM"},
			{"text":"02:00 PM","value":"02:00 PM"},
			{"text":"03:00 PM","value":"03:00 PM"},
			{"text":"04:00 PM","value":"04:00 PM"},
			{"text":"05:00 PM","value":"05:00 PM"},
			{"text":"06:00 PM","value":"06:00 PM"},
			{"text":"07:00 PM","value":"07:00 PM"},
			{"text":"08:00 PM","value":"08:00 PM"},
			{"text":"09:00 PM","value":"09:00 PM"},
			{"text":"10:00 PM","value":"10:00 PM"},
			{"text":"11:00 PM","value":"11:00 PM"},
			{"text":"12:00 AM","value":"12:00 AM"},
			{"text":"01:00 AM","value":"01:00 AM"},
			{"text":"02:00 AM","value":"02:00 AM"},
			{"text":"03:00 AM","value":"03:00 AM"},
			{"text":"04:00 AM","value":"04:00 AM"},
			{"text":"05:00 AM","value":"05:00 AM"},
			{"text":"06:00 AM","value":"06:00 AM"},
			{"text":"07:00 AM","value":"07:00 AM"},
			{"text":"08:00 AM","value":"08:00 AM"},
			{"text":"09:00 AM","value":"09:00 AM"},
			{"text":"10:00 AM","value":"10:00 AM"},
			{"text":"11:00 AM","value":"11:00 AM"},
			{"text":"12:00 PM","value":"12:00 PM"},
		];

		if (item) {
			let
				dateData = item.date.split('T')[0],
				timeData = item.date.split('T')[1].substr(0,8),
				date = new Date(dateData);
			dateStr = `${date.getFullYear()}-${(date.getMonth() + 1 < 10) ? '0' + date.getMonth() + 1 : date.getMonth() + 1}-${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}`
			for (let unit of options) {
				if (unit.value == timeData) {
					unit.active = true;
					break;
				}
			}
		}

		return `
			<div class="practice-schedule-row">
				<div class="blue-icon reverse">
					<svg>
						<use xlink:href="#badge"></use>
					</svg>
				</div>
				<h5 class="practice-schedule-title">Practice test ${_.practiceRowsCnt}</h5>
				<div class="practice-schedule-date">
					<g-input type="date" class="input-date schedule-date" icon='false' format="month DD, YYYY" value="${dateStr}"></g-input>
				</div>
				<div class="practice-schedule-date">
					<g-select class="select schedule-time" title="Select time" items='${JSON.stringify(options)}' classname="g-select-gray">
				</div>
				<button class="remove-btn" data-click="${_.componentName}:removePracticeRow">
					<span>Remove</span>
					<svg>
						<use xlink:href="#close"></use>
					</svg>
				</button>
			</div>
		`;
	},
}