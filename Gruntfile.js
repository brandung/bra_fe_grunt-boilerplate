module.exports = function (grunt) {
	var pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		target = grunt.option('target') || '',
		cwd = path.resolve(process.cwd(), ''),
		component = grunt.option('name') || '',
		user = process.env['USERPROFILE'].split(path.sep)[2];

	// measures the time grunt takes to complete all tasks
	// https://www.npmjs.org/package/time-grunt
	require('time-grunt')(grunt);

	// load only the modules that are currently needed instead of loading all modules on every build
	// https://www.npmjs.org/package/jit-grunt
	require('jit-grunt')(grunt, {
		'bower': 'grunt-bower-task',
		'replace': 'grunt-text-replace'
	});

	pkg.folder = pkg.struct[pkg.system].folder;
	pkg.private = pkg.struct[pkg.system].private;
	pkg.public = pkg.struct[pkg.system].public;

	if (target) {
		pkg.private += '/' + target;
		pkg.public += '/' + target;
	}

	pkg.zipPublicFolder = pkg.name + '/' + pkg.public;

	//pkg.boilerplateFolder = pkg.build.boilerplateFolder;
	pkg.tempAssets = '';

	// Project configuration
	grunt.initConfig({
		pkg: pkg,

		// Create folder structure specified in package.json
		// https://npmjs.org/package/grunt-mkdir
		mkdir: {
			projectStructure: { // create initial folder structure
				options: {
					create: '<%= pkg.folder %>'
				}
			},
			zipFolder: {
				options: {
					create: [pkg.zipPublicFolder]
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
			rootFilesInPrivateFolder: [
				'<%= pkg.private %>/README.md',
				'<%= pkg.private %>/LICENSE',
				'<%= pkg.private %>/.gitignore',
				'<%= pkg.private %>/.bower.json',
				'<%= pkg.private %>/js/libs/',
				'<%= pkg.private %>/hotfix.js',
				'<%= pkg.private %>/hotfix.css',
				'hotfix.js',
				'hotfix.css'
			],
			globalJsInPublicFolder: [
				'<%= pkg.public %>/js/global.js'
			],
			// todo refactor
			/*build: [
			 '<%= pkg.private %>/templates/mod/**',
			 '<%= pkg.private %>/sass/mod/**',
			 '<%= pkg.private %>/js/mod/**'
			 ],*/
			privateRootFiles: [
				'<%= pkg.private %>/apple-touch-icon-precomposed.png',
				'<%= pkg.private %>/favicon.ico',
				'<%= pkg.private %>/tile.png',
				'<%= pkg.private %>/tile-wide.png',
				'<%= pkg.private %>/.htaccess',
				'<%= pkg.private %>/browserconfig.xml',
				'<%= pkg.private %>/robots.txt'
			],
			zipTplFolder: [
				'<%= pkg.name %>/tpl/'
			],
			zipFolder: [
				'<%= pkg.name %>'
			]
		},

		// append assets into specific files
		// @brandung
		// TODO refactor
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

		// creates files
		// https://www.npmjs.com/package/grunt-file-creator
		'file-creator': {
			componentFiles: [
				{
					file: '<%= pkg.private %>/sass/component/' + component + '.scss',
					method: function (fs, fd, done) {
						var date = new Date(),
							content = "@charset \"utf-8\";\n" +
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
					file: '<%= pkg.private %>/templates/tpl/partials/component/' + component + '.tpl',
					method: function (fs, fd, done) {
						var date = new Date();
						content = "<!--\n" +
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
			],
			viewFiles: [
				{
					file: '<%= pkg.private %>/templates/tpl/partials/views/' + component + '.tpl',
					method: function (fs, fd, done) {
						var date = new Date();
						content = "<!--\n" +
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
		},

		// replaces a placeholder for the assets path relative to the project type
		// https://npmjs.org/package/grunt-text-replace
		replace: {
			/*appendAssetsHTML: {
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
			 },*/
			pathPlaceholder: {
				src: [
					'<%= pkg.private %>/templates/tpl/**/*.tpl',
					'<%= pkg.private %>/js/global.js',
					//'<%= pkg.private %>/js/dbug/dbug.js',
					'<%= pkg.private %>/sass/**/*.*',
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
			zipFolderAssetPath: {
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
			},
			importJsStorageKey: {
				src: [
					'<%= pkg.public %>/js/main.js'
				],
				overwrite: true,
				replacements: [
					{
						from: /<@unique@>/g,
						to: (new Date().getTime() + new Date().getTime())
					}
				]
			},
			deleteCssBlock: {
				src: [
					'<%= pkg.public %>/css/*.css',
					'<%= pkg.public %>/css/component/*.css'
				],
				overwrite: true,
				replacements: [
					{
						from: /\/\*\s?<@delete*(\S*)(\n|\r|.)*?\s?delete@>\s?\*\//igm,
						to: ''
					}
				]
			},
			deleteJsBlock: {
				src: [
					'<%= pkg.public %>/js/*.js',
					'<%= pkg.public %>/js/plugin/*.js',
					'<%= pkg.public %>/js/handler/*.js',
					'<%= pkg.public %>/js/component/*.js',
					'<%= pkg.public %>/js/function/*.js'
				],
				overwrite: true,
				replacements: [
					{
						from: /\/\/\s?<@delete*(\S*)(\n|\r|.)*?\/\/\s?delete@>/igm,
						to: ''
					}
				]
			},
			addNewComponentImport: {
				src: [
					'<%= pkg.private %>/js/global.js'
				],
				overwrite: true,
				replacements: [
					{
						from: /\/\/\s?<@newComponent@>/ig,
						to: ",\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tcondition: $('." + component + "'),\n\t\t\t\t\t\t\tfetch: [\n\t\t\t\t\t\t\t\tBrandung.GlobalVars.folderPath + 'css/component/" + component + ".css'\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\tunique: Brandung.Util.getUnique()\n\t\t\t\t\t\t}// <@newComponent@>"
					}
				]
			},
			includeSwigComponentPartial: {
				src: [
					'<%= pkg.private %>/templates/tpl/_modules.tpl'
				],
				overwrite: true,
				replacements: [
					{
						from: /<!--\s?<@newComponent@>\s?-->/ig,
						to: "<h3 class=\"mod-headline\">" +
						component.charAt(0).toUpperCase() + component.slice(1) +
						"</h3>\n" +
						"\t\t\t{% include \"./partials/component/" + component.toString() + ".tpl\" %} \n\n" +
						"\t\t\t<!-- <@newComponent@> -->"
					}
				]
			},
			includeSwigViewPartial: {
				src: [
					'<%= pkg.private %>/templates/tpl/_modules.tpl'
				],
				overwrite: true,
				replacements: [
					{
						from: /<!--\s?<@newView@>\s?-->/ig,
						to: "<h3 class=\"mod-headline\">" +
						component.charAt(0).toUpperCase() + component.slice(1) +
						"</h3>\n" +
						"\t\t\t{% include \"./partials/views/" + component.toString() + ".tpl\" %} \n\n" +
						"\t\t\t<!-- <@newView@> -->"
					}
				]
			}
		},

		// compiles sass files using libsass (damn fast!)
		// https://www.npmjs.org/package/grunt-sass
		sass: {
			files: {
				expand: true,
				cwd: '<%= pkg.private %>/sass',
				src: ['**/*.scss'],
				dest: '<%= pkg.public %>/css',
				ext: '.css'
			}
		},

		// Concats specified js files in a given order
		// https://npmjs.org/package/grunt-contrib-concat
		concat: {
			mainJs: {
				src: [
					'<%= pkg.public %>/js/libs/vendor/basket/basket.full.custom.min.js',
					'<%= pkg.private %>/js/global.js'
				],
				dest: '<%= pkg.public %>/js/main.js'
			}
		},

		// Copy js files from private to public to the proper directories
		// https://www.npmjs.org/package/grunt-contrib-copy
		copy: {
			privateLibsToPublicFolder: {
				expand: true,
				cwd: '<%= pkg.private %>/js/libs/',
				src: '**',
				dest: '<%= pkg.public %>/js/libs/'
			},
			privatePluginToPublicFolder: {
				expand: true,
				cwd: '<%= pkg.private %>/js/plugin/',
				src: '*',
				dest: '<%= pkg.public %>/js/plugin/',
				flatten: true
			},
			privateHandlerToPublicFolder: {
				expand: true,
				cwd: '<%= pkg.private %>/js/handler/',
				src: '*',
				dest: '<%= pkg.public %>/js/handler/',
				flatten: true
			},
			'privateFunctionToPublicFolder': {
				expand: true,
				cwd: '<%= pkg.private %>/js/function/',
				src: '*',
				dest: '<%= pkg.public %>/js/function/',
				flatten: true
			},
			privateComponentToPublicFolder: {
				expand: true,
				cwd: '<%= pkg.private %>/js/component/',
				src: '*',
				dest: '<%= pkg.public %>/js/component/',
				flatten: true
			},
			privateRootFilesToRoot: {
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
			hotfixjsToPublicFolder: {
				expand: true,
				cwd: './',
				src: 'hotfix.js',
				dest: '<%= pkg.public %>/js/',
				flatten: true
			},
			hotfixcssToPublicFolder: {
				expand: true,
				cwd: './',
				src: 'hotfix.css',
				dest: '<%= pkg.public %>/css/',
				flatten: true
			},
			publicFolderToZipFolder: {
				expand: true,
				cwd: '<%= pkg.public %>/',
				src: '**',
				dest: '<%= pkg.zipPublicFolder %>/'
			},
			templatesToZipFolder: {
				expand: true,
				cwd: '<%= pkg.private %>/templates/',
				src: '**',
				dest: '<%= pkg.name %>/'
			},
			rootFilesToZipFolder: {
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
				report: 'min',
				screwIE8: true,
				banner: "/**\n" +
				" * Copyright brandung GmbH & Co.KG\n" +
				" * http://www.brandung.de/\n" +
				" *\n" +
				" * Date: " + new Date().toISOString().substring(0, 10) + "\n" +
				" * MIT License (MIT)\n" +
				" */"
			},
			global: {
				expand: true,
				cwd: '<%= pkg.public %>/js/',
				src: '**/*.js',
				dest: '<%= pkg.public %>/js/'
			}
		},

		// minfies all stylesheets
		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= pkg.public %>/css/',
				src: [
					'**/*.css'
				],
				dest: '<%= pkg.public %>/css/',
				ext: '.css',
				options: {
					report: 'min'
				}
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
			fetchHtmlBoilerplate: {
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

		// swig template engine plugin
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
					'sass',
					'sassToHtml'
				]
			},
			scripts: {
				files: '<%= pkg.private %>/js/**/*.js',
				tasks: [
					'copy:privateHandlerToPublicFolderandler',
					'copy:privateHandlerToPublicFolder',
					'copy:privateFunctionToPublicFolder',
					'copy:privateComponentToPublicFolder',
					'concat:mainJs',
					'clean:globalJsInPublicFolder'
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
				notify: false,
				injectChanges: false,
				reloadDelay: 1000,
				port: 443,
				tunnel: user,
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
		// TODO refactor
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

	grunt.registerTask('sassToHtml', 'Creating markup out of sass variables', function (n) {
		var variablesFile = grunt.file.read(pkg.private + '/sass/partials/_variables.scss'),
			getMarkup = function (type) {
				var typeObj = {
						colors: {
							blockRegex: /\/\*\s?<@colors*(\S*)(\n|\r|.)*?\s?colors@>\s?\*\//igm,
							mapItemRegex: /\'([a-z0-9]-*)+\':\s?#[a-fA-F0-9]{3,6}/g,
							html: function (key, value) {
								return "\t<div class='col-xs-2'>\n" +
									"\t\t<div style='background: " + value + "; padding: 15px; width: 100%; border: solid 1px black; height: 100px;'>" +
									"\t\t</div>\n" +
									"\t\t<b>" + key + ":</b> " + value + "\n" +
									"\t</div>\n";
							}
						},
						icons: {
							blockRegex: /\/\*\s?<@icons*(\S*)(\n|\r|.)*?\s?icons@>\s?\*\//igm,
							mapItemRegex: /([a-zA-Z0-9]-*)+:\s?('|")\\[a-z0-9]+('|")/g,
							html: function (key, value) {
								return "\t<div class='col-xs-2'>\n" +
									"\t\t<div class='icon-before icon-" + key + "' style='text-align:center; font-family: \"icomoon\"; padding: 15px; width: 100%; border: solid 1px black; height: 75px; color: black; line-height:40px; font-size:40px;'>" +
									"\t\t</div>\n" +
									"\t\t<b>.icon-" + key + ":</b> " + value + "\n" +
									"\t</div>\n";
							}
						},
						breakpoints: {
							blockRegex: /\/\*\s?<@breakpoints*(\S*)(\n|\r|.)*?\s?breakpoints@>\s?\*\//igm,
							mapItemRegex: /\$([a-zA-Z0-9]-*)+:\s?[0-9]{3,4}/g,
							html: function (key, value) {
								key = key.toUpperCase();
								key = key.replace('$', '');

								return "<div style='width: " + value + "px; background: black; box-sizing: border-box; padding: 0 15px; height:40px; line-height: 40px; color:white; margin-bottom: 20px;'>" + key + "<span class='util-right'>" + value + "px</span></div>\n";
							}
						}
					},
					html = '',
					count = 0,
					map,
					string;

				map = variablesFile.match(typeObj[type].blockRegex)[0];
				map = map.match(typeObj[type].mapItemRegex);

				if(type === 'colors' || type === 'icons') {
					html =  "<div class='row'>\n";
				}

				for(var i = 0, len = map.length; i < len; i += 1) {
					string = map[i].replace(/\s/g, '');
					string = string.split(':');

					html += typeObj[type].html(string[0], string[1]);

					count += 1;

					if(count === 6) {
						if(type === 'colors' || type === 'icons') {
							html +=  "</div>\n<div class='row'>\n";
						}

						count = 0;
					}
				}

				if(type === 'colors' || type === 'icons') {
					html +=  "</div>";
				}

				return html;
			};

		console.log('sassToHtml: Updating colors.tpl');
		console.log('sassToHtml: Updating icons.tpl');
		console.log('sassToHtml: Updating breakpoints.tpl');

		grunt.file.write(pkg.private + '/templates/tpl/partials/colors.tpl', getMarkup('colors'));
		grunt.file.write(pkg.private + '/templates/tpl/partials/icons.tpl', getMarkup('icons'));
		grunt.file.write(pkg.private + '/templates/tpl/partials/breakpoints.tpl', getMarkup('breakpoints'));
	});

	/**
	 * dev tasks
	 */
	grunt.loadNpmTasks('grunt-notify');

	// Tasks: project builder
	grunt.registerTask('default', [
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
	grunt.registerTask('project:init', [
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
	grunt.registerTask('project:server', [
		'default',
		'browserSync',
		'watch'
	]);
	grunt.registerTask('project:deploy', [
		'default',
		'replace:deleteCssBlock',
		'replace:importJsStorageKey',
		'replace:deleteJsBlock',
		'code:compress'
	]);

	grunt.registerTask('create:zip', [
		'mkdir:zipFolder',
		'copy:publicFolderToZipFolder',
		'copy:templatesToZipFolder',
		'copy:rootFilesToZipFolder',
		'replace:zipFolderAssetPath',
		'clean:zipTplFolder',
		'zip',
		'clean:zipFolder'
	]);
	grunt.registerTask('create:styleguide', [
		'sassToHtml'
	]);
	grunt.registerTask('create:component', [
		'file-creator:componentFiles',
		'replace:addNewComponentImport',
		'replace:includeSwigComponentPartial',
		'project:server'
	]);
	grunt.registerTask('create:view', [
		'file-creator:viewFiles',
		'replace:includeSwigViewPartial',
		'project:server'
	]);

	// Tasks: download builder
	// TODO refactor
	/*grunt.registerTask('build:installModules', [
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
	 ]);*/
};
