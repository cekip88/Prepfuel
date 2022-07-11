import {env} from "/env.js";
import {G_Bus} from "../../../../libs/G_Control.js";
class _Model {
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			tests: `${env.backendUrl}/tests`,
			csv: `${env.backendUrl}/admin/upload`,
		};
	}
	getTests(){
		const _ = this;
		if(_.tests) return Promise.resolve(_.tests);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['tests']}`, {
				method: 'GET',
				headers: _.baseHeaders
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.tests = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('getTests', response);
				}
			} else {
				_.wrongRequest('getTests', rawResponse)
			}
			resolve(null);
		});
	}
	wrongResponse(method, response){
		const _ = this;
		G_Bus.trigger('UsersModule', 'handleErrors', {
			'method': method,
			'type': 'wrongResponse',
			'data': response
		});
	}
	wrongRequest(method, request){
		const _ = this;
		G_Bus.trigger('UsersModule', 'handleErrors', {
			'method': method,
			'type': 'wrongRequest',
			'data': request
		});
	}


	uploadCSV(uploadData){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(_.endpoints['csv'], {
				method: 'POST',
				headers: {"Content-Type": "multipart/form-data;charset=utf-8; boundary='sdasdczdas'"},
				//headers: _.baseHeaders,
				//body: JSON.stringify(uploadData)
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
}
export const Model = new _Model();