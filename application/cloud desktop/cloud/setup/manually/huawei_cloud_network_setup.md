
# Huawei Cloud Deployment Guide
## Part 1 — VPC and Network Setup

This guide explains how to manually deploy the cloud desktop infrastructure on Huawei Cloud.

---

## Step 1 — Create VPC

Login to Huawei Cloud console:

Console → Network → Virtual Private Cloud (VPC)

Create a new VPC.

| Field | Value |
|---|---|
| Name | cloud-desktop-vpc |
| CIDR | 10.20.0.0/16 |

Result:

VPC network range

10.20.0.0 – 10.20.255.255

---

## Step 2 — Create Subnets

Inside the VPC create four subnets.

### Gateway Subnet

| Field | Value |
|---|---|
| Name | gateway-subnet |
| CIDR | 10.20.1.0/24 |

Used for:

- VAG servers

---

### Service Subnet

| Field | Value |
|---|---|
| Name | service-subnet |
| CIDR | 10.20.10.0/24 |

Used for:

- Kubernetes cluster nodes
- service pods

---

### Data Subnet

| Field | Value |
|---|---|
| Name | data-subnet |
| CIDR | 10.20.20.0/24 |

Used for:

- Redis
- Databases

---

### Desktop Subnet

| Field | Value |
|---|---|
| Name | desktop-subnet |
| CIDR | 10.20.32.0/20 |

Used for:

- Desktop virtual machines

---

## Step 3 — Security Groups

Create these security groups.

### sg-service

Allow:

- HTTP/HTTPS from load balancer
- internal traffic

### sg-vag

Allow:

- RDP or desktop protocol ports
- traffic from L4 load balancer

### sg-data

Allow only from service subnet:

- Redis 6379
- MySQL 3306
- PostgreSQL 5432
