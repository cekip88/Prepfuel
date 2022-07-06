import {G_Bus} from "../../../../libs/G_Control.js";
import {Model}  from "./model.js";
import {AdminPage} from "../../admin.page.js";
export class CoursesModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'coursesBodyTabs',
			'body':'coursesBody',
			'footer':'adminFooter'
		}
	}

	async asyncDefine(){
		const _ = this;

	}
	define() {
		const _ = this;
		_.componentName = 'CoursesModule';


		G_Bus
			.on(_,[
				'domReady',
			]);
	}
	async domReady(data){
		const _ = this;
		console.log(data)
	}


	
	init(){
		const _ = this;
		console.log(Model);
	}
	
}