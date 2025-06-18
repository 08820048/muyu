
+++
title = "关于Lombok鲜为人知的几个奇技淫巧"
date = 2024-04-25
tags = ["Lombok", "Java", "注解", "代码简化", "开发技巧"]
description = "介绍Lombok中一些鲜为人知的高级用法，包括@Delegate委托模式和@Cleanup资源管理等奇技淫巧，帮助开发者更好地利用Lombok提升开发效率。"
+++

## 0. 导语

各位芳龄18，工作经验20年的朋友多多少少都用过`lombok`这个东西，他的注解一用一个不吱声，一用一个巴适。但是这篇文章的重点不是在于教你如何系统的使用`Lombok`，而是分享几个你可能几乎不知道的 **奇技淫巧**。

![image-20240425210701454](https://images.waer.ltd/notes/image-20240425210701454.png)

---

## 1. Lombox 基本情况

虽然说的具体使用教程不是本文的重点，但是基本的概念和简单的用法还是要提一嘴的，万一真有新人还没来得及发现这个东西呢，岂不是又能嫖到一个宝？

`Lombok `是一个 Java 库，旨在通过自动生成代码来简化 Java 类的编写。使用 `Lombok `可以**减少样板代码**，例如 `getter`、`setter`、构造函数等，从而提高开发效率。通过在类中添加注解，`Lombok `可以在编译时生成相应的代码，减少开发人员需要手动编写的重复代码。

以下是一些 `Lombok` 提供的常用注解和功能：

1. **@Getter/@Setter**：通过在字段上添加 `@Getter` 和 `@Setter `注解，可以自动生成相应的 `getter` 和 `setter `方法。
2. **@ToString**：通过在类上添加 `@ToString `注解，可以自动生成 `toString()` 方法。
3. **@EqualsAndHashCode**：通过在类上添加 `@EqualsAndHashCode` 注解，可以自动生成 `equals()` 和 `hashCode() `方法。
4. **@NoArgsConstructor/@RequiredArgsConstructor/@AllArgsConstructor**：通过在类上添加这些注解，可以生成无参构造函数、带指定参数的构造函数或者包含所有参数的构造函数。
5. **@Data**：`@Data` 注解相当于同时添加了 `@Getter、@Setter、@ToString、@EqualsAndHashCode` 和 `@RequiredArgsConstructor `注解。
6. **@Builder**：通过 `@Builder `注解可以实现建造者模式，简化对象的构建过程。
7. **@Slf4j**：通过 `@Slf4j `注解可以自动生成一个名为 `log `的` SLF4J Logger` 对象。

---

## 2. 代码实践

以上这些注解都是最最常用的几个注解，在开发中几乎随处可见，下面就拎几个出来用代码的方式演示一下，以表诚心。

###  2.1 @Getter/@Setter

过多的解释这里就不再赘述了，上面说的很清楚了，直接上代码。要使用这玩意儿，还是得先导依赖，这是基本操作了。为了方便各位白嫖党得兄弟们，这里直接把`maven`和`gradle`版本的依赖都贴出来，主打一个伸手就拿!!

- **maven**

```xml
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.32</version>
    <scope>provided</scope>
</dependency>
```

- **gradle**

```groovy
// https://mvnrepository.com/artifact/org.projectlombok/lombok
compileOnly 'org.projectlombok:lombok:1.18.32'
```

> tips：如果你是通过`SpringBoot`初始化器创建的项目，那么无需上面这种手动导入，直接在创建时勾选这个组件即可。

---

我们有一个名为`User`的`pojo`;

```java
public class User {
    
    private Long id;
    
    private String username;
    
    private String password;
    
    private String email;
    
    private LocalDate createTime;
    
    // more 
}
```

加入写在用常规的方式，手动创建`getter`和`setter`方法，代码结构是这样的:

```java
/**
 * ======================|静如瘫痪|=============================
 *
 * @项目名: LombokDemo
 * @作者: Gemini48
 * @日期: 2024/4/25
 * @博客: https://www.ilikexff.cn/
 * @邮箱: ilikexff@gmail.com
 * @描述: This is the default description information.
 * ======================|动如癫痫|=============================
 **/


package cn.ilikexff.lombokdemo.pojo;

import java.time.LocalDate;

public class User {

    private Long id;

    private String username;

    private String password;

    private String email;

    private LocalDate createTime;
    
    // .....

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDate createTime) {
        this.createTime = createTime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}

```

其实这些代码都是模板代码，改动的概念很小，但如果项目结构很大，有很多的`pojo`，那么手动为这些实体创建get和set的工作量也不小，而且属于浪费时间的操作。

因此，不妨看看使用`lombok`改造后的代码:

```java
/**
 * ======================|静如瘫痪|=============================
 *
 * @项目名: LombokDemo
 * @作者: Gemini48
 * @日期: 2024/4/25
 * @博客: https://www.ilikexff.cn/
 * @邮箱: ilikexff@gmail.com
 * @描述: This is the default description information.
 * ======================|动如癫痫|=============================
 **/


package cn.ilikexff.lombokdemo.pojo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class User {

    private Long id;

    private String username;

    private String password;

    private String email;

    private LocalDate createTime;

    // .....

}
```

就这？是的，就这，就这简单的两个注解，省去了几十行”废物“代码，最主要是节省了时间，可以将精力集中在业务开发上，而是不在这里写`1,2,3,4,5`。

---

### 2.2 @Data

这个就更常见了，如果没有特别的要求，我们更多使用的是这个一劳永逸的注解，正如开始所说的，这是一个集众多注解于一身的多功能注解。

![image-20240425194639164](https://images.waer.ltd/notes/image-20240425194639164.png)

没有对比就没有抉择，虽然浪费空间，但这里还是贴一下使用`Data`之前之后的代码，以供各位客官享用；

```java
/**
 * ======================|静如瘫痪|=============================
 *
 * @项目名: LombokDemo
 * @作者: Gemini48
 * @日期: 2024/4/25
 * @博客: https://www.ilikexff.cn/
 * @邮箱: ilikexff@gmail.com
 * @描述: This is the default description information.
 * ======================|动如癫痫|=============================
 **/


package cn.ilikexff.lombokdemo.pojo;

import java.time.LocalDate;

public class User {

    private Long id;

    private String username;

    private String password;

    private String email;

    private LocalDate createTime;

    // .....

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDate createTime) {
        this.createTime = createTime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public User(Long id, LocalDate createTime, String email, String password, String username) {
        this.id = id;
        this.createTime = createTime;
        this.email = email;
        this.password = password;
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", createTime=" + createTime +
                '}';
    }
}
```

使用`@Data`后:

```java
/**
 * ======================|静如瘫痪|=============================
 *
 * @项目名: LombokDemo
 * @作者: Gemini48
 * @日期: 2024/4/25
 * @博客: https://www.ilikexff.cn/
 * @邮箱: ilikexff@gmail.com
 * @描述: This is the default description information.
 * ======================|动如癫痫|=============================
 **/


package cn.ilikexff.lombokdemo.pojo;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author Gemini48
 */
@Data
public class User {

    private Long id;

    private String username;

    private String password;

    private String email;

    private LocalDate createTime;

    // .....
    
}
```

关于`Lombok`的基本介绍就到这里了，用不用你自己决定。下面才是本文的重头戏，`Lombok`中哪些鲜为人知的 **奇技淫巧**的介绍。

---

##3.  奇技淫巧



### 3.1 @Delegate

> @Delegate 允许类在零代码的情况下使用其他类的方法。

比如说，有一个名为` A` 的类，该类有一个名为 `say1()` 的方法，并且您希望另一个类` B` 也能够使用此方法，则可以将` A` 类型的字段添加到类` B`，并添加 `@Delegate`注解 。写在` B` 中的`A`可以直接调用该 `say1` 方法，并说了一句:"**拿来吧你**!"(狗头)

- A类

```java
public class A {
    public String say1(String name) {
        return "Hello," + name;
    }
}
```

- B类

```java
public class B {

    @Delegate
    private A a = new A();

    public String say2 (String name) {
        return say1(name) + ",Hello,I`M 鸡哥.";
    }
	
    // main test...
    public static void main(String[] args) {
        B b = new B();
        System.out.println(b.say2("拔哥"));
    }
}
```

在这段代码中，使用 `@Delegate` 注解可以简化代码，自动生成委托方法，将 `B` 类中未实现的方法委托给 `A` 类。这样做的好处是可以减少代码量，避免重复编写委托方法。

通过使用 `@Delegate` 注解，`B` 类中不需要显式地编写 `say1` 方法的委托代码，而是直接调用 `say1` 方法，由 `Lombok `自动生成委托代码。

他是怎么实现的，不妨看看编译后的`.class`文件：

```java
public class B {
    private A a = new A();

