import { G_Bus } from "../../libs/G_Control.js";
import  TestModel from "./TestModel.js";
import { _front } from "../../libs/_front.js";

class TestPage extends _front{
	constructor() {
		super();
		const _ = this;
		
		console.log(_.components);

	}
	async define(){
		const _ = this;
		G_Bus
			.on('changeSection',_.changeSection.bind(_))
			.on('changeSection',_.render.bind(_));
		_.model = new TestModel();
		_.set({
			currentSection: 'welcome',
			test: await _.model.getTest()
		})
	}
/*	showDirections({item,event}){
		const _ = this;
		_._$.currentSection = 'directions';
	}
		get currentSection(){
		const _ = this;
		_._$.session = _._$.currentSection;
		return _._$.test.sections[_._$.currentSection];
	}*/
	get test(){
		const _ = this;
		return _._$.test;
	}
	changeSection({item,event}){
		const _ = this;
		let section = item.getAttribute('section');
		_._$.currentSection = section;
	}
	
	welcomeHeader(){
		const _ = this;
		return `
			<div class="section-header">
				<h1 class="title">${_.test['sections']['welcome'].headerTitle}</h1>
				<button class="button-white">
					<span>Don’t start this section now</span>
				</button>
			</div>
		`;
	}
	welcomeInner(){
		const _ = this;
		return `
			<h6 class="test-subtitle">
				<span>${_.test['sections']['welcome'].innerTitle}</span>
			</h6>
			<p class="test-text">
				${_.test['sections']['welcome'].innerDescription}
			</p>
		`;
	}
	
