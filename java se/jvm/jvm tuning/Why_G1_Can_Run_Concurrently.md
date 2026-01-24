# Why G1 GC Can Run Concurrently (and Why Keeping Garbage Is OK)

## 1. The Core Problem G1 Is Solving

Traditional garbage collection faces a dilemma:

- To be **correct**, GC must not miss any live object
- To be **fast**, GC wants to avoid long Stop-The-World (STW) pauses

Classic collectors choose correctness + simplicity:
- Stop the world
- Freeze the object graph
- Do all work safely

G1 takes a different approach:

> **Allow some garbage to survive temporarily in exchange for much shorter and more predictable pauses.**

---

## 2. The Fundamental Principle That Enables Concurrency

### The key GC safety rule

> **A garbage collector must never collect a live object.  
> Keeping garbage alive longer than necessary is acceptable.**

This single rule is the foundation of concurrent GC.

---

## 3. How G1 Uses This Principle

G1 is designed around a simple but powerful idea:

> **It is acceptable to over-mark (retain garbage), but unacceptable to under-mark (miss live objects).**

So G1 chooses safety over aggressiveness.

---

## 4. What “Concurrent” Means in G1

In G1:
- **Concurrent marking** runs while application threads are running
- The heap may change during marking
- The object graph seen by GC may be slightly outdated

This is safe because:
- Any object that *might* be live is treated as live
- Objects that become garbage during marking may remain until the next GC

---

## 5. Why Retaining Garbage Is Safe

If G1 marks an object that later becomes unreachable:
- The object is not reclaimed immediately
- It remains in memory until a later GC cycle

This causes:
- Slightly higher memory usage
- No correctness issues
- No crashes

This tradeoff is intentional and safe.

---

## 6. Why Collecting Live Objects Is Dangerous

If GC mistakenly frees a live object:
- Application may still reference it
- Memory corruption occurs
- JVM may crash

Therefore:

> **GC correctness is defined by never freeing live objects, not by freeing all garbage immediately.**

---

## 7. How This Enables Concurrent Marking

Because G1 allows temporary garbage retention:

- Marking does not require a perfectly stable heap
- Application threads can continue running
- GC does not need to stop the world for long periods
- Short pauses are sufficient for coordination

This is why G1 can:
- Perform most marking concurrently
- Greatly reduce pause times
- Maintain predictable latency

---

## 8. Relationship to G1’s Overall Design

This principle fits naturally with G1’s architecture:

- Region-based heap
- Incremental cleanup
- Selective evacuation
- Mixed GC cycles

Objects not reclaimed in one cycle are handled later.

---

## 9. Practical Outcome

Because of this design:

- G1 avoids frequent Full GC
- Latency is more stable
- Throughput remains reasonable
- Large heaps are manageable

This is why G1 is a good default GC for server applications.

---

## 10. One-Sentence Summary

> **G1 can run concurrently because it prioritizes never missing live objects, even if that means allowing some garbage to survive until a later GC cycle.**

---

## 11. Key Takeaway

Think of G1 GC as:

> **“Clean safely and incrementally, not perfectly and all at once.”**

This philosophy is what makes concurrent, low-latency garbage collection possible.
