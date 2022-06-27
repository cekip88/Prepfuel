export default {
	//	<link rel="stylesheet" href= ${data['stylesheet'] ?? "./components.css"}>
	'symbolPassword': (data = {}) => `
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
			<span contenteditable="true"
				tabindex="0"
				class="inpt-value"
				data-input="doInput"
				data-focusin="doFocusIn"
				data-focusout="doFocusOut"
				>
				${data['placeholder'] ? '<em class="inpt-value-placeholder">'+data['placeholder']+'</em>' : ''}
			</span>
			<input type="text" ${data['value'] ? 'value='+data['value'] : ''}	data-focusin="doFocusIn" data-focusout="doFocusOut" class="inpt-mask" data-input="fillMask">
		</label>`,
	'tip': (tip) =>
		`${tip ? '<span class="inpt-tip">'+tip+'</span>' : ''}`,
	'input': ( data={})=>`
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
			<input
				${data['placeholder'] ? 'placeholder="'+data['placeholder']+'"' : ''}
				${data['value'] ? 'value="'+data['value'] +'"' : ''}
				${ (data['type']=='phone') || (data['type']=='numeric') ? 'data-keydown="doKeyDown"' : '' }
				type="${data['type']}"
				class="inpt-value"
				data-input="doInput"
				data-focusout="doFocusOut"
				data-click="getCaretPosition"
			> 
		</label>`,
	'check': ( data={})=>{
		let items= ``;
		if(!data['items'] || !data['items'].length) return '<span class="inpt-checkbox-items-fail">Items not found</span>';
		data['items'].forEach( item =>{
			let id = Math.random(9999);
			items+=`
				<input class=${data['type'] =='checkbox' ? 'inpt-checkbox' : 'inpt-radio'} type="${data['type']}" ${item.checked ? 'checked' : ''} ${item.disabled ? 'disabled' : ''} value="${item.value}" name="${data['name']}" id="${id}" data-input="setCheckboxValue">
				<label class=${data['type'] =='checkbox' ? 'inpt-checkbox-label' : 'inpt-radio-label'} ${item.disabled ? 'disabled' : ''} for="${id}" >${item.text ? '<span class="inpt-checkbox-label-text">'+item.text+'</span>' : '' } </label>
			`
		});
		return `  
			<div class="inpt ${data['className'] ?? ''}">
				${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
				<div ${data['type'] =='checkbox' ? "class='inpt-items-cont inpt-checkbox-cont'" : "class='inpt-items-cont inpt-radio-cont'"}>${items}</div>
			</div>
		`;
	},
	'checkItems': (data)=>{
		let items= ``;
		if(!data['items'] || !data['items'].length) return '<span class="inpt-checkbox-items-fail">Items not found</span>';
		data['items'].forEach( item =>{
			let id = Math.random(9999);
			items+=`  
				<input class=${data['type'] =='checkbox' ? 'inpt-checkbox' : 'inpt-radio'} ${item.checked ? 'checked' : ''} ${item.disabled ? 'disabled' : ''} type="${data['type']}" value="${item.value}" name="${data['name']}" id="${id}" data-input="setCheckboxValue">
				<label class=${data['type'] =='checkbox' ? 'inpt-checkbox-label' : 'inpt-radio-label'} ${item.disabled ? 'disabled' : ''} for="${id}" >${item.text ? '<span class="inpt-checkbox-label-text">'+item.text+'</span>' : '' } </label>
			`
		});
		return items;
	},
	'date': ( data={})=>{
		let
			placeholder = data['placeholder'],
			icon = data['svg'] ?? data['icon'];
		if (!icon && icon != false) {
			icon = `<svg width="13" height="13" viewBox="0 0 13 13" class="inpt-date-img" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M1.625 3.33329C1.625 2.68896 2.14733 2.16663 2.79167 2.16663H10.2083C10.8527 2.16663 11.375 2.68896 11.375 3.33329V10.75C11.375 11.3943 10.8527 11.9166 10.2083 11.9166H2.79167C2.14733 11.9166 1.625 11.3943 1.625 10.75V3.33329Z" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.66663 1.08337V3.25004" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M4.33337 1.08337V3.25004" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M1.625 5.41663H11.375" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>`;
		}
		let dateTpl = `
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">' + data['title']+'</h6>' : ''}
			<div class="date-cont" data-mouseDown="datePick">
				<input 
					type="text" 
					class="date-value inpt-value" 
					data-focusout='dateInputFocusOut' 
					${placeholder ? 'placeholder="' + placeholder + '"' : ''}
				>
				<input class="inpt-date" hidden type="date">
				${(icon != false && icon != null && icon != 'false') ? icon : ''}
				${ data['xlink'] ? "<svg class='inpt-date-img'><use xlink:href='/img/sprite.svg#"+data['xlink']+"'></use></svg>" : ''}
			</div>
		</label>`;
		return dateTpl;
	},
	'datePickerHead': (date)=>{
		let
			month = date.getMonth(),
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
			year = date.getFullYear();
		return `
			<div class="date-picker-header">
				<button data-click="prevMonth">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 12"><path d="M5.78033 1.8413C6.07322 1.53446 6.07322 1.03697 5.78033 0.73013C5.48744 0.42329 5.01256 0.42329 4.71967 0.73013L0.219671 5.44441C-0.0642633 5.74187 -0.0741975 6.22083 0.197135 6.53092L4.32213 11.2452C4.60203 11.5651 5.07645 11.5867 5.38179 11.2935C5.68713 11.0003 5.70776 10.5032 5.42787 10.1834L1.7881 6.02363L5.78033 1.8413Z"/></svg>
				</button>
				<span>${months[month]} ${year}</span>
				<button data-click="nextMonth">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 12"><path d="M0.219669 10.1587C-0.0732236 10.4655 -0.0732236 10.963 0.219669 11.2699C0.512563 11.5767 0.987436 11.5767 1.28033 11.2699L5.78033 6.55559C6.06426 6.25813 6.0742 5.77917 5.80286 5.46908L1.67787 0.754792C1.39797 0.434913 0.923545 0.413303 0.618206 0.706526C0.312867 0.999748 0.29224 1.49677 0.572134 1.81664L4.2119 5.97637L0.219669 10.1587Z"/></svg>
				</button>
			</div>
		`
	},
	'datePickerDays': ()=>{return `
		<div class="date-picker-days">
			<span>Su</span>
			<span>Mo</span>
			<span>Tu</span>
			<span>We</span>
			<span>Th</span>
			<span>Fri</span>
			<span>Sa</span>
		</div>
	`},
	'datePickerBody': (date)=>{
		let lens = 31,
			month = date.getMonth() + 1,
			year = date.getFullYear();
		let shortMonths = [4,6,9,11];
		if (shortMonths.indexOf(month) >= 0) lens = 30;
		else if (month === 2) {
			if (year % 4 === 0) lens = 29;
			else lens = 28;
		}
		let
			curDate = new Date(`${year} ${month} 01`),
			firstDay = curDate.getDay(),
			count = firstDay + lens,
			tpl = `<div class="date-picker-body" data-month="${month < 10 ? '0' + month : month}" data-year="${year}">`;
		count += 7 - (count % 7);
		for (let i = 0; i < count; i++) {
			if ((i < firstDay) || (i >= firstDay + lens)) {
				tpl += '<span></span>';
			} else {
				let day = i - firstDay + 1;
				tpl += `<button data-click="changeDate" data-day="${day}">${day}</button>`;
			}
		}
		tpl += '</div>'
		return tpl;
	}
}

//${ (data['type'] == 'password') ? 'data-keydown="preparePassword"' : ''}