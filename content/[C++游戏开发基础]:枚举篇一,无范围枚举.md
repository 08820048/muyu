
+++
title = "C++游戏开发基础-枚举篇一：无范围枚举"
date = 2025-06-19
tags = ["C++", "游戏开发"]
description = "详细介绍C++中的无范围枚举（unscoped enumeration）的基本概念、用法及最佳实践。"
+++


正片开始,假设你正在编写一个程序,需要用到一组颜色,并且在只有基本类型可用的情况下,你该如何去实现这一点?

其中一种做法是,我们可以将颜色存储为整数值,并用某种映射关系来说明每一个整数代表的颜色;比如:

```cpp
int main()
{
  int appleColor {0}; // 定义苹果为0 代表红色
  int shirtCOlor {1}; // 定义衬衫为1 代表绿色
  
  return 0;
}
```

严格来说,这样的做法并没有什么错误之处,但是从程序的最佳实践上说,这样的做法并不直观,并且还用到了魔法数,不论是在C++还是其他编程语言中,尽可能避免在程序中使用魔法数字,这不是一个值的推荐的写法,因此,我们可以使用符号常量来对上面的写法进一步的优化,达到消除魔法数的目的:

```cpp
`constexpr int red {0};
constexpr int green {1};
constexpr int blue {2};

int main()
{
  int appleColor {red};
  int shirtColor {green};
  
  return 0;
}
```

ok ,虽然这样写稍微好读一些，但程序员仍然需要推断 `appleColor` 和` shirtColor`（它们是 int 类型）应该保存颜色符号常量集合中的某个值（这些常量可能在其他地方定义，可能在一个单独的文件中）。

基于此,我们可以使用类型别名来进一步优化,使得这个程序更加清晰一点;

```cpp
using Color = int; // 定义一个名为颜色的类型别名

constexpr Color red{ 0 };
constexpr Color green{ 1 };
constexpr Color blue{ 2 };

int main()
{
    Color appleColor{ red };
    Color shirtColor{ green };

    return 0;
}
```

阅读这段代码的人仍然需要理解这些颜色符号常量是与 Color 类型的变量一起使用的，但至少现在这个类型有一个独特的名字，这样如果有人搜索 Color，就能够找到相关的符号常量集合了。

但是这并不完美,依旧存在问题,因为Color只是int的别名,那么我们依旧可以像下面这样做;

```cpp
Color otherColor {10};
```

此外,当我们使用调试器来调试程序时,对于这些变量,我们只能看到我们用来表示某种颜色的整数值,而不是更加直观形象的颜色符号意义,如`red`,这可能会使得我们更加难以判断程序是否正确。

---

## 枚举

就上面讨论的内容,非常比特否的是,C++给我们提供了一种相对完美的解决方案,那就是使用枚举实现。

枚举也称为枚举类型(enum),是一种复合数据类型,其值被限制为一组命名的符号常量(枚举器);

C++中枚举分为范围枚举和无范围枚举,本文即将先介绍的是无范围枚举。

---

### 无范围枚举

无范围枚举是通过`enum`关键字来定义的。 

枚举类型最好通过例子来讲解,所以我们还是基于前面讨论的颜色定义的例子来定义一个无范围枚举,并存储一些颜色。

```cpp
// 定义枚举类型
enum Color
{
    red,
    green,
    blue,
};

