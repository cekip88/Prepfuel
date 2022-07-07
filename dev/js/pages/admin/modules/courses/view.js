export const view = {
	coursesBodyTabs(){
		return `
			<div class="subnavigate">
				<div class="section"></div>
			</div>
		`;
	},

	searchBlockHeader(){
		const _ = this;
		return `
			<div class="courses-block-header">
				<div class="item block-header-search">
					<svg><use xlink:href="#search"></use></svg>
					<g-input 
						placeholder="Search Files & Folders"
						type="text"
						classname="form-input form-search"
					></g-input>
				</div>
				<button class="button-lightblue">
					<svg class="button-icon stroke hover"><use xlink:href="#newFolder"></use></svg>
					<span>New Folder</span>
				</button>
				<button class="button-lightblue" data-click="${_.componentName}:showUploadFile">
					<svg class="button-icon stroke"><use xlink:href="#uploadFile"></use></svg>
					<span>Upload File</span>
				</button>
				<button class="button-blue">
					<svg class="button-icon stroke big"><use xlink:href="#add"></use></svg>
					<span>Add Question</span>
				</button>
			</div>
		`
	},
	breadCrumbs(crumbs){
		let tpl = `<div class="breadcrumbs">`;
		for (let i = 0; i < crumbs.length; i++) {
			if (i !== crumbs.length - 1) {
				tpl += `
					<a href="${crumbs[i].path}" class="breadcrumbs-item">${crumbs[i].title}</a>
					<span class="breadcrumbs-delimiter">/</span>
				`
			} else {
				tpl += `<strong class="breadcrumbs-current">${crumbs[i].title}</strong>`
			}
		}
		tpl += '</div>';
		return tpl;
	},
	coursesTableTpl(){
		let tpl = `
			<div class="tbl folders-table">
				<div class="tbl-head">
					<div class="tbl-item"><span>Name</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div> 
					</div>
					<div class="tbl-item"><span>Last Modified</span>
						<div class="tbl-sort-btns">
							<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
							<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
						</div>
					</div>
					<div class="tbl-item right">Action</div>
				</div>
				<div class="table-cont loader-parent courses-table">
					<table class="table">
						<thead class="tbl-head">
							<tr>
								<th>
									<div class="tbl-item">
										<span>Name</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th>
									<div class="tbl-item right">
										<span>Last Modified</span>
										<div class="tbl-sort-btns">
											<button class="tbl-sort-btn top"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
											<button class="tbl-sort-btn bottom"><svg><use xlink:href="#select-arrow-bottom"></use></svg></button>
										</div> 
									</div>
								</th>
								<th><div class="tbl-item right">Action</div></th>
							</tr>
						</thead>
						<tbody class="tbl-body"><tr><td><img src='/img/loader.gif' class='loader'></td></tr></tbody>
					</table>
				</div>
		`;
		return tpl
	},
	filesRowsTpl(usersData){
		const _ = this;
		let trs = [];
		usersData = usersData['response'];
		if(!usersData) return void 0;
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className= 'tbl-row';
			tr.setAttribute('user-id',item['_id']);
			tr.innerHTML = _.filesRowTpl(item);
			trs.push(tr);
		}
		return trs;
	},
	filesRowTpl(rowData){
		const _ = this;
		let tpl = `
				<td>
					<div class="tbl-item courses-table-title">
						<div class="courses-table-icon">
							<svg><use xlink:href="${rowData.type == 'folder' ? '#folder' : '#uploadedFile'}"></use></svg>
						</div>
						<h6 class="courses-table-name">${rowData.title}</h6>
					</div>
				</td>
				<td>
					<div class="tbl-item courses-table-date">
						${_.createdAtFormat(rowData.modified)}
				</div>
			</td>
			<td>
				<div class="tbl-item right courses-table-action">
					<button class="courses-action">
						<span></span><span></span><span></span>
					</button>
					${rowData.type == 'folder' ? _.folderActions() : _.fileActions()}
				</div>
			</td>
		`
		return tpl;
	},
	folderActions(){
		return `
			<div class="courses-actions">
				<button>Rename</button>
				<button>Move to folder</button>
				<button class="red">Delete</button>
			</div>
		`
	},
	fileActions(){
		return `
			<div class="courses-actions">
				<button>Rename</button>
				<button>Edit</button>
				<button>Move to folder</button>
				<button>Make a copy</button>
				<button class="red">Delete</button>
			</div>
		`
	},
	uploadFileTpl(){
		return `
			<form id="uploadFileForm" class="block uploadFile-form">
				<div class="test-header">
					<h5 class="block-title test-title uploadFile-title">
						<span>Upload File</span>
					</h5>
				</div>
				<h6 class="uploadFile-subtitle">Upload a question .csv file</h6>
				<div class="uploadFile-body">
					<div class="uploadFile-dragarea">
						<div class="uploadFile-dragarea-inner">
							<div class="uploadFile-dragarea-icon"><svg><use xlink:href="#uploader"></use></svg></div>
							<div class="uploadFile-dragarea-info">
								<h5 class="uploadFile-dragarea-title">Quick file uploader</h5>
								<span class="uploadFile-dragarea-text">Drag and drop your file here or choose files from computer</span>
							</div>
						</div>
					</div>
					<label for="uploadInput" class="button-blue"><span>Choose File To Upload</span></label>
					<input type="file" hidden id="uploadInput">
				</div>
			</form>
		`
	},
	coursesBody(){
		const _ = this;
		let tpl = `
			<div class="section">
				<div class="block courses-block">
					${_.searchBlockHeader()}
					<div class="courses-block-crumbs">
						${_.breadCrumbs(_.tableCrumbs)}
						<div class="courses-rows-count"><img src="/img/loader.gif"></div>
					</div>
					${_.coursesTableTpl()}
				</div>
			</div>
		`;
		return tpl;
	},

	coursesFooter(){
		const _ = this;
		return `
			<div hidden>
				${_.uploadFileTpl()}
			</div>
		`
	},
}
