import {G_Bus} from "../../../../libs/G_Control.js";
import { Model } from "./model.js";
import {StudentPage} from "../../student.page.js";

export class PracticeModule extends StudentPage{
	constructor(props) {
		super(props);
		this.moduleStructure = {
			'header':'fullHeader',
			'header-tabs':'studentTabs',
			'body-tabs':'practiceTabs',
			'body':'practiceBody',
			'footer':'studentFooter'
		};
	}
	async asyncDefine(){
		const _ = this;

	}
	define() {
		const _ = this;
		_.componentName = 'practice';
		_.subSection = 'practiceComprehension';
		_.activeTab = null;

		G_Bus.on(_,[
			'domReady',
			'changeSection',
			'changePracticeTab',
		])
	}
	domReady(){
		const _ = this;

		_.switchSubNavigate();
		let tabBtn = _.changeActiveTab();
		_.changePracticeTab({item:tabBtn})
	}


	// navigate methods
	async changeSection({item,event}) {
		const _ = this;
		_.subSection = item.getAttribute('section');
		let struct = _.flexible();
		await _.render(struct,{item});
	}
	flexible(){
		const _ = this;
		if(_.subSection === 'practice') {
			return {
				'body': 'practiceBody'
			}
		} else if (_.subSection === 'reports') {
			return {
				'body': 'reportsBody'
			}
		}
	}
	switchSubNavigate(){
		const _ = this;
		let cont = _.f('.subnavigate');
		if(!cont.querySelector(`[section="${_.subSection}"]`)) return 0;
		if(cont.querySelector('.active'))	cont.querySelector('.active').classList.remove('active');
		cont.querySelector(`[section="${_.subSection}"]`).classList.add('active')
	}
	async changePracticeTab({item}) {
		const _ = this;
		_.activeTab = item.getAttribute('data-pos');
		item.parentNode.querySelector('.active').classList.remove('active');
		item.classList.add('active');
		let inner = _.f('#bodyInner');
		if (_.activeTab == 0){
			_.clear(inner)
		}
		else if (_.activeTab == 2){
			_.clear(inner)
			let headerData = {
				title: 'Your Diagnostics Recomendations',
				subtitle: ['Take these 4 quizzes or a full test to unlock your practice recommendations','Today’s schedule: 5 / 10 questions completed'],
				gap: false,
				titlesData: {
					titleCls: 'practice-title practice-block-title',
					subtitleCls: 'practice-block-subtitle'
				}
			}
			inner.append(_.markup(_.practiceTasksTpl(headerData)))
			_.rcQuizFill();
		}
		else if (_.activeTab == 3){
			_.clear(inner)
			let headerData = {
				title: 'Your Diagnostics Recomendations',
				subtitle: ['Skills recommended for you based on your past practice and frequency on the exam','Today’s schedule: 5 / 10 questions completed'],
				gap: false,
				icon: {
					href:'graphic-2',
					color: '0,175,175',
				},
				titlesData: {
					titleCls: 'practice-title practice-block-title',
					subtitleCls: 'practice-block-subtitle'
				}
			}
			inner.append(_.markup(_.practiceTasksTpl(headerData)))
			_.rcPracticeFill();
			inner.append(_.markup(_.practiceAchievementTpl()));
			_.rcAchievementFill();
		}
		else if (_.activeTab == 7){
			_.clear(inner);
			inner.append(_.markup(_.reportsAchievemntTpl()));

			let summaryInfo = await Model.getSummaryInfo();
			let summaryBlock = inner.querySelector('#summaryList');
			_.clear(summaryBlock)
			summaryBlock.append(_.markup(_.summaryBlockFill(summaryInfo)));

			let reportsInfo = Model.getReports();
			let reportsCont = inner.querySelector('#reports-table');
			_.clear(reportsCont);
			reportsCont.append(_.markup(_.reportsTableFill(reportsInfo)))

		}
	}
	// end navigate methods


	//change methods
	changeActiveTab(){
		const _ = this;
		let
			btn = _.f('.section-button[data-pos="${_.activeTab}"]'),
			tempBtn = undefined;

		if (_.activeTab == 3) {
			tempBtn = _.f('.section-button[data-pos="7"]');
		} else if (_.activeTab == 7) {
			tempBtn = _.f('.section-button[data-pos="3"]');
		}

		return tempBtn ?? btn ?? _.f('.section-button')[0];
	}
	// end change methods


	// Fill methods
	async rcQuizFill(){
		const _ = this;
		let quizData = await Model.getQuizInfo();
		let cont = _.f('.practice-task-list');
		let itemsTpl = _.taskItemsTpl(quizData);
		_.clear(cont);
		if (!itemsTpl.length) return;
		cont.append(...itemsTpl);
	}
	async rcPracticeFill(){
		const _ = this;
		let practiceData = await Model.getPracticeInfo();
		let cont = _.f('.practice-task-list');
		let itemsTpl = _.taskItemsTpl(practiceData);
		_.clear(cont);
		if (!itemsTpl.length) return;
		cont.append(...itemsTpl);
	}
	async rcAchievementFill(){
		const _ = this;
		let achieveData = await Model.getAchievementInfo();
		let cont = _.f('.practice-achievement-list');
		_.clear(cont)
		for (let item of achieveData) {
			let listTpl = _.achievementItemsTpl(item);
			if (!listTpl) continue;
			cont.append(_.markup(listTpl));
		}
	}
	//end fill methods
}