int main()
{
    Color apple {red};
    Color shirt {green};
    Color cup {blue};
    Color socks {yellow}; // 错误：白色不是颜色的枚举
    Color hat {2}; // 错误: 2不是颜色的枚举者
  
    return 0;
}
```

上面的程序中,我们使用了`enum`关键字来定义了一个名为`Color`的枚举。 大括号内定义了几种`Color`类型的枚举项,每一项都是枚举类型,之间用逗号分隔,注意,尽管最后一项的枚举项后的逗号不是必须的,但是建议也加上,良好的编码习惯是非常重要的,而这些习惯不应该作为单独的课程来学习,而是在每一次编码时都刻意的去保持这种习惯,只有这样,日复一日后,不论何时何地,你所留下的每一行代码,都堪比徐志摩的诗!!!!

在 `main()` 中，我们实例化了三个变量，类型为 `Color` ： `apple` 被初始化为颜色 `red` ， `shirt` 被初始化为颜色 `green` ， `cup` 被初始化为颜色 `blue` 。为这些对象分配了内存。请注意，枚举类型初始化器必须是该类型定义的枚举项之一。变量 `socks` 和 `hat` 会导致编译错误，因为初始化器 `yellow` 和 `2` 不是 `Color` 的枚举项。

> 枚举器是隐式`constexpr`的。

---

###  命名枚举和枚举元素

按照惯例,枚举类型的名字以大写字母开头(所有程序定义的类型都是如此)。

> 尽管在语义上,枚举可以不需要命名,但是在现代C ++中应该避免使用无名枚举。

枚举器必须给出名称。不幸的是，目前来说并没有通用的枚举器命名约定。

下面是一些常见的命名风格选择:

- 以小写字母开头（例如 red）
- 以大写字母开头（Red）
- 全部大写（RED）
- 以前缀开头的大写字母（COLOR_RED）
- 或以“k”开头并采用间断大写（kColorRed）

> 个人比较倾向于小写字母开头的风格,当然,你可以选择一个自己喜欢的风格,一旦风格确定,尽可能在程序中保持一致,不建议在一个项目或者程序中同时使用多种风格的命名。

**一些命名建议:**

- 现代C++规范通常建议避免使用全大写字母的命名约定,因为全大写字母通常用于预处理器宏,并且可能会产生冲突。
- 建议避免使用大写字母开头的命名约定,因为大写字母开头的名称通常保留给程序定义的类型。

**最佳实践**

> 将枚举类型命名为首字母大写的名称。将枚举项命名为首字母小写的名称。

---

有一个点需要了解的是,你创建的每个枚举类型都被认为是不同的类型，这意味着编译器可以将其与其他类型区分开来（与 `typedef` 或类型别名不同，它们被认为与它们所别名的类型没有区别）。

因为枚举类型是独立的，属于一个枚举类型的枚举器不能用于另一个枚举类型的对象：

```cpp
enum Pet
{
    cat,
    dog,
    pig,
    whale,
};

enum Color
{
    black,
    red,
    blue,
};

int main()
{
    Pet myPet { black }; // 编译错误:black枚举项不属于Pet枚举类型
    Color shirt { pig }; // 同理

    return 0;
}
```

### 使用枚举类型

因为枚举器具有描述性，它们有助于增强代码文档和可读性。当您有一组相关的常量，并且对象每次只需要存储其中一个值时，使用枚举类型最为合适。

下面是一些常见的枚举使用例子:

```cpp
enum DaysOfWeek
{
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
};

enum CardinalDirections
{
    north,
    east,
    south,
    west,
};

enum CardSuits
{
    clubs,
    diamonds,
    hearts,
    spades,
};
```

有时函数会返回一个状态码给调用者，以指示函数是否执行成功或遇到错误。传统上，使用不同的负小数值来表示可能的错误码。例如：

```cpp
int readFileContents()
{
    if (!openFile())
        return -1; // error 1
    if (!readFile())
        return -2; // error 2
    if (!parseFile())
        return -3; // error 3

    return 0; // success
}
```

然而,前面已经说过,使用魔法数字并不是最佳的选择,这里更推荐的方法是使用枚举类型:

```cpp
enum FileReadResult
{
    readResultSuccess,
    readResultErrorFileOpen,
    readResultErrorFileRead,
    readResultErrorFileParse,
};

FileReadResult readFileContents()
{
    if (!openFile())
        return readResultErrorFileOpen;
    if (!readFile())
        return readResultErrorFileRead;
    if (!parseFile())
        return readResultErrorFileParse;

    return readResultSuccess;
}
```

然后调用者可以将函数的返回值与相应的枚举值进行比较，这种方式比直接测试返回结果是否为特定整数值更容易理解。

```cpp
if (readFileContents() == readResultSuccess)
{
    // do something
}
else
{
    // print error message
}
```

枚举类型也可以在游戏中有很好的应用(后续会持续更新游戏开发领域的文章)，用于标识不同类型的物品、怪物或地形。基本上，任何小规模的相关对象都可以。

例如:

```cpp
enum ItemType
{
	sword,
	torch,
	potion,
};

