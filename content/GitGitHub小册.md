+++
title = "GitGitHub小册"
slug = "githithub-小册"
date = 2023-06-15
+++

### 更新日志：
2023-5-28 下午 星期日

> 新增如何移除已提交到暂存区的文件

2023-3-10 晚 星期五

> - 新增修复Ubuntu命令行环境下中文乱码问题的解决方案


2022-8-30 晚 星期二

> - 修复已知错别字词
> - 新增pull命令
> - 新增踩坑实录

2022-05-17 22:36:06 星期六

> - 修正内容错字词情况
> - 新增番外篇，踩坑实录板块
> - 新增GitHub页面内容部分板块

2022-05-22 08:36:06 星期日

> - 细化git push 相关的内容
> - 细化分支操作相关内容

2022-06-02 21:39:23 星期四

> - 新增git status终端显示中文编码异常的问题以及解决方法

2022-06-04 21:30:14 星期六

> - 新增[git命令部分的补充模块]
> - 新模块添加了一点内容

****

****

## 在 `GitHub`上创建仓库

> 这一步骤的前提是先注册一个 `GitHub`的账号，由于那都是小场面，就不再巴拉巴拉。

> 说明一下，全文如果没有特别的单独说明，文中所有用【】括起来的内容都代表网页或者软件节点的操作按钮或者步骤选择项。

打开 `GitHub`登录后在个人主页的右上角点击加号之后再点击：`【New respository】`顾名思义，创建一个新仓库。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9429936975745072856-68ce0629.png)

页面打开之后，输入仓库的名称(英文)，具体看下图：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15443438604874816303-ce191006.png)

最后点击【Create repository】完成仓库的创建。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9499386600859571714-28c2b0f3.png)

创建成功之后大概是这样子的：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-10092826344442102276-b6f022a2.png)

## Linux上安装Git

> 本文基于Linux操作系统进行演示，如果需要安装Windows版本，自行Google或者百度。
>
> 我的操作系统具体情况：
>
> - 阿里云轻量 `CentOS8.2`
> - `2核4G`
> - `80GB`系统盘
> - bash使用的是 `zsh`

在安装之前，先通过下面的命令检查一下自己是不是已经安装过，是的话忽略这一步。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16314107400167235335-81c23a79.png)

## 添加SSH授权

> 这里不得不提一下，自从2021年8月之后，`GitHiub`就不再支持使用账户密码操作了，所以必须使用 SSH 密钥登陆。我们可以在系统中创建 SSH 公私钥，并将公钥放到 GitHub 指定位置。如此操作即可生成 GitHub 账户对于当前系统中的 Git 授权。

在终端执行 `ssh-keygen`命令并按下几次回车之后生成私钥，公钥存放在主目录下的隐藏目录 `.ssh`中的两个文件中：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-13983928793905489167-4cedf846.png)

将 `~/.ssh/id_rsa.pub` 文件中的公钥内容复制之后打开 `GitHub`。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15671545960668599527-64267a25.png)

点击主页右上角加号之后点击【Settings】打开之后页面左侧菜单栏目有一个【SSH and GPG keys】

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15091020282709754855-97694223.png)

点击【New SSH key】:

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9276900667175524409-1a2f8cbf.png)

点击【Add SSH key】之后可能会弹出密码的输入框，输入你注册的 `GitHub`的登录密码验证之后完成添加，页面如下：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9266894548528798671-b252fe32.png)

**使用SSH的主要好处：**

- 免密码推送，在执行 `git push`时不需要再验证用户名密码；
- 提高数据传输速度。

## 克隆GitHub 仓库到本地

> 你将学会使用命令将GitHub上的仓库克隆到本地。

就以我们前面创建的演示仓库为克隆的目标。使用下面的命令：

```bash
git clone [仓库地址]
```

即可。在克隆之前需要找到目标仓库在GitHub上的仓库地址。

回到仓库主页，按照下图的操作复制仓库的地址：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11449714339986446195-dc3123fa.png)

**注意：只有使用这种以git开头的地址来克隆仓库，SSH关联才会起作用。**

在终端输入:`git clone git@github.com:xiaoyivip/gitdemo.git /Gits/gitdemo`

在执行命令的过程中会弹出克隆确认链接的提示，输入 `yes`即可。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9564404370573729592-575bc1be.png)

进入仓库主目录，如下图所示，仓库主目录中有个 `.git` 隐藏目录，它里面包含了仓库的全部信息，删掉这个目录，仓库就变成普通的目录了(相当于windows在某个目录下执行 `git init`初始化是一样的)。进入到仓库目录中，命令行前缀发生了一些变化，出现了红色的 master ，它就是当前所在的分支名：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9620095350685305748-26215263.png)

