chrome.action.onClicked.addListener(function (tab) {
	chrome.tabs.create({ url: "popup.html" });
});


const { storySyncNowOnlyApi } = require('../config');
const config = require('../config');
const FBService = require('../services/FB_Service');
const FBServiceInstance = new FBService();

const KyubiService = require('../services/Kyubi_Service');
const kyubiServiceInstance = new KyubiService();

const LSDService = require('../services/LSD_Service');
const LSDServiceInstance = new LSDService();
const kyubiSettings = require('../../public/kyubiSettings.json');

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

async function getFbProfile(local = false){
	let { status, fbname, dtsg, userId,fbProfileImg, error } =
	await FBServiceInstance.getProfileInfo();
	console.log("2",status,fbname,dtsg,userId,fbProfileImg)
				if (userId == undefined || dtsg == undefined) {
					if(local){
						 return ({
							status : false
						})
					}
					console.log("verification")
					cs.set({'error_message_fbinfo':"Unable to fetch your facebook profile information. Please log in to facebook"})
					cr.sendMessage({
						type: 'errorForDashboard',
						data: {
							error:
								'Unable to fetch your facebook profile information. Please log in to facebook',
						},
					});
				}

				if(local){
					return({
						status : true,
						userId,
						dtsg
					}) 
				}
				cs.set({ 'fb_data_lsd':{status, fbname, dtsg, userId}})
				cr.sendMessage({
					type: 'gotFbProfile',
					data: {
						fbProfileImg,
						fbName: fbname,
						userId : userId,
						dtsg
					},
				});
}

cr.onMessage.addListener(async (req, sender, sendResponse) => {
	try {
		switch (req.type) {
			case 'closeTab': {
				await ct.remove(sender.tab.id);
				break;
			}

			case 'getFbProfile': {
				getFbProfile()
				break;
			}
			case 'triggerFB': {
				const { API, httpMethod,payload} = req.data
				let fbAuth = await getFbProfile(true)
				if(fbAuth.status){
					console.log("In middleware :",fbAuth,req.data)
					let fbResponse = 
					await FBServiceInstance.FBAPICall(fbAuth.userId,fbAuth.dtsg,API,payload,httpMethod);
					if(fbResponse.status){
						console.log("Response 200 ok",fbResponse)
						cr.sendMessage({
							type : "fbResponse",
							data : fbResponse.data
						})
					}else{
						console.log("Something got fucked up while communicating with FB")
					}
				}
				break;
			}
			
			case 'loginDone': {
				// set automation message alarm
				//  alarmSetUpForAutomationRun();
				// set automation sync alarm
				//  alarmSetForAutoSyncAutomation();
				//  alarmSetForAutoMsgAutomation();

				// syncStoriesNow(true);
				break;
			}

			case 'logout': {
				logoutTheExt();
				chrome.alarms.clearAll();
				chrome.storage.local.get(null, function (items) {
					var allKeys = Object.keys(items);
					console.log(allKeys);
					for (let i = 0; i < allKeys.length; i++) {
						chrome.storage.local.remove(allKeys[i]);
					}
				});
				break;
			}
			
		}
	} catch (error) {
		console.log('Error in cr.onMessage', error);
	}
});

// cr.onMessageExternal.addListener(function(message,sender, sendResponse) {
// 		console.log("web page connection",message,sender)
// })

