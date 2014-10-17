## 参考文章
[http://my.oschina.net/youxiachai/blog/121659](http://my.oschina.net/youxiachai/blog/121659) 包含详细的参数介绍

### site
```js
{
    "posts":"所有文章，根据发表日期降序排列 Collection事件",
    "pages":"所有页面，根据发表日期降序排列 Collection事件",
    "categories":"所有分类，根据字母顺序排列, Taxonomy 事件",
    "tags":"所有标签，根据字母顺序排列 Taxonomy 事件"
}
```

例如获取所有文章标题:

    <% site.posts.each(function(item){ %> <br /><%= item.title%> <br /><% }); %>










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

但是 在引用主题中的 widget 时，又遇到了问题，theme.widget 在配置文件中 是像这样的格式

    #### Widgets
    widgets:
    - category
    - archive
    - tag

返回的是一个数组，可以使用像在js中操作数组一样操作返回的数组，for循环遍历或者使用 JS 中原生的 [forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)。

而菜单返回的是对象，在配置文件中的写法如下：

    menu:
      首页: #
      归档: http://www.baidu.com
      关于: http://ncuey.sinaapp.com/CrispElite/
      github: https://github.com/zhanglun
      博客园: http://www.cnblogs.com/zhanglun/

这应该和配置文件的语法有关系

##language

在 language 文件夹中的三个文件 对应不同 lang 所采用的 语言，在制作过程需参考该文件，比如在 zh-CN.yml 中

    categories: 分类
    search: 搜索
    tags: 标签
    tagcloud: 标签云
    prev: 上一页
    next: 下一页
    comment: 文章评论
    contents: 文章目录
    archive_a: 归档
    archive_b: 归档：%s
    page: 第 %d 页
    recent_posts: 近期文章
    menu: 菜单
    links: 友情链接
    rss: RSS 订阅
    showsidebar: 显示侧边栏
    hidesidebar: 隐藏侧边栏
    updated: 更新日期

左边的变量需在代码中使用，

    h2= __('archive_a') //我参考已有的主题尝试得出的结果。
    
    

#其他变量

##page 

for遍历之后输出如下：

    3
    
    path
    
    per_page
    
    base
    
    total
    
    current
    
    current_url
    
    posts
    
    prev
    
    prev_link
    
    next
    
    next_link
    
    
