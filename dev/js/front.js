// Language: javascript
// Path: dev\js\router.js
// Compare this snippet from dev\js\router.js:
import { router } from "./router.js";
import GModaler from "./components/modaler/modaler.component.js";
import GInput from "../../components/input/input.component.js";
import GSelect from "../../components/select/select.component.js";

(async() => {
	let worker = await navigator.serviceWorker.register("/worker.js", {scope: "/"});
	/*setTimeout( ()=>{
		if(!navigator.serviceWorker.controller) {
			console.log('test')
			location.reload();
		}
	}, 5000);*/
	navigator.serviceWorker.ready;
	if(!navigator.serviceWorker.controller) location.reload();
})();

new router().init({
	"middleware": {
		"guest": {
			routes: {
		/*		"/login": "login",
				"/login/forgot": "login",
				"/login/reset/{token}": "login",
				"/login/confirm/{token}": "login",*/
			}
		},
		"admin": {
			routes: {
				"/admin": "admin",
				"/admin/dashboard": "admin",
				"/admin/dashboard?test=10": "admin",
				"/admin/profile": "admin",
				"/admin/users": "admin",
				"/admin/courses": "admin",
				"/admin/dashboard?redirect=google": "admin",
			}
		},
		"parent": {
			routes: {
				"/parent/dashboard": "parent",
				"/parent/dashboard?redirect=google": "parent",
			}
		},
		"student": {
			routes: {
				"/profile": "student",
				"/student/profile": "student",
				"/student/dashboard": "student",
				"/student/tests": "student",
				"/student/practice": "student",
				"/student/schedule": "student",
				"/student/dashboard?redirect=google": "student",
			}
		},
		"student|admin|parent|guest": {
			routes: {
				"/login": "login",
				"/login/forgot": "login",
				"/login/reset/{token}": "login",
				"/login/confirm/{token}": "login",
			}
		}
	},
});



window.MathJax = {
	loader: {load: ["input/asciimath"]},
	startup: {
		pageReady: function() {
			let
			renderer = MathJax.startup.document.menu.settings.renderer,
			menu = MathJax.startup.document.menu.menu,
			item = (menu.getPool ? menu.getPool() : menu.pool).lookup("renderer");
			if(renderer !== "CHTML") item.setValue(renderer);
			return MathJax.startup.defaultPageReady();
		}
	},
	tex: {
		inlineMath: [["$", "$"], ["\\(", "\\)"]],
		processEscapes: true
	}
}

//
//  Load MathJax
//
let script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
script.setAttribute("id", "MathJax-script");
document.head.appendChild(script);


jwplayer.key = 'IxoNkD9fmtZj8cmwL505UXs5PdXJj1nhpFuCDgKe4V4=';
