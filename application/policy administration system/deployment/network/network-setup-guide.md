# PAS Network Setup Guide (On-Premise Deployment)

---

## 1. Overview

This document describes:

- What infrastructure to purchase
- How to set up the internal network
- How to prepare network environment for PAS deployment

Target architecture:

- On-Premise
- Internal network only (no Internet exposure)
- Multi-subnet isolation
- Load-balanced application layer

---

## 2. What to Buy (Hardware & Resources)

### 2.1 Network Connectivity

#### Option A — Fully Internal System (Recommended)
- ❌ No public Internet required
- ✅ Only internal LAN or enterprise network

#### Option B — Limited External Access (Optional)
- Internet bandwidth (ISP)
- Public IP (if remote access needed)

---

### 2.2 Core Network Devices

#### 1. Router / Gateway
- Connect internal network to:
    - Internet (optional)
    - Other corporate networks
- Supports:
    - NAT
    - Routing
    - Access control

---

#### 2. Switch (L2 / L3)

- Connect all servers in LAN
- Recommended:
    - Managed switch (supports VLAN)

---

#### 3. Firewall (Very Important)

- Control traffic between:
    - Subnets
    - External access

---

### 2.3 Servers (Compute Nodes)

- Application servers (2+)
- Redis servers (2)
- Database servers (2)
- Load balancer server (1)
- Bastion host (1)

---

## 3. Network Design

### 3.1 IP Planning

Example:

```
10.0.0.0/16
```

---

### 3.2 Subnet Design

| Subnet | CIDR | Purpose |
|--------|------|--------|
| Access | 10.0.1.0/24 | Load Balancer |
| App | 10.0.2.0/24 | Application servers |
| Cache | 10.0.3.0/24 | Redis |
| Data | 10.0.4.0/24 | Database |
| Mgmt | 10.0.5.0/24 | Bastion / Monitoring |

---

### 3.3 VLAN Mapping (Optional but Recommended)

| VLAN | Subnet |
|------|--------|
| VLAN 10 | Access |
| VLAN 20 | App |
| VLAN 30 | Cache |
| VLAN 40 | Data |
| VLAN 50 | Mgmt |

---

## 4. Network Setup Steps

---

### Step 1 — Configure Switch

- Enable VLAN
- Assign ports to VLAN

Example:

```
Port 1-4 → VLAN 20 (App)
Port 5-6 → VLAN 30 (Redis)
Port 7-8 → VLAN 40 (DB)
```

---

### Step 2 — Configure Router / Gateway

- Set gateway IP for each subnet

Example:

```
Access: 10.0.1.1
App:    10.0.2.1
Cache:  10.0.3.1
Data:   10.0.4.1
Mgmt:   10.0.5.1
```

- Enable routing between subnets

---

### Step 3 — Configure Firewall Rules

#### Allow:

- Access → App (HTTP/HTTPS)
- App → Redis (6379)
- App → DB (3306 / 5432)

#### Deny:

- External → DB ❌
- External → Redis ❌
- App → Mgmt ❌ (optional)

---

### Step 4 — Assign Static IP to Servers

Example:

| Server | IP |
|--------|----|
| LB | 10.0.1.10 |
| App1 | 10.0.2.11 |
| App2 | 10.0.2.12 |
| Redis Primary | 10.0.3.11 |
| Redis Standby | 10.0.3.12 |
| DB Primary | 10.0.4.11 |
| DB Standby | 10.0.4.12 |
| Bastion | 10.0.5.10 |

---

### Step 5 — Setup Internal DNS (Optional)

- Map service names:

```
pas.internal → 10.0.1.10
db.internal → 10.0.4.11
redis.internal → 10.0.3.11
```

---

### Step 6 — Setup Load Balancer (Nginx)

- Bind internal VIP (e.g. 10.0.1.10)
- Route traffic to app servers

---

## 5. Network Flow

```
User → Load Balancer → App → Redis / DB
```

---

## 6. Key Design Principles

### Security
- No direct access to DB/Redis
- Use subnet isolation
- Use firewall rules

---

### Stability
- Static IP assignment
- Internal network only

---

### Simplicity
- Avoid unnecessary Internet exposure
- Use Nginx instead of complex LB

---

## 7. Common Mistakes

❌ Put DB in same subnet as user  
❌ Open DB port to all network  
❌ No firewall rules  
❌ Use dynamic IP

---

## 8. Summary

This network setup provides:

- Secure internal environment
- Clear network segmentation
- Support for high availability architecture

Suitable for:

- PAS systems
- Banking systems
- Enterprise internal systems