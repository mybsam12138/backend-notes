# Commonly Used Kubernetes Commands (kubectl Guide)

This document summarizes **commonly used Kubernetes commands**, what they are used for, and **how to interpret their outputs**. It is written for engineers who operate Kubernetes clusters in daily development and production environments.

---

## 1. kubectl Basics

All standard Kubernetes operations are performed using:

```bash
kubectl <command> <resource> <name> [flags]
```

Examples:
- `kubectl get pods`
- `kubectl describe deployment my-app`
- `kubectl apply -f app.yaml`

---

## 2. Resource Listing Commands (`get`)

### 2.1 List Pods

```bash
kubectl get pods
```

Example output:
```text
NAME                        READY   STATUS    RESTARTS   AGE
my-app-blue-5d8c9f7b9c-xkq   1/1     Running   0          10m
my-app-green-6f9c7d8d4c-p2   1/1     Running   0          2m
```

Meaning:
- **READY**: containers ready / total containers
- **STATUS**: lifecycle state (Running, Pending, CrashLoopBackOff)
- **RESTARTS**: container restarts
- **AGE**: time since creation

---

### 2.2 List with Labels

```bash
kubectl get pods -l app=my-app,version=green
```

Used heavily in blue–green and canary deployments.

---

### 2.3 Wide Output

```bash
kubectl get pods -o wide
```

Adds:
- Pod IP
- Node name

Useful for networking and scheduling diagnosis.

---

## 3. Inspecting Resources (`describe`)

### 3.1 Describe Pod

```bash
kubectl describe pod my-app-green-xxx
```

Shows:
- Events (pull image, probe failures)
- Resource limits
- Node scheduling details

This is the **first command** to run when a pod is not healthy.

---

### 3.2 Describe Deployment

```bash
kubectl describe deployment my-app-green
```

Shows:
- Replica counts (desired / updated / available)
- Rolling history
- Conditions

Critical for rollout verification.

---

## 4. Viewing Logs (`logs`)

### 4.1 Pod Logs

```bash
kubectl logs my-app-green-xxx
```

### 4.2 Follow Logs

```bash
kubectl logs -f my-app-green-xxx
```

### 4.3 Multi-Container Pod

```bash
kubectl logs my-pod -c app-container
```

Used for debugging runtime and startup issues.

---

## 5. Applying and Updating Resources (`apply`)

### Apply YAML

```bash
kubectl apply -f deployment.yaml
```

What happens:
- Creates resource if missing
- Updates resource if exists
- Declarative (idempotent)

Preferred over `create` for production.

---

## 6. Scaling and Rollout Control

### 6.1 Scale Deployment

```bash
kubectl scale deployment my-app --replicas=3
```

Used in:
- Blue–green cleanup
- Manual traffic control

---

### 6.2 Rollout Status

```bash
kubectl rollout status deployment my-app
```

Shows whether a rollout has completed.

---

### 6.3 Rollout History

```bash
kubectl rollout history deployment my-app
```

Used for tracking revisions.

---

## 7. Service and Networking

### 7.1 List Services

```bash
kubectl get svc
```

Example output:
```text
NAME        TYPE        CLUSTER-IP     PORT(S)
my-app      ClusterIP   10.96.12.34     80/TCP
```

---

### 7.2 Describe Service

```bash
kubectl describe svc my-app
```

Shows:
- Service selector
- Endpoints

Critical for blue–green traffic switching.

---

## 8. Debugging and Access

### 8.1 Exec into Pod

```bash
kubectl exec -it my-app-green-xxx -- /bin/sh
```

Used for:
- Inspecting environment
- Manual health checks

---

### 8.2 Port Forward

```bash
kubectl port-forward pod/my-app-green-xxx 8080:8080
```

Access pod locally without exposing Service.

---

## 9. Deleting Resources

### Delete by File

```bash
kubectl delete -f deployment.yaml
```

### Delete by Resource

```bash
kubectl delete pod my-app-xxx
```

Note:
- Deleting pods directly is usually temporary
- Controllers recreate them automatically

---

## 10. Namespaces

### List Namespaces

```bash
kubectl get ns
```

### Specify Namespace

```bash
kubectl get pods -n prod
```

---

## 11. Mental Model Summary

- `get` → see current state
- `describe` → explain why
- `logs` → see runtime behavior
- `apply` → declare desired state
- `scale` → control capacity
- `rollout` → manage deployments

---

## 12. Final Notes

- Almost all Kubernetes operations begin with `kubectl`
- Kubernetes is **declarative**, not imperative
- Learn to read command output before taking action

This command set covers **90% of daily Kubernetes work**.

