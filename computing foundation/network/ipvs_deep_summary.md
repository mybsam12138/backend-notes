# IPVS (IP Virtual Server) – How It Works

## What IPVS Is
IPVS is a Linux kernel subsystem that implements **Layer 4 (L4) load balancing**. It distributes TCP/UDP connections to multiple backend servers using IP address and port information, without inspecting application-layer data.

It is part of the Linux Virtual Server (LVS) project and runs entirely in kernel space for high performance.

---

## What Problem IPVS Solves
When multiple servers provide the same service, IPVS answers one question:

> For a new connection, **which backend server should handle it?**

Once decided, all packets of that connection are forwarded consistently to the same backend.

---

## How IPVS Works (Step by Step)

1. A packet arrives at the Linux node
2. Kernel checks whether the destination IP:port matches a configured virtual service (VIP)
3. If matched and it is a **new connection**:
   - IPVS scheduler selects a backend server
   - A connection mapping is created in kernel memory
4. Packet destination is rewritten (or forwarded, depending on mode)
5. Packet is sent to the selected backend
6. Subsequent packets reuse the existing connection mapping (no re-scheduling)

---

## IPVS Operating Modes

### 1. NAT (Network Address Translation)
- Load balancer rewrites destination IP
- Backend replies go back through the load balancer
- Simple, widely used

### 2. DR (Direct Routing)
- Load balancer forwards request
- Backend replies directly to client
- Higher performance, requires special network setup

### 3. TUN (IP Tunneling)
- Packet encapsulated in IP tunnel
- Useful for cross-network backends

---

## Scheduling Algorithms

| Scheduler | Meaning |
|---------|--------|
| rr | Round Robin |
| wrr | Weighted Round Robin |
| lc | Least Connections |
| sh | Source IP Hash |

---

## Common IPVS Commands and Rules

### Create a virtual service
```bash
ipvsadm -A -t 10.0.0.100:80 -s rr
```
Creates a virtual service (VIP) on 10.0.0.100:80 using round-robin scheduling.

### Add backend servers
```bash
ipvsadm -a -t 10.0.0.100:80 -r 10.0.0.2:80 -m
ipvsadm -a -t 10.0.0.100:80 -r 10.0.0.3:80 -m
```
Adds two real servers in NAT mode.

### View IPVS table
```bash
ipvsadm -Ln
```
Shows virtual services, backends, and connection statistics.

---

## Key Characteristics
- Layer 4 only (IP + port + protocol)
- Connection-based (first packet decides backend)
- Extremely fast and scalable
- No understanding of HTTP, URLs, headers, or payloads

---

## Typical Use Cases
- Kubernetes Service load balancing (ipvs mode)
- High-performance TCP/UDP services
- Internal service meshes at L4

---

## One-Line Summary
IPVS intercepts new connections in the Linux kernel, selects a backend server once, records the mapping, and forwards all subsequent packets at kernel speed.

