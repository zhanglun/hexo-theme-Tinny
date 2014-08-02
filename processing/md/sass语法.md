title: sass基本语法
category: 前端
date: 2014-03-10 20:20
tags: [CSS , sass]
---

**[sass](http://sass-lang.com/)**是一种基于ruby语言开发的CSS预处理器。它可以使用变量，嵌套，混入，继承，运算，函数等编程语言具有的特性进行CSS的开发，使得CSS的开发变得简单粗暴清晰可维护。  
sass有两种后缀文件格式：一种是sass后缀形式；一种是scss后缀形式。我选择的后缀是scss
<!-- more -->


##注释
sass有两种注释方式：一种是"/\* \*/"，标准的CSS注释；还有一种是双斜杠形式"//"。  
前者在编译之后会作为注释在CSS文件中出现，但是后者不会。  

##变量(variable)
sass可以像编程一样编写CSS。在sass中可以声明变量，并在整个样式表中调用，是不是很酷？你可以在文件的任意位置声明变量，但是必须先声明才能使用。

变量的声明必须是**$开头**，后面接着变量名，（就像php一样），而变量名和变量值之间则用：连接（就像写CSS一样）。在值的后面加上**!default**表示默认值。如果变量需要镶嵌在字符串之中，就必须需要写在#{}之中。

	//单行注释，不会被编译在CSS文件上
	/*基本样式定义*/

	//这里是声明变量
	$globalFontSize:1em;
	$headerH1:1.5em;
	$bodyBgRed:red;
	$textColor:#343 !default;//默认值
	$SIZE:size;

	//这里调用变量，先声明才能调用
	body{
		font-#{$SIZE}:$globalFontSize;
		background:$bodyBgRed;
		color:$textColor;
	}

	------------

	//编译后得到的CSS
	/*基本样式定义*/
	body {
	  font-size: 1em;
	  background: red;
	  color: #334433; 
	}

	
也可以在写CSS部分的时候重新定义属性值，这样我们就不用修改引用的文件，只要重新定义需要修改的变量就可以了。
	
	//这里重新定义属性值
	body{
		font-size:$globalFontSize;
		background:$bodyBgRed;
		color:#999;//重新定义了color的值
	}

	------------

	//编译后得到的CSS
	body {
	  font-size: 1em;
	  background: red;
	  color: #999; 
	}


一个变量也可以设置多个值，通过**nth($variables,index)**来调用其中的值,**其中index从1开始，不是0。**
	
	//声明变量
	$textColor:#343434 #f00 #fff #456 !default;
	//调用
	body{
		color:nth($textColor,1);//选择了$textColor的第一个值#343434
	}
	a{
		color:nth($textColor,2);//选择了$textColor的第二个值#f00
	}
	p{
		color:$textColor;
	}

	----------

	//编译后得到的CSS
	body {
	    color: #343434;
	}
	a {
	    color: red;
	}
	p {
	    color: #343434 red white #445566;
	}

	//**p部分编译之后color的属性值包括了$textColor所有的值；**
	//color:#343434 #f00 #fff #456;

##嵌套(nesting)
sass分两种嵌套：一种是**选择器嵌套**；一种是**属性嵌套**。  
###选择器嵌套
通过在一个选择器中嵌套另一个选择器实现继承。在嵌套过程中。可以用&表示父元素选择器。  
	
	//sass
	$float:left right;
	$navBg:#345;
	.nav{
		padding:10px;
		width:960px;
		background:$navBg;
		li{
			float:nth($float,1);
		}
		a{
			display:block;
			padding:5px 10px;
			color:#fff;
			&{
				/*写在a的内部第一层*/			
				font-size:30px;
			}
		}
		&{
			/*写在a的外部，.nav的内部第一层*/
			font-size:30px;
		}
	}

	--------
	//编译后的CSS	
	 .nav {
	    padding: 10px;
	    width: 960px;
	    background: #334455;
	}
	.nav li {
	    float: left;
	}
	.nav a {
	    display: block;
	    padding: 5px 10px;
	    color: #fff;
	}
	.nav a {
	    /*写在a的内部第一层*/
	    font-size: 30px;
	}
	.nav {
	    /*写在a的外部，.nav的内部第一层*/
	    font-size: 30px;
	}

###属性嵌套
有些CSS属性有相同的单词开头，如background，可以利用属性嵌套来编写。  

	//sass
	body{
		background:{
			color:#343;
			image:url(../images/bg.png);
			repeat:repeat;
			position:left top;
			attachment:scroll;
			clip:content-box;
			size:50%;
		}
	}

	-------

	//编译后的CSS

	body {
	  background-color: #343;
	  background-image: url(../images/bg.png);
	  background-repeat: repeat;
	  background-position: left top;
	  background-attachment: scroll;
	  background-clip: content-box;
	  background-size: 50%;
	}


##混合(mixin)
估计mixin可以算是sass中最强大的特性，利用mixin可以将一部分CSS从代码中抽出，定义成一个模块重复使用。可以在公用的样式中定义一个mixin模块，需要的时候直接调用就好了。同时，mixin还可以传递参数，尼玛越来越向编程了……
####声明一个mixin模块
使用**@mixin**声明一个mixin，后面紧接着mixin的名，可以传递参数，同时给参数设定一个默认值。 但是要注意，参数也是要用$开始，而且参数名和参数值是用**冒号**分开。如果一个属性有多个值，比如box-shadow等，那参数就用变量名加上三个点表示" **$variable...** " 。

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

上述代码简单的声明了两个mixin模块。

####调用声明的mixin模块

用**@include**调用已经声明的模块。  
在@include之后紧接着mixin模块名，就像调用函数一样（尼玛简直就是在编程啊），如果模块有默认参数。模块后面的括号可以省略。
	
	//sass
	.boxRect400{
		@include boxRect();//不加参数，使用默认参数，可以省略括号,也可以留着
	}
	.boxRect200{
		/*调用了boxRect模块*/
		@include boxRect(20px,10px);
	}
	.shadow{
		/*调用了shadow模块*/
		@include shadow(0 1px 1px rgba(0,0,0,0.5));
	}	
	.nav{
		@include boxRect(10px,10px);
		@include shadow(0 1px 1px rgba(0,0,0,0.5));
		&:hover{
			@include shadow(0 2px 3px rgba(0,0,0,0.7));
		}
	} 

	-------

	//编译后的CSS
	 .boxRect400 {
	    width: 20px;
	    height: 20px;
	}
	.boxRect200 {
	    /*调用了boxRect模块*/
	    width: 20px;
	    height: 10px;
	}
	.shadow {
	    /*调用了shadow模块*/
	    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    -o-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	}
	.nav {
	    width: 10px;
	    height: 10px;
	    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    -o-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
	}
	.nav:hover {
	    -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.7);
	    -moz-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.7);
	    -o-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.7);
	    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.7);
	}


