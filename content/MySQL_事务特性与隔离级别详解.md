+++
title = "MySQL_事务特性与隔离级别详解"
date = 2023-02-07
tags = ["MySQL", "数据库", "事务", "ACID", "隔离级别"]
description = "详细介绍MySQL事务的ACID特性和四大隔离级别，通过武大郎转账的故事生动解释事务概念，并深入分析脏读、不可重复读、幻读等现象。"
+++

## 事务特性

### 武大郎的情人节

**照本宣科的概念总是味同嚼蜡。**

在介绍`MySQL`事务的概念之前，先通过一个简单但比较经典的案例，看看为什么数据库会有事务、需要事务。

当前时间是 `2023-2-6` 。这不过几天就是一年一度的 **~~情人~~节** 了，你不得给你女朋友微信转个`520`？那么问题来了，你的`520`块`RMB`如何保证从自己的银行卡转出去之后一定准确无误抵达女朋友银行卡上？

我们假设你女朋友卡上现在余额1000元，自己银行卡也是1000元，具体信息如下:

| 姓名           | 银行卡余额 |
| -------------- | ---------- |
| 女朋友(潘金莲) | ￥1000     |
| 你自己(武大郎) | ￥1000     |

正常情况下，在转账结束之后，自己和潘金莲卡上的信息如下:

| 姓名   | 银行卡余额 |
| ------ | ---------- |
| 潘金莲 | ￥1520     |
| 武大郎 | ￥480      |

为了保证你的`520`块一定会准确无误的转到女朋友潘金莲卡里而不是随机一个人的银行卡上(比如转到博主我的卡里),这就涉及到了数据库的事务特性，用来保证**武大郎**银行卡减少`520`块，**潘金莲**卡里就一定会增加`520`块的这个过程(或者说达到这个结果)，使得转账整个操作要么全部成功，要么全部失败。这就是`MySQL`事务。

### 四大特性

