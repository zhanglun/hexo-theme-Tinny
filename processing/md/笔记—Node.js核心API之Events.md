title: 笔记-Nodejs中的核心API之Events
date: 2014-05-12 19:40
tags: [笔记,Node.js]

---

最近正在学习Node，在图书馆借了基本关于Node的书，同时在网上查阅资料，颇有收获，但是整体感觉对Node的理解还是停留在一个很模棱两可的状态。比如Node中的模块，平时练习就接触到那么几个，其他的一些模块暂时只会在学习的时候接触到，不常用便就荒废了。正所谓好记心不如烂笔头，多做笔记还是更有利于理解和记忆。自己做的总结也方便回头复习，所以决定踏上漫长的修炼之旅……

<!--more-->

Node提供了许多API，其中一些比较重要。这些核心的API是所有Node应用的支柱，你会不停的用到他们。

##Events

几乎所有的模块都是建立在Event模块的基础上诞生的，而Event模块只提供了一个对象：events.EventEmitter，其核心功能就是事件发射和事件监听功能的封装。

###EventEmitter
Node创建了一个EventEmitter类提供基础的事件功能，所有的Node的事件功能都围绕着EventEmitter，因为它的设计包含了其他类拓展所需要的接口类。EventEmitter的每一个事件由一个事件名和若干个参数组成，事件名是一个字符串，通常表达一定的语义。每一个事件都支持若干个事件监听器。当事件发射时，注册的事件监听器一次被调用，同时参数作为回调函数的参数传递要注意，通常不会直接调用EventEmitter对象，我们可以通过 require('events').EventEmitter 获取 EventEmitter 类。

EventEmitter提供了一系列的方法，最主要的两个方法是<code>on</code>和<code>emit</code>，这些方法供其它类使用。

####使用on方法监听事件
on方法接受两个参数：需要监听的事件的名称和事件触发时需要调用的函数。因为EventEmitter是接口，所以从EventEmitter继承的类需要用<code>new</code>关键字来构造。

    //创建一个新的类支持EventEmitter事件
    var util = require("util"),
        EventEmitter = require("events").EventEmitter;
        
    var Server = function(){
        console.log("init");
    };
    
    util.inherits(Server, EventEmitter);
    
    var s = new Server();
    
    s.on("eventName", function(){
        console.log("eventName : abc");
    });

在这个例子中，我们先包含了util模块。以便调用它的inherits方法。inherits能够将EventEmitter类的方法添加到创建的Server类中（有关utils模块的介绍日后补上），也就是说这样一来所有的Server的新实例都能够使用EventEmitter的方法。然后我们包含了Events模块。但是我们只是想调用其中的EventEmitter类，然后将它的方法绑定到要用的Server类上。

Server的实例能够访问EventEmitter的方法，也就是说我们可以调用on方法为这个实例添加事件监听器。到目前为止，我们添加的事件监听器还不会被调用，因为并没有一个叫做“eventName”的事件被触发。

####使用emit方法触发事件

	s.emit("eventName",a,b,c);
	
触发事件监听器很简单，只要调用emit方法就可以了。要注意的是，这些事件只是针对某一个实例的，并不存在全局的事件。但你调用on方法的时候，需要将其绑定在特定的基于EventEmitter的对象上（继承自EventEmitter的对象）。

调用emit方法时，除了第一个参数是事件的名称外，你可以传入任意数目的参数。这些参数都将传递给该监听事件的函数。比如从HTTP服务器接收到request请求的时候，你会接受到两个参数：req和res。当request事件被触发时，这些参数会作为第二个和第三个参数传给emit函数。

##回调函数

前面说到的，当事件触发时，emit方法中的第二个参数之后的所有参数都会传递给on方法中的回调函数。那前面的例子来说，emit方法中的参数<code>a,b,c</code>将会作为参数传递给on方法中的毁掉函数

*emitter*  中的内容：

     // write by 张小伦爱学习
     
    var util = require("util"),
        EventEmitter = require("events").EventEmitter;
        
    var Server = function(){
        console.log("init");
    };
    
    util.inherits(Server, EventEmitter);
    
    var s = new Server();
    
    s.on("eventName", function(para1,para2,para3){
        console.log("eventName : abc");
        console.log("para1 : "+para1);
        console.log("para2 : "+para2);
        console.log("para3 : "+para3);
    });
    
    s.emit("eventName","a","b","c");
    
*输出结果* ：

    init                //创建一个Server实例
    eventName : abc     //on方法中的回调函数
    para1 : a
    para2 : b
    para3 : c
    
###更多方法

**emitter.once(event, listener)**  
添加一个 一次性监听器，这个监听器只会在下一次事件发生时被触发一次，触发完成后就被删除。

**emitter.addListener(event, listener)**
添加一个监听器至特定事件的监听器数组尾部，和on方法一样，但是on方法没有与之对应的removeListener方法。  

**emitter.removeListener(event, listener)**
从一个事件的监听器数组中删除一个监听器注意：此操作会改变监听器 数组中当前监听器后的所有 监听器在的下标。

关于addListener和removeListener，可以结合一下DOM中的addEventListener和removeEventListener方法来理解。

更多详细的介绍请看[这里](http://nodejs.org/api/events.html#events_events)


###结束语
最近在github上fork了若干个国外的开源项目，比较小巧的项目。但是遇到了障碍，语言不通啊！！！！！！英语太菜啊！！！！！！光看得懂文档有毛线用啊！！！！！要理解思维方式啊！！！


默默努力吧，加油！


