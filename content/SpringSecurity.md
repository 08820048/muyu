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

- 数据校验，包括前端 `js `校验和后端校验，其实前端校验主要是为了体验，也就是尽可能降低出错率，提高一次性提交的成功率。也可以说前端校验规则是后端校验的子集。
- 防止命令注入，比如最常见的 `SQL `注入，它不是利用操作系统的 BUG 来实现攻击，而是针对程序员编程时的疏忽，通过 `SQL `语句，实现无帐号登录，甚至篡改数据库。
- 认证安全，对于使用应用的实体，无论是人还是系统程序，都应当做到对每个请求都能找到对应的责任实体。因此，在处理请求前，要先对认证信息进行检测。
- 登录鉴权，即要控制这个用户登录后能在系统中做什么，比如一般要把用户分为外部用户、员工等。
- 数据加密，对于敏感数据，不得明文传输和明文存储。如数据存储中，密码等信息我们可以加密后再存储；数据传输中，对密文使用 `DES3/RSA` 加密。
- 请求签名，在外部请求时也是常见的处理方式，只有通过接口签名验证的请求，才信任为合法的请求。

在系统的安全方面，我们的 `Spring Security` 框架，解决的最主要的问题就是 **认证安全** 和 **登录鉴权**。

## 2.核心功能

`Spring Security `其核心就是一组过滤器链，项目启动后将会自动配置。最核心的就是 `Basic Authentication Filter `用来认证用户的身份，一个在 `Spring Security` 中一种过滤器处理一种认证方式。比如，对于 `username password `认证过滤器来说：

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
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.waer.serurity</groupId>
    <artifactId>security-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>security-demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
    </properties>
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
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

#### 3.1.2 Controller

> `helloController`

```java
package com.waer.serurity.securitydemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SuppressWarnings("all")
/**
 * @author: Tisox
 * @date: 2022/8/19 18:35
 * @description:
 * @blog:tisox.waer.ltd
 */

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "hello security!";
    }
}
```

#### 3.1.3 访问测试

> 注意，在启动的过程中，会将默认用户名为`user`的登录密码打印在控制台。

