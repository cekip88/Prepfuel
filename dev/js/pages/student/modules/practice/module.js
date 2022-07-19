import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class PracticeModule extends StudentPage{
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'practiceTabs',
			'body':'practiceBody',
			'footer':'studentFooter'
		};
	}
	define() {
		const _ = this;
	}

}