//  requests sent from portal receives here
chrome.runtime.onMessageExternal.addListener( async function (
  request,
  sender,
  sendResponse
) {

  var manifest = chrome.runtime.getManifest();
  // let senderOrigin = sender.origin.replace("www.", "");
  // if (
  //   manifest.externally_connectable.matches[0].substring(1, 19) !==
  //   senderOrigin.substring(1, 19)
  // ) {
  //   return;
  // }

  if (request.action) {
    if (request.action === "responder-data") {
      chrome.storage.local.set({ responderData: request.data });
    }

    if (request.action === "RDS") {
      console.log({ ...request.data });
      chrome.storage.local.set({ ...request.data });
    }

    if (request.action === "WLA") {
      chrome.storage.local.set({ ...request.data });
    }
  } else {
    if (request === "version") {
	const loggedInUserInfo = await config.getloggedInUserInfo();
	let fb_data_lsd = await cs.get('fb_data_lsd')
	if(Object.keys(fb_data_lsd).length>0){

		await getFbProfile()
		fb_data_lsd = await cs.get('fb_data_lsd')
	}
	const error_message_fbinfo = await cs.get('error_message_fbinfo')
      sendResponse({
		loggedInUserInfo,
		facebookInfo : fb_data_lsd,
		error_message_fbinfo ,
        version: manifest.version,
        logo: chrome.runtime.getURL(kyubiSettings.logo.primary_logo),
        secondary_logo: chrome.runtime.getURL(kyubiSettings.logo.secondary_logo),
        extId: kyubiSettings.extId,
        appName: kyubiSettings.appName,
        backgroundImage: chrome.runtime.getURL(
          kyubiSettings.logo.background_image
        ),
		description : kyubiSettings.description,
		mailTo : kyubiSettings.mailTo,
        forgotPassURL: kyubiSettings.forgotPassURL,
        changePassURL: kyubiSettings.changePassURL,
        youtubeLink: kyubiSettings.youtubeLink,
        signupURL: kyubiSettings.signupURL,
        preLoader: chrome.runtime.getURL(kyubiSettings.loader.preLoader),
        footer: kyubiSettings.footer,
        appBaseBackendUrl: kyubiSettings.appBaseBackendUrl,
      });
    }

	if (request === "sync"){
		// await profileSync(true);
		console.log("I am ehre")
		let resp = await syncStoriesNow(true);
		sendResponse({
			response : resp
		})
				
	}

	if(request =="profileInfo"){
		let { status, fbname, dtsg, userId, error } =
		await FBServiceInstance.getProfileInfo();
		let fbUserInfo = await FBServiceInstance.getProfielInformation(
			dtsg,
			userId
		);
		sendResponse({
			fbUserInfo
		})
	}
		if(request === "loginStatus"){
			const loggedInUserInfo = await config.getloggedInUserInfo();
			sendResponse({login : loggedInUserInfo})
		}

    if (request === "start-responder") {
      chrome.storage.local.get(["autoResponder"], ({ autoResponder }) => {
        if (autoResponder !== "yes") {
          chrome.storage.local.set({ autoResponder: "yes" }, () => {
            checkTabStatus();
          });
        }
      });
    }

    if (request === "stop-responder") {
      chrome.storage.local.get(["autoResponder"], ({ autoResponder }) => {
        if (autoResponder !== "no") {
          chrome.storage.local.set({ autoResponder: "no" }, () => {
            checkTabStatus();
          });
        }
      });
    }

    if (request.startsWith("lT-silent")) {
      chrome.storage.local.set({ lT: request.split(":")[1] }, () => {
        checkTabStatus();
      });
    } else if (request.startsWith("lT")) {
      chrome.storage.local.set({ lT: request.split(":")[1] }, function () {
        checkLinkedInLogin(`https://www.linkedin.com/login`, (code = 200) => {
          var dataToSend = {};
          if (code === 200) {
            dataToSend = { type: "success", status: 200, message: "Saved" };
          } else {
            dataToSend = {
              type: "error",
              status: 401,
              message: "Please Login",
            };
          }
          sendResponse(dataToSend);
          if (dataToSend.status !== 200) {
            chrome.storage.local.remove(["lT"], () => {
              checkTabStatus();
            });
          }
        });
      });
    }

    if (request.startsWith("removeLT")) {
      chrome.storage.local.remove(["lT", "autoResponder"], () => {
        chrome.storage.local.remove(["lT"]);
        checkTabStatus("logout");
        chrome.alarms.clearAll();
      });
      // chrome.alarms.create("clear-all", {
      //   when: new Date(new Date().getTime() + 3000).getTime(),
      // });
    }

    if (request.startsWith("dashboard-profile-stats")) {
      chrome.storage.local.get(
        [
          "numOfSearchedAppeared",
          "viewedMyProfile",
          "postView",
          "emailAddress",
          "identifier",
          "numConnections",
          "picture",
          "firstName",
          "lastName",
        ],
        (result) => {
          sendResponse(result);
        }
      );
    }
  }
});



chrome.alarms.onAlarm.addListener(async (alarm) => {
	try {
		if (alarm.name === 'auto_story_fetch') {
			await profileSync();
			await syncStoriesNow();
		}

		// lsten alarm for dtsg and cookie update in DB
		if (alarm.name === 'updateFbLoggedinInfo') {
			await updateCookiesInfo();
		}

		if (alarm.name === 'story_automation') {
			// await cs.set({ automation_time: nextTimeToRun(50) });
			console.log('Listening to story automation alarm');
			await automationRunForStories();
		}

		if (alarm.name === 'auto_msg_automation') {
			await sendMessageForAutomation();
		}
	} catch (error) {
		console.log(error);
		console.log('Error in cr.onAlarm', error);
	}
});

