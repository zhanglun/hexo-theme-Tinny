title: 笔记-Node.js中的核心API之HTTP
date: 2014-05-13 17:36
tags: [笔记,Node.js]

---

最近正在学习Node，在图书馆借了基本关于Node的书，同时在网上查阅资料，颇有收获，但是整体感觉对Node的理解还是停留在一个很模棱两可的状态。比如Node中的模块，平时练习就接触到那么几个，其他的一些模块暂时只会在学习的时候接触到，不常用便就荒废了。正所谓好记心不如烂笔头，多做笔记还是更有利于理解和记忆。自己做的总结也方便回头复习，所以决定踏上漫长的修炼之旅……

<!--more-->

Node提供了许多API，其中一些比较重要。这些核心的API是所有Node应用的支柱，你会不停的用到他们。

##HTTP服务器
Node.js的核心功能之一就是作为web服务器，在Node的标准库中提供了http模块，其中封装了一个高效的HTTP服务器和一个简易的HTTP客户端。就像之前说过的：Node.js 可以作为服务器提供服务，他跳过了类似 Apache，IIS 等 HTTP 服务器，内建了 HTTP 服务器支持，无需额外搭建一个 HTTP 服务器，便可以轻而易举地实现网站和服务器的组合。

Node中的HTTP接口的被设计成可以支持许多HTTP协议中原本用起来很困难的特性，特别是对于很大的或者块编码的消息.这些接口不会完全缓存整个请求(request)或响应(response),这样用户可以在请求(request)或响应(response)中使用数据流。若想使用Node中的HTTP服务或客户端功能，需引用此模块<code>require('http')</code>。

>[http://nodejs.org/api/http.html#http_http](http://nodejs.org/api/http.html#http_http)  

>In order to support the full spectrum of possible HTTP applications, Node's HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.

>为了能全面地支持可能的HTTP应用程序，Node提供的HTTP API都很底层。它只处理流处理和消息解析。它把一份消息解析成报文头和报文体，但是它不解析实际的报文头和报文体。

###http.Server

先用Node来创建一个简单的HTTP服务器：

    var http=require("http");
    http.createServer(function(request,response){
        response.writeHead(200,{
            "Content-Type":"text/html"
    	});
        response.write("<h1>Hello, CrispElite</h1>");
        response.end("<p>Bye bye!</p>");
    }).listen(3000);
    
    console.log("你的服务器已经启动！");

利用 http.createServer() 创建了一个 http.Server 的实例，将一个匿名函数用了处理请求。这个函数接收两个参数：请求对象和响应对象。createServer() 返回的还是 http.Server 的实例，方便链式调用。这个例子中，在 createServer() 之后直接调用了 http.Server 的 listen() 方法，监听3000端口。

http.Server 是 http 模块中的 HTTP 服务器对象。它继承自 EventEmitter，有用一套属于它自己的事件。最常用的当属<code>request</code>：当客户端请求到来的时候，request 事件被触发，提供两个参数 request 和 response 给回调函数，表示请求和响应的信息。createServer(callback) 方法是Node为 request 提供的一个快捷方法，其功能是创建一个 HTTP 服务器并将 callback 作为 reuqest 事件的监听函数，就想上面的例子一样。如果要显示的使用 request 事件来实现，其实就是这么回事：

    var http=require("http"),
        server=new http.Server();
    
    server.on("request", function(request,response){
        response.writeHead(200,{
            "Content-Type":"text/html"
    	});
        response.write("<h1>Hello, CrispElite</h1>");
        response.end("<p>Bye bye!</p>");
    });
    server.listen(3000);
    
    console.log("你的服务器已经启动！");

###http.ServerResponse
http.ServerResponse 是服务器返回给客户端的信息。一个由HTTP服务器内部创建的对象（不是由用户创建）。它将作为第二个参数传递到前面所说的 'request' 事件的监听器中。

http.ServerResponse 有很多方法，具体请戳[这里](http://nodejs.org/api/http.html#http_response_writecontinue)，其中有几个比较重要的成员函数。
####response.writeHead(statusCode, [header])
向请求的客户端发送响应头。这个函数在一个请求中最多只能调用一次，如果不调用则会自动生成一个响应头。注意，必须在调用 end()之前调用。

        var body = 'hello world';
        response.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain'
        });

