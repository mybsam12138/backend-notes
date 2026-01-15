# JVM Parameters: Practical Usage and Common Pitfalls

## Introduction

After understanding JVM memory layout and garbage collection behavior, the next step in JVM tuning is learning how to **configure the JVM using parameters**.

JVM parameters (also called JVM options or flags) control:
- Memory sizing
- Garbage collection behavior
- Diagnostics and logging
- Runtime safety mechanisms

This article focuses on **practical JVM parameter usage**, explains what each category of options affects, and highlights common mistakes seen in production systems.

---

## Categories of JVM Parameters

JVM parameters can be grouped into four main categories:

1. Memory-related options
2. Garbage collection options
3. Diagnostic and logging options
4. Safety and operational options

Understanding the purpose of each category prevents over-tuning and misconfiguration.

---

## Memory-Related Parameters

### Heap Size

```bash
-Xms<size>
-Xmx<size>
```

- `-Xms`: Initial heap size
- `-Xmx`: Maximum heap size

Best practices:
- Set `-Xms` and `-Xmx` to the same value in production
- Avoid dynamic heap resizing
- Size heap based on real workload, not guesswork
- Start with default or conservative heap settings, observe GC logs and memory usage under realistic load, then fix -Xms and -Xmx.
- Leave sufficient headroom for native memory (metaspace, thread stacks, direct buffers, JVM internals).
- As a general guideline, allocate no more than 50–70% of total available memory to the Java heap.
- In containerized environments, use an even lower ratio (around 50–60%) due to stricter memory limits.

Example:
```bash
-Xms4g -Xmx4g
```

---

### Young Generation Size

```bash
-XX:NewRatio=<ratio>
-XX:SurvivorRatio=<ratio>
```

- `NewRatio`: Ratio between old and young generation
- `SurvivorRatio`: Ratio between Eden and Survivor spaces

These options are rarely needed with modern collectors like G1.

---

### Metaspace

```bash
-XX:MaxMetaspaceSize=<size>
```

Controls the maximum size of Metaspace.

Use cases:
- Prevent unbounded class metadata growth
- Detect ClassLoader leaks early

---

## Garbage Collection Parameters

### Selecting a GC Algorithm

```bash
-XX:+UseParallelGC
-XX:+UseG1GC
-XX:+UseZGC
```

Guidelines:
- Parallel GC → throughput-oriented workloads
- G1 GC → balanced, general-purpose workloads
- ZGC → low-latency, large heap systems

Always choose based on **latency and throughput requirements**.

---

### Pause Time Goals

```bash
-XX:MaxGCPauseMillis=<time>
```

This is a **soft goal**, not a guarantee.

Effects:
- JVM may sacrifice throughput to meet pause targets

- Too aggressive values may increase GC overhead

  | Value   | Meaning                             |
  | ------- | ----------------------------------- |
  | 100     | Very latency-sensitive (aggressive) |
  | **200** | Balanced default (most common)      |
  | 300–500 | Throughput-oriented                 |
  | 1000    | Batch / offline jobs                |

---

### GC Time Ratio

```bash
-XX:GCTimeRatio=<ratio>
```

Controls GC overhead relative to application time.

Example:
```bash
-XX:GCTimeRatio=9
```
Means approximately 90% application time and 10% GC time.

---

## GC Logging and Diagnostics

### GC Logs (Java 9+)

```bash
-Xlog:gc*
```

Provides:
- GC pause duration
- Heap occupancy changes
- Collector behavior

GC logs are essential for **evidence-based tuning**.

```log
GC log Example:

[0.345s][info][gc,start] GC(0) Pause Young (Normal) (G1 Evacuation Pause)
[0.345s][info][gc,task ] GC(0) Using 8 workers of 8 for evacuation
[0.352s][info][gc,heap ] GC(0) Eden regions: 20->0(18)
[0.352s][info][gc,heap ] GC(0) Survivor regions: 2->4(4)
[0.352s][info][gc,heap ] GC(0) Old regions: 10->10
[0.352s][info][gc,heap ] GC(0) Humongous regions: 1->1
[0.352s][info][gc,metaspace] GC(0) Metaspace: 85M->85M(1024M)
[0.353s][info][gc] GC(0) Pause Young (Normal) (G1 Evacuation Pause) 
512M->380M(2048M) 7.8ms
```

7.8ms means the STW pause time.

---

### Heap Dump on OOM

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/path/to/dump
```

Always enable heap dumps in production.

They allow:
- Root cause analysis
- Memory leak detection
- Object retention inspection

---



## Operational and Safety Parameters

### Fast Failure on OOM

```bash
-XX:+ExitOnOutOfMemoryError
```

Forces JVM to exit immediately on OOM.

Useful in:
- Containerized environments
- Systems with external restart mechanisms
- Without this option, an `OutOfMemoryError` only terminates the thread that encounters it.
  The JVM process may continue running in a corrupted or unrecoverable state, causing the service to appear alive but unable to handle requests.
  Enabling this option enforces a fail-fast strategy, allowing external systems (e.g. Kubernetes, systemd) to restart the JVM cleanly.

---

### Container Awareness

```bash
-XX:+UseContainerSupport
```

Enabled by default in modern JVMs.

Ensures:
- Heap respects container memory limits
- Correct CPU core detection

---

## Common JVM Parameter Pitfalls

### 1. Blindly Copying JVM Flags

Copying flags without understanding:
- Increases system instability
- May conflict with current workload
- Can reduce performance

---

### 2. Over-Tuning

Too many parameters:
- Obscure real problems
- Make behavior unpredictable
- Increase maintenance cost

> Minimal tuning is often better than aggressive tuning.

---

### 3. Ignoring Monitoring

Without:
- GC logs
- Metrics
- Observability

JVM tuning becomes guesswork.

---

## A Practical Tuning Strategy

1. Start with default GC (G1)
2. Set correct heap size
3. Enable GC logging
4. Observe real behavior
5. Tune incrementally
6. Validate with load testing

---

## Conclusion

JVM parameters are powerful but dangerous when misused.  
Effective JVM tuning requires understanding **why a parameter exists**, not just what it does.

In most cases:
- Correct heap sizing
- Proper GC selection
- Good observability

solve more problems than complex parameter combinations.

---

## What’s Next

The next article will focus on:
- JDK performance analysis tools
- jstat, jmap, jstack usage
- Java Flight Recorder (JFR)
- Practical debugging workflows
