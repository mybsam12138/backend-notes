# Kubernetes First Principles

> **Kubernetes is a distributed control system that continuously reconciles _desired state_ with _actual state_.**

Everything else in Kubernetes follows from this single idea.

---

## 1. Core Philosophy: Desired State Reconciliation

In Kubernetes, you do **not** tell the system *how* to do things step by step.

Instead, you declare **what you want**:

```yaml
replicas: 3
```

Kubernetes then **continuously works** to make reality match that declaration.

This loop never stops.

**Key implication:**
- Failures are expected
- Recovery is automatic
- Manual intervention is an anti-pattern

---

## 2. Everything Is a Resource

In Kubernetes, all concepts are modeled as **resources**:

- Pod
- Service
- Deployment
- ConfigMap
- Secret
- Node

Each resource is:
- Declarative (YAML / JSON)
- Versioned
- Stored in etcd
- Managed by controllers

There are no "special cases".

---

## 3. Separation of Concerns (Strict Boundary)

Kubernetes enforces a hard separation:

| Layer | Responsibility |
|------|---------------|
| Application | Business logic |
| Pod | Runtime unit |
| Service | Networking abstraction |
| Deployment | Desired scale & rollout |
| Node | Compute resource |
| Control Plane | Orchestration |

**Applications do not manage infrastructure.**
**Infrastructure does not know application logic.**

---

## 4. Controllers Are the Brain

Nothing "just happens" in Kubernetes.

Everything is driven by **controllers**:

```text
observe → compare → act → repeat
```

Example:
- DeploymentController
- ReplicaSetController
- NodeController

A controller:
1. Watches resource state
2. Detects divergence
3. Takes corrective action

This is why Kubernetes is self-healing.

---

## 5. Pods Are Ephemeral, Not Precious

Pods are designed to:
- Die
- Be replaced
- Be rescheduled

You should assume:
- Pod IPs change
- Pods disappear
- Local state is unsafe

**Kubernetes optimizes for replacement, not preservation.**

---

## 6. Indirection Over Direct Coupling

Kubernetes avoids tight coupling using **indirection**:

| Problem | Solution |
|------|---------|
| Pod IP changes | Service |
| Instance scaling | Load balancing |
| Config updates | ConfigMap |
| Secrets | Secret |

This principle enables:
- Scaling
- Rolling updates
- Zero-downtime deployments

---

## 7. Control Plane vs Data Plane

Kubernetes is split into two worlds:

### Control Plane
- API Server
- Scheduler
- Controllers
- etcd

### Data Plane
- Pods
- Containers
- Network traffic

The control plane **never handles application traffic**.
It only manages state.

---

## 8. Immutable Infrastructure Mindset

Kubernetes assumes:
- Containers are immutable
- Updates mean replacement
- Drift is corrected, not tolerated

This eliminates:
- Snowflake servers
- Manual hotfixing
- Environment inconsistency

---

## 9. Declarative Over Imperative

Bad (imperative):
```bash
run this
then that
then restart
```

Good (declarative):
```yaml
replicas: 3
image: v2
```

Kubernetes decides:
- Order
- Timing
- Recovery

---

## 10. Kubernetes Is Not a Framework

Kubernetes:
- Does NOT run your business logic
- Does NOT enforce architecture
- Does NOT replace Spring

It provides:
- Scheduling
- Networking
- Lifecycle management
- Reliability primitives

---

## 11. One Mental Model (Keep This)

> **Kubernetes is a state reconciliation engine for distributed systems.**

If you understand this:
- Service discovery makes sense
- Scaling makes sense
- Self-healing makes sense
- Rolling updates make sense

---

## 12. What Comes Next

Once first principles are clear, the rest unfolds naturally:

1. Pod model
2. Service discovery
3. kube-proxy & networking
4. Scaling & HPA
5. Rolling updates
6. Failure handling

---

*This document focuses on principles, not mechanics. Mechanics are easy once the model is clear.*

