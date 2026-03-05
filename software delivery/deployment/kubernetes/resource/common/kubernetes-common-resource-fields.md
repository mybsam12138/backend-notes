# Common Kubernetes Resource Fields

This document summarizes the **common and recurring top-level fields** you will see across most Kubernetes resource YAML files.  
Understanding these fields gives you a solid mental model of Kubernetes as a **declarative reconciliation system**.

---

## 1. Canonical Resource Structure

Most Kubernetes resources follow this structure:

```yaml
apiVersion: <group/version>
kind: <ResourceKind>
metadata:
  ...
spec:
  ...
status:
  ...
```

---

## 2. `apiVersion`

```yaml
apiVersion: apps/v1
```

**Purpose**
- Specifies which API schema version the resource uses
- Determines validation rules and available fields

**Examples**
- `v1` → core resources (Pod, Service, ConfigMap)
- `apps/v1` → Deployment, StatefulSet
- `batch/v1` → Job, CronJob

---

## 3. `kind`

```yaml
kind: Deployment
```

**Purpose**
- Defines the resource type
- Determines which controller manages it

---

## 4. `metadata`

Identity, grouping, and selection information.

```yaml
metadata:
  name: user-service
  namespace: production
  labels:
    app: user
  annotations:
    description: backend service
```

### Common `metadata` fields

| Field | Purpose |
|----|--------|
| `name` | Unique name within a namespace |
| `namespace` | Logical isolation boundary |
| `labels` | Selectable metadata |
| `annotations` | Non-selectable metadata |
| `ownerReferences` | Garbage collection linkage |

---

## 5. `spec` (Desired State)

Defines **what you want Kubernetes to achieve**.

```yaml
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user
```

**Characteristics**
- Declarative
- Continuously reconciled
- User-defined

Examples of what lives in `spec`:
- Pod templates
- Ports
- Selectors
- Policies
- Scaling rules

---

## 6. `status` (Observed State)

```yaml
status:
  availableReplicas: 3
  conditions:
    - type: Available
      status: "True"
```

**Key rules**
- Written **only by Kubernetes**
- Reflects current system reality
- Never set manually in YAML

Used for:
- Debugging
- Health inspection
- Automation decisions

---

## 7. `labels` vs `annotations`

### Labels
- Used for selection
- Queried by controllers and users

```yaml
labels:
  app: user
```

### Annotations
- Used for configuration and documentation
- Not selectable

```yaml
annotations:
  nginx.ingress.kubernetes.io/rewrite-target: /
```

**Rule of thumb**

> If it is **queried** → label  
> If it is **read** → annotation

---

## 8. Resource-Specific Top-Level Fields

Some resources diverge from the `spec/status` model.

### ConfigMap / Secret

```yaml
data:
  application.yml: |
    server:
      port: 8080
```

Optional:
```yaml
immutable: true
```

---

### Secret convenience field

```yaml
stringData:
  password: mypass
```

Converted automatically into `data`.

---

### RBAC resources

```yaml
subjects:
  - kind: ServiceAccount
roleRef:
  kind: Role
  name: reader
```

Used by:
- Role
- ClusterRole
- RoleBinding
- ClusterRoleBinding

---

## 9. Common Resource Shapes

### A. Controller-managed resources
```yaml
metadata
spec
status
```
Examples:
- Deployment
- StatefulSet
- Job
- Service

---

### B. Data-only resources
```yaml
metadata
data
```
Examples:
- ConfigMap
- Secret

---

### C. Policy / binding resources
```yaml
metadata
rules / subjects / roleRef
```
Examples:
- Role
- NetworkPolicy
- PodSecurityPolicy (deprecated)

---

## 10. Core Mental Model

Kubernetes operates as a **reconciliation loop**:

```
spec (desired state)
        ↓
controller
        ↓
status (actual state)
```

You describe *what you want*.
Kubernetes continuously works to make reality match it.

---

## 11. Final Takeaway

If you understand:
- `metadata`
- `spec`
- `status`

You understand **most Kubernetes YAML**.

Everything else is a specialization on top of this model.
