const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tab;

const initStart = async () => {
	console.log('Injected Script');

	try {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());
		console.log('params :: ', params);
		if (params.lsd_story_sync_id) {
			const { story_sync_id } = await cs.get('story_sync_id');
			if (story_sync_id === params.lsd_story_sync_id) {
				chrome.runtime.sendMessage({
					type: 'executeStorySync',
				});
			} else {
				cr.sendMessage({ type: 'closeTab' });
				window.close();
			}
		}

		if (params.lsd_msg_automation_id) {
			const { lsd_msg_automation_id } = await cs.get('lsd_msg_automation_id');
			if (lsd_msg_automation_id === params.lsd_msg_automation_id) {
				chrome.runtime.sendMessage({
					type: 'executeAutomation',
				});
			} else {
				cr.sendMessage({ type: 'closeTab' });
				window.close();
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		// window.close();
	}
};

initStart();
