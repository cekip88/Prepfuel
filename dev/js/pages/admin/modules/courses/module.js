import {G_Bus} from "../../../../libs/G_Control.js";
import {Model}  from "./model.js";
import {AdminPage} from "../../admin.page.js";
export class CoursesModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'coursesBodyTabs',
			'body':'coursesBody',
			'footer':'coursesFooter'
		}
	}

	async asyncDefine(){
		const _ = this;
		_.folders = [
			{
				'_id':'asfklajfoijasdf',
				'title': 'ISEE Upper',
				'modified': '2021-05-1'
			},{
				'_id':'fasdfasdfasdf',
				'title': 'ISEE Middle',
				'modified': '2021-05-1'
			},{
				'_id':'fasdfaafsdfsdfasdf',
				'title': 'ISEE Lower',
				'modified': '2021-05-1'
			},{
				'_id':'asdfdffadsfdsafads',
				'title': 'SSAT Upper',
				'modified': '2021-05-1'
			}
		];
	}
	define() {
		const _ = this;
		_.componentName = 'CoursesModule';


		G_Bus
			.on(_,[
				'domReady',
			]);
	}
	async domReady(data){
		const _ = this;
		console.log(data)
	}


	// Fill methods
	fillTableRowsCount(){
		const _ = this;
		let countCont = _.f('.courses-rows-count');
		_.clear(countCont);
		let text = _.folders.length + _.folders.length === 1 ? 'item' : 'items';
		countCont.textContent = text;
	}
	// End fill methods

	
	init(){
		const _ = this;
		console.log(Model);
	}
	
}