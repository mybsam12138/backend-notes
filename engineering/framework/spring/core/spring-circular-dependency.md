# Circular Dependency in Spring & Can `@Autowired` Fix It?

This document explains **what circular dependency is**, **why it happens**, and **when (and why) `@Autowired` can or cannot fix it**.

---

## 1. What is a Circular Dependency?

A **circular dependency** happens when **two or more beans depend on each other directly or indirectly**.

### Simplest form (A ↔ B)

```text
A depends on B
B depends on A
```

In Spring terms:

```java
@Component
class A {
    @Autowired
    private B b;
}

@Component
class B {
    @Autowired
    private A a;
}
```

---

## 2. Why Circular Dependency Is a Problem

Spring creates beans in this order:

1. Instantiate bean
2. Inject dependencies
3. Initialize bean

If:
- A needs B **before A can finish creation**
- B needs A **before B can finish creation**

➡️ **Deadlock during creation**

Spring must break this loop somehow — or fail.

---

## 3. Can `@Autowired` Fix Circular Dependency?

### ✅ Sometimes — but only in **specific cases**

| Injection type | Can Spring resolve circular dependency? |
|---|---|
| Field injection | ✅ Yes (singleton only) |
| Setter injection | ✅ Yes (singleton only) |
| Constructor injection | ❌ No |
| Prototype scope | ❌ No |

---

## 4. Why Field / Setter Injection Can Work

### Example (works at startup)

```java
@Component
class A {
    @Autowired
    private B b;
}

@Component
class B {
    @Autowired
    private A a;
}
```

### What Spring does internally

1. Create **A instance**
2. Expose **early reference of A**
3. Create **B**
4. Inject **A into B** (to break the cycle)
5. Inject **B into A**
6. Continue lifecycle later

📌 Key concept:  
> Spring injects a **half-initialized bean reference** to break the cycle.

---

## 5. Why Constructor Injection Fails (by design)

```java
@Component
class A {
    private final B b;
    public A(B b) { this.b = b; }
}

@Component
class B {
    private final A a;
    public B(A a) { this.a = a; }
}
```

Result:
```text
BeanCurrentlyInCreationException
```

Reason:
- Constructor injection requires **fully constructed dependencies**
- No safe point to expose an early reference

---

## 6. Why `@Autowired` Is NOT a Real Fix

Even when startup succeeds, circular dependency still means:

- Tight coupling
- Hidden lifecycle assumptions
- Fragile refactoring
- Proxy / transaction edge cases

It is a **container escape hatch**, not a design solution.

---

## 7. The REAL Core Problem: Partial Injection in Circular Dependency

This is the most important part.

> **In a circular dependency, Spring may inject *some* fields of a bean, but not *all*, before that bean is used by another bean.**

Spring prioritizes **breaking the cycle**, not **fully populating every field**.

---

## 8. Concrete NPE Example (This Is What Actually Breaks)

```java
@Component
class A {

    @Autowired
    private B b;

    @PostConstruct
    public void init() {
        b.process();   // ❌ dangerous
    }
}

@Component
class B {

    @Autowired
    private A a;   // part of the cycle

    @Autowired
    private C c;   // NOT part of the cycle

    public void process() {
        c.work();     // 💥 NPE here
    }
}

@Component
class C {
    void work() {}
}
```

---

## 9. What Actually Happens Step by Step

```text
1. Instantiate A
   A.b = null

2. Expose early reference of A

3. Instantiate B
   B.a = null
   B.c = null

4. Inject B.a = early A      ← cycle-breaking injection
   (B.c is still null!)

5. Inject A.b = B

6. Initialize A
   → @PostConstruct runs
   → A calls B.process()

7. B.process() tries to use C
   → B.c == null → NPE
```

📌 **Key insight**:
> Spring guarantees that *A’s* fields are injected before `A.@PostConstruct`,  
> but it does **NOT** guarantee that *B’s* other dependencies are injected.

---

## 10. Why This Does NOT Violate `@PostConstruct` Rules

| Guarantee | Applies? |
|---|---|
| Bean's own dependencies injected before its `@PostConstruct` | ✅ |
| Other beans fully initialized | ❌ |

So:
- `@PostConstruct` itself is not wrong
- **Calling other beans during it is risky in cycles**

---

## 11. Why Removing `@PostConstruct` Often “Fixes” It

If you **do not call other beans during creation**:

- Spring finishes wiring **all beans**
- Partial-injection window disappears
- Runtime calls happen only after context is ready

That’s why circular dependency may *appear* safe without `@PostConstruct`.

---

## 12. Final Mental Model (Keep This)

> Circular dependency works by temporarily allowing **partially injected objects**.  
> Touch them too early, and you get NPEs or broken behavior.

---

## 13. Practical Rule

- ❌ Never call another bean in constructor / setter / `@PostConstruct` if there is a cycle
- ✅ Prefer constructor injection to fail fast
- ✅ Break cycles structurally (interfaces, domain services, events)

---

## 14. One-Sentence Takeaway

> `@Autowired` can let Spring **start**, but circular dependency means **some fields may not be injected when another bean touches it**, which is the real root cause of NPEs.

---

If you want next, we can:
- add a **3-level singleton cache diagram**
- refactor this example into a safe design
- show how AOP makes this even worse
