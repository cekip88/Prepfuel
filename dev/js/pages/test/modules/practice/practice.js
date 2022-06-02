import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import {model} from "./model.js";

export class PracticeModule extends G {
	define() {
		const _ = this;
	}
	
	init() {
		const _ = this;
	}
	
	render() {
		const _ = this;
		_.fillPartsPage([
			{part: "body", content: _.markup("<div class='section'> <h2> Module page </h2></div>", false)}]
		);
	}
}