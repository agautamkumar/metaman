// const _helper = require('../helpers/common_helper');
// const KyubiService = require('../services/Kyubi_Service');
// const LSD_Service = require('../services/LSD_Service');
// const KyubiServiceInstance = new KyubiService();
// const LSD_ServiceInstance = new LSD_Service();

// const cr = chrome.runtime,
// 	cs = chrome.storage.local,
// 	ci = chrome.identity,
// 	ct = chrome.tabs;

// // check user is already logged in to the extension or not
// const checkUserIsLoggedIn = async () => {
// 	let savedCredentials = localStorage.getItem('userCredentials')
// 		? JSON.parse(localStorage.getItem('userCredentials'))
// 		: { email: '', password: '' };

// 	console.log(savedCredentials.email, savedCredentials.password);

// 	$('#email').val(savedCredentials.email);
// 	$('#password').val(savedCredentials.password);
// 	$('#rememberMe').prop('checked', savedCredentials.rememberMe);
// 	// let lsdUser = await _helper.fetchLsdUserInfo();
// 	// console.log('LSD User :: ', lsdUser);
// 	// if (lsdUser.status && lsdUser.data.isLoggedIn) {
// 	// 	// if logged in then redicrect to dahsboad page
// 	// 	window.location.href = 'dashboard.html';
// 	// }
// };

// checkUserIsLoggedIn();

// function errorShow(msg) {
// 	$('.errorForm').text(msg);
// 	setTimeout(function () {
// 		$('.errorForm').text('');
// 	}, 3500);
// }

// // Login procedure for extenion users with kyubi
// const loginToExt = async (e) => {
// 	e.preventDefault();
// 	console.log('Login procedure for extenion users with kyubi');
// 	$('.loader').addClass('show');
// 	let email = $('#email').val();
// 	let password = $('#password').val();

// 	const filter =
// 		/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// 	if (!email || !password) {
// 		// alert('Please enter email and password');
// 		errorShow('Please enter email and password');
// 		return;
// 	}

// 	if (!filter.test(email)) {
// 		errorShow('Please enter valid email');
// 		return;
// 	}

// 	const { status, data, error } = await KyubiServiceInstance.login(
// 		email,
// 		password
// 	);

// 	if (status) {
// 		// sign up user in LSD Backend
// 		const signUpResponse = await LSD_ServiceInstance.signupLoginUser(email);

// 		if (!status) {
// 			// alert(error);
// 			errorShow(error);
// 			return;
// 		}
// 		// loggedin successfully
// 		let loggedInUserInfo = {
// 			is_logged_in: true,
// 			email,
// 			kyubi_token: data.token,
// 			lsd_token: signUpResponse.data.payload.lsd_token,
// 		};
// 		await cs.set({ from_backend: signUpResponse.data.payload.from_backend });

// 		console.log('loggedInUserInfo :: ', loggedInUserInfo);
// 		// remember me function
// 		if ($('#rememberMe').is(':checked')) {
// 			console.log('remember me checked');
// 			localStorage.setItem(
// 				'userCredentials',
// 				JSON.stringify({ email, password, rememberMe: true })
// 			);
// 		} else {
// 			console.log('remember me not checked');
// 			localStorage.removeItem('userCredentials');
// 		}

// 		cr.sendMessage({ data: loggedInUserInfo, type: 'loginDone' });
// 		cs.set({ lsd_user_info: loggedInUserInfo });
// 		window.location.href = 'insights.html';
// 	} else {
// 		// alert(error);
// 		$('.loader').removeClass('show');
// 		errorShow(error);
// 	}
// };

// const resetPassword = async (e) => {
// 	try {
// 		e.preventDefault();
// 		$('.loader').addClass('show');
// 		const email = $('#reset_email').val();
// 		if (!email) {
// 			throw new Error('Please enter email');
// 		}
// 		const response = await KyubiServiceInstance.forgotPassword(email);
// 		if (response.status) {
// 			// alert('Password reset link has been sent to your email');
// 			$('.loader').removeClass('show');
// 			$('.successText').show();
// 		} else {
// 			$('.loader').removeClass('show');
// 			throw new Error(response.error);
// 		}
// 	} catch (error) {
// 		$('.loader').removeClass('show');
// 		console.log('Kyubi reset password Service Err:: ', error);
// 		$('.errorForm').text(error.message);
// 		setTimeout(function () {
// 			$('.errorForm').text('');
// 		}, 3500);
// 		$(this).text('Reset Password');
// 	}
// };

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

// // handle events
// $('#loginButton').on('click', loginToExt);

// $('.reset_password').on('click', resetPassword);
