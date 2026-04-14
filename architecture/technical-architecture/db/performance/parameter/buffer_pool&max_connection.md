# MySQL Performance Configuration (Core Parameters)

## 1. innodb_buffer_pool_size

### What is it?
The memory area used by InnoDB to cache:
- Data pages
- Index pages
- Dirty pages

### Why it is important?
Memory access is much faster than disk I/O.

Memory >> Disk (hundreds of times faster)

A larger buffer pool:
- Reduces disk I/O
- Improves query performance
- Increases cache hit rate

---

### How to configure?

#### Dedicated DB server:
innodb_buffer_pool_size = 60% ~ 80% of total RAM

#### Mixed deployment:
Reserve memory for:
- Application (Java / Spring Boot)
- Redis
- OS

Example (16GB machine):

| Component | Memory |
|----------|--------|
| Java App | 6GB |
| Redis | 2GB |
| OS | 1GB |
| Remaining | 7GB |

innodb_buffer_pool_size ≈ 4GB ~ 5GB

---

### Key concept

InnoDB loads data in pages, not rows.

- Page size: 16KB
- One page contains multiple rows

Example:

SELECT * FROM user WHERE id = 100;

Steps:
1. Load index page into memory
2. Load data page (contains multiple rows)

---

### Interview summary

innodb_buffer_pool_size is the most critical parameter for InnoDB performance.

---

## 2. max_connections

### What is it?

Maximum number of concurrent connections allowed by MySQL.

---

### Why it matters?

Each connection consumes:
- Memory
- Threads

---

### Problems

Too small:
ERROR: Too many connections

Too large:
- Memory exhaustion
- Context switching overhead

---

### Best practice

1. Set a reasonable limit (200–500)
2. Use connection pool (HikariCP)

---

## 3. query_cache (Deprecated)

### What is it?

Caches query results.

Same SQL → return cached result

---

### Why removed?

Removed in MySQL 8.0 due to poor performance.

---

### Problems

1. Global lock
2. Frequent invalidation
3. Low hit rate

---

### Alternative

Use:
- Redis
- Application caching

---

### Interview summary

query_cache was removed due to global locking and poor scalability.

---

## Final Summary

| Parameter | Purpose | Importance | Risk |
|----------|--------|-----------|------|
| innodb_buffer_pool_size | Cache data & index | ⭐⭐⭐⭐⭐ | Too large → OOM |
| max_connections | Max connections | ⭐⭐⭐⭐ | Too large → slow |
| query_cache | Query cache | ❌ Deprecated | Lock contention |

---

## Key Takeaways

1. Buffer pool is most important
2. Control connections
3. Use external cache instead of query_cache
