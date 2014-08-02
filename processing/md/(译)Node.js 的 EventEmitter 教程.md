title: (译)Node.js的 EventEmitter 教程
date: 2014-05-05 21:23
tags: [译文,Node.js]

---
>原文标题：Node.js EventEmitter Tutorial  
 原文链接：[http://www.hacksparrow.com/node-js-eventemitter-tutorial.html](http://www.hacksparrow.com/node-js-eventemitter-tutorial.html)

<!--more-->

听说过 Node.js 中的 <code>EventEmitter</code> 吗？也许你知道大部分内置的 Node.js 库 都使用它，也许你总是对 <code>EventEmitter</code> 充满好奇，但是没有谁向你解释？

在这个教程中，我会给你一些关于 <code>EventEmitter</code> 类的例子。

你必须熟悉各种 Node.js 中的事件比如： <code>on data</code> ， <code>on end</code> ， <code>on error</code> 等等之类的。事件机制的工作做得天衣无缝，十分完美，难道不是吗？所有的基于事件的 Node.js 库都依赖于 <code>EventEmitter</code> 类，你可能会说那些库都继承了 <code>EventEmitter</code>。

 <code>EventEmitter</code> 的强大之处不仅限于内置的 Node.js 库，你也可以拥有它！
 
展示 <code>EventEmitter</code> 能力的最好方法就是通过一个例子，看看这个：

    var EventEmitter = require('events').EventEmitter;
    var radium = new EventEmitter();
    
    //绑定 radiation 事件
    radium.on('radiation', function(ray) {
        console.log(ray);
    });
    
    setInterval(function() {
        //触发 radiation 事件
        radium.emit('radiation', 'GAMMA');
    }, 1000);
    
注意到了吧，创建一个事件，添加一个事件监听器，触发事件，通过事件传递数据是多么的简单。所有的这些因为 <code>EventEmitter</code> 的魔力而实现。 <code>EventEmitter</code> 让编写令人惊讶的 Node.js 库变得可能。

上面的例子基于一个 <code>EventEmitter</code> 的实例，我们怎么做才能创建一个继承自 <code>EventEmitter</code> 的类呢？Node.js 有一个，叫做 <code>util</code> 的库，它有一个方法： <code>inherits</code>，实现对象之间原型继承的函数。我们可以很轻松的通过它让一个类继承另一个类（准确的说不能叫类）：

    var util = require('util');
    util.inherits(MyClass, SuperClass);
    
使用 <code>util.inherits()</code> ，我们创建了一个继承自 <code>EventEmitter</code> 的模块，注意下面的代码：

*radio.js* 中的内容：

    var util = require('util');
    var EventEmitter = require('events').EventEmitter;
    
    //一个包含 "freq" 和 "name" 属性的对象
    var Radio = function(station) {
        //保存 指向Radio的this，在setTimeout()中使用
        var self = this;
        
        setTimeout(function() {
            self.emit('open', station);
        }, 0);
        
        setTimeout(function() {
            self.emit('close', station);
        }, 5000);
        
        this.on('newListener', function(listener) {
            console.log('Event Listener: ' + listener);
        });
        
    };
    
    //Radio 继承 EventEmitter
    util.inherits(Radio, EventEmitter);
    module.exports = Radio;
    
我们创建了一个继承自 <code>EventEmitter</code> 的模块。接下来让我们看看如何在一个例子中使用创建的模块。

*example.js* 中的内容：

    var Radio = require('./radio.js');
    
    var station = {
        freq: '80.16',
        name: 'Rock N Roll Radio',
    };
    // 创建一个Radio实例
    var radio = new Radio(station);
    
    //添加一个“open”事件监听器
    radio.on('open', function(station) {
        console.log('"%s" FM %s OPENED', station.name, station.freq);
        console.log('? ??');
    });
    
    //添加一个“close”事件监听器
    radio.on('close', function(station) {
        console.log('"%s" FM %s CLOSED', station.name, station.freq);
    });
    
运行 example.js 准备好见证 <code>EventEmitter</code> 的魔力。

如果因为某些原因你不想使用 <code>util</code> 模块，你可以用这种方法来拓展一个类。

    Apple.prototype = Object.create(require('events').EventEmitter.prototype);
    
 <code>EventEmitter</code> 可以帮你编写令人印象深刻的基于事件的 Node.js 模块。同时，作为作为一个 Node.js 的开发人员，你掌握的关于<code>EventEmitter</code>的知识会大大影响你的工作效率。所以，确保你阅读了[关于 <code>EventEmitter</code> 的更详细的资料](http://nodejs.org/api/events.html#events_class_events_eventemitter)，并且掌握里里外外它是如何工作的。如果你不了解<code>EventEmitter</code>，那你也不了解 Nodejs.js



(完)

**翻译水平有待提高，所翻译的博文并不是按照原文一句一句翻译，而是添加了自己对文章的理解。如有不正之处，欢迎指正！**
**个人笔记，仅供参考。**
>参考: 
[http://www.hacksparrow.com/node-js-eventemitter-tutorial.html
](http://www.hacksparrow.com/node-js-eventemitter-tutorial.html)

[关于 <code>EventEmitter</code> 的更详细的资料]: http://nodejs.org/api/events.html
