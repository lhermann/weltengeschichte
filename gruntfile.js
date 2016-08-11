module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dev: ['dev/css/fonts'],
      build: ["build/**"],
      cleanup: ['.grunt/']
    },
    copy: {
      dev: {
        expand: true,
        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/',
        src: '**',
        dest: 'dev/css/fonts/'
      },
      build: {
        expand: true,
        cwd: 'dev',
        src: ['*', 'css/fonts/**', 'img/**'],
        dest: 'build/',
        filter: 'isFile'
      },
      deploy: {
        expand: true,
        cwd: 'build',
        src: '**',
        dest: '../weltengeschichte.de/test/'
      }
    },
    concat: {
      build: {
            src: [
              'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
              'node_modules/flipclock/compiled/flipclock.js',
              'dev/js/eventsobject.js',
              'dev/js/script.js'
            ],
            dest: '.grunt/js/<%= pkg.name %>.js',
          },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '.grunt/js/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'dev/scss',
          cssDir: 'dev/css'
        }
      },
      build: {
        options: {
          sassDir: 'dev/scss',
          cssDir: 'build/css',
          environment: 'production'
        }
      }
    },
    filerev: {
      build: {
        src: [
          'build/img/*.{jpg,jpeg,gif,png,webp}',
          'build/css/*.css'
        ]
      }
    },
    useminPrepare: {
      html: 'dev/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: ['build/index.html', 'build/impressum.html', 'build/datenschutz.html'],
      css: 'build/css/**.css'
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');

  // Tasks.
  grunt.registerTask('dev', 'Set up dev environment', ['clean:dev', 'copy:dev', 'compass:dev']);
  grunt.registerTask('build', 'Build the website into the build/ filder', ['clean:build', 'copy:build', 'useminPrepare', 'concat:build', 'uglify:build', 'compass:build', 'filerev', 'usemin', 'clean:cleanup']);
  grunt.registerTask('deploy', 'Deploy the website', customDeployTask);

  function customDeployTask() {
    grunt.task.run('build');
    grunt.task.run('copy:deploy');
  }

};
