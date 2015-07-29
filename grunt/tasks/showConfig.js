module.exports = function(grunt) {
	grunt.registerTask('config', 'Display the most important config variables', function() {
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
