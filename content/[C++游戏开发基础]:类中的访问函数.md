+++
title = "[C++游戏开发基础]:类中的访问函数"
date = 2025-06-19
tags = ["C++", "游戏开发", "访问函数", "面向对象"]
description = "详解C++类中访问函数(getter/setter)的实现方法、最佳实践及其在游戏开发中的应用"
+++



> 本节内容默认你已经掌握了C++中的`public`和`private`的作用。类通常将其数据成员设置为私有,而私有成员不能被公共部分直接访问。

考虑下面程序:

```cpp
#include <iostream>

class Date
{
private:
    int m_year{ 2020 };
    int m_month{ 10 };
    int m_day{ 14 };

public:
    void print() const
    {
        std::cout << m_year << '/' << m_month << '/' << m_day << '\n';
    }
};

int main()
{
    Date d{};  // 创建一个Date 对象
    d.print(); 

    return 0;
}
```

尽管在程序中,我们提供了一个`print()`成员函数来打印整个日期信息,但这可能不足以满足用户需求。比如,如果一个`Date`对象的用户需要获取年份,或者将年份更改为不同的值,就程序目前的设计来说,他们无法做到这一点,因为类的数据成员都是`private`级别的。 

---

## 访问函数

访问函数是一个简单的公共成员函数,他们的作用就是获取或者更改成员变量的值。

访问函数有两种类型:获取器和设置器。获取函数(也可以称为访问函数)是公共的成员函数,用于返回私有成员的值。设置器(修改器函数)也是公共的成员函数,用来设置私有成员变量的值。

> `getter()`通常被声明为`const`,这样它们就可以在`const`和非`const`对象上调用。`setter()`则应该是声明为非`const`的,这样才能修改数据成员。

针对当前讨论的话题,我们尝试更新之前的示例程序:

```cpp
#include<iostream>
class Date
{
private:
  int m_year {2025};
  int m_month {3};
  int m_day {20};

public:
  void print()
  {
      std::cout << m_year << "-" << m_month << "-" << m_day << std::endl;
  }

  // 设置获取
  int getYear() const {return m_year;}
  int getMonth() const {return m_month;}
  int getDay() const {return m_day;}

  void setMonth(int month)
  {
      m_month = month;
  }

  void setDay(int day)
  {
      m_day = day;
  }

  void setYear(int year)
  {
      m_year = year;
  }
};

int main()
{
    Date d{};
    d.setYear(2026);
    std::cout << "The year is:" << d.getYear() <<'\n';

    return 0;
}
```

---

## 关于访问函数的命名

在C++中并没有对于访问函数命名的明确约定,也就是说,你可以自由的为它们命名。但是,有一些在用的命名约定值的参考:

- 以`get`和`set`开头

```cpp
int getDay() const { return m_day; }  // getter
void setDay(int day) { m_day = day; } // setter
```

使用这样带前缀的命名约定的好处是,这使得我们可以很明显的知道这是访问函数。有见名知意的效果。

- 无前缀命名

```cpp
int day() const { return m_day; }  // getter
void day(int day) { m_day = day; } // setter
```

相对于这种命名风格,可能大部分人更加熟悉的是第一种,特别是学过`Java`的同学。这第二种风格使用相同的名称作为获取器和设置器,相对来说更加简洁,C++标准库使用的就是这种风格。

无前缀命名约定的缺点是,可能在 **见名知意** 这点上并不明显。

> 还有,使用“`m_`”前缀来私有数据成员的一个最好的原因是避免数据成员和获取器具有相同名称（`C++`不支持这种情况，尽管像` Java` 这样的其他语言支持）。

- 只针对设置器使用`set`前缀

```cpp
int day() const { return m_day; }     // getter
void setDay(int day) { m_day = day; } // setter
```

上面这三种方式的选择完全取决于你自己的喜好,但是,就我个人而言比较建议使用第二种(可能我也是Java畜生);

---

## 关于 **访问函数（getter 和 setter）** 在类设计中的使用问题

当你在创建类时,不妨考虑下面几点建议;

1. **如果类没有不变式（invariants），并且需要大量访问函数**，那么 **考虑使用 struct 而不是 class**，并且直接将成员变量设为 public。

2. **不变式（invariants）** 指的是 **类的某些属性必须始终满足的规则**，例如“日期类中的月份必须在 1-12 之间”。

3. 如果类的成员变量没有这样的规则限制，直接使用 `struct` 可能更简单和直观，而不需要访问函数。

4. **优先实现行为（行为驱动设计），而不是单纯的访问函数**。

   > 例如，**不要** 设计 setAlive(bool) 这样简单的 setter，而是使用 kill() 和 revive() 这样的函数，这样代码的意图更清晰，逻辑也更集中。

5. **只有在公有接口真正需要访问某个成员变量时，才提供访问函数**。

   > 例如，如果外部代码需要读取 id 或 name，那么 getId() 或 getName() 是合理的。但如果数据成员仅用于内部计算或管理，不要暴露 getter/setter，而是让类自身管理数据。

针对上面几点,下面给出一些正反面示例:

**反面示例,滥用访问函数**

```cpp
class Character
{
private:
    bool m_alive {};

public:
    void setAlive(bool alive) { m_alive = alive; }  // ❌ 不推荐，外部能随意改动
    bool isAlive() const { return m_alive; }
};
```

**正面示例,行为驱动**

```cpp
class Character
{
private:
    bool m_alive { true };

public:
    void kill() { m_alive = false; }  // ✅ 通过 kill() 明确角色死亡
    void revive() { m_alive = true; } // ✅ 通过 revive() 复活角色
    bool isAlive() const { return m_alive; }
};
```

