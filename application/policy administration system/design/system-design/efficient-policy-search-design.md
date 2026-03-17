# Efficient Policy Search Design (Relational Database, 10+ Filters)

## Goal

Improve the performance of policy search pages that allow **10+ filter conditions**, such as:

- policy number
- client name
- status
- product
- agent
- branch
- policy type
- effective date
- expiry date
- premium range

The system must support:

- large datasets (millions of policies)
- fast response time
- flexible filtering
- high concurrent searches

---

# Core Strategy

Efficient policy search should combine multiple techniques:

1. Query pattern–based indexing
2. Composite indexes
3. Covering indexes
4. Search table (denormalized index table)
5. Pagination
6. Query restrictions
7. Read replicas
8. Query logging and optimization

---

# 1 Query Pattern Analysis

Indexes should be designed based on **actual search patterns**, not just column count.

Typical search patterns:

Pattern 1

policy_no

Pattern 2

status + effective_date

Pattern 3

client_id

Pattern 4

agent_id + status

Pattern 5

product_id + status

Indexes should support these common patterns.

---

# 2 Single Column Indexes

For highly selective fields.

Examples:

```
index(policy_no)
index(client_id)
index(agent_id)
```

These queries return very few rows and are extremely fast.

---

# 3 Composite Indexes

Composite indexes are essential for multi-condition filtering.

Example query:

status = 'ACTIVE'  
product_id = 100  
effective_date >= '2025-01-01'

Recommended index:

```
(status, product_id, effective_date)
```

Rule:

Equality conditions first  
Range conditions last

---

# 4 Covering Index

A covering index contains all fields needed for the query.

Example query:

```
SELECT policy_no, client_name, status
FROM policy
WHERE status = 'ACTIVE'
AND product_id = 100
```

Index:

```
(status, product_id, policy_no, client_name)
```

The database can answer the query **without accessing the table**, improving speed.

---

# 5 Denormalized Search Table

Large systems often create a dedicated search table.

Example:

```
policy_search
```

Columns:

```
policy_id
policy_no
client_name
status
product_id
agent_id
branch
effective_date
expiry_date
premium
```

Advantages:

- avoids heavy joins
- optimized for search
- smaller query complexity

Indexes are designed specifically for search.

Example indexes:

```
index(policy_no)
index(client_name)
index(status, effective_date)
index(agent_id, status)
index(product_id, status)
```

---

# 6 Pagination

Never return large result sets.

Example:

```
SELECT policy_no, client_name, status
FROM policy_search
WHERE status = 'ACTIVE'
LIMIT 20 OFFSET 0
```

Frontend parameters:

```
page
pageSize
```

This limits database workload.

---

# 7 Query Filter Restrictions

Prevent full-table scans.

Example rule:

Require at least one of:

```
policy_no
client_name
date_range
client_id
```

This avoids queries like:

```
SELECT * FROM policy
```

---

# 8 Read Replica Database

Separate read and write workloads.

Architecture:

Primary database  
↓  
Replication  
↓  
Read replica

Search queries run on the read replica.

---

# 9 Query Optimization

Best practices:

Avoid SELECT *
Return only required fields

Example:

```
SELECT policy_no, client_name, status
```

Instead of:

```
SELECT *
```

---

# 10 Slow Query Monitoring

Track slow queries to improve indexing.

Log information:

```
query
execution_time
filters
user_id
```

Queries with long execution times can be optimized later.

---

# Example Policy Index Design

Typical indexes for a policy search system:

```
index(policy_no)

index(client_id)

index(status, effective_date)

index(agent_id, status)

index(product_id, status)
```

These indexes support most search scenarios.

---

# Summary

Efficient policy search with many filters requires a combination of:

- query pattern–based indexing
- composite indexes
- covering indexes
- denormalized search tables
- pagination
- query restrictions
- read replicas
- slow query monitoring

This design enables **fast and scalable policy search even with millions of records and complex filter conditions**.