	directionsHeader(){
		const _ = this;
		return `
			<div class="section">
				<div class="section-header">
					<h1 class="title">${_.test['sections']['directions'].headerTitle}</h1>
					<div class="test-timer"><span class="test-timer-value">${_._$.test.time}</span> minutes left</div>
					<button class="button-white"><span>Finish this section</span></button>
				</div>
			</div>
		`;
	}
	directionsCarcas(){
		const _ = this;
		return _.markup(`
			${_.directionsHeader()}
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
						<button class="button-blue"  data-click="changeSection" section="questions">
							<span>Continue to first question</span>
						</button>
					</div>
				</div>
			</div>
		`);
	}

	
	welcomeCarcas(){
		const _ = this;
		return  _.markup(`
			<div class="section">
				${_.welcomeHeader()}
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${_.test['sections']['welcome'].innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						${_.welcomeInner()}
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="changeSection" section="directions">
							<span>Let’s go, start the timer!</span>
						</button>
					</div>
				</div>
			</div>
		`);
	}
	questionsCarcass(){
		const _ = this;
		return  _.markup(`
	   ${_.directionsHeader()}
     <div class="section row">
        <div class="col wide">
          <div class="block test-block">
            <div class="test-header">
              <h5 class="block-title test-title">
                <span>Question 1 of ${_.test.questions.length}</span>
              </h5>
              <button class="test-header-button active">
                <svg>
                  <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                </svg>
                <svg>
                  <use xlink:href="img/sprite.svg#bookmark"></use>
                </svg><span>Bookmark</span>
              </button>
              <button class="test-header-button active" data-click="showForm" data-id="note">
                <svg>
                  <use xlink:href="img/sprite.svg#edit-transparent"></use>
                </svg>
                <svg>
                  <use xlink:href="img/sprite.svg#edit"></use>
                </svg><span>Note</span>
              </button>
              <button class="test-header-button" data-click="showForm" data-id="report">
                <svg>
                  <use xlink:href="img/sprite.svg#error-circle"></use>
                </svg><span>Report</span>
              </button>
            </div>
            <div class="test-inner middle">
              <p class="test-text"><span>Math formula</span></p>
              <p class="test-text"><span>Text of a question</span></p>
              <ul class="answer-list">
                <li class="answer-item active">
                  <button class="answer-button"><span class="answer-variant">a</span><span class="answer-value">Answer A</span></button>
                  <button class="answer-wrong">
                    <svg>
                      <use xlink:href="img/sprite.svg#dismiss-circle"></use>
                    </svg>
                  </button>
                </li>
                <li class="answer-item" disabled>
                  <button class="answer-button"><span class="answer-variant">b</span><span class="answer-value">Answer B</span></button>
                  <button class="answer-wrong">
                    <svg>
                      <use xlink:href="img/sprite.svg#dismiss-circle"></use>
                    </svg>
                  </button>
                </li>
                <li class="answer-item">
                  <button class="answer-button"><span class="answer-variant">c</span><span class="answer-value">Answer C</span></button>
                  <button class="answer-wrong">
                    <svg>
                      <use xlink:href="img/sprite.svg#dismiss-circle"></use>
                    </svg>
                  </button>
                </li>
                <li class="answer-item">
                  <button class="answer-button"><span class="answer-variant">d</span><span class="answer-value">Answer D</span></button>
                  <button class="answer-wrong">
                    <svg>
                      <use xlink:href="img/sprite.svg#dismiss-circle"></use>
                    </svg>
                  </button>
                </li>
                <li class="answer-item">
                  <button class="answer-button"><span class="answer-variant">e</span><span class="answer-value">I don't know</span></button>
                  <button class="answer-wrong">
                    <svg>
                      <use xlink:href="img/sprite.svg#dismiss-circle"></use>
                    </svg>
                  </button>
                </li>
              </ul>
              <div class="test-label-block">
                <div class="test-label-icon">
                  <svg>
                    <use xlink:href="img/sprite.svg#edit-transparent"></use>
                  </svg>
                </div>
                <div class="test-label-text">
                  <p>Note - nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
                </div>
                <button class="test-label-button" data-click="showTestLabelModal">
                  <svg>
                    <use xlink:href="img/sprite.svg#three-dots"></use>
                  </svg>
                </button>
                <div class="test-label-modal">
                  <button class="test-label-modal-button"><span>Edit</span></button>
                  <button class="test-label-modal-button"><span>Delete</span></button>
                </div>
              </div>
              <div class="test-label-block">
                <div class="test-label-icon">
                  <svg>
                    <use xlink:href="img/sprite.svg#lamp"></use>
                  </svg>
                </div>
                <div class="test-label-text">
                  <h5 class="test-label-title"><span>Explanation to correct answer</span></h5>
                  <p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
                </div>
              </div>
            </div>
            <div class="test-footer">
              <button class="test-footer-button" data-click="changeSection" section="directions">
                <span>Directions</span>
              </button>
              <a class="button" href="./test-question-2.html">
                <span>Skip to questions 2</span>
              </a>
            </div>
          </div>
        </div>
        <div class="col narrow">
          <div class="block questions">
            <h5 class="block-title small"><span>Questions</span></h5>
            <div class="questions-cont">
              <h6 class="questions-list-title"><span>Question 1 - 10</span></h6>
              <ul class="questions-list">
                <li class="questions-item"><span class="questions-number">1</span>
                  <button class="questions-variant">A</button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item checked"><span class="questions-number">2</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">3</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">4</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">5</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">6</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">7</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">8</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">9</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">10</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
              </ul>
              <h6 class="questions-list-title"><span>Question 1 - 10</span></h6>
              <ul class="questions-list">
                <li class="questions-item"><span class="questions-number">1</span>
                  <button class="questions-variant">A</button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item checked"><span class="questions-number">2</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">3</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">4</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">5</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">6</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">7</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">8</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">9</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">10</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
              </ul>
              <h6 class="questions-list-title"><span>Question 1 - 10</span></h6>
              <ul class="questions-list">
                <li class="questions-item"><span class="questions-number">1</span>
                  <button class="questions-variant">A</button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item checked"><span class="questions-number">2</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">3</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">4</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">5</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">6</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">7</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">8</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">9</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">10</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
              </ul>
              <h6 class="questions-list-title"><span>Question 1 - 10</span></h6>
              <ul class="questions-list">
                <li class="questions-item"><span class="questions-number">1</span>
                  <button class="questions-variant">A</button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item checked"><span class="questions-number">2</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">3</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">4</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">5</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">6</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">7</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">8</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">9</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
                <li class="questions-item"><span class="questions-number">10</span>
                  <button class="questions-variant"></button>
                  <div class="questions-bookmark">
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark-transparent"></use>
                    </svg>
                    <svg>
                      <use xlink:href="img/sprite.svg#bookmark"></use>
                    </svg>
                  </div>
                </li>
              </ul>
              <button class="questions-button">
                <svg>
                  <use xlink:href="img/sprite.svg#arrow-bottom"></use>
                </svg><span>Scroll for more</span>
                <svg>
                  <use xlink:href="img/sprite.svg#arrow-bottom"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
     <div hidden>
        <form class="modal report" slot="modal-item" id="report">
          <h6 class="modal-title"><span>Report a mistake in this question</span></h6>
          <p class="modal-text">Remember to read through the explanations and double check your answer. Thanks for your help!</p>
          <p class="modal-text">What’s wrong</p>
          <div class="check-list">
            <div class="check-item">
              <input type="radio" name="report" id="report-wrong">
              <label class="check-label" for="report-wrong"><span class="check-label-icon radio"></span><span class="check-label-text">The answer is wrong.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-typo">
              <label class="check-label" for="report-typo"><span class="check-label-icon radio"></span><span class="check-label-text">I caught a typo.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-confusing">
              <label class="check-label" for="report-confusing"><span class="check-label-icon radio"></span><span class="check-label-text">The question or explanations are confusing or unclear.</span></label>
            </div>
            <div class="check-item">
              <input type="radio" name="report" id="report-broken">
              <label class="check-label" for="report-broken"><span class="check-label-icon radio"></span><span class="check-label-text">Something isn’t working / something seems broken.</span></label>
            </div>
          </div>
          <h6 class="modal-title"><span>Description of issue</span></h6>
          <textarea class="modal-area"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Submit Issue</span></button>
          </div>
        </form>
        <form class="modal note" slot="modal-item" id="note">
          <h6 class="modal-title"><span>Note</span></h6>
          <textarea class="modal-area"></textarea>
          <div class="modal-row end">
            <button class="button" type="button" data-click="closeModal"><span>Cancel</span></button>
            <button class="button-blue"><span>Save</span></button>
          </div>
        </form>
      </div>
		`);
	}
	flexible(){
		const _ = this;
		if(_._$.currentSection == 'welcome'){
			return _.welcomeCarcas()
		}
		if(_._$.currentSection == 'directions'){
			return _.directionsCarcas()
		}
		if(_._$.currentSection == 'questions'){
			return _.questionsCarcass()
		}
	}
	init(){
		const _ = this;
	}
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPage([
			_.markup(_.header.render()),
			_.flexible()
		]);
	}
}
export { TestPage }