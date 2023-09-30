const config = require('../../config');

const FBService = require('../../services/FB_Service');
const FBServiceInstance = new FBService();

const LSDService = require('../../services/LSD_Service');
const LSDServiceInstance = new LSDService();

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tab;

const debug_mode = false;

const initSync = () => {
	console.log('Injceted Story sync script');
	let div = document.createElement('div');
	div.id = 'cover-spin';
	div.style.cssText = 'display:block;';
	document.body.appendChild(div);

	cr.sendMessage({
		type: 'getUserIdAndDtsg',
	});
};

const syncStart = async () => {
	try {
		isAnyTaskInProgress = true;
		const { fbUsrInfo } = await cs.get('fbUsrInfo');
		const dtsg = fbUsrInfo.dtsg;
		const userId = fbUsrInfo.userId;
		const todayStories = await FBServiceInstance.fetchTodaysStory(dtsg, userId);

		if (todayStories.status) {
			if (todayStories.data.data.bucket.unified_stories.edges.length > 0) {
				console.log(
					'Fetching From FB Stories ::',
					todayStories.data.data.bucket.unified_stories.edges
				);
				// send data to backend
				const { status, data, error, token } =
					await LSDServiceInstance.storeFBStories({
						bucket: todayStories.data.data.bucket,
					});
				if (!status) {
					console.log(
						'Error:: From  LSDServiceInstance.storeFBStories' + ' error',
						error
					);
					await cs.set({ fetch_story_sync: false });
					if (token != undefined && token === false) {
						// await logoutTheExt();
						cr.sendMessage({
							type: 'logout',
							data: {
								message: 'Logout from LSD',
							},
						});
					}
					return;
				}

				console.log('storeFBStories :: ', data.payload);
				const storyDetails = await storeStoriesToSchromStorage(
					data.payload,
					false
				);
				// await getAlLStoriesFromBackend(userId);

				for (let i = 0; i < storyDetails.length; i++) {
					let { story_id } = storyDetails[i];
					// let pageInfo = viewerList_viewers.page_info;
					let pageInfo;
					console.log('story_id 100 :: ', story_id);

					// fetch story viewer list from facebook
					const response = await LSDServiceInstance.fetchFBStoryViewersList(
						story_id
					);

					console.log('response for fetch fb story viewer list  :: ', response);
					if (response.status) {
						if (response.data.data) {
							pageInfo = response.data.data.page_info;
						}
					} else {
						console.log(
							'Error :: LSDServiceInstance.fetchFBStoryViewersList  :: ',
							response.error
						);
						await cs.set({ fetch_story_sync: false });
						if (response.token != undefined && response.token === false) {
							// await logoutTheExt();
							cr.sendMessage({
								type: 'logout',
								data: {
									message: 'Logout from LSD',
								},
							});
						}
					}
					console.log(
						'story_id 100 :: ',
						story_id,
						response.data.data.page_info
					);

					if (pageInfo && pageInfo.has_next_page) {
						await fetchStoryViewerList(dtsg, userId, story_id, null, 30);
					}
				}
				await cs.set({ fetch_story_sync: false });
			} else {
				console.log('No stories for today');
				await cs.set({ fetch_story_sync: false });
				cr.sendMessage({
					type: 'noStoriesFound',
					data: { user_id: userId },
				});
				if (!debug_mode) {
					cr.sendMessage({ type: 'closeTab' });
					window.close();
				}
			}
		} else {
			await cs.set({ fetch_story_sync: false });
			console.log(`Something went wrong from facebook today's story info`);
		}
	} catch (error) {
		isAnyTaskInProgress = false;
		alert(error.message);
	} finally {
		await cs.set({ fetch_story_sync: false });
		isAnyTaskInProgress = false;
		await cs.set({ story_sync_id: null });
		cr.sendMessage({
			type: 'fbStoryFetchDoneSync',
			userId: null,
		});
		if (!debug_mode) {
			cr.sendMessage({ type: 'closeTab' });
			window.close();
		}
	}
};

