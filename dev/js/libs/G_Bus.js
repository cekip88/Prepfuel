class _G_Bus {
	constructor(flag){
		const _ = this;
		_.components = {};
		_.flag = flag;
	}
	on(component,eventName,fn,inProp){
		const _ = this;
		let prop;
		if (!component) return _;
		if(!fn)
			fn = component[eventName].bind(component);
		prop  = component.busProp;
		if(!component.busProp){
			prop = fn.name;
		}
		if(inProp){
			prop = inProp;
		}
		let componentName;
		if(typeof component == 'object'){
			componentName = component.componentName.toLowerCase();
		}else{
			componentName = component;
		}
		if(!_.components[componentName]){
			_.components[componentName] = {};
			_.components[componentName]['events'] = _.components[componentName]['events'] || new Map();
		//	_.components[componentName]['events'] = {};
		}
		if(!_.components[componentName]['events'].has(eventName)){
			_.components[componentName]['events'][eventName] = new Map();
		}
		if(!_.components[componentName]['events'][eventName].has(prop)) {
			_.components[componentName]['events'][eventName].set(prop, fn);
			return _;
		}
		if(_.flag === 'dev'){
			console.warn(`Subscribe on event ${eventName} on fn: ${fn.name}`);
		}
		return _;
	}
	trigger(componentName,eventName,data){
		const _ = this;
		componentName = componentName.toLowerCase();
		return new Promise(async function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Component ${componentName}: Event start ${eventName} with data:`,data);
			}
			try{
				let currentEvents = _.components[componentName]['events'][eventName]
				if(currentEvents){
					if (currentEvents.size) {
						for(let item of currentEvents){
							resolve(await item[1](data));
						}
					}
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					console.log('%c%s',`background-color:#3f51b5;`,`Event is not define ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(component,eventName,prop){
		const _ = this;
		let currentEvents = _.components[componentName]['events'][eventName]
		if (currentEvents) {
			currentEvents.delete(prop);
		}
	}
	clear(component){
		const _ = this;
		let componentName;
		if(typeof component == 'object'){
			componentName = component.componentName.toLowerCase();
		}else{
			componentName = component;
		}
		delete _.components[componentName];
	}
}
export const G_Bus = new _G_Bus('prod');
window['G_Bus'] = G_Bus;