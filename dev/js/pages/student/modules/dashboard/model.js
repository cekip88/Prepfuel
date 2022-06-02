import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			schedule: `${env.backendUrl}/student/schedule`,
			dashSchedule: `${env.backendUrl}/student/schedule/dashboard`
		};
	}
	getSchedule(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['schedule']}`,{
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
				resolve({});
			}
		});
	}
}

export const Model = new _Model();