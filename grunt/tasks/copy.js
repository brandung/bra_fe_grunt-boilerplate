/**
 * Copy js files from private to public to the proper directories.
 *
 * https://www.npmjs.org/package/grunt-contrib-copy
 */
module.exports = {
	htmlBoilerplateToPrivate: {
		expand: true,
		cwd: './hbp/',
		src: '**',
		dest: '<%= Config.PRIVATE_DIR %>/',
		dot: true
	},
	privateLibsToPublicFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/js/libs/',
		src: '**',
		dest: '<%= Config.PUBLIC_DIR %>/js/libs/'
	},
	privateUtilToPublicFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/js/util/',
		src: '*',
		dest: '<%= Config.PUBLIC_DIR %>/js/util/',
		flatten: true
	},
	privateHandlerToPublicFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/js/handle/',
		src: '*',
		dest: '<%= Config.PUBLIC_DIR %>/js/handle/',
		flatten: true
	},
	privateFunctionToPublicFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/js/function/',
		src: '*',
		dest: '<%= Config.PUBLIC_DIR %>/js/function/',
		flatten: true
	},
	privateComponentToPublicFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/component/',
		src: [
			'*/*.*',
			'!*/*.scss',
			'!*/*.tpl'
		],
		dest: '<%= Config.PUBLIC_DIR %>/component/',
		flatten: false
	},
	publicComponentVendorToPublicJSFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/component/',
		src: ['*/js/**/*.*'],
		dest: '<%= Config.PUBLIC_DIR %>/js/',
		flatten: false,
		rename: function(dest, src) {
			var path = require('path');
			// Get the name of the component folder (or first folder in src path)
			var compRoot = src.split(path.posix.sep + 'js' + path.posix.sep)[1];
			// Split the file name from compRoot to get the folder path
			var folderPath = compRoot.substr(0, compRoot.lastIndexOf(path.posix.sep));
			// Set new destination for each file
			var newDest = dest + folderPath;

			return path.join(newDest, path.basename(src));
		}
	},
	privateRootFilesToRoot: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/',
		src: [
			'apple-touch-icon.png',
			'favicon.ico',
			'tile.png',
			'tile-wide.png',
			'.htaccess',
			'browserconfig.xml',
			'hotfix.css',
			'hotfix.js',
			'robots.txt',
			'crossdomain.xml'
		],
		dest: './',
		flatten: true
	},
	hotfixjsToPublicFolder: {
		expand: true,
		cwd: './',
		src: 'hotfix.js',
		dest: '<%= Config.PUBLIC_DIR %>/js/',
		flatten: true
	},
	hotfixcssToPublicFolder: {
		expand: true,
		cwd: './',
		src: 'hotfix.css',
		dest: '<%= Config.PUBLIC_DIR %>/css/',
		flatten: true
	},
	publicFolderToZipFolder: {
		expand: true,
		cwd: '<%= Config.PUBLIC_DIR %>/',
		src: '**',
		dest: '<%= Config.ZIP_PUBLIC_FOLDER %>/'
	},
	templatesToZipFolder: {
		expand: true,
		cwd: '<%= Config.PRIVATE_DIR %>/templates/',
		src: '**',
		dest: '<%= Config.PKG_NAME %>/'
	},
	rootFilesToZipFolder: {
		expand: true,
		cwd: './',
		src: [
			'apple-touch-icon.png',
			'.htaccess',
			'browserconfig.xml',
			'favicon.ico',
			'robots.txt',
			'tile.png',
			'tile-wide.png',
			'crossdomain.xml'
		],
		dest: '<%= Config.PKG_NAME %>/'
	},
	gruntUpdate: {
		expand: true,
		cwd: './fe-workflow/',
		src: '**',
		dest: './',
		flatten: false
	}
};
