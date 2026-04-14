# Java Heap Dump Analysis – Summary Example

This document summarizes a **typical Java heap dump analysis result**, focusing on **what information you actually get after analyzing a `.hprof` file** using tools like **Eclipse MAT** or **VisualVM**.

---

## 1. Heap Dump Overview

```
Heap Size:        2.0 GB
Used Heap:        1.95 GB
Object Count:     18,432,912
Class Count:      12,845
GC Roots:         1,247
```

Meaning:
- JVM heap is almost fully occupied
- Large number of live objects
- GC cannot reclaim enough memory

---

## 2. Top Memory Consumers (Histogram)

```
Class Name                              Objects      Retained Size
------------------------------------------------------------------
byte[]                                 2,134,567     1.42 GB (72%)
java.util.HashMap$Node                 2,134,567     256 MB
java.lang.String                       2,134,567     128 MB
com.demo.CacheHolder                   1             1.42 GB
```

Key insight:
- `byte[]` objects dominate heap usage
- All are indirectly retained by a single root object

---

## 3. Leak Suspect Report

```
Leak Suspect:
Class: com.demo.CacheHolder
Field: static CACHE
Retained Heap: 1.42 GB (72%)

Reason:
A static HashMap holds references to millions of objects,
preventing garbage collection.
```

Explanation:
- Static fields are **GC Roots**
- Any object reachable from them cannot be collected

---

## 4. Dominator Tree (Retention Structure)

```
com.demo.CacheHolder
  └─ static CACHE (HashMap)
     └─ table (Node[])
        └─ HashMap$Node
           └─ value (byte[])
```

Interpretation:
- Removing `CACHE` would free **1.42 GB**
- This is the true memory impact (retained size)

---

## 5. Path to GC Root

```
GC Root: System Class
  └─ ClassLoader
     └─ com.demo.CacheHolder
        └─ static CACHE
           └─ HashMap
              └─ byte[]
```

Conclusion:
- Objects are retained because they are reachable from a GC root
- GC behavior is correct; application logic is the problem

---

## 6. Object-Level Detail Example

```
Object Type: byte[]
Shallow Size: 1,048,576 bytes (1 MB)
Retained Size: 1,048,576 bytes
Referenced By: HashMap$Node
```

Difference:
- **Shallow size**: memory of the object itself
- **Retained size**: memory freed if this object is removed

---

## 7. Common Variant: ThreadLocal Leak

```
Leak Suspect:
Thread: http-nio-8080-exec-23
Object: ThreadLocal$ThreadLocalMap
Retained Heap: 512 MB

Reason:
ThreadLocal values were not removed after request completion.
```

---

## 8. Root Cause Summary

```
Root Cause:
Unbounded static cache

Why GC Failed:
Objects are strongly reachable from GC roots

Result:
OutOfMemoryError (Java heap space)
```

---

## 9. Fix Recommendations

- Limit cache size or add eviction
- Use Caffeine / Guava cache
- Clear static references on shutdown
- Always remove ThreadLocal values

---

## 10. One-Sentence Takeaway

> **Heap dump analysis shows which objects occupy memory, how much they retain, and why GC cannot reclaim them.**

---

## 11. Heap Dump vs GC Log (Quick Comparison)

| Aspect | Heap Dump | GC Log |
|------|-----------|--------|
| File Type | Binary (`.hprof`) | Text |
| Purpose | Root cause analysis | GC behavior |
| Timing | Snapshot | Timeline |
| Human-readable | No | Yes |

---

**End of Heap Dump Analysis Summary**
