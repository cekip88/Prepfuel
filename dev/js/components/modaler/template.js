export default {
	'modaler': (data = {}) => {
		return `
			<link rel="stylesheet" href="./components/modaler/style.css">
			<div class="modaler-cont" data-mouseup="closeModal">
				<div class="modaler-inner" data-mouseup="cancelCloseModal">
					<div class="modaler-header">
						<button data-click="closeModal" class="modaler-close">
							<svg>
								<use xlink:href="img/sprite.svg#close"></use>
							</svg>
						</button>
					</div>
					<div class="modaler-body">
						<slot name="modal-item"></slot>
					</div>
				</div>
			</div>
		`;
	}
}
