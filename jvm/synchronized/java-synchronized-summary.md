# Java `synchronized` — Semantics over Syntax

This document summarizes **what really matters** about `synchronized` in Java — not just how to use it, but **why it behaves the way it does**.

---

## 1. What `synchronized` Really Is

`synchronized` is **not** just a keyword — it is a **monitor-based mutual exclusion mechanism** built into the JVM.

When you use `synchronized`, you are interacting with:

- **Object Monitor**
- **Mutual Exclusion (Mutex)**
- **Happens-Before Memory Semantics**
- **Reentrancy**

At runtime, every Java object **can act as a lock**.

---

## 2. Monitor Concept (Core)

Each object has an associated **monitor**, which provides:

- **Exclusive lock**
- **Wait set**
- **Entry list**
- **Owner thread tracking**

### Monitor Guarantees

- Only **one thread** can hold the monitor at a time
- Other threads block in the **Entry List**
- Threads can voluntarily release the lock via `wait()`

---

## 3. Reentrancy (Why Deadlock Does Not Happen)

`synchronized` is **reentrant**.

This means:
- A thread holding a lock can **re-acquire the same lock**
- JVM tracks **lock count per thread**

```java
synchronized void a() {
    b(); // safe
}

synchronized void b() {}
```

Without reentrancy, this would deadlock.

---

## 4. Lock Scope

### 4.1 Instance Method

```java
synchronized void foo() {}
```
- Locks: `this`

### 4.2 Static Method

```java
static synchronized void bar() {}
```
- Locks: `Class` object

### 4.3 Synchronized Block

```java
synchronized (lock) {}
```
- Locks: specified object

> **Rule:** Lock identity matters more than syntax.

---

## 5. Memory Visibility (Happens-Before)

`synchronized` provides **strong memory guarantees**:

- **Unlock → Lock** establishes a happens-before relationship
- Writes before unlock are visible after lock

Equivalent to:
- Lock = acquire memory barrier
- Unlock = release memory barrier

This is why `synchronized` fixes visibility issues.

---

## 6. Lock States (Why Multiple Locks Exist)

HotSpot JVM uses **lock optimization**:

### 6.1 Biased Lock
- No contention
- Optimized for single-thread access

### 6.2 Lightweight Lock
- CAS-based spinning
- Short-lived contention

### 6.3 Heavyweight Lock
- OS mutex
- Thread suspension

> Lock **upgrades**, never downgrades.

---

## 7. JIT Optimizations

### 7.1 Lock Elimination
If JIT proves:
- No shared access

Then:
- Lock is completely removed

### 7.2 Lock Coarsening
If many small locks exist:
- JIT merges them into one larger lock

Goal:
- Reduce lock/unlock overhead

---

## 8. `wait / notify` Semantics

`wait()` and `notify()` are **monitor methods**, not thread methods.

### Rules:
- Must be called **inside synchronized block**
- `wait()`:
  - Releases the monitor
  - Enters wait set
- `notify()`:
  - Wakes one waiting thread
  - Does NOT release lock immediately

---

## 9. `synchronized` vs `ReentrantLock`

| Aspect | synchronized | ReentrantLock |
|------|-------------|---------------|
| Reentrant | ✅ | ✅ |
| Fairness | ❌ | ✅ (optional) |
| Interruptible | ❌ | ✅ |
| Condition | `wait/notify` | `Condition` |
| JVM Optimized | ✅ | ❌ |
| Simplicity | ✅ | ❌ |

---

## 10. When to Use `synchronized`

Use when:
- Simple mutual exclusion
- Low contention
- Clear lock ownership
- JVM-level optimization matters

Avoid when:
- Need fairness
- Need timeout / interruptibility
- High contention with complex coordination

---

## 11. Mental Model (Most Important)

> `synchronized` is **about ownership and ordering**, not syntax.

Ask yourself:
- Who owns the lock?
- What state is protected?
- What visibility is guaranteed?
- Is contention expected?

---

## 12. One-Sentence Summary

**`synchronized` is a JVM-managed, reentrant, monitor-based lock with strong memory semantics and aggressive JIT optimizations.**

---

_End of document_
