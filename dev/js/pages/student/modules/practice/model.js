import { env }   from "/env.js";
import {G_Bus} from "../../../../libs/G_Bus.js";
export class _Model {
	constructor(){
		const _ = this;
		_.baseHeaders = {
			"Content-Type": "application/json"
		}
		_.endpoints = {
			skillPractice: `${env.backendUrl}/student/skill-practice`,
			sectionCategories: `${env.backendUrl}/student/current-course/skill`,
			create: `${env.backendUrl}/skill-results/create`,
			results: `${env.backendUrl}/skill-results`,
			quizess: `${env.backendUrl}/student/current-course/quiz`,
			quiz: `${env.backendUrl}/student/diagnostic-quiz`,
			summary: `${env.backendUrl}/skill-results`,
			quizSummary: `${env.backendUrl}/quiz-results/summary`,
			quizResults: `${env.backendUrl}/quiz-results`,
			startQuiz: `${env.backendUrl}/quiz-results/create`,
			resetQuiz:`${env.backendUrl}/quiz-results/reset`,
		};
	}
	
	get allQuestionsLength(){
		const _ = this;
		return _.questions.length;
	}
	get questions(){
		const _ = this;
		return _.skillTest;
	}
	get allquestions(){
		const _ = this;
		let questions = [];
		_.skillTest.forEach( test =>{
			questions = questions.concat(test['questions']);
		});
		return questions;
	}
	
	
	
