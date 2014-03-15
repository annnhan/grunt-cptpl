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
        hogan: function (t) {return 'Hogan.compile(\'' + t + '\');'}
    }

    grunt.registerMultiTask('cptpl', 'Compiled template files into JavaScript files', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            engine: 'hogan',
            context: 'window',
            banner: '',
            rename: function (name) {
                return name;
            }
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {

            // filte specified files.
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
                    return {
                        content: grunt.file.read(filepath),
                        name: /\/([^\/\\]+?)(\.[a-zA-z\d]+)?$/gi.exec(filepath)[1]
                    };
            });

            // ouput into js files
            src.forEach(function (item, i, src) {
                var dest = f.dest.charAt(f.dest.length-1) === '/' ? f.dest : f.dest + '/';
                var name = options.rename(item.name);
                var content = ';' + options.context + '.' + name + '=' +
                    ENGINES_MAP[options.engine](item.content
                    .replace(/\n|\r|\r\n|\t/gi, '')
                    .replace(/\"/gi, '\\\"')
                    .replace(/\'/gi, '\\\'')
                    .trim()
                );
                grunt.file.write(dest + name + '.js', content);
            });

            // Print a success message.
            grunt.log.writeln(src.length + ' files created.');
        });
    });

};
