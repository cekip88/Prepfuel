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
		_.subSection = 'folders';
		_.currentItem = 'course';
		_.practiceNames = [
			'Practice Test 1','Practice Test 2','Practice Test 3','Practice Test 4'
		]
		G_Bus
			.on(_,[
				'domReady',
				'handleErrors',
				'createCourseFolders','createFolder','showNewFolderPopup',
				'showUploadFile','uploadCSV','moveToFolder'
			]);
	}
	async domReady(data){
		const _ = this;
		_.navigationInit();
		if(_.subSection == 'folders'){
			_.createCourseFolders({item: undefined})
		}
	}

	// get data methods
	async getFolderData(){
		const _ = this;
		_.filesData = await Model.getTests();
		return _.filesData;
	}
	isPracticeTest(folderId){
		const _ = this;
		return _.practiceNames.indexOf(folderId) > -1;
	}
	// end get data methods

	// create methods
	createFolder({item}){
		const _ = this;
	}
	// end create methods

	// Show methods
	showUploadFile(){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#uploadFileForm'})
	}
	showNewFolderPopup(){
		G_Bus.trigger('modaler','showModal',{
			target:'#newFolderForm',
			closeBtn: 'hide'
		})
	}
	// End show methods

	// Fill methods
	fillTableRowsCount(selector,count = this.filesData.length){
		const _ = this;
		let countCont = _.f(selector);
		_.clear(countCont);
		let text = count + (count === 1 ? ' item' : ' items');
		if (countCont) countCont.textContent = text;
	}
	fillFoldersTable(filesData){
		const _ = this;
		let rows = _.filesRowsTpl(filesData);
		let cont = _.f('.folders-table .tbl-body');
		if (cont) {
			_.clear(cont);
			cont.append(...rows);
			_.connectTableHead();
		}
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
	async createCourseFolders({item}) {
		const _ = this;
		let itemsData = await _.prepareFolders();
		
		if (!itemsData) return;
		_.fillFoldersTable(itemsData);
		//_.rebuildBreadCrumbs(item);
		_.fillTableRowsCount('.courses-rows-count');
	}
	// 1st step of creating folders
	async prepareFolders(){
		const _ = this;
		let tests  = await _.getFolderData();
		let folders = new Map();
		tests.forEach(test => {
			let folder = {};
			let title = `${test['testStandard']} ${test['testGrade']}`;
			if( !folders.has( title ) ){
				//folder['title'] = test['testStandard']+test['testGrade'];
				folders.set( title,folder );
				folder['title'] = title;
				folder['type'] = 'folder';
				folder['updatedAt'] = test['updatedAt'];
				folder['childes'] = [];
				folder['childes'].push(test);
			}else{
				folders.get( title ).childes.push(test);
			}
		})
		_.folders = folders;
		return _.folders;
	}
	
	// 2st step prepare subfolders of selected folder
	async prepareCourseSubFolders(id){
		const _ = this;
		let subFolders = new Map();
		subFolders.set('Diagnostic Quizzes',{childes:[],type:'folder',title:'Diagnostic Quizzes'});
		subFolders.set('Skills Practices',{childes:[],type:'folder',title:'Skills Practices'});
		subFolders.set('Practice Tests', {childes:[],type:'folder',title:'Practice Tests'});
		_.folders.get(id)['childes'].forEach(folder => {
			if(folder['testType'] == 'Practice Test') {
				if(subFolders.get('Practice Tests')){
					subFolders.get('Practice Tests').childes.push(folder);
				}
			}
		});
		_.practiceTestsFolders = subFolders;
		return subFolders;
	}
	
	async preparePracticeTestsFolders() {
		const _ = this;
		let subFolders = new Map();
		subFolders.set('Practice Test 1',{childes:[],type:'folder',title:'Practice test 1'});
		subFolders.set('Practice Test 2',{childes:[],type:'folder',title:'Practice test 2'});
		subFolders.set('Practice Test 3', {childes:[],type:'folder',title:'Practice test 3'});
		subFolders.set('Practice Test 4', {childes:[],type:'folder',title:'Practice test 4'});
		
		_.practiceTestsFolders.get(_.currentId)['childes'].forEach(folder => {
			let currentTest = `${folder['testType']} ${folder['testNumber']}`;
			if(subFolders.get(currentTest)){
				subFolders.get(currentTest).childes.push(folder);
			}
		});
		_.practiceTestsSubFolders = subFolders;
		return subFolders;
	}
	async choosePracticeTestFolders(practiceTest) {
		const _ = this;
		let subFolders = new Map();
		_.practiceTestsSubFolders.get(practiceTest)['childes'].forEach(folder => {
			folder['sections'].forEach( item=>{
				subFolders.set(item['sectionName'],{childes:[],type:'folder',title:item['sectionName']});
			})
		});
		return subFolders;
	}
	
	async moveToFolder({item}){
		const _ = this;
		let
			folderId = item.getAttribute('id'),
			subfolders = [];//await _.prepareCourseSubFolders(folderId);
		_.currentId = folderId;
		if(_.isPracticeTest(folderId)){
			subfolders = await _.choosePracticeTestFolders(folderId)
		}else	if(folderId == 'Practice Tests'){
			subfolders = 	await _.preparePracticeTestsFolders();
		}else{
			subfolders = await _.prepareCourseSubFolders(folderId);
		}
		_.fillFoldersTable(subfolders);
		//_.rebuildBreadCrumbs(item);
		_.fillTableRowsCount('.courses-rows-count',subfolders.size);
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
			//let breadCrumbsStrong = _.f('.breadcrumbs strong');
			//_.createCourseFolders({item:breadCrumbsStrong});
			G_Bus.trigger('modaler','closeModal');
			_.showSuccessPopup(title  + '.csv uploaded')
		}
	}
	handleErrors({method,data}){
		const _ = this;
		console.log(method,data);
		if( method == 'getUsers'){
			console.log('Users not found ',data);
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
	}
	
}