int main()
{
	ItemType holding{ torch };

	return 0;
}
```

枚举类型在用户需要在两个或多个选项中做出选择时，也可以作为有用的函数参数：

```cpp
enum SortOrder
{
    alphabetical,         // 按字母顺序
    alphabeticalReverse,  // 按字母逆序
    numerical,            // 按数值顺序
};

void sortData(SortOrder order)
{
    switch (order)
    {
        case alphabetical:
            // 按字母顺序正向排序数据
            break;
        case alphabeticalReverse:
            // 按字母顺序反向排序数据
            break;
        case numerical:
            // 按数值顺序排序数据
            break;
    }
}
```

枚举也可以用来定义一组相关的位标志位置，以便与 `std::bitset` 一起使用。

```cpp
#include <bitset>
#include <iostream>

namespace Flags
{
    enum State
    {
        isHungry,   // 是否饥饿
        isSad,      // 是否悲伤
        isMad,      // 是否生气
        isHappy,    // 是否开心
        isLaughing, // 是否大笑
        isAsleep,   // 是否睡着
        isDead,     // 是否死亡
        isCrying,   // 是否哭泣
    };
}

int main()
{
    std::bitset<8> me{}; // 创建一个 8 位的 bitset，初始值为 0 (所有状态均为 false)
    me.set(Flags::isHappy);    // 设置“开心”状态为 true
    me.set(Flags::isLaughing); // 设置“大笑”状态为 true

    std::cout << std::boolalpha; // 将布尔值以 true/false 形式输出

    // 查询一些状态 (使用 test() 函数查看指定位是否为 true)
    std::cout << "I am happy? " << me.test(Flags::isHappy) << '\n';       // 是否开心？
    std::cout << "I am laughing? " << me.test(Flags::isLaughing) << '\n'; // 是否大笑？

    return 0;
}
```

---

### 无范围枚举的作用域

无作用域枚举之所以这样命名，是因为它们将其枚举器名称放置在与枚举定义本身相同的作用域中（而不是像命名空间那样创建一个新的作用域区域）。

```cpp
enum Color // 该枚举 (enum) 定义在全局命名空间中
{
    red,   // 因此 red 被放入全局命名空间中
    green, // 同理，green 也在全局命名空间中
    blue,  // blue 也一样
};

int main()
{
    Color apple { red }; // 我的苹果是红色的 (直接使用 red，没有命名空间限定)

    return 0;
}
```

枚举在全局作用域中定义。因此，所有枚举名称（ `red` 、 `green` 和 `blue` ）也进入全局作用域。这会污染全局作用域，并显著增加命名冲突的可能性。

这一后果是，枚举名在同一作用域内不能在多个枚举中使用：

```cpp
enum Color
{
    red,
    green,
    blue, // blue 被放入全局命名空间中
};

enum Feeling
{
    happy,
    tired,
    blue, // 错误: 与上面的 blue 命名冲突
};

int main()
{
    Color apple { red }; // 我的苹果是红色的
    Feeling me { happy }; // 我现在很开心（尽管我的程序无法编译）

    return 0;
}
```

在上面的示例中，两个未限定的枚举（ `Color` 和 `Feeling` ）将同名的枚举项 `blue` 放到了全局作用域中。这导致了命名冲突，并产生了编译错误。

无范围的枚举也为枚举器提供了一个命名作用域区域（就像命名空间为内部声明的名称提供一个命名作用域区域一样）。这意味着我们可以按照以下方式访问无范围枚举的枚举器：

```cpp
enum Color
{
    red,
    green,
    blue, // blue 被放入全局命名空间中
};

