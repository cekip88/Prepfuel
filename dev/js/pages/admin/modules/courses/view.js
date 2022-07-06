export const view = {
	coursesBodyTabs(){
		return `
			<div class="subnavigate">
				<div class="section"></div>
			</div>
		`;
	},
	coursesFooter(){
		return ``;
	},

	searchBlockHeader(){
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
				<button class="button-lightblue">
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
			<div class="tbl">
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
				<div class="table-cont loader-parent">
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
	coursesBody(){
		const _ = this;
		let tpl = `
			<div class="section">
				<div class="block courses-block">
					${_.searchBlockHeader()}
					<div class="courses-block-crumbs">
						${_.breadCrumbs([{title:'Courses',path:''},{title:'ISEE Upper',path:''}])}
						<div class="courses-rows-count"><img src="/img/loader.gif"></div>
					</div>
					${_.coursesTableTpl()}
				</div>
			</div>
		`;
		return tpl;
	},

	adminFooter(){
		const _ = this;
		return `
			<div hidden>
			</div>
		`
	},
}
