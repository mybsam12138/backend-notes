# JVM Garbage Collection Summary
## Mark–Copy, Mark–Compact and GC Collectors (Serial / Parallel / G1)

---

## 1. Classic Garbage Collection Algorithms

### 1.1 Mark–Copy (Copying Algorithm)

**Core idea**  
- Divide memory into two areas: From-space and To-space  
- Only copy **live objects**  
- Dead objects are ignored  

**Process**
```text
Mark live objects
→ Copy live objects to another space
→ Clear the original space
```

**Characteristics**
- Very fast when most objects are short-lived
- No fragmentation
- Requires extra space

**Typical usage**
- Young Generation (Eden + Survivor)

---

### 1.2 Mark–Compact (Mark–Slide Algorithm)

**Core idea**  
- Keep objects in the same space
- Compact all live objects together after marking  

**Process**
```text
Mark live objects
→ Move (compact) them to one end
→ Free remaining space
```

**Characteristics**
- Eliminates fragmentation
- No extra memory required
- Expensive for large heaps
- Long Stop-The-World pauses

**Typical usage**
- Old Generation (classic collectors)

---

## 2. Why Different Algorithms Are Used

| Area | Object Lifetime | Preferred Algorithm | Reason |
|----|----|----|----|
| Young Gen | Short-lived | Mark–Copy | Fast, most objects die |
| Old Gen | Long-lived | Mark–Compact | Avoid fragmentation |

---

## 3. JVM Garbage Collectors Overview

### 3.1 Serial GC

**Description**
- Single-threaded GC
- Stop-The-World
- Simple and predictable  

**Algorithms**
- Young: Mark–Copy
- Old: Mark–Compact  

**Best for**
- Small heaps
- Single-core systems
- Low memory environments

---

### 3.2 Parallel GC (Throughput GC)

**Description**
- Multi-threaded GC
- Stop-The-World
- Focus on maximum throughput  

**Algorithms**
- Young: Parallel Mark–Copy
- Old: Parallel Mark–Compact  

**Best for**
- Batch processing
- CPU-intensive jobs
- Throughput-oriented systems

---

### 3.3 G1 GC (Garbage First)

**Description**
- Region-based heap
- Concurrent marking
- Predictable pause times
- Designed for large heaps  

**Heap Layout**
- Heap divided into many equal-sized regions
- Regions are logically Eden / Survivor / Old  

**Algorithms**
- Marking (concurrent)
- Copying (Evacuation)
- No Mark–Compact  

**Key Features**
- Selective evacuation
- Mixed GC (Young + some Old)
- Avoids Full GC as much as possible

---

## 4. GC Types and Scope

| GC Type | Scope | Algorithm | Pause Cost |
|------|------|------|------|
| Young GC | Young only | Mark–Copy | Low |
| Mixed GC (G1) | Young + selected Old | Mark + Copy | Medium |
| Full GC | Entire heap + metaspace | Mark–Compact / fallback | High |

---

## 5. Key Differences Between Collectors

| Aspect | Serial GC | Parallel GC | G1 GC |
|----|----|----|----|
| Threads | Single | Multiple | Multiple |
| Heap layout | Continuous | Continuous | Regions |
| Old GC | Mark–Compact | Mark–Compact | Copy (Evacuation) |
| Latency | High | Medium | Low & predictable |
| Throughput | Low | High | Balanced |
| Full GC risk | High | Medium | Low (but expensive if happens) |

---

## 6. Why G1 Uses Mark + Copy Instead of Mark–Compact

- Mark–Compact requires global heap movement
- Causes long, unpredictable pauses
- G1 avoids fragmentation by evacuating regions
- Copying survivors frees regions completely
- Enables pause-time prediction

---

## 7. One-Sentence Summary

> Classic JVM GC uses Mark–Copy for young objects and Mark–Compact for old objects, while modern collectors like G1 rely on region-based marking and copying to achieve low and predictable latency.

---

## 8. Mental Model

- **Mark–Copy**: copy survivors, ignore garbage  
- **Mark–Compact**: slide everything together  
- **Serial GC**: simple but slow  
- **Parallel GC**: fast but pause-heavy  
- **G1 GC**: smart, selective, and predictable  

---

## 9. Final Takeaway

Understanding GC algorithms and collectors helps you:
- Choose the right GC
- Tune JVM parameters effectively
- Diagnose latency and memory issues

This knowledge is essential for **Java SE / JVM performance tuning**.
