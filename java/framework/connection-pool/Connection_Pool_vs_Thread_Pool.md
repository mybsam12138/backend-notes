# Connection Pool vs Thread Pool

> Summary guide based on Hibernate & Spring Boot concepts.

---

## 1. What is a Connection Pool?

A **Connection Pool** is a cache of pre-created database connections stored in **heap memory**, shared across the entire application, so threads can **borrow and return** connections instead of creating new ones every time.

### Why It Exists

Opening a DB connection from scratch is **very expensive**:

```
Without Connection Pool — every request:
  TCP handshake with DB server     → ~100ms
  Authentication / login           → ~50ms
  Negotiate protocol               → ~20ms
  Actual query                     → ~5ms
  Close connection                 → ~20ms

Total: 195ms overhead, only 5ms real work! 😱
```

With Connection Pool:
```
App starts → pre-create connections, keep them alive

Request 1 → borrow connection → run query → return connection ✅
Request 2 → borrow connection → run query → return connection ✅
Request 3 → borrow connection → run query → return connection ✅
            ↑
     no handshake needed, reused directly!
```

---

## 2. How Connection Pool Works

```
App starts
   ↓
HikariCP creates pool (e.g. 10 connections) → stored in HEAP memory
   ↓
┌──────────────────────────────┐
│   Connection Pool (Heap)     │
│   ├── Connection #1  idle    │
│   ├── Connection #2  idle    │
│   ├── Connection #3  in use  │
│   └── Connection #4  idle    │
└──────────────────────────────┘
          ↑            ↑
     Thread #1      Thread #2
     borrows #1     borrows #2
     uses it        uses it
     returns it     returns it
```

### Lifecycle of a Connection

```
Pool created at app startup
   ↓
Thread borrows connection
   ↓
Thread runs SQL query
   ↓
Thread returns connection to pool  ← NOT destroyed, reused!
   ↓
Connection stays alive, waits for next borrow
   ↓
App shuts down → connections finally closed
```

---

## 3. Session vs DB Connection

These are often confused — they are completely different things:

```
Session      → Hibernate object in Java memory
               created per request, destroyed after
               manages L1 cache, dirty checking, entity state

DB Connection → physical TCP pipe to the database
               lives in connection pool
               borrowed and returned, never destroyed per request
```

### How They Work Together

```
HTTP Request arrives
   ↓
Tomcat Thread picks it up
   ↓
Session CREATED (in heap, referenced by this thread only)
   ↓
Session borrows Connection from pool
   ↓
SQL executed through Connection
   ↓
Session returns Connection to pool ✅
   ↓
Session DESTROYED ❌
   ↓
Thread returns to Tomcat pool ✅
```
```
|-- | Session | DB Connection |
|--|---------|---------------|
| Lives in | Heap (thread private reference) | Heap (shared pool) |
| Created per request? | ✅ Yes, cheap | ❌ No, reused from pool |
| Destroyed after request? | ✅ Yes | ❌ No, returns to pool |
| Managed by | Hibernate | HikariCP / connection pool |
| Purpose | DB conversation, caching | Physical pipe to DB |
```
---

## 4. Where Connection Pool Lives in Memory

```
┌─────────────────────────────────────────────┐
│              HEAP MEMORY (shared)            │
│                                              │
│  ├── Connection Pool (HikariCP)              │
│  │     ├── Connection #1                     │
│  │     ├── Connection #2                     │
│  │     └── Connection #3                     │
│                                              │
│  ├── SessionFactory                          │
│  ├── L2 Cache                                │
│  └── Spring Beans                            │
│                                              │
├──────────────────────────────────────────────┤
│           STACK MEMORY (per thread)          │
│                                              │
│  Thread #1 Stack                             │
│  └── local variables, method calls           │
│                                              │
│  Thread #2 Stack                             │
│  └── local variables, method calls           │
└──────────────────────────────────────────────┘
```

**Connection Pool lives in Heap** — shared by all threads, owned by nobody specifically.

---

## 5. What is a Thread Pool?

A **Thread Pool** is a set of pre-created worker threads kept alive to handle incoming requests, so the app doesn't need to create and destroy threads for every request.

### Why It Exists

Creating a thread is expensive (CPU + memory allocation):

