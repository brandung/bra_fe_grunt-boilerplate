/**
 * config.js
 *
 * The 'Config' object contains all our system configurations for our build tasks.
 * In the 'SystemPath' object we will store the folder paths of the selected system.
 */

var grunt = require('grunt'),
	Config = {};

/**
 * Our init System
 */
Config.SYSTEM = '%%system%%';

/**
 * Define our global configuration vars
 */
Config.systemPaths =  grunt.file.readJSON('./grunt/systems/' + Config.SYSTEM + '.json');
Config.folderArr = Config.systemPaths.folder;	// Folder structure of the given system
Config.srcFolderName = 'src';					// The `src` folder contains all production assets, like js, scss und tpl files
Config.buildFolderName = 'build';				// Into the `build` folder our build process will copy the dev assets
//Config.env = process.env;						// Get User environment

/**
 * Define our global directory paths
 */
Config.PRIVATE_DIR = Config.systemPaths.private;
Config.PUBLIC_DIR = Config.systemPaths.public;
Config.SRC_DIR = Config.systemPaths.private + '/' + Config.srcFolderName;
Config.BUILD_DIR = Config.systemPaths.private + '/' + Config.buildFolderName;

/**
 * This is a collection of file patterns that refer to our app code (the
 * stuff in `src/`). These file paths are used in the configuration of
 * build tasks.
 */
Config.app_files = {
	js: [Config.SRC_DIR + '/**/*.js'],
	scss: [Config.SRC_DIR +'/**/*.scss']
};


module.exports = Config;
