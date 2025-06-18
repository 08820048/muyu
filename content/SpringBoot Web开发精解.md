+++
title = "SpringBoot Web开发精解"
slug = "springboot-web开发精解"
date = 2023-06-15
+++

## SpringMVC基础回顾

当在` Spring Boot` 中引入 `Web `模块时，`SpringBoot` 会帮我们自动配置 `Web `相关的组件，其中 `Spring MVC` 便是最重要的部分。

![](https://images.waer.ltd/img/MVC.png)

### 组件介绍

**上图是 `SpringMVC` 的工作原理图。先介绍一下原理图中涉及的各个组件。**

- **DispatcherServlet**:前端控制器，是整个流程的**控制中心**，由它调用其他组件处理用户请求。
- **HandlerMapping**:处理器映射器，负责根据用户请求的`URL`找到相应的`Handler`处理器。
- **HandlerAdapter**:处理器适配器，根据处理器映射器(`HandlerMapping`)找到`Handler`的相关信息，依据持定的规则去执行相关的处理器`Handler`。
- **Handler**:处理器，负责执行用户的请求，`Controller`便是处理器。
- **ViewResolver**:视图解析器，**首先根据逻辑视图名解析成物理视图名即具体的页面地址，**再生成`View`视图对象，最后对`View`进行渲染将处理结果通过页面展示给用户。
- **ModelAndView**:使用`ModelAndView`类用来处理该数据的视图。当控制器处理完请求后，通常控制器将会包含视图名称以及一些模型属性的`ModelAndView`对象返回给`DispatcherServlet`。



### 工作流程

**介绍完组件的功能后，接着来梳理一下 `SpringMVC` 工作流程。**

1. 用户向服务器发送请求至前端控制器 `DispatcherServlet`。
2. `DispathcherServlet `调用 `HandlerMapping`，由此得知由哪个` Handler(Controller)`来处理该请求。
3. `HandlerMapping `找到具体的处理器，生成处理器对象及处理器拦截器一并返回给 `DispathcherServlet`。
4. `DispathcherServlet `调用 `HandlerAdapter `。
5. `HandlerAdapter `经过适配调用具体的 `Handler`，也叫做控制器（`Controller`）。
6. `Handler `处理完请求后返回 `ModelAndView `。
7. `HandlerAdapter `将后端处理器的结果 `ModelAndView `反馈给 `DispathcherServlet`。
8. `DispathcherServlet `将 `ModelAndView `传给 视图解析器 `ViewResolver `。
9. `ViewResolver `根据 `ModelAndView `中的视图名称返回具体的 `View `。
10. `DispathcherServlet `将 `ModelAndView `中的模型数据填充到视图中，渲染视图。
11. `DispathcherServlet `将结果响应给用户。

> 用户向服务器发送请求给前端控制器，前端控制器收到请求之后调用处理映射器得到该请求由那个处理器进行处理，结果反馈给前端控制器，前端控制器再将该结果发给控制适配器，调用具体的处理器处理(`Controller`)并返回一个`MV`，处理器将该`MV`模型返回给前端控制器，前端控制器得到之后调用视图解析器解析该模型，完了得到一个视图`view`，再将该视图通过前端页面渲染到浏览器，展现给用户。

```
## SpringMVC基础回顾

当在` Spring Boot` 中引入 `Web `模块时，`SpringBoot` 会帮我们自动配置 `Web `相关的组件，其中 `Spring MVC` 便是最重要的部分。

![](https://images.waer.ltd/img/MVC.png)

### 组件介绍

**上图是 `SpringMVC` 的工作原理图。先介绍一下原理图中涉及的各个组件。**

- **DispatcherServlet**:前端控制器，是整个流程的**控制中心**，由它调用其他组件处理用户请求。
- **HandlerMapping**:处理器映射器，负责根据用户请求的`URL`找到相应的`Handler`处理器。
- **HandlerAdapter**:处理器适配器，根据处理器映射器(`HandlerMapping`)找到`Handler`的相关信息，依据持定的规则去执行相关的处理器`Handler`。
- **Handler**:处理器，负责执行用户的请求，`Controller`便是处理器。
- **ViewResolver**:视图解析器，**首先根据逻辑视图名解析成物理视图名即具体的页面地址，**再生成`View`视图对象，最后对`View`进行渲染将处理结果通过页面展示给用户。
- **ModelAndView**:使用`ModelAndView`类用来处理该数据的视图。当控制器处理完请求后，通常控制器将会包含视图名称以及一些模型属性的`ModelAndView`对象返回给`DispatcherServlet`.



### 工作流程

**介绍完组件的功能后，接着来梳理一下 `SpringMVC` 工作流程。**

1. 用户向服务器发送请求至前端控制器 `DispatcherServlet`。
2. `DispathcherServlet `调用 `HandlerMapping`，由此得知由哪个` Handler(Controller)`来处理该请求。
3. `HandlerMapping `找到具体的处理器，生成处理器对象及处理器拦截器一并返回给 `DispathcherServlet`。
4. `DispathcherServlet `调用 `HandlerAdapter `。
5. `HandlerAdapter `经过适配调用具体的 `Handler`，也叫做控制器（`Controller`）。
6. `Handler `处理完请求后返回 `ModelAndView `。
7. `HandlerAdapter `将后端处理器的结果 `ModelAndView `反馈给 `DispathcherServlet`。
8. `DispathcherServlet `将 `ModelAndView `传给 视图解析器 `ViewResolver `。
9. `ViewResolver `根据 `ModelAndView `中的视图名称返回具体的 `View `。
10. `DispathcherServlet `将 `ModelAndView `中的模型数据填充到视图中，渲染视图。
11. `DispathcherServlet `将结果响应给用户。

> 用户向服务器发送请求给前端控制器，前端控制器收到请求之后调用处理映射器得到该请求由那个处理器进行处理，结果反馈给前端控制器，前端控制器再将该结果发给控制适配器，调用具体的处理器处理(`Controller`)并返回一个`MV`，处理器将该`MV`模型返回给前端控制器，前端控制器得到之后调用视图解析器解析该模型，完了得到一个视图`view`，再将该视图通过前端页面渲染到浏览器，展现给用户。
