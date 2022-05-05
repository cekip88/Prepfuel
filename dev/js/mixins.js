export const mixins = {
	/*Storage*/
	storageHas(key){
		return localStorage.getItem(key) ? true : false;
	},
	storageGet(key,parse){
		if (!this.storageHas(key)) return null;
		if (!parse) parse = false;
		return !parse ? localStorage.getItem(key) : JSON.parse(localStorage.getItem(key));
	},
	storageSave(key,value){
		localStorage.removeItem(key);
		if(typeof value == 'object'){
			localStorage.setItem(key,JSON.stringify(value));
		}else{
			localStorage.setItem(key,value);
		}
	},
	storageUpdate(key,value){
		const _ = this;
		let savedItem = _.storageGet(key,true);
		if (typeof savedItem != 'object' || typeof value != 'object') return;
		for(let k in value){
			savedItem[k] = value[k];
		}
		_.storageSave(key,savedItem);
	},
	storageRemove(key){
		if(this.storageHas(key)) localStorage.removeItem(key);
	},
	/*Storage*/

	/*Form*/
	handleErrors({response}){
		const _ = this;
		let errors = response['errors'];
		if(!errors) return void 0;
		let items = _.f('.g-form-item');
		
		for(let item of items){
			for(let error of errors){
				if(item.name == error.param){
					item.doValidate(error.msg)
				}
			}
		}
	},
	checkValidate(form){
		const _ = this;
		if(!form) return;
		let check = true;
		let
			inputs = form.querySelectorAll('.g-form-item');
		for(let input of inputs){
			if(!input.doValidate) continue
			if(!input.doValidate()){
				check = false;
			}
		}
		return check;
	},
	gFormDataCapture(form){
		const _ = this;
		let
			obj = {},
			items = form.querySelectorAll('.g-form-item');
		for(let item of items){
			if( (item.value instanceof Array) && (!item.value.length)){
				obj[item.name] = null;
			}else obj[item.name] = item.value;
		}
		return obj;
	},
	prepareForm(form){
		const _ = this;
		if(_.checkValidate(form)){
			return _.gFormDataCapture(form);
		}
		return null;
	},
	formDataCapture(form){
		return new Promise(function (resolve) {
			let
				outData = {},
				formElements = form.elements;
			if(!formElements) return;
			for(let element of formElements){
				if(element.type === 'radio'){
					if (element.checked){
						outData[element.name] = element.value;
					}
				}else if (element.name){
					outData[element.name] = element.value;
				}
			}
			resolve(outData);
		});
	}
	/*Form*/
}