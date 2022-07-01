export const view = {
	profileBody(){
		const _ = this;
		return `
			<div class="section">
				<div class="section-header">
					<h2 class="title">Profile</h2>
				</div>
			</div>
			<div class="section row">
				<div class="block test-block profile-block">
					<div class="test-header">
						<h5 class="block-title test-title">
							<span>Basic Info</span>
						</h5>
					</div>
					<div class="test-inner profile-inner">
						<form class="profile-form">
							<div class="profile-img-row">
								<div class="profile-img">
									<div class="profile-img-letter">
										${this.super_$.firstName[0].toUpperCase()}
									</div>
								</div>
								<div class="profile-img-desc">
									Allowed *.jpeg,*.jpg, *.png, *.gif<br>
									Max size of 3.1 MB
								</div>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">First name</label>
								</div>
								<g-input type="text" name="first_name" class="g-form-item" classname="form-input profile-form-input" value="${this._$.firstName}"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">Last name</label>
								</div>
								<g-input type="text" name="last_name" class="g-form-item" classname="form-input profile-form-input" value="${this._$.lastName}"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">Email</label>
								</div>
								<g-input type="email" name="email" class="g-form-item" classname="form-input profile-form-input" value="admin@mail.ru"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">Role</label>
								</div>
								<h5 class="profile-form-value">Super Admin</h5>
							</div>
							<hr class="form-label-hr">
							<div class="form-label-row">
								<label class="form-label profile-form-title">Change Password</label>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">Old password</label>
								</div>
								<g-input type="password" name="oldpassword" class="g-form-item" classname="form-input profile-form-input" ></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">New password</label>
								</div>
								<g-input type="password" name="newpassword" class="g-form-item" classname="form-input profile-form-input"></g-input>
							</div>
							<div class="profile-form-row">
								<div class="form-label-row">
									<label class="form-label">Confirm password</label>
								</div>
								<g-input type="password" name="cpassword" class="g-form-item" classname="form-input profile-form-input"></g-input>
							</div>
						</form>
					</div>
					<div class="test-footer">
						<button class="test-footer-back" data-click="AdminPage:changeSection" section="/admin/dashboard">
							<span>Discard</span>
						</button>
						<button class="button-blue">
							<span>Save Changes</span>
						</button>
					</div>
				</div>
			</div>
		`;
	}
	
};