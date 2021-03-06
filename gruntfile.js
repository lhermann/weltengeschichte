module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			dev: ["dev/css/fonts"],
			build: ["build/**/*", "!build/VERSION"],
			cleanup: [".grunt/"]
		},
		copy: {
			dev: {
				expand: true,
				cwd: "node_modules/bootstrap-sass/assets/fonts/bootstrap/",
				src: "**",
				dest: "dev/css/fonts/"
			},
			build: {
				expand: true,
				cwd: "dev",
				src: ["*", "css/fonts/**", "img/**"],
				dest: "build/",
				filter: "isFile"
			}
		},
		concat: {
			build: {
				src: [
					"dev/js/jquery-3.3.1.slim.min.js",
					"dev/js/spambotscare-1.0.0.js",
					"node_modules/bootstrap-sass/assets/javascripts/bootstrap.js"
					// "node_modules/flipclock/compiled/flipclock.js",
					// "dev/js/eventsobject.js",
					// "dev/js/script.js",
					// "dev/js/jquery.validate.min.js",
					// "dev/js/messages_de.min.js",
					// "dev/js/ajaxform.js"
				],
				dest: ".grunt/js/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				banner:
					'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: ".grunt/js/<%= pkg.name %>.js",
				dest: "build/js/<%= pkg.name %>.min.js"
			}
		},
		compass: {
			dev: {
				options: {
					bundleExec: true,
					sassDir: "dev/scss",
					cssDir: "dev/css"
				}
			},
			build: {
				options: {
					bundleExec: true,
					sassDir: "dev/scss",
					cssDir: "build/css",
					environment: "production"
				}
			}
		},
		filerev: {
			build: {
				src: [
					"build/img/*.{jpg,jpeg,gif,png,webp}",
					"!build/img/weltengeschichte-preview.jpg",
					"!build/img/weltengeschichte-video-preview.jpg",
					"build/css/*.css",
					"build/js/weltengeschichte.min.js"
				]
			}
		},
		useminPrepare: {
			html: "dev/teaser.html",
			options: {
				dest: "build"
			}
		},
		usemin: {
			html: ["build/*.html"],
			css: "build/css/**.css"
		},
		imagemin: {
			compressdev: {
				files: [
					{
						expand: true,
						cwd: "dev/img/",
						src: ["**/*.{png,jpg,gif}"],
						dest: "dev/img/"
					}
				]
			}
		},
		json: {
			main: {
				src: ["dev/events.json"],
				dest: "dev/js/eventsobject.js"
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-usemin");
	grunt.loadNpmTasks("grunt-filerev");
	grunt.loadNpmTasks("grunt-newer");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-json");

	// Tasks.
	grunt.registerTask("dev", "Set up dev environment", [
		"clean:dev",
		"copy:dev",
		"compass:dev",
		"json"
	]);
	grunt.registerTask("compress", "Compress images", [
		"newer:imagemin:compressdev"
	]);
	grunt.registerTask("build", "Build the website into the build/ filder", [
		"clean:build",
		"copy:build",
		"useminPrepare",
		"json",
		"concat:build",
		"uglify:build",
		"compass:build",
		"filerev",
		"usemin",
		"clean:cleanup"
	]);
	grunt.registerTask("js", "Just update weltengeschichte.2.min.js", [
		"concat:build",
		"uglify:build"
	]);
	// grunt.registerTask('deploy',    'Deploy the website',                       customDeployTask);

	// function customDeployTask() {
	// 	grunt.task.run('build');
	// 	grunt.task.run('copy:deploy');
	// }
};
