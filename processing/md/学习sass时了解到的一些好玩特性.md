title: 学习sass时了解到的一些好玩特性
date: 2014-05-08 21:34
tags: [sass,css]

---

很久很久以前，我根据网上的博文总结写了一篇博客[《sass基本语法》](http://zhanglun.github.io/2014/03/10/sass%E8%AF%AD%E6%B3%95/)。在那之后平时虽然不太用到sass（因为没项目做，只能自己写着玩玩），但是也还一直在试着使用sass，提高熟练度。现在写写在学习过程中的总结。

<!--more-->

众所周知，**[sass](http://sass-lang.com/)**是众多CSS预处理器中的一员，基于ruby语言开发的。它可以使用变量，嵌套，混入，继承，运算，函数等编程语言具有的特性进行CSS的开发，使得CSS的开发变得简单粗暴清晰可维护。相比书写CSS文件，书写sass多了很多不曾有过的快感。前面的提到的那些CSS没有的特性，灵活运用之后，可能会让你大吃一惊。

###计算布局

sass允许我们在书写过程中使用“加减乘除”运算，我们可以这样写 <code>width:$page_width\*0.1</code>，width的值将不再是硬编码的一个固定的数值，而是变量$page_width中定义的值的0.1倍。当编译成CSS文件时，width会输出一个确定的值。比如说我们定义一个页面的内容区域宽度为<code>500px</code>，然后我们可以以这个宽度为基础，用一定的比例来设置侧边栏的宽度:$page_width*0.2。当我们想修改页面内容区域的宽度的时候，侧边栏会按照设定的比例变化而不用手动修改。要注意的是，如果使用不同单位进行运算，sass会试着编译，如果没有编译成功便会输出error。比如：你不能用20px和2em相加，这没有意义。

    //使用加减乘除标准运算，定义变量
    $width: 10px;
    $double_width: $width * 2;
    $half_width: $width / 2;
    $width_plus_2: $width + 2;
    $width_minus_2: $width - 2;

    //在行间使用计算式
    $width: 500px;
    $sidebar_percent: 0.2;
    #page {
        width: $width;
        #sidebar {
            width: $width * $sidebar_percent;
        }
        #content {
            width: $width * (1 - $sidebar_percent);
        }
    }
    //编译输出
    #page {
        width: 500px;
    }
    #page #sidebar {
        width: 100px;
    }
    #page #content {
        width: 400px;
    }

###使用高级方法设置颜色

如果我们想修改颜色，比如提供亮度，增加饱和度，我们要打开调色盘，然后选中找到你想要的颜色，然后找到对应的颜色代码，复制，粘贴……而sass通过添加一些函数让整个过程变得简单轻松。下面是sass中常用的颜色函数

**Lighten/Darken函数，修改亮度**

    #page{
        color:lighten(#336699,20%);
    }
    //编译后的CSS
    #page{
        color:#6699cc;
    }
    
**Saturate/Desaturate函数，修改饱和度**

    $main_color:#336699;
    #page{
        color:saturate($main_color,30%);
    }
    //编译后的CSS
    #page{
        color:#1466b8;
    }
    
**adjust-hue函数，修改色度**

    $main_color:#336699;
    #page{
        color:adjust-hue($main_color,180);
    }
    #page{
        color:adjust-hue(desaturate($main_color,10%),90);
    }

    //编译之后的CSS
    #page {
        color: #996633;
    }

    #page {
        color: #8f3d8f; 
    }
    
**grayscale函数，100%\降低饱和度，这个方法与下面代码是一样的效果。**

    desaturate(#336699,100%);

**Mix函数，混合颜色**

    #page{
        color:mix(#336699,#993266);
    }
    //编译后的CSS
    #page {
        color: #664c7f;
    }

有了这些，颜色方案再怎么改也不怕了！！

###导入其他sass文件

在开发的过程中，将一个大样式表拆分成若干个小的样式表对网页的性能的影响不言而喻。如果一个简单的页面去包含了五六个样式表，这会严重影响到页面的加载速度。 通过<@import "filename">可以将很多文件转换成一个文件。这样一来，开发过程中，将模块拆分开方便开发，而最终还是只有一个样式表被引用到页面中。

注意，使用<code>@import</code>引入其他文件时，如果不希望引入的文件也生成CSS文件，只要将引入的文件名前面加上一个下划线。在main.scss中colors.scss引入之后会编译生成mian.css和colors.css两个文件。将colors.scss文件名改成“_color.scss”，main.scss中依旧是“@import "colors";”（不用加上文件名前面的下划线），然后重新编译，便不会输出colors.css文件。切记切记。

###创建一个字体库

在普通的CSS文件中，我们通常这样定义字体：

    font-family: "helvetica neue", arial, helvetica, freesans,"liberation sans", "numbus sans l", sans-serif;

我们必须按照我们顺序列出我们需要的字体。如果我们想在页面中切换使用的字体，我们要从这里复制，粘贴到那里……现在我们有简单的方法了。可以在页面的顶部定义变量，使用变量代替那些冗长的字体名。当你想使用这些字体时，只需使用事先定义好的变量。为了方便管理，可以将默认的字体的定义放在文件的头部，或者单独写在一个文件中，使用<code>@import</code>引入。

###使用@extend保持语义化

