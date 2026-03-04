# MVCC (Multi-Version Concurrency Control)

## 1. What is MVCC

MVCC stands for **Multi-Version Concurrency Control**.\
It is a database concurrency control mechanism that allows **multiple
transactions to read and write the same table simultaneously without
blocking each other**.

Instead of locking rows for reads, the database keeps **multiple
versions of rows**.

Each transaction reads a **snapshot of the data** that was committed
before the transaction started.

This greatly improves **concurrency and performance**, especially for
systems with many reads.

Common databases using MVCC:

-   PostgreSQL
-   MySQL (InnoDB)
-   Oracle

------------------------------------------------------------------------

# 2. Why MVCC is Needed

Traditional locking systems cause blocking:

Example without MVCC:

Transaction A:

UPDATE account SET balance = balance - 100 WHERE id = 1;

Transaction B:

SELECT \* FROM account WHERE id = 1;

Transaction B must **wait** until Transaction A commits.

This causes:

-   slow queries
-   lock contention
-   poor scalability

MVCC solves this problem.

------------------------------------------------------------------------

# 3. Core Idea of MVCC

MVCC keeps **multiple versions of rows**.

Each row contains hidden metadata such as:

-   transaction id that created the row
-   transaction id that deleted the row

Example row structure (conceptual):

  id   balance   created_tx   deleted_tx
  ---- --------- ------------ ------------
  1    1000      100          NULL

When a transaction updates a row:

1.  The old row is **not overwritten**
2.  A **new row version** is created

Example:

Old version:

  id   balance   created_tx   deleted_tx
  ---- --------- ------------ ------------
  1    1000      100          200

New version:

  id   balance   created_tx   deleted_tx
  ---- --------- ------------ ------------
  1    900       200          NULL

Different transactions will see different versions depending on their
snapshot.

------------------------------------------------------------------------

# 4. Snapshot Read

Each transaction gets a **snapshot of committed transactions** at the
start.

Example timeline:

T1 start (snapshot = tx \<= 100)

T2 update row (tx = 101)

If T1 queries the row:

T1 will see the **old version**.

If T3 starts after T2 commits:

T3 will see the **new version**.

------------------------------------------------------------------------

# 5. MVCC vs Locks

Without MVCC:

SELECT must wait for UPDATE lock.

With MVCC:

-   SELECT reads old version
-   UPDATE writes new version

Result:

-   reads do not block writes
-   writes do not block reads

However:

**write-write conflicts still require locks.**

------------------------------------------------------------------------

# 6. Example in MySQL InnoDB

InnoDB implements MVCC using:

-   undo log
-   transaction id
-   read view

Row structure includes hidden columns:

-   DB_TRX_ID
-   DB_ROLL_PTR

Undo logs store previous row versions so older transactions can still
read them.

------------------------------------------------------------------------

# 7. MVCC and Isolation Levels

MVCC helps implement SQL isolation levels.

Common behavior:

  Isolation Level   Behavior
  ----------------- --------------------------------------------
  Read Committed    read latest committed version
  Repeatable Read   read snapshot created at transaction start
  Serializable      strictest level

MySQL default:

Repeatable Read

PostgreSQL default:

Read Committed

------------------------------------------------------------------------

# 8. Advantages of MVCC

1.  High concurrency
2.  Reads do not block writes
3.  Writes do not block reads
4.  Better performance for read-heavy systems

------------------------------------------------------------------------

# 9. Disadvantages of MVCC

1.  Old row versions must be stored
2.  Requires background cleanup (VACUUM in PostgreSQL)
3.  Higher storage overhead

------------------------------------------------------------------------

# 10. Simple Visualization

Before update:

Row version V1

Transaction A reads V1

Transaction B updates → create V2

Transaction A still reads V1

New transactions read V2

------------------------------------------------------------------------

# 11. Summary

MVCC is a mechanism that:

-   keeps **multiple row versions**
-   allows **non-blocking reads**
-   provides **transaction isolation**
-   improves **database concurrency and performance**

It is one of the key technologies used in modern relational databases.
