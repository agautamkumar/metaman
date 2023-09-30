// const cr = chrome.runtime,
// 	cs = chrome.storage.local,
// 	ci = chrome.identity,
// 	ct = chrome.tabs;

// const config = require('../config/index');
// const KyubiService = require('../services/Kyubi_Service');
// const LSD_Service = require('../services/LSD_Service');
// const KyubiServiceInstance = new KyubiService();
// const LSD_ServiceInstance = new LSD_Service();

// cr.onMessage.addListener(async function (req, sender, sendResponse) {
// 	switch (req.type) {
// 		case 'reloadPage': {
// 			window.location.reload();
// 			break;
// 		}
// 		case 'error': {
// 			$('.loader').removeClass('show');
// 			$('.noStories').show();
// 			alert(req.data.error);
// 			break;
// 		}
// 	}
// });

// const updateFbProfileInfo = async () => {
// 	const { fbActiveProfile } = await cs.get('fbActiveProfile');
// 	console.log('fbActiveProfile ==> ', fbActiveProfile);
// 	const { fbProfileImg, fbName, loggedINFB } = fbActiveProfile;
// 	/// if loggedINFB === true then user in logged in facebook
// 	const userInfo = await config.getloggedInUserInfo();
// 	$('#openMenuButton').css('background-image', `url(${fbProfileImg})`);
// 	$('#profileImage').css('background-image', `url(${fbProfileImg})`);
// 	$('#fbNameView').text(fbName);
// 	$('#emailView').text(userInfo.email);

// 	const automationAlarm = await chrome.alarms.get('story_automation');
// 	if (automationAlarm) {
// 		if ($('.automation-time-text').length < 1) {
// 			$('.menuHeader').prepend(
// 				`<p class='automation-time-text'>${new Date(
// 					automationAlarm.scheduledTime
// 				).toLocaleTimeString('en-US')}</p>`
// 			);
// 		}
// 	}
// };

// !$('.dashboard_page').length ? updateFbProfileInfo() : '';

// // menu settings
// $('#openMenuButton').on('click', async function (e) {
// 	e.preventDefault();
// 	$('#menuOption').css('display', 'block');
// });
// $('#closeMenuButton').on('click', async function (e) {
// 	e.preventDefault();
// 	$('#menuOption').css('display', 'none');
// });

// $('#logoutButton').on('click', async function (e) {
// 	e.preventDefault();
// 	logoutExt();
// });

// $('.btnSettingHeader').on('click', function (e) {
// 	e.preventDefault();
// 	window.location.href = 'message-segments.html';
// });

// function logoutExt() {
// 	let loggedInUserInfo = {
// 		is_logged_in: false,
// 		email: '',
// 		kyubi_token: '',
// 		lsd_token: '',
// 	};
// 	cs.set({ lsd_user_info: loggedInUserInfo });
// 	cr.sendMessage({ data: {}, type: 'logout' });
// 	window.location.href = '../login.html';
// }

// $('.loginback').on('click', function (e) {
// 	e.preventDefault();
// 	logoutExt();
// 	window.location.href = '../login.html';
// });

// $('#changePassButton').on('click', async function (e) {
// 	try {
// 		e.preventDefault();
// 		$(this).text('Please wait...');
// 		const old_pass = $('#old_password').val();
// 		const new_pass = $('#new_password').val();
// 		if (!old_pass || !new_pass) {
// 			throw new Error('Please enter all fields');
// 		}
// 		const response = await KyubiServiceInstance.changePassword(
// 			old_pass,
// 			new_pass
// 		);
// 		if (response.status) {
// 			$('.form-group').hide();
// 			$('.successText').show();
// 			$('.successText_b').show();
// 			$('#old_password').val('');
// 			$('#new_password').val('');
// 		} else {
// 			throw new Error(response.error);
// 		}
// 	} catch (error) {
// 		console.log('Kyubi change password Service Err:: ', error);
// 		$('.errorForm').text(error.message);
// 		setTimeout(function () {
// 			$('.errorForm').text('');
// 		}, 3500);
// 		$(this).text('Change Password');
// 	}
// });

// $('.visibilityPassword').on('click', function (e) {
// 	e.preventDefault();
// 	let inputField = $(this).parent().find('input')[0];

// 	let type = $(inputField).attr('type');
// 	// now test it's value
// 	if (type === 'password') {
// 		$(inputField).attr('type', 'text');
// 	} else {
// 		$(inputField).attr('type', 'password');
// 	}
// });

// $('body').on('click', '.btnBack', () => {
// 	location.href = 'insights.html';
// });

// $('#closeModal').click((e) => {
// 	e.preventDefault();
// 	console.log('cliclled')
// 	location.href = 'insights.html';
// });

