import  { TestModel } from "./TestModel.js";
export const testView = {
	noteTpl(question){
		const _ = this;
		let tpl = ``;
		if(!_.storageTest[question['id']]) return tpl;
		if(_.storageTest[question['id']].note) {
			tpl = `<div class="test-label-block note-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#edit-transparent"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<p>
						${_.storageTest[question['id']].note}
					</p>
				</div>
				<button class="test-label-button" data-click="${this.componentName}:showTestLabelModal">
					<svg>
						<use xlink:href="#three-dots"></use>
					</svg>
				</button>
				<div class="test-label-modal">
					<button class="test-label-modal-button" data-click="${this.componentName}:editNote" data-question-id="${question['id']}"><span>Edit</span></button>
					<button class="test-label-modal-button" data-click="${this.componentName}:deleteNote" data-question-id="${question['id']}"><span>Delete</span></button>
				</div>
			</div>`;
		}
		return tpl;
	},
	answerTpl(question,answer){
		let
			currentQuestionId = question['id'],
			tpl = `
				<li class="answer-item" data-question-id="${question['id']}" data-variant="${answer}">
					<button class="answer-button" data-click="${this.componentName}:setCorrectAnswer">
						<span class="answer-variant">${answer}</span>
						<span class="answer-value">${question['answers'][answer]}</span>
					</button>
					<button class="answer-wrong" data-click="${this.componentName}:setWrongAnswer">
						<svg>
							<use xlink:href="#dismiss-circle"></use>
						</svg>
					</button>
				</li>`;
		if(TestModel.isFinished()){
			let
				status = 'wrong',
				answeredQuestion = TestModel.testServerAnswers[currentQuestionId],
				currentQuestion = TestModel.questions[currentQuestionId];
				if(answeredQuestion){
					 if( (currentQuestion['correctAnswer'] !== answeredQuestion['answer']) && (answeredQuestion['answer'] == answer) ) {
						status = 'incorrect';
					}
				}
				tpl = `
					<li class="answer-item ${status}" data-question-id="${question['id']}" data-variant="${answer}">
						<button class="answer-button">
							<span class="answer-variant">${answer}</span>
							<span class="answer-value">${question['answers'][answer]}</span>
						</button>
						<div class="answer-review-icon">
							<svg>
								<use xlink:href="img/sprite.svg#${status}"></use>
							</svg>
						</div>
						<p class="answer-desc">
							${currentQuestion['descriptions'][answer]}
						</p>
					</li>
				`;
		}
		return tpl;
	},
	actionsTpl(question){
		return `
			<button class="test-header-button bookmarked-button" data-click="${this.componentName}:saveBookmark" data-question-id="${question['id']}">
				<svg>
					<use xlink:href="#bookmark-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#bookmark"></use>
				</svg>
				<span>Bookmark</span>
			</button>
			<button class="test-header-button note-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['id']}" data-id="note">
				<svg>
					<use xlink:href="#edit-transparent"></use>
				</svg>
				<svg>
					<use xlink:href="#edit"></use>
				</svg>
				<span>Note</span>
			</button>
			<button class="test-header-button" data-click="${this.componentName}:showForm;${this.componentName}:changeInnerQuestionId" data-question-id="${question['id']}" data-id="report">
				<svg>
					<use xlink:href="#error-circle"></use>
				</svg><span>Report</span>
			</button>
		`;
	},
	
	
	/* Cacrass templates*/
	async directionsCarcass(){
		const _ = this;
		return _.markup(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${_.test.time}</span> minutes left</div>
					<button class="button-white"  data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Directions</span>
						</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle"><span>${_.test['sections']['directions'].innerTitle}</span></h6>
						<p class="test-text">
							${_.test['sections']['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue"  data-click="${this.componentName}:changeSection" section="questions">
							<span>Continue to first question</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	},
	welcomeCarcass(){
		const _ = this;
		return  _.markup(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['welcome'].headerTitle}</h1>
					<button class="button-white">
						<span>Don’t start this section now</span>
					</button>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${_.test['sections']['welcome'].innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						<h6 class="test-subtitle">
							<span>${_.test['sections']['welcome'].innerTitle}</span>
						</h6>
						<p class="test-text">
							${_.test['sections']['welcome'].innerDescription}
						</p>
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="${this.componentName}:changeSection" section="directions">
							<span>Let’s go, start the timer!</span>
						</button>
					</div>
				</div>
			</div>
		`,false);
	},
	async questionsCarcass(){
		const _ = this;
		return  _.markup(`
	   ${await _.questionHeader()}
     <div class="section row">
        <div class="col wide">
          <div class="block test-block tt-ii">
              ${_.getQuestionTpl()}
              ${_.questionFooter()}
          </div>
        </div>
        ${_.questionsList()}
      </div>
     <div hidden>
        <form class="modal report" slot="modal-item" id="report" data-submit="${_.componentName}:saveReport">
          <h6 class="modal-title"><span>Report a mistake in this question</span></h6>
          <p class="modal-text">Remember to read through the explanations and double check your answer. Thanks for your help!</p>
          <p class="modal-text">What’s wrong</p>
          <div class="check-list">
            <g-input type='radio' class="g-form-item" name="answer" items='[
            {"value":"wrong","text":"The answer is wrong"},
            {"value":"typo","text":"I caught a typo."},
            {"value":"confus","text":"The question or explanations are confusing or unclear."},
            {"value":"broken","text":"Something isn’t working / something seems broken."}]'></g-input>
            <!--<div class="check-item">
              <input type="radio" name="answer" id="report-wrong">
              <label class="check-label" for="report-wrong"><span class="check-label-icon radio"></span><span class="check-label-text">The answer is wrong.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="answer" id="report-typo">
              <label class="check-label" for="report-typo"><span class="check-label-icon radio"></span><span class="check-label-text">I caught a typo.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="answer" id="report-confusing">
              <label class="check-label" for="report-confusing"><span class="check-label-icon radio"></span><span class="check-label-text">The question or explanations are confusing or unclear.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="answer" id="report-broken">
              <label class="check-label" for="report-broken"><span class="check-label-icon radio"></span><span class="check-label-text">Something isn’t working / something seems broken.</span></label>
            </div>-->
          </div>
          <h6 class="modal-title"><span>Description of issue</span></h6>
          <textarea class="modal-area g-form-item" name="description"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Submit Issue</span></button>
          </div>
        </form>
        <form class="modal note"  slot="modal-item" id="note" data-submit="${this.componentName}:saveNote">
          <h6 class="modal-title"><span>Note</span></h6>
          <textarea class="modal-area" name="text"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="modaler:closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Save</span></button>
          </div>
        </form>
      </div>
		`,false);
	},

	/* Cacrass templates*/
	async scoreCarcass(){
		const _ = this;
		let response = await TestModel.getTestSummary();
		return  _.markup(`
			<div class="section">
				<div class="section-header">
					<h2 class="title">Practice Test Score - Section Name</h2>
					<button class="button-white">
						<span>Exit this section</span>
					</button>
				</div>
			</div>
			<div class="section">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Complete</span></h5>
					</div>
					<div class="test-inner">
						<h5 class="block-title test-title">
							<span>You finished ${_.test['title']}</span>
						</h5>
						<p class="test-text">
							${_.test['description']}
						</p>
					<div class="test-result">
						<div class="test-result-block violet">
							<h6 class="test-result-title"><span>Questions Answered</span></h6>
							<p class="test-result-score">${response['summary']['questionsAnswered']}</p>
						</div>
						<div class="test-result-block turquoise">
							<h6 class="test-result-title"><span>Questions Correct</span></h6>
							<p class="test-result-score">${response['summary']['questionsCorrect']}</p>
						</div>
						<div class="test-result-block gray">
							<h6 class="test-result-title"><span>Not answered</span></h6>
							<p class="test-result-score">${response['summary']['questionsNotAnswered']}</p>
						</div>
						<div class="test-result-block green">
							<h6 class="test-result-title"><span>Score</span></h6>
							<p class="test-result-score">${response['summary']['score']}</p>
						</div>
						<div class="test-result-block blue">
							<h6 class="test-result-title"><span>Stars for section of the Test</span></h6>
						<p class="test-result-score">+${response['summary']['stars']}</p>
						<div class="test-result-img">
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
							<svg>
								<use xlink:href="#stars"></use>
							</svg>
						</div>
					</div>
					</div>
					</div>
					<div class="test-footer">
						<a class="test-footer-back" data-click="${_.componentName}:changeSection" section="questions">
							<span>Review this section</span>
						</a>
					<button class="button-blue"><span>Start the next section: Quantitative Reasoning</span></button>
					</div>
				</div>
			</div>
		`,false);
	},
	questionHeader(){
		const _ = this;
		return new Promise( (resolve) =>{resolve(`
			<div class="section">
				<div class="section-header">
					<h1 class="title">Practice Test - Section Name</h1>
					<div class="test-timer"><span class="test-timer-value">${_.test.time}</span> minutes left</div>
					<button class="button-white" data-click="${this.componentName}:changeSection" section="score"><span>Finish this section</span></button>
				</div>
			</div>
	`)});
	},
	questionFooter(){
		return `
		<div class="test-footer">
			<button class="test-footer-button dir-button" data-click="${this.componentName}:changeSection" section="directions">
				<span>Directions</span>
			</button>
			<button class="button skip-to-question-button" data-click="${this.componentName}:changeQuestion">
				<span><em class="skip-to-question-title">Skip to questions</em> <b class="skip-to-question">2</b></span>
			</button>
		</div>`;
	},
	questionsList(){
		const _ = this;
		let tpl =  `
			<div class="col narrow">
				<div class="block questions">
				<h5 class="block-title small"><span>Questions</span></h5>
				<div class="questions-cont">
					<h6 class="questions-list-title"><span>Question 1 - ${_.questionsLength}</span></h6>
					<ul class="questions-list">
		`;
		let cnt = 1;
		for(let questionPage of _.questionsPages){
			for(let question of questionPage['questions']){
				tpl+=`
					<li class="questions-item" data-question-id="${question.id}">
						<span class="questions-number">${cnt++}</span>
						<button class="questions-variant" data-click="${this.componentName}:jumpToQuestion"></button>
						<div class="questions-bookmark">
							<svg>
								<use xlink:href="#bookmark-transparent"></use>
							</svg>
							<svg>
								<use xlink:href="#bookmark"></use>
							</svg>
						</div>
					</li>
				`;
			}
		}
		tpl+=`
			</ul>
				<button class="questions-button" data-click="${this.componentName}:scrollForMore">
					<svg>
						<use xlink:href="#arrow-bottom"></use>
					</svg>
					<span>Scroll for more</span>
					<svg>
						<use xlink:href="#arrow-bottom"></use>
					</svg>
				</button>
			</div>
			</div>
			</div>
		`;
		return tpl;
	},
	
	/* Questions tpls */
	gridDigitButtons(){
		const _ = this;
		let tpl = ``;
		for(let i=0; i < 10; i++){
			tpl+=`<button class="grid-button">${i}</button>`;
		}
		return tpl;
	},
	gridQuestion(){
		const _ = this;
		let currentQuestion = _._$.currentQuestion['questions'][0];
		let tpl =  `
			<div class="test-header">
				<h5 class="block-title test-title"><span>Question ${_.questionPos} of ${_.questionsLength}</span></h5>
				${_.actionsTpl(_._$.currentQuestion['questions'][0])}
			</div>
			<div class="test-inner test-row">
				<div class="test-col wide">
					`;
		for(let fileLink of _._$.currentQuestion['files']){
			tpl+=`<img src="${fileLink}" alt="">`;
		}
		tpl+=`
					<p class="test-text">
						<span>${currentQuestion['mathFormula']}</span>
					</p>
					<p class="test-text">
						<span>${currentQuestion['questionText']}</span>
					</p>
					<br><br>
			</div>
				<div class="test-col narrow grid">
			<div class="grid-row">
				<input class="grid-input" type="text" disabled="">
			</div>
			<div class="grid-row">
				<div class="grid-col">
				<button class="grid-button">-</button>
			</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
				<div class="grid-col">
					<button class="grid-button">.</button>
				</div>
			</div>
			<div class="grid-row">
				<div class="grid-col">
					<button class="grid-button high"></button>
				</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			<div class="grid-col">
				${_.gridDigitButtons()}
			</div>
			</div>
			</div>
			</div>
		`;
		return tpl;
	},
	compareQuestion(){
		const _ = this;
		let
			currentQuestion = _._$.currentQuestion['questions'][0],
			tpl= `
				<div class="test-header">
					<h5 class="block-title test-title"><span>Question ${_.questionPos} of ${_.questionsLength}</span></h5>
					${_.actionsTpl(currentQuestion)}
				</div>
				<div class="test-inner middle">
					<p class="test-text"><span>${currentQuestion['mathFormula']}</span></p>
					<div class="test-row">
						<div class="test-col mini">
							<h6 class="test-col-title"><span>Column A</span></h6>
							<p class="test-text">${_._$.currentQuestion['columnLeft']}</p>
						</div>
						<div class="line"></div>
						<div class="test-col mini">
							<h6 class="test-col-title"><span>Column B</span></h6>
							<p class="test-text">${_._$.currentQuestion['columnRight']}</p>
						</div>
					</div>
					<ul class="answer-list" data-question-id="${currentQuestion['id']}">`;
		for(let answer in  currentQuestion['answers']){
			tpl+=_.answerTpl(currentQuestion,answer);
		}
		
		tpl+=`</ul>
			${_.noteTpl(currentQuestion)}
			</div>
		`;
		return tpl;
	},
	async markCorrectAnswer(){
		const _ = this;
		let isGrid = await G_Bus.trigger(_.componentName,'isGrid');
		if(isGrid) return void 0;
		let handle = (questionId,correctVariant)=>{
			let
				answerItem = _.f(`.answer-list[data-question-id="${questionId}"] .answer-item[data-variant="${correctVariant}"]`);
				answerItem.classList.remove('wrong');
				answerItem.classList.add('correct');
		};
		if(_._$.currentQuestion['questions'].length > 1){
			for(let question of _._$.currentQuestion['questions']){
				let
					answeredQuestion = TestModel.questions[question['id']],
					correctVariant = answeredQuestion['correctAnswer'];
				handle(question['id'],correctVariant);
			}
		}else{
			let
				currentQuestion = _._$.currentQuestion['questions'][0],
				answeredQuestion = TestModel.questions[currentQuestion['id']],
				correctVariant = answeredQuestion['correctAnswer'];
			handle(currentQuestion['id'],correctVariant);
		}
		
	},
	graphicQuestion(){
		const _ = this;
		let
		currentQuestion = _._$.currentQuestion['questions'][0],
		tpl= `
				<div class="test-row test-inner">
					<div class="test-col">
						<div class="test-left">
			`;
		for(let fileLink of _._$.currentQuestion['files']){
			tpl+=`<img src="${fileLink}" alt="">`;
		}
		tpl+=`</div>
				</div>
				<div class="test-col">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Question ${_.questionPos} of ${_.questionsLength}</span>
						</h5>
						${_.actionsTpl(currentQuestion)}
					</div>
					<p class="test-text"><span>${currentQuestion['mathFormula']}</span></p>
					<p class="test-text"><span>${currentQuestion['questionText']}</span></p>
					<ul class="answer-list" data-question-id="${currentQuestion['id']}">
				`;
		for(let answer in  currentQuestion['answers']){
			tpl+=_.answerTpl(currentQuestion,answer);
		}
		tpl+=`
					</ul>
					${_.noteTpl(currentQuestion)}
				</div>
			</div>`;
		return tpl;
	},
	passageQuestion(){
		const _ = this;
		let tpl= `
			<div class="test-inner test-row">
				<div class="test-col">
					<div class="test-left">
						<p class="test-left-text">${_._$.currentQuestion['title']}</p>
						<p class="test-left-text">${_._$.currentQuestion['textPassage']}</p>
					</div>
				</div>
				<div class="test-col">
					<div class="test-right">
						<p class="test-text">${_._$.currentQuestion['description']}</p>
				`;
		let cnt = 0;
		for(let question of _._$.currentQuestion['questions']){
			tpl+= `
					<div class="test-sec">
					<div class="test-header">
						<h5 class="block-title test-title"><span>Question ${TestModel.questionPos(_.currentPos)+cnt++} of 40</span></h5>
						${_.actionsTpl(question)}
					</div>
					<p class="test-text"><span>${question['questionText']}</span></p>
					<ul class="answer-list" data-question-id="${question['id']}">`;
			for(let answer in question['answers']){
				let ans = question['answers'][answer];
				tpl+=_.answerTpl(question,answer);
			}
			tpl+=`</ul>${_.noteTpl(question)}</div>`;
		}
		tpl+=`</div>
				</div>
			</div>`;
		return tpl;
	},
	standartQuestion(){
		const _ = this;
		let currentQuestion = _._$.currentQuestion['questions'][0];
		let tpl = `
			<div class="test-header">
				<h5 class="block-title test-title">
					<span>Question ${_.questionPos} of ${_.questionsLength}</span>
				</h5>
				${_.actionsTpl(currentQuestion)}
			</div>
			<div class="test-inner middle">
				<p class="test-text">
					${currentQuestion['mathFormula']}
				</p>
				<p class="test-text">
					${currentQuestion['questionText']}
				</p>
			<ul class="answer-list" data-question-id="${currentQuestion['id']}">
		`;
		for(let answer in  currentQuestion['answers']){
			tpl+=_.answerTpl(currentQuestion,answer)
			// active disabled
			;
		}
		tpl+=`
			</ul>
			${_.noteTpl(currentQuestion)}
		</div>`;
		return tpl;
	},
	/* Questions tpls */
	explanationAnswer(){
		const _ = this;
		return `
			<div class="test-label-block">
				<div class="test-label-icon">
					<svg>
						<use xlink:href="#lamp"></use>
					</svg>
				</div>
				<div class="test-label-text">
					<h5 class="test-label-title">
						<span>Explanation to correct answer</span>
					</h5>
					<p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
				</div>
			</div>`;
	}
}