title: 利用pip安装Django
tags: [Python]
---


###pip的安装

先下载一个 python 文件 : [get-pip.py](https://bootstrap.pypa.io/get-pip.py)。
然后运行下面这条命令（可能需要管理员权限）：

    python get-pip.py

如果 [setuptools](https://pypi.python.org/pypi/setuptools) 还没有安装，pip会帮你安装。如果想更新已经存在的 setuptools，只要运行

    pip install -U setuptools

为了确保能够在命令行中使用 <code>pip</code> 命令，确保将 Python 安装目录中的 <code>Scripts</code> 文件夹路径添加到系统的环境变量中。这个必须手动添加！

###升级 pip

在 Linux 或者 Mac 中：

    pip install -U pip

在 Window 中：

    python -m pip install -U pip

###安装 packages

    $ pip install SomePackage            # latest version
    $ pip install SomePackage==1.0.4     # specific version
    $ pip install 'SomePackage>=1.0.4'     # minimum version

###卸载 packages

        $ pip install SomePackage

所以，在成功安装了 pip之后，可以使用 pip 安装 Django

    pip install Django==1.6.5


