
const kyubiConfig = require('../../public/kyubiSettings.json');

const backednApiUrl = kyubiConfig.appBaseBackendUrl;
// const backednApiUrl = 'http://localhost:8000';
module.exports = {
	storeFbStoriesApi: `${backednApiUrl}/api/facebook/stories`,
	storeFbStoryYiewerListApi: `${backednApiUrl}/api/facebook/viewerslist`,
	fetchActiveFBProfile: `${backednApiUrl}/api/facebook/fetchUserInfo`,
	storeFbProfileApi: `${backednApiUrl}/api/facebook/userInfo`,
	signupApi: `${backednApiUrl}/api/auth/login`,
	updateProcessApi : `${backednApiUrl}/api/auth/from-backend`,
	fetchFBStoryViewersListApi: `${backednApiUrl}/api/facebook/fetchviewerlist`,
	updateSegmentApi: `${backednApiUrl}/api/message/createSegment`,
	deletemessageSegmentApi: `${backednApiUrl}/api/message/deleteSegment`,
	createMessageGroupApi: `${backednApiUrl}/api/message/createGroup`,
	deletemessageGroupApi: `${backednApiUrl}/api/message/deleteGroup`,
	getRandomMessageApi: `${backednApiUrl}/api/message/fetchGroupRandomMessage`,
	getAllMessageGroupsApi: `${backednApiUrl}/api/message/findAllGroups`,
	getAllMessageSegmentsApi: `${backednApiUrl}/api/message/findAllSegments`,
	getStoryApi: `${backednApiUrl}/api/facebook/story`,
	getStoriesApi: `${backednApiUrl}/api/facebook/all-stories`,
	updateAutomationApi: `${backednApiUrl}/api/automation`,
	getautomationApi: `${backednApiUrl}/api/automation/getautomation`,
	runAutomationApi: `${backednApiUrl}/api/automation/runautomation`,
	updateAutomationForAutomationApi: `${backednApiUrl}/api/automation/updateautomation`,
	upadateFbProfileTokenApi: `${backednApiUrl}/api/facebook/update-fb-profile-tokens`,
	storySyncNowOnlyApi: `${backednApiUrl}/api/automation/sync-stories`,
	getDashStoriesCount : `${backednApiUrl}/api/automation/dashStories`,
	getDashAutomationCount : `${backednApiUrl}/api/automation/dashAutomationInsights`,
	getDashMessgesSent : `${backednApiUrl}/api/automation/dashMessgesDeliverd`,
	getDashEngagement : `${backednApiUrl}/api/automation/dashEngagement`,
	// functions
	getloggedInUserInfo: async () => {
		const { lsd_user_info } = await chrome.storage.local.get('lsd_user_info');
		return lsd_user_info;
	},

	delay: (delayInms) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(2);
			}, delayInms);
		});
	},

	randomInt: (min, max) => {
		return Math.floor(min + Math.random() * (max + 1 - min));
	},
};
