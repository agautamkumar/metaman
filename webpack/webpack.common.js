const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

module.exports = {
	entry: {
		kyubi_whitelabel: path.join(
			__dirname,
			srcDir + 'config/kyubi_whitelabel.js'
		),
		common_helper: path.join(__dirname, srcDir + 'helpers/common_helper.js'),
		fb_helper: path.join(__dirname, srcDir + 'helpers/fb_helper.js'),
		before_login: path.join(
			__dirname,
			srcDir + 'popup_scripts/before_login.js'
		),
		insights : path.join(__dirname, srcDir + 'popup_scripts/insights.js'),
		common: path.join(__dirname, srcDir + 'popup_scripts/common.js'),
		common_b: path.join(__dirname, srcDir + 'popup_scripts/common_b.js'),
		message_group: path.join(
			__dirname,
			srcDir + 'popup_scripts/message_group.js'
		),
		message_segment: path.join(
			__dirname,
			srcDir + 'popup_scripts/message_segment.js'
		),
		change_password: path.join(
			__dirname,
			srcDir + 'popup_scripts/change_password.js'
		),
		story_setup: path.join(__dirname, srcDir + 'popup_scripts/story_setup.js'),
		service_worker: path.join(
			__dirname,
			srcDir + 'service_worker_scripts/service_worker.js'
		),
		story_sync: path.join(
			__dirname,
			srcDir + 'content/automation/story_sync.js'
		),
		message_send: path.join(
			__dirname,
			srcDir + 'content/automation/message_send.js'
		),
		common_lsd: path.join(__dirname, srcDir + 'content/common.js'),
		api: path.join(__dirname, srcDir + 'services/api.js'),
		FB_Service: path.join(__dirname, srcDir + 'services/FB_Service.js'),
		Kyubi_Service: path.join(__dirname, srcDir + 'services/Kyubi_Service.js'),
		LSD_Service: path.join(__dirname, srcDir + 'services/LSD_Service.js'),
	},
	output: {
		path: path.join(__dirname, '../dist/js'),
		filename: '[name].js',
	},

	optimization: {
		// splitChunks: {
		// 	name: 'vendor',
		// 	chunks: 'initial',
		// },
		runtimeChunk: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		// exclude locale files in moment
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new CopyPlugin([{ from: '.', to: '../' }], { context: 'public' }),
	],
	performance: {
		maxAssetSize: 1000000,
	},
};
