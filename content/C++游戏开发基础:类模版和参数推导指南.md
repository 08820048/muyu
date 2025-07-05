+++
title = "C++游戏开发基础-类模版和参数推导指南"
date = 2025-06-19
tags = ["C++", "游戏开发"]
description = "详细介绍C++中的类模板参数推导（CTAD）的基本概念、用法及实践技巧。"
+++


考虑下面这样一个问题,假设我们正在编写一个程序,需要处理成对的`int`值.并且需要确定两个数字中的最大值。 

```cpp
#include<iostream>

struct Pair
{
  int first {};
  int second {};

};

constexpr int max(Pair p)
{
  return (p.first < p.second ? p.second : p.first);
}

int main()
{
    Pair p1 {2,4};
    std::cout <<max(p1) <<"is larger\n";

    return 0;
}
```

后来.你那尊贵的狗策划需求一变,需要新增一个`double`类型的Pair,所以你的程序又改成下面这样;

```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

struct Pair 
{
    double first{};
    double second{};
};

constexpr int max(Pair p)
{
    return (p.first < p.second ? p.second : p.first);
}

constexpr double max(Pair p) 
{
    return (p.first < p.second ? p.second : p.first);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    Pair p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n";

    return 0;
}
```

这些代码看起来人畜无害,但其实存在问题:

- 首先，与函数不同，类型定义不能被重载。编译器会将 Pair 的第二个定义视为对第一个 Pair 定义的错误性重新声明。

- 其次，尽管函数可以被重载，但这里的` max(Pair)` 函数仅在返回类型上有所不同，而函数重载不能仅通过返回类型来区分。

- 第三，这里存在大量的冗余。每个 `Pair` 结构体都是相同的（除了数据类型不同），而 `max(Pair)` 函数也是如此（除了返回类型不同）。

基于这个问题,引出了本文的主题,类模版。 

----

## 类模版基本定义

就像函数模板是用于实例化函数的模板定义一样，类模板是用于实例化类类型的模板定义。

> “类类型”指的是` struct、class` 或` union` 类型。尽管我们为了简单起见会在 `struct` 上演示“类模板”，但这里的内容同样适用于 `class`。

现在我们将上面第一个示例代码改写为类模版的形式:

```cpp
#include<iostream>

template<typename T>
struct Pair
{
    T first {};
    T second {};
};

int main()
{
    Pair<int> p1 {4,6};
    std::cout <<p1.first <<' ' << p1.second <<'\n';
    Pair<double> p2 {3.2,5.4};
    std::cout <<p2.first <<' ' << p2.second <<'\n';

    return 0;
}

```

就像函数模版一样,我们用以模版参数声明开始类模版的定义。接下来在`<>`内指定模版将使用的所有模版类型。对于我们需要的每个模板类型，使用关键字 `typename`（首选）或 `class`，后跟模板类型的名称（例如 `T`）。在这种情况下，由于我们的两个成员将是相同的类型，我们只需要一个模板类型。”

在`main`中，我们可以使用我们想要的任何类型来实例化`Pair`对象。首先，实例化一`个Pair<int>`类型的对象。由于`Pair<int>`的类型定义尚不存在，因此编译器使用类模板实例化名为`Pair<int>`的结构类型定义，其中模板类型`T`的所有出现都被类型`int`替换。其他类型同理。

---

## 在函数中使用类模版

对于之前的`max`函数,由于编译器会将`Pair<int>`,`Pair<double>`视为单独的类型,因此我们可以按照参数类型的区分,对该函数进行重载。

```cpp
constexpr int max(Pair<int> p)
{
    return (p.first < p.second) ? p.second : p.first);
}

constexpr double max(Pair<int> p)
{
    return (p.first < p.second) ? p.second : p.first);
}
```

虽然可以正常编译,但是这样并没有解决代码冗余的问题。我们真正想要的是一个可以接受任何类型的函数。换句话说,我们需要一个接受`Pair<T>`类型参数的函数。其中的`T`是模版类型参数。所以暗示的够明显了吧,我们需要一个函数模版来解决这个问题。 

```cpp
#include<iostream>

template<typename T>
struct Pair
{
    T first {};
    T second {};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first < p.second ? p.second : p.first);
}


int main()
{
    Pair<int> p1 {2,4};
    std::cout << max<int>(p1) <<"is larger\n";

    Pair<double> p2 {3.5, 2.5};
    std::cout << max(p2) << "is larger\n";

    return 0;
}
```

