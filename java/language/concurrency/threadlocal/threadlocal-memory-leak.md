# How ThreadLocal Can Lead to Memory Leaks

## 1. What is ThreadLocal (in one sentence)

`ThreadLocal` allows you to bind **data to a thread** rather than passing it through method parameters.

---

## 2. Core Mechanism (Why Leaks Are Possible)

Each **Thread** contains a `ThreadLocalMap`:

- **Key**: `ThreadLocal` (stored as **WeakReference**)
- **Value**: The actual object you store (stored as **strong reference**)

```
Thread
 └── ThreadLocalMap
      ├── WeakReference<ThreadLocal>  → key
      └── Object                      → value (STRONG)
```

This asymmetry is the root cause of memory leaks.

---

## 3. The Leak Scenario (Step by Step)

### Step 1: ThreadLocal is created
```java
ThreadLocal<UserContext> ctx = new ThreadLocal<>();
ctx.set(new UserContext(...));
```

### Step 2: ThreadLocal key becomes unreachable
- The `ThreadLocal` variable goes out of scope
- GC clears the **weak reference key**

### Step 3: Value is NOT cleared
- Value is still strongly referenced by the thread
- Entry becomes:
```
key = null
value = UserContext(...)
```

### Step 4: Thread lives long
- Common in **thread pools** (Tomcat, Spring Boot, ExecutorService)
- Thread never dies → value never released

➡ **Memory leak occurs**

---

## 4. Why Thread Pools Make It Worse

| Scenario | Thread Lifetime |
|--------|----------------|
| New Thread per task | Short |
| Thread Pool | Long / Application lifetime |

Web containers reuse threads across requests:

```
Request A → Thread-1 → ThreadLocal set
Request B → Thread-1 → old value still there
```

Result:
- Memory leak
- Data pollution (request data bleeding into next request)

---

## 5. Typical Real-World Leak Cases

### ❌ Case 1: No remove()
```java
threadLocal.set(obj);
// forgot threadLocal.remove();
```

### ❌ Case 2: Static ThreadLocal
```java
static ThreadLocal<LargeObject> TL = new ThreadLocal<>();
```

- Static → classloader pinned
- Common in frameworks / utils

### ❌ Case 3: Large Objects
- UserSession
- SecurityContext
- Byte buffers
- ORM caches

---

## 6. Why GC Cannot Save You

| Component | GC Behavior |
|--------|------------|
| Thread | Strongly reachable |
| ThreadLocalMap | Strongly reachable |
| Value | Strongly reachable |
| ThreadLocal key | Weak (cleared) |

GC clears the **key**, but the **value survives**.

This is known as a **stale entry**.

---

## 7. How to Prevent ThreadLocal Memory Leaks

### ✅ Rule 1: Always remove()
```java
try {
    threadLocal.set(obj);
    // business logic
} finally {
    threadLocal.remove();
}
```

### ✅ Rule 2: Do not store large objects
- Prefer IDs or lightweight context

### ✅ Rule 3: Avoid static ThreadLocal (unless framework-level)
If unavoidable:
- Document lifecycle clearly
- Ensure cleanup hooks

### ✅ Rule 4: Use framework-managed alternatives
- Spring `RequestContextHolder`
- SecurityContext via filters

---

## 8. Detection & Troubleshooting

### Tools
- JVisualVM
- JProfiler
- YourKit
- Heap dump analysis

### Symptoms
- Old request data appears
- Heap grows slowly
- No obvious GC pressure

---

## 9. Mental Model (One Sentence)

> **ThreadLocal leaks memory not because of weak keys, but because values outlive their intended lifecycle on long-lived threads.**

---

## 10. When ThreadLocal Is Still OK

ThreadLocal is safe **if and only if**:

- Thread lifetime == data lifetime
- You always call `remove()`

Otherwise, it is a loaded gun.

---

## 11. One-Line Best Practice

> **ThreadLocal is a lifecycle tool, not a cache.**
