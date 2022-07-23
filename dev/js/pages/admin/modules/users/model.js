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
			usersList: `/admin`,
			createStudent: `/user/create-student`,
			updateStudent: `/user/update-student`,
			removeStudent: `/user/delete-student`,
			removeAdmin: `/admin/admins`,
			createParent: `/admin/create-parent`,
			removeParent: `/admin/parents`,
			assignCourse: `/user/assign-plan`,
			removeCourse: `/user/remove-plan`,
			wizardData: `/user/wizard-data`,
			updateAdmin: `/admin/admins`,
			updateParent: `/admin/parents`,
			studentParents: `/admin/student`,
			parentStudents: `/admin/parent`,
			assignStudentToParent: `/admin/assign/student-to-parent`,
			changePassword: `/user/update-student-password/`,
			checkEmail: `/user/check-email/`,
		};
	}
	
	assignStudentToParent(parentId,studentId) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('assignStudentToParent')}`, {
				method: 'POST',
				headers: _.baseHeaders,
				body: JSON.stringify({
					sid: studentId,
					pid: parentId
				})
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
	getParentStudents(parentId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('parentStudents')}/${parentId}/students`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					console.log(response);
					resolve(response['response']);
				} else {
					_.wrongResponse('getParentStudents', response);
				}
			} else {
				_.wrongRequest('getParentStudents', rawResponse)
			}
			resolve(null);
		});
	}
	getStudentParents(studentId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('studentParents')}/${studentId}/parents`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					console.log(response);
					resolve(response);
				} else {
					_.wrongResponse('getStudentParents', response);
				}
			} else {
				_.wrongRequest('getStudentParents', rawResponse)
			}
			resolve(null);
		});
	}
	getEndpoint(endpoint) {
		const _ = this;
		return `${env.backendUrl}${_.endpoints[endpoint]}`;
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
	getUsers({role,page = 1,update,search=''}) {
		const _ = this;
		if(!update)	if(_[`${role}sData`]) return Promise.resolve(_[`${role}sData`]);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('usersList')}/?role=${role}&page=${page}&search=${search}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				console.log(rawResponse,`${_.getEndpoint('usersList')}/?role=${role}&page=${page}&search=${search}`)
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
			let rawResponse = await fetch(`${_.getEndpoint('assignCourse')}`, {
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
			let rawResponse = await fetch(`${_.getEndpoint('wizardData')}`, {
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
			let rawResponse = await fetch(`${_.getEndpoint('createParent')}`, {
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
			let rawResponse = await fetch(`${_.getEndpoint('createStudent')}`, {
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
			let rawResponse = await fetch(`${_.getEndpoint('updateStudent')}/${studentData['studentId']}`, {
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
			let rawResponse = await fetch(`${_.getEndpoint('removeCourse')}`, {
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
		console.log(studentId)
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('removeStudent')}/${studentId}`, {
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
	removeAdmin(adminId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('removeAdmin')}/${adminId}`, {
				method: 'DELETE',
				headers: _.baseHeaders
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('removeAdmin', response);
				}
			} else {
				_.wrongRequest('removeAdmin', rawResponse)
			}
			resolve(null);
		});
	}
	removeParent(parentId){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('removeParent')}/${parentId}`, {
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
		}]
	}
	getParentNotificationsSections(){
		return [
			{title:'General',value:'general',types: ['System','Email','SMS']},
			{title:'Student General',value:'student_general',types: ['System','Email','SMS']},
			{title:'Student Practice',value:'student_practice',types: ['System','Email','SMS']},
			{title:'Billing & Membership',value:'billing_and_membership',types: ['System','Email','SMS']},
		]
	}
	getParentNotifications(subsection){
		let notifications = {
			general: [
				{
					title: 'Registered on a platform',
					subtitle: 'User registered on the platform'
				},{
					title: 'Added on a platform',
					subtitle: 'User added on the platform by admin'
				},{
					title: 'Password Changed',
					subtitle: 'User added on the platform by admin'
				},{
					title: 'Password Changed',
					subtitle: 'User changed the password'
				},{
					title: 'Personal Info Edited',
					subtitle: 'User or Admin edited personal info'
				},{
					title: 'Promotional discounts',
					subtitle: 'Promotional discounts & new courses oferings'
				},
			],
			student_general: [
				{
					title: 'Student Added',
					subtitle: 'User or admin added a student'
				},{
					title: 'Student Removed',
					subtitle: 'User or admin removed a student'
				},{
					title: 'Student Forget Password',
					subtitle: 'Student forget password and asking to reset'
				},{
					title: 'Student Password Changed',
					subtitle: 'User or admin changed student password'
				},{
					title: 'Student Personal Info Edited',
					subtitle: 'User or admin edited student personal info'
				},
			],
			student_practice: [
				{
					title: 'Student Created Practice Schedule',
					subtitle: 'User changed the password'
				},{
					title: 'Student Completed Diagnostic Quiz',
					subtitle: 'User changed the password'
				},{
					title: 'Student Completed Skill Practice',
					subtitle: 'User changed the password'
				},{
					title: 'Student Completed Practice Test',
					subtitle: 'User changed the password'
				},{
					title: 'Student Gets Badge',
					subtitle: 'User changed the password'
				},{
					title: 'Student Submitted Essay',
					subtitle: 'User changed the password'
				},{
					title: 'Practice test reminder ',
					subtitle: 'User changed the password'
				},{
					title: 'Daily study reminders',
					subtitle: "Remind about students' scheduled skill practice"
				},{
					title: 'Weekly study reminders',
					subtitle: "Remind about students' scheduled skill practice"
				},{
					title: 'Monthly study reminders',
					subtitle: "Remind about students' scheduled skill practice"
				},{
					title: 'Session activity emails',
					subtitle: "Activity summary each time student logs in and completes work"
				},{
					title: 'Weekly progress emails',
					subtitle: "Weekly updates to gauge perfomance and progress"
				}
			],
			billing_and_membership: [
				{
					title: 'Membership Payed',
					subtitle: "User gets invoice"
				},{
					title: 'Membership Plan Edited',
					subtitle: "Membership plan edited by user or admin"
				},{
					title: 'Membership Canceled',
					subtitle: "Membership plan canceled by user or admin"
				},{
					title: 'Membership Stopped',
					subtitle: "Due to non-payment"
				},{
					title: 'New card added',
					subtitle: "User or admin added new card for payment"
				},{
					title: 'card Info Edited',
					subtitle: "User or admin edited card info"
				},{
					title: 'card Deleted',
					subtitle: "User or admin deleted a card"
				},{
					title: 'card Expired',
					subtitle: "The expiration date determined by the credit card provider passed"
				},{
					title: 'New Billing address added',
					subtitle: "User or admin added new billing address"
				},{
					title: 'Billing address edited',
					subtitle: "User or admin edited billing address"
				},{
					title: 'Billing address deleted',
					subtitle: "User or admin deleted billing address"
				},
			]
		}
		return notifications[subsection];
	}

	getCardsInfo(){
		return [
			{name:'Marvin Simmons',type:'visa',number:'8888-8888-8888-1679',date:'09/24',primary: true},
			{name:'Marvin Simmons',type:'mastercard',number:'8888-8888-8888-2704',date:'02/26',primary: false},
		]
	}
	getBillingAddressInfo(){
		return [
			{title:'Address 1',line1:'Ap #285-7193',line2:'Ullamcorper Avenue',state:'Amesbury HI',postcode:' 93373',country:'United States',primary: true},
			{title:'Address 2',line1:'Ap #285-7193',line2:'Ullamcorper Avenue',state:'Amesbury HI',postcode:' 93373',country:'United States',primary: false},
		]
	}

	updateAdmin(adminData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('updateAdmin')}/${adminData['_id']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(adminData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('updateAdmin', response);
				}
			} else {
				_.wrongRequest('updateAdmin', rawResponse)
			}
			resolve(null);
		});
	}
	updateParent(parentData) {
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('updateParent')}/${parentData['_id']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(parentData)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('updateParent', response);
				}
			} else {
				_.wrongRequest('updateParent', rawResponse)
			}
			resolve(null);
		});
	}
	updateStudentPassword(passwordData){
		const _ = this;
		let data = {
			password: passwordData.password,
			repeatPassword: passwordData['confirm_password'],
		};
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('changePassword')}/${passwordData['studentId']}`, {
				method: 'PUT',
				headers: _.baseHeaders,
				body: JSON.stringify(data)
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('updateStudentPassword', response);
				}
			} else {
				_.wrongRequest('updateStudentPassword', rawResponse)
			}
			resolve(null);
		});
	}

	checkEmail(email){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.getEndpoint('checkEmail')}${email}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('checkEmail', response);
				}
			} else {
				_.wrongRequest('checkEmail', rawResponse)
			}
			resolve(null);
		});
	}
}
export const Model = new _Model();