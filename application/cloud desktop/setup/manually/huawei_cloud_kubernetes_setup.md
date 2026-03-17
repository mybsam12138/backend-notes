# Huawei Cloud Deployment Guide
## Part 2 — Kubernetes (CCE) Setup (Updated)

Service layer will run in Kubernetes.

Services:

- WI
- AUTH
- DMS
- HDC

In this design, WI is exposed using **CCE LoadBalancer Service**, so Huawei Cloud automatically creates an **ELB**. No Kubernetes Ingress is required.

---

# Step 1 — Create CCE Cluster

Console → Cloud Container Engine (CCE)

Create cluster.

| Setting | Value |
|---|---|
| Cluster Type | Kubernetes |
| VPC | cloud-desktop-vpc |
| Subnet | service-subnet |

---

# Step 2 — Add Worker Nodes

Worker nodes are ECS instances.

Recommended configuration:

| Node Count | CPU | Memory |
|---|---|---|
| 3 | 8 vCPU | 16 GB |

These nodes will run backend service pods.

---

# Step 3 — Deploy Services

Deploy the backend components into Kubernetes.

| Service | Function |
|---|---|
| WI | Web portal |
| AUTH | Authentication |
| DMS | Desktop management |
| HDC | Desktop communication |

Use Kubernetes resources:

- Deployment
- Service

Example pod layout:

Node1
- WI
- AUTH

Node2
- DMS
- HDC

Node3
- replicas / failover

---

# Step 4 — Expose WI Using LoadBalancer Service

Instead of Ingress, expose WI using:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: wi-service
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: wi
```

When this Service is created in Huawei CCE:

CCE automatically creates:

- ELB
- Backend servers
- Health checks

---

# Final Traffic Flow

User
 ↓
Huawei Cloud ELB (created automatically)
 ↓
Kubernetes Service (WI)
 ↓
Pods

---

# Why Ingress Is Not Needed

Ingress is usually used when:

- multiple web services share one load balancer
- path-based routing is needed
- domain routing is needed

In this architecture only **WI portal is public**, so using **LoadBalancer Service is simpler and recommended**.
