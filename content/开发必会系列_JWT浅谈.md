+++
title = "开发必会系列_JWT浅谈"
date = 2024-04-22
tags = ["JWT", "Token", "身份认证", "Java", "Spring Boot"]
description = "深入浅出地介绍JWT（JSON Web Token）的原理、组成结构、工作流程和代码实践，帮助开发者理解和掌握这一重要的身份认证技术。"
+++

## 1. 引言

现在前后端分离项目已经成为 主流的开发模式，而在项目开发过程中多多少少都会接触到登录相关的业务，几乎是绕不开的一部分。而只要涉及到登录模块，大部分的开发中都会用提到一种叫做`token`的东西，顾名思义，`token`就是一个令牌，用来作用户身份校验的一种技术，或者具体点说，`token`不过是一串含有特定用户身份信息的字符串。一般由后端颁发，前端携带。

可能提到`token`，很多人会不自觉的将它和接下来要重点介绍的`JWT`联系到一起，甚至可能不少人都会以为`JWT`和`Token`不就是同一个东西吗？并不完全是。`Token`是一个比较宽泛的定义，而在具体的实现上，`Token`有很多实现方式，`JWT`就是其中的一种，也是日常开发中最常见的一种`token`实现，不管是在单体项目还是分布式微服务中，`JWT`技术都被广泛的应用，因此，有必要一次性将它安排的明明白白！

---

## 2. JWT五脏六腑

### 2.1 长什么样

`JWT`的缩写是`JSON Web Token`。常用在网络应用环境中传递声明一种紧凑自包含的方式，这些声明可以被验证和信任，因为他是经过数字签名的，`JWT`可以被用于身份认证和信息交换。我靠，有一说一，这定义真的是抽象，但是不打紧，你不用也没必要去记下他的定义，你要学的，是理解他的原理和作用即可，就开发行业来说，很多技术其实没那么注重对名词本身的记忆上，更多的是对技术原理和使用的要求，当你学会如何使并理解了他背后的实现原理之后，你也就掌握了这门技术，晦涩的术语定义不过是回个头的事。

