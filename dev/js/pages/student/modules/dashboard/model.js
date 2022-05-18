import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			shedules: `${env.backendUrl}/student/schedules`,
			shedule: `${env.backendUrl}/student/schedule`,
		};
	}
	getSchedules(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['shedules']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
				resolve(response['response']);
			}
		});
	}
	getSchedule(id){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['shedule']}/${id}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
				resolve(response);
			}
		});
	}
}

export const Model = new _Model();