# What Spring AOP Provides

## Overview

`spring-aop` is the **execution engine** of AOP in Spring. It does NOT define the annotations (those come from `aspectjweaver`) — instead, it provides the infrastructure to make AOP actually work at runtime.

---

## 1. Proxy Creation

Spring AOP creates **proxy objects** that wrap your beans. When you call a method, the proxy intercepts it and runs the aspect logic.

Two types of proxies:

| Proxy Type | When Used |
|---|---|
| **JDK Dynamic Proxy** | When the bean implements an interface |
| **CGLIB Proxy** | When the bean is a plain class (no interface) |

```java
// You think you're calling UserService directly...
userService.getUser(1);

// But Spring AOP has wrapped it in a proxy:
// Proxy → Before advice → getUser(1) → After advice
```

---

## 2. Aspect Scanning

Spring AOP scans your application context for classes annotated with `@Aspect` (annotation provided by `aspectjweaver`) and registers them as aspects.

```java
@Aspect          // ← detected by spring-aop during component scan
@Component
public class LoggingAspect {
    // ...
}
```

---

## 3. Pointcut Expression Evaluation

Spring AOP uses `aspectjweaver` to **parse** pointcut expressions, then applies them to decide **which methods to intercept**.

```java
// spring-aop evaluates this at startup:
// "intercept ALL methods in com.example.service package"
@Pointcut("execution(* com.example.service.*.*(..))")
public void serviceLayer() {}
```

---

## 4. Advice Execution Chain

Spring AOP manages the order and execution of advice around a method call:

```
[Before Advice]
      ↓
[Proceed → actual method]
      ↓
[After Advice / AfterReturning / AfterThrowing]
```

For `@Around`, Spring AOP gives you `ProceedingJoinPoint.proceed()` to control when the actual method runs.

---

## 5. Key Classes Spring AOP Provides

| Class / Interface | Purpose |
|---|---|
| `ProxyFactory` | Programmatically create AOP proxies |
| `AopProxy` | Abstraction over JDK/CGLIB proxy |
| `AdvisedSupport` | Holds advisor and target info |
| `AspectJAwareAdvisorAutoProxyCreator` | BeanPostProcessor that auto-wraps beans with proxies |
| `AnnotationAwareAspectJAutoProxyCreator` | Detects `@Aspect` classes and creates proxies |

---

## 6. Integration with Spring Container

Spring AOP hooks into the **Spring Bean lifecycle** via `BeanPostProcessor`.

After a bean is created, Spring AOP checks:
> "Does any pointcut match this bean's methods?"

If yes → **wrap the bean in a proxy** before putting it in the context.

```
Bean created → BeanPostProcessor checks pointcuts → Proxy wraps bean → Bean stored in context
```

---

## Summary

| Responsibility | Provided By |
|---|---|
| `@Aspect`, `@Before`, `@After`, `@Around`, `@Pointcut` annotations | `aspectjweaver` |
| Pointcut expression syntax & parsing | `aspectjweaver` |
| Proxy creation (JDK / CGLIB) | `spring-aop` |
| Aspect scanning in Spring context | `spring-aop` |
| Advice execution chain management | `spring-aop` |
| BeanPostProcessor integration | `spring-aop` |
| `ProceedingJoinPoint.proceed()` execution | `spring-aop` |

> **One-liner:** `aspectjweaver` = vocabulary & grammar. `spring-aop` = the engine that reads and executes it.
