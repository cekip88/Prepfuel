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
			.on(_,['changePage','logout','changeHistory'])
		_.user = {};
	}
	get role(){
		const _ = this;
		if(_.user['role']) return _.user['role'];
		else return _.user['user']['role'];
	}
	async getMe(){
		const _ = this;
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
	
	async changePage(route,push){
		const _ = this;
		//_.user['role'] = 'guest';
		//if(_.user['role'] == 'guest')
		await _.getMe();
		
		_.currentPageRoute = await _.definePageRoute(route,push);
		_.clearComponents();
		await _.includePage(_.currentPageRoute);

		/*let locations = localStorage.getItem('history');
		if (!locations) {
			_.locations = [];
		} else {
			_.locations = JSON.parse(locations);
		}
		localStorage.setItem('history',JSON.stringify(_.locations));*/
	}
	async definePageRoute(route,push = true){
		const _ = this;
		if(push && route) history.pushState(null, null, route);
		let
			params = {},
			pathName = location.pathname + location.search,
			rawParams = location.search.split('&'),
			pathParts = pathName.split('/').splice(1),
			module = pathParts.splice(0,1)[0];
		rawParams[0] = rawParams[0].replace('?','');
		if(pathParts && pathParts.length){
			if(pathParts[0].indexOf('?') > -1){
				params['module'] = pathParts[0].substr(0,pathParts[0].indexOf('?'));
			} else {
				params['module'] = pathParts[0];
			}
		}
		for(let i = 0; i < pathParts.length; i++){
			pathParts[i] = pathParts[i].indexOf('?') > 0 ? pathParts[i].substr(0,pathParts[i].indexOf('?')) : pathParts[i];
		}
		let token = pathParts[pathParts.length - 1];

		rawParams.forEach( param =>{
			let rawParam = param.split('=');
			params[rawParam[0].toLowerCase()] = rawParam[1]
		} );
		let
			role = _.role,
			middles = Object.keys(_.middleware),
			currentMiddleware = [];
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
				if(!location.pathname != '/login'){}
				history.pushState(null, null, '/login');
				if (difRoute) {
					return {
						'module': _.routes[`${difRoute}`],
						'params': params,
						'pathParts': pathParts
					}
				}
				return {
					'module': 'login',
					'params': params,
					'pathParts': pathParts
				}
			}else{
				pathName = difRoute;
				return {
					'module': _.routes[`${pathName}`],
					'params': params,
					'pathParts': pathParts
				}
			}
		}
	
		return {
			'module': _.routes[`${pathName}`],
			'params': params,
			'pathParts': pathParts
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
					moduleStr = name.charAt(0).toUpperCase() + name.substr(1) + moduleInc,
					path = `/pages/${name}/${name}.${fileType}.js`,
					pathView = `/pages/${name}/${name}View.js`;
				if (_.pages.has(name)) {
					let comp = _.pages.get(name);
					resolve(comp);
				}
				const
					module = await import(path),
					moduleName = new module[moduleStr](params),
					view = await import(pathView),
					viewObj = view[`${name}View`];
				Object.assign(module[moduleStr].prototype,mixins);
				Object.assign(module[moduleStr].prototype,viewObj);
				if (!_.pages.has(name)) {
					_.pages.set(name, moduleName);
				}
				if('asyncDefine' in moduleName) moduleName.asyncDefine();
				moduleName.createPageStructure(moduleName.pageStructure);
				moduleName.init(blockData);
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
			if (key == 'loginData') return;
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

	changeHistory(){
		const _ = this;
		/*if (_.locations[_.curPosIndex] !== location.pathname) {
			_.locations.push(location.pathname);
		}
		_.curPosIndex = _.locations.length - 1;
		localStorage.setItem('history',JSON.stringify(_.locations));
		console.log(_.locations)*/
	}

	backNextAction(){
		const _ = this;
		/*let locations = localStorage.getItem('history');
		if (!locations) {
			_.locations = [];
		} else {
			_.locations = JSON.parse(locations);
		}
		localStorage.setItem('history',JSON.stringify(_.locations));*/
		let btn = document.querySelector(`.navigate-item[section="${location.pathname/*_.locations[_.curPosIndex]*/}"]`);
		/*console.log(btn)*/
		if ((btn && btn.classList.contains('active')) || !btn) {
			_.changePage(location.pathname,false);
		} else G_Bus.trigger(_.componentName,'backNext',{item:btn,toHistory: false});
	}

	async init(params){
		const _ = this;
		_.middleware = params['middleware'];
		await _.changePage();
		window.addEventListener('mouseout',function (){
			_.mouseOver = false;
		})
		window.addEventListener('mouseover',function (){
			_.mouseOver = true;
		})
		window.addEventListener('popstate',function (e){
			//_.curPosIndex--;
			//_.changePage(_.locations[_.curPosIndex],false);

			if (!_.mouseOver) {
				_.backNextAction();
			}
		});
	}
}