![](https://images.waer.ltd/img/20230206193522.png)

`MySQL`数据库是完全支持事务操作的。

事务是一组顺序的数据库操作操作，其执行就像是一个单独的工作单元一样。换句话说，除非组内的每个单独操作都成功，否则事务永远不会完成。如果事务中的任何操作失败，则整个事务将失败。

在`MySQL`中，事务主要有下面四大特性，也就是常说的`ACID`四大属性。

1. **原子性**(`A`)

> 用来确保所有操作要么全部成功，要么全部失败(回滚到操作之前的状态)。

比如武大郎给潘金莲转账`520`块这个操作，转账之后要保证武大郎转过去`520`都到了潘金莲卡里，自己卡里少了`520`，潘金莲卡里多了`520`。这个操作过程是在一个事务内执行，所以对于该事务来说，这是一个无法也不应该拆分的操作，就是原子性。

2. **一致性(`C`)**

> 确保数据库在成功提交事务之后的一个正确状态。

比如武大郎给潘金莲转账`￥520`，潘金莲和武大郎卡里的钱同时增减`￥520`,这个过程是同时进行的，要么全部提交，转账结束，要么全部不提交，转账失败。

3. **隔离性(`I`)**

> 通过引入锁的概念，实现即使在并发环境下，事务之间不会相互影响，独立运行。

武大郎给潘金莲转过去的`￥520`,并不会被武大郎或者潘金莲身边也在进行转账的其他人收到，也就是说，`MySQL`的`隔离性`保证了彼此转账操作之间的独立。

4. **持久性(`D`)**

> 确保在数据库系统出现故障的情况下，已经提交执行的事务结果仍然存在，也就是事务一旦提交成功，这个事务所带来的结果将会是永久性的，不能再次被修改，无法撤回。

武大郎给潘金莲转账的`￥520`,一旦被潘金莲确认并成功收款之后，这`￥520`将会一直存在潘金莲卡里，而武大郎卡里减少的`￥520`也将不会返回，这一整个过程已经被持久化。

****

### 事务的使用

在`MySQL`中，事务以`START TRANSACTION`开始，以`COMMIT`(提交)或者`ROLLBACK`(回滚)结束。语法格式如下。(或者你也可以使用`BEGIN`来代替`START TRANSACTION`)。

```sql
START TRANSACTION;
{sql statement 1}
{sql statement 2}
...
...
COMMIT or ROLLBACK;
```

`COMMIT`主要用于提交事务，当一个事务完成时，可以使用`COMMIT`命令提交事务，事务一旦成功提交，那么本次事务执行的操作将会全部生效。

`ROLLBACK`命令则是用来回滚事务的，如果数据库执行出现异常或者主动执行回滚操作，那么本次事务所有的修改都会回到解放前，之前所有的修改将会全部失效。

****

下面开始阅读长篇爱情故事《**武大郎的情人节**》在故事中学习事务的使用。

#### **第一回:大郎转账又止**

> 此时还没到情人节，武大郎和潘金莲荷包里都还有`￥1000`，此时武大郎小情人**西施**也登场了，它卡里有`￥1500`。

```sql
mysql> SELECT * FROM users;
+----+--------+-------+
| id | name   | money |
+----+--------+-------+
|  1 | 潘金莲 |  1000 |
|  2 | 武大郎 |  1000 |
|  3 | 西施   |  1500 |
+----+--------+-------+
3 rows in set (0.12 sec)
```

`After a long time......`，就是今天，就是这个时候，情人节到来，一个万里无云的清晨，此时武大郎已经在和面了，突然想起来今天时情人节，于是停下手中的擀面杖，短粗黝黑的手掌习惯性的在包了浆的围巾上揩了一把，掏出来兜里的手机。

只见他看了一眼屏幕，手指轻轻往上一划，手机就解开了，哦买嘎！原来是刚出来的`iPhone15PorMax`。打开微信，准备给潘金莲转个`￥520`…

```sql
# 开始转账
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.01 sec)

mysql> UPDATE users SET money = money-520 WHERE name = '武大郎';
Query OK, 1 row affected (0.02 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> UPDATE users SET money = money + 520 WHERE name = '潘金莲';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

就是一瞬间的事，它突然想起来自己还有一个小情人 **西施**。这可不好办啊，不能只给一个人转啊，都是肉，这得雨露均沾啊，一看自己卡里只有`1000`块，如果给潘金莲转`520`，那西施这就不够了呀，所以他取消了这次得转账操作。

```sql
# 取消转账
mysql> ROLLBACK;
Query OK, 0 rows affected (0.02 sec)
```

另一头的潘金莲无聊的打开自己的支付宝一看余额，哎呦卧槽，这死鬼怎么跟个木头一样，情人节也不表示表示，一点儿都不浪漫…

```sql
mysql> SELECT * FROM users WHERE id < 3;
+----+--------+-------+
| id | name   | money |
+----+--------+-------+
|  1 | 潘金莲 |  1000 |
|  2 | 武大郎 |  1000 |
+----+--------+-------+
2 rows in set (0.17 sec)
```

听了武大郎的故事，我一下子就悟了，原来这就是**`MySQL`事务的回滚**啊！

#### 第二回:潘金莲收款甚是欢喜

转眼也是到了下午，武大郎的烧饼摊子很是火热，有一个人前来买瓜,不对。前来买烧饼的人络绎不绝。大郎看着眼前人都是成双成对，心里不免一阵失落，要是潘美人儿在身边该多好啊，如此想着，他买烧饼的节奏也在不停的加快了。时不时会听到一阵播报声:`支付宝到账100元…支付宝到账55元…`

```sql
mysql> UPDATE users SET money = money + 500 WHERE name = '武大郎';
Query OK, 1 row affected (0.03 sec)
```

晚上回到家里，打开支付宝一看，今天卖烧饼赚了`500`块。

```sql
Rows matched: 1  Changed: 1  Warnings: 0
mysql> SELECT * FROM users WHERE name = '武大郎';
+----+--------+-------+
| id | name   | money |
+----+--------+-------+
|  2 | 武大郎 |  1500 |
+----+--------+-------+
1 row in set (0.17 sec)
```

大郎面露笑容，这下可以给两个大美人儿转`520`了。

```sql
# 开始转账(开始事务)
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.01 sec)
# 扣除自己卡里1040块
mysql> UPDATE users SET money = money - 520 WHERE name = '武大郎';
Query OK, 1 row affected (0.01 sec)
mysql> UPDATE users SET money = money - 520 WHERE name = '武大郎';
Query OK, 1 row affected (0.01 sec)
#------------------------------------------------------------------

