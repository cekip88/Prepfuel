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
			'body':'dashboardBody',
		};
	}
	
	
	async asyncDefine(){
		const _ = this;
		_.userStats = {
			'Students registered to ISEE course': {color:'turquoise',count: 2945},
			'Students registered to SSAT course': {color:'gold',count: 2200},
			'Students registered to SHSAT course': {color:'blue',count: 2200},
		};
		_.systemStats = {
			'Earned for Skills Practice': {color:'orange',count:390450},
			'Earned for Practice Tests': {color:'blue',count:136600},
			'Earned for Videos Watched': {color: 'violet',count: 136600},
			'Earned for Reviewed Questions': {color: 'turquoise',count: 136695}
		}
	}
	define() {
		const _ = this;
		_.componentName = 'Dashboard';
		_.division = /\d{1,3}(?=(\d{3})+(?!\d))/g;
		_.averageTestScoreData = {
			title:'Average test score improvement',
			subtitle:'This is how students improved their results',
			buttons: {
				'Week':'',
				'Month':'',
				'6 Month':'active',
				'1 Year':'',
				'All':'',
			}
		}
		G_Bus
			.on(_,['domReady'])
	}
	domReady(){
		const _ = this;
		_.showCircleGraphic(_.userStats,'.user-stats');
		_.showCircleGraphic(_.systemStats,'.system-stats');
	}
	showCircleGraphic(data,selector){
		const _ = this;
		_.drawCircleGraphic(data,selector);
		_.starsInformationFill(data,selector);
	}
	drawCircleGraphic(data,selector){
		const _ = this;
		let starsCont = _.f(`${selector ?? ''} .stars-circle`);
		if (!starsCont) return;

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

		for (let key in data) {
			let number = parseInt(data[key]['count']);
			if (isNaN(number) || !number) continue;
			last = key;
			sum += number;
			count++;
		}

		let circleWidth = 2 * Math.PI * radius;
		let strokeDashoffset = 0;

		for (let key in data) {
			if (!data[key]['count'] || isNaN(parseInt(data[key]['count']))) continue;
			let width = data[key]['count'] / sum * circleWidth;
			if (key !== last) {
				width -= borderWidth;
			} else {
				width += borderWidth * count;
			}
			let strokeDasharray = `${width} ${circleWidth - width}`;
			svg = `<circle class="${data[key]['color']}" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="-${strokeDashoffset}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
			strokeDashoffset += width;
		}

		svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
		svg = _.markupElement(svg);

		starsCont.prepend(svg);
	}
	starsInformationFill(data,selector){
		const _ = this;
		let
			cont = _.f(`${selector ?? ''} .stars-info`),
			title = _.f(`${selector ?? ''} .circle-count-title`),
			sum = 0;

		for (let key in data) {
			let params = {cls:data[key]['color'],value:data[key]['count'].toString().replace(_.division, '$&,'),title:key};
			sum += parseInt(data[key]['count']);
			cont.append(_.markup(_.starInfoTpl(params)));
		}

		title.textContent = sum.toString().replace(_.division, '$&,');
	}
	starInfoTpl({cls,value,title}){
		return `
			<li class="stars-info-item ${cls}">
				<div class="stars-info-img">
					<svg>
						<use xlink:href="#user"></use>
					</svg>
				</div>
				<div class="stars-info-text"><strong>${value}</strong><span>${title}</span></div>
			</li>
		`
	}


	async init() {
		const _ = this;
	}
	
	
}