async function getAlLStoriesFromBackend(userId) {
	try {
		const storiesRes = await LSDServiceInstance.getFbStoriesDetails(userId);

		if (storiesRes.token != undefined && storiesRes.token === false) {
			await logoutTheExt();
		}

		if (storiesRes.status) {
			const all_data = storiesRes.data.payload || [];
			await storeStoriesToSchromStorage(all_data);
			if (all_data.length > 0) {
				cr.sendMessage({
					type: 'fbStoryFetchDoneSync',
					userId,
				});
			} else {
				cr.sendMessage({
					type: 'noStoriesFoundSync',
					userId,
				});
			}
		} else {
			isAnyTaskInProgress = false;
			await cs.set({ story_sync_id: null });
			cr.sendMessage({
				type: 'fbStoryFetchDoneSync',
				userId,
			});
			if (!debug_mode) {
				cr.sendMessage({ type: 'closeTab' });
				window.close();
			}
		}
	} catch (error) {
		isAnyTaskInProgress = false;
		console.error(error);
		if (!debug_mode) {
			cr.sendMessage({ type: 'closeTab' });
			window.close();
		}
	}
}

async function fetchStoryViewerList(
	dtsg,
	userId,
	storyId,
	cursor,
	viewerCount
) {
	try {
		await config.delay(config.randomInt(2600, 5400));
		let response = await FBServiceInstance.getStoryViewerDetails(
			dtsg,
			userId,
			storyId,
			cursor,
			viewerCount
		);

		if (response.status) {
			if (response.data.data.node === null) return;
			const result = response.data.data.node.story_card_info.viewerList_viewers;

			const responseFromStory =
				await LSDServiceInstance.storeFBStoryViewersList(storyId, {
					data: response.data.data,
				});
			console.log('responseFromStory :: ', responseFromStory);
			if (!responseFromStory.status) {
				if (
					responseFromStory.token != undefined &&
					responseFromStory.token === false
				) {
					// await logoutTheExt();
					cr.sendMessage({
						type: 'logout',
						data: {
							message: 'Logout from LSD',
						},
					});
				}
				return { done: false, error: responseFromStory.error };
			}

			console.log('result.page_info.end_cursor :: ', storyId, result.page_info);
			if (result.page_info.has_next_page) {
				return await fetchStoryViewerList(
					dtsg,
					userId,
					storyId,
					result.page_info.end_cursor,
					30
				);
			} else {
				return { done: true };
			}
		} else {
			console.log('Something went wrong from facebook viewer list fetch');
		}
	} catch (error) {
		console.log(error);
		await cs.set({ fetch_story_sync: false });
		isAnyTaskInProgress = false;
		await cs.set({ story_sync_id: null });
		cr.sendMessage({
			type: 'fbStoryFetchDoneSync',
			userId,
		});
		if (!debug_mode) {
			cr.sendMessage({ type: 'closeTab' });
			window.close();
		}
	}
}

async function storeStoriesToSchromStorage(all_data, save = true) {
	if (all_data.length) {
		let storyDetails = [];

		all_data.forEach((story) => {
			storyDetails = [
				...storyDetails,
				{
					automation_id: story.automation_id,
					profile_url: story.profile_url,
					fb_user_id: story.fb_user_id,
					is_active: story.is_active,
					story_id: story.story_id,
					bucket_id: story.bucket_id,
					viewer_count: story.viewer_count,
					play_duration: story.play_duration,
					total_reaction_count: story.total_reaction_count,
					viewer_list: story.viewer_list,
					thumbnail: story.thumbnail,
					polls: story.polls,
					creation_time: story.creation_time,
					local_creation_time: story.local_creation_time,
					message: story.message,
					story_replies: story.story_replies,
					dominant_color: story.dominant_color,
					story_type: story.story_type,
					story_attachement_uri: story.story_attachement_uri,
					_id: story._id,
					user_id: story.user_id,
					createdAt: story.createdAt,
					updatedAt: story.updatedAt,
				},
			];
		});
		if (save) await cs.set({ all_story_details: storyDetails });
		return storyDetails;
	} else {
		return [];
	}
	// save all todays story details
}

initSync();
syncStart();
