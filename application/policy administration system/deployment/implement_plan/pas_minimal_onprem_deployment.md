# PAS Minimal On-Premise Deployment (Cost-Optimized Plan)

---

## 1. Overview

This is a **low-cost deployment plan** for PAS system:

- On-Premise
- Internal network only
- Monolith application
- Minimal hardware
- Basic high availability (partial)

---

## 2. What to Buy

### 2.1 Network Devices

- 1 Home Router (gateway)
- 1 Managed Switch (VLAN support recommended)

---

### 2.2 Servers (2 Nodes Only)

| Node | Role |
|------|------|
| Node 1 | App1 + Redis Primary + MySQL Primary |
| Node 2 | App2 + Redis Standby + MySQL Standby |

---

### 2.3 Load Balancer

- Nginx (installed on Node1 or separate lightweight VM)

---

### 2.4 Cabling

- 3–5 Ethernet cables:
  - Router → Switch
  - Switch → Node1
  - Switch → Node2

---

## 3. Network Setup

### 3.1 Simple Network (No VLAN for cheapest setup)

All in same subnet:

```
192.168.1.0/24
```

---

### 3.2 IP Assignment

| Component | IP |
|----------|----|
| Router | 192.168.1.1 |
| Node1 | 192.168.1.10 |
| Node2 | 192.168.1.11 |
| Nginx VIP | 192.168.1.100 |

---

## 4. Deployment Steps

---

### Step 1 — Setup Network

- Connect Router → Switch
- Connect Switch → Nodes
- Assign static IP to nodes

---

### Step 2 — Install MySQL

Node1:
- MySQL Primary

Node2:
- MySQL Standby (replication)

---

### Step 3 — Install Redis

Node1:
- Redis Primary

Node2:
- Redis Replica

---

### Step 4 — Deploy Application

- Deploy Spring Boot app on both nodes
- Configure DB + Redis connection

---

### Step 5 — Setup Nginx

Install on Node1:

```
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
```

- Configure reverse proxy
- Optional: configure health check

---

### Step 6 — Testing

- Stop Node1 → verify Node2 works
- Stop Redis Primary → check failover
- Stop DB Primary → verify standby

---

## 5. Architecture Diagram (Simple)

```
User
  ↓
Nginx (Node1)
  ↓
App1 / App2
  ↓
Redis / MySQL
```

---

## 6. Limitations (Important)

- Single router (SPOF)
- Single switch (SPOF)
- No VLAN isolation
- Nginx not highly available

---

## 7. Upgrade Path

When budget increases:

- Add second switch
- Add VLAN segmentation
- Add dedicated LB node
- Add Redis Sentinel / Cluster
- Add DB HA (MGR / cluster)

---

## 8. Summary

This plan provides:

- Lowest cost deployment
- Basic redundancy (app + DB + Redis)
- Simple setup for learning or small enterprise

Suitable for:

- Demo
- Small internal PAS
- Learning architecture
