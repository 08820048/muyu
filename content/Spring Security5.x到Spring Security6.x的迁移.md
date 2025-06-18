
+++
title = "Spring Security5.x到Spring Security6.x的迁移"
date = 2024-04-20
tags = ["Spring Security", "Java", "Spring Boot", "安全框架"]
description = "详细介绍Spring Security从5.x版本升级到6.x版本的迁移指南，包括新特性、API变化和配置方式的更新。"
+++

##  1. 啄里吧嗦

之前有写过一篇关于`Spring Security`的文章，但那已经是相对比较旧的版本了，就目前`Spring Security6.0`来说，这其中出现了不少的变动和更新，很多`API`的使用也是有不小的变化，所以我觉得有必要学习一下。但这篇文章的重点放在`SpringSecurity6.x`的新变动了解以及`SpringSecurity5.x`版本的迁移上。

---

##  2. 阅读前提

这里写什么呢？`SpringSecurity6.0+`版本都更新了些什么东西，这里就简单给各位整理一下。注意这里所整理的一些更新是相较于`SpringSecurity5`版本来说的，因此这部分的内容并不适合小白阅读，因为这是建立在你已经有了一些`SpringSecurity`基础的前提下的，所以如果是完全没学过`SpringSecurity`的童鞋，建议看看这篇[上古掌控安全的神:SpringSecurity初探揭秘](https://blog.csdn.net/2302_76401343/article/details/137432951?spm=1001.2014.3001.5502)。它是是基于`SpringSecurity5`版本的快速入门文章，老肩巨猾,很好看，去看看吧。



### 2.1 Spring Boot和Spring Security的版本关系

`Spring Boot 2 `默认为 `Spring Security 5`，而 `Spring Boot 3 `使用 `Spring Security 6`。所以记住这一点，后续系列的文章所有的案例都是基于`SpringBoot3`以及`Gradle`的组合来进行的，当然，如果你还是`Maven`玩家，其实就理解学习层面来说并没有本质上的影响，无非是在实际的项目中更换一种构建方式罢了，不要觉得一看到是`Gradle`系的例子就跑路:

"哎呦！这项目没用我心爱的`Maven`，不适合我，溜了溜了!!"



### 2.2 Spring Security 6 新的变动

![image-20240420184640041](https://images.waer.ltd/notes/image-20240420184640041.png)

`Spring Security 6` 引入了多项功能更新，以提高安全性和健壮性。**它现在至少需要 Java 版本 17 并使用 `jakarta `命名空间。**，这个`Java17`可能听说过，但是`jakarta `是什么鬼可能很多人没有了解过(这其中就有我一席之地)，下面是来自 **通义千文** 的解释:

> Jakarta 命名空间是Java生态系统中用于标识一组特定技术规范和API的标准前缀。这个命名空间起源于开源社区对Java企业版（Java EE）规范的继任者——Jakarta EE项目中的API和组件的重新命名。
>
> **背景**：
>
> - **Java EE**：最初由Sun Microsystems（后被Oracle收购）主导开发，是一套用于构建企业级Java应用程序的标准和规范集合，包括诸如Servlets、JSP、EJB、JMS、JPA等技术。这些规范定义了接口和行为，由第三方供应商（如IBM、Red Hat、Oracle等）提供具体的实现。Java EE规范中的API通常以`javax.*`命名空间开头。
> - **Oracle与Java EE**：随着Oracle对Java EE的管理和发展方向引起社区的关注和担忧，2017年，Oracle宣布将Java EE移交给开源组织，并停止在Java EE 8之后的版本开发。随后，Eclipse基金会接手了Java EE的后续开发工作，并将其重命名为Jakarta EE。
> - **Jakarta EE**：作为Java EE的开源替代品，Jakarta EE保留了大部分原有Java EE规范的功能和目标，但在治理模式、开发流程和知识产权等方面遵循更加开放和社区驱动的原则。为了反映这一转变，并避免与Oracle的商标权冲突，Eclipse基金会决定将所有相关的API包名从`javax.*`改为`jakarta.*`，形成了Jakarta命名空间。
>
> **Jakarta命名空间的意义**：
>
> 1. **法律与商标独立**：更改至`jakarta.*`命名空间，标志着这些技术规范与Oracle的商标权脱钩，完全由Eclipse基金会和开源社区掌控，不受单一商业公司的控制。
> 2. **技术演进的新开端**：Jakarta EE不仅沿袭了Java EE的核心规范，还在其基础上引入了新技术、新规范和现代化开发实践。使用新的命名空间象征着这一技术栈进入了一个新的发展阶段，不受过去版本约束，能够更快地响应市场需求和技术创新。
> 3. **清晰的版本分界**：由于命名空间的改变，开发者和工具能够清楚地区分基于旧Java EE（`javax.*`）和新Jakarta EE（`jakarta.*`）构建的应用程序及其依赖。这有助于平滑迁移、避免混淆，并为兼容性问题提供了明确的基准。
> 4. **社区认同与生态建设**：Jakarta命名空间体现了开源社区对这一技术栈所有权的认可和支持。随着越来越多的厂商和开发者采用Jakarta EE规范，围绕`jakarta.*`命名空间的开源库、框架、工具和服务生态系统逐渐形成，推动了企业级Java开发的持续发展。

别看™一大堆，其实你几乎可以不看他们，阅读一遍，有个简单的印象就好了。但`Java17`这块属于硬控，躲不开的。要想使用`Spring Security6`的话，还是得注意下哈。

下面简单列一下这个版本的主要变动:

- 删除了 `WebSecurityConfigurerAdapter`，以支持基于组件的安全配置
- `authorizeRequests（）` 被删除并替换为 `authorizeHttpRequests（）` 以定义授权规则。
- 引入了 `requestMatcher（）` 和 `securityMatcher（）` 等方法来替换` antMatcher（）` 和 `mvcMatcher（）` 来配置请求资源的安全性
  - `requestMatcher（）` 方法更安全，因为它为请求配置选择了适当的` RequestMatcher` 实现。
- 弃用部分方法，如` cors（）` 和 `csrf（）` 推荐使用函数式编程。
- 一些注解上的变化....

---

## 3. 版本升级

基于上一个标题列出得更新，这部分将会简单分享一下，如何将你项目中的 `SpringSecurity5`版本升级到 `Spring Security6` 版本，以适应最新的特性；这不算一个很大的版本迁移，但有必要了解新版特性以及如何使用它们。

- `@Configuration`不再是`@EnableWebSecurity`注的一部分。因此我们在新版本(没有特殊说明，这里以及后续说的新版本和旧版本分别指的是`SpringSecurity6`和`SpringSecurity5`)中需要同时给配置类加上这两个注解。
- 新版本删除了 `WebSecurityConfigurerAdapter `类，并采用基于组件的配置,我们在些`SpringSecurity`配置类时不再需要继承这个`WebSecurityConfigurerAdapter`，因此，结合上面两点，新版本的配置应该是下面这样的:

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    // more....
}
```

- 新版本通过 `WebSecurityCustomizer bean` 来修改排除静态资源, 该接口替代了 `WebSecurityConfigurerAdapter `接口中的 `configure`。当然，现在大部分项目都是前后端分离，这个配置相对来说没那么常用，但也不妨碍我们进步！！！！

```java
@Bean
WebSecurityCustomizer webSecurityCustomizer() {
   return (web) -> web.ignoring().requestMatchers("/js/**", "/css/**");
}
```

- 通过注册 `InMemoryUserDetailsManager bean `来重构身份验证凭据逻辑:

```java
@Bean
public UserDetailsService userDetailsService () {
    // Define user information in memory
    // Administrator
    UserDetails adminUser = User.withUsername("八尺妖剑") // Username
            .password("$2a$10$5GgerupMYdknnk.ln/9jK.MrQ39IcoO9vILlgPHigpAQ10PbLsoHS") // Password, {noop} for no encryption
            .roles("admin") // Assign roles
            .authorities("ROLE_test:show","user:name","user:list") 
            .build();
    // Build normal user information
    UserDetails users = User.withUsername("李四") // Username
            .password("$2a$10$5GgerupMYdknnk.ln/9jK.MrQ39IcoO9vILlgPHigpAQ10PbLsoHS") // Password, {noop} for no encryption
            .roles("user") // Assign role
            .build();
    // Store the constructed user information in SpringSecurity (in memory)
    InMemoryUserDetailsManager userDetailsManager = new InMemoryUserDetailsManager();
    userDetailsManager.createUser(adminUser);
    userDetailsManager.createUser(users);
    return userDetailsManager;
}
```

-  HTTP 安全配置,在旧版本中，我们一般通过重写 `WebSecurityConfigurer `类中的 `configure `方法来配置 `HttpSecurity`。由于它在最新版本中被删除，新版的配置方式是通过`SecurityFilterChain bean` 来进行。

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
    // Configure CSRF to be disabled
    httpSecurity.csrf(AbstractHttpConfigurer::disable);

    // Configure request interception
    httpSecurity.authorizeHttpRequests(auth ->
                    auth.requestMatchers("/to_login","/user").permitAll().anyRequest().authenticated());

    // Specify login method: form, BASIC, etc.
    httpSecurity.formLogin(form -> form.loginPage("/to_login") // Redirect to custom login page
            .loginProcessingUrl("/doLogin") // Handle frontend requests, path matches frontend request path
            .usernameParameter("username")
            .passwordParameter("password")
            .defaultSuccessUrl("/index") // Default page to redirect to after successful login
    );
    return httpSecurity.build();
}
```

- 当然，密码编码器的写法也可以通过注册`Bean`得方式来完成:

```java
@Bean
public PasswordEncoder passwordEncoderParser() {
    // Build the password encoder
    return new BCryptPasswordEncoder();
}
```





