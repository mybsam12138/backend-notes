# A Common Production JVM Configuration for Web Applications

## Introduction

For most **Java web applications** (Spring Boot, REST APIs, microservices), JVM tuning should start from a **safe, observable, and conservative baseline**.

This document provides **one commonly used JVM parameter set** suitable for **production web systems**, including:
- GC selection
- Memory sizing
- GC logging
- Fast failure on OOM
- Container awareness
- Diagnostic options

This is **not an extreme tuning**, but a **battle-tested baseline** used widely in real production environments.

---

## Recommended JVM Parameters (Baseline)

```bash
# ================================
# Memory configuration
# ================================
-Xms4g
-Xmx4g

# ================================
# Garbage Collector
# ================================
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200

# ================================
# Metaspace protection
# ================================
-XX:MaxMetaspaceSize=512m

# ================================
# Fast failure & safety
# ================================
-XX:+ExitOnOutOfMemoryError
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/logs/heapdump.hprof

# ================================
# GC logging (Java 9+)
# ================================
-Xlog:gc*,gc+heap=info,gc+age=trace:file=/logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20M

# ================================
# Container awareness
# ================================
-XX:+UseContainerSupport

# ================================
# Misc stability options
# ================================
-XX:+AlwaysPreTouch
-XX:+DisableExplicitGC
```

---

## Why These Parameters Are Commonly Used

### 1. Heap Size (`-Xms` / `-Xmx`)

```bash
-Xms4g
-Xmx4g
```

- Prevents heap resizing
- Avoids runtime memory expansion costs
- Makes memory usage predictable

In containers, this must fit within memory limits.

---

### 2. G1 Garbage Collector

```bash
-XX:+UseG1GC
```

G1 is chosen because:
- It balances throughput and latency
- It avoids long Full GC pauses
- It is the default and most stable option for Java 11+

For most web systems, **G1 is the right first choice**.

---

### 3. Pause Time Target

```bash
-XX:MaxGCPauseMillis=200
```

- Guides G1 region selection
- Helps control tail latency
- Should not be treated as a strict SLA

Avoid setting too small values without profiling.

---

### 4. Metaspace Limit

```bash
-XX:MaxMetaspaceSize=512m
```

Purpose:
- Prevents unbounded class metadata growth
- Helps expose ClassLoader leaks early

This is a **diagnostic safety net**, not a performance optimization.

---

### 5. Exit on OutOfMemoryError (Critical)

```bash
-XX:+ExitOnOutOfMemoryError
```

Why this matters:
- JVM may enter an unstable state after OOM
- Continuing execution can cause data corruption
- Allows orchestrators (K8s, systemd) to restart cleanly

This option is **strongly recommended** for production.

---

### 6. Heap Dump on OOM

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/logs/heapdump.hprof
```

Benefits:
- Enables root cause analysis
- Critical for memory leak debugging
- Essential for post-mortem analysis

Ensure sufficient disk space is available.

---

### 7. GC Logging (Must-Have)

```bash
-Xlog:gc*
```

Enhanced example:
```bash
-Xlog:gc*,gc+heap=info,gc+age=trace:file=/logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20M
```

GC logs allow you to:
- Measure pause times
- Observe heap behavior
- Detect Full GC and promotion issues

Without GC logs, JVM tuning is guesswork.

---

### 8. Container Awareness

```bash
-XX:+UseContainerSupport
```

Ensures:
- Correct CPU core detection
- Heap respects container memory limits

Enabled by default in modern JVMs, but safe to specify explicitly.

---

### 9. Always Pre-Touch

```bash
-XX:+AlwaysPreTouch
```

Benefits:
- Reduces page faults during runtime
- Improves latency stability
- Slightly increases startup time

Useful for latency-sensitive web services.

Maybe also not good, because it forces worst-case memory usage upfront

---

### 10. Disable Explicit GC

```bash
-XX:+DisableExplicitGC
```

Prevents:
- Accidental `System.gc()` calls
- Framework-triggered Full GC

Recommended unless explicitly required.

---

## When You Should NOT Use This Baseline

This configuration may not be suitable for:
- Very small applications
- Batch jobs (throughput-oriented)
- Ultra-low latency systems (ZGC may be better)
- Applications with extreme memory constraints

Always validate with **load testing**.

---

## Final Advice

> Start simple.  
> Observe first.  
> Tune only when evidence demands it.

This JVM configuration provides:
- Safety
- Observability
- Predictable behavior

It is a **strong default starting point** for production web systems.

---

## Copy-Friendly Version

```bash
-Xms4g -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:MaxMetaspaceSize=512m -XX:+ExitOnOutOfMemoryError -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof -Xlog:gc*,gc+heap=info,gc+age=trace:file=/logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20M -XX:+UseContainerSupport -XX:+AlwaysPreTouch -XX:+DisableExplicitGC
```
