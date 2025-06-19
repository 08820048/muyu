+++
title = "[C++游戏开发基础]:数据封装(隐藏)的好处"
date = 2025-06-19
tags = ["C++", "游戏开发", "数据封装", "面向对象"]
description = "探讨C++中数据封装的概念、实现方法及其在游戏开发中的重要性"
+++




- 在现代生活中，我们有许多机械或电子设备。你通过遥控器开关电视。你通过踩油门使汽车前进。你通过开关来打开灯。

- 实际上这些设备是如何运作的对你来说是隐藏起来的。当你按下遥控器上的按钮时，你不需要知道遥控器是如何与电视进行通信的。

- 当你踩下汽车的油门时，你不需要知道内燃机是如何让车轮转动的。当你拍照时，你不需要知道传感器是如何收集光线并将光线转换成像素图像的。

- 这种接口和实现的分离非常有用，因为它允许我们在不需要理解它们如何工作的情况下使用对象——我们只需要了解如何与它们交互。这大大减少了使用这些对象的复杂性，并增加了我们可以交互的对象数量。

---

## 类的接口与实现的分离

在编程中，接口（interface）和实现（implementation）的分离是非常有用的概念。让我们先明确在类（class）类型中，这两个术语的含义。

**什么是接口**

类的接口（也称为**类接口**）定义了类的用户如何与该类的对象进行交互。由于**只有公有成员（public members）** 可以被类外部访问，因此，**类的公有成员构成了该类的接口**。由于接口由公有成员组成，因此它有时也被称为**公有接口（public interface）**。

接口是**类的作者**和**类的使用者**之间的一种**隐式契约（implicit contract）**。

- **一旦类的接口被使用，就不能轻易修改**，因为任何对接口的更改都可能导致依赖它的代码发生错误。
- 因此，我们应该**确保类的接口设计良好且稳定**，尽量减少不必要的更改。

**什么是实现**

类的**实现**指的是**使类按照预期行为运行的代码**，它包括：

- **成员变量（member variables）：** 用于存储数据。
- **成员函数的具体实现（bodies of member functions）：** 包含程序逻辑并操作成员变量。

换句话说，**实现是支撑类功能的幕后代码**，它决定了类的行为方式，而接口只是提供了与外部交互的方式。

---

## 数据封装使类更容易使用并降低了复杂性

使用封装类时，你不需要知道它的实现细节。你只需要理解它的接口：哪些成员函数是公开的，它们接受什么参数，以及返回什么值。

比如:

```cpp
#include <iostream>
#include <string_view>

int main()
{
    std::string_view sv{ "Hello, world!" };
    std::cout << sv.length();

    return 0;
}
```

在这个简短的程序中，我们看不到 `std::string_view` 的实现细节。我们不知道 `std::string_view` 有多少个数据成员、它们的名字或类型是什么。我们也不知道 `length()` 成员函数是如何返回所查看字符串的长度的。

不必关心这些细节极大地降低了程序的复杂性，从而减少了错误。这是封装的关键优势，比其他任何原因都更为重要。

不妨想象一下:如果要使用 `std::string` 、 `std::vector` 或 `std::cout` ，就必须理解它们的实现细节，C++ 会变得多么复杂！

---

## 数据封装能更好的维护不变量

所谓不变量,即为了使对象在整个生命周期内保持有效状态而必须满足的条件。

考虑下面程序:

```cpp
#include <iostream>
#include <string>

struct Employee // 结构体的成员默认是 public（公有的）
{
    std::string name{ "John" }; // 员工姓名，默认值为 "John"
    char firstInitial{ 'J' };   // 员工的首字母，默认值为 'J'（应与 name 的首字母匹配）

    void print() const // 输出员工信息
    {
        std::cout << "Employee " << name << " has first initial " << firstInitial << '\n';
    }
};

int main()
{
    Employee e{}; // 使用默认值初始化 Employee（name="John", firstInitial='J'）
    e.print(); // 输出："Employee John has first initial J"

    e.name = "Mark"; // 修改员工的姓名为 "Mark"
    e.print(); // 由于 firstInitial 没有同步更新，此时仍然是 'J'，导致输出的首字母错误

    return 0;
}
```

