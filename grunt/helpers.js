/**
 * helpers.js
 */


var grunt = require('grunt'),
	_ = grunt.util._,
	Helpers = {};

/**
 * List of package requisite for tasks
 * @type {{sass: string[]}}
 */
var taskRequirements = {
	sass: ['grunt-sass']
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
 * Prove if a package is available
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

module.exports = Helpers;