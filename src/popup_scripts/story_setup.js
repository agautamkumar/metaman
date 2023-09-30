const moment = require('moment');
const LSD_Service = require('../services/LSD_Service');
const LSD_ServiceInstance = new LSD_Service();

let poll_a_msg_id, poll_b_msg_id, reaction_msg_id, nothing_msg_id;

$('body').on('click', '.btnBack', () => {
	location.href = 'dashboard.html';
});

const cr = chrome.runtime,
	cs = chrome.storage.local,
	ci = chrome.identity,
	ct = chrome.tabs;

cr.sendMessage({
	type: 'getStoryForSetup',
});

const logout_ext = async () => {
	await cr.sendMessage({ data: {}, type: 'logout' });
	window.location.href = '../login.html';
};

const populateStory = async () => {
	try {
		$('.loader').addClass('show');
		const urlSearchParams = new URLSearchParams(window.location.search);
		const { story_id } = Object.fromEntries(urlSearchParams.entries());
		$('#story_id').val(story_id);

		console.log('story_id :: ', story_id);

		const resOfMsgrp = await LSD_ServiceInstance.getAllMessageGroups();

		if (!resOfMsgrp.status) {
			if (resOfMsgrp.token != undefined && resOfMsgrp.token === false) {
				await logout_ext();
			}
			throw new Error(resOfMsgrp.error);
		}

		const arrOfMsgGrp = resOfMsgrp.data.payload.data;

		// const { all_story_details } = await cs.get('all_story_details');
		// const story = all_story_details.find((s) => s.story_id === story_id);

		const resGetStoryRes = await LSD_ServiceInstance.getFbStoryDetails(
			story_id
		);

		console.log(resGetStoryRes);

		if (!resGetStoryRes.status) {
			if (resGetStoryRes.token != undefined && resGetStoryRes.token === false) {
				await logout_ext();
			}
			$('.loader').removeClass('show');
			alert(resGetStoryRes.error);
			return;
		}

		const story = resGetStoryRes.data.data;
		console.log('Story Details From API :: ', story);
		let total_voter_count_digit = 0;
		if (story.polls && story.polls.poll_options.length > 0) {
			total_voter_count_digit =
				story.polls.poll_options[0].vote_count +
				story.polls.poll_options[1].vote_count;
		}

		if (story.automation_id && story.automation_id.is_deleted) {
			$('.story-setup-btn').attr('disabled', true);
		}

		let timeAgo = moment.unix(story.creation_time).fromNow();
		console.log(timeAgo);
		timeAgo = timeAgo.substring(0, timeAgo.lastIndexOf(' '));
		//${story.viewer_count - total_voter_count_digit}
		if (timeAgo.includes('hours')) timeAgo = timeAgo.replace('hours', 'h');
		if (timeAgo.includes('hour')) timeAgo = timeAgo.replace('an hour', '1 h');
		if (timeAgo.includes('minutes')) timeAgo = timeAgo.replace('minutes', 'm');
		if (timeAgo.includes('minute'))
			timeAgo = timeAgo.replace('a minute', '1 m');
		if (timeAgo.includes('seconds')) timeAgo = timeAgo.replace('seconds', 's');
		$('.storyheader').html(`<span class="timestamp">${timeAgo}</span>
  <span class="views">
    <figure>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 3.375C5.25 3.375 2.0475 5.7075 0.75 9C2.0475 12.2925 5.25 14.625 9 14.625C12.75 14.625 15.9525 12.2925 17.25 9C15.9525 5.7075 12.75 3.375 9 3.375ZM9 12.75C6.93 12.75 5.25 11.07 5.25 9C5.25 6.93 6.93 5.25 9 5.25C11.07 5.25 12.75 6.93 12.75 9C12.75 11.07 11.07 12.75 9 12.75ZM9 6.75C7.755 6.75 6.75 7.755 6.75 9C6.75 10.245 7.755 11.25 9 11.25C10.245 11.25 11.25 10.245 11.25 9C11.25 7.755 10.245 6.75 9 6.75Z"
          fill="white" />
      </svg>
    </figure>
    ${story.viewer_count}
  </span>`);

		$('.bodyStory')
			.html(`<figure style="background-image: url(${story.story_attachement_uri});">
  </figure>`);

		if (story.automation_id && story.automation_id._id)
			$('#automation-id').val(story.automation_id._id);

		//arrOfMsgGrp
		let grpLi = '';
		arrOfMsgGrp.forEach((msgGrp) => {
			grpLi += `<li grp_id=${msgGrp._id}>
	${msgGrp.title}
	</li>`;
		});
		$('.listingMessage').html(`<ul><li>Select message group</li>${grpLi}</ul>`);

		$('.footerStory').html(`<label class="custom-check">
    <input type="checkbox" name="" id="automation_status" ${
			story.automation_id && story.automation_id.is_active ? 'checked' : ''
		} />
    <span class="checkStyle"></span>
    <span class="checkText">
    </span>
  </label>`);
		if (story.automation_id) {
			// populate exist automation

			$('.message_delivered_count').text(
				story.automation_id.message_delivered || 0
			);
			if (story.automation_id.automation_type.on_reactions.msg_group) {
				$('input[name="reaction"]').prop('checked', true);
				$('input[name="reaction"]')
					.parents('.setOption')
					.find('.listingMessage ul')
					.find('li')
					.each(function () {
						const that = $(this);
						if (
							that.attr('grp_id') &&
							that.attr('grp_id') ==
								story.automation_id.automation_type.on_reactions.msg_group
						) {
							that.addClass('selected');
							that
								.parents('.contentSetupOpt')
								.eq(0)
								.find('span')
								.eq(0)
								.text(that.text());
							reaction_msg_id =
								story.automation_id.automation_type.on_reactions.msg_group;
						}
					});
			}
			if (story.automation_id.automation_type.on_poll.poll_a.msg_group) {
				$('input[name="poll_a"]').prop('checked', true);
				$('input[name="poll_a"]')
					.parents('.setOption')
					.find('.listingMessage ul')
					.find('li')
					.each(function () {
						const that = $(this);
						if (
							that.attr('grp_id') &&
							that.attr('grp_id') ==
								story.automation_id.automation_type.on_poll.poll_a.msg_group
						) {
							that.addClass('selected');
							that
								.parents('.contentSetupOpt')
								.eq(0)
								.find('span')
								.eq(0)
								.text(that.text());
							poll_a_msg_id =
								story.automation_id.automation_type.on_poll.poll_a.msg_group;
						}
					});
			}
			if (story.automation_id.automation_type.on_poll.poll_b.msg_group) {
				$('input[name="poll_b"]').prop('checked', true);
				$('input[name="poll_b"]')
					.parents('.setOption')
					.find('.listingMessage ul')
					.find('li')
					.each(function () {
						const that = $(this);

						if (
							that.attr('grp_id') &&
							that.attr('grp_id') ==
								story.automation_id.automation_type.on_poll.poll_b.msg_group
						) {
							that.addClass('selected');
							that
								.parents('.contentSetupOpt')
								.eq(0)
								.find('span')
								.eq(0)
								.text(that.text());
							poll_b_msg_id =
								story.automation_id.automation_type.on_poll.poll_b.msg_group;
						}
					});
			}
			if (story.automation_id.automation_type.on_nothing.msg_group) {
				$('input[name="none"]').prop('checked', true);
				$('input[name="none"]')
					.parents('.setOption')
					.find('.listingMessage ul')
					.find('li')
					.each(function () {
						const that = $(this);
						if (
							that.attr('grp_id') &&
							that.attr('grp_id') ==
								story.automation_id.automation_type.on_nothing.msg_group
						) {
							that.addClass('selected');
							that
								.parents('.contentSetupOpt')
								.eq(0)
								.find('span')
								.eq(0)
								.text(that.text());
							nothing_msg_id =
								story.automation_id.automation_type.on_nothing.msg_group;
						}
					});
			}
		} else {
			$('.message_delivered_count').parent().hide();
		}
		let total_voter_count = 0;
		if (story.polls && story.polls.poll_options.length > 0) {
			$('.poll_a').text(story.polls.poll_options[0].text);
			$('.poll_b').text(story.polls.poll_options[1].text);
			$('.poll_a_count').text(story.polls.poll_options[0].vote_count);
			$('.poll_b_count').text(story.polls.poll_options[1].vote_count);
			total_voter_count =
				story.polls.poll_options[0].vote_count +
				story.polls.poll_options[1].vote_count;
		} else {
			$('.poll_a').text('N/A').parent('.setOption').addClass('disabled');
			$('.poll_b').text('N/A').parent('.setOption').addClass('disabled');
			$('.poll_a_count').text('--');
			$('.poll_b_count').text('--');
			$('.poll_option_b').find('input').attr('disabled', true);
			$('.poll_option_a').find('input').attr('disabled', true);
			$('.poll_option_b').addClass('disabled');
			$('.poll_option_a').addClass('disabled');
		}

		const reaction_count = story.story_card_reactions
			? story.story_card_reactions.length
			: 0;
		const none_count = story.viewer_count - reaction_count - total_voter_count;

		$('.reaction_count').text(reaction_count);

		$('.none_count').text(none_count);

		$('.loader').removeClass('show');
	} catch (error) {
		alert(error.message);
		$('.loader').removeClass('show');
	}
};

