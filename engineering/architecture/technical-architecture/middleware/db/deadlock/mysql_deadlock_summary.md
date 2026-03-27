# MySQL Deadlock: Scenarios, Solutions, and Handling

## 1. What is a Deadlock?

A deadlock occurs when two or more transactions hold locks and wait for each other in a circular manner, causing all of them to be blocked indefinitely.

---

## 2. Common Scenarios Leading to Deadlocks

### 2.1 Inconsistent Lock Ordering
Two transactions update rows in different orders:

```sql
-- Transaction A
UPDATE table SET ... WHERE id = 1;
UPDATE table SET ... WHERE id = 2;

-- Transaction B
UPDATE table SET ... WHERE id = 2;
UPDATE table SET ... WHERE id = 1;
```

👉 Most common cause of deadlock

---

### 2.2 Range Queries (Gap Locks / Next-Key Locks)

```sql
SELECT * FROM orders WHERE id > 10 FOR UPDATE;
```

👉 Locks a range of rows, not just specific rows  
👉 Another transaction inserting into this range can cause deadlock

---

### 2.3 Missing Index (Lock Escalation)

```sql
UPDATE user SET name = 'A' WHERE name = 'Tom';
```

👉 Without index, many rows (or full table) may be locked  
👉 Increases chance of deadlock

---

### 2.4 Insert with Unique Index Conflict

```sql
INSERT INTO user (email) VALUES ('test@example.com');
```

👉 Concurrent inserts with same unique key  
👉 Can cause lock wait and deadlock

---

### 2.5 Multi-table Operations (JOIN / Multiple Tables)

```sql
UPDATE A JOIN B ...
```

👉 Different transactions may lock tables in different orders

---

## 3. What MySQL Does When Deadlock Occurs

InnoDB automatically:

1. Detects the deadlock
2. Chooses a victim transaction (lowest cost)
3. Rolls back the victim
4. Returns error to application

### Error Message

```
Deadlock found when trying to get lock; try restarting transaction
```

👉 MySQL does NOT automatically retry the transaction

---

## 4. Solutions / Best Practices

### 4.1 Consistent Lock Ordering (Most Important)

👉 Always lock resources in the same order

```text
Lock smaller id first, then larger id
```

---

### 4.2 Keep Transactions Short

- Avoid long-running transactions
- Reduce lock holding time

---

### 4.3 Use Proper Indexing

👉 Ensure WHERE conditions hit indexes  
👉 Reduce lock scope

---

### 4.4 Avoid Range Locks When Possible

```sql
WHERE id > 10 FOR UPDATE
```

👉 May lock ranges → higher deadlock risk

---

### 4.5 Implement Retry Mechanism

```java
try {
    doTransaction();
} catch (DeadlockException e) {
    retry();
}
```

👉 Deadlocks cannot be fully avoided → must handle retries

---

## 5. Key Insight

> Deadlocks are a normal part of concurrent systems, not a bug.  
> The goal is to reduce their probability and handle them correctly.

---

## 6. Final Summary

- Deadlocks occur due to circular lock waiting
- Common causes: inconsistent order, range locks, missing indexes
- MySQL detects and rolls back one transaction
- Applications must implement retry logic
