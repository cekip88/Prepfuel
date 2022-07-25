import { G_Bus } from "../../libs/G_Control.js";
import GComponent from "../g.component.js";
export default class GSelect extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();
		_.filteredAttributes = ['action','class','name','classname','arrowsvg','items','title','multiple'];
	}
	define(){
		const _ = this;
		_.opened = false;
		_.filteredAttributes = ['items','title']
		_.selectedValues = [];
		_.baseTitle = '';
		_.multiple = false;
		_.integer = 0;
		_.componentName = 'select';
		_.titles = [];
		_
			.on('open',_.open.bind(_))
			.on('close',_.close.bind(_))
			.on('choose',_.choose.bind(_))
			.on('unChoose',_.unChoose.bind(_))
			.on('unChooseAll',_.unChooseAll.bind(_));
	}

	open(){
		const _ = this;
		if(!_.opened){
			_.setProperty('--body-max-height','280px');
			_.opened = true;
			_.shadow.querySelector('.g-select').classList.add('active');
		}	else{
			_.close();
		}
	}
	close(){
		const _ = this;
		_.setProperty('--body-max-height',0);
		_.shadow.querySelector('.g-select').classList.remove('active');
		_.opened = false;
	}

	get name(){
		return this.querySelector('[slot="value"]')['name']
	}
	get value(){
		return 	this.selectedValues;
	}
	get textContent(){
		return 	this.shadow.querySelector('.g-select-body .active span').textContent;
	}

	set value(val){
		const _ = this;
		if (typeof val !== 'object') val = [val];

		_.shadow.querySelectorAll('.g-select-option').forEach((option)=>{
			if (option.value) {
				if (val.indexOf(option.value) >= 0) _.choose({fakeItem:option})
			} else {
				if (val.indexOf(option.textContent) >= 0) _.choose({fakeItem:option})
			}
		});
	}

	hasOption(prop,option){
		const _ = this;
		return _[prop].indexOf(option) > -1;
	}
	getOptionPosition(prop,option){
		const _ = this;
		return _[prop].indexOf(option);
	}
	removeOption(prop,option,field){
		const _ = this;
		let pos = _.getOptionPosition(prop,option[field]);
		_[prop].splice(pos,1);

		option.classList.remove('active');
		option.setAttribute('choosen',false)

		if (_.multiple && prop == 'titles') {
			let number = option.getAttribute('data-number');
			let headBtn = _.shadow.querySelector(`.g-select-head-label BUTTON[value="${number}"]`);
			if (headBtn) headBtn.closest('.g-select-head-label').remove();

			let
				cont = _.shadow.querySelector('.g-select-head-cont'),
				ellipsis = cont.querySelector('.g-select-cont-span');
			if (cont.children.length === 3){
				ellipsis.remove();
			} else if (cont.children.length > 2) {
				let labels = cont.querySelectorAll('.g-select-head-label');
				labels[1].after(ellipsis)
			}

			let count = _.shadow.querySelector('.g-select-head-count>span');
			count.textContent = cont.children.length < 3 ? (cont.children.length).toString() : (cont.children.length - 1).toString()

			if (!_.shadow.querySelector('.g-select-head-label')) {
				cont.remove();
				_.shadow.querySelector('.g-select-head-count').remove();
			}
		}
	}
	handleOption(prop,option,field,callback){
		const _ = this;
		let value = option[field];
		if(_.hasOption(prop,value) && _.multiple){
			_.removeOption(prop,option,field);
		}else{
			if (!_.multiple) {
				_[prop] = [value];
			} else {
				_[prop].push(value);
			}
		}
		if(callback) callback(option);
	}
	changeActiveOption(option){
		const _ = this;
		let value = option.value;
		if (_.hasOption('selectedValues',value)) {
			if (!_.multiple) {
				let activeOption = _.shadow.querySelector('.g-select-body .active');
				if (activeOption) activeOption.classList.remove('active');
			}
			option.classList.add('active');
			option.setAttribute('choosen',true)
		}
	}
	setValue(){
		const _ = this;
		let slot =_.querySelector('[slot="value"]');
		if(!_.selectedValues.length){
			slot.removeAttribute('value');
			slot.value = '';
		}
		else slot.value = JSON.stringify(_.selectedValues);
	}
	setText(){
		const _ = this;
		let slot =_.querySelector('[slot="value"]');
		if(!_.selectedTexts.length){
			slot.removeAttribute('textContent');
			slot.setAttribute('textContent','');
		}
		else slot.setAttribute('textContent',_.selectedTexts);
	}
	setTitle(option){
		const _ = this;
		if (!_.titles.length) {
			_.setAttribute('title',_.baseTitle);
			_.shadow.querySelector('.g-select-title').removeAttribute('style')
		} else {
			if (!_.multiple) _.setAttribute('title',_.titles.toString());
			else {
				if (_.hasOption('titles',option.textContent)) _.rebuildHead(option)
			}
		}
	}

	rebuildHead(option){
		const _ = this;
		let
			head = _.shadow.querySelector('.g-select-head'),
			headBtn = document.createElement('DIV'),
			headBtnText = document.createElement('SPAN'),
			headCloseBtn = document.createElement('BUTTON'),
			headCont = head.querySelector('.g-select-head-cont'),
			headCount = head.querySelector('.g-select-head-count');

		if (!headCont) {
			headCont = document.createElement('DIV');
			headCont.className = 'g-select-head-cont';
			head.append(headCont);
		}

		if (headCont.children.length == 2) {
			let ellipsis = document.createElement('SPAN');
			ellipsis.className = 'g-select-cont-span';
			ellipsis.textContent = '...';
			headCont.append(ellipsis)
		}

		_.shadow.querySelector('.g-select-title').style = 'display:none;';
		headBtn.className = 'g-select-head-label';

		headBtnText.textContent = option.textContent;
		headBtn.append(headBtnText);

		headCloseBtn.setAttribute('data-click','unChoose');
		headCloseBtn.className = 'g-select-head-close';
		headCloseBtn.value = option.getAttribute('data-number');
		headBtn.append(headCloseBtn);
		headCont.append(headBtn);

		if (!headCount) {
			headCount = document.createElement('DIV');
			headCount.className = 'g-select-head-count';
			head.append(headCount);

			headCount.append(document.createElement('SPAN'));

			let headCountCloseBtn = document.createElement('BUTTON');
			headCountCloseBtn.className = 'g-select-head-close';
			headCountCloseBtn.setAttribute('data-click','unChooseAll');
			headCount.append(headCountCloseBtn)
		}

		let len = headCont.children.length;
		headCount.querySelector('SPAN').textContent = len < 3 ? len.toString() : (len - 1).toString();
	}

	optionsSort(option){
		const _ = this;
		let
			cls = option.classList.contains('active') ? 'active' : '',
			num = parseInt(option.getAttribute('data-number')),
			parent = option.parentElement,
			line = parent.querySelector('.g-select-line'),
			options = cls ? _.shadow.querySelectorAll('.g-select-option[choosen="true"]') : _.shadow.querySelectorAll('.g-select-option[choosen="false"]');

		if (options.length > 1) {
			for (let i = 0; i < options.length; i++) {
				let item = options[i];

				if (parseInt(item.getAttribute('data-number')) > num) {
					parent.insertBefore(option,item);
					if (!_.shadow.querySelector('.g-select-option[choosen="true"]')) {
						line.remove();
					}
					return;
				}
			}
			cls ? options[options.length - 2].after(option) : options[options.length - 1].after(option);
			if (!_.shadow.querySelector('.g-select-option[choosen="true"]')) {
				line.remove();
			}
		} else {
			if (cls) {
				parent.insertBefore(option,parent.firstElementChild)
			} else {
				parent.lastElementChild.after(option)
			}
		}

		if (cls) {
			if (!line) {
				line = document.createElement('DIV');
				line.className = 'g-select-line';
			}
			options[options.length - 1].after(line);
		}
	}

	choose({event,fakeItem}){
		const _ = this;
		let item = fakeItem;
		if(!item) item = _.ascent(event,'g-select-option');
		if(!item) return void 0;

		_.multiple = _.hasAttribute('multiple');
		_.handleOption('selectedValues',item,'value',	_.setValue.bind(_));
		_.handleOption('titles',item,'textContent',_.setTitle.bind(_));
		_.changeActiveOption(item);
		if( _.hasAttribute('action') ){
			let rawAction = _.getAttribute('action').split(':');
			G_Bus.trigger(rawAction[0],rawAction[1], {
				name:_.querySelector('[slot="value"]')['name'],
				value: _.selectedValues,
				event: event
			});
		}
		if (!_.multiple) {
			_.close();
		} else {
			_.optionsSort(item);
			_.open();
		}
		_.triggerChangeEvent();
	}
	unChoose({item}){
		const _ = this;
		let
			value = item.value,
			option = _.shadow.querySelector(`.g-select-body BUTTON[data-number="${value}"]`);

		_.removeOption('selectedValues',option,'value');
		_.removeOption('titles',option,'textContent');

		if (!_.titles.length) _.shadow.querySelector('.g-select-title').removeAttribute('style');

		_.optionsSort(option);
		_.triggerChangeEvent();
	}
	unChooseAll(){
		const _ = this;
		let labels = _.shadow.querySelectorAll('.g-select-head-label .g-select-head-close');
		labels.forEach((label)=>{
			let value = label.value,
				option = _.shadow.querySelector(`.g-select-body BUTTON[data-number="${value}"]`);

			_.removeOption('selectedValues',option,'value');
			_.removeOption('titles',option,'textContent');

			if (!_.titles.length) _.shadow.querySelector('.g-select-title').removeAttribute('style');
			_.optionsSort(option);
		})

		_.triggerChangeEvent();
	}

	createHiddenInput(data){
		const _ = this;
		return _.markup(_.getTpl('hiddenInput')(data));
	}
	async connectedCallback() {
		const _ = this;
		let items = JSON.parse(this.getAttribute('items'));
		
		await _.importTpl('./select/template.js');
		if (!_.shadow)_.shadow = this.attachShadow({mode: 'open'});
		_.mainTpl = _.getTpl('select');
		_.baseTitle = this.getAttribute('title');
		
		_.shadow.innerHTML = _.mainTpl({
			items: items,
			title: this.getAttribute('title'),
			name: this.getAttribute('name'),
			arrow: this.getAttribute('arrow'),
			arrowSvg: this.getAttribute('arrowSvg'),
			className: this.getAttribute('className'),
			multiple: this.getAttribute('multiple'),
		});

		let multiple = _.getAttribute('multiple');
		_.append(_.createHiddenInput({
			items: items,
			multiple: multiple,
			name: this.getAttribute('name')
		}))
		if (!multiple) {
			for(let item of items){
				if(item['active']){
					_.selectedValues.push(item['value']);
					_.titles.push(item.textContent)
					break;
				}
			}
		} else {
			_.shadow.querySelector('SLOT').value = '';
			_.selectedTexts = [];
			_.selectedValues = [];
			_.titles = [];
			let activeOptions = _.shadow.querySelectorAll('[data-active]');
			for (let option of activeOptions) {
				_.choose({fakeItem:option});
				option.removeAttribute('data-active')
			}
		}

		_.fillAttributes();
		_.trigger('appended');
	}
	
	styleSheets() {
		return `
			${super.styleSheets()}
			:host {
			  --body-display: none;
			  --body-max-height: 0px;
			}
			.g-select-body.multiple .g-select-line {
				width: calc(100% - 16px);
				height: 1px;
				flex: 0 0 1px;
				background-color: #EBEDF3;
				margin: 0 auto 12px;
			}
			.g-select-line:last-child {
				display:none;
			}
			.g-select {
			  width: 100%;
			  height: 100%;
			  min-width: 80px;
			  position: relative;
			  border: 1px solid #dbdbdb;
			}
			.g-select-head {
			  width: 100%;
			  height: 30px;
			  cursor: pointer;
			  display: flex;
			  align-items: center;
			  background-color: #F5F8FA;
			  white-space: normal;
			  transition: 0.35s ease;
			  padding: 5px 10px;
			}
			.g-select-title {
				//margin-right: 23px;
				font: 14px "Roboto-Medium";
				color: #5E6278;
			}	
			.g-select-head-cont {
				width: calc(100% - 70px);
				flex: 0 0 calc(100% - 70px);
				margin-right: 14px;
				display: flex;
				align-items: center;
				overflow: hidden;
			}
			.g-select-head-cont>span {
				font: 14px "roboto-bold";
			}
			.g-select-head-label {
				width: 113px;
				flex: 0 0 113px;
				padding: 2px 8px;
				margin-right: 4px;
				color: #5E6278;
			  font-size: 14px;
			  font-family: "roboto-medium";
			  font-weight: 500;
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			  background-color: #E5EAEE;
			  border-radius: 6px;
			}
			.g-select-head-label span {
				width: calc(100% - 26px);
				flex: 0 0 calc(100% - 26px);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.g-select-head-close {
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
			  justify-content: center;
				position: relative;
				transform: translateY(-1px);
			}
			.g-select-head-close:before,.g-select-head-close:after {
				width: 14px;
				height: 1px;
				display: block;
				content: '';
				position: absolute;
				background-color: #5E6278;
			}
			.g-select-head-close:before {
				transform: rotate(45deg);
			}
			.g-select-head-close:after {
				transform: rotate(-45deg);
			}
			.g-select-head-count {
				width: 44px;
				flex: 0 0 44px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.g-select-head-count span {
				height: 24px;
				width: 24px;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #3F4254;
				border-radius: 4px;
				font: 14px "Roboto-Medium";
				color: #fff;
			}
			.g-select-body {
			  width: 100%;
			  max-height: var(--body-max-height);
			  display: flex;
			  flex-direction: column;
			  align-items: flex-start;
			  background-color: #fff;
			  overflow: hidden;
			  border-radius: 8px;
			  position: absolute;
			  left: 0;
			  top: 100%;
			  z-index: 2;
			  transition: 0.2s ease;
			}
			.g-select.active .g-select-body {
			  overflow: auto;
			  box-shadow: 0 0 1px rgba(15,23,42,.06), 0 10px 15px -3px rgba(15,23,42,.1), 0 4px 6px -2px rgba(15,23,42,.05);
			}
			.g-select.active .g-select-head:after {
			  transform: rotate(-45deg);
			}
			.g-select-option {
			  width: 100%;
			  min-width: 150px;
			  padding: 10px;
			  text-align: left;
			  display: flex;
			  justify-content: flex-start;
			  align-items: center;
			  position:relative;
			  color: #5E6278;
			  font-size: 14px;
			  font-family: "roboto-medium";
			  font-weight: 500;
			}
			.multiple .g-select-option {
			  margin-bottom: 12px;
			  padding: 0 10px;
			}
			.multiple .g-select-option:last-child {
				margin-bottom: 8px;
			}
			.g-select.active .g-select-body.multiple {
				padding: 8px 0 0;
			}
			.g-select-body.multiple .g-select-option:before {
				width: 24px;
				height: 24px;
				margin-right: 12px;
				display: block;
				content: '';
				border-radius: 6px;
				background-color: #F3F6F9;
			}
			.g-select-body.multiple .g-select-option.active:before {
				background-color: #00A3FF;
			}
			.g-select-body.multiple .g-select-option.active:after {
				content: '';
				background-image: url('../img/checkmark.svg');
				display: block;
				width: 20px;
				height: 20px;
				position: absolute;
				left: 12px;
				top: 2px;
			}
			.g-select-body.multiple .g-select-option:hover,.g-select-body.multiple .g-select-option.active {
			  background-color: transparent;
			}
			.g-select-option:hover,.g-select-option.active {
			  background-color: #dbdbdb;
			}
			.g-select-arrow {
			  width: 20px;
			  margin-left: auto;
			  display: flex;
			  align-items: center;
			  position: absolute;
			  right: 0;
			}
			.g-select-arrow svg {
			  width: 10px;
			  height: 10px;
			  transition: .35s ease;
			}
			.g-select.active .g-select-arrow svg {
				transform: rotate(180deg);
			}
			.g-select-gray {
			  width: 100%;
			  height: 42px;
			  background-color: #F5F8FA;
			  border: none;
			  border-radius: 6px;
			}
			.g-select-gray .g-select-head {
			  height: 100%;
			  padding: 5px 16px;
			  background-color: initial;
			  color: #5E6278;
			}
			.g-select-gray .g-select-title {
			  font-family: var(--f_medium);
			}
			.g-select-gray .g-select-body {
			  padding: 0 4px;
			  background: #FFF;
			  box-shadow: 0 0 1px rgba(15, 23, 42, 0.06), 0 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -2px rgba(15, 23, 42, 0.05);
			  border-radius: 8px;
			}
			.g-select-gray .g-select-option {
			  flex: 0 0 32px;
			  padding: 7px 8px;
			  margin-bottom: 4px;
			  display: flex;
			  align-items: center;
			  position: relative;
			  font-family: var(--f_medium);
			}
			.g-select-gray .g-select-option:first-child {
			  border-radius: 4px 4px 0 0;
			}
			.g-select-gray .g-select-option:last-child {
			  border-radius: 0 0 4px 4px;
			  margin-bottom: 0;
			}
			.g-select-gray .g-select-option.hover, .g-select-gray .g-select-option.active {
			  background-color: #ECF8FF;
			  color: #00A3FF;
			}
			.g-select-gray .g-select-option.active:after {
			  display: block;
			  content: "";
			  width: 16px;
			  height: 16px;
			  content: url("img/checkmark-blue.svg");
			  position: absolute;
			  right: 10px;
			}
			.g-select-gray.active .g-select-body {
			  padding: 4px;
			  border: none;
			}
			
			.filter-select, .adding-select {
			  width: 100%;
			  height: initial;
			  border: none;
			}
			.filter-select .g-select-head, .adding-select .g-select-head {
			  height: 34px;
			  padding: 0 12px;
			  border-radius: 6px;
			  background-color: rgb(var(--neutral-100));
			  color: rgb(161, 165, 183);
			  font-family: var(--f_bold);
			}
			
			.adding-select .g-select-head {
			  height: 44px;
			}
			.adding-select .g-select-arrow {
			  fill: #B5B5C3;
			}
			.adding-select .g-select-title {
			  font: 14px "roboto-regular";
			}
			.adding-select.active .g-select-body {
			  box-shadow: 0px 0px 1px rgba(15, 23, 42, 0.06), 0px 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -2px rgba(15, 23, 42, 0.05);
			  border-radius: 8px;
			  border: 0;
			  top: calc(100% + 4px);
			}
			.adding-select .g-select-option {
			  font: 14px "roboto-medium";
			  padding: 9px 12px;
			  color: #5E6278;
			}
			
			.with-arrow:after {
			  width: 5px;
			  height: 5px;
			  content: "";
			  display: block;
			  flex: 0 0 5px;
			  margin-left: 5px;
			  border-top: 2px solid #000;
			  border-right: 2px solid #000;
			  transform: rotate(135deg);
			  transition: 0.35s ease;
			}
			
			.input-time .g-select-head {
			  height: 50px;
			}
			.input-time .g-select-title {
			  font-weight: 400;
			  color: #5E6278;
			}
			
			.head-select {
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  min-width: initial;
			  border: none;
			  color: #fff;
			  font-size: 12px;
			}
			.head-select .g-select-head {
			  height: 100%;
			  background-color: rgba(255, 255, 255, 0.08);
			  border-radius: 8px;
			}
			.head-select .with-arrow:after {
			  border-color: #fff;
			  transform: rotate(135deg) translate(-2px, 2px);
			}
			
			@media screen and (min-width: 768px) {
			  .head-select .g-select-head {
			    padding: 5px 14px;
			    font-family: var(--f_medium);
			  }
			}
			.table-filter {
			  font-size: calc(12em/14);
			}
			.form-row-select {
				border: none;
			}
			.form-row-select .g-select-head{
				height: 40px;
			}
			
			.head-select .g-select-head{
				justify-content: space-between;
			}
			.head-select .g-select-title {
				font: 12px "Roboto-Bold";
				color: #fff;
			}
			.head-select .g-select-body {
				width: 92px;
				padding: 0 12px;
				background-color: #fff;
				align-items: center;
				top: calc(100% + 6px);
				right: 0;
				left: initial;
			}
			.head-select .g-select-head:before {
				width: 10px;
				height: 10px;
				background-color: transparent;
				transform: rotate(45deg);
				border-radius: 2px;
				content: '';
				position: absolute;
				bottom: -12px;
				right: 24px;
			}
			.head-select.active .g-select-body {
				padding: 12px;
			}
			.head-select.active .g-select-head:before {
				background-color: #fff;
			}
			.head-select .g-select-option {
				min-width: initial;
				justify-content: center;
				border-radius: 8px;
			}
			.head-select .g-select-option.active {
				background-color: #F5F8FA;
				color: #00A3FF;
			}
		`;
	}
	
	disconnectedCallback() {
	}
	static get observedAttributes() {
		return ['items','title','active-items'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		const _ = this;
		if(!_.mainTpl) return void 0;
		if(name == 'items'){
			let body = _.shadow.querySelector('.g-select-body');
			let tpl = _.getTpl('selectBody');
			body.innerHTML = tpl(JSON.parse(newValue));
		}
		if(name == 'title'){
			let title = _.shadow.querySelector('.g-select-title');
			title.textContent = newValue;
		}
	}
}
customElements.define("g-select", GSelect);