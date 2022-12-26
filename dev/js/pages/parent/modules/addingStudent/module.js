import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {ParentPage} from "../../parent.page.js";

export class AddingStudentModule extends ParentPage{
	constructor(props) {
		super(props);
		const _ = this;
		document.title = 'Prepfuel - Adding student';
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body':'addingStudentTpl',
			'footer':'addingStudentFooter'
		}
		_.studentInfo = {};
		_.metaInfo = {};
		_.courseData = {};
	}
	async asyncDefine(){}
	define() {
		const _ = this;
		_.componentName = 'addingStudent';
		_.backUrl = `https://live-prepfuelbackend-mydevcube.apps.devinci.co`;
		_.currentStep = 1;
		_.initedUpdate = false;


		_.set({
			addingStep : 1
		})
		_.months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
		G_Bus.on(_,[
			'domReady',
			'addingStep','changeStudentLevel','generatePassword','checkEmail',
			'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
			'showSelect','liveSearch','liveSearchInsert',
			'fillStudentInfo','skipTestDate',
			'showAddCard','showAddBillingAddress',
		]);
	}
	async domReady() {
		const _ = this;
		_.wizardData = await Model.getWizardData();
		_.handleAddingSteps(_.currentStep);
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
		console.log(_)
	}
	async handleAddingSteps({addingStep = 1}){
		const _ = this;
		if(!_.initedUpdate){
			_.initedUpdate = true;
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
					course: stepOneData['courses'][2],
					level: stepOneData['courses'][2]['levels'][0],
				};
			}
			if (_.isEmpty(_.courseData)) {
				_.courseData.currentPlan = _.studentInfo.currentPlan.course.title;
				_.courseData[_.courseData.currentPlan] = Object.assign({},_.studentInfo.currentPlan);
			}
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
		} else if (addingStep == 3) {
			_.f('.search-select-options').addEventListener('scroll',function (e) {_.liveSearchScroll({item:e.target,event:e})});
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

	cancelAddStudent(){
		let item = document.createElement('BUTTON');
		item.setAttribute('section','/parent/dashboard');
		G_Bus.trigger('ParentPage','changeSection',{item})
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
	showAddCard({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#addCard'})
	}
	showAddBillingAddress({item}){
		const _ = this;
		G_Bus.trigger('modaler','showModal',{type:'html',target:'#addBillingAddress'})
	}

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
			text = item.nextElementSibling ?? item.parentElement.nextElementSibling,
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
			console.log(item)
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
	async createStudent(){
		const _ = this;
		let curCourseData = _.courseData[_.courseData.currentPlan];
		let createInfo = {
			'firstName': _.studentInfo.firstName,
			'lastName': _.studentInfo.lastName,
			'email': _.studentInfo.email,
			'password': _.studentInfo.password,
			'avatar': _.studentInfo.avatar,
			'grade': _.studentInfo.grade._id,
			'currentSchool': _.studentInfo.currentSchool,
			'course': curCourseData.course._id,
			'level': curCourseData.level._id,
			'testDate': curCourseData.testDate,
			'firstSchool': curCourseData.firstSchool._id,
			'secondSchool': curCourseData.secondSchool._id,
			'thirdSchool': curCourseData.thirdSchool._id,
			'parentId': _.studentInfo.parentId
		};
		let response = await Model.createStudent(createInfo);
		if (!response) return void 0;

		_.updateMe({
			'createdAt':response.response.createdAt,
			'_id':response.response._id,
			'currentPlan':{
				'course': curCourseData.course,
				'level': curCourseData.level,
				'firstSchool': curCourseData.firstSchool._id,
				'secondSchool': curCourseData.secondSchool._id,
				'thirdSchool': curCourseData.thirdSchool._id,
				'testDate': curCourseData.testDate,
			},
			'plans':[{
				'course': curCourseData.course,
				'level': curCourseData.level,
				'firstSchool': curCourseData.firstSchool._id,
				'secondSchool': curCourseData.secondSchool._id,
				'thirdSchool': curCourseData.thirdSchool._id,
				'testDate': curCourseData.testDate,
			}],
			'currentSchool': {'school':_.studentInfo.currentSchool,"_id":response.response.currentSchool},
			'grade': _.studentInfo.grade,
			'user':{
				'avatar': {'_id':_.studentInfo.avatar,'avatar':_.metaInfo.avatarName},
				'email': _.studentInfo.email,
				'firstName': _.studentInfo.firstName,
				'lastName': _.studentInfo.lastName,
				'role':'student',
				'_id':response.response.user
			}
		});
		_.studentInfo = {};
		_.metaInfo = {};
		_.courseData = {};

		G_Bus.trigger('modaler','showModal',{
			target: '#congratulationsPopup',
			closeBtn: false
		})
	}
	//end add student methods

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
		console.log('confirmAvatar')

		_['studentInfo'].avatar = _['metaInfo'].avatar;
		_['studentInfo'].avatarName = _['metaInfo'].avatarName;

		let img = _.markup(`<img src="/img/${_['studentInfo'].avatarName}.png">`)
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

	//live search select
	async showSelect({item}){
		const _ = this;
		let options = item.nextElementSibling;
		if (!options.classList.contains('active')) {
			_.schoolsSearchData = {
				page:1,
				search:item.value,
				scroll: 0,
				direction:'bottom',
			};
			_.schoolsSearchData.prevPage = _.schoolsSearchData.page;
			_.schoolsSearchData.scroll = 0;
			_.schools = await Model.getSchools(_.schoolsSearchData);
			options.innerHTML = _.liveSelectOptions(_.schools);
		}

		options.classList.toggle('active');


		if (options.classList.contains('active')) {
			let active = options.querySelector('.active');
			if (active) {
				let top = active.getBoundingClientRect().top;
				_.schoolsSearchData.scroll = top;
				options.scrollTo(0,top)
			}
		}
	}
	async liveSearch({item}){
		const _ = this;
		let options = item.nextElementSibling;
		options.classList.add('active');
		_.schoolsSearchData.search = item.value;
		_.schoolsSearchData.page = 1;
		_.schoolsSearchData.prevPage = 1;

		_.schools = await Model.getSchools(_.schoolsSearchData);
		options.innerHTML = _.liveSelectOptions(_.schools);
		_.studentInfo['currentSchool'] = item.value;
	}
	async liveSearchScroll({item}){
		const _ = this;
		if (_.schoolsPreparing) return;
		let scrollTop = item.scrollTop;
		let toBottom = (scrollTop > _.schoolsSearchData.scroll);

		if (!toBottom) {
			if (item.scrollTop < 500) {
				_.schoolsPreparing = true;
				if (_.schoolsSearchData.prevPage < _.schoolsSearchData.page) {
					_.schoolsSearchData.page = _.schoolsSearchData.prevPage;
				}
				_.schoolsSearchData.prevPage = _.schoolsSearchData.page;
				_.schoolsSearchData.page--;
				if (_.schoolsSearchData.page == 0){
					_.schoolsSearchData.page++;
					_.schoolsSearchData.prevPage++;
					_.schoolsPreparing = false;
					return;
				}
				_.schools = await Model.getSchools(_.schoolsSearchData);
				if (item.children.length >= 60) {
					for (let i = 0; i < 30; i++) {
						item.children[item.children.length - 1].remove();
					}
				}
				item.prepend(_.markup(_.liveSelectOptions(_.schools)))
				item.scrollTo(0,scrollTop + 1230)
				_.schoolsPreparing = false;
			}
		} else {
			if ((item.scrollHeight - item.scrollTop) < 500) {
				_.schoolsPreparing = true;
				if (_.schoolsSearchData.prevPage > _.schoolsSearchData.page) {
					_.schoolsSearchData.page = _.schoolsSearchData.prevPage;
				}
				_.schoolsSearchData.prevPage = _.schoolsSearchData.page;
				_.schoolsSearchData.page++;
				_.schools = await Model.getSchools(_.schoolsSearchData);
				if (!_.schools || !_.schools.length){
					_.schoolsSearchData.page--;
					_.schoolsSearchData.prevPage--;
					_.schoolsPreparing = false;
					return;
				}
				if (item.children.length >= 60) {
					for (let i = 0; i < 30; i++) {
						item.children[0].remove();
					}
				}
				item.append(_.markup(_.liveSelectOptions(_.schools)))
				_.schoolsPreparing = false;
			}
		}
		_.schoolsSearchData.scroll = item.scrollTop;
	}
	liveSearchInsert({item,event}){
		const _ = this;
		let cont = item.closest('.search-select'),
			input = cont.firstElementChild,
			options = item.closest('.search-select-options'),
			option = event.target;

		input.value = option.textContent;
		_.studentInfo['currentSchool'] = option.textContent;

		let activeItem = options.querySelector('.active');
		if (activeItem) activeItem.classList.remove('active');
		item.classList.add('active');
		options.classList.remove('active');
	}

	updateMe(data){
		const _ = this;
		console.log(data)
		let me = localStorage.getItem('me');
		if (!me) return;

		me = JSON.parse(me);
		me.parent.students.push(data);

		localStorage.setItem('me',JSON.stringify(me));
	}

	async init() {
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep'])
	}
}