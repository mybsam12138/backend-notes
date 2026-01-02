
# ACID Internals Explained: How Databases Really Work

This article explains **ACID (Atomicity, Consistency, Isolation, Durability)** from a **database internals** perspective.  
Instead of definitions, we focus on **how databases actually implement ACID** using logs, MVCC, snapshots, and locks.

This is written for backend engineers who want a *correct mental model* of modern relational databases.

**Business Help**: 

Sometimes, it is necessary to consider whether **Repeatable Read** is truly required for a given business scenario. By understanding database internals and the default behaviors of different database systems, you can make informed decisions and choose the isolation level that best fits real-world business requirements.

---

## 1. Atomicity — All or Nothing

### What Atomicity Means
A transaction must:
- Either **commit all changes**
- Or **leave the database unchanged**

Partial effects are never visible.

---

### How Atomicity Is Implemented

#### Undo Log (Rollback Segment)
Before modifying a row, the database records how to **undo** that modification.

Example:
```sql
UPDATE account SET balance = 900 WHERE id = 1;
```

Undo log records:
```text
row id=1, old balance=1000
```

If the transaction:
- **Commits** → undo log may be cleaned later
- **Rolls back / crashes** → undo log restores the old value

---

### Key Insight
- Atomicity is guaranteed by **undo logs**
- Data pages may change in memory, but undo logs make rollback always possible

---

## 2. Durability — Once Committed, It Survives

### What Durability Means
Once a transaction commits, its result **will not be lost**, even after crashes.

---

### How Durability Is Implemented

#### Redo Log / WAL (Write-Ahead Logging)

Databases follow the WAL rule:

> **Redo logs must be flushed to disk before commit returns success**

Steps:
1. Modify data in memory (buffer pool)
2. Generate redo log records
3. Flush redo log to disk
4. Commit transaction
5. Data pages may be flushed later

---

### Crash Recovery
If the database crashes:
- Redo logs are replayed
- All committed changes are restored

---

### Key Insight
- **Redo logs guarantee durability**
- Data files themselves do not need to be flushed at commit time

---

## 3. Isolation — Transactions Don’t Interfere

Isolation is implemented using **MVCC + locks**.

---

## 3.1 MVCC (Multi-Version Concurrency Control)

### What MVCC Does
MVCC allows:
- Readers to **not block writers**
- Writers to **not block readers**
- Multiple versions of a row to exist logically

---

### Row Versioning

Each row contains hidden metadata:
- Creating transaction ID
- Deleting/updating transaction ID
- Pointer to older versions (undo)

Example:
```text
balance=1000 (tx10)
balance=900  (tx20)
```

Both versions may exist.

---

### Snapshot

A **snapshot** defines which transaction IDs are visible.

- **READ COMMITTED** → snapshot per statement
- **REPEATABLE READ** → snapshot per transaction

---

### Visibility Rule (Simplified)

A row version is visible if:
- It was created by the current transaction, OR
- It was created by a committed transaction **before the snapshot**
- And not deleted by a visible committed transaction

---

### Important Rule
> MVCC prevents dirty reads, but does **not automatically prevent phantom reads**.

---

## 3.2 Isolation Levels in Practice

| Isolation Level | Snapshot Scope | Repeatable Reads |
|-----------------|---------------|------------------|
| READ COMMITTED | Per statement | No |
| REPEATABLE READ | Per transaction | Yes |
| SERIALIZABLE | Per transaction + conflicts | Yes |

---

### Database Defaults

| Database | Default Isolation |
|--------|------------------|
| MySQL InnoDB | REPEATABLE READ |
| PostgreSQL | READ COMMITTED |
| Oracle | READ COMMITTED |
| SQL Server | READ COMMITTED (lock-based) |

---

## 3.3 Phantom Reads and MVCC

### Why MVCC Alone Is Not Enough

MVCC can:
- Judge visibility of **existing rows**

MVCC cannot:
- Lock **ranges**
- Prevent **new rows from being inserted**

Phantom reads occur when:
- The snapshot changes between statements (READ COMMITTED)

---

## 3.4 Next-Key Locks (InnoDB)

InnoDB uses **next-key locks** to prevent phantom reads during writes.

### Definition
> **Next-key lock = record lock + gap lock**

It locks:
- Existing rows
- The gaps between index records

---

### Example
```sql
UPDATE orders
SET status='X'
WHERE amount BETWEEN 100 AND 200;
```

InnoDB locks:
- Rows in the range
- Gaps where new rows could be inserted

This prevents:
- Concurrent inserts
- Phantom reads

---

## 4. Consistency — Business Rules Are Preserved

### What Consistency Means
A transaction moves the database:
> From one valid state to another valid state

---

### How Consistency Is Enforced

Consistency is enforced by:
- Constraints (PK, FK, UNIQUE, CHECK)
- Triggers
- Application logic
- Correct use of transactions

The database:
- Checks constraints **before commit**
- Rejects invalid states

---

### Important Note
> Consistency is **not automatic**
It depends on correct schema design and business logic.

---

## 5. Locks — Why Writes Always Lock

Even with MVCC:
- **Writes must lock**
- Write–write conflicts cannot be avoided

---

### Why Locks Are Required
Locks are needed to:
- Prevent lost updates
- Protect index structures
- Guarantee atomicity
- Maintain physical correctness

---

### Optimistic Locking

Application-level optimistic locking:
```sql
UPDATE account
SET balance=900, version=version+1
WHERE id=1 AND version=5;
```

- Detects conflicts
- Improves concurrency
- **Does not eliminate internal database locks**

---

## 6. Business Guidance

### When READ COMMITTED Is Enough
- CRUD systems
- Admin dashboards
- Search and listing pages
- High-throughput APIs

---

### When REPEATABLE READ Is Needed
- Financial calculations
- Inventory / quota checks
- Workflow state machines
- Multi-step read → compute → write logic

---

### Modern Best Practice
> **READ COMMITTED + optimistic locking**

This provides:
- High concurrency
- Explicit conflict detection
- Better scalability

---

## Final Takeaway

> **ACID is not magic. It is built from undo logs, redo logs, MVCC snapshots, and locks.  
Understanding these internals lets you choose the right isolation level for real business systems.**
