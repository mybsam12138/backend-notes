# RPC Style (Remote Procedure Call)

This document introduces **RPC (Remote Procedure Call)** as an **interaction style**, focusing on its core idea, characteristics, and typical usage — **independent of any specific protocol or framework**.

---

## 1. What Is RPC?

**RPC (Remote Procedure Call)** is an interaction model where a program **calls a function or method located in another process or machine as if it were a local call**.

From the caller’s perspective, there is no visible difference between:

```text
localService.doSomething()
```

and:

```text
remoteService.doSomething()
```

The network, serialization, and transport details are intentionally hidden.

---

## 2. Core Idea

> **Make remote calls look like local method calls.**

RPC aims to reduce the cognitive gap between local code and distributed systems by abstracting away communication details.

This abstraction is both **RPC’s biggest advantage and its biggest risk**.

---

## 3. Typical RPC Architecture

An RPC system usually consists of the following parts:

1. **Service Interface (or IDL)**  
   - Defines available methods and data structures
   - Example: `approvePolicy(policyId)`

2. **Client Proxy (Stub)**  
   - Implements the same interface
   - Serializes method name + parameters

3. **Transport Layer**  
   - Sends serialized data over a network
   - Can be TCP, HTTP/1.1, HTTP/2, etc.

4. **Server Stub**  
   - Deserializes the request
   - Invokes the real implementation

5. **Response Handling**  
   - Result is serialized and returned
   - Client proxy returns the result like a normal method call

---

## 4. Key Characteristics of RPC

### 4.1 Method-Oriented
- RPC exposes **methods**, not resources
- APIs resemble programming language interfaces

Example:
```text
approvePolicy(policyId)
cancelOrder(orderId)
calculatePremium(input)
```

---

### 4.2 Interface-First
- Client and server usually share:
  - Interfaces
  - Method signatures
  - DTO definitions

This creates **strong compile-time coupling**.

---

### 4.3 Proxy-Based Invocation
- Clients call a proxy object
- The proxy hides:
  - Network latency
  - Serialization
  - Failure modes

This creates the illusion of a local call.

---

### 4.4 Synchronous by Default
- Most RPC calls are blocking
- Caller waits for the result

This makes call chains easy to build — and easy to overuse.

---

## 5. RPC Is Not a Protocol

A critical clarification:

> **RPC is a programming and interaction model, not a protocol.**

RPC can be implemented over different transports:

- TCP
- HTTP/1.1
- HTTP/2

The protocol choice does **not** change the RPC nature as long as:
- Methods are exposed
- Calls look like local invocations

---

## 6. Common RPC Implementations

RPC-style systems are often implemented using:

- Custom binary protocols
- Interface Definition Languages (IDL)
- Generated client/server code

Examples (conceptually):
- gRPC
- Dubbo
- Thrift

These are **implementations of RPC**, not RPC itself.

---

## 7. Strengths of RPC

RPC works well when:

- High performance is required
- Both sides are owned by the same team
- Interfaces are stable
- Clear dependency direction exists

Typical use cases:
- Internal infrastructure services
- Authentication / authorization checks
- Pricing or calculation engines

---

## 8. Risks and Limitations

### 8.1 Hidden Network Cost
- Network latency and failures are obscured
- Developers may forget they are making remote calls

---

### 8.2 Tight Coupling
- Shared interfaces and DTOs
- Coordinated deployments are often required

---

### 8.3 Cascading Failures
- Synchronous call chains
- A → B → C failures can propagate quickly

---

## 9. RPC vs Local Calls (Important Reminder)

> **A remote call is not a local call.**

Even though RPC makes them look similar, remote calls:
- Can fail partially
- Have unpredictable latency
- Depend on network stability

Ignoring this difference leads to fragile systems.

---

## 10. One-Sentence Summary

> **RPC is an interaction style where remote services expose methods that are invoked through proxies as if they were local function calls, hiding network details and encouraging method-oriented communication.**

---

**End of document**