当我们在 `GitHub`上创建一个仓库时，同时生成了仓库默认主机名 `orgin`,b并创建了默认分支 `master`。`GitHub`可以看成是免费的Git服务器，在 `GitHub`上创建仓库，会自动生成一个仓库地址，主机就是指代这个仓库，主机名就等于这个仓库地址。克隆一个 `GitHub`仓库(或者叫远程仓库)到本地，本地则会自动关联到这个远程仓库。可以执行 `git remote -v` 命令查看本地仓库所管理的远程仓库信息。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-14900095146715085484-3b2b56d8.png)

Git 要求对本地仓库关联的每个远程主机都必须指定一个主机名（默认为 origin），用于本地仓库识别自己关联的主机，`git remote` 命令就用于管理本地仓库所关联的主机，一个本地仓库可以关联任意多个主机（即远程仓库）。

克隆远程仓库到本地时，还可以使用 `-o` 选项修改主机名，在地址后面加上一个字段作为本地仓库的主目录名，举例如下：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16923947166541691176-4df4c375.png)

## Git基础操作

### 分区介绍

Git 本地仓库有三大区域：工作区、暂存区、版本区，下面的图可以辅助理解，刚开始不需要特别熟悉这写概念，学完git的基本操作之后就会逐渐理解了。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-2712640029327028861-8e4ead81.png)

所有的Git命令都是以 `git`开头的。

> 演示一次完整的修改、提交、推送操作。

首先，进入仓库主目录，执行 `git status` 查看整个仓库的状态：

```bash
# 查看仓库状态
git status
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-13007768173336487344-83b3e2f4.png)

> 可以看到，我们仓库的仓库中目前还没有任何的文件变动。

创建一个文件，然后再执行一次上述的命令：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15977794556869951699-53b8b09b.png)

> 提示的大致意思是提交为空，但是存在可以提交的文件，也就是我们刚刚新建的 `one.txt`这个文件，这表示工作区或暂存区有变化，对文件进行增删改操作都会出现这个星号，另外使用 `git status` 命令亦可查看详情。

### **添加修改到暂存区以及撤销修改**

按照上图的提示，使用 `git add [文件名]` 命令跟踪此新建文件，即把新增文件添加到暂存区。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16870937100143863778-dc2c69fc.png)

如果你有多个文件或者需要对整个目录进行了修改或者有提交的需求，可以使用 `git add .`命令全部提交到暂存区。当我们修改了工作区，`git add`命令是将这些修改添加到暂存区，暂存区记录的只是修改。如果要撤销暂存区的修改，请执行下面两个命令，选择其一即可。

```bash
# 撤销暂存区的修改提交
git reset -- [我文件名]
# 或者
git rm --cached [文件名]
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17850608299944643581-6895509e.png)

> 注意：上面的命令中如果没有指定撤销的文件名，即为 `git reset --`命令时，表示将会撤销全部已经提交的到暂存区的文件。

### **git diff命令**

> 这个命令可以用来查看工作区被跟踪的文件的修改详情，此时新建的文件 `one.txt`没有被跟踪，而已被跟踪的 `README.md`文件无修改，所以看不到。只有在版本区中存在的文件才是被跟踪的文件。

```shell
# 查看被跟踪文件的修改详情
git diff
```

下面我们尝试修改 `README.md`文件。

```bash
echo '代码是敲不完的，但多敲几遍却可以学会一门新的技术，比如Git。' >> README.md
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-614987239386012497-1bf57762.png)

接下来就可以使用 `git diff`命令了。执行命令之后会打开下面这样一个页面，如需退出请输入 `Q`。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-4990536508842611349-1cde9d67.png)

现在，将工作区的两处修改（新增文件 `one.txt`，修改文件 `README.md`）全部添加到暂存区，并使用 `git diff --cached` 查看暂存区的全部修改:

```bash
git add .
git diff --cached
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11045270626685266001-d7450172.png)

### **查看历史提交**

使用 `git log`来查看版本区的提交历史记录。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11884750730489264241-867906d8.png)

> 可以看到目前只有一个之前创建仓库时候的初始化提交记录。

关于查看提交历史记录的命令，有些常用的选项介绍一下：

- `git log [分支名]` 查看某分支的提交历史，不写分支名查看当前所在分支
- `git log --oneline` 一行显示提交历史
- `git log -n` 其中 n 是数字，查看最近 n 个提交
- `git log --author [贡献者名字]` 查看指定贡献者的提交记录
- `git log --graph` 图示法显示提交历史

---

### 配置个人信息

对Git进行一些本地配置：

- `user.email`:注册GitHub时后的账号邮箱
- `user.name`:GitHub账号名称

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17581249722225102123-24889dae.png)

> 可以使用 `git config -l`来查看配置信息。

完成后，系统自动生成 Git 的配置文件，就是主目录中的隐藏文件 `.gitconfig` ：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-2940854042814008577-22b1a9bb.png)

