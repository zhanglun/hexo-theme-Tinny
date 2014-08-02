title: jQuery 笔记 - DOM 操作  
date: 2014-07-15 22:23   
tags: [jQuery] 

---

过去一直对 jQuery 一知半解的状态，在这段时间的工作中暴露了。事实证明，实践出真知！现在把遇到的不熟练的记下来。见一个，补充一个！

##DOM操作

###搜索父元素操作

#####parents([selector])
用于获取**当前匹配元素集合**中**每个元素**的**祖先元素**，根据需要还可以**使用一个选择器进行筛选**。     

    $("p").parents(“li”); //搜索p 的父元素中的 li 元素

这个方法要注意的问题：

1. 从父元素开始匹配查找
2. 一直向上查找直到根元素，然后把这些元素放进一个临时集合中，再用给定的选择器表达式去过滤
3. 可能包含0个、1个或者多个元素
    
####closest(selector[, context])
该方法从**元素本身开始**，逐级向**上级元素匹配**，并**返回最先匹配的元素**。

    $("a").closest("div").css("border", "1px solid blue");

这个方法要注意的问题：

1. 从当前元素匹配查找
2. 逐级向上查找，直到发现匹配的元素后就停止了， 其实可以说是找到最近的父元素
3. 返回0或者1个元素

####parent([selector])
用于获取**当前匹配元素集合**中**每个元素的父元素**，根据需要，还可以**使用一个选择器进行筛选**。

####parentsUtil([selector])
用于获取**当前匹配元素集合**中**每个元素的祖先元素**，直至给定选择器匹配的元素(但**不包括该元素**)

    //从 li#li2 开始向上找它的父元素直到 遇到元素 #ul1_li2，但是不将 #ul1_li2 加入包装集 
    $("li#li2").parentsUtil("#ul1_li2").css("background", "#FCF");
    
####offsetParent( )方法
格式如下：`offsetParent( )`，用于搜索第一个匹配元素的已定位的父元素，仅对可见元素有效。  
该方法查找第一个匹配元素的已定位元素，并返回由该元素包装成的jQuery对象。


###查找兄弟元素

####prev([selector])

    Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.

假设有一个包含一系列 DOM 元素的 jQuery 对象包装集，利用 `.prev()` 方法搜索每一元素在 DOM 树中的紧邻的兄弟元素并且返回一个包含匹配元素的 jQuery 对象包装集。

这个方法也接受一个选择器来过滤匹配的结果。比如下面的例子，[demo请戳这里](http://jsbin.com/pejub/1/edit)

    <ul>
      <li>list item 1</li>
      <li>list item 2</li>
      <li class="third-item">list item 3</li>
      <li>list item 4</li>
      <li>list item 5</li>
    </ul>
    
    $( "li.third-item" ).prev().css( "background-color", "red" );
    
先找到 class 为 third-item 的li，使用 `prev( )` 向前找到它的第一个兄弟元素，修改父元素的背景颜色。
    
####prevAll( )
    
    Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
    
假设有一个包含一系列 DOM 元素的 jQuery 对象包装集，利用 `.prevAll()` 方法搜索每一元素在 DOM 树中的所有的前面的兄弟元素并且返回一个包含匹配元素的 jQuery 对象包装集。
这个方法也接受一个选择骑来过滤匹配的集合。

    <ul>
      <li>list item 1</li>
      <li>list item 2</li>
      <li class="third-item">list item 3</li>
      <li>list item 4</li>
      <li>list item 5</li>
    </ul>
    
    $( "li.third-item" ).prevAll().css( "background-color", "red" );


####prevUtil( )

    Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
    
    



      

    