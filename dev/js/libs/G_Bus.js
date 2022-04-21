/*class _G_Bus {
	constructor(flag){
		const _ = this;
		_.flag =  flag;
		_.events = {};

		_.stream = [];

	}
	on(eventName,fn){
		const _ = this;
		if (!_.events[eventName]) {
			this.events[eventName] = []
		}
		this.events[eventName].push(fn)
		if(_.flag === 'dev'){
			console.warn(`Referring to an event: ${eventName}.Handler: ${fn.name}`);
		}
		return _;
	}
	trigger(eventName,data){
		const _ = this;
		return new Promise(function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Trigger event: ${eventName} with data: "${data}" `);
			}
			try{
				if (_.events[eventName]) {
					_.events[eventName].forEach( async (fn) => resolve(await fn(data)))
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!РћР±СЂР°С‰РµРЅРёРµ Рє СЃРѕР±С‹С‚РёСЋ, РєРѕС‚РѕСЂРѕРµ РЅРµ РѕРїСЂРµРґРµР»РµРЅРѕ ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(eventName,prop){
		const _ = this;
		if (_.events[eventName]) {
			delete _.events[eventName];
		}
	}
	clear(){
		const _ = this;
		for(let prop in _.events) {
			if (prop === 'includeModule' || prop === 'showMenu') continue;
			delete _.events[prop];
		}
	}

	addStream(stream){
		const _ = this;
		if( _.stream.length ) {
			for(let s of _.stream){
				s.removeEvents();
			}
		}
		_.stream.push(stream);
	}
}
export const G_Bus = new _G_Bus('prod');*/


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