module.exports = function (grunt) {
	var pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		target = grunt.option('target'),
		cwd = path.resolve(process.cwd(), ''),
		dbug = !!grunt.option('dbug');

	// measures the time grunt takes to complete all tasks
	// https://www.npmjs.org/package/time-grunt
	require('time-grunt')(grunt);

	// load only the modules that are currently needed instead of loading all modules on every build
	// https://www.npmjs.org/package/jit-grunt
	require('jit-grunt')(grunt, {
		'code:compress': [
			'uglify',
			'cssmin'
		],
		'code:validate': [
			'jslint',
			'csslint'
		],
		'project:init': [
			'mkdir:project',
			'bower:boilerplate',
			'replace:project',
			'copy:libs',
			'copy:rootFiles',
			'clean:rootFiles',
			'copy:hotfixjs',
			'copy:hotfixcss',
			'clean:project',
			'default',
			'project:sync'
		],
		'project:sync': [
			'browserSync',
			'dbug',
			'concat',
			'watch'
		],
		'build:installModules': [
			'bower:install',
			'copy:scssmod',
			'build:insertAssets',
			'default',
			'clean:build',
			'project:sync'
		],
		'build:insertAssets': [
			'appendAssets:html',
			'appendAssets:scss',
			'appendAssets:js'
		],
		'unzip': 'grunt-zip',
		'replace': 'grunt-text-replace',
		'bower': 'grunt-bower-task'
	});

	pkg.folder = pkg.struct[pkg.system].folder;
	pkg.private = pkg.struct[pkg.system].private;
	pkg.public = pkg.struct[pkg.system].public;

	if (target) {
		pkg.private += '/' + target;
		pkg.public += '/' + target;
	}

	pkg.packFolder = pkg.name + '/' + pkg.public;

	//pkg.boilerplateFolder = pkg.build.boilerplateFolder;
	pkg.tempAssets = '';

	// Project configuration
	grunt.initConfig({
		pkg: pkg,

		// Create folder structure specified in package.json
		// https://npmjs.org/package/grunt-mkdir
		mkdir: {
			project: { // create initial folder structure
				options: {
					create: '<%= pkg.folder %>'
				}
			},
			pack: { // create zip folder
				options: {
					create: [pkg.packFolder]
				}
			}
		},

		// zips the project for external use
		// https://npmjs.org/package/grunt-zip
		'zip': {
			'<%= pkg.name %>.zip': [
				'<%= pkg.name %>/**'
			]
		},

		// removes build folder after zipping it
		// https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			project: [
				'<%= pkg.private %>/README.md',
				'<%= pkg.private %>/LICENSE',
				'<%= pkg.private %>/.gitignore',
				'<%= pkg.private %>/.bower.json',
				'<%= pkg.private %>/js/libs/',
				'hotfix.js',
				'hotfix.css'
			],
			js: [
				'<%= pkg.public %>/js/global.js'
			],
			build: [
				'<%= pkg.private %>/templates/mod/**',
				'<%= pkg.private %>/sass/mod/**',
				'<%= pkg.private %>/js/mod/**'
			],
			rootFiles: [
				'<%= pkg.private %>/apple-touch-icon-precomposed.png',
				'<%= pkg.private %>/favicon.ico',
				'<%= pkg.private %>/tile.png',
				'<%= pkg.private %>/tile-wide.png',
				'<%= pkg.private %>/.htaccess',
				'<%= pkg.private %>/browserconfig.xml',
				//'hotfix.css',
				//'hotfix.js',
				'<%= pkg.private %>/robots.txt'
			],
			zip: [
				'<%= pkg.name %>'
			]
		},

		// append assets into specific files
		// @brandung
		appendAssets: {
			html: {
				startBlock: '<!-- start|bra-pb: html -->\n',
				endBlock: '<!-- end|bra-pb: html -->',
				paths: [
					'<%= pkg.private %>/templates/mod/**/*.html'
				]
			},
			scss: {
				startBlock: '// --- start|bra-pb: scss ---\n',
				endBlock: '// --- end|bra-pb: scss ---',
				paths: [
					'<%= pkg.private %>/sass/partials/mod/*.scss'
				]
			},
			js: {
				startBlock: '// --- start|bra-pb: js ---\n',
				endBlock: '// --- end|bra-pb: js ---',
				paths: [
					'<%= pkg.private %>/js/helpers/**/*.js',
					'<%= pkg.private %>/js/mod/**/*.js'
				]
			}
		},

		// replaces a placeholder for the assets path relative to the project type
		// https://npmjs.org/package/grunt-text-replace
		replace: {
			appendAssetsHTML: {
				src: ['<%= pkg.private %>/templates/tpl/_modules.tpl'],
				overwrite: true,
				replacements: [
					{
						from: /(<!--\s(start\|bra-pb:)\s(\S*)\s-->*(\S*))(\n|\r|.)*?(<!--\s(end\|bra-pb:)\s(\S*)\s-->)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			appendAssetsSCSS: {
				src: ['<%= pkg.private %>/sass/main.scss'],
				overwrite: true,
				replacements: [
					{
						from: /(\/\/\s(\S*)\s(start\|bra-pb:)\s(\S*)\s---*(\S*))(\n|\r|.)*?(\/\/\s(\S*)\s(end\|bra-pb:)\s(\S*)\s---)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			appendAssetsJS: {
				src: ['<%= pkg.private %>/js/global.js'],
				overwrite: true,
				replacements: [
					{
						from: /(\/\/\s(\S*)\s(start\|bra-pb:)\s(\S*)\s---*(\S*))(\n|\r|.)*?(\/\/\s(\S*)\s(end\|bra-pb:)\s(\S*)\s---)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			project: {
				src: [
					'<%= pkg.private %>/templates/tpl/**/*.tpl',
					'<%= pkg.private %>/js/global.js',
					'<%= pkg.private %>/js/dbug/dbug.js',
					'<%= pkg.private %>/sass/partials/*.*',
					'bower.json'
				],
				overwrite: true,
				replacements: [
					{
						from: '%%public%%',
						to: pkg.public
					},
					{
						from: '%%private%%',
						to: pkg.private
					},
					{
						from: '%%project%%',
						to: pkg.name
					}
				]
			},
			zip: {
				src: [
					'<%= pkg.name %>/*.*'
				],
				overwrite: true,
				replacements: [
					{
						from: 'src="/',
						to: 'src="'
					},
					{
						from: 'href="/',
						to: 'href="'
					}
				]
			}
		},

		// compiles sass files using libsass (damn fast!)
		// https://www.npmjs.org/package/grunt-sass
		sass: {
			options: {
				sourceMap: true,
				sourceComments: 'map'
			},
			files: {
				files: {
					'<%= pkg.public %>/css/all-old-ie.css': '<%= pkg.private %>/sass/all-old-ie.scss',
					'<%= pkg.public %>/css/main.css': '<%= pkg.private %>/sass/main.scss'
				}
			}
		},

		// Concats specified js files in a given order
		// https://npmjs.org/package/grunt-contrib-concat
		concat: {
			dist: {
				src: [
					'<%= pkg.public %>/js/libs/vendor/basket/basket.full.min.js',
					'<%= pkg.private %>/js/global.js'
				],
				dest: '<%= pkg.public %>/js/main.js'
			}
		},

		// Copy js files from private to public to the proper directories
		// https://www.npmjs.org/package/grunt-contrib-copy
		copy: {
			libs: {
				expand: true,
				cwd: '<%= pkg.private %>/js/libs/',
				src: '**',
				dest: '<%= pkg.public %>/js/libs/'
			},
			widgets: {
				expand: true,
				cwd: '<%= pkg.private %>/js/widgets/',
				src: '*',
				dest: '<%= pkg.public %>/js/widgets/',
				flatten: true
			},
			scssmod: {
				expand: true,
				cwd: '<%= pkg.private %>/sass/mod/',
				src: '**',
				dest: '<%= pkg.private %>/sass/partials/mod/',
				flatten: true,
				filter: 'isFile'
			},
			rootFiles: {
				expand: true,
				cwd: '<%= pkg.private %>/',
				src: [
					'apple-touch-icon-precomposed.png',
					'favicon.ico',
					'tile.png',
					'tile-wide.png',
					'.htaccess',
					'browserconfig.xml',
					'hotfix.css',
					'hotfix.js',
					'robots.txt'
				],
				dest: './',
				flatten: true
			},
			hotfixjs: {
				expand: true,
				cwd: './',
				src: 'hotfix.js',
				dest: '<%= pkg.public %>/js/',
				flatten: true
			},
			hotfixcss: {
				expand: true,
				cwd: './',
				src: 'hotfix.css',
				dest: '<%= pkg.public %>/css/',
				flatten: true
			},
			packPublicFolder: {
				expand: true,
				cwd: '<%= pkg.public %>/',
				src: '**',
				dest: '<%= pkg.packFolder %>/'
			},
			packTemplates: {
				expand: true,
				cwd: '<%= pkg.private %>/templates/',
				src: '**',
				dest: '<%= pkg.name %>/'
			},
			packRootfiles: {
				expand: true,
				cwd: './',
				src: [
					'.htaccess',
					'apple-touch-icon-precomposed.png',
					'browserconfig.xml',
					'favicon.ico',
					'robots.txt',
					'tile.png',
					'tile-wide.png'
				],
				dest: '<%= pkg.name %>/'
			}
		},

		// minify all js files (has no effect on vendor js files under js/vendor)
		// https://npmjs.org/package/grunt-contrib-uglify
		uglify: {
			options: {
				report: 'min'
			},
			global: {
				expand: true,
				cwd: '<%= pkg.public %>/js/',
				src: '*.js',
				dest: '<%= pkg.public %>/js/'
			},
			widgets: {
				expand: true,
				cwd: '<%= pkg.public %>/js/widgets/',
				src: '*.js',
				dest: '<%= pkg.public %>/js/widgets/'
			}
		},

		// minfies all stylesheets
		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= pkg.public %>/css/',
				src: [
					'*.css'
				],
				dest: '<%= pkg.public %>/css/',
				ext: '.css',
				options: {
					report: 'min'
				}
			}
		},

		// validates js and saves all found errors and warnings in a log file
		// https://npmjs.org/package/grunt-jslint
		jslint: {
			client: {
				src: [
					'<%= pkg.private %>/js/*.js',
					'<%= pkg.private %>/js/helpers/*.js',
					'<%= pkg.private %>/js/widgets/*.js',
					'<%= pkg.private %>/js/ngapp/**/*.js'
				],
				directives: {
					browser: true,
					predef: [
						'jQuery',
						'Modernizr',
						'angular'
					]
				},
				options: {
					log: '<%= pkg.private %>/js/jslint.log',
					failOnError: false,
					errorsOnly: true
				}
			}
		},

		// validates css and checks for possible optimizations
		// https://npmjs.org/package/grunt-contrib-csslint
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: [
					'<%= pkg.public %>/css/*.css'
				]
			}
		},

		// do the bower packaging stuff
		// https://www.npmjs.org/package/grunt-bower-task
		bower: {
			install: {
				options: {
					targetDir: './',
					layout: 'byType',
					cleanTargetDir: false,
					cleanBowerDir: true,
					verbose: true
				}
			},
			boilerplate: {
				options: {
					targetDir: './',
					layout: function (type, component, src) {
						return path.join(pkg.private);
					},
					cleanTargetDir: false,
					cleanBowerDir: true,
					verbose: true
				}
			}
		},

		// template engine plugin swig
		// https://www.npmjs.com/package/grunt-tasty-swig
		tasty_swig: {
			options: {
				extension: '.tpl'
			},
			index: {
				src: ['<%= pkg.private %>/templates/tpl/**.tpl'],
				dest: '<%= pkg.private %>/templates'
			}
		},

		// the awesome watch task which recognizes changes in the specified filetypes and rebuilds the project after hitting strg + s
		// https://npmjs.org/package/grunt-contrib-watch
		watch: {
			styles: {
				files: '<%= pkg.private %>/sass/**/*.scss',
				tasks: [
					'sass'
				]
			},
			scripts: {
				files: '<%= pkg.private %>/js/**/*.js',
				tasks: [
					'copy:libs',
					'copy:widgets',
					'concat',
					'clean:js'
				]
			},
			tpl: {
				files: '<%= pkg.private %>/templates/tpl/**/*.tpl',
				tasks: [
					'tasty_swig'
				]
			}
		},

		// the magical sync task executes the watch task after one of the specified file types change and reloads the browser
		// https://npmjs.org/package/grunt-browser-sync
		browserSync: {
			bsFiles: {
				src: [
					'<%= pkg.public %>/css/*.css',
					'<%= pkg.private %>/templates/*',
					'<%= pkg.public %>/js/**/*.js'
				]
			},
			options: {
				watchTask: true,
				open: 'external',
				server: {
					baseDir: cwd,
					index: '<%= pkg.private %>/templates/_modules.html'
				},
				ghostMode: {
					clicks: true,
					scroll: true,
					links: true,
					forms: true
				}
			}
		}
	});

	/**
	 * MultiTasks
	 */

		// appendAssets task
		// task for insert assets into file
	grunt.registerMultiTask('appendAssets', 'Insert JS/SCSS/HTML assets to a file', function () {
		// get all files in target folder
		var paths = grunt.file.expand(this.data.paths),
			tasks = {
				'html': 'replace:appendAssetsHTML',
				'js': 'replace:appendAssetsJS',
				'scss': 'replace:appendAssetsSCSS'
			},
			target = this.target;

		// empty tmpAssets
		pkg.tempAssets = '';

		// HTML/JS Files
		if (target === 'html' || target === 'js') {
			paths.forEach(function (path) {
				var content = grunt.file.read(path);
				pkg.tempAssets += content + "\n";

				grunt.log.writeln(['Add ' + path]);
			});

			// add start and end block
			pkg.tempAssets += this.data.startBlock;
			pkg.tempAssets += this.data.endBlock;
		}

		// SCSS Files
		if (target === 'scss') {

			// add start block
			pkg.tempAssets += this.data.startBlock;

			// for each file add import rule
			paths.forEach(function (path) {
				var lastFolder = path.lastIndexOf('\/mod\/'),
					tmpFile = path.substr(lastFolder).slice(4).split('.')[0],
					file = 'partials/mod' + tmpFile;

				pkg.tempAssets += "@import '" + file + "';\n";

				grunt.log.writeln(['Add ' + path]);
			});

			// add end block
			pkg.tempAssets += this.data.endBlock;
		}

		// start task
		grunt.task.run(tasks[target]);

	});

	// dbug task
	grunt.registerTask('dbug', 'Activate debug tools', function (n) {
		console.log("\nDEBUG MODE: " + dbug);
		// define placeholder
		var startBlock = '// --- start|bra-pb: js ---\n',
			endBlock = '// --- end|bra-pb: js ---';
		// empty tmpAssets
		pkg.tempAssets = '';
		// add or remove content from debug.js
		if (dbug) {
			var dbugFileContent = grunt.file.read(pkg.private + '/js/dbug/dbug.js');
			pkg.tempAssets += startBlock;
			pkg.tempAssets += dbugFileContent + "\n";
			pkg.tempAssets += endBlock;
		} else {
			pkg.tempAssets += startBlock;
			pkg.tempAssets += endBlock;
		}
		// start task
		grunt.task.run('replace:appendAssetsJS');
	});


	/**
	 * dev tasks
	 */
		// Tasks: Code validation and minification
	grunt.registerTask('code:compress', [
		'uglify',
		'cssmin'
	]);
	grunt.registerTask('code:validate', [
		'jslint',
		'csslint'
	]);

	// Tasks: project builder
	grunt.registerTask('default', [
		'sass',
		'tasty_swig',
		'copy:libs',
		'copy:widgets',
		'concat',
		'clean:js'
	]);
	grunt.registerTask('project:init', [
		'mkdir:project',
		'bower:boilerplate',
		'replace:project',
		'copy:libs',
		'copy:rootFiles',
		'clean:rootFiles',
		'copy:hotfixjs',
		'copy:hotfixcss',
		'clean:project',
		'default',
		'project:sync'
	]);
	grunt.registerTask('project:sync', [
		'browserSync',
		'dbug',
		'concat',
		'watch'
	]);
	grunt.registerTask('project:zip', [
		'mkdir:pack',
		'copy:packPublicFolder',
		'copy:packTemplates',
		'copy:packRootfiles',
		'replace:zip',
		'zip',
		'clean:zip'
	]);

	// Tasks: download builder
	grunt.registerTask('build:installModules', [
		'bower:install',
		'copy:scssmod',
		'build:insertAssets',
		'default',
		'clean:build',
		'project:sync'
	]);
	grunt.registerTask('build:insertAssets', [
		'appendAssets:html',
		'appendAssets:scss',
		'appendAssets:js'
	]);
};
