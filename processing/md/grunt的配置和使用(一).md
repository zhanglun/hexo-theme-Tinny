title: Grunt的配置和使用(一)
data: 2014-07-10 21:09
tag: [Grunt, 工具]

---

Grunt 和 Grunt 的插件都是通过 Node.js 的包管理器 npm 来安装和管理的。为了方便使用 Grunt ，你应该在全局范围内安装 Grunt 的命令行接口(CLI)。要做到这一点，你可能需要使用 sudo (OS X，*nix，BSD 等平台中)权限或者作为超级管理员( Windows 平台)来运行 shell 命令。

    npm install -g grunt-cli
   
使用全局安装之后，可以在任何一个目录中运行 grunt 命令。

###如何工作

每次运行 grunt 时，它都会使用 node 的 require() 系统查找本地已安装好的 grunt。在本地装好 Grunt 之后，运行 gurnt 命令时，CLI 就会加载这个本地安装好的 Grunt 库，然后应用你项目中的 Gruntfile 中的配置(这个文件用于配置项目中使用的任务)，并执行你所指定的所有任务。而 Grunt 库的安装则依赖 package.json 文件。

假设已经安装好 Grunt CLI 并且项目也已经使用一个 package.json 和一个 Gruntfile 文件配置好了，那么接下来用 Grunt 进行工作就非常容易了：


1. 进入到项目的根目录(在命令行面板定位到项目根目录。在 windows 系统下，也可以进入项目根目录的文件夹后，按Shift+鼠标右键，打开右键菜单，选择“在此处打开命令窗口(W)”)。
2. 运行 npm install 安装项目相关依赖(插件，Grunt 内置任务等依赖)。
3. 使用 grunt (命令)运行 Grunt。

###构建一个新的 Grunt 项目

最简单的配置需要两个文件：`package.json` 和 `Gruntfile`

**package.json**：这个文件被用来存储已经作为 npm 模块发布的项目元数据(也就是依赖模块)。你将在这个文件中列出你的项目所依赖的Grunt(通常我们在这里配置Grunt版本)和Grunt插件(相应版本的插件)。使用命令 `npm install` 安装依赖模块。

**Gruntfile**：通常这个文件被命名为Gruntfile.js或者Gruntfile.coffee，它用于配置或者定义Grunt任务和加载Grunt插件。

####package.json

`package.json` 与 `Gruntfile` 相邻，都归属在项目的根目录中。在目录中运行 `npm install` 安装需要的依赖模块。其创建方式有几种：

1. `grunt-init` 命令创建 Grunt 模板时，会自动为项目创建一个 `package.json` 文件。
2. `npm init` 会自动创建一个基本的 `package.json` 文件。
3. 新建一个文件，重命名为 `package.json`。

一个 `package.json` 文件示例：

    {
        "name": "my-project-name", // 项目名称
        "version": "0.1.0", // 项目版本
        "devDependencies": { // 项目依赖
            "grunt": "~0.4.1", // Grunt库
            "grunt-contrib-jshint": "~0.6.0", //grunt中的工具
            "grunt-contrib-nodeunit": "~0.2.0", //grunt中的工具
            "grunt-contrib-uglify": "~0.2.2" //grunt中的工具，可以按照这种方式在 dependencies 中添加自己想要的工具
        }
    }
   
####Gruntfile

`Gruntfile.js` 和 `Gruntfile.coffee` 文件都是归属于项目根目录中的一个有效的 JavaScript 或者 CoffeeScript 文件。 
一个 Gruntfile 由下面几部分组成：
* “wrapper” 函数，一个包装函数
* 项目和任务配置
* 加载的 Grunt 插件和任务
* 自定义任务

##### wrapper 函数
每个 Gruntfile 都使用这个基本格式，同时所有的 Grunt 戴玛都必须指点在这个函数里面：

    module.exports=function(){
        //在这里添加 Grunt 相关
    }

#####项目和任务配置
通常 Grunt 任务所依赖的配置素据都被定义在一个对象中，而这个对象将会被传递给 `grunt.initConfig` 方法。

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%=pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

在上面的代码中，`grunt.file.readJSON('package.json')` 会把存储在 `package.json` 中的 JSON 元数据导入到 Grunt 配置中。由于 `<% %>` 模板字符串可以引用任意的配置属性，因此可以通过这种方式来制定诸如**文件路径**和**文件列表类型的配置数据**。

与大多数的任务一样， grunt-contrib-uglify 插件的 `uglify` 任务要求他的配置被指定在一个同名属性中。在这个例子中，我们指定了一个 `banner` 选项，用于在文件顶部生成一个注释。紧接着是一个名为 `build` 的 uglify 目标，用于将一个js文件压缩为一个目标文件，比如：将 src 目录中的 `jQuery-1.9.0.js` 压缩成 `jQuery-1.9.0.min.js`，然后存储到 dest 目录中。
插件一般都托管在 github 上，其使用方法都会有说明。比如 [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)

#####加载 grunt 插件和任务

只要一个插件被作为一个依赖指定在项目的 `package.json` 文件中，并且通过 `npm install` 安装好，都可以在 `Gruntfile` 文件中使用下面的简单命令启用.

    //加载提供 "uglify" 任务的插件
    grunt.loadNpmTasks("grunt-contrib-uglify");
   
**tips:** 使用 `grunt --help` 命令可以列出所有可用的任务

同时，你可以通过定义一个 `default` 任务来配置 Grunt，让他默认运行一个过着多个任务。

    // 默认任务
    grunt.registerTask('default', ['uglify']);
   
可以将你允许默认运行的任务名称以数组的形式作为参数传递。


如果你想要的任务没有对应的 Grunt 插件提供相应的功能，你可以在 Gruntfile 内定义自定义的任务：

    module.exports=function(){
        //一个很基础的default任务
        grunt.registerTask("default","load some stuff.",function(){
            grunt.log.write("Loggin some stuff……").ok();
        });
    };
   
自定义的项目特定的任务可以不定义在 Gruntfile 中；它们可以定义在一个外部 .js 文件中，然后通过 grunt.loadTasks 方法来加载。
   
参考自：[Grunt新手教程](http://www.gruntjs.org/docs/getting-started.html)