// $('input[type="checkbox"]').on('change', function () {
// 	if ($(this).attr('id') === 'automation_status') return;
// 	$('.setOption').removeClass('active');
// 	if ($(this).is(':checked')) {
// 		$(this).parents('.setOption').addClass('active');
// 	} else {
// 		$(this).parents('.setOption').removeClass('active');
// 		$(this).parents('.setOption').find('span').text('');
// 		$(this).parents('.setOption').find('ul li').removeClass('selected');
// 	}

// 	switch ($(this).attr('name')) {
// 		case 'poll_a':
// 			poll_a_msg_id = null;
// 			break;
// 		case 'poll_b':
// 			poll_b_msg_id = null;
// 			break;
// 		case 'none':
// 			nothing_msg_id = null;
// 			break;
// 		case 'reaction': {
// 			reaction_msg_id = null;
// 			break;
// 		}
// 		default:
// 			break;
// 	}
// });

$('body').on('change', '#automation_status', async function () {
	// if (!$('#automation-id').val() && ) {
	// 	alert('Please create an automation first');
	// 	$(this).prop('checked', false);
	// 	return;
	// }
	const validation_pass = validationPass();
	if (!validation_pass.success) {
		alert(validation_pass.message);
		$(this).prop('checked', false);
		return;
	}
	const payload = {
		statusChange: true,
		is_active: $(this).is(':checked'),
	};

	const resOfAutomation = await LSD_ServiceInstance.updateAutomation(
		$('#automation-id').val() || undefined,
		$('#story_id').val(),
		payload
	);

	if (!resOfAutomation.status) {
		if (resOfAutomation.token != undefined && resOfAutomation.token === false) {
			await logout_ext();
		}
		alert('Error :: ', resOfAutomation.error);
		return;
	} else {
		$('#automation-id').val(resOfAutomation.data.data);
		// alert('Story automation setup successfully updated.');
		cr.sendMessage({
			type: 'story_automation_alarm_setup',
			status: payload.is_active,
			subtype: 'statusChanged',
			data: {
				automation_id: resOfAutomation.data.data,
				active: payload.is_active,
			},
		});
	}
});

