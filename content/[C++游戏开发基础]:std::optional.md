+++
title = "C++游戏开发基础-深入解析std::optional"
date = 2025-06-19
tags = ["C++", "游戏开发"]
description = "详细介绍C++17引入的std::optional类型，包括其用法、应用场景以及最佳实践。"
+++


考虑下面这样一个函数:

```cpp
int doIntDivision(int x, int y)
{
    return x / y;
}
```

如果调用者传入一个语义上无效的值（例如 `y` = `0` ），此函数无法计算一个返回值（因为除以 0 在数学上是未定义的）。在这种情况下我们该怎么办？

这种情况下,通常的做法是让函数检测错误,然后将错误返回给调用者以适当的方式处理。比如;

- 函数返回一个bool值类型,表示成功或者失败!
- 让一个有返回值的函数返回一个哨兵值（一个特殊的值，该值不会出现在函数可能返回的其他值的集合中），以此来指示错误。

以下示例中， `reciprocal()` 函数在用户为 `x` 传递语义上无效的参数时返回值 `0.0` （这种情况在其他情况下不会发生）

```cpp
#include <iostream>
double reciprocal(double x)
{
    if (x == 0.0) // 如果x在语义上无效
       return 0.0; // 返回0.0作为前哨指示发生错误的哨兵标识

    return 1.0 / x;
}

void testReciprocal(double d)
{
     double result { reciprocal(d) };
     std::cout << "The reciprocal of " << d << " is ";
     if (result != 0.0)
         std::cout << result << '\n';
     else
         std::cout << "undefined\n";
}

int main()
{
    testReciprocal(5.0);
    testReciprocal(-4.0);
    testReciprocal(0.0);

    return 0;
}
```

尽管这是一个不错的解决方案,但也存在一些潜在的不足:

- 作为程序员必须知道函数使用哪个哨兵值来表示错误;
- 同一个函数的不同版本可能会使用不同的哨兵值;
- 此方法不适用于所有可能的哨兵值都是有效返回值的函数。

再考虑我们上面的 `doIntDivision()` 函数。如果用户传入 `0` 作为 `y` 的值，它可能返回什么值？我们不能使用 `0` ，因为 `0` 除以任何数都不会得到 `0` 作为有效结果。实际上，并不存在我们无法返回且无法自然出现的值。

那么,如果要使用哨兵值表示法,我们可以选择一些不常见的返回值作为哨兵,并用它来表示错误信息的标识;比如,采用指定类型的极值。 

```cpp
#include <limits>

std::optional<int> doIntDivision(int a,int b)
{
    if(b == 0)
        return std::numeric_limits<int>::lowest();
    return a / b;
}
```

`std::numeric_limits<T>::lowest()` 是一个返回类型 `T` 的最负值的函数,相对应的还有`std::numeric_limits<T>::max()` 对应函数（`std::numeric_limits<T>::max()` 函数返回类型 `T` 的最大正值）

在上面的实例中,如果 `doIntDivision()` 无法继续执行，我们返回 `std::numeric_limits<int>::lowest()` ，这将返回最负的整数值给调用者以指示函数执行失败。

虽然这是可行的一种方式,当它存在两个缺点:

- 每次调用这个函数时，都需要测试返回值是否与 `std::numeric_limits<int>::lowest()` 相等以判断是否失败。这既繁琐又难看。
- 考虑这样一种情况,如果用户调用 `doIntDivision(std::numeric_limits<int>::lowest(), 1)` ，返回的结果 `std::numeric_limits<int>::lowest()` 将无法明确地表明函数是成功还是失败。当然这种问题的出现取决于实际的使用方式,也许出现的几率不是很大,但不得不作为一个可能导致程序出现一些潜在危险的途径。

其次,你可能也想到了,我们可以放弃使用这种返回哨兵值的方式来标识错误返回,并使用异常机制来进行。然而,异常本身也有其复杂性和性能开销,并不一定合适每一种类似的场景,起码对于我们正在讨论的这种情况来说未免有些过于繁琐了。

---

## std::optional

基于上面讨论的情况和各种解决方案,你可能也想到了,既然使用返回单个哨兵值的方式存在局限,那么我们是不是可以考虑返回两个值呢?一个用来标识函数是否成功,一个用于存储实际的返回值(取决于函数的执行结果)。

在C++17中引入了`std::optional`,这是一个类模版类型,实现了 可选值。也即是说,一个 `std::optional<T>` 可以有类型为T的值,或者没有值。我们可以使用这个特性来实现上面这种双返回值的方案。

```cpp
#include <iostream>
#include <optional> // for std::optional (C++17)


std::optional<int> doIntDivision(int a, int b)
{
    if (b == 0)
        return {}; // or return std::nullopt
    return a / b;
}

int main()
{
    std::optional<int> result1 { doIntDivision(20, 5) };
    if (result1) 
        std::cout << "Result 1: " << *result1 << '\n'; 
    else
        std::cout << "Result 1: failed\n";

    std::optional<int> result2 { doIntDivision(5, 0) };

    if (result2)
        std::cout << "Result 2: " << *result2 << '\n';
    else
        std::cout << "Result 2: failed\n";

    return 0;
}
```

使用 `std::optional` 非常容易。我们可以使用下面三种方式来初始化构造一个 `std::optional<T>` ：

```cpp
std::optional<int> o1 {6};
std::optional<int> o2 {};
std::optional<int> o3 {std::nullopt};
```

要检查一个`std::optional`是否有值,我们可以选择下面方式之一:

```cpp
if (o1.has_value()) // 1.使用has_value()函数检查
if(o2) //2.使用隐式转换进行bool以检查O2是否具有值  
```

同样,要从`std::optional`中获取值,我们可以选择以下方式之一:

