+++
title = "SSM框架实现集成短信验证码功能"
slug = "ssm-框架实现集成短信验证码功能"
date = 2023-06-15
+++

### 更新日志

2022-09-03 晚

> - 本次更新无新内容，仅调整目录结构



## 验证码功能

> 在实际开发中，验证码功能已经是一个很常见的模块了。
> 今天就来给自己的项目加一个属于自己的短信验证码功能。

### 准备工作

> 在开始敲代码之前，你需要准备一下。

- [容联云](https://www.yuntongxun.com/?ly=baidu-pz-p&qd=cpc&xl=ds&kw=12006270)平台账号一个。
- 可以正常收发短信的手机一台。
- 一台可用的计算机。
- 怎么说也得会一点Java吧【本文以SSM项目集成为例】。
- 会一点JavaScript或者jQuery。

## 开始撸

#### 先看看最后的样式

![](https://b3logfile.com/file/2022/08/solo-fetchupload-10700891916562075776-7c2ef8f7.png)

- 登录官网，进入控制台找到如下几个重要的key保存下来，后面需要用到。
  ![](https://b3logfile.com/file/2022/08/solo-fetchupload-1220627229440284181-acd23658.png)
- 找到页面中【开发手册】>【SDK参考】
  ![](https://b3logfile.com/file/2022/08/solo-fetchupload-12422133158768438033-a14ac3c0.png)
- 如此打开便可以找到Java需要安装的依赖，将maven依赖复制过来，放入pom.xml文件中正确的位置。

```
<dependency>
    <groupId>com.cloopen</groupId>
    <artifactId>java-sms-sdk</artifactId>
    <version>1.0.3</version>
</dependency>
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-13592634646042885320-d414f365.png)

---

## 处理后端核心业务

- service层处理验证码发送逻辑

> 由于不涉及与数据库的交互，可以将下面的短信验证码的业务逻辑直接在服务层进行处理即可。
> ![](https://b3logfile.com/file/2022/08/solo-fetchupload-11745832972173914333-55ae2419.png)

> 具体的：

- 在如下位置将你对应的密钥填入。

```Java
restAPI.setAccount("你的countID");
// 初始化主账号名称和主账号令牌
restAPI.setAppId("你的countToken");
```

- 以下部分是对所生成验证码范围的设置，我是随机六位，你可以自定义你的规则。

```Java
/*生成随机六位验证码*/
  Random random = new Random();
  String codes = "";
  for (int i = 0; i < 6; i++) {
  codes += random.nextInt(10);
}
```

- 使用短信验证码模板：由于我们是未上线的测试，所以可以使用的模板是由限定的。可以自己参考文档，具体的，我的配置如下。

```Java
// 请使用管理控制台中已创建应用的APPID
result = restAPI.sendTemplateSMS(userPhone, "1", new String[]{codes, "2"});
```

- 设置验证码的有效期

> 实际开发中，验证码是不可以一直有效的，我们应该设置一个有效期限，比如2分钟有效，过期只能重新发送获取新的验证码，下面是我利用session进行的实现，提供参考，你也用可以缓存或者redis等方式实现。

```Java
/*设置验证码有效期为2分钟*/
session.setMaxInactiveInterval(120);
```

---

## 处理前端页面和校验逻辑

> 后台核心业务结束之后，就可以进行前端页面的编写。首先，有一个提供输入手机号的控件是必须的【**当然，特殊业务场景可能不一定需要显式的输入**】 不要杠！！
> 总而言之，要发送短信验证码，你得有一个验证码的接收对象吧，这个对象便是一个可用的手机号。具体的：

- 在页面中放一个输入验证码的控件，当然还需要一个发送验证码的按钮。
  ![](https://b3logfile.com/file/2022/08/solo-fetchupload-14383750180005044555-568cff4d.png)
- 由于不可能让用户频繁的发送验证码，我们还需要对点击的按钮进行限制，一般的做法是，当用户点击一次发送按钮之后便将该按钮进行禁用掉，避免频繁的被点击，倒计时一分钟后解除禁用，可以再次发送。
  这样的需求比较简单，可通过简单的JS进行实现。

```JavaScript
/*短信再次发送倒计时*/
    function outime(time) {
        if(time==0){
            $("#getCode").attr("disabled",false);
            $("#getCode").html("重新发送");
        }else{
            time--;
            $("#getCode").html(time+"s后重新发送").attr("disabled",true);
            setTimeout(function () {
                outime(time);
            },1000);
        }
    }
```

> 以上实现只是一种参考，实现方式没有局限。
> 当时出于安全考虑，这样的前端校验是不够的，实际开发中，一般还会再服务端进行再一次的校验逻辑，实现也比较简单，具体不再赘述。

- 添加测试的手机号
  由于是测试用，所以不是所有手机号都可以接受到验证码的短信，需要在控制台绑定测试用的手机号，操作很简单，不再赘述。

---

## 来看看最终的成果。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-9567963583923876937-61c53beb.jpeg)
