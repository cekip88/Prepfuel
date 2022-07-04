import {env} from "/env.js";
import {G_Bus} from "../../../../libs/G_Control.js";
class _Model {
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.usersRole = 'student'
		_.endpoints = {
			usersList: `${env.backendUrl}/admin`,
			createStudent: `${env.backendUrl}/user/create-student`,
			createParent: `${env.backendUrl}/admin/create-parent`,
			addingStepOne: `${env.backendUrl}/user/add-student-step1`,
			addingStepTwo: `${env.backendUrl}/user/add-student-step2`,
			addingStepThree: `${env.backendUrl}/user/add-student-step3`,
			addingStepFour: `${env.backendUrl}/user/add-student-step4`,
			assignCourse: `${env.backendUrl}/user/assign-plan`,
		};
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
	getUsers({role,page = 1,update}) {
		const _ = this;
		if(!update)	if(_[`${role}sData`]) return Promise.resolve(_[`${role}sData`]);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['usersList']}/?role=${role}&page=${page}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_[`${role}sData`] = response;
					resolve(response);
				} else {
					_.wrongResponse('getUsers', response);
				}
			} else {
				_.wrongRequest('getUsers', rawResponse)
			}
			resolve(null);
		});
	}
	assignCourse(assignData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['assignCourse']}`, {
				method: 'POST',
				headers: _.baseHeaders,
				body: JSON.stringify(assignData)
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
	createParent(studentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['createParent']}`, {
				method: 'POST',
				headers: _.baseHeaders,
				body: JSON.stringify(studentData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.newParent = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('createParent', response);
				}
			} else {
				_.wrongRequest('createParent', rawResponse)
			}
			resolve(null);
		});
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
					_.wrongResponse('createStudent', response);
				}
			} else {
				_.wrongRequest('createStudent', rawResponse)
			}
			resolve(null);
		});
	}
	
	addingStepOneData(){
		const _ = this;
		if(_.step1) return Promise.resolve(_.step1);
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
					_.wrongResponse('addingStepOneData', response);
				}
			} else {
				_.wrongRequest('addingStepOneData', rawResponse)
			}
			resolve(null);
		});
	}
	addingStepTwoData(){
		const _ = this;
		if(_.step2) return Promise.resolve(_.step2);
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
					_.wrongResponse('addingStepTwoData', response);
				}
			} else {
				_.wrongRequest('addingStepTwoData', rawResponse)
			}
			resolve(null);
		});
	}
	addingStepThreeData(){
		const _ = this;
		if(_.step3) return Promise.resolve(_.step3);
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
					_.wrongResponse('addingStepThreeData', response);
				}
			} else {
				_.wrongRequest('addingStepThreeData', rawResponse)
			}
			resolve(null);
		});
	}
	addingStepFourData(){
		const _ = this;
		if(_.step4) return Promise.resolve(_.step4);
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
					_.wrongResponse('addingStepFourData', response);
				}
			} else {
				_.wrongRequest('addingStepFourData', rawResponse)
			}
			resolve(null);
		});
	}

}
export const Model = new _Model();