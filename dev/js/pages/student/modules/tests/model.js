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
			studentTests: `${env.backendUrl}/student/current-course`,
			create: `${env.backendUrl}/tests-results/create`,
			results: `${env.backendUrl}/tests-results`,
			resultsBy: `${env.backendUrl}/tests/test-by-result`,
			reset: `${env.backendUrl}/tests-results/reset/`,
	
		};
		_.testStatus = 'in progress';
		_.currentSectionPos = 0; // Section position in array section list
		_.currentSubSectionPos = 0;
		_.currentTestPos = 0;
//		_.sectionPos = 0;
	}
	get currentSection(){
		const _ = this;
		return _.test['sections'][_.currentSectionPos];
	}
	get allQuestionsLength(){
		return this.allquestions.length;
	}
	get questionsLength(){
		const _ = this;
		return _.questions.length;
		let cnt = 0;
		for(let subSection of _.currentSection['subSections']){
			subSection['questionData'].forEach((page,i) => {
				page['questions'].forEach(quest =>{
					cnt++;
				});
			});
		}
		return cnt;
	}
	get allquestions(){
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
	get questions(){
		const _ = this;
		let questions = [];
		for(let subSection of _.currentSection['subSections']){
			subSection['questionData'].forEach((page,i) => {
				if(page['type'] == 'passage'){
					questions.push(page);
				}else{
					page['questions'].forEach(quest =>{
						//questions[quest['_id']] = quest;
						questions.push(quest);
					});
				}
			});
		}
		return questions;
	}
	get questionsDatas(){
		const _ = this;
		return _.currentSection['subSections'][_.currentSubSectionPos]['questionData']
	//	return _.currentSection['subSections']['questionsData'][_.currentSubSectionPos];
	}
	
	async getStudentTests(type='practice',signal={}){
		const _ = this;
		// get all tests from Database
		return new Promise(async resolve =>{
			try{
				let rawResponse = await fetch(`${_.endpoints['studentTests']}/${type}`,{
					method: 'GET',
					headers:_.baseHeaders,
					signal
				});
				if(rawResponse.status < 210){
					let response = await rawResponse.json();
					if(response['status'] == 'success'){
						_.tests = response['response']['tests'];
						_.tests.sort( (a,b)=>{
							return a['testNumber'] - b['testNumber'];
						});
						console.log(_.tests);
						await Model.getTest();
						resolve(_.tests);
					}
				}else{
					G_Bus.trigger('TestPage','showResults',rawResponse);
				}
			}catch(e){
				if (e.name != 'AbortError'){
					throw  new Error(e)
				}
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
		let testId = _.tests[_.currentTestPos]['_id'];
		_.test = _.tests[_.currentTestPos];
		console.log(_.test);
		_.testStatus = _.test['status'];
		return Promise.resolve(_.test);
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
	/*	if(_.currentSection['subSections'][0]['_id'] == "62d78f71c58621b0b2ed446b"){
			console.log(_.currentSection['subSections'][0]);
			return _.currentSection['subSections'][0]['questionData'][0];
		}*/
		return  _.questions[0]; //_.currentSection['subSections'][_.currentSectionPos]['questionDatas'][0];
	}
	async start(){
		const _ =this;
/*		if(localStorage.getItem('resultId')){
			_.test['resultId'] = localStorage.getItem('resultId');*/
			//return Promise.resolve(_.test['resultId']);
	//	}
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['create']}/${_.test['_id']}`,{
				'method': 'POST',
				headers:_.baseHeaders
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					console.log(response);
					let resultId = response['response']['resultId'];
					_.test['resultId'] = resultId;
					localStorage.setItem('resultId', resultId);
					resolve({
						resultId: resultId
					});
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
					//_.getTestResults();
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
				headers: _.baseHeaders,
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
				//console.log(_.testServerAnswers);
				//_.testServerAnswers = response['response']['sections'][_.currentSectionPos]['subSections'][_.currentSubSectionPos]['answers'];
				_.testStatus = response['response']['status'];
				resolve({
					testResults: _.testServerAnswers,
					resultObj: response['response'],
				});
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
	resetTest(resultId){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['reset']}/${resultId}`,{
				method: 'DELETE',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				_.test['resultId'] = null;
				if(response['status'] == 'success'){
					_.testServerAnswers = {};
					resolve(response['response']);
				}
			}
		});
	}


	getPracticeTestResults(id){
		const _ = this;
		let results = [
			{
				title: 'Practice test 1',
				_id: 'asdfafasdf',
				total: 400,
				lessons: [
					{
						title: 'English Language Arts',
						value: 200,
						color: '80,205,137'
					},{
						title: 'Mathematics',
						value: 200,
						color: '4,200,200'
					}
				]
			},{
				title: 'Practice test 2',
				_id: '12fasffasfa',
				total: 600,
				lessons: [
					{
						title: 'English Language Arts',
						value: 300,
						color: '80,205,137'
					},{
						title: 'Mathematics',
						value: 300,
						color: '4,200,200'
					}
				]
			}
		];

		if (!id) return results;
		else {
			for (let item of results) {
				if (item._id === id) return item;
			}
		}
	}

	
	
	async changeTest(pos){
		const _ = this;
		_.currentTestPos = pos;
		await _.getTest();
		return Promise.resolve(true);
	}
	
	currentQuestionPosById(questionId){
		const _ = this;
		let pos = _.allquestions.findIndex( question => {
			return question['_id'] == questionId
		} );
		
		if(pos >= 0)	return pos;
		return null;
	}
	currentQuestionDataPosById(questionId){
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
