# AOP — Aspect Oriented Programming Overview

**AOP** is a programming paradigm that separates **cross-cutting concerns**
from your business logic — keeping your code clean and focused.

---

## The Problem AOP Solves

Without AOP — cross-cutting concerns pollute every method:

```java
@Service
public class UserService {
    public void createUser(User user) {
        log.info("createUser called");         // logging — not business logic
        checkAuth();                           // security — not business logic
        startTransaction();                    // transaction — not business logic

        // actual business logic (just 1 line)
        userRepository.save(user);

        commitTransaction();                   // transaction — not business logic
        log.info("createUser finished");       // logging — not business logic
    }
}
```

With AOP — business logic stays clean:

```java
@Service
public class UserService {
    public void createUser(User user) {
        userRepository.save(user); // only business logic
    }
    // logging, security, transaction handled by Aspects automatically
}
```

> AOP moves cross-cutting concerns **out** of your business code
> into a separate **Aspect** that applies automatically.

---

## Core Concepts

---

### 1. Aspect
A module that contains **cross-cutting logic** (the concern itself).
Think of it as a class that holds the "extra" behavior.

```java
@Aspect
@Component
public class LoggingAspect {
    // cross-cutting logging logic lives here
}
```

---

### 2. Join Point
A **point in execution** where an Aspect can be applied.
In Spring AOP — always a **method execution**.

```
UserService.createUser()   ← Join Point
UserService.deleteUser()   ← Join Point
UserService.findUser()     ← Join Point
```

---

### 3. Pointcut
An **expression** that selects which Join Points to apply the Aspect to.
Defines the **where**.

```java
// apply to all methods in UserService
"execution(* com.example.UserService.*(..))"

// apply to all methods in all service classes
"execution(* com.example.service.*.*(..))"

// apply to a specific method only
"execution(* com.example.UserService.createUser(..))"
```

---

### 4. Advice
The **actual code** that runs at the Join Point.
Defines the **what** and **when**.

| Advice Type | When It Runs |
|---|---|
| `@Before` | Before the method executes |
| `@After` | After the method (always, pass or fail) |
| `@AfterReturning` | After method returns successfully |
| `@AfterThrowing` | After method throws an exception |
| `@Around` | Wraps the method — before AND after |

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint jp) {
        System.out.println("Calling: " + jp.getSignature().getName());
    }

    @AfterReturning("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint jp) {
        System.out.println("Finished: " + jp.getSignature().getName());
    }

    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "ex")
    public void logException(JoinPoint jp, Exception ex) {
        System.out.println("Exception in: " + jp.getSignature().getName());
    }

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureTime(ProceedingJoinPoint jp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = jp.proceed();           // run the actual method
        long duration = System.currentTimeMillis() - start;
        System.out.println("Took: " + duration + "ms");
        return result;
    }
}
```

---

### 5. Target Object
The **actual object** whose method is being advised.
Your `UserService`, `OrderService`, etc.

---

### 6. Proxy
Spring AOP works by creating a **Proxy** around your Target Object.
The proxy intercepts method calls and applies Advice.

```
Caller
  ↓
Proxy (Spring-generated)   ← intercepts the call
  ↓ runs @Before Advice
Target Object (your class) ← actual method runs
  ↓ runs @After Advice
Proxy
  ↓
Caller receives result
```

> You call `userService.createUser()` —
> you think you're calling your class,
> but you're actually calling the **Proxy** first.

---

### 7. Weaving
The process of **linking Aspects to Target Objects**.
Spring AOP does weaving at **runtime** (via proxies).

| Weaving Time | How |
|---|---|
| **Compile-time** | AspectJ compiler (not Spring default) |
| **Load-time** | Class loader weaving (AspectJ) |
| **Runtime** | Proxy-based (Spring AOP default) ✅ |

---

## AOP Concepts Summary

```
WHAT to do      → Advice    (@Before, @After, @Around...)
WHERE to apply  → Pointcut  (execution expression)
Combined        → Aspect    (@Aspect class)
Applied on      → Target    (your service/component)
Via             → Proxy     (Spring-generated wrapper)
At              → Join Point (method execution)
```

---

## Common Use Cases

| Use Case | Advice Type | Why AOP |
|---|---|---|
| **Logging** | `@Before` / `@After` | Log every method without touching each class |
| **Transaction** | `@Around` | Start/commit/rollback around service methods |
| **Security** | `@Before` | Check auth before method runs |
| **Performance Monitoring** | `@Around` | Measure method execution time |
| **Exception Handling** | `@AfterThrowing` | Central exception logging |
| **Caching** | `@Around` | Return cached result, skip method if cache hit |

---

## Spring AOP vs AspectJ

| | Spring AOP | AspectJ |
|---|---|---|
| **Weaving** | Runtime (proxy) | Compile / Load-time |
| **Join Points** | Method execution only | Method, field, constructor... |
| **Performance** | Slight proxy overhead | Faster (no proxy) |
| **Setup** | Simple — built into Spring | Needs AspectJ compiler |
| **Use Case** | Most Spring apps | Complex, fine-grained AOP needs |

> **Spring AOP is enough for 99% of use cases.**
> Spring uses AspectJ annotations (`@Aspect`, `@Before`…) but implements via proxies.

---

## Spring AOP Proxy Types

Spring creates proxies in two ways:

| Proxy Type | Used When |
|---|---|
| **JDK Dynamic Proxy** | Target implements an interface |
| **CGLIB Proxy** | Target does NOT implement an interface |

Spring Boot chooses automatically — you don't need to configure this.

---

## How to Enable AOP in Spring Boot

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

```java
// Already enabled in Spring Boot automatically
// Just create your @Aspect class and Spring picks it up
@Aspect
@Component
public class MyAspect { ... }
```

---

## Full Flow Example — Logging Aspect

```
HTTP Request → UserController.createUser()
                    ↓
              Proxy intercepts
                    ↓
         @Before → log "createUser called"
                    ↓
         UserService.createUser() runs   ← actual business logic
                    ↓
         @AfterReturning → log "createUser success"
                    ↓
              Proxy returns result
                    ↓
HTTP Response ← result returned to controller
```

---

## Key Annotations Summary

| Annotation | Purpose |
|---|---|
| `@Aspect` | Declare a class as an Aspect |
| `@Before` | Advice that runs before method |
| `@After` | Advice that runs after method (always) |
| `@AfterReturning` | Advice that runs after successful return |
| `@AfterThrowing` | Advice that runs after exception |
| `@Around` | Advice that wraps the method |
| `@Pointcut` | Reusable pointcut expression |

```java
// Reusable Pointcut
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {} // reusable pointcut

    @Before("serviceLayer()")
    public void logBefore(JoinPoint jp) { ... }

    @After("serviceLayer()")
    public void logAfter(JoinPoint jp) { ... }
}
```

---

## One-liner Summary

> **AOP separates cross-cutting concerns (logging, security, transactions)
> from business logic** by defining Aspects that apply automatically
> to matched methods via Pointcut expressions,
> using Spring-generated Proxies to intercept calls at runtime —
> keeping your business code clean and focused.
