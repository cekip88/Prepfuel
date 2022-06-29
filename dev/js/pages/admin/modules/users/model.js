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
	getParents() {
		const _ = this;
		_.parentsData = {
			total: 3,
			response: [
				{
					_id:'1',
					firstName: 'Marvin',
					lastName: 'Simmons',
					email: 'exmplm@example.com',
					students: [{avatar:'green-boy.svg'},{avatar:'blue-girl.svg'}],
					createdAt: "2022-03-17T07:58:02.553Z",
				},
				{
					_id:'1',
					firstName: 'Wade',
					lastName: 'Warren',
					email: 'exmplm@example.com',
					students: [],
					createdAt: "2022-03-16T07:58:02.553Z",
				},
				{
					_id:'1',
					firstName: 'Cameron',
					lastName: 'Williamson',
					email: 'exmplm@example.com',
					students: [{avatar:'yellow-boy.svg'},{avatar:'red-afro-girl.svg'}],
					createdAt: "2022-03-15T07:58:02.553Z",
				},
				{
					_id:'1',
					firstName: 'Leslie',
					lastName: 'Alexander',
					email: 'exmplm@example.com',
					students: [{avatar:'blue-orange-boy.svg'},{avatar:'blue-girl.svg'},{avatar: 'red-girl.svg'}],
					createdAt: "2022-03-14T07:58:02.553Z",
				},
				{
					_id:'1',
					firstName: 'Kristin',
					lastName: 'Watson',
					email: 'exmplm@example.com',
					students: [{avatar: 'green-boy.svg'}],
					createdAt: "2022-03-13T07:58:02.553Z",
				},
				{
					_id:'1',
					firstName: 'Bessie',
					lastName: 'Cooper',
					email: 'exmplm@example.com',
					students: [],
					createdAt: "2022-03-12T07:58:02.553Z",
				},
			]
		};
		return _.parentsData
	}

}
const Model = new _Model();
export default Model;