```
Without Thread Pool:
  Request 1 → create Thread → handle → destroy Thread
  Request 2 → create Thread → handle → destroy Thread
  Request 3 → create Thread → handle → destroy Thread
  ↑ very wasteful!

With Thread Pool:
  App starts → create 200 Threads, keep alive

  Request 1 → borrow Thread #1 → handle → return Thread #1 ✅
  Request 2 → borrow Thread #2 → handle → return Thread #2 ✅
  Request 3 → borrow Thread #1 → handle → return Thread #1 ✅
              ↑ same thread reused!
```

### In Spring Boot — Tomcat Manages This

```
Tomcat Thread Pool (default 200 threads)
├── Thread #1 → picks up Request 1
├── Thread #2 → picks up Request 2
├── Thread #3 → picks up Request 3
└── Thread #4 → idle, waiting
```

You don't manage Tomcat's thread pool manually — it's automatic.

---

## 6. Connection Pool vs Thread Pool — Full Comparison
```
| | Connection Pool | Thread Pool |
|--|----------------|-------------|
| **What it pools** | DB Connections | Threads (workers) |
| **Purpose** | Avoid expensive DB connection setup | Avoid expensive thread creation |
| **Lives in** | Heap memory (shared) | Managed by JVM/OS |
| **Managed by** | HikariCP, C3P0, DBCP | Tomcat, `@Async`, Kafka |
| **Borrowed by** | Threads | Requests |
| **Returned after** | Query completes | Request completes |
| **Count (typical)** | 10–20 connections | 200 threads (Tomcat default) |
| **If exhausted** | Request waits for free connection | Request queued or rejected |
| **Configured in** | `application.yml` datasource | `application.yml` server.tomcat |
```
---

## 7. How They Work Together

```
┌─────────────────────────────────────────────────┐
│               Spring Boot App                    │
│                                                  │
│  Tomcat Thread Pool (stack memory per thread)    │
│  ├── Thread #1 ──┐                               │
│  ├── Thread #2 ──┼──→ all borrow from ──┐        │
│  └── Thread #3 ──┘                      │        │
│                                         ↓        │
│  HikariCP Connection Pool (heap memory)          │
│  ├── Connection #1 ←── Thread #1 borrows         │
│  ├── Connection #2 ←── Thread #2 borrows         │
│  └── Connection #3 ←── Thread #3 borrows         │
│              │                                   │
└──────────────┼───────────────────────────────────┘
               ↓
          Database Server
```

### Step by Step

```
1. Request arrives
2. Tomcat assigns a Thread from Thread Pool
3. Thread creates a Session (Hibernate)
4. Session borrows a Connection from Connection Pool
5. SQL query runs through Connection
6. Result returned
7. Session destroyed, Connection returned to pool
8. Thread returned to Tomcat pool
```

---

## 8. Taxi Stand Analogy 🚕

```
Thread Pool   = DRIVERS (workers, do the actual work)
Connection Pool = TAXIS  (tools the drivers use)

Taxi Stand (Connection Pool)
├── Taxi #1 → available
├── Taxi #2 → available
└── Taxi #3 → available

Driver #1 (Thread) → picks up Taxi #1 → completes trip → returns Taxi #1
Driver #2 (Thread) → picks up Taxi #2 → completes trip → returns Taxi #2

Drivers are reused ✅
Taxis are reused   ✅
Neither destroyed after each trip
```

---

## 9. Spring Boot Configuration

```yaml
# application.yml

# Connection Pool (HikariCP)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: admin
    password: secret
    hikari:
      maximum-pool-size: 10       # max DB connections in pool
      minimum-idle: 5             # min idle connections kept alive
      connection-timeout: 30000   # wait 30s before giving up
      idle-timeout: 600000        # close idle connection after 10min

# Thread Pool (Tomcat)
server:
  tomcat:
    threads:
      max: 200        # max threads handling requests
      min-spare: 10   # min threads kept alive
```

---

## 10. Quick Reference Cheat Sheet

```
Connection Pool:
  → pools DB connections (physical pipes to DB)
  → lives in HEAP (shared across all threads)
  → managed by HikariCP in Spring Boot
  → borrowed per query, returned after
  → typical size: 10-20 connections

Thread Pool:
  → pools worker threads (execution units)
  → managed by Tomcat / JVM
  → borrowed per request, returned after
  → typical size: 200 threads (Tomcat default)

Memory:
  HEAP   → shared memory → Connection Pool, SessionFactory, L2 Cache, Spring Beans
  STACK  → per-thread    → local variables, method execution, Session reference

Key Rule:
  Number of Threads >> Number of Connections
  (200 threads sharing 10 connections — threads take turns borrowing)
```

---

*Prepared for Java Developer interview preparation — OTC Derivatives / Financial Systems role*
