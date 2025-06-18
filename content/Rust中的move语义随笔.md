+++
title = "Rust中的move语义随笔"
slug = "rust-中的-move-语义随笔"
date = 2023-06-15
tags = ["Rust", "move语义", "所有权", "内存安全", "编程语言"]
description = "深入探讨Rust语言中的move语义概念，包括默认移动、函数参数传递、返回值转移、move关键字和Copy trait等核心内容。"
+++

在Rust中，"move 语义" 涉及将所有权（ownership）从一个变量转移到另一个变量的概念。当将一个值赋给另一个变量时，默认情况下会发生移动操作，这意味着原始变量不再拥有该值，而新变量成为该值的所有者。这种操作可以防止数据竞争和内存安全问题，并在编译时捕获潜在的错误。Move 语义是 Rust 的核心概念之一，有助于确保代码的安全性和并发性，因此，非常有必要单独拎出来强化强化。

----

## 1. 默认移动

默认移动意味着在`Rust`中，当你将一个值分配给另一个新变量或者说作为参数传递到函数中时这个过程使用的是`move`而非`clone`.这代表者该值的所有权也会随之被转移到新的变量中。

考虑下面的代码：

```rust
struct Hi {
    message: String,
}

fn main() {
    let mut h1 = Hi {
        message: String::from("Hello!"),
    };

    let h2 = h1;

    println!("h1:{}", h1.message);
    println!("h2:{}", h2.message);
}
```

