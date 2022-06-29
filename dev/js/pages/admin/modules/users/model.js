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
	}
	
	getUsers(role) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['usersList']}/?role=${role}`, {
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
const Model = new _Model();
export default Model;