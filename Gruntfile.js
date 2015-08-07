/**
 * brandung FE Workflow 3.0
 * https://[github-URL]
 *
 * Copyright (c) 2015 brandung GmbH & Co.KG
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	/**
	 * Define our global vars
	 */
	var Config = {},
		configFile = './grunt/config.js',
		Helpers = require('./grunt/helpers'),
		_ = grunt.util._,
		path = require('path');

	/**
	 * Measures the time each task takes
	 *
	 * https://www.npmjs.com/package/time-grunt
	 */
	require("time-grunt")(grunt);


	/**
	 * Check if the Config.SYSTEM var is already set
	 * and load the config.js file.
	 */
	if (!Helpers.checkString('%%system%%', configFile)) {
		Config = require(configFile);
	}


	/**
	 * We have to bind the 'Config' object to our taskConfig,
	 * so we have access to the global vars for e.g. using `<% %>` template strings.
	 */
	var taskConfig = {
		Config: Config
	};

	/**
	 * Loads task options from 'grunt/tasks/' folder
	 * and loads tasks defined in `package.json`.
	 * Used jitGrunt to load only the modules that are currently needed
	 * instead of loading all modules on every build.
	 *
	 * https://www.npmjs.com/package/load-grunt-config
	 */
	taskConfig = _.extend(taskConfig,
		require('load-grunt-config')(grunt, {
			configPath: path.join(process.cwd(), 'grunt/tasks'),
			jitGrunt: {
				staticMappings: {
					bower: 'grunt-bower-task',
					replace: 'grunt-text-replace'
				}
			},
			init: false
		})
	);


	/**
	 * Init our grunt config
	 */
	grunt.initConfig(taskConfig);


	/******************
	 * App Main Tasks *
	 ******************/

	/**
	 * The 'default' task
	 */
	grunt.registerTask('default', 'Desc', [
		'confReady',
		'sass',
		'tasty_swig',
		'copy:privatePluginToPublicFolder',
		'copy:privateHandlerToPublicFolder',
		'copy:privateFunctionToPublicFolder',
		'copy:privateComponentToPublicFolder',
		'concat:mainJs',
		'clean:globalJsInPublicFolder',
		'sassToHtml'
	]);

	/**
	 * The `project:init` task configures your project,
	 * download the boilerplate and copy the assets
	 * into the given folder structure.
	 */
	grunt.registerTask('project:init', 'Start the initializing process', [
		'prompt:init',
		'replace:init',
		'confReady',
		'mkdir:projectStructure',
		'bower:fetchHtmlBoilerplate',
		'replace:pathPlaceholder',
		'copy:privateLibsToPublicFolder',
		'copy:privateRootFilesToRoot',
		'clean:privateRootFiles',
		'copy:hotfixjsToPublicFolder',
		'copy:hotfixcssToPublicFolder',
		'clean:rootFilesInPrivateFolder',
		'default',
		'project:server'
	]);

	/**
	 * The 'project:server' task for developing
	 */
	grunt.registerTask('project:server', [
		'default',
		'browserSync',
		'watch'
	]);

};
