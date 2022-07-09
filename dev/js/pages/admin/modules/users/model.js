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
			updateStudent: `${env.backendUrl}/user/update-student`,
			removeStudent: `${env.backendUrl}/user/delete-student`,
			createParent: `${env.backendUrl}/admin/create-parent`,
			removeParent: `${env.backendUrl}/admin/parents`,
			assignCourse: `${env.backendUrl}/user/assign-plan`,
			removeCourse: `${env.backendUrl}/user/remove-plan`,
			wizardData: `${env.backendUrl}/user/wizard-data`,
			tests: `${env.backendUrl}/tests`,
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
	getWizardData(){
		const _ = this;
		if(_.wizardData) return Promise.resolve(_.wizardData);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['wizardData']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.wizardData = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('getWizardData', response);
				}
			} else {
				_.wrongRequest('getWizardData', rawResponse)
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
	updateStudent(studentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['updateStudent']}/${studentData['studentId']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(studentData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('updateStudent', response);
				}
			} else {
				_.wrongRequest('updateStudent', rawResponse)
			}
			resolve(null);
		});
	}
	

	removeCourse(removeData){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['removeCourse']}`, {
				method: 'DELETE',
				headers: _.baseHeaders,
				body: JSON.stringify(removeData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('removeCourse', response);
				}
			} else {
				_.wrongRequest('removeCourse', rawResponse)
			}
			resolve(null);
		});
	}
	removeStudent(studentId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['removeStudent']}/${studentId}`, {
				method: 'DELETE',
				headers: _.baseHeaders
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				console.log(response);
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('removeStudent', response);
				}
			} else {
				_.wrongRequest('removeStudent', rawResponse)
			}
			resolve(null);
		});
	}
	removeParent(parentId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['removeParent']}/${parentId}`, {
				method: 'DELETE',
				headers: _.baseHeaders
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				console.log(response);
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('removeParent', response);
				}
			} else {
				_.wrongRequest('removeParent', rawResponse)
			}
			resolve(null);
		});
	}
	
	
	getAdminNotifications(){
		return [{
			title: 'Welcome email',
			subtitle: 'Admin or parent added student to a platform'
		},{
			title: 'Create a practice schedule reminder email',
			subtitle: 'Student should create a practice schedule to start skill practice'
		},{
			title: 'Daily study reminders for students',
			subtitle: 'Remind student about scheduled skill practice'
		},{
			title: 'Weekly study reminders for students',
			subtitle: 'Remind student about scheduled skills practices'
		},{
			title: 'Monthly study reminders for students',
			subtitle: 'Remind student about scheduled skills practices'
		},{
			title: 'Practice test reminder ',
			subtitle: 'Remind about the practice test a day before the start'
		},{
			title: 'Session activity emails',
			subtitle: 'Activity summary each time student logs in and completes work'
		},{
			title: 'Weekly progress emails',
			subtitle: 'Weekly updates to gauge perfomance and progress'
		},{
			title: 'Promotional discounts',
			subtitle: 'Promotional discounts & new courses oferings'
		}
		]
	}
	getTests(){
		const _ = this;
		if(_.tests) return Promise.resolve(_.tests);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['tests']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.tests = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('getTests', response);
				}
			} else {
				_.wrongRequest('getTests', rawResponse)
			}
			resolve(null);
		});
	}
	
}
export const Model = new _Model();