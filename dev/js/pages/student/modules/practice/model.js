import { env }   from "/env.js";
export class _Model {
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
}

export const Model = new _Model();