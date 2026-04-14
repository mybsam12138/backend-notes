# Garbage Collection in the JVM: Algorithms, Trade-offs, and Tuning Goals

## Introduction

Garbage Collection (GC) is the **core mechanism** that allows Java developers to focus on business logic without manual memory management.  
At the same time, GC is also the **primary source of performance issues** in many JVM-based applications.

This article explains how JVM garbage collection works, introduces common GC algorithms, and clarifies the **trade-offs between throughput and latency**, which are central to GC tuning.

---

## What Is Garbage Collection?

Garbage Collection is the process by which the JVM:
- Identifies objects that are no longer reachable
- Reclaims their memory
- Makes that memory available for future allocations

GC is automatic, but **its behavior is configurable**, which is where JVM tuning comes into play.

---

## Stop-The-World (STW)

Most garbage collection phases require a **Stop-The-World (STW)** pause.

During an STW pause:
- All application threads are suspended
- Only GC threads are running
- Application response time is directly affected

GC tuning is largely about **controlling the frequency and duration of STW pauses**.

---

## Generational Garbage Collection

Modern JVMs use the **generational hypothesis**:

> Most objects die young, and a small number live for a long time.

Based on this assumption, the heap is divided into generations.

### Young Generation

- New objects are allocated here
- Collected frequently (Young GC / Minor GC)
- Fast but frequent

### Old Generation

- Stores long-lived objects
- Collected less frequently
- Major GC / Full GC is more expensive

Efficient GC depends on keeping most garbage collection in the **young generation**.

---

## Common GC Algorithms and Collectors

### Serial GC

- Single-threaded
- Simple and predictable
- Suitable for small applications or single-core environments

---

### Parallel GC (Throughput GC)

- Multi-threaded
- Maximizes throughput
- Allows longer pause times

Typical use cases:
- Batch jobs
- Offline processing

---

### CMS (Concurrent Mark Sweep)

- Low-latency oriented
- Mostly concurrent with application threads
- Deprecated in modern Java versions

CMS introduced concurrent collection but suffered from fragmentation and complexity.

---

### G1 GC (Garbage First)

- Region-based heap management
- Predictable pause times
- Balances throughput and latency

Key characteristics:
- Divides the heap into regions
- Prioritizes regions with most garbage
- Supports pause-time goals

G1 GC is the **default collector** in Java 11 and later.

---

### ZGC and Shenandoah

- Ultra-low latency collectors
- Pause times typically under 10ms
- Designed for large heaps

Trade-offs:
- Higher GC overhead
- Slightly lower throughput

Use cases:
- Latency-sensitive systems
- Large-scale services

---

## Throughput vs Latency: The Core Trade-off

| Goal | Focus |
|----|----|
| Throughput | Maximize application work |
| Latency | Minimize pause time |
| Predictability | Stable response time |

You cannot maximize all three simultaneously.

---

## Full GC: Why It Is Dangerous

Full GC:
- Stops all application threads
- Scans most or all heap regions
- Can cause long pauses

Frequent Full GC usually indicates:
- Memory pressure
- Promotion failure
- Incorrect heap sizing
- Memory leaks

In production systems, **frequent Full GC is a red flag**.

---

## GC Tuning Principles

1. Size the heap correctly
2. Avoid unnecessary object allocation
3. Reduce promotion to old generation
4. Monitor GC logs continuously
5. Tune one parameter at a time

> GC tuning is about balance, not extremes.

---

## When GC Tuning Helps — and When It Doesn’t

GC tuning helps when:
- GC overhead is high
- Pause times are unacceptable
- Heap utilization patterns are stable

GC tuning does not help when:
- There are severe memory leaks
- Application logic retains objects unnecessarily
- Native memory is exhausted

In such cases, **code-level fixes are required**.

---

## Conclusion

Garbage Collection is both the JVM’s greatest strength and its most common performance bottleneck.  
Understanding GC algorithms and their trade-offs is essential for effective JVM tuning.

The goal is not zero GC pauses, but **predictable and acceptable GC behavior** for the workload.

---

## What’s Next

The next article will focus on:
- JVM parameters related to memory and GC
- Practical JVM option usage
- Common tuning mistakes and pitfalls
