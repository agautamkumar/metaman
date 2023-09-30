const apiCall = (method, url, data = {}, token = '') => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(url, {
				method: method,
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					authorization: token,
				},
				body: JSON.stringify(data),
			});

			resolve(response.json()); // reslove the response from api
		} catch (error) {
			console.log(error);
			return resolve({ status: false });
		}
	});
};

module.exports = {
	apiCall,
};
