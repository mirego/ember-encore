// jshint node:true, camelcase:false
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['lib/initializer.js', 'lib/adapter.js', 'lib/serializer.js'],
        dest: 'dist/ember-encore.js',
      },
    },

    umd: {
      all: {
        src: 'dist/ember-encore.js',
        dest: 'dist/ember-encore.js',
        objectToExport: 'EmberEncore',
        amdModuleId: 'ember-encore',
        globalAlias: 'EmberEncore',
        deps: {}
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
          mangle: {
            except: ['EmberEncore']
          },
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

  grunt.registerTask('default', ['concat', 'umd', 'uglify:encore', 'uglify:encore_min']);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
