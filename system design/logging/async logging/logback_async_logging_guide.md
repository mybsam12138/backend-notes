# Enabling Async Logging in Logback (Production Guide)

This document explains **how to enable async logging in Logback** and, more importantly, **why a single background thread is enough** from a systems and I/O perspective.

---

## 1. Why Async Logging Is Needed

Synchronous logging means:

- Application threads perform I/O
- Disk / stdout latency directly affects request latency
- Under load, logging can become a bottleneck

**Async logging decouples application execution from log I/O.**

---

## 2. Core Idea of AsyncAppender

Async logging in Logback is implemented via `AsyncAppender`.

Its architecture is intentionally simple:

```
Application threads
    ↓ enqueue (fast, in-memory)
BlockingQueue (bounded)
    ↓
ONE background logging thread
    ↓
Real appender (console / file)
```

Key properties:

- Producers: many application threads
- Consumer: **exactly one logging thread**
- Logging I/O never runs on request threads

---

## 3. Basic AsyncAppender Configuration

Below is a **production-safe async logging configuration**.

```
<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger - %msg%n</pattern>
    </encoder>
</appender>

<appender name="ASYNC_CONSOLE" class="ch.qos.logback.classic.AsyncAppender">
    <queueSize>2048</queueSize>
    <discardingThreshold>20</discardingThreshold>
    <neverBlock>true</neverBlock>
    <appender-ref ref="CONSOLE"/>
</appender>

<root level="INFO">
    <appender-ref ref="ASYNC_CONSOLE"/>
</root>
```

---

## 4. Meaning of Key Async Parameters

### 4.1 queueSize

- Maximum number of log events buffered in memory
- Absorbs short log bursts
- Does **not** increase sustained throughput

Rule:

> Queue size protects against spikes, not overload.

---

### 4.2 discardingThreshold

- Controls when low-priority logs may be dropped
- Value represents remaining queue percentage

Example:

- `20` → discard DEBUG / TRACE when queue is 80% full
- `0` → disable priority-based dropping

---

### 4.3 neverBlock

- `true` (recommended): application threads never wait
- `false`: application threads block when queue is full

Production principle:

> Logging must never block the business flow.

---

## 5. Why Only ONE Logging Thread Is Enough

### 5.1 Logging Is I/O-Bound, Not CPU-Bound

Logging pipeline:

```
format log (CPU, cheap)
→ write to stdout / file
→ OS buffer
→ disk / pipe  ← bottleneck
```

- CPU cost is negligible
- I/O throughput is fixed

Adding threads **cannot make disk or stdout faster**.

---

### 5.2 File and Console Writes Are Serialized

- Log files use append semantics
- stdout / stderr are single streams
- OS serializes writes internally

Result:

> Multiple threads writing still behave like one.

---

### 5.3 Multiple Writer Threads Cause Problems

If async logging used multiple writers:

- Log order would break
- Lock contention would increase
- Context switches would rise
- Throughput would not improve

Single-writer design avoids all of these issues.

---

### 5.4 Atomic Writes Prevent Log Corruption

Logging frameworks:

- Format a full log line first
- Write it using a single `write()` call

Guarantee:

- Log lines may reorder
- Log lines do **not** interleave at character level

---

## 6. Console vs File: Is Console “Memory Only”?

No.

Console logging writes to:

- `System.out` / `System.err`
- OS pipes
- Container runtime (Docker / Kubernetes)
- Eventually disk

Console logging is **still I/O**, just often faster than files.

---

## 7. How Much Traffic Can Async Logging Handle?

Async logging capacity depends on **log lines per second**, not QPS.

Typical single-thread console throughput:

- Local terminal: ~10k–30k lines/sec
- Docker stdout: ~3k–10k lines/sec
- Kubernetes: ~1k–5k lines/sec

Formula:

```
log_lines_per_sec = QPS × logs_per_request
```

---

## 8. Production Recommendations

### Recommended Defaults

- AsyncAppender enabled
- Bounded queue (1024–4096)
- `neverBlock=true`
- `discardingThreshold>0`

### Avoid

- Unbounded queues
- Blocking application threads on logging
- Verbose logging in production

---

## 9. Final Takeaway

> Async logging is a protective mechanism: it preserves application availability by isolating slow I/O behind a bounded queue and a single, predictable writer thread.

Logging correctness and system stability always outweigh raw throughput.

---

*End of document*