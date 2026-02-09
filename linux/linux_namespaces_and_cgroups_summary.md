# Linux Namespaces and cgroups — Practical Summary

This document summarizes **Linux namespaces** and **cgroups**, two core kernel features that make containers (Docker / Kubernetes) possible.

---

## 1. Linux Namespace

### Definition
A **namespace** isolates *what a process can see*. Processes in different namespaces may see different PIDs, network interfaces, mount points, or hostnames — while still sharing the same Linux kernel.

In short:
> **Namespace = view isolation**

---

### What namespaces isolate

| Namespace | Isolates | Typical effect |
|---------|--------|----------------|
| PID | Process IDs | `ps` shows only container processes |
| NET | Network stack | Own IP, ports, routing table |
| MNT | Mount points | Own filesystem view |
| UTS | Hostname | Container-specific hostname |
| IPC | IPC resources | Isolated shared memory / semaphores |
| USER | User IDs | Root inside container ≠ root on host |
| CGROUP | cgroup visibility | Only assigned cgroups are visible |

---

### Key properties
- Namespaces **do not limit resources**
- They only **change perception**
- Multiple processes can share a namespace
- A process can belong to **multiple namespaces at once**

---

### Core question namespaces answer
> **What does this process see?**

---

## 2. Linux cgroup (Control Group)

### Definition
A **cgroup** limits, accounts for, and prioritizes **resource usage** of processes. It does not hide resources — it enforces boundaries.

In short:
> **cgroup = resource control**

---

### Resources controlled by cgroups

| Resource | What is controlled |
|--------|-------------------|
| CPU | Quota, shares, throttling |
| Memory | Max usage, OOM kill |
| Disk I/O | Read/write bandwidth |
| PIDs | Max number of processes |
| Network | Indirect (via tc / qdisc) |

---

### cgroup versions

- **cgroup v1**
  - Multiple independent hierarchies
  - More complex management

- **cgroup v2**
  - Unified hierarchy
  - Stronger consistency
  - Default in modern Linux and Kubernetes

---

### Key properties
- cgroups are **enforced by the kernel**
- Limits are **hard guarantees**
- Excess usage leads to **throttling or OOM kill**
- cgroups apply to **process groups**, not binaries

---

### Core question cgroups answer
> **How much can this process use?**

---

## 3. Namespace vs cgroup (Side-by-side)

| Aspect | Namespace | cgroup |
|------|-----------|--------|
| Purpose | Isolation | Resource limitation |
| Focus | Visibility | Usage |
| Controls | PID, net, fs, user | CPU, memory, IO |
| Kernel feature | Yes | Yes |
| Used by containers | Yes | Yes |

---

## 4. Containers and Kubernetes mapping

### Container (Docker / CRI)
```
Container = Namespaces + cgroups
```

- Namespaces create isolation
- cgroups enforce resource limits

---

### Kubernetes Pod

- **Namespaces**
  - Shared among containers inside the same Pod
  - Isolated across Pods

- **cgroups**
  - Applied per container / per Pod
  - Driven by `resources.requests` and `resources.limits`

Example:
```yaml
resources:
  limits:
    cpu: "1"
    memory: "512Mi"
```
⬆ This becomes **cgroup rules**, not scheduler logic.

---

## 5. One-sentence takeaway

> **Namespaces define the world a process lives in; cgroups define the power it is allowed to use.**

---

## 6. When to care

- Debugging container OOM or CPU throttling → **cgroups**
- Understanding Pod IPs and process isolation → **namespaces**
- Designing container platforms → **both are mandatory knowledge**

---

End of document.

