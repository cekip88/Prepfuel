import { mixins } from "./mixins.js";
import { G_Bus } from "../libs/G_Bus.js";
import { env } from "/env.js"
export class router {
	constructor() {
		const _ = this;
		_.componentName = 'router';
		_.pages = new Map();
		_.systemComponents = ['router'];
		this.baseHeaders = {
			headers:{
				"Content-type": "application/json"
			}
		}
		this.endpoints = {
			'me':`${env.backendUrl}/user/me`,
			'logout': `${env.backendUrl}/auth/logout`,
		};
		G_Bus
			.on(_,['changePage','logout'])
	}
	get role(){
		const _ = this;
		if(_.user['role']) 	return _.user['role'];
		else 	return _.user['user']['role'];
	}
	async getMe(){
		const _ = this;
		if(_.user) return _.user;
		let rawResponse = await fetch(_.endpoints['me'],{
			..._.baseHeaders,
			method: 'GET'
		});
		if(rawResponse.status < 206){
			let response = await rawResponse.json();
			_.user = response['response'];
			return void 0;
		}else{
			_.user = { role:'guest' };
		}
	}
	async changePage(route){
		const _ = this;
		//return;
		await _.getMe();
		
		_.currentPageRoute = await _.definePageRoute(route);
		
		_.clearComponents();
	
	//	if(!_.pages.has(_.currentPageRoute['module'])){
		let currentPage = await _.includePage(_.currentPageRoute);
	//	}else{
		
	//	}
		
	}
	async definePageRoute(route){
		const _ = this;
		if(route) history.pushState(null, null, route);
		let
			pathName = location.pathname+location.search,
			pathParts = pathName.split('/').splice(1),
			module = pathParts.splice(0,1)[0],
			params = pathParts;
		let role = _.role;
		let middles = Object.keys(_.middleware),
				currentMiddleware = ['guest'];
		if(middles){
			for(let middle of middles){
				if(middle.indexOf(role) > -1){
					currentMiddleware.push(middle)
				}
			}
		}
		_.routes  = {};
		_.routesValues = [];
		for(let role of currentMiddleware){
			let
				rs = _.middleware[role]['routes'],
				values = Object.keys(_.middleware[role]['routes']);
			_.routes = {..._.routes,...rs};
			_.routesValues.push(...values);
		}
		if(_.routesValues.indexOf(`${pathName}`) < 0){
			let outRoute, difRoute;
			for(let value of _.routesValues){
				if(value.indexOf('{') > 0){
					let rawOutRoute = value.substring(value.indexOf('{')-1,-1);
					difRoute = value;
					rawOutRoute = new RegExp(rawOutRoute.replace('/','\/')+'/\\w{1,}');
					outRoute = pathName.match(rawOutRoute);
					if(outRoute) continue;
				}
			}
			if(!outRoute){
			
				if(!location.pathname != '/login'){
					//location.href='/login';
				}
				return {
					'module': 'login',
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
	async includePage(blockData){
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
				if (!_.pages.has(name)) {
					_.pages.set(name, moduleName);
				}
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
		_.middleware = params['middleware'];
		//await _.getMe();
		await _.changePage();
	}
}