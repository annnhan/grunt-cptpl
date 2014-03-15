/*
 * grunt-cptpl
 * https://github.com/hanan198501/grunt-cptpl
 *
 * Copyright (c) 2014 hanan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        cptpl: {
            test1: {
                options: {
                },
                src: ['test/fixtures/testing', 'test/fixtures/abc.html'],
                dest: 'tmp/test1/'
            },
            test2: {
                options: {
                    rename: function(name){return '_' + name;},
                    banner: '/*BANNER*/\n',
                    context: 'CMD',
                    engine: 'myEngine',
                    addEngines: {
                        myEngine: function (t) {
                            return 'myEngine.compile(\'' + t + '\');'
                        }
                    }
                },
                files: {
                    'tmp/test2/': ['test/fixtures/*']
                }
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'cptpl']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);

};
