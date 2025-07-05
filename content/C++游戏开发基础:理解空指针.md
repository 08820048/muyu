+++
title = "[C++游戏开发基础]:理解空指针"
date = 2025-06-19
tags = ["C++", "游戏开发", "空指针", "nullptr"]
description = "详细讲解C++中空指针的概念、检测方法、安全使用及在游戏开发中的错误处理"
+++



除了指向内存地址外,指针还可以指向一个空值(`null`),空值是一个特殊的值,可以理解为没有值。当一个指针持有空值时,意味着该指针没有指向任何东西,这样的指针被称为**空指针**!

创建空指针最简单的方法是使用值进行初始化:

```cpp
int main()
{
  int* ptr {}; // PTR现在是一个无效的指针，没有持有地址
  int* ptr1 = nullptr; // 等效的空指针初始化
  return 0;
}
```

因为我们可以使用赋值来改变指针所指向的内容，所以最初设置为 null 的指针后来可以被改变，指向一个有效的对象：

```cpp
int main()
{
    int* ptr = nullptr; // 初始化一个空指针
    int x {5};
    ptr = &x;
    std::cout << *ptr << '\n';
    
    return 0;
}
```

---

## nullptr关键字

与关键字 `true` 和 `false` 表示布尔字面值类似，`nullptr `关键字表示空指针字面值。我们可以使用 `nullptr` 来显式初始化或分配一个指针为空值。

```cpp
int main()
{
    int* ptr { nullptr }; // 可以使用 nullptr 将指针初始化为 null 指针

    int value { 5 };
    int* ptr2 { &value }; // ptr2 是一个有效的指针，指向 value
    ptr2 = nullptr; // 可以将 nullptr 赋给指针，来将指针变为 null 指针

    someFunction(nullptr); // 我们也可以将 nullptr 作为参数传递给需要指针类型的函数

    return 0;
}
```

> 当需要为初始化、赋值或将空指针传递给函数时,最佳实践是使用`nullptr`

---

## 解引用空指针

和解引用野指针导致的为定义行为类似,对空指针解引用也会出现为定义行为。在大多数情况下,它会导致你的应用程序崩溃。以下程序可以帮你加深理解:

```cpp
int main()
{
    int* ptr = {};
    std::cout << *ptr << '\n';
    
    
    return 0;
}
```

![image-20250219183518231](https://images.waer.ltd/notes/202502191835430.png)

这也是作为C++开发者最常见的错误之一,也就是意外的解引用野指针和空指针导致的程序崩溃。因此:

> 无论何时使用指针,都需要格外的关注这一点,确保你的代码没有解引用空指针或者悬空指针,这会导致为定义行为,进而使得应用程序崩溃,一旦程序崩溃导致严重线上问题,那么你的领导可能就用‘C’语言和你交流了。

---

## 空指针的检查

我们可以使用条件来测试指针是否为`nullptr`:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int* ptr { &x };

    if (ptr == nullptr) 
        std::cout << "ptr is null\n";
    else
        std::cout << "ptr is non-null\n";

    int* nullPtr {};
    std::cout << "nullPtr is " << (nullPtr==nullptr ? "null\n" : "non-null\n"); 

    return 0;
}
```

类似于0隐式转换为`false`,非0整数转为`true`一样,指针也会隐式转会为布尔值,空指针转换为布尔值的`false`,非空指针则是转为`true` ,基于这个规则,我们就可以简化上面代码中的条件判断写法:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int* ptr { &x };

    // 指针在为空时会转换为布尔值 false，非空时会转换为布尔值 true
    if (ptr) // 隐式转换为布尔值
        std::cout << "ptr is non-null\n";
    else
        std::cout << "ptr is null\n";

    int* nullPtr {};  // nullPtr 初始化为 nullptr
    std::cout << "nullPtr is " << (nullPtr ? "non-null\n" : "null\n"); // 隐式转换为布尔值

    return 0;
}
```

> ⚠️条件语句只能用来区分空指针和非空指针。没有便捷的方法可以判断一个非空指针是指向有效对象还是悬空（指向无效对象）。

---

## 避免悬空指针

解引用一个空指针或悬空指针将导致未定义行为。因此，我们需要确保我们的代码不做这两件事情之一。

我们可以通过使用条件语句来确保在尝试解引用之前指针不是空指针，从而轻松避免解引用空指针：

```cpp
if (ptr) 
  // todo
else
  // todo
```

