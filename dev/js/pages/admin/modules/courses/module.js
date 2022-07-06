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
		_.foldersData = {
			response: [
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
		]};
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

		_.fillTableRowsCount('.courses-rows-count');
		_.fillFoldersTable();
	}


	// Fill methods
	fillTableRowsCount(selector,count = this.foldersData['response'].length){
		const _ = this;
		let countCont = _.f(selector);
		_.clear(countCont);
		let text = count + (count === 1 ? ' item' : ' items');
		countCont.textContent = text;
	}
	fillFoldersTable(){
		const _ = this;
		let rows = _.foldersRowsTpl(_.foldersData);
		let cont = _.f('.folders-table .tbl-body');
		_.clear(cont);
		cont.append(...rows);
	}
	// End fill methods

	
	init(){
		const _ = this;
		console.log(Model);
	}
	
}