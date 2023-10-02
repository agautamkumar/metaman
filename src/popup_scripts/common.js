const LSD_Service = require('../services/LSD_Service');


const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

const apiUrlInput = document.getElementById('api-url');
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
				apiUrlInput.value = "https://www.facebook.com/api/graphql/"
			}
			break;
		}


		case 'fbResponse' : {
			console.clear()
			console.log("Recieved the fb response in common js",req.data)
			ace.edit("jsonresponse").setValue(JSON.stringify(req.data, null, 2)); // The last argument (2) is for indentation

			break;
		}

		case 'errorForDashboard': {
			console.log("catched")
			apiUrlInput.value = ""
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
