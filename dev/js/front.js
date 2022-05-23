import { G_Bus } from "./libs/G_Control.js";
//import { G } from "./libs/G.js";
import { router } from "./router.js";
import GModaler from "./components/modaler/modaler.component.js";

import GInput from "../../components/input/input.component.js";
import GSelect from "../../components/select/select.component.js";
/*class Front extends G{
  constructor(){
    super();
    const _ = this;
/!*    G_Bus
      .on('navigate',_.navigate.bind(_))
      .on('subnavigate',_.subnavigate.bind(_))
      .on('showHidden',_.showHidden.bind(_))
      .on('setRoute',_.setRoute.bind(_))*!/
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


 

  async init(){
    const _ = this;
    _.navigationInit(document.querySelector('.navigate-list'));

    let data = _.getStarsInfo();
    _.showCircleGraphic(data);

    let subNav = _.f('.subnavigate-button.active');
    if (subNav) _.subnavigate({event:{target:subNav}});

	}
}*/
( async ()=>{
	let worker = navigator.serviceWorker.register('/worker.js',{scope:'/'});
	if(!navigator.serviceWorker.controller) location.reload();
})()

setTimeout(function (){
	G_Bus.trigger('modaler','showModal', {type:'html',target:'#schedule-result'});
},100)



new router().init({
  'middleware':{
		'guest':{
			routes:{
				'/login': 'login',
				'/login/forgot': 'login',
				'/login/reset/{token}': 'login',
			}
		},
		'admin':{
			routes:{
				'/admin': 'admin',
				'/admin/dashboard': 'admin',
			}
		},
		'student':{
			routes:{
				'/profile': 'student',
				'/student/profile': 'student',
				'/student/dashboard': 'student',
				'/student/tests': 'student',
				'/student/practice': 'student',
			}
		},
		'student|admin':{
			routes:{
				'/test': 'test',
			}
		}
	},
});