import { G_Bus } from "../libs/G_Bus.js";
export class router {
	constructor() {
		const _ = this;
		_.componentName = 'router';
		_.libs = new Map();
		_.components = new Map();
		G_Bus.on('setRoute',_.setRoute.bind(_))
	}
	/*Storage*/
	storageHas(key){
		return localStorage.getItem(key) ? true : false;
	}
	storageGet(key,parse){
		if (!this.storageHas(key)) return null;
		if (!parse) parse = false;
		return !parse ? localStorage.getItem(key) : JSON.parse(localStorage.getItem(key));
	}
	storageSave(key,value){
		localStorage.removeItem(key);
		if(typeof value == 'object'){
			localStorage.setItem(key,JSON.stringify(value));
		}else{
			localStorage.setItem(key,value);
		}
	}
	storageUpdate(key,value){
		const _ = this;
		let savedItem = _.storageGet(key,true);
		if (typeof savedItem != 'object' || typeof value != 'object') return;
		for(let k in value){
			savedItem[k] = value[k];
		}
		_.storageSave(key,savedItem);
	}
	remove(key){
		if(this.storageHas(key)) localStorage.removeItem(key);
	}
	/*Storage*/
	
	clear(domElement){
		if(!domElement) return void 0;
		if(domElement instanceof HTMLElement){
			domElement.innerHTML = null;
		}
	}
	saveRoute(route){
		const _ = this;
		_.storageSave('g-route-prev',_.storageGet('g-route-current'));
		_.storageSave('g-route-current',route);
	}
	async setupRoute(route){
		const _ = this;
		let
		currentPage = await _.getBlock({
			name: route
		});
		currentPage.render();
		_.saveRoute(route);
	}
	async setRouteFromString(route){
		const _ = this;
		return await _.setupRoute(route);
	}
	async setRoute({item,event}){
		const _ = this;
		let route = item ? item.getAttribute('route') : _.defineRoute();
		return await _.setupRoute(route);
	}
	defineRoute(){
		const _ = this;
		return _.storageGet('g-route-current') ?? 'login';
	}
	getBlock(blockData,type='pages'){
		/*
		* Запрашивает блок страницы или модуль целой страницы
		* */
		const _ = this;
		if(blockData.name == '404') return void 0;
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
				
				
				
				if (_.components.has(name)) {
					let comp = _.components.get(name);
					console.log(comp);
					resolve(comp);
				}
				const
				module = await import(path),
				moduleName = new module[moduleStr](params);
				_.components.set(name, moduleName);
				resolve(moduleName);
			} catch(e) {
				reject(e);
			}
		});
	}
	fillPage(parts){
		/* Рендер страницы компонентами */
		const _ = this;
		let
		gSet = document.querySelector('#g-set')
		_.clear(gSet);
		if( !(parts instanceof Array) ){
			gSet.append(parts);
		}else{
			for(let part of parts){
				gSet.append(part);
			}
		}
		
	}
	init(){
		const _ = this;
	}
	
}