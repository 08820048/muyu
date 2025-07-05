+++
title = "[C++游戏开发基础]:地址传递详解"
date = 2025-06-19
tags = ["C++", "游戏开发", "指针", "地址传递"]
description = "深入解析C++中地址传递的原理、使用方法及在游戏开发中的应用场景"
+++


### 2025-3-1 更新:
> - 对原有内容的补充和完善
---
在阅读本文的同时,默认你已经了解了`C++`中参数传递的其他两种方式:

- 按值传递
- 引用传递

下面的程序对这俩中 传递方式做了一个简单的使用演示:

```cpp
#include <iostream>
#include <string>

void printByValue(std::string val) // 函数参数是 str 的一个副本
{
    std::cout << val << '\n'; // 通过副本打印值
}

void printByReference(const std::string& ref) // 函数参数是一个引用，绑定到 str
{
    std::cout << ref << '\n'; // 通过引用打印值
}

int main()
{
    std::string str{ "Hello, world!" };

    printByValue(str); // 按值传递 str，创建 str 的副本
    printByReference(str); // 按引用传递 str，不创建 str 的副本

    return 0;
}
```

- 当我们使用值传递参数`str`时,函数参数`val`接收参数的一个副本。所以每次对传递进来的参数的修改都不会直接影响原始参数,因为它修改的其实是原始参数的副本而已。
- 通过引用传递参数时,引用参数`ref`绑定到实际参数。这避免了复制参数,因为我们的引用参数是`const`修饰的,因此不允许修改`ref`,但是如果没有这个常量修复符,那么我们对`ref`所做的任何修改都会影响`str`

> 以上两种 情况下,函数的调用者都提供了实际的对象`str`作为函数调用的参数。

---

## 地址传递

`C++`提供了一种将值传递给函数的第三种方式，称为按地址传递。在按地址传递中，调用者不是提供对象作为参数，而是提供对象的地址（通过指针）。这个指针（包含对象的地址）被复制到被调用函数的指针参数中（现在也包含对象的地址）。然后函数可以取消引用该指针以访问传递的地址的对象。

基于此,考虑下面的程序,在上面示例方法的基础上新增了按地址传递版本:

```cpp
#include <iostream>
#include <string>

void printByValue(std::string val) // 函数参数是 str 的副本
{
    std::cout << val << '\n'; // 通过副本打印值
}

void printByReference(const std::string& ref) // 函数参数是一个引用，绑定到 str
{
    std::cout << ref << '\n'; // 通过引用打印值
}

void printByAddress(const std::string* ptr) // 函数参数是一个指针，保存 str 的地址
{
    std::cout << *ptr << '\n'; // 通过解引用指针打印值
}

int main()
{
    std::string str{ "Hello, world!" };

    printByValue(str); // 按值传递 str，创建 str 的副本
    printByReference(str); // 按引用传递 str，不创建 str 的副本
    printByAddress(&str); // 按地址传递 str，不创建 str 的副本

    return 0;
}
```

