+++
title = "[C++游戏开发基础]:引用返回和地址返回"
date = 2025-06-19
tags = ["C++", "游戏开发", "引用返回", "地址返回"]
description = "详细分析C++中引用返回和地址返回的区别、使用场景及在游戏开发中的性能考量"
+++




在之前的文章中已经提到过,当使用按值传递时会创建参数的一个副本到函数中。对于基本类型（复制成本较低），这是可以的。但对于类类型（如 `std::string` ），复制通常成本较高。我们可以通过使用（const）引用传递（或按地址传递）来避免进行昂贵的复制。

这篇文章主要介绍一些在关于使用引用返回和地址返回的基础知识。

下面是一个使用引用返回的程序:

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() // 返回一个常量引用
{
    static const std::string s_programName { "Calculator" }; // 具有静态存储期，在程序结束时销毁

    return s_programName;
}

int main()
{
    std::cout << "This program is named " << getProgramName();

    return 0;
}
```

---

## 返回引用的对象必须在函数返回后存在

使用引用返回有一个重要的注意事项:程序员必须确保被引用的对象在返回引用的函数之后仍然存在,否则将会出现返回的引用悬空的情况(引用一个已被销毁的对象),使用该引用会导致为定义行为。 

在上面的程序中,因为 `s_programName` 使用了`static`关键字修饰,具有静态持续时间，它的生命周期 `s_programName` 将存在到程序结束。当 `main()` 访问返回的引用时，它实际上是在访问 `s_programName` ，这是可以的，因为 `s_programName` 不会在之后被销毁。

现在让我们修改上述程序，以展示当我们的函数返回一个悬垂引用时会发生什么：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName()
{
    const std::string programName { "Calculator" }; // 现在是一个非静态局部变量，在函数结束时销毁

    return programName;
}

int main()
{
    std::cout << "这个程序的名称是 " << getProgramName(); // 未定义行为

    return 0;
}
```

程序的结果未定义。当 `getProgramName()` 返回时，返回一个绑定到局部变量 `programName` 的引用。然后，因为 `programName` 是一个具有自动持续时间的局部变量，所以在函数结束时销毁 `programName` 。这意味着返回的引用现在是悬垂的，在 `main()` 函数中使用 `programName` 会导致未定义的行为。

> 对象通过引用返回时必须超出返回引用的函数的作用域,否则将会产生悬空引用。不要通过引用返回非静态的局部变量或者临时变量。

---

## 临时对象的生命周期延长（lifetime extension）机制，不能跨越函数边界生效。

**临时对象:**

- 临时对象是在表达式求值过程中创建的，但没有名字的对象。
- 例如，`std::string("Hello")` 会创建一个临时的 `std::string` 对象。

**lifetime extension:**

- 在某些特定情况下,C++编译器会延长临时对象的生命周期,以避免悬空引用;

考虑下面这个返回临时变量的引用的例子:

```cpp
#include <iostream>

const int& returnByConstReference()
{
    return 5; // 返回临时对象的常量引用
}

int main()
{
    const int& ref { returnByConstReference() };

    std::cout << ref; // 未定义行为

    return 0;
}
```

在上述程序中， `returnByConstReference()` 返回一个整型字面量，但函数的返回类型是 `const int&` 。这导致创建并返回一个绑定到包含值 5 的临时对象的临时引用。

由于 `returnByConstReference()` 返回的是临时对象的引用，而临时对象在函数返回后立即被销毁，因此 `ref` 变成了一个悬空引用（dangling reference）。

> 当你在一个函数内部创建一个临时对象，并返回该临时对象的引用时，这个引用在函数外部使用时，其引用的对象可能已经被销毁，从而导致未定义行为。

所谓的函数边界指的是函数的开始和结束。在函数内部创建的局部变量和临时对象，在函数结束时通常会被销毁。换句话说,如果你在一个函数中创建了一个临时对象，并返回了对它的引用，那么不要期望这个引用在函数外部仍然有效。因为临时对象的生命周期在函数结束时就结束了。

---

## 不要通过引用返回非`const`静态局部变量

