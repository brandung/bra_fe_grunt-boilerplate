/**
 * Creates files
 *
 * https://www.npmjs.com/package/grunt-file-creator
 */

var grunt = require('grunt'),
	component = grunt.option('name') || '',
	date = new Date();

module.exports = {
	componentFiles: [
		{
			file: '<%= Config.PRIVATE_DIR %>/sass/component/' + component + '.scss',
			method: function (fs, fd, done) {
				var content = "@charset \"utf-8\";\n" +
					"/**\n" +
					" * brandung " + component + " v1.0.0\n" +
					" *\n" +
					" * Copyright brandung GmbH & Co.KG\n" +
					" * http://www.brandung.de/\n" +
					" *\n" +
					" * Date: " + date.toISOString().substring(0, 10) + "\n" +
					" * MIT License (MIT)\n" +
					" */\n" +
					"\n" +
					"@import '../partials/functions';\n" +
					"@import '../partials/variables';\n" +
					"@import '../partials/mixins';\n" +
					"\n" +
					"." + component + " {\n" +
					"\t\n" +
					"}\n";
				fs.writeSync(fd, content);

				done();
			}
		},
		{
			file: '<%= Config.PRIVATE_DIR %>/templates/tpl/partials/component/' + component + '.tpl',
			method: function (fs, fd, done) {
				var content = "<!--\n" +
					" brandung " + component + " v1.0.0\n" +
					"\n" +
					" Copyright brandung GmbH & Co.KG\n" +
					" http://www.brandung.de/\n" +
					"\n" +
					" Date: " + date.toISOString().substring(0, 10) + "\n" +
					" MIT License (MIT)\n" +
					" -->\n" +
					"<div class=\"" + component + "\"></div>";

				fs.writeSync(fd, content);

				done();
			}
		}
	],
	viewFiles: [
		{
			file: '<%= Config.PRIVATE_DIR %>/templates/tpl/partials/views/' + component + '.tpl',
			method: function (fs, fd, done) {
				var content = "<!--\n" +
					" brandung " + component + " v1.0.0\n" +
					"\n" +
					" Copyright brandung GmbH & Co.KG\n" +
					" http://www.brandung.de/\n" +
					"\n" +
					" Date: " + date.toISOString().substring(0, 10) + "\n" +
					" MIT License (MIT)\n" +
					" -->\n";
				fs.writeSync(fd, content);

				done();
			}
		}
	]
};