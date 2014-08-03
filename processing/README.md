##引用 _config.yml 中的变量

    //引用主题的 `_config.yml` 中的 `menu`
    
    p #{theme.menu.Home}

    //引用外部的 `_config.yml` 中的 `title`

    h1 #{config.title}

##引用 site 中的变量

目测好像 根据一个 site 对象生成了所有的静态文件

可以按照生成的静态文件的目录 来访问对应的属性和属性值

    //获取所有的 categroies

    var categories=site.categoryies

categories 返回的是一个对象 Object。包含了很多个博文 所定义的分类，比如：前端，随笔。循环遍历得到的每一个对象都有如下相同的结构

    {
        "name":"前端",
        "_id":"qyruz88tfveiyz3f",
        "posts":["2qhjnuq6n5gfaryp","hbw0w4283rgjohax","xgp37n8mw1vwmt65","9ygsftdy7zqd1sd1","no1i9sy995i3xr6q"],
        "slug":"前端",
        "path":"categories/前端/",
        "permalink":"http://yoursite.com/categories/前端/",
        "length":5
    }

关于遍历，使用 jade 语法提供的方法 无法将对象很好的输出到页面中，一番努力之后，查看已有的 Hexo 主题的源文件，发现无论是使用的是 ejs 或者 jade ，使用的都是下面这种语法遍历：

    site.categories.each(function(item){
        p="Name: "+item.name
        p="Path: "+item.path
    });

**不要告诉我这是用jQuery的方法！**