const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

const config = require('../config/index');
const KyubiService = require('../services/Kyubi_Service');
const LSD_Service = require('../services/LSD_Service');
const KyubiServiceInstance = new KyubiService();
const LSD_ServiceInstance = new LSD_Service();

const urlSearchParams = new URLSearchParams(window.location.search);
const { tab } = Object.fromEntries(urlSearchParams.entries());
if (tab && tab == 2) {
	$('.messageGroups').addClass('active');
	$('.messageSegments').removeClass('active');
	$('.message-group-page').addClass('active');
	$('.message-segment-page').removeClass('active');
} else {
	$('.messageSegments').addClass('active');
	$('.messageGroups').removeClass('active');
	$('.message-segment-page').addClass('active');
	$('.message-group-page').removeClass('active');
}

let all_msessage_segments = [];
let all_group_segments = [];

let message_blocks_groups = [];

$('.message-group-page').click((e) => {
	e.preventDefault();
	$('.messageGroups').addClass('active');
	$('.messageSegments').removeClass('active');
	$('.message-group-page').addClass('active');
	$('.message-segment-page').removeClass('active');
});

$('.message-segment-page').click((e) => {
	e.preventDefault();
	$('.messageSegments').addClass('active');
	$('.messageGroups').removeClass('active');
	$('.message-segment-page').addClass('active');
	$('.message-group-page').removeClass('active');
});

$('.messageSegmentBtn').on('click', function (e) {
	e.preventDefault();
	$('.createSegmentForm').fadeIn(450);
	$('.lsdTabTriggers').hide();
	$('.noMessageSegent').hide();
	$('.createdSegemntList').hide();
	$('.messageSegmentBtn').hide();
	$('.messageSegmentBtn_float').hide();
});

$('.messageGroupBtn').on('click', function (e) {
	e.preventDefault();
	$('.createGroupForm').fadeIn(450);
	$('.lsdTabTriggers').hide();
	$('.noGroupSegent').hide();
	$('.createdSegemntGrpList').hide();
	$('.messageGroupBtn').hide();
	$('.messageGrpBtn_float').hide();
});

$('.close-segment-form-btn').on('click', function (e) {
	e.preventDefault();
	window.location.reload();
});

$('.close-grp-form-btn').on('click', function (e) {
	e.preventDefault();
	// window.location.reload();
	location.href = 'message-segments.html?tab=2';

	$('.createGroupForm').hide();
	$('.group_header').text('Create Message Group');

	if (all_group_segments.length > 0) {
		$('.createdSegemntGrpList').show();
		$('.messageGrpBtn_float').show();
	} else {
		$('.noGroupSegent').show();
		$('.messageGroupBtn').show();
	}
	// $('.action-btn').click();
});

