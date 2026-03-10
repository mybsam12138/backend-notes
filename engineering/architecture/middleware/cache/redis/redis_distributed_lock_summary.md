# Redis Distributed Lock Summary

## 1. What is a Distributed Lock

A distributed lock is a lock mechanism used across multiple processes or multiple servers.

Its purpose is to ensure that:

- only one process can execute a critical operation at a time
- shared resources are protected in a distributed system
- duplicate processing and race conditions are avoided

A normal Java `synchronized` lock only works inside one JVM.
A Redis distributed lock works across many application instances.

---

## 2. Why We Need Distributed Locks

In a single-server system, one local mutex may be enough.

But in a distributed system, you may have:

- app-server-1
- app-server-2
- app-server-3

All of them may process the same request or operate on the same resource at the same time.

Example:

- two users place orders for the last item
- two payment callbacks arrive at the same time
- two scheduled jobs run on different nodes
- the same coupon is claimed concurrently
- the same inventory record is reduced by multiple servers

Without a distributed lock, these operations may conflict.

---

## 3. Typical Scenarios for Distributed Locks

### 3.1 Inventory deduction
This is one of the most classic scenarios.

Example:
- item stock = 1
- user A buys at 10:00:00.001
- user B buys at 10:00:00.002

If two servers read stock at the same time:

- server 1 reads stock = 1
- server 2 reads stock = 1

Then both reduce stock and both create orders.

This causes:

- overselling
- stock inconsistency
- user complaints
- financial or operational problems

A distributed lock can ensure only one server handles stock deduction for the same item at one time.

---

### 3.2 Prevent duplicate order creation

Example:
- user clicks "submit order" twice
- retry happens because network is slow
- two app instances receive the requests

If no lock exists, duplicate orders may be created.

---

### 3.3 Payment callback idempotency

Payment platforms may retry callbacks.
Multiple instances may process the same callback simultaneously.

A distributed lock can ensure one callback is processed once.

---

### 3.4 Scheduled jobs

If a scheduled task runs on several nodes, it may execute multiple times.

A distributed lock ensures only one node runs the job.

---

### 3.5 Cache rebuild for hot keys

When a hot cache key expires, many requests may try to rebuild it.
A distributed lock ensures only one node rebuilds the cache.

---

## 4. Basic Redis Lock Command

The classic Redis command is:

```redis
SET lock:resource-id uniqueValue NX EX 10
```

Meaning:

- `SET` → set a key
- `lock:resource-id` → lock key name
- `uniqueValue` → a unique identifier for the lock owner
- `NX` → set only if key does not exist
- `EX 10` → expire after 10 seconds

This means:

- try to acquire the lock
- succeed only if nobody else holds it
- auto-release after 10 seconds to avoid deadlock

---

## 5. Why `NX` and `EX` Are Important

### `NX`
Ensures only one client can create the lock.

### `EX`
Prevents deadlock if the service crashes and never releases the lock.

Without expiration:
- service acquires lock
- service crashes
- lock remains forever
- others can never proceed

---

## 6. Why the Lock Value Should Be Unique

Do not simply use:

```redis
SET lock:sku:1001 1 NX EX 10
```

A better approach is:

```redis
SET lock:sku:1001 request-uuid-123 NX EX 10
```

Reason:

When releasing the lock, you must make sure:
- only the owner can delete the lock
- another process does not accidentally delete someone else's lock

---

## 7. Safe Unlock with Lua Script

Unsafe unlock:

```redis
DEL lock:sku:1001
```

Problem:
- lock expires
- another process acquires a new lock
- old process still executes `DEL`
- new owner's lock is deleted incorrectly

Safe unlock should check owner first:

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

This means:
- compare lock value
- only delete if the current process is still the lock owner

---

## 8. Typical Lock Flow

### Step 1: try to acquire lock

```redis
SET lock:sku:1001 uuid-123 NX EX 10
```

If result is `OK`, lock acquired.

If result is `nil`, lock acquisition failed.

---

### Step 2: execute critical business logic

Examples:
- query current stock
- reduce stock
- create order
- update status

---

### Step 3: release lock safely

Use the Lua script with the same `uuid-123`.

---

## 9. Inventory Scenario: Why Distributed Lock Helps

### Example problem

Suppose stock = 1.

Two requests arrive almost simultaneously.

Without lock:

1. request A reads stock = 1
2. request B reads stock = 1
3. request A reduces stock to 0
4. request B also reduces stock to 0 or -1
5. two orders may be created

This is overselling.

---

### With Redis distributed lock

For the same SKU:

1. request A acquires `lock:sku:1001`
2. request B fails to acquire lock
3. request A checks stock
4. request A reduces stock
5. request A creates order
6. request A releases lock
7. request B retries or returns busy/fail

Now only one request can deduct inventory at the same time.

---

## 10. Important Note: Lock Alone Is Usually Not Enough for Inventory

A distributed lock reduces concurrency conflict, but inventory protection usually needs more than just a lock.

In production systems, inventory scenarios often also require:

- database transaction
- optimistic locking or version field
- unique constraints
- idempotency protection
- order timeout rollback
- stock reservation design

Why?

Because:
- lock protects concurrency
- database protects consistency
- idempotency protects against retries
- transaction protects multi-step updates

A stronger inventory design is usually:

- acquire distributed lock for SKU or user+SKU
- start DB transaction
- check stock
- deduct stock with conditional update
- create order
- commit transaction
- release lock

---

## 11. Example Inventory SQL Protection

Even with a Redis lock, many systems still use SQL like:

```sql
UPDATE inventory
SET stock = stock - 1
WHERE sku_id = 1001
  AND stock > 0;
```

Then check affected rows:

- `1` row updated → success
- `0` rows updated → out of stock

This is important because database constraints are the final consistency layer.

---

## 12. Recommended Design for Inventory Scenario

For high-concurrency inventory systems, a practical design is:

1. user sends purchase request
2. app tries to acquire Redis lock
3. if lock fails, return retry or busy
4. if lock succeeds, start DB transaction
5. execute conditional inventory deduction
6. create order
7. commit transaction
8. release Redis lock
9. send follow-up events if needed

This design helps reduce overselling risk.

---

## 13. Java Pseudocode Example

```java
String lockKey = "lock:sku:" + skuId;
String lockValue = UUID.randomUUID().toString();

boolean locked = redis.setIfAbsent(lockKey, lockValue, 10, TimeUnit.SECONDS);

if (!locked) {
    throw new RuntimeException("System busy, please retry");
}

try {
    // begin transaction

    Inventory inventory = inventoryRepository.findBySkuId(skuId);
    if (inventory.getStock() <= 0) {
        throw new RuntimeException("Out of stock");
    }

    int affected = inventoryRepository.deductIfEnough(skuId);
    if (affected == 0) {
        throw new RuntimeException("Out of stock");
    }

    orderRepository.createOrder(userId, skuId);

    // commit transaction
} finally {
    // use Lua script to release lock safely
}
```

---

## 14. Common Problems of Redis Distributed Lock

### 14.1 Lock expires before business finishes
If business takes longer than 10 seconds:
- lock expires
- another process acquires lock
- concurrent execution happens again

Solution:
- set proper expiration
- use lock renewal/watchdog
- or use Redisson

---

### 14.2 Unsafe unlock
Always verify owner before unlock.

---

### 14.3 Redis single point of failure
If Redis is down, lock may fail.

Solution:
- Redis Sentinel / Cluster
- or use other coordination systems when stronger guarantees are required

---

### 14.4 Overuse of locks
Do not lock too broadly.
Example:
- locking entire inventory table is too heavy
- locking by SKU is usually better

Granularity matters.

---

## 15. Redisson in Production

Many Java teams do not implement Redis lock manually.
They use Redisson, which provides:

- reentrant lock
- watchdog renewal
- easier API
- better reliability than manual basic lock code

Example:

```java
RLock lock = redissonClient.getLock("lock:sku:" + skuId);
lock.lock();
try {
    // business logic
} finally {
    lock.unlock();
}
```

Redisson is often a better practical choice.

---

## 16. When to Use Distributed Lock

Use distributed lock when:
- multiple servers may operate on the same resource
- duplicate execution must be prevented
- high concurrency may cause conflicts
- idempotency alone is not enough

Examples:
- inventory deduction
- coupon claim
- payment callback processing
- one-time job execution
- cache rebuild

---

## 17. When Not to Rely Only on Distributed Lock

Do not assume distributed lock alone can solve every consistency problem.

For core business scenarios, combine it with:
- DB transaction
- unique index
- optimistic locking
- idempotency token
- business compensation

Distributed lock is one tool, not the whole solution.

---

## 18. One-Sentence Summary

Redis distributed lock is a cross-server mutual exclusion mechanism built with commands like:

```redis
SET lock:resource uniqueValue NX EX 10
```

It is useful for scenarios such as inventory deduction, duplicate order prevention, and scheduled job coordination, but in production it should usually be combined with database consistency protections and safe unlock logic.
