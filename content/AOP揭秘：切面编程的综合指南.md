+++
title = "AOP揭秘：切面编程的综合指南"
slug = "aop-揭秘-切面编程的综合指南"
date = 2023-06-15
+++

##  篇一、快速入门

### 1. 概念&术语解析

`Spring的AOP`（面向切面编程）是一种编程范式，它允许开发人员将横切关注点（`cross-cutting concerns`）从应用程序的主要业务逻辑中分离出来，以便更好地实现代码重用和模块化。横切关注点指的是那些存在于应用程序多个模块中的功能，如日志记录、事务管理、安全性等，它们不属于单个类或对象，而是跨越多个组件的功能。   

通过`AOP`，开发人员可以将这些横切关注点抽象为一个独立的模块，称为切面（`aspect`），并在需要的地方将其应用到应用程序中。在`Spring`框架中，`AOP`通过`AspectJ`实现，开发人员可以使用注解或配置来定义切面，并将其与应用程序中的特定连接点（`join points`）关联起来，从而实现横切关注点的功能注入。  

`Spring`的`AOP`使开发人员能够更好地实现关注点分离，提高代码的模块化程度，降低重复代码量，并提高代码的可维护性和可重用性。

换句话说，`AOP`可以在不改变原有核心业务代码逻辑的基础上增强业务方法功能的一种编程技术；

---

#### 1.1 使用案例

创建一个`SpringBoot`项目，导入下面的启动器依赖以使用`@Aspect`注解；

``xml
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-aop -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
    <version>3.2.4</version>
</dependency>
```

`AspectJ`是一种流行的`AOP`框架，可以更方便的整合使用`AOP` ,在`SpringBoot`项目中，` spring-boot-starter-aop`依赖会自动引入`AspectJ`依赖，以便能够方便地使用`AspectJ`来实现面向切面编程。

既然是对目标方法的进行增强，那么我们就需要指定一个或者多个要增强的对象，比如指定对`Service`下的某个业务方法进行增强或者是对整个`Service`包下的所有方法进行增强等等；在刚才创建的`SpringBoot`项目中考虑下面的项目结构:

![image-20240322161521990](https://images.waer.ltd/notes/image-20240322161521990.png)

为使用`AOP`创建一个独立的`aspect`包，包下继续创建一个切面类`MyAspect`，用来编写切面编程的核心逻辑；注意不要忘了给该类加上`@Component`和`Aspect`注解；

> - `@Component` 注解用于标识一个类作为`Spring`组件，并由`Spring`容器进行管理。被 `@Component` 标记的类会被自动扫描并注册为`Spring`应用上下文中的一个`bean`，可以通过依赖注入等方式在应用程序中使用。 
> - `@Aspect` 注解用于定义一个切面，即包含通知（`advice`）和切点（`pointcut`）的类。切面是`AOP`中的一个重要概念，它包含了在何时、何地以及如何应用横切关注点的逻辑。通过 `@Aspect` 注解标记的类可以定义通知类型（如前置通知、后置通知、环绕通知等），并与切点关联，从而实现在特定连接点执行特定操作的功能。

在切面类中定义一个没有返回值要求的方法，加上`@Point`注解如下:

```
 @Pointcut("execution(* cn.ilikexff.springaop.service.*.*(..))")
