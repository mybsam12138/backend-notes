# JDK Performance Analysis Tools (OpenJDK 21+)

## Introduction

In modern Java (JDK 11 / 17 / 21), JVM performance analysis is no longer centered around GUI tools.
Instead, the JVM exposes **command-driven, production-safe diagnostics**, with `jcmd` as the core entry point.

This document explains **how JDK tools fit together**, what problems each solves, and how to use them correctly in real systems.

---

## The Modern JVM Tooling Philosophy

> **Observe first, optimize second.**  
> **Prefer low-overhead tools.**  
> **Analyze offline whenever possible.**

Key changes since JDK 9+:
- VisualVM is no longer bundled with the JDK
- GUI tools are decoupled from the runtime
- `jcmd` becomes the **central control interface**
- JFR becomes the **primary profiling mechanism**

---

## Tool Overview

| Tool | Primary Role | Production Safe |
|----|----|----|
| jps | JVM process discovery | ✅ |
| jcmd | Unified JVM diagnostic command | ✅ |
| jstat | GC & memory statistics | ✅ |
| jstack | Thread dump | ⚠️ |
| jmap | Heap dump / deep memory analysis | ⚠️ |
| JFR | Continuous runtime profiling | ✅ |

---

## jps — Java Process Discovery

```bash
jps -l
```

Purpose:
- List running JVM processes
- Identify target PID for diagnostics

`jps` is usually the **starting point** of JVM analysis.

---

## jcmd — The Central Diagnostic Tool

`jcmd` is the **core replacement** for many legacy tools.

### Common Commands

```bash
jcmd <pid> VM.command_line
jcmd <pid> VM.flags
jcmd <pid> GC.heap_info
jcmd <pid> GC.class_histogram
jcmd <pid> Thread.print
```

### Why jcmd Is Important

- Works in Docker and Kubernetes
- Low overhead
- Supported long-term by OpenJDK
- Replaces most uses of `jmap -heap` and `jstack`

---

## jstat — GC & Memory Monitoring

```bash
jstat -gc <pid> 1000
```

Use cases:
- Observe Young / Old GC frequency
- Detect GC thrashing
- Monitor heap pressure trends

`jstat` is lightweight and safe for production use.

---

## jstack — Thread Dump Analysis

```bash
jstack <pid>
```

Use cases:
- Deadlock detection
- Thread contention
- Investigating CPU spikes

Multiple thread dumps over time reveal blocking patterns.

---

## jmap — Heap Dump Analysis

### Heap Dump

```bash
jmap -dump:live,format=b,file=heap.hprof <pid>
```

Use cases:
- Memory leak analysis
- Object retention analysis

Heap dumps should be analyzed offline using:
- Eclipse MAT
- VisualVM

⚠️ Heap dumps cause STW pauses and heavy I/O.

---

## Java Flight Recorder (JFR)

JFR is the **modern replacement for live profilers**.

### Start a Recording

```bash
jcmd <pid> JFR.start settings=profile duration=60s filename=app.jfr
```

### Stop Manually

```bash
jcmd <pid> JFR.stop filename=app.jfr
```

### Always-On Recording

```bash
-XX:StartFlightRecording=filename=app.jfr,settings=profile,maxsize=250M,maxage=1h
```

JFR records:
- CPU usage
- GC pauses
- Allocation rates
- Thread states
- Lock contention

Analyze `.jfr` files using **Java Mission Control (JMC)**.

---

## VisualVM (External Tool)

VisualVM is no longer bundled with the JDK.

Current role:
- Heap dump analysis
- Thread dump visualization
- Development-time inspection

VisualVM runs **outside the JVM** and analyzes offline artifacts.

---

## Recommended Diagnostic Workflow

1. Identify JVM process (`jps`)
2. Inspect runtime state (`jcmd`)
3. Observe GC trends (`jstat`, GC logs)
4. Capture heap or thread dumps if necessary
5. Use JFR for long-running profiling
6. Apply targeted tuning or code fixes

---

## Production Safety Guidelines

- Prefer `jcmd` and GC logs in production
- Avoid frequent heap dumps
- Capture diagnostics during low-traffic windows
- Store dumps and recordings securely

---

## Conclusion

Modern JVM diagnostics focus on **evidence-based analysis** using
`jcmd`, GC logs, and JFR.

Mastering these tools allows engineers to debug JVM performance issues
confidently in Docker, cloud, and production environments.

---

## What’s Next

Upcoming topics:
- ClassLoader architecture
- Metaspace behavior
- ClassLoader-related memory leaks
- Advanced JVM tuning strategies
