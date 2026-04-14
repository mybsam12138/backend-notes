# synchronized Under the Hood  
## Object Mark Word & Monitor Mechanism (JVM Internals)

> This document explains **how `synchronized` really works inside the JVM**,  
> focusing on **Object Header (Mark Word)** and **Monitor (ObjectMonitor)**.  
> It is a *mechanism-level* explanation, not an API tutorial.

---

## 1. Big Picture: What synchronized Actually Does

From a **Java language** perspective:

```java
synchronized (obj) {
    // critical section
}
```

means:
- Mutual exclusion
- Visibility guarantee
- Ordering guarantee

From a **JVM** perspective:
- Threads compete for an **object-associated monitor**
- Lock state is encoded in the **object header (Mark Word)**
- JVM may **upgrade or revoke locks dynamically**

---

## 2. Object Layout in HotSpot JVM

In HotSpot, every Java object has a header:

```
| Mark Word | Klass Pointer | Instance Data |
```

### 2.1 Mark Word (core to synchronized)

The **Mark Word** is a *multipurpose field* storing:

- Lock state
- Hash code
- GC age
- Biased lock info (if enabled)

Its meaning **changes depending on lock state**.

---

## 3. Mark Word Structure (64-bit JVM, simplified)

```
| lock bits | biased | age | hash / thread / monitor ptr |
```

### Lock bits meaning (simplified):

| lock bits | State |
|----------|------|
| 01 | Unlocked |
| 01 + biased | Biased lock |
| 00 | Lightweight lock |
| 10 | Heavyweight lock (Monitor) |
| 11 | GC mark |

⚠️ The **same bits mean different things** in different states.

---

## 4. Unlocked State

Initial object state:

- No thread owns the lock
- Mark Word stores:
  - Hash code (if computed)
  - GC age

```
Mark Word → hash | age | 01
```

No monitor object exists yet.

---

## 5. Biased Lock (Optimization for No Contention)

### 5.1 Why biased locking exists

Most synchronized blocks:
- Are accessed by **only one thread**
- Have **no real contention**

Biased locking avoids CAS operations.

---

### 5.2 How biased locking works

- First thread enters synchronized block
- JVM **records thread ID in Mark Word**
- No atomic instructions needed on re-entry

```
Mark Word → threadId | epoch | biased | 01
```

If the **same thread** enters again:
- Lock is considered already held
- Almost zero cost

---

### 5.3 Biased lock revocation

If **another thread** tries to acquire the lock:
- JVM must **revoke bias**
- Requires a **safepoint**
- Lock upgrades to lightweight or heavyweight

⚠️ Revocation is expensive.

> Note: Biased locking is disabled by default in newer JDKs (JDK 15+).

---

## 6. Lightweight Lock (CAS + Spin)

### 6.1 When lightweight lock is used

- Multiple threads
- Short critical sections
- Low contention

---

### 6.2 Lock acquisition process

1. Thread creates a **Lock Record** on its stack
2. Copies Mark Word into Lock Record
3. CAS object’s Mark Word → point to Lock Record

```
Object Mark Word → pointer to Lock Record
```

If CAS succeeds:
- Lock acquired
- No OS mutex involved

---

### 6.3 Spinning

If CAS fails:
- Thread **spins** briefly
- Hopes owner releases lock soon

Spinning avoids expensive OS context switches.

---

## 7. Heavyweight Lock (ObjectMonitor)

### 7.1 When lock inflates

Lock upgrades to heavyweight when:
- Spinning fails
- Contention is high
- Threads are blocked

---

### 7.2 ObjectMonitor structure (simplified)

```
ObjectMonitor {
    _owner        // owning thread
    _EntryList    // threads waiting for lock
    _WaitSet      // threads calling wait()
    _recursions   // reentrancy count
}
```

Mark Word now stores:
```
pointer → ObjectMonitor
```

---

### 7.3 Blocking behavior

- Threads are **parked**
- OS-level mutex / condition variable used
- Context switching occurs (expensive)

---

## 8. Lock Upgrade Path (One-Way)

```
Unlocked
   ↓
Biased
   ↓
Lightweight
   ↓
Heavyweight
```

⚠️ **No downgrade** once inflated.

This is a deliberate JVM design choice.

---

## 9. Reentrancy Explained

`synchronized` is **reentrant** because:

- Monitor tracks:
  - Owner thread
  - Recursion count

Same thread can enter the same monitor multiple times safely.

---

## 10. Visibility & JMM Connection

`synchronized` enforces JMM rules:

- **Monitor exit** → flush writes to main memory
- **Monitor enter** → invalidate local caches

JMM rule:
> Unlock happens-before subsequent lock on the same monitor

This is why synchronized ensures visibility.

---

## 11. Why synchronized Is “Not Slow” Anymore

Modern JVM optimizations:
- Lock elision
- Lock coarsening
- Adaptive spinning
- Biased locking (historically)

For **low to medium contention**, synchronized is extremely efficient.

---

## 12. Key Takeaways (Memory Anchors)

- Lock state is stored in **object header (Mark Word)**
- Monitor exists **only when needed**
- Lock upgrades are **one-way**
- synchronized = mutual exclusion + visibility + ordering
- Performance depends on **contention**, not keyword

---

## 13. One-Sentence Summary

> **synchronized is a JVM-managed state machine driven by Mark Word and ObjectMonitor,  
not just a language keyword.**

---

*Category: Java / JVM Internals*
