# Understanding `volatile` Using a Simple While-Loop Example

This document uses **one concrete example** to explain **what `volatile` does, why it is needed, and what problems it solves** under the Java Memory Model (JMM).

---

## 1. The Example (Without `volatile`)

```java
static boolean ready = false;
static int data = 0;

Thread A:
data = 42;
ready = true;

Thread B:
while (!ready) {
    print(data);
}
```

### What developers *intuitively* expect
- Thread B keeps checking `ready`
- When Thread A sets `ready = true`
- Thread B exits the loop and sees `data == 42`

### What JMM actually allows
- Thread B may **read `ready` only once**
- JVM may cache `ready` in a register
- Thread B may **loop forever**
- Thread B may keep printing **stale `data`**

This behavior is **legal under JMM**.

---

## 2. Why This Is Legal Without `volatile`

Key JMM rule:

> If a variable is **not volatile** and **not synchronized**, the JVM may assume it is **not modified concurrently**.

So the JVM may transform:

```java
while (!ready) {
    print(data);
}
```

into:

```java
boolean cachedReady = ready;

while (!cachedReady) {
    print(data);
}
```

Important:
- Control flow is preserved
- But **memory is not re-read**
- Updates from other threads are not guaranteed to be seen

---

## 3. Adding `volatile`

```java
static volatile boolean ready = false;
static int data = 0;
```

Same threads, same code.

---

## 4. What `volatile` Guarantees (Using This Example)

### 4.1 Visibility

- A write to a volatile variable is **immediately visible** to other threads
- A read of a volatile variable always sees the **latest write**

So:
- Thread B **must** eventually see `ready == true`

---

### 4.2 Ordering (The Critical Part)

JMM guarantees:

#### Volatile WRITE rule
```java
data = 42;
ready = true;   // volatile write
```

➡️ Writes before a volatile write **cannot be reordered after it**

#### Volatile READ rule
```java
while (!ready) {
    print(data);
}
```

➡️ Reads after a volatile read **cannot be reordered before it**

---

## 5. Happens-Before Chain in This Example

The following happens-before relationship is established:

```
Thread A:
data = 42
   ↓
volatile write (ready = true)
   ↓ happens-before
volatile read (ready == true)
   ↓
Thread B:
print(data)
```

Because of this chain:
- `data = 42` is guaranteed visible to Thread B
- Thread B **cannot print 0 or null**

---

## 6. What `volatile` Does NOT Do

Using the same example, `volatile` does NOT:

- Provide mutual exclusion
- Make compound operations atomic
- Prevent all instruction reordering
- Guarantee fairness or timing

Example still NOT safe:
```java
volatile int x;
x++; // not atomic
```

---

## 7. Why `print(data)` Inside the Loop Does NOT Help

Even though:

```java
print(data);
```

is inside the loop:

- It does NOT force rereading `ready`
- It does NOT create a memory barrier
- It does NOT guarantee visibility

Only `volatile` or synchronization can do that.

---

## 8. Correct Mental Model

Think of `volatile` as:

> A **visibility and ordering signal** between threads

Not:
- A lock
- A counter
- A replacement for synchronization

---

## 9. When `volatile` Is the Right Tool

`volatile` is ideal for:
- State flags
- Lifecycle signals
- One-writer / many-reader scenarios

This example is a **textbook correct use case**.

---

## 10. One-Sentence Summary

**`volatile` ensures that when Thread B observes `ready == true`, it must also observe all memory writes that happened before that write, including `data = 42`.**