### 提交暂存区的修改

执行 `git commit`命令把暂存区的修改提交到版本区，生成一个新版本。建议使用 `-m` 传输来提交本次提交的备注信息。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11127230975352837733-0b9c51f4.png)

> 关于这个命令，还有一个 `-a`参数，是将未提交到暂存区的修改(也就是工作区)一并提交到版本区，但一般不建议使用。

提交后，暂存区的修改被清空，执行 `git log` 查看提交记录，紫色框中的十六进制序列号就是提交版本号，这是很重要的信息，每个提交都有自己单独的版本号：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7983839092928110599-ee186cfa.png)

> 观察上图的提交信息，提交版本是按时间倒序排列的，也就是最近的提交排在最上面，你可能需要查看时间正序排列的信息，那么可以使用 `git log --reverse` 命令。

### 分支操作

> 命令

```bash
# 查看分支信息
git branch -avv
# 切换分支
git checked [分支名]
# 创建分支
git branch [分支名]
# 合并分支
# 1.切换到接受修改的分支上
git checkout[被合并的分支名]
# 2.执行merge命令
git merge[有新内容的分支名]
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5418453843178963511-50fc598f.png)

第二行：

> 开头的 `*`表示当前所在的分支，绿色(绿色表示当前分支)的 `master`是分支名。后面 `3c336e0`表示版本号，第三项中括号中的蓝色部分表示此分支跟踪的远程分支的名字，这也是克隆远程仓库到本地时的默认设置 -- 创建 master 分支并自动跟踪远程同名分支；冒号后面的文字表示本地分支领先其跟踪的远程分支的一个提交。最后是提交的备注信息。

第三行：

> 这是git指针信息，指向远程仓库的 `master`分支。

第四行：

> 参考第二行的解释。

---

### 推送到远程仓库

> 使用下面的命令将版本区中的文件提交到远程仓库中。

```bash
# 推送命令
git push
```

后面不需要任何选项和参数，此命令会把本地仓库 master 分支上的新增提交推送到远程仓库的同名分支上，因为当前所在的分支就是 master，而且上文提到，它已经跟踪了远程仓库的同名分支：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1172788798162207162-d224602c.png)

push成功之后，通过前面介绍过的 `git branch -avv`命令查看分支信息。通过对比下图紫色框中的版本号可以知道两个版本是否一致。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-80910746548442161-a4be79a0.png)

再去 `GitHub`看看情况。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15173227095348095106-70ccc935.png)

> OK！符合预期。

> 以上就是使用git命令完成的一次修改-提交-推送的操作，主要用到了下面几个命令：

```bash
# 查看状态
git status
# 添加到暂存区
git add
# 提交到版本区
git commit -m '描述'
# 推送到远程仓库
git push
# 查看提交日志
git log
# 查看分支信息
git branch -avv
```

#### 情况一

> 我们在自己的电脑上通过 `git init`初始化一个本地的仓库，需要将该仓库的内容推送到指定的远程仓库。

```bash
# 存储远程仓库地址并起个别名
git remote add [仓库地址别名] [远程仓库地址]
# 将内容推送至远程仓库
git push [地址别名] [对应的分支名]
```

---

## 版本回退

如果发现已经提交的版本存在错误，比如 `one.txt`中内容有误，可以修改文件之后再次提交到暂存区、提交、推送。还有一个比较省事的做法，那就是**版本回退**。说白了就是撤销上一次的提交，修改文件之后重新提交推送，下面即将演示这种方法。

### 软退回

执行 `git reset --soft HEAD^`撤销最近的一次提交，将修改还原到暂存区。

- `--soft`表示软退回，对应的还有一个后面会讲到的硬退回 `--hard`。
- `HEAD^`表示撤销最近一次提交，`HEAD^^`表示撤销两次提交，n次请使用 `HEAD~n`。

撤销执行之后再次执行 `git branch -avv`查看分支信息。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-201203511134477285-0e43ed2a.png)

可以看到本地仓库的 master 分支的版本号已经发生了变化，变成了前一次提交的版本号，中括号里也有提示信息，本地分支 master 落后其跟踪的远程分支 origin/master 一个提交。

此时再执行 `git status`会发现，之前提交的修改又被打回了暂存区。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1979692076972205118-3db3cc47.png)

### 再次修改、提交

我们对 `one.txt`作一个简单的修改操作(假装修改了一个天大的bug),然后使用添加修改，提交版本。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3663064259608941161-4c3c1f99.png)

`commit`之后先别急着 `push`，查看状态以及分支信息发现视乎出现了一点问题的样子。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11026165117653179107-9f987ef6.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3491200257374588426-cdd31d14.png)

### 处理 commit 时间线分叉

> 基于上面步骤尾中出现的问题，显示我们的提交分支出现了偏离，也就是本地仓库的 `master`分支与远程仓库的 `origin/master`分支的在提交上出现了冲突，这种冲突有叫做提交时间线分叉。因为刚才的提交操作不是基于远程仓库 `origin/master`分支的最新提交版本，而是撤回了一个版本，这种情况下也是可以将本地 `master`分支推送到远程查看库的，但需要用到一个 `-f`参数，他是 `--force`的缩写，也就是强制推送命令。

```bash
# 强制推送
git push -f
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18266690155363145730-3373cf14.png)

