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
			create: `${env.backendUrl}/tests-results/create`,
			results: `${env.backendUrl}/tests-results`,
		//	resultsBy: `${env.backendUrl}/tests/get-test-by-result/`,
		};
		_.testStatus = 'in progress';
		_.currentSectionPos = 0;// Section position in array section list
		
//		_.sectionPos = 0;
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
					resolve(response['tests']);
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
					_.catchCurrentQuestion(_.test);
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
	
	changeSectionPos(pos=0){
		this.currentSectionPos = pos;
	}
	
	get firstQuestion(){
		const _ = this;
		return _.currentSection['subSections'][_.currentSectionPos]['questionDatas'][0];
	}
	
	
	refreshModelTest(){
		const _ = this;
		_.catchQuestions(_.test);
	}
	
	catchQuestions(test){
		const _ = this;
		_.questions = {};
		_.currentSection['subSections'][_.currentSectionPos]['questionDatas'].forEach((page,i) => {
			page['questions'].forEach(quest =>{
				_.questions[quest['_id']] = quest;
			});
		});
	}
	catchCurrentQuestion(test){
		const _ = this;
		_.currentSection = test['sections'][_.currentSectionPos];
	}
	
	currentPage(pos){
		const _ = this;
		return _.currentSection['subSections'][0]['questionDatas'][pos];
	}
	innerQuestion(id){
		const _ = this;
		return _.questions[id];
	}
	questionPos(pos){
		const _ = this;
		let outPos = 1;
		//console.log(_.currentSection['subSections'][0]['questionDatas']);
		for(let i=0;i < pos;i++){
			outPos+= _.currentSection['subSections'][0]['questionDatas'][i].questions.length;
		}
		return outPos;
	}
	currentPos(id){
		const _ = this;
		let index = -1;
		_.currentSection['subSections'][0]['questionDatas'].forEach((page,i) => {
			page['questions'].forEach(quest =>{
				if( quest['_id'] == id ) index = i;//page['pageId']-1;
			});
		});
	/*	if(index < 0){
			_.currentSection['subSections'][0]['questionDatas'].forEach((page,i) => {
				if(page['pageId'] == id) index = i;
			});
		}*/
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

export const Model = new _Model();
