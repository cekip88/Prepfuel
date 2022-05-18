import {G_Bus} from "../../../../libs/G_Control.js";
import {G} from "../../../../libs/G.js";
import { Model } from "./model.js";

export class ProfileModule extends G {
	define() {
		const _ = this;
	}
	
	init() {
		const _ = this;
	}
	
	render() {
		const _ = this;
		_.fillPartsPage([
			{part: "body", content: _.markup(_.profileTpl(), false)}]
		);
	}
}