// fetch all message-group segments
const fetchAllMessageGroups = async () => {
	try {
		$('.loader').addClass('show');
		const resOfSegments = await LSD_ServiceInstance.getAllMessageGroups();
		if (!resOfSegments.status) {
			if (resOfSegments.token != undefined && resOfSegments.token === false) {
				let loggedInUserInfo = {
					is_logged_in: false,
					email: '',
					kyubi_token: '',
					lsd_token: '',
				};
				cs.set({ lsd_user_info: loggedInUserInfo });
				cr.sendMessage({ data: {}, type: 'logout' });
				window.location.href = '../login.html';
			}
			throw new Error(resOfSegments.error);
		}
		console.log('resOfSegments ==> ', resOfSegments);
		const segmentData = resOfSegments.data.payload
			? resOfSegments.data.payload.data
			: [];
		if (segmentData.length > 0) {
			all_group_segments = segmentData;
			$('.groups_no').text(segmentData.length);
			$('.messageGrpBtn_float').show();
			$('.noGroupSegent').hide();
			let htmlForSegmentLists = '';
			for (let i = 0; i < segmentData.length; i++) {
				const { title, message_blocks, _id, is_active } = segmentData[i];
				htmlForSegmentLists += `<div class="createdContent createdSegment d-flex">
			<!-- toggleOpen -->
			<div class="contentCreated">
				<h5>${title}</h5>
			</div>
			<div class="contentCreatedOptions">
				<button class="inlinle-btn action-btn">
					<svg
						width="24"
						height="6"
						viewBox="0 0 24 6"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.71429 3C5.71429 4.65685 4.4351 6 2.85714 6C1.27919 6 0 4.65685 0 3C0 1.34315 1.27919 0 2.85714 0C4.4351 0 5.71429 1.34315 5.71429 3Z"
							fill="#808DAE"
						/>
						<path
							d="M14.8571 3C14.8571 4.65685 13.578 6 12 6C10.422 6 9.14286 4.65685 9.14286 3C9.14286 1.34315 10.422 0 12 0C13.578 0 14.8571 1.34315 14.8571 3Z"
							fill="#808DAE"
						/>
						<path
							d="M24 3C24 4.65685 22.7208 6 21.1429 6C19.5649 6 18.2857 4.65685 18.2857 3C18.2857 1.34315 19.5649 0 21.1429 0C22.7208 0 24 1.34315 24 3Z"
							fill="#808DAE"
						/>
					</svg>
				</button>
				<button class="inlinle-btn editGrpButton" segment-id=${_id}>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.25 12.9375V15.75H5.0625L13.3575 7.45504L10.545 4.64254L2.25 12.9375ZM15.5325 5.28004C15.825 4.98754 15.825 4.51504 15.5325 4.22254L13.7775 2.46754C13.485 2.17504 13.0125 2.17504 12.72 2.46754L11.3475 3.84004L14.16 6.65254L15.5325 5.28004Z"
							fill="#8EB2D6"
						/>
					</svg>
				</button>
				<button class="inlinle-btn deleteGrpButton" segment-id=${_id}>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM6 6.75H12V14.25H6V6.75ZM11.625 3L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3H11.625Z"
							fill="#8EB2D6"
						/>
					</svg>
				</button>
			</div>
		</div>`;
			}

			$('.createdSegemntGrpList').html(htmlForSegmentLists).show();
			$('.loader').removeClass('show');
			return;
		}
		$('.noGroupSegent').show();
		$('.createdSegemntGrpList').hide();
		$('.messageGroupBtn').show();
		$('.messageGrpBtn_float').hide();
		$('.loader').removeClass('show');
	} catch (error) {
		$('.loader').removeClass('show');
		alert(error.message);
		return;
	}
};

// fetch all message segments and groups
const fetchAllMessageSegments = async () => {
	try {
		$('.loader').addClass('show');
		const resOfSegments = await LSD_ServiceInstance.getAllMessageSegments();
		if (!resOfSegments.status) {
			throw new Error(resOfSegments.error);
		}
		console.log('resOfSegments ==> ', resOfSegments);
		const segmentData = resOfSegments.data.payload
			? resOfSegments.data.payload.data
			: [];
		if (segmentData.length > 0) {
			all_msessage_segments = segmentData;
			$('.segments_no').text(segmentData.length);
			$('.messageSegmentBtn_float').show();
			$('.noMessageSegent').hide();
			let htmlForSegmentLists = '';
			for (let i = 0; i < segmentData.length; i++) {
				const { title, message_blocks, _id, is_active } = segmentData[i];
				htmlForSegmentLists += `<div class="createdContent createdSegment d-flex">
			<!-- toggleOpen -->
			<div class="contentCreated">
				<h5>${title}</h5>
				<p>${message_blocks}</p>
			</div>
			<div class="contentCreatedOptions">
				<button class="inlinle-btn action-btn">
					<svg
						width="24"
						height="6"
						viewBox="0 0 24 6"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.71429 3C5.71429 4.65685 4.4351 6 2.85714 6C1.27919 6 0 4.65685 0 3C0 1.34315 1.27919 0 2.85714 0C4.4351 0 5.71429 1.34315 5.71429 3Z"
							fill="#808DAE"
						/>
						<path
							d="M14.8571 3C14.8571 4.65685 13.578 6 12 6C10.422 6 9.14286 4.65685 9.14286 3C9.14286 1.34315 10.422 0 12 0C13.578 0 14.8571 1.34315 14.8571 3Z"
							fill="#808DAE"
						/>
						<path
							d="M24 3C24 4.65685 22.7208 6 21.1429 6C19.5649 6 18.2857 4.65685 18.2857 3C18.2857 1.34315 19.5649 0 21.1429 0C22.7208 0 24 1.34315 24 3Z"
							fill="#808DAE"
						/>
					</svg>
				</button>
				<button class="inlinle-btn editButton" segment-id=${_id}>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.25 12.9375V15.75H5.0625L13.3575 7.45504L10.545 4.64254L2.25 12.9375ZM15.5325 5.28004C15.825 4.98754 15.825 4.51504 15.5325 4.22254L13.7775 2.46754C13.485 2.17504 13.0125 2.17504 12.72 2.46754L11.3475 3.84004L14.16 6.65254L15.5325 5.28004Z"
							fill="#8EB2D6"
						/>
					</svg>
				</button>
				<button class="inlinle-btn deleteButton" segment-id=${_id}>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM6 6.75H12V14.25H6V6.75ZM11.625 3L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3H11.625Z"
							fill="#8EB2D6"
						/>
					</svg>
				</button>
			</div>
		</div>`;
			}

			$('.createdSegemntList').html(htmlForSegmentLists).show();
			$('.loader').removeClass('show');
			// for message group page

			return;
		}
		$('.noMessageSegent').show();
		$('.createdSegemntList').hide();
		$('.messageSegmentBtn').show();
		$('.messageSegmentBtn_float').hide();
		$('.loader').removeClass('show');
	} catch (error) {
		$('.loader').removeClass('show');
		alert(error.message);
		return;
	}
};

