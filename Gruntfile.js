module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		cwd = path.resolve(process.cwd(), '');

	// measures the time grunt takes to complete all tasks
	// https://www.npmjs.org/package/time-grunt
	//require('time-grunt')(grunt);

	// load only the modules that are currently needed instead of loading all modules on every build
	// https://www.npmjs.org/package/jit-grunt
	require('jit-grunt')(grunt, {
		'code:compress' : ['uglify', 'cssmin'],
		'code:validate' : ['jslint', 'csslint'],
		'images:compress' : ['svgmin', 'imagemin'],
		'sprite' : 'grunt-spritesmith',
		'project:init' : ['mkdir:project', 'unzip', 'replace:project', 'copy:libs', 'clean:project', 'default', 'project:sync'],
		'project:sync' : ['browserSync', 'watch'],
		'build:installModules' : ['bower:install', 'build:insertAssets', 'default', 'clean:build', 'project:sync'],
		'build:insertAssets' : ['appendAssets:html', 'appendAssets:scss', 'appendAssets:js'],
		'unzip' : 'grunt-zip',
		'replace' : 'grunt-text-replace',
		'bower' : 'grunt-bower-task'
	});

	pkg.folder = pkg.struct[pkg.system].folder;
	pkg.private = pkg.struct[pkg.system].private;
	pkg.public = pkg.struct[pkg.system].public;

	pkg.boilerplateFolder = pkg.build.boilerplateFolder;
	pkg.tempAssets = '';

	// Project configuration
	grunt.initConfig({
		pkg : pkg,

		// Create folder structure specified in package.json
		// https://npmjs.org/package/grunt-mkdir
		mkdir : {
			project :  {
				options : {
					create : '<%= pkg.folder %>'
				}
			}
		},

		// unzips the boilerplate in the proper folder
		// https://npmjs.org/package/grunt-zip
		'unzip' : {
			boilerplate : {
				src : '<%= pkg.boilerplateFolder %>.zip',
				dest : '<%= pkg.private %>/'
			}
		},

		// removes build folder after zipping it
		// removes the html5-boilerplate zip after unpacking it in the specified folder
		// https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			project: ['<%= pkg.boilerplateFolder %>.zip', '<%= pkg.private %>/<%= pkg.boilerplateFolder %>/', '<%= pkg.private %>/js/libs/'],
			js :  ['<%= pkg.public %>/js/global.js'],
			build: ['<%= pkg.private %>/templates/mod/**', '<%= pkg.private %>/sass/mod/**', '<%= pkg.private %>/js/mod/**']
		},

		// append assets into specific files
		// @brandung
		appendAssets: {
			html: {
				startBlock: '<!-- start|bra-pb: html -->\n',
				endBlock: '<!-- end|bra-pb: html -->',
				paths: ['<%= pkg.private %>/templates/mod/**/*.html']
			},
			scss: {
				startBlock: '// --- start|bra-pb: scss ---\n',
				endBlock: '// --- end|bra-pb: scss ---',
				paths: ['<%= pkg.private %>/sass/partials/mod/*.scss']
			},
			js: {
				startBlock: '// --- start|bra-pb: js ---\n',
				endBlock: '// --- end|bra-pb: js ---',
				paths: ['<%= pkg.private %>/js/helpers/**/*.js', '<%= pkg.private %>/js/mod/**/*.js']
			}
		},

		// replaces a placeholder for the assets path relative to the project type
		// https://npmjs.org/package/grunt-text-replace
		replace : {
			appendAssetsHTML: {
				src: ['<%= pkg.private %>/templates/_modules.html'],
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
			project : {
				src : ['<%= pkg.private %>/templates/_modules.html', '<%= pkg.private %>/js/global.js', 'bower.json'],
				overwrite : true,
				replacements : [
					{
						from : '%%public%%',
						to : pkg.public
					},
					{
						from : '%%private%%',
						to : pkg.private
					}
				]
			}
		},

		// compiles sass files using libsass (damn fast!)
		// https://www.npmjs.org/package/grunt-sass
		sass : {
			files : {
				files : {
					'<%= pkg.public %>/css/all-old-ie.css' : '<%= pkg.private %>/sass/all-old-ie.scss',
					'<%= pkg.public %>/css/main.css' : '<%= pkg.private %>/sass/main.scss'
				}
			}
		},

		// Concats specified js files in a given order
		// https://npmjs.org/package/grunt-contrib-concat
		concat : {
			dist : {
				src : ['<%= pkg.public %>/js/libs/bra/loadmodule/jquery.loadmodule.min.js', '<%= pkg.private %>/js/global.js'],
				dest : '<%= pkg.public %>/js/main.js'
			}
		},

		// Copy js files from private to public to the proper directories
		// https://www.npmjs.org/package/grunt-contrib-copy
		copy : {
			libs : {
				expand : true,
				cwd : '<%= pkg.private %>/js/libs/',
				src : '**',
				dest : '<%= pkg.public %>/js/libs/'
			},
			widgets : {
				expand : true,
				cwd : '<%= pkg.private %>/js/widgets/',
				src : '*',
				dest : '<%= pkg.public %>/js/widgets/',
				flatten : true
			},
			scssmod : {
				expand : true,
				cwd : '<%= pkg.private %>/sass/mod/',
				src : '**',
				dest : '<%= pkg.private %>/sass/partials/mod/',
				flatten : true,
				filter: 'isFile'
			}
		},

		// minify all js files (has no effect on vendor js files under js/vendor)
		// https://npmjs.org/package/grunt-contrib-uglify
		uglify : {
			options : {
				report : 'min'
			},
			global : {
				expand : true,
				cwd : '<%= pkg.public %>/js/',
				src : '*.js',
				dest : '<%= pkg.public %>/js/'
			},
			widgets : {
				expand : true,
				cwd : '<%= pkg.public %>/js/widgets/',
				src : '*.js',
				dest : '<%= pkg.public %>/js/widgets/'
			}
		},

		// minfies all stylesheets
		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin : {
			minify : {
				expand : true,
				cwd : '<%= pkg.public %>/css/',
				src : ['*.css'],
				dest : '<%= pkg.public %>/css/',
				ext : '.css',
				options : {
					report : 'min'
				}
			}
		},

		// minify svg files by deleting unnecessary attributes and whitespace
		// https://npmjs.org/package/grunt-svgmin
		svgmin : {
			options : {
				plugins : [{
					removeViewBox : true
				}]
			},
			dist : {
				files : [{
					expand : true,
					cwd : '<%= pkg.public %>/img/icons',
					src : ['*.svg'],
					dest : '<%= pkg.public %>/img/icons',
					ext : '.svg'
				}]
			}
		},

		// recompress images without loss
		// https://npmjs.org/package/grunt-contrib-imagemin
		imagemin : {
			dynamic : {
				options : {
					optimizationLevel : 3
				},
				files : [{
					expand : true,
					cwd : '<%= pkg.public %>/img',
					src : ['**/*.{png,jpg,gif}'],
					dest : '<%= pkg.public %>/img'
				}]
			}
		},

		// Creates sprites and related sass partials
		// https://www.npmjs.org/package/grunt-spritesmith
		sprite : {
			file : {
				src : '<%= pkg.public %>/img/icons/*.png',
				destImg : '<%= pkg.public %>/img/sprite-icons.png',
				destCSS : '<%= pkg.private %>/sass/partials/_sprite-icons.scss',
				imgPath : '../img/sprite-icons.png',
				algorithm : 'binary-tree',
				engine : 'pngsmith'
			}
		},

		// validates js and saves all found errors and warnings in a log file
		// https://npmjs.org/package/grunt-jslint
		jslint : {
			client : {
				src : ['<%= pkg.private %>/js/*.js', '<%= pkg.private %>/js/helpers/*.js', '<%= pkg.private %>/js/widgets/*.js'],
				directives : {
					browser : true,
					predef : ['jQuery', 'Modernizr']
				},
				options : {
					log : '<%= pkg.private %>/js/jslint.log',
					failOnError : false,
					errorsOnly : true
				}
			}
		},

		// validates css and checks for possible optimizations
		// https://npmjs.org/package/grunt-contrib-csslint
		csslint : {
			strict : {
				options : {
					import : 2
				},
				src : ['<%= pkg.public %>/css/*.css']
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
			}
		},

		// the awesome watch task which recognizes changes in the specified filetypes and rebuilds the project after hitting strg + s
		// https://npmjs.org/package/grunt-contrib-watch
		watch : {
			styles : {
				files : '<%= pkg.private %>/sass/**/*.scss',
				tasks : ['sass']
			},
			scripts : {
				files : '<%= pkg.private %>/js/**/*.js',
				tasks : ['copy', 'concat', 'clean:js']
			},
			images : {
				files : '<%= pkg.public %>/img/icons/*.png',
				tasks : ['sprite']
			}
		},

		// the magical sync task executes the watch task after one of the specified file types change and reloads the browser
		// https://npmjs.org/package/grunt-browser-sync
		browserSync : {
			bsFiles : {
				src : [
					'<%= pkg.public %>/css/*.css',
					'<%= pkg.private %>/templates/*.html',
					'<%= pkg.public %>/img/**/*',
					'<%= pkg.public %>/js/**/*.js'
				]
			},
			options : {
				watchTask : true,
				host : 'localhost',
				server: {
					baseDir : cwd,
					index : '<%= pkg.private %>/templates/_modules.html'
				},
				ghostMode : {
					clicks : true,
					scroll : true,
					links : true,
					forms : true
				}
			}
		}
	});

	// MultiTasks
	// task for insert assets into file
	grunt.registerMultiTask('appendAssets', 'Insert JS/SCSS/HTML assets to a file', function () {
		// get all files in target folder
		var paths = grunt.file.expand(this.data.paths),
			tasks = {
				'html' : 'replace:appendAssetsHTML',
				'js' : 'replace:appendAssetsJS',
				'scss' : 'replace:appendAssetsSCSS'
			},
			target = this.target;

		// empty tmpAssets
		pkg.tempAssets = '';

		// HTML/JS Files
		if (target === 'html' || target === 'js') {
			paths.forEach(function (path) {
				var content = grunt.file.read(path);
				pkg.tempAssets += content + "\n";

				grunt.log.writeln(['Add ' + path ]);
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

				grunt.log.writeln(['Add ' + path ]);
			});

			// add end block
			pkg.tempAssets += this.data.endBlock;
		}



		// start task
		grunt.task.run(tasks[target]);

	});

	// Tasks: Code validation and minification; Sprite generation and compression
	grunt.registerTask('code:compress', ['uglify', 'cssmin']);
	grunt.registerTask('code:validate', ['jslint', 'csslint']);
	grunt.registerTask('images:compress', ['svgmin', 'imagemin']);
	grunt.registerTask('images:sprite', ['sprite']);

	// Tasks: project builder
	grunt.registerTask('default', ['sass', 'copy', 'concat', 'clean:js']);
	grunt.registerTask('project:init', ['mkdir:project', 'unzip', 'replace:project', 'copy:libs', 'clean:project', 'default', 'project:sync']);
	grunt.registerTask('project:sync', ['browserSync', 'watch']);

	// Tasks: download builder
	grunt.registerTask('build:installModules', ['bower:install', 'copy:scssmod', 'build:insertAssets', 'default', 'clean:build', 'project:sync']);
	grunt.registerTask('build:insertAssets', ['appendAssets:html', 'appendAssets:scss', 'appendAssets:js']);
};
