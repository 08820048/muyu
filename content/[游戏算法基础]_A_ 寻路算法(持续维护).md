

+++
title = "[游戏算法基础]_A_ 寻路算法(持续维护)"
date = 2025-03-18
tags = ["游戏算法", "A*算法", "寻路算法", "游戏开发", "算法基础"]
description = "详细介绍A*寻路算法的原理、实现和在游戏开发中的应用，包括算法优化和实际案例分析。"
+++

> 在开始阅读之前,本文阿婆主默认你已经掌握或者了解以下支撑内容:
>
> - 玩过游戏
>
> - 买菜用的数学
> - 图论基础(深度、广度、Dijkstra)
> - C++编程
> - 非色盲选手

## 算法简介

**A\*寻路算法**是一种在图形平面上寻找**最短路径**的有效方法。它被广泛应用于游戏开发、路径规划、机器人导航等领域。

和一些其他的最短路径搜寻算法不同,A星算法是一种启发式的搜索算法,通过评估每个节点的代价来选择最优路径。A星结合了知名的`Dijkstra`算法和贪心算法的优点,因此被广泛的应用在各个领域,尤其是游戏开发中,对于游戏中AI角色或者NPC角色以及一些自动寻路功能的开发中更是常客。

---

## 算法核心概念

对于A星的核心,这里主要讲一下其中的两个核心函数,一是代价函数,第二则是启发式函数。

### 代价函数$f(n) = g(n) + h(n)$

- $g(n)$:从起点到当前节点$n$的实际代价,也就是已经走过的那部分路径。 
- $h(n)$:从$n$到目标点的启发式估计代价(使用启发函数计算得到的距离)。
- $f(n)$:代价评估函数,也即是$g(n) + h(n)$的值,决定了搜索的优先级。