const handleUpdateMessageSegment = async () => {
	try {
		let all_message_blocks = [];
		$('.msgContent').each(function () {
			console.log('this', $(this).text());
			all_message_blocks.push($(this).text().trim());
		});

		if ($('#segment-title').val() === '' || all_message_blocks.length < 1) {
			throw new Error('Please fill all the fields');
		}
		console.log(all_message_blocks);
		// createdMsg
		const resOfUpdateSegment = await LSD_ServiceInstance.updateMessageSegment(
			$('#segment-title').val(),
			all_message_blocks,
			$('#segment-id').val()
		);
		if (!resOfUpdateSegment.status) {
			throw new Error(resOfUpdateSegment.error);
		} else {
			window.location.reload();
		}
	} catch (error) {
		$('.errorForm').text(error.message).show();
		setTimeout(() => {
			$('.errorForm').text('').hide();
		}, 2500);
		console.log(error);
	}
};

// const handleUpdateMessageGroups = async () => {};

$('body').on('click', '.action-btn', function () {
	if ($(this).hasClass('showed')) {
		$(this).parent().find('.deleteButton').hide();
		$(this).parent().find('.editButton').hide();
		$(this).parent().find('.deleteGrpButton').hide();
		$(this).parent().find('.editGrpButton').hide();
		$(this).removeClass('showed');
	} else {
		$(this).parent().find('.deleteButton').show();
		$(this).parent().find('.editButton').show();
		$(this).parent().find('.deleteGrpButton').show();
		$(this).parent().find('.editGrpButton').show();
		$(this).addClass('showed');
	}
});

$('.segment-create').on('click', function (e) {
	e.preventDefault();
	handleUpdateMessageSegment();
});

// $('.group-create').on('click', function (e) {
// 	e.preventDefault();
// 	handleUpdateMessageGroups();
// });

$('#segment-tag-ul li').click(function () {
	const txtToAdd = $(this).text();
	// const updateBlockVal = `${$('#segment-text').val()}${tag}`;
	// $('#segment-text').val(updateBlockVal);

	let $txt = $('#segment-text');
	let caretPos = $txt[0].selectionStart;
	var textAreaTxt = $txt.val();
	// var txtToAdd = "stuff";
	$txt.val(
		textAreaTxt.substring(0, caretPos) +
			txtToAdd +
			textAreaTxt.substring(caretPos)
	);
});

$('#segment-text').keyup(function (e) {
	console.log('Key Up');
	if (e.target.value.trim() != '') {
		$('.add-segment').removeAttr('disabled');
	} else {
		$('.add-segment').attr('disabled', true);
	}
});

$('.add-segment').click(function (e) {
	e.preventDefault();
	let blockHtml = `<div class='createdMsg'>
  <div class='msgContent'>
   ${$('#segment-text').val()}
  </div>
  <button class='btn-theme-gradient remove-block'>
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z'
        fill='#E0E3FF'
      />
    </svg>
  </button>
</div>`;

	$('.createdSpace_a').append(blockHtml);
	$('#segment-text').val('');
});

$('body').on('click', '.remove-block', function () {
	$(this).parent().remove();
});

