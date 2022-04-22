import { G } from "../../libs/G.js";

export class NotFoundPage extends G{
	async render(){
		const _ = this;
		_.header = await _.getBlock({name:'header'},'blocks');
		_.fillPage([
			_.markup(_.header.render()),
			_.markup(`
				<div class="section">
					<h1> Page is not found, sorry. Go do something else</h1>
				</div>
			`),
		]);
	}
}