module.exports = function(grunt) {
	var pkg = grunt.file.readJSON("package.json");
    pkg.folder = pkg.struct[pkg.system].folder;
    pkg.private = pkg.struct[pkg.system].private;
    pkg.public = pkg.struct[pkg.system].public;

	// Project configuration
	grunt.initConfig({
		pkg : pkg,
		// Create folder structure specified in package.json
		// https://npmjs.org/package/grunt-mkdir
		mkdir : {
			all :  {
				options : {
					create : "<%= pkg.folder %>"
				}
			}
		},
        // unzips the boilerplate in the proper folder
        // https://npmjs.org/package/grunt-zip
        "unzip" : {
            catalog : {
                src : "html5-boilerplate.zip",
                dest : pkg.private
            }
        },
        // removes the html5-boilerplate zip after unpacking it in the specified folder
        // https://npmjs.org/package/grunt-remove
        remove : {
        	fileList : ["html5-boilerplate.zip"]
        },
        // replaces a placeholder for the assets path relative to the project type
        // https://npmjs.org/package/grunt-text-replace
        replace : {
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
		// do the compass magic (actually just loads the compass config in compass.rb)
		// https://npmjs.org/package/grunt-contrib-compass
		compass : {
			compile : {
				options : {
					config : "compass.rb"
				}
			}
		},
		// Concats specified js files in a given order
		// https://npmjs.org/package/grunt-contrib-concat
		concat : {
			dist : {
				src : ["<%= pkg.private %>/js/vendor/jquery/*.js", "<%= pkg.private %>/js/vendor/modernizr/*.js", "<%= pkg.private %>/js/*.js"],
				dest : "<%= pkg.public %>/js/main.js"
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
		// the awesome watch task which recognizes changes in the specified filetypes and rebuilds the project after hitting strg + s
		// https://npmjs.org/package/grunt-contrib-watch
		watch : {
			scripts : {
				files : [
					"<%= pkg.private %>/sass/**/*.scss",
					"<%= pkg.private %>/js/*.js",
					"<%= pkg.public %>/img/**/*"
				],
				tasks : ["compass", "concat"]
			}
		},
		// the magical sync task executes the watch task after one of the specified file types change and reloads the browser
		// https://npmjs.org/package/grunt-browser-sync
		browser_sync : {
			files : {
				src : [
					"<%= pkg.private %>/sass/**/*.scss",
					"<%= pkg.public %>/js/**/*.js",
					"<%= pkg.public %>/img/**/*",
					"<%= pkg.private %>/templates/*.html"
				]
			},
			options : {
				watchTask : true,
				server: {
					host : "localhost",
					baseDir : ""
				},
				ghostMode : {
					scroll : true,
					links : true,
					forms : true
				}
			}
		},
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-remove');
    grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-svgmin");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-browser-sync");

    // Tasks
    grunt.registerTask("default", ["compass", "concat"]);
    grunt.registerTask("new:project", ["mkdir", "unzip", "replace", "remove"]);
    //grunt.registerTask("compress:images", ["svgmin", "imagemin"]);
    //grunt.registerTask("compress:code", ["uglify"]);
    grunt.registerTask("check:code", ["jslint", "csslint"]);
	grunt.registerTask("sync", ["browser_sync", "watch"]);
	grunt.registerTask("finish", ["svgmin", "imagemin", "uglify"]);

    //grunt.registerTask("bower:install", ["bower-install"]);
};
