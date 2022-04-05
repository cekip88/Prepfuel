import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
import GInput from "./components/input/input.component.js";
import GSelect from "./components/select/select.component.js";
import Modaler from "./components/modaler/modaler.component.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    G_Bus.on('navigate',_.navigate.bind(_))
      .on('subnavigate',_.subnavigate.bind(_))
      .on('getSessions',_.getSessions.bind(_))
      .on('showHidden',_.showHidden.bind(_))
      .on('showNote',_.showNote.bind(_))
  }

  ascent(item,targetSelector,endCls){
    if (targetSelector[0] === '.') {
      while(!item.classList.contains(targetSelector.substr(1))) {
        item = item.parentElement;
        if (item.classList.contains(endCls)) {
          break;
          return;
        }
      }
    } else if (targetSelector[0] === '#') {
      while(!item.id === targetSelector) {
        item = item.parentElement;
        if (item.classList.contains(endCls)) {
          break;
          return;
        }
      }
    } else {
      while(!item.tagName === targetSelector) {
        item = item.parentElement;
        if (item.classList.contains(endCls)) {
          break;
          return;
        }
      }
    }
    return item;
  }
  removeCls(item,cls) {
    if (item) item.classList.remove(cls)
  }

  showNote(){
    G_Bus.trigger('showModal',{
      type: 'html',
      target: '#modal'
    });
  }


  showHidden(clickData){
    const _ = this;
    let btn = clickData.item,
      cont = btn.nextElementSibling;
    if (cont.classList.contains('active')) {
      cont.classList.remove('active');
      btn.classList.remove('active');
    } else {
      cont.classList.add('active');
      btn.classList.add('active');
    }
  }

  // get list of sessions
  getSessions(clickData){
    const _ = this;

  }


  getStarsInfo(){
    return {
      orange:1500,
      red:1500,
      green: 1000,
      blue: 1500,
      violet: 2500,
      turquoise: 345,
      gold: 0
    }
  }
  showCircleGraphic(data){
    const _ = this;
    let starsCont = _.f('.stars-circle');
    if (!starsCont) return;

    let svg = `</svg>`;
    let radius = window.innerWidth < 768 ? 106 : 134;
    let sum = 0;
    let last;
    let count = 0;
    for (let key in data) {
      let number = parseInt(data[key]);
      if (isNaN(number) || !number) continue;
      last = key;
      sum += number;
      count++;
    }

    let circleWidth = 2 * Math.PI * radius;
    let strokeDashoffset = 0;

    for (let key in data) {
      if (!data[key] || isNaN(parseInt(data[key]))) continue;
      let width = data[key] / sum * circleWidth;
      if (key !== last) {
        width -= 14 / (count - 1);
      } else width += 14;
      let strokeDasharray = `${width} ${circleWidth - width}`;
      svg = `<circle class="${key}" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="-${strokeDashoffset}" stroke-linecap="round" cx="50%" cy="50%"></circle>` + svg;
      strokeDashoffset += width;
    }

    svg = '<svg xmlns="http://www.w3.org/2000/svg">' + svg;
    svg = _.markupElement(svg);

    starsCont.prepend(svg);
  }


  // methods to navigate blocks from main nav and sub main nav
  navigationInit(list) {
    const _ = this;
    if (!list) return;
    _.setActiveNavItem(list);

    window.addEventListener('resize',()=>{
      let activeBtn = list.querySelector('.active');
      if (activeBtn) _.showActiveNavItem(activeBtn,list);
    })
  }
  navigate(clickData){
    const _ = this;
    let
      list = clickData.item,
      target = clickData.event.target,
      btn = _.ascent(target,'.navigate-item','navigate-list');

    _.showActiveNavItem(btn,list);
    _.changeActiveNavItem(btn);
  }
  subnavigate(clickData){
    const _ = this;
    if (!clickData) return;
    let
      target = clickData.event.target,
      btn = _.ascent(target,'.subnavigate-button','subnavigate');

    _.changeActiveNavItem(btn);
  }
  setActiveNavItem(list){
    const _ = this;
    let
      container = list.closest('.navigate'),
      activeItemSelector = container.getAttribute('data-active'),
      newActiveBtn = list.querySelector(activeItemSelector),
      activeBtn = list.querySelector('.active');
    if (newActiveBtn) {
      container.removeAttribute('data-active');
      _.navigate({item:list, event:{target:newActiveBtn}})
    } else if (activeBtn){
      _.navigate({item:list, event:{target:activeBtn}})
    }
  }
  changeActiveNavItem(item){
    const _ = this;
    let
      cont = item.parentElement,
      curItem = cont.querySelector('.active');
    _.removeCls(curItem,'active');
    item.classList.add('active')
  }
  showActiveNavItem(btn,list){
    let
      width = btn.clientWidth,
      x = btn.offsetLeft,
      label = list.querySelector('.navigate-label');
    label.style = `display:block;width: ${width}px;left: ${x}px;`;
  }
  changeTab(btn,parentCls){
    const _ = this;
    let
      list = btn.parentElement.children,
      parent = btn.closest('.' + parentCls),
      targetSelector = parent.getAttribute('data-tabs'),
      tabsContainer = _.f(targetSelector);

    if (!targetSelector || !tabsContainer) return;

    _.removeCls(tabsContainer.querySelector(`${targetSelector}>.active`),'active');
    for (let i = 0; i < list.length; i++) {
      if (list[i] === btn && tabsContainer.children[i]) tabsContainer.children[i].classList.add('active');
    }
  }

  init(){
    const _ = this;
    _.navigationInit(document.querySelector('.navigate-list'));

    let data = _.getStarsInfo();
    _.showCircleGraphic(data);

    let subNav = _.f('.subnavigate-button.active');
    if (subNav) _.subnavigate({event:{target:subNav}});
  }
}
new Front();
