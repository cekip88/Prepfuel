import {env} from "/env.js";

export class _Model {
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			wizardData: `${env.backendUrl}/user/wizard-data`,
			me: `${env.backendUrl}/user/me`,
			photo: `${env.backendUrl}/user/upload-image`,
			updateParent: `${env.backendUrl}/user/parent`,
			updatePhone: `${env.backendUrl}/user/parent/phone`,
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
					_.wizardData = response['response'];navigate
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

	getContentLength(formData) {
		const formDataEntries = [...formData.entries()]

		const contentLength = formDataEntries.reduce((acc, [key, value]) => {
			if (typeof value === 'string') return acc + value.length
			if (typeof value === 'object') return acc + value.size

			return acc
		}, 0)

		return contentLength
	}
	uploadPhoto(uploadData){
		const _ = this;
		let contentLength = _.getContentLength(uploadData);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['photo']}`, {
				method: 'POST',
				body: uploadData
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('assignCourse', response);
				}
			} else {
				_.wrongRequest('assignCourse', rawResponse)
			}
			resolve(null);
		});
	}
	updateParent(parentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['updateParent']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(parentData)
			});
			let response = await rawResponse.json();
			resolve(response['response']);
		});
	}
	updatePhone(updateData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['updatePhone']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(updateData)
			});
			let response = await rawResponse.json();
			resolve(response);
		});
	}
}

export const Model = new _Model();