int main()
{
    Color apple { red };          // 可以，直接从全局命名空间访问枚举器 red
    Color raspberry { Color::red }; // 也可以，从 Color 枚举作用域中访问枚举器 red

    return 0;
}
```

但是大多数情况下，未限定的枚举元素不使用作用域解析运算符来访问。

---

### 避免枚举项命名冲突

防止未限定作用域枚举命名冲突有很多常见的做法;

一种是将每个枚举项都以前缀的形式加上枚举本身的名称:

```cpp
enum Color
{
    color_red,
    color_blue,
    color_green,
};

enum Feeling
{
    feeling_happy,
    feeling_tired,
    feeling_blue, 
};

int main()
{
    Color paint { color_blue };
    Feeling me { feeling_blue };

    return 0;
}
```

尽管这种做法还是有空间污染的情况,但是大大减少了命名冲突的几率;

更好的选择是将枚举类型放在一个提供独立作用域区域的结构中，例如命名空间：

```cpp
namespace Color
{
    // 名称颜色，红色，蓝色和绿色是在命名空间颜色内定义的
    enum Color
    {
        red,
        green,
        blue,
    };
}

namespace Feeling
{
    enum Feeling
    {
        happy,
        tired,
        blue, // 由于命名空间不同,这里的blue和Color中的blue不会产生冲突
    };
}

int main()
{
    Color::Color paint{ Color::blue };
    Feeling::Feeling me{ Feeling::blue };

    return 0;
}
```

**最佳实践**

> 尽量将枚举放在命名的作用域区域（例如命名空间或类）中，以防止枚举器污染全局命名空间。

---

### 枚举值的比较

我们可以使用相等运算符（ `operator==` 和 `operator!=` ）来测试某个枚举是否具有特定枚举项的值。

```cpp
#include <iostream>

enum Color
{
    red,
    green,
    blue,
};

int main()
{
    Color shirt{ blue };

    if (shirt == blue) // if the shirt is blue
        std::cout << "Your shirt is blue!";
    else
        std::cout << "Your shirt is not blue!";

    return 0;
}
```

---

### 无范围枚举整数转换

在上面的内容中,我们提到过枚举器是符号常量。但其实这些枚举器具有整型值。

当我们定义一个枚举时，每个枚举项会自动与一个整数值关联，该值基于其在枚举列表中的位置。默认情况下，第一个枚举项被赋予整数值 0，而每个后续的枚举项的值比前一个枚举项大 1.

```cpp
enum Color
{
    black,   // 0
    red,     // 1
    blue,    // 2
    green,   // 3
    white,   // 4
    cyan,    // 5
    yellow,  // 6
    magenta, // 7
};

int main()
{
    Color shirt{ blue }; // shirt实际存储的值是2

    return 0;
}
```

可以显式的定义枚举器的值。这些整数值可以是正数或者负数,并且可以与其他枚举器共享相同的值。为定义的任何枚举器将被赋予比前一个枚举器大1的值。

```cpp
enum Animal
{
    cat = -3,    // 
    dog,         // -2
    pig,         // -1
    horse = 5,
    giraffe = 5, 
    chicken,     // 6
};
```

请注意，在这个例子中，**horse**（马）和 **giraffe**（长颈鹿）被赋予了相同的值。当这种情况发生时，这两个**枚举器 (enumerators)** 将变得**不再唯一 (non-distinct)** —— 本质上，**horse** 和 **giraffe** 可以互换使用。

虽然 C++ **允许**在同一个**枚举 (enumeration)** 中为**两个枚举器**分配相同的值，但**通常应尽量避免**这样做。

**最佳实践**

> 除非你有充分的理由,否则不要为枚举器显式的赋值。

---

### 对枚举进行值初始化

如果一个**枚举类型 (enumeration)** 被**零初始化 (zero-initialized)**（例如在进行**值初始化 (value-initialization)** 时发生这种情况），那么该枚举将被赋值为 0，即使枚举中**并不存在**值为 0 的**枚举器 (enumerator)**。

```cpp
#include <iostream>

//  注意:在此列表中没有具有值0的枚举器
enum Animal
{
    cat = -3,    // -3
    dog,         // -2
    pig,         // -1
    horse = 5,   // 5
    giraffe = 5, // 5
    chicken,     // 6
};