```cpp
std::cout << *o1; //1. 解引用以获取存储在 o1 中的值（如果 o1 中没有值，则会导致未定义行为）。
std::cout << o2.value(); //2. 调用 value() 以获取存储在 o2 中的值（如果 o2 中没有值，则会抛出 std::bad_optional_access 异常）。
std::cout << o3.value_or(5); // 3.调用 value_or() 以获取存储在 o3 中的值（如果 o3 中没有值，则返回一个指定的默认值,这里返回5）。
```

`std::optional`用法看起来和指针有些相似,但是从语义上讲,他们存在不小的差异:

- 指针具有引用语义,意味着它引用其他对象,赋值时复制的是指针,而不是对象。如果我们通过地址返回指针,复制回去的是指针本身而不是被指向的对象。 这就意味着我们不能通过地址返回局部对象,因为这会将该对象的地址复制回调用者,然后该对象会被销毁,导致返回的指针成为悬空指针。下面是一个简单的例子:

```cpp
int* getPtr()
{
    int lovalVal = 10;
    return &localVal;
}

int main()
{
    int* ptr = getPtr();
    std::cout << *ptr << '\n';
    return 0;
}
```

- `std::optional` 具有值语义，意味着它实际上包含其值，并且赋值会复制该值。如果我们按值返回一个 `std::optional` ，那么 `std::optional` （包括其中包含的值）会被复制回调用者。这意味着我们可以使用 `std::optional` 从函数返回一个值给调用者。

> 考虑到这一点，让我们看看我们的示例是如何工作的。我们的 `doIntDivision()` 现在返回一个 `std::optional<int>` ，而不是一个 `int` 。在函数体内，如果我们检测到错误，我们将返回 `{}` ，这会隐式返回一个 `std::optional` ，其中不包含任何值。如果我们有一个值，我们将返回该值，这会隐式返回一个 `std::optional` ，其中包含该值。
>
> 在 `main()` 中，我们使用隐式转换为 bool 来检查我们返回的 `std::optional` 是否有值。如果有值，我们解引用 `std::optional` 对象以获取值。如果没有值，我们执行错误条件。

---

## 返回`std::optional`的优缺点

好处多多:

- 有效使用` std::optional` 可以明确地表示一个函数可能返回一个值，也可能不返回值。

- 不需要记住哪个值是作为哨兵值返回的;
- 语法简洁直观。

一些缺点:

- 我们必须确保`std::optional`包含一个值再去执行获取的操作,否则解引用一个不包含值的`std::optional`将会发生为定义行为。
- `std::optional`无法提供关于函数失败原因的信息。

**最佳实践**

> 如果需要,请返回一个 `std::optional` （而不是哨兵值），除非你的函数需要返回有关失败原因的额外信息。

---

## **使用** `std::optional` **作为可选函数参数**

在之前的文章中提到过,如何使用通过地址传递来允许函数接受一个“可选”的参数（即调用者可以传递 `nullptr` 来表示“没有参数”或一个对象）。然而，这种方法的一个缺点是，非 nullptr 参数必须是 lvalue(左值)（以便其地址可以传递给函数）。

```cpp
void processValue(int* ptr) {
    if (ptr) {
        std::cout << "Value: " << *ptr << std::endl;
    } else {
        std::cout << "No value provided." << std::endl;
    }
}

int main() {
    int x = 10;
    processValue(&x);    // 传入一个左值的地址
    processValue(nullptr); // 传入 nullptr 表示无参数

    // 错误示例: 传入右值（临时值）的地址
    // processValue(&5); // 编译错误，5 是一个右值，没有地址
}
```

更好的做法是,使用 `std::optional` 使参数可选，而不需要依赖 `nullptr` 和指针传递。例如：

```cpp
#include <iostream>
#include <optional>

// 打印用户的ID号，如果未提供ID号，则输出“未知”
void printIDNumber(std::optional<const int> id = std::nullopt)
{
    if (id)
        std::cout << "Your ID number is " << *id << ".\n"; // 如果提供了ID，解引用并打印
    else
        std::cout << "Your ID number is not known.\n"; // 如果没有提供ID，输出“未知”
}

int main()
{
    printIDNumber(); // 我们还不知道用户的ID号

    int userid { 34 };
    printIDNumber(userid); // 现在我们知道用户的ID号

    printIDNumber(62); // 我们也可以传递一个右值

    return 0;
}
```

这种用法有两个优点;

1. 它有效的说明了该参数是可选的。
2. 我们以传递一个右值,因为`std::optional`会生成一个副本。

> 然而，因为 `std::optional` 会复制其参数，当 `T` 是一个复制成本高的类型（比如 `std::string` ）时，这就会变得有问题。在使用普通函数参数时，我们通过将参数改为 `const lvalue reference` 的方式来解决这个问题，这样就不会进行复制。不幸的是，截至 C++23， `std::optional` 仍然不支持引用。

`std::optional<T>` 适合用于小而简单的类型（如` int、float、enum `等）作为可选参数，因为它会将值直接存储在 `optional `对象内部。

- 对于较大的对象或复杂类型（如大型结构体、类对象），按值传递（pass by value）会导致拷贝整个对象，可能影响性能。

- 当 `T` 是复杂对象时，更好的选择是使用指针（`const T*`），这样只传递对象的地址，而不是对象本身，避免了不必要的拷贝。

- `const T*` 同样可以使用 `nullptr` 表示“无值”的情况，实现可选参数的效果。

因此，建议仅在通常会按值传递 `T` 时，使用 `std::optional<T>` 作为可选参数。否则，请使用 `const T*` 。

**最佳实践:**

> 优先使用函数重载处理可选函数参数（如果可能）。否则，对于可选参数，使用 `std::optional<T>` 。如果 `T` 的复制代价高昂，请优先使用 `const T*` 。

