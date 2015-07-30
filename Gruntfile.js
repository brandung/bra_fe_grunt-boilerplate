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
	 * https://www.npmjs.com/package/time-grunt
	 */
	require("time-grunt")(grunt);


	/**
	 * Check if the Config.SYSTEM var is already set
	 * and load the config.js file
	 */
	if(!Helpers.checkString('%%system%%', configFile)) {
		Config = require(configFile);
	}


	/**
	 * We have to bind the 'Config' object to our taskConfig,
	 * so we have access to the global vars for e.g. using `<% %>` template strings
	 */
	var taskConfig = {
		Config: Config
	};

	/**
	 * Loads task options from 'grunt/tasks/' folder
	 * and loads tasks defined in `package.json`
	 * https://www.npmjs.com/package/load-grunt-config
	 */
	taskConfig = _.extend(taskConfig,
		require('load-grunt-config')(grunt, {
			configPath: path.join(process.cwd(), 'grunt/tasks'),
			loadGruntTasks: true,
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

	// Default Task
	grunt.registerTask('default', 'Desc', [
		'helloWorld'
	]);

	/**
	 * The `project:init` task configures your project,
	 * download the boilerplate and copy the assets
	 * into the given folder structure.
	 *
	 * @options: system
	 */
	grunt.registerTask('project:init', 'Start the initializing process', [
		'prompt:init',
		'replace:init',
		'config'
	]);

	// TODO: Update grunt.config after replace:init

};
