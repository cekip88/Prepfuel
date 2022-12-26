import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			createStudent: `/user/create-student`,
			wizardData: `/user/wizard-data`,
			getSchools: `/user/current-schools`,
			checkEmail: `/auth/check-email/`,
		};
	}
	getEndpoint(endpoint) {
		const _ = this;
		return `${env.backendUrl}${_.endpoints[endpoint]}`;
	}

	createStudent(studentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('createStudent')}`, {
				method: 'POST',
				headers: _.baseHeaders,
				body: JSON.stringify(studentData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response);
				} else {
					_.wrongResponse('createStudent', response);
				}
			} else {
				_.wrongRequest('createStudent', rawResponse)
			}
			resolve(null);
		});
	}

	getCardsInfo(){
		return [
			{name:'Marvin Simmons',type:'visa',number:'8888-8888-8888-1679',date:'09/24',primary: true},
			{name:'Marvin Simmons',type:'mastercard',number:'8888-8888-8888-2704',date:'02/26',primary: false},
		]
	}
	getBillingAddressInfo(){
		return [
			{title:'Address 1',line1:'Ap #285-7193',line2:'Ullamcorper Avenue',state:'Amesbury HI',postcode:' 93373',country:'United States',primary: true},
			{title:'Address 2',line1:'Ap #285-7193',line2:'Ullamcorper Avenue',state:'Amesbury HI',postcode:' 93373',country:'United States',primary: false},
		]
	}
	getSchools(searchData){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('getSchools')}/?page=${searchData.page}${searchData.search ? '&search=' + searchData.search : ''}`, {
				method: 'GET',
				headers: _.baseHeaders,
				//body: JSON.stringify(searchData)
			});
			let response = await rawResponse.json();
			resolve(response['response']);
		});
	}
	getWizardData(){
		const _ = this;
		if(_.wizardData) return Promise.resolve(_.wizardData);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('wizardData')}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.wizardData = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('getWizardData', response);
				}
			} else {
				_.wrongRequest('getWizardData', rawResponse)
			}
			resolve(null);
		});
	}

	checkEmail(email){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('checkEmail')}${email}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					resolve(response['response']);
				}
			} else {
				resolve(null);
			}
			resolve(null);
		});
	}
}

export const Model = new _Model();