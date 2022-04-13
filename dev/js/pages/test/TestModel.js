export default  class TestModel{
	getTest(testObj){
		const _ = this;
		return new Promise(resolve =>{
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
	}
}