> 推送成功！

**注意，这种解决方式可能会导致不可预料的问题，还有一种方式是先pull再push。**

看一下分支信息

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5202375484999585695-a57f7dad.png)

通过版本号可以看到本地 master 与远程 master 的版本号一致，记住这个版本号，去网页看看是否如预期效果。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18050903518636718190-d2b46b7c.png)

> 果然，没什么毛病！！

---

### commit 变化记录

> 假设我们做完了上面的回退修改工作后，此时海绵宝宝发现情况不对，柯南也觉得之前的操作似乎有些大意了。若之前的那次版本号为 `3c336e0`的提交是正确的，刚才的版本回退操作全都是误操作，怎么办？再次执行一次版本回退吗？不需要。我们有 `git reflog` 命令，它会记录本地仓库所有分支的每一次版本变化。实际上只要本地仓库不被删除，随你怎么折腾，都能回退到任何地方。`reflog` 记录只存在于本地仓库中，本地仓库删除后，记录消失。

```bash
# 查看变化记录
git reflog
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5190544120765319618-5a262b62.png)

所以怎么回退到 `3c336e0`版本？可以执行命令 `git reset --hard[版本号]`，如果记不清楚版本号，可以根据图中的第三行信息，执行 `git reset --hard HEAD@{2}`命令，其中的 `READ@{2}`就是上图第二行第二列所示的信息，该命令的意思就是回到当前分支最近两次提交版本变化前。

![](https://images.waer.ltd/img/20220420162300.png)

假设现在反应过来，其实刚才修改的提交是正确的，那么再执行一次 `git reset --hard 6928b56`即可。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17521413282723458023-39f48a85.png)

小结一下本节用到的一些命令：

```bash
# 查看本地commit变更记录
git reflog
# 强制推送
git push -f
# 版本回退
git reset --soft HEAD^
```

---

## 拉取pull命令

### 概述

> 用来拉取远程仓库内容到本地。**git pull** 其实就是 **git fetch** 和 **git merge FETCH_HEAD** 的简写。

### 格式

> ```
> git pull <远程主机名> <远程分支名>:<本地分支名>
> ```

### 常用操作
> 撤回已提交到暂存区的文件夹/件

```bash
git rm -r --cached "文件夹/"
git commit -m "新提交"
```

> 更新仓库，可以用来将本地仓库与远程同步到最新状态。

```bash
git pull
git pull origin
```

> 将远程的master分支拉取下来和本地的dev分支合并

```bash
git pull origin master:dev
# 如果远程分支是与当前操作的分支合并的话，那么冒号后面的部分(包括冒号)可以省略不写
git pull origin master
```

****

## Git分支操作

### 为git命令设置别名

通过上面的操作一路走来，大概你也发现了有些命令的重复度极高，比如 `git status` 和 `git branch -avv` 等，Git 可以对这些命令设置别名，以便简化对它们的使用，设置别名的命令是 `git config --global alias.[别名] [原命令]`，如果原命令中有选项，需要加引号。别名是自定义的，可以随意命名，设置后，原命令和别名具有同等作用。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16063922586297950273-2f056515.png)

> 现在就使用上面的别名来试一下水，看看是不是可用。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15582830812645582059-084fcd4a.png)

果然生效了，效果和原命令不能说很像，只能说一模一样。**注意了，git前缀命令还是需要的，不能直接写别名，那样是不生效的。**

如果那一天记不住自己设置的别名了，可以使用 `git config -l`来查看。

### git fetch 命令

这个命令它的作用是将远程仓库的分支信息拉取到本地仓库，注意，仅仅是更新了本地的远程分支信息，也就是执行 `git branch -avv` 命令时，查看到的 `remotes` 开头的行的分支信息。为了方便演示，举例说明一下，首先我们在 `GitHub `页面上对 `one.txt` 文件进行修改并增加一次提交。提交完成后，提交数变成 3 个，点下图紫色框中的链接可以看到提交记录：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16539097232290491987-70e80632.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17182750413149084730-5a9f478b.png)

执行 `git fetch` 命令，然后执行 `git branch -avv` 查看分支信息

![](https://b3logfile.com/file/2022/08/solo-fetchupload-6381421149274234158-cf0bd071.png)

可以看到，本地分支 master 的版本号无变化，而远程分支已经更新。所以，`fetch` 命令的作用是刷新保存在本地仓库的远程分支信息，此时若想使本地 `master`分支的提交版本为最新，可以通过执行 `git pull`命令来拉取远程分支到本地。

由于前面执行过 `git fetch`命令，这里也可以执行 `git rebase origin/master`命令来实现同样的功能。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-2569224816426375544-322a371d.png)

现在再查看分支信息发现刷新成功。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15432665369465569019-1b54b6c3.png)

### 创建新的本地分支

分支在项目开发中作用重大，多人协作时尤其不可或缺。

首先，克隆远程仓库到本地，进入仓库主目录，执行 `git br`查看分支信息。这个吗，命令相信已经玩的很6了。

使用 `git branch [分支名]`来创建一个新的分支：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-14096436788937288726-3f760f4e.png)

注意，新创建的分支并不会被自动切换，还是在之前的 `master`分支上。执行 `git checkout [分支名]` 切换分支，注意，我这把该命令设置一个别名 `ch`，后面用的时候都会使用该别名进行。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1142141978512328189-6fa64f75.png)

如果觉得每次创建新的分支都要手动的去切换，那么你可以尝试使用下面的命令，它可以帮你实现分支的自动切换。

```bash
# 创建分支并自动切换分支
git checkout -b [分支名]
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5089333401542797749-91345c3d.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-10019706947900181127-aab73108.png)

