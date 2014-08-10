title: 专业填坑-IE下 A 标签的虚线框和必须要会用的 CSS 选择器
date: 2014-07-18 20:39
tags: [CSS, 笔记, 兼容性, 填坑日记]
---
###IE 下 a标签的虚线框
在 IE 中，点击 a 标签时， a 标签会被加上一个虚线框，很丑！！！！！ 

![image](http://img3.picbed.org/uploads/2014/07/QQ20140718_1.png)

不同版本的IE解决方案不同：IE8 下只需为 a 标签添加一条 CSS 属性就可以 `outline:none`，顺便一提 ，这条属性可以取消浏览器中输入框获得焦点是丑逼逼的外框

![image](http://img3.picbed.org/uploads/2014/07/QQ20140718_2.png)

但是在高贵的 IE7 中，即使是添加了 `outline: none`，虚线框依旧存在，在 HTML 上加 `hidefocus="true"`　如 

    <a href="http://www.zhanglun.github.io/" class="active" hidefocus="true">

---
  
###强大的CSS选择器

项目最低的兼容要求是 IE8 ，所有很多以前由于兼容性问题而不常用的CSS选择器和属性都可以使用。下面记录的都是以前基本上没有用到的但是却很有用的选择器，就拿属性选择器来说，简直遍地都是。

#####直接相邻选择器 X+Y （兼容浏览器：IE7+、Firefox、Chrome、Safari、Opera）
    
    ul + p {
        color: red;
    } 

匹配在ul后面的第一个p，将段落内的文字颜色设置为红色。(只匹配第一个元素)。  

#####子选择器 X>Y （兼容浏览器：IE7+、Firefox、Chrome、Safari、Opera）
    
    div#container > ul {
        border: 1px solid black;
    } 

    <div id="container">
        <ul class="son">
            <li> List Item
                <ul>
                    <li> Child </li>
                </ul>
            </li>
            <li> List Item </li>
            <li> List Item </li>
            <li> List Item </li>
        </ul> 
    </div>
    
与后代选择器X Y不同的是，子选择器只对X下的**直接子级Y**起作用。在上面的css和html例子中，div#container>ul仅对container中**最近一级的ul**起作用(即拥有类名 son 的 ul)。  


####间接相邻选择器 X ~ Y （兼容浏览器：IE7+、Firefox、Chrome、Safari、Opera  ）
    ul ~ p {
        color: red;
    }
与前面提到的 X+Y 不同的是，X~Y 匹配与 X **相同级别的所有Y元素**，而**X+Y只匹配第一个**。   

这些选择器，给人的感觉是根据 HTML 的结构来选择对应的元素，比如说：选择在页面中相邻的元素；根据父元素选择子元素，或者兄弟元素，都依赖着结构，利用A去寻找B。下面说的 **属性选择器** 给人的感觉就不太一样

####属性选择器 （兼容浏览器：IE7+、Firefox、Chrome、Safari、Opera）

#####X[title]——匹配的是带有 **title** 属性的链接元素  
    
    a[title] {
        color: green;
    }
  

#####X[title="foo"]——匹配所有拥有href属性，且**href为http://css9.net**的所有链接

    a[href="http://css9.net"] {
        color: #1f6053; 
    }

#####X[title*="zhanglun"]——匹配的是href中**包含"zhanglun"**的所有链接
    a[href*="css9.net"] {
        color: #1f6053;
    }
  

#####X[href^="http"]——匹配的是href中**所有以http开头**的链接

    a[href^="http"] {
        background: url(path/to/external/icon.png) no-repeat;
        padding-left: 10px;
    }
    

#####X[href$=".jpg"]——匹配的是**所有链接到扩展名为.jpg图片的链接**

    a[href^="http"] {
        background: url(path/to/external/icon.png) no-repeat;
        padding-left: 10px;
    }   

#####X[data-*="foo"]——匹配属性 data-* 为 "foo" 的元素

在上一个选择器中提到如何匹配所有图片链接。如果使用X[href$=".jpg"]实现，需要这样做：
    
    a[href$=".jpg"],
    a[href$=".jpeg"],
    a[href$=".png"],
    a[href$=".gif"] {
        color: red;
    }
     
看上去比较麻烦。另一个解决办法是为所有的图片链接加一个特定的属性，例如‘data-file’

    html代码
    <a href="path/to/image.jpg" data-filetype="image"> 图片链接 </a> 
    
    css代码如下：
    a[data-filetype="image"] {
        color: red;
    }
    
这样所有链接到图片的链接字体颜色为红色。  

#####X[foo~="bar"]——匹配属性值中用空格分隔的多个值中的一个

    html代码
    <a href="path/to/image.jpg" data-info="external image"> Click Me, Fool </a> 
    
    css代码
    a[data-info~="external"] {
        color: red;
    }
    a[data-info~="image"] {
        border: 1px solid black;
    }
     
在上面例子中，匹配data-info属性中包含“external”链接的字体颜色为红色。匹配data-info属性中包含“image”的链接设置黑色边框。  
兼容浏览器：IE7+、Firefox、Chrome、Safari、Opera    


