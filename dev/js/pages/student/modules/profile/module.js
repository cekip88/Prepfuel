import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class ProfileModule extends StudentPage {
	constructor() {
		super();
		const _ = this;
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'',
			'body':'profileTpl',
			'footer':''
		}
	}
	async asyncDefine(){
		const _ = this;
		//_.wizardData = Model.getWizardData();
	}
	define() {
		const _ = this;
		_.me = JSON.parse(localStorage.getItem('me'));
		_.backUrl = `https://live-prepfuelbackend-mydevcube.apps.devinci.co`;

		_.componentName = 'Profile';
		_.section = 'Profile';
		G_Bus.on(_,[
			'domReady',
		]);
	}
	domReady(){
		const _ = this;
		_.fillProfile();
	}

	find(target,array){
		const _ = this;
		let result = array.find(function (item){
			if (item._id == target) return item
		});
		return result;
	}

	async fillProfile(){
		const _ = this;
		_.wizardData = await Model.getWizardData();
		console.log(_.wizardData)
		let avatarSrc = _.find(_.me['avatar'],_.wizardData.avatars);
		let avatarImg = _.f(`#avatar`);
		avatarImg.setAttribute('src',`/img/${avatarSrc.avatar}.svg`);


		let schools = _.f('.school');
		if (schools.length) {
			schools.forEach(function (item){
				item.textContent = _.find(item.getAttribute('data-id'),_.wizardData.schools).school
			})
		}
	}
	
	init() {
		const _ = this;
	}
}