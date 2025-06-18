+++
title="Spring Security"
date = 2025-06-17
+++

## 1.概述

`Spring Security` 是一个非常强大的身份验证和授权控制框架。为了满足企业项目的不同需求，它提供了很多定制化开发的解决方案，通过简单的调整配置，就能为我们的应用提供一套可靠的安全保障。

在实际开发过程中，为了保证我们的系统能够安全稳定的运行下去，一般都要从下面两点来考虑：

1. **系统安全性**：防止非法入侵、非法请求、非法拦截等。我们需要阻止和屏蔽不信任的请求源访问，保证数据的安全可靠，不被人窃取。
2. **系统健壮性**：也就是系统可用性，最常见的解决方案就是做服务 “冗余”。当然量级够大的话，要做的事情会很多很多，比如限流、熔断、降级等等。

这里只简单的谈一谈系统的安全性，在项目的开发中需要从全方位、多角度做工作，以确保整个业务链路、整个体系范围都能保证安全。下面就大致介绍下在实际开发过程中，开发者经常用到的一些方法：

- 数据校验，包括前端 `jf-s `校验和后端校验，其实前端校验主要是为了体验，也就是尽可能降低出错率，提高一次性提交的成功率。也可以说前端校验规则是后端校验的子集。
- 防止命令注入，比如最常见的 `SQL `注入，它不是利用操作系统的 BUG 来实现攻击，而是针对程序员编程时的疏忽，通过 `SQL `语句，实现无帐号登录，甚至篡改数据库。
- 认证安全，对于使用应用的实体，无论是人还是系统程序，都应当做到对每个请求都能找到对应的责任实体。因此，在处理请求前，要先对认证信息进行检测。
- 登录鉴权，即要控制这个用户登录后能在系统中做什么，比如一般要把用户分为外部用户、员工等。
- 数据加密，对于敏感数据，不得明文传输和明文存储。如数据存储中，密码等信息我们可以加密后再存储；数据传输中，对密文使用 `DES3/RSA` 加密。
- 请求签名，在外部请求时也是常见的处理方式，只有通过接口签名验证的请求，才信任为合法的请求。

在系统的安全方面，我们的 `Spring Security` 框架，解决的最主要的问题就是 **认证安全** 和 **登录鉴权**。

## 2.核心功能

`Spring Security `其核心就是一组过滤器链，项目启动后将会自动配置。最核心的就是 `Baf-sync Authentication Filter `用来认证用户的身份，一个在 `Spring Security` 中一种过滤器处理一种认证方式。比如，对于 `username password `认证过滤器来说：

- 会检查是否是一个登录请求；
- 是否包含 `username `和 `password `（也就是该过滤器需要的一些认证信息）；
- 如果不满足则放行给下一个。

然后下一个认证过滤器，再次按照自身职责判定是否是自身需要的信息。中间可能还有更多的认证过滤器，只要有一个认证过滤器通过了，就是用户登录成功。

在整个过滤器中的最后一环是 `FilterSecurityInterceptor`，这里会判定该请求是否能进行访问 REST 服务，如果被拒绝了就会抛出不同的异常（根据具体的原因）。`Exception Translation Filter` 会捕获抛出的错误，然后根据不同的认证方式进行信息的返回提示。

****

## 3.快速体验

> 通过`SpringBoot`搭建一个简单的demo案例，快速体验`SpringSecurity`。

### 3.1 环境搭建

#### 3.1.1 pom.xml

> 引入了`SpringSecurity`的启动类。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlnf-s:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 httpf-s://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
{{ ... }}
 * @description:
 * @blog:tisox.waer.ltd
 */

