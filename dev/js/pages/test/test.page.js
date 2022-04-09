import { G_Bus } from "../../libs/G_Control.js";
import  TestModel from "./TestModel.js";
import { _front } from "../../libs/_front.js";

class TestPage extends _front{
	constructor() {
		super();
		const _ = this;
		

	}
	async define(){
		const _ = this;
		G_Bus
			.on('changePage',_.changePage.bind(_));

		_.model = new TestModel();
		_.set({
			currentSection: 'welcome',
			test: await _.model.getTest()
		})
	}
	
	get currentSection(){
		const _ = this;
		return _._$.test.sections[_._$.currentSection];
	}
	
	changePage({item,event}){
		const _ = this;
		
		_._$.route = _.item.getAttribute('route');
		
		_._$.currentSection = 'directions';
	}
	
	welcomeHeader(){
		const _ = this;
		return `
			<div class="section-header">
				<h1 class="title">${_.currentSection.headerTitle}</h1>
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
				<span>${_.currentSection.innerTitle}</span>
			</h6>
			<p class="test-text">
				${_.currentSection.innerDescription}
			</p>
		`;
	}
	
	directionsHeader(){
		const _ = this;
		return _.markup(`
			<h1 class="title">${_.currentSection.headerTitle}</h1>
			<div class="test-timer">
				<span class="test-timer-value">${_._$.test.time}</span> minutes left
			 </div>
			<button class="button-white" data-click="finishSection">
				<span>Finish this section</span>
			</button>
		`);
	}
	
	carcas(){
		const _ = this;
		console.log(_.currentSection);
		return  _.markup(`
			<div class="section">
				${_.welcomeHeader()}
			</div>
			<div class="section row">
				<div class="block test-block">
					<div class="test-header">
						<h5 class="block-title test-title">${_.currentSection.innerTitle}</h5>
					</div>
					<div class="test-inner narrow">
						${_.welcomeInner()}
					</div>
					<div class="test-footer">
						<button class="button-blue" type="button" data-click="changePage" route="/test/directions">
							<span>Let’s go, start the timer!</span>
						</button>
					</div>
				</div>
			</div>
		`);
	}
	init(){
		const _ = this;
		_._( ()=>{
			_.clear(_.f('.g-body'));
			_.f('.g-body').append(_.carcas());
	
		},['currentSection']);
	}
}
export { TestPage }