> 可以看到，在分支 `dev1`的前面出现一个 `*`，表示当前分支为 `dev1`。

如上图所示的分支信息，前两行是新建的本地分支信息，它们的版本号与主分支 master 一致，这是因为在哪个分支上创建新分支，新分支的提交记录就与哪个分支一致。新建分支并无跟踪任何远程分支，所以没有 master 分支中的中括号和括号内的蓝色远程分支名。

假设我们要在当前分支 `dev1 `上开发一个新的功能，需要增加一个文件 ` new_one.txt`，然后生成一个新的提交。

![](https://images.waer.ltd/img/20220420173400.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1890489777260326451-ae3d36fd.png)

### 新分支commit的push操作

在新分支 `dev1`中的版本区已经存在了一个新的内容，下一步便是将它push到远程仓库，逻辑上，我们应该将它推送到对应的 `dev1`仓库上，但问题是现在远程仓库中并没有这个分支，只有一个 `master`分支。![](https://b3logfile.com/file/2022/08/solo-fetchupload-8309328208194193048-9f27c6db.png)

自然，方法总比问题多，你可以使用 `git push [主机名] [本地分支名]:[远程分支名]`来解决这个问题，它可以将本地分支推送到远程仓库分支中，冒号前后的分支名通常是相同的，通过相同可以省略 `:`后的 `:[远程分支名]`，如果该远程分支不存在会自动创建该分支并完成推送。

```bash
# 自动创建远程分支并完成推送
git push origin dev1:dev1
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-11451462603832747773-11d810ce.png)

显示推送成功，我们去网页上看看。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7465579268896825386-d5c5c63a.png)

还是OK的。

### 跟踪远程分支

现在的问题是，如果我们使用 `dev1`分支提交、推送就还需要输入那段较长的命令，着实有些麻烦，所以现在有一个方法，可以能和 `master`分支一样跟踪远程同名分支，可以直接使用 `git push`命令进行推送。

命令:

```bash
git branch -u [主机名/远程分支名][本地分支名]
```

> 命令将本地分支与远程分支做了一个关联，或者说使本地分支跟踪远程分支。如果是设置当前所在分支跟踪远程分支，最后一个参数本地分支名可以省略。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-6586883568645030439-37f51a74.png)

当然，执行 `git branch --unset-upstream [分支名]` 可撤销该分支对远程分支的跟踪，同样地，如果撤销当前所在的分支的跟踪，分支名可以省略不写。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-250507523710923607-edcfe5cd.png)

有没有办法在推送时就自动跟踪远程分支呢？当然有，只要在推送的时候，加个 `--set-upstream` 或其简写 `-u` 选项即可，现在切换到 `dev `分支试一下水。

```bash
# 推送时自动跟踪分支
git push -u origin dev
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-545178229849817364-cd9eb54b.png)

### 删除远程分支

使用 `git push [主机名]:[远程分支名]`，如果想批量删除，`git push [主机名] :[远程分支名] :[远程分支名] :[远程分支名]`该命令的原理是向远程分支推送一个空分支。除此之外还有一个命令 `git push [主机名] -- delete[远程分支名]`。删除远程分支的命令可以在任意本地分支中进行，无需特地切换分支。

```bash
# 方式一
git push origin :dev
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18362083536819613915-0812728b.png)

```bash
# 方式二
git push origin --delete dev1
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-4557542496207430156-e310477f.png)

