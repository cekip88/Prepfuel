import {G_Bus} from "../../../../libs/G_Control.js";
import {Model}  from "./model.js";
import {AdminPage} from "../../admin.page.js";
// Открывается саммари если не обновляешь страницу
export class UsersModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body':'usersBody',
			'footer':'adminFooter'
		}
	}

	async asyncDefine(){
		const _ = this;
		Model.currentUsersType = 'student';
		_.activityHeaderData = [
			{title:'40h:35min:57sec',info:'Total time spent in App'},
			{title:'28min:30sec',info:'Average time spent per session'},
			{title:'86',info:'Number of sessions'},
			{title:'Sunday March 17, 2022',info:'Last session'},
		]
		_.activityData = [
			{course:'ISEE',color:'turquoise',date:'2022-03-17',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-16',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'SHSAT',color:'blue',date:'2022-03-15',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-14',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
			{course:'ISEE',color:'turquoise',date:'2022-03-13',timeIn:'10:00 AM',timeOut:'10:45 AM',duration:'00:45:40'},
		];

		//_.studentsInfo =
		//G_Bus.trigger(_.componentName,'showSuccessPopup','Course has been successfully removed')
		//G_Bus.trigger(_.componentName,'showErrorPopup','Error, try again later')
	}
	define(){
		const _ = this;
		_.componentName = 'UsersModule';
		_.maxStep = 6;
		_.maxAssignStep = 4;
		_.minStep = 1;
		_.coursePos = 0;
		_.parentInfo = {};
		_.studentInfo = {};
		_.courseData = {};
		_.metaInfo = {};
		_.adminInfo = {};
		_.subSection = 'student';
		_.parentSkipped =  false;
		_.searchInfo = {};
		_.set({
			addingStep : 1,
			assignStep : 1
		});

		G_Bus
			.on(_,[
				'handleErrors',
				'addStudent','showAssignPopup','showRemoveUserPopup','showRemoveAdminPopup','removeUser','removeAdmin',
				'showRemoveParentPopup','removeParent',
				'changeNextStep','changePrevStep','jumpToStep',
				'showRemovePopup','removeCourse',
				'domReady',
				'assignParent','addNewParent','assignCourse','skipParent','updateParent',
				'changeTestType','changeStudentLevel','changeSection',
				'fillAdminInfo',
				'fillStudentInfo','createStudent','skipTestDate','changeCurrentCourse',
				'fillParentInfo','assignStudentToParent','removeAssignedParent',
				'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
				'showSuccessPopup','showErrorPopup','closePopup',
				'generatePassword','validatePassword','showChangePassword','saveChangePassword',
				'changeProfileTab','updateStudent','updateAdmin',
				'showAddParentPopup','showPopupParentProfile','changeParentPopupProfileTab','cancelParentProfile',
				'showHistoryDetails','createNewParent','assignFirstParent',
				'notificationNavigate','showAddCard','showAddBillingAddress','searchUsers','sortBy','filterUsersByDates','sortParentStudentsBy',
				'checkEmail',
				'paginate','paginateTo',
				'uploadPhoto','sendResetPassword',
			]);

		_.initialState = {
			studentInfo: {},
			parentInfo: {},
			metaInfo: {},
			adminInfo: {}
		}

	}
	garbageCollector(garbageList){
		const _ = this;
		if (!Array.isArray(garbageList)) return void 0;

		for (let garbage of garbageList) {
			if (_[garbage]) _[garbage] = _.initialState[garbage];
		}
	}

	async domReady(data){
		const _ = this;
		console.log(_.abortControllers)
		_.navigationInit();
		if (_.usersAbortController) _.usersAbortController.abort();
		_.usersAbortController = new AbortController();
		let signal = _.usersAbortController.signal;

		_.wizardData = Model.wizardData ?? await Model.getWizardData();
		let tableData = {};

		if (_.subSection === 'student' || _.subSection === 'parent' || _.subSection === 'admin') {
			_.parentInfo = {};
			_.studentInfo = {};
			_.metaInfo = {};
			_.searchInfo = {};
			_.searchInfo[_.subSection] = {page:1};
			tableData = await Model.getUsers({
				role:_.subSection,
				searchInfo:_.searchInfo[_.subSection],
				signal:signal
			});
		}
		if (_.subSection === 'student'){
			_._$.addingStep = 1;
			_.fillTableFilter('#usersBody');
			_.fillUserTable({usersData:tableData,selector:'#usersBody'});
			_.paginationFill({total:tableData.total,limit:tableData.limit,selector:'#usersBody'});
		}
		if( _.subSection === 'profile'){
			_.fillProfile(data);
			_.courseStatus = null;
			_.removedCourseData = {};
		}
		if( _.subSection === 'parent'){
			_.fillTableFilter('#bodyParents');
			_.paginationFill({total:tableData.total,limit:tableData.limit,selector:'#bodyParents'});
			_.fillBodyParentsTable({usersData:tableData});
		}
		if( _.subSection === 'parentProfile'){
			if (!_.isEmpty(_.parentInfo) && !data.item.hasAttribute('data-id')) {
				data.item.setAttribute('data-id',_.parentInfo['_id'])
			}
			_.fillParentProfile(data);
		}
		if( _.subSection === 'admin'){
			_.fillTableFilter('#bodyAdmins');
			_.paginationFill({total:tableData.total,limit:tableData.limit,selector:'#bodyAdmins'});
			_.fillBodyAdminsTable(tableData);
		}
		if( _.subSection === 'adminProfile'){
			_.fillAdminProfile(data);
		}
		//_.ff('.block-header-itefm.button-blue').gappend(_.markup('<span>Hello</span>'))
	}

	getBackUrl(){
		return `https://live-prepfuelbackend-mydevcube.apps.devinci.co`
	}

	// Create methods
	async createNewParent({item}){
		const _ = this;
		let cont = item.closest('#add-parent');
		let formValidation = await _.nextStepBtnValidation(cont);
		if (!formValidation) return;

		if (_.parentInfo.uploadData) {
			_.parentInfo.photo = await Model.uploadPhoto(_.parentInfo.uploadData);
		}

		let response = await Model.createParent(_.parentInfo);
		if(!response) return void 0;
		let role = _.subSection;

		if (_.subSection == 'profile') {
			Model.assignStudentToParent(response._id,_.studentInfo._id);
			role = 'parent';
		}

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger(_.componentName,'showSuccessPopup','Parent has been successfully added');

		let users = await Model.getUsers({role,page: 1,update: true});
		_.parentInfo = {};
		_.metaInfo = {};
		if (_.subSection == 'profile') {
			_.fillParentsInfoTable({response:[response]});
			_.f('g-body .button-link.blue').textContent = 'Change parent';
		} else {
			_.fillParentsTable({usersData:users});
			_.rebuildPagination({cont:_.f('#bodyParents .pagination'),page:1,limit:users.limit,total:users.total})
		}
	}
	async createStudent(){
		const _ = this;
		if(!_.studentInfo['parentId']){
			if (_.parentInfo.uploadData) {
				_.parentInfo.photo = await Model.uploadPhoto(_.parentInfo.uploadData);
			}
			let parent = await Model.createParent(_.parentInfo);
			_.studentInfo['parentId'] = parent['_id'];
		}
		let curCourseData = _.courseData[_.courseData.currentPlan];
		let createInfo = {
			firstName: _.studentInfo.firstName,
			lastName: _.studentInfo.lastName,
			email: _.studentInfo.email,
			password: _.studentInfo.password,
			avatar: _.studentInfo.avatar,
			grade: _.studentInfo.grade._id,
			currentSchool: _.studentInfo.currentSchool,
			course: curCourseData.course._id,
			level: curCourseData.level._id,
			testDate: curCourseData.testDate,
			firstSchool: curCourseData.firstSchool._id,
			secondSchool: curCourseData.secondSchool._id,
			thirdSchool: curCourseData.thirdSchool._id,
			parentId: _.studentInfo.parentId
		};
		let response = await Model.createStudent(createInfo);
		if (!response) return void 0;

		_.clearData();
		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger(_.componentName,'showSuccessPopup','Student has been successfully added');
		_.courseData = {};
		_._$.addingStep = 1;
		let users = await Model.getUsers({role:'student',page: 1,update: true});
		_.fillUserTable({usersData:users,selector:'#usersBody'});
		_.rebuildPagination({page:1,limit:users.limit,total:users.total,cont:_.f('.pagination')})
	}
	// Create methods
	
	// Update methods
	async updateStudent({item}){
		const _ = this;
		let cont = _.f('.student-profile-left');
		let validate = await _.nextStepBtnValidation(cont);
		if (!validate) return void 0;

		if (_.courseStatus == 'removed') {
			_.showRemovedCoursePopup();
			return
		}
		if (!_.isEmpty(_.removedCourseData)){
			for (let key in _.removedCourseData) {
				await Model.removeCourse(_.removedCourseData[key]);
			}
		}

		for (let key in _.courseData) {
			if (key === 'currentPlan' || key === 'studentId') continue;
			let courseResponse;

			if (_.courseData[key]._id) {
				courseResponse = await Model.updateCourse(_.courseData[key]);
			} else {
				if (_.courseData[key].firstSchool) {
					let courseInfo = {
						"studentId": _.studentInfo._id,
						"course": _.courseData[key].course._id,
						"level": _.courseData[key].level._id,
						"testDate": _.courseData[key].testDate,
						"firstSchool": _.courseData[key].firstSchool._id,
						"secondSchool": _.courseData[key].secondSchool._id,
						"thirdSchool": _.courseData[key].thirdSchool._id
					};
					courseResponse = await Model.assignCourse(courseInfo);
				}
			}
		}

		let response = await Model.updateStudent({
			'studentId': _.studentInfo['_id'],
			'firstName': _.studentInfo['firstName'],
			"lastName": _.studentInfo['lastName'],
			"email": _.studentInfo['email'],
			"password": _.studentInfo['password'],
			"avatar": _.studentInfo['avatar'],
			"grade": _.studentInfo['grade'],
			"currentSchool": _.studentInfo['currentSchool']
		});
		if(!response) return void 0;


		item.setAttribute('rerender',true);
		G_Bus.trigger(_.componentName,'changeSection',{item})
		_.showSuccessPopup('Student profile updated');
	}
	async updateAdmin({item}){
		const _ = this;
		let me = JSON.parse(localStorage.getItem('me'));
		let updateData = {
			'_id': _.adminInfo['_id'],
			'firstName': _.adminInfo['firstName'],
			"lastName": _.adminInfo['lastName'],
			"email": _.adminInfo['email'],
			"role": _.adminInfo['role'][0],
		};
		if (_.adminInfo.uploadData) {
			updateData.photo = await Model.uploadPhoto(_.adminInfo.uploadData);
		}
		console.log(updateData)
		let response = await Model.updateAdmin(updateData);
		if(!response) return void 0;

		if (me['admin']['_id'] == _.adminInfo['_id']) {
			me = response['user'];
			me['admin'] = {
				createdAt: response['createdAt'],
				updatedAt: response['updatedAt'],
				_id: response['_id'],
				user: response['user']['_id'],
			}
			localStorage.setItem('me',JSON.stringify(me));
			G_Bus.trigger('header','rerender');
		}

		item.setAttribute('rerender',true);
		item.setAttribute('section','admin');
		G_Bus.trigger(_.componentName,'changeSection',{item})
		_.showSuccessPopup('Admin profile updated')
	}
	async updateParent({item}){
		const _ = this;
		let form = item.closest('.parent-profile-inner');
		let validate = await _.nextStepBtnValidation(form);
		if (!validate) return void 0;
		let updateData = {
			'_id': _.parentInfo['_id'],
			'firstName': _.parentInfo['firstName'],
			"lastName": _.parentInfo['lastName'],
			"email": _.parentInfo['email'],
			"phone": _.parentInfo['phone'],
			"role": _.parentInfo['role'][0],
		};

		if (_.parentInfo.uploadData) {
			updateData.photo = await Model.uploadPhoto(_.parentInfo.uploadData);
		}

		let response = await Model.updateParent(updateData);
		if(!response) return void 0;

		item.setAttribute('rerender',true);
		item.setAttribute('section','parent');
		G_Bus.trigger(_.componentName,'changeSection',{item})
		_.showSuccessPopup('Parent profile updated')
	}
	async saveChangePassword({item}){
		const _ = this;
		let
			form = item.closest('.passwords'),
			inputs = form.querySelectorAll('G-INPUT[type="password"]'),
			role = form.getAttribute('role') ?? 'student';

		let passwords = {
			'_id': _[`${role}Info`]._id
		};

		for (let input of inputs) {
			let name = input.getAttribute('name');
			_[`${role}Info`][name] = input.value;
			passwords[name] = input.value;
		}

		let response = await Model.updateStudentPassword(passwords);
		if (response) {
			G_Bus.trigger('modaler','closeModal')
			_.showSuccessPopup('Password has been changed');
		}
	}
	// Update methods
	
	// Fill methods
	fillParentInfo({item}){
		const _ = this;
		let
			prop = item.getAttribute('name'),
			value = item.value;
		if( typeof value == 'object'){
			value = value+'';
		}
		_['parentInfo'][prop] = value;
	}
	async fillStudentInfo({item}){
		const _ = this;
		let
			name = item.getAttribute('name'),
			value = item.value,
			courseNames = ['firstSchool','secondSchool','thirdSchool','testDate','level','course'];

		let wizardData = _.wizardData ?? await Model.getWizardData();
		if( typeof value == 'object') value = value + '';
		let curPlanTitle = _.courseData.currentPlan;
		if (!_.courseData[curPlanTitle]) _.courseData[curPlanTitle] = {};

		if (courseNames.indexOf(name) >= 0) {
			let schools = ['firstSchool','secondSchool','thirdSchool'];
			if (schools.indexOf(name) >= 0) {
				_.courseData[curPlanTitle][name] = wizardData.schools.find((unit)=>{
					if (unit._id == item.value) return unit;
				})
			} else _.courseData[curPlanTitle][name] = value;
		} else {
			if (name == 'grade') {
				_.studentInfo.grade = wizardData.grades.find((unit)=>{
					if (unit._id == item.value) return unit;
				})
			} else _.studentInfo[name] = value;
		}
	}
	fillAdminInfo({item}){
		const _ = this;
		_.adminInfo[item.getAttribute('name')] = item.value;
	}
	skipTestDate({item}){
		const _ = this;
		let
			cont = item.closest('.adding-section'),
			inputDate = cont.querySelector('g-input');
		if (item.id == "have_yet") {
			_.courseData[_.courseData.currentPlan] = null;
			_.courseData[_.courseData.currentPlan].testDatePicked = false;
			inputDate.setAttribute('disabled',true);
			inputDate.removeAttribute('data-required');
			inputDate.value = '';
		} else {
			inputDate.removeAttribute('disabled');
			inputDate.setAttribute('data-required','');
			_.courseData[_.courseData.currentPlan].testDatePicked = true;
		}
	}
	fillDataByClass({className,data}){
		const _ = this;
		let conts = document.querySelectorAll(`${className}`);
		conts.forEach( item=>{
			item.textContent = data;
		});
	}
	async fillUserTable({usersData,selector = '',cont}){
		const _ = this;
		let
			tbody = cont ? cont.querySelector('.tbl-body') : _.f(selector + ' .tbl-body'),
			total = usersData['total'];

		_.clear(tbody);

		_.fillDataByClass({className:`.gusers-count`,data:`${usersData ? total : 0}`});

		if(!usersData.total) {
			return void 'No users data';
		}
		
		let tableData = _.usersBodyRowsTpl(usersData);
		if (tbody) tbody.append(...tableData);
		if (usersData.response.length) _.connectTableHead(selector);
	}
	async fillParentBlock({usersData}){
		const _ = this;
		let total = usersData['total'];
		_.fillDataByClass({className:`#assignParent .users-count`,data:`${usersData ? total : 0}`});

		if(!usersData) {
			return void 'no users data';
		}
	}
	async fillParentsTable({usersData}){
		const _ = this;
		let tbodies = document.querySelectorAll(`#assignParent .tbl-body`);
		if (!tbodies || !tbodies.length) {
			_.fillBodyParentsTable({usersData});
			return;
		}
		let tableData = _.parentsBodyRowsTpl({usersData});
		for (let tbody of tbodies) {
			if (tbody.closest('[hidden]')) continue;
			_.clear(tbody)
			tbody.append(...tableData);
			if (usersData.response.length) _.connectTableHead('#assignParent');
		}
	}
	async fillBodyParentsTable({usersData,cont,role}){
		const _ = this;
		let
			tbody = cont ? cont.querySelector('.tbl-body') : _.f(`#bodyParents .tbl-body`),
			tableData = _.parentsBodyRowsTpl({usersData,type:'single',cont,role}),
			total = usersData['total'],
			limit = usersData['limit'];
		
		_.fillDataByClass({className:`.gusers-count`,data:`${usersData ? total : 0}`});
		_.fillDataByClass({className:`.gusers-limit`,data:`${usersData ? (limit <= total ? limit : total) : 0}`});
		_.clear(tbody)
		if (tbody) tbody.append(...tableData);
		if (usersData.response.length)_.connectTableHead('#bodyParents');
	}
	async fillProfile(profileData) {
		const _ = this;
		let studentId;
		if(profileData['item']){
			studentId = profileData['item'].getAttribute('data-id');
			_.subSection = profileData['item'].getAttribute('section');
		} else {
			studentId = profileData['_id'];
		}
		let currentStudent = await Model.getStudent(studentId);
		_.studentInfo = Object.assign({},currentStudent['user']);
		_.metaInfo = {};
		_.studentInfo['currentSchool'] = currentStudent['currentSchool'];
		_.studentInfo['currentPlan'] = currentStudent['currentPlan'];
		_.studentInfo['grade'] = currentStudent['grade'] ? currentStudent['grade']['_id'] ?? currentStudent['grade'] : '';
		_.studentInfo['userId'] = _.studentInfo['_id'];
		_.studentInfo['_id'] = currentStudent['_id'];
		_.studentInfo['plans'] = currentStudent['plans'];
		console.log(_.studentInfo)

		_.courseData = {};
		for (let item of _.studentInfo['plans']) {
			_.courseData[item.course.title] = item;
		}
		_.courseData.currentPlan = _.studentInfo.currentPlan.course.title;
		
		_.f('.student-profile-inner').innerHTML = _.personalInfo();

		let courseInfoCont = _.f('.student-profile-course-info');
		if (currentStudent['currentPlan']) courseInfoCont.innerHTML = _.courseInfo(_.wizardData ?? await Model.getWizardData());
		else courseInfoCont.innerHTML = _.emptyCourseInfo();

		_.f('.breadcrumbs').innerHTML = _.breadCrumbsTpl([{title:'Users'},{title:'Students'},{title:`${_.studentInfo['firstName']} ${_.studentInfo['lastName']} Profile`}]);
	}
	async fillAdminProfile(profileData) {
		const _ = this;
		let adminId;
		if(!profileData) return;
		if(profileData['item']){
			adminId = profileData['item'].getAttribute('data-id');
			_.subSection = profileData['item'].getAttribute('section');
		} else {
			adminId = profileData['_id'];
		}
		let currentAdmin = await Model.getAdmin(adminId);
		_.adminInfo = Object.assign({},currentAdmin['user']);
		_.adminInfo['userId'] = _.adminInfo['_id'];
		_.adminInfo['_id'] = currentAdmin['_id'];

		let adminInner = _.f('.admin-profile-inner');
		_.clear(adminInner);
		adminInner.append(_.markup(_.adminProfileInner()));
		_.f('.breadcrumbs').innerHTML = _.breadCrumbsTpl([{title:'Users'},{title:'Admins'},{title:`${_.adminInfo['firstName']} ${_.adminInfo['lastName']} Profile`}]);
	}
	async fillParentProfile(profileData) {
		const _ = this;
		let parentId;
		_.subSection = 'parentProfile';
		if(profileData['item']){
			parentId = profileData['item'].getAttribute('data-id');
		} else {
			parentId = profileData['_id'];
		}

		let currentParent = await Model.getParent(parentId);
		_.parentInfo = currentParent['user'];
		_.parentInfo['userId'] = _.parentInfo['_id'];
		_.parentInfo['_id'] = currentParent['_id'];
		_.parentInfo['phone'] = currentParent['phone'];
		_.parentInfo['students'] = currentParent['students'];

		_.f('.parent-profile-inner').innerHTML = _.parentsProfileInner();
		_.f('.breadcrumbs').innerHTML = _.breadCrumbsTpl([
			{title:'Users'},
			{title:'Parents'},
			{title:`${_.parentInfo['firstName']} ${_.parentInfo['lastName']} Profile`}
		]);
	}
	async fillParentsInfoTable(parentsData){
		const _ = this;
		let tbody = _.f(`.parents-info-table .tbl-body`);
		let tableData = _.parentsBodyRowsTpl({usersData:parentsData,type:'parentsInfo'});
		_.clear(tbody)
		tbody.append(...tableData);
		_.connectTableHead('.student-profile-inner');
	}
	fillActivityTable(){
		const _ = this;
		let table = _.f('.activity-table .tbl-body');
		_.clear(table);
		table.append(..._.activityBodyRowsTpl(_.activityData));
	}
	async fillStudentsTable(usersData,selector){
		const _ = this;
		let tbody = _.f('#parent-profile-popup .tbl-body');
		_.clear(tbody);

		if(!usersData) {
			return void 'no users data';
		}

		let tableData = _.usersBodyRowsTpl(usersData,'parent');
		tbody.append(...tableData);
		_.connectTableHead(selector);
	}
	async fillBodyAdminsTable(adminsData){
		const _ = this;
		let
			tbody = _.f(`#bodyAdmins .tbl-body`),
			tableData = _.parentsBodyRowsTpl({usersData:adminsData,type:'single'}),
			total = adminsData['total'],
			limit = adminsData['limit'];

		_.fillDataByClass({className:`.gusers-count`,data:`${adminsData ? total : 0}`});
		_.fillDataByClass({className:`.gusers-limit`,data:`${adminsData ? (limit <= total ? limit : total) : 0}`});
		_.clear(tbody)
		if (tbody) tbody.append(...tableData);
		_.connectTableHead('#bodyAdmins');
	}
	clearData(){
		const _ = this;
		_.studentInfo = {};
		_.parentInfo = {};
		_.parents = {};
		_.metaInfo = {};
		_.parentSkipped = false;
		_.coursePos = 0;
		_.courseData = {};
		_.courseAction = '';
	}
	// fill tables methods
	fillTableFilter(selector){
		const _ = this;
		let filters = _.f(`${selector ?? ''} .filter`);
		if (!filters) {
			return void 0;
		} else if (filters.length) {
			for (let filter of filters) {
				_.fillOneFilter(filter);
			}
		} else {
			_.fillOneFilter(filters)
		}
	}
	fillOneFilter(filter){
		const _ = this;
		_.clear(filter);
		filter.append(_.markup(_.filterTpl()))
	}
	paginationFill({limit,total,selector,cont}){
		const _ = this;
		let paginations = cont ? [cont] : document.querySelectorAll(`${selector ?? ''} .pagination`);
		if (!paginations.length) return;
		paginations.forEach(function (item){
			let role = item.getAttribute('role') ?? _.subSection;
			if (!_.searchInfo[role]) _.searchInfo[role] = {page:1};
			let tpl = _.paginationTpl({limit,total,page:_.searchInfo[role].page});
			_.clear(item);
			item.append(_.markup(tpl));
		})
	}
	async getSearchUsers({cont,role}){
		const _ = this;
		//_.searchInfo[role].page = 1;
		let usersData = await Model.getUsers({
			role:role == 'addingParent' ? 'parent' : role,
			update: true,
			searchInfo:_.searchInfo[role]
		});

		if (role == 'student') {
			_.fillUserTable({usersData,cont,role,selector:'#userBody'});
		} else if (role == 'parent') {
			_.fillBodyParentsTable({usersData,cont,role});
		} else if (role == 'admin') {
			_.fillBodyAdminsTable(usersData)
		} else if (role == 'addingParent') {
			_.parents = usersData;
			_.paginationFill({
				total:_.parents.total,
				limit:_.parents.limit,
				cont:cont.querySelector( '.pagination' )
			});
			_.fillParentBlock({usersData:_.parents});
			_.fillParentsTable({usersData:_.parents});
		}
		let paginationData = {
			cont:cont.querySelector('.pagination'),
			page:_.searchInfo[role].page,
			limit:usersData.limit,
		}
		paginationData.total = usersData.total;
		if (paginationData.page == 1) {
			if (usersData.find < usersData.limit) paginationData.total = usersData.find
		}
		_.rebuildPagination(paginationData);
	}
	// Fill methods end

	// Adding methods
	async addStudent({item}) {
		const _ = this;
		_._$.addingStep = _._$.addingStep;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	}
	addNewParent(clickData) {
		const _ = this;
		_.parentInfo = {};
		_.currentParent = {};
		let container;
		if (clickData) {
			let item = clickData.item;
			item.parentElement.querySelector('.active').classList.remove('active');
			item.classList.add('active');

			container = item.closest('.adding-body');
		} else {
			container = _.f('#addingForm');
		}
		let cont = container.querySelector('.adding-assign-body');
		if (cont) {
			_.clear(cont);
			cont.classList.remove('full');
			cont.append(_.markup(_.assignNewParent()))
		}

		_.parentSkipped =  false;
		_.studentInfo.parentId = null;
		_.metaInfo.parentAssigned = false;
		_.metaInfo.parentAddType = 'adding';
	}
	async selectAvatar(clickData) {
		const _ = this;

		let listCont = _.f('.avatars-list');
		if (!listCont.children.length ) {
			let wizardData = _.wizardData ?? await Model.getWizardData();
			_.avatars = wizardData['avatars'];
			listCont.append(_.markup(_.avatarsItemsTpl()));
		}

		let activeAvatar = listCont.querySelector('.active');
		if (activeAvatar) activeAvatar.classList.remove('active');

		let avatarInfo = _.studentInfo.avatar;
		if (avatarInfo) {
			listCont.querySelector(`[value="${avatarInfo['_id'] ?? avatarInfo}"]`).classList.add('active');
		}

		let callback = clickData.item.getAttribute('data-callback');
		if (callback) {
			_.f('#avatars').setAttribute('data-callback',callback);
		}

		G_Bus.trigger('modaler','closeModal');
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#avatars'});
	}
	pickAvatar({item}) {
		const _ = this;
		let
			listCont = item.closest('.avatars-list'),
			activeBtn = listCont.querySelector('.active');
		if (activeBtn) activeBtn.classList.remove('active');
		item.classList.add('active')

		let avatarName = item.getAttribute('title');
		_['metaInfo'].avatarName = avatarName;
		_['metaInfo'].avatar = item.value;
	}
	confirmAvatar({item}){
		const _ = this;

		_['studentInfo'].avatar = _['metaInfo'].avatar;
		_['studentInfo'].avatarName = _['metaInfo'].avatarName;

		let img = _.markup(`<img src="/img/${_['studentInfo'].avatarName}.svg">`)
		let avatarCont = _.f('.adding-avatar-letter');
		_.clear(avatarCont);
		avatarCont.append(img);

		_.closeAvatar({item})
	}
	closeAvatar({item}){
		const _ = this;
		let
			modalCont = item.closest('.avatars'),
			callback = modalCont.getAttribute('data-callback');

		G_Bus.trigger('modaler','closeModal');

		if (callback) {
			modalCont.removeAttribute('data-callback');
			_[callback]({item})
		}
	}
	// Adding methods end
	
	// Change methods
	changeStudentLevel({item}) {
		const _ = this;

		let activeButton = item.parentNode.querySelector('.active');
		if(activeButton) activeButton.classList.remove('active');
		item.classList.add('active');

		let levelId = item.getAttribute('data-id');
		let currentCourseTitle = _.courseData.currentPlan;
		_.courseData[currentCourseTitle].level = {
			_id: levelId,
			title: item.textContent
		};
		_.studentInfo.currentPlan.level = {
			_id: levelId,
			title: item.textContent
		};
	}
	async changeTestType({item}) {
		const _ = this;
		if (item.hasAttribute('disabled')) return;

		let activeButton = item.parentNode.querySelector('.active');
		if(activeButton) activeButton.classList.remove('active');
		item.classList.add('active');

		let
			pos = parseInt(item.getAttribute('pos')),
			levelButtons = item.closest('.adding-body').querySelector('.level-buttons');
		_.clear(levelButtons);
		levelButtons.innerHTML = '<img src="/img/loader.gif">';
		let stepData = _.wizardData ?? await Model.getWizardData();

		_.coursePos = pos;
		let courseTitle = stepData.courses[pos].title;
		if (!_.courseData[courseTitle]) _.courseData[courseTitle] = {};
		_.courseData.currentPlan = courseTitle;
		_.studentInfo.currentPlan.course = stepData['courses'][pos];
		_.studentInfo.currentPlan.level = stepData['courses'][pos]['levels'][0];
		_.courseData[courseTitle].course = stepData['courses'][pos];
		_.courseData[courseTitle].level = stepData['courses'][pos]['levels'][0];

		levelButtons.innerHTML = _.levelButtons(stepData['courses'][pos]);
	}
	async changeSection({item,event}) {
		const _ = this;
		_.prevSubSection = _.subSection;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render( struct,{item} );
		_.switchSubNavigate();
	}

	async changeProfileTab({item}) {
		const _ = this;
		let pos = item.getAttribute('data-pos');
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let studentInner = _.f('.student-profile-inner');
		let adminInner = _.f('.admin-profile-inner');
		let parentInner = _.f('.parent-profile-inner');
		if (parentInner) {
			if (pos == 12) parentInner.classList.add('noScroll');
			else parentInner.classList.remove('noScroll');
		}
		if(pos == 0){
			studentInner.classList.remove('short')
			_.fillProfile({_id:_.studentInfo['_id']});
		}
		if(pos == 1){
			studentInner.classList.remove('short')
			studentInner.innerHTML = _.parentsInfo();
			_.currentParent = await Model.getStudentParents( _.studentInfo['_id'] );
			if ( _.currentParent['response']['length'] ){
				studentInner.querySelector( '.button-link.blue' ).textContent = 'Change parent';
			}
			_.fillParentsInfoTable( _.currentParent );
		}
		if(pos == 2){
			studentInner.classList.remove('short')
			studentInner.innerHTML = _.activityHistory();
			_.fillActivityTable();
			_.connectTableHead('.activity-table')
		}
		if(pos == 3){
			studentInner.classList.add('short');
			_.notificationsData = await Model.getAdminNotifications();
			studentInner.innerHTML = _.notifications(_.notificationsData,{title:'Notifications'});
		}
		if(pos == 4){
			adminInner.classList.remove('short')
			_.fillAdminProfile({_id:_.adminInfo['_id']});
		}
		if(pos == 5){
			adminInner.classList.remove('short')
			adminInner.innerHTML = _.activityHistory();
			_.fillActivityTable();
			_.connectTableHead('.activity-table');
		}
		if(pos == 6){
			parentInner.classList.remove('short');
			_.fillParentProfile({_id:_.parentInfo['_id'],outerId:_.parentInfo['outerId']});
		}
		if (pos == 9) {
			parentInner.classList.remove('short')
			parentInner.innerHTML = _.activityHistory();
			_.fillActivityTable();
			_.connectTableHead('.activity-table')
		}
		if (pos == 10) {
			_.notifSubsections = await Model.getParentNotificationsSections();
			_.notificationsData = await Model.getParentNotifications(_.notifSubsections[0].value);
			let layout = `
				<div class="notifications-cont">
					${_.notificationsNavigation(_.notifSubsections)}
					<div class="notifications-list-cont">
						${_.notifications(_.notificationsData,{
							title:'General Notifications',
							subtitle:'User gets notification when',
							types:_.notifSubsections[0].types})}
					</div>
				</div>
			`;
			parentInner.innerHTML = layout;
		}
		if (pos == 11) {
			let
				cards = await Model.getCardsInfo(),
				addresses = await Model.getBillingAddressInfo(),
				layout = _.billingsTpl();

			parentInner.innerHTML = layout;
			_.fillParentCardsInfo(cards);
			_.fillParentAddressesInfo(addresses);
		}
		if (pos == 12) {
			let tableData = await Model.getParentStudents(_.parentInfo['_id']);
			let layout = _.parentsStudentsTpl();
			_.clear(parentInner);
			parentInner.append(_.markup(layout));
			let table = parentInner.querySelector('.tbl-body');
			_.clear(table);
			table.innerHTML = _.parentsStudentsRowsTpl(tableData);
			_.connectTableHead('.parent-profile-inner');
		}
	}
	showAddCard({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#addCard'})
	}
	showAddBillingAddress({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#addBillingAddress'})
	}
	fillParentCardsInfo(cardsInfo){
		const _ = this;
		let cardsCont = _.f('#cards');
		_.clear(cardsCont)
		if (cardsInfo.length) {
			cardsCont.append(_.markup(_.fillParentCardsTpl(cardsInfo)));
		}
	}
	fillParentAddressesInfo(addressesInfo){
		const _ = this;
		let addressesCont = _.f('#billing-addresses');
		_.clear(addressesCont)
		if (addressesInfo.length) {
			addressesCont.append(_.markup(_.fillParentAddressTpl(addressesInfo)));
		}
	}
	async changeParentPopupProfileTab({item}) {
		const _ = this;
		let
			pos = item.getAttribute('data-pos'),
			parentId = _.parentInfo['_id'];
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let container = _.f('.parent-popup-profile-body');
		if(pos == 0){
			container.classList.add('adding-center');
			container.innerHTML = _.parentPersonalInfoTpl();
		}
		if(pos == 1){
			container.classList.remove('adding-center');
			container.innerHTML = _.parentChildesInfoTpl();
			let tableData = await Model.getParentStudents(parentId);
			_.fillStudentsTable(tableData,'#parent-profile-popup');
		}
	}
	async sortParentStudentsBy({item}){
		const _ = this;
		let container = item.closest('.tbl');
		let table = container.querySelector('.tbl-body');
		let parentId = _.parentInfo['_id'];
		_.clear(table);
		let tableData = await Model.getParentStudents(parentId,item.getAttribute('value'));

		let role = item.getAttribute('role');

		if (role === 'studentProfile') {
			_.fillStudentsTable(tableData,'#parent-profile-popup');
		} else if (role === 'parentProfile') {
			_.clear(table);
			table.innerHTML = _.parentsStudentsRowsTpl(tableData);
			_.connectTableHead('.parent-profile-inner');
		}
	}
	async changeCurrentCourse({item}){
		const _ = this;
		let
			value = item.getAttribute('value'),
			parent = item.parentElement,
			activeBtn = parent.querySelector('.active');

		if (activeBtn == item) return null;

		activeBtn.classList.remove('active');
		item.classList.add('active');

		let newPlan = _.courseData[item.value];
		let wizardData = _.wizardData ?? Model.getWizardData();
		if (!newPlan) {
			let curCourse = wizardData.courses.find((item)=>{
				if (item.title == value) return item;
			});
			newPlan = {
				course: curCourse,
				level: curCourse.levels[0]
			};
		}
		_.courseData.currentPlan = newPlan.course.title;
		_.courseData[_.courseData.currentPlan] = newPlan;
		_._$.assignStep = 1;

		let courseInfoCont = _.f('.student-profile-course-info');
		if (newPlan.firstSchool) courseInfoCont.innerHTML = _.courseInfo(_.wizardData ?? await Model.getWizardData());
		else courseInfoCont.innerHTML = _.emptyCourseInfo();
	}
	flexible(){
		const _ = this;
		if(_.subSection === 'profile') {
			return {
				'body': 'profile'
			};
		} else if(_.subSection === 'adminProfile') {
			return {
				'body': 'adminProfile'
			};
		} else if(_.subSection === 'parentProfile') {
			return {
				'body': 'parentProfile'
			};
		} else if(_.subSection === 'student') {
			return {
				'body': 'usersBody'
			};
		} else if (_.subSection === 'parent') {
			return {
				'body': 'parentsBody'
			};
		} else if (_.subSection === 'admin') {
			return {
				'body':'adminsBody'
			};
		}
	}
	// Change methods end
	
	// Show methods
	async showAssignPopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#assignForm'});
	}
	showRemovePopup({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removeForm','closeBtn':'hide'});
	}
	showRemovedCoursePopup() {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#removedCourse','closeBtn':'hide'});
	}
	showRemoveUserPopup({item}){
		const _ = this;
		_.studentInfo['_id'] = item.getAttribute('data-id');
		//_.metaInfo['sourse'] = '';
		G_Bus.trigger('modaler','showModal', {item:item,type:'html',target:'#removeUserForm','closeBtn':'hide'});
	}
	showRemoveAdminPopup({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal', {item:item,type:'html',target:'#removeAdminForm','closeBtn':'hide'});
	}
	showRemoveParentPopup({item}){
		const _ = this;
		if (item.hasAttribute('disabled')) return;
		_.parentInfo['_id'] = item.getAttribute('data-id');
		G_Bus.trigger('modaler','showModal', {item:item,type:'html',target:'#removeParentForm','closeBtn':'hide'});
	}
	showAddParentPopup({item}){
		const _ = this;
		_.addNewParent();
		let from = item.getAttribute('from');
		if (!_.parentInfo || !_.parentInfo.type || _.parentInfo.type !== 'adding') _.parentInfo = {type:'adding'}
		_.f('.parent-popup-body').innerHTML = _.parentAddingFromProfile(from);
		
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: '#add-parent'
		})
	}
	async showPopupParentProfile({item}){
		const _ = this;
		let cont = _.f('#parent-profile-popup');
		let parentId = item.getAttribute('data-id');
		cont.setAttribute('data-id',parentId);

		let parentInfo = await Model.getParent(parentId);
		_.parentInfo = parentInfo['user'];
		_.parentInfo['phone'] = parentInfo['phone'];
		_.parentInfo['_id'] = parentInfo['_id'];
		_.parentInfo['userId'] = parentInfo.user['_id'];
		_.parentInfo['photo'] = parentInfo.user.photo;

		G_Bus.trigger('modaler','closeModal');
		_.f('.parent-popup-profile-body').innerHTML = _.parentPersonalInfoTpl();
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: '#parent-profile-popup',
			closeBtn: 'hide'
		});
		let btn = cont.querySelector('.section-button[data-pos="0"]');
		G_Bus.trigger(_.componentName,'changeParentPopupProfileTab',{item:btn})
	}
	showHistoryDetails({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{target:'#historyDetails'})
	}
	showChangePassword({item}){
		const _ = this;
		let role = item.getAttribute('role');
		if (role) {
			let targetForm = _.f('#changePassword');
			targetForm.setAttribute('role',role);
		}
		G_Bus.trigger('modaler','showModal',{target:'#changePassword'})
	}
	async notificationNavigate({item}){
		const _ = this;
		let
			cont = _.f('.notifications-list-cont'),
			index = parseInt(item.getAttribute('data-pos'));
		item.closest('.notifications-navigate-list').querySelector('.active').classList.remove('active');
		item.classList.add('active');
		_.notifSubsections = await Model.getParentNotificationsSections();
		_.notificationsData = await Model.getParentNotifications(_.notifSubsections[index].value);
		cont.innerHTML = _.notifications(_.notificationsData,{
			title:'General Notifications',
			subtitle:'User gets notification when',
			types:_.notifSubsections[index].types
		});
	}

	cancelParentProfile({item}){
		const _ = this;
		G_Bus.trigger('modaler','closeModal');

		if (_.subSection === 'student'){
			G_Bus.trigger(_.componentName,'addStudent',{item});
			G_Bus.trigger(_.componentName,'assignParent');
		}
	}
	// Show methods end
	
	// Validation methods
	validatePassword({item}){
		const _ = this;
		let
			cont = item.closest('.passwords'),
			inputs = cont.querySelectorAll('G-INPUT[type="password"]'),
			text = item.nextElementSibling,
			validate = true;



		if (item == inputs[0]) {
			validate = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(item.value);
		} else {
			validate = (item.value === inputs[0].value);
		}

		if (validate) {
			item.setMarker();
			text.removeAttribute('style');
			if (item == inputs[1]) text.setAttribute('style','display:none;')
		} else {
			item.setMarker('red');
			text.style = 'color: red;';
		}

		let callback = item.getAttribute('data-callback');
		if (callback) {
			let callBackDetails = callback.split(':');
			G_Bus.trigger(callBackDetails[0],callBackDetails[1],{item});
		}
		return validate;
	}
	async checkEmail({item}){
		const _ = this;
		let value = item.value;
		if (!value) {
			item.doValidate("Email can't be empty");
			return false;
		}
		let
			dogPos = value.indexOf('@'),
			dotPos = value.lastIndexOf('.');
		if (dogPos <= 0 || dotPos <= 0 || dogPos > dotPos || dotPos == value.length - 1) {
			item.doValidate("Incorrect email");
			return false;
		}
		let response = await Model.checkEmail(value);
		if (!response) {
			item.doValidate("Email can't be empty");
			return false;
		}
		if (response.substr(response.length - 4) !== 'free') {
			if (item.getAttribute('data-value')) {
				if (value == item.getAttribute('data-value')) return true;
			}
			item.doValidate('User with this email address already exists');
			return false;
		}
		return true;
	}
	// Validation methods end

	handleErrors({method,data}){
		const _ = this;
		if( method == 'getUsers'){
		}
	}

	connectTableHead(selector) {
		const _ = this;
		let conts = document.querySelectorAll(`${selector ?? ''} .tbl`);
		if (!conts) return void 0;

		for (let cont of conts) {
			if (cont.closest('[hidden]')) continue;
			let
				head = cont.querySelector('.tbl-head'),
				ths = head.querySelectorAll('.tbl-item'),
				table = cont.querySelector('TABLE'),
				row = table.querySelector('TBODY TR');

			if (!row) return;

			let tds = row.querySelectorAll('.tbl-item');
			ths.forEach(function (item,index){
				let w = tds[index].getBoundingClientRect().width;
				item.style = `width:${w}px;flex: 0 0 ${w}px;`
			})
		}
	}
	skipParent ({item}) {
		const _ = this;
		item.parentElement.querySelector('.active').classList.remove('active');
		item.classList.add('active')
		let cont = _.f('.adding-assign-body');
		_.clear(cont);
		cont.classList.remove('full');

		_.metaInfo.parentAddType = 'skip'
		cont.append(_.markup(_.skipParentTpl()));
		_.parentSkipped=  true;
	}
	generatePassword({item}){
		const _ = this;
		let
			len = Math.ceil((Math.random() * 8)) + 8,
			inputs = item.closest('.passwords').querySelectorAll('G-INPUT[type="password"]'),
			symbols = {
				specials:['!','@','#','$','%','^','&','*'],
				numbers:['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
				uppers:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
				lowers:['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
			},
			rawPassword = {},
			password = '',
			input;

		for (let key in symbols) {
			rawPassword[key] = [];
			for (let i = 0; i < Math.ceil(len / 4); i++) {
				let number = Math.ceil(Math.random() * symbols[key].length - 1);
				rawPassword[key].push(symbols[key][number])
			}
		}
		let newRawPassword = rawPassword['specials'].concat(rawPassword['numbers'],rawPassword['uppers'],rawPassword['lowers']);
		while(newRawPassword.length) {
			password += newRawPassword.splice([Math.random() * (newRawPassword.length - 1)],1);
		}

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].value = password.toString();
			let callBack = inputs[i].getAttribute('data-input');
			if (callBack) {
				let callBackTitle = callBack.split(':')[1];
				G_Bus.trigger(_.componentName,callBackTitle,{item:inputs[i]});
			}
			if (!i) {
				input = inputs[i].shadow.querySelector('INPUT');
				input.type = 'text';
				input.select();
				document.execCommand("copy");
			}
			_.validatePassword({item:inputs[i]})
		}
		G_Bus.trigger(_.componentName,'showSuccessPopup','Password Generated and Copied');
		setTimeout(()=>{input.type = 'password'},2000)
	}
	
	// Assign methods
	async assignParent(clickData = null) {
		const _ = this;
		let container;
		_.parentInfo = {};
		if ( clickData ) {
			let item = clickData.item;
			item.parentElement.querySelector('.active').classList.remove( 'active' );
			item.classList.add('active');

			container = item.closest('.adding-body');
		} else {
			container = _.f('#addingForm');
		}

		let cont = container.querySelector( '.adding-assign-body' );
		if (cont) {
			_.clear(cont);
			cont.classList.add( 'full' );
			cont.append( _.markup( _.assignParentTpl() ));
		}

		_.parents = await Model.getUsers({
			role:'parent',
			searchInfo: _.searchInfo['addingParent']
		});

		_.paginationFill({
			total:_.parents.total,
			limit:_.parents.limit,
			cont:cont.querySelector( '.pagination' )
		});
		_.fillParentBlock({usersData:_.parents});
		_.fillParentsTable({usersData:_.parents});

		if ( !_.isEmpty(_.currentParent) ){
			if (_.currentParent['response']) {
				for ( let parent of _.currentParent['response'] ){
					let curParentAssignBtn = cont.querySelector(`.users-btn.button-blue[data-id="${ parent['_id'] }"]`);
					if ( !curParentAssignBtn ) continue;
					curParentAssignBtn.closest('TR').remove();
				}
			} else {
				let curParentAssignBtn = cont.querySelector(`.users-btn.button-blue[data-id="${ _.currentParent['_id'] }"]`);
				if ( curParentAssignBtn ) curParentAssignBtn.closest('TR').remove();
			}
		}

		_.parentSkipped =  false;
		_.metaInfo.parentAddType = 'assign';
	}
	async assignStudentToParent({item}) {
		const _ = this;
		let parentId = item.getAttribute('data-id');

		if ( _.subSection === 'profile' && _.studentInfo['_id'] ){
			let cont = _.f( '#add-parent .tbl' );
			_.clear( cont );
			cont.append( _.markup( `<img src="/img/loader.gif">` ));

			await Model.assignStudentToParent( parentId,_.studentInfo['_id'] );
			G_Bus.trigger( 'modaler','closeModal' );
			let sectionButton = _.f( 'g-body .section-button.active' );

			_.changeProfileTab({item:sectionButton});
			return;
		}

		if ( _.studentInfo['parentId'] ){
			let
				usersTable = item.closest('.table'),
				usersBtnSelector = `.users-btn[data-id="${_.studentInfo['parentId']}"]`,
				userBtn = usersTable.querySelector(usersBtnSelector);
			userBtn.textContent = 'Assign';
		}
		_.studentInfo['parentId'] = parentId;

		let parData = Model.parentsData.response;
		_.currentParent = parData.filter( parent => parent['_id'] == _.studentInfo['parentId'] )[0];

		_.f('.parent-adding-table').innerHTML = _.assignedParent(_.currentParent);
		_.parentInfo = _.currentParent['user'];
		_.parentInfo.type = 'assigned';
		_.metaInfo.parentAssigned = true;
		_.connectTableHead();
	}
	async assignCourse({item}) {
		const _ = this;
		let wizardData = _.wizardData ?? await Model.getWizardData();

		_.courseData.studentId = _.studentInfo._id;
		_.courseStatus = 'assigned';

		_.f('.student-profile-course-info').innerHTML = _.courseInfo(wizardData);
		G_Bus.trigger('modaler','closeModal');
		//_.showSuccessPopup('Course has been successfully assigned');
	}
	async assignFirstParent({item}) {
		const _ = this;
		let parentId,studentId = _.studentInfo['_id'];
		if(!_.metaInfo.parentAddType || ( _.metaInfo.parentAddType == 'adding')){
			let parent = await Model.createParent(_.parentInfo);
			parentId = parent['_id'];
		}else{
			parentId = _.studentInfo['parentId'];
		}
		let response = await Model.assignStudentToParent(parentId,studentId);
		G_Bus.trigger(_.componentName,'showSuccessPopup','')
	}
	// Assign methods
	
	// Remove methods
	async removeCourse({item}) {
		const _ = this;
		if (!_.removedCourseData) _.removedCourseData = {};
		if (_.courseData[_.courseData.currentPlan]._id) {
			_.removedCourseData[_.courseData.currentPlan] = {
				studentId: _.studentInfo._id,
				planId: _.courseData[_.courseData.currentPlan]._id
			};
		}
		let tempCurPlan = Object.assign({},_.courseData[_.courseData.currentPlan]);
		_.courseData[_.courseData.currentPlan] = {
			course: tempCurPlan.course,
			level: _.wizardData.courses.find((item)=>{
				if (item._id == tempCurPlan.course._id) {
					return item
				}
			}).levels[0]
		};

		let courseInfo = _.f('.student-profile-course-info');
		_.clear(courseInfo);

		_._$.assignStep = 1;

		courseInfo.innerHTML = _.emptyCourseInfo();
		G_Bus.trigger('modaler','closeModal');

		_.courseStatus = 'removed';
		for (let key in _.courseData) {
			if (!_.isEmpty(_.courseData[key].firstSchool)) {
				_.courseStatus = null;
				break;
			}
		}
		//_.showSuccessPopup('Course has been successfully removed')
	}
	async removeUser({item}){
		const _ = this;
		let response = await Model.removeStudent(_.studentInfo['_id'] ?? item.getAttribute('data-id'));
		if (!response) return;
		
		if (_.subSection == 'profile') {
			item.setAttribute('rerender',true);
			item.setAttribute('section','student');
			G_Bus.trigger(_.componentName,'changeSection',{item})
		} else {
			_.f(`TR[user-id="${_.studentInfo['_id'] ?? item.getAttribute('data-id')}"]`).remove();
		}
		G_Bus.trigger('modaler','closeModal',{item})
		_.showSuccessPopup('Student profile deleted')
	}
	async removeAdmin({item}){
		const _ = this;
		let response = await Model.removeAdmin(_.adminInfo['_id']);
		if (!response) return;

		if (_.subSection == 'adminProfile') {
			item.setAttribute('rerender',true);
			item.setAttribute('section','admin');
			G_Bus.trigger(_.componentName,'changeSection',{item})
		} else {
			_.f(`TR[user-id="${_.adminInfo['_id']}"]`).remove();
		}
		G_Bus.trigger('modaler','closeModal',{item})
		_.showSuccessPopup('Admin profile deleted')
	}
	async removeParent({item}){
		const _ = this;
		let response = await Model.removeParent(_.parentInfo['_id']);
		if (!response) return;
		item.setAttribute('rerender',true);
		item.setAttribute('section','parent');
		G_Bus.trigger(_.componentName,'changeSection',{item})
		/*if (_.subSection == 'parentProfile') {
			item.setAttribute('rerender',true);
			item.setAttribute('section','student');
			G_Bus.trigger(_.componentName,'changeSection',{item})
		} else {
			_.f(`TR[user-id="${_.parentInfo['_id']}"]`).remove();
		}*/
		G_Bus.trigger('modaler','closeModal')
		_.showSuccessPopup('Parent profile deleted');
	}
	async removeAssignedParent({item}) {
		const _ = this;
		_.studentInfo['parentId'] = null;
		_.metaInfo['parentAssigned'] = false;
		let cont = _.f( '.parent-adding-table' );
		cont.innerHTML = _.assignParentTpl( true );
		_.paginationFill({
			total:_.parents.total,
			limit:_.parents.limit,
			cont:cont.querySelector('.pagination')
		});
		_.connectTableHead()
	}
	// Remove methods

	//search methods
	searchUsers({item}) {
		const _ = this;
		let
			name = item.getAttribute('name'),
			value = item.value,
			cont = item.closest('.block'),
			filter = item.closest('.filter'),
			role = filter.getAttribute('role') ?? _.subSection;

		if (!_.searchInfo[role]) _.searchInfo[role] = {page:1};
		_.searchInfo[role][name] = value;
		_.searchInfo[role].page = 1;
		_.getSearchUsers({cont,role})
	}
	sortBy({item}) {
		const _ = this;
		let
			role = item.getAttribute('role') ?? _.subSection,
			cont = item.closest('.block'),
			value = item.getAttribute('value');
		if (!value) return;
		if (!_.searchInfo[role]) _.searchInfo[role] = {page: 1};
		_.searchInfo[role]['sort'] = value;
		_.searchInfo[role].page = 1;
		_.getSearchUsers({cont,role})
	}

	filterUsersByDates({item}){
		const _ = this;
		let
			cont = item.closest('.block'),
			filter = item.closest('.filter'),
			role = filter.getAttribute('role') ?? _.subSection,
			dates = item.value.split('|');
		if (!_.searchInfo[role]) _.searchInfo[role] = {page:1};
		_.searchInfo[role]['startDate'] = dates[0];
		_.searchInfo[role].page = 1;
		_.searchInfo[role]['endDate'] = dates[1] ?? dates[0];
		_.searchInfo[role][item.getAttribute('name')] = item.value;

		_.getSearchUsers({cont,role})
	}
	//end search methods

	setCancelBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-prev-btn`);
		stepBtn.setAttribute('data-click', 'modaler:closeModal');
		stepBtn.textContent = 'Cancel';
	}
	setPrevBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-prev-btn`);
		stepBtn.setAttribute('data-click',`${_.componentName}:changePrevStep`);
		stepBtn.setAttribute('step',`2`);
		stepBtn.textContent = 'Back';
	}
	setNextBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-next-btn`);
		stepBtn.textContent = 'Next';
		stepBtn.className = 'button-blue step-next-btn';
		stepBtn.setAttribute('data-click',`${_.componentName}:changeNextStep`);
	}
	setSubmitBtn(type = 'adding') {
		const _ = this;
		let stepBtn = _.f(`#${type}Form .step-next-btn`);
		stepBtn.className = 'button-blue button-green step-next-btn';
		stepBtn.textContent = 'Submit';
		if(type === 'adding') {
			stepBtn.setAttribute('data-click',`${_.componentName}:createStudent`);
		}
		if(type == 'assign'){
			stepBtn.setAttribute('data-click',`${_.componentName}:assignCourse`);
		}
		
	}
	async changeNextStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			let validation = await _.nextStepBtnValidation(_.f('#addingForm'));
			if (!validation) return;
			if(_.maxStep > _._$.addingStep) _._$.addingStep++;
		}else{
			let validation = await _.nextStepBtnValidation(_.f('#assignForm'));
			if (!validation) return;
			if(_.maxAssignStep > _._$.assignStep) _._$.assignStep++;
		}
	}
	changePrevStep({item}) {
		const _ = this;
		let type = item.getAttribute('type');
		if( type == 'adding' ) {
			if(_._$.addingStep > _.minStep) _._$.addingStep--;
		}else{
			if(_._$.assignStep > _.minStep) _._$.assignStep--;
		}
	}
	async nextStepBtnValidation(cont){
		const _ = this;
		let inputs = cont.querySelectorAll(`[data-required]`);
		let validate = true;

		if (inputs.length) {
			for (let item of inputs) {
				let outFocus = item.getAttribute('data-outfocus');
				if (outFocus) {
					let outFocusMethod = outFocus.split(':')[1];
					let rawValidate = await _[outFocusMethod]({item});
					if (!rawValidate) validate = false;
				} else if (item.tagName == 'G-SELECT') {
					if (!item.value.length) {
						validate = false;
						item.doValidate("This field can't be empty");
					}
				} else if (!item.value) {
					validate = false;
					item.doValidate("This field can't be empty");
				}
			}
		} else if (_._$.addingStep == 3) {
			if (_.metaInfo['parentAddType'] && !_.metaInfo['parentAssigned']) validate = false;
		} else if (_._$.addingStep == 1) {
			if (_.studentInfo['course'] && !_.studentInfo['level']) {
				validate = false;
				_._$.addingStep = 1;
			}
		}
		return validate;
	}
	jumpToStep({item}) {
		const _ = this;
		let
		type = item.getAttribute('type'),
		step = parseInt(item.getAttribute('step'));
		if( type == 'adding' ){
			_._$.addingStep = step;
		}else{
			_._$.assignStep = step;
		}
	}
	async handleAddingSteps({addingStep}) {
		const _ = this;
		if(!_.initedUpdate){
			let wizardData = _.wizardData ?? await Model.getWizardData();
			_.stepsObj = {
				1: _.addingStepOne.bind(_,wizardData),
				2: _.addingStepTwo.bind(_,wizardData),
				3: _.addingStepThree.bind(_,wizardData),
				4: _.addingStepFour.bind(_,wizardData),
				5: _.addingStepFive.bind(_),
				6: _.addingStepSix.bind(_)
			};
			return void 0;
		}
		_.courseAction = 'adding';
		let addingBody = _.f('#addingForm .adding-body');
		if (!addingBody) return void 0;
		addingBody.innerHTML = '<img src="/img/loader.gif">';
		_.clear(addingBody);
		
		if(addingStep == _.minStep){
			_.setCancelBtn();
		}else{
			_.setPrevBtn();
		}
		if(addingStep == _.maxStep){
			_.setSubmitBtn();
		}else{
			_.setNextBtn();
		}
		if(addingStep == 1){
			let stepOneData = _.wizardData ?? await Model.getWizardData();
			if (_.subSection === 'student') {
				if (_.isEmpty(_.studentInfo.currentPlan)) {
					_.studentInfo.currentPlan = {
						course: stepOneData['courses'][0],
						level: stepOneData['courses'][0]['levels'][0],
					};
				}
				_.courseData = {};
				_.courseData.currentPlan = _.studentInfo.currentPlan.course.title;
				_.courseData[_.courseData.currentPlan] = Object.assign({},_.studentInfo.currentPlan);
			}
		} else if (addingStep == 3) {
			_.searchInfo['addingParent'] = {page:1};
			_.parents = await Model.getUsers({role:'parent',searchInfo:_.searchInfo['addingParent']})
		}
		addingBody.append( _.markup( _.stepsObj[ addingStep ]() ) );
		
		_.f('#addingForm .adding-list-item.active').classList.remove('active');
		_.f(`#addingForm .adding-list-item:nth-child(${addingStep})`).classList.add('active');
		if (addingStep == 3 && _.parents) {
			_.paginationFill({limit:_.parents.limit,total:_.parents.total,selector:'#assignParent'})
			_.connectTableHead('#addingForm')
		}
	}
	async handleAssignSteps({assignStep}) {
		const _ = this;
		if(!_.initedUpdate){
			let wizardData = _.wizardData ?? await Model.getWizardData();
			_.stepsAssignObj = {
				1: _.addingStepOne.bind(_,wizardData),
				2: _.assignStepTwo.bind(_,wizardData),
				3: _.addingStepFive.bind(_),
				4: _.assignStepFour.bind(_),
			};
			return void 0;
		}
		_.courseAction = 'assign';
		let addingBody = _.f('#assignForm .adding-body');
		if (!addingBody) return void 0;
		_.clear(addingBody);

		if ( assignStep == _.minStep){
			_.setCancelBtn('assign');
		}else{
			_.setPrevBtn('assign');
		}
		if ( assignStep == _.maxAssignStep){
			_.setSubmitBtn('assign');
		}else{
			_.setNextBtn('assign');
		}
		addingBody.append( _.markup( _.stepsAssignObj[ assignStep ]() ) );
		
		_.f('#assignForm .adding-list-item.active').classList.remove('active');
		_.f(`#assignForm .adding-list-item:nth-child(${ assignStep })`).classList.add('active');
	}

	isEmpty(obj){
		const _ = this;
		for (let key in obj) {
			return false;
		}
		return true;
	}

	async uploadPhoto({item}){
		const _ = this;
		let
			cont = item.parentElement,
			role = item.getAttribute('role'),
			file = item.files[0],
			validate = true,
			img = cont.querySelector('IMG');

		if (!file) {
			cont.querySelector('.profile-img-letter').removeAttribute('style');
			_[`${role}Info`].uploadData = null;
			if (img) img.remove();
			return;
		}
		let formats = ['gif','png','jpg','jpeg'];
		if (file.size > 3100000) validate = false;
		let
			fileName = file.name,
			splitArray = fileName.split('.'),
			extension = splitArray[splitArray.length - 1],
			title = fileName.substr(0,fileName.length - extension.length - 1);
		if (formats.indexOf(extension) < 0) validate = false;
		if (!validate) {
			cont.querySelector('.profile-img-desc').style = 'color: red;';
			return;
		} else cont.querySelector('.profile-img-desc').removeAttribute('style');
		if (file) {
			if (!img) {
				img = document.createElement('IMG');
				img.className = 'user-photo';
				cont.querySelector('.profile-img').prepend(img);
				cont.querySelector('.profile-img-letter').setAttribute('style','display:none;');
			}
			_[`${role}Info`].uploadData = new FormData();
			_[`${role}Info`].uploadData.append('img',file,title + '.'  + extension);
			img.setAttribute('src',`${URL.createObjectURL(file)}`);
		}
	}

	async sendResetPassword({item}){
		const _ = this;
		let role = item.getAttribute('role');
		let info = _[`${role}Info`];
		let email = info.email;
		let form = item.closest('.adding-section');
		if (role == 'student') {
			let parentInfo = await Model.getStudentParents(info._id);
			if (parentInfo.status == 'success') email = parentInfo.response[0].user.email;
			//form = _.markupElement(`<form><input type="text" class="g-form-item" value="${email}" name="email"></form>`);
			form = _.el('FORM',{
				childes:[
					_.el('INPUT',{type:'text',class:'g-form-item',value:email,name:'email'})
				]
			});
		}

		let formData = _.gFormDataCapture(form);
		let response = await Model.sendResetPassword(info._id,formData);
		if (response.status == 'success') _.showSuccessPopup(response.message);
	}

	// Paginate
	paginate({item}){
		const _ = this;
		if (item.hasAttribute('disabled')) return;
		let page = parseInt(item.value);

		let pagCont = item.closest('.pagination');
		let role = pagCont.getAttribute('role') ?? _.subSection;
		if (!_.searchInfo[role]) _.searchInfo[role] = {page:1};
		_.searchInfo[role].page = page;
		let cont = item.closest('.block');
		_.getSearchUsers({cont,role});
	}
	paginateTo({item}){
		const _ = this;
		let value = parseInt(item.value);
		let limit = parseInt(item.getAttribute('limit'));

		if (isNaN(value)) item.value = 1;
		else if (value > limit) item.value = limit;
		else item.value = value;

		_.paginate({item})
	}
	rebuildPagination({cont,page = 1,limit,total}){
		const _ = this;
		let
			from = cont.querySelector('.gusers-page'),
			to = cont.querySelector('.gusers-limit'),
			count = cont.querySelector('.gusers-count'),
			inner = cont.querySelector('.pagination-inner'),
			prev = cont.querySelector('.pagination-prev'),
			next = cont.querySelector('.pagination-next'),
			jumpTo = cont.querySelector('.pagination-jump-to');

		let lastPage = Math.ceil(total / limit);
		let len = lastPage < 5 ? lastPage : 5;
		for (let index = 0; index < len; index++){
			let i,button = inner.children[index];
			if (page < 4) {
				i = index + 1;
			} else if (page > lastPage - 2) {
				i = lastPage - (len - 1) + index;
			} else {
				i = (page - 2) + index;
			}

			if (!button/* && len > index*/) {
				button = document.createElement('BUTTON');
				button.setAttribute('data-click',`${_.componentName}:paginate`)
				button.className = 'pagination-link';
				inner.append(button);
			}
			button.textContent = i.toString();
			button.value = i;
			if (page == i) button.classList.add('active');
			else button.classList.remove('active')

			if (inner.children.length > len) {
				let rawBtn = inner.children[inner.children.length - 1];
				if (rawBtn.classList.contains('active')) rawBtn.previousElementSibling.classList.add('active')
					rawBtn.remove();
			}
		}

		let previousPage = page - 1;
		prev.value = previousPage;
		if (previousPage) prev.removeAttribute('disabled');
		else prev.setAttribute('disabled','');

		let nextPage = page + 1;
		next.value = nextPage;
		if (nextPage <= lastPage) next.removeAttribute('disabled');
		else next.setAttribute('disabled','');

		jumpTo.value = page;
		jumpTo.setAttribute('limit',lastPage);

		from.textContent = (page - 1) * limit + 1;
		to.textContent = page * limit > total ? total : page * limit;
		count.textContent = total;
	}
	// End paginate
	
	async init(params){
		const _ = this;
		_._( _.handleAddingSteps.bind(_),[ 'addingStep' ] );
		_._( _.handleAssignSteps.bind(_),[ 'assignStep' ] );
	}
}