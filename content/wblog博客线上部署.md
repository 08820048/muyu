
+++
title = "SpringBoot博客部署"
description = "本文详细介绍了如何将基于SpringBoot的博客项目部署到线上服务器，涵盖环境准备、数据库配置、JAR包部署、域名解析及HTTPS加密访问等内容。"
date = 2025-06-18
+++



# SpringBoot博客部署

## 环境准备

### 博客项目地址

[wblog](https://github.com/xiaoyivip/wblog)

---

### 安装JDK

> **JDK8以上就行，但建议使用JDK11，下面以JDK11为例。**

* **下载安装**

```
apt-get install openjdk-11-jdk
```

* **配置环境变量**

> **打开source /etc/profile，添加如下内容**

```
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

* **查看版本**

```
java -version
```

![image-20220803211815252](https://b3logfile.com/file/2022/08/solo-fetchupload-3602254078247600542-9c357ab0.png)

---

### 安装MySQL

> **安装MySQL5.7docker版本。**

```
#安装docker
apt install docker.io
# 安装mysql
docker pull mysql:5.7
```

> **服务器安全组中务必放行3307端口，用来远程连接数据库。**

* **启动mysql**

```
sudo docker run -p 3307:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

> **3307:3306做了映射，所以外部访问3307即可。当然你自己可以定义用哪些端口号。**

* **查看运行状态**

```
docker ps
```

![image-20220803215758185](https://b3logfile.com/file/2022/08/solo-fetchupload-9167600971788706633-a3ea3958.png)

* **查看日志**

```
docker logs mysql
```

* **其他**

```
# 停止服务
docker stop mysql
# 删除镜像
docker rm mysql
# 重启docker
systemctl restart docker
# 开启开机自启
systemctl enable docker
```

> **还有很多关于docker的操作，就自己去补课了。**

* **导入数据库**

> **我这里用的navcat远程客户端操作。**

---

### 打jar包

**使用IDEA打开项目，配置好数据库信息。安装下图操作，生成一个jar包。**

![image-20220803222349511](https://b3logfile.com/file/2022/08/solo-fetchupload-3072198618708967127-79399790.png)

**等待打包完成。**

![image-20220803222535253](https://b3logfile.com/file/2022/08/solo-fetchupload-17224273844050347074-c8fca056.png)

---

### 部署

**在服务器上创建一个目录，用来存放项目的目录。**

```
# 创建目录
mkdir -p /root/user/wblog
```

* **上传刚刚打好的jar包到/wblog目录下。**

> **上传的方法很多，可以用scp命令，也可以用其他ssh客户端，比如xshell，finalshell等。**

![image-20220803223110362](https://b3logfile.com/file/2022/08/solo-fetchupload-17730941740274466687-1cd570c4.png)

* **执行命令，运行jar包。**

> **该命令也是需要切换到wblog目录下执行的。**

```
nohup java -jar jarname.jar &
```

> **jarname.jar指的就是刚刚上传到目录下的jar包，一定要带.jar后最的全称。**

**按回车执行之后会出现下面的结果**

![image-20220805094045051](https://b3logfile.com/file/2022/08/solo-fetchupload-1125235331687397903-9ab47699.png)

> **当然了，我这个只是演示，没有在指定的目录下，这就表示jar包已经成功跑起来了，如何查看目前正在运行的java服务呢？**

```
ps -ef | grep java
```

**当然，方法并不唯一。**

![image-20220805094334324](https://b3logfile.com/file/2022/08/solo-fetchupload-15287188662961552216-05c913bd.png)

> **查看的结果如上图，箭头所指的就是改服务的PID，后期如果需要，我们可以通过** `kill`命令将该进程杀死，再重新运行新的java进程。

**上面的步骤走完，不出意外的话，我们打开浏览器，输入服务器的IP访问8080端口就可以正常访问博客网站了。**

![image-20220805094708232](https://images.waer.ltd/img/image-20220805094708232.png)

---

### 域名访问配置

> **在开始之前，默认你已经买了属于自己的域名并且完成备案(非大陆服务器忽略)工作，否则是没办法继续这一步的，网站会被拦截。**

**说到服务器、域名，国内有很多不错的供应商，比如什么阿里云、百度云、腾讯云、华为云等等，还有一些小的云服务提供商我自己也都用过，但是最后还是回到了阿里云，首先是靠谱，其次价格也厚道，当然了，如果你是新人，还有很多的优惠可以拿这里不打广告，只作个人推荐，我下面也是以阿里云的域名配置为例。**

**进入阿里云控制台，找到域名DNS解析。**

![image-20220805095717699](https://b3logfile.com/file/2022/08/solo-fetchupload-17026155254490032888-680a222f.png)

**如果没有域名，点击【添加域名】，之后等待解析，【DNS服务器状态】显示正常之后，点击域名进入域名解析详情：**

![image-20220805095853201](https://b3logfile.com/file/2022/08/solo-fetchupload-3412956773532835750-68e8a908.png)

**点击【添加记录】我们添加两个A记录即可，具体如下：**

![image-20220805100835296](https://images.waer.ltd/img/image-20220805100835296.png)

> **注意，【主机记录】的对方每次只能添加一种记录，所以需要执行两次【添加记录】的操作，分别是www和@。**

**www记录的意思就是解析以www开头的记录，映射到对应的IP地址上，而@表示直接解析域名。举个例子：**

```
www.ilikexff.xyz
ilikexff.xyz
```

> **上面的两个域名都可以被正常解析访问。**

**配置完域名解析之后，我们就可以通过域名进行访问了，方法就是直接将之前的IP地址部分替换为刚刚解析的域名，但是8080端口号不能少，否则是不能正常访问的哈，这是因为我们访问是服务器默认访问的80端口，而我们项目用的端口是8080，所以这里要将端口进行转发，将8080端口转发到域名，使得直接访问域名即可访问到对应的网站，而不再需要输入端口号。这也就是下一步**反向代理技术。

![image-20220805101248762](https://b3logfile.com/file/2022/08/solo-fetchupload-11604968184632008855-1176ff2f.png)

---

### 反向代理

> **反向代理我们用的是nginx服务。**

* **安装nginx.**

```
apt install nginx -y
```

* **配置nginx**

```
# 切换到nginx的配置目录，创建一个针对博客的配置文件
cd /etc/nginx/conf.d/
# 创建blog.conf配置文件
touch blog.conf
```

* **配置内容**

> **由于我们是对每一个服务采用独立的配置文件，所以不需要在原生的nginx.conf中作配置，只需要独立的配置** `blog.conf`即可，因为在源配置文件中有这样一句：
> 
> ![image-20220805102226124](https://b3logfile.com/file/2022/08/solo-fetchupload-8906456079742622821-7ae4393b.png)
> 
> **这就表示改配置文件会把在/etc/nginx/conf.d/目录下的所有以.conf结尾的文件都自动的包含进来进行加载使用。**

在blog.conf中添加下面的内容：

```
server {
    listen       80;
    server_name  www.ilikexff.xyz ilikexff.xyz;
    location / {
        proxy_pass   http://103.133.176.214:8080;
        index  index.html index.htm;
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
    access_log /logs/ilikexff.xyz.access.log;
}
```

**作为使用教程，我们只需要大致了解下面几点即可：**

> * **listen       : 监听80端口，也就是我们上面提到的默认访问端口**
> * **server_name:服务名，这里指的就是需要将服务转发到哪些地址，比如前面配好的两个域名。**
> * **proxy_pass : 反向代理的地址，也就是使用IP访问时候的地址，他会将该地址直接转发到配置好的域名下，达到访问域名即可访问站点的效果。**
> * **access_log：日志记录文件。**

**关于nginx，作为一篇搭建教程来说，上面的东西足够了，但是作为一门技术来说，上面的东西又只是皮毛，所以想要了解更多的内容还是得自己去学。**

到此为止，反向代理部分就结束了，重启nginx服务之后，在浏览器输入:

> [www.ilikexff.xyz](www.ilikexff.xyz)
> 
> **ilikexff.xyz**

**两个域名之一都可以正常访问站点了，无需再追加8080端口。**

**下面给几个关于nginx得常用命令：**

```
# 启动
systemctl start nginx
# 停止
systemctl stop nginx
# 重启
systemctl reload nginx
# 状态查看
systemctl status nginx
```

---

### https加密访问

**经过上面反向代理步骤，我们已经可以通过域名访问博客了**

![image-20220805105436017](https://images.waer.ltd/img/image-20220805105436017.png)

**但是如上显示，访问得时候浏览器会提示网站不安全，即我们还是通过普通得http协议进行访问，这是一种很不安全的协议，任何中间人都可以通过技术手段对网站收发的数据进行拦截，尽管说作为普通的博客站点，我们也许没有如支付，转账等敏感的操作，但是安全起见，我们需要使用到另外一种协议，HTTPS(HTTP+SSL)，就目前而言，这是一种足够安全的协议，具体为什么安全，这是个话题，请自行了解。**

**(很多博客都有友链功能，很多朋友的博客对友链的要求都需要是https安全访问的，所以这一步必不可少)**

* **申请SSL证书**

> **同样以阿里云为例：**

[证书申请](https://yundun.console.aliyun.com/?p=cas#/certExtend/free)

![image-20220731200753336](https://b3logfile.com/file/2022/08/solo-fetchupload-17953626554636537916-8fd9aa86.png)

![image-20220731200851618](https://b3logfile.com/file/2022/08/solo-fetchupload-13168835631517441019-fc7d82c5.png)

**下载证书之后，在** `etc/nginx/`新建一个 `cert`文件夹，把证书中两个后缀名为.pem和.key的文件重命名为 `sslconfigure.pem`和 `sslconfigure.key`，并放到cert目录下，方便管理。

![image-20220805111607151](https://b3logfile.com/file/2022/08/solo-fetchupload-6041888645467205060-f74966d8.png)

**在之前的** `blog.conf`配置文件中新增如下内容：

```
upstream backend {
    server localhost:8080; # Solo 监听端口
}
# 这里存放之前的内容部分
server {
        listen 443 ssl;  # 1.1版本后这样写
        server_name www.iliexff.xyz; #填写绑定证书的域名
       
        ssl_certificate "/etc/nginx/cert/sslconfigure.pem";
        ssl_certificate_key "/etc/nginx/cert/sslconfigure.key";
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
      location / {
            proxy_pass http://backend$request_uri;
            proxy_set_header Host $host:$server_port;
            proxy_set_header X-Real-IP  $remote_addr;
            proxy_set_header http_x_forwarded_for $remote_addr;
            client_max_body_size 10m;
 root   html; #站点目录，绝对路径
            index  index.html index.htm;
        }
    }
```

**重启nginx**

```
systemctl reload nginx
```

**再次访问博客**

![image-20220805112253826](https://b3logfile.com/file/2022/08/solo-fetchupload-14611797948156626831-254ae22e.png)

**哇哦！这不就成功了吗？so easy to happy!**

**全剧终，附上我的博客地址，欢迎成功走到这一步的小伙伴来换个友链哈！**



