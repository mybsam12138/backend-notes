# Happens-Before in Java (JMM)
## A Practical, Example-Driven Explanation

This document explains **happens-before** in the Java Memory Model (JMM) in a **practical, example-first way**.
The goal is to answer one core question:

> **When is one thread guaranteed to see the effects of another thread?**

---

## 1. What Is Happens-Before?

**Happens-before** is a **visibility and ordering rule**, not a timing rule.

Formal idea:

> If action A *happens-before* action B, then:
> 1. All memory effects of A are visible to B  
> 2. A is ordered before B (cannot be reordered after B)

If there is **no happens-before relationship**, then:
- Visibility is **not guaranteed**
- Reordering is **allowed**
- Any result allowed by JMM may occur

---

## 2. Happens-Before Is NOT “Happens Earlier in Time”

This is a critical misconception.

```text
Thread A writes at time T1
Thread B reads at time T2 (T2 > T1)
```

This alone **does NOT guarantee visibility**.

Only a **happens-before rule** creates a guarantee.

---

## 3. Program Order Rule (Single Thread)

Within a single thread:

```java
x = 1;
y = 2;
x += 1;
```

Rule:
> Earlier statements in the same thread happen-before later statements.

This guarantees:
- Correct single-thread semantics
- Does NOT help with inter-thread visibility

---

## 4. Volatile Happens-Before Rule (Most Important)

### Rule

> A write to a `volatile` variable happens-before every subsequent read of that same variable.

---

### Example (Classic Flag Pattern)

```java
static int data;
static volatile boolean ready;
```

#### Thread A
```java
data = 42;
ready = true;   // volatile write
```

#### Thread B
```java
while (!ready) {}
print(data);
```

### Happens-Before Chain

```
data = 42
   ↓
volatile write (ready = true)
   ↓ happens-before
volatile read (ready == true)
   ↓
print(data)
```

Guarantee:
- `print(data)` must print `42`
- Reordering and visibility bugs are forbidden

---

## 5. Lock / Synchronized Happens-Before Rule

### Rule

> An unlock on a monitor happens-before every subsequent lock on that same monitor.

---

### Example

```java
int data;

Thread A:
synchronized (lock) {
    data = 42;
}

Thread B:
synchronized (lock) {
    print(data);
}

condition: thread A run first
```

Guarantee:
- Thread B must see `data == 42`

Why:
- Unlock flushes writes
- Lock refreshes reads

---

## 6. Thread Start Happens-Before Rule

### Rule

> A call to `Thread.start()` happens-before any action in the started thread.

---

### Example

```java
int data = 42;

Thread t = new Thread(() -> {
    print(data);
});
t.start();
```

Guarantee:
- The new thread sees `data == 42`

---

## 7. Thread Join Happens-Before Rule

### Rule

> All actions in a thread happen-before another thread successfully returns from `Thread.join()`.

---

### Example

```java
int result;

Thread t = new Thread(() -> {
    result = 42;
});
t.start();
t.join();

print(result);
```

Guarantee:
- `print(result)` prints `42`

---

## 8. Transitivity (Why Happens-Before Is Powerful)

Happens-before is **transitive**.

If:
```
A happens-before B
B happens-before C
```

Then:
```
A happens-before C
```

This is why simple constructs compose correctly.

---

## 9. What Happens If There Is NO Happens-Before?

Example:

```java
int data = 0;

Thread A:
data = 42;

Thread B:
print(data);
```

Result:
- Thread B may print `0` or `42`
- Both are legal
- Even if Thread A ran “earlier”

No happens-before → no guarantee.

---

## 10. What Happens-Before Does NOT Guarantee

Happens-before does NOT guarantee:
- Fairness
- Timeliness
- Ordering across unrelated variables
- Atomicity of compound operations

It only guarantees:
- Visibility
- Ordering where specified

---

## 11. Mental Model (Recommended)

Think of happens-before as:

> **A visibility bridge between threads**

Without the bridge:
- Threads live in separate worlds

With the bridge:
- Memory effects are transferred safely

---

## 12. One-Sentence Summary

**Happens-before defines the precise rules under which one thread is guaranteed to observe the memory effects of another thread, regardless of CPU architecture or JVM optimizations.**
