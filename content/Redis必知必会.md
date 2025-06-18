+++
title="Redis必知必会"
date = 2025-06-17
+++

### 更新日志🎉

2022-10-06

> Redis持久化
>
> - RDB持久化
> - AOF持久化
>- 调整目录结构

2022-09-01

> 本次更新没有内容，就是调整一下目录结构。

2022-06-04 🎉

> - 新增 `Redis`管理命令:trollface:
> - 新增 `Redis`底层实现机制:trollface:
> - 新增配套脑图:trollface:
> - 修正已知错别字词和问题描述:trollface:

2022-08-03🎉

> - 修正已知错别字词句:trollface:
> - 调整文章部分内容的格式:trollface:

2022-8-19🎉

> - 新增Redis高级数据结构和功能部分内容
> - Bitmap
> - HyperLogLog
> - GEO
> - 事务、Lua脚本
> - 发布订阅、Stream
> - Pipeline流水线
> - Redis模块
> - 校对/修复文章内容

---

---

## Redis简洁入门

> 关于 ``Redis``本身的一些语法、命令的使用。

### 简介

> ``Redis``是一款基于键值对的 ``NoSQL``数据库，它的值支持多种数据结构，比如，字符串，哈希，列表，集合，有序集合(``sorted sets``)等。

> ``Redis``将所有的数据都存放在内存中，所以它的读写性能方面堪称秀儿。同时，它还可以将内存中的数据以快照或日志的形式保存在硬盘上，以保证数据的安全性。

> ``Redis``典型的应用场景包括：缓存、排行榜、计数器、社交网络、消息队列等等。

**传送门：**