查看网页发现已经成功删除了 `dev1`和 `dev`分支。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-10777682985398872594-ed1016b6.png)

### 本地分支的更名与删除

- 给本地分支改名使用 `git branch -m [原分支名] [新分支名]`如果修改当前所在分支的名字，原分支名可以省略不写。
- 删除本地分支使用 `git branch -D [分支名]`，同样也支持批量删除语法。

```bash
# 给本地分支改名
git branch -m dev2
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5589053181182695071-799c1825.png)

```bash
# 删除本地分支
git branch -D dev2
```

> 注意在执行删除分支之前，当前所在的分支不能被删除。切换到 master 分支，然后执行 `git branch -D dev2 dev1` 命令：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9810708312871403341-a79b885f.png)

再查看分支信息：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5928182280263071147-f97d992f.png)

> 成功删除。

**现在一切又回到了最初的起点，可是你却再也回不去了，你已不再是原来的你，物是人非，现在的你已经学会了Git，想要回到解放前估计是不可能了，除非，你放弃自己！**

---

## 多人协作

### GitHub篇

#### 创建仓库

> 本节将介绍 `GitHub `多人协作与相关 `Git `的操作建议大家准备两个浏览器和两个 `GitHub `账号以便模拟场景。我的账号 `xffvip`是一个用来测试的账号，假定这是项目组长的账号，`xiaoyivip`是组员的账号。

此时我两个谷歌邮箱加持的俩谷歌浏览器：`爸爸爱你1号`和 `爸爸爱你2号`就来点作用了。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7868774678960389599-db3cfc7c.png)

首先，在组长账号中创建一个仓库，名为 work，在创建仓库时，需要说明第一节中提到的两个下拉框：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7980200658165846114-fc5a719e.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3377566846819774842-f4f6ad42.png)

> 上边的忽略文件下拉框：我们在写代码时，总会出现一些不需要上传到仓库的垃圾文件、缓存文件、备份文件、环境文件等等，可以创建一个忽略文件将这些不需要被上传到远程仓库的文件忽略掉。忽略文件的名字是 `.gitignore`，它被放置在仓库主目录下，将不需上传的文件的名字写入其中，Git 就会自动忽略它们。比如这个仓库是用来 Windows 开发的，就在下拉框中选择 Windows，如果这是一个保存 Java 项目的仓库，就选择 Java。这样，在仓库创建成功后，忽略文件就自动出现了，这个忽略文件中有对应的语言或工具中绝大部分通用的忽略规则。当然了，你也可以自己手动增删改。

> 如果在创建仓库时忘记了选择忽略文件，几个提交后突然想起来，怎么办？GitHub 上有人把忽略文件都做好了，打开链接 [github / gitignore](https://github.com/github/gitignore) ，这个仓库里有很多忽略文件，选择你需要的放到自己的仓库即可

> 下边的开源许可下拉框：关于开源许可证，这不是一时半会能说清楚的，建议自己搜索。我们的仓库不需要选择这一项。

创建成功之后：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3314126129415452354-dfa8a8e8.png)

**对上图右上角三个按钮进行说明：**

Watch：这是一个下拉按钮，可以选择对此仓库关注、不关注、忽略等。

Star：如果觉得这个仓库很好，就点击这个按钮送一颗星，在淘宝提供刷星业务之前，仓库获得的星越多表示该项目越优秀。

Fork：在别人的仓库中点此按钮会克隆一个完全一样的仓库到你自己的账号中，包括所有分支、提交等，但不会克隆 issue（后面会讲到），当此仓库发生版本变化，不会自动同步到你克隆的仓库里，反之亦然。

#### 添加协作者

> 现在在组长账号中增加该仓库的合作者，也就是组员。我就添加自己的另一个号 `xiaoyivip`。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-16508093147771236775-f7a19f65.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-4956971893658180951-f6238379.png)

在输入框中输入对方的用户名或者邮箱即可选择添加。添加之后进入组员的账号会收到一条邀请信息，打开如下：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18350574972287502776-9327c2be.png)

点击绿色按钮。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1695260005354738172-b0ebd1b4.png)

点击右上角 `Fork`，将该仓库克隆到自己的仓库中。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7433856181266986223-0651778b.png)

#### 添加 issue

切换到组长的 `GitHub `页面，在仓库中添加一些项目任务或待解决问题，这些任务就是 `issue`。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-12084467760903937435-fd587ee3.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-2594238524348847948-3978b5b2.png)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5639447697244761917-b9eb91a6.png)

写好任务标题后，可以在右侧指派一位或多位项目参与者来完成，同样 GitHub 也会给被指派者发邮件的（可以在自己的 GitHub 账号上设置拒收哪类邮件）。

![](https://images.waer.ltd/img/20220420223612.png)

组长仓库里的 issue 不会出现在组员仓库中。

此时组员会收到一条站内消息，页面如下：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-8264579879650495062-23a0ef99.png)

以上就是多人协作 `GitHub`篇的内容。更多协作方面的操作请继续看下面的 `git`篇。

### Git篇

#### 克隆仓库到本地

以组员的身份克隆work仓库到本地环境。

```bash
# 仓库地址
git@github.com:xiaoyivip/work.git
```

> 地址中的 `.git`是不需要的。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-4483575900448362256-f3d89385.png)

完成项目组长分配的 `issue`并推送到自己的仓库。注意每个 issue 在创建后都会生成一个编号，我们首先完成 1 号 issue。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-872965296456799276-98b356df.png)

```bash
# 创建a.txt
echo 'hello you' > a.txt
# 添加
git add .
# 提交
git com 'fix #1 添加文件a.txt'
# 查看状态
git st
# 查看分支信息
git br
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17353214750728834457-c8935ed0.png)

