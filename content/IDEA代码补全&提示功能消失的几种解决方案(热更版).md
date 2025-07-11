
+++
title = "IDEA代码补全&提示功能消失的几种解决方案(热更版)"
slug = "idea-代码补全-提示功能消失的几种解决方案-热更版"
date = 2023-06-15
+++

### 更新日志:
2025-3-28
> - 优化了表述逻辑
> - 最追加了来自评论区网友的经验

---
---
## 阿巴阿巴(正片开始)

编程工具的智能补全功能对于开发人员来说非常重要。它可以帮助节省时间和减少错误，提高编码效率和质量。 智能补全功能可以在编码过程中自动提示可能的函数、变量、关键字等，并提供相应的选项供开发人员选择。这可以帮助开发人员更快速地完成代码，避免拼写错误和语法错误。 此外，智能补全功能还可以提供关于代码的上下文信息，帮助开发人员更好地理解代码结构和功能。

所以说，智能补全功能可以帮助开发人员更高效地编写代码，减少错误，提高代码质量，是编程工具中非常重要的功能之一。

个人一直使用的都是`JetBrains`家族的产品，写Java用`在IntelliJ IDEA`,写前端用`WebStorm`以及`C/C++`用的`CLoin`等等；

我也是最近才遇到的一个情况，在编写代码时IDEA的智能补全功能莫名其妙的失效了，虽然这个功能本质上不会影响我们代码的运行逻辑和程序的功能性，但在编码效率上却是很重要。第一次遇到这种情况也是去网络上找了一些文章，内容也是大同小异，但遗憾的是这些文章中提到的方法都没能解决我的问题，最后实在是走投无路，只好自己 **搞科研**，现在也将自己总结的解决方案和网络上一些可行的方法统一做一个整理；

---



## 几种解决方案

首先需要说明的是，我的`IDEA`版本是该文发布时最新版本，且开启了 **新UI** 模式， 具体版本信息如下:

![image-20240313231822714](https://images.waer.ltd/notes/image-20240313231822714.png)

首先看一下正常情况下的`IDEA`，在编写代码时会根据你的代码智能提示不同的候选以及相关的函数，变量等信息，包括自动导入包在内，诸如此类：

![image-20240313224212711](https://images.waer.ltd/notes/image-20240313224212711.png)

如果你也遇到补全提示失效的问题，不妨试试以下几种方案: 

### 1. 开启了省电模式

`IDEA`中的省电模式是会将代码提示功能关闭的，所以如果问题出现了，建议先从这个原因开始排查；

> 查找路径：
>
> - 文件
>   - 省电模式

![image-20240313224812229](https://images.waer.ltd/notes/image-20240313224812229.png)

注意，开启省电模式后，前面会有一个`✔️`，再次点击即可关闭 **省电模式**；

---

### 2. 缓存原因

有时候，IDEA本地缓存过大也会导致提示失效，可以按照下面的步骤重置缓存：

> 查找路径:
>
> - 文件
>   - 使缓存失效(由于版本不同，可能叫其他名称)

![image-20240313225608573](https://images.waer.ltd/notes/image-20240313225608573.png)

按照上面的路径打开之后，界面可能是下面这样子的:按照提示操作即可。

![image-20240313225744253](https://images.waer.ltd/notes/image-20240313225744253.png)

---

### 3. maven索引未更新

> 查找路径
>
> - maven插件
>   - 设置图标(齿轮图标)
>     - Maven设置
>       - 打开具体的maven设置页面

![image-20240313230235012](https://images.waer.ltd/notes/image-20240313230235012.png)

注意，上图中的步骤是建立在你安装 了`maven`并在`IDEA`中下载了`Maven`插件的基础上的;打开设置之后:

![image-20240313230554818](https://images.waer.ltd/notes/image-20240313230554818.png)

更新索引的操作会花费一定的时间，不建议在一开始尝试。

---

### 4. 自动补全相关设置

一般情况下，`IDEA`的自动补全功能默认是开启的，但不排除有些时候自己手贱或者`IDEA`本身故障等原因导致设置出现问题，那就需要重新检查相关的设置了(我自己就是这个原因，尝试前面几种无果之后才发现的)；

> 查找路径：
>
> - 文件
>   - 设置
>     - 编辑器
>       - 常规
>         - 自动导入
>         - 代码补全

![image-20240313230958966](https://images.waer.ltd/notes/image-20240313230958966.png)

这里建议把上图中的功能项都检查以下是否处于正常开启状态，比如 **代码补全**

![image-20240313231252027](https://images.waer.ltd/notes/image-20240313231252027.png)

我之前的原因就在于，勾选了 **区分大小写** 并勾选了 **仅首字母** ，这样就相当于把这个提示功能砍成三级残废，没什么L用，所以一定要勾选后面的 **所有字母**，并且参考我上图中的其他配置项。

---

找到原因之后，开启了正常的代码补全和提示功能，写代码嘎嘎快。顺便贴一下我用的汉化插件吧，不习惯英文界面的可以试试:

![image-20240313232033582](https://images.waer.ltd/notes/image-20240313232033582.png)

以上就是总结的可能原因，若遗漏，欢迎补全!!!!
---
### 其他原因总结

> 下面是参考了这篇文章在[CSDN](https://blog.csdn.net/2302_76401343/article/details/137187710?spm=1001.2014.3001.5502)上的评论区。
![image.png](http://aurora-xu.oss-cn-hangzhou.aliyuncs.com/aurora/articles/fb7e781401c6e43bcafe771005cb7050.png)