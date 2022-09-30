import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
import { mixins } from "../mixins.js";

export class G extends G_G{
	static parts = {};
	static modules = new Map();
	static blocks = new Map();
	static abortControllers = new Map();
	constructor() {
		super();
		const _ = this;
		
	}
	addAbortController(ctrl){
		const _ = this;;
		if(G.abortControllers.has(ctrl.name)) return void 0;
		G.abortControllers.set(ctrl['name'],ctrl);
	}
	
	triggerAbortController(){
		const _ = this;
		//console.log(G.abortControllers);
		G.abortControllers.forEach(function (item,index){
			item.abort();
			G.abortControllers.delete(index);
		})
	}
	
	el(tag,params = {}){
		const _ = this;
		if (!tag) return null;
		let
			childes =  params['childes'] ?  params['childes']: null;
		delete params['childes'];
		let temp = document.createElement(tag);
		if (tag == 'temp'){
			temp = document.createDocumentFragment();
		}
		if(params){
			for(let key in params){
				if(key === 'text') {
					if( (tag === 'INPUT') || (tag === 'TEXTAREA') ) temp.value = params[key];
					else temp.textContent = params[key];
				} else if(key === 'prop')  _[params[key]] = temp;
				else if(key === 'html') temp.innerHTML = params[key];
				else temp.setAttribute(`${key}`,`${params[key]}`);
			}
		}
		if(  (childes instanceof  Array) && (childes.length) ) {
			childes.forEach(function (el) {
				temp.append(el);
			});
		}
		return temp;
	}
	createPageStructure(pageStructure){
		const _ = this;
		let struct = pageStructure;
		let gSet = _.f("#g-set");
		_.clear(gSet);
		for(let prop in struct){
			let part = struct[prop];
			if(!part['parent']){
				gSet.append(part['container']);
			}else{
				setTimeout(  ()=>{
					struct[part['parent']]['container'].append(part['container'])
				});
			}
		}
	}
	updateStructure({prop,id}){
		const _ = this;
		_.pageStructure[prop] = id;
	}
	define(){
		const _ = this;
	}
	async render(updateStructure,renderData){
		const _ = this;
		if(!updateStructure) {
			for(let key in _.pageStructure) {
				let part = _.pageStructure[key];
				if(part['id'] !== _.moduleStructure[key]) {
					_.pageStructure[key]['id'] = _.moduleStructure[key];
					_.clear(part['container']);
					if(_[_.moduleStructure[key]] && _.moduleStructure[key]) {
						part['container'].append(_.markup(await _[_.moduleStructure[key]]()));
					}
				}
			}
			G_Bus.trigger(_.componentName,'domReady',renderData);
			return void 'render done';
		}
		for(let key in updateStructure) {
			let part = _.pageStructure[key];
			_.clear(part['container']);
			if(updateStructure[key] == null) continue;
			if(_[updateStructure[key]]){
				part['container'].append(_.markup(await _[updateStructure[key]]()));
			}
		}

		G_Bus.trigger(_.componentName,'domReady',renderData);
	}
	getModule(blockData){
		/*
		* Запрашивает блок страницы или модуль целой страницы
		* */
		const _ = this;
		return new Promise(async function (resolve,reject) {
			try{
				let
					rawParams = blockData.name.split('/'),
					pageName = blockData.pageName,
					moduleInc = 'Module',
					fileType = '',
					name = rawParams[0] ?? rawParams[1],
					params = blockData.params ?? {},
					moduleStr = name.charAt(0).toUpperCase() + name.substr(1)+ moduleInc,
					pathModule = `/pages/${pageName}/modules/${name}/module.js`,
					pathView = `/pages/${pageName}/modules/${name}/view.js`;
		/*		if (G.modules.has(name)) {
					let comp = G.modules.get(name);
					resolve(comp);
				}*/
				const
					module = await import(pathModule),
					view = await import(pathView),
					moduleName = new module[moduleStr](params);
				Object.assign(module[moduleStr].prototype,mixins);
				Object.assign(module[moduleStr].prototype,view['view']);
				if('asyncDefine' in moduleName)	moduleName.asyncDefine();
			//	G.modules.set(name, moduleName);
				moduleName['pageStructure'] = blockData['structure'];
				moduleName.init();
				resolve(moduleName);
			} catch(e) {
				reject(e);
			}
		});
	}
	getBlock(blockData,type='pages'){
		/*
		* Запрашивает блок страницы или модуль целой страницы
		* */
		const _ = this;
		if(blockData.name == 'NotFound') return void 0;
		return new Promise(async function (resolve,reject) {
			try{
				let
					rawParams = blockData.name.split('/'),
					moduleInc = (type == 'pages') ? 'Page' : 'Block',
					fileType = (type == 'pages') ? 'page' : 'block',
					name = rawParams[0] ? rawParams[0] : rawParams[1],
					params = blockData.params ? blockData.params : {},
					moduleStr = name.charAt(0).toUpperCase() + name.substr(1)+ moduleInc,
					path = `/${type}/${name}/${name}.${fileType}.js`;
				if (G.blocks.has(name)) {
					let comp = G.blocks.get(name);
					resolve(comp);
				}
				const
					module = await import(path),
					moduleName = new module[moduleStr](params);
				Object.assign(module[moduleStr].prototype,mixins);
				G.blocks.set(name, moduleName);
				resolve(moduleName);
			} catch(e) {
				reject(e);
			}
		});
	}
	fillPage(parts){
		/* Рендер страницы компонентами */
		G.parts = {};
		const _ = this;
		let
			gSet = _.f('#g-set')
		_.clear(gSet);
		if( !(parts instanceof Array) ){
			gSet.append(parts);
		}else{
			for(let part of parts){
				gSet.append(part);
			}
		}
	}
	fillPartsPage(parts,clear=false){
		/* Рендер страницы компонентами */
		const _ = this;
		let
			gSet = _.f('#g-set');
		if(clear)	_.clear(gSet);
		for(let part of parts){
			if(G.parts[part['part']]){
				for(let content of G.parts[part['part']]['content']){
					_.clear(content);
				}
			}
			G.parts[part['part']] = part;
			if(part['parent']) {
				if(gSet.querySelector(`${part['parent']}`))
				gSet =	gSet.querySelector(`${part['parent']}`)
			}
			gSet.append(...part['content']);
		}
	}
	renderPart(partObj){
		const _ = this;
		if(!(partObj['part'] in G.parts)) return void 0;
		let template = document.createElement('template');
		template.classList.add('g-temp');
		G.parts[partObj['part']]['content'].forEach( (p,i,arr)=>{
			p.before(template);
			p.remove();
		});
		G.parts[partObj['part']]['content'] = [];
		let posToAppend = template;
		partObj['content'].forEach( p =>{
			posToAppend.after(p);
			posToAppend = p;
		});
		G.parts[partObj['part']] = partObj;
		template.remove();
		template = null;
	}


