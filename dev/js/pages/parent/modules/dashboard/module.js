import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {ParentPage} from "../../parent.page.js";

export class DashboardModule extends ParentPage{
	constructor(props) {
		super(props);
		const _ = this;

		_.studentInfo = {};
		_.metaInfo = {};
		_.coursePos = 0;

		_.me = JSON.parse(localStorage.getItem('me'));

		if (_.me['parent']['students']['length']) {
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body-tabs':'dashboardTabs',
				'body':'dashboardBodyTpl',
				'footer':'dashboardFooter'
			};
			_.subSection = 'dashboard';
		} else {
			_.moduleStructure = {
				'body':'welcomeTpl',
				'footer':'dashboardFooter'
			};
			_.subSection = 'welcome';
		}
	}
	async asyncDefine(){}
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.currentStep = 1;
		_.scheduleColors = {
			"Practice":'#FFA621',
			"Practice test":'#009EF6',
			'SHSAT':'#4AB58E',
			'SSAT':'#4AB58E',
			'ISEE':'#4AB58E',
		};

		_.set({
			addingStep : 1
		})
		_.months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
		G_Bus
		.on(_,[
			'domReady','changeSection','changeStudent',
			'generatePassword','validatePassword','checkEmail','fillStudentInfo',
			'addingStep','assignStep',
			'changeStudentLevel','changeTestType','changePayMethod','skipTestDate',
			'updateStudent',
			'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
			'showAddCard','showAddBillingAddress',
			'hideProfile','showHiddenScores',
			'fillProfile','assignCourse','changeCurrentCourse',
			'showCancelMembership','showCalendar',
		]);
	}
	async domReady() {
		const _ = this;
		_.navigationInit();
		if ( !_.wizardData ) _.wizardData = await Model.getWizardData();
		if ( !_.currentStudent ) _.currentStudent = _.me['parent']['students'][0];

		if( _.subSection == 'welcome' ){
			_.body = _.f("g-body");
			_.clear( _.body );
			_.fillWelcome();
		}
		if( _.subSection == 'addingStudent' ){
			_.courseAction = 'adding';
			_.body = _.f("g-body");
			_.clear( _.body );
			_.fillAddingStudent();
		}
		if( _.subSection == 'assignCourse' ){
			_.courseAction = 'assign';
			_.body = _.f("g-body");
			_.clear( _.body );
			_.fillassignCourse();
		}
		if( _.subSection == 'dashboard' ){
			_.studentInfo = {};_.courseData = {};
			_.fillDashboardTabs();
			_.fillStudentProfile();
		}
		if( _.subSection == 'profile' ){
			_.body = _.f("g-body");
			_.clear( _.body );
			_.fillProfile();
		}
	}
	async changeSection({item, event,toHistory = true}) {
		const _ = this;
		_.previousSection = _.subSection;
		let section = item.getAttribute('section');
		let sectionParts = section.split('/');
		if (sectionParts.length > 1) section = sectionParts[sectionParts.length - 1];
		_.subSection = section;
		if (toHistory) history.pushState(null,null,section);
		if (item.getAttribute('data-clear')) {
			_.studentInfo = {};
			_.metaInfo = {};
			_.courseData = {};
		}

		if (section == 'welcome'){
			_.moduleStructure = {
				'header':'',
				'header-tabs':'',
				'body':'badgeTpl',
				'footer':'dashboardFooter'
			}
		}
		if (section == 'addingStudent'){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body':'badgeTpl',
				'footer':'dashboardFooter'
			}
		}
		if (section == 'assignCourse'){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body':'',
				'footer':'dashboardFooter'
			}
			_.courseAction === 'assign';
		}
		if (section == 'dashboard'){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body-tabs':'dashboardTabs',
				'body':'dashboardBodyTpl',
				'footer':'dashboardFooter'
			}
		}
		if (section == 'profile'){
			_.moduleStructure = {
				'header':'fullHeader',
				'body':'',
				'footer':'dashboardFooter'
			}
		}
		await _.render();
	}
	changeStudent({item,event}){
		const _ = this;
		let index = parseInt(item.getAttribute('data-index'));
		if(_.currentStudent === _.me['parent']['students'][index]) return void 0;

		_.currentStudent = _.me['parent']['students'][index];
		if (!_.currentStudent.currentPlan) _.currentStudent.currentPlan = _.currentStudent.plans[0];
		let activeButton = item.closest('.section').querySelector('.active');
		activeButton.classList.remove('active');
		item.classList.add('active');
		_.fillStudentProfile({item,event})
	}

	fillWelcome(){
		const _ = this;
		_.body.append( _.markup( _.welcomeTpl()));
	}

	//profile
	async fillProfile() {
		const _ = this;
		if (!_.studentInfo || !_.studentInfo.firstName) {
			_.studentInfo = Object.assign({},_.currentStudent['user']);
			_.metaInfo = {};
			_.studentInfo['currentSchool'] = _.currentStudent['currentSchool'];
			_.studentInfo['currentPlan'] = _.currentStudent['currentPlan'] ?? _.currentStudent.plans[0];
			_.studentInfo['grade'] = _.currentStudent['grade'] ? _.currentStudent['grade']['_id'] ?? _.currentStudent['grade'] : '';
			_.studentInfo['userId'] = _.studentInfo['_id'];
			_.studentInfo['_id'] = _.currentStudent['_id'];
			_.studentInfo['plans'] = _.currentStudent['plans'];

			_.courseData = {};
			for (let item of _.studentInfo['plans']) {
				_.courseData[item.course.title] = item;
			}
			_.courseData.currentPlan = _.studentInfo.currentPlan.course.title;
		}
		_.body.innerHTML = _.personalInfo();

		let courseInfoCont = _.f('.student-profile-course-info');
		if (_.courseData[_.courseData.currentPlan].firstSchool) courseInfoCont.innerHTML = _.courseInfo(_.wizardData ?? await Model.getWizardData());
		else courseInfoCont.innerHTML = _.emptyCourseInfo();
	}
	async changeCurrentCourse({item}){
		const _ = this;
		let
			value = item.getAttribute('value'),
			parent = item.parentElement,
			activeBtn = parent.querySelector('.active');
		_.courseData.currentPlan = value;

		if (activeBtn == item) return null;

		activeBtn.classList.remove('active');
		item.classList.add('active');

		let wizardData = _.wizardData ?? Model.getWizardData();
		let curCourse = _.courseData[value];
		if (!curCourse && _.isEmpty(curCourse)) {
			curCourse = {};
			curCourse.course = wizardData.courses.find((item)=>{
				if (item.title == value) return item;
			});
			curCourse.level = curCourse.course.levels[0];
			_.courseData[value] = curCourse;
		}
		_._$.assignStep = 1;

		let courseInfoCont = _.f('.student-profile-course-info');
		_.clear(courseInfoCont);
		if (_.courseData[value].firstSchool) courseInfoCont.append(_.markup(_.courseInfo(wizardData,curCourse)));
		else courseInfoCont.append(_.markup(_.emptyCourseInfo()));
	}
	showCancelMembership({item}) {
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#cancelForm','closeBtn':'hide'});
	}
	async assignCourse() {
		const _ = this;
		let btn = _.markupElement(`<button section="profile"></button>`)
		_.changeSection({item:btn})
		//_.showSuccessPopup('Course has been successfully assigned');
	}
	async saveCourses(){
		const _ = this;
		let plans = [];
		let courseResponse;
		for (let key in _.courseData) {
			if (key === 'currentPlan' || key === 'studentId') continue;
			if (_.courseData[key]._id) {
				let updateData = {
					_id: _.courseData[key]._id,
					studentId: _.currentStudent._id,
					firstSchool: _.courseData[key].firstSchool._id ?? _.courseData[key].firstSchool,
					secondSchool: _.courseData[key].secondSchool._id ?? _.courseData[key].secondSchool,
					thirdSchool: _.courseData[key].thirdSchool._id ?? _.courseData[key].thirdSchool,
					testDate: _.courseData[key].testDate,
				};
				courseResponse = await Model.updateCourse(updateData);
			} else {
				let curCourse = _.courseData[_.courseData.currentPlan];
				let assignData = {
					'studentId': _.currentStudent._id,
					'course': curCourse.course._id,
					'level': curCourse.level._id,
					'testDate': curCourse.testDate,
					firstSchool: curCourse.firstSchool._id,
					secondSchool: curCourse.secondSchool._id,
					thirdSchool: curCourse.thirdSchool._id,
				};
				courseResponse = await Model.assignCourse(assignData);
			}
			if (!courseResponse || _.isEmpty(courseResponse)) return null;
			plans.push(courseResponse);
		}
		_.currentStudent.plans = plans;
		_.currentStudent.currentPlan = _.find(plans,_.currentStudent.currentPlan._id);
		return true;
	}

	//dashboard
	async fillDashboardTabs(){
		const _ = this;
		let cont = _.f('.subnavigate.parent');
		let imgs = cont.querySelectorAll('[data-id]');
		for( let item of imgs ){
			let imgId = item.getAttribute('data-id');
			let imgTitle;
			_.wizardData['avatars'].find((elem)=>{
				if ( imgId == elem['_id'] ) imgTitle = elem['avatar'];
			})
			let img = `<img src="/img/${imgTitle}.svg">`;
			item.removeAttribute('data-id')
			item.append( _.markup( img ));
		}
	}
	async fillStudentProfile(){
		const _ = this;
		_.fillDashboard();
		_.fillScheduleBlock( _.currentStudent['_id'] );
		_.fillStarsBlock();

		let activities = await Model.getActivities( _.currentStudent['_id'] );
		let activitiesCont = _.f('#activities');
		_.clear(activitiesCont);
		activitiesCont.append( _.markup( _.recentActivitiesTpl( activities ) ) );

		let testScores = Model.getTestScores( _.currentStudent['_id'] );
		let testScoresCont = _.f('#testScores' );
		_.clear(testScoresCont);
		testScoresCont.append( _.markup( _.testScoresTpl( testScores ) ) );

		let skillLevelsCont = _.f('#skillLevels' );
		_.clear(skillLevelsCont);
		skillLevelsCont.append( _.markup( _.skillLevelsTpl() ) );

		let badges = Model.getBadges( _.currentStudent['_id'] );
		let badgesCont = _.f('#badges' );
		_.clear(badgesCont);
		badgesCont.append( _.markup( _.badgesTpl( badges ) ) );

		let usage = Model.getUsage( _.currentStudent['_id'] );
		let usageCont = _.f('#usageList' );
		_.clear(usageCont);
		usageCont.append( _.markup( _.usageStatisticsRow( usage ) ) );

		let mastered = Model.getMastered( _.currentStudent['_id'] );
		let masteredCont = _.f('#mastered' );
		_.clear(masteredCont);
		masteredCont.append( _.markup( _.skillsMastered( mastered ) ) );

		let totalTime = Model.getTotalTime( _.currentStudent['_id'] );
		let totalTimeCont = _.f('#totalTime' );
		_.clear(totalTimeCont);
		totalTimeCont.append( _.markup( _.totalPracticeTime( totalTime ) ) );

		let progress = Model.getProgress( _.currentStudent['_id'] );
		let progressCont = _.f('#studentProgress' );
		_.clear(progressCont);
		progressCont.append( _.markup( _.studentProgress( progress ) ) );
	}

	fillDashboard(){
		const _ = this;
		let cont = _.f('#studentProfile');
		_.clear(cont);
		cont.append( _.markup( _.studentProfileTpl( _.currentStudent)))

		let items = cont.querySelectorAll('[data-id]');
		for ( let item of items ){
			let type = item.getAttribute('data-type');
			if (item.getAttribute('data-id') == 'undefined') continue;
			let value = _.wizardData[type].find(elem=>{
				if (elem['_id'] == item.getAttribute('data-id')){
					return elem
				}
			});
			if (!value) continue;
			if( type != 'avatars' ){
				item.textContent = value[item.getAttribute('data-title')];
			}
			else item.src = `/img/${value[item.getAttribute('data-title')]}.svg`
		}
	}
	async fillScheduleBlock(id){
		const _ = this;
		let scheduleList = document.querySelector('#scheduleList');
		_.clear(scheduleList);
		scheduleList.classList.add('loader-parent');
		scheduleList.append(_.markup(`<img src="/img/loader.gif">`))

		let scheduleCont = scheduleList.closest('#scheduleCont');
		let schedule = await Model.getDashSchedule(id);
		let scheduleFooter = scheduleList.nextElementSibling;
		_.clear(scheduleList);
		let calendar = scheduleCont.querySelector('.calendar');
		if (calendar) calendar.remove();

		if (_.isEmpty(schedule)) {
			scheduleFooter.classList.add('schedule-hidden');
			scheduleList.append(_.markup(`<li class="block-empty-text">Student has not created the practice schedule yet.</li>`))
		} else {
			scheduleFooter.classList.remove('schedule-hidden');
			let scheduleTpl = _.scheduleBlock(schedule);
			scheduleList.append(_.markup(scheduleTpl));
			_.practiceCalendar(scheduleCont,_.currentStudent._id);
		}
		scheduleList.classList.remove('loader-parent');
	}
	async practiceCalendar(cont,studentId){
		const _ = this;
		let schedule = await Model.getSchedule(studentId);
		let dates = _.calendarDatesPrepare(schedule);

		let tpl = _.calendarTpl();
		for (let date of dates.months) {
			tpl += _.calendarMonthTpl(date,schedule,dates);
		}
		tpl += `
			</div>`;
		cont.append(_.markup(tpl))
	}
	calendarDatesPrepare(schedule){
		const _ = this;
		let curDate = new Date();
		let dates = {
			currentDate: {
				date: curDate,
				timeStamp: curDate.getTime(),
			},
			monthsTitles: ['January','February','March','April','May','June','July','August','September','October','November','December'],
			months: [],
			practiceTests: [],
		};

		let curMonth = dates.currentDate.date.getMonth() + 1;
		let curDateDay = dates.currentDate.date.getDate();
		let startDateStr = dates.currentDate.date.getFullYear().toString() + '-' + (curMonth < 10 ? '0' + curMonth : curMonth) + '-' + (curDateDay < 10 ? '0' + curDateDay : curDateDay);
		dates.startDate = {date: new Date(startDateStr)};
		dates.startDate.timeStamp = dates.startDate.date.getTime();

		let endDate,endDateType;
		if (schedule.testDate) {
			endDate = new Date(schedule.testDate);
			endDateType = 'final';
		} else {
			endDate = new Date(schedule.practiceTests[schedule.practiceTests.length - 1].date);
			endDateType = 'practice'
		}
		dates.endDate = {date: endDate,type: endDateType};
		dates.endDate.timeStamp = dates.endDate.date.getTime();
		dates.endDate.dateStr = endDate.getFullYear().toString() + '-' + (endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1) + '-' + (endDate.getDate() + 1 < 10 ? '0' + endDate.getDate() : endDate.getDate())

		let timeStamp = dates.startDate.timeStamp;
		let itemMonth = dates.startDate.date.getMonth() + 1;
		let itemYear = dates.startDate.date.getFullYear();
		while(timeStamp < dates.endDate.timeStamp) {
			let itemDate = new Date(itemYear + '-' + itemMonth + '-' + '01');
			timeStamp = itemDate.getTime();
			let dateData = {
				date: itemDate,
				timeStamp: itemDate.getTime(),
				length: _.getMonthLength(itemMonth,itemYear)
			};
			itemMonth++;
			if (itemMonth == 13) {
				itemMonth = 1;
				itemYear++;
			}
			if (itemMonth < 10) itemMonth = '0' + itemMonth;
			dates.months.push(dateData);
		}
		dates.months.splice(dates.months.length - 1);

		for (let key in schedule.practiceTests) {
			let practiceTestDate = schedule.practiceTests[key].date.split('T')[0];
			dates.practiceTests.push(practiceTestDate);
		}
		return dates;
	}
	getMonthLength(month,year){
		let long = [1,3,5,7,8,10,12];
		if (long.indexOf(parseInt(month)) >= 0) {
			return 31;
		} else if (parseInt(month) === 2) {
			return year % 4 ? 28 : 29;
		}
		return 30;
	}
	fillScheduleItemsTpl(dashSchedule){
		const _ = this;
		let schData = [
			dashSchedule['skillTest'],
			dashSchedule['practiceTest'],
			dashSchedule['test'],
		];
		let data = [];
		for (let item of schData) {
			if (!item) continue;
			let title = `Next ${item.title}`;
			let info = '', count = '';


			if (item['title'] === 'isee') {
				title = 'Your ISEE Date';
			}
			if (item['title'] === 'skill test') {
				title = 'Next practice';
			}
			if (item['title'] === "practice test") {
				title = 'Next Practice Test';
			}


			if (item['daysLeft'] <= 0) {
				count = 'Today';
				if (item['title'] === 'isee') {
					info = '<div class="info">Good luck</div>';
				}
			} else {
				count = item['daysLeft'];
				info = `<div class="info">Day${item['daysLeft'] == 1 ? '' : 's'} until ${item.title}</div>`
				if (item['title'] === 'isee') {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until ISEE test
						</div>`
				}
				if (item['title'] === 'skill test') {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until next practice
						</div>`
				}
				if (item['title'] === "practice test") {
					info = `
						<div class="info">
							Day${item['daysLeft'] == 1 ? '' : 's'} until next practice test
						</div>`
				}
			}
			data.push({info,count,item,title});
		}
		return data;
	}
	showCalendar({item}){
		const _ = this;
		let calendar = item.closest('#scheduleCont').querySelector('.calendar');
		if (item.classList.contains('active')) {
			item.classList.remove('active');
			calendar.classList.remove('active');
		} else {
			item.classList.add('active');
			calendar.classList.add('active');
		}
	}
	showCircleGraphic(data,cont){
		const _ = this;
		let starsCont = cont.querySelector('.stars-circle');
		if (!starsCont) return;

		let svg = `</svg>`;
		let radius = window.innerWidth < 768 ? 106 : 134;
		let sum = 0;
		let last;
		let count = 0;
		for (let key in data['items']) {
			let number = parseInt(data['items'][key]['count']);
			if (isNaN(number) || !number) continue;
			last = data['items'][key]['count'];
			sum += number;
			count++;
		}

		let circleWidth = 2 * Math.PI * radius;
		let strokeDashoffset = 0;

		for (let key in data['items']) {
			if (!data['items'][key]['count'] || isNaN(parseInt(data['items'][key]['count']))) continue;
			let width = data['items'][key]['count'] / sum * circleWidth;
			if (data['items'][key]['count'] !== last) {
				width -= 14 / (count - 1);
			} else width += 14;
			let strokeDasharray = `${width} ${circleWidth - width}`;
			svg = `<circle style="stroke:rgb(${data['items'][key]['color']})" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="-${strokeDashoffset}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
			strokeDashoffset += width;
		}

		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		svg = _.markupElement(svg);

		starsCont.prepend(svg);
	}
	drawCircleGraphic(item,color){
		const _ = this;
		let
			svg = `</svg>`,
			radius = 67,
			progress = item['progressBar'],
			circleWidth = 2 * Math.PI * radius,
			width = (progress / 100 * circleWidth),
			strokeDasharray = `${width} ${circleWidth - width}`;

		svg = `<circle style="stroke:${color}" stroke-dasharray="${strokeDasharray}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = `<circle style="opacity: .2;stroke:${color}" stroke-dasharray="${circleWidth} 0" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		return svg;
	}
	async fillStarsBlock(){
		const _ = this;
		let starsCont = _.f('#starsBlock');
		let starsInfo = {
			items: [
				{title:'Skills Practice',count:1500,color:'246,155,17'},
				{title:'Tests',count:1500,color:'0,149,232'},
				{title:'Videos Watched',count:2500,color:'80,20,208'},
				{title:'Reviewed Questions',count:345,color:'0,175,175'},
			],
			total: 5845
		};
		_.clear( starsCont );
		starsCont.append( _.markup( _.starsBlockTpl(starsInfo)));
		_.showCircleGraphic(starsInfo,starsCont)
	}


	// add student methods
	async fillStudentInfo({item}){
		const _ = this;
		let
			name = item.getAttribute('name'),
			value = item.value,
			courseNames = ['firstSchool','secondSchool','thirdSchool','testDate','level','course'];

		let wizardData = _.wizardData ?? await Model.getWizardData();
		if( typeof value == 'object') value = value + '';
		if(name == 'grade') _.metaInfo[name] = item.textContent;
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
				_.studentInfo[name] = wizardData.grades.find((unit)=>{
					if (unit._id == item.value) return unit;
				})
			} else _.studentInfo[name] = value;
		}
	}
	fillAddingStudent(){
		const _ = this;
		_.body.append( _.markup( _.addingStudentTpl()));
		_.handleAddingSteps(1);
	}
	cancelAddStudent(){
		const _ = this;
		let btn = document.createElement('BUTTON');
		if (_.previousSection === 'profile') _.previousSection = 'dashboard'
		btn.setAttribute('section',_.previousSection);
		btn.setAttribute('data-clear','true');
		_.changeSection({item:btn});
	}
	async createStudent(){
		const _ = this;
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

		_.studentInfo = {};_.metaInfo = {};_.courseData = {};

		G_Bus.trigger('modaler','showModal',{
			target: '#congratulationsPopup',
			closeBtn: false
		})

		_.me['parent'] = await Model.getMe();
		localStorage.setItem('me',JSON.stringify(_.me))

		let btn = document.createElement('BUTTON');
		btn.setAttribute('section','dashboard');
		_.changeSection({item:btn});
	}
	//end add student methods

	//update methods
	updateMe(){
		const _ = this;
		_.me['parent']['students'].find((student,index)=>{
			if (student['_id'] == _.currentStudent['_id']) {
				_.me['parent']['students'][index] = _.currentStudent
			}
		})
		localStorage.setItem('me',JSON.stringify(_.me));
	}
	async updateStudent({item}){
		const _ = this;
		let cont = _.f('.student-profile-left');
		let validate = await _.nextStepBtnValidation(cont);
		if (!validate) return void 0;

		let updateResp = await _.saveCourses();
		if (!updateResp) return void 0;

		let updateData = {
			'_id': _.studentInfo['_id'],
			'firstName': _.studentInfo['firstName'],
			"lastName": _.studentInfo['lastName'],
			"email": _.studentInfo['email'],
			"password": _.studentInfo['password'],
			"avatar": _.studentInfo['avatar'],
			"grade": _.studentInfo['grade'],
			"currentSchool": _.studentInfo['currentSchool']
		};
		let response = await Model.updateStudent(updateData);
		if(!response) return void 0;
		_.currentStudent = response;
		_.updateMe();

		item.setAttribute('rerender',true);
		G_Bus.trigger(_.componentName,'changeSection',{item})
		_.showSuccessPopup('Student profile updated');
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
			_.showSuccessPopup('Password has been changed');
		} else {
			_.showErrorPopup('Password has been changed');
		}
	}

	//avatar methods
	async selectAvatar(clickData) {
		const _ = this;

		let listCont = _.f('.avatars-list');
		if (!listCont.children.length ) {
			_.avatars = _.wizardData['avatars'];
			listCont.append(_.markup(_.avatarsItemsTpl()));
		}

		let activeAvatar = listCont.querySelector('.active');
		if (activeAvatar) activeAvatar.classList.remove('active');
		let avatarInfo = _.studentInfo ? _.studentInfo.avatar : null;
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
	// end avatar methods

	//change methods
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
			levelButtons = item.closest('.parent-adding-body').querySelector('.level-buttons');
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
	changePayMethod({item}){
		const _ = this;
		let
			cont = item.parentElement,
			activeButton = cont.querySelector('.active');

		if (item == activeButton) return;

		activeButton.classList.remove('active');
		item.classList.add('active');

		if (!_.studentInfo['paymentMethod']) _.studentInfo.paymentMethod = {};
		_.studentInfo['paymentMethod'].type = item.getAttribute('data-type');
		_.studentInfo['paymentMethod'].title = item.textContent;
	}
	//end change methods


	//auxiliary methods
	hideProfile({item}){
		const _ = this;
		let cont = item.closest('.parent-student-info');
		let show = item.classList.contains('active');

		if (show) item.classList.remove('active');
		else item.classList.add('active');

		let units = cont.querySelectorAll('.unit');
		for (let i = 0; i < units.length; i++) {
			if (i) {
				if (!show) units[i].setAttribute('style','height: 0;margin-bottom:0;opacity: 0;');
				else units[i].removeAttribute('style');
			}
		}
	}
	showHiddenScores({item}){
		const _ = this;
		item.nextElementSibling.classList.toggle('active');
		item.classList.toggle('active')
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
				G_Bus.trigger(_.componentName,callBackTitle,{item:inputs[i]})
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
	skipTestDate({item}){
		const _ = this;
		let
			cont = item.closest('.adding-section'),
			inputDate = cont.querySelector('g-input');
		if (item.id == "have_yet") {
			_.studentInfo.testDate = null;
			_.studentInfo.testDatePicked = false;
			inputDate.setAttribute('disabled',true);
			inputDate.removeAttribute('data-required');
			inputDate.value = '';
		} else {
			inputDate.removeAttribute('disabled');
			inputDate.setAttribute('data-required','');
			_.studentInfo.testDatePicked = true;
		}
	}
	setInteger(number){
		const _ = this;
		if (number < 1000) return number;
		let string = Math.ceil(number).toString();
		let result = '';
		for ( let i = 0; i < string.length; i++ ){
			if (!(i%3) && i) {
				result = ',' + result;
			}
			result = string[string["length"] - i - 1] + result;
		}
		return result;
	}
	dateToFormat( date, format ){
		const _ = this;
		let
			result = format,
			dateDetails = date.split( '-' ),
			year = parseInt( dateDetails[0] ),
			month = parseInt( dateDetails[1] ) - 1,
			day = parseInt( dateDetails[2] );

		result = result.replace( 'DD', day );
		result = result.replace( 'MM', month );
		result = result.replace( 'YYYY', year );
		result = result.replace( 'month', _.months[month] );

		return result;
	}
	timeToFormat( time ){
		const _ = this;
		let
			result = time.split( ':' ),
			hours = (result[0] > 12 ? result[0] - 12 : result[0]),
			minutes = result[1],
			details = ( result[0] > 12 ? 'pm' : 'am' );

		result = ( hours < 10 ? '0' + hours : hours ) + ':' + minutes + ' ' + details;
		return result;
	}
	isEmpty(obj){
		const _ = this;
		for (let key in obj) {
			return false;
		}
		return true;
	}
	find(arr,id){
		const _ = this;
		if (!id) return null;
		let findItem = arr.find((item)=>{
			if (item._id === id) return item
		})
		return findItem;
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

	async addingStep({item}){
		const _ = this;
		let cont = item.closest('#parent');
		let targetStep = item.getAttribute('step');
		if (targetStep > _.currentStep) {
			let validate = await _.nextStepBtnValidation(cont);
			if (!validate) return;
		}

		_._$.addingStep = parseInt(targetStep);
	}
	async assignStep({item}){
		const _ = this;
		let cont = item.closest('#parent');
		let targetStep = item.getAttribute('step');
		if (targetStep > _.currentStep) {
			let validate = await _.nextStepBtnValidation(cont);
			if (!validate) return;
		}
		_._$.assignStep = parseInt(item.getAttribute('step'));
	}
	async handleAddingSteps({addingStep = 1}){
		const _ = this;
		if(!_.initedUpdate){
			_.wizardData = await Model.getWizardData();
			_.addingSteps = {
				0: 'cancelAddStudent',
				1: 'addingStepOne',
				2: 'addingStepTwo',
				3: 'addingStepThree',
				4: 'addingStepFour',
				5: 'addingStepFive',
				6: 'addingStepSix',
				7: 'createStudent'
			};
			_.studentInfo = {
				paymentMethod: 'monthly'
			};
			return void 0;
		}
		if (addingStep === 0 || addingStep === 7) {
			_[_.addingSteps[addingStep]]();
			return void 0;
		} else if (addingStep === 1) {
			let stepOneData = _.wizardData ?? await Model.getWizardData();
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
		_.currentStep = addingStep;

		let addingFooter = _.f('.parent-adding-body .test-footer');
		if (addingStep >= 2) addingFooter.classList.add('narrow');
		else addingFooter.classList.remove('narrow');
		addingFooter.querySelectorAll('BUTTON').forEach((btn)=>{
			if (btn.classList.contains('back')) btn.setAttribute('step',addingStep - 1)
			else  btn.setAttribute('step',addingStep + 1)
		})


		let addingBody = _.f('#parent-adding-body');
		_.clear(addingBody);
		addingBody.append(_.markup(_[_.addingSteps[addingStep]]()))


		let
			aside = _.f('#parent .adding-list'),
			activeAside = aside.querySelector('.active'),
			asideButtons = aside.querySelectorAll('.adding-list-item'),
			asideTarget = asideButtons[addingStep - 1];
		if (asideTarget != activeAside) {
			activeAside.classList.remove('active');
			asideTarget.classList.add('active')
		}
		for (let i = 0; i < 6; i++) {
			let button = asideButtons[i].querySelector('.adding-list-digit');
			_.clear(button);
			if (i < addingStep - 1) {
				button.append(_.markup(`<svg><use xlink:href="#checkmark"></use></svg>`))
			} else {
				button.textContent = i + 1
			}
		}

		if (addingStep === 5) {
			let
				cards = await Model.getCardsInfo(),
				addresses = await Model.getBillingAddressInfo();
			_.fillParentCardsInfo(cards);
			_.fillParentAddressesInfo(addresses);
		}
		let button = _.f('#parent .test-footer .button-blue');
		if (addingStep === 6) {
			button.classList.add('button-green');
			button.textContent = 'Purchase';
		} else {
			button.classList.remove('button-green');
			button.textContent = 'Next';
		}
	}
	async handleAssignSteps({assignStep = 1}){
		const _ = this;
		if( !_.initedAssign ) {
			_.assignSteps = {
				0: 'changeSection',
				1: 'addingStepOne',
				2: 'assignStepTwo',
				3: 'addingStepFour',
				4: 'assignCourse'
			}
			_.initedAssign = true;
			return void 0;
		}
		if (assignStep === 0 || assignStep === 4) {
			if (assignStep === 0) {
				let btn = _.markupElement(`<button section="profile"></button>`)
				_[_.assignSteps[assignStep]]({item:btn});
			} else {
				_[_.assignSteps[assignStep]]();
			}
			return void 0;
		}

		let assignFooter = _.f('#assign-footer');
		if (!assignFooter) return;
		if (assignStep >= 2) assignFooter.classList.add('narrow');
		else assignFooter.classList.remove('narrow');
		assignFooter.querySelectorAll('BUTTON').forEach((btn)=>{
			if (btn.classList.contains('back')) btn.setAttribute('step',assignStep - 1)
			else  btn.setAttribute('step',assignStep + 1)
		})


		let assignBody = _.f('#assign-body');
		_.clear(assignBody);
		assignBody.append( _.markup( _[_.assignSteps[assignStep]]()))

		let
			aside = _.f('#assign-list'),
			activeAside = aside.querySelector('.active'),
			asideButtons = aside.querySelectorAll('.adding-list-item'),
			asideTarget = asideButtons[assignStep - 1];
		if (asideTarget != activeAside) {
			activeAside.classList.remove('active');
			asideTarget.classList.add('active')
		}
		for (let i = 0; i < 3; i++) {
			let button = asideButtons[i].querySelector('.adding-list-digit');
			_.clear(button);
			if (i < assignStep - 1) {
				button.append(_.markup(`<svg><use xlink:href="#checkmark"></use></svg>`))
			} else {
				button.textContent = i + 1
			}
		}

		let button = assignFooter.querySelector('.button-blue');
		if (assignStep === 3) {
			button.classList.add('button-green');
			button.textContent = 'Purchase';
		} else {
			button.classList.remove('button-green');
			button.textContent = 'Next';
		}
	}
	fillassignCourse(){
		const _ = this;
		_.body.append( _.markup( _.assignCourseTpl()));
		_._$.assignStep = 1;
	}

	async nextStepBtnValidation(cont){
		const _ = this;
		let inputs = cont.querySelectorAll(`[data-required]`);
		let validate = true;

		if (inputs.length) {
			for (let item of inputs) {
				if (item.hasAttribute('data-outfocus')) {
					let rawvalidate = await _[item.getAttribute('data-outfocus').split(':')[1]]({item});
					if (!rawvalidate) validate = false;
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

	async init() {
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep'])
		_._( _.handleAssignSteps.bind(_),['assignStep'])
	}
	
}