title: Node.js入门-Node.js 介绍
date: 2014-04-19 21:55
tags: Node.js
---

Node.js学习入门
<!-- more -->

##Node.js 是什么
Node.js 不是一种独立的语言，与 PHP，Python 等”既是语言优势平台“不同，它也不是一个 JavaScrip 框架，不同于 CakePHP，Django，更不是一个 JavaScript 库，不能和 jQuery 相提并论。总的来说，Node.js 是一个让 JavaScript 运行在服务端的开发平台。

Node.js 是一个让 JavaScript  运行在浏览器之外的平台。它实现了注入文件系统、模块、包、操作系统级别的API、网络通信等JavaScript不能做到或者做得不好的功能
##Node.js 能做什么

使用 Node.js 可以轻松的开发：  

* 具有复杂逻辑的网站  
* 大规模的 Web 应用  
* Web Socket 服务器 [wiki](http://zh.wikipedia.org/wiki/WebSocket) 
* TCP/UDP 套接字应用程序
* 命令行工具
* 交互式终端程序
* 本地应用程序
* 单元测试工具
* 客户端JavaScript编译器

Node.js 可以作为服务器提供服务，他跳过了类似 Apache，IIS 等 HTTP 服务器，内建了 HTTP 服务器支持，无需额外搭建一个 HTTP 服务器，便可以轻而易举地实现网站和服务器的组合。

	var http=require("http");
	http.createServer(function(req,res){
		res.writeHead(200,{"Content-Type":"text/plain"});
		res.end("Hello,CrispElite!\n");
	}).listen(3000,"127.0.0.1");//
	console.log("服务器已启动：http://127.0.0.14:3000/");

将代码保存为 server.js ，从终端或者CMD中运行这个程序：
	

	node server.js // 必须先安装好Node.js环境

如果成功启动服务器，那么在终端或者CMD中可以看到类似这样的显示：

	你的服务器已启动：http://127.0.0.14:3000/

用浏览器访问"http://127.0.0.14:3000/" (代码中 listen() 指定的地址)  
![Node server](http://cl.ly/image/1u2K2Y351b3O/nodeserver.png)

Node.js 还可以部署到非网络应用的环境下，比如命令行。甚至可以调用 C/C++ 的代码，充分利用已经拥有的诸多函数库。

##异步式 I/O 与事件驱动


Node.js 最大的特点就是采用异步式 I/O 与事件驱动的架构设计。对于高并发的解决方案，传统的架构师多线程模型，也就是为每一个业务逻辑提供一个系统线程，通过切换线程弥补同步式 I/O 的事件开销。Node.js 和 JavaScript 一样使用的是单线程模型，对于所有的 I/O 请求都采用异步的方式，在执行过程中维护一个且只有一个事件队列，程序在执行时进入时间循环等待下一个事件到来，每一个异步 I/O 请求完成之后都被添加到事件队列，等待处理。

什么是阻塞( block )？线程在执行中如果遇到磁盘读写或者网络通信( 统称为 I/O 操作 )，通常要耗费较长时间，这是才做系统会剥夺这个线程的 CPU 控制权，使其暂停执行，并将资源让给其他的工作线程，这种线程调度方法称为阻塞。当 I/O 操作完毕时，系统将这个线程的阻塞状态解除，恢复其对 CPU 的控制权，令其继续执行。这种 I/O 模式就是通常的**同步式 I/O ( Synchronous I/O )**或者**阻塞式 I/O ( Blocking I/O )**。

比如：你去超市买东西，结账的柜台只有一个，但是排队结账的人很多。而你只能排队结账。，可是每天排队的人很多，慢慢的大家开始抱怨每天买点东西搞得像过年过节一样。超市老板为了满足顾客，斥资招人，多开几个结账柜台。这样一来，虽然还要排队，但是队伍多了，每个队伍的等待时间少了。

异步式 I/O ( Asynchronous I/O ) 或者非阻塞式 I/O ( Non-blocking I/O ) 则针对所有 I/O 操作不采用阻塞的策略。当线程遇到 I/O 操作时，只将 I/O 请求发送给操作系统，继续执行下一条语句。当操作系统完成 I/O 操作时，以事件的形式通知执行 I/O 操作的线程，线程会在特定时候处理这个事件。

比如：你还是去超市买东西，但是你要的东西超市采购的货还在路上，于是到柜台咨询。客服要求你留下联系方式，货到之后联系你。过了几天，超市工作人员打电话给你，告诉你你要的货到了。然后你屁颠屁颠跑去超市拿货。

阻塞模式下，一个线程只能处理一项任务，想提高吞吐量必须通过多线程。而非阻塞模式下，一个线程永远在执行计算操作， I/O 以事件的方式通知。多线程带来的好处仅仅是在多核 CPU 的情况下利用更多核，而 Node.js 的单线程也能带来同样的好处。这就是为什么 Node.js 使用了单线程，非阻塞的事件编程模式。  

单线程事件驱动的异步I/O 比传统的多线程阻塞式 I/O 的好处在于：异步式 I/O  少了了多线程的开销。具体细节请看[link]("http://baike.baidu.com/view/65706.htm#4") 

比如：简单的数据库查询操作，按照传统的方式实现的代码如下：

	res=db.query("SELECT * from someTable");
	res.output();

执行到第一行的时候，线程会阻塞，直到数据库返回查询结果。然后再继续处理。当涉及到磁盘读写，网络通信时，时延可能非常大，线程会阻塞等待结果返回。对于高并发的访问，一方面线程长期阻塞等待，另一方面为了应付新的请求而不断增加线程，因此浪费大量系统资源。而对于 Node.js 来说，是这样的

	db.query("SELECT * from someTable",function(res){
		res.output();
	});

进程在执行到 db.query 时，不会等待结果返回，而是直接继续执行后面的语句，直到进入事件循环。


##Node.js 的模块( Module )和包( Package )
模块( Module )和包( Package )是 Node.js 最重要的支柱。通过 npm 安装需要的模块，使用 require 函数来调用其他模块。  
npm 是 Node.js 的包管理器。允许我们下载、安装、升级、删除包。npm 之于 Node.js ，就像 pip 之于 Python，gem 之于 Ruby。 
安装好 npm 之后，可以从终端或者CMD开始安装模块。

	npm install [module_name]

模块安装成功后，会被放置在当前目录的 node_modules 文件夹中。在使用 npm 安装包的时候，有两种模式：**本地模式**和**全局模式**。默认情况下使用 npm install 命令就是本地模式，将包安装到当前目录的 node_modules 子文件夹中。另外一种被称为全局模式：npm install -g [modules_name] 。本地模式仅仅将包安装到 node_modules 文件夹中，并不会注册 PATH 环境变量，即无法在命令行中直接使用，在 window 上 会提示“不是内部命令”之类的。而使用全局模式的时候，包会安装在系统目录中，在 window 中会安装到 "C:\Users\yourUserName" 中，同时可以在命令行中直接使用命令。但是使用全局模式安装的包并不能直接在 JavaScript 文件中使用 require 获得。

总而言之，当需要将某个包作为工程运作时的一部分时，通过本地模式获取，如果要在命令行中使用，则使用全局安装。

##关于调试

###我爱F5
在开发 Node.js 实现的 HTTP 应用时，无论修改了代码的哪一部分，都必须重新运行才能奏效。因为 Node.js 只有在第一次引用到某部分时才会解析脚本文件，之后都会直接访问内存，避免重复载入，以提高速度。 supervisor 可以监视代码的修改，并自动重启Node.js。使用 npm 以全局模式安装 supervisor 之后，可以直接在命令行中使用下面的命令启动 server.js。

	supervisor server.js 



###调试方法
调试的方法有：命令行调试，使用 Eclipse 调试等。个人倾向使用 node-inspector 进行调试。

####使用 node-inspector 

	npm install -g node-inspector //命令安装 node-inspector 

然后在终端或者CMD中敲入

	node --debug-brk=5858 filename.js  //连接你要测试的脚本的调试服务器
	node-inspector                  //另开一个窗口，启动 node-inspector 。

在浏览器中打开 “http://127.0.0.1:3000/debug?port=5858” ，便可以看到调试工具。
具体可以[点这里](http://www.cnblogs.com/dolphinX/p/3485345.html) 。

**个人笔记，仅供参考**

>参考:  
* [《Node.js 开发指南》](http://book.douban.com/subject/10789820/) 