const profileSync = async (manual = false) => {
	try {
		let { status, fbname, dtsg, userId, error } =
			await FBServiceInstance.getProfileInfo();

		if (!userId || !dtsg) {
			throw new Error('userId or dtsg not found');
		}
		// get fb user info from facebook
		let fbUserInfo = await FBServiceInstance.getProfielInformation(
			dtsg,
			userId
		);

		console.log(fbUserInfo);

		if (fbUserInfo.status) {
			console.log('Came here for get fb profile info :: ', fbUserInfo);

			// send current fb profile info to LSD backend
			const { status, data, error, token } =
				await LSDServiceInstance.storeFBProfiles({
					data: fbUserInfo.data.data,
				});

			if (!status) {
				console.log('Error in storing FB profile info in LSD backend', error);
				console.log('tokens :: ', token);

				if (token != undefined && token === false) {
					await logoutTheExt();
					return;
				}

				if (manual)
					console.log("error here uncomment the below",error)
					// cr.sendMessage({
					// 	type: 'error',
					// 	data: {
					// 		error: error,
					// 	},
					// });
			}

			await cs.set({
				fbActiveProfile: {
					fbProfileImg:
						fbUserInfo.data.data.user.profile_composer_info.viewer.actor
							.profile_picture.uri,
					fbName: fbname,
					loggedINFB: true,
					fb_user_id: userId,
				},
			});

			// cr.sendMessage({
			// 	type: 'gotFbProfile',
			// 	data: {
			// 		fbProfileImg:
			// 			fbUserInfo.data.data.user.profile_composer_info.viewer.actor
			// 				.profile_picture.uri,
			// 		fbName: fbname,
			// 		loggedINFB: true,
			// 	},
			// });
		} else {
			console.log(fbUserInfo.error);
			console.log(' Getting fb profile info from LSD Backnd Service');
		}
	} catch (error) {
		console.log('Error in profileSync', error);
	}
};

const updateCookiesInfo = async () => {
	const loggedInUserInfo = await config.getloggedInUserInfo();
	if (!loggedInUserInfo.lsd_token) return;

	const loggedInUserCookies = await chrome.cookies.getAll({
		url: 'https://m.facebook.com',
	});

	////////////////////////////////

	const {
		status: dtsg_status,
		dtsg,
		userId,
		fbname,
		error: dtsg_error,
	} = await FBServiceInstance.getProfileInfo();

	const paylaod = {
		dtsg,
		userId,
		loggedInUserCookies: loggedInUserCookies || [],
		fb_name: fbname,
	};
	const res = await LSDServiceInstance.updateFbProfileTokens(paylaod);
	if (!res.status) {
		console.log(
			'Error in updating cookies info in LSD backend',
			res.error,
			res
		);
		if (res.token === false) {
			logoutTheExt();
		}
	}
	if (!res.status) console.log(res.error);

	return res.data.payload;

	////////////////////////////////

	// if (loggedInUserCookies && loggedInUserCookies.length > 0) {
	// 	const {
	// 		status: dtsg_status,
	// 		dtsg,
	// 		userId,
	// 		fbname,
	// 		error: dtsg_error,
	// 	} = await FBServiceInstance.getProfileInfo();
	// 	if (!dtsg_status) {
	// 		console.log(
	// 			'Error in getting FB Ids , May be you are not logged in',
	// 			dtsg_error
	// 		);
	// 		return;
	// 	}
	// 	if (dtsg && userId) {
	// 		const paylaod = {
	// 			dtsg,
	// 			userId,
	// 			loggedInUserCookies,
	// 			fb_name: fbname,
	// 		};
	// 		const res = await LSDServiceInstance.updateFbProfileTokens(paylaod);
	// 		if (!res.status) console.log(res.error);
	// 		return res.data.payload;
	// 	}
	// } else {
	// 	console.log('User  is not logged in. We are unable to found the cookie');
	// }
};

const uniqueid = () => {
	return 'id' + Math.random().toString(16).slice(2);
};

const splitName = (name = '') => {
	const [firstName, ...lastName] = name.split(' ').filter(Boolean);
	return {
		'{First Name}': firstName,
		'{Last Name}': lastName.join(' '),
	};
};

async function checkLoggedIn() {
	const userInfo = await config.getloggedInUserInfo();
	if (userInfo.is_logged_in && userInfo.email && userInfo.kyubi_token) {
		return true;
	}
	return false;
}