public void pt(){

}
```

 `@Pointcut("execution(* cn.ilikexff.springaop.service.*.*(..))")` 

这个表达式的含义是定义了一个切点，用来匹配 `cn.ilikexff.springaop.service` 包下所有类的所有方法。具体解释如下：

-  `execution` : 表示匹配方法执行的连接点。
-   第一个 `*` 表示匹配任意返回类型的方法。
-  `cn.ilikexff.springaop.service.*`  : 表示匹配该包名下的任意类。
-   第三个 `*` 表示匹配类中的任意方法。
-  `(..)` : 表示匹配任意参数的方法。

因此，这个切点表达式会匹配 `cn.ilikexff.springaop.service` 包下所有类的所有方法，无论返回类型和参数如何都将被该切面关注到；

通过切点表达式指定了需要切面关注的类或方法之后，接下来就是编写具体的增强方法了，用于在不同方向对指定方法进行增强的逻辑；比如

```
@Before("pt()")
public void beforeMethod(){
    System.out.println("前至增强通知方法被执行....");
}
```

由于切点可以有多个，因此在使用某个增强方法时需要通过不同的切点方法进行指定，比如上面代码中的`@Before("pt()")`就是指定在切点方法`pt()`指定的方法执行之前先执行下面的增强逻辑，这里也就是打印一句 **前至增强通知方法被执行....**；

在`UserService`中简单写一个方法进行测试，看看切面方法是否会在`Service`方法执行之前执行；

![image-20240322165758093](https://images.waer.ltd/notes/image-20240322165758093.png)

当我们调用`Controller`中对应的方法发起请求时，控制台的打印内容如下:

![image-20240322165914761](https://images.waer.ltd/notes/image-20240322165914761.png)

可以看到，结果也是如我们所料，切面中定义的逻辑会在切点指定方法执行之前被优先执行，通过切面编程的方式增强原有的业务逻辑不会对源代码进行入侵以及产生耦合；

---

#### 1.2 通知类型

当然，这里是使用了`@Before`注解来指定执行的时机，在实际的项目开发中，除了`@Before`之外，还有其他几个常用的类似注解：

![image-20240322211724873](https://images.waer.ltd/notes/image-20240322211724873.png)

1. `@Before` : 在目标方法执行之前执行。 
2. `@After` : 在目标方法执行之后执行，无论方法是否抛出异常。  
3. `@AfterReturning` : 在目标方法成功返回之后执行。  
4. `@AfterThrowing` : 在目标方法抛出异常后执行。  
5. `@Around` : **包围目标方法，可以在方法执行前后都执行自定义逻辑。** 

他们的使用方式和案例演示用的前置通知类似，建议自己动手挨个儿用一遍加深印象。其中需要特别注意的是`@Around`环绕通知类型，这是在日常使用过程中频率较高、功能更强的一中通知注解，所以这里单独拎出来讲两句；

在使用环绕通知的时候，需要注意添加对应的参数`ProceedingJoinPoint`，通过源码可以看到，它是`JoinPoint`的子接口，表示可以执行的连接点。

在环绕通知中， `ProceedingJoinPoint` 提供了`proceed()`方法，用于显式地调用目标方法的执行。  -  `pjp.proceed()` 是环绕通知中的关键方法，调用 `proceed()` 方法会执行目标方法，并**返回目标方法的返回值**。 可以在调用 `proceed()` 方法之前和之后编写自定义的逻辑，实现对目标方法执行过程的控制和干预。 

![image-20240322213104841](https://images.waer.ltd/notes/image-20240322213104841.png)

因此可以用来替代 `@Before` 和 `@After` 通知，提供了更灵活的控制和处理机制。 

```
@Around("pt()")
public void AroundMethod(ProceedingJoinPoint pjp){
    System.out.println("环绕通知方法被执行...");
    try {
        pjp.proceed(); // 通知目标方法执行
        // 这里可以书写目标方法执行之后的增强逻辑
    } catch (Throwable e) {
        System.out.println("目标方法出现异常..."); // 相当于@AfterThrowing
        throw new RuntimeException(e);
    }finally {
        System.out.println("进入finally.."); 
    }
}
```

**被增强方法相关信息的获取**

在环绕通知中提到了一个重要的`ProceedingJoinPoint`参数该参数可以实现相关信息的获取，具体放在后面讲，那么在另外其他几中通知类型中如何获取被增强方法的相关信息呢？

方法其实也简单，那就是在我们的通知方法中传递一个`JoinPoint`类型的参数，下面是`JoinPoint`的部分实现源码:

```
/**
 * JoinPoint接口定义了AOP中连接点的相关信息和操作方法
 */
public interface JoinPoint {
    // 不同连接点的类型常量
    String METHOD_EXECUTION = "method-execution";
    String METHOD_CALL = "method-call";
    String CONSTRUCTOR_EXECUTION = "constructor-execution";
    String CONSTRUCTOR_CALL = "constructor-call";
    String FIELD_GET = "field-get";
    String FIELD_SET = "field-set";
    String STATICINITIALIZATION = "staticinitialization";
    String PREINITIALIZATION = "preinitialization";
    String INITIALIZATION = "initialization";
    String EXCEPTION_HANDLER = "exception-handler";
    String SYNCHRONIZATION_LOCK = "lock";
    String SYNCHRONIZATION_UNLOCK = "unlock";
    String ADVICE_EXECUTION = "adviceexecution";
    
    // 返回连接点类型的字符串表示
    String toString();
    
    // 返回连接点的简短字符串表示
    String toShortString();
    
