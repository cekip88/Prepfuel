import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class DashboardModule extends AdminPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'dashboardTabs',
			'body':'dashboardBody',
		};
	}
	
	
	async asyncDefine(){
		const _ = this;
	
	}
	
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
	}
	async init() {
		const _ = this;
		
	}
	
	
}