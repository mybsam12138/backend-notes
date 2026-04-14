# Redis Overview for Backend Engineers

## 1. What is Redis
Redis (Remote Dictionary Server) is an in-memory key-value database commonly used for caching, session storage, distributed locks, and message queues.

Characteristics:
- In-memory storage
- Extremely fast (microsecond latency)
- Rich data structures
- Persistence support
- High availability and clustering

---

# 2. Redis Data Structures

Redis supports multiple data structures beyond simple key-value.

## String
Most basic type.

Example:
SET user:1001 "sam"
GET user:1001

Use cases:
- cache
- counters
- distributed locks

---

## Hash
Used for objects.

Example:
HSET user:1001 name sam age 31
HGET user:1001 name
HGETALL user:1001

Equivalent to a map/dictionary.

---

## List
Ordered list.

Example:
LPUSH tasks task1
RPUSH tasks task2
LPOP tasks

Use cases:
- queue
- task processing

---

## Set
Unordered collection of unique values.

Example:
SADD users sam tom lucy
SMEMBERS users

Use cases:
- tags
- unique user tracking

---

## Sorted Set (ZSet)
Set ordered by score.

Example:
ZADD ranking 100 sam
ZADD ranking 200 tom
ZRANGE ranking 0 -1 WITHSCORES

Use cases:
- leaderboards
- ranking systems

---

# 3. Redis Command Grammar

General syntax:

COMMAND key [arguments]

Examples:

SET user:1001 sam
GET user:1001

HSET user:1001 name sam age 31
HGET user:1001 name

INCR page:view

SET lock:order123 1 NX EX 10

Explanation:

NX = set only if key does not exist  
EX = expire time in seconds

Used for distributed locks.

---

# 4. Why Redis Is Fast

## 1. In-memory storage
Redis stores data in RAM instead of disk.

Memory access ≈ nanoseconds  
Disk access ≈ milliseconds

---

## 2. Single-threaded model

Redis processes commands in a single thread.

Benefits:
- no thread switching
- no lock contention
- simpler architecture

---

## 3. Efficient data structures

Redis uses highly optimized structures such as:
- hash tables
- skip lists
- compressed lists

---

## 4. Non-blocking IO (event loop)

Redis uses an event-driven architecture similar to Node.js.

Many clients can connect simultaneously.

---

## 5. Simple protocol

Redis protocol (RESP) is lightweight and efficient.

---

# 5. Redis Persistence / Backup Mechanisms

Redis supports two persistence mechanisms.

---

## RDB (Snapshot)

RDB saves the entire dataset snapshot to disk.

Example file:
dump.rdb

Configuration example:

save 900 1
save 300 10
save 60 10000

Meaning:
- save if 1 change within 900 seconds
- save if 10 changes within 300 seconds
- save if 10000 changes within 60 seconds

Manual trigger:

BGSAVE

Advantages:
- fast recovery
- compact file

Disadvantages:
- may lose recent data

---

## AOF (Append Only File)

AOF logs every write command.

Example:

SET user:1001 sam
INCR page:view

Redis replays commands during recovery.

Configuration:

appendonly yes

Advantages:
- minimal data loss

Disadvantages:
- larger file
- slower recovery

---

# 6. Production Setup

Most production systems use:

RDB + AOF

Reasons:

RDB → fast restart  
AOF → better durability

---

# 7. Common Redis Use Cases

Caching
Session storage
Distributed locks
Rate limiting
Message queues
Real-time analytics

---

# 8. Key Design Best Practices

Use namespaces:

user:1001
order:5001
session:abc123

Avoid:
- extremely large values
- hot keys
- no expiration policies

---

# 9. Example System Architecture

Client
 ↓
Application Server
 ↓
Redis Cache
 ↓
Database

Redis reduces database load and improves response speed.
