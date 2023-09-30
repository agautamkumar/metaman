const config = require('../config/index');
const querystring = require('querystring');
class FB_Service {
	constructor() {
		this.grahphApi = 'https://www.facebook.com/api/graphql/';
		this.config = config;
	}

	async fetchFbIds() {
		try {
			return new Promise((resolve, reject) => {
				fetch(
					'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed',
					{
						method: 'GET',
					}
				)
					.then((e) => e.text())
					.then((e) => {
						let dtsgData = e.match(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/);
						let userIdData = e.match(/\\"USER_ID\\":\\"(.*?)\\"/);
						let fbnameData = e.match(/\\"NAME\\":\\"(.*?)\\"/);

						console.log(
							'e.match  ::',
							e.match(/profile picture\" role=\"img\" style=\"/)
						);
						try {
							resolve({
								status: true,
								dtsg: dtsgData[1],
								userId: userIdData[1],
								fbname: fbnameData[1],
							});
						} catch (error) {
							resolve({ status: false, error: error.message });
						}
					})
					.catch((err) => {
						console.log('FB Get Dtsg Service ', err);
						resolve({ status: false, error: err.message });
					});
			});
		} catch (error) {
			resolve({ status: false, error: error.message });
		}
	}

	async getProfileInfo (callback = null){

		return new Promise((resolve, reject) => {

			const headers = {
				Accept : 'text/html,application/xhtml+xml,application/xml'
			  };
			  
			  const requestOptions = {
				method: 'GET',
				headers: headers
			  };
			  fetch("https://www.facebook.com/", requestOptions)
				.then((e) => e.text())
				.then(async (e) => {
					if(e.match(/\{"u":"\\\/ajax\\\/qm\\\/\?[^}]*\}/gm) == null){
						resolve({ status: false, error: "Please log in to facebook" });
					}
				  let userProfileData = e.match(/\{"u":"\\\/ajax\\\/qm\\\/\?[^}]*\}/gm);
				  if(userProfileData==null){
					return resolve({
						status : false
					})
				  }
				  userProfileData =  userProfileData[0];
				  userProfileData = JSON.parse(userProfileData);
				  let userData = {
					fbDtsg: userProfileData.f,
					userId: userProfileData.u.split("__user=")[1].split("&")[0],
				};
					resolve({
						status: true,
						dtsg: userData.fbDtsg,
						userId: userData.userId,
						fbname: "N/A",
					});
				})


		})
		
	  };
	async getStoryBucketInfo(dtsg, userId) {
		return new Promise(async (resolve, reject) => {
			try {
				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};

				let data = {
					fb_dtsg: dtsg,
					fb_api_caller_class: 'RelayModern',
					fb_api_req_friendly_name: 'StoriesTrayRectangularRootQuery',
					av: userId,
					__user: userId,
					doc_id: '4387929251256595',
					server_timestamps: true,

					variables: JSON.stringify({
						bucketsToFetch: 7,
						scale: 2,
						shouldEnableLiveInStoriesDropdown: false,
						shouldEnableVideoAutoplay: false,
						shouldPrefetchProfilePic: true,
					}),
				};

				let a = await fetch(this.grahphApi, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'text/html,application/json',
						'x-fb-friendly-name': 'StoriesTrayRectangularRootQuery',
					},
					body: serialize(data),
				});

				const outputData = await a.json();

				let StoriesInBucket =
					outputData.data.me.unified_stories_buckets.edges[0].node
						.unified_stories.edges.length;
				// let StoriesInBucket =
				let BucketId =
					outputData.data.me.unified_stories_buckets.edges[0].node.id;
				let BucketOwnerId =
					outputData.data.me.unified_stories_buckets.edges[0].node
						.story_bucket_owner.id;

				resolve({
					status: true,
					data: { StoriesInBucket, BucketId, BucketOwnerId },
				});
			} catch (error) {
				console.log('Get Bucket Info info from facebook service :: ', error);
				resolve({ status: false, error: error.message });
			}
		});
	}

	async fetchTodaysStory(dtsg, userId) {
		return new Promise(async (resolve, reject) => {
			try {
				const {
					status: bucketApiStatus,
					data: bucketData,
					error: bucketError,
				} = await this.getStoryBucketInfo(dtsg, userId);

				if (!bucketApiStatus) {
					throw new Error(bucketError);
				}
				const { StoriesInBucket, BucketId, BucketOwnerId } = bucketData;
				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};

				let data = {
					fb_dtsg: dtsg,
					fb_api_caller_class: 'RelayModern',
					fb_api_req_friendly_name:
						'StoriesSuspenseContentPaneRootWithEntryPointQuery',
					av: userId,
					__user: userId,
					doc_id: '4516476231747777',
					server_timestamps: true,

					variables: JSON.stringify({
						blur: 20,
						bucketID: BucketId,
						initialBucketID: BucketId,
						initialLoad: true,
						scale: 2,
						shouldEnableLiveInStories: false,
						shouldEnableLiveInStoriesDropdown: false,
						showSuggestedStickerReplies: true,
					}),
				};

				let a = await fetch(this.grahphApi, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'text/html,application/json',
						'x-fb-friendly-name':
							'StoriesSuspenseContentPaneRootWithEntryPointQuery',
					},
					body: serialize(data),
				});

				// const outputData = await a.json();
				const outputData = await this.parseJson(a);
				console.log('Fetch Today Story :: ', outputData);
				await this.config.delay(this.config.randomInt(2400, 5200));
				resolve({ status: true, data: outputData });
			} catch (error) {
				console.log('Get Todays story info from facebook service :: ', error);
				resolve({ status: false, error: error.message });
			}
		});
	}

	async getArchivedStories(dtsg, userId) {}
	async getStoryViewerDetails(dtsg, userId, storyId, cursor, viewerCount = 10) {
		return new Promise(async (resolve, reject) => {
			try {
				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};

				let data = {
					fb_dtsg: dtsg,
					fb_api_caller_class: 'RelayModern',
					fb_api_req_friendly_name: 'StoriesViewerSheetViewerListContentQuery',
					av: userId,
					__user: userId,
					doc_id: '4870368573054025',
					variables: JSON.stringify({
						cursor: cursor,
						viewerCount: viewerCount,
						id: storyId,
					}),
				};

				let a = await fetch(this.grahphApi, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'text/html,application/json',
						'x-fb-friendly-name': 'StoriesViewerSheetViewerListContentQuery',
					},
					body: serialize(data),
				});
				const responseData = await a.json();

				console.log('Viewer List Data :: ', responseData);

				resolve({ status: true, data: responseData });
			} catch (error) {
				console.log('Get Profile info from facebook service :: ', error);
				resolve({ status: false, error: error.message });
			}
		});
	}

	async getProfielInformation(dtsg, userId) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.config.delay(this.config.randomInt(2500, 4000));
				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};

				let data = {
					fb_dtsg: dtsg,
					fb_api_caller_class: 'RelayModern',
					fb_api_req_friendly_name: 'ProfileCometTimelineListViewRootQuery',
					av: userId,
					__user: userId,
					doc_id: '5544903625525201',

					variables: JSON.stringify({
						scale: 1,
						userID: userId,
					}),
				};

				let a = await fetch(this.grahphApi, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'text/html,application/json',
						'x-fb-friendly-name': 'ProfileCometTimelineListViewRootQuery',
					},
					body: serialize(data),
				});
				const responseData = await a.json();

				resolve({ status: true, data: responseData });
			} catch (error) {
				console.log('Get Profile info from facebook service :: ', error);
				resolve({ status: false, error: error.message });
			}
		});
	}

	async sendMessageWithFB(
		dtsg,
		userId,
		message,
		receiverId,
		alt = false,
		tryTime = 1
	) {
		try {
			let serialize = function (obj) {
				let str = [];
				for (let p in obj)
					if (obj.hasOwnProperty(p)) {
						str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
					}
				return str.join('&');
			};
			console.log(
				'send message to user with help of FB API -> Sender ID and Message IS :: ',
				receiverId,
				message
			);

			let Ids = `ids[${receiverId}]`;
			if (alt) {
				var tids = `cid.c.${userId}:${receiverId}`;
			} else {
				var tids = `cid.c.${receiverId}:${userId}`;
			}

			const objjj = {
				fb_dtsg: dtsg,
				body: message,
				send: 'Send',
				tids: tids,
			};

			objjj[`${Ids}`] = receiverId;

			console.log(
				`Payload for message sending API :: ${receiverId} :: `,
				objjj
			);

			const response = await fetch(
				'https://mbasic.facebook.com/messages/send/?icm=1&refid=12',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'text/html,application/json',
						origin: 'https://mbasic.facebook.com',
					},
					body: serialize(objjj),
				}
				// serialize(objjj),
				// {
				// 	headers: {
				// 		'content-type': 'application/x-www-form-urlencoded',
				// 		origin: 'https://mbasic.facebook.com',
				// 	},
				// }
			);
			const data = await response.text();

			if (tryTime > 2) {
				return { status: true, triedButFailed: true, sentMessage: false };
			}
			if (data.includes('You cannot perform that action')) {
				console.log('First Message method got failed ', receiverId);
				console.log('Trying second(alt) method', receiverId);
				return this.sendMessageWithFB(
					dtsg,
					userId,
					message,
					receiverId,
					true,
					++tryTime
				);
			}
			return { status: true, triedButFailed: false, sentMessage: true };
		} catch (error) {
			console.log('Message Error', error);
			return { status: false, error: error.message };
		}
	}

	// send message to facebook (arindam)
	async sendMessage(dtsg, userId, message, receiverId) {
		return new Promise(async (resolve, reject) => {
			try {
				const formData = new FormData();
				formData.append('__user', userId);
				formData.append('fb_dtsg', dtsg);
				formData.append('body', message);
				formData.append(`ids[${receiverId}]`, receiverId);
				formData.append('tids', `cid.c.${receiverId}:${userId}`);
				// formData.append('lsd', 'gdNEuc12HxgpznjO97j844")
				formData.append('waterfall_source', 'message');
				formData.append('server_timestamps', true);
				// const response = await axios.post(
				// 	'https://m.facebook.com/messages/send/?icm=1&entrypoint=jewel&surface_hierarchy=unknown&refid=12',
				// 	formData,
				// 	{
				// 		headers: {
				// 			'content-type': 'application/x-www-form-urlencoded',
				// 		},
				// 	}
				// );

				let data = {
					__user: userId,
					fb_dtsg: dtsg,
					body: message,
					// tids: `cid.c.${receiverId}:${userId}`,
					waterfall_source: 'message',
					// server_timestamps: true,
				};

				// data[`ids[${receiverId}]`] = receiverId;
				data[`ids[0]`] = receiverId;

				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};
				//  https://m.facebook.com/messages/send/?icm=1&entrypoint=jewel&surface_hierarchy=unknown&refid=12

				let a = await fetch(
					`https://m.facebook.com/messages/send/?icm=1&ifcd=1`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Accept: 'text/html,application/json',
						},
						body: serialize(data),
					}
				);
				const responseData = await a.text();
				// console.log('Send Message API', responseData);
				if (responseData.includes('You cannot perform that action')) {
					console.log('You cannot perform that action');
					resolve({ status: false, error: 'You cannot perform that action' });
				} else {
					resolve({ status: true, data: responseData });
				}
			} catch (error) {
				console.log('Send Message Error', error);
				reject({ status: false, error: error.message });
			}
		});
	}

	async sendMessageByGautam() {
		return new Promise(async (resolve, reject) => {
			try {
				let serialize = function (obj) {
					let str = [];
					for (let p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(
								encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
							);
						}
					return str.join('&');
				};
				let Ids = `ids[${receiverId}]`;
				if (alt) {
					var tids = `cid.c.${userId}:${receiverId}`;
				} else {
					var tids = `cid.c.${receiverId}:${userId}`;
				}
				let data = {
					__user: userId,
					fb_dtsg: dtsg,
					body: message,
					server_timestamps: true,
					send: 'Send',
					[Ids]: receiverId,
					tids: tids,
					waterfall_source: 'message',
					server_timestamps: true,
				};
				await this.config.delay(this.config.randomInt(8900, 16000));

				let a = await fetch(
					'https://mbasic.facebook.com/messages/send/?icm=1&refid=12',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Accept: 'text/html,application/json',
						},
						body: serialize(data),
					}
				);
				response = await a.text();
				++noOfTry;
				if (noOfTry === 3) {
					throw new Error('Send Message Error');
				}
				if (response.includes('You cannot perform that action')) {
					console.log('Executing alternate message sending');
					return sendMessage(dtsg, userId, message, receiverId, true, noOfTry);
				}
				resolve({ status: true, data: response });
			} catch (error) {
				console.log('Send Message Error:: ', error);
				resolve({ status: false, error: error.message });
			}
		});
	}

	// handle response
	handleResponseStatusAndContentType(response) {
		const contentType = response.headers.get('content-type');

		if (response.status === 401) throw new Error('Request was not authorized.');

		if (contentType === null) return Promise.resolve(null);
		else if (contentType.startsWith('application/json;'))
			return response.json();
		else if (contentType.startsWith('text/plain;')) return response.text();
		else throw new Error(`Unsupported response content-type: ${contentType}`);
	}

	async parseJson(response) {
		const text = await response.text();
		try {
			const json = JSON.parse(text);
			return json;
		} catch (err) {
			return JSON.parse(text.split('\r\n')[0]);
		}
	}
}

module.exports = FB_Service;
