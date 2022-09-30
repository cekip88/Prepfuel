import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			schedule: `${env.backendUrl}/student/schedule`,
			dashSchedule: `${env.backendUrl}/student/schedule/dashboard`,
			wizardData: `${env.backendUrl}/user/wizard-data`,
			me: `${env.backendUrl}/user/me`
		};
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

	getSchedule(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['schedule']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			let response = await rawResponse.json();
			resolve(response['response']);
		});
	}
	getDashSchedule(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['dashSchedule']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			let response = await rawResponse.json();
			resolve(response['response']);
		});
	}
	deleteSchedule(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['schedule']}`,{
				method: 'DELETE',
				headers:_.baseHeaders
			});
			if(rawResponse.status <= 210){
				let response = await rawResponse.json();
				resolve(response);
			}else{
				resolve(null);
			}
		});
	}

	getWizardData(){
		const _ = this;
		if(_.wizardData) return Promise.resolve(_.wizardData);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['wizardData']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				console.log(response)
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
}

export const Model = new _Model();