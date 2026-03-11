# Spring AOP – Common Annotations, Pointcut Grammar, and Advice Arguments

This document summarizes the **most commonly used Spring AOP annotations**, **pointcut expressions (grammar)**, and **advice method arguments**, with a focus on practical usage in Spring MVC and infrastructure code.

---

## 1. Core AOP Annotations

### `@Aspect`
Marks a class as an **Aspect**, meaning it contains cross-cutting logic.

```java
@Aspect
@Component
public class ApiLogAspect {}
```

Without `@Aspect`, all AOP annotations inside the class are ignored.

---

### `@Around`
Defines advice that runs **before and after** the target method.

```java
@Around("pointcutExpression")
public Object around(ProceedingJoinPoint pjp) throws Throwable
```

- Most powerful advice type
- Required for timing, logging, metrics
- Must call `pjp.proceed()`

---

### `@Before`
Runs **before** the target method.

```java
@Before("pointcutExpression")
public void before() {}
```

Cannot block execution or change return value.

---

### `@After`
Runs **after** method completion (success or exception).

```java
@After("pointcutExpression")
public void after() {}
```

---

### `@AfterReturning`
Runs **only when method returns normally**.

```java
@AfterReturning(pointcut = "pc()", returning = "result")
public void afterReturning(Object result) {}
```

---

### `@AfterThrowing`
Runs **only when method throws an exception**.

```java
@AfterThrowing(pointcut = "pc()", throwing = "ex")
public void afterThrowing(Throwable ex) {}
```

---

## 2. Common Pointcut Designators (Grammar)

### `execution(...)` – Method Signature Matching

```java
execution(public * com.example.service.*.*(..))
```

- Most powerful and verbose
- Matches method visibility, return type, package, method name, args

Use when you need **fine-grained control**.

---

### `@within(Annotation)` – Class-Level Annotation

Matches **any method inside a class annotated with the given annotation**.

```java
@Around("@within(org.springframework.web.bind.annotation.Controller)")
```

✔ Meta-annotation aware  
✔ Best for layer-level interception (Controller, Service)

---

### `@annotation(Annotation)` – Method-Level Annotation

Matches **methods annotated with the given annotation**.

```java
@Around("@annotation(org.springframework.web.bind.annotation.GetMapping)")
```

✔ Method-specific  
❌ Does not match class-level annotations

---

### `@target(Annotation)`

Matches join points where the **runtime target object** has the annotation.

```java
@Around("@target(MyAnnotation)")
```

Less commonly used; similar to `@within` but evaluated at runtime.

---

### `args(...)` – Method Argument Binding

Matches methods based on argument types and allows binding.

```java
@Around("args(String, int)")
```

Often combined with other expressions.

---

### Logical Operators

```java
@Around("@within(Controller) && !@annotation(ApiLogIgnore)")
```

Supported operators:
- `&&` AND
- `||` OR
- `!` NOT

---

## 3. Meta-Annotation Awareness (Important)

Spring AOP **recursively resolves meta-annotations**.

Example:

```java
@RestController → @Controller → @Component
```

So:

```java
@within(Controller)
```

✔ matches `@RestController`  
✔ matches custom composed annotations

---

## 4. Advice Method Arguments

### `ProceedingJoinPoint` (Around Only)

```java
public Object around(ProceedingJoinPoint pjp) throws Throwable
```

Provides:
- `pjp.proceed()` – continue invocation
- `pjp.getSignature()` – method info
- `pjp.getArgs()` – arguments
- `pjp.getTarget()` – target object

Mandatory for `@Around` advice.

---

### Binding Annotation Parameters

```java
@Around("@within(controller)")
public Object around(ProceedingJoinPoint pjp, Controller controller)
```

- `controller` is bound from the pointcut
- Only annotations referenced in pointcut can be injected

---

### Binding Method Arguments

```java
@Around("args(id)")
public Object around(ProceedingJoinPoint pjp, Long id)
```

Allows direct access to method parameters.

---

### What CANNOT Be Injected

You cannot inject:
- `HttpServletRequest`
- arbitrary Spring beans
- MVC method arguments

Reason:
- AOP advice is invoked by **Spring AOP**, not Spring MVC

Use `RequestContextHolder` instead.

---

## 5. Exception Handling in Advice

### Why `throws Throwable`

```java
public Object around(ProceedingJoinPoint pjp) throws Throwable
```

Because:
- `pjp.proceed()` declares `throws Throwable`
- Advice must propagate all failures

---

### Correct Pattern

```java
try {
    return pjp.proceed();
} catch (Throwable t) {
    log.error("failed", t);
    throw t;
}
```

- Catch for observation
- Always rethrow

---

## 6. Execution Order

Use `@Order` to define precedence among aspects.

```java
@Aspect
@Order(0)
public class ApiLogAspect {}
```

Lower value = higher priority.

---

## 7. Practical Recommendations

- Use `@within` for **layer-based interception**
- Use `@annotation` for **opt-in behavior**
- Prefer `@Around` for infrastructure logic
- Always specify `@Order` in shared modules
- Catch `Throwable` only in infrastructure code

---

## 8. One-Sentence Summary

> Spring AOP works by applying advice methods defined in `@Aspect` classes to join points matched by pointcut expressions like `execution`, `@within`, and `@annotation`, with `ProceedingJoinPoint` providing full control over method invocation in `@Around` advice.

---

## 9. Suggested Placement in Repo

```
backend-notes/
└── spring/
    └── aop/
        └── aop-annotations-and-pointcuts.md
```
