export default {
	'select': (data={}) => {
		let tpl = `
		<link rel="stylesheet" href="./components/select/style.css">
		<slot name="value"></slot>
		<div class="g-select">
		<div class="g-select-head" data-click="open">
			<h6 class="g-select-title">${data['title']}</h6>
			<svg class="g-select-head-icon"><use xlink:href="img/sprite.svg#select-arrow-bottom"></use></svg>
		</div>
		<div class="g-select-body" data-click="choose">`;
	    data['items'].forEach( item =>{
		 tpl+=`<button class="g-select-option" value="${item.value}"><span>${item.text}</span></button>`
	 });
		tpl+=`		
		</div>
		</div>
	`;
		return tpl;
	},
	selectBody : (items) =>{
		let tpl = ``;
		items.forEach( item =>{
			tpl+=`<button value="${item.value}">${item.text}</button>`
		});
		return tpl;
	},
	hiddenInput: (data)=>{
		return `<input type='hidden' name='${data['name']}' slot='value'>`
	}
}