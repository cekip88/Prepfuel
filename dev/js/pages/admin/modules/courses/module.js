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
		_.filesData = {
			response: [
				{
					'_id':'asfklajfoijasdf',
					'title': 'ISEE Upper',
					'type': 'folder',
					'modified': '2021-05-1'
				},{
					'_id':'fasdfasdfasdf',
					'title': 'ISEE Middle',
					'type': 'folder',
					'modified': '2021-05-1'
				},{
					'_id':'fasdfaafsdfsdfasdf',
					'title': 'ISEE Lower',
					'type': 'folder',
					'modified': '2021-05-1'
				},{
					'_id':'asdfdffadsfdsafads',
					'title': 'SSAT Upper',
					'type': 'file',
				'modified': '2021-05-1'
			}
		]};
		_.tableCrumbs = [{title:'Courses',path:''},{title:'ISEE Upper',path:''}];
	}
	define() {
		const _ = this;
		_.componentName = 'CoursesModule';


		G_Bus
			.on(_,[
				'domReady',
				'showUploadFile',
			]);
	}
	async domReady(data){
		const _ = this;

		_.fillTableRowsCount('.courses-rows-count');
		_.fillFoldersTable();
	}


	// Show methods
	showUploadFile(){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#uploadFileForm'})
	}
	// End show methods

	// Fill methods
	fillTableRowsCount(selector,count = this.filesData['response'].length){
		const _ = this;
		let countCont = _.f(selector);
		_.clear(countCont);
		let text = count + (count === 1 ? ' item' : ' items');
		countCont.textContent = text;
	}
	fillFoldersTable(){
		const _ = this;
		let rows = _.filesRowsTpl(_.filesData);
		let cont = _.f('.folders-table .tbl-body');
		_.clear(cont);
		cont.append(...rows);
		_.connectTableHead();
	}
	// End fill methods

	connectTableHead(selector) {
		const _ = this;
		let
			cont = _.f(`${selector ?? ''} .tbl`);
		if (!cont) return
		let
			head = cont.querySelector('.tbl-head'),
			ths = head.querySelectorAll('.tbl-item'),
			table = cont.querySelector('TABLE'),
			row = table.querySelector('TBODY TR'),
			tds = row.querySelectorAll('td');
		ths.forEach(function (item,index){
			let w = tds[index].getBoundingClientRect().width;
			item.style = `width:${w}px;flex: 0 0 ${w}px;`
		})
	}
	
	init(){
		const _ = this;
		console.log(Model);
	}
	
}