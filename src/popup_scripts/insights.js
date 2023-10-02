const connectButton = document.getElementById('connect-facebook');
const apiForm = document.getElementById('api-form');
const formElements = apiForm.querySelectorAll('input, select, textarea');
const sendRequestButton = document.getElementById('send-request');
const userProfile = document.getElementById('user-profile');
const profilePicture = document.getElementById('profile-picture');
const userName = document.getElementById('user-name');
const requestHeadersInput = document.getElementById('request-headers');
const apiUrlInput = document.getElementById('api-url');
const overlay = document.getElementById('overlay');
const loader = document.getElementById('loader');
const metamanContainer = document.getElementById('container');

// Function to show the loader
function showLoader() {
    loader.style.display = 'block';
    metamanContainer.style.display = 'none';
}


const headers = {
	'Content-Type': 'application/json',
	Accept: 'text/html,application/json',
	// ...requestHeaders,
};

const cr = chrome.runtime

document.addEventListener("DOMContentLoaded", function () {

	loader.style.display = 'block';
	// overlay.style.display = 'block';

    // metamanContainer.style.display = 'none';



	// Your code to manipulate the DOM goes here
		apiUrlInput.value = ""
		apiForm.disabled = true;
		sendRequestButton.disabled = true;
		connectButton.textContent = 'Connect to Facebook';
		userProfile.style.display = 'none';
		
		formElements.forEach((element) => {
		element.disabled = !element.disabled;
	});
	const editor = ace.edit("jsoneditor");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/json");


	const editorHeader = ace.edit("jsoneditorheader");
	editorHeader.setTheme("ace/theme/monokai");
	editorHeader.getSession().setMode("ace/mode/json");


	const editorResponse = ace.edit("jsonresponse");
	editorResponse.setTheme("ace/theme/monokai");
	editorResponse.getSession().setMode("ace/mode/json");

	
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
		apiUrlInput.value = ""

	}

	// Disable/Enable form elements
	formElements.forEach((element) => {
		element.disabled = !element.disabled;
	});
});

document.getElementById('send-request').addEventListener('click', function () {
	const apiUrl = apiUrlInput.value;
	const httpMethod = document.getElementById('http-method').value;
	// console.log("payload value",document.getElementById('jsoneditor').value)
	// const requestPayloadInput = document.getElementById('jsoneditor').value;
	// const requestPayload = requestPayloadInput.value;
	// const requestHeaders = JSON.parse(requestHeadersInput.value)
	// console.log("raw headers",requestHeadersInput.value)
	const jsonObject = {}
	if(document.querySelector("#jsoneditor").childNodes[2].childNodes[0].childNodes[2].childNodes.length>1){

		for(var i =0; i< document.querySelector("#jsoneditor").childNodes[2].childNodes[0].childNodes[2].childNodes.length;i++){
			// console.log(document.querySelector("#jsoneditor").childNodes[2].childNodes[0].childNodes[2].childNodes[i].innerHTML)

			const splitValue = document.querySelector("#jsoneditor").childNodes[2].childNodes[0].childNodes[2].childNodes[i].innerHTML.split(":");
			if (splitValue.length === 2) {
			const key = splitValue[0].trim(); // Trim to remove any leading/trailing spaces
			const value = splitValue[1].trim(); // Trim to remove any leading/trailing spaces

			// Create a JSON object with the key-value pair
			// console.log(jsonObject[key] = value);
			 jsonObject[key] = value 

			// console.log(jsonObject);
			} else {
				
				try {
				const jsonPart =document.querySelector("#jsoneditor").childNodes[2].childNodes[0].childNodes[2].childNodes[i].innerHTML;
				// console.log("dddd",jsonPart)
				// Sample string containing key-value data
				const dataString = jsonPart;

				// Find the index of the colon (":") to split the string into key and value
				const colonIndex = dataString.indexOf(':');

				if (colonIndex !== -1) {
				// Extract the key and value based on the colon index
				const key = dataString.slice(0, colonIndex).trim();
				const valueString = dataString.slice(colonIndex + 1).trim();

				try {
					// Parse the value part as JSON to get the actual value
					const value = JSON.parse(valueString);

					// Create a key-value pair object
					jsonObject[key] = value 

					// console.log(keyValue);
				} catch (error) {
					console.error("Error parsing JSON value:", error);
				}
				} else {
				console.error("Colon (:) not found in the string.");
				}
					
				} catch (error) {
				  console.error("Error parsing JSON:", error);
				}	
			console.error("Invalid format. Expected 'key: value'",splitValue);
			}
		}
	}else{
		console.log("No request payload")
	}

	// Reset previous error messages
	document.getElementById('api-url-error').textContent = '';
	document.getElementById('payload-error').textContent = '';

	// Basic URL format validation
	const urlRegex = /^(http|https):\/\/[^ "]+$/;
	if (!urlRegex.test(apiUrl)) {
		document.getElementById('api-url-error').textContent = 'Invalid URL format';
		return;
	}

	// // Validation for non-empty payload for POST and PUT requests
	// if ((httpMethod === 'POST' || httpMethod === 'PUT')) {
	// 	document.getElementById('payload-error').textContent = 'Payload cannot be empty for POST/PUT requests';
	// 	return;
	// }


	const requestOptions = {
		
		method: httpMethod,
		headers: headers,
		body: httpMethod === 'GET' ? undefined : jsonObject,
	};


	console.log("JSON object ",jsonObject)
	cr.sendMessage({data : {
		API : apiUrl,
		payload : httpMethod == "POST"?jsonObject:{},
		httpMethod,
	
	},type : 'triggerFB'})

	// console.log("API resources",requestOptions,apiUrl)
	// document.getElementById('response').textContent = JSON.stringify(requestOptions)

});

// Simulate connecting to Facebook and show user profile
function simulateFacebookConnection() {
	// Simulate fetching user profile data (replace with actual API calls)
	cr.sendMessage({ data: [], type: 'getFbProfile' });
	const fakeUserProfileData = {
		name: 'John Doe',
		profilePictureUrl: '../images/rocket_l.gif',
	};

	// Display user profile data
	apiUrlInput.value = ""
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