![image-20240529110455074](https://images.waer.ltd/notes/image-20240529110455074.png)

上面的代码中，我们创建了一个结构体，在第一步（箭头）中，执行了`h2=h1`时，此时`h1`的所有权就已经被移动到了`h2`中，`h1`随之失效，当我们再次使用`h1`时会编译失败。

![image-20240529110802394](https://images.waer.ltd/notes/image-20240529110802394.png)

> 这些操作都是`Rust`中默认的。

----

## 2. 作为函数参数时

当我们将 `struct `实例作为参数传递给函数时，该 `struct `被移动到函数中。这意味着传递的原始变量不再有效，不能再次使用。

```rust
struct User {
    name: String,
}

fn say(user: User) {
    println!("Hi,{}", user.name);
}

fn main() {
    let user = User {
        name: String::from("马超"),
    };

    say(user);

    println!("user:{:?}", user);
}
```

我们定义了一个`User`结构体，并创建了一个函数`say`，它的参数就是这个结构体。函数功能很简单，就是打印结构体中字段的内容。

在主函数中，构建了`User`结构体之后将它传递给函数使用。这之后，我们尝试打印这个结构体，但是编译无法通过，这是因为我们的结构体的所有权已经转移到了函数中，不能被再次使用。

那么，如果我们还是需要继续这个结构体怎么办呢？可以通过使用引用传递参数的方式，或者说使用`clone`，这样可以避免所有权的转移。

- 传递引用

```rust
#[derive(Debug)]
struct User {
    name: String,
}

fn say(user: &User) {
    println!("Hi,{}", user.name);
}

fn main() {
    let user = User {
        name: String::from("马超"),
    };

    say(&user);

    println!("user:{:?}", user);
}
```

- clone

```rust
#[derive(Debug, Clone)]
struct User {
    name: String,
}

fn say(user: User) {
    println!("Hi,{}", user.name);
}

fn main() {
    let user = User {
        name: String::from("马超"),
    };

    say(user.clone());

    println!("user:{:?}", user);
}
```

---

## 3. 返回中的转移

在Rust中，当一个函数返回一个结构体时，结构体的所有权会从函数的作用域转移到调用作用域。这意味着结构体从函数的作用域移动到调用作用域。以下是一个示例来演示这种行为：

```rust
#[derive(Debug)]
struct MyStruct {
    data: String,
}

fn create_struct() -> MyStruct {
    let data = String::from("Hello");
    MyStruct { data }
}

fn main() {
    let my_struct = create_struct();
    println!("{:?}", my_struct); // 这行代码可以正常工作

    // 下面这行代码会导致编译错误，因为my_struct已经被移动
    // println!("{:?}", my_struct);
}
```

在这个示例中，`create_struct`函数创建一个`MyStruct`实例并返回它。当在`main`函数中将`my_struct`赋值为`create_struct`的返回值时，结构体的所有权转移到了`my_struct`。因此，你可以打印`my_struct`一次，但如果在结构体已经被移动后尝试再次使用`my_struct`，将会导致编译错误。

如果您需要在函数调用后继续使用结构体，可以返回结构体的引用而不是结构体本身。这样，所有权不会被转移，原始结构体仍然有效。

----

## 4. Move关键字

`move`关键字会显式的触发所有权的强制转移。注意，这里说的是转移、而不是复制。

举个`move`在闭包中使用的栗子：

```rust
fn do_sth() {
    let mut x = String::from("Hello");
    let mut y = String::from("World");

    let closure = move || {
        println!("{} {}", x, y);
    };

    closure();

    // println!("x :{}", x);
}

fn main() {
    do_sth();
}
```

> 1. **定义 `do_sth` 函数**：
>    - 函数 `do_sth` 定义了两个可变字符串变量 `x` 和 `y`，分别初始化为 `"Hello"` 和 `"World"`。
> 2. **创建并立即执行带 `move` 的闭包**：
>    - 在 `do_sth` 函数内部，定义了一个匿名闭包（通过 `|| { ... }` 形式）并赋值给了变量 `closure`。
>    - 闭包前面的 `move` 关键字是重点。它指示闭包在其被调用时，会“移动”捕获的变量（在这里是 `x` 和 `y`）的所有权进入闭包内部，而不是仅仅借用它们。这意味着一旦闭包执行完毕，原始变量 `x` 和 `y` 将不再可用，因为它们的所有权已经被转移给了闭包。
>    - 闭包体内的代码是打印 `x` 和 `y` 的内容。
> 3. **调用闭包**：
>    - 通过 `closure();` 来执行这个闭包，输出结果为 `"Hello World"`。
> 4. **注释掉的 println!**：
>    - 之后有一行被注释掉的代码 `// println!("x :{}", x);`。由于闭包使用了 `move`，变量 `x` 和 `y` 的所有权已经被转移给闭包，所以在闭包执行后，尝试访问 `x` 会引发编译错误，因为 `x` 已不再有效。
> 5. **在 `main` 函数中调用 `do_sth`**：
>    - `main` 函数简单调用了 `do_sth()`，执行上述过程。最终程序输出 `"Hello World"`，且不会尝试访问已被移动的变量。

---

## 5. Copy trait

在`Rust`中，某些类型是默认实现了`Copy trait`的，这意味着他们的值在被移动是发生的是复制，源值将保留不变。这些类型包括了诸如整数、浮点、布尔、字符等基本数据类型；

```rust
fn main() {
    let x = 3;
    let y = x;

    println!("x is {}", x);
}
```

上面的代码中，虽然我们执行了`y=x`的赋值操作，但由于基本类型实现了`Copy trait`,所以源值`x`还是3；

与之对比的是没有实现`Copy trait` 的`String`类型；

``rust
fn main() {
    let x = 3;
    let y = x;

    println!("x is {}", x);
}
```

![image-20240529164255374](https://images.waer.ltd/notes/image-20240529164255374.png)

> 在这里， 操作`y = x` 执行后 `x`被移动 。 `x` 移动后不再有效。并且编译报错信息也给出了提示，该类型没有实现`Copy trait`;

注意，任何完全由复制类型组成的类型也是具有`Copy`属性的。 例如：

```rust
#[derive(Debug, Copy, Clone)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let origin = Point { x: 1, y: 2 };

    let point = origin;

    println!("origin is {:?}", origin);
}
```

> 上述例子中，由于结构体中的字段都是`i32`的整型，而整型默认实现了`Copy trait`，此时这个结构体也默认拥有了该特性，当我们执行了`let point = origin;`之后打印`origin`的值依旧是原来的结构体，说明它执行了复制操作。

---

## 6. 小结

`Rust`中采取移动的一些优势：

- 性能：移动不需要值得副本，因此速度很快。
- 内存：如果不移动，则每当传递或者重新分配值时，就需要更多得内存分配；
- 唯一性：移动可以强制保持所有权得惟一，确定在给定时间只有一个变量拥有该值，也为内存安全提供了保证；

 