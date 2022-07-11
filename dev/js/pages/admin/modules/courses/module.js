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
	}
	define() {
		const _ = this;
		_.componentName = 'CoursesModule';
		_.tableCrumbs = [{'title':'Courses','id':'','position':0}];

		G_Bus
			.on(_,[
				'domReady',
				'moveToFolder',
				'showUploadFile',
				'uploadCSV',
			]);
	}
	async domReady(data){
		const _ = this;

		_.moveToFolder({})
	}

	// get data methods
	async getFolderData(id,rerequest = false){
		const _ = this;
		if (!_.filesData || rerequest) _.filesData = await Model.getTests();
		if (!id) return _.filesData;

	}
	// end get data methods


	// Show methods
	showUploadFile(){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#uploadFileForm'})
	}

	// End show methods

	// Fill methods
	fillTableRowsCount(selector,count = this.filesData.length){
		const _ = this;
		let countCont = _.f(selector);
		_.clear(countCont);
		let text = count + (count === 1 ? ' item' : ' items');
		countCont.textContent = text;
	}
	fillFoldersTable(filesData){
		const _ = this;
		let rows = _.filesRowsTpl(filesData);
		let cont = _.f('.folders-table .tbl-body');
		_.clear(cont);
		cont.append(...rows);
		_.connectTableHead();
	}
	rebuildBreadCrumbs(item){
		const _ = this;
		let id = item.getAttribute('id');
		if (item.hasAttribute('data-position')) {
			let position = item.getAttribute('data-position');
			_.tableCrumbs = _.tableCrumbs.slice(0,parseInt(position) + 1);
		} else {
			_.tableCrumbs.push({'title':item.textContent,id,'position':_.tableCrumbs.length})
		}

		let breadCrumbs = _.f('.breadcrumbs');
		_.clear(breadCrumbs);
		breadCrumbs.append(_.markup(_.fillBreadCrumbs(_.tableCrumbs)));
	}
	// End fill methods

	// Navigation methods
	async moveToFolder({item}) {
		const _ = this;
		let id = item ? item.getAttribute('id') : null;
		let itemsData = await _.getFolderData(id);
		console.log(itemsData)

		_.fillFoldersTable(itemsData);
		return
		_.rebuildBreadCrumbs(item);
		_.fillTableRowsCount('.courses-rows-count');
	}

	// End navigation methods

	async uploadCSV({item:input}){
		const _ = this;
		let
			file = input.files[0],
			fileName = file.name,
			splitArray = fileName.split('.'),
			extension = splitArray[splitArray.length - 1],
			title = fileName.substr(0,fileName.length - extension.length - 1);

		if (extension !== 'csv') {
			_.showErrorPopup('Wrong files format')
			return;
		}

		let uploadData = new FormData();
		uploadData.append('file',file,title + '.'  + extension);

		let response = await Model.uploadCSV(uploadData);
		if (response) {
			let breadCrumbsStrong = _.f('.breadcrumbs strong');

			let date = new Date();
			Model.foldersData.push({
				'_id':title,
				'title': title,
				'type': 'file',
				'modified': date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
				'parentId': breadCrumbsStrong.getAttribute('id')
			});


			_.moveToFolder({item:breadCrumbsStrong});
			G_Bus.trigger('modaler','closeModal');
			_.showSuccessPopup(title  + '.csv uploaded')
		}
	}

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
	
	async init(){
		const _ = this;
		console.log(Model);
	}
	
}