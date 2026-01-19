# Lock Elimination and Lock Coarsening in JVM

This document explains **Lock Elimination** and **Lock Coarsening**, two important JVM **JIT compiler optimizations** related to `synchronized`.

---

## Overview

Both optimizations:

- Are performed **only by the JIT compiler**
- Apply **only to hot code**
- Do **not modify bytecode**
- Affect only the **generated native machine code**

---

## 1. Lock Elimination

### Definition

**Lock elimination** means:

> The JVM completely removes a `synchronized` lock because it proves the lock is **never shared across threads**.

This optimization relies on **escape analysis**.

---

### Example

#### Source code

```java
public void example() {
    Object lock = new Object();
    synchronized (lock) {
        doWork();
    }
}
```

#### Why this lock can be eliminated

- `lock` is a **local variable**
- It does **not escape** the method
- No other thread can ever reference it

➡️ The JVM proves synchronization is unnecessary.

---

### Conceptual execution

#### Before optimization

```text
monitorenter
  doWork()
monitorexit
```

#### After lock elimination (native code)

```text
doWork()
```

✅ Lock removed entirely

---

### Key characteristics

- Lock is **completely removed**
- Zero synchronization overhead
- Safe because no data race is possible

---

## 2. Lock Coarsening

### Definition

**Lock coarsening** means:

> The JVM merges multiple adjacent `synchronized` blocks using the **same lock** into a single larger lock.

This reduces the overhead of **repeated lock acquire/release**.

---

### Example

#### Source code

```java
for (int i = 0; i < 1000; i++) {
    synchronized (lock) {
        work();
    }
}
```

#### Problem

- Lock is acquired and released **1000 times**
- High synchronization overhead

---

### After lock coarsening (conceptual)

```java
synchronized (lock) {
    for (int i = 0; i < 1000; i++) {
        work();
    }
}
```

➡️ One lock instead of many

---

### Conceptual execution

#### Before

```text
monitorenter
work
monitorexit
(repeat)
```

#### After

```text
monitorenter
loop work
monitorexit
```

✅ Same semantics, fewer lock operations

---

### Key characteristics

- Lock is **still present**
- Lock scope becomes larger
- Reduces lock management cost

---

## Lock Elimination vs Lock Coarsening

| Aspect | Lock Elimination | Lock Coarsening |
|------|-----------------|-----------------|
| Lock exists | ❌ Removed | ✅ Still exists |
| Based on | Escape analysis | Control-flow analysis |
| Goal | Remove unnecessary lock | Reduce lock frequency |
| Risk | None (provably safe) | Slightly reduced concurrency |

---

## Important Notes

- These optimizations:
  - Apply **only to hot code**
  - Are done **during JIT compilation**
  - Exist only in **native code**, not bytecode

- Cold or interpreted code:
  - Always executes `monitorenter / monitorexit`
  - Does not benefit from these optimizations

---

## One-sentence summary

> **Lock elimination removes unnecessary locks entirely, while lock coarsening reduces locking overhead by merging multiple synchronized blocks, both applied by the JVM JIT compiler on hot code only.**

