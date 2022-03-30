import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
import GSelect from "./components/select/select.component.js"
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    G_Bus.on('navigate',_.navigate.bind(_))
      .on('subnavigate',_.subnavigate.bind(_))
      .on('getSessions',_.getSessions.bind(_))
  }

  ascent(item,targetCls,endCls){
    while(!item.classList.contains(targetCls)) {
      item = item.parentElement;
      if (item.classList.contains(endCls)) {
        break;
        return;
      }
    }
    return item;
  }
  removeCls(item,cls) {
    if (item) item.classList.remove(cls)
  }


  // get list of sessions
  getSessions(clickData){
    const _ = this;

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
      btn = _.ascent(target,'navigate-item','navigate-list');

    _.showActiveNavItem(btn,list);
    _.changeActiveNavItem(btn);
  }
  subnavigate(clickData){
    const _ = this;
    if (!clickData) return;
    let
      target = clickData.event.target,
      btn = _.ascent(target,'subnavigate-button','subnavigate');

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
    _.subnavigate({event:{target:_.f('.subnavigate-button.active')}})
  }
}
new Front();
