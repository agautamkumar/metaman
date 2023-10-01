const moment = require('moment');
const LSD_Service = require('../services/LSD_Service');
const LSD_ServiceInstance = new LSD_Service();
const config = require('../config/index');

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

const userName = document.getElementById('user-name');
const userID = document.getElementById('user-id');
const connectButton = document.getElementById('connect-facebook');
const apiForm = document.getElementById('api-form');
const formElements = apiForm.querySelectorAll('input, select, textarea');
const sendRequestButton = document.getElementById('send-request');
const userProfile = document.getElementById('user-profile');
const profilePicture = document.getElementById('profile-picture');

cr.onMessage.addListener(async function (req, sender, sendResponse) {
	switch (req.type) {
	
		case 'gotFbProfile': {
			const { fbProfileImg, fbName, userId, dtsg } = req.data;
			if(userId && dtsg){
				console.log("fbprofile",req)
				userName.textContent = fbName + `(${userId})`
				profilePicture.src = fbProfileImg
				// userID.textContent = userId
				connectButton.textContent = 'Disconnect from Facebook';
				console.log("fp",userId,dtsg)
				
			}
			break;
		}
		case 'errorForDashboard': {
			console.log("catched")
			apiForm.disabled = true;
			sendRequestButton.disabled = true;
			connectButton.textContent = 'Connect to Facebook';
			userProfile.style.display = 'none';
			formElements.forEach((element) => {
				element.disabled = !element.disabled;
			});
			alert(req.data.error);
			break;
		}
	}
});