    // 返回连接点的详细字符串表示
    String toLongString();
    
    // 获取当前代理对象
    Object getThis();
    
    // 获取目标对象
    Object getTarget();
    
    // 获取连接点的参数
    Object[] getArgs();
    
    // 获取连接点的签名信息
    Signature getSignature();
    
    // 获取连接点的源代码位置信息
    SourceLocation getSourceLocation();
    
    // 获取连接点的类型
    String getKind();
    
    // 获取连接点的静态部分信息
    StaticPart getStaticPart();
    
    // 静态内部接口，表示连接点的静态部分
    public interface EnclosingStaticPart extends StaticPart {
    }
    
    // 静态内部接口，表示连接点的静态部分
    public interface StaticPart {
        // 获取连接点的签名信息
        Signature getSignature();
        
        // 获取连接点的源代码位置信息
        SourceLocation getSourceLocation();
        
        // 获取连接点的类型
        String getKind();
        
        // 获取连接点的唯一标识符
        int getId();
        
        // 返回连接点的字符串表示
        String toString();
        
        // 返回连接点的简短字符串表示
        String toShortString();
        
        // 返回连接点的详细字符串表示
        String toLongString();
    }
}
```

> 刚开始源码看不懂或者太复杂不想看不要紧，最主要得自己多写，可以通过断点或者参数打印得方式去了解他们得用法以及基本得逻辑 "科研" 搞多了自然也就理解得相对深刻了；

该类型的参数中封装了被增强方法的相关信息，通过该参数，我们可以获取到 **除异常对象和返回值之外的所有信息**。

众多信息中，` Signature getSignature();`是一个比较重要的方法，但在实际使用中一般使用它的实现类`MemberSignature`，该实现类实现了更多目标方法的信息，实用性更强；

下面是该方法的一个构造图示：

![image-20240322221935476](https://images.waer.ltd/notes/image-20240322221935476.png)

```
/**
 * 输出被调用方法得简单日志信息
 */
@Before("pt()")
public void printMethodLogs(JoinPoint joinPoint){
    // 被执行方法所在类的类名、方法名、方法传入的参数
    MethodSignature signature   = (MethodSignature)  joinPoint.getSignature();
    Object[] args = joinPoint.getArgs();
    System.out.println("方法所在类的类名:"+signature.getDeclaringType());
    System.out.println("方法名:"+signature.getName());
    System.out.println("方法参数:"+ Arrays.toString(args));
}
```

上面代码执行之后控制台输出信息:

![image-20240322223119377](https://images.waer.ltd/notes/image-20240322223119377.png)

那么，如何获取目标方法中的异常对象或者返回值呢？实现的方式多种，可以在`@AfterReturning`或者`@AfterThrowing`通知方法中实现：

```
@AfterReturning(value = "pt()",returning = "ret")
public void AfterReturning(JoinPoint joinPoint,Object ret){
    // 代码逻辑...
}

