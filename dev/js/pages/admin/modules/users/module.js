import {G_Bus} from "../../../../libs/G_Control.js";
import {Model} from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class UsersModule extends AdminPage {
	constructor() {
		super();
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'usersBodyTabs',
			'body':'usersBody'
		}
	}
	define() {
		const _ = this;
		_.componentName = 'UsersModule';
		G_Bus
			.on(_,['addStudent'])
	}
	addStudent({item}){
		const _ = this;
		console.log(item);
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#addingForm'});
	}
	
	
	init() {
		const _ = this;
	}
	
}