- 首先、由于我们希望`printByAddress()`函数使用地址传递,所以需要把函数的参数调整为一个名为`ptr`的指针。再者,考虑到该函数将以只读的方式使用这个`ptr`指针,所以该指针声明为一个指向常量值的指针。如果你是直接点开的本文,对指针类型尚未学习,建议查看这篇文章:[[通俗易懂C++]:指针和const](https://www.ilikexff.cn/articles/150#google_vignette) 
- 其次、当调用函数时,我们不仅不能直接传入`str`对象,还需要传入`str`的地址,你可能也想到了,可以使用取地址运算符(`&`)来获取包含`str`的=地址的指针。

```cpp
printByAddress(&str);
```

当执行调用时,`&str`将会创建一个持有`str`地址的指针。然后,该地址呗复制到函数参数`ptr`作为函数调用的一部分。因为该指针`ptr`持有`str`的地址,当函数使用`*`解引用`ptr`时,它将获取`str`的值,该值通过函数的调用会被打印到控制台上。

> - 当我们使用 `operator&` 将变量的地址作为参数传递时，我们说变量是通过地址传递的。
> - 当我们有一个指针变量持有对象的地址，并且我们将指针作为相同类型的参数传递时，我们说对象是通过地址传递的，指针是通过值传递的。

---

### 地址传递不会复制所指向的对象

```cpp
std::string str{ "Hello, world!" };
printByAddress(&str); // 使用取地址操作符 (&) 获取一个指针，指向 str 的地址
```

你需要知道的是,一味的通过复制形式的传递,那个复制的成本是比较高的,特别是`sstd::tring`,因此尽可能的避免使用基于复制的值传递,当我们通过地址传递`std::string`时,我们并不需要复制实际的`std::string`对象,而只是在调用者到被调用者之间复制指针(该指针持有对象的地址)。由于地址通常只有4或者8个字节,指针也只有4或8个字节,因此复制指针的成本很低,速度也很快。

> 因此，就像按引用传递一样，按地址传递速度快，且避免了复制参数对象。

---

### 地址传递允许函数修改参数的值

当我们通过地址传递一个对象时,函数接收传递对象的地址,他可以通过解引用来访问。

因为这是实际参数对象的地址而不是副本,如果函数参数是指向非`const`的指针,则函数可以通过指针参数修改参数的值:

```cpp
#include <iostream>

void changeValue(int* ptr) // 注意：ptr 在这个例子中是一个指向非 const 类型的指针
{
    *ptr = 6; // 将值修改为 6
}

int main()
{
    int x{ 5 };

    std::cout << "x = " << x << '\n'; // 打印 x 的初始值

    changeValue(&x); // 将 x 的地址传递给函数

    std::cout << "x = " << x << '\n'; // 打印修改后的 x 的值

    return 0;
}
```

![image-20250223182608419](https://images.waer.ltd/notes/202502231826546.png)

如果一个函数不应该修改传入的对象，则函数参数应该是一个指向常量的指针：

```cpp
void changeValue(const int* ptr) // 注意：ptr 现在是一个指向 const 的指针
{
    *ptr = 6; // 错误：不能修改 const 值
}
```

由于和通常不为普通（非指针、非引用）函数参数添加 `const` 关键字,我们也通常不会为指针函数参数添加` const` 关键字。

一下是两个说明:

- **将 const 关键字用于指针函数参数**，使其成为 **常量指针**，几乎没有什么价值（因为它对调用者没有影响，且主要作为文档说明指针不会改变）。

- **将 const 关键字用于区分指向常量的指针与可以修改传入对象的非常量指针**，则非常重要（因为调用者需要知道函数是否可能修改传入参数的值）。

如果我们只使用非` const` 的指针函数参数，那么所有 `const` 的使用都是有意义的。一旦我们开始为指针函数参数使用 `const`，就会变得更加难以判断 `const` 的使用是否真的有意义。更重要的是，这也会使得难以察觉 **指向非 const 参数**。例如：

```cpp
void foo(const char* source, char* dest, int count);             // 使用非 const 指针，所有的 const 都是有意义的。
void foo(const char* const source, char* const dest, int count); // 使用 const 指针，`dest` 是指向非 const 的指针，可能会在大量无关紧要的 const 中被忽略。
```

在前一种情况中，很容易看出 `source` 是指向常量的指针，而 `dest` 是指向非常量的指针。 在后一种情况下，就很难看出 `dest` 是一个常量指针指向非常量的对象，而函数可以修改它所指向的对象！

**最佳实践**

> - 优先使用指向常量的函数参数，而不是指向非常量的函数参数，除非函数需要修改传入的对象。
> - 不要在没有特定原因的情况下将函数参数设置为常量指针。

---

### 空指针检查

考虑下面这个看似人畜无害的代码:

``` cpp
#include <iostream>

void print(int* ptr)
{
	std::cout << *ptr << '\n';
}

int main()
{
	int x{ 5 };
	print(&x);

	int* myPtr {};
	print(myPtr);

	return 0;
}
```

当运行此程序时，它将打印值 `5` 然后很可能会崩溃。

在调用 `print(myPtr)` 时， `myPtr` 是一个空指针，因此函数参数 `ptr` 也将是一个空指针。当在这个函数体中解引用这个空指针时，将产生未定义行为。

在通过地址传递参数时，在解引用值之前应确保指针不是空指针关于空指针的检查,之前的文章也是提到过的,这里就不再赘述。 

```cpp
#include <iostream>

void print(int* ptr)
{
    if (ptr) // 检查空指针
    {
        std::cout << *ptr << '\n';
    }
}

int main()
{
	int x{ 5 };

	print(&x);
	print(nullptr);

	return 0;
}
```

- 虽然这对于这样一个简单的函数来说是可以的，但在更复杂的函数中，这可能会导致冗余的逻辑（多次测试指针是否为空）或函数主要逻辑的嵌套冗余。

在大多数情况下,采取下面的写法更为建议:

```cpp
#include <iostream>

void print(int* ptr)
{
    if (!ptr) // 如果 ptr 是空指针，提前返回到调用者
        return;

    // 如果执行到这里，我们可以假设 ptr 是有效的
    // 所以不需要再进行测试或嵌套检查

    std::cout << *ptr << '\n'; // 打印指针指向的值
}

int main()
{
    int x{ 5 };

    print(&x);     // 传递 x 的地址，打印 5
    print(nullptr); // 传递空指针，不会打印任何内容

    return 0;
}
```

---

## 优先使用const引用传递

- 通过引用传递具有与通过地址传递相同的优点，而不存在意外解除空指针的风险。

- 通过 `const` 引用传递有一些比通过地址传递的优势。

首先，因为通过地址传递的对象必须有一个地址，所以只有左值可以按地址传递（因为右值没有地址）。按 const 引用传递更灵活，因为它可以接受左值和右值：

```cpp
#include <iostream>

void printByValue(int val) // 函数参数是参数的副本
{
    std::cout << val << '\n'; // 通过副本打印值
}

void printByReference(const int& ref) // 函数参数是一个绑定到参数的引用
{
    std::cout << ref << '\n'; // 通过引用打印值
}

void printByAddress(const int* ptr) // 函数参数是一个指针，持有参数的地址
{
    std::cout << *ptr << '\n'; // 通过解引用指针打印值
}

int main()
{
    printByValue(5);     // 有效（但会创建一个副本）
    printByReference(5); // 有效（因为参数是常量引用）
    printByAddress(&5);  // 错误：不能对右值取地址

    return 0;
}
```

其次，按引用传递的语法很自然，因为我们只需传递字面量或对象。使用按地址传递，我们的代码最终会充斥着与号`（&）`和星号`（*）`。代码量很大的情况下,会让你看的头皮发麻我给你讲!!!

在现代 `C++`中，大多数可以用按地址传递完成的事情，通过其他方法做得更好。遵循这个常见的原则：“**能通过引用传递时就传递引用，必须时才传递地址**”。

所以最佳实践是:**优先使用引用传递而非地址传递，除非你有特定理由使用地址传递。**

---

### 通过地址传递可选参数

函数通过地址传递的一个更加常见的用途是允许函数接受一个“可选”参数。看个例子:

```cpp
#include <iostream>

void printIDNumber(const int *id = nullptr)
{
    if (id)  // 如果 id 不为 null，则输出 ID 号码
        std::cout << "Your ID number is " << *id << ".\n";
    else  // 如果 id 为 null，则表示 ID 未知
        std::cout << "Your ID number is not known.\n";
}

int main()
{
    printIDNumber(); // 调用时不传入参数，ID 未知

    int userid { 34 };
    printIDNumber(&userid); // 传入 userid 的地址，ID 已知

    return 0;
}
```

在这个程序中， `printIDNumber()` 函数有一个参数，通过地址传递并默认为 `nullptr` 。在 `main()` 中，我们调用这个函数两次。第一次调用时，我们不知道用户的 ID，所以不带参数调用 `printIDNumber()` 。 `id` 参数默认为 `nullptr` ，函数打印 `Your ID number is not known.` 。第二次调用时，我们现在有一个有效的 ID，所以调用 `printIDNumber(&userid)` 。 `id` 参数接收 `userid` 的地址，因此函数打印 `Your ID number is 34.` 。

然而,在许多情况下,使用函数重载可以达到相同的目的,这是一个不更好的替代方案:

```cpp
#include <iostream>

void printIDNumber()  // 函数版本1：无参数版本
{
    std::cout << "Your ID is not known\n";  // 如果没有提供 ID，则打印此消息
}

void printIDNumber(int id)  // 函数版本2：接收一个整数类型的参数
{
    std::cout << "Your ID is " << id << "\n";  // 打印 ID
}

int main()
{
    printIDNumber(); // 调用无参数版本，输出 "Your ID is not known"

    int userid { 34 };
    printIDNumber(userid); // 调用带整数参数的版本，输出 "Your ID is 34"

    printIDNumber(62); // 直接传递一个整数值作为参数，输出 "Your ID is 62"

    return 0;
}
```

除此之外,使用函数重载的实现方式,我们不再需要担心空指针解引的问题,并且可以传递字面量或者其他右值作为参数。

---

### 改变指针参数指向的内容

当我们从函数传递一个地址时,该地址从参数(实参)复制到指针参数(形参)中。

```cpp
#include <iostream>

// [[maybe_unused]] 用来防止编译器因为 ptr2 设置但没有使用而发出警告
void nullify([[maybe_unused]] int* ptr2)
{
    ptr2 = nullptr; // 将函数参数指针设置为 null
}

int main()
{
    int x{ 5 };  // 定义一个整型变量 x，初始化为 5
    int* ptr{ &x }; // 定义一个指针 ptr，指向 x

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n"); // 判断 ptr 是否为空指针

    nullify(ptr);  // 调用 nullify 函数，尝试将 ptr 设置为 nullptr

    // 判断 ptr 是否为空指针
    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n"); 

    return 0;
}
```

如你所见，改变指针参数所持有的地址对参数（ `ptr` 仍然指向 `x` ）没有影响。当调用函数 `nullify()` 时， `ptr2` 接收了传入地址的副本（在这种情况下， `ptr` 所持有的地址，即 `x` 的地址）。当函数改变 `ptr2` 所指向的内容时，这只会影响 `ptr2` 所持有的副本。

就像我们可以通过引用传递一个普通变量时一样,我们可以通过引用来传递指针。下面是将上面程序中的`ptr2`更改为地址引用的版本:

```cpp
#include <iostream>

void nullify(int*& refptr)  // refptr 是一个指向指针的引用
{
    refptr = nullptr;  // 将函数参数指针修改为 null
}

int main()
{
    int x{ 5 };  // 定义一个整型变量 x，初始化为 5
    int* ptr{ &x };  // 定义一个指针 ptr，指向 x

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");  // 判断 ptr 是否为空指针

    nullify(ptr);  // 调用 nullify 函数，传递 ptr 的引用，修改 ptr 的值

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");  // 判断 ptr 是否为空指针
    return 0;
}
```

因为 `refptr` 现在是一个指向指针的引用，当 `ptr` 作为参数传递时， `refptr` 绑定到 `ptr` 。这意味着对 `refptr` 的任何更改都会应用到 `ptr` 。

---

> 感谢阅读,欢迎指正!

