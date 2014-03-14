module.exports = function(grunt) {
	var pkg = grunt.file.readJSON("package.json");
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
			build: {
				options: {
					create: '<%= pkg.boilerplateFolder %>'
				}
			},
			project :  {
				options : {
					create : "<%= pkg.folder %>"
				}
			}
		},

		// zip the boilerplate
		// https://npmjs.org/package/grunt-zip
		'zip': {
			widgets: {
				cwd: '<%= pkg.boilerplateFolder %>/',
				src: ['<%= pkg.boilerplateFolder %>/**/*'],
				dest: '<%= pkg.boilerplateFolder %>.zip'
			}
		},

		// unzips the boilerplate in the proper folder
		// https://npmjs.org/package/grunt-zip
		"unzip" : {
			catalog : {
				src : "<%= pkg.boilerplateFolder %>.zip",
				dest : pkg.private
			}
		},

		// removes build folder after zipping it
		// removes the html5-boilerplate zip after unpacking it in the specified folder
		// https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			build: ['<%= pkg.boilerplateFolder %>'],

			project: ['<%= pkg.boilerplateFolder %>.zip']
		},

		// append assets into specific files
		// @brandung
		appendAssets: {
			html: {
				startBlock: '<!-- start|bra-pb: html -->\n',
				endBlock: '<!-- end|bra-pb: html -->',
				paths: ['<%= pkg.boilerplateFolder %>/templates/mod/*.html']
			},
			scss: {
				startBlock: '// --- start|bra-pb: scss ---\n',
				endBlock: '// --- end|bra-pb: scss ---',
				paths: ['<%= pkg.boilerplateFolder %>/sass/mod/*.scss']
			},
			js: {
				startBlock: '// --- start|bra-pb: js ---\n',
				endBlock: '// --- end|bra-pb: js ---',
				paths: ['<%= pkg.boilerplateFolder %>/js/helpers/*.js']
			}
		},

		// replaces a placeholder for the assets path relative to the project type
		// https://npmjs.org/package/grunt-text-replace
		replace : {
			appendAssetsHTML: {
				src: ['<%= pkg.boilerplateFolder %>/templates/_modules.html'],
				overwrite: true,
				replacements: [
					{
						from: /(<!--\s(start\|bra-pb:)\s(\S*)\s-->*(\S*))(\n|\r|.)*?(<!--\s(end\|bra-pb:)\s(\S*)\s-->)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			appendAssetsSCSS: {
				src: ['<%= pkg.boilerplateFolder %>/sass/main.scss'],
				overwrite: true,
				replacements: [
					{
						from: /(\/\/\s(\S*)\s(start\|bra-pb:)\s(\S*)\s---*(\S*))(\n|\r|.)*?(\/\/\s(\S*)\s(end\|bra-pb:)\s(\S*)\s---)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			appendAssetsJS: {
				src: ['<%= pkg.boilerplateFolder %>/js/global.js'],
				overwrite: true,
				replacements: [
					{
						from: /(\/\/\s(\S*)\s(start\|bra-pb:)\s(\S*)\s---*(\S*))(\n|\r|.)*?(\/\/\s(\S*)\s(end\|bra-pb:)\s(\S*)\s---)/gi,
						to: '<%= pkg.tempAssets %>'
					}
				]
			},
			project : {
				src : ["<%= pkg.private %>/templates/_modules.html", "compass.rb"],
				overwrite : true,
				replacements : [
					{
						from : "%%public%%",
						to : pkg.public
					},
					{
						from : "%%private%%",
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
					"<%= pkg.public %>/css/all-old-ie.css" : "<%= pkg.private %>/sass/all-old-ie.scss",
					"<%= pkg.public %>/css/main.css" : "<%= pkg.private %>/sass/main.scss"
				}
			}
		},

		// Concats specified js files in a given order
		// https://npmjs.org/package/grunt-contrib-concat
		concat : {
			dist : {
				src : ["<%= pkg.private %>/js/libs/vendor/h5bp/helper.js", "<%= pkg.private %>/js/global.js"],
				dest : "<%= pkg.public %>/js/main.js"
			}
		},

		// Copy js files from private to public to the proper directories
		// https://www.npmjs.org/package/grunt-contrib-copy
		copy : {
			libs : {
				expand : true,
				cwd : "<%= pkg.private %>/js/libs/",
				src : "**",
				dest : "<%= pkg.public %>/js/libs/"
			},
			modules : {
				expand : true,
				cwd : "<%= pkg.private %>/js/mod/",
				src : "*",
				dest : "<%= pkg.public %>/js/mod/",
				flatten : true
			}
		},

		// minify all js files (has no effect on vendor js files under js/vendor)
		// https://npmjs.org/package/grunt-contrib-uglify
		uglify : {
			options : {
				report : "min"
			},
			js : {
				files : {
					"<%= pkg.public %>/js/main.js" : ["<%= pkg.public %>/js/main.js"]
				}
			}
		},

		// minfies all stylesheets
		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin : {
			minify : {
				expand : true,
				cwd : "<%= pkg.public %>/css/",
				src : ["*.css"],
				dest : "<%= pkg.public %>/css/",
				ext : ".css",
				options : {
					report : "min"
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
					cwd : "<%= pkg.public %>/img/icons",
					src : ["*.svg"],
					dest : "<%= pkg.public %>/img/icons",
					ext : ".svg"
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
					cwd : "<%= pkg.public %>/img",
					src : ["**/*.{png,jpg,gif}"],
					dest : "<%= pkg.public %>/img"
				}]
			}
		},

		// Creates sprites and related sass partials
		// https://www.npmjs.org/package/grunt-spritesmith
		sprite : {
			file : {
				src : "<%= pkg.public %>/img/icons/*.png",
				destImg : "<%= pkg.public %>/img/sprite-icons.png",
				destCSS : "<%= pkg.private %>/sass/layout/_sprite-icons.scss",
				imgPath : "../img/sprite-icons.png",
				algorithm : "binary-tree"
			}
		},

		// validates js and saves all found errors and warnings in a log file
		// https://npmjs.org/package/grunt-jslint
		jslint : {
			client : {
				src : ["<%= pkg.private %>/js/*.js"],
				directives : {
					browser : true,
					predef : ["jQuery", "Modernizr"]
				},
				options : {
					log : "<%= pkg.private %>/js/jslint.log",
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
					"import" : 2
				},
				src : ["<%= pkg.public %>/css/*.css"]
			}
		},

		// do the bower packaging stuff
		// https://www.npmjs.org/package/grunt-bower-task
		bower: {
			install: {
				options: {
					targetDir: './',
					layout: 'byType',
					cleanBowerDir: false
				}
			}
		},

		// the awesome watch task which recognizes changes in the specified filetypes and rebuilds the project after hitting strg + s
		// https://npmjs.org/package/grunt-contrib-watch
		watch : {
			styles : {
				files : [
					"<%= pkg.private %>/sass/**/*.scss"
				],
				tasks : ["sass"]
			},
			scripts : {
				files : [
					"<%= pkg.private %>/js/**/*.js"
				],
				tasks : ["concat", "copy"]
			},
			images : {
				files : [

					"<%= pkg.public %>/img/icons/*"
				],
				tasks : ["sprite"]
			}
		},

		// the magical sync task executes the watch task after one of the specified file types change and reloads the browser
		// https://npmjs.org/package/grunt-browser-sync
		browser_sync : {
			files : {
				src : [
					"<%= pkg.private %>/sass/**/*.scss",
					"<%= pkg.private %>/templates/*.html",
					"<%= pkg.public %>/img/**/*",
					"<%= pkg.public %>/js/**/*.js"
				]
			},
			options : {
				watchTask : true,
				server: {
					host : "localhost",
					baseDir : "",
					index : "<%= pkg.private %>/templates/_modules.html"
				},
				ghostMode : {
					scroll : true,
					links : true,
					forms : true
				}
			}
		}
	});

	// MultiTasks
	// task for insert assets into file
	grunt.registerMultiTask("appendAssets", "Insert JS/SCSS/HTML assets to a file", function () {
		// get all files in target folder
		var paths = grunt.file.expand(this.data.paths);
		// empty tmpAssets
		pkg.tempAssets = '';

		// HTML Files
		if (this.target === 'html') {
			// add start block
			pkg.tempAssets += this.data.startBlock;
			paths.forEach(function (path) {
				var content = grunt.file.read(path);
				pkg.tempAssets += content + '\n';
			});
			// add end block
			pkg.tempAssets += this.data.endBlock;
			// start task
			grunt.task.run('replace:appendAssetsHTML');
		}

		// JS helper Files
		if (this.target === 'js') {
			// add start block
			pkg.tempAssets += this.data.startBlock;
			paths.forEach(function (path) {
				var content = grunt.file.read(path);
				pkg.tempAssets += content + '\n\n';
			});
			// add end block
			pkg.tempAssets += this.data.endBlock;
			// start task
			grunt.task.run('replace:appendAssetsJS');
		}

		// SCSS Files
		if (this.target === 'scss') {
			// add start block
			pkg.tempAssets += this.data.startBlock;
			// for each file add import rule
			paths.forEach(function (path) {
				var lastFolder = path.lastIndexOf('/'),
					tmpFile = path.substr(lastFolder),
					tmpFile = tmpFile.slice(2),
					tmpFile = tmpFile.split('.'),
					tmpFile = tmpFile[0],
					file = 'mod/' + tmpFile;

				pkg.tempAssets += '@import "' + file + '";\n';
			});
			// add end block
			pkg.tempAssets += this.data.endBlock;
			// start task
			grunt.task.run('replace:appendAssetsSCSS');
		}

		// Print a success message.
		grunt.log.writeln('\nAdd rule: \n' + pkg.tempAssets);
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-svgmin");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-browser-sync");
	grunt.loadNpmTasks("grunt-bower-task");

	// Tasks
	grunt.registerTask("code:compress", ["uglify", "cssmin"]);
	grunt.registerTask("code:validate", ["jslint", "csslint"]);
	grunt.registerTask("images:compress", ["svgmin", "imagemin"]);
	grunt.registerTask("images:sprite", ["sprite"]);

	// Tasks: project builder
	grunt.registerTask("default", ["sass", "concat", "copy"]);
	grunt.registerTask("project:init", ["mkdir:project", "unzip", "replace:project", "clean:project"]);
	grunt.registerTask("project:sync", ["browser_sync", "watch"]);

	// Tasks: download builder
	grunt.registerTask('build', ['mkdir:build', 'build:getModules', 'build:insertAssets', 'build:zip']);
	grunt.registerTask('build:getModules', ['bower:install']);
	grunt.registerTask('build:insertAssets', ['appendAssets:html', 'appendAssets:scss', 'appendAssets:js']);
	grunt.registerTask('build:zip', ['zip', 'clean:build']);
};
