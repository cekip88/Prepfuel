import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			schedule: `${env.backendUrl}/student/schedule`,
		};
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
}

export const Model = new _Model();