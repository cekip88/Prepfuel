import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			schedule: `${env.backendUrl}/parent/schedule/`,
			dashSchedule: `${env.backendUrl}/student/schedule/dashboard`,
			me: `${env.backendUrl}/user/me`,
			wizardData: `/user/wizard-data`,
			checkEmail: `/user/check-email/`,
			createStudent: `/user/create-student`,
		};
	}
	getEndpoint(endpoint) {
		const _ = this;
		return `${env.backendUrl}${_.endpoints[endpoint]}`;
	}
	getMe(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['me']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				resolve(response['response']);
			}
		});
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
					_.newStudent = response['response'];
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

	getSchedule(id){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['schedule']}${id}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				resolve(response['response']);
			}
		});
	}
	getDashSchedule(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['dashSchedule']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status <= 210){
				let response = await rawResponse.json();
				resolve(response['response']);
			}else{
				resolve(null);
			}
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

}

export const Model = new _Model();