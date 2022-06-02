import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
import { mixins } from "../mixins.js";

export class G extends G_G{
	static parts = {};
	static modules = new Map();
	static blocks = new Map();
	
	constructor() {
		super();
		const _ = this;
	}
	createPageStructure(pageStructure){
		const _ = this;
		let struct = pageStructure;
		let gSet = _.f("#g-set");
		_.clear(gSet);
		for(let prop in struct){
			let part = struct[prop];
			gSet.append(part['container']);
		}
	}
	updateStructure({prop,id}){
		const _ = this;
		_.pageStructure[prop] = id;
	}
	define(){	}
	async render(){
		const _ = this;
		for (let key in _.pageStructure) {
			let part = _.pageStructure[key];
			if (part['id'] !== _.moduleStructure[key]) {
				_.pageStructure[key]['id'] = _.moduleStructure[key];
				_.clear(part['container']);
				if ( _[_.moduleStructure[key]] && _.moduleStructure[key]) part['container'].append(_.markup(await _[_.moduleStructure[key]]()))
			}
		}
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
					fileType ='',
					name = rawParams[0] ? rawParams[0] : rawParams[1],
					params = blockData.params ? blockData.params : {},
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
				if('asyncDefine' in moduleName)	await moduleName.asyncDefine();
			//	G.modules.set(name, moduleName);
				moduleName['pageStructure'] = blockData['structure'];
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

}