int main()
{
    Animal a {}; // 这里会将a初始化为0,即使在枚举项中并没有这个枚举
    std::cout << a; // prints 0

    return 0;
}
```

如果存在值为 0 的枚举项，值初始化将枚举类型默认为该枚举项的意义。例如，使用前面的 `enum Color` 示例，值初始化的 `Color` 将默认为 `black` 。因此，最好考虑将值为 0 的枚举项设置为你的枚举的最佳默认意义。

**最佳实践:**

> - 使用表示0的枚举项作为你枚举的最佳默认值。
>
> - 如果没有好的默认含义,可以考虑添加一个表示“无效”或者“未知”的枚举,其值为0 ,这样的状态可以明确记录并在适当的地方进行显式的处理。

---

### 无范围枚举会隐式转换为整数值

尽管枚举存储整数值，但它们并不被视为整数类型（它们是复合类型）。然而，无范围枚举会隐式转换为整数值。

因为枚举器是编译时常量，因此这是一个 constexpr 转换,考虑下面程序:

```cpp
#include <iostream>

enum Color
{
    black, //  0
    red, //  1
    blue, //  2
    green, //  3
    white, //  4
    cyan, //  5
    yellow, //  6
    magenta, //  7
};

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << shirt << '\n'; // prints 2

    return 0;
}
```

当一个枚举类型在函数调用或与某个运算符一起使用时，编译器会首先尝试找到一个与该枚举类型匹配的函数或运算符。例如，当编译器尝试编译` std::cout << shirt` 时，编译器会首先检查 `operator<<` 是否知道如何将 `Color` 类型的对象（因为 shirt 是 Color 类型）输出到 `std::cout` 中。但它并不支持这种操作。

由于编译器找不到匹配的运算符，它接着会检查` operator<<` 是否知道如何打印非作用域枚举转换成的整型类型的对象。由于它确实支持这种操作，`shirt` 中的值会被转换为一个整型值，并以整型值 `2` 的形式打印出来。

---

### 枚举大小和基础类型

枚举器具有整型值。但是具体是哪一种类型的整型呢?

对于无范围枚举类型,C++并没有标准规定使用哪一种具体的整数类型作为底层类型,因此该选择是由实现决定的。大多数编译器会使用`int`类型作为底层类型。

我们可以显式的指定枚举的底层类型,且必须是整数类型。例如,如果你的程序应用在一个对对带宽敏感的环境中,那么也许你会希望将枚举指定为一个较小的值。

```cpp
#include <cstdint>  // for std::int8_t
#include <iostream>

// 显式的指定枚举器的整数类型
enum Color : std::int8_t
{
    black,
    red,
    blue,
};

int main()
{
    Color c{ black };
    std::cout << sizeof(c) << '\n'; // prints 1 (byte)

    return 0;
}
```

**最佳实践**

> 仅在必要时指定枚举的基本类型。

### 整数到无范围枚举类型的转换

编译器会隐式的将无范围枚举转为整数,但是这个过程反过来是不成立的,不会隐式的将整数转换为无范围枚举。所以下面的代码会产生编译错误:

```cpp
enum Pet // 未指定基类型
{
    cat,   // 分配值 0
    dog,   // 分配值 1
    pig,   // 分配值 2
    whale, // 分配值 3
};

int main()
{
    Pet pet { 2 }; // 编译错误：整数值 2 不能隐式转换为 Pet 类型
    pet = 3;       // 编译错误：整数值 3 不能隐式转换为 Pet 类型

    return 0;
}
```

如果确实需要进行转换,那么可以使用`static_cast`进行显式的转换

```cpp
enum Pet // 未指定基类型
{
    cat,   // 分配值 0
    dog,   // 分配值 1
    pig,   // 分配值 2
    whale, // 分配值 3
};