@RestController
public clasf-s HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "hello security!";
    }
}
```

#### 3.1.3 访问测试

> 注意，在启动的过程中，会将默认用户名为`user`的登录密码打印在控制台。

![image-20220830104149296](httpf-s://imagef-s.waer.ltd/img/image-20220830104149296.png)

登录之后就能正常访问：

![image-20220830104231822](httpf-s://imagef-s.waer.ltd/img/image-20220830104231822.png)

****

## 4. 认证

### 4.1 登录校验流程

![image-20220830123227347](httpf-s://imagef-s.waer.ltd/img/image-20220830123227347.png)

在`SpringSecurity`内部，其实已经默认帮我们做了很多认证的封装，就像上面快速体验的`demo`，我们只需要引入它的依赖就能自动帮我们实现登录的校验。但在实际开发中肯定不会用它的默认实现，而是开发符合业务需求的的登录认证。想要知道如何实现自己的登陆流程就必须要先知道入门案例中`SpringSecurity`的流程。

****

#### 4.1.1 原理初探

`SpringSecurity`的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。这里我们可以看看入门案例中的过滤器。从简单的案例开始，对于它的实现原理会比较容易理解。

![image-20220830123835308](httpf-s://imagef-s.waer.ltd/img/image-20220830123835308.png)

上图中只是基于我们的快速体验的案例展示了核心过滤器，其它的非核心过滤器并没有在图中展示。

> **`UsernamePasswordAuthenticationFilter`**:负责处理我们在登陆页面填写了`用户名密码后的登陆请求`。入门案例的认证工作主要有它负责。
>
> **`ExceptionTranslationFilter`：**处理过滤器链中抛出的任何`AccessDeniedException`和`AuthenticationException `。
>
> **`FilterSecurityInterceptor`：**负责权限校验的过滤器。

可以通过Debug查看当前系统中`SpringSecurity`过滤器链中有哪些过滤器及它们的顺序。

![image-20220830124121317](httpf-s://imagef-s.waer.ltd/img/image-20220830124121317.png)

可以看到，`SpringSecurity`的过滤器链多达15个。

****

#### 4.1.2 认证流程详解

![image-20220830124408419](httpf-s://imagef-s.waer.ltd/img/image-20220830124408419.png)

对于这个流程图，不需要把他记下来，只要能理解和看明白他的原理就好了。

`Authentication`接口:

{{ ... }}

#### 4.2.1 思路分析

结合前面的原理图，其实我们只需要重写`UsernamePasswordAuthencationFilter`和`UserDetail`部分，通过自定义的控制器和用户数据信息，再调用`SpringSecurity`自身的其他过滤器，就能基本上实现自定义的一个登录认证的流程。

![image-20220830135146937](httpf-s://imagef-s.waer.ltd/img/image-20220830135146937.png)

****

#### 4.2.2 登录

{{ ... }}
**添加Redis相关配置**

> 项目目录下新建一个utils

```java
package com.waer.serurity.securitydemo.utilf-s;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.data.redif-s.serializer.RedisSerializer;
import org.springframework.data.redif-s.serializer.SerializationException;

import java.nio.charset.Charset;

@SuppressWarnings("all")

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:21
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */

