+++
title = "效率工具Markdown"
slug = "效率工具-markdown"
date = 2023-06-15
+++

 ## 概念概述

[百科链接](https://baike.baidu.com/item/markdown/3245829?fr=aladdin)

`Markdown`是一种[轻量级标记语言](https://baike.baidu.com/item/轻量级标记语言/52671915)，创始人为约翰·格鲁伯（英语：`John Gruber`）。 它允许人们使用易读易写的[纯文本格式](https://baike.baidu.com/item/纯文本格式/9862288)编写文档，然后转换成有效的`XHTML`（或者`HTML`）文档。这种语言吸收了很多在电子邮件中已有的纯文本标记的特性。

由于`Markdown`的轻量化、易读易写特性，并且对于图片，图表、数学式都有支持，许多网站都广泛使用`Markdown`来撰写帮助文档或是用于论坛上发表消息。 如[GitHub](https://baike.baidu.com/item/GitHub/10145341)、[Reddit](https://baike.baidu.com/item/Reddit/1272010)、[Diaspora](https://baike.baidu.com/item/Diaspora/10726893)、[Stack Exchange](https://baike.baidu.com/item/Stack Exchange/13777796)、[OpenStreetMap](https://baike.baidu.com/item/OpenStreetMap/3171606) 、[SourceForge](https://baike.baidu.com/item/SourceForge/6562141)、[简书](https://baike.baidu.com/item/简书/5782216)等，甚至还能被使用来撰写[电子书](https://baike.baidu.com/item/电子书/346054)。

## 标题格式

* 用#号开头并空一格输入文字表示标题
* 一个井号代表一级标题，以此类推

> 实例：
>
> # h1
>
> ## h2
>
> #### h4

## 文本格式

- 两个*号包围表示字体加粗
- 三个星或者下划线号表示斜体

## 有序列表

一个加号减号或者星号开头代表有序列表

> 实例：
>
> - Java
> - C++
> - JS

## 无序列表

使用数字+.+一个空格

> 实例：
>
> 1. 学习
> 2. 游戏
> 3. 听音乐

## 代码

三个```开头即可插入代码

三个```编程语言名称即可插入指定编程语言的代码块

```c++
cout<<"hello Tisox"<<endl;
```

## 数学公式

如果要在文本行中插入数学公式

在公式前后加上一个$符号

如果要插入一个数学区块，在公式前后分别加上两个$$符号

$$
f(x)=x^2+3
$$

## 表格

| 表头   | 表头   |
| ------ | ------ |
| 单元格 | 单元格 |
| 单元格 | 单元格 |

> 实例：
> 竖线'|'构造表格列结构
> 多虚线'----'构造表格行结构

## 链接

> 格式：'\[]()'
> [] 中书写超链接的名称
> () 中书写超链接地址

[八尺妖剑的博客](https://www.waer.ltd)

## 图片

> 格式：'\!\[]()'

- 开头一个感叹号 !
- 接着一个方括号，里面放上图片的替代文字
- 接着一个普通括号，里面放上图片的网址，最后还可以用引号包住并加上选择性的 'title' 属性的文字。

## 转义字符

Markdown 支持以下这些符号前面加上反斜杠来帮助插入普通的符号：

![image-20220906143617280](https://images.waer.ltd/img/image-20220906143617280.png)

## 案例

| 名称 | 列表                 | 元祖               | 字典                       | 集合               |
| ---- | -------------------- | ------------------ | -------------------------- | ------------------ |
| 英文 | list                 | tuple              | dict                       | set                |
| 表示 | \[]                  | \()                | \{key1:value1,key2:value2} | \{,,,}             |
| 特点 | 不需要具有相同的类型 | 元祖的元素不能修改 | 键值对形式                 | 无序的不重复元素列 |

****

## 使用技巧

### 技巧一

> 如何在序列表之后插入代码块。实现下面的效果：

1. 下面是一段代码

   ```java
   while(day++ < life.length) {
       love++;//♥♥♥
   }
   return FGTWDLHNN_1000;
   ```

2. 下面还是一段代码块

   ```cpp
   while(day++ < life.length) {
       love++;//♥♥♥
   }
   return FGTWDLHNN_1000;
   ```

   ****

**实现方式**

> - 按照有序列表的语法打出第1个序号，后跟需要的文字说明。
> - 在上一步的文字说明写完之后直接按下<kbd>回车键</kbd>此时会在下一行形成序号2，但这不是我们想要的，我们需要在这个序号2的位置放一块代码片段。
> - 接着上一步的<kbd>回车</kbd>操作之后出现序号2，此时我们再按一下<kbd>Tab</kbd>,之后会把新的序号2变成序号1的子序号1.
> - 紧接上一步，出现子序号1时，我们按下<kbd>删除</kbd>把子序号删除掉，保持删除后的光标位置不要动
> - 在上一步删除操作结束后，我们直接在光标处开始使用代码块的\```languageType语法正常插入自己的代码。
> - 到这里，你已经成功在序号1后插入一段代码块了，那么我们光标移出代码块的位置，直接按下<kbd>回车</kbd>
> - 你会发现它会自动工具上一条序号的大小自动排版下一个序号，也就是序号2，到此为止，我们重复上面的步骤，就可以如此往复的在每一个序号之后插入代码块，实现上面这种效果了。

**动图演示**

![md](https://images.waer.ltd/img/md.gif)

[视频版地址](https://clipchamp.com/watch/zprdxKQOycu)

****

##  参考/资源

- [markdown官网](https://www.markdownguide.org/)
- [Typora软件下载](https://www.typora.io/) -->