####@content的诞生
为了解决CSS3中@media带来的麻烦，sass引入了**@content**使得mixin可以接受一整块的样式。

	//声明模块
	//这个模块包含了要定义的属性，和前面的讲到的使用是一样的
	@mixin mediaContent(){
		width:200px;
		height:100px;
		color:#345;
		font-size:20px;
	}
	//使用@content来引入一整块样式
	@mixin max-screen($max){
		@media screen and (max-width:$max){
			@content;//接受的样式块从这里开始
		}
	}
	//调用模块
	@include max-screen(720px){
		body{
			@include mediaContent();
		}
	}

	-------

	//编译后的CSS
	@media screen and (max-width: 720px) {
	  body {
	    width: 200px;
	    height: 100px;
	    color: #345;
	    font-size: 20px;
	  }
	}

##继承(extend)

@extend可以复制一个class或者ID中的属性，然后将它们添加到另一个class或者ID的属性列中。

	//sass
	//sass
	.blue_button{
		background:#336699;
		font-weight:bold;
		color:white;
		padding:5px;
	}
	.org_button{
		border-color:orange;
	}
	//对比一下@include
	@mixin red_button(){
		background:#f00;
		font-weight:bold;
		color:white;
		padding:5px;
	}
	@mixin org_button(){
		border-color:orange;
	}
	.checkout_button{
		//继承了两个class
		@extend .blue_button;
		@extend .org_button;
		//引用了两个模块
		@include red_button();
		@include org_button();
	}
	
	
	-------

	//编译之后的CSS
	.blue_button, .checkout_button {
	    background: #336699;
	    font-weight: bold;
	    color: white;
	    padding: 5px;
	}
	.checkout_button {
	    background: #f00;
	    font-weight: bold;
	    color: white;
	    padding: 5px;
	}

