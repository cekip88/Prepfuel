import { G_Bus } from "./libs/G_Control.js";
import { G } from "./libs/G.js";
import { router } from "./router.js";
import GModaler from "./components/modaler/modaler.component.js";

import GInput from "../../components/input/input.component.js";
import GSelect from "../../components/select/select.component.js";
class Front extends G{
  constructor(){
    super();
    const _ = this
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




  async init(){
    const _ = this;

  /*  let data = _.getStarsInfo();
	  console.log(data);
    _.showCircleGraphic(data);
*/
	}
}


( async ()=>{
	let worker = navigator.serviceWorker.register('/worker.js',{scope:'/'});
	if(!navigator.serviceWorker.controller) location.reload();
})()


let pops = [];
pops.forEach(function (ident){
	let item = document.querySelector(ident);
	if (item) {
		setTimeout(function (){
			G_Bus.trigger('modaler','showModal', {type:'html',target:ident});
		},100)
	}
})


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
				'/admin/profile': 'admin',
				'/admin/users': 'admin',
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



window.MathJax = {
	loader: {load: ['input/asciimath']},
	startup: {
		pageReady: function () {
			let
				renderer = MathJax.startup.document.menu.settings.renderer,
				menu = MathJax.startup.document.menu.menu,
				item = (menu.getPool ? menu.getPool() : menu.pool).lookup('renderer');
			if (renderer !== 'CHTML') item.setValue(renderer);
			return MathJax.startup.defaultPageReady();
		}
	},
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		processEscapes: true
	}
};

//
//  Load MathJax
//
let script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
script.setAttribute('id', 'MathJax-script');
document.head.appendChild(script);