async function logoutTheExt() {
	let loggedInUserInfo = {
		is_logged_in: false,
		email: '',
		kyubi_token: '',
		lsd_token: '',
	};
	await cs.set({ lsd_user_info: loggedInUserInfo });
	await cs.set({ fetch_story_sync: false });
	await chrome.alarms.clearAll();
	await cr.sendMessage({ type: 'reloadPage' });
}

async function automationRunForStories() {
	try {
		const { automation_runnning } = await cs.get('automation_runnning');
		// if (automation_runnning) {
		// 	console.log('Previous Automation Process is running already.....');
		// 	return;
		// }
		const user_status = await kyubiServiceInstance.checkUserStatus();
		if (user_status.status) {
			await cs.set({ automation_runnning: true });

			await messageAutomationRun();
			await cs.set({ automation_runnning: false });
		} else {
			logoutTheExt();
		}
	} catch (error) {
		console.log('Error in automationRunForStories', error);
		await cs.set({ automation_runnning: false });
	} finally {
		await cs.set({ automation_runnning: false });
	}
}

async function getAlLStoriesFromBackend(userId) {
	const storiesRes = await LSDServiceInstance.getFbStoriesDetails(userId);

	if (storiesRes.token != undefined && storiesRes.token === false) {
		await logoutTheExt();
	}

	if (storiesRes.status) {
		const all_data = storiesRes.data.payload || [];
		await storeStoriesToSchromStorage(all_data);
		if (all_data.length > 0) {
			cr.sendMessage({
				type: 'fbStoryFetchDone',
				data: { user_id: userId },
			});
		} else {
			cr.sendMessage({
				type: 'noStoriesFound',
				data: { user_id: userId },
			});
		}
	} else {
		cr.sendMessage({
			type: 'noStoriesFound',
			data: { user_id: userId },
		});
		cr.sendMessage({
			type: 'error',
			data: {
				error: storiesRes.error,
			},
		});
	}
}

// function to run the message automation
async function messageAutomationRun() {
	// await automationToFetchTodaysStory(); // sync with facebook
	// const { logDetails } = await cs.get('logDetails');

	let { status, fbname, dtsg, userId, error } =
		await FBServiceInstance.getProfileInfo();

	if (!status) {
		console.log(
			'Error in getting FB Ids , May be you are not logged in',
			error
		);
		return;
	}

	const resOfAutomationa = await LSDServiceInstance.runAutomation(userId);

	if (resOfAutomationa.token != undefined && resOfAutomationa.token === false) {
		console.log("Log in service worker, automation exe failed",resOfAutomationa)
		// await logoutTheExt();
	}

	console.log(resOfAutomationa);

	if (resOfAutomationa.status) {
		const resOfAutomation = resOfAutomationa.data;
		console.log("resOfAutomation",resOfAutomation);
		if (resOfAutomation.payload && resOfAutomation.payload.length > 0) {
					await cs.set({ msgBank: resOfAutomation.payload[0] });
			}
			let { msgBank } = await cs.get('msgBank');
			console.log("final stuff in msgBank",msgBank)
			await alarmSetForAutoMsgAutomation();
		}
	}
	//Old code comment out if new code doesnt work
	// if (resOfAutomationa.status) {
	// 	const resOfAutomation = resOfAutomationa.data;
	// 	console.log(resOfAutomation);
	// 	if (resOfAutomation.payload && resOfAutomation.payload.length > 0) {
	// 		for (let i = 0; i < resOfAutomation.payload.length; i++) {
	// 			const automation = resOfAutomation.payload[i];
	// 			let { msgBank } = await cs.get('msgBank');
	// 			console.log(automation);
	// 			// if (logDetails) {
	// 			// 	logDetails.push(`Start automation ID :: ${automation.automation_id}`);
	// 			// 	await cs.set({ logDetails });
	// 			// } else {
	// 			// 	await cs.set({
	// 			// 		logDetails: [`Start automation ID :: ${automation.automation_id}`],
	// 			// 	});
	// 			// }
	// 			console.log(msgBank);
	// 			if (msgBank && msgBank.length > 0) {
	// 				const thisAUtomationFound = msgBank.find(
	// 					(msg) => msg.automation_id === automation.automation_id
	// 				);

	// 				if (thisAUtomationFound) {
	// 					let messagesForAutomation = thisAUtomationFound.messageList;
	// 					messagesForAutomation = [
	// 						...messagesForAutomation,
	// 						...automation.messageList,
	// 					];
	// 					const newMsgPayload = {
	// 						...thisAUtomationFound,
	// 						messageList: [
	// 							...new Map(
	// 								messagesForAutomation.map((item) => [item['id'], item])
	// 							).values(),
	// 						],
	// 					};
	// 					msgBank = msgBank.map((msg) => {
	// 						if (msg.automation_id === automation.automation_id) {
	// 							return newMsgPayload;
	// 						}
	// 						return msg;
	// 					});
	// 				} else {
	// 					msgBank.push(automation);
	// 				}
	// 				await cs.set({ msgBank });
	// 			} else {
	// 				const newMsgBank = [];
	// 				newMsgBank.push(automation);
	// 				await cs.set({ msgBank: newMsgBank });
	// 			}
	// 		}

	// 		await alarmSetForAutoMsgAutomation();
	// 	}
	// }
