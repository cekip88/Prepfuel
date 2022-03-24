export default class GComponent extends HTMLElement {
	constructor(flag) {
		super();
		// элемент создан
		const _ = this;
		_.flag = flag;
		_.events = {};
		_.container = _;
		_.handle();
		_.filteredAttributes = [];
	}

	async importTpl(fileName, method = 'default') {
		const _ = this;
		let tpl = await import(fileName);
		_.tpls = tpl[method];
		return void 0;
	}
	getTpl(tplName){
		const _ = this;
		if(!_.tpls) return;
		return _.tpls[tplName] ?? '';
	}
	markup(domStr,isFragment=true){
		const _ = this;
		let
			fragment = document.createDocumentFragment(),
			parser= new DOMParser().parseFromString(domStr,'text/html');
		if(isFragment){
			fragment.append(...parser.body.children);
			return fragment;
		}
		return parser.body.children;
	}
	setProperty(property,value){
		const _ = this;
		_.style.setProperty(property,value);
	}
	appendTpl(tpl){
		const _ = this;
		_.shadow.innerHTML = tpl();
		_.fillAttributes();
	}
	fillAttributes(){
		const _ = this;
		for(let i=0; i < _.attributes.length;i++){
			let attr = _.attributes[i];
			if( (attr.name == 'style') || (attr.name == 'id')  ) continue;
			if(_.filteredAttributes.indexOf(attr.name) > -1 ) continue;
			_.setProperty(`--${attr.name}`,  attr.value);
		}
		/*	_.setProperty("--color",  this.getAttribute('color'));
			_.setProperty("--right",  this.getAttribute('right'));*/
	}
	/**/
	on(eventName,fn){
		const _ = this;
		if (!_.events[eventName]) {
			this.events[eventName] = []
		}
		this.events[eventName].push(fn)
		if(_.flag === 'dev'){
			console.warn(`Referring to an event: ${eventName}.Handler: ${fn.name}`);
		}
		return _;
	}
	trigger(eventName,data){
		const _ = this;
		return new Promise(function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Trigger event: ${eventName} with data: "${data}" `);
			}
			try{
				if (_.events[eventName]) {
					_.events[eventName].forEach( async (fn) => resolve(await fn(data)))
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!РћР±СЂР°С‰РµРЅРёРµ Рє СЃРѕР±С‹С‚РёСЋ, РєРѕС‚РѕСЂРѕРµ РЅРµ РѕРїСЂРµРґРµР»РµРЅРѕ ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(eventName,prop){
		const _ = this;
		if (_.events[eventName]) {
			delete _.events[eventName];
		}
	}
	clear(){
		const _ = this;
		for(let prop in _.events) {
			if (prop === 'includeModule' || prop === 'showMenu') continue;
			delete _.events[prop];
		}
	}
	/**/
	ascent(event,targetCls){
		const _ = this;
		let eventPath = event.composedPath();
		if(!eventPath.length) return;

		for(let i=0,len=eventPath.length; i < len;i++){
			let item = eventPath[i];
			if( (!item == _.container ) || (!item) || (!item.tagName) ) break;
			if( item.classList.contains(targetCls) ){
				return item;
			}
		}
	}
	/**/
	triggerWithEvent(data,currentAction){
		const _ = this;
		if (!data['item'])  return;
		let rawActions = data['item'].dataset[currentAction].split(';');
		rawActions.forEach( (action)=>{
			_.trigger(action,data);
		});
	}
	clickHandler(e){
		const _ = this;
		let eventPath = e.composedPath();
		if(!eventPath.length) return;
		for(let i=0,len=eventPath.length; i < len;i++){
			let item = eventPath[i];
			if( (!item == _.container ) || (!item) || (!item.tagName) ) break;
			if( item.hasAttribute('data-click') ){
				_.triggerWithEvent({'item':item,'event':e},'click');
				break;
			}
		}
		return void 0;
	}
	contextHandler(e){
		const _ = this;
		e.preventDefault();
		let item = e.target;
		if(!item) return;
		if(e.which == 3){
			while(item != _) {
				if( ('context' in item.dataset) ){
					_.triggerWithEvent({'item':item,'event':e},'context');
					return;
				}
				item = item.parentNode;
			}
		}
	}
	focusOutHandler(e){
		let item = e.target;
		if( ('outfocus' in item.dataset) ){
			_.triggerWithEvent({item:item,event:e},'outfocus');
			return;
		}
	}
	changeHandler(e){
		let item = e.target;
		if( item.hasAttribute('data-change') ){
			_.triggerWithEvent({'item':item,'event':e},'change');
			return void 0;
		}
	}
	inputHandler(e){
		let item = e.target;
		if( ('input' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'input');
			return;
		}
	}
	keyUpHandler(e){
		let item = e.target;
		if( ('keyup' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'keyup');
			return;
		}
	}
	submitHandler(e){
		e.preventDefault();
		let item = e.target;
		if( ('submit' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'submit');
			return;
		}
	}
	scrollHandler(e){
		let item = e.target;
		if(!item.dataset) return;
		if( ('scroll' in item.dataset) ){
			return _.triggerWithEvent({'item':item,'event':e},'scroll');
		}
	}
	overHandler(e){
		let item = e.target;
		if( ('over' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'over');
			return;
		}
	}
	dragStartHandler(e){
		let item = e.target;
		if( ('dragStart' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'dragStart');
			return;
		}
	}
	dragOverHandler(e){
		let item = e.target;
		if( ('dragOver' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'dragOver');
			return;
		}
	}
	dragEnterHandler(e){
		let item = e.target;
		if( ('dragEnter' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'dragEnter');
			return;
		}
	}
	dragLeaveHandler(e){
		let item = e.target;
		if( ('dragLeave' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'dragLeave');
			return;
		}
	}
	dropHandler(e){
		let item = e.target;
		if( ('drop' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'drop');
			return;
		}
	}
	outHandler(e){
		let item = e.target;
		if( ('out' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'out');
			return;
		}
	}
	leaveHandler(e){
		let item = e.target;
		if(! (item instanceof HTMLElement)) return;
		if(!item.hasAttribute('data-leave')) return;
		if( ('leave' in item.dataset) ){
			_.triggerWithEvent({'item':item,'event':e},'leave');
			return;
		}
	}



	handle(){
		const _  = this;
		_.container.addEventListener('focusout',_.focusOutHandler);
		_.container.addEventListener('submit',_.submitHandler);
		_.container.addEventListener('click', _.clickHandler.bind(_));
		_.container.addEventListener('contextmenu', _.contextHandler);
		_.container.addEventListener('change',_.changeHandler);
		_.container.addEventListener('input',_.inputHandler);
		_.container.addEventListener('keyup',_.keyUpHandler);
		_.container.addEventListener('mouseover',_.overHandler);
		_.container.addEventListener('mouseout',_.outHandler);
		_.container.addEventListener('mouseleave',_.leaveHandler);
		_.container.addEventListener('dragstart',_.dragStartHandler);
		_.container.addEventListener('dragenter',_.dragEnterHandler);
		_.container.addEventListener('dragleave',_.dragLeaveHandler);
		_.container.addEventListener('dragover',_.dragOverHandler);
		_.container.addEventListener('drop',_.dropHandler);
		_.container.addEventListener('scroll',_.scrollHandler);
	}
	/**/
}
