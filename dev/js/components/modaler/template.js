export default {
	'modaler': (data = {}) => {
		return `
			<div class="modaler-cont" data-mouseup="closeModal" ${data['showShadow'] ?? ''}>
				<div class="modaler-inner" data-mouseup="cancelCloseModal">
					<div class="modaler-header">
						<!--<button data-click="closeModal" class="modaler-close">X</button>-->
					</div>
					<div class="modaler-body">
						<slot name="modal-item"></slot>
					</div>
				</div>
			</div>
		`;
	}
}
