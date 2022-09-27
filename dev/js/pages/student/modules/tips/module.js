import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class TipsModule extends StudentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'tipsTabs',
			'body':'tipsBody',
		};
	}

	async asyncDefine(){}
	define() {
		const _ = this;
		_.componentName = 'Tips';
		G_Bus.on(_,[
			'domReady'
		]);
	}
	async domReady() {
		const _ = this;
		_.navigationInit();
	}


	async init() {
		const _ = this;
	}
	
}