注意在执行 `commit `命令时，备注信息里有个 “fix #1”，这是必要的，当备注信息中含有此字样的 `commit `出现在组长仓库，仓库中编号为 #1 的 issue 就会自动关闭。类似的字样还有 “`fixes #xxx、fixed #xxx、closes #xxx、close #xxx、closed #xxx`”，这些并不重要，选择字母最少的 fix 就可以了。当然偶尔忘记写这个字样也不要紧的，issue 可以手动关闭，甚至关掉的 issue 还能再开。

完成以上操作，组员的 `GitHub `仓库会发生变化，新增一个版本号为 `efcca58`的提交：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18421792841657355490-c32d26be.png)

#### 提 PR & 检查合并 PR

上面我们以组员的身份已经完成了组长派发的编号为#1的 `issue`并推送到了自己的仓库，那么接下来怎么把修改从组员仓库添加到组长仓库呢？

这将会用到 `pull request`命令，简称PR。可以理解为**允许被拉取的请求**，创建一个PR就是从甲分支向乙分支提交一个请求，该请求中有一个或多个提交，若对方(这里指组长)觉得这个提交请求没什么问题之后，就可以允许合并(merge)这个请求，也就是把请求中所有提交的修改增加到乙分支上，整个过程称为**提PR**，**检查合并PR**。

提PR可以在仓库内，也可以跨用户仓库。

> 好，现在我们从组员的 work 仓库 main 分支给组长的 work 仓库 main 分支提一个 PR。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-12563276839743572653-c835fe90.png)

> 如下图所示，仔细检查紫色框中的内容是否正确，再看绿色椭圆形框中的绿色字样 “`Able to merge`.”，说明这个 `PR `中的修改跟目标分支没有冲突
>
> 从上图还可得知一些信息：该 PR 里有 1 个提交，1 个文件改动，1 个贡献者。点击上图绿色按钮跳转到确认页面，再次点击下图绿色按钮即可完成本次 “提 `PR`” 工作：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-13521426524017925060-f37b91cb.png)

![](https://images.waer.ltd/img/20220421094853.png)

> 该页面只有参与项目协作的成员有权限进入，当前 `GitHub `的登录用户是组员，所以可见，且对这个仓库有完全的管理权限，除了删除仓库。当然了，检查合并 PR 的权限也是有的。重要的一点：提了 PR 之后，一定要求参与项目的其他成员来检查合并，不要自己来，尽管自己有权限。(当然，为了方便，我这里是自己以组员身份检查的合并)。
>
> 上图中绿色按钮是个下拉按钮，合并 PR 的方法有三种，分别解释一下：
>
> `Create a merge commit` ：这种方式会在组长仓库的 master 分支上生成一个新的提交，且保留 PR 中的所有提交信息。这是一种常规操作，用得最多。
>
> `Squash and merge` ：压缩合并，它会把 PR 中的全部提交压缩成一个。此方法的优点就是让提交列表特别整洁。一个 PR 里有很多提交，每个提交都是很细小的改动，保留这些提交没什么意义，这种情况就使用此方法合并 PR。
>
> `Rebase and merge` ：这种方法不会生成新的提交，例如 PR 中有 6 个提交，用此方法合并后，组长仓库也会新增 6 个提交。注意，这些提交的版本号与组员的提交不同，此外完全一样。

现在切换到组长身份，可以看到，之前的两个 `issue`现在只有一个了，说明合并成功后已经自动关闭该任务。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7061296705740790824-9dc12f30.png)

以上就是一次完整的修改、提交、推送、提 PR、合并 PR 的过程。

**需要注意的一点：从 A 向 B 提 PR 后，在 PR 合并或关闭前，A 上所有新增的提交都会出现在 PR 里。**

#### 同步主仓库

