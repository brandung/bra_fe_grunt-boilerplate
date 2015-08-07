/**
 * helpers.js
 */

var grunt = require('grunt'),
	_ = grunt.util._,
	Helpers = {};

/**
 * Update grunt.config data
 */
Helpers.updateGruntConfig = function () {
	var Config = require('./config.js');
	grunt.config.set('Config', Config);
};


/**
 * Filter only the available tasks
 *
 * @param tasks
 * @returns {*}
 */
Helpers.filterAvailableTasks = function (tasks) {
	tasks = tasks.map(function (taskName) {
		// Maps to task name or fallback if task is unavailable

		var baseName = taskName.split(':')[0]; // e.g. 'sass' for 'sass:compile'
		var reqs = taskRequirements[baseName];
		var isAvailable = Helpers.isPackageAvailable(reqs);
		return isAvailable ? taskName : taskFallbacks[taskName];
	});

	return _.flatten(_.compact(tasks)); // Remove undefined's and flatten it
};

/**
 * Check if a package is available
 *
 * @param pkgNames
 * @returns {boolean}
 */
Helpers.isPackageAvailable = function (pkgNames) {
	if (!pkgNames) return true;  // packages are assumed to exist

	if (!_.isArray(pkgNames)) {
		pkgNames = [pkgNames];
	}

	return _.every(pkgNames, function (pkgNames) {
		if (!_.isArray(pkgNames)) {
			pkgNames = [pkgNames];
		}

		return _.any(pkgNames, function (pkgName) {
			return !!Helpers.pkg.devDependencies[pkgName];
		});
	});
};


/**
 * Check specific string within a file
 *
 * @param regStr
 * @param file
 * @returns {boolean}
 */
Helpers.checkString = function (regStr, file) {
	var configFile = grunt.file.read(file),
		patt = new RegExp(regStr);

	return patt.test(configFile);
};


/**
 * Get all files in a specific folder
 *
 * @param dir
 * @param files_
 * @returns {*|Array}
 */
Helpers.getFiles = function (dir, files_) {
	var fs = require('fs');
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files) {
		if (files.hasOwnProperty(i)) {
			var name = dir + '/' + files[i];
			if (fs.statSync(name).isDirectory()) {
				getFiles(name, files_);
			} else {
				files_.push(name);
			}
		}
	}
	return files_;
};

/**
 * Split suffix from filename
 *
 * @param file
 * @returns {String}
 */
Helpers.getFilename = function (file) {
	return file.split('\\').pop().split('/').pop().split('.').reverse().pop();
};


module.exports = Helpers;