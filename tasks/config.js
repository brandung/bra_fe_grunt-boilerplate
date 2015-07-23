/**
 * config.js
 *
 * This file contains all configuration items for the build process
 */

var grunt = require('grunt'),
	Config = {

		/**
		 * System
		 */
		//SYSTEM: '%%system%%',
		SYSTEM: 'zend',

		/**
		 * Folder structure for each system
		 */
		struct: {
			typo3: {
				folder: [
					'typo3conf/ext/bra_projectfiles/Resources/Private/Frontend',
					'typo3conf/ext/bra_projectfiles/Resources/Public/css',
					'typo3conf/ext/bra_projectfiles/Resources/Public/font',
					'typo3conf/ext/bra_projectfiles/Resources/Public/img/',
					'typo3conf/ext/bra_projectfiles/Resources/Public/js/libs/bra',
					'typo3conf/ext/bra_projectfiles/Resources/Public/js/libs/vendor'
				],
				private: 'typo3conf/ext/bra_projectfiles/Resources/Private/Frontend',
				public: 'typo3conf/ext/bra_projectfiles/Resources/Public'
			},
			zend: {
				folder: [
					'src/private/frontend',
					'src/public/css',
					'src/public/font',
					'src/public/img/',
					'src/public/js/libs/bra',
					'src/public/js/libs/vendor'
				],
				private: 'src/private/frontend',
				public: 'src/public'
			}
		},

		/**
		 * The `src` folder contains all production assets, like js, scss und tpl files
		 */
		srcFolderName: 'src',

		/**
		 * Into the `build` folder our build process will copy the dev assets
		 */
		buildFolderName: 'build',

		/**
		 * This is a collection of file patterns that refer to our app code (the
		 * stuff in `src/`). These file paths are used in the configuration of
		 * build tasks.
		 */
		app_files: {
			js: ['%%system%%/src/**/*.js'],
			scss: ['%%system%%/src/**/*.scss']
		}
	};

/**
 * Define our global vars
 */
Config.folder = Config.struct[Config.SYSTEM].folder;	// folder structure of given system
Config.env = process.env;								// get User environment

Config.PRIVATE_DIR = Config.struct[Config.SYSTEM].private;
Config.PUBLIC_DIR = Config.struct[Config.SYSTEM].public;
Config.SRC_DIR = Config.struct[Config.SYSTEM].private + Config.srcFolderName;
Config.BUILD_DIR = Config.struct[Config.SYSTEM].private + Config.buildFolderName;



module.exports = Config;
