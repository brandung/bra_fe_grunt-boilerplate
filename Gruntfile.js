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
	var Config = require('./tasks/config'),
		_ = grunt.util._,
		path = require('path');

	/**
	 * Measures the time each task takes
	 * https://www.npmjs.com/package/time-grunt
	 */
	require("time-grunt")(grunt);


	/**
	 * Loads task options from 'tasks/options/'
	 * and loads tasks defined in `package.json`
	 * https://www.npmjs.com/package/load-grunt-config
	 */
	var taskConfig = _.extend({},
		require('load-grunt-config')(grunt, {
			configPath: path.join(process.cwd(), 'tasks/options'),
			loadGruntTasks: true,
			init: false
		})
	);


	/**
	 * We have to bind the 'Config' object to our taskConfig,
	 * so we have access to the global vars for e.g. using `<% %>` template strings
	 */
	taskConfig.Config = Config;


	/**
	 * Init our grunt config
	 */
	grunt.initConfig(taskConfig);




	/******************
	 * App Main Tasks *
	 ******************/

	// Default Task
	grunt.registerTask('default', "Desc", [
		'helloWorld'
	]);

};
