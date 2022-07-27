import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {ParentPage} from "../../parent.page.js";

export class DashboardModule extends ParentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
		//	'header':'fullHeader',
	//		'header-tabs':'studentTabs',
			//'body-tabs':'dashboardTabs',
			'body':'badgeTpl',
		};
	}
	async asyncDefine(){
		const _ = this;
	/*	_.set({
			dashSchedule: await Model.getDashSchedule()
		});*/
	}
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.subSection = 'welcome';
		_.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		G_Bus
		.on(_,['domReady']);
	}
	async changeSection({item, event}) {
		const _ = this;
		let section = item.getAttribute('section');
		_.subSection = section;
		if(section == 'addingStudent'){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body-tabs':'dashboardTabs',
				'body':'badgeTpl',
			}
		}
		await _.render();
	}
	
	async domReady() {
		const _ = this;
		if(_.subSection == 'welcome'){
			_.fillWelcome();
		}
		if(_.subSection == 'addingStudent'){
			_.fillAddingStudent();
		}
	/*	_.navigate({
			item:document.querySelector('.navigate-list'),
			event:{target:document.querySelector('.dashboard')}
		})
*/
	}
	fillWelcome(){
		const _ = this;
		_.f("#g-set-inner").innerHTML = _.welcomeTpl();
	}
	fillAddingStudent(){
		const _ = this;
		_.f("#g-set-inner").innerHTML = _.welcomeTpl();
	}
	

	async init() {
		const _ = this;
	}
	
}