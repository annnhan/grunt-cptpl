/*
 * grunt-cptpl
 * https://github.com/hanan198501/grunt-cptpl
 *
 * Copyright (c) 2014 hanan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var ENGINES_MAP = {
        hogan: function (t) {
            return 'Hogan.compile(' + t + ');';
        },

        handlebars: function (t) {
            return 'Handlebars.compile(' + t + ');';
        },

        arttemplate: function (t) {
            return 'template.compile(' + t + ');';
        },

        underscore: function (t) {
            return '_.template(' + t + ');';
        },

        juicer: function (t) {
            return 'juicer(' + t + ');';
        },

        dot: function (t) {
            return 'doT.template(' + t + ');';
        },

        kissy: function (t) {
            return 'KISSY.Template(' + t + ');';
        },

        baidutemplate: function (t) {
            return 'baidu.template(' + t + ');';
        }
    };

    var ln = grunt.util.normalizelf('\n');
    var fileNameReg = /\/([^\/\\]+?)(\.[a-zA-z\d]+)?$/gi;

    grunt.registerMultiTask('cptpl', 'Compiled template files into JavaScript files', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            banner: '',
            engine: 'handlebars',
            context: 'window',
            reName: function (name) {return name;},
            customEngines: {}
        });

        for(var key in options.customEngines){
            ENGINES_MAP[key.toLowerCase()] = options.customEngines[key];
        }

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {

            // Filte specified files.
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                    // Read file source.
                    var name = filepath.replace('\\', '\/')
                        .split('\/')
                        .pop()
                        .replace(/\..*$/, '');
                    var content = grunt.util.normalizelf(grunt.file.read(filepath))
                        .split(ln)
                        .map(function (line) {return line.trim();})
                        .join('')
                        .replace(/\"/gi, '\\\"')
                        .replace(/\'/gi, '\\\'')
                        .trim();

                    name = options.reName(name);

                    var start, end;
                    content = ENGINES_MAP[options.engine.toLowerCase()]('\'' + content + '\'');

                    switch (options.context){
                        case '{AMD}':
                            start = ';define(function() {' + ln + '    return ';
                            end   = ln + '})';
                            break;
                        case '{CMD}':
                            start = ';define(function(require, exports, module) {' + ln + '    module.exports = ';
                            end   = ln + '})';
                            break;
                        default:
                            start = ';' + options.context + '.' + name + ' = ';
                            end   = '';
                    }
                    content = options.banner + start + content + end;

                    return {name: name,content: content};
            });

            var dest = f.dest;
            if (endsWith(dest, ".js")) {

                grunt.file.write(dest, src.map(function (item, i, src) {
                    return item.content;
                }).join(ln + ln));

                grunt.log.writeln(dest + ' created.');

            } else {
                dest = dest.charAt(dest.length-1) === '/' ? dest : dest + '/';
                // Ouput into js files
                src.forEach(function (item, i, src) {
                    grunt.file.write(dest + item.name + '.js', item.content);
                });

                // Print a success message.
                grunt.log.writeln(src.length + ' files created.');
            }
        });
    });

    function endsWith(str, suffix) {
        var index = str.length - suffix.length;
        return index >= 0 && str.indexOf(suffix, index) == index;
    }
};
