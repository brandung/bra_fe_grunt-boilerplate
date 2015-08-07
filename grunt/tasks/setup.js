module.exports = function(grunt) {
	grunt.registerTask('setup', 'Check and Update grunt.config object', function() {

		var Helpers = require('../helpers.js'),
			Msg = require('../msg.js'),
			configFile = './grunt/config.js';

		/**
		 * Check if the Config.SYSTEM variable is already set.
		 * If not show an error message and cancel the tasks.
		 */
		if (Helpers.checkString('%%system%%', configFile)) {
			Msg.warnConfig();
			return;
		}

		/**
		 * Update the grunt.config object after config.js has been modified
		 * and print the configuration setup.
		 */
		Helpers.updateGruntConfig();

		var config = grunt.config('Config');

		grunt.log.writeln('\n**************************************');
		grunt.log.writeln('***            CONFIG DATA           ***');
		grunt.log.writeln('**************************************');

		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				grunt.log.writeln(key['green'] + ' -> '['green'] + config[key]);
			}
		}
		grunt.log.writeln('**************************************\n');
	});
};