因为 `name` 成员是公共的， `main()` 中的代码能够将 `e.name` 设置为 `"Mark"` ，而 `firstInitial` 成员没有被更新。我们的不变式被破坏了，所以对 `print()` 的第二次调用没有按预期工作。

如果我们直接给用户提供类的实现访问权限，他们就需要负责维护所有不变量,这显然不太现实。

让我们重写这个程序，将我们的成员变量设为私有，并暴露一个成员函数来设置 Employee 的名字：

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Employee 
{
    std::string m_name{};
    char m_firstInitial{};

public:
    void setName(std::string_view name)
    {
        m_name = name;
        m_firstInitial = name.front(); // use std::string::front() to get first letter of `name`
    }

    void print() const
    {
        std::cout << "Employee " << m_name << " has first initial " << m_firstInitial << '\n';
    }
};

int main()
{
    Employee e{};
    e.setName("John");
    e.print();

    e.setName("Mark");
    e.print();

    return 0;
}
```

上面的程序的变更,从用户的角度来看，唯一的变化是他们不再直接给 `name` 分配一个值，而是调用成员函数 `setName()` ，该函数负责同时设置 `m_name` 和 `m_firstInitial` 。用户不再需要维护这个不变量！

---

## 数据封装可以更好的进行错误检测和处理

在上述程序中， `m_firstInitial` 必须与 `m_name` 的第一个字符匹配这一不变量存在是因为 `m_firstInitial` 独立于 `m_name` 存在。我们可以通过将数据成员 `m_firstInitial` 替换为一个返回第一个字符的成员函数来移除这个特定的不变量。

```cpp
#include <iostream>
#include <string>

class Employee
{
    std::string m_name{ "John" };

public:
    void setName(std::string_view name)
    {
        m_name = name;
    }

    // use std::string::front() to get first letter of `m_name`
    char firstInitial() const { return m_name.front(); }

    void print() const
    {
        std::cout << "Employee " << m_name << " has first initial " << firstInitial() << '\n';
    }
};

int main()
{
    Employee e{}; // defaults to "John"
    e.setName("Mark");
    e.print();

    return 0;
}
```

对于上面的程序,还存在一个问题,`m_name` 不应该是一个空字符串（因为每个 `Employee` 都应该有一个名称）。如果 `m_name` 被设置为空字符串，立即不会发生任何糟糕的事情。但如果随后调用了 `firstInitial()` ， `front()` 成员将会尝试获取空字符串的第一个字母，这会导致未定义行为。

如果用户对 `m_name` 成员有公共访问权限，他们可以直接设置 `m_name = ""` ，而我们无法阻止这种情况发生。

然而，因为我们要求用户通过公共接口函数 `setName()` 设置 `m_name` ，我们可以在 `setName()` 中验证用户传递的是一个有效的名称。如果名称非空，我们可以将其赋值给 `m_name` 。如果名称是空字符串，我们可以采取任何数量的措施进行响应：

- 忽略将名称设置为“”的请求，并返回给调用者。
- 错误断言
- 抛出异常
- 其他

---

## 一点建议:优先使用非成员函数而不是成员函数

在C++中,如果一个函数可以合理的作为非成员函数实现,应该优先将其实现为非成员函数,而不是成员函数。 这样做是有原因的:

- 非成员函数不是你类接口的一部分,因此,类接口将会变得更小更简洁,使类更容易理解和维护。
- 非成员函数能够强化封装性，因为它们必须通过类的公共接口来工作。这样就不会因为方便而直接访问类的内部实现。
- 非成员函数通常更容易调试;
- 非成员函数可以帮助将应用特定的逻辑从类中分离出来，从而提高类的通用性和可复用性。

如果你之前有现代面向对象编程（OOP）语言的经验（比如 Java 或 C#），这种做法可能会让你感到意外。这些语言采用了不同的概念模型，在它们的设计中，**类是核心**，所有东西都围绕类展开。

因此，这些语言强调成员函数（member functions），并且实际上 **Java 和 C# 甚至不支持非成员函数（non-member functions）**。

这里针对上面最后一条举个例子:

**反向示例:**

```cpp
#include <iostream>
#include <cmath>

