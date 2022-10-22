export const view = {
	// my profile
	profileTpl(){
		const _ = this;
		let tpl = `
			<div class="section parent">
				<div class="section-header">
					${_.sectionHeaderTpl({
			title: 'Account Settings',
			gap: false
		})}
				</div>
				<div class="row parent-my-profile-row">
					<div class="block">
						<div class="section-header">
							${_.sectionHeaderTpl({
			title: 'Basic Info',
			gap: false
		})}
						</div>
						<div class="admin-profile-line parent-my-profile-line"></div>
						<div class="adding-section">
							<div class="adding-avatar">
								<label class="profile-img-row file-cont">
									<input 
										type="file" 
										class="file" 
										data-change="${_.componentName}:uploadPhoto"
										role="parent"
										accept="image/png, image/gif, image/jpeg, image/jpg"
									>
									<div class="profile-img">`;
		if (!_.parentInfo.photo) {
			tpl += `<div class="profile-img-letter">${_.parentInfo.firstName[0].toUpperCase()}</div>`;
		} else {
			tpl += `<img src="${_.backUrl}${_.parentInfo.photo}" class="user-photo">`
		}
		tpl += `
									</div>
									<div class="profile-img-desc">
										Allowed *.jpeg,*.jpg, *.png, *.gif<br>
										Max size of 3.1 MB
									</div>
								</label>
							</div>
						</div>
						<div class="adding-section">
							<div class="profile-form-row">
								<div class="form-label-row"><label class="form-label">First name</label></div>
								<g-input type="text" value="${_.parentInfo.firstName ?? ''}" data-required name="firstName" data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row"><label class="form-label">Last name</label></div>
								<g-input type="text" name="lastName" value="${_.parentInfo.lastName ?? ''}" data-required data-input="${_.componentName}:fillParentInfo" class="g-form-item" classname="form-input profile-form-input"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row"><label class="form-label">Email</label></div>
								<div class="profile-form-row-input">
									<g-input 
										type="email" 
										name="email" 
										value="${_.parentInfo.email ?? ''}" 
										data-value="${_.parentInfo.email ?? ''}" 
										data-required
										data-outfocus="${_.componentName}:checkEmail"
										data-input="${_.componentName}:fillParentInfo" 
										class="g-form-item" 
										classname="form-input profile-form-input"
									></g-input>
									<span class="form-label-desc" style="display:none;">Email is not free</span>
								</div>
							</div>
							<div class="admin-profile-line"></div>
							<div class="passwords">
								<h3 class="admin-profile-password-title block-gap">Change Password</h3>
								<div class="profile-form-row">
									<div class="form-label-row"><label class="form-label">Password</label></div>
									<g-input 
										type="password" 
										name="password" 
										match="changePassword"
										class="g-form-item" 
										data-outfocus="${_.componentName}:validatePassword"
										className="form-input adding-inpt"
									></g-input>
								</div>
								<span class="form-label-desc block-gap" style="display:none;">8+ characters, with min. one number, one uppercase letter and one special character</span>
								<div class="profile-form-row">
									<div class="form-label-row"><label class="form-label">Repeat Password</label></div>
									<g-input 
										type="password" 
										name="repeatPassword"
										match="changePassword"
										class="g-form-item" 
										data-outfocus="${_.componentName}:validatePassword"
										className="form-input adding-inpt"
									></g-input>
								</div>
								<span class="form-label-desc" style="display:none;">Password does not match</span>
							</div>
							<div class="admin-profile-line parent-my-profile-line"></div>
							<div class="student-profile-footer parent-my-profile-footer">
								<div class="student-profile-actions">
									<button class="test-footer-back" data-click="ParentPage:changeSection" section="/parent/dashboard" rerender>
										<span>Discard</span>
									</button>
									<button class="button-blue" data-click="${_.componentName}:updateParent">
										<span>Save Changes</span>
									</button>
								</div>
						</div>
					</div>
				</div>
				<div class="block parent-my-profile-notifications">
					<div class="section-header">
						${_.sectionHeaderTpl({
			title: 'Notifications',
		})}
					</div>
					<div class="parent-checkbox">
						<label class="parent-checkbox-label">
							<input type="checkbox" name="">
							<span class="parent-checkbox-icon">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.53033 12.9697C4.23744 12.6768 3.76256 12.6768 3.46967 12.9697C3.17678 13.2626 3.17678 13.7374 3.46967 14.0303L7.96967 18.5303C8.26256 18.8232 8.73744 18.8232 9.03033 18.5303L20.0303 7.53033C20.3232 7.23744 20.3232 6.76256 20.0303 6.46967C19.7374 6.17678 19.2626 6.17678 18.9697 6.46967L8.5 16.9393L4.53033 12.9697Z"/>
								</svg>
							</span>
							<strong class="parent-checkbox-title">Activity emails.</strong>
						</label>
						<span class="parent-checkbox-_.parentInfo">
							Activity summary each time your student logs in and completes work.
						</span>
					</div>
					<div class="parent-checkbox">
						<label class="parent-checkbox-label">
							<input type="checkbox" name="">
							<span class="parent-checkbox-icon">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.53033 12.9697C4.23744 12.6768 3.76256 12.6768 3.46967 12.9697C3.17678 13.2626 3.17678 13.7374 3.46967 14.0303L7.96967 18.5303C8.26256 18.8232 8.73744 18.8232 9.03033 18.5303L20.0303 7.53033C20.3232 7.23744 20.3232 6.76256 20.0303 6.46967C19.7374 6.17678 19.2626 6.17678 18.9697 6.46967L8.5 16.9393L4.53033 12.9697Z"/>
								</svg>
							</span>
							<strong class="parent-checkbox-title">Weekly progress emails.</strong>
						</label>
						<span class="parent-checkbox-_.parentInfo">
							Weekly updates to gauge perfomance and progress.
						</span>
					</div>
					<div class="parent-checkbox">
						<label class="parent-checkbox-label">
						<input type="checkbox" name="">
							<span class="parent-checkbox-icon">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.53033 12.9697C4.23744 12.6768 3.76256 12.6768 3.46967 12.9697C3.17678 13.2626 3.17678 13.7374 3.46967 14.0303L7.96967 18.5303C8.26256 18.8232 8.73744 18.8232 9.03033 18.5303L20.0303 7.53033C20.3232 7.23744 20.3232 6.76256 20.0303 6.46967C19.7374 6.17678 19.2626 6.17678 18.9697 6.46967L8.5 16.9393L4.53033 12.9697Z"/>
								</svg>
							</span>
							<strong class="parent-checkbox-title">Study reminders for students.</strong>
						</label>
						<span class="parent-checkbox-_.parentInfo">
							Consistent practice will help students improve.
						</span>
					</div>
					<div class="parent-checkbox">
						<label class="parent-checkbox-label">
						<input type="checkbox" name="">
							<span class="parent-checkbox-icon">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.53033 12.9697C4.23744 12.6768 3.76256 12.6768 3.46967 12.9697C3.17678 13.2626 3.17678 13.7374 3.46967 14.0303L7.96967 18.5303C8.26256 18.8232 8.73744 18.8232 9.03033 18.5303L20.0303 7.53033C20.3232 7.23744 20.3232 6.76256 20.0303 6.46967C19.7374 6.17678 19.2626 6.17678 18.9697 6.46967L8.5 16.9393L4.53033 12.9697Z"/>
								</svg>
							</span>
							<strong class="parent-checkbox-title">Promotional discounts.</strong>
						</label>
						<span class="parent-checkbox-_.parentInfo">
							Promotional discounts & new courses oferings.
						</span>
					</div>
					<div class="parent-checkbox">
						<label class="parent-checkbox-label">
							<input type="checkbox" name="" ${_.parentInfo.phone ? 'checked' : ''} data-change="${_.componentName}:addPhone">
							<span class="parent-checkbox-icon">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.53033 12.9697C4.23744 12.6768 3.76256 12.6768 3.46967 12.9697C3.17678 13.2626 3.17678 13.7374 3.46967 14.0303L7.96967 18.5303C8.26256 18.8232 8.73744 18.8232 9.03033 18.5303L20.0303 7.53033C20.3232 7.23744 20.3232 6.76256 20.0303 6.46967C19.7374 6.17678 19.2626 6.17678 18.9697 6.46967L8.5 16.9393L4.53033 12.9697Z"/>
								</svg>
							</span>
							<strong class="parent-checkbox-title">Text message study reminders</strong>
						</label>
						<span class="parent-checkbox-_.parentInfo">
							Consistent practice will help students improve.
						</span>
						<span class="parent-checkbox-phone ${_.parentInfo.phone ? 'active' : ''}">
							<span>${_.parentInfo.phone ? _.parentInfo.phone.trim() : ''}</span>
							<button data-click="${_.componentName}:showEditPopup">Edit Phone Number</button>
						</span>
					</div>
					<button class="button-blue"><span>Save</span></button>
				</div>
			</div>
		`;
		return tpl;
	},
	profileFooter(){
		const _ = this;
		return `
			<div hidden>
				${_.editPhoneTpl()}
			</div>
		`;
	},
	editPhoneTpl(){
		const _ = this;
		let tpl = `
			<div class="modal-block parent-my-profile-popup" id="editPhone">
				<h6 class="modal-title">
					<span>Text message study reminders</span>
				</h6>
				<p class="modal-text">Please enter phone number for text message study reminders</p>
				<div class="adding-inpt">
					<div class="form-label-row">
						<label class="addCard-label">Phone Number</label>
					</div>
					<g-input 
						type="phone" 
						name="phone" 
						value="+1"
						id="editPhoneInput"
						class="g-form-item"
						className="form-input adding-inpt"
					></g-input>
				</div>
				<div class="modal-row">
					<button class="button" data-click="modaler:closeModal"><span>Back</span></button>
					<button class="button-blue" data-click="modaler:closeModal;${_.componentName}:updatePhone"><span>Add</span></button>
				</div>
			</div>
		`;
		return tpl;
	},
};