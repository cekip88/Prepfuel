class _G_Bus {
	constructor(flag){
		const _ = this;
		_.components = {};
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
			_.components[componentName]['events'] = {};
		}
		if(!_.components[componentName]['events'][eventName]){
			_.components[componentName]['events'][eventName] = new Map();
		}
		_.components[componentName]['events'] = _.components[componentName]['events'] || new Map();
		if(!_.components[componentName]['events'][eventName].has(prop)) {
			_.components[componentName]['events'][eventName].set(prop, fn);
			return _;
		}
		if(_.flag === 'dev'){
			console.warn(`Подписка на событие ${eventName} на ф-ю: ${fn.name}`);
		}
		return _;
	}
	trigger(componentName,eventName,data){
		const _ = this;
		componentName = componentName.toLowerCase();
		return new Promise(function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Компонент ${componentName}: Запуск события ${eventName} с данными: "${data}" `);
			}
			try{

				if (_.components[componentName]['events'][eventName]) {
					_.components[componentName]['events'][eventName].forEach( async function(fn) {
						resolve(await fn(data));
					});
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['component'] = componentName;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!Обращение к событию, которое не определено ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(component,eventName,prop){
		const _ = this;
		if (_.components[componentName].events[eventName]) {
			_.components[componentName].events[eventName].delete(prop);
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