这种方式更符合 **封装** 和 **面向对象设计** 原则，让 Character 类更具自我管理能力，而不是让外部代码随意修改其状态。

---

## 通过值返回数据成员

```cpp
#include <iostream>
#include <string>

class Employee
{
	std::string m_name{};

public:
	void setName(std::string_view name) { m_name = name; }
	std::string getName() const { return m_name; } //  getter returns by value
};

int main()
{
	Employee joe{};
	joe.setName("Joe");
	std::cout << joe.getName();

	return 0;
}
```

在这个例子中,`getName()`函数可以以`std::string m_name`的值返回,虽然这是最安全的做法,但是在之前的文章中提过,复制是一个高成本的操作,由于访问函数通常会被频繁的调用,因此这显然不是最佳的选择。 

---

## 通过`lvalue`引用返回数据成员

成员函数也可以通过`const`的左值返回数据成员。

数据成员与包含它们的对象具有相同的生命周期。

由于成员函数总是针对一个对象调用的,而该对象必须存在于调用者的作用域中因此通常情况下,成员函数可以通过`const`修饰的左值应用返回一个数据成员。

更新上面的示例:

```cpp
#include <iostream>
#include <string>

class Employee
{
	std::string m_name{};

public:
	void setName(std::string_view name) { m_name = name; }
	const std::string& getName() const { return m_name; } //  getter returns by const reference
};

int main()
{
	Employee joe{}; // joe 直到函数结束,对象依旧存在
	joe.setName("Joe");

	std::cout << joe.getName(); // 通过引用返回

	return 0;
}
```

更新后的程序中,当`joe.getName()`被调用时,`m_name`将会通过引用返回给调用者,避免了复制操作。由于`joe`存在与调用者的范围会持续到`main`函数结束,所以`joe.m_name`的引用也具有等效的生命周期,因此,这样的调用没问题。

---

## **Rvalue 隐式对象与返回引用**

在 C++ 中，**rvalue（右值）对象** 是临时对象，它们的生命周期通常只存在于当前的**完整表达式（full expression）** 内。

一旦这个表达式执行完毕，rvalue 对象就会被销毁。如果我们返回对一个 rvalue 的成员的引用，该引用将指向一个已经销毁的对象，从而导致**悬垂引用（dangling reference）**，最终引发**未定义行为（undefined behavior, UB）**。
就像上面的例子,使用`Lvalue`返回引用是安全的,下面看一个`Rvalue`引用返回的错误例子:

```cpp
#include <iostream>
#include <string>

class Person
{
private:
    std::string m_name;

public:
    Person(std::string name) : m_name{name} {}

    const std::string& getName() const { return m_name; }
};

Person createPerson()
{
    return Person{"Alice"}; // 返回一个临时对象（rvalue）
}

int main()
{
    const std::string& name = createPerson().getName(); // name 变成悬垂引用
    std::cout << name << '\n'; // 未定义行为！
}
```

**看看发生了什么**

> ​	1.`createPerson()` 返回一个 `Person{"Alice"}` **临时对象（rvalue）**。
>
> ​	2.`getName() `返回 `m_name` 的**引用**。
>
> ​	3.但 `Person{"Alice"} `**在表达式结束后立刻被销毁**，其 `m_name` 也随之销毁。
>
> ​	4.`name` 仍然存储 `m_name `的引用，但这个引用已经悬空了！
>
> ​	5.访问 `name `时，程序会产生未定义行为（`UB`）。

基于此,最佳的实践是:

> 建议立即使用返回引用的成员函数的返回值,以避免在隐式对象为右值时出现悬空引用的问题。

---

## 不要返回私有数据成员的非常量引用

返回非常量引用的成员函数可以提供对该成员的直接访问,即使该成员是`private`私有的。

```cpp
#include <iostream>

class Foo
{
private:
    int m_value{ 4 }; // 私有成员变量，初始值为 4

public:
    int& value() { return m_value; } // 返回 m_value 的 **非 const 引用**（不推荐这样做）
};

int main()
{
    Foo f{};                // 创建 Foo 对象 f，m_value 被初始化为默认值 4
    f.value() = 5;          // 等价于 f.m_value = 5，直接修改私有成员变量
    std::cout << f.value(); // 输出 5

    return 0;
}
```

因为 `value()` 返回了一个非常量引用到 `m_value` ，调用者可以通过这个引用直接访问（并修改 `m_value` 的值）。这使得调用者可以绕过访问控制系统去随意修改私有数据,是非常危险的操作。

同时,**常成员函数**（const 修饰的成员函数）**不允许返回成员变量的非常量引用**。如果允许常成员函数返回成员变量的非常量引用，那么调用者就可以**直接修改**该成员变量。这将**破坏常成员函数的初衷**，违反 const 关键字的设计目的。

```cpp
#include <iostream>

class BankAccount
{
private:
    double m_balance{1000.0}; // 账户余额

public:
    // 错误：常成员函数返回非常量引用
    double& getBalance() const 
    {
        return m_balance; // 返回余额的非 const 引用
    }
};

int main()
{
    const BankAccount account{}; // 创建一个常量对象

    // 这里违反了 const 规则，因为 `getBalance()` 居然能修改 `m_balance`
    account.getBalance() = 500.0; // ❌ 逻辑错误：修改了 const 对象的成员变量

    std::cout << "Account balance: " << account.getBalance() << '\n';

    return 0;
}
```


