import { env }   from "/env.js";
import {G_Bus} from "../../../../libs/G_Bus.js";
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
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['finish']}`,{
				method: 'POST',
				headers:_.baseHeaders,
				body: JSON.stringify(scheduleData)
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				G_Bus.trigger('router','changePage','/student/dashboard');
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
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				resolve(response['response']);
			}
		});
	}
}

export const Model = new _Model();