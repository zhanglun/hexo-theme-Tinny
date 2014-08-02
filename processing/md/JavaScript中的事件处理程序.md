title: JavaScript中的事件处理程序
category: 前端
date: 2014-04-06 19:40
tags: JavaScript
---

JavaScript和HTML之间的交互是通过事件实现的。事件，就是文档或者浏览器窗口中发生的一些特定的交互瞬间。可以使用事件处理程序来预订事件，以便在事件发生的时候执行响应的代码。这种观察者模式的模型，使得JavaScript代码与HTML和CSS代码之间形成了松散耦合。
<!-- more -->

##事件流
事件流描述的是从页面中接受事件的顺序。但是值得注意的是，在当年的浏览器大战中的主角们采用的是几乎完全相反的事件流概念。IE的事件流是**事件冒泡流**，而Netscape Communicator的事件流是**事件捕获流**。
###事件冒泡
IE的事件流叫做**事件冒泡**（event bubbing），即事件右最具体的元素接受，然后逐级向上传播到不具体的元素，以下面的代码为例：
	

	<html>
	<head>
		<title>Document</title>
	</head>
	<body>
		<div id="btn">点我</div>
	</body>
	</html>



如果你单击了#btn，那么在IE的页面中，这个事件会如下传播：
>div->body->html->document

![事件冒泡](http://cl.ly/image/0p402u452W2R/event-bubbling.png)

可以看到，事件首先在div上发生，div就是我们单击的元素。然后事件沿着DOM树向上传播，一直到document对象。
所有的现代浏览器都支持事件冒泡。IE9，Firefox，Chrome和Safari则将事件一直冒泡到window对象。

###事件捕获

事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该是最后接收到事件。事件捕获的顾名思义就是在事件到达预定的目标之间捕获它。以上面的代码作为例子，那么单击div的时候会按照与冒泡相反的顺序触发事件。

>div->body->html->document

![事件捕获](http://cl.ly/image/3b1P2i0D1m1q/event-capture.png)

在这个过程中，document对象先接收到click事件，然后事件沿着DOM树依次向下，一直传递到目标元素。
IE9，Firefox，Chrome和Safari都支持事件捕获。“DOM2级事件”规范要求事件应该从document对象开始传播，但实际上这些浏览器都是从window对象开始捕获事件。

###DOM事件流

DOM事件流比事件毛婆和事件捕获稍微复杂一点点。它规定的事件流包括三个阶段：事件捕获阶段，处于目标阶段和事件冒泡阶段。

以前面的代码为例。单击div

>document->html->body->div->body->html->document

![DOM事件流](http://cl.ly/image/3b1P2i0D1m1q/event-dom.png)

在DOM事件流中，实际的目标在捕获阶段不会接收到事件。也就是说在捕获阶段中，事件从document到<html\>再到<body\>后就停止了。下一个阶段是“处于目标”阶段，于是事件在目标元素上面发生，并且在事件处理中被看成了冒泡阶段的一部分。紧接着冒泡阶段发生，事件传回文档
##事件处理程序
###HTML事件处理程序
	
	<input type="button" value="Click" id="go" onclick="showMessage()" />
	
这玩意儿就是传说中的HTML事件处理程序。最明显的缺点就是：HTML与JavaScript代码紧密耦合。如果要更换事件处理程序，就要同时修改HTML和JavaScript代码。
###DOM0级事件处理程序
通过JavaScript制定事件处理程序的传统方法，就是讲一个函数赋值给一个叫做“事件处理程序”的属性。每个元素都有自己的事件处理程序属性，这些属性通常全部都是小写，例如onclick。将事件处理程序设置为一个函数，就可以指定事件处理程序。

	var btn=document.getElementById("myBtn");	
	btn.onclick=function(){
		alert("Clicked!");
	}

要使用JavaScript指定事件处理程序，必须先获得对象元素的引用，然后为其指定事件处理程序的函数。
事件处理程序是在元素的作用域中运行的，也就是说程序中的this指向的是当前元素。

	var btn=document.getElementById("myBtn");	
	btn.onclick=function(){
		alert(this.id);//"myBtn"
	}

以这种当时添加的事件处理程序会在事件流的冒泡阶段被处理。
通过将事件处理程序属性的值设置成null就可以删除事件处理程序。
	
	btn.onclick=null;	

###DOM2级事件处理程序
“DOM2级事件”规定了两个方法用于操作事件处理程序：addEventListener()和removeEventListener()。所有的节点都包含这两个方法，接收三个参数：要处理的事件名，作为事件处理程序的函数和一个布尔值。最后的参数如果是true，表示在事件捕获阶段调用事件处理程序，如果是false，表示在事件冒泡阶段调用事件处理程序。

	var btn=document.getElementById("myBtn");	
	btn.addEventListener("click",function(){
		alert(this.id);
	},false);
	

DOM0级事件处理程序只能为一个元素添加唯一的某一个事件的处理程序。如果为一个元素添加了两个click的处理程序，后定义的程序会覆盖掉之前定义的程序，其实也就是给变量a多次赋值一样。使用DOM2级事件处理程序的好处之一就是：可以添加多个添加多个事件处理程序。

	var btn=document.getElementById("myBtn");
	btn.addEventListener("click",function(){
		alert(this.id);
	},false);
	btn.addEventListener("click",function(){
		alert("hello,world");
	},false);


这两个事件处理程序会按照添加的顺序触发。

通过addEventListener()添加的事件处理程序只能使用removeEventListener()来移除。通过addEventListener()添加的匿名函数无法移除，因为移除是传入的参数一添加处理程序时使用的参数**必须相同**。

为了最大限度地兼容浏览器，建议在大多数情况下豆浆事件处理程序添加到事件流的冒泡阶段。

###IE中的事件处理程序

IE中有类似于DOM的两个方法：attachEvent()和detachEvent()。这两个方法接受两个参数：事件处理程序名称和事件处理程序函数。attachEvent()添加的事件处理程序都会添加到冒泡阶段

	var btn=document.getElementById("myBtn");
	btn.attachEvent("onclick",function(){
		alert("alert");
	});

要注意哟，第一个参数是“onclick”而不是“click”。前面说到，在DOM0级事件中，事件处理程序的作用域是元素的作用域，而在使用attachEvent()时，作用域变成了全局作用域，此时this等于window 

	var btn=document.getElementById("myBtn");
	btn.attachEvent("onclick",function(){
		alert(this==widnow);//"true"
	});


与addEventListener()一样，attachEvent()也可以用来为一个元素天剑多个事件处理程序，不过与DOM方法不同的是，事件处理程序不是按照添加的顺序执行，而是以相反的顺序执行。
可以使用detachEvent()移除使用attachEvent()添加的事件处理程序。与DOM方法一样必须提供相同的参数，添加的匿名函数不能被移除。

因此跨浏览器的事件处理程序可以这么写： （来自《JavaScript高级程序设计》） 

	var EventUtil = {
	    addHandler: function (element, type, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = handler;
	        }
	    },
	    removeHandler: function (element, type, handler) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, handler, false);
	        } else if (element.detachEvent) {
	            element.detachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = null;
	        }
	    }
	};
	var btn = document.getElementById("myBtn");
	var handler = function () {
	        alert("Clicked");
	    };
	EventUtil.addHandler(btn, "click", handler);
	EventUtil.removeHandler(btn, "click", handler);


##参考资料
* 《JavaScript高级程序设计》

