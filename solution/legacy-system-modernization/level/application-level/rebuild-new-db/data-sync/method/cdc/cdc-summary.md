# Change Data Capture (CDC) Summary

## 1. What is CDC?

CDC stands for **Change Data Capture**.

It is a technique used to capture data changes from a database, such as:

- INSERT
- UPDATE
- DELETE

Then these changes are delivered to other systems, databases, message queues, or data platforms.

In simple words:

> CDC listens to database changes and sends those changes to downstream systems.

---

## 2. Why CDC is Used

CDC is commonly used when systems need to synchronize data without directly modifying the original application logic.

Typical goals include:

- Keeping old and new systems in sync
- Replicating data to another database
- Sending changes to a message queue
- Building real-time reporting or data warehouse pipelines
- Supporting legacy system modernization

---

## 3. Common Scenarios

### 3.1 Legacy System Modernization

When replacing an old system with a new system, the legacy database may still receive updates.

CDC can capture changes from the legacy database and synchronize them to the new database.

Example:

```text
Old System → Old DB → CDC → MQ → New System / New DB
```

---

### 3.2 Data Warehouse / Reporting

Business data from OLTP databases can be captured and sent to a data warehouse.

Example:

```text
Order DB → CDC → Kafka → Data Warehouse
```

---

### 3.3 Microservices Data Synchronization

One service owns a database, but other services need read-only copies of some data.

Example:

```text
Customer Service DB → CDC → MQ → Policy Service Read Model
```

---

### 3.4 Cache / Search Index Update

CDC can update Redis, Elasticsearch, or other read models when database records change.

Example:

```text
Product DB → CDC → Elasticsearch
```

---

## 4. How CDC Works

There are several common CDC approaches.

### 4.1 Log-based CDC

This is the most common and recommended approach.

It reads database transaction logs, such as:

- MySQL binlog
- PostgreSQL WAL
- Oracle redo log
- SQL Server transaction log

Advantages:

- Low impact on application code
- Near real-time
- Does not require changing business logic

Example:

```text
Database Transaction Log → CDC Tool → Kafka → Consumer
```

---

### 4.2 Trigger-based CDC

Database triggers are added to capture changes and write them to a change table.

Advantages:

- Easier to understand
- Works when log access is not available

Disadvantages:

- Adds overhead to database writes
- Requires modifying database schema
- Harder to maintain

---

### 4.3 Timestamp-based CDC

The system periodically queries records based on `updated_at`.

Example:

```sql
SELECT * FROM customer WHERE updated_at > last_sync_time;
```

Advantages:

- Simple
- Easy to implement

Disadvantages:

- May miss deletes
- Depends on correct timestamp maintenance
- Not true real-time

---

## 5. Common CDC Tools

### 5.1 Debezium

A popular open-source CDC platform.

Commonly used with:

- MySQL
- PostgreSQL
- SQL Server
- Oracle
- Kafka

Typical flow:

```text
Database → Debezium → Kafka → Consumer
```

---

### 5.2 Canal

A CDC tool commonly used in MySQL ecosystems.

Typical flow:

```text
MySQL Binlog → Canal → Consumer
```

---

### 5.3 Native Database Replication

Some databases provide built-in replication or logical decoding.

Examples:

- PostgreSQL logical replication
- MySQL replication
- Oracle GoldenGate

---

## 6. CDC vs Batch Sync

| Aspect | CDC | Batch Sync |
|---|---|---|
| Real-time | Near real-time | Delayed |
| Data Volume | Incremental changes | Often large chunks |
| System Impact | Usually lower | Can be higher during job execution |
| Complexity | Medium | Low |
| Suitable For | Continuous sync | Periodic sync |

---

## 7. CDC vs API-based Sync

| Aspect | CDC | API-based Sync |
|---|---|---|
| Source | Database changes | Application calls |
| Coupling | Lower | Higher |
| Real-time | Near real-time | Depends on API design |
| Business Meaning | Raw data changes | Business events |
| Best Use | Data replication | Business integration |

Important note:

CDC captures **data changes**, not necessarily **business events**.

For example:

- CDC event: `customer table updated`
- Business event: `customer address verified`

They are not always the same.

---

## 8. Key Challenges of CDC

### 8.1 Schema Changes

If table structure changes, CDC pipelines may break.

Examples:

- Column renamed
- Column removed
- Data type changed

Best practice:

- Manage schema evolution carefully
- Version downstream consumers

---

### 8.2 Ordering

Changes must be processed in the correct order.

Example:

```text
INSERT customer
UPDATE customer
DELETE customer
```

If processed incorrectly, downstream data may become inconsistent.

---

### 8.3 Idempotency

CDC consumers should be idempotent.

This means processing the same event multiple times should not corrupt data.

Example:

```text
Same update event received twice → final result should still be correct
```

---

### 8.4 Initial Snapshot + Incremental Sync

CDC usually has two phases:

1. Initial snapshot: copy existing data
2. Incremental sync: capture new changes

Example:

```text
Initial full load → Start CDC from binlog position
```

---

### 8.5 Delete Handling

Deletes must be handled carefully.

Options:

- Physical delete
- Soft delete
- Tombstone event

---

### 8.6 Data Transformation

Legacy database schema may be different from the new system schema.

CDC may require a transformation layer.

Example:

```text
Old customer table → Transform → New customer model
```

---

## 9. Best Practices

- Define the System of Record (SoR)
- Avoid dual-write whenever possible
- Use CDC for data synchronization, not for complex business logic
- Design idempotent consumers
- Monitor sync lag
- Add retry and dead-letter queue
- Track source position or offset
- Handle schema changes carefully
- Separate raw CDC events from business events when needed

---

## 10. Typical Architecture in Legacy Modernization

```text
Legacy System
      |
      v
Legacy Database
      |
      v
CDC Tool
      |
      v
Message Queue
      |
      v
Transformation / Consumer Service
      |
      v
New Database
```

Explanation:

- Legacy system continues writing to legacy database
- CDC captures changes from legacy database logs
- MQ decouples producer and consumers
- Consumer transforms data if schemas are different
- New database receives synchronized data

---

## 11. When CDC is a Good Choice

CDC is suitable when:

- You need near real-time synchronization
- You do not want to change legacy application code
- The legacy database is still receiving writes
- You need incremental data replication
- You want to support gradual system migration

---

## 12. When CDC May Not Be Suitable

CDC may not be ideal when:

- Business logic is required before data sync
- Database logs are not accessible
- The legacy schema is too messy without transformation
- Data quality is poor
- Strong consistency is required across systems

---

## 13. Interview Summary

A strong interview answer:

> CDC is a data synchronization technique that captures database changes from transaction logs and sends them to downstream systems. In legacy system modernization, CDC is useful because the old system can continue writing to the old database while changes are synchronized to the new system in near real-time. It avoids direct dual-write and reduces the need to modify legacy application code. However, CDC requires careful handling of schema changes, ordering, idempotency, initial snapshots, and data transformation.

---

## 14. Simple Summary

CDC is best understood as:

> Database change log → capture → stream → transform → synchronize

It is one of the most common solutions for data synchronization during legacy system modernization.
