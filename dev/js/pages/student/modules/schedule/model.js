import { env }   from "/env.js";
export class _Model{
	constructor(){
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			finish: `${env.backendUrl}/student/add-schedule`,
		};
	}
	finishSchedule(scheduleData){
		const _ = this;
		//practiceDates
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['finish']}`,{
				method: 'POST',
				headers:_.baseHeaders,
				body: JSON.stringify(scheduleData)
			});
			console.log(rawResponse);
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
			}
		});
	}
}

export const Model = new _Model();