# 给潘金莲转了520
Rows matched: 1  Changed: 1  Warnings: 0
mysql> UPDATE users SET money = money + 520 WHERE name = '潘金莲';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# 给西施也转了520块
mysql> UPDATE users SET money = money + 520 WHERE name = '西施';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

转账结束，此时三个人的卡里余额情况:

```sql
mysql> SELECT * FROM users;
+----+--------+-------+
| id | name   | money |
+----+--------+-------+
|  1 | 潘金莲 |  1520 |
|  2 | 武大郎 |   460 |
|  3 | 西施   |  2020 |
+----+--------+-------+
3 rows in set (0.14 sec)
```

`支付宝到账520元....`。潘金莲和西施的手机同时传来提示。当然，两人并没有挨在一起，此时西施正趟在一个男人怀里，妩媚多姿，很是骚气。

快看，眼前这个男人目光如剑，死死的盯着怀里这个女人，一股没来由的怒气把头上的帽子都冲掉了。哇哦，这个男人正是前往东土大唐取经的唐三藏，难怪是个光头。

**看了大郎的这第二回，我又悟了，原来这就是`MySQL`事务的提交啊,秒!**

****

大型长篇连续爱情故事《**武大郎的情人节**》到这里就暂告一段落了，接下提一下关于`MySQL`的事务自动提交。

在`MySQL`中，默认支持并开启事务的自动提交，也就是**`AUTOCOMMIT`**。

`MySQL` 默认将 `AUTOCOMMIT `设置为 `true`，这意味着每个单独的语句都作为其自己的事务执行并自动提交。

```sql
mysql> SELECT * FROM users;
3 rows in set (0.14 sec)
```

上述语句开启自动提交时，则与下面的语句等效。

```sql
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM users;

mysql> COMMIT;
Query OK, 0 rows affected (0.00 sec)
```

事务自动提交会在我们手动指定事务时被关闭，可以通过下面的命令开启或者关闭事务自动提交。

```sql
SET AUTOCOMMIT = 0
# 或者
SET AUTOCOMMIT = OFF
```

使用下面的命令可以查看当前数据库`AUTOCOMMIT`变量的取值。

```sql
mysql> SHOW VARIABLES LIKE 'AUTOCOMMIT';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | ON    |
+---------------+-------+
1 row in set (0.20 sec)
```

****

## 事务的面试题

### `MySQL`事务是原子的吗？

> 是的。每个事务中执行过程中，如果一切正常，那么该事务所有语句将被执行，如果该过程出现异常，所有语句都不会得到执行。

### 如何修改`MySQL`事务超时等待时间?

> 在`MySQL`中，事务等待超时使用的是`innodb_lock_wait_timeout`变量来控制的，默认超时时间是`50`秒，如果希望修改这个超时时间，可以根据实际需要修改变量的值，比如：
>
> ```sql
> innodb_lock_wait_timeout=100;
> ```

### `MySQL`是否支持嵌套事务?

> `MySQL`不支持嵌套事务。因为无论何时启动事务，他都会隐式的提交到本地(最终会写入磁盘)，比如在同一张表中使用嵌套事务，那么内部事务已经成为外部事务的一部分，此时表在获取锁时将会是不确定的。

### `DDL`语句都能回滚吗？

> 有些语句是不能回滚的。比如`DDL（Data Definition Language）`语句。**例如，**创建表、更改表、删除字段或表等。

****

## 事务隔离机制

事务可以指定一个隔离级别。这个级别可以定义一个事务必须与其他事务所操作得到资源或者数据的隔离程度。通过设置合理的隔离级别，可以有效的防止事务带来的一些副作用，比如脏读、幻读。

在处理数据库事务时，如果没有选择好合适的隔离级别，很可能会对我们的项目业务产生严重的影响，所以作为一个`Coder`或者`DBA`，了解`MySQL`事务隔离级别是非常有必要的。

