import { env }   from "/env.js";
export class _Model{
	getQuizInfo(){
		const _ = this;
		return [
			{
				'_id':'123123',
				'title':'Quiz 1 - Reading Comprehension',
				'status':'completed',
			},{
				'_id':'1233123',
				'title':'Quiz 1 - Reading Comprehension',
				'status':'Yet to start',
			},{
				'_id':'123123123',
				'title':'Quiz 1 - Reading Comprehension',
				'status':'Yet to start',
			},{
				'_id':'414123',
				'title':'Quiz 1 - Reading Comprehension',
				'status':'Yet to start',
			}
		]
	}
}

export const Model = new _Model();