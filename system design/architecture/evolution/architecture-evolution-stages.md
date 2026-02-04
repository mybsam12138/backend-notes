
# Architecture Evolution Stages — Use Scenarios & Signals

This document summarizes **four common real-world architecture stages**, focusing on:
- Suitable **team distribution**
- Suitable **business size & complexity**
- Clear **signals (flags)** that indicate you are *in* that stage

---

## 1. Monolith

### Typical Use Scenario
- **Team**: 1–5 developers
- **Team structure**: Single team, no domain ownership split
- **Business size**: Small, early-stage, or internal system
- **Change frequency**: Fast, experimental
- **Deployment**: One artifact, one pipeline

### Key Characteristics
- Single codebase
- Shared database
- Direct method calls everywhere
- Minimal abstraction

### Signals You Are in This Stage
- One repo, one JAR/WAR
- Changes often touch many areas
- Developers understand the whole system
- Simplicity > scalability

### When It Works Best
- Early product validation
- MVPs
- Startups
- Internal tools

---

## 2. Modular Monolith (⭐ Recommended Default)

### Typical Use Scenario
- **Team**: 5–20 developers
- **Team structure**: 1 team or few sub-teams
- **Business size**: Medium, growing, domain complexity emerging
- **Change frequency**: High, but more controlled
- **Deployment**: Still one artifact

### Key Characteristics
- One deployable application
- Code split by **business modules**
- Clear package/module boundaries
- No network calls between modules

### Signals You Are in This Stage
- Business domains are clear (Order, Policy, Renewal, etc.)
- Teams complain about coupling → boundaries added
- You want structure, not distributed complexity
- You can enforce boundaries via packages / Maven modules

### When It Works Best
- Same team owns multiple domains
- Domains change together
- You want microservice-ready design *without* microservice cost

---

## 3. Distributed Monolith (⚠️ Transitional / Accidental)

### Typical Use Scenario
- **Team**: 10–30 developers
- **Team structure**: Still tightly coupled
- **Business size**: Medium to large
- **Change frequency**: Medium
- **Deployment**: Multiple services, coordinated releases

### Key Characteristics
- Multiple applications
- HTTP/RPC calls between services
- Shared databases or schemas
- Tight runtime coupling

### Signals You Are in This Stage
- Services must be deployed together
- One service change breaks others
- Network calls treated like local calls
- Operational complexity increases without clear benefit

### When It Happens
- Premature microservice split
- Org pressure to “use microservices”
- Boundaries not mature yet

⚠️ This stage is **often a smell**, but sometimes unavoidable temporarily.

---

## 4. True Microservices (🚀 Only When Needed)

### Typical Use Scenario
- **Team**: 30+ developers
- **Team structure**: Multiple autonomous teams
- **Business size**: Large, complex, long-lived systems
- **Change frequency**: Independent per domain
- **Deployment**: Fully independent

### Key Characteristics
- Each service owns its database
- Independent deploy, scale, failure
- Strong API or event-based communication
- Infrastructure-heavy (CI/CD, observability, ops)

### Signals You Are in This Stage
- Teams release independently
- Services fail without cascading failures
- Clear service ownership
- Network failures are expected and handled

### When It Works Best
- Large organizations
- Clear domain ownership
- Need for independent scaling
- High organizational maturity

---

## Quick Comparison Table

| Stage | Team Size | Deployment | Coupling | Complexity |
|-----|----------|------------|----------|------------|
| Monolith | Small | One | High | Low |
| Modular Monolith | Medium | One | Controlled | Medium |
| Distributed Monolith | Medium–Large | Many (linked) | High | High |
| Microservices | Large | Independent | Low | Very High |

---

## Core Principle

> **Choose architecture based on team structure and business reality — not trends.**

Most systems should **start as a modular monolith** and evolve only when real pain appears.