保持语义化是一门哲学，使得事物合乎逻辑。我们根据功能取名字而不是样式，比如：不会使用<code>.bule_button</code>，而是使用<code>.checkout_button</code>，后者远比前者有用。如果你写了一些属性制作一个蓝色按钮，需要将他们应用到很多不同功能的按钮上，你会怎么做？难道一遍遍的复制，粘贴吗？sass中的<code>@extend</code>可以从class或者ID中复制属性和属性值，然后将它们添加到另一个class或者ID的属性列中。

首先要去确保在别处已经定义了class：

    .blue_button {
        background: #336699;
        font-weight: bold;
        color: white;
        padding: 5px; 
    }

然后可以将其拓展到其他的class或者ID：

    .checkout_button {
        @extend .blue_button     
    }
    //编译后的CSS
    .blue_button, .checkout_button {
        background: #336699;
        font-weight: bold;
        color: white;
        padding: 5px; 
    }
    
你会注意到输出的CSS有两个选择器。<code>@extend</code>所做的是合并所有的属性和属性值，同时也会合并拓展的对象和自身的class或者ID。

###使用@mixin保持代码的整洁

利用mixin可以将一部分CSS从代码中抽出，定义成一个模块重复使用。可以在公用的样式中定义一个mixin模块，需要的时候直接调用就好了。同时，mixin还可以传递参数。

使用<code>@mixin</code>定义一个mixin模块，后面紧接着mixin的名，可以传递参数，同时给参数设定一个默认值。 但是要注意，参数也是要用$开始，而且参数名和参数值是用**冒号**分开。如果一个属性有多个值，比如box-shadow等，那参数就用变量名加上三个点表示" **$variable...** " 。

	//声明一个mixin模块
	//boxRect
	@mixin boxRect($W:20px,$H:20px){
		width:$W;
		height:$H;
	}
	//box-shadow
	@mixin shadow($shadow...){
		-webkit-box-shadow:$shadow;
		-moz-box-shadow:$shadow;
		-o-box-shadow:$shadow;
		box-shadow:$shadow;
	}

定义了mixin模块之后，使用<code>@include</code>。mixins也能够帮助保持代码的语义化；。可以定义一个<code>blue_text</code>模块，然后把它应用到更加语义化的class或者ID中，比如<code>product_title</code>。通过<code>@import</code>将mixin模块引入主文件中，很好地分割样式表，保持主样式表的整洁。
    
    //定义一个模块
    @mixin blue_text {
        color: #336699;
        font-family: helvetica, arial, sans-serif;
        font-size: 20px;
        font-variant: small-caps; 
    }
    //使用模块
    .product_title {
        @include blue_text;     
    }
    //编译后的CSS
    .product_title {
        color: #336699;
        font-family: helvetica, arial, sans-serif;
        font-size: 20px;
        font-variant: small-caps; 
    }
    
###利用mixin创建动态的属性名和选择器

用<code>#{}</code>包裹住变量名就可以了！！！！！！

    @mixin car_make($car_make, $car_color) {
    // 用$car_make动态生成以"_make"结尾的class
        .car.#{$car_make}_make {
            color: $car_color;
            width: 100px;
            .image {
                background:url("images/#{$car_make}/#{$car_color}.png");
            }
        }
    }
    @include car_make("volvo", "green");
    @include car_make("corvette", "red" );
    @include car_make("bmw", "black");
    //编译后的CSS
    .car.volvo_make {
        color: "green";
        width: 100px; 
    }
    .car.volvo_make .image {
        background: url("images/volvo/green.png"); }
    .car.corvette_make {
        color: "red";
        width: 100px; 
    }
    .car.corvette_make .image {
        background: url("images/corvette/red.png");              
    }
    .car.bmw_make {
        color: "black";
        width: 100px; 
    }
    .car.bmw_make .image {
        background: url("images/bmw/black.png"); 
    }

###使用@each为不同变量复制相同的样式

假设有很多url相似的图片，我们需要用图片的名字作为class的一部分引用图片。通常我们要分开书写每一个选择器，复制，粘贴……使用@each可以解决这个问题。

在<code>@each</code>后面接着形参，然后是我们想使用的变量，即实参。参数要用<code>#{}</code>包裹。

    @each $member in thom, jonny, colin, phil {
        .#{$member}_picture {
            background-image: url("/image/#{$member}.jpg"); 
        }
    }
    //编译后的CSS
    .thom_picture {
        background-image: url("/image/thom.jpg"); 
    }
    .jonny_picture {
        background-image: url("/image/jonny.jpg");     
    }
    .colin_picture {
        background-image: url("/image/colin.jpg"); 
    }
    .phil_picture {
        background-image: url("/image/phil.jpg"); 
    }
    
###使用@if让mixin模块更灵活

通常书写一个模块的目的是想跨项目使用，希望可以对传入的参数作出反应。比如有一个mixin模块<code>width</code>，当一个参数是一个比0小的数字是，希望他不做任何事情。在很多时候，我们都希望自己的模块可以根据参数做出灵活的处理。而<code>@if</code>可以帮我们做到。

    //使用@if创建一个mixin模块
    @mixin country_color($country) {
        @if $country == france {
            color: blue; 
        }
        @else if $country == spain {
            color: yellow; 
        }
        @else if $country == italy {
            color: green; 
        }
        @else {
            color: red; 
        }
    }
    .england {
        @include country_color(england); 
    }
    .france {
        @include country_color(france); 
    }
    //编译后的CSS
    .england {
        color: red; 
    }
    .france {
        color: blue;
    }
    



>未完待续……



