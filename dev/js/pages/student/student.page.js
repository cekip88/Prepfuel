/**
	* @module StudentPage
**/
import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";
import GModaler         from "../../components/modaler/modaler.component.js";
import { env } from "/env.js"

class StudentPage extends G{
	constructor() {
		super();
		this.pageStructure = {
			'header':{
				id:'',
				container: document.createElement('g-header')
			},
			'header-tabs':{
				id:'',
				container: document.createElement('g-header-tabs')
			},
			'body-tabs':{
				id:'',
				container: document.createElement('g-body-tabs')
			},
			'body':{
				id:'',
				container: document.createElement('g-body')
			},
		};
		this.endpoints = {
			'me':`${env.backendUrl}/user/me`,
		};
	}
	define(){
		const _ = this;
		_.componentName = 'StudentPage';
		G_Bus
			.on(_,['changeSection','navigate']);

		G_Bus.on('router','backNext',_.backNext.bind(_));
	}
	
	createdAtFormat(value,format = 'month DD, YYYY'){
		if (!value) return 'No date'
		value = value.split('T')[0].split('-');
		let
		year = value[0],
		month = value[1],
		day = value[2],
		months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		
		let res = format;
		res = res.replace('DD',day)
		res = res.replace('MM',month)
		res = res.replace('YYYY',year)
		res = res.replace('month',months[parseInt(month) - 1]);
		return res;
	}

	backNext({item}){
		const _ = this;
		let click = item.getAttribute('data-click');
		let moduleName = click.split(':')[0];
		if (moduleName !== _.componentName) {
			G_Bus.trigger(moduleName,click.split(':')[1],{item,toHistory: false});
			return;
		}

		_.changeSection({item,toHistory:false});
		_.navigate({item})
	}
	changeSection({item,event,toHistory = true}){
		const _ = this;
		_.triggerAbortController();
		let
			section = item.getAttribute('section'),
			tpl = section.split('/')[2],
			refresh = item.getAttribute('refresh') ?? null;

		if(!refresh && (_.currentSection == section || !section)) return void 0;

		_.currentSection = section;
		if(toHistory) history.pushState(null, null, section);
		_.moduleRender({module:tpl});
		G_Bus.trigger('header','changeTitle',location.pathname);
		return true;
	}
	showForm(id){
		G_Bus.trigger('modaler','showModal',{
			type: 'html',
			target: `#${id}`
		});
	}


	async moduleRender(params){
		const _ = this;
		
		let module = await _.getModule({
			'pageName':'student',
			'name': params['module'],
			'structure':_.pageStructure
		});
		module.headerBlock = _.header;
		return Promise.resolve(module.render());
	}
	fullHeader(){
		return G_Bus.trigger('header','fullHeader');
	}
	async getMe(){
		const _ = this;
		let rawResponse = await fetch(_.endpoints['me'],{
			..._.baseHeaders,
			method: 'GET'
		});
		if(rawResponse.status < 206){
			let
				response = await rawResponse.json(),
				user = response['response'];
			localStorage.setItem('me',JSON.stringify(user));
			localStorage.setItem('student',JSON.stringify(user));
			_.storageSave('authorization','true');
			for(let prop in user){
				_.storageSave(prop,user[prop]);
			}
			localStorage.setItem('courses',JSON.stringify(user['plans']));
			return void 0;
		}
	}
	async init(blockData){
		const _ = this;
		let params;
		if(blockData && blockData['params']){
			params = blockData['params'];
		}
		if(params['redirect']){
			await _.getMe();
		}
		_.header = await _.getBlock({name:'header'},'blocks');
		if(params){
			await _.moduleRender(params);
			_.currentSection = '/student/' + params['module'];
		}
	}
	
}

export { StudentPage }