`max()` 函数模板的逻辑非常直观。由于我们希望传入一个 `Pair<T>`，我们需要让编译器知道 T 的具体类型。因此，我们需要在函数前面添加 **模板参数声明**，用于定义模板类型 T。

这样，我们就可以在返回类型和 `Pair<T>` 的模板类型中使用 `T`，从而使 `max()` 适用于不同的数据类型。

当`max（）`函数用`Pair<int>`参数调用时，编译器将从函数模板实例化函数`int max<int>（Pair<int>）`，其中模板类型`T`被替换为`int`。下面的代码片段显示了在这种情况下编译器实际实例化的内容：

```cpp
template <>
constexpr int max(Pair<int> p)
{
    return (p.first < p.second ? p.second : p.first);
}
```

> 与所有对函数模板的调用一样，我们可以显式地使用模板类型参数（例如`max<int>（p1）`），也可以隐式地使用（例如`max（p2）`），让编译器使用模板参数推导来确定模板类型参数应该是什么。

---

##  具有模板类型成员和非模板类型成员的类模板

在 **类模板（class templates）** 中，我们不仅可以使用**模板类型参数（template type parameter）**，还可以包含**非模板类型成员（non-template type members）**。这意味着，类中的某些成员可以是通用类型（由模板参数决定），而其他成员可以是固定类型（例如 int、double 等）。

```cpp
template<typename T>
struct Foo
{
  T first {}; // 模版类型
  int second {}; // 非模版类型
}
```

类模版也可以有多个模版类型,例如,如果我们希望`Pair`类的两个成员能够有不同的类型,我们可以用脸肿莫办类型来定义这个类模版。

```cpp
#include <iostream>

template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

template <typename T, typename U>
void print(Pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    Pair<int, double> p1{ 1, 2.3 }; 
    Pair<double, int> p2{ 4.5, 6 }; 
    Pair<int, int> p3{ 7, 8 };      

    print(p2);

    return 0;
}
```

为了定义多个模版类型,在模版参数声明中,我们用逗号分隔每一个所需类型。在上面的例子中,定义了两个不同的模版类型,分别为`T`和`U`,在实际使用时,两个模版类型我们可以随意安排,比如两个不同类型或者两个相同类型都是被允许的。

---

## 模版函数和多个类类型

对于上面的例子,因为我们已经将函数参数显式定义为`Pair<T，U>`，所以只有`Pair<T，U>`类型的参数（或那些可以转换为`Pair<T，U>的`参数）才会匹配。如果我们只希望能够使用`Pair<T，U>`参数调用函数，这是没问题的。

但是在某些情况下,我们希望可以编写一个可以与任何类型一起使用的函数模版,只需要使用类型模版参数作为函数参数即可。

```cpp
#include<iostream>

template<typename T,typename U>
struct Pair
{
    T first {};
    U second {};
};

struct Point
{
    int first {};
    int second {};
};


template<typename T>
void print(T p)
{
    std::cout << p.first <<", " << p.second << "\n";
}


int main()
{

    Pair<double, int> p1{ 4.5, 6 };
    print(p1); // 匹配 print(Pair<double, int>)
    std::cout << '\n';
    Point p2 { 7, 8 };
    print(p2); // 匹配 print(Point)
    std::cout << '\n';
    return 0;
}

```

在上面的例子中，我们重写了`print（）`，使它只有一个类型模板参数（`T`），它将匹配任何类型。对于任何具有`第一`个和`第二个`成员的类类型，函数体都将成功编译。

---

## 标准库中的std::pair

在C++标准库中包含了一个名为`std::pair`的类模版,它的定义与上面我们自己实现的原理相似,所以我们完全可以使用标准库提供的方法替换掉我们自己的实现。

```cpp
#include <iostream>
#include <utility>

template <typename T,typename U>
void print(std::pair<T,U> p)
{
    std::cout <<'[' << p.first << ", " << p.second << ']';
}

int main()
{
    std::pair<int,double> p1 {1,3.0};
    std::pair<double,int> p2 {4.3,2};
    std::pair<int,int> p3 {2,2};
    std::pair<float,double> p4 {3.14,2.71};

    print(p1);
    print(p2);
    print(p3);
    print(p4);

    return 0;
}

```

> 在实际开发中,一般建议直接使用标准库定义的`pair`而不是自己重新实现,除非标准库的实现无法满足需求。

---

## 在多个文件中使用类模版

就像函数模版一样,类模版通常定义在头文件中,因此他们可以在任何需要他们的代码文件中,模版定义和类型定义都不受 **ORD**原则的限制。 

- pair.h