那么对于悬空指针怎么处理?因为没有办法检测一个指针是否为悬空指针,因此,一个有效的方法就是在写每一行代码时,尽可能避免存在任何悬空指针,通过确保任何不指向有效对象的指针都将它设置为`nullptr`来做到这一点。

> 最佳实践:一个指针应该持有有效对象的地址，或者设置为 nullptr。这样我们只需要测试指针是否为空，并且可以假设任何非空指针都是有效的。

当一个对象被销毁时，指向该已销毁对象的任何指针将悬空（它们不会自动设置为 `nullptr` ）。检测这些情况并确保这些指针随后被设置为 `nullptr` 是程序猿的责任。

---

## 0和NULL

在某些老版本代码中,你看会看到使用 0或者NULL这俩字面值来替代`nullptr`的情况。

```cpp
int main()
{
    float* ptr { 0 };  // ptr 现在是一个空指针（只是举个例子，实际中不要这样做）

    float* ptr2; // ptr2 是未初始化的
    ptr2 = 0; // ptr2 现在是一个空指针（只是举个例子，实际中不要这样做）

    return 0;
}
```

此外,还有一个就是`NULL`的预处理宏。这个宏是从`C`语言中继承来的,在C中通常用于表示空指针。

```cpp
#include <cstddef> // 引入 NULL，NULL 是一个宏定义，表示空指针

int main()
{
    double* ptr { NULL }; // ptr 是一个空指针

    double* ptr2; // ptr2 是未初始化的
    ptr2 = NULL; // ptr2 现在是一个空指针

    return 0;
}
```

> 现在C++中应该避免使用上面两个字面值来表示空指针;

---

## 优先使用引用而非指针

**指针和引用都允许我们间接地访问其他对象。**

指针具有额外的功能，可以改变它们指向的对象，并且可以指向空（`null`）。然而，这些指针的功能也本质上是危险的：空指针有可能被解引用，而改变指针指向的对象会更容易导致悬空指针的产生：

```cpp
int main()
{
    int* ptr { };

    {
        int x{ 5 };
        ptr = &x; // 将指针指向一个会被销毁的对象（引用无法做到这一点）
    } // ptr 现在是悬空指针，指向了一个无效的对象

    if (ptr) // 条件语句返回 true，因为 ptr 不是 nullptr
        std::cout << *ptr; // 解引用悬空指针，导致未定义行为

    return 0;
}
```

引用不能像指针那样指向空（nullptr）。每次引用必须在创建时绑定到一个有效的对象，而且不能后期修改为引用另一个对象。因此，空引用的问题不会出现，也避免了因引用指向无效对象而导致的错误。

由于引用的绑定性和不可重新绑定的特性，使得引用相较于指针更安全。在大多数情况下，引用提供了更简洁、更安全的方式来访问对象，不会轻易出现如空引用、悬空引用等问题;

看个例子:

``` cpp
int main() {
    int x = 10;
    int& ref = x; // 引用ref绑定到x

    std::cout << ref << std::endl; // 输出10

    // 下面这行代码将会报错，因为引用无法绑定为空
    // int& nullRef = nullptr; // 错误：不能将引用绑定到nullptr

    return 0;
}
```

- 在这个示例中，`int& ref = x;` 是将 `ref` 绑定到 `x`。引用总是绑定到一个有效对象。

- 如果尝试使用 `nullptr` 来初始化引用，如 `int& nullRef = nullptr;`，会导致编译错误。因为引用不能指向空`（null），这就消除了空引用的风险。

```cpp
int add(int& a, int& b) {
    return a + b;
}

int main() {
    int x = 5;
    int y = 10;

    // 引用更加安全，因为它无法为null，也不会悬空
    std::cout << add(x, y) << std::endl; // 正常工作，输出15

    // 使用指针时需要显式地处理空指针的情况
    int* ptr1 = nullptr;
    int* ptr2 = &x;

    if (ptr1 && ptr2) {
        std::cout << *ptr1 + *ptr2 << std::endl; // 可能崩溃，因为ptr1是空指针
    }

    return 0;
}
```

在 `add` 函数中，我们使用引用来传递 `a` 和` b`。引用的好处是，我们不需要检查指针是否为空，引用始终绑定到有效的对象。

- 如果我们使用指针（如 `ptr1` 和 `ptr2`），我们必须显式检查指针是否为` nullptr`，否则可能会发生崩溃或未定义行为。

- 引用避免了这种额外的检查，使得代码更加简洁和安全。

所以:**由于引用更安全，应该优先使用引用而非指针，除非指针提供的额外功能是必须的。**

> 感谢阅读,欢迎指正!