$('body').on('click', '.listingMessage li', function () {
	const grp_id = $(this).attr('grp_id');

	const that = $(this);
	$(this)
		.parents('.listingMessage')
		.find('li')
		.each(function () {
			$(this).removeClass('selected');
		});
	if (grp_id) $(this).addClass('selected');
	console.log('grp_id :: ', grp_id);

	if (grp_id) {
		$(this).parents('.setOption').eq(0).find('input').prop('checked', true);

		switch ($(this).parents('.listingMessage').attr('list-for')) {
			case 'poll_a': {
				poll_a_msg_id = grp_id;
				break;
			}
			case 'poll_b': {
				poll_b_msg_id = grp_id;
				break;
			}
			case 'reaction': {
				reaction_msg_id = grp_id;
				break;
			}
			case 'none': {
				nothing_msg_id = grp_id;
				break;
			}
		}
		$(this)
			.parents('.contentSetupOpt')
			.eq(0)
			.find('span')
			.eq(0)
			.text($(this).text());
	}
	if (!grp_id) {
		$(this).parents('.contentSetupOpt').eq(0).find('span').eq(0).text('');
		$(this).parents('.setOption').eq(0).find('input').prop('checked', false);

		switch ($(this).parents('.setOption').eq(0).find('input').attr('name')) {
			case 'poll_a':
				poll_a_msg_id = null;
				break;
			case 'poll_b':
				poll_b_msg_id = null;
				break;
			case 'none':
				nothing_msg_id = null;
				break;
			case 'reaction': {
				reaction_msg_id = null;
				break;
			}
			default:
				break;
		}
	}
	$(this).parents('.setOption').removeClass('active');
});