	getQuizInfo() {
		const _ = this;
		return {
			'color': '80, 20, 208',
			items: [
				{
					'_id': '123123',
					'title': 'Quiz 1 - Reading Comprehension',
					'status': 'completed',
				}, {
					'_id': '1233123',
					'title': 'Quiz 1 - Reading Comprehension',
					'status': 'Yet to start',
					'color': '80, 20, 208'
				}, {
					'_id': '123123123',
					'title': 'Quiz 1 - Reading Comprehension',
					'status': 'Yet to start',
					'color': '80, 20, 208'
				}, {
					'_id': '414123',
					'title': 'Quiz 1 - Reading Comprehension',
					'status': 'Yet to start',
					'color': '80, 20, 208'
				}
			]
		}
	}
	getPracticeInfo() {
		const _ = this;
		return {
			'color': '0, 175, 175',
			'icon': 'graphic-2',
			items: [
				{
					'_id': '123123',
					'icon':'graphic-1',
					'title': 'Math basics: Converting between decimals, fractions, and percents',
					'status': 'completed',
				}, {
					'_id': '1233123',
					'icon':'graphic-2',
					'title': 'Math basics: Converting between decimals, fractions, and percents',
					'status': 'Yet to start',
					'color': '80, 20, 208'
				}, {
					'_id': '123123123',
					'icon':'graphic-2',
					'title': 'Math basics: Converting between decimals, fractions, and percents',
					'status': 'Yet to start',
					'color': '80, 20, 208'
				}, {
					'_id': '414123',
					'icon':'graphic-2',
					'title': 'Circumference and Area of Circles',
					'status': 'locked',
					'color': '80, 20, 208'
				}
			]
		}
	}
	getAchievementInfo(){
		const _ = this;
		return [
			{
				title: 'Algebra, Equations, and Inequalities',
				items: [
					{
						_id: 'da232asd1asdf3',
						level: 1,
						title: 'Algebraic Remainders',
						video: 'https://www.video.com',
					},{
						_id: '12312',
						level: 2,
						title: 'Backsolving Strategy',
						video: 'https://www.video.com',
					},{
						_id: 'afsfdfsdf',
						level: 3,
						title: 'Evaluate algebraic expressions',
						video: 'https://www.video.com',
					},{
						_id: '123fasdf',
						level: 4,
						title: 'Inequalities',
						video: 'https://www.video.com',
					}
				]
			},{
				title: 'Arithmetic and Fractions',
				items: [
					{
						_id: 'da232asd1asdf3',
						level: 1,
						title: 'Consecutive numbers',
						video: 'https://www.video.com',
					},{
						_id: '12312',
						level: 2,
						title: 'Math basics: Absolute value',
						video: 'https://www.video.com',
					},{
						_id: 'afsfdfsdf',
						level: 3,
						title: 'Math basics: Converting between decimals, fractions, and percents',
						video: 'https://www.video.com',
					},{
						_id: '123fasdf',
						level: 4,
						title: 'Math basics: Decimals',
						video: 'https://www.video.com',
					}
				]
			},{
				title: 'Functions',
				items: [
					{
						_id: 'da232asd1asdf3',
						level: 1,
						title: 'Sequences and series',
						video: 'https://www.video.com',
					},{
						_id: '12312',
						level: 2,
						title: 'Sets',
						video: 'https://www.video.com',
					},{
						_id: 'afsfdfsdf',
						level: 3,
						title: 'Symbol functions',
						video: 'https://www.video.com',
					},{
						_id: '123fasdf',
						level: 4,
						title: 'Translating symbol word problems',
						video: 'https://www.video.com',
					}
				]
			},{
				title: 'Geometry',
				items: [
					{
						_id: 'da232asd1asdf3',
						level: 1,
						title: 'Angles',
						video: 'https://www.video.com',
					},{
						_id: '12312',
						level: 2,
						title: 'Circumference and Area of Circles',
						video: 'https://www.video.com',
					},{
						_id: 'afsfdfsdf',
						level: 3,
						title: 'Diagrams and grids',
						video: 'https://www.video.com',
					},{
						_id: '123fasdf',
						level: 4,
						title: 'Equation of a line given two points',
						video: 'https://www.video.com',
					}
				]
			}
		]
	}
	getSummaryInfo(){
		const _ = this;
		return [
			{
				title:'Your Percent Correct',
				value:'50%',
			},{
				title:'Your Average Pace',
				value:'40:00',
				color: '71, 190, 125'
			},{
				title:'Others Average Pace',
				value:'39:00',
				color: '246, 155, 17'
			}
		]
	}
	getReports(){
		const _ = this;
		return [
			{
				title: 'Algebra, Equations, and Inequalities',
				items: [
					{
						icon: 'graphic-1',
						title: 'Algebraic Remainders',
						'questions_answered': 200,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-2',
						title: 'Backsolving Strategy',
						'questions_answered': 220,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-3',
						title: 'Evaluate algebraic expressions',
						'questions_answered': 100,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-4',
						title: 'Inequalities and ranges',
						'questions_answered': 350,
						'total_time': '41:29',
						progress: 50
					}
				]
			},{
				title: 'Arithmetic and Fractions',
				items: [
					{
						icon: 'graphic-1',
						title: 'Consecutive numbers',
						'questions_answered': 200,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-2',
						title: 'Math basics: Absolute value',
						'questions_answered': 220,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-3',
						title: 'Math basics: Converting between decimals, fractions, and percents',
						'questions_answered': 100,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-4',
						title: 'Math basics: Decimals',
						'questions_answered': 350,
						'total_time': '41:29',
						progress: 50
					}
				]
			},{
				title: 'Coordinate Geometry',
				items: [
					{
						icon: 'graphic-1',
						title: 'Coordinate plane',
						'questions_answered': 200,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-2',
						title: 'Number lines',
						'questions_answered': 220,
						'total_time': '41:29',
						progress: 50
					}
				]
			},{
				title: 'Functions',
				items: [
					{
						icon: 'graphic-1',
						title: 'Sequences and series',
						'questions_answered': 200,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-2',
						title: 'Sets',
						'questions_answered': 220,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-3',
						title: 'Symbol functions',
						'questions_answered': 100,
						'total_time': '41:29',
						progress: 50
					},{
						icon: 'graphic-4',
						title: 'Translating symbol word problems',
						'questions_answered': 350,
						'total_time': '41:29',
						progress: 50
					}
				]
			},
		]
	}
	
	
	/* Create  */

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
		_.testStatus = _.test['status'];
		return Promise.resolve(_.test);
	}
	async getSectionCategories(subject='math',signal={}){
		const _ = this;
		// get all tests from Database
		return new Promise(async resolve =>{
			try{
				let rawResponse = await fetch(`${_.endpoints['sectionCategories']}/${subject}`,{
					method: 'GET',
					headers:_.baseHeaders,
					signal
				});
				if(rawResponse.status < 210){
					let response = await rawResponse.json();
					if(response['status'] == 'success'){
						_.categories = response['response'];
						resolve(_.categories);
					}
				}else{
					G_Bus.trigger('TestPage','showResults',rawResponse);
				}
			}catch(e){
				if (e.name != 'AbortError'){
					throw  new Error(e);
				}
			}
		});
	}
	
	getTestFromStorage(){
		const _ = this;
		if(_.testSkillServerAnswers) return _.testSkillServerAnswers;
		if(!_.hasTestFromStorage()) return {};
		let test;
		try{
			test = JSON.parse(localStorage.getItem('skilltest'))
		}catch(e){
			throw new Error('Wrong test data from localStorage')
		}
		return test;
	}
	getSkillPractice(concept,category){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['skillPractice']}/?concept=${concept}&category=${category}`,{
				method: 'GET',
				headers:_.baseHeaders,
			});
			if(rawResponse.status < 210){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.skillTest = response['response']['tests'];
					resolve(response['response']['tests']);
				}
			}else{
				G_Bus.trigger('TestPage','showResults',rawResponse);
			}
		});
	}
	getCurrentConcept(id){
		const _ = this;
		let
			currentCategory,	currentConcept,exit= false;
		_.categories.forEach( category => {
			if(exit) return void 'exited';
			if(category['concepts']){
				category['concepts'].filter( concept =>{
					if(concept['concept'] == id){
						currentConcept = concept;
						currentCategory = category['category'];
						exit=true;
						return void 0;
					}
				});
			}
		});
		_.currentCategory = currentCategory;
		_.currentConcept = currentConcept;
		return { currentCategory, currentConcept};
	}
	getQuizess(subject='math',signal){
		const _ = this;
			return new Promise(async resolve =>{
				try{
					let rawResponse = await fetch(`${_.endpoints['quizess']}/${subject}`,{
						method: 'GET',
						headers: _.baseHeaders,
						signal
					});
					if(rawResponse.status == 200){
						let response = await rawResponse.json();
						_.skillTest = response['response']['tests'];
						resolve(response['response']);
					}
				}catch(e){
					if (e.name != 'AbortError'){
						throw  new Error(e)
					}
				}
			});
	
	}
	getCurrentQuiz(subject,num){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['quiz']}/?subject=${subject}&num=${num}`,{
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				_.skillTest = response['response']['tests'];
				resolve(response['response']);
			}
		});
	}
	getSummary(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['summary']}/${_.resultId}/summary`,{
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
				resolve(response['response']);
			}
		});
	}
	getQuizSummary(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['quizSummary']}`,{
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
				resolve(response['response']);
			}
		});
	}
	async getQuizResults(subject,num){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['quizResults']}`,{
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let
					response = await rawResponse.json(),
					tests = response['response']['tests'];
				let t = tests.filter( test =>{
					if(test['subject'] == subject && test['number'] == num){
						return test;
					}
				});
				if(t.length > 0) {
					_.testServerAnswers = t[0]['answers'];
				}else{
					_.testServerAnswers = [];
				}
				_.testStatus = response['response']['status'];
				resolve(_.testServerAnswers);
			}
		});
	}
	async startQuiz(){
		const _ =this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['startQuiz']}`,{
				'method': 'POST',
				headers:_.baseHeaders
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					let resultId = response['response']['resultId'];
					_.quizResultId =  resultId;
					resolve( resultId);
				}
			}else{
				resolve(false);
			}
			
		});
	}
	
	deleteQuiz(){
		const _ = this;
		//resetQuiz
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['resetQuiz']}`,{
				method: 'DELETE',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				console.log(response);
			}
		});
	}
	
	
	hasTestFromStorage(){
		return localStorage.getItem('skilltest') ? true : false;
	}
	isEmpty(obj){
		return Object.keys(obj).length ? false : true;
	}
	isFinished(){
		return false;
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
		localStorage.setItem('skilltest',JSON.stringify(test));
	}
	async getTestResults(){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.resultId}`,{
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status == 200){
				let
					response = await rawResponse.json(),
				answers = response['response']['answers'];
				_.testServerAnswers = answers;
				_.testStatus = response['response']['status'];
				resolve(_.testServerAnswers);
			}
		});
	}
	async start(concept,category){
		const _ =this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['create']}`,{
				'method': 'POST',
				headers:_.baseHeaders,
				body: JSON.stringify({
					"concept": concept,
					"category": category,
				})
			});
			if(rawResponse.status < 206){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					let resultId = response['response']['resultId'];
					_.resultId = resultId;
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
		if(!answer['status']){
			answer['status'] = 'in progress';
		}
	//	answer['status'] = 'finished';
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['results']}/${_.resultId}`,{
				method: 'PUT',
				headers:_.baseHeaders,
				body: JSON.stringify(answer)
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					resolve(response);
				}
			}else{
				console.log(rawResponse);
			}
		});
	}
	async saveQuizAnswer(answer){
		// Save choosed answer in server
		const _ = this;
		if(!answer['status']){
			answer['status'] = 'in progress';
		}
		//	answer['status'] = 'finished';
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`${_.endpoints['quizResults']}`,{
				method: 'PUT',
				headers:_.baseHeaders,
				body: JSON.stringify(answer)
			});
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					resolve(response);
				}else{
					resolve(response)
				}
			}else{
				resolve(false);
			}
		});
	}

	
}

export const Model = new _Model();