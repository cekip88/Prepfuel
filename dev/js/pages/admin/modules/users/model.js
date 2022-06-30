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
			usersList: `${env.backendUrl}/admin`,
			createStudent: `${env.backendUrl}/user/create-student`,
			addingStepOne: `${env.backendUrl}/user/add-student-step1`,
			addingStepTwo: `${env.backendUrl}/user/add-student-step2`,
			addingStepThree: `${env.backendUrl}/user/add-student-step3`,
			addingStepFour: `${env.backendUrl}/user/add-student-step4`,
		};
	}
	
	getUsers(role,page=1) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['usersList']}/?role=${role}&page=${page}`, {
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
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'getUsers',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}
	getParents() {
		const _ = this;
		return _.getUsers('parent');
	}
	
	createStudent(studentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['createStudent']}`, {
				method: 'POST',
				headers: _.baseHeaders,
				body: JSON.stringify(studentData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.newStudent = response['response'];
					resolve(response['response']);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'createStudent',
						'type': 'wrongResponse',
						'data': response
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'createStudent',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}
	
	addingStepOneData() {
		const _ = this;
		if(_.step1) Promise.resolve(_.step1);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['addingStepOne']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.step1 = response['response'];
					resolve(response['response']);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'addingStepOne',
						'type': 'wrongResponse',
						'data': response
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'addingStepOne',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}
	addingStepTwoData() {
		const _ = this;
		if(_.step2) Promise.resolve(_.step2);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['addingStepTwo']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.step2 = response['response'];
					resolve(response['response']);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'addingStepTwo',
						'type': 'wrongResponse',
						'data': response
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'addingStepTwo',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}
	addingStepThreeData() {
		const _ = this;
		if(_.step3) Promise.resolve(_.step3);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['addingStepThree']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.step3 = response['response'];
					resolve(response['response']);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'addingStepThree',
						'type': 'wrongResponse',
						'data': response
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'addingStepThree',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}
	addingStepFourData() {
		const _ = this;
		if(_.step4) Promise.resolve(_.step4);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['addingStepFour']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.step4 = response['response'];
					resolve(response['response']);
				} else {
					G_Bus.trigger('UsersModule', 'handleErrors', {
						'method': 'addingStepFour',
						'type': 'wrongResponse',
						'data': response
					});
					resolve(null);
				}
			} else {
				G_Bus.trigger('UsersModule', 'handleErrors', {
					'method': 'addingStepFour',
					'type': 'wrongRequest',
					'data': rawResponse
				});
				resolve(null);
			}
		});
	}

}
const Model = new _Model();
export default Model;