```cpp
#ifndef PAIR_H
#define PAIR_H

template <typename T>
struct Pair 
{
    T first;
    T second;
};
template <typename T>
constexpr T  max(Pair<T> p)
{
    return p.first > p.second ? p.first : p.second;
}

#endif // PAIR_H
```

- foo.cpp

```cpp
#include "pair.h"
#include<iostream>


void foo()
{
    Pair<int> p1{1, 2};
    std::cout << max(p1) << "is large\n";
}

```

- main.cpp

```cpp
#include<iostream>
#include "pair.h"

void foo();
int main()
{
    Pair<double> p2 {1.0, 2.0};
    std::cout <<max(p2)<<"is larger\n";
    
    foo();
    return 0;
}
```

对于上面的程序,如果你是使用命令单独编译的情况下,在编译`main.cpp`的同时务必记得编译`foo.cpp`

```cpp
g++ -std=c++17 -o main main.cpp foo.cpp
```

---

## 模版参数推导

从C++17开始,当从类模版实例化一个对象时,编译器可以从对象的初始化器的类型推导出模版类型,这称为 **模版类型推导**或者简称`CTAD.`

```cpp
#include<utility>

int main()
{
  std::pair<int,int> p1 {1,2};
  std::pair p2 {1,2}; // 这里用到了C++17的自动模版类型推导,不需要显式的声明
  
  return 0;
}
```

值得注意的是,这样的推导是有条件的,只有在没有显式声明模版参数的情况下才会执行。所以,下面两种方式是错误示范:

```cpp
#include<utility>

int main()
{
  std::pair<> p1 {1,2};  // 模板参数太少，两个参数均未推导
  std::pair<int> p2 {3,4}; // 模板参数太少，第二个参数未推导
  
  return 0;
}
```

由于 CTAD（类模板参数推导）是一种类型推导的形式，我们可以使用 **字面量后缀** 来改变推导出的类型：

```cpp
#include <utility> 

int main()
{
    std::pair p1 { 3.4f, 5.6f }; // 推导为 pair<float, float>
    std::pair p2 { 1u, 2u };     // 推导为 pair<unsigned int, unsigned int>

    return 0;
}
```

大多数情况下,`CTAD`可以开箱即用,但是在某些情况下,编译器可能需要一些额外的帮助来理解如何正确推导模版参数。

比如下面的程序,如果你在C++17环境下编译,是无法正常编译成功的。

```cpp
#include<iostream>
#include<utility>

template<typename T,typename U>
struct Pair
{
    T first {};
    U second {};
};

int main()
{
    Pair<int,int> p1 {1,2};
    Pair p2 {2,3};

    return 0;
}
```

比如,我尝试编译这段代码时,就遇到了下面这样的错误提示:

![image-20250316155611729](https://images.waer.ltd/notes/202503161556985.png)

这是因为在C++17中,它不知道如何推导聚合类型的类模版参数,为了解决这个问题,我们需要手动的给编译器提供一个推导指南,它会告诉编译器如何推导给定类模版的模版参数:

```cpp
#include<iostream>
#include<utility>

template<typename T,typename U>
struct Pair
{
    T first {};
    U second {};
};

// 推导指南
template<typename T,typename U>
Pair(T,U) -> Pair<T,U>;


int main()
{
    Pair<int,int> p1 {1,2};
    Pair p2 {2,3};

    return 0;
}

```

关键的代码就两行:

```cpp
template<typename T,typename U>
Pair(T,U) -> Pair<T,U>;
```

- 首先，我们使用与 `Pair` 类中相同的模板类型定义。这是合理的，因为如果我们的 **推导指引（deduction guide）** 要告诉编译器如何为 `Pair<T, U>` 推导类型，我们必须定义 `T` 和` U`（即模板类型）。

- 其次，在箭头 `->` 右侧，我们指定了希望帮助编译器推导出的类型。在本例中，我们希望编译器能够推导出 `Pair<T, U>` 类型的模板参数，因此这里直接写 `Pair<T, U>`。

- 最后，在箭头` ->` 左侧，我们告诉编译器要寻找哪种形式的声明。在本例中，我们指定了 `Pair` 对象的声明，且它接受两个参数（一个是 `T` 类型，另一个是 `U` 类型）。我们也可以写成 `Pair(T t, U u)`，其中 `t` 和` u` 是参数的名称，但由于在推导过程中不需要使用它们，因此可以省略名称。

把所有这些放在一起，我们告诉编译器，如果它看到一个带有两个参数（分别是`T`和`U`类型）的`Pair`声明，它应该推断类型为`Pair<T，U>`。

再看一个类似的例子:

```cpp
// 定义一个模板结构体 Pair，表示一对数据
template <typename T>
struct Pair
{
    T first{};  // 第一个值
    T second{}; // 第二个值
};

// 这是 `Pair` 的一个推导指引（仅在 C++17 及以上版本需要）
// 当 `Pair` 对象用两个 `T` 类型的参数初始化时，推导结果应为 `Pair<T>`
template <typename T>
Pair(T, T) -> Pair<T>;

int main()
{
    Pair<int> p1{ 1, 2 }; // 显式指定类模板 `Pair<int>`（适用于 C++11 及更高版本）
    Pair p2{ 1, 2 };      // 使用类模板参数推导（CTAD），从初始化参数推导 `Pair<int>`（C++17）

    return 0;
}
```

`Pair(T, T) -> Pair<T>;`告诉编译器，当 `Pair` 通过两个相同类型 T 的参数初始化时，`Pair<T>` 应该被推导出来。

例如 `Pair p2{1, 2}`;，编译器会自动推导 `T=int`，最终等价于` Pair<int> p2{1, 2};`。

---

## 带默认值的类型模板参数

就像函数参数可以有默认参数一样，模板参数也可以有默认值。当模板参数没有明确指定并且无法推导时，将使用这些参数。

下面是对上面的`Pair<T，U>`类模板程序的修改，类型模板参数`T`和`U`默认为`int`类型：

```cpp
// 定义一个模板结构体 Pair，T 和 U 默认类型为 int
template <typename T = int, typename U = int> // 默认 T 和 U 都是 int 类型
struct Pair
{
    T first{};  // 第一个值
    U second{}; // 第二个值
};

// 推导指引，帮助编译器推导 Pair(T, U) -> Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;

int main()
{
    Pair<int, int> p1{ 1, 2 }; // 显式指定类模板 `Pair<int, int>`（C++11 及以上）
    Pair p2{ 1, 2 };           // 使用 CTAD 推导 `Pair<int, int>`（C++17）

    Pair p3;                   // 使用默认模板参数 `Pair<int, int>`

    return 0;
}
```

我们对`p3的`定义没有显式地指定类型模板参数的类型，也没有从这些类型推导出的初始化器。因此，编译器将使用默认值中指定的类型，这意味`着p3`将是`Pair<int，int>`类型。

---

当使用**非静态成员初始化**（non-static member initialization）来初始化类类型的成员时，**类模板参数推导（CTAD）** 在这种情况下不会生效。所有的模板参数必须**显式指定**。

```cpp
#include <utility> // for std::pair

struct Foo
{
    std::pair<int, int> p1{ 1, 2 }; // ✅ OK，显式指定模板参数
    std::pair p2{ 1, 2 };           // ❌ 编译错误，CTAD 在非静态成员初始化时不可用
};

int main()
{
    std::pair p3{ 1, 2 };           // ✅ OK，CTAD 在此处可以使用
    return 0;
}
```

**为什么 CTAD 不能用于非静态成员初始化？**

- 非静态成员初始化是在**类定义时**解析的，而 `CTAD` 需要在对象实际创建时推导类型，两者的时机不同。
- 在 `Foo` 定义时，编译器必须确定 `p2` 的完整类型（包括模板参数）。如果没有显式指定模板参数，编译器无法在类定义阶段进行推导。
- `CTAD` 主要用于变量初始化（如 `std::pair p{1, 2};`），而非静态成员初始化并不会直接调用 `CTAD` 规则。

---

> `CTAD` 代表“类模板实参推导”（`Class Template Argument Deduction`），而不是“类模板参数推导”（`Class Template Parameter Deduction`），因此它只会推导模板的实参类型，而不会推导模板的参数。

**CTAD 只能在变量定义时生效**，但不能用于函数参数类型推导。因此,不能在函数中使用`CTAD`:

```cpp
#include <iostream>
#include <utility>

void print(std::pair p) // ❌ 编译错误：CTAD 不能用于函数参数
{
    std::cout << p.first << ' ' << p.second << '\n';
}

int main()
{
    std::pair p { 1, 2 }; // ✅ CTAD 在变量声明时有效，推导为 std::pair<int, int>
    print(p); // ❌ 编译错误

    return 0;
}
```

在这种情况下，应该使用模板来实现:

```cpp
#include <iostream>
#include <utility>

template <typename T, typename U>
void print(std::pair<T, U> p)
{
    std::cout << p.first << ' ' << p.second << '\n';
}

int main()
{
    std::pair p { 1, 2 }; // 推导为 std::pair<int, int>
    print(p);

    return 0;
}
```