$('body').on('click', '.editButton', function (e) {
	e.preventDefault();
	$('.createSegmentForm').fadeIn(450);
	$('.lsdTabTriggers').hide();
	$('.noMessageSegent').hide();
	$('.createdSegemntList').hide();
	$('.messageSegmentBtn').hide();
	$('.messageSegmentBtn_float').hide();

	$('.segment_header').text('Update Message Segment');
	$('.segment-create').text('Update');

	const segment = all_msessage_segments.find(
		(segment) => segment._id == $(this).attr('segment-id')
	);
	$('#segment-id').val($(this).attr('segment-id'));
	$('#segment-title').val(segment.title);
	segment.message_blocks.forEach((block) => {
		$('.createdSpace_a').append(`<div class='createdMsg'>
    <div class='msgContent'>
     ${block}
    </div>
    <button class='btn-theme-gradient remove-block'>
      <svg
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z'
          fill='#E0E3FF'
        />
      </svg>
    </button>
  </div>`);
	});
});

$('body').on('click', '.editGrpButton', function (e) {
	e.preventDefault();
	$('.createGroupForm').fadeIn(450);
	$('.lsdTabTriggers').hide();
	$('.noGroupSegent').hide();
	$('.createdSegemntGrpList').hide();
	$('.messageGroupBtn').hide();
	$('.messageGrpBtn_float').hide();

	$('.group_header').text('Update Message Group');
	$('.group-create').text('Update');

	const segment = all_group_segments.find(
		(segment) => segment._id == $(this).attr('segment-id')
	);
	$('#segment-group_id').val($(this).attr('segment-id'));
	$('#segment-group-title').val(segment.title);
	segment.associate_blocks.forEach((block) => {
		let full_text = '';
		block.forEach((block_item) => {
			if (block_item.type === 'id') {
				const selected_segment = all_msessage_segments.find(
					(segment) => segment._id === block_item.value
				);
				full_text += `[${selected_segment.title}]`;
			}
			if (block_item.type === 'text') {
				full_text += `${block_item.value} `;
			}
		});
		const timestamp_id = Date.now() + config.randomInt(1, 1000);
		message_blocks_groups.push({ id: timestamp_id, blocks: block });
		console.log('message_blocks_groups ==>> ', message_blocks_groups);
		$('.createdSpace_b').append(`<div class='createdMsg'>
  <div class='msgContent'>
   ${full_text}
  </div>
  <button class='btn-theme-gradient remove-block-group' id='${timestamp_id}' >
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z'
        fill='#E0E3FF'
      />
    </svg>
  </button>
</div>`);
		$('.created_Msg').html('');
	});
});

$('body').on('click', '.deleteButton', async function (e) {
	e.preventDefault();
	const segmentId = $(this).attr('segment-id');
	const res = await LSD_ServiceInstance.deleteMessageSegment(segmentId);
	if (res.status) {
		window.location.reload();
	} else {
		$('.errorForm').text(res.error);
		setTimeout(() => {
			$('.errorForm').text('');
		}, 2500);
	}
});

$('body').on('click', '.deleteGrpButton', async function (e) {
	e.preventDefault();
	const that = $(this);
	const segmentId = $(this).attr('segment-id');
	const res = await LSD_ServiceInstance.deleteMessageGroup(segmentId);
	if (res.status) {
		that.parent().parent().remove();
		location.href = 'message-segments.html?tab=2';
	} else {
		$('.errorForm').text(res.error);
		setTimeout(() => {
			$('.errorForm').text('');
		}, 2500);
	}
});

$('.insert-grp-msg').on('click', function (e) {
	e.preventDefault();
	$('.insertType').toggleClass('active');
});

$('body').on('click', '#insert_type li', function (e) {
	e.preventDefault();
	const type = $(this).attr('type');
	switch (type) {
		case 'segments': {
			if (all_msessage_segments && all_msessage_segments.length > 0) {
				all_msessage_segments.forEach((segment) => {
					$('.insertSegmentsList').append(
						`<li s_id=${segment._id}>${segment.title}</li>`
					);
				});
				$('.insertSegments').show();
			}
			break;
		}
		case 'text': {
			$('.insertTextCustom').show();
			break;
		}
		case 'keywords': {
			$('.insertKeywords').show();
			break;
		}
	}
});

