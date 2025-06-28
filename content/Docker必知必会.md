



+++
title = "Docker必知必会"
date = 2023-02-04
tags = ["Docker", "容器化技术", "运维"]
categories = ["运维技术"]
description = "全面介绍 Docker 的安装、常用命令、镜像与容器管理、Dockerfile 编写、网络配置、Compose 编排以及 Portainer 管理工具等内容。"
+++

### 更新日志🎉

2023-2-4

> - 修正了已知的错别字词
> - 重新调整全部配图的上传源(七牛云)
> - 调整排版、优化布局格式

> - 新增docker网络
> - 新增 Compose
> - 新增 Portainer


2022-8-14

> - 新增`docker`[数据卷]内容
> - 修正了一些已知的错误

2022-8-15

> - 新增`docker`常规软件的安装(`docker`踢馆记)

2022-8-26

> - 新增`Dockerfile`部分的内容

---

---

## 安装docker

**安装：**

**Docker 分为 CE 和 EE 两大版本。CE 即社区版（免费，支持周期 7 个月），EE 即企业版，强调安全，付费使用，支持周期 24 个月。**

**Docker CE 分为 **`stable`，`test` 和 `nightly` 三个更新频道。

**官方网站上有各种环境下的**[安装指南](https://docs.docker.com/install/)，这里主要介绍 `DockerCE `在 `CentOS`上的安装。

### 安装前卸载

**如果之前安装过旧版本的Docker，可以使用下面命令卸载：**

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

**首先需要大家虚拟机联网，安装yum工具**

```
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```

**然后更新本地镜像源：**

```
# 设置docker镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

yum makecache fast
```

**然后输入命令：**

```
yum install -y docker-ce
```

**稍等片刻，docker即可安装成功。**

### 演示demo

**按照官网**[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)的文档地址，完成docker的启动、运行`hello-world`demo的示例,进一步体验以加深理解。

## 卸载docker

**按照下面的步骤卸载docker**

```
# 1.
yum remove docker-ce docker-ce-cli containerd.io docker-compose-plugin
# 2.
rm -rf /var/lib/docker
# 3.
rm -rf /var/lib/containerd
```

> **卸载执行之前建议先停止docker**
>
> `systemctl stop docker`

## 配置阿里云镜像加速

> **首先去阿里云官网获取自己的加速地址。**

[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

**按照官方提供的步骤进行镜像地址的修改：**

![image-20220812120103204](https://b3logfile.com/file/2022/08/solo-fetchupload-11920706785547519347-da3282cd.png)

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://zjv4zmyk.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

**上面执行之后运行下面的命令，执行**`hello-world`程序。

```
docker run hello-world
```

![image-20220812120510723](https://b3logfile.com/file/2022/08/solo-fetchupload-5299290355025351570-8d428af0.png)

> **如上表示成功运行！**

**run的工作流程**

![image-20220812120754486](https://b3logfile.com/file/2022/08/solo-fetchupload-16566290565199026087-d055b8cd.png)

## Docker常用命令

### 帮助启动类命令

> **顾名思义，这类命令一般用来帮助启动和管理`docker`容器的。**

```
# 启动docker
systemctl start docker
# 停止docker
systemctl stop docker
# 重启dcoker
systemctl restart docker
# 查看docker状态
systemctl status docker
# 开机启动
systemctl enable docker
# 查看docker概要信息
docker info
# 查看docker帮助命令
docker --help
# 具体的命令帮助
docker 具体的命令 --help
```

### 镜像命令

> **顾名思义，就是用来操作和管理docker镜像的命令。**

```
# 显示本机上的镜像
docker images [options]
# options:
- a 列出所有本地镜像(含历史镜像层)
- q 只显示镜像ID 
# ————————————————————————————————————————————————
# 搜索镜像
docker search 镜像名称
# options
--limit number 镜像名称 默认显示点赞数高的前number个搜索结果
# 远程拉取镜像，如果镜像名称后面不指定版本号TAG，就会默认拉取最新版
docker pull 镜像名称
# 查看镜像/容器/数据卷所占的空间
docker system df
# 删除某个镜像
# 强制删除加上-f参数
docker rmi 镜像名称或者ID
# 全部删除的命令
docker rmi -f $(docker images -qa)[慎用]
```

**面试题**

* **谈谈什么是docker虚悬镜像？**

> **仓库名、标签都是**<none>**的镜像，俗称虚悬镜像**`dangling images`

---

### 容器命令

> **顾名思义，就是用来操作和管理`docker`每一个具体容器的命令。**
>
> **这里以操作`ubuntu`容器作为演示实例。**

**参数说明**

> **—name=“容器的新名字” 为容器指定一个名称，不指定会随机分配一个**
>
> **-d: 后台运行容器并返回容器的ID，也就是启动守护式容器(守护进程、后台运行)**
>
> **-i：以交互模式运行容器，通常与-t参数一起使用**
>
> **-t: 为容器创新分配一个伪输入终端，通常与`-i`一起使用**
>
> **-P ：随机端口映射，**
>
> **-p:指定端口映射(如：-p 8080:8080)**

```
# 运行容器
docker run [参数options]
```

**需要注意的是，由于Ubuntu本身也是一个操作系统，如果需要，我们可以使用**`-it`参数进入交互运行模式，容器启动后，会弹出一个属于`ubuntu`的操作终端。

![image-20220812160349423](https://b3logfile.com/file/2022/08/solo-fetchupload-10926752778261890752-2d85349c.png)

> **注意后面的**`/bin/bash`用来指定交互使用的`shell`类型。
>
> **如果需要退出容器交互，使用**`exit`命令。

```
# 查看docker容器运行情况
docker ps [options]
```

* **options**

> **-a 列出当前所有正在运行的容器和历史运行过的容器**
>
> **-l 显示最近创建的容器**
>
> **-n 显示最近n个创建的容器**
>
> **-q 静默模式，只显示容器的编号**
>
> **更多命令请参考help**

```
# 重启容器
docker restart 容器ID或名称
# 停止容器
docker stop 容器ID或名称
#强制停止容器
docker kill 容器ID或名称
# 删除容器
docker rm 容器ID或名称
# 一次性删除多个容器
docker rm -f$(docker ps -a -q)
docker ps -a -q | xargs docker rm
# 查看运行容器的日志
docker logs 容器ID或名称
# 查看容器内部运行细节
docker inspect 容器ID
# 后台运行模式进入容器内部
1.docker exec -it 容器ID 操作的shel类型(比如`bash`或者`zsh`)
2.docker attach 容器ID
```

> **推荐使用`docker exec`而不是`attach`，因为退出终端不会退出容器.**
>
> **`attach`不会启动新进程，exit退出会导致容器停止，而exec则没有这种问题。**

**问题**

**有时候使用-d后台运行一个容器之后，在使用docker ps查看发现并没有运行记录，也就是已经退出，这是什么情况？**

> **docker 容器后台运行，必须有一个前台进程，容器运行的命令如果不是哪些一直挂起的命令(top,tail等),就会自动退出的。**
>
> **所以可以通过交互模式运行。**

**从容器拷贝文件到主机**

```
docker cp 容器ID：容器内路径 目的主机路径
```

> **注意该操作是在主机上进行。**

**导入/导出容器**

* **export**

> **导出容器的内容流作为一个tar归档文件**

* **import**

> **从tar包中的内容创建一个新的文件系统，再导入为镜像**

* **命令操作**

```
# 导出
docker export 容器ID > 文件名.tar
# 导入
cat 文件名.tar | docker import -镜像用户/名：版本号
```

![image-20220812173159310](https://b3logfile.com/file/2022/08/solo-fetchupload-7663123706109863513-ccc4b8a9.png)

---

## Docker镜像(基础理论)

### 镜像的概念

镜像是一种轻量级、可执行的独立软件包，它包含了某个软件所需要的所有内容，我们把应用程序和配置依赖打包好，形成以一个可交付的运行环境，这个打包好的环境就是`image`镜像，其中包含了**代码、运行时所需的库、环境变量和配置文件等**内容。**只有通过这个镜像文件才能生成`Docker`容器实例。**

### 文件联合系统(`UnionFS`)

**`UnionFS`是一种分层、轻量级并且高性能的文件系统，支持**对文件系统的修改作为一次提交来一层层的叠加。同时可以将不同目录挂载到同一个虚拟文件系统下。

**`UnionFS`文件系统也是`docker`镜像的基础。镜像可以通过分层来进行继承，如此就可以基于基础镜像来制作各种具体的应用镜像。**

**一次可以同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录。**

### 镜像加载原理

`Docker`的镜像实际上是由一层层的文件系统组成，即前面提到的`UnionFS`。

**几个术语的概念**

* `bootfs(boot file system)`

**主要包含**`bootloader`和`kernel,bootloader`主要是引导加载`kernel,Linux`刚启动时会加载`bootfs`文件系统，在**Docker镜像的最底层是引导文件系统`bootfs`。**这一层与经典的`Linux/Unix`系统是一样的，包含了`boot`**加载器和内核**。当`boot`加载完成之后整个内核就都在内存中了，此时内存的使用权已由`bootfs`转交给内核，同时系统也会卸载`bootfs`。

* `rootfs(root file system)`

**在**`bootfs`之上，包含的就是典型`Linux`系统中的`/dev,/proc,/bin,/etc`等标准目录文件。`rootfs`就是各种不同的操作系统发行版，比如`Ununtu`、`CentOS`等。

![image-20220813133531384](https://b3logfile.com/file/2022/08/solo-fetchupload-3047026354977519431-14a9815f.png)

> **对于一个精简的OS，**`rootfs`可以很小，只需要包括**最基本的命令、工具和程序库**就可以了，因为底层直接用`Host`的`kernel`，自己只需要提供 `rootfs`就行了。由此可见对于不同的`linux`发行版, `bootfs`基本是一致的, `rootfs`会有差别, 因此不同的发行版可以共用`bootfs`。

### 分层结构的优势

镜像分层最大的一个好处就是**资源共享**，**方便复制迁移和复用**。

> **比如说有多个镜像都从系统的base镜像构建而来，那么Docker Host只需要在磁盘保存一份base镜像，就可以为所有容器服务了。而且镜像的每一层都可以被共享。**

### 重点，圈起来，要考

**docker镜像都是只读的，容器层是可写的**。当容器启动时，一个新的可写层被加载到镜像的顶部，这一层通常被称为**容器层**，容器层之下的都叫**镜像层。**

所有对**容器层的改动(CRUD之类)都只会发生在容器层中**，只有容器层是可写的，其下的所有镜像层都只是只读。

![image-20220813155426943](https://b3logfile.com/file/2022/08/solo-fetchupload-7838168480958821044-2699ed22.png)

---

### Docker的Commit命令

#### 实操案例

我们将在已有的`ubunutu`镜像的基础上，运行该镜像容器并在内部安装`vim`命令(原来的没有的)。安装之后通过`commit`命令将该镜像重新提交为副本镜像，此时该镜像就是一个已经包含有`vim`支持的`Ubuntu`镜像，同时也包含了所有之前宿主机上Ubuntu镜像的所有内容和功能。

**查看原始的Ubuntu镜像和容器情况。**

![image-20220813153749129](https://b3logfile.com/file/2022/08/solo-fetchupload-8827317075400878678-bc4895e9.png)

可以看到，`ID`尾号`29`的是我们原始的镜像，而正在运行的`ID`尾号的`0a`则是通过运行`29`镜像创建出来的新的镜像，我们在`0a`中安装`vim`命令支持后，通过`commit`重新构建。

![image-20220813154020123](https://b3logfile.com/file/2022/08/solo-fetchupload-4941418772468590502-ffe6a819.png)

**构建过程如下:**

```
docker commit -m='update vim cmd' -a='八尺妖剑' 3cb0176c220a ubuntu/myubuntu:1.2
```

> **解释一下命令：**
>
> **开局一个`docker commit` 装备全靠参数。**
>
> **`-m`参数用来指定提交的内容，类似于git中commit的提交信息**
>
> **`-a` 参数用来指定本此版本的提交作者。**
>
> **之后跟需要提交的镜像ID 再是本次提交的镜像版本情况。**

![image-20220813155000053](https://b3logfile.com/file/2022/08/solo-fetchupload-11807712326428170689-44dbd88d.png)

**如上，构建提交之后，我们再次查看images的情况。**

![image-20220813155040338](https://b3logfile.com/file/2022/08/solo-fetchupload-15598055540361177103-68476850.png)

是不是发现新的镜像已经成功构建，由于我们新增了`vim`功能的支持，再大小上，新版本的`ubuntu:1.0`也比原来的版本大了不少。如此，如果今后我们再使用自己`commit`的新版本的`ubuntu`镜像时，就会发现它自带了`vim`功能，且保留了原来一切的内容。

**当然，你也可以再在base镜像的基础上构建含有更多功能的其他版本镜像，也可以在新构建的镜像的基础上再次构建新的镜像，支持套娃操作，不过，在功能强大的同时，体积也不会拉跨！**

---

### 本地镜像上传到阿里云

**首先在阿里云开通自己的镜像仓库之后，创建命名空间。**

![image-20220813172115062](https://b3logfile.com/file/2022/08/solo-fetchupload-12883805053204955031-9bd36134.png)

**命名空间创建之后，我们在命名空间下创建一个新的镜像仓库，用来存储我们自己构建的镜像数据。**

![image-20220813172232922](https://b3logfile.com/file/2022/08/solo-fetchupload-17868706244304431681-588ac5ff.png)

**在镜像仓库创建结束之后，会自动跳转到官方提供的操作指南页，安装提示一步一步将我们的镜像上传到仓库中。**

![image-20220813172349195](https://b3logfile.com/file/2022/08/solo-fetchupload-9653814762994880645-8d014765.png)

**比如我将前面创建的`ubuntu:1.2`上传到自己的阿里云镜像仓库，操作如下：**

![image-20220813172521572](https://b3logfile.com/file/2022/08/solo-fetchupload-16663582775326683632-26893b53.png)

如此等待`pushing`完成即可在远程仓库中看到自己上传的镜像了，同时也可以自由拉取仓库中的镜像文件来使用，如果是公开的仓库，还可以给其他人进行使用，拉取的命令官方页提供了：

```java
docker pull registry.cn-hangzhou.aliyuncs.com/xu-docker/myubuntu:[镜像版本号]
```

---

### 本地镜像推送到私有库

#### Docker Registry

`Dockerhub`、阿里云这样的公共镜像仓库可能不太方便，涉及机密的公司不可能提供镜像给公网，所以需要创建一个本地私人仓库供给团队使用，基于公司内部项目构建镜像。`Docker Registry`是官方提供的工具，**可以用于构建私有镜像仓库。**

#### 私有库搭建流程

**拉取registry**

```java
docker pull registry
```

**运行私有库**

> 默认情况，仓库被创建在容器的`/var/lib/registry`目录下，建议自行用容器卷映射，方便与宿主机联调。

```
docker run -d -p 5000:5000  -v /ilikexff/myregistry/:/tmp/registry --privileged=true registry
```

![image-20220813183441736](https://b3logfile.com/file/2022/08/solo-fetchupload-1164883366238816564-7ad663fb.png)

**参数说明:**

> -d 表示设为后台运行
>
> -p 指定运行使用的端口号(宿主机端口号:容器内端口号)
>
> -v 指定数据卷映射

**在启动私有仓库之后，为了能更好的理解整个push流程，下面我在源`ubuntu`镜像的基础上新`commit`一个镜像，该镜像新增一个**`net-tools`工具，通过`ifconfig`命令可以查看当前容器的IP地址。

![image-20220813212758367](https://images.waer.ltd/img/solo-fetchupload-1355004452767630664-306cbe0e.png)

> 能看到，`ID`为`346`的就是新创建的容器。

![image-20220813213105721](https://images.waer.ltd/img/solo-fetchupload-5507794109957557169-44dbd50f.png)

接下来我们将通过`commit`构建完成这个新的镜像，我给他命名为`myubuntu:1.2`,通过下面的命令提交构建。

```java
docker commit -m='update ifconfig cmd' -a='八尺妖剑' 3f16668ea346 ubuntu/myubuntu:1.2
```

![image-20220813213511867](https://images.waer.ltd/img/solo-fetchupload-10272846739865788233-feb976fb.png)

**下面就将该镜像作为新的镜像推送到私服仓库。**

**在执行推送之前，我们最好查看一下远程私服仓库的镜像情况。**

```java
curl -XGET http://101.37.150.110:5000/v2/_catalog
```

> 注意命令是在**宿主机执行**，记得`IP`改一下自己的。执行这个命令之后出现下面的情况表示该私服仓库**还没有任何镜像**。

![image-20220813215310368](https://images.waer.ltd/img/solo-fetchupload-6388359107471626906-ff91fb5a.png)

**血的教训：请关闭防火墙，放行5000端口！！！！**

**血的教训：请关闭防火墙，放行5000端口！！！！**

**血的教训：请关闭防火墙，放行5000端口！！！！**

~不然怕你命令执行几百次都没有响应，会激怒心中那头暴躁的小野兽!!嗷嗷~~~

**按照下面的格式准备好新的镜像，**

> **docker   tag   镜像:Tag   Host:Port/Repository:Tag**

**所以有**

```java
docker tag ubuntu/myubuntu:1.2  101.37.150.110:5000/ubuntu/myubuntu:1.2
```

![image-20220813221213222](https://images.waer.ltd/img/solo-fetchupload-11407495650052434662-f0b08c3f.png)

先别急着`push`，出于安全考虑，`docker`是禁止使用`http`协议推送镜像的，所以这里需要先修改配置文件，暂时取消禁制。

```sh
# 打开该文件
vim /etc/docker/daemon.json
```

![image-20220813220544374](https://images.waer.ltd/img/solo-fetchupload-2157136057553653815-ea70db06.png)

如上，新增部分的内容我已经用蓝色框出来了，注意右边的逗号，需要符合`JSON`格式哈。还有`IP`改为自己的`IP`，别做无脑`CV`工程师。

**开始推送镜像到私服仓库。**

```java
docker push 101.37.150.110:5000/ubuntu/myubuntu:1.2
```

如果推送的时候遇到这种情况，原因是前面修改的文件可能没有生效，解决办法就是重启`docker`，然后运行**docker registry**私服，再次推送就成功了。

**推送之后，可以再次查看私服中有哪些镜像。**

```bash
curl -XGET http://101.37.150.110:5000/v2/_catalog
```

![image.png](https://images.waer.ltd/img/image-09f5b244.png)

至此向私服推送镜像就完成了，可以通过下面的方式从私服拉取刚刚`push`的镜像下来玩玩看看正不正常，这不是必须的步骤，主要是感受一下这个`commit`、`push、pull`的过程。

```bash
docker pull 101.37.150.110:5000/ubuntu/myubuntu:1.2
```

### 数据卷

#### 概念

卷就是目录或者文件，存在于一个或者多个容器中，由`docker`挂载到容器，但**不属于联合文件系统**，因此能够绕过`UnionFS`,提供的一些用于持续存储或共享数据的特性。

> 前面的内容可还有印象，归因于容器数据的备份，手动`cp`。
>
> 关于容器的导入导出的`impot`、`export`命令。

上面的内容本质上都是为了对容器镜像数据进行备份而来的，但实际操作起来比较麻烦。所以卷设计的目的就是为了数据的持久化，完全独立于容器的生存周期，因此`Docker`**不会再容器删除时把挂载的数据卷也顺走了**。

**特点:**

> 1：数据卷可在容器之间共享或重用数据
> 2：卷中的更改可以直接实时生效
> 3：数据卷中的更改不会包含在镜像的更新中
> 4：数据卷的生命周期一直持续到没有容器使用它为止

**运行一个带有容器卷存储功能的容器实例**

```java
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录      镜像名
```

**这里特别注意一下**`--privileged=true`参数，它的作用就是开启数据卷的**目录权限**，否则数据卷在挂载使用的过程中可能会遇到一些权限不足等等乱七八糟的问题，所以保险起见，建议都带上它，人畜无害！

#### 使用示例

> **演示数据卷的大致使用过程以及一些需要注意的地方。**

**先作这样一个约定：**

我们在宿主机(`centos`)上运行一个`ubuntu`镜像，并通过数据卷挂载的方式将镜像的数据文件目录挂载到宿主机的`/tmp/dokcer_backup`目录下，对应于`ubuntu`镜像中的`/tmp/docker_data`目录。

**上面的约定可以简单的使用映射的方式表示：**

> /tmp/docker_backup:/tmp/docker_data **冒号左边的部分表示宿主机的目录**，右边部分表示映射的**镜像内部**的目录。

完成上述的映射设置之后，理论上我们在`docker`容器内部`/tmp/docker_data/`目录下产生的所有文件都会实时的更新到宿主机的`/docker_backup/`目录下。

**具体的操作**

* **挂载运行ubuntu镜像容器。**

```
docker run -it --privileged=true -v /tmp/docker_backup:/tmp/docker_data --name=myub1 ubuntu
```

![image-20220814143227660](https://images.waer.ltd/img/solo-fetchupload-1428822832276749836-3df23f28.png)

容器已经运行，我们在容器内进入指定的映射目录，看看是否真的存在

![image-20220814143329554](https://images.waer.ltd/img/solo-fetchupload-2249120678644538093-a005f784.png)

> 确实能找到这个路径，事实上，我们挂载的数据卷的目录，如果提前没有创建，那么系统会自动检测，不存在就会帮你自动创建，所以不用担心路径目录不存在的情况。

同理，在宿主机中也是可以找到`/tmp/docker_backup/`目录的。

* **创建数据文件**

在容器内的指定目录下随意创建一个文件，回到宿主机的目录下看看是否真的能够同步过去。

> **在容器内目录创建一个dockers.txt文件。**

```java
cd /tmp/docker_data/
touch dockers.txt
```

![image-20220814143906504](https://images.waer.ltd/img/solo-fetchupload-5284680104238031988-5f22f783.png)

回到宿主机看看情况。

![image-20220814143945080](https://images.waer.ltd/img/solo-fetchupload-4995985329528350771-4f7edc6e.png)

中国人不骗中国人，这个文件确实被同步到宿主机了。

**那么，既然在容器内的文件数据能够同步到宿主机，宿主机上产生的数据会不会一样也能够被同步到容器内呢？？**

> 答案是肯定的，这里就不作演示了，自己试试就知道了。

* **查看挂载信息**

**挂载是挂载了，映射也没啥问题。但如果时间够长，操作够复杂，也难免会出现遗忘的情况，就是我可能不记得自己的宿主机挂载到容器哪个位置了，这时候就要用到之前的一个命令：**`inspect`

```java
docker inspect 容器ID
```

![image-20220814145019188](https://images.waer.ltd/img/solo-fetchupload-12312341694518264738-e8e6e297.png)

> 命令执行的结果返回的是一个很长的`JSON`数据，但就本处的内容而言，只需要了解其中一小部分即可，如上图，`JSON`串中有一块名为`Mounts`的数据，这就是挂载的情况。
>
> **Source:宿主机对应的目录**
>
> **Destination：容器内映射的目录**
>
> **其他信息…**

如果此时容器停止，宿主机文件有变动，再次重启容器，那么宿主机的变更也还会同步到容器内的哈

**同时，-v参数可以有多个，也就是数据卷支持同时挂载多个**

#### 权限调整

上面执行的挂载使用的默认规则，也就是挂载用的容器内部目录拥有`rw`读写权限。

```java
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:rw      镜像名
```

如果说实际需要，我们还可以自己调整容器内目录的权限为`ro`即只读权限(`read only`)。

```java
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:ro     镜像名
```

#### 卷的继承&共享

假设我们对`Ubuntu1`和宿主机作了映射之后，再需要另外一个镜像来复用`Ubuntu1`的数据卷挂载信息，可以通过继承`Ubtuntu1`的方式实现。

```java
docker run -it  --privileged=true --volumes-from 父类  --name u2 ubuntu
```

**特点：**

> **`Ubuntu1`(简称`u1`)作为被`u2`继承的父镜像，他们和宿主机之间是可以信息互通的。**
>
> **尽管`u2`继承自`u1`，如果`u1`挂掉了，此时并不会影响`u2`和宿主机之间的互通**
>
> **若重启挂掉的`u2`之后，之前`u1`和宿主机之间的数据也会同步到`u2`**

## Docker踢馆记

**楔子**

> 话说有一天，作为后起之秀的docker，觉得自己备受爱戴，牛逼坏了的它准备背起行囊，周游业内各国名将，所到之处，那是腥风血雨，寸草不生……

### 安装Tomcat

#### 镜像拉取

镜像可以在官方的dockerhub搜索，然后按照上面的拉取命令拉取。官方镜像地址[https://hub.docker.com/_/tomcat](https://hub.docker.com/_/tomcat)

![image-20220815163954643](https://images.waer.ltd/img/solo-fetchupload-6169731484143770530-35b8aa51.png)

**记住，如果在拉取时不指定版本号，那默认会拉取最新版本，但就tomcat最新的docker版来说，其实是有一些坑的，为了节约时间和篇幅(主要是我七牛云OSS空间东西太多，不想贴图了哈哈哈)我简单的说一下这个坑就好了。**

> 我们在拉取最新版的`tomcat`之后，一般情况下，只需要按照官方提供的运行命令直接启动`tomcat`，然后访问映射的端口号即可成功访问到它经典的猫页，可新版的`tomcat`在这些步骤完成之后访问发现出现了`404`。原因是在tomcat的配置文件`webapps`中的内容是空的，新的东西应该是`webapps.dist`，所以解决办法：把`webapps.dist`目录换成`webapps`
>
> * **将原来的**`webapps`目录删除
>
> ```
> rm rf webapps
> ```
>
> * **将**`webapps.dist`替换为`webapps`。
>
> ```
> mv webapps.dist webapps
> ```
>
> * **打完收工！！这次就能看在浏览器看到猫叔了。**

#### 免修改版本演示

所以鉴于上，我直接演示其他版本的tomcat的整个安装流程。

```java
# 拉取免修改的tomcat版本，虽然我执行的是运行命令，但由于我本来就没有这个镜像，所以它会自动拉取
docker run -d -p 8080:8080 --name mytomcat8 billygoo/tomcat8-jdk8
```

查看启动成功之后，我们在浏览器访问ip:8080端口,看看能不能顺利的去到猫叔家。

![image-20220815170335631](https://images.waer.ltd/img/solo-fetchupload-5426165259532121138-6c1d3dc5.png)

好，成功了，so easy to happy ！！

下面请跟着我打一套组合拳，一口气灭它9族，毕竟我是个莫得感情的机器人，你于我无用了，我就会无情的抛弃你。

```java
docker stop 容器ID
docker rm -f 容器ID
docker rmi 镜像ID
```

打完收工，出发下一家！！！

> 此时轻松拿下猫叔的`docker`嘴角上扬，心想，猫叔都都不堪一击，接下来的`MySql`也不会棘手！！！

### 安装MySql

> 为了证明自己的实力，docker并不打算挑战最新版的`mysql`(毕竟新人经验不足),而是直接对线常胜将军`mysql:5.7`，它的资历虽比猫叔略逊那么一点点，但自己经验那叫一个老道，稳如老狗！于是乎，`mysql:5.7`也是欣然接受了·的挑战

```java
# 拉取mysql:5.7
docker pull mysql:5.7
```

```java
# 运行容器实例(数据卷挂载的方式)
docker run -d -p 3306:3306 --privileged=true -v /tools/mysql/log:/var/log/mysql -v /tools/mysql/data:/var/lib/mysql -v /tools/mysql/conf:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=123456  --name mysql mysql:5.7
```

![image-20220815175037225](https://images.waer.ltd/img/solo-fetchupload-9455904427670233517-0fe5e675.png)

> 第一回合下来，`docker`感觉没有任何压力，轻松拿捏就是了！！！

#### 基本配置

```java
# 在宿主机上切到/conf目录
cd /tools/mysql.conf
# 新建my.cnf,通过挂载卷在宿主机操作容器
vim.cnf
# 添加文件内容
[client]
default_character_set=utf8 
[mysqld]
collation_server = utf8_general_ci
character_set_server = utf8
# 重启实例，加载配置
docker restart mysql
```

> 第二回合就这样结束了。尽管`mysql`此时已伤痕累累，但`docker`额头也是渗出了豆大的汗珠，它暗自嘀咕:想不到这家伙确有两把刷子…

#### 使用测试

```java
# 进入容器内部
docker exec -it mysql bash
# 登录mysql
mysql -uroot -p
# 键入密码....
# 成功登录
```

![image-20220815180306326](https://images.waer.ltd/img/solo-fetchupload-1478160933299215099-02b8954e.png)

```java
# 查看字符集是否设置生效
# docker安装完MySQL并run出容器后，建议请先修改完字符集编码后再新建mysql库-表-插数据
SHOW VARIABLES LIKE 'character%';
```

![image-20220815180730126](https://images.waer.ltd/img/solo-fetchupload-13053466134966946764-faaf7d80.png)

```sql
# 建库建表
CREATE DATABASE t1
USE t1
CREATE TABLE user(id int,name varchar(20));
```

![image-20220815181117122](https://images.waer.ltd/img/solo-fetchupload-5307588143745079317-b2e2ddfa.png)

**使用**`navcat`客户端连接该数据库进行基本测试

![image-20220815181834976](https://images.waer.ltd/img/solo-fetchupload-3456468250938236248-a7ce5701.png)

```sql
# 新增和查询
INSERT user
VALUES(1,'ilikexff')

INSERT user
VALUES(2,'八尺妖剑')

SELECT id,name 
FROM user
```

![image-20220815182611587](https://images.waer.ltd/img/solo-fetchupload-2169595883318097734-7371eab1.png)

> 第三回合下来，此时的`docker`可谓是伤敌一千，自损八百。它不曾想过，眼前这个`5.7`别看长的不怎么样，打起架来可是又狠又稳，一点也不含糊，甚至还请来了猫叔的远房亲戚`navcat`大表哥助阵。可为了面子，`docker`还得装作啥事没有的表情，迎接`5.7`的最后一击……

#### 数据持久化测试

**可以看到，在宿主机中已经有了数据库的数据文件。**

![image-20220815183756511](https://b3logfile.com/file/2022/08/solo-fetchupload-17854143796692009672-8ba14694.png)

```java
# 对mysql进行删库跑路，再重启，以测试之前的数据卷映射是否起到了数据持久化备份的功能
docker rm -f mysql
# 重新运行mysql
docker run -d -p 3306:3306 --privileged=true -v /tools/mysql/log:/var/log/mysql -v /tools/mysql/data:/var/lib/mysql -v /tools/mysql/conf:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=123456  --name mysql mysql:5.7
```

![image-20220815184105977](https://b3logfile.com/file/2022/08/solo-fetchupload-2515771610511412997-2fcab004.png)

**哇哦，数据果然都在，真不错！有点东西啊。**

这是最后一个回合了，一架下来，`mysql:5.7`的伤势严重，五脏六腑都被`docker`摸了个遍，它捂着胸口喘息:

> > `docker`兄不愧为开发界的后起之秀，在下佩服！话毕，它又一口老血喷出，把扶着它的远方大表哥喷了一脸都是。
> >
> > 固为亲戚,大表哥嘴上不说，心里一阵嘀咕:
> >
> > > **淦！！你再喷一个试试，信不信劳资反手一个大嘴巴子直接把你送走。**
>
> **`docker`实在是伤的不轻，它也顾不得面子，赶紧掏出不时之需的金疮药往肚皮上就是顿贴，毕竟自己太傲娇，常年没有健身的它早就大腹便便，这次倒好，被`mysql`这家伙捅了几个洞，海水直流:**
>
> > **`mysql`,你江湖人称稳如老狗的名号果然不是盖的，你是个值得尊重的对手，这次就不杀你了，我得保留体力，后面还要挑战`redis`和`nginx`，他们也非等闲之辈！！说完就走了…..**

### 安装Redis

尽管和`mysql`那一战自己受了重伤，但好在`docker`有祖传的秘书，一重启又是一个全新的`docker`之身。它长途跋涉，来到`redis`家门口，悄悄门，此时一个年轻的小伙子打开了门：

> > 你就是Redis？docker道。
>
> > 小伙子摇摇头，我是`jedis`,我师傅在健身房等候你多时了，这边请…
>
> 在`jedis`的带领下，二人来到了一处宽敞的屋子，里面摆着各式各样的健身器材。场地中央，只见一人正在举着什么东西，细看去，原来是一对哑铃，分别标着`RDB`**和**`AOF`字样，一看就知道有些分量。
>
> > `docker`二话不说，身上的包袱一甩，奔着`redis`后脑勺就是一沙包大的拳头抡过去，两个年轻人的战斗就此拉开…

### 安装Nginx

> 待更新....

****

## Dockerfile

### 概述

`Dockerfile`是用来构建`Docker`镜像的文本文件，是由一条条构建镜像所需的指令和参数构成的脚本。

![image-20220826105611886](https://images.waer.ltd/img/image-20220826105611886.png)

官网：https://docs.docker.com/engine/reference/builder/

构建步骤：

- 编写Dockerfile文件
- docker build命令构建镜像
- docker run 依镜像运行容器实例

### Dockerfile构建过程

#### Docklerfile基础知识

- 每条保留字指令都必须是**大写字母**且后面要跟随至少一个参数。
- 指令从上到下顺序执行
- \# 表示注释内容
- 每条指令都会创建一个新的镜像层并对镜像进行提交

#### 执行Dockerfile的大致流程

- `docker`从基础镜像运行一个容器
- 执行一条指令并对容器作出修改
- 执行类似`docker commit`的操作提交一个新的镜像层
- `docker`在基于刚提交的镜像运行一个新的容器
- 执行`dockerfile`中的下一条指令直到所有指令都执行完成。

所有指令执行完成。

#### 扩展

从应用软件的角度来看，`Dockerfile`、`Docker`镜像与`Docker`容器分别代表软件的三个不同阶段，

*  `Dockerfile`是软件的原材料
*  `Docker`镜像是软件的交付品
*  `Docker`容器则可以认为是软件镜像的运行态，也即依照镜像运行的容器实例
   `Dockerfile`面向开发，`Docker`镜像成为交付标准，`Docker`容器则涉及部署与运维，三者缺一不可，合力充当`Docker`体系的基石。

![image-20220826114215288](https://images.waer.ltd/img/image-20220826114215288.png)

1.  `Dockerfile`，需要定义一个`Dockerfile`，`Dockerfile`定义了进程需要的一切东西。`Dockerfile`涉及的内容包括执行代码或者是文件、环境变量、依赖包、运行时环境、动态链接库、操作系统的发行版、服务进程和内核进程(当应用进程需要和系统服务和内核进程打交道，这时需要考虑如何设计`namespace`的权限控制)等等;
2.  `Docker`镜像，在用`Dockerfile`定义一个文件之后，`docker build`时会产生一个`Docker`镜像，当运行 `Docker`镜像时会真正开始提供服务;
3.  `Docker`容器，容器是直接提供服务的。

### Dockerfile常用保留字

> 下面列出的保留字都可以在官网查看。

**FROM**

> 基础镜像，当前镜像是基于哪个镜像的，指定一个已经存在的镜像最为模板，第一条必须是FROM。

**MAINTAINER**

> 镜像维护者的姓名和邮箱地址。

**RUN**

> - 容器构建时需要运行的命令。
>
> - 格式
>
>   - shell
>
>     ![image-20220826114832066](https://images.waer.ltd/img/image-20220826114832066.png)
>
>   - exec
>
>     ![image-20220826114842611](https://images.waer.ltd/img/image-20220826114842611.png)
>
> - RUN是在docker build时运行。

**EXPOSE**

> 当前容器对外暴露的端口号。

**WORKDIR**

> 指定在创建容器之后，终端默认登录进来的工作目录，作为一个起始落脚点。

**USER**

> 指定该镜像以什么样的用户去执行，如果都不指定，默认是root。

**ENV**

> - 用来在构建镜像过程中设置环境变量。
>
> - `ENV MY_PATH /usr/mytest`
>
>   > 这个环境变量可以在后续的任何`RUN`指令中使用，这就如同在命令前面指定了环境变量前缀一样；
>   > 也可以在其它指令中直接使用这些环境变量，
>   >
>   > 比如：`WORKDIR $MY_PATH`

**ADD**

> 将宿主机目录下的文件拷贝进镜像且会自动处理URL和解压tar压缩包。

**COPY** 

> 类似ADD，拷贝文件和目录到镜像中。
> 将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置。
>
> > `COPY src dest`
> >
> > `COPY ["src", "dest"]`
> >
> > <src源路径>：源文件或者源目录
> > <dest目标路径>：容器内的指定路径，该路径不用事先建好，路径不存在的话，会自动创建。

**VOLUME**

> 容器数据卷，用于数据保存和持久化工作。

**CMD**

> - 指定容器启动后的要做的事情。
> - 注意
>   - `Dockerfile `中可以有多个 `CMD `指令，但只有最后一个生效，`CMD `会被 `docker run `之后的参数替换
> - 它和前面RUN命令的区别
>   - `CMD`是在`docker run `时运行。
>   - `RUN`是在 `docker build`时运行。

**ENTRYPOINT**

> 也是用来指定一个容器启动时要运行的命令
>
> 类似于 `CMD `指令，但是`ENTRYPOINT`不会被`docker run`后面的命令覆盖，
> 而且这些命令行参数会被当作参数送给 `ENTRYPOINT `指令指定的程序。
>
> 命令格式/案例
>
> > 命令格式：
> > `ENTRYPOINT`可以和`CMD`一起用，一般是变参才会使用 `CMD `，这里的 `CMD `等于是在给 `ENTRYPOINT `传参。
> > 当指定了`ENTRYPOINT`后，`CMD`的含义就发生了变化，不再是直接运行其命令而是将`CMD`的内容作为参数传递给`ENTRYPOINT`指令，他两个组合会变成
> >
> > 案例如下：假设已通过 `Dockerfile `构建了 `nginx:test `镜像：
> >
> > ![image-20220826115931550](https://images.waer.ltd/img/image-20220826115931550.png)
> >
> > | 是否传参         | 按照`dockerfile`编写执行         | 传参运行                                        |
> > | ---------------- | -------------------------------- | ----------------------------------------------- |
> > | Docker命令       | `docker run  nginx:test`         | `docker run  nginx:test -c /etc/nginx/new.conf` |
> > | 衍生出的实际命令 | `nginx -c /etc/nginx/nginx.conf` | `nginx -c /etc/nginx/new.conf`                  |
>
> 优点
>
> > 在执行`docker run`的时候可以指定 `ENTRYPOINT `运行所需的参数。
>
> 注意
>
> >  `Dockerfile `中如果存在多个 `ENTRYPOINT `指令，仅最后一个生效。

### 案例演示

####  构建需求

> 基于最新版的`centos`镜像构建，使具备`vim+ifconfig+jdk11`支持。
>
> 具体版本:`jdk-11.0.16_linux-x64_bin.tar.gz`

关于`JDK`的下载地址

https://www.oracle.com/java/technologies/downloads

> 我将上面下载的JDK放到了/root目录下。

#### 文件编写

> 编写内容之前先pull一下`centos`镜像。
>
> ```bash
> docker pull centos
> ```

```dockerfile
FROM centos:7
MAINTAINER 八尺妖剑<ilikexff@163.com>
 
ENV MYPATH /usr/local
WORKDIR $MYPATH

#安装vim编辑器
RUN yum -y install vim
#安装ifconfig命令查看网络IP
RUN yum -y install net-tools
#安装java8及lib库
RUN yum -y install glibc.i686
RUN mkdir /usr/local/java
#ADD 是相对路径jar,把jdk-11.0.16_linux-x64_bin.tar.gz添加到容器中,安装包必须要和Dockerfile文件在同一位置
ADD jdk-11.0.16_linux-x64_bin.tar.gz /usr/local/java/
#配置java环境变量
ENV JAVA_HOME /usr/local/java/jdk-11.0.16
ENV JRE_HOME $JAVA_HOME/jre
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib:$CLASSPATH
ENV PATH $JAVA_HOME/bin:$PATH

EXPOSE 80

CMD echo $MYPATH
CMD echo "success--------------ok"
CMD /bin/bash
```

同样的，Dockerfile文件也放在和JDK相同的/root目录下。

#### 构建Dockerfile

```bash
docker build -t centosjava11:1.5 .
```

> 格式:docker build -t 新镜像名字:TAG .
>
> 注意TAG后面有一个空格再加上.(半角)

构建过程

![image-20220826192853279](https://images.waer.ltd/img/image-20220826192853279.png)

能看到确实已经执行到了文件脚本的最后一行并打印了成功的输出。查看镜像发现，确实已经成功构建

![image-20220826193004880](https://images.waer.ltd/img/image-20220826193004880.png)

那么是不是真的具有了前面需求中的功能，我们验验货。

```bash
docker run -it 容器ID /bin/bash
```

![image-20220826193421296](https://images.waer.ltd/img/image-20220826193421296.png)

验证通过，需求提到的所有功能已经全部支持。

#### 虚悬镜像体验

**概念**

仓库名、标签都是<none>的镜像，俗称dangling 

来自己创建一个虚悬镜像体验一下。下面的`Dockerfile`的内容:

```bash
from ubuntu
CMD echo 'action is success'
```

运行：

```bash
docker build .
```

**查看镜像**

```bash
# 专门查看虚悬镜像的命令
docker image ls -f dangling=true
```

![image-20220826194502455](https://images.waer.ltd/img/image-20220826194502455.png)

一般情况下，虚悬镜像可能由于我们再创建和输删除镜像的过程中出现异常产生的，本身并没有实用价值，所以如果出现虚悬镜像，建议直接删除，不要留恋！！

**删除虚悬镜像**

```bash
docker image prune
```

****

## Docker微服务实战

### 通过IDEA新建一个普通微服务模块

- maven配置

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>2.7.3</version>
          <relativePath/> <!-- lookup parent from repository -->
      </parent>
      <groupId>com.docker</groupId>
      <artifactId>docker-boot</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>docker-boot</name>
      <description>Demo project for Spring Boot</description>
      <properties>
          <java.version>11</java.version>
      </properties>
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-test</artifactId>
              <scope>test</scope>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  ```

- application.properties

  ```yaml
  server.port=8081
  blog.addr=https://www.waer.ltd
  ```

- helloController.java

  ```java
  package com.waer.docker.dockerboot.controller;
  
  import org.springframework.beans.factory.annotation.Value;
  import org.springframework.web.bind.annotation.GetMapping;
  import org.springframework.web.bind.annotation.RestController;
  
  @SuppressWarnings("all")
  /**
   * @author: 八尺妖剑
   * @date: 2022/8/29 18:09
   * @email: ilikexff@gmail.com
   * @blog: https://www.waer.ltd
   */
  @RestController
  public class helloController {
      @Value("${server.port}")
      private String port;
      @Value("${blog.addr}")
      private String addr;
  
      @GetMapping("/hello/docker")
      public String helloDocker () {
          return "服务端口号:" + port + "博客地址:" + addr;
      }
  }
  ```

****

### 将项目打成jar包

![image-20220829183742924](https://images.waer.ltd/img/image-20220829183742924.png)

****

### 编写Dockerfile文件并上传

```dockerfile
# 基础镜像使用java
FROM java:8
# 作者
MAINTAINER 八尺妖剑
# VOLUME 指定临时文件目录为/tmp，在主机/var/lib/docker目录下创建了一个临时文件并链接到容器的/tmp
VOLUME /tmp
# 将jar包添加到容器中并更名为hello_docker.jar
ADD docker-boot-0.0.1-SNAPSHOT.jar hello_docker.jar
# 运行jar包
RUN bash -c 'touch /hello_docker.jar'
ENTRYPOINT ["java","-jar","/hello_docker.jar"]
#暴露8081端口作为微服务
EXPOSE 8081
CMD echo '构建完成.....build success!'
```

之后将写好得文件上传到`/root/docker`目录下，当然这个目录你可以自定义，但是建议把jar包和dockerfile放到相同目录下。

![image-20220829190639024](https://images.waer.ltd/img/image-20220829190639024.png)

****

### 构建镜像

```bash
docker build -t hello_docker:1.5 .
```

![image-20220829191258216](https://images.waer.ltd/img/image-20220829191258216.png)

> docker images

![image-20220829191342153](https://images.waer.ltd/img/image-20220829191342153.png)

****

### 运行容器

> 运行命令之前请确保8081端口已经打开。

```bash
docker run -d -p 8081:8081 hello_docker:1.5
```

![image-20220829194859285](https://images.waer.ltd/img/image-20220829194859285.png)

**如果在运行是遇到下的问题**

![image-20220829194944787](https://images.waer.ltd/img/image-20220829194944787.png)

这是由于打包的本地`Java`版本和`FROM `的`Java`版本不一致导致的，严格地说就是使用高版本打包的`jar`运行在低版本的`java`环境得不到支持。解决方法是修改本地`pom.xml`：

```xml
<properties>
    <java.version>1.8</java.version>
</properties>
```

修改为`1.8`再刷新`maven`之后重新打包上传即可解决。

****

## Docker网络

### 开局一条命(令)

在宿主机上启动docker之后，我们通过`ifconfig`命令查看主机的网络情况：

![image-20220827180000423](https://images.waer.ltd/img/image-20220827180000423.png)

你会发现这里多了一个名为`docker0`的网络模块。不严格的说，这个就是docker的网络。

**查看网络模式**

docker默认有三大网络模式，通过下面的命令可以查看。

```bash
docker network ls
```

![image-20220827180746719](https://images.waer.ltd/img/image-20220827180746719.png)

分别是桥接、主机、空模式。

### 装备全靠help

> 了解关于`doker`网络的基本命令的使用，最快的方式就是官方的`help`命令。

```bash
docker network COMMAND --help
```

![image-20220827181152203](https://images.waer.ltd/img/image-20220827181152203.png)

通过一个小案例实际操作一遍上面的大部分命令。我们自己创建一个docker网络。

```shll
docker network create mynet
```

查看网络

```bash
docker network ls
```

查看网络数据源

```sh
docker network inspect mynet
```

删除网络

```bash
docker network rm mynet
```

**docker网络可以作容器的互联和通信、端口映射。容器IP变动时可以通过服务名称直接进行网络通信，而不受到影响。**

### 网络模式

![image-20220827182448518](https://images.waer.ltd/img/image-20220827182448518.png)

上面列出的四种模式分别使用下面的方式进行指定：

```bash
--network bridge 指定，默认使用docker0
--network host指定
--network none指定
--network container:NAME或者容器ID指定
```

**容器实例内默认网络IP生成规则**

先启动两个容器

![image-20220827184218063](https://images.waer.ltd/img/image-20220827184218063.png)

再通过`docker inspect 容器名`来查看容器的网络情况。

![image-20220827184410564](https://images.waer.ltd/img/image-20220827184410564.png)

![image-20220827184551683](https://images.waer.ltd/img/image-20220827184551683.png)

可以看到两个都是采用`bridge`桥接模式且公用一个网关，但各自的IP是不一样的。也就是说**docker容器内部的ip是有可能会发生改变的。**

#### bridge

`Docker `服务默认会创建一个 `docker0` 网桥（其上有一个 `docker0` 内部接口），该桥接网络的名称为`docker0`，它在内核层连通了其他的物理或虚拟网卡，这就将所有容器和本地主机都放到同一个物理网络。`Docker `默认指定了 `docker0 `接口 的 `IP `地址和子网掩码，让主机和容器之间可以通过网桥相互通信。

查看 `bridge `网络的详细信息，并通过 `grep `获取名称项

```bash
docker network inspect bridge | grep name或者ifcong | grep docker
```

![image-20220827185858829](https://images.waer.ltd/img/image-20220827185858829.png)

****

## Docker-compose容器编排

### 概述

`Compose `是 `Docker `公司推出的一个工具软件，可以管理多个 `Docker `容器组成一个应用。你需要定义一个 `YAML `格式的配置文件`docker-compose.yml`，写好多个容器之间的调用关系。然后，只要一个命令，就能同时启动/关闭这些容器。

`docker`建议我们每一个容器中只运行一个服务,因为`docker`容器本身占用资源极少,所以最好是将每个服务单独的分割开来但是这样我们又面临了一个问题？如果我需要同时部署好多个服务,难道要每个服务单独写`Dockerfile`然后在构建镜像,构建容器,这样累都累死了,所以`docker`官方给我们提供了`docker-compose`多服务部署的工具。

例如要实现一个Web微服务项目，除了`Web`服务容器本身，往往还需要再加上后端的数据库`mysql`服务容器，`redis`服务器，注册中心`eureka`，甚至还包括负载均衡容器等等。

`Compose`允许用户通过一个单独的`docker-compose.yml`模板文件（`YAML `格式）来定义一组相关联的应用容器为一个项目（`project`）。

可以很容易地用一个配置文件定义一个多容器的应用，然后使用一条指令安装这个应用的所有依赖，完成构建。`Docker-Compose` 解决了容器与容器之间如何管理编排的问题。

****

### 下载安装

下载安装学习，首选官方文档。

[下载地址](https://docs.docker.com/compose/install/)

[文档地址](https://docs.docker.com/compose/compose-file/compose-file-v3/)

~~注意先去官方文档看一下compose和docker版本之间的要求，别看着命令就是一顿瞎搞，结果下了个寂寞..~~

#### 具体命令

```bash
# 下载compose
curl -SL https://github.com/docker/compose/releases/download/v2.7.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
# 提升权限
chmod +x /usr/local/bin/docker-compose
# 查看版本
docker-compose --version
```

### 核心概念

#### 文件

`docker-compose.yml`

#### 服务(service)

一个个应用容器实例，比如订单服务、库存服务、`mysql`容器、`nginx`容器或者`redis`容器。

#### 工程(project)

由一组关联的应用容器组成的一个完整的业务单元，在`docker-compose.yml`中定义。

****

### 使用步骤

- 编写`Dockerfile`定义各个微服务应用并构建出对应的镜像文件。
- 使用`docker-compose.yml`定义一个完整的业务单元，安排好整体应用中的各个容器服务。
- 执行`docker-compose up`命令来启动并运行整个应用程序，完成一键部署上线。

****

### Compose常用命令

```bash
# 帮助
docker-compose -h
# 启动所有的docker-compose服务
docker-compose up
# 启动服务并保持后台运行
docker-compose up -d
# 停止并删除容器、网络、卷、镜像
docker-compose down
# 进入容器实例内部
 docker-compose exec [docker-compose.yml文件中写的服务id] /bin/bash
# 展示当前docker-compose编排过的运行的所有容器
docker-compose ps
# 展示当前docker-compose编排过的容器进程
docker-compose top
# 检查配置
docker-compose config
# 检查配置，有问题才有输出
docker-compose config -q
# 重启服务
docker-compose restart   
# 启动服务
docker-compose start     
# 停止服务
docker-compose stop      
```

****

## Portainer

### 概述

`Portainer `是一款轻量级的应用，它提供了图形化界面，用于方便地管理Docker环境，包括单机环境和集群环境。

[官方文档](https://docs.portainer.io/v/ce-2.9/start/install/server/docker/linux)

### 下载安装

> 具体的安装细节可以参考官方文档，执行下面的命令可以直接安装之。

```bash
docker run -d -p 8000:8000 -p 9000:9000 --name portainer     --restart=always     -v /var/run/docker.sock:/var/run/docker.sock     -v portainer_data:/data     portainer/portainer
```

其实本质上就是跑了一个容器，注意需要打开9000和8000端口。容器跑起来之后，浏览器访问`IP:9000`即可打开管理页面。

![image-20220901155124820](https://images.waer.ltd/img/image-20220901155124820.png)

设置密码注册之后可以看到主模板概览如下。

![image-20220901155246297](https://images.waer.ltd/img/image-20220901155246297.png)

至此安装完毕！

****

### 使用Portainer安装Ngnix

![image-20220901155640473](https://images.waer.ltd/img/image-20220901155640473.png)

基本的配置就是这样，如果对网络、数据卷挂载等复杂的操作，把页面下拉就可以看到，如果了解了命令行的使用方式以及基本原理，那么可视化就更容易理解了。

****

这篇博客全部内容就暂时固定了，后面有时间会补更一些实战方面的内容，毕竟纸上得来终觉浅！