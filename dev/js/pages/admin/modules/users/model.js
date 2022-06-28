import {env} from "/env.js";
import {G_Bus} from "../../../../libs/G_Control.js";
export class _Model {
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.usersRole = 'student'
		_.endpoints = {
			usersList: `${env.backendUrl}/admin`
		};
		_.fuda = {
			'usersData': _.getUsers
		}
	}
	
	getUsers() {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['usersList']}/?role=${_.usersRole}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.usersData = response;
					resolve(response);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'getUsers',
						'type': 'wrongResponse',
						'data': response
					})
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'getUsers',
					'type': 'wrongRequest',
					'data': rawResponse
				})
			}
		});
	}
}
let validator = {
	get: (target,key) =>{
		if(key in target['fuda']){
			console.log(key);
			if(!target[key]){
				return target.getUsers();
			}else{
				return target[key];
			}
		}
		return target[key];
	},
	set:(t,p,v)=>{
		Reflect.set(t,p,v);
		return true;
	}
}
const Model = new Proxy(new _Model(),validator);
export default Model;