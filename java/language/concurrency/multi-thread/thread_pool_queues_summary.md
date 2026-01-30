# Common Queues vs Thread Pool Queues (Java)

This document summarizes **general-purpose queues** and **queues commonly used in thread pools**, focusing on **behavior, blocking characteristics, capacity, and real-world usage**.

---

## 1. What Is a Queue (General Concept)

A **queue** is a data structure that stores elements in a specific order, typically:

- **FIFO** (First In, First Out)
- Sometimes **priority-based** or **LIFO-like** depending on implementation

Core operations:

- `offer / add` → insert element
- `poll / remove` → take element
- `peek` → inspect head without removing

Queues may be:

- **Bounded** or **unbounded**
- **Blocking** or **non-blocking**
- **Thread-safe** or **not thread-safe**

---

## 2. Why Thread Pools Care About Queues

In a **thread pool**, the queue is not just a container — it directly affects:

- Task scheduling order
- Thread creation behavior
- Throughput vs latency
- Back-pressure and overload protection

In Java, thread pools rely on **`BlockingQueue<Runnable>`**.

---

## 3. BlockingQueue vs Ordinary Queue

| Aspect | Ordinary Queue | BlockingQueue |
|------|---------------|---------------|
| Thread-safe | Usually ❌ | ✅ |
| Blocking on empty | ❌ | ✅ (`take`) |
| Blocking on full | ❌ | ✅ (`put`) |
| Used in thread pool | ❌ | ✅ |
| Designed for concurrency | ❌ | ✅ |

👉 **Thread pools must use `BlockingQueue`**, otherwise workers would spin or crash.

---

## 4. Common BlockingQueue Implementations in Thread Pools

### 4.1 LinkedBlockingQueue

**Type:** FIFO, linked list

**Characteristics:**

- Can be **bounded or unbounded**
- Uses separate locks for put/take (good concurrency)
- Default in `Executors.newFixedThreadPool`

**Thread pool impact:**

- Tasks queue up first
- Threads rarely grow beyond core size

**Risk:**

- Unbounded → **OOM under load**

---

### 4.2 ArrayBlockingQueue

**Type:** FIFO, array-backed

**Characteristics:**

- **Fixed capacity**
- Single lock (less concurrency than LinkedBlockingQueue)
- Predictable memory usage

**Thread pool impact:**

- Provides **strong back-pressure**
- Threads grow when queue fills

**Use when:**

- You want strict limits and predictable behavior

---

### 4.3 SynchronousQueue

**Type:** No capacity (handoff only)

**Characteristics:**

- No actual storage
- Each task must be handed directly to a worker
- Used by `Executors.newCachedThreadPool`

**Thread pool impact:**

- Threads grow aggressively
- Minimal latency

**Risk:**

- Thread explosion under high load

---

### 4.4 PriorityBlockingQueue

**Type:** Priority-based (not FIFO)

**Characteristics:**

- Tasks ordered by priority or comparator
- Unbounded
- Does **not** guarantee fairness for equal priority

**Thread pool impact:**

- High-priority tasks may starve low-priority ones

---

### 4.5 DelayQueue

**Type:** Time-based priority queue

**Characteristics:**

- Elements become available only after delay expires
- Used for scheduled / delayed execution

**Typical use:**

- Scheduler implementations
- Retry / timeout mechanisms

---

## 5. Queue Choice Directly Changes ThreadPoolExecutor Behavior

Thread creation logic (simplified):

```
1. If running threads < corePoolSize → create thread
2. Else try to enqueue task
3. If queue full → create thread (up to maxPoolSize)
4. If still rejected → apply RejectedExecutionHandler
```

👉 **Queue choice determines whether the pool prefers queueing or scaling threads.**

---

## 6. Common Queue Strategy Comparison

| Queue | Capacity | Thread Growth | Risk |
|------|---------|---------------|------|
| LinkedBlockingQueue | Unbounded | Low | OOM |
| ArrayBlockingQueue | Fixed | Medium | Task rejection |
| SynchronousQueue | 0 | High | Thread explosion |
| PriorityBlockingQueue | Unbounded | Low | Starvation |

---

## 7. Production Recommendations

### ✅ Recommended

- Prefer **bounded queues** in production
- Combine with meaningful `RejectedExecutionHandler`
- Size queue based on **latency tolerance**, not memory

### ❌ Avoid

- Unbounded queues with external traffic
- `newFixedThreadPool` without capacity awareness
- Priority queues without starvation control

---

## 8. Mental Model (One Sentence Each)

- **LinkedBlockingQueue** → "Queue first, threads later"
- **ArrayBlockingQueue** → "Queue with limits"
- **SynchronousQueue** → "No queue, only threads"
- **PriorityBlockingQueue** → "Important tasks first"
- **DelayQueue** → "Execute when time comes"

---

## 9. Final Takeaway

> **In thread pools, the queue is a policy decision, not a data structure choice.**

Choosing the wrong queue can silently destroy system stability.

---

*End of document*

