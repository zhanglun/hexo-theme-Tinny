title: 笔记—Node.js核心API之Util
date: 2014-05-15 21:16
tags: [笔记,Node.js]

---

最近正在学习Node，在图书馆借了基本关于Node的书，同时在网上查阅资料，颇有收获，但是整体感觉对Node的理解还是停留在一个很模棱两可的状态。比如Node中的模块，平时练习就接触到那么几个，其他的一些模块暂时只会在学习的时候接触到，不常用便就荒废了。正所谓好记心不如烂笔头，多做笔记还是更有利于理解和记忆。自己做的总结也方便回头复习，所以决定踏上漫长的修炼之旅……

<!--more-->

##util模块
util 是一个 Node.js 核心模块，提供了一些常用函数，用于弥补核心 JavaScript 的功能过于精简的不足。这些函数都包含在 <code>util</code> 模块中，可以通过引用模块来使用它们。


###util.format(format, [...])
返回一个格式化的字符串，其作用效果有点类似 <code>printf</code>。第一个参数是一个包含若干个占位符的字符串。将每个参数转换后的值代替参数对应的占位符。支持占位符有：

* %s - String.
* %d - Number (both integer and float).
* %j - JSON.
* % - single percent sign ('%'). This does not consume an argument.

如果第一个参数中的占位符找不到与之对应的参数， 那么这个占位符将不会被替换

    util.format('%s:%s', 'foo'); // 'foo:%s'

如果占位符太少，多余的参数会调用 <code>util.inspect()</code> 转换成字符串，然后用空格将多余的字符串拼接在一起。

    util.format('%s:%s', 'foo', 'bar', 'baz', 'zhanglun'); // 'foo:bar baz zhanglun'

如果第一个参数不是一个需要格式化的字符串，那么这个方法会将所有的参数用空格拼接成一个新的字符串，然后返回这个字符串。

    util.format(1, 2, 3, "zhanglun"); // '1 2 3 \'zhanglun\''


###util.debug(string)
这是一个同步输出的方法。当执行到这一句代码的时候会阻塞进程，并且以标准错误的形式将参数 string 输出。

    require('util').debug('message on stderr'); //message on stderr

###util.log(string)
以标准输出的形式输出。它将获取当前的时间戳，并和参数 string 一起输出，中间用 " - " 连接。

    require('util').log('Timestmaped message.'); //15 May 21:41:33 - Timestmaped message

###util.inspect(object,[options])
这个方法将任意对象转换为字符串，对调试来说很有用。至少接受一个参数 object，即需要处理的字符串。此外还可以传递一个可选的参数 options，用来控制字符串的输出格式。

* <code>showHidden</code>——如果<code>showHidden</code>为 true，那么这个方法将会把参数 object 中不可枚举的属性输出。
* <code>depth</code>——表示最大的递归层数。如果指定了 depth，也就指定了格式化代码时递归的次数。如果不指定depth，默认会递归2次，指定为 null 时将不限定次数，完整地遍历对象。
* <code>color</code>——如果<code>color</code>为 true，输出的格式将会以 ANSI 颜色编码，可以在终端显示更漂亮的效果。
* <code>customInspect</code>——如果为 false，那么将要被遍历检查的对象（参数object）中定义的<code>inspect（）</code>函数将不会被调用。 默认值为 true。


下面先来看一个例子：

    var util = require("util");
    var obj1 = {
            "aa": function() {
                console.log("aa");
            },
            "inspect": function() {
                console.log("obj1's inspect()");
            },
            "bb": function() {
                console.log("bb");
            }
        },
        obj2 = {
            "cc": function() {
                console.log("cc");
            },
            "inspect": function() {
                console.log("obj2's inspect()");
                return "Hello";
            },
            "dd": function() {
                console.log("dd");
            }
        };
    
    var str1 = util.inspect(obj1, {
        showHidden: false,
        depth: null,
        customInspect: false
    }),
        str2 = util.inspect(obj2, {
            showHidden: false,
            depth: null,
            customInspect: true
        });
    
    console.log("str1 : " + str1);
    console.log("str2 : " + str2);
    
其输出结果：

    obj2's inspect()
    str1 : { aa: [Function], inspacet: [Function], bb: [Function] }
    str2 : Hello
    
暂时先忽略颜色，待会接着说，先看<code>customInspect</code>。上面的例子中，有两个对象：obj1 和 obj2，内部都定义了一个 inspect()函数，调用<code>util.inspect()</code>方法时，只有<code>customInspect</code>不同。当<code>customInspect</code>为 true 时，比如 obj2，其内部的 <code>util.inspect()</code>函数在执行<code>util.inspect()</code>时就被调用了，同时只会返回这个内部的 <code>util.inspect()</code>执行后的返回值，如果没有函数显示地调用 return 语句，则返回 undefined。可以试试修改上面的示例代码中 obj2 的<code>inspect()</code>的返回值。而对于 obj1，其<code>customInspect</code>，所以其内部的<code>inspect()</code>并不会被调用。

####定制颜色
可以通过两个对象：<code>util.inspect.styles</code>和<code>util.inspect.colors</code>全局定制输出的颜色。<code>util.inspect.styles</code>是一个<code>util.inspect.colors</code>中的颜色到样式的映射。后面的没搞懂怎么回事，以后再补上。

###util.isArray(object)
如果参数 object 是一个数组，返回 true，否则返回 false。
    var util = require('util');
    
    util.isArray([])
      // true
    util.isArray(new Array)
      // true
    util.isArray({})
      // false
      
###util.isRegExp(object)
如果参数 object 是一个 RegExp 对象，返回 true，否则返回 false。

    var util = require('util');
    
    util.isRegExp(/some regexp/)
      // true
    util.isRegExp(new RegExp('another regexp'))
      // true
    util.isRegExp({})
      // false
      
###util.isDate(object)

如果参数 object 是一个 Date 对象，返回 true，否则返回 false。

    var util = require('util');
    
    util.isDate(new Date())
      // true
    util.isDate(Date())
      // false (without 'new' returns a String)
    util.isDate({})
      // false
      
###util.isError(object)

如果参数 object 是一个 Error 对象，返回 true，否则返回 false。

    var util = require('util');
    
    util.isError(new Error())
      // true
    util.isError(new TypeError())
      // true
    util.isError({ name: 'Error', message: 'an error occurred' })
      // false
      
###util.inherits(constructor, superConstructor)
这是一个实现对象之间原型继承的函数。constructor 将会继承 superConstructor。另外，通过<code>constructor.super_</code>可以访问到 superConstructor。

    var util = require("util");
    var events = require("events");
    
    function MyStream() {
    }
    util.inherits(MyStream, events.EventEmitter);
    
    MyStream.prototype.write = function(data) {
        this.emit("data", data);
    }
    
    var stream = new MyStream();
    
    
    console.log(stream instanceof events.EventEmitter); // true
    console.log(MyStream.super_); 
    //{ [Function: EventEmitter] listenerCount: [Function] }
    console.log(MyStream.super_ === events.EventEmitter); // true
    
    stream.on("data", function(data) {
        console.log('Received data: "' + data + '"');
    })
    stream.write("It works!"); // Received data: "It works!"
   

util 模块还提供了其他的一些工具函数，更多详情请戳[这里](http://nodejs.org/api/util.html#util_util)。