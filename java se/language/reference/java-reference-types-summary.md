# Java Reference Types – Practical Summary

This document summarizes **Java reference types**, their GC behavior, and how they behave in real systems (especially with ThreadLocal).

---

## 1. Strong Reference

### Definition
The default reference type in Java.

```java
Object obj = new Object();
```

### GC Behavior
- Object is **not collected** as long as at least one strong reference exists.

### Typical Usage
- Normal object usage
- Fields, local variables, collections

### Key Point
> Strong references define *object reachability*.

---

## 2. Weak Reference

### Definition
A reference that does **not prevent GC**.

```java
WeakReference<Object> ref = new WeakReference<>(obj);
```

### GC Behavior
- Object is collected **as soon as it becomes weakly reachable**
- Cleared during GC

### Typical Usage
- Caches
- Metadata
- Avoiding memory retention

### Key Point
> Weak references are for *non-owning* relationships.

---

## 3. Soft Reference

### Definition
A reference kept longer than weak references, mainly for memory-sensitive caches.

```java
SoftReference<Object> ref = new SoftReference<>(obj);
```

### GC Behavior
- Collected **only under memory pressure**
- GC decides when to clear

### Typical Usage
- In-memory caches
- Image caches

### Key Point
> Soft references trade predictability for cache friendliness.

---

## 4. Phantom Reference

### Definition
A reference that does **not allow access** to the object.

```java
PhantomReference<Object> ref =
    new PhantomReference<>(obj, referenceQueue);
```

### GC Behavior
- Enqueued **after object is finalized**
- Object already unreachable

### Typical Usage
- Resource cleanup
- Off-heap memory management
- Post-mortem actions

### Key Point
> Phantom references observe object *death*, not life.

---

## 5. Reference Queue

### Purpose
Receives notifications when references are cleared.

```java
ReferenceQueue<Object> queue = new ReferenceQueue<>();
```

### Used With
- WeakReference
- SoftReference
- PhantomReference

### Key Point
> ReferenceQueue is how you react to GC events.

---

## 6. ThreadLocal and Reference Types (Critical)

### Internal Structure

```text
Thread
 └── ThreadLocalMap
      └── Entry
           ├── key   → WeakReference<ThreadLocal>
           └── value → STRONG reference
```

### Consequence
- Weak key **does NOT mean weak value**
- Value survives as long as the thread lives

### Correct Cleanup
```java
try {
    threadLocal.set(value);
} finally {
    threadLocal.remove();
}
```

### Key Point
> ThreadLocal leaks happen because values are strongly referenced by threads.

---

## 7. Common Misconceptions

| Myth | Reality |
|----|----|
| Weak key means no leak | False |
| GC understands request lifecycle | False |
| ThreadLocal auto-cleans after request | False |
| remove() triggers GC | False |

---

## 8. Practical Rules (Memorize These)

1. Strong reference = ownership
2. Weak reference = optional association
3. Soft reference = memory-sensitive cache
4. Phantom reference = cleanup hook
5. ThreadLocal value lifetime = thread lifetime
6. If thread outlives data → call `remove()`

---

## 9. One-Line Mental Model

> **GC only understands reachability, not business logic.**

---

## 10. Quick Reference Table

| Reference Type | Prevents GC | Typical Use |
|--------------|------------|------------|
| Strong | Yes | Normal objects |
| Weak | No | Caches, listeners |
| Soft | Sometimes | Memory-sensitive cache |
| Phantom | No access | Cleanup hooks |

---

End of document.
