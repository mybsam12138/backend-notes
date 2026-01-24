# Java Memory Model (JMM) – Summary

This document gives a **overview** of the Java Memory Model (JMM).
It focuses on *what problem JMM solves*, *what guarantees it provides*, and *what developers must care about*.

---

## 1. What is JMM?

The **Java Memory Model (JMM)** defines **how threads interact through memory**.

In simple terms, it answers questions like:
- When one thread writes a variable, **when can another thread see it**?
- Can the JVM or CPU **reorder instructions**?
- Which operations are **thread-safe** and which are not?

JMM is a **specification**, not a concrete implementation.

---

## 2. Why JMM Exists

Modern systems have:
- Multiple CPU cores
- CPU caches
- Compiler optimizations
- Instruction reordering

Without rules, multi-threaded code would behave **unpredictably**.

JMM provides:
- **Visibility rules**
- **Ordering guarantees**
- **Atomicity guarantees**

So that Java code behaves consistently across different CPUs and JVMs.

---

## 3. Main Memory vs Working Memory

JMM abstracts memory into two concepts:

- **Main Memory**
  - Shared by all threads
  - Holds all variables

- **Working Memory (per thread)**
  - Cached copies of variables
  - Reads/writes may happen here first

A thread may:
- Read a value from main memory into working memory
- Modify it locally
- Write it back later (or not immediately)

This explains **visibility problems**.

---

## 4. The Three Core Problems JMM Solves

### 4.1 Visibility

One thread updates a variable, another thread may **not see the update** immediately.

Example problem:
- Thread A sets `flag = true`
- Thread B keeps seeing `flag = false`

JMM defines **when writes become visible** to other threads.

---

### 4.2 Ordering (Instruction Reordering)

For performance, JVM and CPU may reorder instructions **as long as single-thread semantics stay correct**.

In multi-threading, this can cause:
- Reads happening before writes
- Observed execution order different from code order

JMM restricts reordering **only when it affects correctness**.

---

### 4.3 Atomicity

Some operations are **not atomic**:
- `count++` is actually read → add → write

JMM defines:
- Which operations are atomic
- Which need synchronization

---

## 5. Happens-Before Rule (Core of JMM)

**Happens-Before** defines **visibility + ordering guarantees**.

If A happens-before B, then:
- A’s effects are visible to B
- A is ordered before B

Key happens-before rules:
- Program order within a thread
- `synchronized` unlock → subsequent lock
- `volatile` write → subsequent read
- Thread start and thread join rules

This is the **most important concept in JMM**.

---

## 6. volatile Keyword

`volatile` guarantees:
- **Visibility**: reads always see the latest write
- **Ordering**: prevents certain reordering

It does NOT guarantee:
- Atomicity for compound operations (like `i++`)

Use `volatile` for:
- Status flags
- Configuration values
- One-write, many-read scenarios

---

## 7. synchronized Keyword

`synchronized` provides:
- Mutual exclusion (only one thread enters)
- Visibility (flushes working memory)
- Ordering (establishes happens-before)

It is **stronger than volatile**, but also heavier.

---

## 8. Final Fields and Safe Publication

JMM gives special guarantees for `final` fields:
- Properly constructed objects expose correct final values
- Prevents seeing partially initialized state

Correct object publication matters.

---

## 9. What JMM Does NOT Guarantee

- No fairness guarantee
- No timing guarantee
- No performance guarantee
- No deadlock prevention

JMM only defines **correctness rules**, not behavior quality.

---

## 10. Practical Mental Model

You can think of JMM as:
- Rules for **when data is visible**
- Rules for **when operations are ordered**
- A contract between:
  - JVM
  - CPU
  - Developer

If code follows JMM rules, it works **on all platforms**.

---

## 11. When You Must Care About JMM

You must understand JMM when:
- Writing multi-threaded code
- Using `volatile`, `synchronized`, locks
- Writing low-level concurrency utilities
- Debugging concurrency bugs

If you only use high-level concurrency libraries correctly, JMM is mostly handled for you.

---

## 12. One-Sentence Summary

**JMM defines how and when threads can see each other’s memory changes, and which execution orders are allowed.**