class Vector3D
{
private:
    double m_x, m_y, m_z;

public:
    Vector3D(double x, double y, double z) : m_x(x), m_y(y), m_z(z) {}

    double length() const // 计算向量长度
    {
        return std::sqrt(m_x * m_x + m_y * m_y + m_z * m_z);
    }

    // 这个方法把游戏特定的逻辑放进了 Vector3D 中
    void applyGravity()
    {
        m_y -= 9.81; // 物理重力，属于游戏逻辑
    }

    void print() const
    {
        std::cout << "Vector(" << m_x << ", " << m_y << ", " << m_z << ")\n";
    }
};

int main()
{
    Vector3D velocity(10, 20, 30);
    velocity.applyGravity(); // 调用物理引擎逻辑
    velocity.print(); // Vector(10, 10.19, 30) (不符合通用设计)

    return 0;
}
```

- applyGravity() 是**游戏特定**的逻辑，而 Vector3D 本身应该是一个通用的数学类。
- 如果未来需要在物理模拟、3D 渲染等不同场景使用 Vector3D，这个方法可能就不适用了。
- 这导致 Vector3D 变得**不够通用，难以复用**。

**使用非成员函数分离应用逻辑以改进**

```cpp
#include <iostream>
#include <cmath>

class Vector3D
{
private:
    double m_x, m_y, m_z;

public:
    Vector3D(double x, double y, double z) : m_x(x), m_y(y), m_z(z) {}

    double length() const // 计算向量长度
    {
        return std::sqrt(m_x * m_x + m_y * m_y + m_z * m_z);
    }

    void print() const
    {
        std::cout << "Vector(" << m_x << ", " << m_y << ", " << m_z << ")\n";
    }

    // 提供访问和修改 y 分量的接口
    double getY() const { return m_y; }
    void setY(double y) { m_y = y; }
};

// 应用层的游戏逻辑：用非成员函数实现重力影响
void applyGravity(Vector3D& velocity)
{
    velocity.setY(velocity.getY() - 9.81); // 物理引擎的重力影响
}

int main()
{
    Vector3D velocity(10, 20, 30);
    applyGravity(velocity); // 现在 applyGravity() 只影响游戏逻辑
    velocity.print(); // Vector(10, 10.19, 30)

    return 0;
}
```

---

## 关于类成员声明顺序的讨论

在类外部编写代码时,我们必须在使用变量和函数之前声明它们,然而,在类内部,这种限制并不存在。

关于如何排序,下面有两种观点:

- 首先列出你的私有成员，然后列出你的公有成员函数。这遵循了先声明后使用的传统风格。任何查看你类代码的人可以看到你在使用数据成员之前是如何定义它们的，这可以使阅读和理解实现细节变得更加容易。
- 首先列出你的公共成员，然后将私有成员放在底部。因为使用你类的人关心的是公共接口，所以把公共成员放在前面可以让他们需要的信息放在顶部，而把实现细节（这些细节是最不重要的）放在最后。

在现代C++中,第二种方式更为推荐,尤其是在团队开发中。所以 **最佳实践:**

> 首先声明公共成员,接着声明受保护成员,最后声明私有成员。这样可以突出公共接口并弱化实现细节。

在`Google C++`风格指南中对这部分有更加详细的阅读,可以自己看看[Google C++style guide]([Google C++ style guide](https://google.github.io/styleguide/cppguide.html#Declaration_Order):)

