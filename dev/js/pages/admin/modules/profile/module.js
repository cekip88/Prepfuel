import {G_Bus} from "../../../../libs/G_Control.js";
import {model} from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class ProfileModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'body':'profileBody'
		}
	}
	define() {
		const _ = this;
		_.componentName = 'Profile';
	}
	
	init() {
		const _ = this;
	}
	
}