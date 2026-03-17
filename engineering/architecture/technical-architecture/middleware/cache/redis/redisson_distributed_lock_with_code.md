
# Redisson Distributed Lock – Principles and Example

## 1. Overview

Redisson is a Redis-based Java client that provides a **distributed lock implementation**.  
It improves the simple Redis lock (`SET NX EX`) with:

- Reentrant lock support
- Watchdog automatic lock renewal
- Atomic operations using Lua scripts
- Thread ownership tracking

These features make Redisson locks safer for real distributed systems.

---

# 2. Basic Redisson Distributed Lock Example

Typical Java usage:

```java
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

public void processOrder(Long skuId) {

    RLock lock = redissonClient.getLock("lock:sku:" + skuId);

    lock.lock();   // acquire distributed lock

    try {
        // critical business logic
        deductInventory(skuId);
        createOrder(skuId);

    } finally {
        lock.unlock();   // release lock
    }
}
```

Meaning:

1. `getLock()` creates or references a distributed lock.
2. `lock()` tries to acquire the lock from Redis.
3. Only **one thread across all servers** can enter the critical section.
4. `unlock()` releases the lock.

---

# 3. Reentrant Lock Principle

Redisson locks are **reentrant**, meaning the same thread can acquire the same lock multiple times.

Example:

```java
RLock lock = redissonClient.getLock("lock:sku:" + skuId);

lock.lock();
lock.lock();   // same thread can acquire again

try {
    // business logic
} finally {
    lock.unlock();
    lock.unlock();
}
```

Internally Redis stores a counter.

Example Redis structure:

```
key: lock:sku:1001
type: HASH

clientId:threadId -> 2
```

Meaning:

- thread owns the lock
- reentry count = 2

The lock is released only when the counter reaches **0**.

---

# 4. Why Reentrancy Is Needed

Consider nested method calls:

```java
public void placeOrder(Long skuId) {

    RLock lock = redissonClient.getLock("lock:sku:" + skuId);

    lock.lock();
    try {
        deductInventory(skuId);
    } finally {
        lock.unlock();
    }
}

public void deductInventory(Long skuId) {

    RLock lock = redissonClient.getLock("lock:sku:" + skuId);

    lock.lock();
    try {
        // inventory logic
    } finally {
        lock.unlock();
    }
}
```

Without reentrant locks:

- the same thread would try to acquire the lock twice
- causing **self-deadlock**

Reentrancy prevents this.

---

# 5. Watchdog Auto-Renew Mechanism

## Problem

If a lock has a fixed expiration:

```
TTL = 10 seconds
```

But the business logic takes:

```
30 seconds
```

The lock expires early and another thread may acquire the lock.

---

## Watchdog Solution

Redisson automatically starts a **watchdog background task**.

Default behavior:

- Lock TTL = **30 seconds**
- Watchdog renews TTL periodically

Example timeline:

```
t=0   lock acquired (TTL=30s)
t=10  watchdog renew → TTL reset to 30s
t=20  watchdog renew → TTL reset to 30s
```

As long as the thread holds the lock, the watchdog keeps renewing it.

When:

```
lock.unlock()
```

the watchdog stops.

---

# 6. Lua Scripts for Atomic Operations

Redis commands must be **atomic**.

Unsafe unlock logic:

```
GET lock
compare owner
DEL lock
```

Between these commands another thread may modify the lock.

This creates a race condition.

---

## Lua Script Solution

Redisson uses Lua scripts so Redis executes operations atomically.

Example unlock logic:

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

This guarantees:

- only the lock owner can delete the lock
- operations are atomic

---

# 7. Internal Lock Flow

When `lock.lock()` is called:

1. Redisson runs a Lua script
2. Redis checks whether the lock exists
3. If not → create lock entry
4. If same thread → increase reentry counter
5. If another thread → wait or retry

Unlock flow:

1. verify thread ownership
2. decrease counter
3. if counter = 0 → delete lock

---

# 8. Advantages of Redisson Lock

| Feature | Manual Redis Lock | Redisson |
|--------|------------------|---------|
| Reentrant | No | Yes |
| Safe unlock | Hard | Built-in |
| Lock renewal | Manual | Watchdog |
| Atomic operations | Difficult | Lua scripts |
| API usability | Low | High |

---

# 9. Summary

Redisson distributed locks combine multiple mechanisms:

- Redis HASH structure for ownership tracking
- Reentrant locking to prevent self-deadlock
- Watchdog auto-renew to prevent premature expiration
- Lua scripts to guarantee atomic operations

This makes Redisson one of the most widely used distributed lock implementations in Java microservice systems.
