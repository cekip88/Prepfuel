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
		_.componentName= 'select';
		_.titles = [];
		_ .on('open',_.open.bind(_))
		_ .on('close',_.close.bind(_))
			.on('choose',_.choose.bind(_));
	}

	open({item}){
		const _ = this;
		if(!_.opened){
			_.setProperty('--body-max-height','182px');
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
	}
	handleOption(prop,option,field,callback){
		const _ = this;
		let
			value = option[field];
		if(_.hasOption(prop,value) && _.multiple){
			_.removeOption(prop,option,field);
		}else{
			if (!_.multiple) {
				_[prop] = [value];
			}else{
				_[prop].push(value);
			}
		}
		if(callback) callback();
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
	setTitle(){
		const _ = this;
		if (!_.titles.length) _.setAttribute('title',_.baseTitle);
		else _.setAttribute('title',this.titles.toString());
	}

	choose({event,fakeItem}){
		const _ = this;
		let item;
		if(!fakeItem) item = _.ascent(event,'g-select-option');
		else item = fakeItem;
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
		}
		_.triggerChangeEvent();
	}
	createHiddenInput(data){
		const _ = this;
		return _.markup(_.getTpl('hiddenInput')(data));
	}
	async connectedCallback() {
		const _ = this;
		let items = JSON.parse(this.getAttribute('items'));
		
		for(let item of items){
			if(item['active']){
				_.selectedValues.push(item['value']);
				break;
			}
		}
		
		
		await _.importTpl('./select/template.js');
		_.shadow = this.attachShadow({mode: 'open'});
		_.mainTpl = _.getTpl('select');
		_.baseTitle = this.getAttribute('title');
		
		_.shadow.innerHTML = _.mainTpl({
			items: items,
			title: this.getAttribute('title'),
			name: this.getAttribute('name'),
			arrow: this.getAttribute('arrow'),
			arrowSvg: this.getAttribute('arrowSvg'),
			className: this.getAttribute('className')
		});

		_.append(_.createHiddenInput({
			items: items,
			name: this.getAttribute('name')
		}))

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
			  justify-content: space-between;
			  background-color: #fff;
			  white-space: normal;
			  transition: 0.35s ease;
			  padding: 5px 10px;
			}
			.g-select-body {
			  width: 100%;
			  max-height: var(--body-max-height);
			  display: flex;
			  flex-direction: column;
			  align-items: flex-start;
			  background-color: #fff;
			  overflow: hidden;
			  position: absolute;
			  left: 0;
			  top: 100%;
			  z-index: 2;
			  transition: 0.2s ease;
			}
			.g-select.active .g-select-body {
			  overflow: auto;
			  border: 1px solid #dbdbdb;
			}
			.g-select.active .g-select-head:after {
			  transform: rotate(-45deg);
			}
			.g-select-option {
			  flex: 0 0 30px;
			  width: 100%;
			  margin-bottom: 1px;
			  padding: 0 10px;
			  text-align: left;
			  display: flex;
			  justify-content: flex-start;
			  align-items: center;
			}
			.g-select-option:hover, .g-select-option.active {
			  background-color: #dbdbdb;
			}
			.g-select-arrow {
			  width: 20px;
			}
			.g-select-arrow svg {
			  width: 10px;
			  height: 10px;
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
			  color: rgb(var(--neutral-500));
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