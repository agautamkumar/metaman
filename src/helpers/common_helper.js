var resObj = {
	status: true,
	data: [],
	message: '',
};

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

function checkTabStatus(tabID) {
	return new Promise((resolve, reject) => {
		let checkTimer = setInterval(() => {
			chrome.tabs.onUpdated.addListener(function (tabID, info) {
				console.log('Tab status', info.status);
				if (info.status === 'complete') {
					console.log('Requested tab is successfully fucked..');
					clearInterval(checkTimer);
					return resolve(true);
				} else {
					// console.log("The requested tab is still fucking loading...")
				}
			});
		}, 1000);
	});
}

function createPinnedTab(url, pinned = true, active = false, selected = false) {
	return new Promise((resolve, reject) => {
		try {
			chrome.tabs.create(
				{
					url,
					pinned,
					active,
					selected,
				},
				async function (tab) {
					resolve(tab);
				}
			);
		} catch (error) {
			reject(error);
		}
	});
}

function removeTabs(tabId) {
	return new Promise((resolve, reject) => {
		chrome.tabs.remove(tabId);
		resolve(true);
	});
}
const fetchLsdUserInfo = () => {
	return new Promise((resolve, reject) => {
		cs.get(['lsd_user_info'], function (result) {
			let user = result.lsd_user_info;
			if (user == undefined) {
				console.log('User is not logged in to LSD');
				resObj.status = false;
				resObj.message = 'User is not logged in to LSD';
				return resolve(resObj);
			} else {
				console.log('output', user);
				if (user.isLoggedIn) {
					(resObj.message = 'User is logged in to LSD'), (resObj.data = user);
					console.log('resp', resObj);
					return resolve(resObj);
				}
			}
		});
	});
};
module.exports = {
	checkTabStatus,
	createPinnedTab,
	removeTabs,
	fetchLsdUserInfo,
};
