+++
title = "O操作符,实现枚举的输入输出"
date = 2024-04-28
tags = ["C++", "操作符重载", "枚举", "输入输出", "编程技巧"]
description = "详细介绍如何在C++中重载输入输出操作符来实现枚举类型的输入输出功能，提升代码的可读性和易用性。"
+++

在上一篇关于枚举的文章[[通俗易懂C++]:枚举篇一,无范围枚举](https://www.ilikexff.cn/articles/154)中,我们提到了一个例子,使用一个函数将枚举转换为等效字符串的方法:

```cpp
#include <iostream>
#include <string_view>

enum Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    constexpr Color shirt{ blue };

    std::cout << "Your shirt is " << getColorName(shirt) << '\n';

    return 0;
}
```

尽管上面的例子可以正常实现需求,但存在一些不足:

- 我们必须记住创建的函数名称;
- 每次输出时必须调用这样一个函数才能打印我们需要的枚举字符串,这会给单纯的输出语句造成混乱。

一种比较理想的情况是,如果我们可以使用像系统提供的`std::cout<<`类似的方法来输出枚举,岂不是美滋滋?

---

## 操作符重载简介

在C++中,使用函数重载,我们可以创建一个同名函数的变体,这些变体可以处理不同的数据类型,而不必为每一个变体起一个唯一的名称。

类似地,C++也支持运算符的重载, 这允许我们定义现有运算符的重载格式,以便于我们可以使这些运算符与我们的程序定义的数据类型一起工作。

需要注意的是,这里暂不会详细介绍运算符的重载,更详细的内容也许会在后面的文章中介绍。

基本的运算符重载相当简单:

- 使用运算符的名称来作为函数名称定义函数。
- 为每一个运算符添加适当类型的参数(从左到右的顺序)。其中一个参数必须是用户定义的类型(比如类类型或者枚举类型),否则编译器会出错。
- 返回类型可以设置为任何有意义的类型。
- 使用`return`返回运算结果。

> 当编译器在表达式中遇到对应的运算符并且存在一个或者多个操作数是用户定义的类型时,编译器会检查是否存在一个重载的运算符来解析该调用。例如,对于表达式`x+y`,编译器会使用函数重载解析来查看是否存在一个`operator+(x, y)`函数来实现该操作。如果能找到一个唯一性的`operator+`函数,那它就会被调用并将结果作为返回值返回。

---

## 重载`<<`运算符打印枚举

在正片开始之前,我们先快速回顾一下运算符<<在被用于输出时的工作方式。

考虑像`std::cout << 10`这样的简单输出表达式。其中的`std::cout`的类型为`std::ostream`(标准库中的用户定义类型),而10是`int`基本数据类型。

在计算这个表达式时,编译器将查找可以处理`std：：ostream`和`int`类型参数的`operator<<`重载函数。由于这个函数确实在I/O标准库中实现了,所以它将会被 调用。在该函数中,这个`std::cout`用于将x输出到控制台,最后,`operator<<`函数返回其左操作数（在本例中为`std：：cout`），以便于支持链式调用。

基于此,让我们实现一个`operator<<`的重载来打印`Color`：

```cpp
#include <iostream>
#include <string_view>

enum Color
{
	black,
	red,
	blue,
};

constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}
// operator<< 如何打印 Color 类型
// 返回类型和参数类型是引用（以防止创建副本）
std::ostream& operator<<(std::ostream& out,Color color)
{
    return out << getColorName(color);
};

int main()
{
    Color shirt {blue};
    std::cout <<"Your shirt is " << shirt << '\n';

    return 0;
 }
```

![image-20250311150019525](https://images.waer.ltd/notes/202503111501353.png)

让我们稍微解析一下这个重载的运算符函数。

- 首先，函数的名称是 `operator<<`，因为我们正在重载 `<<` 运算符。`operator<<` 有两个参数。
- 左侧的参数（与左操作数匹配）是我们的输出流，类型为 `std::ostream`。我们使用 **非 const 引用** 传递它，因为我们不希望在调用函数时复制 `std::ostream` 对象。右侧的参数（与右操作数匹配）是我们的 `Color`枚举类型对象。

> 当我们使用 std::ostream 输出操作时，例如通过 << 运算符写入数据到输出流时，std::ostream 对象的内部状态会发生变化。例如，数据可能会被存入缓冲区或修改流的状态（如错误标志）。为了在调用者中看到这些变化，必须传递非 const 引用，而不是复制或常量引用。因为输出操作会修改这个流的内部状态，所以我们需要它是可修改的。

回过来看看我们的实现,本质上就是使用`std::ostream`对象使用操作符`<<`来打印一个`std：：string_view`。所以`out << getColorName（color）`只是获取我们的颜色名称作为`std：：string_view`，然后将其打印到输出流。

所以,当我们调用`std：：cout << shirt`时，编译器将看到我们重载了`operator<<`来处理`Color`类型的对象。然后调用重载的`operator<<`函数，使用`std：：cout`作为`out`参数，使用`shirt`变量（值为`blue`）作为`color参数`。由于`out`是对`std：：cout`的引用，而`color`是枚举数`blue`的副本，因此表达式`out << getColorName（color）`将`“blue”`打印到控制台。最后，`out`返回给调用者，便于后续的链式调用。

----

## 重载>>运算符,实现枚举的输入

类似于上面重载`<<`输出枚举一样,下面是对枚举输入的重载实现:

```cpp
#include <iostream>
#include <limits>
#include <optional>
#include <string>
#include <string_view>

// 定义一个枚举类型 Pet，表示不同的宠物
enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

// 这个函数根据 Pet 枚举值返回对应的宠物名称
constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???"; // 未知的宠物类型
    }
}

// 这个函数根据字符串返回对应的 Pet 枚举值，如果找不到匹配项，返回 std::nullopt
constexpr std::optional<Pet> getPetFromString(std::string_view sv)
{
    if (sv == "cat")   return cat;
    if (sv == "dog")   return dog;
    if (sv == "pig")   return pig;
    if (sv == "whale") return whale;

    return {}; // 返回空值，表示没有找到匹配的 Pet
}

std::istream& operator>>(std::istream& in,Pet& pet)
{
    std::string s {};
    in >> s;
    std::optional<Pet> match {getPetFromString(s)};
    if (match)
    {
        pet = *match;
        return in;
    }

    // 如果输入无效（没有找到匹配项）
    // 将输入流状态设置为失败状态（failbit）
    in.setstate(std::ios_base::failbit);
    return in;
}
int main()
{
    std::cout << "Enter a pet: cat, dog, pig, or whale: ";
       Pet pet{};
       std::cin >> pet; // 读取用户输入

       if (std::cin) // 如果输入有效（找到了匹配项）
           std::cout << "You chose: " << getPetName(pet) << '\n';
       else
       {
           std::cin.clear(); // 重置输入流，使其恢复到可用状态
           std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 忽略剩余输入
           std::cout << "Your pet was not valid\n"; // 提示用户输入无效
       }
    return 0;
 }

```

![image-20250311152402041](https://images.waer.ltd/notes/202503111524108.png)

这里有一些与输出情况的不同之处值得注意。首先，`std：：cin`的类型是`std：：istream`，所以我们使用`std：：istream&`作为左参数和返回值的类型，而不是`std：：ostream&`。其次，`pet`参数是一个非常量引用。这允许我们的运算符`>>`修改右操作数的值，如果我们的提取结果匹配，则传入右操作数。

- 在函数内部，我们使用`operator>>`来输入一个`std：：string`（它已经知道如何做）。如果用户输入的值与我们的一个pet匹配，那么我们可以为`pet`分配适当的枚举数并返回左操作数（`in`）。
- 如果用户没有输入一个有效的pet，那么我们通过将`std：：cin`设置为“failure mode”来处理这种情况。这是提取失败时`std：：cin`通常进入的状态。然后调用者可以检查`std：：cin`以查看提取成功还是失败。

