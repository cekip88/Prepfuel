import { G_Bus } from "../../libs/G_Bus.js";
import { env }   from "/env.js";
class _TestModel{
	constructor(){
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			tests: `${env.backendUrl}/practice-tests`,
			create: `${env.backendUrl}/practice-test-results/create`,
			results: `${env.backendUrl}/practice-test-results`,
			resultsBy: `${env.backendUrl}/practice-tests/get-test-by-result/`,
		};
		
		_.testStatus = 'in progress';
	}
	async getTests(testId){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(_.endpoints['tests'],{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					resolve(response);
				}
			}else{
				_.logout(rawResponse);
			}
		});
	}
	async getTest(testId){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['tests']}/${testId}`,{
				method: 'GET',
				headers:_.baseHeaders
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.test = response['test'];
					_.catchQuestions(_.test);
					resolve(_.test);
				}
			}else{
				_.logout(rawResponse);
			}
		});
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
					_.test['resultId'] = response['resultId'];
					localStorage.setItem('resultId', response['resultId']);
					resolve(response['resultId']);
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
				
				G_Bus.trigger('TestPage','showResults',response)
				_.testServerAnswers = response['result']['answers'];
				_.testStatus = response['result']['status'];
				resolve(response['result']);
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
				let resultId = _.test['resultId']
				_.test = response['test'];
				_.test['resultId'] = resultId;
				_.refreshModelTest();
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
				G_Bus.trigger('TestPage','showSummary',response);
				resolve(response)
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
					resolve(response);
				}
			}
		});
	}
	
	get firstQuestion(){
		const _ = this;
		return _.test['sections']['questionPages'][0];
	}
	
	
	refreshModelTest(){
		const _ = this;
		_.catchQuestions(_.test);
	}
	
	catchQuestions(test){
		const _ = this;
		_.questions = {};
		test['sections']['questionPages'].forEach((page,i) => {
			page['questions'].forEach(quest =>{
				_.questions[quest['id']] = quest;
			});
		});
	}
	currentPage(pos){
		const _ = this;
		return _.test['sections']['questionPages'][pos];
	}
	innerQuestion(id){
		const _ = this;
		return _.questions[id];
	}
	questionPos(pos){
		const _ = this;
		let outPos = 1;
		for(let i=0;i < pos;i++){
			outPos+= _.test['sections']['questionPages'][i]['questions'].length;
		}
		return outPos;
	}
	currentPos(id){
		const _ = this;
		let index = -1;
		_.test['sections']['questionPages'].forEach((page,i) => {
			page['questions'].forEach(quest =>{
				if( quest['id'] == id ) index = page['pageId']-1;
			});
		});
		if(index < 0){
			_.test['sections']['questionPages'].forEach((page,i) => {
				if(page['pageId'] == id) index = i;
			});
		}
		return index;
	}
	logout(response){
		if(response.status == 401){
			localStorage.removeItem('g-route-prev')
			localStorage.removeItem('g-route-current')
			localStorage.removeItem('token');
			G_Bus.trigger('router','changePage','/login');
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

export const TestModel = new _TestModel();