int main()
{
    Pet pet { static_cast<Pet>(2) }; 
    pet = static_cast<Pet>(3);      

    return 0;
}
```

其次，从 C++17 开始，如果一个**非作用域枚举 (unscoped enumeration)** **显式指定了基类型 (explicitly specified base)**，那么编译器将允许你使用一个**整型值 (integral value)** 对该枚举进行**列表初始化 (list initialization)**。

```cpp
enum Pet: int // 我们已经指定了基类型
{
    cat,   // 分配值 0
    dog,   // 分配值 1
    pig,   // 分配值 2
    whale, // 分配值 3
};

int main()
{
    Pet pet1 { 2 }; // ✅ 可以使用大括号初始化非作用域枚举 (C++17) ，因为指定了基类型
    Pet pet2 (2);   // ❌ 编译错误：不能使用圆括号直接初始化整数值
    Pet pet3 = 2;   // ❌ 编译错误：不能通过赋值初始化整数值

    pet1 = 3;       // ❌ 编译错误：不能直接赋值整数值

    return 0;
}
```

---

### 枚举和字符串的相互转换

基于上面讨论的枚举和整数转换的例子中,将枚举作为整数值打印出来并不难,但这并不是我们想要的,通常情况下,我们更希望打印的是枚举项名称,比如`blue` ;尽管C++并没有内置的实现方案,但是我们可以自己探索:

获取枚举值名称的典型方法是编写一个函数，允许我们传入一个枚举值，并返回该枚举值的名称作为字符串。但这样做需要某种方式来确定对于给定的枚举值应该返回哪个字符串。

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

> 该函数是 `constexpr` 的，这样我们就可以在常量表达式中使用颜色的名称。

虽然这样可以让我们获取枚举项的名称，但如果我们要将这个名称打印到控制台，不得不使用 `std::cout << getColorName(shirt)` 并不比 `std::cout << shirt` 方便多少。我们将在后续的博文中学习通过I/O操作符重载的方式使用 `std::cout` 打印枚举。

---

### 无范围枚举的输入

在以下示例中，我们定义了一个 `Pet` 枚举。因为 `Pet` 是用户定义的类型，语言不知道如何通过 `std::cin` 输入一个 `Pet` ：

```cpp
#include <iostream>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

int main()
{
    Pet pet { pig };
    std::cin >> pet; // 编译错误

    return 0;
}
```

一种简单的方式是读取一个整数,然后使用`static_cats`将整数转换为相应的枚举类型;

```cpp
#include <iostream>
#include <string_view>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???";
    }
}

int main()
{
    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // input an integer

    if (input < 0 || input > 3)
        std::cout << "You entered an invalid pet\n";
    else
    {
        Pet pet{ static_cast<Pet>(input) }; 
        std::cout << "You entered: " << getPetName(pet) << '\n';
    }

    return 0;
}
```

与其输入一个数字，让用户输入一个表示枚举项的字符串（例如“pig”），然后我们将该字符串转换为相应的枚举项会更好。然而，做到这一点需要我们解决几个问题。

首先，我们不能使用字符串进行 switch 语句，因此我们需要使用其他方式来匹配用户传递的字符串。这里最简单的方法是使用一系列 if 语句。

其次，如果用户传递进一个无效的字符串，我们应该返回哪个枚举值？一种选择是添加一个表示`“none/invalid”`的枚举值，并返回它。然而，更好的选择是使用 `std::optional` 。

关于`std::optional`,在之前的博客中有介绍过,传送门:[[通俗易懂C++]:std::optional](https://www.ilikexff.cn/articles/153)

```cpp
#include <iostream>
#include <optional> // for std::optional
#include <string>
#include <string_view>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???";
    }
}

constexpr std::optional<Pet> getPetFromString(std::string_view sv)
{
    if (sv == "cat")   return cat;
    if (sv == "dog")   return dog;
    if (sv == "pig")   return pig;
    if (sv == "whale") return whale;

    return {};
}

int main()
{
    std::cout << "Enter a pet: cat, dog, pig, or whale: ";
    std::string s{};
    std::cin >> s;

    std::optional<Pet> pet { getPetFromString(s) };

    if (!pet)
        std::cout << "You entered an invalid pet\n";
    else
        std::cout << "You entered: " << getPetName(*pet) << '\n';

    return 0;
}
```