    public B() {
    }

    public String say2(String name) {
        String var10000 = this.say1(name);
        return var10000 + ",Hello,I`M 鸡哥.";
    }

    public static void main(String[] args) {
        B b = new B();
        System.out.println(b.say2("拔哥"));
    }

    public String say1(final String name) {
        return this.a.say1(name);
    }
}
```

使用 `@Delegate` 注解可以简化这个过程，减少重复的代码编写，提高代码的可读性和可维护性。

---

### 3.2 @Cleanup

> `@Cleanup` 可以自动管理各种需要释放的资源，如输入流和输出流，并确保 `close `方法被安全调用。

``java
public class CleanupExample {

    public static void main(String[] args) {
        String filePath = "博主银行卡密码.txt";
        
        try {
            @Cleanup FileInputStream inputStream = new FileInputStream(filePath);
            int data;
            while ((data = inputStream.read()) != -1) {
                System.out.print((char) data);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

同样看下`.class`文件。

``java
public class files {
    public files() {
    }

    public static void main(String[] args) {
        String filePath = "博主银行卡密码.txt";

        try {
            FileInputStream inputStream = new FileInputStream(filePath);

            int data;
            try {
                while((data = inputStream.read()) != -1) {
                    System.out.print((char)data);
                }
            } finally {
                if (Collections.singletonList(inputStream).get(0) != null) {
                    inputStream.close();
                }

            }
        } catch (IOException var8) {
            IOException e = var8;
            e.printStackTrace();
        }

    }
}
```

`@Cleanup` 注解会在被注解的变量声明处插入一个 `try-finally` 块，以确保在作用域结束时调用资源的 `close()` 方法来释放资源。

当使用 `@Cleanup` 注解时，`Lombok`会在编译时自动生成代码，类似于在代码中手动编写的资源管理代码。这样可以避免手动书写繁琐的资源关闭代码，提高代码的可读性和简洁性。

---

> See you next time!