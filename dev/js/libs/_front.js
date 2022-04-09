import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
export class _front extends G_G{
  constructor() {
		super();
    const _ = this;
    _.componentName = 'front';
    _.libs = new Map();
    _.components = new Map();
  
  }
	define(){}
	definePage(){
		const _ = this;
		let
			currentPageMeta = _.f('meta[name="page"]');
		if(currentPageMeta) return currentPageMeta.getAttribute('content');
		return '404';
	}
	getPage(pageData){
		const _ = this;
		if(pageData.name == '404') return void 0;
		return new Promise(async function (resolve,reject) {
			try{
				let
					name = pageData.name.toLowerCase(),
					params = pageData.params ? pageData.params : {},
					moduleStr = name.charAt(0).toUpperCase() + name.substr(1)+'Page',
					path = `/pages/${name}/${name}.page.js`;
				if (_.components.has(name)) resolve(_.components.get(name));
				
				const
				module = await import(path),
				moduleName = new module[moduleStr](params);
				_.components.set(name, moduleName);
				resolve(moduleName);
			} catch(e){
				//console.dir(e);
				reject(e)
				//	moduleName.init();
				
			}
		});
	}
  init(){
    const _ = this;
  }

}