title: git 使用笔记(一)  
date: 2014-07-16 21:09  
tags: [git, 笔记]  
---



###一般处理
初始化:
    
    $ git init 

这样就会在当前目录创建版本库.

#####常用指令:

添加文件：

    $ git add FILENAME

删除文件索引,**并且删除文件**：

    $ git rm FILENAME
重命名：

    $ git mv OLDFILENAME NEWFILENAME

提交更新,全部：

    $ git commit -a

查看日志.

    $ git log

查看指定版本日志.

    $ git show xxxxx

切换分支.

    $ git checkout BRANCHNAME

创建新的分支.

    $ git branch BRANCHNAME

就近创建一个分支,转移所有目前修改到此分支中， 其实就是**创建分支和切换分支的合并操作**

    $ git checkout -b BRANCHNAME

实验完毕,发现可行提交后,直接返回主分支中进行合并.

    $ git commit -a 
    $ git checkout master 
    $ git merge BRANCHNAME
    
分支合并,切换到需要合并的分支中,然后执行merge就能够合并.

    $ git merge TARGETBRANCH

更多时候我们需要远程操作.除了直接clone出来一个完整的仓库,需要追加更新.

    $ git fetch git://xxxx.xxxx master:LOCALBRANCH

将远程仓库中的分支fetch到本临时分支后(例子中为origin:master),如果指定了分支,则会保存到指定分支中去(例子中为LOCALBRANCH).然后进行代码审核,最后再merge到主分支中去.

当然,也有的时候我们对远程仓库中的代码有绝对信心,或者仅仅只是你一个人在维护,那么就可以直接获取并且合并.

$ git pull git://xxx.xxxx master

###Git 记录的方式

Git 是一种分布式版本控制系统，客户端并不只提取最新版本的文件快照，而是把代码仓库完整

![image](http://git-scm.com/figures/18333fig0103-tn.png)

图片来源：[http://git-scm.com/figures/18333fig0103-tn.png](http://git-scm.com/figures/18333fig0103-tn.png)

每次修改之后，Git 并不是保存这些修改之后的差异变化，实际上就像一个照相机一样，将修改后的文件拍下作为文件快照，记录在一个微型的文件系统中。每次提交更新时，检查一遍所有文件的信息

对于任何一个文件，在 Git 内都只有三种状态：已提交（committed），已修改（modified）和已暂存（staged）。已提交表示该文件已经被安全地保存在本地数据库中了；已修改表示修改了某个文件，但还没有提交保存；已暂存表示把已修改的文件放在下次提交时要保存的清单中。

Git 管理项目时，文件流转的三个工作区域：Git 的**工作目录**，**暂存区域**，以及**本地仓库**。

![image](http://git-scm.com/figures/18333fig0106-tn.png)

图片来源：[http://git-scm.com/figures/18333fig0106-tn.png](http://git-scm.com/figures/18333fig0106-tn.png)

**工作区**：就是电脑中可以看到的目录。  
**版本库**：工作区中有一个隐藏目录 ".git" ，这个不算做是工作区，而是 Git 的版本库。




基本的 Git 工作流程如下：

第一步是用 `git add` 把文件添加进去，实际上就是把文件修改添加到暂存区（对修改后的文件进行快照，然后保存到暂存区域。）；  
第二步是用 `git commit` 提交更改，实际上就是把暂存区的所有内容提交到当前分支；  
第三步是用 `git push` 推送更改，将保存在暂存区域的文件快照永久转储到 Git 目录中。


如果是 Git 目录中保存着的特定版本文件，就属于**已提交状态**；如果作了修改并已**放入暂存区域**，就属于**已暂存状态**；如果自上次取出后，作了修改但还没有放到暂存区域，**就是已修改状态**。

图片来源：![image](http://rogerdudler.github.io/git-guide/img/trees.png)
[git简明教程](http://rogerdudler.github.io/git-guide/index.zh.html)

###分支

分支是用来将特性开发绝缘开来的。在你创建仓库的时候，master 是“默认的”分支。在其他分支上进行开发，完成后再将它们合并到主分支上。

从开发主线上分离开来，形成的分支可以在不影响主线的同时继续工作。git中的分支，不会创建源代码目录的完整备份，它的操作几乎在瞬间完成，在不同分支之间切换也很轻松 `git checkout brachname` 。

![image](http://rogerdudler.github.io/git-guide/img/branches.png)
图片来源：[http://rogerdudler.github.io/git-guide/img/branches.png](http://rogerdudler.github.io/git-guide/img/branches.png) [git简明教程](http://rogerdudler.github.io/git-guide/index.zh.html)

创建一个叫做“feature_x”的分支，并切换过去：
    
    $ git checkout -b feature_x

切换回主分支：
    
    $ git checkout master

再把新建的分支删掉：
    
    $ git branch -d feature_x

除非你将分支推送到远端仓库，不然该分支就是 不为他人所见的：
    
    $ git push origin <branch>
    
### 

在项目中有很多文件不需要提交，比如IDE生成的项目文件，自动化工具 grunt等。在使用 `git status` 时，这些文件会列举在 Untracked files 中，有时候为了方便而使用 `git add -A` 命令的时候，会将这些没有被跟踪的文件添加到索引。

如果一个不小心将某个不需要提交的修改添加到了暂存区（git add *），即：staged。如果这时进行 commit 操作，这个不想提交的修改也会一同提交到本地仓库的 HEAD 中，当然只有 push 之后修改才会提交到远端的仓库。在 commit 之前，使用

    $ git rm --cached filename
    
便可以把它从暂存区中删除，保留源文件。

这条命令只是在暂存区中将文件快照删除而已，并不会将源文件从项目中删除。如果想连同源文件一起删除可以使用这条命令

    $ git rm filename

###比较提交 - git diff 

使用 `git diff` 查看文件被修改的具体内容：

    $ git diff filename
    
也可以用来比较项目中任意两个版本的差异，比如比较两个分支之间的差异：

    $ git diff brach1..brach2 
    
你可能还会看到下面这条看起来非常相似的命令：

    $ git diff brach1...brach2 
    
不同之处在于：两个分支名之间的点的个数，后面这条也就是三个"."的命令将显示出 brach1 和 brach2 共有父分支和 brach2 之间的差异。

你通常用git diff来找你当前工作目录和上次提交与本地索引间的差异。

    $ git diff
    
上面的命令会显示在当前的工作目录里的，没有 modified (添加到索引中)，且在下次提交时 不会被提交的修改。如果你要看在下次提交时要提交的内容(staged,添加到索引中),你可以运行：

    $ git diff --cached
上面的命令会显示你当前的索引和上次提交间的差异；这些内容在不带"-a"参数运行 "git commit"命令时就会被提交。

    $ git diff HEAD
上面这条命令会显示你工作目录与上次提交时之间的所有差别，这条命令所显示的 内容都会在执行"git commit -a"命令时被提交。

