const { apiCall } = require('./api');
const kyubiSettings = require('../../public/kyubiSettings.json');
const config = require('../config/index');

class Kyubi_Service {
	constructor() {
		this.apiCall = apiCall;
		this.kyubi = kyubiSettings;
		this.config = config;
	}

	async login(email, password) {
		try {
			const response = await this.apiCall('POST', kyubiSettings.loginURL, {
				email,
				password,
				extensionId: this.kyubi.extId,
			});
			console.log('Kyubi Login Response :: ', response);
			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.log('Kyubi Login Service Err:: ', error);
			return {
				status: false,
				error: error.message,
			};
		}
	}

	async forgotPassword(email) {
		try {
			const response = await this.apiCall('POST', kyubiSettings.forgotPassURL, {
				extId: this.kyubi.extId,
				email: email,
			});
			console.log('Kyubi forgot password Response :: ', response);
			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.log('Kyubi Forgot password Service Err:: ', error);
			return {
				status: false,
				error: error.message,
			};
		}
	}

	async changePassword(password, newPassword) {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();

			const response = await this.apiCall(
				'POST',
				kyubiSettings.changePassURL,
				{
					extensionId: this.kyubi.extId,
					email: loggedInUserInfo.email,
					password,
					newPassword,
					confirmNewPassword: newPassword,
				},
				`KYUBI_${loggedInUserInfo.kyubi_token}`
			);
			console.log('Kyubi change password Response :: ', response);
			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.log('Kyubi Change Password Service Err:: ', error);
			return {
				status: false,
				error: error.message,
			};
		}
	}

	async getUserPlan(email) {
		try {
		} catch (error) {
			console.log('Kyubi User Plan Fetch Service Err:: ', error);
			return {
				status: false,
				error: error.message,
			};
		}
	}

	async checkUserStatus() {
		try {
			const loggedInUserInfo = await this.config.getloggedInUserInfo();

			const response = await this.apiCall(
				'POST',
				kyubiSettings.checkUserStatusURL,
				{
					extId: this.kyubi.extId,
					email: loggedInUserInfo.email,
					// uid: config.deviceID,
				},
				// `KYUBI_${loggedInUserInfo.kyubi_token}`
				null
			);

			if (response.status) {
				return {
					status: true,
					data: response,
				};
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.log('Kyubi User Status Service Err:: ', error);
			return {
				status: false,
				error: error.message,
			};
		}
	}
}

module.exports = Kyubi_Service;