@AfterThrowing(value = "pt()",throwing = "e")
public void AfterReturning(JoinPoint joinPoint, Throwable e){
    // 代码逻辑...
}
```

> 上面的示例代码中，分别通过`returning`和`throwing`指定的同名变量来接受返回值或异常对象的信息，从而实现目标方法返回值或异常对象的获取；

显然，这样的写法是不够简洁的，繁琐的编码只会使得项目臃肿。不是`@AfterReturning`和`@AfterThrowing`用不起，而是`@Around`更有性价比!!!学习使用的方式也是差不多的模式

![image-20240322225100232](https://images.waer.ltd/notes/image-20240322225100232.png)

注意，使用`@Around`的切面方法时，如果目标方法有返回值，那么通知方法就也需要返回值，如果没有对目标方法返回值有二次`DIY`需求的情况下，建议直接返回`pjp.proceed()`方法调用的返回值即可；

---

通过上面的快速入门案例，相信对于切面编程已经有了一个大概的理解，下面在解释一些经常用到的术语概念，这样可以更好的理解这些晦涩难懂的名词；

- `Pointcut`(切入点):被增强的连接点，通过切入点对待增强的具体方法进行连接；

- `Advice`（通知/增强）：具体增强的代码逻辑；

  > 上述案例中`beforeMethod()`方法的方法体，也就是`System.out.println("前至增强通知方法被执行....");`

- `Target`(目标对象)：被增强的对象就是目标对象；

  > 比如上面案例中增强的`Service`包下的所有类对象就是目标对象；

- `Aspect`(切面)：切入点+通知的结合，每一个切入点和对应的增强逻辑组成一块切面；

  > 为什么我们新建的`MyAspect.java`叫切面类？因为这个类中就是每一个切点和通知组合而成的一个个切面；

- `Proxy`(代理)：类被`AOP`增强之后，就产生一个代理类；这个可以通过断点的方式去查看生成的的类对象信息验证；

  > 如下图所示，这里生成的类对象就是通过`GCLIB`动态代理技术产生的一个新的代理类，而非原来的原生类；

![image-20240322172914991](https://images.waer.ltd/notes/image-20240322172914991.png)

#### 1.3 切点表达式

肯定还记得注解`@Pointcut`中的那串内容：

```
"execution(* cn.ilikexff.springaop.service.*.*(..))"
```

这就是一个 **切点表达式**，用来确定具体要增强类对象；针对这个具体得表达式得含义在上面案例中已经做出了具体得解释，这里会进一步细化切点表达式的一些概念和用法；语法：

```
execution([修饰符] 返回值类型 报名.类名.方法名(参数))
```

注意：

1. 访问修饰符(`public/private/protected/default`等可以省略)；
2. 返回值类型、包名、类名、类名以及方法名可以使用`*`代表任意，星号代表任意或者全部，这种语义并不只是用在了切点表达式中，而是很多领域的通用用法，所以这很好理解；
3. 参数列表可以使用两个点`..`来表示任意的个数，任意类型的参数；
4. 包名与类名之间的点`.`表示当前包下的类，两个点`..`表示当前包及其子包下的类；

例如:

```
1. 匹配指定包下所有类的所有方法：
   -  `execution(* com.example.service.*.*(..))` 

2. 匹配指定包及其子包下所有类的所有方法：
   -  `execution(* com.example.service..*.*(..))` 

3. 匹配指定类的所有方法：
   -  `execution(* com.example.service.MyService.*(..))` 

4. 匹配指定类中以"get"开头的方法：
   -  `execution(* com.example.service.MyService.get*(..))` 

5. 匹配指定包下返回类型为String的方法：
   -  `execution(String com.example.service.*.*(..))` 

```

---

#### 1.4 切点函数

`@annotation` 是`Spring AOP`中另外一种用于定义切点的方式，它可以用来匹配带有特定注解的连接点。通过 `@annotation` 切点函数，可以实现在特定注解标记的方法上应用切面逻辑。 

切点函数的基本使用步骤:

1. 根据业务信息写一个**自定义注解**；
2. 在需要增强的方法上加上该自定义注解；
3. 在切面类中的切点方法上的`@Pointcut()`注解中加上自定义注解的全类名；
4. 启动项目，使用切面函数成功；

比如，如果我们将上面案例中切点表达式的方式改为切点函数的方式的过程如下:

- 自定义注解

  ```java
  @Target({ ElementType.METHOD })
  @Retention(RetentionPolicy.RUNTIME)
  public @interface MyLogAnn {}
  ```

- 在要增强的目标对象(`Target`)上的具体方法上加上这个自定义的注解；

  ```java
  @MyLogAnn
  public String userInfo() {
      System.out.println("Service的userInfo方法被执行...");
      return "这些是用户信息...";
  }
  ```

- 在切面类中的切点方法上的`@Pointcut()`注解中加上自定义注解的全类名；

  ```java
  //   @Pointcut("execution(* cn.ilikexff.springaop.service.*.*(..))")
  @Pointcut("@annotation(cn.ilikexff.springaop.ann.MyLogAnn)")
  public void pt() {}
  ```

- 再次启动项目即可；

**切点表达式&函数的使用建议**

![image-20240322210915411](https://images.waer.ltd/notes/image-20240322210915411.png)

在实际的项目开发中，可以参考上面两种不同方式的优势特点以及项目具体需求和场景选择合适的方式来实现`AOP`功能。

---

#### 1.5 多切面的排序问题

非`XML`方式配置的`AOP`可以使用注解`@Order`来控制顺序。

`@Order`注解是`Spring`框架中的一个注解，用于控制`Bean`的加载顺序。通过在`Bean`上使用`@Order`注解，可以指定`Bean`加载的顺序。值越小，优先级越高，加载顺序越靠前。

---

未完待续...

![搜索框传播样式-标准色版](https://images.waer.ltd/notes/%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)
