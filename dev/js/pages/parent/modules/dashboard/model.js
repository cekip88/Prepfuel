import { env }   from "/env.js";
export class _Model{
	constructor() {
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			schedule: `${env.backendUrl}/parent/schedule/dashboard/`,
			dashSchedule: `${env.backendUrl}/student/schedule/dashboard`,
			me: `${env.backendUrl}/user/me`,
			wizardData: `/user/wizard-data`,
			checkEmail: `/user/check-email/`,
			createStudent: `/user/create-student`,
			updateStudent: `/user/update-student`,
			removeCourse: `/user/remove-plan`,
			assignCourse: `/user/assign-plan`,
		};
	}
	getEndpoint(endpoint) {
		const _ = this;
		return `${env.backendUrl}${_.endpoints[endpoint]}`;
	}
	getMe(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['me']}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				resolve(response['response']);
			}
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
					resolve(response);
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
		console.log(studentData)
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

	getSchedule(id){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['schedule']}${id}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				resolve(response['response']);
			}
		});
	}
	getActivities(id){
		const _ = this;
		return [
			{
				date: '2022-02-19',
				time: '20:16',
				title: 'Completed 1 Revising Editing A questions and earned 0 trophies.'
			},{
				date: '2022-02-19',
				time: '20:16',
				title: 'Completed 1 Revising Editing A questions and earned 0 trophies.'
			},{
				date: '2022-02-19',
				time: '20:16',
				title: 'Completed 1 Revising Editing A questions and earned 0 trophies.'
			},
		]
	}
	getTestScores(id){
		const _ = this;
		return [
			{
				value: 1000,
				title: 'Start Score',
				titleColor: '63,66,84',
				textColor: '181,181,195'
			},{
				value: 1000,
				title: 'Current Score',
				titleColor: '246,155,17'
			},{
				value: 1600,
				title: 'Goal Score',
				titleColor: '71,190,125'
			},{
				value: 600,
				title: 'Points Needed',
				titleColor: '152,101,79'
			},
		]
	}
	getBadges(id){
		const _ = this;
		return [
			{
				value: 15,
				icon: 'graphic-3',
				color: '52,69,229'
			},{
				value: 400,
				icon: 'badge',
				color: '74,181,142'
			},{
				value: 200,
				icon: 'shield',
				color: '255,166,33'
			},{
				value: 10,
				icon: 'calendar',
				color: '241,65,108'
			},{
				value: 3,
				icon: 'rocket',
				color: '114,57,234',
				disabled: true
			},
		]
	}
	getUsage(id){
		const _ = this;
		return [
			{
				value: 10,
				title: 'Total Sessions',
				color: '215,249,239'
			},{
				value: '26:30',
				title: 'Avr. Session Lenght',
				color: '255,244,222'
			},{
				value: 160,
				title: 'Questions Answered',
				color: '225,233,255'
			},{
				value: 10,
				title: 'Total Problems',
				color: '244,225,240'
			},{
				value: 1,
				title: 'Avg. Problems/ Session',
				color: '248,245,255'
			},
		]
	}
	getMastered(id){
		const _ = this;
		return {
			title: 'Skills Mastered',
			value: 24,
			total: 67
		}
	}
	getTotalTime(id){
		const _ = this;
		if (id == "62f4c682d4ef01642e80564f") return {
			title: 'Total Practice Time',
			value: '4:25:07',
			total: '6:00:00'
		}
		else  return {
			title: 'Total Practice Time',
			value: '5:12:07',
			total: '6:00:00'
		}
	}
	getProgress(){
		const _ = this;
		return [
			{
				title: 'Quizzes Completed',
				value: 10
			},{
				title: 'Homeworks Completed',
				value: 5
			},{
				title: 'Skill Practice Completed',
				value: 8
			},{
				title: 'Practice Tests Completed',
				value: 1
			},
		]
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
					resolve(response['response']);
				}
			} else {
				resolve(null);
			}
			resolve(null);
		});
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

	//course methods
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

}

export const Model = new _Model();