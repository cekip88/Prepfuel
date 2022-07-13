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
				<button class="button-lightblue" data-click="${_.componentName}:showNewFolderPopup">
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
		const _ = this;
		let tpl = `<div class="breadcrumbs">
			${_.fillBreadCrumbs(crumbs)}
		</div>`;
		return tpl;
	},
	fillBreadCrumbs(crumbs){
		const _ = this;
		let tpl = '';
		for (let i = 0; i < crumbs.length; i++) {
			if (i !== crumbs.length - 1) {
				tpl += `
					<a id="${crumbs[i].id}" data-position="${crumbs[i].position}" class="breadcrumbs-item" data-click="${_.componentName}:moveToFolder">${crumbs[i].title}</a>
					<span class="breadcrumbs-delimiter">/</span>
				`
			} else {
				tpl += `<strong class="breadcrumbs-current" id="${crumbs[i].id}">${crumbs[i].title}</strong>`
			}
		}
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
		if(!usersData) return void 0;
		for(let item of usersData){
			let tr = document.createElement('TR');
			tr.className = 'tbl-row';
			tr.setAttribute('data-id',item['_id']);
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
						${rowData.type == 'folder' ? _.folderTitle(rowData) : _.fileTitle(rowData)}
					</div>
				</td>
				<td>
					<div class="tbl-item courses-table-date">
						${_.createdAtFormat(rowData.modified)}
				</div>
			</td>
			<td>
				<div class="tbl-item right courses-table-action">
					${rowData.type == 'file' ? '<button class="courses-action-btn users-btn button">Preview</button>' : ''}
					<div class="courses-action">
						${rowData.type == 'folder' ? _.folderActions() : _.fileActions()}
						<button class="courses-action-btn users-btn button">
							<span></span><span></span><span></span>
						</button>
					</div>
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
	folderTitle(rowData){
		const _ = this;
		return `
			<button class="courses-table-button" id="${rowData._id}" data-click="${_.componentName}:moveToFolder">
				<div class="courses-table-icon">
					<svg><use xlink:href="#folder"></use></svg>
				</div>
				<span class="courses-table-name">${rowData.title}</span>
			</button>
		`
	},
	fileTitle(rowData){
		const _ = this;
		return `
			<div class="courses-table-div" id="${rowData._id}">
				<div class="courses-table-icon">
					<svg><use xlink:href="#uploadedFile"></use></svg>
				</div>
				<span class="courses-table-name">${rowData.title}</span>
			</div>
		`
	},

	uploadFileTpl(){
		const _ = this;
		return `
			<form id="uploadFileForm" class="block uploadFile-form bigPop">
				<div class="test-header">
					<h5 class="block-title test-title bigPop-title">  
						<span>Upload File</span>
					</h5>
				</div>
				<h6 class="bigPop-subtitle">Upload a question .csv file</h6>
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
					<input type="file" hidden id="uploadInput" data-change="${_.componentName}:uploadCSV">
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
	newFolderTpl(){
		const _ = this;
		return `
			<div class="block newFolder" id="newFolderForm">
				<div class="test-header">
					<h5 class="newFolder-title">
						<span>New folder</span>
					</h5>
				</div>
				<div class="adding-inpt">
					<g-input 
						type="text" 
						name="title" 
						class="g-form-item"
						placeholder="Untitled folder"
						className="form-input adding-inpt"
					></g-input>
				</div>
				<div class="student-profile-actions sb">
					<button class="test-footer-back" data-click="modaler:closeModal">
						<span>Cancel</span>
					</button>
					<button class="button-blue" data-click="${_.componentName}:createFolder">
						<span>Create</span>
					</button>
				</div>
			</div>
		`;
	},

	coursesFooter(){
		const _ = this;
		return `
			<div hidden>
				${_.uploadFileTpl()}
				${_.newFolderTpl()}
			</div>
		`
	},
}
