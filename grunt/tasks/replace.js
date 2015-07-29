/**
 * Replaces a placeholder for the assets path relative to the project type
 * https://npmjs.org/package/grunt-text-replace
 *
 * init:
 * - the template string is set by the prompt:init task
 */

module.exports = {
	init: {
		src: [
			'./grunt/config.js'
		],
		overwrite: true,
		replacements: [
			{
				from: '%%system%%',
				to: '<%= grunt.config("initSystem") %>'
			}
		]
	}
};