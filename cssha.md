#### view on Github：https://github.com/hanan198501/grunt-cptpl

grunt-cptpl插件可以将您的文本模板文件编译成javascript文件。在前端开发的时候，模板文本我们一般存放在一个隐藏dom节点，再通过javascript去获取这个节点的内容，将其编译。或者在写javascript的时候，我们手动通过拼接字符串的方式储存模板文本。grunt-cptpl使前端开发也可以像后端一样，把模板文本存放在单独的文件中，使我们的开发工作从繁琐的dom操作和拼串中解放出来，提高我们的开发效率。最主要的，模板文件作为单独文件存放，可以使我们的项目代码逻辑更加清晰，更具可维护性。

##### grunt-cptpl都做了啥？

grunt-cptpl会读取每个模板文件的文本内容，用指定模板引擎的预编译方法将其包裹起来，生成一个新的javascript文件。这个javascript文件文件里面的内容，其实就是模板引擎的预编译方法调用，传入的参数为模板文件的文本内容。这样我们就有了一个编译好的模板函数，要渲染的时候把数据传给它就好了。

<!--more-->

## 入门

这个插件需要Grunt `~0.4.4`

如果你还没有使用过[Grunt][1], 务必阅读一下它的[入门][2]指南, 里面介绍了如何创建一个[Grunt配置文件][3]以及如何安装和使用grunt插件。一旦你熟悉这个过程，你可以使用如下命令安装grunt-cptpl。

<pre lang="javascript" line="1">npm install grunt-cptpl --save-dev
</pre>

一旦插件被安装， 可以在Gruntfile里面添加如下代码来启用：

<pre lang="javascript" line="1">grunt.loadNpmTasks('grunt-cptpl');
</pre>

## 配置 "cptpl" task

### 概观

在项目的Gruntfile文件中， 有一个grunt.initConfig()方法， 在里面添加一个`cptpl`数据对象。 options为目标任务的自定义选项，选填。 files为文件列表的输出目录和对应的原文件列表。如下面代码里， `['test/html/abc.html', 'test/html/abc2.html'， 'mytemplate/*']` 为原文件列表， `'tmp/'` 为输出的目录，支持通配符 `*`。

<pre lang="javascript" line="1">grunt.initConfig({
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
</pre>

### 选项

#### options.banner

Type: `String` ， Default value: `''`

在生成的javascript文件开头写入的文本信息，通常为一段javascript注释文字，如 `/*BANNER*/`

#### options.engine

Type: `String` ， Default value: `'handlebars'`

指定模板引擎，内置支持的模板引擎有（不区分大小写）： `'arTtemplate'` 、 `'handlebars'` 、 `'hogan'` 、 `'underscore'` 、 `'juicer'` 、 `'dot'` 、 `'kissy'` 、 `'baidutemplate'`。

Example： 运行下面cptpl任务，将会把 `test/html/` 目录下的 `abc.html` 编译成 `abc.js` ， 存放在 `tmp/` 目录。

<pre lang="javascript" line="1">cptpl: {
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
</pre>

`abc.html` 和 `abc.js` 的内容如下：

<pre lang="javascript" line="1">//abc.html中的内容：
<h1>{{title}}</h1>
<p>{{content}}</p>


//编译后，abc.js中的内容：
/*BANNER*/
;window.abc = doT.template('<h1>{{title}}</h1><p>{{content}}</p>');
</pre>

#### options.context

Type: `String` ， Default value: `'window'`

指定生成的javascript文件中编译好的模板函数的上下文对象， 如果此选项的值为 `'{AMD}'`，则把编译好的模板函数包装成一个AMD模块，如果此选项的值为 `'{CMD}'`， 则把编译好的模板函数包装成一个CMD模块。

Example：

<pre lang="javascript" line="1">cptpl: {
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
</pre>

#### options.reName

Type: `Function` ， Default value: `function (name) {return name;}`

重命名方法，接受一个参数，参数值为源文件名， 此方法的返回值将作为生成的javascript文件名，以及模板函数挂载到的上下文对象属性名。

Example： 下面代码将生成的javascript文件名前面都加上 `__`， `abc.html` 将生成 `__abc.js`。

<pre lang="javascript" line="1">cptpl: {
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
</pre>

#### options.customEngines

Type: `Object` ， Default value: `{}`

自定义模板引擎预编译包裹方法。如果内置模板引擎无法满足您，可以通过此选项设置一个你需要的模板引擎预编译包裹方法。格式为 `{name: function(t){}}`， `name`为模板引擎名， 对应的`function(t){}`就是包裹方法，接受一个参数t， t为模板文件的文本内容， 您可以拼成用编译函数包裹起来的js代码，并把包裹后的结果作为函数返回值。

Example：

<pre lang="javascript" line="1">cptpl: {
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
</pre>

#### view on Github：https://github.com/hanan198501/grunt-cptpl

 [1]: http://gruntjs.com/
 [2]: http://gruntjs.com/getting-started
 [3]: http://gruntjs.com/sample-gruntfile