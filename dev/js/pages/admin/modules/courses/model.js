import {env} from "/env.js";
import {G_Bus} from "../../../../libs/G_Control.js";
class _Model {
	constructor() {
		const _ = this;
		_.endpoints = {
			tests: `${env.backendUrl}/tests`,
			csv: `${env.backendUrl}/admin/upload`,
		};

		_.foldersData = [
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
	}
	getFolderData(id = null){
		const _ = this;
		let response = [];
		for(let item of _.foldersData) {
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
	getTests(){
		const _ = this;
		if(_.tests) return Promise.resolve(_.tests);
		return new Promise(async resolve => {
			let rawResponse = await fetch(`${_.endpoints['tests']}`, {
				method: 'GET',
				headers: _.baseHeaders,
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					_.tests = response['response'];
					resolve(response['response']);
				} else {
					_.wrongResponse('getTests', response);
				}
			} else {
				_.wrongRequest('getTests', rawResponse)
			}
			resolve(null);
		});
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


	uploadCSV(uploadData){
		const _ = this;
		return new Promise(async resolve => {
			let rawResponse = await fetch(_.endpoints['csv'], {
				method: 'POST',
				headers: _.baseHeaders,
				body: uploadData
			});
			if(rawResponse.status < 210) {
				let response = await rawResponse.json();
				if(response['status'] == 'success') {
					resolve(response['response']);
				} else {
					_.wrongResponse('assignCourse', response);
				}
			} else {
				_.wrongRequest('assignCourse', rawResponse)
			}
			resolve(null);
		});
	}
}
export const Model = new _Model();