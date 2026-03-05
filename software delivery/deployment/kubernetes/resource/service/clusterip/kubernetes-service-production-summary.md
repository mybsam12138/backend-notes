# Kubernetes Service.yaml – Production Summary

This document summarizes **how a Kubernetes Service YAML is typically written and used in production**, with emphasis on stability, clarity, and long-term operability.

---

## 1. Purpose of a Service in Production

A Kubernetes **Service** provides:

- Stable virtual IP (ClusterIP)
- Stable DNS name
- Load-balanced access to Pods
- Decoupling between callers and Pod lifecycle

> A Service is a **network contract**, not an implementation detail.

---

## 2. Canonical Production Service YAML

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: production
  labels:
    app: user
    component: backend
spec:
  type: ClusterIP
  selector:
    app: user
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
```

---

## 3. Required and Common Fields

### `apiVersion` and `kind`
```yaml
apiVersion: v1
kind: Service
```

- `Service` is a core Kubernetes resource
- Always uses `v1`

---

### `metadata`

```yaml
metadata:
  name: user-service
  namespace: production
  labels:
    app: user
```

#### Best practices
- Use **stable, business-meaningful names**
- Always include labels for:
  - ownership
  - automation
  - observability
- Keep Service labels **minimal and stable**

---

### `spec.type`

```yaml
type: ClusterIP
```

**Production default**

- Internal-only virtual IP
- Reachable only inside the cluster
- Backed by iptables / IPVS

Other types:
- `NodePort` → rarely used directly
- `LoadBalancer` → usually only for edge services
- `ExternalName` → DNS alias only

---

### `spec.selector`

```yaml
selector:
  app: user
```

- Selects Pods by label
- Drives EndpointSlice creation
- Controls traffic routing

> Changing selectors is a **breaking operation**

---

### `spec.ports`

```yaml
ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
```

#### Production rules
- Always name ports
- Use standard client-facing ports (80 / 443)
- Map to internal container ports via `targetPort`

---

## 4. Optional but Common Production Fields

### Session affinity (use sparingly)

```yaml
sessionAffinity: ClientIP
sessionAffinityConfig:
  clientIP:
    timeoutSeconds: 10800
```

Used only when required by legacy systems.

---

### Multiple ports (metrics pattern)

```yaml
ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: metrics
    port: 9090
    targetPort: 9090
```

Common for Prometheus scraping.

---

## 5. What a Service Does NOT Do

A Service does **not**:

- Run processes
- Terminate TLS
- Understand HTTP semantics
- Perform retries or circuit breaking
- Select other Services

Those responsibilities belong to:
- Ingress / Gateway
- Application code
- Service mesh (if used)

---

## 6. Service Types in Production (Rule of Thumb)

| Type | Usage |
|----|----|
| ClusterIP | Default for all internal services |
| LoadBalancer | Edge / ingress only |
| NodePort | Debugging or legacy |
| Headless | Stateful systems (DB, Kafka) |

---

## 7. Traffic Flow (Mental Model)

```
Client Pod
  ↓
Service DNS
  ↓
ClusterIP
  ↓
kube-proxy rules
  ↓
EndpointSlice
  ↓
Target Pod
```

All forwarding happens at **kernel level**.

---

## 8. Stability Rules for Production

- Services should change **rarely**
- Pod labels may change often
- Never embed environment-specific logic in Services
- Treat Service YAML as part of your **platform contract**

---

## 9. Final Takeaway

> **In production, a Service is boring on purpose.**

A good Service YAML is:
- Small
- Stable
- Predictable
- Rarely modified

If you frequently change Services, it usually signals a design issue elsewhere.

---

End of document.
