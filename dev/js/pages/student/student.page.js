import { G_Bus }        from "../../libs/G_Control.js";
import { G }            from "../../libs/G.js";
import { studentModel } from "./studentModel.js";
import GInput           from "../../components/input/input.component.js";

class StudentPage extends G{
	constructor() {
		super();
		
	}
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPartsPage([
			{ part:'header', content:_.markup(_.header.render(),false)},
			//{ part:'body', content: await _.flexible('welcome')}
		]);
	}
}

export { StudentPage }