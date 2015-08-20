/**
 * Minifies all stylesheets
 *
 * https://github.com/gruntjs/grunt-contrib-cssmin
 */

module.exports = {
	minify: {
		expand: true,
		cwd: '<%= Config.PUBLIC_DIR %>/css/',
		src: [
			'**/*.css'
		],
		dest: '<%= Config.PUBLIC_DIR %>/css/',
		ext: '.css',
		options: {
			report: 'min'
		}
	}
};