要注意的是，Content-Length 以字节为单位而不是字符。上面的例子能够工作，是因为字符串 'hello world' 只包含单字节字符。如果报文主体内包含高位数的编码字符，然后就要使用Buffer.byteLength（）来确定在给定编码格式下的字节数。[原文](http://nodejs.org/api/http.html#http_response_writecontinue)。
  
####response.write(data, [encoding])
向请求的客户端发送响应内容。data 可以是一个 Buffer 或者字符串，表示要发送的内容，如果是字符串则需指定 encoding，默认是 utf-8。在 response.end() 调用之前，可以多次调用 write()。第一次调用 write() 时，它将发送缓冲的报头信息和第一个报文主体到客户端。当 write() 第二次被调用时，Node会假设你将要使用流数据，然后自动将响应内容分开发送。也就是说，响应被缓存到报文主体的第一块中。[原文](http://nodejs.org/api/http.html#http_response_write_chunk_encoding)。

>Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is again free.

####response.end([data], [encoding])
用于结束响应，通知客户端所有的发送已经完成。接收两个可选参数，意义和 write() 方法相同。这个函数在一个请求中必须被调用一次，如果不调用客户端将永远处于等待状态。

http.ServerResponse 也继承了 EventEmitter ，在官方的API文档中，目前（2015/05/13）只提供了两个事件：close和finish。
####Event:'close'
表明在 ServerResponse 的 end 方法被调用或者刷新之前，相关的连接已经被终止。
####Event:'finish'
当响应信息已经成功发送之后触发 finish 事件。更具体一点来说，当响应的报文头和报文体的最后一个分段被移交到操作系统用于网络传输时被触发。[原文](http://nodejs.org/api/http.html#http_event_close_1)。



##HTTP客户端

http模块提供了两个函数 <code>http.request</code>，<code>http.get</code>，其作用是作为客户端向HTTP服务器发起请求。

###http.request(options, callback)
发起HTTP请求，接受两个参数。options可以是一个对象或一个字符串。如果options是一个字符串, 它将自动使用url.parse()解析；callback是请求的回调函数。
options的常用参数如下：

* host：请求发送到的服务器的域名或IP地址。默认为'localhost'。
* hostname：用于支持url.parse()。hostname比host更好一些
* port：远程服务器的端口。默认值为80。
* method：指定HTTP请求方法的字符串。默认为'GET'。
* path：请求路径。默认为'/'。如果有查询字符串，则需要包含。例如'/index.html?page=12'。
* headers：包含请求头的对象。

<!-- http.request() 返回一个 http.ClientRequest的实例，这个实例是一个可写的流。如果想使用 "POST" 请求上传一个文件 -->
使用 http.request() 时，必须调用 response.end()，以此来向服务器表明请求结束，即使请求的主体中没有任何数据。

###http.get(options, callback)
因为大部分请求都是没有主体的GET请求，所以 Node 提供了这个方便的方法。它与 http.request() 唯一的区别就是自动将请求设为GET请求，同时自动调用 response.end()。

    http.get("http://www.google.com/index.html", function(res) {
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

###http.ClientRequest
http.ClientRequest 是 Node 内建的一个对象，调用 http.request() 和 http.get() 返回的就是这个对象。它表示一个已经产生并且正在进行的 HTTP 请求。它提供了一个 response 事件，当响应头被接收的时候，会在请求的对象上触发。http.request() 和 http.get() 第二个参数指定的回调函数的绑定对象就是它了。http.ClientRequest 和 http.ServerResponse 一样提供了 write() 和 end() 用于向服务器发送请求体。所有的写结束后必须调用 end() 通知服务器。更多详细信息请戳[这里](http://nodejs.org/api/http.html#http_class_http_clientrequest)。



关于 Node 中的 HTTP 模块肯定不止上面说到的这些，上面所讲到的只是一些常用的内容，通常用来处理简单的内容。如果想构建复杂的，全面的 Web 服务器，远远不够。当需要的时候多翻翻[手册](http://nodejs.org/api/http.html)，熟能生巧~
