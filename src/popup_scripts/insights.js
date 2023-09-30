const connectButton = document.getElementById('connect-facebook');
const apiForm = document.getElementById('api-form');
const formElements = apiForm.querySelectorAll('input, select, textarea');
const sendRequestButton = document.getElementById('send-request');
const userProfile = document.getElementById('user-profile');
const profilePicture = document.getElementById('profile-picture');
const userName = document.getElementById('user-name');
const requestHeadersInput = document.getElementById('request-headers');
const cr = chrome.runtime

document.addEventListener("DOMContentLoaded", function () {
	// Your code to manipulate the DOM goes here
		apiForm.disabled = true;
		sendRequestButton.disabled = true;
		connectButton.textContent = 'Connect to Facebook';
		userProfile.style.display = 'none';
		formElements.forEach((element) => {
		element.disabled = !element.disabled;
	});
  });
  

connectButton.addEventListener('click', function () {
	if (apiForm.disabled) {
		// Simulate connecting to Facebook
		simulateFacebookConnection();
	} else {
		console.log("false")
		// Disconnect from Facebook
		apiForm.disabled = true;
		sendRequestButton.disabled = true;
		connectButton.textContent = 'Connect to Facebook';
		userProfile.style.display = 'none';
	}

	// Disable/Enable form elements
	formElements.forEach((element) => {
		element.disabled = !element.disabled;
	});
});

document.getElementById('send-request').addEventListener('click', function () {
	console.log("raw headers",requestHeadersInput.value)
	const apiUrlInput = document.getElementById('api-url');
	const apiUrl = apiUrlInput.value;
	const httpMethod = document.getElementById('http-method').value;
	const requestPayloadInput = JSON.parse(document.getElementById('request-payload').value);
	const requestPayload = requestPayloadInput.value;
	const requestHeaders = JSON.parse(requestHeadersInput.value)

	// Reset previous error messages
	document.getElementById('api-url-error').textContent = '';
	document.getElementById('payload-error').textContent = '';

	// Basic URL format validation
	const urlRegex = /^(http|https):\/\/[^ "]+$/;
	if (!urlRegex.test(apiUrl)) {
		document.getElementById('api-url-error').textContent = 'Invalid URL format';
		return;
	}

	// Validation for non-empty payload for POST and PUT requests
	if ((httpMethod === 'POST' || httpMethod === 'PUT') && !requestPayloadInput.trim()) {
		document.getElementById('payload-error').textContent = 'Payload cannot be empty for POST/PUT requests';
		return;
	}

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'text/html,application/json',
		...requestHeaders,
	};

	const requestOptions = {
		method: httpMethod,
		headers: headers,
		body: httpMethod === 'GET' ? undefined : requestPayloadInput,
	};

	console.log("API resources",requestOptions,apiUrl)
	document.getElementById('response').textContent = JSON.stringify(requestOptions)
	// fetch(apiUrl, requestOptions)
	// 	.then(response => response.text())
	// 	.then(data => {
	// 		document.getElementById('response').textContent = data;
	// 	})
	// 	.catch(error => {
	// 		document.getElementById('response').textContent = 'Error: ' + error.message;
	// 	});
});

// Simulate connecting to Facebook and show user profile
function simulateFacebookConnection() {
	// Simulate fetching user profile data (replace with actual API calls)
	cr.sendMessage({ data: [], type: 'getFbProfile' });
	const fakeUserProfileData = {
		name: 'John Doe',
		profilePictureUrl: 'https://via.placeholder.com/100',
	};

	// Display user profile data
	userProfile.style.display = 'block';
	profilePicture.src = fakeUserProfileData.profilePictureUrl;
	userName.textContent = "Fetching ...";

	// Enable form elements
	apiForm.disabled = false;
	sendRequestButton.disabled = false;
	connectButton.textContent = 'Connecting ...';
}

function constructTheFuckUp(){

}