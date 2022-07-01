export default {
	'select': (data={}) => {
		const _ = this;
		let items='',checkedOption;
		if( !(!data['items'] || !data['items'].length )){
			data['items'].forEach( (item,index) =>{
				if (!data.multiple) {
					if (item['active']) checkedOption = item;
					items +=`<button class="g-select-option${item['active'] ? ' active' : ''}" value="${item.value}"><span>${item.text}</span></button>`
				} else {
					items +=`<button class="g-select-option" choosen="false" ${item['active'] ? 'data-active="true"' : ''} data-number="${index}" value="${item.value}"><span>${item.text}</span></button>`
				}
			});
		}
		let tpl = `
			<slot name="value"></slot>
			<div class="g-select ${data['className'] ?? ''}" tabindex="0" data-focusout="close">
				<div class="g-select-head ${((!data['arrow']) && (!data['arrowSvg'])) ? 'with-arrow' : ''}" data-click="open">
					<h6 class="g-select-title">${checkedOption ? checkedOption.text : data['title']}</h6>
					${data['arrow'] ? '<div class="g-select-arrow"><img src="'+data['arrow']+'"></div>' : ''}
					${data['arrowSvg'] ? '<div class="g-select-arrow"><svg><use xlink:href="'+data['arrowSvg']+'"></svg></div>' : ''}
				</div>
				<div class="g-select-body ${data['multiple'] ? 'multiple' : ''}" data-click="choose">` + items + '</div></div>';
		return tpl;
	},
	selectBody : (items) =>{
		let tpl = ``;
		items.forEach( (item,index) =>{
			tpl+=`<button  class="g-select-option" value="${item.value}" choosen="false" data-number="${index}">${item.text}</button>`
		});
		return tpl;
	},
	hiddenInput: (data)=>{
		let tpl = `<input type='hidden' name='${data['name']}' slot='value'`;
		if (!data.multiple) {
			for (let i = 0; i < data.items.length; i++) {
				if (data.items[i].active) tpl += `value=${data.items[i].value}`;
			}
		}
		return tpl + '>';
	}
}