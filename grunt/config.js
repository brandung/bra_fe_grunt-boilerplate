/**
 * config.js
 *
 * This file contains all configuration items for the build process
 */

var grunt = require('grunt'),
	SystemObj =  grunt.file.readJSON('./grunt/system.json'),
	Config = {};


/**
 * Define our global configuration vars
 */
// Config.SYSTEM = '%%system%%',
Config.SYSTEM = 'zend'; 									// Our app system; was set on project:init task
Config.folderArr = SystemObj.struct[Config.SYSTEM].folder;	// Folder structure of the given system
Config.srcFolderName = 'src';								// The `src` folder contains all production assets, like js, scss und tpl files
Config.buildFolderName = 'build';							// Into the `build` folder our build process will copy the dev assets
Config.env = process.env;									// Get User environment
Config.PRIVATE_DIR = SystemObj.struct[Config.SYSTEM].private;
Config.PUBLIC_DIR = SystemObj.struct[Config.SYSTEM].public;
Config.SRC_DIR = SystemObj.struct[Config.SYSTEM].private + Config.srcFolderName;
Config.BUILD_DIR = SystemObj.struct[Config.SYSTEM].private + Config.buildFolderName;


/**
 * This is a collection of file patterns that refer to our app code (the
 * stuff in `src/`). These file paths are used in the configuration of
 * build tasks.
 */
Config.app_files = {
	js: ['%%system%%/src/**/*.js'],
	scss: ['%%system%%/src/**/*.scss']
};


module.exports = Config;
