/**
 * The awesome watch task which recognizes changes in the specified filetypes
 * and rebuilds the project after hitting strg + s
 *
 * https://npmjs.org/package/grunt-contrib-watch
 */

module.exports = {
	styles: {
		files: '<%= Config.PRIVATE_DIR %>/sass/**/*.scss',
		tasks: [
			'sass',
			'sassToHtml'
		]
	},
	scripts: {
		files: '<%= Config.PRIVATE_DIR %>/js/**/*.js',
		tasks: [
			'copy:privateHandlerToPublicFolderandler',
			'copy:privateHandlerToPublicFolder',
			'copy:privateFunctionToPublicFolder',
			'copy:privateComponentToPublicFolder',
			'concat:mainJs',
			'clean:globalJsInPublicFolder'
		]
	},
	tpl: {
		files: '<%= Config.PRIVATE_DIR %>/templates/tpl/**/*.tpl',
		tasks: [
			'tasty_swig'
		]
	}
};