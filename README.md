# grunt-cptpl
grunt-cptpl插件可以将您的文本模板文件编译成javascript文件。在前端开发的时候，模板文本我们一般存放在一个隐藏dom节点，再通过javascript去获取这个节点的内容，将其编译。或者在写javascript的时候，我们手动通过拼接字符串的方式储存模板文本。
grunt-cptpl使前端开发也可以像后端一样，把模板文本存放在单独的文件中，使我们的开发工作从繁琐的dom操作和拼串中解放出来，大大提高我们的工作效率。最主要的，模板文件作为单独文件存放，可以使我们的项目代码逻辑更加清晰，更具可维护性。

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
在项目的Gruntfile文件中， 有一个grunt.initConfig()方法， 在里面添加一个`cptpl`数据对象。 options为目标任务的自定义选项，选填。 files为文件列表的输出目录和对应的原文件列表。如下面代码里， `['test/html/abc.html', 'test/html/abc2.html'， 'mytemplate/*']` 为原文件列表， `'tmp/'` 为输出的目录，支持通配符 `*`。

```js
grunt.initConfig({
    cptpl: {
        your_target: {
            options: {
                // 任务特定的选项放在这里
            },
            files: {
                // 目标特定的文件列表放在这里
                'tmp/': ['test/html/abc.html', 'test/html/abc2.html'， 'mytemplate/*']
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

指定模板引擎，内置支持的模板引擎有（注意要小写）： `'handlebars'` 、 `'hogan'` 、 `'underscore'` 、 `'juicer'` 、 `'dot'` 、 `'kissy'` 、 `'baidutemplate'`。

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


#### options.banner
Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

#### options.banner
Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

#### options.banner
Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

#### options.banner
Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  cptpl: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  cptpl: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

====================================

Here is my broken English introduction

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

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  cptpl: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  cptpl: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_