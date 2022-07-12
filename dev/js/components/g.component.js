export default class GComponent extends HTMLElement {
	#_events = {}
	constructor(flag) {
		super();
		// элемент создан
		const _ = this;
		_.flag = flag;
		_.container = _;
		_.handle();
		_.filteredAttributes = ['stylesheet'];
		_
			.on('appended',_.appended.bind(_))
	}
	appended(elem){
		const _ = this;
	/*	let cssLink  = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.href = _.attr('stylesheet') ?? '/components.css';
		_.shadow.append(cssLink);*/
		
		let style = document.createElement('style');
		style.textContent = _.styleSheets().trim();
		_.shadow.append(style);
		//if(!_.shadow.querySelector('.not-loaded')) return;
		//_.shadow.querySelector('.not-loaded').classList.remove('not-loaded')
	}
	styleSheets(){
		return `
			* {
			  margin: 0;
			  padding: 0;
			  line-height: 1.15;
			  box-sizing: border-box;
			  outline: 0;
			  text-decoration: none;
			  -webkit-text-size-adjust: 100%;
			}
			a {
			  color: #000;
			}
			h1, h2, h3, h4, h5, h6 {
			  font-weight: 500;
			  font-size: 1em;
			}
			em, strong, i, b, address, cite {
			  font-style: normal;
			  font-weight: 500;
			}
			
			ul, ol {
			  list-style: none;
			}
			
			input[type=submit], button {
			  cursor: pointer;
			  background: transparent;
			  border: 0;
			}
			
			img {
			  max-width: 100%;
			}
			
			:root {
			  --p_reg: "Poppins-Regular";
			  --p_semi: "Poppins-SemiBold";
			  --p_medium: "Poppins-Medium";
			  --p_bold: "Poppins-Bold";
			  --f_reg: "roboto-regular";
			  --f_semi: "roboto-semibold";
			  --f_bold: "roboto-bold";
			  --f_medium: "Roboto-Medium";
			  --f_black: "Roboto-Black";
			  --main-text: 63, 66, 84;
			  --bgc: 242, 243, 247;
			  --black: 0, 0, 0;
			  --white: 255, 255, 255;
			  --red-light: 255, 245, 248;
			  --red: 241, 65, 108;
			  --red-dark: 217, 33, 78;
			  --orange: 255, 166, 33;
			  --orange-light: 255, 245, 231;
			  --gold: 241, 188, 0;
			  --gold-light: 255, 248, 221;
			  --brown-light: 251, 241, 248;
			  --brown: 152, 101, 79;
			  --brown-dark: 88, 36, 75;
			  --blue-white: 156, 205, 255;
			  --blue-light: 225, 240, 255;
			  --blue: 54, 153, 255;
			  --blue-text: 0, 163, 255;
			  --blue-dark: 27, 44, 207;
			  --viol-light: 248, 245, 255;
			  --viol: 80, 20, 208;
			  --viol-dark: 102, 50, 89;
			  --viol-blue: 74, 125, 255;
			  --viol-blue-light: 241, 245, 255;
			  --green-light: 232, 255, 243;
			  --green: 80, 205, 137;
			  --green-dark: 71, 190, 125;
			  --turquoise-light: 183, 251, 251;
			  --turquoise: 4, 200, 200;
			  --turquoise-dark: 0, 175, 175;
			  --maroon: 102, 50, 89;
			  --maroon-light: 251, 241, 248;
			  --neutral-100: 245, 248, 250;
			  --neutral-200: 239, 242, 245;
			  --neutral-300: 229, 234, 238;
			  --neutral-400: 181, 181, 195;
			  --neutral-500: 161, 165, 183;
			  --neutral-600: 126, 130, 153;
			  --neutral-700: 94, 98, 120;
			  --neutral-800: 63, 66, 84;
			  --neutral-900: 24, 28, 50;
			  --subnav: 128, 128, 143;
			  --answer-disabled: 196, 196, 196;
			  --mobile: 100%;
			  --tablet: 740px;
			  --tabLarge: 1000px;
			  --desk: 1200px;
			  --desk-large: 1440px;
			}
			
			input, button {
			  font-family: inherit;
			  font-size: inherit;
			  background-color: transparent;
			  border: none;
			}
			
			::-webkit-scrollbar {
			  width: 10px;
			  height: 10px;
			}
			
			::-webkit-scrollbar-track {
			  border-radius: 8px;
			  background: rgb(var(--neutral-100));
			}
			
			::-webkit-scrollbar-thumb {
			  border-radius: 6px;
			  background: rgb(var(--neutral-400));
			}
			
			::-webkit-scrollbar-thumb:hover {
			  background: rgb(var(--neutral-500));
			}
			
			:host {
			  --animation-time: .35s;
			  --input-blue: 80, 104, 226;
			  --input-red: 241, 65, 108;
			  --green: 131, 191, 110;
			  --gap: 10px;
			}
		`;
	}
	async initShadow(){
		const _ = this;
		if(_.shadow) return;
		console.log(_)
		await _.importTpl(`./${_.componentName}/template.js`);
		console.log('here')
		_.shadow = this.attachShadow({ mode: 'open' });
		console.log(_.shadow)
		_.container = _.shadow;
	}
	async importTpl(fileName='template', method = 'default') {
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
	markup(domStr,isFragment= true){
		let parser = new DOMParser().parseFromString(domStr,'text/html');
		if(isFragment){
			let fragment = document.createDocumentFragment();
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

	attr(name,value){
		const _ = this;
		//if(!_.hasAttribute(name)) return;
		if(!value) return _.getAttribute(name);
		_.setAttribute(name,value);
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
	on(eventName,fn=eventName){
		const _ = this;
		if (!_.#_events[eventName]) {
			this.#_events[eventName] = []
		}
		this.#_events[eventName].push(fn)
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
				if (_.#_events[eventName]) {
					_.#_events[eventName].forEach( async (fn) => resolve(await fn(data)))
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
		if (_.#_events[eventName]) {
			delete _.#_events[eventName];
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

	prepareHandler(e,dataEvent){
		const _ = this;
		let eventPath = e.composedPath();
		if(!eventPath.length) return;
		for(let i=0,len=eventPath.length; i < len;i++){
			let item = eventPath[i];
			if( (!item == _.container ) || (!item) || (!item.tagName) ) break;
			
			if( item.hasAttribute(`data-${dataEvent}`) ){
				_.triggerWithEvent({'item':item,'event':e},dataEvent);
				break;
			}
		}
	}

	clickHandler(e){this.prepareHandler(e,'click');}
	focusOutHandler(e){
		return this.prepareHandler(e,'focusout');
	}
	focusInHandler(e){return this.prepareHandler(e,'focusin');}
	changeHandler(e){return this.prepareHandler(e,'change');}
	inputHandler(e){
		return this.prepareHandler(e,'input');
	}
	keyUpHandler(e){ return this.prepareHandler(e,'keyup');}
	keyDownHandler(e){ return this.prepareHandler(e,'keydown');}
	mouseUpHandler(e){ return this.prepareHandler(e,'mouseup');}
	mouseDownHandler(e){ return this.prepareHandler(e,'mousedown');}
	submitHandler(e){ return this.prepareHandler(e,'submit');}
	scrollHandler(e){ return this.prepareHandler(e,'scroll');}
	overHandler(e){ return this.prepareHandler(e,'over');}

	dragStartHandler(e){ return this.prepareHandler(e,'dragStart');}
	dragOverHandler(e){ return this.prepareHandler(e,'dragOver');}
	dragEnterHandler(e){ return this.prepareHandler(e,'dragEnter');}
	dragLeaveHandler(e){ return this.prepareHandler(e,'dragLeave');}
	dropHandler(e){ return this.prepareHandler(e,'drop');}
	outHandler(e){ return this.prepareHandler(e,'out');}
	leaveHandler(e){ return this.prepareHandler(e,'leave');}

	triggerChangeEvent(){
		const changeEvent = new Event('change', {
			bubbles: true,
			cancelable: true
		});
		this.dispatchEvent(changeEvent);
	}

	handle(){
		const _  = this;
		//_.container = _.shadow;
		_.container.addEventListener('focusout',_.focusOutHandler.bind(_));
		_.container.addEventListener('focusin',_.focusInHandler.bind(_));
		_.container.addEventListener('submit',_.submitHandler.bind(_));
		_.container.addEventListener('click', _.clickHandler.bind(_));
		_.container.addEventListener('change',_.changeHandler.bind(_));
		_.container.addEventListener('input',_.inputHandler.bind(_));
		_.container.addEventListener('keyup',_.keyUpHandler);
		_.container.addEventListener('keydown',_.keyDownHandler);
		_.container.addEventListener('mouseup',_.mouseUpHandler.bind(_));
		_.container.addEventListener('mousedown',_.mouseDownHandler.bind(_));
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
