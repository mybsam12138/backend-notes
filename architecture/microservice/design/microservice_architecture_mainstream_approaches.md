# Building Microservices: Mainstream Approaches

This document summarizes **the major ways microservices are built today**, clarifies **what is mainstream**, and explains the relationship between **Spring Boot, Spring Cloud, and Kubernetes**.

The focus is on **practical industry reality**, not historical or theoretical completeness.

---

## 1. What Do We Mean by “Building Microservices”?

Building microservices involves deciding:

- How services communicate
- How services are discovered
- How traffic is routed
- How failures are handled
- How services are deployed and operated

Different approaches solve these concerns at **different layers**.

---

## 2. The Major Microservice Architecture Types

From an architectural perspective, there are **four main approaches** used today.

---

## 3. Type 1: Spring Boot + Kubernetes (Cloud-Native, Mainstream)

### Overview

This is **the most mainstream modern approach** globally.

```text
Spring Boot (application)
+ Kubernetes (infrastructure)
```

Spring Boot focuses on:
- Application logic
- Dependency injection
- HTTP APIs

Kubernetes focuses on:
- Service discovery (DNS)
- Load balancing
- Scaling
- Health checks
- Deployment

---

### Characteristics

- No heavy microservice framework
- Infrastructure handles most cross-cutting concerns
- Services communicate via REST or gRPC

---

### Why This Is Mainstream

- Kubernetes is the industry standard container platform
- Avoids framework lock-in
- Works across languages
- Aligns with cloud-native principles

---

### Typical Usage

- New greenfield projects
- Platform teams
- Companies adopting cloud-native architecture

---

## 4. Type 2: Spring Cloud (Framework-Oriented Microservices)

### Overview

Spring Cloud was the **early dominant microservice framework** in the Java ecosystem.

```text
Spring Boot
+ Spring Cloud (Netflix OSS style)
```

Spring Cloud provides:
- Service discovery (Eureka)
- Client-side load balancing
- Circuit breakers
- API gateways

---

### Characteristics

- Application-layer microservice governance
- Strong framework integration
- Rich ecosystem

---

### Current Industry Status

- Still widely used
- Common in existing systems
- Less popular for brand-new cloud-native projects

---

### When Spring Cloud Is Still a Good Choice

- Existing Spring Cloud systems
- Teams not using Kubernetes
- VM-based deployments
- Organizations preferring application-level control

---

## 5. Type 3: Service Mesh–Based Microservices

### Overview

Service Mesh moves service governance **out of the application** and into infrastructure.

```text
Spring Boot
+ Kubernetes
+ Service Mesh (Envoy / Istio)
```

---

### What the Mesh Handles

- Traffic routing
- Retries and timeouts
- Observability
- mTLS

---

### Industry Adoption

- Used by large-scale systems
- Platform-heavy environments
- Not universal due to operational complexity

---

## 6. Type 4: RPC-Heavy Microservices (Framework-Centric)

### Overview

This approach centers around **RPC frameworks**.

```text
Spring Boot
+ RPC Framework (gRPC / Dubbo)
```

---

### Characteristics

- Interface-first
- Method-oriented
- High performance
- Strong coupling risk

---

### Industry Usage

- Internal infrastructure services
- Performance-critical paths
- Less common as a default architecture

---

## 7. What Are the Two Most Popular Today?

### The Real Answer

> **Yes — the two most popular approaches today are:**

1. **Spring Boot + Kubernetes** (global mainstream)
2. **Spring Cloud** (still very common, especially in existing systems)

---

### Trend Direction

```text
Spring Cloud–centric  →  Kubernetes-centric
```

This is a **gradual migration**, not a hard replacement.

---

## 8. Comparison Summary

| Approach | Popularity | Best For | Trend |
|--------|-----------|---------|------|
| Spring Boot + Kubernetes | ⭐⭐⭐⭐⭐ | New cloud-native systems | Rising |
| Spring Cloud | ⭐⭐⭐⭐ | Existing Java microservices | Stable / Declining |
| Service Mesh | ⭐⭐⭐ | Large-scale platforms | Niche but growing |
| RPC-heavy | ⭐⭐ | Internal infra | Stable niche |

---

## 9. Key Clarification (Important)

- **Spring Boot is always the base** (application layer)
- **Spring Cloud and Kubernetes are not competitors**
- They solve problems at **different layers**

Kubernetes can replace *some* Spring Cloud components, but not all.

---

## 10. One-Sentence Takeaway

> **Modern microservices are primarily built with Spring Boot on Kubernetes, while Spring Cloud remains widely used in existing systems; everything else is situational.**

---

**End of document**

