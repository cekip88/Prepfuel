import { mixins } from "./mixins.js";
import { G_Bus } from "../libs/G_Bus.js";
import { env } from "/env.js"
export class router {
	constructor() {
		const _ = this;
		_.componentName = 'router';
		_.pages = new Map();
		_.systemComponents = ['router'];
		this.endpoints = {
			'logout': `${env.backendUrl}/auth/logout`,
		};
		G_Bus
			.on(_,'changePage')
			.on(_,'logout')
	}
	async changePage(route){
		const _ = this;
		_.currentPageRoute = _.definePageRoute(route);
		
		_.clearComponents();
		if(!_.pages.has(_.currentPageRoute['module'])){
			let currentPage = await _.includePage(_.currentPageRoute);
		}
	}
	definePageRoute(route){
		const _ = this;
		if(route) history.pushState(null, null, route);
		let
			pathName = location.pathname+location.search,
			pathParts = pathName.split('/').splice(1),
			module = pathParts.splice(0,1)[0],
			params = pathParts;
		let routesValues = Object.keys(_.routes);
	
		if(routesValues.indexOf(`${pathName}`) < 0){
			let outRoute, difRoute;
			for(let value of routesValues){
				if(value.indexOf('{') > 0){
					let rawOutRoute = value.substring(value.indexOf('{')-1,-1);
					difRoute = value;
					rawOutRoute = new RegExp(rawOutRoute.replace('/','\/')+'/\\w{1,}');
					outRoute = pathName.match(rawOutRoute);
					if(outRoute) continue;
				}
			}
			if(!outRoute){
				return {
					'module': 'NotFound',
					'params': null
				}
			}else{
				pathName = difRoute;
				return {
					'module': _.routes[`${pathName}`],
					'params': params
				}
			}
		}
		return {
			'module': _.routes[`${pathName}`],
			'params': params
		}
	}
	includePage(blockData){
		const _ = this;
		return new Promise(async function (resolve,reject) {
			try{
				let
					moduleInc = 'Page',
					fileType = 'page',
					name = blockData['module'],
					params = blockData['params'] ? blockData['params'] : {},
					moduleStr = name.charAt(0).toUpperCase() + name.substr(1)+ moduleInc,
					path = `/pages/${name}/${name}.${fileType}.js`,
					pathView = `/pages/${name}/${name}View.js`;
				if (_.pages.has(name)) {
					let comp = _.pages.get(name);
					resolve(comp);
				}
				const
					module = await import(path),
					moduleName = new module[moduleStr](params);
				const
					view = await import(pathView),
					viewObj = view[`${name}View`];
				Object.assign(module[moduleStr].prototype,mixins);
				Object.assign(module[moduleStr].prototype,viewObj);

				_.pages.set(name, moduleName);
				if('asyncDefine' in moduleName)	await moduleName.asyncDefine();
				moduleName.render(blockData);
				resolve(moduleName);
			} catch(e) {
				reject(e);
			}
		});
	}
	clearComponents(modules){
		const _ = this;
		for(let page of _.pages){
			if(_.isSystemComponent(page[0])){
				continue;
			}
			if(_.currentPageRoute['module'] == page[0]){
				continue;
			}
			let EventComponentName = `${page[0]}page`.toLowerCase();
			_.pages.delete(page[0]);
			delete G_Bus.components[EventComponentName];
		}
	}
	async logout(){
		const _ = this;
		Object.keys(localStorage).forEach( key => {
			localStorage.removeItem(key)
		});
		let rawResponse = await fetch(_.endpoints['logout'],{
			method: 'GET'
		});
		if(rawResponse.status < 206){
			let response = await rawResponse.json();
			G_Bus.trigger('router','changePage','/login');
		}
		
	}
	isSystemComponent(componentName){
		if(this.systemComponents.indexOf(componentName) > -1){
			return true;
		}
		return false;
	}
	async init(params){
		const _ = this;
		_.routes = params['routes'];
		await _.changePage();
	}
}