先看个实际项目中基于`JWT`实现的`Token`字符串,这是来自我的[个人博客](https://www.ilikexff.cn)登录成功之后的响应数据，其中就包含了`token`字段。

![image-20240422145939177](https://images.waer.ltd/notes/image-20240422145939177.png)

为了更好的理解`JWT`，下面以一个具体的例子作为切入进行讲解。

``yml
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

仔细观察这串字符，他其实被一个点`.`分割成了三部分：

![image-20240422151408847](https://images.waer.ltd/notes/image-20240422151408847.png)

---

### 2.2 组成

![JWT](https://images.waer.ltd/notes/JWT.png)

如上面的图所示，`JWT`由三个部分构成，从左到右以`.`分割，分别为：

- Header头部
- Payload(载荷)
- Signature(签名)

![image-20240422151839638](https://images.waer.ltd/notes/image-20240422151839638.png)

#### 2.2.1 Header

头部通常是包含了两部分信息:

- 令牌类型(比如这里为`JWT`)
- 使用的签名算法(比如这里用的是`HS256`)

``json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

令牌类型除了`JWT`之外，一般还有:`JWE`和`JWS`,这不是本文的重点，当作顺手牵羊知道有这东西就行。而对于签名算法，这里用到的是哈希256算法，这只是其众多算法的一种，常用的还有:

1. **RS256（RSA using SHA-256）**：RSA 非对称加密算法结合 SHA-256 哈希算法进行签名。在这种情况下，使用私钥对数据进行签名，然后使用公钥进行验证。
2. **ES256（ECDSA using P-256 and SHA-256）**：使用椭圆曲线数字签名算法（ECDSA）和 SHA-256 哈希算法进行签名。这是基于椭圆曲线加密的一种签名算法。
3. **HS384（HMAC using SHA-384）**：使用 HMAC（Hash-based Message Authentication Code）和 SHA-384 哈希算法进行签名。
4. **RS384（RSA using SHA-384）**：RSA 非对称加密算法结合 SHA-384 哈希算法进行签名。
5. **ES384（ECDSA using P-384 and SHA-384）**：使用椭圆曲线数字签名算法（ECDSA）和 SHA-384 哈希算法进行签名。
6. **HS512（HMAC using SHA-512）**：使用 HMAC 和 SHA-512 哈希算法进行签名。
7. **RS512（RSA using SHA-512）**：RSA 非对称加密算法结合 SHA-512 哈希算法进行签名。
8. **ES512（ECDSA using P-521 and SHA-512）**：使用椭圆曲线数字签名算法（ECDSA）和 SHA-512 哈希算法进行签名。

不同的算法实现原理不同，但启用算法对签名进行加密的唯一共性就是用来确保数据的完整性和真实性:

> 1. **数据完整性验证**：签名算法通过对数据进行签名，生成一个固定长度的字符串，这个字符串会随着 `JWT `一起发送。接收方可以使用相同的密钥和签名算法重新计算签名，然后将计算出的签名与接收到的签名进行比较，以验证数据在传输过程中是否被篡改。
> 2. **数据真实性验证**：签名算法使用发送方的密钥对数据进行签名，接收方使用相同的密钥来验证签名。如果接收方能够成功验证签名，就可以确定数据确实是由发送方生成的，从而验证数据的真实性。
> 3. **防止伪造和篡改**：通过签名算法生成的签名可以有效防止恶意第三方伪造数据或篡改数据。即使数据在传输过程中被修改，接收方也能够通过验证签名来检测出数据的篡改。
> 4. **身份验证**：签名算法还可以用于验证数据的发送方身份。只有知道正确密钥的发送方才能生成有效的签名，因此接收方可以通过验证签名来确认数据的发送方身份。

---

### 2.2.2 Payload

载荷部分包含了声明(`claims`)，声明关于实体(比如用户)和其他数据的信息，载荷部分通常是一个 `JSON `对象，以结构化的方式包含了各种声明和数据信息，并被`Base64`编码以提供轻量级的传输。

为了在网络上进行传输，`JWT `的各个部分（包括头部、载荷和签名）通常会被 `Base64 `编码。`Base64 `编码是一种将二进制数据转换为文本的编码方式，它可以确保数据在传输过程中不会丢失，并且可以减少传输数据的大小。

也即是说，载荷部分是我们存储用户信息的地方，这些用户信息一般以`JSON`格式进行存储，比如:

``json
{
    "username":"Gemini48",
    "money":0
}
```

但是请注意，不建议将用户敏感信息存入`JWT`中，这是不安全的做法。为什么不安全，因为没有经过加密啊，注意上上面提到的 **以`Base64`进行编码**，注意`Base64`只是一种编码方式，而不是加密算。所以说经过编码后的数据依旧是可逆的，容易被**网络大黑客**给你解码出来原文，想象一下，一旦你的敏感数据被以这种方式存储在`JWT`中，比如你在某知名交友网站的登录密码和用户名，那就相当于向互联网宣布自己的密码正在裸奔，被别人拿去扒出来你身兼数职做添狗的那几十页聊天记录.....

所以请务必记住:

- `JWT`不要存敏感信息！
- `JWT`不要存敏感信息！
- `JWT`不要存敏感信息！

我们话又说回来，即使使用了加密算法，也无法完全保证这些信息的安全性。有一部叫《我是谁》的电影我觉得挺好看的，这是一部黑客题材的电影，里面有一句话我觉得很经典:**没有绝对安全的系统!**

---

### 2.2.3 Signature

签名是对头部和载荷的内容进行签名后得到的一段字符串，用于验证 `JWT` 的真实性和完整性。签名通过将头部、载荷以及密钥一起进行加密生成，确保 `JWT `在传输过程中没有被篡改。

这部分其实上面已经多多少少说差不多了，需要注意的是，签名算法很多，具体使用哪一种没有固定不变的规则，需要根据自己的业务需求等情况来选择，不管如何加密签名，都需要对`JWT`进行定期轮换，在`JWT`中设置合理的过期时间，以确保令牌在一段时间后失效，减少令牌被滥用的可能性。![image-20240422153638441](https://images.waer.ltd/notes/image-20240422153638441.png)

---

## 3. JWT 基本工作原理

**有个问题: `JWT`是否可逆？？？？**

如果你不是直接点一下文章目录跳到这里的话，那我相信你的答案和我一样，**JWT本身是不可逆的**，其实这种说法可能不那么标准，可逆不可逆一般用在密码学领域中较多，简单来说，可逆就是指通过某种加密算法加密后的密文是否能通过某些手段再进行解密回去得到加密之前的明文的过程，一般来说，如果某种算法的加密可以被解密，那么就说这是一种可逆加密算法。

那么问题来了，既然`JWT`不可逆，我们在进行信息验证的时候是怎么获取到其载荷部分的用户信息呢？大致步骤如下:

> 1. **解析JWT**：首先，需要解析JWT，将其分解为头部、载荷和签名三个部分。这可以通过将JWT字符串拆分为这三部分来完成。
> 2. **验证签名**：使用JWT中的头部和载荷以及事先约定的密钥，对JWT进行签名验证。具体的验证过程取决于JWT使用的签名算法，可以是对称加密算法（如HMAC）或非对称加密算法（如RSA）。
> 3. **提取载荷数据**：如果签名验证成功，说明JWT未被篡改，可以提取载荷数据。载荷部分通常包含关于用户身份、权限等信息的声明。
> 4. **使用载荷数据**：一旦获得有效的载荷数据，可以根据需要使用这些数据来进行授权、身份验证等操作。

为了更好的理解`JWT`，这里推荐一个在线地址:[https://jwt.io/#debugger-io](https://jwt.io/#debugger-io),网站上可以直接根据需三部分的需求生成和解析`JWT`，使用方式很简单，将自己的`token`粘贴到左侧的`Encoded`中，选择签名加密算法即可解析在右侧(`Decoded`)部分显示。也可以直接修改右侧的三部分信息，他会在左侧实时的生成目标`JWT`。不得不说，这可比在代码中写`demo`来的方便快捷!!

![image-20240422164656044](https://images.waer.ltd/notes/image-20240422164656044.png)

大可不必太担心你的令牌泄漏，因为：

![image-20240422170220673](https://images.waer.ltd/notes/image-20240422170220673.png)

下面是`JWT`在`Web`开发中的基本工作原理:

![image-20240422163237414](https://images.waer.ltd/notes/image-20240422163237414.png)

> 问:为什么图大都是英文啊，别问，问就是中文没有这种字体，而我挺中意这种自由自在随性风格的字体的。

虽然有图了，这里还是大致用文字的方式捋一遍：

- 客户端向服务器发起登录请求，执行用户登录
- 服务器生成`JWT`并颁发`JWT`响应给客户端
- 客户端再次请求服务端其他接口时会在请求头等信息中携带`JWT`生成的`Token`信息
- 服务端收到请求之后对请求中`Token`进行校验，校验通过后才会允许请求执行并响应到客户端；

---

### 4. JWT的优势

- 无状态：由于 `JWT `本身携带所有必要的信息，因此服务器不需要维护会话信息。这使得 `JWT `无状态，从而减少了服务器负载并简化了可伸缩性。
- 紧凑高效：由于其紧凑的解构，`JWT `适合通过网络传输，并且易于客户端解析。
- 安全性：`JWT `经过数字签名，确保数据完整性并防止篡改。使用加密算法可以进一步增强安全性。
- 跨域通信：`JWT `可以跨不同的域或微服务使用，因为它们不依赖于 `cookie `或服务器端会话。

---

### 5. 代码实践

巴拉巴拉说了这么多，最终还是要写代码的啊。老规矩，演示还是基于`Gradle`构建的`SpringBoot`项目，`Maven`玩家请自行变通。

下面给出`Maven`仓库地址，进去直接搜索关键字即可:[https://mvnrepository.com/](https://mvnrepository.com/)

关于`Token`的具体实现的依赖库有很多，这里采用`com.auth0`的`java-jwt`进行演示。

#### 5.1 添加依赖

``groovy
// https://mvnrepository.com/artifact/com.auth0/java-jwt
implementation 'com.auth0:java-jwt:4.4.0'
```

#### 5.2 生成Token

``java
// 密钥，这里使用HMAC SHA-256算法举例，实际项目中应妥善保管和配置
private static final String SECRET_KEY = "DHSDNSJDSndjsdjsSAJKDS";

/**
 * 生成JWT Token
 *
 * @param issuer       签发者，通常是服务提供者的名称或URL，用于标识JWT的来源
 * @param expirationTimeInMinutes 过期时间（分钟），指定JWT的有效期限
 * @return 生成的JWT字符串，可作为Bearer Token用于HTTP请求的Authorization头
 */

public static String generateToken(String issuer, long expirationTimeInMinutes) {
    // 使用指定的密钥和HMAC SHA-256算法创建JWT签名算法实例
    Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
    Map<String,Object> headers = new HashMap<>();
    // 获取当前时间，并计算过期时间点
    Date now = Date.from(Instant.now());
    Date expirationDate = Date.from(now.toInstant().plusSeconds(expirationTimeInMinutes * 60));
    headers.put("CSDN:","小妖剑");

    // 创建JWT并设置必要的属性（主题、签发者、发行时间和过期时间），最后使用指定的算法签名
    return JWT.create()
            .withHeader(headers) // 头部
            .withClaim("userId", 408) // 载荷
            .withClaim("username","小妖剑") // 载荷
            .withIssuer(issuer)
            .withIssuedAt(now)
            .withExpiresAt(expirationDate)
            .sign(algorithm); // 签名算法
}
```

执行代码之后，我们不妨将控制台打印的`token`信息放到上面提到的`jwt.io`网站上进行解析，得到下面的结果:![image-20240422182007708](https://images.waer.ltd/notes/image-20240422182007708.png)

注意，这个代码生成的`token`中，我们发现在`header`部分除了有我们之前说的令牌类型和签名算法信息之外，还有一个我们自定义的`CSDN`的字段，显然，如果我们需要在头部进行自定义信息的话，上面的写法可以参考，其实就是传入一个`Map`集合，在集合中定义我们需要放在头部的信息数据，但是一般情况下，我们是不需要自定义`header`信息的，所以上面的代码可以修改为:

```
/**
 * 生成JWT Token
 *
 * @param issuer       签发者，通常是服务提供者的名称或URL，用于标识JWT的来源
 * @param expirationTimeInMinutes 过期时间（分钟），指定JWT的有效期限
 * @return 生成的JWT字符串，可作为Bearer Token用于HTTP请求的Authorization头
 */

public static String generateToken(String issuer, long expirationTimeInMinutes) {
    // 使用指定的密钥和HMAC SHA-256算法创建JWT签名算法实例
    Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

    // 获取当前时间，并计算过期时间点
    Date now = Date.from(Instant.now());
    Date expirationDate = Date.from(now.toInstant().plusSeconds(expirationTimeInMinutes * 60));

    // 创建JWT并设置必要的属性（主题、签发者、发行时间和过期时间），最后使用指定的算法签名
    return JWT.create()
            .withClaim("userId", 408)
            .withClaim("username","小妖剑")
            .withIssuer(issuer)
            .withIssuedAt(now)
            .withExpiresAt(expirationDate)
            .sign(algorithm);
}
```

![image-20240422182846195](https://images.waer.ltd/notes/image-20240422182846195.png)

关于这个`jwt.io`工具网站的使用，其实埋了一些小技巧的，不知道各位有没有认真观察。写完了`Token`的生成，接下来继续`Token`的解析方法。解析`Token`用到了`java-jwt`中的一个`verify()`方法，方法返回一个`DecodedJWT`对象，该对象中包含了所有`token`信息，我们可以看看源码:

![image-20240422183832248](https://images.waer.ltd/notes/image-20240422183832248.png)

```
/**
 * 验证并解析JWT Token
 *
 * @param token 待验证的JWT字符串
 * @return 经过验证的DecodedJWT对象，包含了JWT的原始信息和已验证的claims
 * @throws JWTVerificationException 如果验证失败，例如密钥不匹配、签发者不符、过期或被篡改等
 */
public static DecodedJWT validateAndDecodeToken(String token) throws JWTVerificationException {
    // 使用指定的密钥和HMAC SHA-256算法创建JWT验证器实例
    Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
    JWTVerifier verifier = JWT.require(algorithm)
            // 设置期望的签发者，验证时会检查传入的JWT是否与此相符
            .withIssuer("https://www.ilikexff.cn")
            .build();

    // 使用验证器对传入的JWT进行验证，并返回解析后的DecodedJWT对象
    return verifier.verify(token);
}

```

![image-20240422183938687](https://images.waer.ltd/notes/image-20240422183938687.png)

目前为止，我们使用`java-jwt`完成了`JWT`的生成和解析功能，至于如何在实际的项目中使用生成的`Token`，应该难不倒在看的各位了！但是这里还有一些比较重要的工作没有做，那就是测试`Token`的时效性，这重要但不难，就不再赘述。在我后续的文章中，也会用到`JWT`实现`Token`的登录功能，敬请关注！

----

> 感谢阅读，期待下次与你再见!

