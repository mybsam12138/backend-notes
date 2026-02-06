# Three Types of Containers in a Kubernetes Pod

> **A Pod is the smallest deployable and networked unit in Kubernetes.**  
> Containers inside a Pod share the same lifecycle, network namespace, and volumes.

Although a Pod can contain many containers, they usually fall into **three logical roles**:

1. App Container
2. Init Container
3. Sidecar Container

This document summarizes what each type does, when to use it, and how they work together.

---

## 1. App Container (Main Container)

### What it is
The **app container** is the primary reason the Pod exists.

Examples:
- Spring Boot application
- Nginx server
- Background worker

```yaml
containers:
  - name: app
    image: my-app:1.2.3
```

### Key characteristics
- Long-running process
- Handles business logic
- If it exits, the Pod is considered failed
- Every Pod has **at least one** app container

### Responsibility
> **Implements business capability**

---

## 2. Init Container (Runs Before the App)

### What it is
An **init container** runs **before** any app containers start.

- Runs to completion
- Runs sequentially (one by one)
- Must succeed before the Pod continues startup

```yaml
initContainers:
  - name: init-db-check
    image: busybox
    command: ["sh", "-c", "until nc -z db 5432; do sleep 2; done"]
```

### Common use cases
- Wait for database or message queue
- Initialize files or directories
- Set permissions
- Download configuration or data
- Perform environment pre-checks

### Why init containers exist
They move startup logic **out of application code** and into Kubernetes.

### Responsibility
> **Prepare the environment before the app starts**

---

## 3. Sidecar Container (Runs With the App)

### What it is
A **sidecar container** runs **alongside** the app container for the entire Pod lifecycle.

- Starts with the app
- Stops with the app
- Shares Pod IP, localhost, and volumes

```yaml
containers:
  - name: app
    image: my-app
  - name: log-agent
    image: fluent-bit
```

### Common use cases
- Log collection and shipping
- Metrics and monitoring
- Service mesh proxy (e.g., Envoy)
- Config reloaders
- Security agents

### Why sidecars exist
They provide **cross-cutting infrastructure capabilities** without modifying application code.

### Responsibility
> **Enhance the application with non-business capabilities**

---

## 4. How the Three Types Work Together

```text
Pod (one IP, one lifecycle)
├── Init container(s)   → run first, then exit
├── App container       → main workload
└── Sidecar container   → supporting capability
```

- Init containers: sequential, blocking startup
- App + sidecars: parallel, long-running

---

## 5. Comparison Summary

| Container Type | Runs When | Lifecycle | Purpose |
|---------------|----------|-----------|--------|
| App | During Pod lifetime | Long-running | Business logic |
| Init | Before app starts | Short-lived | Environment preparation |
| Sidecar | With app | Long-running | Infrastructure enhancement |

---

## 6. What These Containers Share

All containers in a Pod:
- Share **one Pod IP**
- Share **network namespace**
- Communicate via `localhost`
- Can share volumes

This is why sidecar and init patterns work cleanly.

---

## 7. One-Sentence Mental Model

> **App containers do the work.**  
> **Init containers prepare the ground.**  
> **Sidecars enhance the journey.**

---

*This document focuses on conceptual clarity rather than tooling or YAML variations.*