$('.msg_btn').click(async function () {
	// if ($(this).parents('.setOption').find('input').is(':checked')) {
	$('.setOption').removeClass('active');
	$(this).parents('.setOption').toggleClass('active');
	// }
});

$(document).click(function (e) {
	if ($(e.target).parents('.setOption').length === 0) {
		$('.setOption').removeClass('active');
	}
});

function validationPass() {
	if ($('#automation_status').is(':checked')) {
		if ($('input[name=poll_a]').is(':checked') && !poll_a_msg_id) {
			return {
				success: false,
				message: `Please select message group for ${$('.poll_a')
					.eq(0)
					.text()} option`,
			};
		}
		if ($('input[name=poll_b]').is(':checked') && !poll_b_msg_id) {
			return {
				success: false,
				message: `Please select message group for ${$('.poll_b')
					.eq(0)
					.text()} option`,
			};
		}
		if ($('input[name=none]').is(':checked') && !nothing_msg_id) {
			return {
				success: false,
				message: `Please select message group for None of the above option`,
			};
		}
		if ($('input[name=reaction]').is(':checked') && !reaction_msg_id) {
			return {
				success: false,
				message: `Please select message group for reaction option`,
			};
		}
		if (
			!poll_a_msg_id &&
			!poll_b_msg_id &&
			!reaction_msg_id &&
			!nothing_msg_id
		) {
			return {
				success: false,
				message: `Please select a message group`,
			};
		}
	}
	return {
		success: true,
	};
}

$('.story-setup-btn').on('click', async function (e) {
	e.preventDefault();
	const validation_pass = validationPass();
	if (!validation_pass.success) {
		alert(validation_pass.message);
		return;
	}
	$('.loader').addClass('show');

	const payload = {
		automation_type: {
			on_poll: {
				poll_a: { name: $('.poll_a').eq(0).text(), msg_group: poll_a_msg_id },
				poll_b: { name: $('.poll_b').eq(0).text(), msg_group: poll_b_msg_id },
			},
			on_reactions: { msg_group: reaction_msg_id },
			on_nothing: { msg_group: nothing_msg_id },
		},
		is_active: $('#automation_status').is(':checked'),
	};

	const resOfAutomation = await LSD_ServiceInstance.updateAutomation(
		$('#automation-id').val() || undefined,
		$('#story_id').val(),
		payload
	);

	if (!resOfAutomation.status) {
		if (resOfAutomation.token != undefined && resOfAutomation.token === false) {
			await logout_ext();
		}
		$('.loader').removeClass('show');
		alert('Error :: ', resOfAutomation.error);
		return;
	} else {
		$('.loader').removeClass('show');
		$('#automation-id').val(resOfAutomation.data.data);
		alert('Story automation setup successfully saved.');
		cr.sendMessage({
			type: 'story_automation_alarm_setup',
			status: true,
			data: { automation_id: resOfAutomation.data.data, story_update: true },
		});
	}
});

populateStory();
