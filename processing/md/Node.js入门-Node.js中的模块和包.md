title: Node.js入门-Node.js中的模块
category: 前端
date: 2014-04-25 19:40
tags: Node.js
---

之前简单的了解了 Node.js 。对 Node.js  有一个简单的认识。接下来查看了 API 文档中模块有关的知识点，参照《Node.js 开发指南》，并做笔记。

<!--more-->

模块和包是 Node.js 中最重要的支柱。经常将模块和包相提并论，因为二者之间其实没有本质上的区别，经常混用。如果硬要作出区分的话，那么可以把包理解成：实现某个功能的众多模块的集合。

##什么是模块
模块是 Node.js 应用程序的基本组成部分。Node 有一套简单的模块加载机制。在 Node.js 中，文件和模块是一一对应的。也就是说，一个 Node.js 文件就可以看成是一个模块，所以在 Node 中创建一个模块非常简单。Node 提供了 exports 和 require 两个对象。exports 是模块公开的接口，意思就是创建模块得靠 exports；require 用于从外部获取一个模块的接口，也就是说使用模块要用 require 。

举个例子方便了解模块： *foo.js* 加载同目录中的模块 *circle.js* 。

*foo.js* 中的内容：

    var circle = require('./circle.js');
    console.log( 'The area of a circle of radius 4 is ' + circle.area(4));

*circle.js* 中的内容：

    var PI = Math.PI;

    exports.area = function (r) {
      return PI * r * r;
    };

    exports.circumference = function (r) {
      return 2 * PI * r;
    };
    
*circle.js* 模块通过 exports 对象输出了两个方法：area() 和 circumference()，在 *foo.js* 中使用 require() 加载这个模块，然后便可以直接访问 exports 对象的成员函数了。反言之，如果想为自定义的模块添加属性或者方法，将它们添加到 exports 这个特殊的对象上就可以达到目的。

如果希望模块提供的接口是一个构造函数，或者输出的是一个完整的对象而不是一个属性，那么可以使用 **module.exports** 代替 exports。
但是注意，exports 是 module.exports 的一个引用，只是为了用起来方便。

下面的 *bar.js* 使用了 square 模块，而 square 模块提供了一个构造函数的接口：

*bar.js* 中的内容：

    var square = require('./square.js');
    var mySquare = square(2);
    console.log('The area of my square is ' + mySquare.area());

*square.js* 中的内容：

    // 使用 exports 将无法创建 module,必须使用 module.exports

    module.exports = function(width) {
        return {
            area: function() {
                return width * width;
            }
        };
    }
    
使用 module.exports 可以很快得到想要的：

![使用 module.exports](http://cl.ly/image/1b32450A2744/download/2014-04-25_205447.png)

而使用 exports 时：

![使用 exports](http://cl.ly/image/040A3H2K2g0n/download/2014-04-25_210131.png)

(module.exports 和 exports 二者之间更具体的关系将之后补上)。


##模块的循环调用

当存在循环的模块引用时，有的模块可能在返回时不会执行。看看这个例子：

*a.js* 中的内容：

    console.log('模块 a 开始了！');
    exports.done = false;
    var b = require('./b.js');
    console.log('在 a 中, b.done = %j', b.done);
    exports.done = true;
    console.log('模块 a 结束了！');
    
*b.js* 中的内容：

    console.log('模块 b 开始了！');
    exports.done = false;
    var a = require('./a.js');
    console.log('在 b 中, a.done = %j', a.done);
    exports.done = true;
    console.log('模块 b 结束了！');
    
*main.js* 中的内容：

    console.log('main 开始了！');
    var a = require('./a.js');
    var b = require('./b.js');
    console.log('在 main 中, a.done=%j, b.done=%j', a.done, b.done);
   

当 main.js 加载 a.js 时，a.js 又加载 b.js。这个时候，b.js 又会尝试去加载 a.js 。为了防止出现无限循环的加载，a.js 中的 exports 对象会返回一个 **unfinished copy** 给 b.js 模块。然后模块b完成加载，同时将提供模块a的接口。当 main.js 加载完a，b两个模块之后，输出如下：

![cycles](http://cl.ly/image/263z0W3W0m0G/download/2014-04-25_212142.png)  

##模块的分类和载入
Node.js 的模块可以分成两类，一类是原生模块（核心模块），另一类是文件模块。核心模块由二进制编译而成，定义在源代码的 **lib/** 目录下,加载的速度最快，比如：HTTP 模块。而文件模块我的理解就是那些可以 require 的文件，后缀可以是 .js、.json、.node。

require() 总是会优先加载核心模块。例如，require('http') 总是返回编译好的HTTP 模块，而不管是否有这个名字的文件。模块在第一次加载后会被缓存。这意味着（类似其他缓存）每次调用require('foo')的时候都会返回同一个对象，当然，必须是每次都解析到同一个文件。

前面的例子中 <code>require("./a.js")</code> 等，就是在加载文件模块。如果按文件名没有查找到对应的模块，那么 Node.js 会添加 .js和 .json后缀名，再尝试加载，如果还是没有找到，最后会加上 .node 的后缀名再次尝试加载。如果指定的路径不存在，require() 会抛出一个 code 属性为 **'MODULE_NOT_FOUND'** 的错误。

在 require() 没有以'/'或者'./'来指向一个文件时，这个模块要么是"核心模块"，要么就是从 node_modules 文件夹加载的。如果 require() 中的模块名不是一个**本地模块(不在项目目录中)**，也没有以<code>'/'</code>, <code>'../'</code>, 或是 <code>'./'</code> 开头，那么 Node.js 会从当前模块的父目录开始，尝试在它的 <code>'/node_modules'</code> 文件夹里加载相应模块。如果没有找到，那么就再向上移动到父目录，直到到达顶层目录位置。

举个例子，如果 *foo.js* 文件的路径是<code>'E:/Code/nodejs/demo/foo.js'</code>,加载 *bar.js* 模块，那么 Node.js 将会按照下面的顺序检查文件目录：

* E:/Code/nodejs/demo/node_modules/bar.js
* E:/Code/nodejs/node_modules/bar.js
* E:/Code/node_modules/bar.js
* E:/node_modules/bar.js

所以尽可能地把依赖放在就近的位置，以防崩溃。


**个人笔记，仅供参考**

>参考:  
* [《Node.js 开发指南》](http://book.douban.com/subject/10789820/)  
* [Node.js API](http://nodejs.org/docs/latest/api/modules.html#modules_core_modules)  
* [深入浅出 Node.js 三](http://www.infoq.com/cn/articles/nodejs-module-mechanism)



    





