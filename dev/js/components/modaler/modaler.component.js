import { G_Bus } from "../../../libs/G_Control.js";
import GComponent from "../g.component.js";
export default class GModaler extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();
	}
	define(){
		const _ = this;
		_.componentName = 'modaler';
		G_Bus
			.on(_,['showModal','closeModal']);
		_.on('closeModal',_.closeModal.bind(_))
		_.on('cancelCloseModal',_.cancelCloseModal.bind(_))
		
	}
	cancelCloseModal(mouseupData){
		const _ = this;
		mouseupData['event'].preventDefault();
	}
	closeModal(modalData){
		const _ = this;
		let targetContent = _.querySelector('.modaler-content');
		if(!targetContent) return void 'Modaler content not found';
		targetContent.classList.remove('modaler-content');
		_.targetContentParent.append(targetContent);
		_.modalCont.classList.remove('active');
	}
	hideShadow(){
		const _ = this;
		_.modalCont.classList.remove('modaler-shadow');
	}
	showModal(modalData){
		const _ = this;
		let
			showShadow = modalData['showShadow'] ?? true,
			targetContent = document.querySelector(modalData['target']);
		targetContent.setAttribute('slot','modal-item')
		if(!targetContent) return void 0;
		targetContent.classList.add('modaler-content');
		_.targetContentParent = targetContent.parentNode;
		_.modalCont.classList.add('active');
		
		if(!showShadow) {
			_.hideShadow();
		}else{
			modalData['shadowClass'] ? _.modalCont.classList.add(modalData['shadowClass']) : _.modalCont.classList.add('modaler-shadow');
		}
		_.append(targetContent);
	}
	
	setContent(content){
		const _ = this;
		_.shadow.innerHTML = content();
		
		_.modalCont = _.shadow.querySelector('.modaler-cont');
		_.modalInner = _.shadow.querySelector('.modaler-inner');
		_.modalHeader = _.shadow.querySelector('.modaler-header');
		_.modalBody = _.shadow.querySelector('.modaler-body');
		_.modalClose = _.shadow.querySelector('.modaler-close');
	}
	async connectedCallback(){
		const _ = this;
		await _.initShadow();
		_.mainTpl = _.getTpl('modaler');
		
		_.setContent(_.mainTpl);

		_.trigger('appended');
	}
	disconnectedCallback(){
	}
	static get observedAttributes() {
		return [];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		const _ = this;
	}
}
customElements.define("g-modaler", GModaler);
document.body.append(document.createElement('g-modaler'));
