+++
title = "游戏开发必备：高效的 AABB、球体和 OBB 碰撞检测算法"
date = 2025-04-07
tags = ["游戏开发", "碰撞检测", "AABB", "OBB", "算法", "3D数学"]
description = "详细介绍游戏开发中的碰撞检测算法，包括AABB、球体和OBB碰撞检测的数学原理、实现方法和优化策略，适合游戏开发者学习参考。"
+++

## 更新日志
2025-4-7
> - 新增OBB部分内容



---
---
在游戏开发中，碰撞是一个常见且基础的术语，也是绝大部分3D游戏避不开的技术点。本文基于3D/2D游戏中物体碰撞的基本数学原理、计算实现等方面进行展开，时间关系，关于碰撞检测可能涉及到的物理部分的内容可能会在后续的维护中进行更新。

> - 文中涉及到的三维配图均来自[VisuAlgoX](https://visux.ilikexff.cn/)(已开源,好用麻烦点个star)
> - 文中涉及的手稿均为本人亲手画的,比较抽象但是可以食用,不是美术专业,理解下吧!

---

## 基础铺垫



在正式讨论物体碰撞之前，有必要先铺垫一些相关的基础知识。这不仅能帮助我们更好地理解后续内容，特别是对于初学者来说，也能降低理解成本。



在现实世界中，物体的形状是复杂而不规则的，但在三维游戏世界中，我们所看到的每一个物体——无论是赛车、人物角色、墙壁，还是武器——实际上都是由相对规则的几何图形包裹起来的。这些几何图形被称为**碰撞体（Collision Shape）**，它们决定了游戏引擎在进行碰撞检测时如何计算物体之间的交互。

你可能会问，为什么要使用几何图形，而不是直接采用物体本身的精确模型来进行碰撞计算呢？



原因很简单，主要是为了**优化性能，减少计算量**。游戏运行时，可能会有成千上万个物体相互作用，如果直接使用复杂的三角网格进行碰撞检测，计算成本将会非常高，严重影响游戏的流畅性。

因此，我们通常使用相对简单的几何形状（如**矩形、立方体、球体、胶囊体等**）来近似表示物体的边界，从而加快碰撞检测的计算速度。

![image-20250402212043171](https://images.waer.ltd/notes/202504022120396.png)

那么，应该如何选择适当的碰撞体来包裹物体呢？这并没有固定的标准，而是取决于物体本身的形状、用途以及性能需求。例如：

- **立方体（AABB 或 OBB）** 适用于墙壁、箱子等规则物体，计算高效。
- **球体（Sphere）** 适用于圆形物体，如弹珠、行星，旋转无须复杂计算。
- **胶囊体（Capsule）** 常用于人物角色，因为它能更平滑地处理地形变化。
- **凸包（Convex Hull）** 适用于需要更精确碰撞的物体，但计算量比基本几何体高。
- **网格（Mesh）** 只在特殊情况下使用，如静态场景，因其计算复杂度较高。

总之，游戏中的物体通常不会使用完全精确的形状进行碰撞检测，而是根据具体需求选择合适的近似几何体，以在**性能与精度之间取得平衡**。掌握这些概念，有助于更好地理解后续碰撞检测相关的算法和优化策略。

> 当然，上述列出的几种情况的碰撞，并不会都在本文中体现，至少目前不会，因此无须担心看完脑壳大的问题。

------

## 碰撞检测



有了上述的理解基础，现在可以开始碰撞检测的相关内容了。当我们需要判断确认两个物体(多物体同理)之间是否会发生碰撞时，通常不会使用物体本身的数据作为判断计算的依据，这一点在铺垫内容中已说过，这样做的代价是很高的，真实物体复杂的形状会导致高密度的计算，加剧性能消耗。与此同时，这样的做法也会使得碰撞检测变得异常复杂。

所以，在碰撞检测中，通常使用的是相对简单的几何形状来替代，前面提到过，这样的做法可以大大减少计算量，降低计算的复杂度。究其原因，包括但不限于这些几何形状通常具有很好的数学定义，使得代码也更加容易编写。

虽然简单的几何形状可以方便我们更好的简化计算，总结更加高效的碰撞算法，但是他也存在一定的不足，如果你完全理解了这之前的铺垫内容病结合我们提供的配图，想必对于这样做的不足之处已心里有点B数了吧！

希望就是你想的那样，这样做的一个最突出的不知在于他们不能很好的包裹原物体，比如下面这张途中就是采用了矩形来包裹里面屎黄色甜甜圈。

首先直观的一点是，对于物体本体甜甜圈来说，它仅仅占用来矩形的一部分空间，这导致存在大量的空间冗余，换个角度说就是，这个矩形并没有很好很紧实的将我们的甜甜圈围起来，但是我们在做碰撞检测时，参与计算的实际上就是这个外层的矩形，那么在实际情况下，我们检测到的碰撞可能只是一个近似碰撞，而非精确的碰撞。

![image-20250402213654112](https://images.waer.ltd/notes/202504022136177.png)

所以，通过上面的内容，你应该知道一点，我们讨论的碰撞检测，都是基于包裹在外围的矩形来计算的，因此，在大部分情况下，这会是一个近似值。下图是一个简单的示意图,可以配合理解。

![截屏 2025-04-02 22.04.49](https://images.waer.ltd/notes/202504022208894.jpeg)

### AABB和AABB

AABB（Axis-Aligned Bounding Box，轴对齐包围盒）是一种与场景坐标轴对齐的**矩形或立方体**碰撞形状。它可以用来包围游戏中的物体，并用于高效的碰撞检测。AABB 的概念不仅适用于**三维（3D）世界**，在**二维（2D）环境**中也同样适用，区别在于：

- **3D AABB**：边界框沿 x、y、z 轴对齐，通常用来包围立方体或其他三维物体。
- **2D AABB**：边界框仅沿 x、y 轴对齐，适用于二维游戏中的碰撞检测。

AABB 的“轴对齐”意味着它的边缘始终与坐标轴**平行**，即：

- 在**二维空间**，左右边界平行于 y 轴，上下边界平行于 x 轴。
- 在**三维空间**，所有六个面都分别与 x、y、z 轴平行，没有旋转。

由于这种固定的对齐方式，AABB **不需要复杂的矩阵运算**，而是可以通过简单的**数值比较**（最小/最大点的重叠判断）来确定两个 AABB 是否发生碰撞。因此，**无论是在 2D 还是 3D 环境中，AABB 都是计算两个物体碰撞的最快方法之一**，常用于游戏引擎中的**初步碰撞检测（Broad Phase）**。

![image-20250402222017444](https://images.waer.ltd/notes/202504022220552.png)

判断一个点是否在 AABB 内部非常简单 ,只需要检查该点的坐标是否位于 AABB 的范围内，且需要分别对每个轴进行检查。这是一种常见的判定方法,基于 **最小点（Min）和最大点（Max**

![image-20250403111247691](https://images.waer.ltd/notes/202504031112746.png)

下面是一个基于2维空间中判断检测的示意图,主要是理解上面的提到的两个最值点的原理:

![IMG_142305A0761D-1](https://images.waer.ltd/notes/202504022247724.jpeg)

OK,基于此,我们简化一下该流程,假设我们只在X轴上进行重叠判断,可以得到下面的示意图,对于X,我们只需要判定物体的$A_(minX)-A(maxX)$和$B_(minX)-B_(maxX)$时候重叠。

![IMG_AEBED0883639-1](https://images.waer.ltd/notes/202504022241316.jpeg)

原理相似,我们可以很快推导出基于三维空间的重叠判断原理:

如果两个 AABB 在**所有轴向上**都有重叠，则它们发生碰撞。例如，在 3D 空间中存在两个AABB:

> - **A** 的范围为 (A_minX, A_maxX, A_minY, A_maxY, A_minZ, A_maxZ)
>
> - **B** 的范围为 (B_minX, B_maxX, B_minY, B_maxY, B_minZ, B_maxZ)

那么它们发生碰撞的条件可以表示为:

$A_{\text{maxX}} \geq B_{\text{minX}} \quad \text{且} \quad A_{\text{minX}} \leq B_{\text{maxX}}$

$A_{\text{maxY}} \geq B_{\text{minY}} \quad \text{且} \quad A_{\text{minY}} \leq B_{\text{maxY}}$

$A_{\text{maxZ}} \geq B_{\text{minZ}} \quad \text{且} \quad A_{\text{minZ}} \leq B_{\text{maxZ}}$

转化成语言表达就是

- **X 轴上**，A 和 B 有重叠
- **Y 轴上**，A 和 B 有重叠
- **Z 轴上**，A 和 B 有重叠

只有**三个轴上都有重叠**，两个 AABB 才会发生碰撞。

示例代码:

```cpp
struct AABB {
    Vector3 min;  // AABB 的最小点
    Vector3 max;  // AABB 的最大点

    bool Intersects(const AABB& other) const {
        return (max.x >= other.min.x && min.x <= other.max.x) &&
               (max.y >= other.min.y && min.y <= other.max.y) &&
               (max.z >= other.min.z && min.z <= other.max.z);
    }
};
```

----

> 想想看,为什么上述这些条件成立的情况下, 就能判断它们基于某个轴有重叠?

不妨先假设AB两个物体在X轴上有重叠,那么我们可以得到哪些条件?

区间关系:

- A 的范围是 [A_minX, A_maxX]
- B 的范围是 [B_minX, B_maxX]

**发生重叠的充要条件是：两个区间存在交集，即至少有部分范围相交。**

换句话说就是,如果这两个物体在X轴有重叠,那么就意味着它们X轴范围存在 **交集**。

由此可得:

1. **A 的右端点必须大于等于 B 的左端点**（否则 A 在 B 左侧，没交集）

$A_{\text{maxX}} \geq B_{\text{minX}}$

2. **A 的左端点必须小于等于 B 的右端点**（否则 A 在 B 右侧，没交集）

$A_{\text{minX}} \leq B_{\text{maxX}}$

> 结合上面给出的第二张手稿图理解,两种颜色在X轴上的部分就是这两个物体在该轴上的映射,所以又红又绿的部分就是它们的交集 ,很好理解。

---

### Point和AABB

理解了上面AABB和AABB之间的碰撞检测原理,那么这里即将提到的点与AABB的碰撞你将会得心应手。

点与 AABB 的碰撞检测比 **AABB 对 AABB** 更简单，本质上是**判断点是否在 AABB 的范围内**。

数学角度:

假设:

- 存在点P的坐标为($P_x,P_y,P_z$)
- AABB的最小点(Min)为($B_(minX),B_(minY),B_(minZ)$)
- AABB的最大点(Max)为($B_(maxX),B_(maxY),B_(maxZ)$)

那么,点P时候在AABB内部的判断条件就是:

$B_{\text{minX}} \leq P_x \leq B_{\text{maxX}}$

$B_{\text{minY}} \leq P_y \leq B_{\text{maxY}}$

$B_{\text{minZ}} \leq P_z \leq B_{\text{maxZ}}$

> **如果上述三个条件都满足，则点 P 位于 AABB 内部，否则点 P 在 AABB 之外。**

上述的推导是基于三维的,但同样适用于二维空间,如果觉得吃力,配合下图食用,口感更佳!!

![IMG_EF87FF0525AE-1](https://images.waer.ltd/notes/202504022333044.jpeg)

```cpp
struct Vector3 {
    float x, y, z;
};

struct AABB {
    Vector3 min;  // AABB 的最小点
    Vector3 max;  // AABB 的最大点

    bool Contains(const Vector3& point) const {
        return (point.x >= min.x && point.x <= max.x) &&
               (point.y >= min.y && point.y <= max.y) &&
               (point.z >= min.z && point.z <= max.z);
    }
};
```

**优化与扩展**

> - **快速剔除**：在 3D 空间中，如果某个维度上 Px 超出了 BmaxX 或 BminX，就可以直接判定点不在 AABB 内部，不需要检查其他维度。
> - **空间划分优化**：在大型 3D 场景中，可以使用 **八叉树（Octree）** 或 **BVH（Bounding Volume Hierarchy）** 来加速点与 AABB 的查询。

---

### Point和球

这个就更简单了,要判断一个球体时候包含一个点,我们只需要计算这个点到球体中心的距离,如果这个距离小于等于球体的半径R,则说明该点在球体内。

![IMG_458BB2EA0A70-1](https://images.waer.ltd/notes/202504022345741.jpeg)

对于距离的计算,可以使用欧几里得距离计算,因此,最终的数学条件应该满足:

$\sqrt{(P_x - C_x)^2 + (P_y - C_y)^2 + (P_z - C_z)^2} \leq R$

当然,在实际开发中,为了提高计算效率,可以省去开方的计算,直接使用平方距离:

$(P_x - C_x)^2 + (P_y - C_y)^2 + (P_z - C_z)^2 \leq R^2$

对于二维,也是同一个原理,无非是少一个坐标的事情,这里不再赘述,下面看下示例代码:

```cpp
#include <cmath>

struct Vector3 {
    float x, y, z;
};

struct Sphere {
    Vector3 center;  // 球心坐标
    float radius;    // 球半径

    bool Contains(const Vector3& point) const {
        float dx = point.x - center.x;
        float dy = point.y - center.y;
        float dz = point.z - center.z;
        return (dx * dx + dy * dy + dz * dz) <= (radius * radius);
    }
};
```

**扩张优化**

- 就是上面提到过的采用平方距离的方式,提高计算效率。
- 如果 $|Px - Cx| > R，|Py - Cy| > R，|Pz - Cz| > R$，那么点一定在球外，可以提前剔除。
- 在 3D 碰撞检测中，球体比 AABB 更适用于旋转物体，因为球体没有方向问题，计算时不会受到物体旋转的影响。

> 关于最后一点,这里补充一下,在考虑物体旋转的情况下,球体确实有着没有方向问题的先天优势,但是它的适用范围有限,对于那些不规则(没有很近似球)的形状物体来说,使用球体可能无法完全包裹住原物体
>
> 一个很常见的例子就是,游戏中的人物角色,如果你考虑用一个球体去包裹住一个人,不能说不行,只是很抽象,想想看,一个160米高的人你得需要多大的球体才可以全部包裹?
>
> 即使包裹住了,那么人物在球体中就只占据一个方向大部分空间,比如高度维度(头和脚刚好顶住球体的上下顶点),但是人物前后会空出很大的空间,这直接导致在计算碰撞时,会出现很大的误差。
>
> 试想一下,你被装到一个刚好能容纳你的充气球体中和另外一个同样装扮的人碰撞的时候,相互碰撞接触到的都是两个人的球体,哪怕两人的球体气囊紧紧贴在一起,但是实际两个人距离物理意义上的碰撞还相差甚远!
>
> 这就是误差,别忘了我们一开始说过的,游戏世界中,碰撞计算不是基于原物体进行,因此这个误差理论上来说尽可能小才会得到更佳真实的游戏体验。

下面是以射击游戏来简单举例这一点:

![截屏 2025-04-03 00.17.03](https://images.waer.ltd/notes/202504030017345.jpeg)

字体有点帅,所以这里简单解释一下,黑色的人物是我们游戏中实际操纵的角色,但是在游戏世界中,假设我们采用球体来包裹角色进行碰撞检测,假设子弹接触到人体表示中弹了,要死人的那种。

那么基于这个假设,当子弹打到球体上时,系统就已经判定你被击毙了,当其时此时子弹距离你角色本身好有一段距离,这就是误差,这样的设计是不合理的,因此,在面对先人物这样的实体时,3D游戏中一般采用胶囊体来作为碰撞检测的外在盒子,而不是球体。

---

###  球体和球体

球体与球体的碰撞检测和 **点与球体** 类似，依然使用 **欧几里得距离**，但这次需要检查**两个球心之间的距离**是否小于等于它们半径之和。

![IMG_FA5609536869-1](https://images.waer.ltd/notes/202504031012543.jpeg)

**数学原理:**



$\sqrt{(Ax - Bx)^2 + (Ay - By)^2 + (Az - Bz)^2} \leq R_A + R_B$



同理,为了简化计算,可以使用平方距离:

$(Ax - Bx)^2 + (Ay - By)^2 + (Az - Bz)^2 \leq (R_A + R_B)^2$



其中R代表球A和球B的半径。

```cpp
#include <cmath>

struct Vector3 {
    float x, y, z;
};

struct Sphere {
    Vector3 center;  // 球心坐标
    float radius;    // 球半径

    bool Intersects(const Sphere& other) const {
        float dx = center.x - other.center.x;
        float dy = center.y - other.center.y;
        float dz = center.z - other.center.z;
        float distanceSquared = dx * dx + dy * dy + dz * dz;
        float radiusSum = radius + other.radius;
        return distanceSquared <= (radiusSum * radiusSum);
    }
};
```

> 可以用于球形物体的**碰撞检测**，如**弹珠、行星、子弹轨迹**等。

---

### 球体和AABB

在游戏开发和物理引擎中，**球体（Sphere）与 AABB（轴对齐包围盒）** 的碰撞检测常用于检测角色（球形范围）与障碍物（AABB）之间的碰撞，如 FPS 游戏中的子弹检测，或者物理引擎中物体与环境的交互。

判断碰撞条件,我们可以计算AABB的每一个顶点与球心的距离,但是这样不仅繁琐,而且有些多余,一般的方法是计算AABB的最近点到球心的距离即可。

直观来看,一个球体与AABB的碰撞检测就是检查AABB内部的**最近点**到**球心的距离**是否小于等于**球的半径**。如果该条件成立,可以判定碰撞,否则不发生碰撞。

注意,这里提到几个关键词:

1. 最近点
2. 球心、半径

对于球心和半径,想必都很好理解,这里主要讲一下什么是AABB的最近点。

所谓的最近点指的是AABB内部与球心距离最近的那个点。这个点是AABB表面或者内部的某个点,它是球心投影到AABB内部的结果。

![IMG_5F7809059412-1](https://images.waer.ltd/notes/202504031035047.jpeg)

对于上图中的AABB和球体来说,这个绿色的矩形(二维空间下)中每一个点到球心的距离都不一样,但是我们需要找到的是那个距离球心最近的点,也就是途中黑颜色的D标注的距离。

推广到三维空间中,也是同样的原理:下面是一个简单的模拟。

![image-20250403104020869](https://images.waer.ltd/notes/202504031040997.png)

- 如果球心在AABB内部,那么最近点就是球心本身,必然会发生碰撞。
- 如果球心在AABB外部,那么最近点就是球星投影到AABB上的某个点,我们只需要判断这个最近点到球心的距离时候小于等于球的半径。 

**数学原理:**

- **球体** 的球心坐标为$P = (P_x, P_y, P_z)$，半径为 R。
- AABB 由 **最小点** $B_{\min} = (B_{\min X}, B_{\min Y}, B_{\min Z})$ 和 最大点 $B_{\max} = (B_{\max X}, B_{\max Y}, B_{\max Z})$定义。

那么,我们可以逐维计算最近点:

对于每一个轴,最近点的计算方法如下:

$C_x = \max(B_{\min X}, \min(P_x, B_{\max X}))$

$C_y = \max(B_{\min Y}, \min(P_y, B_{\max Y}))$

$C_z = \max(B_{\min Z}, \min(P_z, B_{\max Z}))$

> - **min(P, B_max)** 限制上界，确保最近点不会超出 AABB 的最大边界。
> - **max(P, B_min)** 限制下界，确保最近点不会小于 AABB 的最小边界。

最终得到最近点为$C = (C_x, C_y, C_z)$

```cpp
#include <vector>
#include <limits>

struct Vector3 {
    float x, y, z;
};

struct AABB {
    Vector3 min;
    Vector3 max;
};

AABB ComputeAABB(const std::vector<Vector3>& vertices) {
    AABB box;
    box.min = {std::numeric_limits<float>::max(), std::numeric_limits<float>::max(), std::numeric_limits<float>::max()};
    box.max = {std::numeric_limits<float>::lowest(), std::numeric_limits<float>::lowest(), std::numeric_limits<float>::lowest()};

    for (const auto& v : vertices) {
        box.min.x = std::min(box.min.x, v.x);
        box.min.y = std::min(box.min.y, v.y);
        box.min.z = std::min(box.min.z, v.z);

        box.max.x = std::max(box.max.x, v.x);
        box.max.y = std::max(box.max.y, v.y);
        box.max.z = std::max(box.max.z, v.z);
    }
    return box;
}
```

## OBB 碰撞检测

上面讲的碰撞检测尽管计算方便快速,但是它并不适用于动态旋转的物体,这是AABB类碰撞计算的不足之处。

那么按照一般的狗血剧情,接下来我要说的就是相对于旋转物体的碰撞检计算方法了,没错,狗血的剧情就是这么的中规中矩,意外不了一点!

### OBB的基本概念

`OBB`（`Oriented Bounding Box`，有向包围盒）是一种 **任意方向的包围盒**，不同于` AABB`（轴对齐包围盒），它的边缘不一定与坐标轴对齐，而是可以 **旋转到最佳适应物体的方向**。

> - OBB 可以随物体旋转，而不会像 AABB 那样在旋转时变得过大。
> - 因为OBB不是轴对齐的,所以它通常比AABB更贴合物体的实际形状,减少多余的空白区域。
> - 同样,由于其旋转支持的特性,在处理碰撞计算时,它需要存储更多的关于旋转的信心,比如方向向量或者旋转矩阵,并且碰撞检测更复杂,所以需要相对于AABB更高的计算成本。

在二维和三维空间中,OBB通常由一下数据定义:

- **中心点C**:OBB的几何中心
- **半尺寸向量H**:表示 OBB 在每个轴方向上的半边长。
- **旋转矩阵R**（或方向向量）：定义 OBB 的方向，使其不再与坐标轴对齐。

先不要急着懵逼,接下来排好队,一个一个来!

#### 半尺寸向量

半尺寸向量通常表示 OBB 沿着其局部坐标轴的 **半边长**。假设一个 OBB 在局部坐标系下的尺寸为 $2w \times 2h \times 2d$，那么它的半尺寸向量为：$\mathbf{h} = (w, h, d)$,即:

- $w$ 是沿局部 x 轴的半边长
- $h$ 是沿局部 y 轴的半边长
- $d$ 是沿局部 z 轴的半边长

感觉话都说道这一步来,应该是理解了,但是保险起见,还是配个图吧,由于涉及到三维结构,为了各位的生命安全着想,我就不请之画手稿了(其实我偷偷画过了,看得我自己难受),直接从写好的3D辅助工具中截图好了。

![image-20250403130616215](https://images.waer.ltd/notes/202504031306352.png)

参考上图,我们只需要关注红色的三维矩形,正如你看到的,红色长方体自身存在一个三维坐标系,它就是局部坐标轴,为什么叫局部?没看到整个大场景中还存在一个世界坐标轴??这下明白了吧,局部的意思就是,这个坐标轴是针对红色立长体本身的,这很好理解。

长方体是一个长宽高分别为`(2,2,2)`的尺寸。那么可以得到它在各个维度上的半尺寸数据为`(1,1,1)`

这个向量的意义在于，它可以用于快速计算 OBB 在不同方向上的投影，特别是在碰撞检测时，通过它可以推导出 OBB 在某个方向上的投影范围。

> 由于贴动会导致我用的`typora`编辑器卡顿,所以建议还是直接去[VisuAlgoX](https://visux.ilikexff.cn/),在里面你可以通过调整几何体的参数,工具会动态的计算半尺寸向量和接下来要讲的旋转矩阵等实时数据,配合本文食用,事半功倍!
>
> ![image-20250403132229278](https://images.waer.ltd/notes/202504031322338.png)

---

#### 旋转矩阵

OBB 不是轴对齐的，它有自己的局部坐标系，方向是任意的。我们可以用 **旋转矩阵** R 来表示 OBB 的方向。旋转矩阵通常是一个 **3×3 矩阵**，它的每一列是 OBB 的局部坐标轴在世界坐标系下的方向向量：

$R = \begin{bmatrix} \mathbf{u_x} & \mathbf{u_y} & \mathbf{u_z} \end{bmatrix} \begin{bmatrix} u_{xx} & u_{xy} & u_{xz} \\ u_{yx} & u_{yy} & u_{yz} \\ u_{zx} & u_{zy} & u_{zz} \end{bmatrix}$

其中:

- $\mathbf{u_x}, \mathbf{u_y}, \mathbf{u_z}$分别是 OBB 在世界坐标系中的局部 x、y、z 轴单位向量

- 这个矩阵 **将 OBB 的局部坐标转换到世界坐标**

**旋转矩阵的计算方法**

假设OBB需要围绕某个轴旋转一定的角度,我们可以使用 **基本旋转矩阵** 进行变换。

- 绕X轴旋转

如果围绕X轴旋转的角度为$\theta$,旋转矩阵为:

$R_x(\theta) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{bmatrix}$

- 绕Y轴旋转角度为$\theta$,旋转矩阵为:

$R_y(\theta) = \begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix}$

- 绕 Z 轴旋转角度为$\theta$，旋转矩阵为：

$R_z(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}$

- 对于组合旋转的情况

如果 OBB 需要绕 **多个轴旋转**，可以组合这些旋转矩阵，例如：

$R = R_z(\theta_z) R_y(\theta_y) R_x(\theta_x)$

> 有一说一,理论说这么多,不如一个实际例子来的直观,下面就以一个半尺寸向量为`(2,1,1)`的长方体旋转矩阵的计算过程为例:

首先,基于给定信息可知:

- OBB 在 **局部坐标系** 中，顶点坐标相对于中心点 C 是：$(\pm2, \pm1, \pm1)$

- 半尺寸向量$h=(2,1,1)$
- 长宽高分别为(4,2,2)

我们假设现在该OBB围绕Z轴旋转了$30^\circ$,另外两个轴保持不动,得到:

$\theta_z = 30^\circ, \quad \theta_x = 0^\circ, \quad \theta_y = 0^\circ$

那么,围绕Z轴的旋转矩阵的计算如下:

$R_z(30^\circ) = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix}$

其中,30° 的三角函数值:$\cos 30^\circ = \frac{\sqrt{3}}{2} \approx 0.866, \quad \sin 30^\circ = \frac{1}{2} = 0.5$

代入可得:$R_z = \begin{bmatrix} 0.866 & -0.5 & 0 \\ 0.5 & 0.866 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

我们可以借助[VisuAlgoX ](https://visux.ilikexff.cn/)中的 **OBB旋转矩阵可视化**辅助工具,调整好旋转角度,验证我们的计算结果:

![image-20250403143552336](https://images.waer.ltd/notes/202504031435530.png)

可以看到,抛开结果精度,我们的计算结果是没问题的。以此类推,围绕X和Y轴旋转指定角度的旋转矩阵计算方式是同理的,可以自己尝试。 

对于组合旋转矩阵的计算,可以先分别计算出三个维度上的旋转矩阵,再作矩阵乘法运算即可,**但是需要注意的是,矩阵乘法是非交换的,组合顺序不同,结果也不同。**

下面就以XYZ三个维度旋转30、45、60度后的选择矩阵的计算为例,重点理解矩阵乘法的非交换性质。

- 绕X 30度

$R_x = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos 30^\circ & -\sin 30^\circ \\ 0 & \sin 30^\circ & \cos 30^\circ \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0.866 & -0.5 \\ 0 & 0.5 & 0.866 \end{bmatrix}$

- 绕Y 45度

$R_y = \begin{bmatrix} \cos 45^\circ & 0 & \sin 45^\circ \\ 0 & 1 & 0 \\ -\sin 45^\circ & 0 & \cos 45^\circ \end{bmatrix} \begin{bmatrix} 0.707 & 0 & 0.707 \\ 0 & 1 & 0 \\ -0.707 & 0 & 0.707 \end{bmatrix}$

- 绕Z 60度

$R_z = \begin{bmatrix} \cos 60^\circ & -\sin 60^\circ & 0 \\ \sin 60^\circ & \cos 60^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.5 & -0.866 & 0 \\ 0.866 & 0.5 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

对于最终的组合计算结果,下面给出两种不同组合的旋转顺序:

1. XYZ顺序

$R_{\text{XYZ}} = R_z R_y R_x = \begin{bmatrix} 0.353 & -0.573 &  0.739 \\ 0.612 &  0.739 &  0.280 \\ -0.707 &  0.354 &  0.612 \end{bmatrix}$

2. ZYX顺序

$R_{\text{ZYX}} = R_x R_y R_z = \begin{bmatrix} 0.353 & -0.612 &  0.707 \\ 0.927 &  0.127 & -0.354 \\ 0.127 &  0.780 &  0.612 \end{bmatrix}$

观察 $R_{\text{XYZ}}$ 和 $R_{\text{ZYX}}$ 的数值，可以发现：

- 它们的 **第一行、第二行、第三行的数值完全不同**，这意味着 **旋转的最终结果也不同**。
- 例如，在 $R_{\text{XYZ}}$ 中，第三行的 **Z 轴方向分量是 (-0.707, 0.354, 0.612)**，而在 $R_{\text{ZYX}}$ 中，它变成了 **(0.127, 0.780, 0.612)**，说明旋转的轨迹发生了变化。

我们可以在辅助工具中设置不同的旋转顺序进行验证:

![obb1](https://images.waer.ltd/notes/202504031510859.gif)

这意味着矩阵乘法是非交换的,即$R_z R_y R_x \neq R_x R_y R_z$

**旋转的顺序不同，最终物体的姿态也会不同**，因此，在 3D 变换中 **必须严格按照指定的旋转顺序**

#### 顶点计算

在 **局部坐标系**（即 OBB **未旋转** 时），顶点的坐标相对于中心点 C 为：$V_i = (\pm h_x, \pm h_y, \pm h_z)$

得到OBB八个顶点的排列方式:

> $(+h_x, +h_y, +h_z)$
>
> $(+h_x, +h_y, -h_z)$
>
> $(+h_x, -h_y, +h_z)$
>
> $(+h_x, -h_y, -h_z)$
>
> $(-h_x, +h_y, +h_z)$
>
> $(-h_x, +h_y, -h_z)$
>
> $(-h_x, -h_y, +h_z)$
>
> $(-h_x, -h_y, -h_z)$

这些坐标是 **相对于 OBB 的局部坐标系** 的，并没有考虑 OBB 在世界坐标系中的位置和旋转。

对于OBB在世界坐标系下的8个顶点的计算,先考虑OBB只有平移没有旋转的情况:



如果 OBB **没有旋转**，那么它的世界坐标系顶点就是：

$V_{\text{world}, i} = C + V_{\text{local}, i}$

比如,$C=(3,2,1),(h_x,h_y,h_z)=(2,2,1)$的世界坐标系顶点为:

$(+2,+1,+1) + (3,2,1) = (5,3,2)$

$(+2,+1,-1) + (3,2,1) = (5,3,0)$

$(-2,-1,-1) + (3,2,1) = (1,1,0)$

......以此类推



考虑OBB发生旋转的情况,就需要使用到旋转矩阵R来变换局部坐标,进一步计算世界坐标系下的顶点:

$V_{\text{world}, i} = C + R \times V_{\text{local}, i}$

> - R 是 **OBB 的旋转矩阵**（3×3）
> - $V_{\text{local}, i}$ 是局部坐标系下的 8 个顶点
> - 计算时，每个顶点的局部坐标 **先乘以** R **旋转**，再加上 OBB 的中心点 C

举个例子吧,C还是用上面的数据,其中$(h_x, h_y, h_z) = (2,1,1)$,此时得到局部坐标系的8个顶点:$V_{\text{local}, i} = (\pm2, \pm1, \pm1)$

假设OBB绕Z轴旋转30度得到旋转矩阵:

$R_z(30^\circ) = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.866 & -0.5 & 0 \\ 0.5 & 0.866 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

**1. 计算局部顶点结果旋转矩阵变换后的新坐标**

以顶点$(+2,+1,+1)$为例:

$V{\prime} = R \times \begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix} \begin{bmatrix} 0.866 & -0.5 & 0 \\ 0.5 & 0.866 & 0 \\ 0 & 0 & 1 \end{bmatrix} \times \begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix}$

按照矩阵乘法:

$x{\prime} = (0.866 \times 2) + (-0.5 \times 1) + (0 \times 1) = 1.732 - 0.5 = 1.232$

$y{\prime} = (0.5 \times 2) + (0.866 \times 1) + (0 \times 1) = 1.0 + 0.866 = 1.866$

$z{\prime} = (0 \times 2) + (0 \times 1) + (1 \times 1) = 1$

得到,旋转后的局部坐标:$V{\prime}=(1.232, 1.866, 1)$

**2. 加上OBB的中心点**

$V_{\text{world}} = C + V{\prime}=(3,2,1) + (1.232, 1.866, 1) = (4.232, 3.866, 2)$

我们对所有 8 个局部顶点 $(\pm2, \pm1, \pm1)$ **重复上面的计算**，最终结果如下：

$\begin{aligned} &(4.232, 3.866, 2), \quad (4.232, 3.866, 0), \\ &(5.232, 2.133, 2), \quad (5.232, 2.133, 0), \\ &(0.768, 1.866, 2), \quad (0.768, 1.866, 0), \\ &(1.768, 0.134, 2), \quad (1.768, 0.134, 0) \end{aligned}$

同样,我们可以使用3D可视化进行实时计算:

![obb2_resize](https://images.waer.ltd/notes/202504031644158.gif)

更新正在路上,感谢阅读!

---

## 参考&引用

> - [https://visux.ilikexff.cn/](https://visux.ilikexff.cn/)
>
> - [https://zh.wikipedia.org/wiki/%E5%8C%85%E5%9B%B4%E4%BD%93](https://zh.wikipedia.org/wiki/%E5%8C%85%E5%9B%B4%E4%BD%93)
>
> - [https://www.gamedeveloper.com/game-platforms/simple-intersection-tests-for-games](https://www.gamedeveloper.com/game-platforms/simple-intersection-tests-for-games)
>
> - [https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-detection](https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-detection)

