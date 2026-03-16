# Kubernetes Deployment Resource – Purpose & Explanation

This document summarizes **only the Kubernetes Deployment resource** and explains
**what it is used for and why each major field exists**.

---

## 1. What Is a Deployment

A `Deployment` is the **primary workload controller** for stateless applications in Kubernetes.

Its core responsibility is:

> Ensure the **desired number of identical Pods** are running and **safely updated over time**.

A Deployment:
- Manages ReplicaSets
- Creates, replaces, and restarts Pods
- Performs rolling updates and rollbacks
- Self-heals when Pods crash or are deleted

A Deployment does **not**:
- Expose traffic (Service does)
- Load balance traffic
- Autoscale by itself

---

## 2. Minimal Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: app
          image: my-app:1.0.0
```

---

## 3. Key Fields and Their Purpose

### 3.1 replicas

```yaml
replicas: 3
```

**Purpose**
- Declares how many Pods should exist at all times

**Behavior**
- Pod crashes → recreated
- Pod deleted → recreated

This is desired state, not a command.

---

### 3.2 selector

```yaml
selector:
  matchLabels:
    app: my-app
```

**Purpose**
- Defines which Pods belong to this Deployment

**Important**
- Must match Pod template labels
- Immutable after creation

---

### 3.3 template (Pod Template)

```yaml
template:
  metadata:
    labels:
      app: my-app
```

**Purpose**
- Blueprint for Pods
- Any change triggers a new ReplicaSet

---

### 3.4 containers.image

```yaml
image: my-app:1.0.0
```

**Purpose**
- Defines application version
- Image change triggers rolling update

---

### 3.5 resources (requests & limits)

```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

**Purpose**
- Requests: scheduling guarantee
- Limits: runtime enforcement via cgroups

Required for stable production behavior.

---

### 3.6 readinessProbe

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8080
```

**Purpose**
- Controls whether Pod receives traffic
- Pod can run but be temporarily unready

---

### 3.7 livenessProbe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
```

**Purpose**
- Detects stuck or broken applications
- Triggers container restart

---

### 3.8 strategy (RollingUpdate)

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

**Purpose**
- Controls update behavior
- Enables zero-downtime deployments

---

### 3.9 revisionHistoryLimit

```yaml
revisionHistoryLimit: 5
```

**Purpose**
- Limits stored ReplicaSets
- Enables rollback without clutter

---

## 4. Runtime Behavior Summary

1. Deployment controller compares desired vs actual state
2. ReplicaSet is created or updated
3. Pods are created or replaced
4. Scheduler assigns Pods to Nodes
5. kubelet starts containers
6. Probes control availability and restarts

All actions are **controller-driven and declarative**.

---

## 5. Mental Model

A Deployment is **not a process runner**.

It is a **control loop** that continuously reconciles declared intent
with actual cluster state.

---

## 6. When to Use Deployment

Use Deployment when:
- Application is stateless
- Needs rolling updates
- Needs self-healing
- Needs horizontal scaling

Do not use Deployment for:
- One-off tasks (Job)
- Identity-bound Pods (StatefulSet)

---