$('.insertSegmentsList').on('click', 'li', function (e) {
	e.preventDefault();
	$(
		'.created_Msg'
	).append(`<div class="createdMsg"><div class="msgContent msg_content" type="id" id_value="${$(this).attr('s_id')}">
<span>[${$(this).text()}]</span>
</div>
<button class="btn-theme close_inside" >
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z"
			fill="#E0E3FF" />
	</svg>
</button></div>`);

	$('.insertSegments').hide();
	$('.insertSegmentsList').html('');
	$('.insertType').toggleClass('active');
});

$('body').on('click', '.close_inside', function (e) {
	e.preventDefault();
	$(this).parent().remove();
});

$('.insertTextCustomDone').on('click', function (e) {
	e.preventDefault();
	if (!$('#text_custom').val()) return;
	$(
		'.created_Msg'
	).append(`<div class="createdMsg"><div class="msgContent msg_content" type="text">
<span>${$('#text_custom').val()}</span>
</div>
<button class="btn-theme close_inside" >
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z"
			fill="#E0E3FF" />
	</svg>
</button></div>`);
	$('#text_custom').val('');
	$('.insertType').toggleClass('active');
	$('.insertTextCustom').hide();
});

$('.insertKeywords').on('click', 'li', function (e) {
	e.preventDefault();
	$(
		'.created_Msg'
	).append(`<div class="createdMsg"><div class="msgContent msg_content" type="text" >
<span>${$(this).text()}</span>
</div>
<button class="btn-theme close_inside" >
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z"
			fill="#E0E3FF" />
	</svg>
</button></div>`);
	$('.insertType').toggleClass('active');
	$('.insertKeywords').hide();
});

$(document).click(function (e) {
	if ($(e.target).parents('.insertGroupOptions').length === 0) {
		$('.insertType').removeClass('active');
		$('.insertKeywords').hide();
		$('.insertTextCustom').hide();
		$('.insertSegments').hide();
		$('.insertSegmentsList').html('');
	}
});

$('.add-group-segment').on('click', function (e) {
	e.preventDefault();
	let blocks = [];
	let text_val = '';
	$('.msg_content').each(function () {
		if ($(this).attr('type') === 'id') {
			// this is id tupe means segement
			blocks.push({
				value: $(this).attr('id_value'),
				type: 'id',
			});
			text_val += ' ' + $(this).children().text();
		}
		if ($(this).attr('type') === 'text') {
			// this is id tupe means segement
			blocks.push({
				value: $(this).children().text(),
				type: 'text',
			});

			text_val += ' ' + $(this).children().text();
		}
	});
	if (!text_val) return;

	let timestamp_id = Date.now() + config.randomInt(1, 1000);
	console.log(timestamp_id);

	message_blocks_groups.push({ id: timestamp_id, blocks });

	console.log(blocks, message_blocks_groups, timestamp_id);

	$('.createdSpace_b').append(`<div class='createdMsg'>
  <div class='msgContent'>
   ${text_val}
  </div>
  <button class='btn-theme-gradient remove-block-group' id='${timestamp_id}' >
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z'
        fill='#E0E3FF'
      />
    </svg>
  </button>
</div>`);
	$('.created_Msg').html('');
});

$('body').on('click', '.remove-block-group', function (e) {
	e.preventDefault();
	let id = $(this).attr('id');
	message_blocks_groups = message_blocks_groups.filter(
		(item) => parseInt(item.id) !== parseInt(id)
	);
	console.log(message_blocks_groups, id);
	$(this).parent().remove();
});

$('.group-create').on('click', async function (e) {
	e.preventDefault();

	try {
		console.log(message_blocks_groups);
		const associate_blocks = message_blocks_groups.map((val) => val.blocks);
		const title = $('#segment-group-title').val();
		console.log(associate_blocks, title, message_blocks_groups);

		if (!title || !associate_blocks.length) {
			throw new Error('Please fill all fields');
		}
		const group_id = $('#segment-group_id').val();
		const groupUpdateRes = await LSD_ServiceInstance.updateMessageGroup(
			title,
			associate_blocks,
			group_id || null
		);

		if (!groupUpdateRes.status) {
			throw new Error(groupUpdateRes.error || 'Something went wrong');
		} else {
			// return; // remove this line
			location.href = 'message-segments.html?tab=2';
		}
	} catch (error) {
		$('.errorForm').text(error.message).show();
		setTimeout(() => {
			$('.errorForm').text('').hide();
		}, 2500);
		console.log(error);
	}
});

fetchAllMessageSegments();
fetchAllMessageGroups();