// }

const sendMessageForAutomation = async () => {
	try {
		let { msgBank } = await cs.get('msgBank');
		console.log("msgBank",msgBank);
		if (msgBank && msgBank.messageList!= undefined && msgBank.messageList.length) {
			// for (let i = 0; i < msgBank.length; i++) {
				const { messageList, automation_id, active } = msgBank;
				if (active) {
					if (messageList.length > 0) {
						const messagePayload = messageList.shift();

						 // fetch local logs and check if message is already sent or not 
						const { sentMessageLogs } = await cs.get('sentMessageLogs');
						let localMessageLogs = sentMessageLogs!=undefined && sentMessageLogs? sentMessageLogs : [] 
						if(sentMessageLogs == undefined){
							await cs.set({sentMessageLogs : []})
						}
						console.log("local message logs",localMessageLogs)
						if(!localMessageLogs.includes(messagePayload.id+automation_id)){
							console.log("send message",messagePayload)
							await sendMessageAutomation(automation_id, messagePayload);
							// const filteredMsgList = messageList.filter(
							// 	(msg) => msg.id !== messagePayload.id
							// );
							const newMsgBank = msgBank.messageList.map((msg) => {
								if (msg.automation_id === automation_id) {
									return {
										...msg,
										messageList: messageList,
									};
								}
								return msg;
							});
							console.log("updated MessageBank",newMsgBank)
							await cs.set({ msgBank: newMsgBank });
						}else{
							const newMsgBank = msgBank.map((msg) => {
								if (msg.automation_id === automation_id) {
									return {
										...msg,
										messageList: messageList,
									};
								}
								return msg;
							});
							console.log("Programme tried to send duplicate message, but handled via extra layer of protection",messagePayload)
							await cs.set({ msgBank: newMsgBank });  
						}
					
					} else {
						// msgBank.splice(i, 1);
						// await cs.set({ msgBank: msgBank });
						// if (msgBank.length > 0) {
						// 	sendMessageForAutomation();
						// }
					}
				// }
			}
		}
	} catch (error) {
		console.log('Error in sendMessageForAutomation', error);
	}
};

async function nextTimeToRun(addTime) {
	let now = new Date();
	now.setMinutes(now.getMinutes() + addTime); // timestamp
	now = new Date(now); // Date object
	console.log(now.toLocaleString());
}

async function alarmSetForAutoMsgAutomation() {
	const alarm = await chrome.alarms.get(`auto_msg_automation`);
	if (!alarm) {
		const timeperiod = 2.1;
		await chrome.alarms.create(`auto_msg_automation`, {
			delayInMinutes: timeperiod,
			periodInMinutes: timeperiod,
		});
	}
}

async function alarmSetForAutoSyncAutomation() {
	const alarm = await chrome.alarms.get(`auto_story_fetch`);
	if (!alarm) {
		const timeperiod = 14.6;
		// const timeperiod = 2.6;
		await chrome.alarms.create(`auto_story_fetch`, {
			delayInMinutes: timeperiod,
			periodInMinutes: timeperiod,
		});
	}
}

async function alarmSetUpForAutomationRun() {
	const alarm = await chrome.alarms.get(`story_automation`);
	if (!alarm) {
		// const timeperiod = config.randomInt(50, 65);
		const timeperiod = 1;
		// const timeperiod = 2.9;

		await chrome.alarms.create(`story_automation`, {
			delayInMinutes: timeperiod,
			periodInMinutes: timeperiod,
		});
		await cs.set({ automation_time: nextTimeToRun(timeperiod) });
	}
}

