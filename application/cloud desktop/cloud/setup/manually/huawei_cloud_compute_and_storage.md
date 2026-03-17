
# Huawei Cloud Deployment Guide
## Part 3 — Compute, Storage and Load Balancers

---

## Step 1 — Create Redis

Service: Distributed Cache Service (DCS)

| Setting | Value |
|---|---|
| Node Count | 3 |
| Memory | 16 GB |
| Subnet | data-subnet |

Purpose

- session cache
- connection state
- desktop status

---

## Step 2 — Create Databases

Service: Relational Database Service (RDS)

Create databases:

| Database | Purpose |
|---|---|
| WI DB | portal data |
| AUTH DB | authentication |
| DMS DB | desktop management |
| HDC DB | communication state |

Recommended spec

| CPU | Memory |
|---|---|
| 8 vCPU | 32 GB |

Subnet

data-subnet

---

## Step 3 — Create VAG Servers

Service: Elastic Cloud Server (ECS)

Create:

| Count | Spec |
|---|---|
| 3 | 8 vCPU / 16 GB |

Subnet

gateway-subnet

Install VAG gateway software.

---

## Step 4 — Create L7 Load Balancer

Service: Elastic Load Balance (ELB)

| Setting | Value |
|---|---|
| Type | HTTP/HTTPS |
| Target | Kubernetes service |

Traffic

User → L7 LB → WI

---

## Step 5 — Create L4 Load Balancer

| Setting | Value |
|---|---|
| Type | TCP |
| Target | VAG ECS |

Traffic

User → L4 LB → VAG → Desktop VM

---

## Step 6 — Create Desktop VM Pool

Create ECS instances.

| Spec | Value |
|---|---|
| CPU | 4 vCPU |
| Memory | 8 GB |

Subnet

desktop-subnet

Install VM agent.

---

Final architecture

Internet

L7 Load Balancer → WI (Kubernetes)

L4 Load Balancer → VAG

VAG → Desktop VM