![1](https://images.waer.ltd/notes/202503181309987.png)

### 启发式函数

启发式函数（Heuristic Function）是一种用于引导搜索算法的方法，通过估计当前状态到目标状态的最优代价，帮助算法更高效地找到解决方案。它通常用于**启发式搜索**（如 A* 算法、贪心搜索）中，以减少搜索空间，提高搜索效率。

在路径搜索或状态空间搜索中，启发式函数用于评估一个状态的“优越性”或“接近目标的程度”，从而帮助算法优先探索可能更优的路径。例如，在 A* 算法中，启发式函数用于估计从当前节点到目标节点的最短距离。

#### 常见的启发式函数

**1. 欧几里得距离（Euclidean Distance）**

$h(n) = \sqrt{(x_{\text{goal}} - x_n)^2 + (y_{\text{goal}} - y_n)^2}$

>欧几里得距离计算的是两点之间的直线最短距离，适用于**连续空间**（如3D世界）或者允许**对角线自由移动**的环境。

**2.曼哈顿距离（Manhattan Distance）**

$h(n) = |x_{\text{goal}} - x_n| + |y_{\text{goal}} - y_n|$

> 适用于只能水平或者垂直移动的环境,比如棋盘网格状的地图中,常见的如迷宫类游戏。

**3.切比雪夫距离（Chebyshev Distance）**

$h(n) = \max(|x_{\text{goal}} - x_n|, |y_{\text{goal}} - y_n|)$

> 一般用于允许对角线移动的八方向网格地图中。 

**下面是这三种常见函数的对比总结**:

| 启发式函数       | 适用场景                               | 适用游戏类型                 | 具体游戏示例                       |
| ---------------- | -------------------------------------- | ---------------------------- | ---------------------------------- |
| **欧几里得距离** | 连续空间，适用于**自由移动**的 3D 世界 | FPS、开放世界、RTS、驾驶游戏 | GTA 5、使命召唤、星际争霸 2        |
| **曼哈顿距离**   | 网格地图，**只能水平 / 垂直移动**      | 2D 像素风、回合制 RPG、战棋  | 火焰纹章、博德之门 3、勇者斗恶龙   |
| **切比雪夫距离** | **允许对角线移动**的网格地图           | 战略游戏、棋盘类、生存游戏   | 国际象棋、魔兽争霸 3、暗黑破坏神 2 |

为了方便理解,如果没有特殊说明,后续的示例都是基于 **曼哈顿距离**作为启发式函数来讲解的。

举个例子,假设存在下面这样一个地图,其中图二是图一的数组化形式,逻辑上他们是等效的:

![image-20250318134713119](https://images.waer.ltd/notes/202503181347197.png)

下面是其中一条最优路径的图示:从`(0,0)`出发到达`(3,3)`

![image-20250318150755239](https://images.waer.ltd/notes/202503181507389.png)



对于上面的网格地图来说,如果是启发式函数基于 **曼哈顿距离**的情况下,该示例的$g(n),h(n),f(n)$的计算结果如下:

| **位置 (x,y)**   | **G(n) (路径代价)** | **H(n) (曼哈顿)** | **F(n) = G(n) + H(n)** |
| ---------------- | ------------------- | ----------------- | ---------------------- |
| **(0,0) (起点)** | 0                   | **6** (3+3)       | 6                      |
| **(0,1)**        | 1                   | **5** (3+2)       | 6                      |
| **(1,1)**        | 2                   | **4** (3+1)       | 6                      |
| **(1,2)**        | 3                   | **3** (3+0)       | 6                      |
| **(1,3)**        | 4                   | **2** (2+0)       | 6                      |
| **(2,3)**        | 5                   | **1** (1+0)       | 6                      |
| **(3,3) (终点)** | 6                   | **0** (0+0)       | 6                      |

> **纸上得来终觉浅**,建议你掏出压箱底的**稿纸**和垃圾桶里的**2B**,自己模拟计算所需的代价函数,强化理解。

注意,为了节省篇幅,这里列出的只是其中一条可行的路径,就这个示例地图来说,可能存在多个最优的选择,并不唯一。 

---

## A*算法代码实现(C++)

理解了A星的基本原理之后,接下来我们使用C++实现一个A星的基本算法流程。

**0.相关头文件**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
#include <unordered_map>
#include <algorithm>
```

---

### **1. Node结构**

```cpp
// 节点结构体
struct Node {
    int x, y;       // 坐标
    float g, h;     // g: 从起点到当前节点的代价, h: 启发式估价
    Node* parent;   // 父节点指针, 用于回溯路径

    Node(int x, int y, float g, float h, Node* parent = nullptr)
        : x(x), y(y), g(g), h(h), parent(parent) {}

    float f() const { return g + h; } // 计算总代价 f = g + h
};
```

> - g：从起点到当前节点的 **真实代价**（步数）。
>
> - h：当前节点到目标点的 **估算代价**（启发式函数）。
>
> - f = g + h：总代价，A* 总是优先选择 f 最小的节点。

---

**2.定义`Compare`结构体**

```cpp
// 优先队列比较器, 使得 f 值较小的节点优先出队
struct Compare {
    bool operator()(const Node* a, const Node* b) {
        return a->f() > b->f();
    }
};
```

> 由于优先队列`priority_queue`默认是 **大顶堆(最大值优先)**,但 `A* `需要 **f 值最小** 的优先出队，因此这里实现了 **小顶堆**（f 小的优先）。

---

**3.启发式函数**

```cpp
// 启发式函数: 使用曼哈顿距离（适用于只能水平或垂直移动的情况）
float heuristic(int x1, int y1, int x2, int y2) {
    return std::abs(x1 - x2) + std::abs(y1 - y2);
}
```

> - 曼哈顿距离 **适用于网格地图**（只能水平/垂直移动）。
> - 后续也会给出其他几种函数的代码参考,你可以自己更换不同的启发函数来研究不同情况下的`A*`

**4. A*搜索主方法**

```cpp
// A* 搜索算法
std::vector<std::pair<int, int>> aStarSearch(std::vector<std::vector<int>>& grid,
                                             std::pair<int, int> start,
                                             std::pair<int, int> goal) {
    int rows = grid.size(), cols = grid[0].size();
    std::priority_queue<Node*, std::vector<Node*>, Compare> openSet; // 优先队列
    std::unordered_map<int, Node*> allNodes; // 记录所有访问过的节点

    // 创建起始节点并放入开启列表
    Node* startNode = new Node(start.first, start.second, 0, heuristic(start.first, start.second, goal.first, goal.second));
    openSet.push(startNode);
    allNodes[start.first * cols + start.second] = startNode;

    // 4个移动方向（右、下、左、上）
    std::vector<std::pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    std::vector<std::pair<int, int>> path;

    while (!openSet.empty()) {
        Node* current = openSet.top(); // 取出当前代价最小的节点
        openSet.pop();

        // 如果到达目标点，回溯路径
        if (current->x == goal.first && current->y == goal.second) {
            while (current) {
                path.emplace_back(current->x, current->y);
                current = current->parent;
            }
            std::reverse(path.begin(), path.end());
            break;
        }

        // 遍历 4 个方向的邻居节点
        for (auto [dx, dy] : directions) {
            int nx = current->x + dx, ny = current->y + dy;

            // 边界检查和障碍物检查
            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] == 1)
                continue;

            float gNew = current->g + 1; // g 值 +1 (假设所有移动的代价相等)
            float hNew = heuristic(nx, ny, goal.first, goal.second);
            int key = nx * cols + ny;

            // 如果该节点未被访问或找到更短路径
            if (!allNodes.count(key) || gNew < allNodes[key]->g) {
                auto neighbor = new Node(nx, ny, gNew, hNew, current);
                openSet.push(neighbor);
                allNodes[key] = neighbor;
            }
        }
    }

    // 释放所有节点的内存
    for (auto& [_, node] : allNodes)
        delete node;

    return path;
}
```

**5.路径字符化(可选)**

> 这不是算法必须的步骤,添加这部分代码主要是用来打印路径字符,直观的理解搜索的结果。

```cpp
// 可视化打印路径
void printGridWithPath(std::vector<std::vector<int>>& grid, const std::vector<std::pair<int, int>>& path,
                       std::pair<int, int> start, std::pair<int, int> goal) {
    std::vector<std::vector<char>> display(grid.size(), std::vector<char>(grid[0].size(), ' '));

    // 初始化网格，障碍物用 '#' 标记
    for (int i = 0; i < grid.size(); ++i) {
        for (int j = 0; j < grid[0].size(); ++j) {
            display[i][j] = (grid[i][j] == 1) ? '#' : '.';
        }
    }

    // 绘制路径
    for (const auto& [x, y] : path) {
        display[x][y] = '*';
    }

    // 标记起点和终点
    display[start.first][start.second] = 'S';
    display[goal.first][goal.second] = 'G';

    // 打印网格
    std::cout << "\nA* 搜索路径:\n";
    for (const auto& row : display) {
        for (char cell : row) {
            std::cout << cell << ' ';
        }
        std::cout << '\n';
    }
}
```

字符化地图说明:

> #：障碍物
>
> .：可行区域
>
> *：路径
>
> S：起点
>
> G：终点

---

**5. 主函数**

```cpp
int main() {
   std::vector<std::vector<int>> grid =
        {
          {0,0,1,0},
          {1,0,0,0},
          {0,1,0,0},
          {0,1,0,0},
        };

    std::pair<int, int> start = {0, 0};
    std::pair<int, int> goal = {6, 6};

    auto path = aStarSearch(grid, start, goal);

    if (path.empty()) {
        std::cout << "未找到可行路径!" << std::endl;
    } else {
        std::cout << "最短路径:\n";
        for (auto [x, y] : path)
            std::cout << "(" << x << ", " << y << ") -> ";
        std::cout << "目标点\n";
        printGridWithPath(grid, path, start, goal);
    }

    return 0;
}
```

![image-20250318153504868](https://images.waer.ltd/notes/202503181535055.png)

---

## 关于A*的一些优化方向

原生的A星算法已经相对高效,但是在大规模地图或者复杂路径规划的问题中可能会遇到性能瓶颈。因此具体的优化方向还得取决于具体的问题,这里只是列出一些常见的优化方向,作为学习指南。

### 数据结构上的优化

> 这里的数据结构优化基于本文实现的代码而言。

`A*` 依赖 **openSet**（开启列表），当前实现使用的是 `std::priority_queue`，但是 `std::priority_queue` **不支持高效的更新操作**，这可能导致节点重复入队并降低性能。

因此,可以使用`std::unordered_map+最小堆`进行优化:

- `std::unordered_map` 存储节点索引，最小堆（`Binary Heap`）用于快速取出 `f(n)` 最小的节点。
- 需要额外维护一个哈希表来存储节点的位置，以支持 **堆的 decrease-key 操作**。

---

### 启发式函数的选择

这个没啥说的,最基本的原则就是根据项目的类型来选择不同的启发式函数。

---

### 逻辑上的优化

常见的优化方向有:

- 双向`A*`:同时从起点和终点进行搜索,相遇时停止。
- 跳点搜索(`JPS`):跳过冗余的节点,适用于规则网格地图,可以极大的减少搜索空间。
- 图割方法(对称`A*`):在动态地图中,分割图像区域,减少搜索范围。

---
> 欢迎关注后续更新....