title: 边用边学—Linux命令行(持续更新)  
date: 2014-07-12 18：12  
tags: [Linux, 命令行, 笔记]    
---

####文件操作

    删除空目录  --->  rmdir dir  
    删除非空目录 --->  rm -rf dir

####Nignx

切换至 nginx.conf 所在的目录，执行下面的命令：

    sudo nginx
    
如果不知道 nginx.conf 具体的路径，可以使用 `nginx -t` 来查看。当你执行 nginx -t 得时候，nginx会去测试你得配置文件得语法，并告诉你配置文件是否写得正确，同时也告诉了你配置文件得路径：

    # nginx -t
    nginx: the configuration file /usr/local/etc/nginx/        nginx.conf syntax is ok
    nginx: configuration file /usr/local/etc/nginx/    nginx.conf test is successful
    


