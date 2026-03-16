# Kubernetes Blue–Green Deployment (Pure Kubernetes)

This document summarizes how to implement **blue–green deployment** using **native Kubernetes primitives only** (Deployment + Service), including **traffic switch and rollback**.

---

## 1. Core Concept

Blue–green deployment maintains **two full application versions**:

- **Blue**: current production version (serving traffic)
- **Green**: new version (fully deployed, no traffic initially)

Traffic is switched **at once** by updating the Service selector.

Key characteristics:
- No mixed versions serving traffic
- Instant rollback
- Requires temporary double resources

---

## 2. Required Kubernetes Objects

- Two `Deployment` objects
  - `app-blue`
  - `app-green`
- One `Service`

Traffic routing is controlled **only by labels**.

---

## 3. Initial State (Blue Live)

### Blue Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
      version: blue
```

### Service (Routing to Blue)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
    version: blue
```

State:
- Blue pods receive all traffic
- Green does not exist yet

---

## 4. Step-by-Step Blue–Green Deployment

### Step 1: Deploy Green (No Traffic)

```bash
kubectl apply -f deployment-green.yaml
```

At this point:
- Green pods are running
- Service still routes to Blue
- No production impact

---

### Step 2: Verify Green Deployment

Recommended checks:
- Pod status and logs
- Health endpoints
- Database connectivity
- Smoke tests

Example:

```bash
kubectl get pods -l app=my-app,version=green
```

Do **not** switch traffic before this step.

---

### Step 3: Switch Traffic (Blue → Green)

Update Service selector:

```yaml
spec:
  selector:
    app: my-app
    version: green
```

Apply the Service:

```bash
kubectl apply -f service.yaml
```

Result:
- New connections go to Green
- Existing Blue connections finish naturally
- No pod restarts

---

### Step 4: Post-Switch Observation

After traffic switch, monitor:
- Error rate
- Latency
- Logs
- Database writes

This is the **rollback window**.

---

## 5. Rollback Process (Green → Blue)

If any issue is detected:

1. Change Service selector back to Blue

```yaml
spec:
  selector:
    app: my-app
    version: blue
```

2. Apply Service

```bash
kubectl apply -f service.yaml
```

Rollback properties:
- Instant
- No redeploy
- No pod recreation

---

## 6. Decommissioning Blue Safely

After Green is confirmed stable:

### Recommended: Scale Blue to Zero

```bash
kubectl scale deployment app-blue --replicas=0
```

Why:
- Graceful
- Reversible
- Keeps rollback option

---

### Optional Final Cleanup

After hours or days:

```bash
kubectl delete deployment app-blue
```

Many teams delay this for safety.

---

## 7. Recommended Timeline

| Phase | Action |
|------|-------|
| T0 | Deploy Green |
| T0+ | Verify Green |
| T1 | Switch Service to Green |
| T1+ | Observe metrics |
| T1+30min | Scale Blue to 0 |
| T1+24h | Delete Blue (optional) |

---

## 8. Key Best Practices

- Use **readiness probes** correctly
- Ensure **DB schema compatibility**
- Allow time for **connection draining**
- Never delete pods directly
- Control traffic via Service, not Deployment

---

## 9. One-Sentence Mental Model

> **Deploy first, verify safely, switch traffic via Service, then scale down old version.**

---

## 10. Summary

- Kubernetes supports blue–green deployment **natively**
- No service mesh is required
- Service selectors provide instant traffic switch
- Rollback is a simple Service update
- Scaling, not deleting pods, is the correct cleanup strategy

