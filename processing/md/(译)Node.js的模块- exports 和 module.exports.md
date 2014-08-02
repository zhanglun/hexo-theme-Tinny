title: (译)Node.js的模块-exports和module.exports
date: 2014-04-26 19:45
tags: [译文,Node.js]
---

>原文标题：Node.js Module – exports vs module.exports   
 原文链接：[http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html)

<!--more-->

##exports 和 module.exports 有什么区别？  

你一定很熟悉 Node.js 模块中的用来在你的模块中创建函数的 exports 对象，就像下面这样。

创建一个叫做 <code>rocker.js</code> 的文件：

    exports.name = function() {
        console.log('My name is Lemmy Kilmister');
    };
    
然后可以在另外一个文件中调用 <code>rocker.js</code> :

    var rocker = require('./rocker.js');
    rocker.name(); // 'My name is Lemmy Kilmister'
    
但是，<code>module.exports</code> 到底什么？它是合法的吗？

令人吃惊的是：<code>module.exports</code> 是真实存在的。<code>exports</code>  只不过是 <code>module.exports</code> 的帮手而已。你的模块直接返回返回 <code>module.exports</code> 给调用者，而不是 <code>exports</code> 。所有的 <code>exports</code> 做的工作实际上是收集属性，如果 <code>module.exports</code> 当前没有任何属性，<code>exports</code>便将收集到的属性添加到 <code>module.exports</code> 上。如果 <code>module.exports</code> 
已经存在若干属性，所以 <code> exports</code> 上的属性都会被忽略。  

修改 <code>rocker.js</code> 文件：

    module.exports = 'ROCK IT!';
    exports.name = function() {
        console.log('My name is Lemmy Kilmister');
    };
    
在另一个文件中调用 <code>rocker.js</code>:

    var rocker = require('./rocker.js');
    rocker.name(); // TypeError: Object ROCK IT! has no method 'name'
    
上述例子中的 <code>rocker</code> 模块完全将 <code>exports.name</code> 忽略了，只返回了一个 String 字符串：<code>'ROCK IT!'</code> 。 从这个例子你大概明白了：你的模块并不一定总是一个模块的实例(module instance)，它可以是任何合法的 JavaScript 对象——boolean, number, date, JSON, string, function, array 和其他的。你的模块可以是任何你设置的  <code>module.exports</code> 的值。如果你没有明确地为  <code>module.exports</code> 设置任何值，那么 <code>exports</code> 中的属性会自动添加到 <code>module.exports<code> 中，然后并返回它。

在这种情况下，你的模块是一个类：

    module.exports = function(name, age) {
        this.name = name;
        this.age = age;
        this.about = function() {
            console.log(this.name +' is '+ this.age +' years old');
        };
    };
    
而你可以像这样使用：

    var Rocker = require('./rocker.js');
    var r = new Rocker('Ozzy', 62);
    r.about(); // Ozzy is 62 years old
    
在这时候你的模块是一个数组：

    module.exports = [
        'Lemmy Kilmister', 
        'Ozzy Osbourne', 
        'Ronnie James Dio', 
        'Steven Tyler', 
        'Mick Jagger'
    ];
    
而你可以这样使用：

    var rocker = require('./rocker.js');
    console.log('Rockin in heaven: ' + rocker[2]); //Rockin in heaven: Ronnie James Dio
    
现在你应该明白了点什么：  
如果你想让你的模块返回一个特殊的对象类型，比如构造函数，那么你得使用 module.exports ；如果你只想模块作为一个典型的模块实例（module instance），那么就用<code>exports</code>。 

把属性添加到 <code>module.exports</code> 中和添加到 <code>exports</code> 中的结果是一样的。比如像这样：

    module.exports.name = function() {
        console.log('My name is Lemmy Kilmister');
    };

其实和下面的是一样的：

    exports.name = function() {
        console.log('My name is Lemmy Kilmister');
    };
    
但是要注意，他们不是同一个东西。就像之前说的一样，<code>exports</code>  只不过是 <code>module.exports</code> 的帮手而已。话虽如此，<code>exports</code>还是推荐的对象，除非你想把你模块的对象类型从传统的模块实例（module instance）修改为其他的。

只要你没有使用赋值运算重写<code>module.exports</code>对象，任何添加到 <code>module.exports</code>和<code>exports</code>的属性都能够在 <code>require</code>模块中。

比如这是你的模块中的内容：

    module.exports.age = 68;
    exports.name = 'Lemmy Kilmister';
    
下面的代码可以很好的工作：

    var rocker = require('./rocker.js');
    console.log('%s is %s', rocker.name, rocker.age); // Lemmy Kilmister is 68
    
但是，如果你在你的模块中重写了<code>module.exports</code>中的任何地方，代码便会出错：

    module.exports = 'LOL';
    module.exports.age = 68;
    exports.name = 'Lemmy Kilmister';
    
或者这样：

    module.exports.age = 68;
    exports.name = 'Lemmy Kilmister';
    module.exports = 'WTF';
    
顺序没有关系，<code>rocker.age</code> 和 <code>rocker.name</code> 将显示为 <code>undefined</code>。

并且注意：只是因为 <code>module.exports</code> 和  <code>exports</code> 都能输出模块，并不意味这你可以组合使用。我的建议是，坚持使用 <code>exports.*</code>，明白<code>module.exports</code> 

我希望这篇文章能帮助你理解exports和module.exports之间的不同，并且能进一步的理解模块在Node.js中是怎么工作的。

(完)

**翻译水平有待提高，所翻译的博文并不是按照原文一句一句翻译，而是添加了自己对文章的理解。如有不正之处，欢迎指正！**
**个人笔记，仅供参考。**
>参考: 
[http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html)