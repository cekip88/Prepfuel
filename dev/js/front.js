import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
import GSelect from "./components/select/select.component.js"
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    G_Bus.on('navigate',_.navigate.bind(_))
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

  navigationInit(list) {
    const _ = this;
    if (!list) return;
    _.setActiveNavItem(list);

    window.addEventListener('resize',()=>{
      let activeBtn = list.querySelector('.active');
      if (activeBtn) _.showActiveNavItem(activeBtn,list);
    })
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
  navigate(clickData){
    const _ = this;
    let
      list = clickData.item,
      target = clickData.event.target,
      btn = _.ascent(target,'navigate-item','navigate-list');

    _.showActiveNavItem(btn,list);
    _.changeActiveNavItem(btn)
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

  init(){
    const _ = this;
    _.navigationInit(document.querySelector('.navigate-list'));
  }
}
new Front();
