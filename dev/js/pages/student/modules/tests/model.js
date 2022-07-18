import {G_Bus} from "../../../../libs/G_Bus.js";
import { env }   from "/env.js";
class _Model{
	constructor(){
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			tests: `${env.backendUrl}/tests`,
			studentTests: `${env.backendUrl}/student/current-course/tests`,
			create: `${env.backendUrl}/tests-results/create`,
			results: `${env.backendUrl}/tests-results`,
			resultsBy: `${env.backendUrl}/tests/test-by-result`,
		};
		_.testStatus = 'in progress';
		_.currentSectionPos = 0; // Section position in array section list
		_.currentSubSectionPos = 0;
//		_.sectionPos = 0;
	}
	get currentSection(){
		const _ = this;
		return _.test['sections'][_.currentSectionPos];
	}
	get questions(){
		const _ = this;
		let questions = [];
		for(let subSection of _.currentSection['subSections']){
			subSection['questionData'].forEach((page,i) => {
				page['questions'].forEach(quest =>{
					//questions[quest['_id']] = quest;
					questions.push(quest);
				});
			});
		}
		return questions;
	}
	get questionsDatas(){
		const _ = this;
		return _.currentSection['subSections']['questionsData'][_.currentSubSectionPos];
	}
	
	async getTests(){
		const _ = this;
		// get all tests from Database
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['tests']}/`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status < 210){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.tests = response['response'];
					await Model.getTest();
					resolve(_.tests);
				}
			}else{
				G_Bus.trigger('TestPage','showResults',rawResponse);
			}
		});
	}
	async getStudentTests(type='practice'){
		const _ = this;
		// get all tests from Database
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['studentTests']}/${type}`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status < 210){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.tests = response['response']['tests'];
					console.log(_.tests);
					await Model.getTest();
					resolve(_.tests);
				}
			}else{
				G_Bus.trigger('TestPage','showResults',rawResponse);
			}
		});
	}
	async getTest(){
		const _ = this;
		/*
		*   Current test structure
		*   {
		*     _id title description testTime testType testStandard sections number
		*   }
		* */
		let testId = _.tests[0]['_id']; // temp test id
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['tests']}/${testId}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.test = response['response'];
					resolve(_.test);
				}
			}
		});
	}
	changeSectionPos(pos=0){
		this.currentSectionPos = pos;
	}
	get firstQuestion() {
		const _ = this;
		/*let question;
		for(let questionId in _.questions){
			question = _.questions[questionId];
			break;
		}
		return question;*/
		return  _.questions[0]; //_.currentSection['subSections'][_.currentSectionPos]['questionDatas'][0];
	}
	async start(){
		const _ =this;
		if(localStorage.getItem('resultId')){
			_.test['resultId'] = localStorage.getItem('resultId');
			return Promise.resolve(_.test['resultId']);
		}
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['create']}/${_.test['_id']}`,{
				'method': 'POST',
				headers:_.baseHeaders
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					let resultId = response['response']['resultId'];
					_.test['resultId'] = resultId;
					localStorage.setItem('resultId', resultId);
					resolve(resultId);
				}
			}else{
				resolve(false);
			}
			
		});
	}
	
	async saveAnswer(answer){
		// Save choosed answer in server
		const _ = this;
		if(answer){
			answer['status'] = 'in progress';
		}
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.test['resultId']}`,{
				method: 'PUT',
				headers:_.baseHeaders,
				body: JSON.stringify(answer)
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.getTestResults();
					resolve(response);
				}
			}else{
				_.getTestResultsByResultId();
			}
		});
	}
	async getLatestTestResults(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.test['_id']/latest}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				G_Bus.trigger('TestPage','showLatestResults',response)
			}
		});
	}
	async getTestResults(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.test['resultId']}`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				G_Bus.trigger('TestPage','showResults',response);
				let sections = response['response']['sections'];
				_.testServerAnswers = {};
				if(sections) {
					for(let section of sections) {
						let subSections = section['subSections'];
						for(let subSection of subSections) {
							Object.assign(_.testServerAnswers, subSection['answers'])
						}
					}
				}
				//_.testServerAnswers = response['response']['sections'][_.currentSectionPos]['subSections'][_.currentSubSectionPos]['answers'];
				_.testStatus = response['response']['status'];
				resolve(response['response']);
			}
		});
	}
	async getTestResultsByResultId(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['resultsBy']}/${_.test['resultId']}`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				let resultId = _.test['resultId'];
				_.test = response['response'];
				_.test['resultId'] = resultId;
				resolve(_.test);
			}
		});
	}
	async getTestSummary(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.test['resultId']}/summary`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				G_Bus.trigger('TestPage','showSummary',response['response']);
				resolve(response['response'])
			}
		});
	}
	finishTest(answer){
		const _ = this;
		if(answer){
			answer['status'] = 'finished';
		}
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.test['resultId']}`,{
				method: 'PUT',
				headers:_.baseHeaders,
				body: JSON.stringify(answer)
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.testStatus = 'finished';
					resolve(response['response']);
				}
			}
		});
	}
	
	currentQuestionPosById(questionId){
		const _ = this;
		let pos = _.questions.findIndex( question => {
			return question['_id'] == questionId
		} );
		if(pos >= 0)	return pos;
		return null;
	}
	currentQuestionData(pos){
		const _ = this;
		return _.currentSection['subSections'][_.currentSubSectionPos]['questionData'][pos];
	}
	innerQuestion(pos){
		const _ = this;
		return _.questions[pos];
	}
	logout(response){
		if(response.status == 401){
			localStorage.removeItem('g-route-prev')
			localStorage.removeItem('g-route-current')
		//	localStorage.removeItem('token');
		//	G_Bus.trigger('router','changePage','/login');
		}
	}
	
	hasTestFromStorage(){
		return localStorage.getItem('test') ? true : false;
	}
	isEmpty(obj){
		return Object.keys(obj).length ? false : true;
	}
	getTestFromStorage(){
		const _ = this;
		if(_.testServerAnswers) return _.testServerAnswers;
		if(!_.hasTestFromStorage()) return {};
		let test;
		try{
			test = JSON.parse(localStorage.getItem('test'))
		}catch(e){
			throw new Error('Wrong test data from localStorage')
		}
		return test;
	}
	async saveTestToStorage(testData){
		const _ = this;
		let test = _.getTestFromStorage();
		if(_.isEmpty(test)){
			test[testData['questionId']] = testData;
		}else{
			if(testData['questionId'] in test){
				for(let t in test){
					let testId = testData['questionId'];
					if(testId == test[t]['questionId']){
						for(let rawT in testData){
							if(!testData[rawT]){
								delete test[t][rawT];
							}
							test[t][rawT] = testData[rawT];
						}
						break;
					}
				}
			}else{
				test[testData['questionId']] = testData;
			}
		}
		localStorage.setItem('test',JSON.stringify(test));
	}
	
	isFinished(){
		return this.testStatus == 'finished';
	}
}

export const Model = new _Model();
