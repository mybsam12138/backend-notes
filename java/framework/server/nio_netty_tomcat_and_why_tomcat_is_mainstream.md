# NIO, OS-Level Events, Netty vs Tomcat, and Why Tomcat Is Still Mainstream

This document explains:

- What NIO really means
- What kinds of OS-level events (signals) exist and where they can be used
- The architectural difference between Netty and Tomcat
- Why Tomcat is still the mainstream choice for business services

---

## 1. What NIO Actually Means

**NIO (Non-blocking I/O)** does not mean "no threads".

It means:

> **Threads do not block while waiting for I/O; the OS notifies the program when I/O is ready.**

This is implemented using OS-level event mechanisms:
- Linux: `epoll`
- macOS / BSD: `kqueue`
- Windows: IOCP

---

## 2. OS-Level Event (Signal) Mechanisms: What They Apply To

OS-level event notification works only for **kernel-managed wait states**.

### Supported by OS events

- Network sockets (TCP / UDP)
- Pipes and IPC
- Timers and timeouts
- Process lifecycle events

These are things the OS can **wait for**.

---

### NOT supported by OS events

- CPU computation
- Normal method execution
- Business logic
- In-process memory changes

If the OS cannot wait for it, it cannot signal it.

---

## 3. Two Forms of NIO Usage in Servers

### Form 1: NIO for Network Only (Tomcat)

```text
Event loop (socket readiness)
→ hand off to worker thread
→ blocking application code
```

Characteristics:
- Event loop used only for network I/O
- Application logic runs on worker threads
- Blocking is expected and safe

---

### Form 2: End-to-End Event Loop (Netty)

```text
Event loop
→ application handler
→ non-blocking pipeline
→ response
```

Characteristics:
- Event loop drives both I/O and application flow
- Blocking is forbidden
- Reactive streams are first-class

---

## 4. Netty vs Tomcat: Core Differences

| Aspect | Tomcat | Netty |
|------|-------|-------|
| Network I/O | NIO (epoll) | NIO (epoll) |
| Execution model | Thread-per-request | Event-loop driven |
| Blocking allowed | Yes | No (by default) |
| Servlet API | Yes | No |
| Reactive streams | No | Yes |
| Learning curve | Low | High |

---

## 5. Why Tomcat Is Still Mainstream

### 5.1 Business Logic Is Sequential

Most business services:
- Use JDBC
- Use transactions
- Require strict correctness
- Need results immediately

Blocking, imperative code maps naturally to this model.

---

### 5.2 Databases Are the Real Bottleneck

- DB connections are limited
- DB throughput is finite
- Saving threads does not increase DB capacity

Reactive I/O does not fix DB constraints.

---

### 5.3 Developer Productivity Matters

- Easier debugging
- Simpler mental model
- Clear transaction boundaries

For most teams, this outweighs theoretical scalability gains.

---

## 6. Industry Reality

What is commonly seen in production:

- Spring MVC + Tomcat → business microservices
- WebClient → outbound HTTP calls
- WebFlux / Netty → gateways, BFF, streaming

Hybrid architectures are the norm.

---

## 7. One-Sentence Conclusion

> **Tomcat already uses NIO for network I/O, while keeping application code simple and blocking—this balance is why it remains the mainstream server for business systems.**

---

End of document

