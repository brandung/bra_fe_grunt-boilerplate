/**
 * The magical sync task executes the watch task
 * after one of the specified file types change
 * and reloads the browser
 *
 * https://npmjs.org/package/grunt-browser-sync
 */

var grunt = require('grunt');

module.exports = {
	bsFiles: {
		src: [
			'<%= Config.PUBLIC_DIR %>/css/*.css',
			'<%= Config.PRIVATE_DIR %>/templates/*',
			'<%= Config.PRIVATE_DIR %>/component/**/*',
			'<%= Config.PUBLIC_DIR %>/js/**/*.js'
		]
	},
	options: {
		watchTask: true,
		open: 'external',
		notify: false,
		injectChanges: false,
		reloadDelay: 1000,
		port: 443,
		tunnel: '<%= Config.USER %>',
		server: {
			baseDir: '<%= Config.CWD %>',
			index: '<%= Config.PRIVATE_DIR %>/templates/_modules.html',
			routes: '<%= Config.syncRoutes %>'
		},
		ghostMode: {
			clicks: true,
			scroll: true,
			links: true,
			forms: true
		}
	}
};