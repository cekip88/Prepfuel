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
		console.log(_.me)

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
				'body':'badgeTpl',
				'footer':'dashboardFooter'
			};
			_.subSection = 'welcome';
		}
	}
	async asyncDefine(){
		const _ = this;
	}
	define() {
		const _ = this;
		_.componentName = 'Dashboard';

		_.set({
			addingStep : 1
		})
		_.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		G_Bus
		.on(_,[
			'domReady','changeSection',
			'generatePassword','validatePassword','checkEmail','fillStudentInfo',
			'addingStep',
			'changeStudentLevel','changeTestType','changePayMethod',
			'selectAvatar','pickAvatar','confirmAvatar','closeAvatar',
			'skipTestDate',
			'showAddCard','showAddBillingAddress',
		]);
	}
	async domReady() {
		const _ = this;
		_.body = _.f("#g-set-inner");
		_.clear(_.body);
		_.wizardData = await Model.getWizardData();

		if( _.subSection == 'welcome' ){
			_.fillWelcome();
		}
		if( _.subSection == 'addingStudent' ){
			_.fillAddingStudent();
		}
		if( _.subSection == 'dashboard' ){
			_.fillDashboardTabs();
			_.fillDashboard();
			_.fillScheduleBlock(_.me['parent']['students'][0]['_id']);
			_.fillStarsBlock();
		}
	}

	async changeSection({item, event}) {
		const _ = this;

		_.previousSection = _.subSection;
		let section = item.getAttribute('section');
		_.subSection = section;

		if (section == 'welcome') {
			_.moduleStructure = {
				'header':'',
				'header-tabs':'',
				'body':'badgeTpl',
				'footer':'dashboardFooter'
			}
		}
		if(section == 'addingStudent'){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body':'badgeTpl',
				'footer':'dashboardFooter'
			}
		}
		if( section == 'dashboard' ){
			_.moduleStructure = {
				'header':'fullHeader',
				'header-tabs':'studentTabs',
				'body-tabs':'dashboardTabs',
				'body':'dashboardBodyTpl',
				'footer':'dashboardFooter'
			}
		}
		await _.render();
	}

	fillWelcome(){
		const _ = this;
		_.body.append( _.markup( _.welcomeTpl()));
	}

	//dashboard
	async fillDashboardTabs(){
		const _ = this;

		let cont = _.f('.subnavigate.parent');
		let imgs = cont.querySelectorAll('[data-id]');
		for( let item of imgs ){
			let imgId = item.getAttribute('data-id');
			let imgTitle;
			for (let avatarData of _.wizardData.avatars) {
				if (avatarData['_id'] == imgId) {
					imgTitle = avatarData['avatar'];
					break
				}
			}
			let img = `<img src="/img/${imgTitle}.svg">`;
			item.append( _.markup( img ));
		}
	}
	fillDashboard(currentStudent = 0){
		const _ = this;

		let cont = _.f('#studentProfile');
		_.clear(cont);
		cont.append( _.markup( _.studentProfileTpl( _.me['parent']['students'][currentStudent])))

		let items = cont.querySelectorAll('[data-id]');
		for ( let item of items ){
			let type = item.getAttribute('data-type');
			let value = _.wizardData[type].find(elem=>{
				if (elem['_id'] == item.getAttribute('data-id')){
					return elem
				}
			});
			if( type != 'avatars' ){
				item.textContent = value[item.getAttribute('data-title')];
			}
			else item.src = `/img/${value[item.getAttribute('data-title')]}.svg`
		}
	}

	async fillScheduleBlock(id){
		const _ = this;
		let
			schedule = await Model.getSchedule(id),
			scheduleTpl = _.scheduleBlock(schedule),
			scheduleList = document.querySelector('#scheduleList');
		_.clear(scheduleList);
		scheduleList.append(_.markup(scheduleTpl));
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
	fillScheduleItemsTpl(dashSchedule){
		const _ = this;
		let schData = [
			dashSchedule['skillTest'],
			dashSchedule['practiceTest'],
			dashSchedule['test'],
		];
		let data = [];
		for (let item of schData) {
			let title = `Next ${item.title}`;
			let info = '', count = '';


			if (item['title'] === 'isee'){
				title = 'Your ISEE Date';
			}
			if (item['title'] === 'skill test'){
				title = 'Next practice';
			}
			if (item['title'] === "practice test"){
				title = 'Next Practice Test';
			}


			if (item['daysLeft'] <= 0) {
				count = 'Today';
				if (item['title'] === 'isee') {
					info = '<div class="info">Good luck</div>';
				}
			} else {
				count = item['daysLeft'];
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

	// add student methods
	fillStudentInfo({item}){
		const _ = this;
		_.studentInfo[item.getAttribute('name')] = item.value;
	}
	fillAddingStudent(){
		const _ = this;
		_.body.append( _.markup( _.addingStudentTpl()));
		_.handleAddingSteps(1);
	}

	cancelAddStudent(){
		const _ = this;
		let btn = document.createElement('BUTTON');
		btn.setAttribute('section',_.previousSection);
		_.changeSection({item:btn});
	}
	async createStudent(){
		const _ = this;
		let registerData = Object.assign({},_.studentInfo);
		_.studentInfo = {};
		_.metaInfo = {};

		let resp = await Model.createStudent(registerData);

		if (resp.status == "success") {
			G_Bus.trigger('modaler','showModal',{
				target: '#congratulationsPopup',
				closeBtn: false
			})

			console.log(_.students)
			console.log(resp['response'])

			let btn = document.createElement('BUTTON');
			btn.setAttribute('section','dashboard');
			_.changeSection({item:btn});
		}
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
		if (item.parentNode.querySelector('.active')) item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		_.studentInfo.level = item.getAttribute('data-id');
	}
	async changeTestType({item}) {
		const _ = this;
		if(item.parentNode.querySelector('.active'))  item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');

		let
			pos = parseInt(item.getAttribute('pos')),
			levelButtons = item.closest('.parent-adding-body').querySelector('.level-buttons');
		_.clear(levelButtons);
		levelButtons.innerHTML = '<img src="/img/loader.gif">';

		_.coursePos = pos;
		_.studentInfo.course = _.wizardData['courses'][pos]['_id'];
		_.studentInfo.level = _.wizardData['courses'][pos]['levels'][0]['_id'];
		_['metaInfo'].course = _.wizardData['courses'][pos]['title'];
		_['metaInfo'].level = _.wizardData['courses'][pos]['levels'][0]['title'];
		levelButtons.innerHTML = _.levelButtons(_.wizardData['courses'][pos]);
	}
	changePayMethod({item}){
		const _ = this;
		let
			cont = item.parentElement,
			activeButton = cont.querySelector('.active');

		if (item == activeButton) return;

		activeButton.classList.remove('active');
		item.classList.add('active');

		_.studentInfo['paymentMethod'] = item.getAttribute('data-type');
		_.metaInfo['paymentMethod'] = item.textContent;
	}
	//end change methods

	//auxiliary methods
	generatePassword({item}){
		const _ = this;
		let
			len = Math.ceil((Math.random() * 8)) + 8,
			inputs = item.closest('.passwords').querySelectorAll('G-INPUT[type="password"]'),
			symbols = ['!','#', '$', '&', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
			password = '',
			input;

		for (let i = 0; i < len; i++) {
			let number = Math.ceil(Math.random() * 65);
			password += symbols[number];
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
			text = item.nextElementSibling;
		if (item == inputs[0]) {
			if (item.value.length < 8) {
				console.log(item.value,item.value.length)
				item.setMarker('red');
				text.style = 'color: red;'
			} else {
				item.setMarker();
				text.removeAttribute('style')
			}
		} else {
			if (item.value !== inputs[0].value) {
				item.setMarker('red');
				text.style = 'color: red;'
			} else {
				item.setMarker();
				text.style = 'display:none;'
			}
		}

		let callback = item.getAttribute('data-callback');
		if (callback) {
			let callBackDetails = callback.split(':');
			G_Bus.trigger(callBackDetails[0],callBackDetails[1],{item});
		}
	}
	async checkEmail({item}){
		const _ = this;
		let
			value = item.value,
			text = item.nextElementSibling;
		let response = await Model.checkEmail(value);
		if (!response) {
			item.setMarker('red');
			text.textContent = "Email can't be empty";
			text.style = 'color: red;'
		}
		if (response.substr(response.length - 4) !== 'free') {
			item.setMarker('red');
			text.textContent = 'User with this email is already exists';
			text.style = 'color: red;'
		} else {
			item.setMarker();
			text.style = 'display:none;'
		}
	}
	skipTestDate({item}){
		const _ = this;
		let
			cont = item.closest('.adding-section'),
			inputDate = cont.querySelector('g-input');
		if (item.id == "have_yet") {
			_.studentInfo.testDate = null;
			inputDate.setAttribute('disabled',true);
			inputDate.value = '';
		} else {
			inputDate.removeAttribute('disabled')
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

	addingStep({item}){
		const _ = this;
		_._$.addingStep = parseInt(item.getAttribute('step'));
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
				course: _.wizardData['courses'][0]['_id'],
				level: _.wizardData['courses'][0]['levels'][0]['_id'],
				paymentMethod: 'monthly'
			};
			_.metaInfo = {
				course : _.wizardData['courses'][0]['title'],
				level : _.wizardData['courses'][0]['levels'][0]['title'],
				paymentMethod: 'Pay Monthly',
			};
			return void 0;
		}
		if (addingStep === 0 || addingStep === 7) {
			_[_.addingSteps[addingStep]]();
			return void 0;
		}

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
	async init() {
		const _ = this;
		_._( _.handleAddingSteps.bind(_),['addingStep'])
	}
	
}