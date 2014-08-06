##Hexo theme

I am planing to make a new theme for hexo. The old one named `Tinny`, not pretty.

##processing

still working on it

##Tinny

###theme for hexo

simple theme based on [pacman](https://github.com/A-limon/pacman).

[demo](http://zhanglun.github.io/)

###Installation

####Install

	$ git clone https://github.com/zhanglun/hexo-theme.git


####Enable

Modify <code>theme</code> setting in blog folder <code>_config.yml</code> to <code>Tinny</code>.

    theme: hexo-theme/Tinny

####Update

	cd themes/hexo-theme
	git pull

**please backup your _config.yml file before update.**

###Configuration

Modify settings in the file <code>_config.yml</code>

####enable duoshuo

add short name of duoshuo in `_config.yml`:

```
duoshuo: 
  enable: true  ## duoshuo.com
  short_name: <your short name>    ## duoshuo short name.
```

edit `comment.ejs` to put the same short name here:

```js
var duoshuoQuery = {short_name:"<your short name>"};
...
```


2014/08/06



