export const view = {
	tipsTabs(){
		const _ = this;
		return `
			<div class="subnavigate">
				<div class="section">
				</div>
			</div>
		`;
	},

	tipsBody(){
		const _ = this;
		let tpl = `
			<div class="section">
				<div class="block tips">
					<h3 class="title"><span>About Test</span></h3>
					<ul class="tips-list">
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Test content and format</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Scoring on Test</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">How to use test practice?</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">How to prepare for the Test?</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#video"></use>
								</svg>
							</div>
							<div class="tips-item-text">Time management strategies</div>
						</li>
					</ul>
					<h3 class="title"><span>About the Mathematics Achievement</span></h3>
					<ul class="tips-list">
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Inside the Mathematics Achievement section</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Heart of Algebra: lessons by skill</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Problem Solving and Data Analysis: lessons by skill</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#file"></use>
								</svg>
							</div>
							<div class="tips-item-text">Passport to Advanced Math: lessons by skill</div>
						</li>
						<li class="tips-item">
							<div class="tips-item-img">
								<svg>
									<use xlink:href="#video"></use>
								</svg>
							</div>
							<div class="tips-item-text">Mathematics Achievement: What to expect?</div>
						</li>
					</ul>
				</div>
			</div>
		`;
		return tpl;
	},
}