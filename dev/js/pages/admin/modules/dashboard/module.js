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
				{title: 'Students registered to ISEE course', color:'turquoise', count: 2945},
				{title: 'Students registered to SSAT course', color:'gold', count: 2200},
				{title: 'Students registered to SHSAT course', color:'blue', count: 2200},
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
			buttons:{'ISEE':'active', 'SSAT':'', 'SHSAT':''},
			gap:false,
		};
		_.systemStats = {
			info:{
				title:'Stars Earned In The System',
				subtitle:'More than 800k+ stars earned by students',
				countText:'Stars Earned by Students'
			},
			stats: [
				{title: 'Earned for Skills Practice', color:'orange', count:390450},
				{title: 'Earned for Practice Tests', color:'blue', count:136600},
				{title: 'Earned for Videos Watched', color: 'violet', count: 136600},
				{title: 'Earned for Reviewed Questions', color: 'turquoise', count: 136695}
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
		_.skillsLevelStatsTplData = {
			title: 'Students Skills Level Stats By Section',
			subtitle: 'Most of the students achieved level 3',
			gap: false,
			buttons: {'Verbal Reasoning':'','Quantitative Reasoning':'','Reading Comprehension':'','Mathematics Achievement':'active'}
		};
		_.skillsLevelStatsData = [
			{
				title: 'Algebra, Equations, and Inequalities',
				blocks: [{
					title: 'Algebraic Remainders',
					list: [
						{value:1600,title:'lvl 1'},
						{value:2000,title:'lvl 2'},
						{value:3250,title:'lvl 3'},
						{value:750,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Backsolving Strategy',
					list: [
						{value:700,title:'lvl 1'},
						{value:2850,title:'lvl 2'},
						{value:3250,title:'lvl 3'},
						{value:2750,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Evaluate algebraic expressions',
					list: [
						{value:1300,title:'lvl 1'},
						{value:800,title:'lvl 2'},
						{value:2250,title:'lvl 3'},
						{value:1950,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Inequalities',
					list: [
						{value:1600,title:'lvl 1'},
						{value:2000,title:'lvl 2'},
						{value:3250,title:'lvl 3'},
						{value:750,title:'lvl 4'},
					],
					role: 'Students'
				}]
			},{
				title: 'Arithmetic and Fractions',
				blocks: [{
					title: 'Consecutive numbers',
					list: [
						{value:3600,title:'lvl 1'},
						{value:2200,title:'lvl 2'},
						{value:3150,title:'lvl 3'},
						{value:750,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Math basics: Absolute value',
					list: [
						{value:1600,title:'lvl 1'},
						{value:2000,title:'lvl 2'},
						{value:3250,title:'lvl 3'},
						{value:750,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Math basics: Converting between decimals, fractions, and percents',
					list: [
						{value:1600,title:'lvl 1'},
						{value:1500,title:'lvl 2'},
						{value:2250,title:'lvl 3'},
						{value:2750,title:'lvl 4'},
					],
					role: 'Students'
				},{
					title: 'Inequalities',
					list: [
						{value:1600,title:'lvl 1'},
						{value:1200,title:'lvl 2'},
						{value:3550,title:'lvl 3'},
						{value:1750,title:'lvl 4'},
					],
					role: 'Students'
				}]
			}
		];
	}
	async changeSection({item,event}) {
		const _ = this;
		let section = item.getAttribute('section');
		_.moduleStructure = {
			'body': _.flexible(section),
		};
		await _.render();
	}
	flexible(section){
		const _ = this;
		// desired tpl
		if(section == 'students') {
			return _.studentDashboardBody();
		}
	}
	
	
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.division = /\d{1,3}(?=(\d{3})+(?!\d))/g;


		G_Bus
			.on(_,['domReady'])
	}
	domReady() {
		const _ = this;
		_.showCircleGraphic({data: _.userStats['stats'], selector: '.user-stats'});
		_.showCircleGraphic({data: _.systemStats['stats'], selector: '.system-stats'});

		_.skillsLevelFill(_.skillsLevelStatsData);
	}
	skillsLevelFill(data){
		const _ = this;
		let cont = _.f('.skills-level');
		for (let i = 0; i < data.length; i++) {
			let skillsRow = _.markupElement(_.skillsLevelStatsBlockTpl(data[i]));
			cont.append(skillsRow);
			let values = skillsRow.querySelectorAll('.skills-level-values');
			values.forEach(function (value,index){
				for (let j = 0; j < data[i]['blocks'][index]['list'].length; j++) {
					let item = data[i]['blocks'][index]['list'][j];
					let
						max = 4000,
						height = (item.value / max) * 227;
					value.append(_.markupElement(_.skillsLevelStatsValueTpl({
						title: item['title'],
						value: height
					})))
				}
			})
		}
	}

	showCircleGraphic(data){
		const _ = this;
		_.drawCircleGraphic(data);
		_.starsInformationFill(data);
	}
	drawCircleGraphic({data,selector}){
		const _ = this;
		let starsCont = _.f(`${selector ?? ''} .stars-circle`);
		if (!starsCont) return;

		let prevSvg = starsCont.querySelector('SVG');
		if (prevSvg) prevSvg.remove();

		let svg = `</svg>`,

			radiuses = starsCont.getAttribute('data-radius'),
			radiusesArr = radiuses ? radiuses.split(',') : [93],
			radius = window.innerWidth < 768 ? radiusesArr[0] : radiusesArr[radiusesArr.length - 1],
			borders = starsCont.getAttribute('data-borders'),
			bordersArr = borders ? borders.split(',') : [7],
			borderWidth = window.innerWidth < 768 ? bordersArr[0] : bordersArr[bordersArr.length - 1],

			sum = 0,
			last,
			count = 0;

		for (let i = 0; i < data.length; i++) {
			let number = parseInt(data[i]['count']);
			if (isNaN(number) || !number) continue;
			last = data[i]['title'];
			sum += number;
			count++;
		}

		let circleWidth = 2 * Math.PI * radius;
		let strokeDashoffset = 0;

		for (let i = 0; i < data.length; i++) {
			if (!data[i]['count'] || isNaN(parseInt(data[i]['count']))) continue;
			let width = data[i]['count'] / sum * circleWidth;
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

		starsCont.prepend(svg);
	}
	starsInformationFill({data,selector,count}){
		const _ = this;
		let
			cont = _.f(`${selector ?? ''} .stars-info`),
			title = _.f(`${selector ?? ''} .circle-count-title`),
			sum = 0;
		_.clear(cont);

		for (let i = 0; i < data.length; i++) {
			let params = {
				cls:data[i]['color'],
				value:data[i]['count'].toString().replace(_.division, '$&,'),
				title:data[i]['title']
			};
			sum += parseInt(data[i]['count']);
			cont.append(_.markup(_.statsInfoTpl(params)));
		}

		title.textContent = sum.toString().replace(_.division, '$&,');
	}



	async init() {
		const _ = this;
	}
}