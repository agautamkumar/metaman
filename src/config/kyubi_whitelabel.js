const kyubiConfig = require('../../public/kyubiSettings.json');
// const config = require('../config/config.js');

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

$(document).ready(async function () {
	// Footer
	if (kyubiConfig.footer.showFooter) {
		if (kyubiConfig.footer.poweredBy.willBeDisplayed) {
			// console.log($('.footerTextSection').find('a'));
			$('.footer').find('a').eq(0).text(kyubiConfig.footer.poweredBy.label);
			$('.footer')
				.find('a')
				.eq(0)
				.attr('href', kyubiConfig.footer.poweredBy.url)
				.attr('target', '_blank');
		}
		if (kyubiConfig.footer.partnership.willBeDisplayed) {
			$('.footer').find('a').eq(1).text(kyubiConfig.footer.partnership.label);
			$('.footer')
				.find('a')
				.eq(1)
				.attr('href', kyubiConfig.footer.partnership.url)
				.attr('target', '_blank');
		}
		if (kyubiConfig.footer.chatSupport.willBeDisplayed) {
			$('.footerIcons')
				.find('a')
				.eq(0)
				.attr('href', kyubiConfig.footer.chatSupport.url)
				.attr('target', '_blank');
		}
		if (kyubiConfig.footer.officialGroup.willBeDisplayed) {
			$('.footerIcons')
				.find('a')
				.eq(1)
				.attr('href', kyubiConfig.footer.officialGroup.url)
				.attr('target', '_blank');
		}
	}

	if (kyubiConfig.mailTo) {
		$('#mailTO')
			.attr('href', `mailto:${kyubiConfig.mailTo}`)
			.text(kyubiConfig.mailTo);
	}
	if (kyubiConfig.signupURL) {
		$('#signUp').attr('href', kyubiConfig.signupURL).attr('target', '_blank');
	}

	kyubiConfig.logo.secondary_logo &&
		$('.logoHeader').find('img').eq(0).attr('src', `${kyubiConfig.logo.secondary_logo}`)


	kyubiConfig.logo.primary_logo &&
		$('#primary_logo')
			.attr('src', `${kyubiConfig.logo.primary_logo}`)
			.addClass('logo');


	kyubiConfig.logo.secondary_logo &&
		$('.loader').find('img').eq(0).attr('src', `${kyubiConfig.loader.preLoader}`)

});

// This file for kyubi friendly
