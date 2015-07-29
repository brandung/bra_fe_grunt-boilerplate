/**
 * helpers.js
 */

var grunt = require('grunt'),
	_ = grunt.util._,
	Helpers = {};

/**
 * If SYSTEM var isn't already set abort task
 *
 * @param Config
 * @returns {boolean}
 */
Helpers.isSystemSet = function (Config) {
	if (Config.SYSTEM === '%%system%%') {
		grunt.log.writeln('\n**************************************'['red']);
		grunt.log.writeln('***              ERROR             ***'['red']);
		grunt.log.writeln('**************************************'['red']);
		grunt.log.error(['Project has been not initialized!'['red']]);
		grunt.log.error(['Please run the init task and choose'['red']]);
		grunt.log.error(['your system: `grunt project:init`'['red']]);
		grunt.log.writeln('**************************************\n'['red']);
		grunt.fail.warn('No \'system\' defined!');
	} else {
		return true;
	}
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

module.exports = Helpers;