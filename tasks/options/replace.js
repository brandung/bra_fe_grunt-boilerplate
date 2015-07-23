/**
 * Replaces a placeholder for the assets path relative to the project type
 * https://npmjs.org/package/grunt-text-replace
 */
	
var grunt = require('grunt'),
	Config = require('../config');

module.exports = {
	init: {
		src: [
			'./tasks/config.js'
		],
		overwrite: true,
		replacements: [
			{
				from: '%%system%%',
				to: Config.SYSTEM
			},
			{
				from: '%%private%%',
				to: '<%= Config.PRIVATE_DIR %>'
			}
		]
	}
};