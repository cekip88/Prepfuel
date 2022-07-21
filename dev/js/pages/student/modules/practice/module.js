import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class PracticeModule extends StudentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'practiceTabs',
			'body':'practiceBody',
			'footer':'studentFooter'
		};
	}
	async asyncDefine(){
		const _ = this;

	}
	define() {
		const _ = this;
		_.componentName = 'studentPractice';
		_.subSection = 'practice';

		G_Bus.on(_,[
			'domReady',
		])
	}
	domReady(){
		const _ = this;
		if (_.subSection == 'practice') {
			_.practiceQuizFill();
		}
	}



	// Fill methods
	async practiceQuizFill(){
		const _ = this;
		let quizData = await Model.getQuizInfo();
		let quizCont = _.f('.practice-quiz-list');
		let itemsTpl = _.quizItemsTpl(quizData);
		_.clear(quizCont);
		if (!itemsTpl.length) return;
		quizCont.append(...itemsTpl);
	}
	//end fill methods
}