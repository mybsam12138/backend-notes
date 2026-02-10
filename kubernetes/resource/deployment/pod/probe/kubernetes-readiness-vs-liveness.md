# Kubernetes ReadinessProbe vs LivenessProbe – Production Summary

This document summarizes **what readiness and liveness probes are**,  
**when and how Kubernetes checks them**, **what should be implemented in the APIs**,  
and **what happens when they fail**, from a production reliability perspective.

---

## 1. Purpose Overview

Kubernetes health probes answer **two different questions**:

| Probe | Core Question | Kubernetes Action |
|---|---|---|
| **LivenessProbe** | Should this container be restarted? | Restart container |
| **ReadinessProbe** | Should this Pod receive traffic? | Remove Pod from Service |

They must be treated as **separate control signals**.

---

## 2. When Kubernetes Sends Probes

### Execution Source
- Probes are executed by **kubelet on the Node**
- kubelet sends HTTP/TCP requests to the **Pod IP**
- Probes are external checks, not self-calls

### Probe Timing Lifecycle
- Probes start **after the container starts**
- Probes run **periodically**
- Failure is determined by **consecutive failures**, not a single failure

---

## 3. Default Probe Configuration (If Not Specified)

| Field | Default |
|---|---|
| `initialDelaySeconds` | 0 |
| `periodSeconds` | 10 |
| `timeoutSeconds` | 1 |
| `failureThreshold` | 3 |
| `successThreshold` | 1 |

### Practical Meaning
- Checked every **10 seconds**
- **3 consecutive failures** cause action
- Failure detected in ~30 seconds

---

## 4. LivenessProbe – Restart Control

### What Liveness Means
> “Is this application process fundamentally broken and unable to recover without restart?”

### What Should Be in the Liveness API
- Extremely lightweight checks  
- Internal process responsiveness  
- No external dependencies  
- No blocking I/O  
- No locks or heavy computation  

Examples:
- JVM event loop responsive
- Application scheduler alive
- Static `200 OK` after startup

What must NOT be checked:
- Database
- Cache
- Message queue
- Downstream services

---

## 5. ReadinessProbe – Traffic Control

### What Readiness Means
> “Can this Pod safely handle traffic right now without making things worse?”

### What Should Be in the Readiness API
- Required dependency connectivity (if strongly relied upon)
- Resource saturation detection
- Startup and warm-up completion
- Backpressure signals

Examples:
- DB connection available
- Redis responds to PING
- MQ client connected
- Thread pool not exhausted

---

## 6. What Happens When Probes Fail

### ReadinessProbe Failure
- Pod removed from Service endpoints
- Container keeps running
- No restart occurs
- Traffic is shifted elsewhere

### LivenessProbe Failure
- Container is killed
- Container is restarted
- Pod stays scheduled on the Node

---

## 7. Common Failure Causes

| Failure Cause | Readiness | Liveness |
|---|---|---|
| DB down | ❌ | ✅ |
| Redis down (required) | ❌ | ✅ |
| MQ down | ❌ | ✅ |
| Infinite loop | ❌ | ❌ |
| Thread pool exhausted | ❌ | ❌ |
| Deadlock | ❌ | ❌ |
| GC freeze | ❌ | ❌ |

---

## 8. Why Restart or Traffic Control Helps

### Restart (Liveness)
- Clears stuck threads
- Resets corrupted state
- Restores request handling

### Traffic Control (Readiness)
- Prevents useless errors
- Reduces blast radius
- Allows dependency recovery

---

## 9. Design Rules

1. If restart cannot fix the problem, do not fail liveness
2. If serving traffic makes things worse, fail readiness
3. Keep liveness minimal
4. Readiness may check required dependencies
5. Never mix dependency checks into liveness

---

## 10. Final Mental Model

> **Liveness decides whether the Pod should die.**  
> **Readiness decides whether the Pod should work.**

---
