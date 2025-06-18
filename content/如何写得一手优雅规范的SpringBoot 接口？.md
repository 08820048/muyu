+++
title = "如何写得一手优雅规范的SpringBoot 接口？"
date = 2024-04-20
tags = ["Spring Boot", "RESTful API", "Java", "接口设计", "最佳实践"]
description = "详细介绍如何编写优雅规范的Spring Boot接口，包括RESTful设计原则、注解使用、异常处理、安全性和版本控制等最佳实践。"
+++

## 导语

> 优雅的代码赏心悦目，你的代码触目惊心。

当编写 `Spring Boot` 接口时，优雅和规范是至关重要的。一个良好设计的接口能够提高代码的可读性、可维护性和可扩展性，从而为整个应用程序的开发和维护带来便利。

在本文中，我们将探讨如何通过遵循最佳实践和设计原则，编写出优雅规范的` Spring Boot` 你的接口也可以像企业级项目接口一般规范且优雅。

---

## 严格遵循`RESTful API `设计原则

- 清晰一致的资源命名：使用准确反映 `API `管理的资源的名词（例如，`/articles、/users`）。

```java
@GetMapping("/articles/{id}")
public ResponseEntity<Product> getArticleById(@PathVariable Long id) {
    // ...
}
```

- 标准化 `HTTP `方法：遵循 `CRUD `操作的 `RESTful` 约定（`CREATE： POST、READ： GET、UPDATE： PUT、DELETE：DELETE`）。

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    // ...
}
```

- 有意义的状态代码：返回相应的 `HTTP `状态代码,如成功 （`2xx`）、错误 （`4xx`） 或服务器问题 （`5xx`）。

```java
@DeleteMapping("/articles/{id}")
public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
    if (productService.deleteArticle(id)) {
        return ResponseEntity.noContent().build(); // 204 No Content
    } else {
        return ResponseEntity.notFound().build(); // 404 Not Found
    }
}
```

关于更多`restful`标准，参考[`https://en.wikipedia.org/wiki/REST`](https://en.wikipedia.org/wiki/REST)

---

## 合理利用好 Spring Boot 注解

这里所谓得合理，不是很好定义，但本着高效、简洁、清晰得原则推荐。

- `@RestController`：默认情况下，将控制器标记为返回 `JSON` 或其他结构化数据。

> 这是一个综合注解，是`@Controller` 和 `@ResponseBody`的功能于一身，一个注解作两个注解的事情，简洁高效。

```java
@RestController
public class HelloController {
    // .....
}
```

- `@RequestMapping`：定义每个`controller`的基本路径。

> 这样做可以使代码更加整洁和易于维护。不需要在每个方法上都重复写基本路径部分,在类级别定义基本路径可以带来更清晰、更简洁、更易维护的代码结构，同时也有助于提高开发效率和代码质量。

```java
@RestController
@RequestMapping("/user")
public class HelloController {
    // .....
}
```

- 使用简化的请求方式注解。

> 在不同类型的方法上直接使用`@GetMapping、@PostMapping、@PutMapping@DeleteMapping`注解进行标识，而不是使用笼统的` @RequestMapping(method = RequestMethod.POST)`。

- 使用`@PathVariable`获取请求的路径变量；

```java
@RestController
@RequestMapping("/articles")
public class ArticleController {

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        // 根据文章的id查询文章
        Article article = articleService.findArticleById(id);

        if (article != null) {
            return ResponseEntity.ok(article);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
```

- 使用`@RequestBody`将请求正文内容反序列化为 Java 对象。

```java
@RestController
@RequestMapping("/api")
public class UserController {

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // 这里的 User 对象会从请求的 JSON 数据中反序列化得到
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }
}
```

---

## 关于依赖注入的使用建议

- 使用构造函数注入方式

> 通过在类的构造函数中接受依赖对象作为参数来进行注入。这种方式可以确保依赖在对象创建时被注入，提高了代码的可测试性和可维护性。

```java
@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    // ... other controller methods
}
```

---

## 针对接口的异常处理

- `@ControllerAdvice`的使用

```java
@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ArticleNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleArticleNotFound(ArticleNotFoundException ex) {
        // ... create error response with details
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
}
```

---

## 使用`DTO`代替`POJO`的直接使用

> 对于数据传输对象，建议对`pojo`进行`dto`的封装，而不是使用原实体。提高代码的可读性、可维护性和数据封装性。

```java
public class ArticleDto {
    private Long id;
    private String title;
    private String contents;
    // more
}
```

---

## 接口安全的建议

- 使用`SpringSecurity`等安全框架进行认证授权，包括令牌机制的使用，如`JWT`。
- 对接口进行常见的漏洞检查并采取防范措施，比如`XSS`和`SQL`注入等。
- 使用`https`进行网络通信；

---

## 关于版本控制

- 使用路径版本控制（例如，`/api/v1/articles`）或基于标头的版本控制。

> 使用版本控制 `API `来管理更改并保持与客户端的兼容性。

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping("/details")
    public ResponseEntity<String> getProductDetails(@RequestHeader("Accept-Version") String version) {
        if ("v1".equals(version)) {
            return ResponseEntity.ok("Product details for version 1");
        } else if ("v2".equals(version)) {
            return ResponseEntity.ok("Product details for version 2");
        } else {
            return ResponseEntity.badRequest().body("Unsupported version");
        }
    }
}
```

---

## 完备的接口测试

- 考虑使用 `Mockito `或 `JUnit `等工具对每个接口进行测试，保证接口的准确性和稳健性。

---

## 本文小结

上面虽然列举好几种编写接口的规范和建议，但这些不是一成不变的，在具体的项目，还需要根据业务和项目需求做出一些让步和改动，灵活运用这些建议，你的接口也可以很优雅。**代码就是一行行蓝色的诗，而不是冰冷乏味的英文串**.