在第一个实例中,通过引用返回一个 const 静态局部变量，以简单的方式说明通过引用返回的机制。然而，通过引用返回非 const 静态局部变量相当不规范，通常应避免。

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 }; // 注意：变量是非 const 的
    ++s_x; // 生成下一个 id
    return s_x; // 并返回它的引用
}

int main()
{
    const int& id1 { getNextId() }; // id1 是一个引用
    const int& id2 { getNextId() }; // id2 是一个引用

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

> 22

程序之后后打印22,这是因为id1和id2引用的是同一个对象静态变量 `s_x` ），所以当任何内容（例如 `getNextId()` ）修改该值时，所有引用现在都访问的是修改后的值。

此示例可以通过将 `id1` 和 `id2` 设置为普通变量（而不是引用）来修复，这样它们将保存返回值的副本而不是 `s_x` 的引用。

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 };
    ++s_x;
    return s_x;
}

int main()
{
    const int id1 { getNextId() }; // id1 现在是一个普通变量，并接收 getNextId() 通过引用返回的值的拷贝
    const int id2 { getNextId() }; // id1 现在是一个普通变量，并接收 getNextId() 通过引用返回的值的拷贝

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

在上面的示例中， `getNextId()` 返回一个引用，但 `id1` 和 `id2` 是非引用变量。在这种情况下，返回的引用的值被复制到普通变量中。因此，这个程序打印：

> 12

---

## 通过引用返回引用参数

如果一个参数是通过引用传递给函数的，那么安全地通过引用返回该参数是没什么问题的,但是为了将一个参数传递给函数，该参数必须在调用者的作用域中存在。

```cpp
#include <iostream>
#include <string>

// 接受两个 std::string 对象，返回按字母顺序排列时较小的那个
const std::string& firstAlphabetical(const std::string& a, const std::string& b)
{
    return (a < b) ? a : b; // 使用 operator< 进行字典序比较，确定哪个字符串在前
}

int main()
{
    std::string hello { "Hello" };
    std::string world { "World" };

    std::cout << firstAlphabetical(hello, world) << '\n'; // 输出按字母顺序排列时较小的字符串

    return 0;
}
```

> Hello

如果我们使用按值传递和按值返回，我们将为 std::string 创建多达 3 个副本（每个参数一个，返回值一个）。通过使用按引用传递/按引用返回，我们可以避免这些副本。

---

## 可以将通过 const 引用传递的右值以 const 引用返回。

当一个 const 引用的参数是一个 rvalue 时，仍然可以通过 const 引用返回该参数。这是因为右值直到它们被创建的表达式结束才会被销毁。

```cpp
#include <iostream>
#include <string>

std::string getHello()
{
    return "Hello";
}

int main()
{
    const std::string s{ getHello() };

    std::cout << s;

    return 0;
}
```

在这种情况下， `getHello()` 返回一个 `std::string` 的值，这是一个右值。然后使用这个右值来初始化 `s` 。在初始化 `s` 之后右值被销毁。

---

## 调用者通过引用修改值

当一个参数通过非const引用传递给函数时,函数可以使用该引用来修改参数的值。同样,当从函数返回一个非const引用时,调用者可以使用该引用来修改返回的值。

```cpp
#include <iostream>

int& max (int& a,int& b)
{
    return (a > b) ? a : b;
}

int main()
{
    int a{ 4 };
    int b{ 10 };

    max(a, b) = 7; 

    std::cout << a << b << '\n';

    return 0;
}
```

函数最后将会打印:4 7

---

## 返回地址

地址返回几乎与引用返回相同，只是返回的是对象的指针而不是对象的引用。返回地址的方式与通过引用返回有相同的注意事项——通过地址返回的对象必须比返回地址的函数的作用域长，否则调用者将收到一个悬空指针。

地址返回比引用返回的主要优势是，如果没有有效的对象返回，我们可以让函数返回 `nullptr` 。例如，假设我们有一个学生列表，我们想要在列表中搜索。如果我们找到了我们正在寻找的学生，我们可以返回一个指向表示匹配学生的对象的指针。如果没有找到匹配的学生，我们可以返回 `nullptr` 来表示未找到匹配的学生对象。

> 感谢阅读,欢迎指正!



 

