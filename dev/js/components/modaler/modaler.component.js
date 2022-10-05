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
		G_Bus.trigger(_.componentName,'closeModal',modalData);
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
		if(modalData['closeBtn'] == 'hide' || modalData['closeBtn'] == false){
			_.modalClose.style.display = 'none';
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
	
	styleSheets() {
		return `
			${super.styleSheets()}
			.modaler-cont {
			  width: 100vw;
			  height: 100%;
			  position: fixed;
			  padding-right: 5px;
			  top: 0;
			  left: 0;
			  display: none;
			  z-index: 900;
			  overflow-y: scroll;
			}
			.modaler-cont.active {
			  display: flex;
			  justify-content: center;
			  flex-direction: column;
			  align-items: center;
			}
			.modaler-shadow {
			  background-color: rgba(0,0,0,.29);
			}
			.modaler-inner {
			  overflow-y: auto;
			  position: relative;
			  background-color: #fff;
			  border-radius: 12px;
			  box-shadow: 0 0 40px rgba(56, 71, 109, 0.29);
			}
			.modaler-close {
			  width: 22px;
			  height: 22px;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  margin-left: auto;
			  cursor: pointer;
			  position: absolute;
			  right: 10px;
			  top: 20px;
			}
			.modaler-close:before, .modaler-close:after {
			  width: 3px;
			  height: 20px;
			  display: block;
			  content: "";
			  background-color: #DADADA;
			  position: absolute;
			}
			.modaler-close:before {
			  transform: rotate(45deg);
			}
			.modaler-close:after {
			  transform: rotate(-45deg);
			}
			
			@media screen and (min-width: 768px) {
			  .modaler-close {
			    top: 30px;
			    right: 38px;
			  }
			}
			@media screen and (min-width: 1170px) {
			  .modaler-cont {
			    align-items: center;
			    justify-content: center;
			  }
			}
		`;
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
