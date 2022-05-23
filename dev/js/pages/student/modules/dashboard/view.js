export const view = {
	dashboardTpl(params){
		const _ = this;
		return `
			<div class="section">
				<div class="block student-main">
					<h1 class="main-title"><span>Today's goal</span><strong>Choose your practice schedule</strong></h1>
					<p class="student-main-text">
						Based on your test date, we'll put together a practice plan
						to ensure you're ready for the real deal.
					</p>
					<button class="button-blue" data-click="${_.componentName}:changeModule;" module="schedule" ><span>Choose your practice schedule</span></button>
				</div>
			</div>
			${_.scheduleBlock()}
			<br><br>
		`;
	},
	scheduleBlock(){
		const _ = this;
		let
			practiceDate = new Date(_._$.dashSchedule['practiceTest']['date']),
			testDate = new Date(_._$.dashSchedule['test']['date']),
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		return `
			<div class="section row">
				<div class="col">
					<div class="block">
						<div class="block-title-control">
							<h5 class="block-title"><span>Practice Schedule</span></h5>
							<button class="button"><span>Delete</span></button>
							<button class="button"><span>Edit</span></button>
						</div>
						<ul class="schedule-list">
							<li class="schedule-item">
								<div class="icon">
									<svg>
										<use xlink:href="#tablet"></use>
									</svg>
								</div>
								<div class="info">
									<h5 class="schedule-title"><span>Next Practice</span></h5>
									<div class="info-item">
										<div class="info-icon">
											<svg>
												<use xlink:href="#clock"></use>
											</svg>
										</div>
										<div class="info-text"><span>Monday March 14, 5:00 PM</span></div>
									</div>
									<div class="info-item">
										<div class="info-icon">
											<svg>
												<use xlink:href="#questions"></use>
											</svg>
										</div>
										<div class="info-text"><span>10 questions (15 minutes)</span></div>
									</div>
								</div>
							</li>
							<li class="schedule-item">
								<div class="icon">
									<svg>
										<use xlink:href="#badge"></use>
									</svg>
								</div>
								<div class="info">
									<h5 class="schedule-title"><span>Next Practice Test</span></h5>
									<div class="info-item">
										<div class="info-icon">
											<svg>
												<use xlink:href="#clock"></use>
											</svg>
										</div>
										<div class="info-text"><span>${_._$.dashSchedule['practiceTest']['dayName']} ${months[practiceDate.getMonth()]} ${practiceDate.getDate()}</span></div>
									</div>
								</div>
							</li>
							<li class="schedule-item">
								<div class="icon blue">
									<svg>
										<use xlink:href="#badge"></use>
									</svg>
								</div>
								<div class="info">
									<h5 class="schedule-title"><span>${_._$.dashSchedule['test']['title']}</span></h5>
									<div class="info-item">
										<div class="info-icon">
											<svg>
												<use xlink:href="#clock"></use>
											</svg>
										</div>
										<div class="info-text"><span>${_._$.dashSchedule['test']['daysLeft']} days until test, ${_._$.dashSchedule['test']['dayName']} ${months[testDate.getMonth()]} ${testDate.getDate()}</span></div>
									</div>
								</div>
							</li>
						</ul>
						<button class="hidden-show" data-click="showHidden">
							<div class="hidden-show-text"><span>Open calendar</span><span>Close calendar</span></div>
							<svg>
								<use xlink:href="#select-arrow-bottom"></use>
							</svg>
						</button>
						<div class="hidden-cont">
							<div class="calendar-days"><span class="calendar-day">Su</span><span class="calendar-day">Mo</span><span class="calendar-day">Tu</span><span class="calendar-day">We</span><span class="calendar-day">Th</span><span class="calendar-day">Fri</span><span class="calendar-day">Sa</span></div>
							<div class="calendar-list">
								<div class="calendar-item">
									<div class="calendar">
										<div class="calendar-title"><span>March</span></div>
										<div class="calendar-inner">
											<div class="calendar-row">
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn fill"><span>1</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>2</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>3</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>4</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>5</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>6</span></div>
												<div class="calendar-btn fill"><span>7</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>8</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>9</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>10</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>11</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>12</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>13</span></div>
												<div class="calendar-btn"><span>14</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>15</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>16</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>17</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>18</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>19</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>20</span></div>
												<div class="calendar-btn"><span>21</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>22</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>23</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>24</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>25</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>26</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>27</span></div>
												<div class="calendar-btn"><span>28</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>29</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>30</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>31</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
											</div>
										</div>
									</div>
								</div>
								<div class="calendar-item">
									<div class="calendar">
										<div class="calendar-title"><span>March</span></div>
										<div class="calendar-inner">
											<div class="calendar-row">
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn fill"><span>1</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>2</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>3</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>4</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>5</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>6</span></div>
												<div class="calendar-btn fill"><span>7</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>8</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>9</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>10</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>11</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>12</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>13</span></div>
												<div class="calendar-btn"><span>14</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>15</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>16</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>17</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>18</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>19</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>20</span></div>
												<div class="calendar-btn"><span>21</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>22</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>23</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>24</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>25</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>26</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>27</span></div>
												<div class="calendar-btn"><span>28</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>29</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>30</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>31</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
											</div>
										</div>
									</div>
								</div>
								<div class="calendar-item">
									<div class="calendar">
										<div class="calendar-title"><span>March</span></div>
										<div class="calendar-inner">
											<div class="calendar-row">
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn fill"><span>1</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>2</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>3</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>4</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>5</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>6</span></div>
												<div class="calendar-btn fill"><span>7</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>8</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>9</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>10</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>11</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn fill"><span>12</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>13</span></div>
												<div class="calendar-btn"><span>14</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>15</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>16</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>17</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>18</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>19</span></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>20</span></div>
												<div class="calendar-btn"><span>21</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>22</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>23</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>24</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>25</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>26</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#badge"></use>
														</svg></a></div>
											</div>
											<div class="calendar-row">
												<div class="calendar-btn"><span>27</span></div>
												<div class="calendar-btn"><span>28</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>29</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>30</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span>31</span><a class="calendar-link" href="#">
														<svg>
															<use xlink:href="#tablet"></use>
														</svg></a></div>
												<div class="calendar-btn"><span></span></div>
												<div class="calendar-btn"><span></span></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	},
	dashboardTabsTpl(){
		return `
			<div class="subnavigate">
				<div class="section">
					<button class="subnavigate-button active"><span>Overview</span></button>
					<button class="subnavigate-button"><span>Tutoring Sessions</span></button>
					<button class="subnavigate-button"><span>Recent Activity</span></button>
					<button class="subnavigate-button"><span>Achievements</span></button>
				</div>
			</div>
		`;
	}
}