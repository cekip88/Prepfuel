export const view = {
	profileTpl(){
		const _ = this;
		let tpl = `
			<div class="section parent">
				<div class="section-header">
					${_.sectionHeaderTpl({
						title: 'My  Profile',
						gap: false
					})}
				</div>
				<div class="block">
					${_.studentProfileTpl(_.me,_.me.student.currentPlan)}
				</div>
			</div>
		`;
		return tpl;
	},
	studentProfileTpl(studentInfo,courseInfo){
		const _ = this;
		let avatarTpl = '';
		if (studentInfo['avatar']) avatarTpl = `<img data-id="${studentInfo['avatar']}" data-type="avatars" data-title="avatar" id="avatar">`;
		let tpl = `
			<div class="df aifs">
				<div class="parent-student-avatar">
					${avatarTpl}
				</div>
				<div class="parent-student-info">
					<div class="unit df aic jcsb">
						<div class="item">
							<span class="strong">${studentInfo['firstName']} ${studentInfo['lastName']}</span>
							<span class="text">${studentInfo['email']}</span>
						</div>`;
		if (studentInfo.student['currentSchool']) {
			tpl += `
			<div class="item">
				<span class="strong">${studentInfo.student['currentSchool'].school}</span>
				<span class="text">School</span>
			</div>`;
		}
		if (studentInfo.student['grade']) {
			tpl += `
			<div class="item">
				<span class="strong">${studentInfo.student['grade']['grade']}</span>
				<span class="text">Grade</span>
			</div>`;
		}
		if (courseInfo) {
			tpl += `
				<div class="item">
					<span class="strong">${courseInfo['course'] ? courseInfo['course']['title'] : ''}</span>
					<span class="text">Course</span>
				</div>
			`
		}
		tpl += `</div>`;
		if (!_.isEmpty(courseInfo) ){
			tpl += `
				<div class="unit">
					<span class="text">APPLICATION SCHOOL LIST</span>
					<div class="df jcsb">`;
			if ( courseInfo['firstSchool'] ){
				tpl += `
				<div class="item">
					<span class="strong school" 
						data-id="${courseInfo['firstSchool']}" 
						data-type="schools" 
						data-title="school"
					></span>
					<span class="text">1st choice</span>
				</div>
			`;
			}
			if ( courseInfo['secondSchool'] ){
				tpl += `
				<div class="item">
					<span class="strong school"  
						data-id="${courseInfo['secondSchool']}" 
						data-type="schools" 
						data-title="school"
					></span>
					<span class="text">2nd choice</span>
				</div>
			`;
			}
			if ( courseInfo['thirdSchool'] ){
				tpl += `
				<div class="item last">
					<span class="strong school" 
						data-id="${courseInfo['thirdSchool']}" 
						data-type="schools" 
						data-title="school"
					></span>
					<span class="text">3rd choice</span>
				</div>
			`;
			}
			tpl += `</div>
					</div>`
		}
		tpl += `
					<div class="unit">
						<span class="text">CLASSES</span>
						<div class="df aic jcsb">
							
						</div>
					</div>
				</div>
			</div>
		`;
		return tpl;
	},
};