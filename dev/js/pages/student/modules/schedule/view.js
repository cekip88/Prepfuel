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
		return `
			<h4 class="test-subtitle"><span>Choose your test date</span></h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">What is your test date?</p>
			</div>
			<div class="practice-schedule-row">
				<div class="blue-icon">
					<svg>
						<use xlink:href="#badge"></use>
					</svg>
				</div>
				<h5 class="practice-schedule-title">Your ISEE Date</h5>
				<div class="practice-schedule-date">
					<g-input type="date" class="input-date" icon=false id='schedule-date' placeholder="Choose your test date" value="${_.testDate}" format="weekDay, month DD, YYYY" data-change="${_.componentName}:changeScheduleDate"></g-input>
				</div>
			</div>
		`;
	},
	stepTwoTpl(){
		const _ = this;
		let rows = ``;
		
		for(let row of _.practiceRows){
			rows+=row.outerHTML;
		}
		return `
			<h4 class="test-subtitle"><span>Practice test days</span></h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">Preparing for the ISEE is like preparing for a marathon. You wouldn’t wait until the big day to try running a marathon for the first time!</p>
				<p class="test-subtitle small">&nbsp;</p>
				<p class="test-subtitle small">With 15 weeks left until your test, we recommend that you take at least 6 full practice tests (set aside 3-4 hours each) before test day.</p>
				<p class="test-subtitle small">For more information on planning your practice, you can checkout our Tips and Strategies section.</p>
			</div>
			<div class="practice-schedule-rows">
				<div id="shedule-rows">
					${rows}
				</div>
				<div class="practice-schedule-row">
					<div class="blue-icon">
						<svg>
							<use xlink:href="#badge"></use>
						</svg>
					</div>
					<h5 class="practice-schedule-title">Your ISEE Date</h5>
					<div class="practice-schedule-date"><span>${_.testDate}</span></div>
				</div>
			</div>
			<button class="button-lightblue" data-click="${_.componentName}:addPracticeRow">
				<svg class="button-icon">
				<use xlink:href="#plus"></use>
				</svg>
				<span>Schedule more practice tests</span>
			</button>
		`;
	},
	stepThreeTpl(){
		const _ = this;
		return `
			<h4 class="test-subtitle">
				<span>Skill practice plan</span>
			</h4>
			<div class="practice-schedule-text">
				<p class="test-subtitle small">When preparing for a marathon, you also have to do sprints, strength work, and other exercises. For the ISEE, in addition to practice tests, you will also work on individual skills and short timed "mini-sections".</p>
				<p class="test-subtitle small">&nbsp;</p>
				<p class="test-subtitle small">With 15 weeks left until your test, we recommend you do skill practice 1.25 hours/week (hardcore: 3-5 hours/week).</p>
				<p class="test-subtitle small">15 minutes × 5 days = 1.25 hours/week</p>
				<p class="test-subtitle small">(Recommended)</p>
			</div>
			<div class="practice-schedule-rows">
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Practice on</h5>
					<div class="practice-schedule-right">
						<g-input class="inpt-checkbox inpt-days" data-change="${_.componentName}:changeDay" type="checkbox" name="day" classname="inpt-days" items='[
							{"value":"S","text":"S","disabled":true},
							{"value":"M","text":"M"},
							{"value":"T","text":"T"},
							{"value":"W","text":"W"},
							{"value":"Th","text":"Th"},
							{"value":"F","text":"F"},
							{"value":"Sa","text":"Sa","disabled":true}]'></g-input>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Number of questions</h5>
					<div class="practice-schedule-right">
						<g-select class="g-select-gray" data-change="${_.componentName}:changeNumberOfQuestions" items='[{"text":"5 questions","value":5,"active":true},{"text":"10 questions","value":10}]' value="5" classname="g-select-gray" style="--class:g-select-gray; --value:5; --classname:g-select-gray;">
							<input type="hidden" name="null" slot="value" value="5">
						</g-select>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Practice at</h5>
					<div class="practice-schedule-right">
						<g-select class="g-select-gray" items='[{"text":"4:00 PM","value":"4:00","active":true},{"text":"5:00 PM","value":"5:00"},{"text":"6:00 PM","value":"6:00"},{"text":"7:00 PM","value":"7:00"},{"text":"8:00 PM","value":"8:00"}]' classname="g-select-gray" style="--class:g-select-gray; --classname:g-select-gray;"><input type="hidden" name="null" slot="value" value="4:00"></g-select>
					</div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Daily target</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title">10 questions</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Days per week</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title"> <i id="daysPerWeek">${_._$.daysPerWeek.length}</i> days / week</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Total weeks</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title">15 weeks</span>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title">Questions completed to date</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title"><i id="totalQuestionsCnt">${_._$.totalQuestionsCnt}</i> questions</span>
				</div>
				<div class="practice-schedule-row">
					<div class="line"></div>
				</div>
				<div class="practice-schedule-row">
					<h5 class="practice-schedule-title bold">Goal (total practice until test date)</h5>
					<div class="practice-schedule-dots"></div><span class="practice-schedule-title">50 questions</span>
				</div>
			</div>
		`;
	},
	practiceTestRow(){
		const _ = this;
		return `
			<div class="practice-schedule-row">
				<div class="blue-icon reverse">
					<svg>
						<use xlink:href="#badge"></use>
					</svg>
				</div>
				<h5 class="practice-schedule-title">Practice test ${_.practiceRowsCnt}</h5>
				<div class="practice-schedule-date">
					<g-input type="date" class="input-date schedule-date" icon='false' format="month DD, YYYY" value="${new Date()}"></g-input>
				</div>
				<div class="practice-schedule-date">
					<g-select class="select  schedule-time" title="Select time" items='[{"text":"4:00 PM","value":"04:00","active":true},{"text":"5:00 PM","value":"05:00"},{"text":"6:00 PM","value":"06:00"},{"text":"7:00 PM","value":"07:00"},{"text":"8:00 PM","value":"08:00"}]' classname="g-select-gray">
					<input type="hidden" name="null" slot="value" value="4:00"></g-select>
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