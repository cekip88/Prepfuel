import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {ParentPage} from "../../parent.page.js";

export class ProfileModule extends ParentPage {
	constructor() {
		super();
		const _ = this;
		_.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'',
			'body':'profileTpl',
			'footer':'profileFooter'
		}
	}
	define() {
		const _ = this;
		_.me = JSON.parse(localStorage.getItem('me'));
		_.componentName = 'Profile';
		_.section = 'Profile';
		_.backUrl = `https://live-prepfuelbackend-mydevcube.apps.devinci.co`;

		_.parentInfo = {
			firstName: _.me.firstName,
			lastName: _.me.lastName,
			email: _.me.email,
			phone: _.me.parent.phone,
			photo: _.me.photo,
		};
		document.title = 'Prepfuel - Profile';

		G_Bus.on(_,[
			'domReady','fillParentInfo','updateParent','uploadPhoto',
			'showEditPopup','updatePhone','addPhone',
		]);
	}
	domReady(){
		const _ = this;

	}
	fillParentInfo({item}){
		const _ = this;
		let
			prop = item.getAttribute('name'),
			value = item.value;
		if( typeof value == 'object'){
			value = value+'';
		}
		_.parentInfo[prop] = value;
	}

	updateMe(){
		const _ = this;
		_.me['parent']['students'].find((student,index)=>{
			if (student['_id'] == _.currentStudent['_id']) {
				_.me['parent']['students'][index] = _.currentStudent
			}
		})
		localStorage.setItem('me',JSON.stringify(_.me));
	}

	async uploadPhoto({item}){
		const _ = this;
		let
			cont = item.parentElement,
			role = item.getAttribute('role'),
			file = item.files[0],
			validate = true,
			img = cont.querySelector('IMG');

		if (!file) {
			cont.querySelector('.profile-img-letter').removeAttribute('style');
			_[`${role}Info`].uploadData = null;
			if (img) img.remove();
			return;
		}
		let formats = ['gif','png','jpg','jpeg'];
		if (file.size > 3100000) validate = false;
		let
			fileName = file.name,
			splitArray = fileName.split('.'),
			extension = splitArray[splitArray.length - 1],
			title = fileName.substr(0,fileName.length - extension.length - 1);
		if (formats.indexOf(extension) < 0) validate = false;
		if (!validate) {
			cont.querySelector('.profile-img-desc').style = 'color: red;';
			return;
		} else cont.querySelector('.profile-img-desc').removeAttribute('style');
		if (file) {
			if (!img) {
				img = document.createElement('IMG');
				img.className = 'user-photo';
				cont.querySelector('.profile-img').prepend(img);
				cont.querySelector('.profile-img-letter').setAttribute('style','display:none;');
			}
			_[`parentInfo`].uploadData = new FormData();
			_[`parentInfo`].uploadData.append('img',file,title + '.'  + extension);
			img.setAttribute('src',`${URL.createObjectURL(file)}`);
		}
	}
	async updateParent({item}){
		const _ = this;
		let updateData = {
			'firstName': _.parentInfo['firstName'],
			"lastName": _.parentInfo['lastName'],
			"email": _.parentInfo['email'],
		};

		let form = item.closest('.parent');
		let
			password = form.querySelector('[name="password"]').value,
			repeatPassword = form.querySelector('[name="repeatPassword"]').value;
		if (password && (password == repeatPassword)) {
			updateData.password = password;
			updateData.repeatPassword = repeatPassword;
		}

		if (_.parentInfo.uploadData) {
			updateData.photo = await Model.uploadPhoto(_.parentInfo.uploadData);
		}

		let response = await Model.updateParent(updateData);
		if(!response) return void 0;

		for (let key in updateData) {
			_.me[key] = response.user[key];
			_.me.parent.user[key] = response.user[key];
			_.parentInfo[key] = response.user[key];
		}
		localStorage.setItem('me',JSON.stringify(_.me));

		item.setAttribute('section','/parent/dashboard');
		G_Bus.trigger('header','rerender');
		G_Bus.trigger('ParentPage','changeSection',{item});
		_.showSuccessPopup('Parent profile updated')
	}
	showEditPopup(){
		const _ = this;
		G_Bus.trigger('modaler','showModal', {type:'html',target:'#editPhone'});
		setTimeout(function (){document.querySelector('#editPhoneInput').value = _.parentInfo.phone;})
	}
	async updatePhone({item}){
		const _ = this;
		let
			form = item.closest('#editPhone'),
			phoneBlock = _.f('.parent-checkbox-phone');

		let formData = await _.gFormDataCapture(form);
		let resp = await Model.updatePhone(formData);
		if (resp.status == 'success') {
			if (resp.response.phone) {
				phoneBlock.classList.add('active');
				phoneBlock.querySelector('span').textContent = resp.response.phone;
			} else {
				phoneBlock.classList.remove('active');
				phoneBlock.closest('.parent-checkbox').querySelector('input').checked = false;
			}
			_.parentInfo.phone = resp.response.phone;
			_.me.parent.phone = _.parentInfo.phone;
			localStorage.setItem('me',JSON.stringify(_.me));
		}
	}
	addPhone({item}){
		const _ = this;
		let phoneBlock = _.f('.parent-checkbox-phone');
		if (item.checked) {
			if (!_.parentInfo.phone) _.showEditPopup();
			else {
				phoneBlock.querySelector('span').textContent = _.parentInfo.phone;
				phoneBlock.classList.add('active');
			}
		} else {
			phoneBlock.classList.remove('active');
		}
		console.log(_.parentInfo)
	}
	
	init() {
		const _ = this;
	}
}