const sendMessageAutomation = async (automation_id, messagePayload) => {
	try {
		// await config.delay(config.randomInt(14449, 25150)); // delay for send message
		let { status, fbname, dtsg, userId, error } =
			await FBServiceInstance.getProfileInfo();

		if (!status) {
			console.log(
				'Error in getting FB Ids , May be you are not logged in',
				error
			);
			return;
		}

		if (userId !== messagePayload.owner_id) {
			console.log('Logged In User Id are not matching with owner');
			// let { msgBank } = await cs.get('msgBank');
			// if (msgBank.length > 0) {
			// 	msgBank = msgBank.filter((msg) => msg.automation_id !== automation_id);
			// 	await cs.set({ msgBank });
			// }
			await cs.set({ msgBank: [] });
			return;
		}

		const { name, id: user_id, message, update_type: type } = messagePayload;
		console.log(`Send message to user :: ${user_id} = ${name}`);

		// const responseMessage = await FBServiceInstance.sendMessage(
		// 	dtsg,
		// 	userId,
		// 	message,
		// 	user_id
		// );

		const responseMessage = await FBServiceInstance.sendMessageWithFB(
			dtsg,
			userId,
			message,
			user_id
		);
		console.log('responseMessage == ', responseMessage);

		if (responseMessage.status) {
			// update user id for automation
			console.log(`Successfully Sent message to user :: ${user_id}`);
			// update in local msg sent logs for extra validation 
			const { sentMessageLogs } = await cs.get('sentMessageLogs');
			let prevLogs = sentMessageLogs!=undefined && sentMessageLogs.length? sentMessageLogs : [] 
			
			await cs.set({ sentMessageLogs: [...prevLogs,user_id+automation_id] });
			const updateRes = await LSDServiceInstance.updateAutomationForAutomation(
				automation_id,
				type,
				user_id,
				name,
				message,
				responseMessage.sentMessage,
				responseMessage.triedButFailed
			);
			console.log(
				`Successfully Update DB to user :: ${user_id} :: = `,
				updateRes
			);
		}
	} catch (error) {
		console.log(`Error in sending message [${user_id}] => `, error);
		console.log('Error in sendMessage - Automation', error);
	}
};

async function syncStoriesNow(manual = false) {
	// return;
	console.log("sync stories now")

		if (checkLoggedIn()) {
			let { status, fbname, dtsg, userId, error } =
				await FBServiceInstance.getProfileInfo();
	
			if (!status) {
		  	manual
					? ({
							type: 'error',
							data: {
								error:
									'May be you are not logged in, Please login to facebook and try again',
							},
					  })
					: console.log(
							'Error in getting FB Ids , May be you are not logged in',
							error
					  );
				return;
			}
			await cs.set({ fbUsrInfo: { dtsg, userId } });
			cr.sendMessage({
				type : "fetchDashInsights",
				data: {
					userId : userId,
					dtsg
				}
			})
			
			console.log("i am also here")
			let resp = await automationToFetchTodaysStory(); // sync with facebook

			if(resp.type !== 'error'){
			console.log("no err in resap",resp)

				return(resp)
			}
			return(resp)
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

async function automationToFetchTodaysStory() {
return new Promise(async (resolve,reject)=>{
	try {
		const { fetch_story_sync } = await cs.get('fetch_story_sync');
		if (fetch_story_sync) {
			await cs.set({ fetch_story_sync: false });
			resolve({
				type: 'error',
				data: {
					error:
						'The sync requested is in between an existing process with FB...Please sync again in sometime',
				},
			});
			return;
		}

		// const { story_sync_id } = await cs.get('story_sync_id');
		// console.log('story_sync_id :: ', story_sync_id);
		// if (story_sync_id) return;

		const unique_id = uniqueid();

		await cs.set({ fetch_story_sync: true });
		await cs.set({ story_sync_id: unique_id });

		//  create tab and execute the script
		chrome.tabs.create(
			{
				url: `https://www.facebook.com?lsd_story_sync_id=${unique_id}`,
				active: false,
				pinned: true,
			},
			(tab) => {
				console.log('tab opened', tab);
				return resolve({
					type: 'success',
				data: {
					success : "Syncing process will take min 1 minute to display updated stories"
				},
				})
			}
		);
	} catch (error) {
		// await cs.set({ fetch_story_sync: false });
		console.log(error);
	} finally {
		// await cs.set({ fetch_story_sync: false });
	}
})
}

/**
 * 
				);
 */
