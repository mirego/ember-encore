// jshint node:true, camelcase:false
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['tmp', 'dist'],

    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'lib/',
          src: ['**/*.js'],
          dest: 'tmp/'
        }],

        moduleName: function(moduleName) {
          return 'ember-encore/' + moduleName;
        }
      }
    },

    concat: {
      main: {
        src: ['tmp/**/*.js'],
        dest: 'dist/ember-encore.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * http://github.com/mirego/ember-encore\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> Mirego <http://mirego.com>;\n' +
                ' * Licensed under the New BSD license */\n\n'
      },
      encore: {
        options: {
          beautify: {
            indent_level: 2,
            space_colon: true,
            beautify: true
          },
          mangle: false,
          compress: false
        },
        files: {
          'dist/ember-encore.js': ['dist/ember-encore.js']
        }
      },
      encore_min: {
        options: {
          compress: {
            drop_console: true
          }
        },
        files: {
          'dist/ember-encore.min.js': ['dist/ember-encore.js']
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'transpile', 'concat', 'uglify:encore', 'uglify:encore_min']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
