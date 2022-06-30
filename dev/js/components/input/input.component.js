import GComponent from "../g.component.js";
export default class GInput extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();
	}
	define(){
		const _ = this;
		_._value = [];
		_.basePlaceholder = document.createElement('DIV');
		_.type = 'text';
		_.symbol = '*';
		_.componentName= 'input';
		_.validations = {
			'required': 'This field is required',
			'email': 'Wrong email address',
			'phone': 'Wrong phone format need: '+_.attr('pattern'),
			'match': 'Password not matched',
		};
		_
		//	.on('appended',_.doInput.bind(_))
			.on('doInput',_.doInput.bind(_))
			.on('preparePassword',_.preparePassword.bind(_))
			.on('doFocusIn',_.doFocusIn.bind(_))
			.on('doFocusOut',_.doFocusOut.bind(_))
			.on('doKeyDown',_.doKeyDown.bind(_))
			.on('fillMask',_.fillMask.bind(_))
			.on('getCaretPosition',_.getCaretPosition.bind(_))
			.on('datePick',_.datePick.bind(_))
			.on('nextMonth',_.nextMonth.bind(_))
			.on('prevMonth',_.prevMonth.bind(_))
			.on('dateInputFocusOut',_.dateInputFocusOut.bind(_))
			.on('changeDate',_.changeDate.bind(_))
			.on('setCheckboxValue',_.setCheckboxValue.bind(_))
	}
	
	
	get name(){
		const _ = this;
		return _.attr('name');
	}
	get value(){
		const _ = this;
		if (_.isDate()) {
			return _.shadow.querySelector('.inpt-date').value
		}
		if(_.isSymbolPassword()) {
			if(_.type == 'password') {
				return _._value.toString().replace(/\,/g, '');
			}
			if(_.shadow.querySelector('.inpt-value-placeholder')) {
				return '';
			}
			return _.shadow.querySelector('.inpt-value').textContent
		}
		if(!_.isCheckbox()){
			return _.shadow.querySelector('.inpt-value').value
		}else{
			return _._value;
		}



	}
	get title(){
		const _ = this;
		return _.shadow.querySelector('.inpt-title').textContent;// = value;
	}
	
	set value(val){
		const _ = this;
		if(_.isSymbolPassword()) {
			_.shadow.querySelector('.inpt-value').innerHTML = val;
		}
		if(!_.isCheckbox()){
			_.shadow.querySelector('.inpt-value').value = val;
		}

		//_.value =
	}
	set title(value){
		const _ = this;
		_.shadow.querySelector('.inpt-title').textContent = value;
	}

	
	/* Outside methods*/
	
	doValidate(){
		const _ = this;
		let isValidate = true;
		if(!_.checkMatch()){
			_.setError('match',true);
			_.matchedElement.setError('match',true);
		}else	if(_.hasAttribute('required') && (!_.value)){
			_.setError('required',true);
			isValidate = false;
		}else if(_.isEmail()){
			if(!_.checkEmail()){
				_.setError('email',true);
			}
			isValidate = _.checkEmail();
		}else if(_.isPhone()){
			if(!_.checkPhone()){
				_.setError('phone',true);
			}
			isValidate = _.checkPhone();
		}
		return isValidate;
	}
	
	/* Outside methods*/
	/* Inside methods*/


	datePick({value:value}) {
		const _ = this;
		if (_.hasAttribute('active') && _.isDateRange()) _.closeDatePicker();

		if (_.getAttribute('active')) return;
		_.setAttribute('active',true);

		if (!value) value = _.getAttribute('value');
		let
			date = _.getDate(value),
			tpl = _.datePickerTpl(date);

		let
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate();
		if (month < 10) month = '0' + month;
		if (day < 10) day = '0' + day;
		_.setAttribute('data-current-date',`${year}-${month}-${day}`);

		let activeDate = _.getAttribute('value');
		if (_.isThatMonth(activeDate,year + '-' + month)) {
			let day = activeDate.substring(activeDate.length - 2);
			_.markerPickedDay(tpl,day);
		}

		if (!_.getAttribute('data-previous')) {
			let currentDate = new Date();
			if (_.isThatMonth(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1),year + '-' + month)) {
				_.disablePrev(tpl,currentDate.getDate());
			}
		}

		_.shadow.append(tpl);
	}
	closeDatePicker(){
		const _ = this;
		console.log(_)

	}
	getDate(value){
		const _ = this;
		if (value) {
			if (!_.getAttribute('data-previous')) {
				let date = new Date();
				let valueItems = value.split('-');
				if (parseInt(valueItems[0]) > date.getFullYear()) return new Date(value);
				else if (parseInt(valueItems[0]) === date.getFullYear()) {
					if (parseInt(valueItems[1]) >= date.getMonth()) return new Date(value);
				}
			} else {
				return new Date(value);
			}
		} else {
			return new Date();
		}
		return new Date();
	}
	isThatMonth(firstDate,secondDate){
		if (firstDate && secondDate) {
			firstDate = firstDate.split('-');
			secondDate = secondDate.split('-');
			if (parseInt(firstDate[0]) === parseInt(secondDate[0])) {
				if (parseInt(firstDate[1]) === parseInt(secondDate[1])) {
					return true;
				}
			}
		}
		return false
	}
	markerPickedDay(tpl,day){
		tpl.querySelector(`BUTTON[data-day="${parseInt(day)}"]`).classList.add('active');
	}
	disablePrev(tpl,curDay){
		const _ = this;
		let prevButton = tpl.querySelector('[data-click="prevMonth"]');
		prevButton.classList.add('disabled')
		let btns = tpl.querySelector('.date-picker-body').querySelectorAll('BUTTON');
		for (let i = 0; i < btns.length; i++) {
			let
				btn = btns[i],
				day = btn.getAttribute('data-day');
			if (parseInt(day) < curDay) {
				btn.setAttribute('disabled',true)
			}
		}
	}

	datePickerTpl(date){
		const _ = this;
		let
			tpl = document.createElement('DIV'),
			headTpl = _.datePickerHeadTpl(date),
			days = _.datePickerDays(),
			body = _.datePickerBody(date);

		tpl.className = 'date-picker';
		tpl.append(headTpl,days,body);
		return tpl;
	}
	datePickerHeadTpl(date){
		const _ = this;
		let tpl = _.getTpl('datePickerHead');
		return _.markup(tpl(date),false)[0];
	}
	datePickerDays(){
		const _ = this;
		let tpl = _.getTpl('datePickerDays');
		return _.markup(tpl(),false)[0];
	}
	datePickerBody(date){
		const _ = this;
		let tpl = _.getTpl('datePickerBody');
		return _.markup(tpl(date),false)[0];
	}

	changeDate(clickData){
		const _ = this;
		let
			btn = clickData['item'],
			cont = btn.closest('.date-picker-body'),
			DD = btn.getAttribute('data-day'),
			MM = cont.getAttribute('data-month'),
			YYYY = cont.getAttribute('data-year'),
			dateValues = _.fillDate(`${YYYY}-${MM}-${DD}`);

		if (!_.isDateRange()) _.notRangeChangeDate(clickData,dateValues);
		else _.rangeChangeDate(clickData,dateValues);
	}
	notRangeChangeDate(clickData,dateValues){
		const _ = this;

		_.shadow.querySelector('.inpt-value').value = dateValues.outValue;
		_.shadow.querySelector('.inpt-date').value = dateValues.outDate;
		_.setAttribute('value',dateValues.outDate);

		_.removeAttribute('data-current-date');
		_.triggerChangeEvent();
		_.datePickerClose(clickData);
	}
	rangeChangeDate(clickData,dateValues){
		const _ = this;
		let fromDate = _.getAttribute('fromDate') ?? '';
		let toDate = _.getAttribute('toDate') ?? '';

		if (!fromDate) {
			_.setAttribute('fromDate',dateValues.outDate);
		} else if (!toDate) {
			_.setAttribute('toDate',dateValues.outDate)
		} else {

		}
	}
	fillDate(dateValue){
		const _ = this;
		let
			date = new Date(dateValue),
			format = _.attr('format') ?? 'MM-DD-YYYY',
			outValue = format,
			days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Sunday'],
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
			DD = date.getDate(),
			month = date.getMonth() + 1,
			MM = month >= 10 ? month : '0' + month,
			YYYY = date.getFullYear();

		if (DD < 10) DD = '0' + DD;

		outValue = outValue.replace('DD',DD.toString());
		outValue = outValue.replace('MM',MM.toString());
		outValue = outValue.replace('YYYY',YYYY.toString());
		outValue = outValue.replace('month',months[month - 1]);
		outValue = outValue.replace('weekDay',days[date.getDay()]);

		let outDate = YYYY + '-' + MM + '-' + DD;
		return {outDate,outValue};
	}
	dateInputFocusOut({event}){
		if (event.type === 'click') return;
		this.datePickerClose();
	}
	datePickerClose(){
		const _ = this;
		_.removeAttribute('active');
		_.shadow.querySelector('.date-picker').remove();
	}
	nextMonth(){
		const _ = this;
		let date = _.getDateDetails();

		date.month++;
		if (date.month > 12) {
			date.month = '01';
			date.year++;
		} else if (date.month < 10) date.month = '0' + date.month;
		_.anotherMonth(`${date.year}-${date.month}`)
	}
	prevMonth(clickData){
		const _ = this;
		let btn = clickData.item;
		if (btn.classList.contains('disabled')) {
			_.shadow.querySelector('.inpt-value').focus();
			return;
		}
		let date = _.getDateDetails();

		date.month--;
		if (date.month === 0) {
			date.month = '12';
			date.year--;
		} else if (date.month < 10) date.month = '0' + date.month;
		_.anotherMonth(`${date.year}-${date.month}`)
	}
	getDateDetails(){
		let
			dateValue = this.getAttribute('data-current-date'),
			dateValues = dateValue.split('-');
		return {year:parseInt(dateValues[0]),month:parseInt(dateValues[1])}
	}
	anotherMonth(date){
		const _ = this;
		_.shadow.querySelector('.date-picker').remove();
		_.removeAttribute('active');
		_.datePick({value:date});
		_.shadow.querySelector('.inpt-value').focus();
	}
	
	setCheckboxValue(changeData){
		const _ = this;
		let item = changeData['item'];
		if(_.attr('type') == 'checkbox'){
			let pos = _._value.indexOf(item.value);
			if( pos > -1){
				_._value.splice(pos,1);
			}else{
				_._value.push(item.value)
			}
		}else{
			_._value = item.value;
		}
		_.triggerChangeEvent();
	}

	checkMatch(){
		const _ =  this
		let
			match = _.attr('match');
		if(!match) return true;
		_.matchedElement = document.querySelector(match);
		
		return _.matchedElement.value == _.value;
	}
	checkEmail(){
		let pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		return pattern.test(this.value);
	}
	checkPhone(){
		let pattern = /\+[0-9]{1,4}\([0-9]{3}\) *[0-9]{3}-+[0-9]{2}-[0-9]{2}/;
		return pattern.test(this.value);
	}
	doFocusIn(focusData){
		const _ = this;
		_.shadow.querySelector('.inpt-value').classList.add('focused');
		_.basePlaceholder.append(_.shadow.querySelector('.inpt-value-placeholder'));
	}
	doFocusOut(focusData){
		const _ = this;
		_.shadow.querySelector('.inpt-value').classList.remove('focused');
		if(_.isSymbolPassword()){
			if(!_.value)	_.shadow.querySelector('.inpt-value').append(_.basePlaceholder.firstElementChild);
		}
	}
	doKeyDown(keyData){
		const _ = this;
		let e = keyData['event'];
		if(_.isPhone() || _.isNumeric() || _.isDate()) {
			if( (!_.isSystemKey(e.key)) && !( (e.code == 'KeyA') && e.ctrlKey) ){
				if( (e.key == ' ') || (_.isLat(e.key)) || (_.isKir(e.key)) || (_.isAnotherSym(e.key)) ) e.preventDefault();
			}
		}
	}
	preparePassword(clickData){
		const _ = this;
		let
			e = clickData['event'];
		if( (e.key == 'Backspace') || (e.key == 'Delete')){
			//return e.preventDefault();
		}
	}
	fillMask(inputData){
		const _ = this;
		_._value = inputData['item'].value;
		_.value = _.createStars(_._value.length);
	}
	
	createStars(len){
		const _ = this;
		let str = "";
		for(let i=0; i < len;i++){
			if(!_.symbolImg){
				str+= _.symbol;
			}else{
				str+= `<img src='${_.symbolImg}'>`
			}
		}
		return str;
	}
	getCaretPosition () {
		const _ = this;
		let selection, sel,inpt =  _.shadow.querySelector('.inpt-value');
		if ('selectionStart' in inpt) {
			return inpt.selectionStart;
		}
		return -1;
	}
	
	dateHandle(){
		const _ = this;
		let
			cleanedValue = _.cleanValue(_.value),
			len = cleanedValue.length,
			tempValue = cleanedValue.split(''),
			format = _.attr('format'),
			firstPos = format.indexOf('-'),
			lastPos = format.lastIndexOf('-');
		
		if(len > firstPos - 1){
			tempValue.splice(firstPos,0,'-');
		}
		if(len > lastPos - 1){
			tempValue.splice(lastPos,0,'-')
		}
		if(len >= 9) {
			tempValue.pop();
		}
		_.attr('data-value',cleanedValue);
		_.value = tempValue.join('');
	}
	phoneHandle(){
		const _ = this;
		let
			cleanedValue = _.cleanValue(_.value),
			len = cleanedValue.length,
			tempValue = cleanedValue.split('');
		if(len > 1){
			tempValue.splice(1,0,'(');
		}
		if(len > 4){
			tempValue.splice(5,0,')')
			tempValue.splice(6,0,' ')
		}
		if(len > 7){
			tempValue.splice(10,0,'-')
		}
		if(len > 9){
			tempValue.splice(13,0,'-')
		}
		if(len >= 12) {
			tempValue.pop();
		}
		_.attr('data-value',cleanedValue);
		_.cursorPos = _.getCaretPosition();
		_.value = tempValue.join('');
	}
	urlHandle(){
		const _ =  this;
		let tempValue = _.value,
		pattern = 'http://';
		if(tempValue.indexOf(pattern) != 0){
			tempValue = '';
			_.value = pattern+tempValue;
		}
		
	}
	doInput(inputData){
		const _ =  this;
		_.removeError();
		let
			e = inputData['event'],
			input = inputData['item'];
		if(_.isSymbolPassword()){
			
			if( (e['inputType'] === 'deleteContentBackward') || (e['inputType'] === 'deleteContentForward') ){
				_._value.splice(input.selectionEnd,1);
				return false;
			}
			if(_.type === 'password'){
				_._value.push(e.data);
				_.value = _.createStars(_._value.length);
			}
		}
		
		if(_.isUrl()){
			_.urlHandle();
		}
		if(_.isPhone()){
			_.phoneHandle();
		}
		if(_.isDate()){
			_.dateHandle();
		}
	}
	cleanValue(value){
		const _ = this;
		value = value.replace('(','');
		value = value.replace(')','');
		value = value.replace(' ','');
		value = value.replaceAll('-','');
		return value;
	}
	isNumeric(){
		return this.attr('type') === 'numeric';
	}
	isPhone(){
		return this.attr('type') === 'phone';
	}
	isUrl(){
		return this.attr('type') === 'url';
	}
	isEmail(){
		return this.attr('type') === 'email';
	}
	isDate(){
		return this.attr('type') === 'date';
	}
	isDateRange(){
		return this.hasAttribute('range');
	}
	isCheckbox(){
		return (this.attr('type') === 'checkbox') || (this.attr('type') === 'radio');
	}
	isSystemKey(key){
		let keys = ['Backspace','Delete','ArrowLeft','ArrowRight']
		return keys.indexOf(key)>-1;
	}
	isKir(val){
		const _ = this;
		return /[а-яА-Я]/.test(val);
	}
	isLat(val){
		const _ = this;
		return /[a-zA-Z]/.test(val);
	}
	isAnotherSym(val){
		const _ = this;
		return /\W/.test(val);
	}
	
	setError(type,inner){
		const _ = this;
		let
			inpt = _.shadow.querySelector('.inpt'),
			tip = inpt.querySelector('.inpt-tip');
		if(!tip){
			let tipTpl;
			if(inner){
				tipTpl = _.markup(_.tipTpl(_.validations[type]));
			}else{
				tipTpl = _.markup(_.tipTpl(type));
			}
			inpt.append(tipTpl);
		}else{
			if(inner)	tip.textContent = _.validations[type];
			else tip.textContent = type;
		}
		setTimeout( ()=>{
			inpt.classList.add('error');
		});
	}
	removeError(type){
		const _ = this;
		let
			inpt = _.shadow.querySelector('.inpt'),
			tip = inpt.querySelector('.inpt-tip');
		inpt.classList.remove('error');
		setTimeout( ()=>{
			if(tip) tip.remove();
		},350);
	}
	
	/* Inside methods*/
	
	isSymbolPassword(){
		const _ = this;
		return _.hasAttribute('symbolImg')
	}

	async connectedCallback() {
		const _ = this;
		await _.initShadow();
		if(_.isSymbolPassword()){
			_.mainTpl = _.getTpl('symbolPassword');
		}else if(_.isDate()){
			_.mainTpl = _.getTpl('date');
		}else if(_.isCheckbox()){
			_.mainTpl = _.getTpl('check');
		}else{
			_.mainTpl = _.getTpl('input');
		}
		_.tipTpl = _.getTpl('tip');
		_.shadow.innerHTML = _.mainTpl({
			className: _.attr('className'),
			items: JSON.parse(_.attr('items')),
			format: _.attr('format'),
			type: _.attr('type'),
			name: _.attr('name'),
			title: _.attr('title'),
			placeholder: _.attr('placeholder'),
			icon: _.attr('icon'),
			svg: _.attr('svg'),
			xlink: _.attr('xlink'),
			value: _.attr('value'),
			range: _.attr('range')
		});
		if (_.isDate()) {
			_.setAttribute('style','position:relative;')
			if (_.attr('value')) _.fillDate(_.attr('value'))
		}
		_.type = _.attr('type');
		if(_.attr('symbol'))
		_.symbol = _.attr('symbol');
		_.symbolImg = _.attr('symbolImg');
		_.trigger('appended');
	}
	
	styleSheets(){
		const _ = this;
		return `
			${super.styleSheets()}
		.inpt {
		  width: 100%;
		  position: relative;
		  display: inline-block;
		}
		.inpt.adding-select {
		  fill: #B5B5C3;
		  cursor: pointer;
		}
		.inpt.adding-select .inpt-value {
		  padding-left: 12px;
		  height: 44px;
		  color: rgb(var(--neutral-500));
		}
		.inpt.adding-select .inpt-value::placeholder {
		  font: 14px "roboto-regular";
		  color: rgb(var(--neutral-500));
		}
		.inpt.adding-select .inpt-date-img {
		  width: 11px;
		  top: 13px;
		  right: 16px;
		}
		.inpt.form-input {
		  width: 100%;
		  height: 54px;
		  border: 1px solid transparent;
		  padding: 0 15px;
		  border-radius: 6px;
		  background-color: rgb(var(--neutral-100));
		}
		.inpt.profile-form-input {
		  height: 42px;
		}
		.inpt.profile-form-input .inpt-value {
		  font: 14px "Roboto-Medium";
		  color: #5E6278;
		  height: 100%;
		}
		.inpt.adding-inpt, .inpt.adding-inpt .inpt-value {
		  height: 44px;
		}
		.inpt-title {
		  font: 13px/23px "Roboto-Medium";
		}
		.inpt-value, .inpt-mask {
		  width: 100%;
		  height: 50px;
		  display: inline-flex;
		  align-items: center;
		  padding: var(--gap) 0 var(--gap) var(--gap);
		  overflow: hidden;
		}
		.inpt-value:before {
		  display: block;
		  content: "";
		}
		.inpt-value.focused, .inpt-value:focus {
		  border-color: #f79141;
		}
		.inpt-value img {
		  width: 8px;
		  margin-right: var(--gap);
		  transition: 0.35s ease;
		}
		.inpt-value img:hover {
		  transform: rotate(90deg);
		}
		.inpt-value-placeholder {
		  font-size: 13px;
		  pointer-events: none;
		}
		.inpt-mask, .inpt-tip {
		  top: 0;
		  left: 0;
		  opacity: 0;
		}
		.inpt-tip {
		  top: 75%;
		  font-size: 12px;
		  transform: scale(0.95);
		}
		.inpt-mask, .inpt-tip, .inpt-mask-placeholder, .inpt-date-img {
		  transition: var(--animation-time) ease;
		  position: absolute;
		}
		.inpt-mask-date {
		  opacity: 0;
		  position: absolute;
		}
		.inpt-mask-date, .inpt-date-img {
		  bottom: 15px;
		  right: var(--gap);
		  width: 48px;
		}
		.inpt-mask-placeholder {
		  opacity: 0;
		  left: var(--gap);
		  width: 100%;
		  font-size: 10px;
		  bottom: 3px;
		  color: #ddd;
		}
		.inpt-value:focus + .inpt-mask-placeholder {
		  opacity: 1;
		}
		.inpt-date-img {
		  width: 20px;
		  height: 20px;
		  pointer-events: none;
		}
		.inpt.error {
		  border-color: rgb(var(--input-red));
		}
		.inpt.error .inpt-tip, .inpt.error .inpt-value-placeholder, .inpt.error .inpt-value::placeholder {
		  color: rgb(var(--input-red));
		}
		.inpt.error .inpt-value {
		  color: rgb(var(--input-red));
		  border-bottom-color: rgb(var(--input-red));
		}
		.inpt.error .inpt-tip, .inpt.success .inpt-tip {
		  top: 125%;
		  transform: scale(1);
		  opacity: 1;
		}
		.inpt.success {
		  border-color: rgb(var(--green));
		}
		.inpt.success .inpt-tip, .inpt.success .inpt-value-placeholder, .inpt.success .inpt-value::placeholder {
		  color: rgb(var(--green));
		}
		.inpt.success .inpt-value {
		  border-bottom-color: rgb(var(--green));
		}
		.inpt-checkbox {
		  display: none;
		}
		.inpt-checkbox:checked + .inpt-checkbox-label:after {
		  width: 20px;
		  height: 20px;
		  transform: scale(1);
		}
		.inpt-checkbox:checked + .inpt-checkbox-label:before {
		  background-color: #3699ff;
		}
		.inpt-checkbox-label {
		  position: relative;
		  display: flex;
		  cursor: pointer;
		  align-items: center;
		  margin-bottom: var(--gap);
		}
		.inpt-checkbox-label-text {
		  color: #5e6278;
		  font-family: "Roboto-Medium";
		}
		.inpt-checkbox-label:after, .inpt-checkbox-label:before {
		  content: "";
		  border-radius: 40px;
		  transition: 0.35s ease;
		}
		.inpt-checkbox-label:before {
		  width: 24px;
		  height: 24px;
		  margin-right: 12px;
		  border-radius: 6px;
		  background-color: #f5f8fa;
		}
		.inpt-checkbox-label:after {
		  content: url("../../img/checkmark.svg");
		  transform: scale(0.5);
		  position: absolute;
		  left: 2px;
		  top: 2px;
		}
		.inpt-radio {
		  display: none;
		}
		.inpt-radio:checked + .inpt-radio-label:after {
		  width: 12px;
		  height: 12px;
		  transform: scale(1);
		  background-color: #3699ff;
		}
		.inpt-radio-label {
		  position: relative;
		  display: flex;
		  cursor: pointer;
		  align-items: center;
		  margin-bottom: var(--gap);
		}
		.inpt-radio-label-text {
		  color: #5e6278;
		  font-family: "Roboto-Medium";
		}
		.inpt-radio-label:after, .inpt-radio-label:before {
		  content: "";
		  transition: 0.35s ease;
		  border-radius: 40px;
		  transition: 0.35s ease;
		}
		.inpt-radio-label:before {
		  width: 24px;
		  height: 24px;
		  border-radius: 24px;
		  margin-right: 12px;
		  background-color: #f5f8fa;
		}
		.inpt-radio-label:after {
		  transform: scale(0.5);
		  position: absolute;
		  left: 6px;
		  top: 6px;
		}
		.inpt-days .inpt-checkbox-cont {
		  width: 100%;
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		}
		.inpt-days .inpt-checkbox-label {
		  flex-direction: column;
		  align-items: center;
		}
		.inpt-days .inpt-checkbox-label[disabled] {
		  cursor: initial;
		}
		.inpt-days .inpt-checkbox-label[disabled] span {
		  opacity: 0.5;
		}
		.inpt-days .inpt-checkbox-label:before {
		  order: 2;
		  margin-right: 0;
		  margin-top: 12px;
		}
		.inpt-days .inpt-checkbox-label:after {
		  top: initial;
		  bottom: 4px;
		  left: 4px;
		  content: url("/img/checkmark.svg");
		}
		.inpt-days .inpt-checkbox:checked + .inpt-checkbox-label:before {
		  background-color: #3699ff;
		}
		.inpt-days .inpt-checkbox:checked + .inpt-checkbox-label:after {
		  width: 16px;
		  height: 16px;
		  background-color: initial;
		}
		
		.date-picker {
		  padding: 16px;
		  display: flex;
		  flex-direction: column;
		  background-color: #fff;
		  border-radius: 8px;
		  box-shadow: 0 10px 60px rgba(192, 195, 200, 0.2);
		  font-size: 12px;
		  position: absolute;
		  z-index: 1;
		  top: 40px;
		  left: 0;
		}
		.date-picker-header, .date-picker-days, .date-picker-body {
		  width: calc(32px * 7);
		  display: flex;
		  align-items: center;
		}
		.date-picker-days span, .date-picker-days button, .date-picker-body span, .date-picker-body button {
		  width: 32px;
		  height: 32px;
		}
		.date-picker-header {
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  color: #7E8299;
		  font-family: "Poppins-SemiBold", serif;
		  text-transform: uppercase;
		}
		.date-picker-header button {
		  width: 32px;
		  height: 32px;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}
		.date-picker-header button svg {
		  width: 11px;
		  height: 8px;
		  display: block;
		}
		.date-picker-header button.disabled {
		  opacity: 0.2;
		}
		.date-picker-days {
		  margin-bottom: 16px;
		  border-bottom: 1px solid #ECF0F3;
		}
		.date-picker-days span {
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  color: #B5B5C3;
		}
		.date-picker-body {
		  flex-wrap: wrap;
		}
		.date-picker-body span, .date-picker-body button {
		  padding: 2px;
		  display: flex;
		  align-items: flex-end;
		  justify-content: flex-start;
		  border: 1px solid #ECF0F3;
		}
		.date-picker-body span:not(:nth-child(7n)), .date-picker-body button:not(:nth-child(7n)) {
		  border-right: none;
		}
		.date-picker-body span:nth-child(n+7), .date-picker-body button:nth-child(n+7) {
		  border-top: none;
		}
		.date-picker-body .active {
		  background-color: #00A3FF;
		  color: #fff;
		  font-family: "roboto-bold", serif;
		}
		.date-value {
		  height: 42px;
		  background-color: #F5F8FA;
		  border-radius: 8px;
		}
		
		.admin-calendar .date-value {
		  height: initial;
		  background: none;
		  padding: 0 12px 2px;
		}
		.admin-calendar .date-value, .admin-calendar .date-value::placeholder {
		  font-family: var(--p_medium);
		  color: rgb(var(--neutral-400));
		  font-size: calc(12em/14);
		}
		
		.inpt.form-search {
		  padding: 0 23px;
		}
		.inpt.form-search, .inpt.form-search .inpt-value {
		  height: 34px !important;
		}
		.inpt.form-search .inpt-value, .inpt.form-search .inpt-value::placeholder {
		  font-family: var(--f_bold);
		  color: rgb(var(--neutral-500));
		  font-size: 12px;
		}
		.inpt.form-search svg {
		  bottom: 7px;
		}
		`;
	}
	
	disconnectedCallback() {
	}
	static get observedAttributes() {
		return ['items'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		const _ = this;
		if(!_.shadow) return;
		if(name == 'items'){
			let itemsCont = _.shadow.querySelector('.inpt-items-cont');
			let tpl = _.getTpl('checkItems');
			itemsCont.innerHTML = tpl({
				'items':JSON.parse(newValue),
				type: _.attr('type'),
				'name':_.attr('name')});
		}
	}
	
}
customElements.define("g-input", GInput);