[官网](https://redis.io/)

[Windows版本下载](https://github.com/microsoftarchive/redis/releases)

### 安装使用(Windows版本演示)

- 下载 ``msi``文件，点击安装，一路 ``next``即可。
- 上一步完事之后将其添加到环境变量。
- 上一步完事之后打开黑窗口。
- 输入 ``redis-cli``回车。
- 如出现下图信息，表示安装成功并且服务以及启动。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15718680738493394672-9be9d203.png)

---

### 简单使用

#### 换库

> 默认内置了16个库(0-15)
>
> 切库命令：``select [索引]``

> 命令

```shell
select 1
```

#### 刷新

> 如果不需要之前的操作数据，执行 ``flushdb``可以将其刷掉。
>
> 命令
>
> ```shell
> flushdb
> ```

#### 字符串

- 存

> 以键值对的形式存储字符串形式的数据，如果需要存储以’-‘连接的字符串，用冒号【:】分隔。
>
> 示例：存储键为text-count，值为1的字符串。
>
> ```shell
> set test:count 1
> ```

- 取

> 获取存储的字符串数据也很简单，一条 ``get``命令即可。
>
> 示例：取到 ``key``为 ``test:count``的 ``value``。
>
> ```shell
> get test:count
> ```
>
> 返回:
>
> ```shell
> "1"
> ```

- 改

> ``redis``支持对存储的字符串数据进行一些基本的修改操作。
>
> 示例:将如上字符串**加一、减一**。
>
> ```shell
> #加一
> incr test:count
> #返回
> 2
> #---------------------
> #减一
> decr test:count
> #返回
> 1
> ```

---

#### 哈希

- 存

> 存储哈希的命令：``hset``
>
> 由于哈希值本身也是kv的形式，所以需要两次进行key_value的输入。
>
> 示例：存于一个id为1,用户名为 ``Tisox``的用户数据，名为【test-user】。
>
> ```shell
> # 存入用户id
> hset test:user id 1
> #提示：表示操作成功的提示
> (integer) 1
> #存入用户名
> hset test:username Tisox
> #提示
> (integer) 1
> #------------------------------
> ```

- 取

> 和字符串存取类似，哈希的取值命令为 ``hget``
>
> 示例：对上述存入的test-user信息进行读取。
>
> ```shell
> #取id
> hget test:user id
> #返回
> "1"
> #-----------------------------------
> #取用户名
> hget test:user username
> # 返回
> "Tisox"
> ```

---

#### 列表

> ``redis``里的列表比较特殊，它存储数据的方式可以从左右两边进行，可以视为一个横向的容器。
>
> 容器的左右两边都可以进行存取操作。并且列表是有序可重复的。

- 存

> 从左边存入：101 102 103
>
> ```shell
> # 从左边存入101 102 103
> lpush test:ids 101 102 103
> # 提示
> (integer) 3
> # 查看其长度
> llen test:ids
> # 返回
> (integer) 3
> ```

- 查

> 列表支持不同的方式进行查看
>
> ```shell
> # 按索引查看
> lindex test:ids 0
> # 返回
> "103"
> lindex test:ids 2
> # 返回
> "101"
> # 按范围查看
> lrange test:ids 0 2
> # 返回
> 1) "103"
> 2) "102"
> 3) "101"
> ```

- 取

> 由于列表的特性，其取值也可以看作是队列或者栈的出队、出栈等操作。
>
> ```shell
> # 从右侧弹出一个值
> lpop test:ids
> #返回
> "101"
> lpop test:ids
> #返回
> "102"
> ```

---

#### 集合

> 集合(sets)，无序且不重复。

- 存

> 往集合中存入一个key为test-language ，值为 ``Java``,``C++``,``Python``的数据。
>
> ```shell
> # 存入
> add  test:language Java C++ Python
> # 提示
> (integer) 3
> # -----------------------------------
> # 统计集合中有多少个元素
> scard test:language
> # 返回 5
> #------------------------------------
> # 从集合中随机弹出一个元素:应用场景：【抽奖业务】
> spop test:language
> # 返回
> "Java"
> spop test:language
> # 返回
> "Python"
> ```

- 查

> 查看集合中的元素
>
> ```shell
> # 查看当前集合中的剩余元素
> smembers test:language
> # 返回
> "C++" # 因为上面已经随机弹出了另外两个数据，所以就剩下了"Python"
> ```

---

#### 有序集合(sorted sets)

> 给每一个存入的值附加一个分数，按照该分数进行排序的集合。

- 存

> 添加学生数据
>
> ```shell
> # 添加学生以及其分数
> zadd test:students 10 aaa 20 bbb 30 ccc 40 ddd 50 eee
> # 提示
> (integer) 5
> # 统计集合元素个数
> zcard test:students
> # 返回
> (integer) 5
> # 查询某个值的分数
> zscore test :students ccc
> # 返回
> "30"
> # 返回目的按照分数排行(0、1、2、3、4.....)
> zrank test:students ccc
> # 返回
> 2
> # 按照排序，取0-2大小的值
> zrange test:students 0 2
> # 返回
> 1) "aaa"
> 2) "bbb"
> 3) "ccc"
> ```

---

#### 全局命令

> 字面意思，这些命令针对全局生效。

```shell
# keys *
keys *
# 返回
1) "test:user"
2) "test:language"
3) "text:count"
4) "test:ids"
5) "test:students"
# ----------------------------------
# keys test*
keys test*
# 返回
1) "test:user"
2) "test:language"
3) "text:count"
4) "test:ids"
5) "test:students"
# ------------------------------------
# 查看类型
type test:user
# 返回
hash
# 查看某个key是否存在
exists test:user
# 返回
1 #表示存在
# 输出key
del test:user
# ---------------------------------------
# 设置有效期：秒为单位，过期自动删除
expire test:students 10
```

## 管理 `Redis`

前面所有的命令都是基于key的基础上进行的，那么又怎样取管理和操作这些key呢？

以下是一些用来管理 `key`的常用命令：这里只作一个列举，不会全部进行演示。

```shell
# 选择库
select index
```

> index为redis库的索引，共有0-15个索引16个库，默认启用第一个库，索引为0。

```shell
# 查看全部的key
keys *
# 通过通配符进行匹配查看
# 查看所有key中以my开头的key
keys my*
```

> 注意，如果数据量很大的情况下，一般不建议直接使用 `keys*`进行查看，该操作的时间复杂度是O(N)，的，数据量太大可能会导致阻塞崩溃。

```shell
# 查看当前库中有多少key
dbsize
```

```shell
# 清理库中的key
flushdb
```

> 这是一个危险且强大的命令，如果使用不当，可能造成将所有的key全部删除，是不可逆的操作，在使用时应该三思。

```shell
# 查看key的数据类型
type key
```

```shell
# 判断某个key是否存在
exists key
```

```shell
# 随机返回一个key
randomkey
```

```shell
# 给key重命名
rename key newkey
```

> 建议在使用时结合 `nx`参数使用。

```shell
# 删除一个或者多个key
del key1 key2 .....
# 或者
unlink key1 key2 ....
```

> `del`带阻塞，`unlink`则没有。

```shell
# 渐进式遍历key
# 基础用法，跟一个整数作为游标，表示从何处开始遍历
scan 0
# 进阶用法
scan 0 match counter* count 10
```

> `counter*`表示匹配的规则，所有以该字符开头的key,
>
> `count`后的数值表示每轮遍历的数量。

> 为了方便演示 `scan`的用法，我们需要有一定数量的key。可以使用 `redis`自带的压力测试工具来生成这些测试数据。
>
> 这个工具存在于 `/usr/bin/redisbenmark`。

```shell
# redisbenchmark的使用命令
redis-benchmark -c 5 -n 100 -r 1000 -a reids密码
```

> 上面的命令中：
>
> `5`表示启动的客户端数量
>
> `100`表示请求数量
>
> `1000`表示插入的数据量
>
> `密码`表示你登录redis客户端的密码

![](https://b3logfile.com/file/2022/08/solo-fetchupload-8142905571278033607-e14b7bcc.png)

*以上就是 `管理redis`部分的全部内容*

---

## Redis底层实现机制

### Redis的对象体系

#### 类型与编码

在redis中，每一种数据类型的底层都是由一种或者多种编码进行实现的，具体如下：

- String

> int
>
> embstr
>
> raw

- list

> ziplist
>
> linkedlist
>
> quicklist

- hash

> ziplist
>
> hashtable

- set

> intset
>
> hashtable

- zset

> ziplist
>
> skiplist

可以看到，某一种编码可以同时应用在不同的数据类型的实现中。

![](https://images.waer.ltd/img/Redis数据结构.png)

#### 查看类型编码

在前面有提到过一个命令：

```shell
type key
```

这是用来查看某个key的数据类型，这里的类型即指的是上面诸如 `String,hash,set....`。而不能查看他们对应源码实现上所用的数据编码。可以通过下面的命令查看：

```shell
object encoding key
```

![](https://b3logfile.com/file/2022/08/solo-fetchupload-4741955633716788992-17fef530.png)

#### 源码结构查看

具体的源码会在下一节中进行展开，这里介绍redis源码的结构。

| 数据结构            | 数据类型         | 数据库            | 服务端与客户端              | 其他                        |
| ------------------- | ---------------- | ----------------- | --------------------------- | --------------------------- |
| 动态字符串sds.c     | 对象object.c     | 数据库db.c        | 事件驱动ae.c,ae_epoll.c     | 主从复制replication.c       |
| 压缩列表ziplist.c   | 字符串t_string.c | 持久化rdb.c,aof.c | 网络连接anet.c,networking.c | 哨兵sentinel.c              |
| 快速列表quicklist.c | 列表t_list.c     |                   | 服务端server.c              | 集群cluster.c               |
| 整数集合intset.c    | 哈希t_hash.c     |                   | 客户端redis-cli.c           | 其他类型hyperloglog.c,geo.c |
| 字典dict.c          | 集合t_set.c      |                   |                             |                             |
|                     | 有序集合t_zset.c |                   |                             |                             |

### 简单动态字符串

#### 概述

> 简单动态字符串(SDS)，是 `Simple Dynamic String`的缩写，是 `Redis`内部自定义实现的一种数据类型。在 `Redis`数据库内部，包含字符串的键值对在底层都是由 `SDS`实现的，它还被用于缓冲区的实现，如 `AOF`缓冲区、客户端的输入缓冲区。

```shell
set text "hello world"
rpush names "john" "lucy" "tony"
sadd users "liubei" "guanyu" "zhangfei"
```

> 诸如上面的类型，底层实现都用到了SDS.

学过或者了解过C语言的都知道，C语言它是有字符串这种数据类型的，那为什么 `Redis`不是直接使用原生的字符串类型，而是自己自定义呢？

- C语言中，其实并没有实现意义上的字符串类型，而是将单个字符串储在 `char`类型的数组中，进而来表示字符串。
- C语言用空字符 `\0`来标记字符串的结束，空字符串不是数字0，它的 `ASCII`码值为0；

从上面的信息中，总结了以下几点原因，导致不能直接使用原生字符串，而是需要自定义。

![](https://images.waer.ltd/img/Redis中为什么不使用原生字符串.png)

- 获取长度的复杂度高：

> C字符串的实现中是不记自身长度的，想要获取字符串的长度就必须遍历整个字符串来统计，这种方式复杂度为 `O(n)`，但要知道，在 `Redis`中，获取字符串的长度是一个操作频繁的需求，因此为了提升性能，必须降低操作的复杂度。

- 内存分配十分频繁：

> 几乎每次修改C字符串，程序就要对保存的这个字符串的数组重新分配一次内存空间。

- 不能保证二进制安全：

> 因为C字符串以空字符串结尾，所以不适合保存二进制数据(内部可能携带空字符串)。

#### 源码实现

> 对源码这里不作深入的研究，只作了解。

> 鉴于几个比较典型的版本来分别看一下他们在 `SDS`的实现的源码中是怎样的逻辑。

- `Redis3.2之前的是实现`

> 下面是v3.0中对sds结构的自定义实现源码：这是sds的头文件sds.h，具体的实现逻辑在sds.c中。

```c
/*sds.h*/
struct sdshdr {
    //已使用的字节数量
    unsigned int len;
    //未使用的字节数量
    unsigned int free;
    //保存字符串的数组
    char buf[];
};
```

```
上面代码的意思大致是这样的，默认会开辟一个buf[]字符数组来存储需要的字符串，该字符数组的长度为
```

`len`的长度加上空闲的空间长度 `free`。`len`用来实时存储并记录当前已使用掉的字符空间，它可以实时的返回字符串的长度，从而可以将获取长度这个操作的复杂度降到常数的 `O(1)`级别。

```
而
```

`free`的作用相当于一个预留空间，这部分空间未必是一开始就能全部用上的，可能会在用户修改字符串数量之后用上，通过这种**空间预分配和惰性空间**释放修改字符串时所需的内存分配次数。

```
此外，SDS不会对buf中的数据作任何的限制，因为它采用len属性来判定字符串是否结束，它依然以空字符(
```

`\0`)结尾，这样其内部可以方便的重用一部分C字符串库中的函数。

**预分配**

> 用于优化增长操作，即不仅为其分配存放字符串所需的空间，还会为其分配一定大小的额外空间，如果修改后的SDS长度小于 `1MB`,则分配的未使用空间与 `len`相同，否则分配的未使用空间为 `1MB`。

**惰性释放**

> 用来优化缩短操作，当检测到SDS缩短时，程序不会立即重新分配内存，而是使用 `free`属性记录这些字节。也就是将缩短后空余出来的空间加到 `free`中，以备下一次增长时使用。

**不足之处**

在该版本的源码实现中，除了具备上述优点之外，也是有不足之处的，比如 `len`，`free`，都是无符号int类型,他们在C语言中一般占用4个字节的空间，但对于较短的字符串来说，这免不了造成了一定空间的浪费。

为什么会这么说，一个 `len`不过4个字节，加上 `free`也不过8个字节，这么就浪费空间了呢？别忘了，在 `Redis`核心中，它的数据一般都是存在内存中的，内存对它来说确实值得 `斤斤计较`,再者，`SDS`实现的数据类型在整个的 `Redis`数据结构中占用的比例是相当大的，当数量达到一定量级，浪费的空间可不是几个字节能搞定的。

附[redis3.0源码地址](https://github.com/redis/redis/tree/3.0/src)

上面提到了这种方案的一些弊端，那么在后续的版本中，自然也得到了优化，毕竟写出 `Redis`的那些大佬可不是盖的，我们能想到的，他们自然也想到了。所以下面是优化后的版本，也就是在 `v3.2`中相同部分的实现源码。

```c
/* Note: sdshdr5 is never used, we just access the flags byte directly.
 * However is here to document the layout of type 5 SDS strings. */
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* used */
    uint8_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
```

主要的优化方向：

> 通过字符串长度，将其分为5种类型，分别为1字节、2字节、4字节、8字节、小于1字节。

```c
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; //使用的字节数量
    uint8_t alloc; //全部的字节数量
    unsigned char flags; //低3位存储类型，高5位预留
    char buf[]; //存放实际的内容
};
```

在 `v3.2`版本的优化中，针对每一个长度定义了不同的结构体处理，还新增了一个 `char` 类型的 `flag`属性。这个属性是用来标记数据类型的，属性占1个字节(8位)，其中3位用来标记类型，剩余的5位作为预留空间待用。

==在处理小于1字节的情况上，它的结构体是定义如下==：

```c
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; //低3位存储类型，高5位存储长度
    char buf[];//存放实际的内容
};
```

==注意到==，这里去掉了 `len`和 `alloc`属性不代表它不存储长度，而是将长度和类型标记合二为一。既然存储的长度小于1字节，那么在8位长度中，用前3位来标记数据类型，后5位存储长度是足够的，因此没必要开辟额外的属性。这样的作法更有效的利用空间。

在每一个结构体的定义中有这样一段修饰符：

```c
__attribute__ ((__packed__))
```

这是用来将结构体中内存的分配规则指定为==按照1字节来对齐==，如此可以进一步的节约内存。而在默认不作处理的情况下，它对结构体内存的分配规则是按照其中各个属性的字节最小公倍数来对齐的，相对比较浪费。

附[Redis3.2源码地址](https://github.com/redis/redis/tree/3.2)

---

### 整数集合

![](https://images.waer.ltd/img/整数集合原理.png)

#### 概述

> 整数集合(intset)是一个有序的、存储整型数据的结构；其中的元素按照值由小到大的顺序排列。
>
> 它可以保存 `int16_t,int32_t,int64_t`类型的整数值，在存储数据时，整数集合可以保证内部不出现重复数据。

#### 源码实现

在 `Redis`中并没有大范围的使用到整数集合这样的编码，只有当一个set只包含整数元素，并且这个set的元素数量不多时，`Redis`才会使用整数集合作为set的底层实现。这个的数量是可以通过配置文件进行配置的。

**集合的升级与降级**

- 升级

> 当添加新的元素，**其类型比现有元素类型都长时**，集合需要先升级再添加。
>
> - 根据新元素的类型，扩展集合底层数组空间，并为新元素分配空间。
> - 将现有元素都转成与新元素相同的类型，并将其存储到正确的位置上。
> - 将新元素添加到数组之内。

- 降级

> 整数集合不支持降级，一旦对数组进行了升级，编码就会一直保持升级的状态。

- 升级的优点:

  > 让一个整数数组同时支持 `int16_t,int32_t,int64_t`,最简单的方法是使用 `int64_t`,但这样显然浪费内存空间，而升级操作可以尽量的节约内存的使用。

- 升级的缺点：

  > 每次向集合中添加数据都可能会引起升级，而每次升级都需要对底层数组中所有的元素进行**类型转换，**所以向集合中添加新元素的时间**复杂度是O(n)**的。

下面是 `v3.2`版本中对该结构的定义；

```c
typedef struct intset {
    uint32_t encoding;//编码类型
    uint32_t length;//元素数量
    int8_t contents[];//元素数组
} intset;
```

注意其中的元素数组的类型虽然声明是 `int8_t`的，但实际上不是说只能存 `int8_t`类型的元素，具体的，在后面的源码中，对它作了一些设计。

在 `intset.c`中：

```c
* INTSET_ENC_INT16 < INTSET_ENC_INT32 < INTSET_ENC_INT64. */
#define INTSET_ENC_INT16 (sizeof(int16_t))
#define INTSET_ENC_INT32 (sizeof(int32_t))
#define INTSET_ENC_INT64 (sizeof(int64_t))
```

也就是说 `contents`数组的实际类型取决于 `encoding`属性的值。

> 1. encoding=INTSET_ENC_INT16->contents存储int16_t类型的值。
> 2. encoding=INTSET_ENC_INT32->contents存储int32_t类型的值。
> 3. encoding=INTSET_ENC_INT64->contents存储int64_t类型的值。

上面的常量定义可以在 `intset.c`中找到。

附[Redis3.2版本源码地址](https://github.com/redis/redis/blob/3.2/src/intset.c)

---

### 字典

![](https://images.waer.ltd/img/字典.png)

> 字典又称散列表，是一种用来**存储键值对**的数据结构。C语言没有内置这种数据结构，所以 `Redis`构建了自己的字典规范。
>
> 字典在 `Redis`中的应用广泛，redis数据库底层就是采用它实现的，字典也是集合，哈希类型的底层实现之一；redis的哨兵模式，就是以字典存储所有的主从节点的。

#### 字典的实现

`Redis`字典实现主要涉及三个结构体：字典、哈希表、哈希表节点。其中，每一个哈希表节点保持一个键值对，每一个哈希表由多个哈希表节点构成，而字典则是对哈希表的进一步封装。看一下哈希表在 `dict.h`中的定义源码：

**dict**

```c
typedef struct dict {
    //字典类型，内置若干特定的操作函数
    dictType *type;
    //该字典特有的私有数据
    void *privdata;
    //哈希表数组，固定长度为2
    dictht ht[2];
    //rehash标识，存储rehash的偏移量，默认-1
    long rehashidx;
    //记录绑定在此字典上，正在运行的迭代器数量
    int iterators;
} dict;
```

**dictht**

```c
typedef struct dictht {
    //节点数组
    dictEntry **table;
    //数组大小
    unsigned long size;
    //掩码(size-1)
    unsigned long sizemask;
    //已用节点数量
    unsigned long used;
} dictht;
```

**dictEntry**

```c
typedef struct dictEntry {
    //键
    void *key;
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;//值
    //下一节点
    struct dictEntry *next;
} dictEntry;
```

大致的结构关系：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15490133664593073653-aae3b9b9.png)

#### 哈希算法

> 关于哈希算法的具体逻辑其实和语言无关，核心思想是类似的。

向字典中添加新的键值对时，程序需要先根据键来计算出对应的一个哈希值，再根据哈希值计算出索引值，最后将此键值对封装在哈希表节点中后，放到节点数组的指定索引上，关键步骤参考如下代码:

```c
// 使用哈希函数计算键的哈希值
hash=dict->type->hashFunction(key);
//使用哈希值和掩码，计算索引值
//等价于哈希值和哈希表容量取余，使用位运算提高效率
index =hash & dict->ht[x].sizemask;
```

> 上面只是一个大体的逻辑关系，具体的源码实现可以参考[dict.c源码](https://github.com/redis/redis/blob/3.2/src/dict.c)

**键冲突问题**

> 1. 当多个键被分配到了节点数组的同一个索引上时，则这些键发生冲突(哈希冲突)。
> 2. 为了解决哈希冲突，`Redis`采用链表来解决冲突，即使用next指针将这些节点链接起来，形成单向链表。
> 3. `Redis`的哈希表中没有设计表尾指针，每次添加新节点时都是将新节点插入到表头的位置，而非表尾追加。

#### ReHASH

> 在 `Redis`中，哈希表的扩容和缩容是通过rehash实现的，执行 `rehash`的大致步骤如下：

1. 为字典的 `ht[1]`哈希表分配内存空间。
   1. 如果是执行扩容操作，则 `ht[1]`的大小为第一个大于等于 `ht[0].used*2`的$2^{n}$
   2. 如果执行的是缩容操作，则 `ht[1]`的大小为第一个小于等于 `ht[0].used`的$2^{n}$
2. 将存储在 `ht[0]`中的数据迁移到 `ht[1]`上。
   1. 重新计算键的哈希和索引，然后将键值对放置到 `ht[1]`哈希表的指定位置上。
3. 将字典的 `ht[1]`哈希表晋升为默认哈希表
   1. 迁移完成后，清空 `ht[0]`，再交换 `ht[0]`和 `ht[1]`的值，为下一次 `REHASH`做准备。

触发rehash的条件：

> 1. 服务器目前没有执行 `bgsave`或者 `bgrewriteof`命令，并且哈希表的负载因子大于1；
> 2. 服务器正在执行上述两个命令，且哈希表的负载因子大于等于5

只要满足上面两个条件之一，就会触发rehash。

其中，负载因子的计算公式：$load_factor=\frac{ht[0].used}{ht[0].size}$

另外，当哈希表的负载因子小于0.1时，程序会自动开始对哈希表执行收缩操作。

**rehash的详细步骤**

为了避免rehash对服务器性能造成影响，rehash操作不是一次性完成，而是渐进式的分为多次进行。详细过程如下：

1. 为 `ht[1]`分配空间，让字典同时持有 `ht[0]`和 `ht[1]`两个哈希表。
2. 将字典中的索引计数器 `rehashidx`设置为0,表示将开始 `rehash`操作。
3. 在 `rehash`期间，每次对字典执行添加、删除、修改、查找等操作时，程序除了执行指定的操作之外，还会顺带将 `ht[0]`中位于 `rehashidx`上所有的键值对迁移到 `ht[1]`中，再将 `rehashidx`的值加一。
4. 随着字典不断被访问，最终在某个时刻，`ht[0]`上所有的键值对都被迁移到 `ht[1]`上，此时程序将 `rehashidx`属性值设置为-1，标识 `rehash`操作完成。

**rehash期间的访问规则**

> 在rehash期间啊，字典会同时持有两个哈希表，此时的访问将按照下面的规则进行处理：

1. 新添加的键值对，一律被保存在 `ht[1]`中；
2. 其他诸如删除、修改、查找等操作会同时在两个哈希表上进行，即程序会先尝试在 `ht[0]`中访问要操作的数据，如果不存在则添加到 `ht[1]`中访问，再对访问到的数据做相应的处理。

![](https://images.waer.ltd/img/字典与rehash.png)

---

### 链表

> 链表(`LinkedList`)是一种有序的数据结构，且增删效率较高，同样，C语言中也是没有内置该种数据结构的， 所以 `Redis`构建了自己的链表实现。

链表在 `Redis`中应用广泛：

> - 作为列表的底层实现之一；
> - 发布与订阅、慢查询、监视器等功能也用到了链表；
> - `Redis`服务器采用链表保存多个客户端的状态信息；
> - `Redis`客户端输出缓冲区是在链表的基础上实现的；

#### 链表的结构实现

> 链表的实现主要涉及两个结构体，定义如下，下面的源码也可以在 `adlist.h`中找到：

```c
typedef struct listNode {
    //前驱节点
    struct listNode *prev;
    //后继节点
    struct listNode *next;
    //节点的值
    void *value;
} listNode;
```

```c
typedef struct list {
    //头结点
    listNode *head;
    //尾节点
    listNode *tail;
    //复制节点
    void *(*dup)(void *ptr);
    //释放节点
    void (*free)(void *ptr);
    //比较节点的值
    int (*match)(void *ptr, void *key);
    //节点数量
    unsigned long len;
} list;
```

链表(双端链表)也算是比较基础的一种数据结构类型了，这里不再赘述。

---

### 压缩列表

> 压缩列表(ziplist)，是 `Redis`为了节约内存而设计的一种线性数据结构，它是由一系列具有特殊编码的连续内存块构成；一个压缩列表可以包含任意多个节点，每个节点可以保存一个字节数组或者一个整数值。

在 `Redis`中，列表、哈希、有序集合都直接或者间接的使用了压缩列表。

#### 压缩列表的实现

压缩列表相对来说，是一种比较复杂的结构，下面是它的结构示意图：

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3542764156159951676-8655c71b.png)

**组成说明：**

![](https://b3logfile.com/file/2022/08/solo-fetchupload-13068101954839675270-3be5f3c0.png)

**节点构成**

![](https://b3logfile.com/file/2022/08/solo-fetchupload-2328242434026149105-73b41d3b.png)

**previous_entry_length**

该属性以字节为单位，记录当前节点的前一节点的长度，其自身占据1字节或5字节：

1. 如果前一节点的长度小于254字节，则“pel”属性的长度为1字节，前一节点的长度就保存

在这一个字节内；

2. 如果前一节点的长度达到254字节，则“pel”属性的长度为5字节，其中第一个字节被设置

为0xFE，之后的四个字节用来保存前一节点的长度；

基于“pel”属性，程序便可以通过指针运算，根据当前节点的起始地址计算出前一节点的起始

地址，从而实现从表尾向表头的遍历操作。

content属性负责保存节点的值（字节数组或整数），其类型和长度则由encoding属性决定。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-12147610790668578545-357227d7.png)

#### 压缩列表的连锁更新

- 添加引起的连锁更新

  - e1~en节点长度介于250-253字节之间。
  - 将一个长度大于等于254字节的节点new添加到表头

  ![](https://b3logfile.com/file/2022/08/solo-fetchupload-1708813867418129375-24240af5.png)

- 删除引起的连锁更新

  - e1~en节点的长度均介于250字节~253字节之间；
  - big节点长度大于等于254，small节点长度小于254，将small节点删除；

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18257202356962324488-edea3371.png)

#### 连锁更新的影响

- 最坏情况下，连锁更新需要对压缩列表执行N次空间的重新分配
- 每次分配的最坏情况复杂度为 `O(N)`,所以连锁更新的最坏复杂度为$O(N^{2})$

> 连锁更新出现的概率很低，压缩列表中需要恰好有多个连续的，长度介于250-253字节的节点；适当控制节点的数量可以消除这种影响，即便出现连锁更新，对性能也不会造成任何影响。

![](https://images.waer.ltd/img/压缩列表.png)

---

### 快速列表

#### 概述

> 快速列表(quicklist)是 `Redis3.2`新引入的数据结构，该结构是链表和压缩列表的结合；
>
> 快速列表中的每个节点是一个压缩列表，这种设计能够在时间效率和空间效率之间实现较好的折中。

在 `v3.2`之前，列表类型是采用压缩列表以及双向链表实现的，但 `v3.2`开始，改用了快速列表作为底层的唯一实现。

#### 快速列表的实现

> 下面的结构定义源码在 `quicklist.h`中可以找到。

```c
typedef struct quicklistNode {
    //前驱节点
    struct quicklistNode *prev;
    //后继节点
    struct quicklistNode *next;
    //ziplist
    unsigned char *zl;
    //ziplist的字节数量
    unsigned int sz;
    //ziplist的元素个数
    unsigned int count : 16;
   //编码方式(RAW==1,LZF==2)
    unsigned int encoding : 2;
    //容器类型(NONE==1 or ZIPLIST==2)
    unsigned int container : 2;
    //该节点是否被压缩
    unsigned int recompress : 1;
    //用于测试期间的验证
    unsigned int attempted_compress : 1;
    //预留字段
    unsigned int extra : 10;
} quicklistNode;
```

```c
typedef struct quicklist {
    //头结点
    quicklistNode *head;
    //尾节点
    quicklistNode *tail;
    //压缩列表的元素总数
    unsigned long count;
    //快速列表的节点个数
    unsigned int len;
    //单个节点的填充因子
    int fill : 16;
    //不参与压缩的节点个数
    unsigned int compress : 16; /* depth of end nodes not to compress;0=off */
} quicklist;
```

简单的说，快速列表是由一个带有头尾节点等属性构成的列表，列表每一个元素又是一条双向链表构成，双向链表的每一个元素再由一个个的压缩列表组成。

#### 压缩数据的机制

为了进一步降低 `ziplist`占用的内存空间，`Redis`允许采用 `LZF`算法对 `ziplist`进行压缩。该算法的基本思想是，如果数据与前面出现重复的，记录重复位置以及长度，否则直接记录原始数据，压缩后的数据分为多个片段，每个片段包括解释字段和数据字段两个部分，其中数据字段可能不存在。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-6465232837391552858-14f3dbc8.png)

---

### 跳跃表

#### 概述

> 有序集合的底层可以采用数组、链表、平衡树等结构来实现。数组不便于元素的插入和删除，链表的查询效率低平衡树/红黑树的效率高但是实现复杂；
>
> `Redis`采用跳跃表(skiplist)来作为有序集合的一种实现方案，跳跃表的查询复杂度平均为$O(log^{N})$,效率堪比红黑树，实现上却比红黑树简单很多。

#### 跳跃表的实现

提到跳跃表之前，先看一下普通链表，链表的插入、删除复杂度为$O(1)$,而查找的复杂度为$O(N)$;明显查找的效率成本是比较高的，特别是在数据量很大的情况下。

![image-20220419171135748](https://b3logfile.com/file/2022/08/solo-fetchupload-9381234620865177275-6fe7e6df.png)

> 比如在上面的这条链表中查找值为60的节点，就需要遍历前面5个节点，这也是就效率拉跨的原因。

而跳跃表的实现原理就是从链表中选取一部分的节点，组成一个新的链表，并以此作为原始链表的一级索引。

再从一级索引中选取部分节点组成一个新链表作为原始链表的二级索引，以此递归。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-14360181100709264284-f94fa7c6.png)

> 有了这个结构之后，我们在查找某个节点元素的时候，就会由原来的遍历几乎所有节点变成遍历部分节点甚至无需遍历，直接根据索引定位元素，这样的操作效率会高很多。
>
> 就上图来说，同样是查找60这个节点，在链表中需要遍历前面5个节点，而在跳跃表中只需要三次。

跳跃表中查找元素会优先从高层开始查找，若 `next`节点值大于目标值，或 `next`指针指向 `null`，则从当前节点下降一层继续往后找。比如 `L2->L1->L0`

跳跃表的实现主要涉及两个结构体：`zskiplist`,`zskiplistNode`,在 `v3.0`版本之前，他们被定义在 `redis.h`中，该版本之后，被改为在 `server.h`中。

```c
typedef struct zskiplistNode {
    // 节点数据
    sds ele;
    // 节点分值
    double score;
    // 后退指针
    struct zskiplistNode *backward;
    // 层级数组（各节点不一样）
    struct zskiplistLevel {
    // 前进指针
    struct zskiplistNode *forward;
    // 跨度（节点间的距离，用于计算排名）
    unsigned long span;
    } level[];
} zskiplistNode;
```

```c
typedef struct zskiplist {
    // 表头指针、表尾指针
    struct zskiplistNode *header, *tail;
    // 跳跃表的长度（除表头之外的节点总数）
    unsigned long length;
    // 跳跃表的高度（除表头之外的最高层数）
    int level;
} zskiplist;
```

可以借助下面的结构图来理解。

![](https://b3logfile.com/file/2022/08/solo-fetchupload-1267573584945415792-d266d494.png)

> 1. 节点层高的范围是[1,ZSKIP_MAXLEVEL]，在Redis 6中层高的最大值为32；
> 2. 头节点是特殊节点，它的层高为32，不存储数据和分值，也不计入跳跃表的总长度和高度；
> 3. 创建节点时，程序会生成一个[1,32)之间的随机值作为该节点的层高，**并且生成算法符合幂次定律，**
>
> **即越大的数出现的概率越小。**

#### 小结

1. 跳跃表由多层构成，它的每一层都是一个有序链表，数据依次递增；
2. 跳跃表有一个头节点，它是一个32层的结构，内部不存储实际数据；
3. 跳跃表包含有头尾指针，分别指向跳跃表的第一个和最后一个节点；
4. 除头节点外，层数最多的节点的层高为跳跃表的高度；
5. 除头节点外，一个元素在上层有序链表中出现，则它一定能够会在下层有序链表中出现；
6. 跳跃表每层的最后一个节点指向NULL；
7. 最底层的有序链表包含所有的节点，最底层的节点个数为跳跃表的长度；
8. 每个节点包含一个后退指针，头节点和第一个节点指向NULL，其他节点指向最底层的前一节点。

---

### Redis对象的底层实现

#### 概述

> 1. `Redis`数据库中的键值对用对象来表示，键是一个对象，值也是一个对象,使用了 `redisObject`结构来表示一个对象，该结构的源码如下：

```c
// redis.h, server.h
typedef struct redisObject {
    unsigned type:4; // 对象类型
    unsigned encoding:4; // 对象编码
    unsigned lru:LRU_BITS; // 访问时间
    int refcount; // 引用计数
    void *ptr; // 指向底层数据结构
} robj;
```

#### 对象的类型

![](https://b3logfile.com/file/2022/08/solo-fetchupload-15214922292377603851-a4f92b5e.png)

#### 对象的编码

![](https://b3logfile.com/file/2022/08/solo-fetchupload-17167900588883492109-69a0901e.png)

#### 对象的访问时间

1. `lru`属性用于记录对象最后一次被程序访问的时间，可用来实现缓存淘汰策略；
2. `OBJECT IDLETIME`命令可以打印出某个键的空闲时间，该事件由 `lru`计算而来。

> OBJECT IDELTIME命令的实现是比较特殊的，通过该命令访问键时，不会修改其 `lru`属性。

#### 对象的引用计数

`refcount`属性用于记录对象的引用次数：

- 在创建一个新对象时，引用计数的值会被初始化为1
- 当对象被一个新程序使用时，它的引用计数值为加1
- 当对象不再被某个程序使用时，它的引用计数会减1
- 当对象的引用计数值变为0时，它所占用的内存空间将会被释放。

对象的引用计数可用于实现对象的内存回收以及对象共享功能。

> `Redis`会在初始化服务器时，创建一万个字符串对象，这些对象包含了从0到9999的所有整数值。当服务器需要用到值为0到9999的字符串对象时，就会使用这些共享对象，而不是创建新的对象。

---

### Redis对象的类型与编码

#### 字符串

![](https://b3logfile.com/file/2022/08/solo-fetchupload-7364565992217828706-8d503093.png)

- `embstr`和 `raw`编码都采用 `SDS`来存储字符串。
- `raw`编码会调用2次内存分配函数，分配两块内存空间，分别存储 `redisObject`和 `SDS`结构。
- `embstr`编码只调用1次内存分配，分配一块内存空间，连续存储 `redisObject`和 `SDS`结构。
- 浮点数在 `redis`中也是作为字符串来存储的，在需要的时候，程序会将字符串值直接转换回浮点数。
- `redis`没有为 `embstr`编码的字符串提供修改函数，所以该编码的字符串实际是只读的，对 `embstr`编码的字符串执行修改时，程序会将字符串从 `embstr`转换为 `raw`，再执行修改操作。

![](https://images.waer.ltd/img/字符串编码与实现.png)

#### 哈希

- 哈希对象的编码可以是 `zipllist`或者 `hashtable`；

- 同时满足下面条件时，哈希对象采用 `ziplist`编码，否则采用 `hashtable`编码。

  - 哈希对象保存的所有键值对中的键和值，其字符串长度都小于64字节。
  - 哈希对象保存的键值对数量小于512个。

- 可以在 `redis`配置文件中通过下面的配置修改上述的触发条件。

  ```shell
  hash-max-ziplist-value
  hash-max-ziplist-entries
  ```

  **ziplist编码采用压缩列表作为底层实现，hashtable编码采用字典作为底层实现。**

![](https://images.waer.ltd/img/哈希结构与编码.png)

#### 列表

> 在3.2版本之前，列表对象的编码可以是 `ziplist`或者 `linkedlist`；在同时满足下列条件时，列表对象采用 `ziplist`编码实现，否则采用 `linkedlist`编码。

- 列表对象保存的所有字符串元素长度都小于64字节。
- 列表对象保存的元素数量小于512个。

> 同样可以在 `redis`配置文件中通过下面的配置修改上述的触发条件

```shell
hash-max-ziplist-value
hash-max-ziplist-entries
```

> 从3.2开始，列表对象的编码升级为 `quicklist`；

**ziplist、linkedlist、quicklist编码分别采用压缩列表、双端链表、快速列表作为底层实现**

![](https://images.waer.ltd/img/列表结构与编码.png)

#### 集合

> 集合对象的编码可以是 `intset`或者 `hashtable`；
>
> 同时满足下面条件时，集合对象采用 `intset`编码，否则采用 `hashtable`编码；

- 集合对象保存的元素都是整数值。
- 集合对象保存的元素不超过512个。

> 可以通过修改 `set-max-intset-entries`选项改变上述条件。

**intset编码采用整数集合作为底层实现，hashtable编码采用字典作为底层实现，字典的键存储字符串，字典的值全部为NULL**

#### 有序集合

> 有序集合对象的编码可以时 `ziplist`或者 `skipllist`；
>
> 同时满足下面条件时使用 `ziplist`编码，否则使用 `skiplist`编码。

- 有序集合保存的元素数量不超过128个。
- 有序集合保存的所有元素的成员长度都小于64字节。

> 可以通过修改 `zset-max-ziplist-entries,zset-max-ziplist-value`改变上述条件。

**ziplist编码底层采用压缩列表实现，skiplist底层采用zset结构实现**

```c
typeof struct zset{
    //字典，保存了从成员到分值的映射关系
    dict *dict;
    //跳跃表，按分值由小到大保存所有集合元素
    zskiplist *zsl;
}zset;
```

![](https://images.waer.ltd/img/集合.png)

### Redis的线程模型

#### 单线程的redis

`redis`是单线程的，主要是指 `redis`的网络IO和键值对读写是由一个线程来完成的。

而 `redis`的其他功能，比如持久化、异步删除、集群数据同步等，则是依赖其他线程来执行的。

所以说关于 `redis`是单线程这个问题不能一口咬定，需要了解它背后的原因。

> 除了redis之外，像Nginx、Node.js也是单线程的，但他们也都是高性能的服务器。

#### 为什么采用单线程

- 单线程的优势：
  - 单线程可以简化数据结构和算法的实现。
  - 对于服务器端程序来说，线程切换和锁通常是性能杀手，而单线程避免了线程切换和竞争所产生的消耗。
- 单线程的劣势：
  - 如果某个命令执行时间过长，会造成其他命令的阻塞，对于redis这种高性能的服务器来说这是致命的。

`redis`的大部分操作是在内存上完成的，这是它实现高性能的一个重要原因，其次，它还采用了IO多路复用的机制，使得它在网络IO操作中能并发的处理大量的客户端请求，实现高吞吐率。

**redis单线程IO模型示意图**

![](https://b3logfile.com/file/2022/08/solo-fetchupload-3366639650907358298-92951f51.png)

> 由图可知，它的单线程主要是指在**文件事件分派器**这部分的实现上。

![](https://images.waer.ltd/img/Redis线程模型.png)

---

## 高级数据结构和功能

### Bitmap

![](https://images.waer.ltd/img/Bitmap%E4%BD%8D%E5%9B%BE.png)

#### 基本概念

* `Bitmap`本身不是一种数据类型，它实际上就是前面学过的字符串，但他可以对字符串进行按位的操作。
* `redis`为`Bitmap`单独提供了一套命令，所以使用`Bitmap`与使用普通字符串的方式不同。
* **可以把**`Bitmap`看作是一个以位为单位的数组，数组的每个单元只能存储0和1，数组的下标叫做偏移量。

![](https://images.waer.ltd/img/20220422160439.png)

**当用户执行命令尝试对一个**`bitmap`进行设置的时候，如果该`bitmap`不存在，或者大小不满足用户想要执行的设置操作，`redis`则会对被设置的`bitmap`进行扩展，使得`bitmap`可以满足用户的设置需求。

`redis`对`bitmap`的扩展操作是以字节为单位进行的，所以扩展后的位图包含的二进制数量可能会比用户需要的稍微多一些，并且在扩展`bitmap`的同时，`redis`还会将所有为未被设置的二进制的值初始化为0。

#### 常用命令

* **setbit命令**

> **给bit设置键值对，注意bit是按位操作的，设置的时候是通过索引将指定位设置为1或者0.**

```
# 假设我们将下面的数据的末位都设置为1
00000001 00000001 00000001 00000001
setbit bitmap1 7 1
setbit bitmap1 15 1
setbit bitmap1 23 1
setbit bitmap1 31 1
```

> **一个字节等于8位。**

![image-20220422162449303](https://b3logfile.com/file/2022/08/solo-fetchupload-6349124328389551436-f51bd740.png)

* **getbit命令**

> **一般情况下，有set，自然有get,该命令用来获取指定索引处的值。**

```
# 获取索引为 7 15 4的值
getbit bitmap1 7
getbit bitmap1 15
getbit bitmap1 4
```

![image-20220422162836255](https://b3logfile.com/file/2022/08/solo-fetchupload-2268966638942972624-e0ecbe62.png)

* **bitcount命令**

> **用来统计指定key上1的个数，也可以统计指定的范围。**

```
# 统计bitmap1上1的个数
bitcount bitmap1
# 统计bitmap1上 0到1位置的1的个数，
bitcount bitmap1 0 1
# 统计bitmap1上倒数第一和第2个字节上1的个数
bitcount bitmap1 -2 -1
```

![image-20220422164018148](https://b3logfile.com/file/2022/08/solo-fetchupload-16060851603572119256-1e672969.png)

> **解释一下，这里的索引指是以字节为单位的，某个字节上值为1的位的个数。而不是每个字节位的索引。**

* **bitpos命令**

> **返回字符串中设置为 1 或 0 的第一位的位置。注意是第一个位置。**

```
BITPOS key bit [ start [ end [ BYTE | BIT]]]
# 返回整个bitmap1上值位为1的索引位置。
bitpos bitmap1 1
# 返回bitmap1上1到3范围内位值为1的位置
# 比如00000001 00000001 00000001 00000001中以字节为单位的索引分别是0 1 2 3
bitpos bitmap1 1 1 3
# 上面命令返回00000001 00000001 00000001中首个出现1的位置，那就是字节单位为1-3中位为单位索引的第15也即是第二个00000001中1的索引位置，即15
```

![image-20220422164647801](https://b3logfile.com/file/2022/08/solo-fetchupload-12834835531903324739-c2d239cf.png)

* **bitop命令**

> **在多个键（包含字符串值）之间进行位操作，并将结果存储在目标键中。**

```
BITOP operation destkey key [key ...]
# 将bitmap1和bitmap2进行或运算之后的结果存储在bitmap3中。
bitop or bitmap3 bitmap1 bitmap2
```

> **bitmap1: 00000001 00000001 00000001 00000001**
>
> **bitmap2: 10000000 10000000 10000000 10000000**
>
> **结果:**		**10000001 10000001  10000001 10000001**

![image-20220422170805331](https://b3logfile.com/file/2022/08/solo-fetchupload-5166212872315137887-0648b8fc.png)

> **其他如按位与，非，异或可以去官方文档查看。**

#### 应用场景据举例

* **记录用户一年的签到数据：**
  * **示例：user:9527:2022->00101101 10010001 ……..**
  * **说明：从第一天开始，以天数为索引记录，0表示未签，1表示已签，记录一年的数据只需要368位(64字节)即可。**

---

### HyperLogLog

![](https://images.waer.ltd/img/HyperLogLog.png)

#### 简介

**同样，它也不是新的数据类型，本质还是字符串类型。**

`HyperLogLog`是一个专门为了计算集合的基数而创建的概率算法，其优点在于它十分的节约内存空间；

**只需要**`12KB`的内存就可以对**2^{64}**个元素进行计数，其标准误差为`0.81%`。

#### 常用命令

* **pfadd命令**

> PFADD key [element [element ...]]
>
> **向指定key中添加一个或者多个元素。**

```
# 向hlll 中添加1  2 3
pfadd hlll 1 2 3
```

* **pfcount命令**

PFCOUNT key [key ...]

> **返回指定key中元素的统计个数，如果key不存在返回0.注意返回的结果是去重后的计数。**

```
# 统计key为hlll的基数
pfcount hlll
```

* **pfmerge命令**

> PFMERGE destkey sourcekey [sourcekey ...]
>
> **将多个key值合并到指定的key中。**

![](https://images.waer.ltd/img/20220423173316.png)

#### HyperLogLog的使用场景

**统计网站的独立访客（UV）：**

**示例：uv:20200101 -> 1.1.1.101, 1.1.1.102, 1.1.1.103, 1.1.1.102, 1.1.1.103, ...**

**说明：每当用户来访时，都通过HLL记录他的IP，可以统计出每个数据集的基数，也可以对多个数据集进行合并！**

**使用set集合也可以实现同样的功能，但在内存的使用率上却不是一个等级的。**

> **假设网站每天的UV为1000万。**

![](https://images.waer.ltd/img/20220423151729.png)

> **通过上表不难感受到，当时间达到一定程度时，对空间的需求差别是非常大的。**

### GEO

![](https://images.waer.ltd/img/GEO.png)

#### 概述

* `GEO`是`redis`在`3.2`版本中新增的功能，该功能允许用户将经纬度格式的地理坐标存储到redis中，并对这些坐标执行基于距离的计算以及范围查找等功能。
* `redis`为`GEO`功能提供了一系列的命令，通过这些命令可以实现：
  * **将位置的名称以及他们的经纬度存储到集合中。**
  * **根据给定的位置名称，从位置集合中抽取与之对应的经纬度。**
  * **计算两个位置之间的直线距离。**
  * **根据给定的经纬度或者位置，找出以该位置为中心，指定半径范围内的其他位置。**

> **GEO不是一种新的数据类型，它的本质其实还是有序集合。通过GEO命令存储地理数据时，redis会将经纬度转换成一个geohash值，并以该值为分数，以位置名称为成员，将数据存入一个有序集合中。**

#### 常用命令

**约定**

> **为了方便演示，下面的地理坐标均为浙江省杭州市的真实经纬度数据，演示将使用这些准备好的数据进行。**

```
# 杭州西湖
120.12199 30.226122 xihu
# 余杭区
119.987408 30.275946 yuhang
# 临安区
119.719616 30.24036 linan
# 萧山区
120.263439 30.184583 xiaoshan
# 临平区
120.300518 30.422897 linping
# 柯桥区
120.300518 30.413423 keqiao
```

**坐标数据可以去这里获取**[地理经纬度查询](https://www.bejson.com/convert/map/)

* **geoadd命令**

> GEOADD key [ NX | XX] [CH] longitude latitude member [ longitude latitude member ...]
>
> **向集合中添加一个或多个经纬度地理数据。**

```
# 以杭州为key，将上述几个坐标添加到集合中。
geoadd hangzhou 经度 纬度 对应的地名
```

![](https://images.waer.ltd/img/20220424163814.png)

* **geopos命令**

> GEOPOS key member [member ...]
>
> **返回指定key的地名的经纬度数据。**

```
# 返回上述地理位置的全部经纬度数据
geopos hangzhou xihu yuhang linan xiaoshan linping keqiao
```

![](https://images.waer.ltd/img/20220424164644.png)

* **geodist命令**

> GEODIST key member1 member2 [ M | KM | FT | MI]
>
> **返回两个地名之间的距离，可以指定距离的单位。可以指定距离单位米、千米、英里、英尺**

```
# 返回西湖到萧山之间的距离,默认单位为米
geodist hangzhou xihu xiaoshan
```

![](https://images.waer.ltd/img/20220424170009.png)

* **georadius命令**

> GEORADIUS key longitude latitude radius M | KM | FT | MI [WITHCOORD] [WITHDIST] [WITHHASH] [ COUNT count [ANY]] [ ASC | DESC] [STORE key] [STOREDIST key]
>
> **返回指定位置半径范围内的地名。**

```
# 返回西湖200千米半径范围内的其他地名
georadius hangzhou 120.12199 30.226122 200 km
# 指定返回值中携带对应地名的经纬度数据
georadius hangzhou 120.12199 30.226122 200 km  withcoord
# 指定返回值中携带对应地名的经纬度数据并限定返回的数据条数为3
georadius hangzhou 120.12199 30.226122 200 km  withcoord count 3
```

![](https://images.waer.ltd/img/20220424171403.png)

![](https://images.waer.ltd/img/20220424171417.png)

![](https://images.waer.ltd/img/20220424171912.png)

* **georadiusbymember命令**

> GEORADIUSBYMEMBER key member radius M | KM | FT | MI [WITHCOORD] [WITHDIST] [WITHHASH] [ COUNT count [ANY]] [ ASC | DESC] [STORE key] [STOREDIST key]
>
> **命令和上一个命令的作用是一样的，不过这是通过指定地名进行返回，而上一个命令是通过指定经纬度返回。**

![](https://images.waer.ltd/img/20220424172326.png)

* **geohash命令**

> GEOHASH key member [member ...]
>
> **返回指定位置的地理经纬度的哈希值。**

![](https://images.waer.ltd/img/20220424172502.png)

**既然geo的本质是有序集合，那么使用有序集合的命令也可以操作geo数据。**

![](https://images.waer.ltd/img/20220424172926.png)

---

### 发布订阅

![](https://images.waer.ltd/img/%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85.png)

#### 概述

`redis`提供了基于**发布/订阅**模式的消息机制，此模式下，消息的发布者和订阅者不直接通信，发布者只是将消息发布到指定的频道上，而订阅该频道的每个客户端都可以接收到这个消息；

**当客户端新订阅某个频道时，它无法接收该频道之前的消息，因为**`redis`不会对发布的消息进行持久化。

#### 常用命令

> **为了方便演示，我将同时打开多个(3个)**`redis`客户端，将当前的客户端作为发布者，其他三个客户端作为订阅者，演示发布/订阅的基本使用。

* **publish命令**

> PUBLISH channel message
>
> **发布者用来发布一个消息，会自动创建消息的主题。**

```
# 在Java的新闻主题中发布一条消息
publish news:java "hello java"
# 在js的新闻主题中发布一条消息
publish news:js "javascript"
```

![](https://images.waer.ltd/img/20220424194249.png)

* **subscribe命令**

> SUBSCRIBE pattern [ pattern ...]
>
> **用在订阅端订阅发布者的内容，完成订阅之后会自动进入阻塞状态，等待接收发布者发布的消息。**

```
# 在客户端1中订阅上面发布的Java主题消息。
subscribe news:java
# 在客户端2中订阅上面发布的js主题消息。
subscribe news:java
```

![](https://images.waer.ltd/img/20220424195046.png)

**接下来我们在发布者客户端发一条消息试试。**

```
publish news:java "This is java"
```

> **可以看到，当我发布成功之后，有订阅的两个客户端会收到消息提示。**

![](https://images.waer.ltd/img/20220424195232.png)

![](https://images.waer.ltd/img/20220424195349.png)

> **在订阅者中的**`(Integer) 1`代表该客户端的订阅数。而在发布者中这代表收到该条发布消息的客户端数量。

* **psubscribe命令**

> PSUBSCRIBE pattern [ pattern ...]
>
> **和上一个命令类似，也是用在客户端订阅中，不同的是，该命令支持模式匹配订阅，可以通过通配符的形式同时订阅多个主题的消息。**

```
# 在客户端3中通过模式匹配同时订阅前面的两个主题(java和js)主题
psubscribe news:*
```

![](https://images.waer.ltd/img/20220424200155.png)

**此时我们通过发布者客户端发布的消息在客户端3中都能收到。**

![](https://images.waer.ltd/img/20220424200317.png)

* **pubsub命令**

> PUBSUB CHANNELS [pattern]
>
> **返回主题列表。**

```
# 看看与news相关的订阅有哪些。
pubsub channels newws*
# numsub 参数，返回指定主题被订阅数（非模式订阅）
# numpat 参数 返回指定主题被订阅数，模式订阅
```

![](https://images.waer.ltd/img/20220424203814.png)

* **unsubscribe命令**

> UNSUBSCRIBE [channel [channel ...]]
>
> **取消订阅。该命令某些客户端中无法生效。**

```
# 取消订阅news:js
unsubscribe news:js
```

#### 应用场景

* **广播系统**
  * **用户订阅某项服务，当该服务的作者发布内容时，这些订阅的用户可以得到即时的消息通知。**
* **消息队列**
  * **可以用于多个业务/系统之间的通信，如A系统处理了某项业务，可以通过发布消息的方式通知B系统。**

---

### Stream(1)

![](https://images.waer.ltd/img/Redis%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97.png)

#### 概述

> **Stream是Redis 5.0新增加的数据类型，它是一个功能强大的、支持多播的、可持久化的消息队列。**

![](https://images.waer.ltd/img/20220425181450.png)

> **在Stream出现之前，redis中可以用来实现消息队列的方式主要有：**

1. **列表**
   1. **优点：可以快速的将新消息追到列表的尾部并且支持阻塞模式。**
   2. **缺点：如果要查找包含指定数据的元素，或者进行范围查找，需要遍历整个列表。**
2. **有序集合**
   1. **优点：可以有效的进行范围查找，适合实现延时队列。**
   2. **缺点：不支持阻塞模式。**
3. **发布订阅：**
   1. **优点：可以将消息发送给多个客户端，并且支持阻塞模式。**
   2. **缺点：发送即忘的策略会导致离线的客户端丢失消息，所以无法实现可靠的消息队列。**

#### Stream的特征

* `Stream`是一个消息链表，它将所有加入的消息都串接起来，每个消息都有一个唯一的ID
* `Stream`中的消息可以持久化，`Redis`重启之后消息不会丢失。
* `Stream`可以挂载多个消费组，每个消费都有一个游标，用于标识当前消费组的消费进度。
* `Stream`中消费组的状态是独立的，互相不影受响，即同一流内的消息会被多个消费组共享。
* **消费组可以挂载多个消费者，这些消费者之间是竞争关系，任意消费者处理了消息都会使得游标向后移动。**
* **消费者内部有个状态变量**`PEL`(`Pending Entries List`),它记录了当前已被客户端读取的消息。

#### 常用命令

> **演示之前，先开启多个客户端，方便演示生产者/消费者模式。**

* **xadd命令**

> XADD key [NOMKSTREAM] [ MAXLEN | MINID [ = | ~] threshold [LIMIT count]] * | id field value [ field value ...]
>
> **往Stream流里添加一条或者多条消息。**

```
# 向流中写入用户信息。
xadd mystream * name lisi age 23 .....
# 这里的*代表该消息的ID我使用系统自己生成的ID，它的格式是：时间戳-序号
```

![](https://images.waer.ltd/img/20220426144858.png)

* **xlen命令**

> XLEN key
>
> **返回指定流中的消息数。若指定的key不存在返回0**

![](https://images.waer.ltd/img/20220426145448.png)

* **xrange命令**

> XRANGE key start end [COUNT count]
>
> XREVRANGE key end start [COUNT count]
>
> **返回指定范围内的消息数据。默认是由小到大的顺序。**

```
# 查看刚刚添加的所有消息数据
xrange mystream - +
# - ,+ 用来指定开始到结束的范围内的全部数据。
# 也可以使用count 参数限定返回结果的条数。
# XREVRANGE 则是倒序返回，用法一样。
```

![](https://images.waer.ltd/img/20220426150502.png)

![](https://images.waer.ltd/img/20220426150748.png)

* **xdel命令**

> XDEL key id [id ...]
>
> **删除指定节点消息，通过ID指定。**

![](https://images.waer.ltd/img/20220426151112.png)

* **xtrim命令**

> XTRIM key MAXLEN | MINID [ = | ~] threshold [LIMIT count]
>
> **修剪消息流，指定删除超出某个范围之外的数据。**

```
# 保留5个以内的数据，表示超出5个的都被删除
xtrim mystream maxlen 5
# 新添加的消息会被追到尾部，同时检查如果数量大于5的部分将会被删除
xadd mystream maxlen 5 * name lisi age 99
```

> **下面切到另一个客户端，演示消费者命令。**

* **xread命令**

> XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]
>
> **消费指定一个或者多个流中消息数据。**

```
xread streams mystream 0-0
# streams表示同时消费多个流
# 0-0表示从每个消息流的起始位置开始消费
# 你也可以根据实际需求消费指定数量的消息
# 以阻塞模式进行消费
xread block 10000 count 3 streams mystream 0-0
# 上面的命令如果再次执行消费的话，ID不能再使用0-0开始，而是之前命令返回的最后一条消息的ID
# 以此类推，如果后面没有消息可以继续消费，该方法会进入指定时间内的阻塞状态。超时退出，否则如果生产者有数据，则会立即消费
xread block 10000 count 3 streams mystream $
# 上面的命令只会消费指定流中新增的消息，之前的消息不会被消费
```

![](https://images.waer.ltd/img/20220426152427.png)

![](https://images.waer.ltd/img/20220426152628.png)

**以上就是生产者和单个消费者模式的全部演示内容，其余内容将在后半部分进行演示。**

### Stream(2)

#### 消费组

> **演示以消费组的方式进行消费。**

* **xgroup create 命令**

> XGROUP CREATE key groupname id | $ [MKSTREAM] [ENTRIESREAD entries_read]
>
> **创建消费组。**

```
# 创建消费组g1，消费mystrean流中的消息，从头开始消费
xgroup create mystream g1 0
# 创建消费组g2，消费mystrean流中的消息，从尾开始消费
xgroup create mystream g1 $
```

* **xinfo stream命令**

> XINFO STREAM key [FULL [COUNT count]]
>
> **返回指定流的具体信息。**

![](https://images.waer.ltd/img/20220426155038.png)

* **xinfo groups 命令**

> **返回指定流中消费组的信息。**

![](https://images.waer.ltd/img/20220426155234.png)

* **xinfo consumers命令**

> **返回指定流中消费组中消费者的信息。**

* **xpending命令**

> XPENDING key group [ [IDLE min-idle-time] start end count [consumer]]
>
> **查看指定消费组中待处理的消息。**

![](https://images.waer.ltd/img/20220426155657.png)

> **以上命令全部在生产者客户端使用。**

* **xreadgroup命令**

> XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] id [id ...]
>
> **以消费组的模式进行消费。**

```
# c1表示组g1中的一个消费者>表示从指定流中的头部开始消费
xreadgroup group g1 c1 count 1 block 10000 streams mystream >
```

![](https://images.waer.ltd/img/20220426160528.png)

**关于消费者2的方式是类似的，不过它只能消费尾部的消息，在阻塞时间内，我们可以在生产者端发送一条消息，消费者会自动消费。**

### Pipeline

#### 概述

`Redis`客户端执行一条命令分为四个步骤：发送命令、命令排队、命令执行、返回结果。

**其中第一步和第四步称为**`Round Trip Time(RTT)`,即往返时间。

* `redis`提供了批量操作命令（如mget,mset等），可以有效的节约RTT。
* **但大部分命令是不支持批量的，若要执行N次这样的命令，则需要消耗N次RTT。**

**为了改善上面的问题，使用Pipeline（流水线），它可以有效的减少RTT。**

* **流水线允许客户端把任意多条**`redis`命令打包在一起，然后一次性的将他们发送给服务器。
* **服务器会将流水线包含的所有的命令处理之后，一次性的将他们的执行结果返回给客户端。**

![](https://images.waer.ltd/img/20220426171137.png)

**Pipeline和批量命令的对比**

* **批量命令是原子性的，而流水线不支持。**
* **批量命令是一个命令对应多个key,流水线则支持多个命令。**
* **批量命令是redis服务端支持的，而流水线需要服务端和客户端共同支持。**

> **每次封装的流水线命令不宜过多，否则会增加客户端的等待时间，也会造成一定的网络阻塞。**
>
> **建议将一次打包的大量命令拆分为多个流水线来实现。**

#### 基本演示

> **演示一条简单的流水线命令。**

```
echo -en '*3\r\ns3\r\nset\r\ns5\r\ncount\r\ns3\r\n100\r\n*2\r\ns4\r\nincr\r\ns5\r\ncount\r\n' | redis-cli --piple -a 密码
# 就是将key为ncount的值设置为100并自增1
```

> **注意该命令不能在客户端登录状态下执行，必须退出该状态执行之后再登录查看执行结果。**

---

### 事务

![](https://images.waer.ltd/img/%E4%BA%8B%E5%8A%A1.png)

#### 概述

`Redis`提供了简单的事务功能，该功能主要由`multi`和`exec`命令实现：

> * `multi`命令代表事务的开始，`exec`命令代表事务的结束，他们之间按顺序执行。
> * **当客户端执行**`multi`命令之后，他就进入了事务模式，这时用户输入所有命令会按顺序放入一个事务队列中。
> * **当客户端执行**`exec`命令之后，它才开始执行当前事务，执行成功后它会按照命令入队顺序返回各个命令执行的结果。
> * **若要取消事务，使用**`discard`代替`exec`命令即可，它会清空事务队列中已有的命令，并让客户端退出事务模式。

**为什么说**`Redis`提供是简单事务功能？

> 1. **redis事务不支持回滚。**
> 2. **redis事务总是支持**`ACID`(原子性、一致性、隔离性、持久性)中的`ACI`特性，当它运行在特定的持久化模式下时，也支持`D`特性。

#### 带乐观锁的事务

**很多时候，要确保事务中的数据没有被其他客户端修改才执行该事务。**

* `Redis`提供了`watch`命令来解决这类问题，这是一种乐观锁的机制。
* **客户端通过**`watch`命令，要求服务器对一个或多个key进行监视，如果在客户端执行事务之前，这些key发生了变化，则服务器将拒绝执行客户端提交的事务，并向它返回一个空值。

#### 命令演示

![image-20220426192238792](https://b3logfile.com/file/2022/08/solo-fetchupload-3243124093778569358-85ba9d91.png)

---

### Lua脚本

#### 概述

**Lua语言是在1993年由巴西一个大学研究小组发明的，其设计的目标是作为嵌入式持续移植到其他应用程序，由C语言实现，虽然简单小巧，但是功能强大，很多应用都选择它作为脚本语言，尤其是在游戏领域。**

[Lua官网](https://www.lua.org)

> **redis从2.6版本开始引入了Lua脚本，很方便的对redis服务器的功能进行了扩展：**
>
> * **redis服务器内置了Lua解释器，可以直接使用Lua脚本。**
> * **Lua脚本可以直接调用redis命令，并使用Lua语言及其内置的函数处理命令的结果。**
> * **redis服务器在执行Lua脚本的过程中，不会执行其他客户端发送的命令或者脚本，执行过程是原子性的。**

#### 使用介绍

`EVAL script numkeys key [key ...] arg [arg ...]`

1. **script参数用于传递脚本本身； **
2. **numkeys参数用于指定脚本需要处理的键的数量； **
3. **参数key可以是任意多个，用来指定被脚本处理的键，在脚本中通过KEYS数组来访问这些参数key； **
4. **参数arg可以是任意多个，用来指定传递给脚本的附加参数，在脚本中通过ARGV数组来访问这些参数arg。**

`SCRIPT LOAD script`

`EVEALSHA sha1 numkeys key [key….] arg [arg…]`

1. **SCRIPT LOAD命令用来将指定的脚本解释器存在服务器上，并返回对应的SHA1校验和。**
2. **EVEALSHA命令用来执行已被缓存的脚本，它后面的sha1参数是脚本对应的SHA1校验和。**

> **在Lua脚本中执行Redis命令(command-命令名称，省略号-命令参数): redis.call(command, ...), redis.pcall(command, ...) 二者唯一的区别是对错误的处理方式不同，前者在命令出错时会返回一个错误， 后者会将错误封装起来，返回一个表示错误的Lua表格。**

#### 管理脚本

```
# 将指定的脚本缓存到redis服务器上。
SCRIPT LOAD script
# 检查校验和对应的脚本是否存在于redis服务器中。
SCRIPT EXISTS sha1 [sha1....]
# 移除所有已缓存的脚本
SCRIPT FLUSH
# 强制停止正在运行的脚本
SCRIPT KILL
```

* **lua-time-limit配置**

  > **该配置项定义了Lua脚本不受限制运行的时长，其默认值为5000； 2. 当脚本的运行时间超过该值时，向服务器发送请求的客户端将得到一个 错误的回复，提示用户可以使用SCRIPT KILL或SHUTDOWN NOSAVE 命令来终止脚本或者直接关闭服务器。**

* **SCRIPT KILL命令执行后**

  > 1. **如果正在运行的Lua脚本尚未执行过任何写命令，则服务器终止该脚本， 回到正常状态，继续处理客户端的请求； **
  > 2. **如果正在运行的Lua脚本已经执行过写命令，服务器不会直接终止脚本 并回到正常状态，这种情况下，用户只能通过SHUTDOWN NOSAVE命令， 在不持久化的情况下关闭服务器。**

#### 脚本使用

> **演示一些简单的Lua脚本命令。**

```
# 打印一个字符串。
eval 'return "Hello Lua!"' 0
# 向redis中添加一个set类型的键值对 Hello:Lua
eval 'redis.call("set",KEYS[1],ARGV[1])' 1 Hello Lua
```

> **命令中，我们通过**`redis.call()`来接收redis命令。“set”表示存入一个字符串，键值对的具体内容通过参数的形式传入，而不是写死。
>
> **所以后的**`KEYS[1],ARGV[1]`代表从后面`Hello Lua`分别取第一个值就是对应的key和value的值，Lua索引从1开始。

![](https://images.waer.ltd/img/20220428154547.png)

```
# 使用for循环向set集合中512个添加数据
eval 'for i=1,512 do redis.call("sadd",KEYS[1],i) end' 1 test:set:1
```

![](https://images.waer.ltd/img/20220428160030.png)

```
# 缓存脚本
script load 'for i=1,512 do redis.call("sadd",KEYS[1],i) end'
# 加载脚本
evalsha "f1b96e57574c72649eda263530f0ae2215313f67" 1 test:set:2
# 检查脚本是否存在
script exists "f1b96e57574c72649eda263530f0ae2215313f67"
# 删除脚本
script flush
```

![](https://images.waer.ltd/img/20220428163743.png)

---

### 模块

#### 概述

`Redis`提供了流水线、事务、Lua脚本，用于扩展redis服务器的功能，但这些功能都有一定的缺陷；

* **这些扩展方式都必须基于现有的数据结构或功能来实现，无法支持用户自定义的数据结构。**
* **他们在编程方面都比较复杂，比如涉及**`watch`的命令就很容易出错，而Lua脚本又需要熟悉Lua语法。
* **无论是事务还是Lua脚本，在性能方面都会有一些损耗，对于哪些性能敏感的用户来说无法满足。**

> **redis在4.0增加了“模块”这个功能，它允许开发者通过redis开放的一簇API，基于C语言（能与C交互的语言）在redis之上构建任意复杂的、全新的数据结构和功能。**
>
> **对于开发者，redis为他们提供了一个可以按需扩展redis的机会，对于普通用户，有了大量的第三方定制功能可以拿来使用，他们可以将redis应用在更多领域。**

#### 使用模块

* **开发模块：**

**官方API手册:**[https://redis.io/topics/modules-api-ref](https://redis.io/topics/modules-api-ref)

* **编译模块**
  **不同模块的编译方式各有不同，大部分会在文档中做出详细的说明；**
* **载入模块**

```
# 配置文件
loadmodule /path/to/mymodule.so
# 启动命令
redis-server loadmodule /path/to/mymodule.so
# redsi命令
module load /path/to/mymodule.so
```

## Redis整合大全

> 主要记录各种第三方与 ``Redis``的整合使用。

### Spring整合Redis

> ``spring``对 ``redis``进行了比较完善的整合，使用方式也比较简单，主要分为三步。

- 引入依赖

```xml
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-data-redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <version>2.6.3</version>
</dependency>
```

- 配置 ``Redis``

  - 配置数据量参数

    - 以 ``application.properties``配置文件为例

    - ```properties
      # 配置Redis：RedisProperties类
      spring.redis.database=11
      spring.redis.host=localhost
      spring.redis.port = 6379
      ```

  - 编写配置类、构造 ``RedisTemplate``

    - ```java
      /**
       * @author: Tisox
       * @date: 2022/1/28 10:08
       * @description: 编写redis配置类
       * @blog:www.waer.ltd
       */
      @Configuration
      public class RedisConfig {

          @Bean
          public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory factory){
              /*实例化*/
              RedisTemplate<String,Object> template = new RedisTemplate<>();
              template.setConnectionFactory(factory);
              /*设置key的序列化方式*/
              template.setKeySerializer(RedisSerializer.string());
              /*设置value的序列化方式*/
              template.setValueSerializer(RedisSerializer.json());
              /*设置哈希的key的序列化方式*/
              template.setHashKeySerializer(RedisSerializer.string());
              /*设置哈希的value的序列化方式*/
              template.setHashValueSerializer(RedisSerializer.json());
              template.afterPropertiesSet();
              return template;
          }
      }
      ```

- 访问 ``Redis``

  - ``redisTemplate.opsForValue()``
  - ``redisTemplate.opsForHash()``
  - ``redisTemplate.opsForList()``
  - ``redisTemplate.opsForSet()``
  - ``redisTemplate.opsForZset()``

- 官方文档

[SpringDataRedis](https://spring.io/projects/spring-data-redis)

![](https://b3logfile.com/file/2022/08/solo-fetchupload-18189869574447350559-029b1e56.png)

- 演示demo

```java
/**
 * @author: Tisox
 * @date: 2022/1/28 10:16
 * @description: spring整合redis使用测试demo
 * @blog:www.waer.ltd
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = CommunityApplication.class)
public class RedisTests {
    @Autowired
    private RedisTemplate redisTemplate;
//----------------------字符串--------------------------------------------------------
    @Test
    public void testStrings(){
        String redisKey  = "test:count";
        /*存*/
        redisTemplate.opsForValue().set(redisKey,1);
        /*取*/
        System.out.println(redisTemplate.opsForValue().get(redisKey));
        /*加*/
        System.out.println(redisTemplate.opsForValue().increment(redisKey));
        /*减*/
        System.out.println(redisTemplate.opsForValue().decrement(redisKey));
    }

//执行结果：
    //1
    //2
//---------------------------哈希-------------------------------------------------------
       @Test
    public void testHashTests(){
        String redisKey = "test:user";
        /*存*/
        redisTemplate.opsForHash().put(redisKey,"id",1);
        redisTemplate.opsForHash().put(redisKey,"username","Tisox");
        /*取*/
        System.out.println(redisTemplate.opsForHash().get(redisKey,"id"));
        System.out.println(redisTemplate.opsForHash().get(redisKey,"username"));
    }
    //执行结果：
    //1
    //Tisox
//----------------------------列表--------------------------------------------------------
        @Test
    public void testLists(){
        String redisKey="test:ids";

        /*存*/
        redisTemplate.opsForList().leftPush(redisKey,101);
        redisTemplate.opsForList().leftPush(redisKey,102);
        redisTemplate.opsForList().leftPush(redisKey,103);
        /*取*/
        System.out.println(redisTemplate.opsForList().size(redisKey));
        System.out.println( redisTemplate.opsForList().index(redisKey,0));
        System.out.println(redisTemplate.opsForList().range(redisKey,0,2));
        /*pop*/
        System.out.println(redisTemplate.opsForList().leftPop(redisKey));
        System.out.println(redisTemplate.opsForList().leftPop(redisKey));
        System.out.println(redisTemplate.opsForList().leftPop(redisKey));
    }
    //执行结果
    //3
    //103
    //[103, 102, 101]
    //103
    //102
    //101
//-----------------------集合-------------------------------------------------------------
      @Test
    public void testSetson(){
        String redisKey="test:language";
        /*存*/
        redisTemplate.opsForSet().add(redisKey,"java","C++","python","甲骨文");

        /*取*/
        System.out.println(redisTemplate.opsForSet().size(redisKey));
        System.out.println(redisTemplate.opsForSet().pop(redisKey));
        System.out.println(redisTemplate.opsForSet().members(redisKey));

    }
    //执行结果
    //4
    //python
    //[甲骨文, C++, java]

//------------------------有序集合--------------------------------------------------------

    @Test
    public void testSortedSets(){
        String redisKey="test:students";
        /*存*/
        redisTemplate.opsForZSet().add(redisKey,"王萌萌",80);
        redisTemplate.opsForZSet().add(redisKey,"赵诗倩",90);
        redisTemplate.opsForZSet().add(redisKey,"肖鹤云",78);
        redisTemplate.opsForZSet().add(redisKey,"张成",100);
        redisTemplate.opsForZSet().add(redisKey,"陶映红",60);

        /*取*/
        System.out.println(redisTemplate.opsForZSet().zCard(redisKey));
        System.out.println(redisTemplate.opsForZSet().score(redisKey,"肖鹤云"));
        System.out.println(redisTemplate.opsForZSet().reverseRank(redisKey,"李诗情"));
        System.out.println(redisTemplate.opsForZSet().range(redisKey,0,3));
        System.out.println(redisTemplate.opsForZSet().removeRange(redisKey,0,3));
    }
    //执行结果
    //5
    //78.0
    //1
    //[陶映红, 肖鹤云, 王萌萌, 李诗情]
    //4
//---------------------------------全局命令--------------------------------------------
      @Test
    public void testKeys(){
        redisTemplate.delete("test:user");
        System.out.println(redisTemplate.hasKey("test:user"));

        /*设置过期时间：10秒*/
        redisTemplate.expire("test:students",10, TimeUnit.SECONDS);
    }
    //执行结果:自测
}
```

****

## 持久化与复制

### RDB持久化

![](https://images.waer.ltd/img/RDB持久化.png)

#### 概述

`RDB(Redis Database)`是redis默认采用的持久化方式，它以快照的形式将进程数据持久化到硬盘中；`RDB`会创建一个经过压缩的二进制文件，文件以`.rdb`结尾。内部存储各个数据库的键值对数据等信息，它的触发方式有两种：

- 手动触发:通过SAVE或BGSAVE命令触发RDB持久化操作，创建`.rdb`文件。
- 自动触发：通过配置选项，让服务器在满足条件时自动执行BGSAVE命令。

#### 命令

- SAVE命令

  > 要求服务器以同步方式创建一个记录了当前所有数据库数据的`.rdb`文件。在SAVE命令执行期间，redis服务器将会阻塞，直到`.rdb`文件创建完毕为止。

- BGSAVE命令

  > 该命令是异步版本的SAVE命令，它会使用redis服务器进程的子进程创建一个`.rdb`文件。该命令在创建子进程时会存在短暂的阻塞，之后服务器便可以继续处理其他客户端的请求。
  >
  > *BGSAVE命令是对SAVE阻塞问题做的优化，redis内部所有涉及RBD的操作都采用BGSAVE的方式，而SAVE命令已经废弃。*



#### 配置选项

```shell
save<seconds> <changes>
```

- 如果服务器在`seconds`秒内，对数据库总共执行了`changes`次修改，则自动执行一次BGSAVE命令；
- 可以同时配置多个save选项，当给定选项中的**任意一个条件满足时**，则自动执行一次BGSAVE命令；

> 为了避免同时使用多个触发条件而导致服务器过于频繁地执行BGSAVE，redis服务器在每次成功创建.rdb文件之后，负责将自动触发BGSAVE命令的时间计数器以及修改计数器清零并重新计数，无论这个`.rdb`文件是由自动触发的BGSAVE创建还是由用户执行SAVE或BGSAVE命令创建，都是如此。

#### 流程原理

- BGSAVE的流程

![](https://images.waer.ltd/img/20220430112532.png)



1. 若父进程存在正在执行的子进程，直接返回；
2. fork操作执行过程中，父进程进入阻塞状态；
3. fork完成之后，父进程继续响应其他命令；
4. 创建`.rdb`文件，并存储父进程内存中的数据；
5. 父进程得到通知，以新文件替换旧的`.rdb`文件；



- BGSAVE的原理

  ![](https://images.waer.ltd/img/20220430113006.png)

`COW(Copy On Write)`

在`Linux`系统中，可以通过`glibc`中的`fork`函数创建一个子进程，该进程和父进程完全相同，并且共享父进程的内存空间。

当父进程中任意进程需要修改内存中的数据时，会将对应的`page`进行复制，然后对副本进行修改操作。

#### RDB优缺点

- 优点：

  - RDB生成紧凑压缩的二进制文件，体积小，使用该文件恢复数据的速度非常快；

- 缺点：

  - BGSAVE每次运行都要执行fork操作创建子进程，属于重量级操作，不宜频繁执行，所以RDB持久化没办法做到实时的持久化。



#### 操作演示

-  删除已有的持久化文件

> 找到dump.rdb文件并删除。

![](https://images.waer.ltd/img/20220430142042.png)

打开redis.conf文件，如下，可以看到，当900秒内有一次改动或者300秒内10次改动以及60秒内的1000次改动都会触发RDB。

![](https://images.waer.ltd/img/20220430142259.png)

向服务器中随便存点数据之后输入save，手动触发持久化。

![](https://images.waer.ltd/img/20220430142717.png)

再查看dumpp.rdb:

```shell
od -c dump.rdb
```

![](https://images.waer.ltd/img/20220430143400.png)



### RDB文件结构

#### 文件结构

![](https://images.waer.ltd/img/20220430145736.png)



- 标识符的内容为`REDIS`五个字符，redis服务器在尝试载入RDB文件的时候，可以通过这个标识符快速的判断该文件是否为真正的RDB文件；
- 版本号是一个字符串格式的数字，长度为4个字符串，目前最新的RDB文件版本为第9版，因此RDB文件的版本号将为字符串“0009”。
- 版本附加信息记录了生成RDB文件的redis服务器及其所在的平台信息，比如服务器的版本号，宿主及其的架构、创建RDB文件时的时间等。
- 数据库记录了redis服务器存储的所有数据库数据，当服务器包含多个数据库数据时，各个数据库的数据将按照数据库号码从小到大排列。
- 如果redis服务器启用了复制功能，那么服务器将在RDB文件中的Lua脚本缓存部分保存所有已被缓存的Lua脚本；
- EOF用于标识RDB正文内容的末尾，它的实际值为二进制值`0xFF`,当redis服务器读取到这个EOF时，就知道正文部分已经全部读取完毕了；
- CRC64校验和是一个无符号的64位整数，redis服务器在读入RDB文件时会通过这个校验和来检查RDB文件是否有出错或者损坏的情况出现。

#### 载入RDB文件

1. 检查文件开头的标识符是否为`REDIS`,如果是则继续后面的操作，否则抛出错误并终止载入操作。
2. 检查RDB文件的版本号，以此来判断当前redis服务器能否读取这一版本号的RDB文件。
3. 根据文件中记录的设备附加信息，执行相应的操作和设置。
4. 检查文件的数据库数据是否为空，若不为空则执行下面的操作：
   1. 根据文件记录的数据库号码，切换至正确的数据库。
   2. 根据文件记录的键值对总数量以及带有过期时间的键值对数量，设置数据库底层数据结构；
   3. 逐个载入文件记录的所有的键值对数据，并在数据库中重建这些键值对。
5. 如果服务器启用了复制功能，则将之前缓存的Lua脚本重新载入缓存中。
6. 遇到EOF标识，确认RDB正文已全部读取完毕，
7. 载入RCR64校验和，把它与载入数据期间计算出来的CRC64校验和进行对比，以此判断被载入的数据是否完好无损。
8. RDB文件载入完毕，服务器开始接受客户端的请求。



****

  ### AOF持久化

![](https://images.waer.ltd/img/AOF持久化-m1.png)

#### 概述

AOF(Append Only File)，解决了数据持久化的实时性，是目前redis持久化的主流方式；它以独立日志的方式，记录每次写入命令、重启时再重新执行AOF中的命令来恢复数据。AOF的工作流程包括：

- 写入命令(append)
- 同步命令(sync)
- 文件重写(rewrite)
- 重启加载(load)

![](https://images.waer.ltd/img/20220430155018.png)

AOF默认不开启，需要修改配置项来启用它：

```shell
appendonly yes # 启用AOF
appendfilename "appendonly.aof" # 设置文件名
```

AOF以文本协议格式写入命令，这种格式在前面的内容中提到过。

**为什么采用这种格式？**

> - 文本协议具有很好的兼容性；
> - 直接采用文本协议格式，可以避免二次处理的开销；
> - 文本协议具有可读性，方便直接修改和处理；

#### 文件同步

为了提高程序的写入性能，现代操作系统会把针对硬盘的多次写入操作优化为一次：

- 当程序调用`write`对文件写入时，系统不会直接把数据写入硬盘，而是先将数据写入内存的缓冲区中。
- 当达到特定的时间周期或缓冲区写满时，系统才会执行`flush`操作，将缓冲区数据冲洗到硬盘中；

这种优化机制虽然提高了性能，但也给程序的写入操作带来了不确定性：

- 对于`AOF`这样的持久化功能来说，冲洗机制将直接影响`AOF`持久化的安全性；
- 为了消除上述机制的不确定性。`redis`向用户提供了`appendfsync`选项，来控制系统冲洗`AOF`的频率；、
- `Linux`的`glibc`提供了`f-sync`函数，可以将指定的文件强制性的从缓冲区刷到硬盘，上述的选项也是基于该函数实现。

![](https://images.waer.ltd/img/20220430160947.png)



#### 操作演示

- redis.conf配置文件

![](https://images.waer.ltd/img/20220430153938.png)

将`appendonly`置为yes,下面的文件名不需要改动。

- 重启服务

  ```shell
  redis-server /root/6379/redis.conf
  ```

![](https://images.waer.ltd/img/20220430154223.png)

- 往redis中存入一些数据之后查看该文件的内容：

![](https://images.waer.ltd/img/20220430154454.png)

#### AOF的优缺点

- 优点：
  - 与`RDB`持久化可能丢失大量的数据相比，`AOF`持久化的安全性要高很多。
  - 通过使用`everysec`选项，用户可以将数据丢失的时间窗口限制在`1`秒内；
- 缺点：
  - `AOF`文件存储的时协议文本，它的体积要比二进制格式的`.rdb`文件大很多；
  - `AOF`需要通过执行`AOF`文件中的命令来恢复数据，其恢复的速度也比`RDB`慢很多。
  - `AOF`在进行重写时也需要创建子进程，在数据库体积较大时，将会占用大量的资源，会导致服务器的短暂阻塞。

****

### AOF的重写机制

#### 概述

随着写入操作的不断进行，`AOF`文件内会包含越来越多的冗余命令：

- 已经超时的数据；
- 已经删除的数据；
- 多次经过修改的数据；

冗余命令不仅增加了`AOF`文件的体积，也会严重影响到恢复数据的速度；

- 为了减少冗余命令，从而提高恢复数据的速度，`redis`提供了`AOF`重写的功能；
- 该功能可以生成一个全新的`AOF`文件，并让文件只包含恢复当前数据库数据所需的尽可能少的命令；

#### 触发方式

- 手动触发

```shell
BGREWRITEAOF
```

- 自动触发

```shell
# 设置触发AOF重写所需的最小文件体积，即当AOF文件体积达到该值时，触发AOF重写；
auto-aof-rewrite-min-size <value>
# 设置AOF重写所需的文件增长比例，即当AOF文件体积比上次重写后的体积增长一倍时，触发AOF重写；
auto-aof-rewrite-percentage <value>
```

#### AOF重写的流程

1. 执行`AOF`重写
   1. 若正在执行`AOF`重写，则直接返回；
   2. 若正在执行`BGSAVE`操作，则延迟到`BGSAVE`完成后再执行；
2. 执行`fork`操作创建子进程；
3. 继续响应请求;
   1. 将新的写入命令存到`aof_buf`中，进而同步到硬盘，保持原有的逻辑；
   2. 将新的写入命令存到`rewrite_buf`，防止重写操作遗漏这些数据；
4. 写入新的`AOF`文件；
5. 启用新的`AOF`文件：
   1. 发信号给父进程，父进程更新统计信息；
   2. 将`rewrite_buf`中的数据刷入到新的`AOF`文件；
   3. 使用新的`AOF`文件替换旧的文件，完成`AOF`重写；



![](https://images.waer.ltd/img/AOF.png)

#### 重启加载

![](https://images.waer.ltd/img/20220430170634.png)







## Redis踩坑宝典

> 记录在 ``Redis``使用过程中遇到了一些问题、踩过的坑。

## Redis面试技能

> 搜集整理关于 ``Redis``的面试题目、面试技巧。

## Redis使用技巧

> 总结一些 ``Redis``方面的使用技巧、方法。
