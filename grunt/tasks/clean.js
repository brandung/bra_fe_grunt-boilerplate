/**
 * Removes build folder after zipping it
 *
 * https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = {
	rootFilesInPrivateFolder: [
		'<%= Config.PRIVATE_DIR %>/README.md',
		'<%= Config.PRIVATE_DIR %>/LICENSE',
		'<%= Config.PRIVATE_DIR %>/.gitignore',
		'<%= Config.PRIVATE_DIR %>/.bower.json',
		'<%= Config.PRIVATE_DIR %>/js/libs/',
		'<%= Config.PRIVATE_DIR %>/hotfix.js',
		'<%= Config.PRIVATE_DIR %>/hotfix.css',
		'hotfix.js',
		'hotfix.css'
	],
	globalJsInPublicFolder: [
		'<%= Config.PUBLIC_DIR %>/js/global.js'
	],
	// todo refactor
	/*build: [
	 '<%= Config.PRIVATE_DIR %>/templates/mod/**',
	 '<%= Config.PRIVATE_DIR %>/sass/mod/**',
	 '<%= Config.PRIVATE_DIR %>/js/mod/**'
	 ],*/
	privateRootFiles: [
		'<%= Config.PRIVATE_DIR %>/apple-touch-icon-precomposed.png',
		'<%= Config.PRIVATE_DIR %>/favicon.ico',
		'<%= Config.PRIVATE_DIR %>/tile.png',
		'<%= Config.PRIVATE_DIR %>/tile-wide.png',
		'<%= Config.PRIVATE_DIR %>/.htaccess',
		'<%= Config.PRIVATE_DIR %>/browserconfig.xml',
		'<%= Config.PRIVATE_DIR %>/robots.txt'
	],
	zipTplFolder: [
		'<%= Config.PKG_NAME %>/tpl/'
	],
	zipFolder: [
		'<%= Config.PKG_NAME %>'
	]
};