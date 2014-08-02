title: (译)Node.js的全局变量    
date: 2014-04-28 19:36
tags: [译文,Node.js]
---
>原文标题：Global Variables in Node.js  
 原文链接：[http://www.hacksparrow.com/global-variables-in-node-js.html
](http://www.hacksparrow.com/global-variables-in-node-js.html)

<!--more-->

你可能正在使用一些 Node.js 的模块，或者一个框架比如 <code>Express.js</code> ，并且突然感觉你需要创建一些全局变量。在 Node.js 中你会如何创建全局变量？

在这个问题上，大多数的建议是“不使用 <code>var</code> 声明变量”，或者是“把变量添加到 <code>global</code> 对象上”，亦或者是“将变量添加到 <code>GLOBAL</code> 对象上”。你选择哪一个？

首先，让我们来分析一下这个<code>global</code> 对象。打开一个终端，切换到 <code>Node REPL (prompt)</code> 

    $ node
    >
    
输入"global"，看看这个对象到底有些什么。

    > global
    
我的天啊（原文：Holy mother of Flying Spaghetti Monster!!!）！这是一个庞大的对象！实际上，你看到了 Node.js 的灵魂。在一个 Node.js 的进程中，所有的其他对象都是依附在 <code>global</code> 对象上。如果你熟悉浏览器中的 JavaScript 环境，<code>global</code> 对象和 <code>Window</code> 对象相似。

现在我们知道了 <code>global</code> 对象是什么，现在让我们来玩弄它：

    > global.name
    undefined
    > global.name = 'El Capitan'
    > global.name
    'El Capitan'
    > GLOBAL.name
    'El Capitan'
    > delete global.name
    true
    > GLOBAL.name
    undefined
    > name = 'El Capitan'
    'El Capitan'
    > global.name
    'El Capitan'
    > GLOBAL.name
    'El Capitan'
    > var name = 'Sparrow'
    undefined
    > global.name
    
有趣的观察！（Interesting observations!）

看起来似乎 <code>global</code> 和 <code>GLOBAL</code> 是同一个东西。实际上，<code>GLOBAL</code> 是 <code>global</code> 的一个别名。

更让人惊讶的是：无论是使用 <code>var</code> 声明的变量还是未使用 <code>var</code> 声明的变量都添加到了 <code<code>global</code> 对象>global</code> 对象上。在 Node.js 中，不使用 <code>var</code> 关键字声明变量是一种创建全局变量的基本的方法。这种方法在模块中的实现稍微有些不同，接下来我会解释。

当你创建了一个 Node.js 进程，在这个进程中的所有模块都分享同一个  <code>global</code> 对象。结合上面的观察，你对 <code>global</code> 对象的工作方式有一定的理解。然而，有一点不同之处在于，在你创建的模块中，使用 <code>var</code> 关键字声明的变量只属于这个模块，属于局部变量。那些未使用 <code>var</code> 关键字声明的变量则附加到 <code>global</code> 对象上。

所以现在你知道了：“不使用 <code>var</code> 声明变量”，“把变量添加到 <code>global</code> 对象上”和“将变量添加到 <code>GLOBAL</code> 对象上”是相同的事情。

在模块中全局声明的变量可以通过它的变量名直接被任何其他的模块引用，而不用通过 <code>global</code> 对象的引用，意味着：

    name == global.name == GLOBAL.name
    
但是这并不意味着你应该这么做。为什么？看看这个：

    var company = 'Yahoo';
    console.log(global.company); // 'Google'
    console.log(company); // 'Yahoo'
    
当时使用  <code>gloabal.campany</code> ，你知道你在处理全局变量，此外，在模块中作为局部变量使用时节约了变量名 <code>campany</code> 。如果你打算在你的 Node.js 程序中使用全局变量，关于 <code>global</code> 对象的方法的讨论效果很好。但是，别过度使用全局变量。说了这么多，难道还有不使用全局变量的替代解决方法？

是的，有这么一个，并且它涉及到  <code>module.exports</code> 的使用。让我用一个例子来证明：

*main.js* 中的内容：

    exports.company = 'Google';
    var m = require('./mod');
    
*mod.js* 中的内容：

    var company = require('./main').company;
    console.log(company);
    
现在来看看它怎么运作的：

    $ node main.js
    Google

你拥有了一个变量，这个变量来自另一个没有使用全局对象的可使用的模块。你可以在其他的模块中引用 *main.js* 以此来使用 变量名  <code>campany</code>。

注意：引用一个已经引用了另外一个模块的模块，只会创建一个包含前一个模块的引用，这并不意味着会严重增加内存的使用。同时，因为不存在真正的重复包含，模块中所有的初始化函数都不会重复执行一次。

所以，结论是：在 Node.js 中有两种创建全局变量的方法，一种是使用 <code>global</code> 对象，另一种是使用 <code>module.export</code> 。我的建议是什么？小应用使用 <code>global</code> 对象，大型应用使用 <code>module.export</code>。

(完)

**翻译水平有待提高，所翻译的博文并不是按照原文一句一句翻译，而是添加了自己对文章的理解。如有不正之处，欢迎指正！**
**个人笔记，仅供参考。**
>参考: 
[http://www.hacksparrow.com/global-variables-in-node-js.html
](http://www.hacksparrow.com/global-variables-in-node-js.html)
