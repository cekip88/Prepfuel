import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";
import {AdminPage} from "../../admin.page.js";

export class DashboardModule extends AdminPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'adminTabs',
			'body-tabs':'dashboardTabs',
			'body':'studentDashboardBody',
		};
		document.title = 'Prepfuel - Dashboard';
	}

	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.division = /\d{1,3}(?=(\d{3})+(?!\d))/g;
		_.subSection = 'students';

		_.skillsLevelStatsHeaderData = {
			title: 'Students Skills Level Stats By Section',
			subtitle: 'Most of the students achieved level 3',
			gap: false,
			buttons: {'Verbal Reasoning':'','Quantitative Reasoning':'','Reading Comprehension':'','Mathematics Achievement':'active'}
		};
		_.purchasedCoursesAndPlansHeaderData = {
			title: 'Purchased Courses & Plans',
			subtitle: 'More than 8000+ courses purchased',
			buttons: {'Today':'','Week':'','Month':'','6 Month':'','1 Year':'','All':'active',}
		}

		_.refundsHeader = {
			title: 'Refunds',
			subtitle: '14 refunds this month',
			buttons: {'Month':'active','1 Year':'','All':''}
		}
		_.plansCanceledHeader = {
			title: 'Canceled Plans',
			subtitle: 'Analyze plans canceled this month',
			buttons: {'Month':'active','1 Year':'','All':''}
		}

		_.revenueHeader = {
			title: 'Revenue',
			subtitle: '$70k+ your total revenue',
			buttons: {'Month':'active','1 Year':'','All':''}
		};

		G_Bus
			.on(_,['domReady','changeSection','changeTimeFilter','blockHeadNavigate'])
	}
	async asyncDefine(){
		const _ = this;
		_.userStats = {
			info: {
				title:'Users Stats',
				subtitle:'More than 7k+ students',
				countText:'Total Students Registered'
			},
			stats: [
				{title: 'Students registered to ISEE course',icon:'user', color:'turquoise', value: 2945},
				{title: 'Students registered to SSAT course',icon:'user', color:'gold', value: 2200},
				{title: 'Students registered to SHSAT course',icon:'user', color:'blue', value: 2200},
			]
		};
		_.averageTimeSpentData = {
			info: {
				title : '20 minutes',
				subtitle : 'Average time spent per session',
				graphic : 'averageWidget.png',
			},
			header : {
				title: 'Average time spent per session',
				subtitle: 'Students spent in app over 20 minutes on average',
				buttons: {'Today':'', 'Week':'', 'Month':'', '6 Month':'active', '1 Year':'','All':''}
			}
		};
		_.coursesVariants = {
			title:'Course',
			buttonsData: {buttons:[{title:'ISEE',class:'active'},{title:'SSAT'},{title:'SHSAT'}]},
			gap:false,
		};
		_.systemStats = {
			info:{
				title:'Stars Earned In The System',
				subtitle:'More than 800k+ stars earned by students',
				countText:'Stars Earned by Students'
			},
			stats: [
				{title: 'Earned for Skills Practice',icon:'stars', color:'orange', value:390450},
				{title: 'Earned for Practice Tests',icon:'stars', color:'blue', value:136600},
				{title: 'Earned for Videos Watched',icon:'stars', color: 'violet', value: 136600},
				{title: 'Earned for Reviewed Questions',icon:'stars', color: 'turquoise', value: 136695}
			]
		};
		_.practiceTestStatsData = {
			header: {
				title:'Practice Test Stats',
				subtitle:'More than 6k+ tests taken',
				buttons:{'Week':'','Month':'','6 Month':'','1 Year':'active','All':''}
			},
			blocks: [
				{
					title:'The number of practice tests taken',
					list: [
						[{value: '2.3',desc:'Average taken',color:'turquoise'}],
						[{value: '6,800',desc: 'Total taken',color:'turquoise'}],
						[{value: '1.8',desc: 'Average completed',color:'viol-blue'}],
						[{value: '5,300',desc: 'Total completed',color:'viol-blue'}]
					]
				},{
					title: 'The practice test stat',
					gap: false,
					list: [
						[
							{desc: 'Practice Test 1',color: 'red'},
							{value: '2800',desc: 'Taken',color: 'red'},
							{value: '1800',desc: 'Completed',color: 'red'},
							{value: '1000',desc: 'Avg. Score',color: 'red'}
						],[
							{desc: 'Practice Test 2',color: 'maroon'},
							{value: '2000',desc: 'Taken',color: 'maroon'},
							{value: '1800',desc: 'Completed',color: 'maroon'},
							{value: '1200',desc: 'Avg. Score',color: 'maroon'}
						],[
							{desc: 'Practice Test 3',color: 'blue'},
							{value: '1100',desc: 'Taken',color: 'blue'},
							{value: '900',desc: 'Completed',color: 'blue'},
							{value: '1300',desc: 'Avg. Score',color: 'blue'}
						],[
							{desc: 'Practice Test 4',color: 'viol'},
							{value: '900',desc: 'Taken',color: 'viol'},
							{value: '800',desc: 'Completed',color: 'viol'},
							{value: '1400',desc: 'Avg. Score',color: 'viol'}
						]
					]
				}
			]
		};
		_.averageTestScoreData = {
			info: {
				title: '+200 points',
				subtitle: 'Average test score improvement',
				graphic: 'averageTestWidget.png'
			},
			header: {
				title:'Average test score improvement',
				subtitle:'This is how students improved their results',
				buttons: {'Week':'', 'Month':'', '6 Month':'active', '1 Year':'', 'All':'',}
			}
		};
		_.studentsTop = {
			header: {
				title:'The largest test score improvement',
				subtitle:'Top 5 students',
				gap: false
			},
			info: [
				{'name':'Ricky Hunt','icon':'yellow-boy','testInfo':'Practice Test 2 - March 26, 2022','points':'+ 550'},
				{'name':'Jane Cooper','icon':'red-afro-girl','testInfo':'Practice Test 4 - March 26, 2022','points':'+ 530'},
				{'name':'Cameron Williamson','icon':'green-with-blue-hair-boy','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
				{'name':'Guy Hawkins','icon':'gray-boy','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
				{'name':'blue-girl','icon':'blue-girl','testInfo':'Practice Test 3 - March 26, 2022','points':'+ 500'},
			]
		};
		_.mostWatchedVideosData = {
			header: {
				title: 'Most watched videos By Section',
				subtitle: 'Top 5 most watched',
				buttons: {'Verbal Reasoning':'','Quantitative Reasoning':'','Reading Comprehension':'','Mathematics Achievement':'active'},
				gap: false
			},
			info: {
				tableHead: ['video id','Concept & category','Total plays','average minutes watched'],
				tableBody: [
					[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Converting between decimals, fractions, and percents',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:10100,type:'number'}},
						{title: {text:'12 min : 56 sec',type:'time'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Algebraic Remainders',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:9100,type:'number'}},
						{title: {text:'12 min : 56 sec',type:'time'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Inequalities',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:8100,type:'number'}},
						{title: {text:'12 min : 56 sec',type:'time'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Evaluate algebraic expressions',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:7100,type:'number'}},
						{title: {text:'12 min : 56 sec',type:'time'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Absolute value',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:6100,type:'number'}},
						{title: {text:'12 min : 56 sec',type:'time'}},
						{button: {text: 'View'}},
					]
				]
			}
		};
		_.mostCompQuestionsData = {
			header: {
				title: 'The most complicated questions',
				subtitle: 'Top 5 questions with the most number of incorrect answers',
				buttons: {'Verbal Reasoning':'','Quantitative Reasoning':'','Reading Comprehension':'','Mathematics Achievement':'active'},
				gap: false
			},
			info: {
				tableHead: ['Question id','Concept & category','Responses','Correct'],
				tableBody: [
					[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Converting between decimals, fractions, and percents',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:10100,type:'number'}},
						{title: {text:3,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Algebraic Remainders',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:9100,type:'number'}},
						{title: {text:3,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Inequalities',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:8100,type:'number'}},
						{title: {text:3,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Evaluate algebraic expressions',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:7100,type:'number'}},
						{title: {text:3,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Absolute value',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:6100,type:'number'}},
						{title: {text:3,type:'percent'}},
						{button: {text: 'View'}},
					]
				]
			}
		};
		_.mostSimpleQuestionsData = {
			header: {
				title: 'The most Simple questions',
				subtitle: 'Top 5 questions with the most number of correct answers',
				buttons: {'Verbal Reasoning':'','Quantitative Reasoning':'','Reading Comprehension':'','Mathematics Achievement':'active'},
				gap: false
			},
			info: {
				tableHead: ['Question id','Concept & category','Responses','Correct'],
				tableBody: [
					[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Converting between decimals, fractions, and percents',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:10100,type:'number'}},
						{title: {text:89,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Algebraic Remainders',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:9100,type:'number'}},
						{title: {text:89,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Inequalities',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:8100,type:'number'}},
						{title: {text:89,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Evaluate algebraic expressions',type:'string'},text: 'Algebra, Equations, and Inequalities'},
						{title: {text:7100,type:'number'}},
						{title: {text:89,type:'percent'}},
						{button: {text: 'View'}},
					],[
						{title: {text:'56037-XDER',type:'string'}},
						{title: {text:'Math basics: Absolute value',type:'string'},text: 'Arithmetic and Fractions'},
						{title: {text:6100,type:'number'}},
						{title: {text:89,type:'percent'}},
						{button: {text: 'View'}},
					]
				]
			}
		};

		_.skillsLevelStatsData = [
			{
				title: 'Algebra, Equations, and Inequalities',
				blocks: [{
					title: 'Algebraic Remainders',
					max: 4000,
					list: [
						{value:{text:1600},title:'lvl 1'},
						{value:{text:2000},title:'lvl 2'},
						{value:{text:3250},title:'lvl 3'},
						{value:{text:750},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Backsolving Strategy',
					list: [
						{value:{text:700},title:'lvl 1'},
						{value:{text:2850},title:'lvl 2'},
						{value:{text:3250},title:'lvl 3'},
						{value:{text:2750},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Evaluate algebraic expressions',
					list: [
						{value:{text:1300},title:'lvl 1'},
						{value:{text:800},title:'lvl 2'},
						{value:{text:2250},title:'lvl 3'},
						{value:{text:1950},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Inequalities',
					list: [
						{value:{text:1600},title:'lvl 1'},
						{value:{text:2000},title:'lvl 2'},
						{value:{text:3250},title:'lvl 3'},
						{value:{text:750},title:'lvl 4'},
					],
					role: '# Students'
				}]
			},{
				title: 'Arithmetic and Fractions',
				blocks: [{
					title: 'Consecutive numbers',
					list: [
						{value:{text:3600},title:'lvl 1'},
						{value:{text:2200},title:'lvl 2'},
						{value:{text:3150},title:'lvl 3'},
						{value:{text:750},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Math basics: Absolute value',
					list: [
						{value:{text:1600},title:'lvl 1'},
						{value:{text:2000},title:'lvl 2'},
						{value:{text:3250},title:'lvl 3'},
						{value:{text:750},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Math basics: Converting between decimals, fractions, and percents',
					list: [
						{value:{text:1600},title:'lvl 1'},
						{value:{text:1500},title:'lvl 2'},
						{value:{text:2250},title:'lvl 3'},
						{value:{text:2750},title:'lvl 4'},
					],
					role: '# Students'
				},{
					title: 'Inequalities',
					list: [
						{value:{text:1600},title:'lvl 1'},
						{value:{text:1200},title:'lvl 2'},
						{value:{text:3550},title:'lvl 3'},
						{value:{text:1750},title:'lvl 4'},
					],
					role: '# Students'
				}]
			}
		];

		_.parentStats = {
			info: {
				title:'Users Stats',
				subtitle:'More than 8000+ parents',
				countText:'Total Parents Registered'
			},
			stats: [
				{title: 'Parents with students',icon:'users', color:'blue', value: 7345},
				{title: 'Parents without students',icon:'user', color:'red', value: 2000},
			]
		};
		_.newUsersStatisticData = {
			header: {
				title: 'New Users',
				subtitle: 'More than 40+ new parents',
				buttons: {'Today':'','Week':'','Month':'active','6 Month':'','1 Year':'','All':''}
			},
			info: {students:40,parents:46}
		};

		_.purchasedCoursesAndPlansStatsData = [
			{
				title: 'Total Courses Purchased',
				max: 2000,
				role: 'Purchased Courses',
				sum: 7345,
				circleValues: [
					{title:'ISEE',value:2945,color:'turquoise'},
					{title:'SSAT',value:2200,color:'gold'},
					{title:'SHSAT',value:2200,color:'blue'},
				],
				list: [
					{
						title: '2021',
						values: [{
							title: 'ISEE',
							color: 'turquoise',
							value: 900
						},{
							title: 'SSAT',
							color:'gold',
							value: 800
						},{
							title: 'SHSAT',
							color:'blue',
							value: 700
						}]
					},{
						title: '2022',
						values: [{
							title: 'ISEE',
							color: 'turquoise',
							value: 2045
						},{
							title: 'SSAT',
							color:'gold',
							value: 1400
						},{
							title: 'SHSAT',
							color:'blue',
							value: 1500
						}]
					}
				]
			},
			{
				title: 'Total ISEE Courses Purchased',
				max: 2000,
				sum: 2945,
				role: 'Purchased Plans',
				circleValues: [
					{title:'Monthly Plan',value:2945,color:'turquoise'},
					{title:'Yearly Plan',value:2200,color:'turquoise-light'},
				],
				list: [
					{
						title: '2021',
						values: [{
							title: 'Monthly Plan',
							color: 'turquoise',
							value: 900
						},{
							title: 'Yearly Plan',
							color: 'turquoise-light',
							value: 700
						}]
					},{
						title: '2022',
						values: [{
							title: 'Monthly Plan',
							color: 'turquoise',
							value: 2045
						},{
							title: 'Yearly Plan',
							color: 'turquoise-light',
							value: 1500
						}]
					}
				]
			},
			{
				title: 'Total SSAT Courses Purchased',
				max: 2000,
				sum: 2200,
				role: 'Purchased Plans',
				circleValues: [
					{title:'Monthly Plan',value:1200,color:'gold'},
					{title:'Yearly Plan',value:1000,color:'gold-light'},
				],
				list: [
					{
						title: '2021',
						values: [{
							title: 'Monthly Plan',
							color: 'gold',
							value: 900
						},{
							title: 'Yearly Plan',
							color: 'gold-light',
							value: 800
						}]
					},{
						title: '2022',
						values: [{
							title: 'Monthly Plan',
							color: 'gold',
							value: 300
						},{
							title: 'Yearly Plan',
							color: 'gold-light',
							value: 200
						}]
					}
				]
			},
			{
				title: 'Total SHSAT Courses Purchased',
				max: 2000,
				sum: 2200,
				role: 'Purchased Plans',
				circleValues: [
					{title:'Monthly Plan',value:1200,color:'blue'},
					{title:'Yearly Plan',value:1000,color:'blue-light'},
				],
				list: [
					{
						title: '2021',
						values: [{
							title: 'Monthly Plan',
							color: 'blue',
							value: 900
						},{
							title: 'Yearly Plan',
							color: 'blue-light',
							value: 800
						}]
					},{
						title: '2022',
						values: [{
							title: 'Monthly Plan',
							color: 'blue',
							value: 300
						},{
							title: 'Yearly Plan',
							color: 'blue-light',
							value: 200
						}]
					}
				]
			}
		];

		_.refundsData = {
			title: '14',
			subtitle: 'Total refunds this month',
			plansInfo: [
				{title:'ISEE',infos:[
					{title:'ISEE Monthly Plan',value:2,color:'turquoise'},
					{title:'ISEE Yearly Plan',value:2,color:'turquoise-light'}
				]},
				{title:'SSAT',infos:[
					{title:'SSAT Monthly Plan',value:3,color:'gold'},
					{title:'SSAT Yearly Plan',value:2,color:'gold-light'}
				]},
				{title: 'SHSAT',infos:[
					{title:'SHSAT Monthly Plan',value:3,color:'blue'},
					{title:'SHSAT Yearly Plan',value:2,color:'blue-light'},
				]}
			],
			reasons: [
				{title: 'Reason 1',colors: ['turquoise','turquoise-light','gold','gold-light','blue','blue-light']},
				{title: 'Reason 2',colors: ['turquoise','gold','blue']},
				{title: 'Reason 3',colors: []},
				{title: 'Reason 4',colors: ['turquoise-light','gold-light','blue-light']},
				{title: 'Reason 5',colors: ['turquoise']},
				{title: 'Other',colors: ['gold']},
			],
			perCourse: {
				title: 'Refund Per Course',
				circleText: 'Total Refund This Month',
				list: [
					{title: 'ISEE course',value: 80, color: 'turquoise'},
					{title: 'SSAT course',value: 100, color: 'gold'},
					{title: 'SHSAT course',value: 100, color: 'blue'},
				]
			},
			perPlan: {
				title: 'Refund Per Plan',
				circleText: 'Total Refund This Month',
				list: [
					{title: 'ISEE Monthly Plan',value: 40, color: 'turquoise'},
					{title: 'ISEE Yearly Plan',value: 40, color: 'turquoise-light'},
					{title: 'SSAT Monthly Plan',value: 60, color: 'gold'},
					{title: 'SSAT Yearly Plan',value: 40, color: 'gold-light'},
					{title: 'SSAT Yearly Plan',value: 60, color: 'blue'},
					{title: 'SHSAT Yearly Plan',value: 40, color: 'blue-light'},
				]
			}
		};
		_.canceledPlansData = {
			title: '14',
			subtitle: 'Total canceled this month',
			plansInfo: [
				{title:'ISEE',infos:[
					{title:'ISEE Monthly Plan',value:2,color:'turquoise'},
					{title:'ISEE Yearly Plan',value:2,color:'turquoise-light'}
				]},
				{title:'SSAT',infos:[
					{title:'SSAT Monthly Plan',value:3,color:'gold'},
					{title:'SSAT Yearly Plan',value:2,color:'gold-light'}
				]},
				{title: 'SHSAT',infos:[
					{title:'SHSAT Monthly Plan',value:3,color:'blue'},
					{title:'SHSAT Yearly Plan',value:2,color:'blue-light'},
				]}
			],
			reasons: [
				{title: 'Reason 1',colors: ['turquoise','turquoise-light','gold','gold-light','blue','blue-light']},
				{title: 'Reason 2',colors: ['turquoise','gold','blue']},
				{title: 'Reason 3',colors: []},
				{title: 'Reason 4',colors: ['turquoise-light','gold-light','blue-light']},
				{title: 'Reason 5',colors: ['turquoise']},
				{title: 'Other',colors: ['gold']},
			]
		};

		_.revenueData = {
			title: '$70,400.00',
			subtitle: 'Total Revenue This Month',
			perCourse: {
				title: 'Per Course',
				circleText: 'Total Refund This Month',
				list: [
					{title: 'ISEE course',value: 30000.00, color: 'turquoise'},
					{title: 'SSAT course',value: 20200.00, color: 'gold'},
					{title: 'SHSAT course',value: 20200.00, color: 'blue'},
				]
			},
			perPlan: {
				title: 'Per Plan',
				circleText: 'Total Revenue This Month',
				list: [
					{title: 'ISEE Monthly Plan',value: 20000, color: 'turquoise'},
					{title: 'ISEE Yearly Plan',value: 10000, color: 'turquoise-light'},
					{title: 'SSAT Monthly Plan',value: 12200, color: 'gold'},
					{title: 'SSAT Yearly Plan',value: 8000, color: 'gold-light'},
					{title: 'SSAT Yearly Plan',value: 12200, color: 'blue'},
					{title: 'SHSAT Yearly Plan',value: 8000, color: 'blue-light'},
				]
			}
		};
	}
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render(struct,{item});
	}
	flexible(){
		const _ = this;
		if(_.subSection == 'students') {
			return {
				'body': 'studentDashboardBody'
			}
		} else if (_.subSection == 'parents') {
			return {
				'body': 'parentsDashboardBody'
			}
		} else if (_.subSection == 'payments') {
			return {
				'body': 'paymentsDashboardBody'
			}
		}
	}
	domReady() {
		const _ = this;
		_.navigationInit();
		if (_.subSection == 'students') {
			_.statsBlockFill({data: _.userStats['stats'], selector: '.user-stats'});
			_.statsBlockFill({data: _.systemStats['stats'], selector: '.system-stats'});

			_.skillsLevelsFill(_.skillsLevelStatsData);
		}
		else if (_.subSection == 'parents') {
			_.statsBlockFill({data: _.parentStats['stats'], selector: '.user-stats'})
			_.newUsersFill(_.newUsersStatisticData['info']);
		}
		else if (_.subSection == 'payments') {
			_.comGraphCircleFill(_.purchasedCoursesAndPlansStatsData);
			//_.refundPerCourseFill();
			_.perCourseFill({selector:'.refunds .perCourse', data: _.refundsData.perCourse})
			_.perPlanFill({selector:'.refunds .perPlan', data: _.refundsData.perPlan})
			_.perCourseFill({selector:'.revenue .perCourse', data: _.revenueData.perCourse})
			_.perPlanFill({selector:'.revenue .perPlan', data: _.revenueData.perPlan})
		}
		_.switchSubNavigate();
	}

	setInteger(number){
		const _ = this;
		let string = '';
		if (number < 1000) {
			string = number.toString();
			let arr = string.split('.');
			if (!arr[1]) {
				string = string + '.';
				arr[1] = '';
			}
			for (let i = 0; i < 2 - arr[1].length; i++) {
				string = string + '0';
			}
		} else {
			string = number.toString().replace(_.division, '$&,');
			string = string.substr(0,string.length - 2) + 'k';
		}

		return string;
	}
	
	newUsersFill(data){
		const _ = this;
		let cont = _.f('.newUsers-list');
		_.clear(cont);
		cont.append(_.markup(_.newUsersStatisticFillTpl(data)));
	}

	skillsLevelsFill(data){
		const _ = this;
		let cont = _.f('.skills-level');
		for (let i = 0; i < data.length; i++) {

			let skillsRow = _.markupElement(_.skillsLevelStatsBlockTpl(data[i]));
			cont.append(skillsRow);

			let values = skillsRow.querySelectorAll('.skills-level-values');
			values.forEach(function (value,index){
				_.skillsLevelsItemFill({
					list:data[i]['blocks'][index]['list'],
					cont:value,
					max:data[i]['blocks'][index]['max']});
			})
		}
	}
	skillsLevelsItemFill({list,cont,max}){
		const _ = this;
		for (let j = 0; j < list.length; j++) {
			let item = list[j];
			if (!max) max = 4000;

			if (item.value) {
				let height = (item.value.text / max) * 227;
				cont.append(_.markupElement(_.skillsLevelStatsValueTpl({
					title: item['title'],
					value: {height:height,color:item.value.color}
				})))
			} else if (item.values.length) {

				let vals = [];

				for (let i = 0; i < item.values.length; i++) {
					vals.push({
						height: (item.values[i].value / max) * 227,
						color: item.values[i].color,
						width: (40 - (8 * item.values.length)) / item.values.length
					})
				}

				cont.append(_.markupElement(_.skillsLevelStatsValueTpl({
					title: item['title'],
					values: vals
				})))
			}
		}
	}

	comGraphCircleFill(data){
		const _ = this;
		for (let i = 0; i < data.length; i++) {

			let circleData = {
				title: data[i].sum.toString().replace(_.division, '$&,'),
				subtitle: data[i].title,
				list: data[i].circleValues
			};
			let linesData = {
				role: data[i].role,
				max: data[i].max
			};
			let row = _.markupElement(_.comGraphRowTpl({circleData,linesData}));
			_.f('.comGraph').append(row);

			_.drawCircleGraphic({data:data[i]['circleValues']},row.querySelector('.stars-circle '))
			_.skillsLevelsItemFill({
				list:data[i].list,
				cont:row.querySelector('.skills-level-values'),
				max:data[i].max
			});
		}
	}

	statsBlockFill(data){
		const _ = this;
		_.drawCircleGraphic(data);
		_.starsInformationFill(data);
	}
	drawCircleGraphic({data,selector},cont){
		const _ = this;
		if (!cont) cont = _.f(`${selector ?? ''} .stars-circle`);
		if (!cont) return;

		let prevSvg = cont.querySelector('SVG');
		if (prevSvg) prevSvg.remove();

		let svg = `</svg>`,

			radiuses = cont.getAttribute('data-radius'),
			radiusesArr = radiuses ? radiuses.split(',') : [93],
			radius = window.innerWidth < 768 ? radiusesArr[0] : radiusesArr[radiusesArr.length - 1],
			borders = cont.getAttribute('data-borders'),
			bordersArr = borders ? borders.split(',') : [7],
			borderWidth = window.innerWidth < 768 ? bordersArr[0] : bordersArr[bordersArr.length - 1],

			sum = 0,
			last,
			count = 0;

		/*
		* {title:'Monthly Plan',value:2945,color:'turquoise'},
			{title:'Yearly Plan',value:2200,color:'turquoise-light'},*/

		for (let i = 0; i < data.length; i++) {
			let number = parseInt(data[i]['value']);
			if (isNaN(number) || !number) continue;
			last = data[i]['title'];
			sum += number;
			count++;
		}

		let circleWidth = 2 * Math.PI * radius;
		let strokeDashoffset = 0;

		for (let i = 0; i < data.length; i++) {
			if (!data[i]['value'] || isNaN(parseInt(data[i]['value']))) continue;
			let width = data[i]['value'] / sum * circleWidth;
			if (data[i]['title'] !== last) {
				width -= borderWidth;
			} else {
				width += borderWidth * count;
			}
			let strokeDasharray = `${width} ${circleWidth - width}`;
			svg = `<circle class="${data[i]['color']}" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="-${strokeDashoffset}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
			strokeDashoffset += width;
		}

		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		svg = _.markupElement(svg);

		cont.prepend(svg);
	}
	starsInformationFill({data,selector}){
		const _ = this;
		let
			cont = _.f(`${selector ?? ''} .stars-info`),
			title = _.f(`${selector ?? ''} .circle-count-title`),
			sum = 0;
		_.clear(cont);

		for (let i = 0; i < data.length; i++) {
			let params = {
				cls:data[i]['color'],
				icon:data[i]['icon'],
				value:data[i]['value'].toString().replace(_.division, '$&,'),
				title:data[i]['title']
			};
			sum += parseInt(data[i]['value']);
			cont.append(_.markup(_.statsInfoTpl(params)));
		}

		title.textContent = sum.toString().replace(_.division, '$&,');
	}

	changeTimeFilter({item}){
		const _ = this;
		let
			cont = item.closest('.block'),
			dateTo = cont.querySelector('.to');

		let
			dateToParent = cont.querySelector('.admin-calendar'),
			txt = item.textContent;

		if (dateTo) {
			dateTo.previousElementSibling.remove();
			dateTo.remove();
		}

		let date = _.getDateForTo(txt);
		if (!date) return;

		let toLayout = `
			<span>to</span>
			<div class="admin-calendar-dates to">${_.dateFormatting({date:date,format:'Month DD, YYYY'})}</div>
			<input type="hidden" name="date_to" value="${_.dateFormatting({date:date})}">
		`;
		dateToParent.append(_.markup(toLayout));
	}
	dateFrom(format){
		const _ = this;
		_.curDate = new Date();
		return `
			<div class="admin-calendar-dates from">${_.dateFormatting({date:_.curDate,format})}</div>
			<input type="hidden" name="date_from" value="${_.dateFormatting({date:_.curDate})}">
		`;
	}
	dateTo(format,btns){
		const _ = this;
		if (!btns) return ''

		let activeBtnTxt;
		for (let key in btns) {
			if (btns[key]) {
				activeBtnTxt = key;
				break;
			}
		}

		let date = _.getDateForTo(activeBtnTxt);
		if (!date) return '';

		return `
			<span>to</span>
			<div class="admin-calendar-dates to">${_.dateFormatting({date:date,format})}</div>
			<input type="hidden" name="date_to" value="${_.dateFormatting({date:date})}">
		`;
	}
	getDateForTo(txt){
		const _ = this;
		let
			day = _.curDate.getDate(),
			month = _.curDate.getMonth(),
			year = _.curDate.getFullYear(),
			monthLengths = year % 4 ? [31,28,31,30,31,30,31,31,30,31,30,31] : [31,29,31,30,31,30,31,31,30,31,30,31],
			monthLength = monthLengths[month];

		if (txt === 'Today' || txt === 'All') return '';
		else if (txt === 'Week') day += 7;
		else if (txt === 'Month') month++;
		else if (txt === '6 Month') month += 6;
		else if (txt === '1 Year') year++;

		if (day > monthLength) {
			month++;
			day -= monthLength;
		}
		if (month > 11) {
			year++;
			month -= 12;
		}

		let newDateValue = year + '-' + (month + 1) + '-' + day;
		return new Date(newDateValue);
	}
	dateFormatting({format,date}){
		if (!format) format = 'YYYY-MM-DD';
		let
			day = date.getDate(),
			month = date.getMonth(),
			year = date.getFullYear(),
			months = ['January','February','March','April',"May",'June','July','August','September','October','November','December'],
			weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'],
			monthTitle = months[month],
			dayTitle = weekdays[date.getDay()];

		if (month < 10) month = '0' + month;
		if (day < 10) day = '0' + day;

		let result = format.replace('DD',day.toString());
		result = result.replace("Weekday",dayTitle);
		result = result.replace("MM",month.toString());
		result = result.replace("YYYY",year.toString());
		result = result.replace("Month",monthTitle);

		return result;
	}

	blockHeadNavigate({item}){
		const _ = this;
		let cont = item.parentElement,
			activeBtn = cont.querySelector('.active');

		if (activeBtn == item) return;

		activeBtn.classList.remove('active');
		item.classList.add('active')

		_.changeTimeFilter({item});
	}


	perCourseFill({selector,data}){
		const _ = this;

		let list = data.list;
		_.drawCircleGraphic({selector:selector,data:list});

		let
			perCourseList = _.f(`${selector} .perItemBlock-list`),
			listTpl = '',
			sum = 0;
		for (let i = 0; i < list.length; i++) {
			listTpl += _.perCourseRowTpl(list[i]);
			sum += list[i].value;
		}

		sum = _.setInteger(sum);

		perCourseList.append(_.markup(listTpl));
		_.f(`${selector} .circle-count-title`).textContent = '$' + sum;
	}
	perPlanFill({selector,data}){
		const _ = this;

		let list = data.list;
		_.drawCircleGraphic({selector:selector,data:list});

		let
			perCourseList = _.f(`${selector} .perItemBlock-list`),
			listTpl = '',
			sum = 0;
		for (let i = 0; i < list.length; i++) {
			listTpl += _.markerInfoTpl({color: list[i].color,title:list[i].title,value: '$'+_.setInteger(list[i].value)});
			sum += list[i].value;
		}

		sum = _.setInteger(sum);

		perCourseList.append(_.markup(listTpl));
		_.f(`${selector} .circle-count-title`).textContent = '$' + sum;
	}


	async init() {
		const _ = this;
	}
}