我们假设组长的main分支自己新增一些组员没有的提交，那么需要让组员的仓库同步组长的仓库，使它们的提交版本一致。作为组员，要时刻保持自己的分支与组长的一致，以避免在下次提 PR 时出现冲突，该操作叫做 “同步主仓库”，组长的仓库就是主仓库。

提 PR、合并 PR 只能在 `GitHub `页面上操作。同步主仓库是要用 `Git `操作的。现在回到终端中操作。首先，使用 `remote` 系列命令来增加一个关联主机，执行 `git remote add [主机名] [主仓库的地址]`，注意，主仓库的地址使用 `https `开头的：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-5445914307986393756-5b1c750b.png)

如上图所示，主机名是随意定义的，只要不是 origin 就可以，因为自己的仓库地址对应的主机名是 origin，主仓库的主机名通常定义为 up 或 upstream，这个主机名其实就是一个变量，它的值就是仓库地址，例如 `git push origin main` 完全等于 `git push git@github.com:xiaoyivip/work main` 。

现在可以使用前面介绍过的 `fetch` 命令来拉取主仓库的全部分支信息到本地仓库了。

```bash
git fetch up
```

同步主仓库有两种方法：一是执行 `git pull --rebase up master` ，此命令需联网，二是执行 `git rebase up/master`，此命令不联网，因为前面已经执行了 `git fetch up` 这个需要联网的命令，本地已经有了最新的主仓库 master 分支信息，所以可以这么操作。

> 我这里使用方法二来同步

```bash
git rebase up/main
```

**全剧终，再见！**

## 番外，踩坑实录

> 这部分的内容，主要记录一下在使用过程中遇到的一些坑吧，由于平台等因素，可能并不适用于任何人，仅供参考。

### git push遇到的问题

- 使用环境

  - `Windows11`中基于 `wsl`的 `kaliLinux`系统。

- 问题描述

  - 切面步骤没问题，在执行git push时遇到

  > fatal: unable to access 'https://github.com/xiaoyivip/gitdemo.git/': GnuTLS recv error (-110): The TLS connection was non-properly terminated.

- 解决方法

  - 编辑.`gitconfig`文件，添加下面的内容

    ```bash
    [https]
    sslVerify=true
    ```

    > 问题解决。具体原因不详，待研究。
    >
    > - 一个可能的原因是我自己开启了科学上网的模式导致，仅供参考！

### git status遇到的问题

- 使用环境

> 命令的使用环境是Windows版本的git客户端的Bash命令行。

- 问题描述：

> 使用git status时，如果内容中有中文内容，会显示八进制格式的返回结果，而不是中文，显然这不利于我们正常的使用。
> ![](https://b3logfile.com/file/2022/08/solo-fetchupload-13661521523231185062-35b5c82f.png)

- 解决方法

> 1.修改配置文件并全局生效，命令如下：
> ``git config --global core.quotepath false`` **在linux环境下同样适用**
> 2 .修改客户端编码
> 可以在终端窗口空白处双击，出现菜单选择Options->Text
> ![](https://b3logfile.com/file/2022/08/solo-fetchupload-12602547079990349008-cb311fcf.png)
> 解决之后的效果：
> ![](https://b3logfile.com/file/2022/08/solo-fetchupload-13751329048976225819-0967decb.png)



### git pull遇到问题

![image-20220830212821060](https://images.waer.ltd/img/image-20220830212821060.png)

> 解决方法:

```bash
git pull origin master --allow-unrelated-histories
```



---

## GitHub页面部分续集

> 主要更新关于github的网页部分的内容。

## Git命令部分续集

> 这个模块主要还是在前面git教程内容的基础上更新和补充关于git命令部分的一些内容和技巧。

### 获取最近一次提交的内容

> 通过下面的命令可以直接返回最近一次commit的内容。

```bash
git show
# 或者
git log -n1 -p
```

![image-20220604212011585](https://b3logfile.com/file/2022/08/solo-fetchupload-2566087545147917182-8c217f36.png)

> 注意，如果你最近一次commit的内容较多，可能命令行一页展示不完，会进行多页展示，此时可以通过键盘上的空格键进行翻页，结束查看请输入 `q`。

---

### 修改提交信息

> 下面的命令主要的作用场景是你的某一次提交中不小心写错了提交的备注信息并且还未进行push时，需要修改的情况下。

```bash
git commit --amend --only
```

![image-20220604212456028](https://b3logfile.com/file/2022/08/solo-fetchupload-2852041928708778819-79f7f80e.png)

> 该命令会打开你设置的默认编辑器方便编辑，如图我的是vim，如果你不想这样做，也可以一行命令解决。

```bash
git commit --amend --only -m '提交备注信息'
```

如果说，你以及push了本次提交，那么一种方式是修改提交内容之后强推，也就是在推送是加上 `-f`参数，但一般不建议这样做。
