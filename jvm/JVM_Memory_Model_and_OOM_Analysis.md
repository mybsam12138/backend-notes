# Understanding JVM Memory Model and OutOfMemoryError Scenarios

## Introduction

Before tuning garbage collection or adjusting JVM parameters, it is critical to understand **how the JVM manages memory**.  
Most JVM performance problems eventually manifest as memory pressure, frequent garbage collection, or various forms of `OutOfMemoryError`.

This article explains the **JVM memory model**, the responsibilities of each memory area, and the most common OutOfMemoryError scenarios encountered in real-world Java applications.

---

## JVM Memory Model Overview

The JVM divides memory into several logical areas, each serving a different purpose and following different management rules.

At a high level, JVM memory can be categorized into:
- **Heap memory**
- **Non-heap memory**
- **Native memory**

Understanding which area is affected is the first step toward effective JVM tuning.

---

## Heap Memory

The **heap** is the primary memory area where Java objects are allocated.  
It is managed by the garbage collector.

### Heap Structure

The heap is typically divided into:
- **Young Generation**
  - Eden Space
  - Survivor Spaces (S0 / S1)
- **Old Generation**

#### Young Generation
- Most objects are created here
- Minor GC (Young GC) occurs frequently
- Objects that survive multiple collections are promoted

#### Old Generation
- Stores long-lived objects
- Collected less frequently
- Major GC / Full GC affects this area

### Common Heap OOM Causes

```text
java.lang.OutOfMemoryError: Java heap space
```

Typical reasons:
- Insufficient heap size
- Memory leaks caused by long-lived references
- Excessive object creation
- Large caches without eviction

Heap OOMs are often symptoms of **application-level memory leaks**.

---

## Metaspace

**Metaspace** stores class metadata, such as:
- Class definitions
- Method metadata
- Runtime constant pools

Unlike PermGen, Metaspace:
- Resides in native memory
- Grows dynamically by default

### Common Metaspace OOM

```text
java.lang.OutOfMemoryError: Metaspace
```

Typical causes:
- Too many loaded classes
- ClassLoader leaks
- Frequent dynamic class generation (e.g., proxies)

Metaspace issues are common in:
- Spring Boot applications
- Plugin-based systems
- Hot-reload or redeploy environments

---

## Thread Stack Memory

Each Java thread has its own **stack**, used to store:
- Method call frames
- Local variables
- Partial results

### Stack-Related Errors

```text
java.lang.StackOverflowError
```

Common causes:
- Infinite recursion
- Excessively deep call stacks

Although not an OOM, stack overflow errors are memory-related and must be considered during tuning.

---

## Native Memory

Native memory includes:
- Metaspace
- Direct buffers (e.g., NIO)
- JVM internal structures
- JNI allocations

Native memory is **not fully controlled by the GC**.

### Native Memory OOM

```text
OutOfMemoryError: Direct buffer memory
```

Or:
- Process killed by the OS
- Container memory limit exceeded

Common causes:
- Excessive direct buffer usage
- Memory leaks in native libraries
- Improper container memory configuration

---

## GC-Managed vs Non-GC-Managed Memory

| Memory Area | GC Managed |
|-----------|-----------|
| Heap | Yes |
| Metaspace | Partially |
| Thread Stack | No |
| Native Memory | No |

This distinction is crucial:
> Not all OutOfMemoryErrors can be fixed by tuning GC.

---

## How Memory Issues Relate to JVM Tuning

- Heap OOM → GC tuning, heap sizing, object lifecycle analysis
- Metaspace OOM → ClassLoader analysis, class unloading
- Stack issues → Code structure review
- Native memory issues → JVM flags, OS/container limits

Correct tuning requires identifying **which memory area is under pressure**.

---

## A Practical Debugging Approach

When facing memory-related issues:

1. Identify the error type
2. Determine the affected memory area
3. Capture diagnostics (heap dump, GC logs)
4. Analyze object retention and references
5. Apply targeted tuning or code fixes

Blindly increasing memory often hides the real problem.

---

## Conclusion

Understanding the JVM memory model is the foundation of JVM tuning.  
Different memory areas behave differently, fail differently, and require different optimization strategies.

Most effective JVM tuning starts with **correct memory diagnosis**, not parameter tweaking.  
Once memory behavior is understood, garbage collection and parameter tuning become much more effective.

---

## What’s Next

The next article will explore:
- Garbage collection algorithms
- GC pause behavior
- Throughput vs latency trade-offs
- Practical GC tuning strategies