	navigationInit() {
		const _ = this;
		let list = _.f('.navigate-list');
		if (!list) return;

		let label = list.querySelector('.navigate-label');
		if (label.classList.contains('active')) return;

		let activeBtn = _.setActiveNavItem(list);
		if (!activeBtn) return void 0;
		_.changeActiveNavItem(activeBtn,list);
		activeBtn.prepend(label)
		label.classList.add('active');

		window.addEventListener('resize',()=>{
			activeBtn = list.querySelector('.active');
			if (activeBtn) _.showActiveNavItem(activeBtn,list);
		})
		G_Bus.trigger('router','changeHistory');
	}
	navigate({item}){
		const _ = this;

		let list = item.closest('.navigate-list');
		if (!list) {
			list = document.querySelector('.navigate-list');
			_.hideTab(list);
			return;
		}

		_.showActiveNavItem(item,list);
		_.changeActiveNavItem(item,list);
	}
	removeNavigate(){
		const _ = this;
		_.f('.navigate-item.active').classList.remove('active');
		let label = _.f('.navigate-label.active');
		label.classList.remove('active');
		label.removeAttribute('style')
	}
	subnavigate(clickData){
		const _ = this;
		if (!clickData) return;
		let
			target = clickData.event.target,
			btn = _.ascent(target,'.subnavigate-button','subnavigate');

		_.changeActiveNavItem(btn);
	}
	setActiveNavItem(list){
		const _ = this;
		let
			route = location.pathname.split('/')[2],
			activeBtn = list.querySelector(`.${route}`);
		if (!activeBtn) activeBtn = list.querySelector('.active');
		return activeBtn ?? null;
	}
	changeActiveNavItem(item,cont){
		const _ = this;
		let curItem = cont.querySelector('BUTTON.active');
		_.removeCls(curItem,'active');
		item.classList.add('active')
	}
	showActiveNavItem(btn,list){
		let
			width = btn.clientWidth,
			x = btn.offsetLeft,
			label = list.querySelector('.navigate-label'),
			activeBtn = list.querySelector('.active');
		if (btn == activeBtn) return;

		if (label.parentElement !== list) {
			let
				oldX = activeBtn.offsetLeft,
				oldWidth = activeBtn.clientWidth;
			label.style = `transition:0;width: ${oldWidth}px;left: ${oldX}px;`;
			list.append(label);
		}
		setTimeout(()=>{label.style = `width: ${width}px;left: ${x}px;transition: .35s ease`;})
	}
	changeTab(btn,parentCls){
		const _ = this;
		let
			list = btn.parentElement.children,
			parent = btn.closest('.' + parentCls),
			targetSelector = parent.getAttribute('data-tabs'),
			tabsContainer = _.f(targetSelector);

		if (!targetSelector || !tabsContainer) return;

		_.removeCls(tabsContainer.querySelector(`${targetSelector}>.active`),'active');
		for (let i = 0; i < list.length; i++) {
			if (list[i] === btn && tabsContainer.children[i]) tabsContainer.children[i].classList.add('active');
		}
	}
	hideTab(list){
		list.querySelectorAll('.active').forEach(function (item){
			item.classList.remove('active');
		});
	}


