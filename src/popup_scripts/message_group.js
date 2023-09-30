const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

const config = require('../config/index');
const KyubiService = require('../services/Kyubi_Service');
const LSD_Service = require('../services/LSD_Service');
const KyubiServiceInstance = new KyubiService();
const LSD_ServiceInstance = new LSD_Service();

let all_msessage_segments = [];

$('.message-group-page').click((e) => {
	e.preventDefault();
	location.href = 'message-groups.html';
});

$('.message-segment-page').click((e) => {
	e.preventDefault();
	location.href = 'message-segments.html';
});

if ($('.segment_message').length) {
	$('.message-segment-page').addClass('active');
}
if ($('.group_message').length) {
	$('.message-group-page').addClass('active');
}

$('.messageSegmentBtn').on('click', function (e) {
	e.preventDefault();
	$('.createSegmentForm').fadeIn(450);
	$('.lsdTabTriggers').hide();
	$('.noMessageSegent').hide();
	$('.createdSegemntList').hide();
	$('.messageSegmentBtn').hide();
	$('.messageSegmentBtn_float').hide();
});

$('.close-segment-form-btn').on('click', function (e) {
	e.preventDefault();
	window.location.reload();
});