![image-20220830104149296](https://images.waer.ltd/img/image-20220830104149296.png)

登录之后就能正常访问：

![image-20220830104231822](https://images.waer.ltd/img/image-20220830104231822.png)

****

## 4. 认证

### 4.1 登录校验流程

![image-20220830123227347](https://images.waer.ltd/img/image-20220830123227347.png)

在`SpringSecurity`内部，其实已经默认帮我们做了很多认证的封装，就像上面快速体验的`demo`，我们只需要引入它的依赖就能自动帮我们实现登录的校验。但在实际开发中肯定不会用它的默认实现，而是开发符合业务需求的的登录认证。想要知道如何实现自己的登陆流程就必须要先知道入门案例中`SpringSecurity`的流程。

****

#### 4.1.1 原理初探

`SpringSecurity`的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。这里我们可以看看入门案例中的过滤器。从简单的案例开始，对于它的实现原理会比较容易理解。

![image-20220830123835308](https://images.waer.ltd/img/image-20220830123835308.png)

上图中只是基于我们的快速体验的案例展示了核心过滤器，其它的非核心过滤器并没有在图中展示。

> **`UsernamePasswordAuthenticationFilter`**:负责处理我们在登陆页面填写了`用户名密码后的登陆请求`。入门案例的认证工作主要有它负责。
>
> **`ExceptionTranslationFilter`：**处理过滤器链中抛出的任何`AccessDeniedException`和`AuthenticationException `。
>
> **`FilterSecurityInterceptor`：**负责权限校验的过滤器。

可以通过Debug查看当前系统中`SpringSecurity`过滤器链中有哪些过滤器及它们的顺序。

![image-20220830124121317](https://images.waer.ltd/img/image-20220830124121317.png)

可以看到，`SpringSecurity`的过滤器链多达15个。

****

#### 4.1.2 认证流程详解

![image-20220830124408419](https://images.waer.ltd/img/image-20220830124408419.png)

对于这个流程图，不需要把他记下来，只要能理解和看明白他的原理就好了。

`Authentication`接口:

> 它的实现类，表示当前访问系统的用户，封装了用户相关信息。

`AuthenticationManager`接口:

> 定义了认证`Authencation`的方法。

`UserDetailService`接口：

> 加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的方法。

`UserDetails`接口：

> 提供用户信息。通过`UserDetailService`根据用户名获取处理的用户信息要封装成`UserDetails`对象返回。然后将这些信息封装到`Authencation`对象中。



****

### 4.2 解决问题

> 如何实现自定义的登录认证流程？

#### 4.2.1 思路分析

结合前面的原理图，其实我们只需要重写`UsernamePasswordAuthencationFilter`和`UserDetail`部分，通过自定义的控制器和用户数据信息，再调用`SpringSecurity`自身的其他过滤器，就能基本上实现自定义的一个登录认证的流程。

![image-20220830135146937](https://images.waer.ltd/img/image-20220830135146937.png)

****

#### 4.2.2 登录

- 自定义登录接口
  - 调用`ProviderManager`的方法进行认证，如果认证通过生成`jwt`.
  - 把用户信息存在redis中。
- 自定义`UserDetailService`
  - 实现从数据库中查询用户的信息。

****

#### 4.2.3 校验

- 定义`jwt`认证过滤器
  - 获取`token`
  - 解析`token`获取其中的`userId`
  - 从`redis`中获取用户信息
  - 存入`SecurityContextHolder`上下文中

****

#### 4.2.4 环境准备

> 还是搭建一个`SpringBoot`的项目。不同的是，需要新增下面的一些配置和依赖。

**添加依赖**

```xml
<!--redis依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--fastjson依赖-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.33</version>
</dependency>
<!--jwt依赖-->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
```

> 依赖都做了简单的说明，见名知其意！

**添加Redis相关配置**

> 项目目录下新建一个utils

```java
package com.waer.serurity.securitydemo.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import java.nio.charset.Charset;

@SuppressWarnings("all")

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:21
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */

public class FastJsonRedisSerializer<T>  implements RedisSerializer<T> {
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

    private Class<T> clazz;

    static
    {
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
    }

    public FastJsonRedisSerializer(Class<T> clazz)
    {
        super();
        this.clazz = clazz;
    }

    @Override
    public byte[] serialize(T t) throws SerializationException
    {
        if (t == null)
        {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException
    {
        if (bytes == null || bytes.length <= 0)
        {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);

        return JSON.parseObject(str, clazz);
    }


    protected JavaType getJavaType(Class<?> clazz)
    {
        return TypeFactory.defaultInstance().constructType(clazz);
    }
}
```

> 项目目录下新建一个config。

```java
package com.waer.serurity.securitydemo.config;

import com.waer.serurity.securitydemo.utils.FastJsonRedisSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@SuppressWarnings("all")

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:25
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */

@Configuration
public class RedisConfig {
    @Bean
    @SuppressWarnings(value = { "unchecked", "rawtypes" })
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory)
    {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        FastJsonRedisSerializer serializer = new FastJsonRedisSerializer(Object.class);

        // 使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);

        // Hash的key也采用StringRedisSerializer的序列化方式
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

**结果响应类**

> 项目目录下新建一个pojo

```java
package com.waer.serurity.securitydemo.pojo;

import com.fasterxml.jackson.annotation.JsonInclude;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:29
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseResult<T> {

    /*状态码*/
    private Integer code;

    /*结果据*/
    private T data;

    /*响应的消息*/
    private String msg;

    public ResponseResult(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public ResponseResult(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ResponseResult(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}
```

**Jwt工具类**

> 存在项目目录下的utils中

```java
package com.waer.serurity.securitydemo.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
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
 * @blog: https://www.waer.ltd
 */
public class JwtUtil {
    //有效期为
    public static final Long JWT_TTL = 60 * 60 *1000L;// 60 * 60 *1000  一个小时
    //设置秘钥明文
    public static final String JWT_KEY = "sangeng";

    public static String getUUID(){
        String token = UUID.randomUUID().toString().replaceAll("-", "");
        return token;
    }

    /**
     * 生成jtw
     * @param subject token中要存放的数据（json格式）
     * @return
     */
    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成jtw
     * @param subject token中要存放的数据（json格式）
     * @param ttlMillis token超时时间
     * @return
     */
    public static String createJWT(String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, getUUID());// 设置过期时间
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis, String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if(ttlMillis==null){
            ttlMillis=JwtUtil.JWT_TTL;
        }
        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);
        return Jwts.builder()
                .setId(uuid)              //唯一的ID
                .setSubject(subject)   // 主题  可以是JSON数据
                .setIssuer("sg")     // 签发者
                .setIssuedAt(now)      // 签发时间
                .signWith(signatureAlgorithm, secretKey) //使用HS256对称加密算法签名, 第二个参数为秘钥
                .setExpiration(expDate);
    }

    /**
     * 创建token
     * @param id
     * @param subject
     * @param ttlMillis
     * @return
     */
    public static String createJWT(String id, String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, id);// 设置过期时间
        return builder.compact();
    }

    public static void main(String[] args) throws Exception {
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjYWM2ZDVhZi1mNjVlLTQ0MDAtYjcxMi0zYWEwOGIyOTIwYjQiLCJzdWIiOiJzZyIsImlzcyI6InNnIiwiaWF0IjoxNjM4MTA2NzEyLCJleHAiOjE2MzgxMTAzMTJ9.JVsSbkP94wuczb4QryQbAke3ysBDIL5ou8fWsbt_ebg";
        Claims claims = parseJWT(token);
        System.out.println(claims);
    }

    /**
     * 生成加密后的秘钥 secretKey
     * @return
     */
    public static SecretKey generalKey() {
        byte[] encodedKey = Base64.getDecoder().decode(JwtUtil.JWT_KEY);
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        return key;
    }

    /**
     * 解析jwt
     * @param jwt
     * @return
     * @throws Exception
     */
    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwt)
                .getBody();
    }
}
```

```java
package com.waer.serurity.securitydemo.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;
@SuppressWarnings(value = { "unchecked", "rawtypes" })

/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:40
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Component
public class RedisCache {
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key   缓存的键值
     * @param value 缓存的值
     */
    public <T> void setCacheObject(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key      缓存的键值
     * @param value    缓存的值
     * @param timeout  时间
     * @param timeUnit 时间颗粒度
     */
    public <T> void setCacheObject(final String key, final T value, final Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @param unit    时间单位
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key 缓存键值
     * @return 缓存键值对应的数据
     */
    public <T> T getCacheObject(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * 删除单个对象
     *
     * @param key
     */
    public boolean deleteObject(final String key) {
        return redisTemplate.delete(key);
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     * @return
     */
    public long deleteObject(final Collection collection) {
        return redisTemplate.delete(collection);
    }

    /**
     * 缓存List数据
     *
     * @param key      缓存的键值
     * @param dataList 待缓存的List数据
     * @return 缓存的对象
     */
    public <T> long setCacheList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    public <T> List<T> getCacheList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 缓存Set
     *
     * @param key     缓存键值
     * @param dataSet 缓存的数据
     * @return 缓存数据的对象
     */
    public <T> BoundSetOperations<String, T> setCacheSet(final String key, final Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext()) {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key
     * @return
     */
    public <T> Set<T> getCacheSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 缓存Map
     *
     * @param key
     * @param dataMap
     */
    public <T> void setCacheMap(final String key, final Map<String, T> dataMap) {
        if (dataMap != null) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    /**
     * 获得缓存的Map
     *
     * @param key
     * @return
     */
    public <T> Map<String, T> getCacheMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key   Redis键
     * @param hKey  Hash键
     * @param value 值
     */
    public <T> void setCacheMapValue(final String key, final String hKey, final T value) {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public <T> T getCacheMapValue(final String key, final String hKey) {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hKey);
    }

    /**
     * 删除Hash中的数据
     *
     * @param key
     * @param hkey
     */
    public void delCacheMapValue(final String key, final String hkey) {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.delete(key, hkey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final Collection<Object> hKeys) {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 获得缓存的基本对象列表
     *
     * @param pattern 字符串前缀
     * @return 对象列表
     */
    public Collection<String> keys(final String pattern) {
        return redisTemplate.keys(pattern);
    }
}
```

```java
package com.waer.serurity.securitydemo.utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:44
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */

public class WebUtil
{
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param string 待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String string) {
        try
        {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
```

**实体类**

> 存于pojo包下

```java
package com.waer.serurity.securitydemo.pojo;
import java.io.Serializable;
import java.util.Date;
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:46
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
public class User implements Serializable {
    private static final long serialVersionUID = -40356785423868312L;

    /**
     * 主键
     */
    private Long id;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 昵称
     */
    private String nickName;
    /**
     * 密码
     */
    private String password;
    /**
     * 账号状态（0正常 1停用）
     */
    private String status;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 手机号
     */
    private String phonenumber;
    /**
     * 用户性别（0男，1女，2未知）
     */
    private String sex;
    /**
     * 头像
     */
    private String avatar;
    /**
     * 用户类型（0管理员，1普通用户）
     */
    private String userType;
    /**
     * 创建人的用户id
     */
    private Long createBy;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 更新人
     */
    private Long updateBy;
    /**
     * 更新时间
     */
    private Date updateTime;
    /**
     * 删除标志（0代表未删除，1代表已删除）
     */
    private Integer delFlag;
}
```

****

#### 4.2.5 数据准备

从之前的分析我们可以知道，我们可以自定义一个`UserDetailsService`,让`SpringSecurity`使用我们的`UserDetailsService`。我们自己的`UserDetailsService`可以从数据库中查询用户名和密码。

**建库建表**

```sql
CREATE TABLE `sys_user` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_name` VARCHAR(64) NOT NULL DEFAULT 'NULL' COMMENT '用户名',
  `nick_name` VARCHAR(64) NOT NULL DEFAULT 'NULL' COMMENT '昵称',
  `password` VARCHAR(64) NOT NULL DEFAULT 'NULL' COMMENT '密码',
  `status` CHAR(1) DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `email` VARCHAR(64) DEFAULT NULL COMMENT '邮箱',
  `phonenumber` VARCHAR(32) DEFAULT NULL COMMENT '手机号',
  `sex` CHAR(1) DEFAULT NULL COMMENT '用户性别（0男，1女，2未知）',
  `avatar` VARCHAR(128) DEFAULT NULL COMMENT '头像',
  `user_type` CHAR(1) NOT NULL DEFAULT '1' COMMENT '用户类型（0管理员，1普通用户）',
  `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人的用户id',
  `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
  `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  `del_flag` INT(11) DEFAULT '0' COMMENT '删除标志（0代表未删除，1代表已删除）',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='用户表'
```

**引入数据库依赖**

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

**yaml配置**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sg_security?characterEncoding=utf-8&serverTimezone=UTC
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**定义Mapper接口**

~~~~java
public interface UserMapper extends BaseMapper<User> {
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
public class SimpleSecurityApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(SimpleSecurityApplication.class);
        System.out.println(run);
    }
}
~~~~

**添加`junit`依赖**

~~~~xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
~~~~

**测试`MP`是否能正常使用**

~~~~java
@SpringBootTest
public class MapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testUserMapper(){
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }
}
~~~~

### 4.3 核心代码实现

**创建一个类实现UserDetailsService接口，重写其中的方法。更加用户名从数据库中查询用户信息。**

> 存在项目目录service中

```java
package com.waer.serurity.securitydemo.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.waer.serurity.securitydemo.mapper.UserMapper;
import com.waer.serurity.securitydemo.pojo.LoginUser;
import com.waer.serurity.securitydemo.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objects.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息

        /*封装为UserDetails对象返回*/
        return new LoginUser(user);
    }
}
```

**因为UserDetailsService方法的返回值是UserDetails类型，所以需要定义一个类，实现该接口，把用户信息封装在其中。**

> 存在于pojo包下

```java
package com.waer.serurity.securitydemo.pojo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:42
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser implements UserDetails {

    private User user;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

@Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
```

**测试登录**

注意：如果要测试，需要往用户表中写入用户数据，并且如果你想让用户的密码是明文存储，需要在密码前加{noop}。例如

![image-20220830161914393](https://images.waer.ltd/img/image-20220830161914393.png)

这样登陆的时候就可以用sg作为用户名，1234作为密码来登陆了。

****

### 4.4 密码加密存储

实际项目中我们不会把密码明文存储在数据库中。

默认使用的`PasswordEncoder`要求数据库中的密码格式为：`{id}password` 。它会根据id去判断密码的加密方式。但是我们一般不会采用这种方式。所以就需要替换`PasswordEncoder`。我们一般使用`SpringSecurity`为我们提供的`BCryptPasswordEncoder`。我们只需要使用把`BCryptPasswordEncoder`对象注入`Spring`容器中，`SpringSecurity`就会使用该`PasswordEncoder`来进行密码校验。可以定义一个`SpringSecurity`的配置类，`SpringSecurity`要求这个配置类要继承`WebSecurityConfigurerAdapter`。

> 在config包下：

```java
package com.waer.serurity.securitydemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SuppressWarnings("all")
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

****

### 4.5 登录接口

接下我们需要自定义登陆接口，然后让`SpringSecurity`对这个接口放行,让用户访问这个接口的时候不用登录也能访问。在接口中我们通过`AuthenticationManager`的`authenticate`方法来进行用户认证,所以需要在`SecurityConfig`中配置把`AuthenticationManager`注入容器。

认证成功的话要生成一个`jwt`，放入响应中返回。并且为了让用户下回请求时能通过`jwt`识别出具体的是哪个用户，我们需要把用户信息存入`redis`，可以把用户`id`作为`key`。

#### 4.5.1 编写Controller

> 定义一个LoginController，用来实现登录请求的接口，返回一个ResponseResult类型作为响应。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 9:15
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@RestController
public class LoginController {
    @Autowired
    private  LoginService loginService;

    @PostMapping("/user/login")
    public ResponseResult login(@RequestBody User user) {
        return loginService.login(user);
    }
}
```

接口中定义了一个`login(user)`的登录方法，我们需要再对应得`LoginService`和其实现类中定义和实现具体得登录逻辑。

****

#### 4.5.2 编写Service

> 在Service包下定义`LoginService`和对应得实现类`LoginServiceImpl`

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 9:16
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
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
 * @blog: https://www.waer.ltd
 */
@Service
public class LoginServiceImpl implements LoginService {
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
        if(Objects.isNull(authenticate)) {
            throw new RuntimeException("用户名或密码错误!");
        }
        /*3.到这里说明认证通过：根据userID生成token*/
        LoginUser loginUser =(LoginUser) authenticate.getPrincipal();
        String userId = loginUser.getUser().getId().toString();
        String jwt = JwtUtil.createJWT(userId);
        /*authenticate存入redis*/
        redisCache.setCacheObject("login:"+userId,loginUser);
        /*4.响应token给前端*/
        HashMap<String,String> map = new HashMap<>(16);
        map.put("token",jwt);
        return new ResponseResult(200,"登陆成功",map);
    }
```

****

#### 4.5.3 修改config

> 修改之前的`SecurityConfig`修改后的内容如下。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    /**
     * 配置放行规则
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            /*关闭csrf*/
            .csrf().disable()
            /*并通过session获取SecurityContext*/
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            /*放行登录接口匿名访问*/
            .antMatchers("/user/login").anonymous()
            /*除上面之外的接口都需要进行鉴权*/
            .anyRequest().authenticated();
    }


    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
```

****

#### 4.5.4 接口测试

> 测试之前请务必添加redis的配置。

```yaml
  redis:
    host: redisIP
    port: 6379
    password: 密码
    database: 11
```



![image-20220831104842799](https://images.waer.ltd/img/image-20220831104842799.png)

****

#### 4.5.5 登录接口总结

在代码的第1步中，由于我们是自定义的登录，所以需要自己传入用户名和密码等信息给`UsernamePasswordAuthenticationToken`得到一个`authenticationToken`,由于`Security`要求需要将传入的用户信息转为`Authentication`对象，因此可以调用重写后的`authenticationManager`方法：

```java
@Bean
@Override
public AuthenticationManager authenticationManager() throws Exception {
    return super.authenticationManager();
}
```

接下来，传入的用户信息会被`authenticate`封装为一个`Principal`.如所以如果需要用到用户信息，可以直接使用`getPrincipal()`方法获取到一个`Principal`对象再强转为`User`对象即可。注意我们使用`userId`生成`jwt`时，需要先将`userId`转为字符串，由于它本身是`Long`类型，所以可以直接使用`toString()`方法。

****

### 4.6 认证过滤器

#### 4.6.1 实现过滤器

自定义一个过滤器，该过滤器会获取请求头中的`token`字段，对token进行解析出其中的`userId`。使用`userId`去`redis`中获取对应的`LoginUser`对象，再将`Authenticate`对象存入`SecurityContextHolder`中以备后续的各种认证过滤器调用。

> 新建一个filter包，实现认证过滤器。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/31 11:15
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Autowired
    private RedisCache redisCache;

    @Override
    protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        /*获取token*/
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)) {
            //放行,直接交给后续的过滤器处理
            chain.doFilter(request, response);
            return;
        }
        /*有token,那就解析token*/
        String userId;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            userId = claims.getSubject();
        }catch(Exception e) {
            e.printStackTrace();
            throw new RuntimeException("token非法!");
        }
        /*从redis中获取用户信息*/
        String redisKey = "login:" + userId;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);
        if(Objects.isNull(loginUser)) {
            throw  new RuntimeException("用户未登录!");
        }
        /*登录信息存入SecurityContext*/
        //TODO 获取权限信息封装到Authentication中
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser, null, null);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        /*处理完毕，放行交给后续的过滤器处理*/
        chain.doFilter(request,response);
    }
```

#### 4.6.2 配置过滤器

我们写好了自己的过滤器之后，还需要指定过滤器的位置，这里我们需要将它放到`Security`的`UsernamePasswordAuthenticationFilter`过滤器之前，这些配置都在`SecurityConfig`中进行。

> 配置过滤器之后的内容。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 16:52
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    /**
     * 配置放行规则
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
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
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
}
```

****

### 4.7 退出登录接口

完成退出登录功能。

#### 4.7.1 接口实现

> 在`LoginController`中实现退出登录接口。

```java
/**
     * 退出登录接口
     * @return
     */
@RequestMapping("/user/logout")
public ResponseResult logout(){
    return loginService.logout();
}
```

> 在`LoginServiceImpl`中实现具体的退出登录逻辑。

```java
/**
     * 退出登录接口实现
     * @return ResponseResult
     */
@Override
public ResponseResult logout() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    LoginUser loginUser = (LoginUser) authentication.getPrincipal();
    Long userId = loginUser.getUser().getId();
    redisCache.deleteObject("login:" + userId);
    return new ResponseResult(200,"退出成功");
}
```

****

#### 4.7.2 接口测试

![image-20220831120911482](https://images.waer.ltd/img/image-20220831120911482.png)

****



## 5 授权

### 5.1 授权的作用

​	例如一个学校图书馆的管理系统，如果是普通学生登录就能看到借书还书相关的功能，不可能让他看到并且去使用添加书籍信息，删除书籍信息等功能。但是如果是一个图书馆管理员的账号登录了，应该就能看到并使用添加书籍信息，删除书籍信息等功能。总结起来就是**不同的用户可以使用不同的功能**。这就是权限系统要去实现的效果。

​	我们不能只依赖前端去判断用户的权限来选择显示哪些菜单哪些按钮。因为如果只是这样，如果有人知道了对应功能的接口地址就可以不通过前端，直接去发送请求来实现相关功能操作。所以我们还需要在后台进行用户权限的判断，判断当前用户是否有相应的权限，必须具有所需权限才能进行相应的操作。

****

### 5.2 授权的基本流程

​	在`SpringSecurity`中，会使用默认的`FilterSecurityInterceptor`来进行权限校验。在`FilterSecurityInterceptor`中会从`SecurityContextHolder`获取其中的`Authentication`，然后获取其中的权限信息。当前用户是否拥有访问当前资源所需的权限。

​	所以我们在项目中只需要把当前登录用户的权限信息也存入`Authentication`，然后设置我们的资源所需要的权限即可。

****

### 5.3 授权实现

#### 5.3.1 限制访问资源所需权限

`SpringSecurity`为我们提供了基于注解的权限控制方案，这也是我们项目中主要采用的方式。我们可以使用注解去指定访问对应的资源所需的权限。但是要使用它我们需要先开启相关配置。

> 在`SecurityConfig`中添加下面的注解，开启权限配置。

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```

然后可以在对应的接口上使用`@PreAuthorize`注解了。比如

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    @PreAuthorize("hasAuthority('test')")
    public String hello() {
        return "hello security!";
    }
}
```

==这就表示妖访问这个接口就必须有test权限才行。==

****

#### 5.3.2 封装权限信息

​	我们前面在写`UserDetailsServiceImpl`的时候说过，在查询出用户后还要获取对应的权限信息，封装到`UserDetails`中返回。这里先直接把权限信息写死封装到`UserDetails`中进行测试。

> 我们之前定义了`UserDetails`的实现类`LoginUser`，想要让其能封装权限信息就要对其进行修改。

```java
    private List<String> permissions;

    public  LoginUser(User user,List<String> permissions) {
        this.user = user;
        this.permissions = permissions;
    }
    /*存储SpringSecurity所需要的权限信息的集合*/
    @JSONField(serialize = false)
    private List<GrantedAuthority> authorities;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(authorities!=null) {
            return authorities;
        }
        /*/把permissions中字符串类型的权限信息转换成GrantedAuthority对象存入authorities中*/
        authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return  authorities;
    }
```

> `LoginUser`修改完后我们就可以在`UserDetailsServiceImpl`中去把权限信息封装到`LoginUser`中了。我们写死权限进行测试，后面我们再从数据库中查询权限信息。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objects.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息
        List<String> llist = new ArrayList<>(Arrays.asList("test"));

        /*封装为UserDetails对象返回*/
        return new LoginUser(user,llist);
    }
```

> 在`JwtAuthenticationTokenFilter`中将权限信息封装到Authentication里。

```java
//TODO 获取权限信息封装到Authentication中
UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser,null, loginUser.getAuthorities());
```

> 如此便实现了用户如果没有`test`权限就不能访问`/hello`接口。

****

#### 5.3.3 从数据库查询权限信息

##### 5.3.3.1 RBAC权限模型

`RBAC`权限模型（`Role-Based Access Control`）即：基于角色的权限控制。这是目前最常被开发者使用也是相对易用、通用权限模型。模型通常至少需要涉及五张表，分别是**用户表、权限表、角色表**以及用来关联用户和角色的**用户-角色表**和关联角色和权限的**角色-权限**表。

​	其中，**一个用户可以拥有多个角色，一个角色也可以属于多个用户**，比如张三这个用户它既可以是图书管理员，也可以是图书查阅人，所以他们之间是多对多的关系。而对于权限和角色来说，**一个角色可以拥有多种权限**，比如图书管理员这个角色可以拥有对图书的增加、删除以及查阅权限等。

​	通过两张中间表使得用户、角色、权限三者之间形成两两关联，便可以通过多表联查的方式通过用户查询所属角色，再通过角色查询出对应的权限，如此便能查出指定用户所拥有的权限了。

![image-20220901092834163](https://images.waer.ltd/img/image-20220901092834163.png)

##### 5.3.3.2 数据准备

> 将下面的`sql`脚本执行，建立对应的表关系。

```sql
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sg_security` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `sg_security`;

/*Table structure for table `sys_menu` */

DROP TABLE IF EXISTS `sys_menu`;

CREATE TABLE `sys_menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '菜单名',
  `path` varchar(200) DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `visible` char(1) DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT '#' COMMENT '菜单图标',
  `create_by` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_by` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `del_flag` int(11) DEFAULT '0' COMMENT '是否删除（0未删除 1已删除）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

/*Table structure for table `sys_role` */

DROP TABLE IF EXISTS `sys_role`;

CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `role_key` varchar(100) DEFAULT NULL COMMENT '角色权限字符串',
  `status` char(1) DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
  `del_flag` int(1) DEFAULT '0' COMMENT 'del_flag',
  `create_by` bigint(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_by` bigint(200) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

/*Table structure for table `sys_role_menu` */

DROP TABLE IF EXISTS `sys_role_menu`;

CREATE TABLE `sys_role_menu` (
  `role_id` bigint(200) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `menu_id` bigint(200) NOT NULL DEFAULT '0' COMMENT '菜单id',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `sys_user` */

DROP TABLE IF EXISTS `sys_user`;

CREATE TABLE `sys_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '用户名',
  `nick_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '昵称',
  `password` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '密码',
  `status` char(1) DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `phonenumber` varchar(32) DEFAULT NULL COMMENT '手机号',
  `sex` char(1) DEFAULT NULL COMMENT '用户性别（0男，1女，2未知）',
  `avatar` varchar(128) DEFAULT NULL COMMENT '头像',
  `user_type` char(1) NOT NULL DEFAULT '1' COMMENT '用户类型（0管理员，1普通用户）',
  `create_by` bigint(20) DEFAULT NULL COMMENT '创建人的用户id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint(20) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_flag` int(11) DEFAULT '0' COMMENT '删除标志（0代表未删除，1代表已删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

/*Table structure for table `sys_user_role` */

DROP TABLE IF EXISTS `sys_user_role`;

CREATE TABLE `sys_user_role` (
  `user_id` bigint(200) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `role_id` bigint(200) NOT NULL DEFAULT '0' COMMENT '角色id',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

为了方便测试，我们先在表种加入一些测试数据。

> sys_menu(权限表)

![image-20220901094956047](https://images.waer.ltd/img/image-20220901094956047.png)

> sys_role(角色表)

![image-20220901095118027](https://images.waer.ltd/img/image-20220901095118027.png)

> sys_role_menu(角色权限表)

![image-20220901095156943](https://images.waer.ltd/img/image-20220901095156943.png)

> sys_user_role(用户角色表)

![image-20220901095455305](https://images.waer.ltd/img/image-20220901095455305.png)

> sys_user(用户表)

![image-20220901095517116](https://images.waer.ltd/img/image-20220901095517116.png)

****

##### 5.3.3.3 编写查询sql

> 为了减少后期查询出错的概率，我们先写好对应的查询`sql`语句并进行测试。
>
> 查询用户id为2的用户权限数据。

```sql
SELECT
	DISTINCT m.`perms`
FROM
	sys_user_role ur
	LEFT JOIN `sys_role` r ON ur.`role_id` = r.`id`
	LEFT JOIN `sys_role_menu` rm ON ur.`role_id` = rm.`role_id`
	LEFT JOIN `sys_menu` m ON m.`id` = rm.`menu_id`
WHERE
	user_id = 2
	AND r.`status` = 0
	AND m.`status` = 0
```

![image-20220901101651873](https://images.waer.ltd/img/image-20220901101651873.png)

****

##### 5.3.3.4 实体类

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 10:18
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@TableName(value="sys_menu")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Menu implements Serializable {
    private static final long serialVersionUID = -54979041104113736L;

    @TableId
    private Long id;
    /**
     * 菜单名
     */
    private String menuName;
    /**
     * 路由地址
     */
    private String path;
    /**
     * 组件路径
     */
    private String component;
    /**
     * 菜单状态（0显示 1隐藏）
     */
    private String visible;
    /**
     * 菜单状态（0正常 1停用）
     */
    private String status;
    /**
     * 权限标识
     */
    private String perms;
    /**
     * 菜单图标
     */
    private String icon;

    private Long createBy;

    private Date createTime;

    private Long updateBy;

    private Date updateTime;
    /**
     * 是否删除（0未删除 1已删除）
     */
    private Integer delFlag;
    /**
     * 备注
     */
    private String remark;
}
```

****

##### 5.3.3.5 代码实现

我们只需要根据用户`id`去查询到其所对应的权限信息即可。所以可以先定义个`mapper`，其中提供一个方法可以根据`userid`查询权限信息。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 10:31
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
public interface MenuMapper extends BaseMapper<Menu> {
    List<String> selectPermsByUserId(Long id);
}
```

>  尤其是自定义方法，所以需要创建对应的mapper文件，定义对应的`sql`语句

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.waer.serurity.securitydemo.mapper.MenuMapper">


    <select id="selectPermsByUserId" resultType="java.lang.String">
        SELECT
            DISTINCT m.`perms`
        FROM
            sys_user_role ur
                LEFT JOIN `sys_role` r ON ur.`role_id` = r.`id`
                LEFT JOIN `sys_role_menu` rm ON ur.`role_id` = rm.`role_id`
                LEFT JOIN `sys_menu` m ON m.`id` = rm.`menu_id`
        WHERE
            user_id = #{userid}
          AND r.`status` = 0
          AND m.`status` = 0
    </select>
</mapper>
```

> 在`application.yml`中配置`mapperXML`文件的位置。

```yaml
mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
```

> 测试下是否能正常查询到用户权限。

```java
@Test
public void testPermission() {
    List<String> perms = menuMapper.selectPermsByUserId(2L);
    System.out.println(perms);
}
```

**测试通过！**

> 然后我们可以在`UserDetailsServiceImpl`中去调用该`mapper`的方法查询权限信息封装到`LoginUser`对象中即可。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 15:27
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MenuMapper menuMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        /*根据用户名查询用户信息*/
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        /*等值条件构造*/
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        if (Objects.isNull(user)){
            throw new RuntimeException("用户名或密码错误!");
        }
        //TODO 根据用户查询权限信息
        List<String> permissionKeyList = menuMapper.selectPermsByUserId(user.getId());
        /*封装为UserDetails对象返回*/
        return new LoginUser(user,permissionKeyList);
    }
}
```

****

## 6.自定义失败处理

我们还希望在认证失败或者是授权失败的情况下也能和我们的接口一样返回相同结构的`json`，这样可以让前端能对响应进行统一的处理。要实现这个功能我们需要知道`SpringSecurity`的异常处理机制。在`SpringSecurity`中，如果我们在认证或者授权的过程中出现了异常会被`ExceptionTranslationFilter`捕获到。在`ExceptionTranslationFilter`中会去判断是认证失败还是授权失败出现的异常。

​	如果是认证过程中出现的异常会被封装成`AuthenticationException`然后调用**`AuthenticationEntryPoint`**对象的方法去进行异常处理。

​	如果是授权过程中出现的异常会被封装成`AccessDeniedException`然后调用**`AccessDeniedHandler`**对象的方法去进行异常处理。**所以如果我们需要自定义异常处理，我们只需要自定义`AuthenticationEntryPoint`和`AccessDeniedHandler`然后配置给`SpringSecurity`即可。**

****

### 6.1 自定义实现类

> 自定义`AuthenticationEntryPoint`的实现类。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 12:08
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.UNAUTHORIZED.value(), "认证失败请重新登录");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(httpServletResponse,json);
    }
}
```

由于我们需要重写异常返回的状态码和提示消息等内容，所以需要将原生的reponse对象转为字符串渲染到客户端，。用到了下面的一个工具类。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/8/30 14:44
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */

public class WebUtil
{
    /**
     * 将字符串渲染到客户端
     * @param response 渲染对象
     * @param string 待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String string) {
        try
        {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
```

****

> 自定义`AccessDeniedHandler`的实现类。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/1 12:18
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException e) throws IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.FORBIDDEN.value(), "权限不足");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(response,json);
    }
}
```

****

### 6.2 将自定义实现拍配置到Security中

> 实现了Security的自定义异常实现类之后，我们还需要将这些实现配置到对应的Security中才会被Security认可生效。涉及到Security的配置都在`SecurityConfig`中进行。

```java
@Autowired
private AuthenticationEntryPoint authenticationEntryPoint;
@Autowired
private AccessDeniedHandler accessDeniedHandler;
/*配置自定义异常实现类*/
http.exceptionHandling()
    .authenticationEntryPoint(authenticationEntryPoint)
    .accessDeniedHandler(accessDeniedHandler);
```

****

### 6.3 测试

> 对上面两个自定义的异常实现进行测试，是否可用。

![image-20220901123413635](https://images.waer.ltd/img/image-20220901123413635.png)

**认证失败异常测试通过**

![image-20220901123610850](https://images.waer.ltd/img/image-20220901123610850.png)

**权限不足异常测试通过**

## 7.跨域问题

​	浏览器出于安全的考虑，使用 `XMLHttpRequest`对象发起 HTTP请求时必须遵守同源策略，否则就是跨域的HTTP请求，默认情况下是被禁止的。 同源策略要求源相同才能正常进行通信，即协议、域名、端口号都完全一致。

前后端分离项目，前端项目和后端项目一般都不是同源的，所以肯定会存在跨域请求的问题。所以我们就要处理一下，让前端能进行跨域请求。

### 7.1 配置跨域请求

> 先对`SpringBoot`配置，自定义一个配置类实现`WebMvcConfigurer`，运行跨域请求。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/2 10:38
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        /*设置允许跨域的路径*/
        registry.addMapping("/**")
                /*设置允许跨域请求的域名*/
                .allowedOriginPatterns("*")
                /*是否允许Cookie*/
                .allowCredentials(true)
                /*允许跨域的请求方式*/
                .allowedMethods("GET","POST","PUT","DELETE")
                /*设置允许的Header属性*/
                .allowedHeaders("*")
                /*跨域允许时间*/
                .maxAge(3600);
    }
}
```

写好跨域的配置类之后，我们同样需要在`SecurityConfig`中开启跨域配置。

****

### 7.2 开启跨域配置

由于我们的资源都会收到`SpringSecurity`的保护，所以想要跨域访问还要让`SpringSecurity`运行跨域访问。

> 在`config`下的`SecurityConfig`中开启跨域允许。

```java
  /*允许跨域*/
  http.cors();
```

****

## 8. 一些补充

### 8.1 权限校验的基本原理

我们前面都是使用@`PreAuthorize`注解，然后在在其中使用的是`hasAuthority`方法进行校验。`SpringSecurity`还为我们提供了其它方法例如：`hasAnyAuthority`，`hasRole`，`hasAnyRole`等。

​    里我们先不急着去介绍这些方法，我们先去理解`hasAuthority`的原理，然后再去学习其他方法你就更容易理解，而不是死记硬背区别。并且我们也可以选择定义校验方法，实现我们自己的校验逻辑。`hasAuthority`方法实际是执行到了`SecurityExpressionRoot`的`hasAuthority`，大家只要断点调试既可知道它内部的校验原理。

比如我们前面用到的`hasAuthority()`方法，进入方法的内部，发现他其实是几个方法调用链的其中一环：

![image-20220902110817383](https://images.waer.ltd/img/image-20220902110817383.png)

> 这里的`hasAnyAuthorityName`方法其实就是将我们传入的权限名存入`Set`集合并从中遍历，判断用户的权限是否存在于该权限集合中，存在就返回`true`。

![image-20220902111012791](https://images.waer.ltd/img/image-20220902111012791.png)

![image-20220902111029568](https://images.waer.ltd/img/image-20220902111029568.png)

我们大可不必太过关心它的每一层方法调用链，但需要了解最终具体的实现原理。它内部其实是调用`authentication`的`getAuthorities`方法获取用户的权限列表。

****

### 8.2 其他的权限校验方法

除了我们使用过的`hasAuthrity()`方法之外，`Security`还有其他几种不同的方法，如下：

![image-20220902111758182](https://images.waer.ltd/img/image-20220902111758182.png)

> 比如：`hasAnyAuthority`,可以看到，它支持`String`类型的可变长参数，这就意味着我们可以传入多个权限名，只要用户满足其一就代符合权限校验的规则。

```java
    @PreAuthorize("hasAnyAuthority('admin','test','system:dept:list')")
    public String hello(){
        return "hello";
    }
```

> `hasRole`要求有对应的角色才可以访问，但是它内部会把我们传入的参数拼接上 **`ROLE_`** 后再去比较。所以这种情况下要有用户对应的权限也要有 **`ROLE_`** 这个前缀才可以。

```java
  @PreAuthorize("hasRole('system:dept:list')")
    public String hello(){
        return "hello";
    }
```

> `hasAnyRole `有任意的角色就可以访问。它内部也会把我们传入的参数拼接上 **`ROLE_`** 后再去比较。所以这种情况下要有用户对应的权限也要有 **`ROLE_`** 这个前缀才可以。

```java
    @PreAuthorize("hasAnyRole('admin','system:dept:list')")
    public String hello(){
        return "hello";
    }
```

****

### 8.3 自定义权限校验方法

明白了它的权限校验方法的基本实现逻辑之后，我们也可以定义自己的权限校验方法，在@`PreAuthorize`注解中使用我们的方法。

> 新建一个`expression`包，自定义权限校验方法。

```java
/**
 * @author: 八尺妖剑
 * @date: 2022/9/2 11:36
 * @email: ilikexff@gmail.com
 * @blog: https://www.waer.ltd
 */
@Component("ex")
public class MYExpressionRoot {
    public boolean hasAuthority(String authority) {
        /*获取当前用户的权限*/
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        /*转为set并判断其中是否含有authority*/
        return loginUser.getPermissions()
                .stream()
                .collect(Collectors.toSet())
                .contains(authority);
    }
}
```

> 在SPEL表达式中使用 @ex相当于获取容器中bean的名字未ex的对象。然后再调用这个对象的hasAuthority方法

```java
   @RequestMapping("/hello")
    @PreAuthorize("@ex.hasAuthority('system:dept:list')")
    public String hello(){
        return "hello";
    }
```

> 测试自定义权限方法是否正常。

![image-20220902120031243](https://images.waer.ltd/img/image-20220902120031243.png)

![image-20220902120326877](https://images.waer.ltd/img/image-20220902120326877.png)

****

### 8.4 基于配置的权限控制

我们也可以在配置类中使用使用配置的方式对资源进行权限控制。

```java
    @Override
    protected void configure(HttpSecurity http) throws Exception {
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
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        //配置异常处理器
        http.exceptionHandling()
                //配置认证失败处理器
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler);

        //允许跨域
        http.cors();
    }
```

****

### 8.5 CSRF

`CSRF`是指跨站请求伪造（`Cross-site request forgery`），是`web`常见的攻击之一。

[推荐文章](https://blog.csdn.net/freeking101/article/details/86537087)

​	`SpringSecurity`去防止`CSRF`攻击的方式就是通过`csrf_token`。后端会生成一个`csrf_token`，前端发起请求的时候需要携带这个`csrf_token`,后端会有过滤器进行校验，如果没有携带或者是伪造的就不允许访问。

​	我们可以发现`CSRF`攻击依靠的是`cookie`中所携带的认证信息。但是在前后端分离的项目中我们的认证信息其实是`token`，而`token`并不是存储中`cookie`中，并且需要前端代码去把`token`设置到请求头中才可以，所以`CSRF`攻击也就不用担心了。

****

### 8.6 认证成功处理器

实际上在`UsernamePasswordAuthenticationFilter`进行登录认证的时候，如果登录成功了是会调用`AuthenticationSuccessHandler`的方法进行认证成功后的处理的。`AuthenticationSuccessHandler`就是登录成功处理器。

> 我们也可以自己去自定义成功处理器进行成功后的相应处理。

```java
@Component
public class SGSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("认证成功了");
    }
}
```

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().successHandler(successHandler);
        http.authorizeRequests().anyRequest().authenticated();
    }
}
```

****

### 8.7 认证失败处理器

实际上在`UsernamePasswordAuthenticationFilter`进行登录认证的时候，如果认证失败了是会调用`AuthenticationFailureHandler`的方法进行认证失败后的处理的。`AuthenticationFailureHandler`就是登录失败处理器。

> 我们也可以自己去自定义失败处理器进行失败后的相应处理。

```java
@Component
public class SGFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        System.out.println("认证失败了");
    }
}
```

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
//                配置认证成功处理器
                .successHandler(successHandler)
//                配置认证失败处理器
                .failureHandler(failureHandler);

        http.authorizeRequests().anyRequest().authenticated();
    }
}
```

****

### 8.8 登出成功处理器

```java
@Component
public class SGLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("注销成功");
    }
}
```

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    private AuthenticationFailureHandler failureHandler;

    @Autowired
    private LogoutSuccessHandler logoutSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
//                配置认证成功处理器
                .successHandler(successHandler)
//                配置认证失败处理器
                .failureHandler(failureHandler);

        http.logout()
                //配置注销成功处理器
                .logoutSuccessHandler(logoutSuccessHandler);

        http.authorizeRequests().anyRequest().authenticated();
    }
}
```

****

全文完！感谢阅读。
