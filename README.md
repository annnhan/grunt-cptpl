# grunt-cptpl

grunt-cptpl使前端开发也可以像后端一样，把模板文本存放在单独的文件中（而不是放在dom节点但或者手工js拼接字符串）， 然后将其编译成javascript文件。使我们的开发工作从繁琐的dom操作和JS拼串中解放出来，提高我们的开发效率。最主要的，模板文件作为单独文件存放，可以使我们的项目代码逻辑更加清晰，更具可维护性。

grunt-cptpl支持各大主流模板引擎：artTemplate’、 Handlebars 、Hogan 、 Underscore、 juicer、 doT、 kissy、 baiduTemplate。 对于不在此列的引擎，提供了自定义编译方法接口。

#####grunt-cptpl都做了啥？

grunt-cptpl会读取每个模板文件的文本内容，用指定模板引擎的预编译方法将其包裹起来，生成一个新的javascript文件。这个javascript文件文件里面的内容，其实就是模板引擎的预编译方法调用，传入的参数为模板文件的文本内容。这样我们就有了一个编译好的模板函数，要渲染的时候把数据传给它就好了。

## 入门

这个插件需要Grunt `~0.4.4`

如果你还没有使用过[Grunt](http://gruntjs.com/), 务必阅读一下它的[入门](http://gruntjs.com/getting-started)指南, 里面介绍了如何创建一个[Grunt配置文件](http://gruntjs.com/sample-gruntfile)以及如何安装和使用grunt插件。一旦你熟悉这个过程，你可以使用如下命令安装grunt-cptpl。

```shell
npm install grunt-cptpl --save-dev
```

一旦插件被安装， 可以在Gruntfile里面添加如下代码来启用：

```js
grunt.loadNpmTasks('grunt-cptpl');
```

## 配置 "cptpl" task

### 概观
在项目的Gruntfile文件中， 有一个grunt.initConfig()方法， 在里面添加一个`cptpl`数据对象。 options为目标任务的自定义选项，选填。 files为文件列表的输出目录和对应的原文件列表。如下面代码里， `['test/html/abc.html', 'test/html/abc2.html', 'mytemplate/*']` 为原文件列表， `'tmp/'` 为输出的目录，支持通配符 `*`。

```js
grunt.initConfig({
    cptpl: {
        your_target: {
            options: {
                // 任务特定的选项放在这里
            },
            files: {
                // 目标特定的文件列表放在这里
                'tmp/': ['test/html/abc.html', 'test/html/abc2.html', 'mytemplate/*']
            }

        },
    },
});
```

### 选项

#### options.banner
Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

#### options.engine
Type: `String` ， Default value: `'handlebars'`

指定模板引擎，内置支持的模板引擎有： `'arTtemplate'` 、  `'Handlebars'` 、 `'Hogan'` 、 `'underscore'` 、 `'juicer'` 、 `'doT'` 、 `'kissy'` 、 `'baiduTemplate'`。

Example： 运行下面cptpl任务，将会把 `test/html/` 目录下的 `abc.html` 编译成 `abc.js` ， 存放在 `tmp/` 目录。

```js
cptpl: {
    test: {
        options: {
            banner: '/*BANNER*/\n',
            engine: 'dot'
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}
```

`abc.html` 和 `abc.js` 的内容如下：

```js
//abc.html中的内容：
<h1>{{title}}</h1>
<p>{{content}}</p>


//编译后，abc.js中的内容：
/*BANNER*/
;window.abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
```

#### options.context
Type: `String` ， Default value: `'window'`

指定生成的javascript文件中编译好的模板函数的上下文对象， 如果此选项的值为 `'{AMD}'`，则把编译好的模板函数包装成一个AMD模块，如果此选项的值为 `'{CMD}'`， 则把编译好的模板函数包装成一个CMD模块。

Example：

```js
cptpl: {
    test: {
        options: {
            engine: 'dot',
            context: 'myObj'
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// context: 'myObj'
// abc.js ==>
;myObj.abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');


// context: '{AMD}'
// abc.js ==>
;define(function() {
    return doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
});


// context: '{CMD}'
// abc.js ==>
;define(function(require, exports, module) {
    module.exports = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
});
```


#### options.reName
Type: `Function` ， Default value: `function (name) {return name;}`

重命名方法，接受一个参数，参数值为源文件名， 此方法的返回值将作为生成的javascript文件名，以及模板函数挂载到的上下文对象属性名。

Example： 下面代码将生成的javascript文件名前面都加上 `__`， `abc.html` 将生成 `__abc.js`。

```js
cptpl: {
    test: {
        options: {
            engine: 'dot',
            reName: function (name) {
                return '__' + name;
            }
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// __abc.js ==>
;window.__abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
```

#### options.customEngines
Type: `Object` ， Default value: `{}`

自定义模板引擎预编译包裹方法。如果内置模板引擎无法满足您，可以通过此选项设置一个你需要的模板引擎预编译包裹方法。格式为 `{name: function(t){}}`， `name`为模板引擎名， 对应的`function(t){}`就是包裹方法，接受一个参数t， t为模板文件的文本内容， 您可以拼成用编译函数包裹起来的js代码，并把包裹后的结果作为函数返回值。

Example：

```js
cptpl: {
    test: {
        options: {
            engine: 'myEngine',
            customEngines: {
                myEngine: function (t) {
                    return 'myEngine.compile(' + t + ');'
                }
            }
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// abc.js ==>
;window.abc = myEngine.compile('<h1>{{title}}</h1><p>{{content}}</p>');
```




Here is my broken English introduction
====================================

# grunt-cptpl

> Compiled template files into JavaScript files.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cptpl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cptpl');
```

## The "cptpl" task

### Overview
In your project's Gruntfile, add a section named `cptpl` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cptpl: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.banner
Type: `String` ， Default value: `''`

Javascript text files generated at the beginning of the writing, usually some javascript annotation text, such as `/*BANNER*/`

#### options.engine
Type: `String` ， Default value: `'handlebars'`

Specify a template engine, template engine has built-in support: `'arTtemplate'` , `'handlebars'` , `'hogan'` , `'underscore'` , `'juicer'` , `'dot'` , `'kissy'` , `'baidutemplate'`.

Example：

```js
cptpl: {
    test: {
        options: {
            banner: '/*BANNER*/\n',
            engine: 'dot'
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}
```

`abc.html` and `abc.js` content as：

```js
// abc.html ==>
<h1>{{title}}</h1>
<p>{{content}}</p>


// abc.js ==>
/*BANNER*/
;window.abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
```

#### options.context
Type: `String` ， Default value: `'window'`

Generated javascript file specified context object compiled template function, if the value of this option `'{AMD}'`, put the compiled template functions packed into an AMD module, if this option is `'{CMD} '`, put the compiled template functions packed into a CMD module.

Example：

```js
cptpl: {
    test: {
        options: {
            engine: 'dot',
            context: 'myObj'
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// context: 'myObj'
// abc.js ==>
;myObj.abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');


// context: '{AMD}'
// abc.js ==>
;define(function() {
    return doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
});


// context: '{CMD}'
// abc.js ==>
;define(function(require, exports, module) {
    module.exports = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
});
```


#### options.reName
Type: `Function` ， Default value: `function (name) {return name;}`

Rename method accepts one parameter, the parameter value is the name of the source file, the return value will be mounted as generated javascript file name, and the template function context object property name of this method.

Example： Before the filename following code will generate javascript are plus `__`, `abc.html` will generate `__abc.js`.

```js
cptpl: {
    test: {
        options: {
            engine: 'dot',
            reName: function (name) {
                return '__' + name;
            }
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// __abc.js ==>
;window.__abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
```

#### options.customEngines
Type: `Object` ， Default value: `{}`

Custom template engine precompiled package methods. If the engine does not meet your built-in templates, you can set this option you need a template engine precompiled package methods. The format is `{name: function (t) {}}`, `name` is the name of a template engine, the corresponding `function (t) {}` is wrapped method accepts a parameter t, t text file as a template, You can spell wrapped up with a compiled function js code, and the results after parcel as function return values.

Example：

```js
cptpl: {
    test: {
        options: {
            engine: 'myEngine',
            customEngines: {
                myEngine: function (t) {
                    return 'myEngine.compile(' + t + ');'
                }
            }
        },
        files: {
            'tmp/': ['test/html/abc.html']
        }
    }
}

// abc.js ==>
;window.abc = myEngine.compile('<h1>{{title}}</h1><p>{{content}}</p>');
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
