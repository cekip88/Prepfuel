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
		if(!fn){
			if(eventName instanceof Array){
				for(let event of eventName){
					fn = component[event].bind(component);
				}
			}else{
				fn = component[eventName].bind(component);
			}
		}
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
		}
		
		let handle = (eventName,type,fn) =>{
			if(!fn)	fn = component[eventName].bind(component);
			prop  = fn.name;
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
		}
		if(eventName instanceof Array){
			for(let event of eventName){
				handle(event,'arr')
			}
		}else{
			handle(eventName,'',fn)
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
				let stackLines = e.stack.split('\n'),
				error= stackLines[0].trim(),
				handle = stackLines[1].trim();
				let styles= `
						background: #1c1c1c 16px center no-repeat url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDMTQuNDEgMiAxOCA1LjU5IDE4IDEwQzE4IDE0LjQxIDE0LjQxIDE4IDEwIDE4QzUuNTkgMTggMiAxNC40MSAyIDEwQzIgNS41OSA1LjU5IDIgMTAgMlpNMTAgMEM0LjQ4IDAgMCA0LjQ4IDAgMTBDMCAxNS41MiA0LjQ4IDIwIDEwIDIwQzE1LjUyIDIwIDIwIDE1LjUyIDIwIDEwQzIwIDQuNDggMTUuNTIgMCAxMCAwWiIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPHBhdGggZD0iTTkgMTFMOSA1QzkgNC40NSA5LjQ1IDQgMTAgNEMxMC41NSA0IDExIDQuNDUgMTEgNUwxMSAxMUMxMSAxMS41NSAxMC41NSAxMiAxMCAxMkM5LjQ1IDEyIDkgMTEuNTUgOSAxMVoiIGZpbGw9IiNGRjQ2NjciIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiByeD0iMSIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPC9zdmc+Cg==");
						background-size:20px;
						padding: 10px 10px 10px 50px;
						display: flex;
						border-left:2px solid #FF6F6F;color:rgba(255, 255, 255, 0.6);
					`;
			//	if(e.name == 'TypeError'){
					
					
					console.log(`%c%s`,styles,`Error in ${componentName}:${eventName}\n${error}\n${handle}`);
			//	}
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
//window['G_Bus'] = G_Bus;