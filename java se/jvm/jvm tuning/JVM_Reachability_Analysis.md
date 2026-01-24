# JVM Reachability Analysis (GC Marking Algorithm)

## 1. What Is Reachability Analysis?

**Reachability Analysis** is the core algorithm used by the JVM Garbage Collector to determine **which objects are alive** and which can be reclaimed.

> Objects are considered **alive** if they are reachable from **GC Roots**.

This approach is also known as **Tracing Garbage Collection**.

---

## 2. Why Reachability Analysis Is Needed

The JVM **does not use reference counting** because:
- Circular references cannot be collected
- Reference updates are expensive
- It performs poorly in complex object graphs

Instead, the JVM builds an **object graph** and checks reachability from roots.

---

## 3. GC Roots (Starting Points of Marking)

The marking process always starts from **GC Roots**, which are references that are known to be always reachable.

### Common GC Roots include:

### 3.1 Local Variables in Stack Frames
- Method parameters
- Local variables
- Temporary references

```java
void test() {
    Object o = new Object(); // GC Root reference
}
```

---

### 3.2 Active Threads
- Each live thread is a GC Root

---

### 3.3 Static Variables
```java
static Object cache = new Object();
```
- Static fields are roots as long as the class is loaded

---

### 3.4 JNI References
- Objects referenced by native (C/C++) code

---

### 3.5 ClassLoader References
- Important for class unloading and Metaspace reclamation

---

### 3.6 JVM Internal References
- Internal structures required by the JVM itself

---

## 4. How the Marking Process Works

The GC performs the following steps:

```text
GC Roots
  ↓
Mark objects directly referenced by GC Roots
  ↓
Traverse object references recursively
  ↓
Mark all reachable objects
  ↓
Unmarked objects are garbage
```

This traversal is essentially a **graph search** over the object reference graph.

---

## 5. Marking-Based GC Algorithms

Reachability analysis is used by all major JVM GC algorithms, including:

- Mark–Sweep
- Mark–Compact
- Mark–Copy
- G1 GC
- ZGC
- Shenandoah

---

## 6. Stack Frame vs Stack Trace (Important Distinction)

- **Stack Frame**: Runtime data for a method call (locals, operands)
- **Stack Trace**: Debugging information showing call history

> GC Roots come from **stack frames**, not stack traces.

---

## 7. Why GC Roots Are Outside the Heap

Heap objects may reference each other indefinitely.
Only references **outside the heap** can determine whether an object is truly in use.

---

## 8. One-Sentence Summary

> JVM reachability analysis determines object liveness by marking all objects reachable from GC Roots such as stack local variables, static fields, and active threads.

---

## 9. Key Takeaway

Think of reachability analysis as:

> **Starting from trusted roots and tracing all connected objects; everything else is garbage.**
