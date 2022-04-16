export default  class TestModel{
	async getTest(testObj){
		const _ = this;
		return new Promise(async resolve =>{
			let rawResponse = await fetch(`https://live-prepfuelbackend-mydevcube.apps.devinci.co/api/practice-tests/625993cc6b2cfe252e6b7fcc`,{
				method: 'GET',
				headers:{
					"Authorization": localStorage.getItem('token'),
					"Content-Type": "application/json"
				}
			});
			
			
			if(rawResponse.status == 200){
				let response = await rawResponse.json();
				if(response['status'] == 'success'){
					_.test = response['test']
					resolve(_.test);
				}
			}else{
				_.logout(rawResponse);
			}
		});
	}
	logout(response){
		if(response.status == 401){
			localStorage.removeItem('g-route-prev')
			localStorage.removeItem('g-route-current')
			localStorage.removeItem('token')
		}
	}
	hasTestFromStorage(){
		return localStorage.getItem('test') ? true : false;
	}
	isEmpty(obj){
		return !!Object.keys({}).length;
	}

	
	async getTestFromStorage(){
		const _ = this;
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
			test[testData['id']] = testData;
		}else{
			for(let t in test){
				test[ testData['id'] ] = testData;
			}
		}
		localStorage.setItem('test',JSON.stringify(test));
	}
	/*
	*
	*
	*
	* */
}

/*
* return new Promise(resolve =>{
			resolve({
				id: 1,
				time: 20,
				title:'',
				description:'',
				sections:{
					welcome:{
						headerTitle: 'Practice Test - Section Name',
						innerTitle: 'Welcome to Practice Test - Section Name',
						innerDescription:
							`This section has 40 questions and is 20 minutes total.
							Once you start timer, you cannot pause this section.`
					},
					directions:{
						headerTitle: 'Directions test header',
						innerTitle: 'Test directions',
						innerDescription: 'This is description for test'
					}
				},
				questions: [
					{
						id:1,
						answers:{
							a: 'Test answer a',
							b: 'Test answer a',
							c: 'Test answer a',
							d: 'Test answer a',
						}
					}
				],
			})
		});
* */