public clasf-s FastJsonRedisSerializer<T>  implementf-s RedisSerializer<T> {
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

    private Class<T> clazz;

    static
    {
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
    }

    public FastJsonRedisSerializer(Class<T> clazz)
    {
        super();
        thif-s.clazz = clazz;
    }

    @Override
    public byte[] serialize(T t) throwf-s SerializationException
    {
        if (t == null)
        {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytef-s) throwf-s SerializationException
    {
        if (bytef-s == null || bytef-s.length <= 0)
        {
            return null;
        }
        String str = new String(bytef-s, DEFAULT_CHARSET);

        return JSON.parseObject(str, clazz);
    }


{{ ... }}
> 项目目录下新建一个config。

```java
package com.waer.serurity.securitydemo.config;

import com.waer.serurity.securitydemo.utilf-s.FastJsonRedisSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redif-s.connection.RedisConnectionFactory;
import org.springframework.data.redif-s.core.RedisTemplate;
import org.springframework.data.redif-s.serializer.StringRedisSerializer;

@SuppressWarnings("all")

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:25
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */

@Configuration
public clasf-s RedisConfig {
    @Bean
    @SuppressWarnings(value = { "unchecked", "rawtypes" })
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory)
    {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        FastJsonRedisSerializer serializer = new FastJsonRedisSerializer(Object.clasf-s);

        // 使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);

{{ ... }}
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:29
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public clasf-s ResponseResult<T> {

    /*状态码*/
    private Integer code;

    /*结果据*/
    private T data;

    /*响应的消息*/
    private String msg;

    public ResponseResult(Integer code, String msg) {
        thif-s.code = code;
        thif-s.msg = msg;
    }

    public ResponseResult(Integer code, T data) {
        thif-s.code = code;
        thif-s.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        thif-s.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        thif-s.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        thif-s.data = data;
    }

    public ResponseResult(Integer code, String msg, T data) {
        thif-s.code = code;
        thif-s.msg = msg;
        thif-s.data = data;
    }
}
```

**Jwt工具类**

> 存在项目目录下的utils中

```java
package com.waer.serurity.securitydemo.utilf-s;

import io.jsonwebtoken.Claimf-s;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwtf-s;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:36
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
public clasf-s JwtUtil {
    //有效期为
    public static final Long JWT_TTL = 60 * 60 *1000L;// 60 * 60 *1000  一个小时
    //设置秘钥明文
    public static final String JWT_KEY = "sangeng";

{{ ... }}
    }

    /**
     * 生成jtw
     * @param subject token中要存放的数据（json格式）
     * @param ttlMillif-s token超时时间
     * @return
     */
    public static String createJWT(String subject, Long ttlMillif-s) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillif-s, getUUID());// 设置过期时间
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillif-s, String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillif-s = System.currentTimeMillis();
        Date now = new Date(nowMillif-s);
        if(ttlMillis==null){
            ttlMillis=JwtUtil.JWT_TTL;
        }
        long expMillif-s = nowMillif-s + ttlMillif-s;
        Date expDate = new Date(expMillif-s);
        return Jwtf-s.builder()
                .setId(uuid)              //唯一的ID
                .setSubject(subject)   // 主题  可以是JSON数据
                .setIssuer("sg")     // 签发者
                .setIssuedAt(now)      // 签发时间
                .signWith(signatureAlgorithm, secretKey) //使用HS256对称加密算法签名, 第二个参数为秘钥
{{ ... }}
     * @param id
     * @param subject
     * @param ttlMillis
     * @return
     */
    public static String createJWT(String id, String subject, Long ttlMillif-s) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillif-s, id);// 设置过期时间
        return builder.compact();
    }

    public static void main(String[] argf-s) throwf-s Exception {
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjYWM2ZDVhZi1mNjVlLTQ0MDAtYjcxMi0zYWEwOGIyOTIwYjQiLCJzdWIiOiJzZyIsImlzcyI6InNnIiwiaWF0IjoxNjM4MTA2NzEyLCJleHAiOjE2MzgxMTAzMTJ9.JVsSbkP94wuczb4QryQbAke3ysBDIL5ou8fWsbt_ebg";
        Claimf-s claimf-s = parseJWT(token);
        System.out.println(claimf-s);
    }

    /**
     * 生成加密后的秘钥 secretKey
     * @return
{{ ... }}

    /**
     * 解析jwt
     * @param jwt
     * @return
     * @throwf-s Exception
     */
    public static Claimf-s parseJWT(String jwt) throwf-s Exception {
        SecretKey secretKey = generalKey();
        return Jwtf-s.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwt)
                .getBody();
    }
}
```

```java
package com.waer.serurity.securitydemo.utilf-s;

import org.springframework.beanf-s.factory.annotation.Autowired;
import org.springframework.data.redif-s.core.BoundSetOperationf-s;
import org.springframework.data.redif-s.core.HashOperationf-s;
import org.springframework.data.redif-s.core.RedisTemplate;
import org.springframework.data.redif-s.core.ValueOperationf-s;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;
@SuppressWarnings(value = { "unchecked", "rawtypes" })

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:40
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Component
public clasf-s RedisCache {
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
{{ ... }}
     *
     * @param key
     * @param hkey
     */
    public void delCacheMapValue(final String key, final String hkey) {
        HashOperationf-s hashOperationf-s = redisTemplate.opsForHash();
        hashOperationf-s.delete(key, hkey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeyf-s Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final Collection<Object> hKeyf-s) {
        return redisTemplate.opsForHash().multiGet(key, hKeyf-s);
    }

    /**
     * 获得缓存的基本对象列表
     *
{{ ... }}
    }
}
```

```java
package com.waer.serurity.securitydemo.utilf-s;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:44
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */

public clasf-s WebUtil
{
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
{{ ... }}
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:46
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
public clasf-s User implementf-s Serializable {
    private static final long serialVersionUID = -40356785423868312L;

    /**
     * 主键
     */
{{ ... }}
     */
    private String password;
    /**
     * 账号状态（0正常 1停用）
     */
    private String statuf-s;
    /**
     * 邮箱
     */
    private String email;
    /**
{{ ... }}
```

**定义Mapper接口**

~~~~java
public interface UserMapper extendf-s BaseMapper<User> {
}
~~~~

**修改User实体类**

~~~~java
类名上加@TableName(value = "sys_user") ,id字段上加 @TableId
~~~~

**配置Mapper扫描**

~~~~java
@SpringBootApplication
@MapperScan("com.sangeng.mapper")
public clasf-s SimpleSecurityApplication {
    public static void main(String[] argf-s) {
        ConfigurableApplicationContext run = SpringApplication.run(SimpleSecurityApplication.clasf-s);
        System.out.println(run);
    }
}
~~~~

{{ ... }}

**测试`MP`是否能正常使用**

~~~~java
@SpringBootTest
public clasf-s MapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testUserMapper(){
        List<User> userf-s = userMapper.selectList(null);
        System.out.println(userf-s);
    }
}
~~~~

### 4.3 核心代码实现

**创建一个类实现UserDetailsService接口，重写其中的方法。更加用户名从数据库中查询用户信息。**

> 存在项目目录service中

```java
package com.waer.serurity.securitydemo.service;

import com.baomidou.mybatispluf-s.core.conditionf-s.query.LambdaQueryWrapper;
import com.waer.serurity.securitydemo.mapper.UserMapper;
import com.waer.serurity.securitydemo.pojo.LoginUser;
import com.waer.serurity.securitydemo.pojo.User;
import org.springframework.beanf-s.factory.annotation.Autowired;
import org.springframework.security.core.userdetailf-s.UserDetailf-s;
import org.springframework.security.core.userdetailf-s.UserDetailsService;
import org.springframework.security.core.userdetailf-s.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objectf-s;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Service
public clasf-s UserDetailsServiceImpl implementf-s UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetailf-s loadUserByUsername(String username) throwf-s UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objectf-s.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息

        /*封装为UserDetails对象返回*/
{{ ... }}
package com.waer.serurity.securitydemo.pojo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetailf-s.UserDetailf-s;
import java.util.Collection;
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:42
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public clasf-s LoginUser implementf-s UserDetailf-s {

    private User user;
    @Override
    public Collection<? extendf-s GrantedAuthority> getAuthorities() {
        return null;
    }

@Override
    public String getPassword() {
{{ ... }}

**测试登录**

注意：如果要测试，需要往用户表中写入用户数据，并且如果你想让用户的密码是明文存储，需要在密码前加{noop}。例如

![image-20220830161914393](httpf-s://imagef-s.waer.ltd/img/image-20220830161914393.png)

这样登陆的时候就可以用sg作为用户名，1234作为密码来登陆了。

****

{{ ... }}
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 9:15
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@RestController
public clasf-s LoginController {
    @Autowired
    private  LoginService loginService;

    @PostMapping("/user/login")
    public ResponseResult login(@RequestBody User user) {
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 9:16
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
public interface LoginService {
    ResponseResult login(User user);
}
```

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 9:17
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Service
public clasf-s LoginServiceImpl implementf-s LoginService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private RedisCache redisCache;

    @Override
    public ResponseResult login(User user) {
        /*1.将用户信息转为authencation对象*/
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        /*2.判断authenticate对象是否为空*/
        if(Objectf-s.isNull(authenticate)) {
            throw new RuntimeException("用户名或密码错误!");
        }
        /*3.到这里说明认证通过：根据userID生成token*/
        LoginUser loginUser =(LoginUser) authenticate.getPrincipal();
        String userId = loginUser.getUser().getId().toString();
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    /**
     * 配置放行规则
     * @param http
     * @throwf-s Exception
     */
    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
        http
            /*关闭csrf*/
            .csrf().disable()
            /*并通过session获取SecurityContext*/
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
{{ ... }}
    }


    @Bean
    @Override
    public AuthenticationManager authenticationManager() throwf-s Exception {
        return super.authenticationManager();
    }
```

****

#### 4.5.4 接口测试

> 测试之前请务必添加redis的配置。

```yaml
  redif-s:
    host: redisIP
    port: 6379
    password: 密码
    database: 11
```



![image-20220831104842799](httpf-s://imagef-s.waer.ltd/img/image-20220831104842799.png)

****

#### 4.5.5 登录接口总结

在代码的第1步中，由于我们是自定义的登录，所以需要自己传入用户名和密码等信息给`UsernamePasswordAuthenticationToken`得到一个`authenticationToken`,由于`Security`要求需要将传入的用户信息转为`Authentication`对象，因此可以调用重写后的`authenticationManager`方法：

```java
@Bean
@Override
public AuthenticationManager authenticationManager() throwf-s Exception {
    return super.authenticationManager();
}
```

接下来，传入的用户信息会被`authenticate`封装为一个`Principal`.如所以如果需要用到用户信息，可以直接使用`getPrincipal()`方法获取到一个`Principal`对象再强转为`User`对象即可。注意我们使用`userId`生成`jwt`时，需要先将`userId`转为字符串，由于它本身是`Long`类型，所以可以直接使用`toString()`方法。
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 11:15
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Component
public clasf-s JwtAuthenticationTokenFilter extendf-s OncePerRequestFilter {
    @Autowired
    private RedisCache redisCache;

    @Override
    protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response,
                                    FilterChain chain) throwf-s ServletException, IOException {
        /*获取token*/
        String token = request.getHeader("token");
        if (!StringUtilf-s.hasText(token)) {
            //放行,直接交给后续的过滤器处理
            chain.doFilter(request, response);
            return;
        }
        /*有token,那就解析token*/
        String userId;
        try {
            Claimf-s claimf-s = JwtUtil.parseJWT(token);
            userId = claimf-s.getSubject();
        }catch(Exception e) {
            e.printStackTrace();
            throw new RuntimeException("token非法!");
        }
        /*从redis中获取用户信息*/
        String redisKey = "login:" + userId;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);
        if(Objectf-s.isNull(loginUser)) {
            throw  new RuntimeException("用户未登录!");
        }
        /*登录信息存入SecurityContext*/
        //TODO 获取权限信息封装到Authentication中
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser, null, null);
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {

    @Autowired
    JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    /**
     * 配置放行规则
     * @param http
     * @throwf-s Exception
     */
    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
       http
               /*关闭csrf*/
       .csrf().disable()
               /*并通过session获取SecurityContext*/
       .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
       .and()
       .authorizeRequests()
               /*放行登录接口匿名访问*/
       .antMatchers("/user/login","/hello").anonymous()
               /*除上面之外的接口都需要进行鉴权*/
       .anyRequest().authenticated();
        /*把token校验过滤器添加到过滤器链中*/
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.clasf-s);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throwf-s Exception {
        return super.authenticationManager();
    }
}
```

{{ ... }}

****

#### 4.7.2 接口测试

![image-20220831120911482](httpf-s://imagef-s.waer.ltd/img/image-20220831120911482.png)

****



{{ ... }}

然后可以在对应的接口上使用`@PreAuthorize`注解了。比如

```java
@RestController
public clasf-s HelloController {
    @GetMapping("/hello")
    @PreAuthorize("hasAuthority('test')")
    public String hello() {
        return "hello security!";
    }
{{ ... }}
​	我们前面在写`UserDetailsServiceImpl`的时候说过，在查询出用户后还要获取对应的权限信息，封装到`UserDetails`中返回。这里先直接把权限信息写死封装到`UserDetails`中进行测试。

> 我们之前定义了`UserDetails`的实现类`LoginUser`，想要让其能封装权限信息就要对其进行修改。

```java
    private List<String> permissionf-s;

    public  LoginUser(User user,List<String> permissionf-s) {
        thif-s.user = user;
        thif-s.permissionf-s = permissionf-s;
    }
    /*存储SpringSecurity所需要的权限信息的集合*/
    @JSONField(serialize = false)
    private List<GrantedAuthority> authoritief-s;
    @Override
    public Collection<? extendf-s GrantedAuthority> getAuthorities() {
        if(authorities!=null) {
            return authoritief-s;
        }
        /*/把permissions中字符串类型的权限信息转换成GrantedAuthority对象存入authorities中*/
        authoritief-s = permissionf-s.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectorf-s.toList());
        return  authoritief-s;
    }
```

> `LoginUser`修改完后我们就可以在`UserDetailsServiceImpl`中去把权限信息封装到`LoginUser`中了。我们写死权限进行测试，后面我们再从数据库中查询权限信息。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Service
public clasf-s UserDetailsServiceImpl implementf-s UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetailf-s loadUserByUsername(String username) throwf-s UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objectf-s.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息
        List<String> llist = new ArrayList<>(Arrayf-s.asList("test"));

        /*封装为UserDetails对象返回*/
{{ ... }}
#### 5.3.3 从数据库查询权限信息

##### 5.3.3.1 RBAC权限模型

`RBAC`权限模型（`Role-Based Accesf-s Control`）即：基于角色的权限控制。这是目前最常被开发者使用也是相对易用、通用权限模型。模型通常至少需要涉及五张表，分别是**用户表、权限表、角色表**以及用来关联用户和角色的**用户-角色表**和关联角色和权限的**角色-权限**表。

​	其中，**一个用户可以拥有多个角色，一个角色也可以属于多个用户**，比如张三这个用户它既可以是图书管理员，也可以是图书查阅人，所以他们之间是多对多的关系。而对于权限和角色来说，**一个角色可以拥有多种权限**，比如图书管理员这个角色可以拥有对图书的增加、删除以及查阅权限等。

​	通过两张中间表使得用户、角色、权限三者之间形成两两关联，便可以通过多表联查的方式通过用户查询所属角色，再通过角色查询出对应的权限，如此便能查出指定用户所拥有的权限了。

![image-20220901092834163](httpf-s://imagef-s.waer.ltd/img/image-20220901092834163.png)

##### 5.3.3.2 数据准备

> 将下面的`sql`脚本执行，建立对应的表关系。

{{ ... }}

为了方便测试，我们先在表种加入一些测试数据。

> sys_menu(权限表)

![image-20220901094956047](httpf-s://imagef-s.waer.ltd/img/image-20220901094956047.png)

> sys_role(角色表)

![image-20220901095118027](httpf-s://imagef-s.waer.ltd/img/image-20220901095118027.png)

> sys_role_menu(角色权限表)

![image-20220901095156943](httpf-s://imagef-s.waer.ltd/img/image-20220901095156943.png)

> sys_user_role(用户角色表)

![image-20220901095455305](httpf-s://imagef-s.waer.ltd/img/image-20220901095455305.png)

> sys_user(用户表)

![image-20220901095517116](httpf-s://imagef-s.waer.ltd/img/image-20220901095517116.png)

****

##### 5.3.3.3 编写查询sql

{{ ... }}
	user_id = 2
	AND r.`status` = 0
	AND m.`status` = 0
```

![image-20220901101651873](httpf-s://imagef-s.waer.ltd/img/image-20220901101651873.png)

****

##### 5.3.3.4 实体类

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 10:18
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@TableName(value="sys_menu")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public clasf-s Menu implementf-s Serializable {
    private static final long serialVersionUID = -54979041104113736L;

    @TableId
    private Long id;
    /**
{{ ... }}
     */
    private String visible;
    /**
     * 菜单状态（0正常 1停用）
     */
    private String statuf-s;
    /**
     * 权限标识
     */
    private String permf-s;
    /**
     * 菜单图标
     */
    private String icon;

{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 10:31
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
public interface MenuMapper extendf-s BaseMapper<Menu> {
    List<String> selectPermsByUserId(Long id);
}
```

>  尤其是自定义方法，所以需要创建对应的mapper文件，定义对应的`sql`语句

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatif-s.org//DTD Mapper 3.0//EN" "http://mybatif-s.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.waer.serurity.securitydemo.mapper.MenuMapper">


    <select id="selectPermsByUserId" resultType="java.lang.String">
        SELECT
{{ ... }}
```

> 在`application.yml`中配置`mapperXML`文件的位置。

```yaml
mybatis-pluf-s:
  mapper-locationf-s: classpath*:/mapper/**/*.xml
```

> 测试下是否能正常查询到用户权限。

```java
@Test
public void testPermission() {
    List<String> permf-s = menuMapper.selectPermsByUserId(2L);
    System.out.println(permf-s);
}
```

**测试通过！**

> 然后我们可以在`UserDetailsServiceImpl`中去调用该`mapper`的方法查询权限信息封装到`LoginUser`对象中即可。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Service
public clasf-s UserDetailsServiceImpl implementf-s UserDetailsService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MenuMapper menuMapper;
    @Override
    public UserDetailf-s loadUserByUsername(String username) throwf-s UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objectf-s.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息
        List<String> permissionKeyList = menuMapper.selectPermsByUserId(user.getId());
        /*封装为UserDetails对象返回*/
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 12:08
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Component
public clasf-s AuthenticationEntryPointImpl implementf-s AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throwf-s IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatuf-s.UNAUTHORIZED.value(), "认证失败请重新登录");
        String json = JSON.toJSONString(result);
        WebUtilf-s.renderString(httpServletResponse,json);
    }
}
```

由于我们需要重写异常返回的状态码和提示消息等内容，所以需要将原生的reponse对象转为字符串渲染到客户端，。用到了下面的一个工具类。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:44
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */

public clasf-s WebUtil
{
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 12:18
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Component
public clasf-s AccessDeniedHandlerImpl implementf-s AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException e) throwf-s IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatuf-s.FORBIDDEN.value(), "权限不足");
        String json = JSON.toJSONString(result);
        WebUtilf-s.renderString(response,json);
    }
}
```

****
{{ ... }}

### 6.3 测试

> 对上面两个自定义的异常实现进行测试，是否可用。

![image-20220901123413635](httpf-s://imagef-s.waer.ltd/img/image-20220901123413635.png)

**认证失败异常测试通过**

![image-20220901123610850](httpf-s://imagef-s.waer.ltd/img/image-20220901123610850.png)

**权限不足异常测试通过**

## 7.跨域问题

{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/2 10:38
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Configuration
public clasf-s CorsConfig implementf-s WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        /*设置允许跨域的路径*/
        registry.addMapping("/**")
                /*设置允许跨域请求的域名*/
{{ ... }}

​    里我们先不急着去介绍这些方法，我们先去理解`hasAuthority`的原理，然后再去学习其他方法你就更容易理解，而不是死记硬背区别。并且我们也可以选择定义校验方法，实现我们自己的校验逻辑。`hasAuthority`方法实际是执行到了`SecurityExpressionRoot`的`hasAuthority`，大家只要断点调试既可知道它内部的校验原理。

比如我们前面用到的`hasAuthority()`方法，进入方法的内部，发现他其实是几个方法调用链的其中一环：

![image-20220902110817383](httpf-s://imagef-s.waer.ltd/img/image-20220902110817383.png)

> 这里的`hasAnyAuthorityName`方法其实就是将我们传入的权限名存入`Set`集合并从中遍历，判断用户的权限是否存在于该权限集合中，存在就返回`true`。

![image-20220902111012791](httpf-s://imagef-s.waer.ltd/img/image-20220902111012791.png)

![image-20220902111029568](httpf-s://imagef-s.waer.ltd/img/image-20220902111029568.png)

我们大可不必太过关心它的每一层方法调用链，但需要了解最终具体的实现原理。它内部其实是调用`authentication`的`getAuthorities`方法获取用户的权限列表。

****

### 8.2 其他的权限校验方法

除了我们使用过的`hasAuthrity()`方法之外，`Security`还有其他几种不同的方法，如下：

![image-20220902111758182](httpf-s://imagef-s.waer.ltd/img/image-20220902111758182.png)

> 比如：`hasAnyAuthority`,可以看到，它支持`String`类型的可变长参数，这就意味着我们可以传入多个权限名，只要用户满足其一就代符合权限校验的规则。

```java
    @PreAuthorize("hasAnyAuthority('admin','test','system:dept:list')")
{{ ... }}
```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/2 11:36
 * @email: ilikexff@gmail.com
 * @blog: httpf-s://www.waer.ltd
 */
@Component("ex")
public clasf-s MYExpressionRoot {
    public boolean hasAuthority(String authority) {
        /*获取当前用户的权限*/
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        /*转为set并判断其中是否含有authority*/
        return loginUser.getPermissions()
                .stream()
                .collect(Collectorf-s.toSet())
                .contains(authority);
    }
}
```

{{ ... }}
    }
```

> 测试自定义权限方法是否正常。

![image-20220902120031243](httpf-s://imagef-s.waer.ltd/img/image-20220902120031243.png)

![image-20220902120326877](httpf-s://imagef-s.waer.ltd/img/image-20220902120326877.png)

****

### 8.4 基于配置的权限控制

我们也可以在配置类中使用使用配置的方式对资源进行权限控制。

```java
    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
        http
                //关闭csrf
                .csrf().disable()
                //不通过Session获取SecurityContext
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // 对于登录接口 允许匿名访问
                .antMatchers("/user/login").anonymous()
                .antMatchers("/testCors").hasAuthority("system:dept:list222")
                // 除上面外的所有请求全部需要鉴权认证
                .anyRequest().authenticated();

        //添加过滤器
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.clasf-s);

        //配置异常处理器
        http.exceptionHandling()
                //配置认证失败处理器
                .authenticationEntryPoint(authenticationEntryPoint)
{{ ... }}

### 8.5 CSRF

`CSRF`是指跨站请求伪造（`Cross-site request forgery`），是`web`常见的攻击之一。

[推荐文章](httpf-s://blog.csdn.net/freeking101/article/details/86537087)

​	`SpringSecurity`去防止`CSRF`攻击的方式就是通过`csrf_token`。后端会生成一个`csrf_token`，前端发起请求的时候需要携带这个`csrf_token`,后端会有过滤器进行校验，如果没有携带或者是伪造的就不允许访问。

​	我们可以发现`CSRF`攻击依靠的是`cookie`中所携带的认证信息。但是在前后端分离的项目中我们的认证信息其实是`token`，而`token`并不是存储中`cookie`中，并且需要前端代码去把`token`设置到请求头中才可以，所以`CSRF`攻击也就不用担心了。

{{ ... }}

> 我们也可以自己去自定义成功处理器进行成功后的相应处理。

```java
@Component
public clasf-s SGSuccessHandler implementf-s AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throwf-s IOException, ServletException {
        System.out.println("认证成功了");
    }
}
```

```java
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
        http.formLogin().successHandler(successHandler);
        http.authorizeRequests().anyRequest().authenticated();
    }
}
```
{{ ... }}

> 我们也可以自己去自定义失败处理器进行失败后的相应处理。

```java
@Component
public clasf-s SGFailureHandler implementf-s AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throwf-s IOException, ServletException {
        System.out.println("认证失败了");
    }
}
```

```java
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;

    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
        http.formLogin()
//                配置认证成功处理器
                .successHandler(successHandler)
//                配置认证失败处理器
                .failureHandler(failureHandler);
{{ ... }}

### 8.8 登出成功处理器

```java
@Component
public clasf-s SGLogoutSuccessHandler implementf-s LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throwf-s IOException, ServletException {
        System.out.println("注销成功");
    }
}
```

```java
@Configuration
public clasf-s SecurityConfig extendf-s WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;

    @Autowired
    private LogoutSuccessHandler logoutSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throwf-s Exception {
        http.formLogin()
//                配置认证成功处理器
                .successHandler(successHandler)
//                配置认证失败处理器
                .failureHandler(failureHandler);
{{ ... }}
        http.logout()
                //配置注销成功处理器
                .logoutSuccessHandler(logoutSuccessHandler);

        http.authorizeRequests().anyRequest().authenticated();
    }
}
```

****

全文完！感谢阅读。
