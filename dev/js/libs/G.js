import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
export class G extends G_G{
  constructor() {
		super();
    const _ = this;
    _.components = new Map();
		_.parts = {}
  }
	define(){	}
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
				if (_.components.has(name)) {
					let comp = _.components.get(name);
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
	fillPartsPage(parts){
		/* Рендер страницы компонентами */
		const _ = this;
		//_.parts = parts;
		let
			gSet = _.f('#g-set')
		_.clear(gSet);
		for(let part of parts){
			_.parts[part['part']] = part;
			gSet.append(...part['content']);
		}
	}
	renderPart(partObj){
		const _ = this;
		if(!(partObj['part'] in _.parts)) return;
		let template = document.createElement('template');
		template.classList.add('g-temp');
		_.parts[partObj['part']]['content'].forEach( (p,i,arr)=>{
			p.before(template);
			p.remove();
		});
		_.parts[partObj['part']]['content'] = [];
		let posToAppend = template;
		partObj['content'].forEach( p =>{
			posToAppend.after(p);
			posToAppend = p;
		});
		_.parts[partObj['part']] = partObj;
		template.remove();
		template = null;
	}
  init(){
    const _ = this;
  }

}