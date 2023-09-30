const { apiCall } = require('./api');
const kyubiSettings = require('../../public/kyubiSettings.json');
const config = require('../config/index');

class LSD_Service {
	constructor() {
		this.apiCall = apiCall;
		this.kyubi = kyubiSettings;
		this.config = config;
	}
	

	async dashStorySyncCount (fbId){
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_user_id: fbId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getDashStoriesCount,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Erro while fetching dash stats :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async dashMessageSentCount (fbId){
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_user_id: fbId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getDashMessgesSent,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Erro while fetching dash stats :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async dashAutomationCreatedCount (fbId){
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_user_id: fbId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getDashAutomationCount,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Erro while fetching dash stats :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async dashEngagemntCount (fbId){
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_user_id: fbId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getDashEngagement,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Erro while fetching dash stats :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}


	async storeFBStories(fb_data) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_data,
			};
			let response = await this.apiCall(
				'POST',
				this.config.storeFbStoriesApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Store Stories API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}
	
	async storeFBStoryViewersList(storyId, fb_data) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				story_id: storyId,
				fb_data,
			};
			let response = await this.apiCall(
				'POST',
				this.config.storeFbStoryYiewerListApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Store Story Viewer List API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async fetchFBStoryViewersList(storyId) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				story_id: storyId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.fetchFBStoryViewersListApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Store Story Viewer List API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async storySyncNowOnly() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.storySyncNowOnlyApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Story Sync Service API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getActiveFBProfile() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.fetchActiveFBProfile,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Active Fb profile API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async storeFBProfiles(fb_data) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_data,
			};

			let response = await this.apiCall(
				'POST',
				this.config.storeFbProfileApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Store FB Profile API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async signupLoginUser(email) {
		try {
			const reqPayload = {
				email,
				extension_id: this.kyubi.extId,
			};
			let response = await this.apiCall(
				'POST',
				this.config.signupApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Sign Up API Service :: ', error.message);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateProcessMethod(from_backend) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				from_backend,
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.updateProcessApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Update Process API Service :: ', error.message);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateMessageSegment(title, message_blocks, segment_id = null) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				title,
				message_blocks,
				lsd_token: loggedInUserInfo.lsd_token,
			};

			if (segment_id) reqPayload.segment_id = segment_id;
			let response = await this.apiCall(
				'POST',
				this.config.updateSegmentApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend Update Message Segments API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateMessageGroup(title, associate_blocks, group_id = null) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				title,
				associate_blocks,
				lsd_token: loggedInUserInfo.lsd_token,
			};
			if (group_id) reqPayload.group_id = group_id;
			let response = await this.apiCall(
				'POST',
				this.config.createMessageGroupApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend Update Message Group API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async deleteMessageSegment(segment_id) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				segment_id,
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.deletemessageSegmentApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend delete Message segemnet API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async deleteMessageGroup(group_id) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				group_id,
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.deletemessageGroupApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend delete Message group API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getAllMessageGroups() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getAllMessageGroupsApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend Get All Message Group API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getAllMessageSegments() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getAllMessageSegmentsApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend Get All Message Segments API Service :: ',
				error.message
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getRandomMessage(group_id) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				group_id,
			};
			let response = await this.apiCall(
				'POST',
				this.config.getRandomMessageApi,
				reqPayload
			);

			return {
				status: true,
				data: response,
			};
		} catch (error) {
			console.log('Backend Get Random Message API Service :: ', error.message);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}
	async getFbStoriesDetails(fb_user_id) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			if (!loggedInUserInfo.lsd_token) return;
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				fb_user_id,
			};
			console.log(
				'fb_user_id :: ',
				fb_user_id,
				this.config.getStoriesApi,
				reqPayload
			);
			let response = await this.apiCall(
				'POST',
				this.config.getStoriesApi,
				reqPayload
			);

			console.log('00 :: ', response);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Get All FB Stories API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getFbStoryDetails(story_id) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				story_id,
			};

			let response = await this.apiCall(
				'POST',
				this.config.getStoryApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend Get FB Story API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateAutomation(automation_id, story_id, data) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				automation_id: automation_id,
				data,
				story_id,
			};

			let response = await this.apiCall(
				'POST',
				this.config.updateAutomationApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend update automation API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async runAutomation(userId, automation_id = null) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				automation_id: automation_id,
				userId: userId,
			};

			let response = await this.apiCall(
				'POST',
				this.config.runAutomationApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend run automation API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async getAllActiveAutomation() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
			};

			let response = await this.apiCall(
				'POST',
				this.config.getautomationApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Backend get active automation API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateFbProfileTokens(reqPayload) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();

			reqPayload.lsd_token = loggedInUserInfo.lsd_token;

			let response = await this.apiCall(
				'POST',
				this.config.upadateFbProfileTokenApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log('Update FB Profile tokens API Service :: ', error);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}

	async updateAutomationForAutomation(
		automation_id,
		type,
		user_id,
		user_name,
		message,
		sentMessage,
		triedButFailed
	) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();
			const reqPayload = {
				lsd_token: loggedInUserInfo.lsd_token,
				automation_id,
				type,
				automation_id,
				user_id,
				user_name,
				message,
				sentMessage,
				triedButFailed,
			};

			let response = await this.apiCall(
				'POST',
				this.config.updateAutomationForAutomationApi,
				reqPayload
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				return {
					status: false,
					token: response.token,
					error: response.message,
				};
			}
		} catch (error) {
			console.log(
				'Backend updateAutomationForAutomation API Service :: ',
				error
			);
			return {
				status: false,
				token: response.token,
				error: error.message,
			};
		}
	}
}

module.exports = LSD_Service;
