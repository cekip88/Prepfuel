import {env} from "/env.js";
import {G_Bus} from "../../../../libs/G_Control.js";
class _Model {
	constructor() {
		const _ = this;

	}
	getFolderData(id = null){
		let data = [
				{
					'_id':'folder1',
					'title': 'ISEE Upper',
					'type': 'folder',
					'modified': '2021-05-1',
				},{
					'_id':'folder2',
					'title': 'ISEE Middle',
					'type': 'folder',
					'modified': '2021-05-1'
				},{
					'_id':'folder3',
					'title': 'ISEE Lower',
					'type': 'folder',
					'modified': '2021-05-1',
					'parentId': 'folder1'
				},{
					'_id':'file1',
					'title': 'SSAT Upper',
					'type': 'file',
					'modified': '2021-05-1',
					'parentId': 'folder1',
				},{
					'_id':'file2',
					'title': 'SSAT Upper',
					'type': 'file',
					'modified': '2021-05-1',
					'parentId': 'folder2'
				},{
					'_id':'file3',
					'title': 'SSAT Upper File 3',
					'type': 'file',
					'modified': '2021-05-1',
					'parentId': 'folder3'
				},{
					'_id':'file4',
					'title': 'SSAT Upper File 4',
					'type': 'file',
					'modified': '2021-05-1',
				}
			];
		let response = [];
		for(let item of data) {
			if (id && id == item['parentId']) {
				response.push(item)
			} else if (!id && !item['parentId']) {
				response.push(item)
			}
		}
		return {
			status: 'success',
			response
		}
	}
	wrongResponse(method, response){
		const _ = this;
		G_Bus.trigger('UsersModule', 'handleErrors', {
			'method': method,
			'type': 'wrongResponse',
			'data': response
		});
	}
	wrongRequest(method, request){
		const _ = this;
		G_Bus.trigger('UsersModule', 'handleErrors', {
			'method': method,
			'type': 'wrongRequest',
			'data': request
		});
	}

}
export const Model = new _Model();