	sectionHeaderTpl({title,subtitle,titlesData = {},buttonsData = null,icon= null,gap = true}){
		let tpl = buttonsData || icon ? `<div class="section-header ${gap ? 'block-gap' : ''} ${icon ? 'with-icon' : ''}">` : '';

		let titleTpl = `<h5 class="admin-title ${titlesData['titleCls'] ?? ''} ${!buttonsData && gap ? "block-gap" : ''}"><span>${title}</span></h5>`;
		let subtitleTpl = '';
		if (subtitle) {
			subtitleTpl = `<h6 class="admin-subtitle ${titlesData['subtitleCls'] ?? ''} ${!buttonsData && gap ? "block-gap" : ''}">`;
			if (typeof subtitle == "string") {
				subtitleTpl += `<span>${subtitle}</span>`;
			} else {
				subtitle.forEach(function(item) {
					subtitleTpl += `<span>${item}</span>`;
				})
			}
			subtitleTpl += '</h6>';
		}

		if (!title && subtitle) {
			tpl += subtitleTpl;
		} else if (!subtitle && title) {
			tpl += titleTpl;
		} else if (title && subtitle) {
			tpl += `
				<div class="section-titles ${!buttonsData && gap ? 'block-gap ' : ''} ${titlesData['contCls'] ?? ''}">
					${titleTpl}
					${subtitleTpl}
				</div>
			`
		}

		if (icon) {
			tpl += `<div class="section-icon" style="background-color:rgba(${icon.color},.05)"><svg fill="rgb(${icon.color})"><use xlink:href="#${icon.href}"></use></svg></div>`;
		}

		if (buttonsData) {
			tpl += `<div class="section-buttons">`;
			let buttonAction = buttonsData.action, pos = 0;
			for(let button of buttonsData['buttons']){
				tpl += `<button ${buttonAction ?? ''} class="section-button ${button['active'] ?? ''} ${button.class ?? ''}" data-pos="${button['pos'] ?? pos}"><span>${button['title']}</span></button>`;
				pos++;
			}
			tpl += '</div>';
		}

		tpl += buttonsData || icon ? '</div>' : '';
		return tpl
	}
	sectionFilterTpl({icon,title,buttonsData}){
		const _ = this;
		let tpl = `
			<div class="block-filter">
				<h2 class="block-title">
					${icon ? '<div class="icon"><svg><use xlink:href="#' + icon + '"></use></svg></div>' : ''}
					<span>${title}</span>
				</h2>
				<div class="block-filter-buttons">`
		for (let buttonInfo of buttonsData) {
			tpl += `
				<button 
					class="block-filter-button ${buttonInfo.cls ?? ''}"
					${buttonInfo.action ?? ''}
				><span>${buttonInfo.title}</span></button>`
		}
		tpl += `</div>
			</div>
		`;
		return tpl;
	}

	isEmpty(obj){
		const _ = this;
		for (let key in obj) {
			return false;
		}
		return true;
	}
}