可以看到，使用@include即引用模块时，其实是以复制的形式添加目标的属性，而使用@extend即
继承时，则是将被继承的对象和自身联合，在文件中一起声明一次，大家都叫“联合声明”。
####占位选择器
从3.2。0之后可以定义占位选择器%。  
假设在基础文件中定义了很多基础的样式，然后实际上不管是否使用@extend继承相应的样式，所有的代码都会编译解析成CSS，这样一来就会有很多多余的CSS。占位选择器的诞生很好的解决了这个问题。添加了占位选择器之后，只有被继承了的部分才会被解析出来。

	//sass
	%bgRed{
		background:red;
	}
	bgBlue{
		background:blue;
	}
	%bgYellow{
		background:yellow;
	}
	body{
		@extend %bgRed;
	}

	-------

	//编译之后的CSS
	body {
	    background: red;
	}
	.bgBlue {
	    background: blue;
	}


定义了两个占位选择器%bgRed和%bgYellow，但是%bgYellow没有调用，所以在解析的时候便不会包含bgYellow部分。
占位选择器可以使CSS文件更加精炼简洁。一般用在定义基础的样式定义上。  

##运算
sass可以对数值进行加减乘除四则运算。注意运算符前面要加上一个空格。  

	$baseFontSize:14px;
	$baseWidth:200;
	
	//
	$baseHeight:($baseFontSize *$baseWidth)/2+30;
	body{
		height:$baseHeight;
	}

	-------

	//编译之后的CSS
	body {
	  height: 1430px;
	}

值得注意的是：在运算表达式中，如果有多个变量，最好保证只有一个带单位的变量，不然很有可能报错。上述的代码中，如果将$baaeWidth中的"200"改成"200px",就有多个单位，将会报错，无法通过编译。

##函数
sass定义了一些很多函数可以使用，同时也可以自己定义函数，@function。
使用函数的方法也很简单，使用函数名加上括号就可以了，有参数的话就带上参数。  

	//sass
	@function pxToRem($px){
		@return $px / $baseFontSize *1rem;
	}

#####sass几个常见用的颜色函数
Lighten/Darken函数，修改亮度
		
	#page{
		color:lighten(#336699,20%);
	}
	//编译后的CSS
	#page{
		color:#6699cc;
	}
Saturate/Desaturate函数，修改饱和度

	$main_color:#336699;
	#page{
		color:saturate($main_color,30%);
	}
	//编译后的CSS
	#page{
		color:#1466b8;
	}
adjust-hue函数，修改色度

	$main_color:#336699;
	#page{
		color:adjust-hue($main_color,180);
	}
	#page{
		color:adjust-hue(desaturate($main_color,10%),90);
	}

	//编译之后的CSS
	#page {
	  color: #996633; }
	
	#page {
	  color: #8f3d8f; 
	}
grayscale函数，100%\降低饱和度，这个方法与下面代码是一样的效果。

	desaturate(#336699,100%);

Mix函数，混合颜色
	
	#page{
		color:mix(#336699,#993266);
	}
	//编译后的CSS
	#page {
	    color: #664c7f;
	}

##选择和循环
条件判断
sass真的就是将CSS当成编程语言来折腾了。提供**判断**和**循环**来编写CSS。
####选择
**@if**可可以和**@else**结合多条件使用，就像写程序一样。

	//sass
	$type: monster;
	p {
	  @if $type == ocean {
	    color: blue;
	  } @else if $type == matador {
	    color: red;
	  } @else if $type == monster {
	    color: green;
	  } @else {
	    color: black;
	  }
	}

	-------
	//编译之后的CSS
	p {
	  color: green; 
	}

####for循环

for循环有两种形式，分别为：  

	@for $var from <start> through <end>
  
和

	@for $var from <start> to <end>。
  
$i表示变量，start表示起始值，end表示结束值，这**两个的区别**是关键字**through**表示**包括end**这个数，而**to**则**不包括end**这个数。

	//sass
	@for $i from 1 through 3 {
  		.item-#{$i} { width: 2em * $i; }
	}
	
	-------
	//编译之后的CSS
	.item-1 {
	  width: 2em; 
	}
	.item-2 {
	  width: 4em; 
	}
	.item-3 {
	  width: 6em; 
	}

####sass中的三目运算
if($condition, $if_true, $if_false) 。  
三个参数分别表示条件，条件为真的值，条件为假的值。

	if(true, 1px, 2px) => 1px
	if(false, 1px, 2px) => 2px
   
---

>基本语法结束，在学习过程中感觉到了sass的魅力。编写CSS变得有趣，而且简单粗暴！！！！！