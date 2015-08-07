/**
 * Replaces a placeholder for the assets path relative to the project type.
 *
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
	},
	pathPlaceholder: {
		src: [
			'<%= Config.PRIVATE_DIR %>/templates/tpl/**/*.tpl',
			'<%= Config.PRIVATE_DIR %>/js/global.js',
			'<%= Config.PRIVATE_DIR %>/sass/**/*.*',
			'bower.json'
		],
		overwrite: true,
		replacements: [
			{
				from: '%%public%%',
				to: '<%= Config.PUBLIC_DIR %>'
			},
			{
				from: '%%private%%',
				to: '<%= Config.PRIVATE_DIR %>'
			},
			{
				from: '%%project%%',
				to: '<%= Config.PKG_NAME %>'
			}
		]
	}
};