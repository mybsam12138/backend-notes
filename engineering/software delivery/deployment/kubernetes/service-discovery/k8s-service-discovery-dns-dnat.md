# Kubernetes Service Discovery (DNS + Service VIP + DNAT)

This note summarizes how Kubernetes implements **service discovery** and **service load‑balancing** using:

- **etcd** (state storage)
- **CoreDNS** (name → Service IP)
- **kube-proxy** + **Linux kernel** (Service IP → Pod IP via DNAT / IPVS)

---

## 1) Control plane: store desired state (etcd)

When you run:

```bash
kubectl apply -f service.yaml
```

- **API Server** validates the request and stores the **Service object** in **etcd**.
- etcd does **not** store YAML. YAML is an input format.
- Kubernetes objects are stored as **binary bytes** (protobuf-encoded) under string keys.

A `Service` object typically stores:

- `metadata.name` / `metadata.namespace` (identity)
- `spec.selector` (label intent: which Pods belong to this Service)
- `spec.clusterIP` (the **virtual IP** / VIP, allocated by Kubernetes unless you set it)
- ports and protocol

**Pod IPs are not inside the Service object.** They live in **EndpointSlice** (or legacy Endpoints) objects.

---

## 2) Control plane: keep backends updated (EndpointSlice)

As Pods come and go (restart, reschedule, scale up/down):

1. Pod gets a (possibly new) **Pod IP** from the CNI.
2. The **controller manager** updates **EndpointSlice** for each matching Service:
   - removes old Pod IPs
   - adds new Pod IPs

EndpointSlice is saved to **etcd** just like Service objects.

---

## 3) Name resolution: DNS (CoreDNS)

Inside the cluster, **CoreDNS** watches the Kubernetes API (Services + EndpointSlices).

For a normal (ClusterIP) Service, DNS answers:

- `my-svc.default.svc.cluster.local` → **Service ClusterIP** (VIP)

Key point:

- **DNS maps name → Service IP**
- DNS does **not** do packet forwarding
- DNS does **not** load balance at L4 by itself (for normal Services)

> Special case: **Headless Service** (`clusterIP: None`)  
> DNS returns **Pod IPs** directly, and clients do the balancing.

---

## 4) Data plane: packet forwarding with DNAT (kube-proxy + kernel)

**kube-proxy** runs on **every node** and watches:

- Services
- EndpointSlices

When the Service or its backends change, kube-proxy updates **Linux kernel rules**:

- **iptables mode**: installs DNAT rules in netfilter chains
- **IPVS mode**: programs a kernel “virtual server” with real servers (Pods)

kube-proxy is **not** in the packet path. It **pre-programs** the kernel.

---

## 5) What happens when a client calls a Service name?

Example:

- Service name: `my-svc`
- ClusterIP: `10.96.0.100:80`
- Backends: `10.244.2.7:8080`, `10.244.1.5:8080`

### Step A — DNS (once per cache/TTL)

Application resolves:

`my-svc` → `10.96.0.100`

Now the application sends traffic to the VIP.

### Step B — Kernel DNAT (every connection/packet path)

Packet leaves the client Pod and enters the node kernel networking stack:

1. Kernel matches destination `10.96.0.100:80`
2. iptables/IPVS selects a backend Pod IP
3. **DNAT** rewrites destination:

`dst 10.96.0.100:80` → `dst 10.244.2.7:8080`

4. Kernel routes the packet via CNI to the destination Pod (same node or another node)
5. Destination Pod receives traffic as Pod-to-Pod traffic (it usually never “sees” the Service VIP)

Return traffic is handled correctly using **conntrack** (connection tracking).

---

## 6) Who updates DNAT when Pod IPs change?

Pods can restart and change IPs frequently. This is handled automatically:

1. Pod IP changes → EndpointSlice updates (controller manager)
2. EndpointSlice change → kube-proxy watch event
3. kube-proxy updates iptables/IPVS rules:
   - removes old backend IPs
   - adds new backend IPs

**New connections use the new rules; existing connections continue via conntrack until they finish/timeout.**

---

## 7) Mental model (one line)

**etcd stores intent → CoreDNS resolves name → Service VIP → kube-proxy programs kernel → kernel DNATs to Pod IP → Pods talk directly**

---

## 8) Quick “who does what” table

| Component | Role | In packet path? |
|---|---|---|
| API Server | Accepts Service/Pod changes, writes objects | No |
| etcd | Stores objects (bytes) | No |
| Controller manager | Maintains EndpointSlices | No |
| CoreDNS | Service name → Service IP | No |
| kube-proxy | Programs iptables/IPVS rules | No |
| Linux kernel (netfilter/IPVS) | Does DNAT / load balancing | **Yes** |
| CNI | Routes packets to Pods across nodes | **Yes** |

---

## 9) Common pitfalls / notes

- Service discovery is **two steps**: **DNS** (name→VIP) + **kernel forwarding** (VIP→Pod IP).
- If DNS works but traffic fails, check:
  - EndpointSlice is empty (no ready Pods)
  - kube-proxy mode / rules
  - CNI routing between nodes
- Headless Service changes behavior: DNS returns Pod IPs directly.