在正式开始隔离级别的内容之前，先了解一下数据库事务中常见的几种读现象。

### 三大读现象

![](https://images.waer.ltd/img/20230206205150.png)

####  1.脏读(`dirty read`)

事务`B`读取了事务`A`未提交的事务，这就是脏读。

这种情况是比较糟糕的，因为我们不知道其他事务是否最终会被**提交或回滚**。因此，如果发生回滚，我们可能最终会使用**不正确**的数据，也就是读到**脏数据**了。

![](https://images.waer.ltd/img/20230206194814.png)

#### 2.不可重复读(`non-repeatable read`)

一个事务A两次读取同一条记录但读取到不同的值，这是因为这条记录可能在别人(事务A)两次查询之间被事务B进行了更新操作导致。为什么叫 **不可重复读**，就是你第二次读取(重复读)到的数据和第一次已经不一样了，如此便失去了重复读取的意义。

![](https://images.waer.ltd/img/20230206200702.png)

#### 3.幻读(`phantom read`)

幻读和不可重复读类似，但幻读会影响查询的多行数据而不是一行。

一个事务读取符合某些查询条件的数据。另一个用户做了合理的插入更新或删除而影响了该查询的结果。这发生在另一个会话插入或删除的记录刚好与你查询的`WHERE`子句相匹配的记录匹配。因此重复查询会导致返回不同的记录，就像出现了幻觉一样。

> 咦？为什么我两次相同的查询却出现不同的结果？？

![](https://images.waer.ltd/img/20230206200538.png)

除了上述三大情况之外，细分其实还有包括 **读、写偏差**、 **更新丢失**，这些可以理解为上述三种情况的细化，后续有时间再更新进来，现在主讲的是**隔离级别**的问题。

****

### 四大隔离级别

![](https://images.waer.ltd/img/20230206205532.png)

为了处理上述的 **三大读现象** 美国国家标准协会（`ANSI`）定义了`4`个标准隔离级别，为了方便理解记忆，下面我将按照隔离级别**从低到高**的顺序罗列。

#### 1.读未提交(`read uncommitted`)

在四大隔离级别中，这是级别最低的隔离机制。这个级别的事务可以看到其他未提交的事务写入的数据，这个级别的隔离机制几乎等于什么也没做，所以是完全可能导致**脏读**现象的发生的。

#### 2.读已提交(`read committed`)

这个级别的隔离机制可以感知到被其他事务提交了的数据，正因为如此，它也可以阻止**脏读**的发生。但该机制不能阻止**不可重复度**和**幻读**现象。`PostgreSQL `默认使用此隔离级别。

#### 3.可重复读(`repeatable read`)

该级别所指定语句不能读取**已被其他事务修改但尚未提交的数据**，并且在当前事务完成之前，**其他事务不能修改已被当前事务读取的数据**，它可以确保一个查询总是会返回相同的结果，不管这个查询执行多少次。因此，该级别的隔离机制，可以有效阻止 **脏读**、**不可重复读**现象。`MySQL`默认使用这种隔离级别。

#### 4.可序列化(`serializable`)

可序列化。这是最高的隔离级别。在这个级别中运行的并发事务被保证能够产生相同的结果，就像它们按照某种顺序一个接一个地执行而不重叠一样。类似于队列模型，所有的事务操作都会被加锁后顺序执行。所以基本上可以阻止上述提到的**三大读现象**的发生，但一般情况下却不推荐使用，因为存在频繁加锁的机制，从而会导致性能的拉跨,尽管它已经很强大了，但依然无法阻止数据一致性问题的发生。

****

## 隔离级别&读现象关系

下面通过一些具体的例子，探究总结 **四大隔离级别和三大读现象之间的关系**。

#### 隔离级别的查看

- 在`MySQL`中，可以使用下面的命令来查看当前数据库事务使用了何种隔离级别。

```sql
mysql>  select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row in set (0.08 sec)
```

可以看到，我当前数据库默认使用的额就是**可重复读**级别。

- 在`MySQL`中，除了当前数据库的默认隔离级别外，数据库还设置了一个全局隔离级别。

```sql
mysql>  select @@global.transaction_isolation;
+--------------------------------+
| @@global.transaction_isolation |
+--------------------------------+
| REPEATABLE-READ                |
+--------------------------------+
1 row in set (0.09 sec)
```

默认全局也是**可重复读**。

#### 隔离级别的修改

- 如果需要修改当前数据库的隔离级别，看这里：

```sql
mysql> set session transaction isolation level read uncommitted;
Query OK, 0 rows affected (0.01 sec)
```

通过使用上面的命令，你可以将当前数据库的隔离级别随意更换为你需要的级别，只需要替换命令中`level`后面的变量为你自己想更换的级别名称即可。查看刚才的修改是否生效：

```sql
mysql>  select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-UNCOMMITTED        |
+-------------------------+
1 row in set (0.11 sec)
```

#### 隔离级别的关系

下面通过案例的实践，进一步讨论隔离级别和读现象的关系。

##### 读未提交演示

开始实践操作之前，先将事务`TX1`和`TX2`的隔离级别均修改为`read uncommitted;`。

```sql
mysql> set session transaction isolation level read uncommitted;
Query OK, 0 rows affected (0.00 sec)
```

1. 打开两个命令行窗口，分别开启事务。注意，在`MySQL`中，`start transaction`和`begin`都可以用来开启事务。

```sql
# TX1
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

#TX2
mysql> begin;
Query OK, 0 rows affected (0.00 sec)
```

2. 在事务1中做一个简单的查询。

```sql
mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |     100 | RMB      | 2023-02-07 09:51:20 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.14 sec)
```

目前三个人的账户余额都是`￥100`,接下来在事务`TX2`中查询id为1的账户。

```sql
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |     100 | RMB      | 2023-02-07 09:51:20 |
+----+-------+---------+----------+---------------------+
1 row in set (0.10 sec)
```

当然，通过事务`TX2`查询出来 **汪淼**的账户余额也是`100RMB`,下面我们通过`TX1`来给汪淼账户减去10块钱。

```sql
#  TX1 汪淼账户扣除10元
mysql> UPDATE money SET balance = balance - 10 WHERE id = 1;
Query OK, 1 row affected (0.02 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# TX1 再次查询账户余额为90元
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      90 | RMB      | 2023-02-07 10:04:59 |
+----+-------+---------+----------+---------------------+
1 row in set (0.15 sec)
```

> 注意了！尽管此时我们在`TX1`中已经将汪淼的余额扣除了10块，但并没有提交该事务。

3. 通过事务`TX2`执行和`TX1`同样的查询，获取汪淼的余额信息。

```sql
# TX2
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      90 | RMB      | 2023-02-07 10:16:07 |
+----+-------+---------+----------+---------------------+
1 row in set (0.11 sec)
```

注意看！！事务`TX2`的查询结果竟然也是`￥90`,明显`TX2`也看到了`TX1`作的修改，但注意此时对于`TX1`来说，自己的事务都还没有`COMMIT`,却被`TX2`感知到了，这明显就是有问题的。

**所以这是一个脏读现象，它的发生是因为我们使用了读-未提交的隔离级别。**

##### 读已提交演示

在演示`Read committed`之前，先把第一个演示的两个事务全部`COMMIT`，完成事务提交。

```sql
# TX1
mysql> COMMIT;
Query OK, 0 rows affected (0.01 sec)
# TX2
mysql> COMMIT;
Query OK, 0 rows affected (0.01 sec)
```

1. 执行下面的几条命令，将`TX1`和`TX2`的事务隔离级别设置为`Read committed`并开启事务。

```sql
-- TX1 + TX2 
mysql> set session transaction isolation level read committed;
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-COMMITTED          |
+-------------------------+
1 row in set (0.14 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)
```

2. `TX1`z中查看所有的账户情况。

```sql
# TX1
mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      90 | RMB      | 2023-02-07 10:16:07 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.16 sec)
```

3. 通过事务`TX2`查看汪淼余额。

```sql
# TX2
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      90 | RMB      | 2023-02-07 10:16:07 |
+----+-------+---------+----------+---------------------+
1 row in set (0.12 sec)
```

4. 同样的，再使用`TX1`来扣除汪淼账户余额的10块。

```sql
# TX1 
mysql> UPDATE money SET balance = balance - 10 WHERE id = 1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      80 | RMB      | 2023-02-07 10:34:31 |
+----+-------+---------+----------+---------------------+
1 row in set (0.12 sec)
```

现在我们已经成功将汪淼的余额修改为`￥80`,那么这个操作对于`TX2`来说是否可见呢？验证一下：

```sql
mysql>  SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      90 | RMB      | 2023-02-07 10:16:07 |
+----+-------+---------+----------+---------------------+
1 row in set (0.12 sec)
```

可以看到，尽管`TX1`作的修改尚未提交，但在`TX2`中看到的还是之前`TX1`未修改的内容，也就是`￥90`。

这是因为我们使用的是**读-提交**的隔离级别，由于事务`TX1`还没有提交，它写的数据不能被其他事务看到。

> 所以，通过上面的两个实践发现，**读-提交**级别**可以防止脏读现象的发生**，那么，对于 **不可重复读**以及 **幻读**的隔离效果如何呢？我们拭目以待。

5. 在`TX2`中，执行`select * from money where balance >= 90;`,然后回到`TX1`并提交事务。

```sql
# TX2
mysql> select * from money where balance >= 90;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      90 | RMB      | 2023-02-07 10:16:07 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.18 sec)
# TX1 
mysql> COMMIT;
Query OK, 0 rows affected (0.18 sec)
```

回到`TX2`查询发现，此时汪淼余额确实变为了`￥80`。

```sql
-- TX2
mysql> SELECT * FROM money WHERE id=1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      80 | RMB      | 2023-02-07 10:34:31 |
+----+-------+---------+----------+---------------------+
1 row in set (0.16 sec)
```

> 因此，获得汪淼账户的同一个查询会返回不同的值，这是**不可重复**的读取现象。

`Ok,`我们再次再`TX2`中执行之前执行过一次的`select * from money where balance >= 90;`语句，看看结果。

```sql
# TX2
mysql> select * from money where balance >= 90;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
2 rows in set (0.20 sec)
```

对比之前的执行结果发现，这次我们只得到2条记录，而不是之前的3条，因为`TX1`提交后，汪淼账户的余额已经减少到80，自然不能再次满足`balance>=90`这个查询条件。

> 执行了相同的查询，但返回了一组不同的行，这是由于其他已提交的事务导致有一条记录已经消失了。这就是所谓的**幻读现象**。

由此，可以得出结论：

**读-提交的隔离级别只能防止脏读，但仍然允许不可重复读和幻读现象的出现。**

接下来，我们先将上面未提交的`TX2`进行提交之后在继续探索更高级别的隔离机制和读现象的关系。

```sql
-- TX2
mysql> COMMIT;
Query OK, 0 rows affected (0.01 sec)
```

1. 执行下面的命令，将两个事务的隔离级别修改为`repeatable read`可重复读并开启事务。

```sql
# TX1 + TX2
mysql> set session transaction isolation level repeatable read;
Query OK, 0 rows affected (0.01 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row in set (0.14 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)
```

2. 现在让我们查询`TX1`中的所有账户。然后查询`TX2`中ID为1的账户。同时查询所有余额至少为80元的账户。以用来验证幻读是否仍然发生。

```sql
# TX1
mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      80 | RMB      | 2023-02-07 10:34:31 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.12 sec)
# TX2
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      80 | RMB      | 2023-02-07 10:34:31 |
+----+-------+---------+----------+---------------------+
1 row in set (0.15 sec)

mysql> SELECT * FROM money WHERE balance >=80;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      80 | RMB      | 2023-02-07 10:34:31 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.14 sec)
```

OK,现在回到`TX1`，从其余额中减去`10`。然后查看所有的账户在`TX1`中的当前状态。

```sql
# TX1
mysql> update money set balance = balance - 10 where id = 1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      70 | RMB      | 2023-02-07 11:18:08 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.15 sec)
```

现在我们可以看到汪淼的账户余额已经减少到70元。

注意，在这里我们已经没必要再去检查 **脏读**的隔离情况，因为在之前更低级别的隔离中已经作了隔离，在MySQL隔离级别中有下面这样一个规则:

> 任何在较低的隔离水平上被阻止的现象都不会有机会在较高的水平上发生，这一点很容易理解。**手持红码的你不可能上得了飞机，因为你连地铁或者公交都上不去。**

3. 我们提交事务`TX1`再通过`TX2`查看是否能感知到`TX1`所作得修改。

```sql
-- TX1
mysql> COMMIT;
Query OK, 0 rows affected (0.02 sec)
-- TX2
mysql> SELECT * FROM money WHERE id=1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      80 | RMB      | 2023-02-07 10:34:31 |
+----+-------+---------+----------+---------------------+
1 row in set (0.17 sec)
```

可以看到现在这个查询返回得是汪淼账户的旧版本，余额为80元，尽管`TX1`已经将其改为70元并成功提交。

> 这是因为可重复读取隔离级别确保所有的读取查询都是**可重复的**，这意味着它总是返回相同的结果，即使期间有其他事务做了修改并成功提交。

4. 我们在`TX2`中再次运行`balance>=80`的条件查询。

```sql
-- TX2
mysql> select * from money where balance >= 80;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      80 | RMB      | 2023-02-07 10:34:31 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.19 sec)
```

正如你所看到的，它仍然返回与之前一样的`3`条记录。

> 因此，在这个可重复读取的隔离级别中，**幻读**现象也被阻止了。

那么现在我想知道如果我们在`TX2`中也进行更新操作，从汪淼的账户余额中减去10，会发生什么？结果是将余额改为70，还是60，或者是其他意料之外的结果呢？纸上得来终觉浅，试试就知道了。

```sql
# TX2
mysql> UPDATE money SET balance = balance-10 WHERE id=1; 
Query OK, 1 row affected (0.62 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT * FROM money WHERE id=1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      60 | RMB      | 2023-02-07 12:57:33 |
+----+-------+---------+----------+---------------------+
1 row in set (0.13 sec)
```

结果显示，汪淼账户余额现在是60元，显然这是正确的值，因为`TX1`已经提交了修改余额为70元的事务变更。

> 尽管这个结果看起来是正确的，但换个角度，在数学角度看`TX2`的结果是没有意义的，因为在上一个查询中，`TX2`的结果还是显示的汪淼账户余额为`￥80`,这个基础上做了一个`balance-10`的操作之后再查询就变成了`￥60`，也就是说，余额直接从`80`降到了`60`，这在数学上是不符合逻辑的，因为此事务仍然受到来自其他事务的并发更新的干扰。也即是说导致了数据不一致的问题。

4. 回滚`TX2`的事务，继续完成更高级别隔离机制的探索。

```sql
# TX2
mysql> ROLLBACK;
Query OK, 0 rows affected (0.07 sec)

mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      70 | RMB      | 2023-02-07 11:18:08 |
+----+-------+---------+----------+---------------------+
1 row in set (0.12 sec)
```

##### 可序列化

终于走到了最后的`BOSS`,可序列化隔离级别。

1. 国际惯例，依旧先确保把两个事务隔离级别修改为`SERIALIZABLE`并开启事务。

```sql
# TX1+TX2
mysql> set session transaction isolation level serializable;
Query OK, 0 rows affected (0.01 sec)

mysql>  select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| SERIALIZABLE            |
+-------------------------+
1 row in set (0.12 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)
```

2. `TX1`查询全部账户信息，`TX2`只查询汪淼的个人账户信息。

```sql
# TX1
mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      70 | RMB      | 2023-02-07 11:18:08 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.12 sec)
# TX2
mysql> SELECT * FROM money WHERE id = 1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      70 | RMB      | 2023-02-07 11:18:08 |
+----+-------+---------+----------+---------------------+
1 row in set (0.09 sec)
```

3. 通过`TX1`将汪淼的余额再扣`￥10`。

```sql
# TX1
update accounts set balance = balance - 10 where id = 1;
# 超时
1205 - Lock wait timeout exceeded; try restarting transaction
```

奇怪的是，更新操作被阻塞了，等待一段时间之后出现了超时提示。

> 原因是，在可序列化隔离级别中，`MySQL`隐含地将所有普通`SELECT`查询转换为`SELECT FOR SHARE`。从而使得持有`SELECT FOR SHARE`锁的事务只允许其他事务读取记录，但不允许`UPDATE`或`DELETE`。

所以有了这种锁机制的参与，上面出现过的**数据集不一致**的情况就不存在了。

所以这里还需要格外注意一个问题，当你在你的项目中使用**可序列化的隔离级别时**，请确保你已经实现了事务重试策略，以防发生超时。

4. 回滚方才的`TX1`,重新开启事务。

```sql
# TX1
mysql> ROLLBACK;
Query OK, 0 rows affected (0.01 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM money;
+----+--------+---------+----------+---------------------+
| id | owner  | balance | currency | created_at          |
+----+--------+---------+----------+---------------------+
|  1 | 汪淼   |      70 | RMB      | 2023-02-07 11:18:08 |
|  2 | 史强   |     100 | RMB      | 2023-02-07 09:51:39 |
|  3 | 叶文洁 |     100 | RMB      | 2023-02-07 09:52:36 |
+----+--------+---------+----------+---------------------+
3 rows in set (0.10 sec)
```

5. 现在我们重新复现上面一个操作，但这次会在`TX1`更新超时之前，我们在`TX2`中执行同样的更新操作，看下结果如何？

```sql
# TX1
mysql> update money set balance = balance - 10 where id = 1;
--
# TX2
mysql> update money set balance = balance - 10 where id = 1;
1213 - Deadlock found when trying to get lock; try restarting transaction
# TX1
mysql> update money set balance = balance - 10 where id = 1;
Query OK, 1 row affected (4.71 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

注意，我们分别在`TX1`和`TX2`中执行同一条查询语句，这导致两个事务都会进入相互等待的过程，知道其中一个`TX`结束或者等待超时，这就是**死锁**。

```sql
1213 - Deadlock found when trying to get lock; try restarting transaction
```

所以在实际开发中，在使用 **可序列化** 隔离级别时需要考虑出现死锁的情况。

6. 回滚`TX1`和`TX2`并重新开启事务。

```sql
# TX1 + TX2
mysql> ROLLBACK;
Query OK, 0 rows affected (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM money WHERE id=1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      70 | RMB      | 2023-02-07 11:18:08 |
+----+-------+---------+----------+---------------------+
1 row in set (0.09 sec)
```

可以发现此时两个事务的查询结果都是统一的。

7. 现在我们来更新`TX1`并提交`TX2`。

```sql
# TX1
mysql> update money set balance = balance - 10 where id = 1;
--
# TX2
mysql> COMMIT;
Query OK, 0 rows affected (0.00 sec)

# TX1
mysql> update money set balance = balance - 10 where id = 1;
Query OK, 1 row affected (8.57 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

我们在更新`TX1`时自动进入阻塞状态，此时再去提交`TX2`之后锁被立即释放，因此`TX1`的更新操作阻塞取消并成功执行。

```sql
# TX1
mysql> SELECT * FROM money WHERE id =1;
+----+-------+---------+----------+---------------------+
| id | owner | balance | currency | created_at          |
+----+-------+---------+----------+---------------------+
|  1 | 汪淼  |      60 | RMB      | 2023-02-07 13:51:43 |
+----+-------+---------+----------+---------------------+
1 row in set (0.10 sec)
```

通过上面的一些了演示，我们可以总结出以下关系。

![](https://images.waer.ltd/img/20230206215754.png)

- 在`MySQL`中，最低的隔离级别，未提交读允许所有4种现象发生,也就是说，这个级别的隔离机制可有可无一般。
- 已提交读只防止**脏读**，其余3种现象仍有可能发生。
- 可重复读取级别阻止了前3种现象：**脏读、不可重复读取和幻象读取**。但它仍然可能导致数据一致性问题。
- 最高的隔离级别：可序列化是最严格的。它可以防止所有4种现象，这么强大的背后多亏了锁定机制。

****
> 文中用到的演示用数据库配套文件自取地址:[`MySQL`事务与隔离级别配套`SQL`](https://github.com/08820048/Blog-Article-Materials)




