
# Huawei Cloud Terraform Deployment Guide (Updated)
## Cloud Desktop Infrastructure (500–2000 Users)

This version updates the original guide with these changes:

- Redis changed to **cluster mode**
- Database changed to **one primary + one standby**
- Four logical databases share **one RDS instance**
  - `wi_db`
  - `auth_db`
  - `dms_db`
  - `hdc_db`
- Add explanation about **route tables**
- Expand **security group rules** between subnets and inside subnets

---

## 1. Recommended Provisioning Order

```text
Terraform
   ↓
VPC
   ↓
Subnets
   ↓
Route Tables
   ↓
Security Groups
   ↓
CCE Kubernetes Cluster
   ↓
Worker Nodes (ECS)
   ↓
Redis Cluster (DCS)
   ↓
RDS Primary/Standby
   ↓
VAG ECS Nodes
   ↓
Desktop VM Pool
```

---

## 2. Network Layout

| Subnet | CIDR | Purpose |
|---|---|---|
| gateway-subnet | 10.20.1.0/24 | VAG ECS, L4 entry side |
| service-subnet | 10.20.10.0/24 | CCE worker nodes, service pods |
| data-subnet | 10.20.20.0/24 | Redis, RDS |
| desktop-subnet | 10.20.32.0/20 | Desktop VMs |

---

## 3. VPC and Subnets

```hcl
resource "huaweicloud_vpc" "desktop_vpc" {
  name = "cloud-desktop-vpc"
  cidr = "10.20.0.0/16"
}

resource "huaweicloud_vpc_subnet" "gateway" {
  name       = "gateway-subnet"
  cidr       = "10.20.1.0/24"
  gateway_ip = "10.20.1.1"
  vpc_id     = huaweicloud_vpc.desktop_vpc.id
}

resource "huaweicloud_vpc_subnet" "service" {
  name       = "service-subnet"
  cidr       = "10.20.10.0/24"
  gateway_ip = "10.20.10.1"
  vpc_id     = huaweicloud_vpc.desktop_vpc.id
}

resource "huaweicloud_vpc_subnet" "data" {
  name       = "data-subnet"
  cidr       = "10.20.20.0/24"
  gateway_ip = "10.20.20.1"
  vpc_id     = huaweicloud_vpc.desktop_vpc.id
}

resource "huaweicloud_vpc_subnet" "desktop" {
  name       = "desktop-subnet"
  cidr       = "10.20.32.0/20"
  gateway_ip = "10.20.32.1"
  vpc_id     = huaweicloud_vpc.desktop_vpc.id
}
```

---

## 4. Do We Need Route Tables?

### Short answer

Usually for this design, **the default VPC route table is enough at the beginning**.

Reason:

- all subnets are inside the same VPC
- Huawei Cloud automatically provides local routing inside the VPC
- no NAT Gateway in this design
- no custom transit routing in this design

### When to add custom route tables

You should add or customize route tables when:

- different subnets need different next-hop behavior
- some subnets should reach special appliances
- you add NAT Gateway / firewall / peering / enterprise router later

### Recommendation for this architecture

- **Start with default route behavior**
- keep route tables explicit in Terraform for readability
- do not add complex custom routes unless there is a real need

Example:

```hcl
resource "huaweicloud_vpc_route_table" "main_rt" {
  name = "desktop-main-rt"
  vpc_id = huaweicloud_vpc.desktop_vpc.id
}
```

If you want stricter separation later, you can create one route table per subnet class.

---

## 5. Security Group Design

The original rules were too simple.  
This architecture should use **different security groups by role**, and traffic should be restricted both:

- **between subnets**
- **inside each subnet / role**

Recommended groups:

| Security Group | Applied To |
|---|---|
| sg-vag | VAG ECS |
| sg-service | CCE worker nodes / service workloads |
| sg-data | Redis / RDS |
| sg-desktop | Desktop VMs |
| sg-lb | Optional ELB related group if needed |
| sg-mgmt | Optional bastion / monitoring if later added |

### 5.1 Cross-subnet traffic rules

| Source | Destination | Port / Protocol | Purpose |
|---|---|---|---|
| Internet | WI ELB | 80/443 TCP | Web portal access |
| Internet | L4 ELB | desktop protocol TCP/UDP | Desktop access |
| L4 ELB / VAG | Desktop VMs | desktop protocol ports | Graphical session |
| service-subnet | data-subnet | 6379 TCP | Redis access |
| service-subnet | data-subnet | 3306 TCP | RDS access |
| service-subnet | desktop-subnet | VM agent / control ports | HDC control |
| desktop-subnet | service-subnet | VM agent callback ports | agent reporting |
| gateway-subnet | service-subnet | control / registration ports if needed | VAG control path |

### 5.2 Same-subnet / same-role rules

You also need to think about **intra-group traffic**.

#### sg-service
Allow only what is needed:

- 80/443 from ELB to WI
- internal service-to-service ports between WI / AUTH / DMS / HDC
- kubelet / CNI / node internal traffic as required by CCE
- deny unnecessary wide-open all-port access if possible

#### sg-data
Allow only:

- 6379 from sg-service to Redis
- 3306 from sg-service to RDS
- replication / HA traffic managed by the cloud service itself
- no Internet ingress
- no desktop direct DB access unless explicitly required

#### sg-desktop
Allow only:

- desktop protocol traffic from sg-vag
- VM agent control/report ports with sg-service / HDC
- deny direct Internet ingress
- avoid allowing all ports from service subnet unless required

#### sg-vag
Allow only:

- desktop protocol from L4 ELB / public side
- management/control ports to service subnet if needed
- desktop protocol to desktop VMs
- no broad access to data subnet

### 5.3 Terraform example

```hcl
resource "huaweicloud_networking_secgroup" "service_sg" {
  name = "sg-service"
}

resource "huaweicloud_networking_secgroup" "data_sg" {
  name = "sg-data"
}

resource "huaweicloud_networking_secgroup_rule" "service_to_redis" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 6379
  port_range_max    = 6379
  remote_group_id   = huaweicloud_networking_secgroup.service_sg.id
  security_group_id = huaweicloud_networking_secgroup.data_sg.id
}

resource "huaweicloud_networking_secgroup_rule" "service_to_rds" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 3306
  port_range_max    = 3306
  remote_group_id   = huaweicloud_networking_secgroup.service_sg.id
  security_group_id = huaweicloud_networking_secgroup.data_sg.id
}
```

Note: exact provider field names can vary by version, so check the provider docs when implementing.

---

## 6. CCE Cluster

```hcl
resource "huaweicloud_cce_cluster" "desktop_cluster" {
  name         = "desktop-cce"
  cluster_type = "VirtualMachine"
  vpc_id       = huaweicloud_vpc.desktop_vpc.id
  subnet_id    = huaweicloud_vpc_subnet.service.id
}
```

---

## 7. CCE Worker Nodes

```hcl
resource "huaweicloud_cce_node_pool" "worker_nodes" {
  cluster_id          = huaweicloud_cce_cluster.desktop_cluster.id
  initial_node_count  = 3
  flavor_id           = "c6.large"

  root_volume {
    size = 50
  }

  data_volumes {
    size = 100
  }
  
   node_config {
    security_group_id = huaweicloud_networking_secgroup.service_sg.id
  }
}
```

These nodes run:

- WI
- AUTH
- DMS
- HDC

---

## 8. Redis: Change to Cluster Mode

The old example looked like a single instance, which risks a single point of failure.  
For this architecture, Redis should use **cluster mode**.

Design goal:

- sharding support
- higher throughput
- better HA than single-node mode

Conceptual Terraform example:

```hcl
resource "huaweicloud_dcs_instance" "redis_cluster" {
  name           = "desktop-redis-cluster"
  engine         = "Redis"
  engine_version = "5.0" # or 6.0 depending on support

  capacity       = 16
  vpc_id         = huaweicloud_vpc.desktop_vpc.id
  subnet_id      = huaweicloud_vpc_subnet.data.id

  # 🔥 CRITICAL: enable cluster mode
  instance_mode  = "cluster"   # or "RedisCluster" depending on provider

  # 🔥 shards (masters)
  shard_count    = 3

  # 🔥 replicas per shard
  replica_count  = 1

  available_zones = [
    "ap-southeast-1a",
    "ap-southeast-1b"
  ]

  security_group_id = huaweicloud_networking_secgroup.data_sg.id

  # Optional but recommended
  password = "YourStrongPassword123!"

  # Optional tuning
  maintain_begin = "02:00"
  maintain_end   = "06:00"
}
```

### Recommendation

For production, prefer:

- Redis Cluster mode
- multi-AZ if available
- at least one replica per shard

---

## 9. Database: One Primary + One Standby, Four Databases in One Instance

The old document implied four separate RDS instances.  
That is usually unnecessary here.

Recommended design:

- **one RDS instance**
- **primary/standby HA**
- create four logical databases inside it

Logical databases:

- `wi_db`
- `auth_db`
- `dms_db`
- `hdc_db`

Conceptual Terraform example:

```hcl
resource "huaweicloud_rds_instance" "main_rds" {
  name      = "desktop-main-rds"
  flavor    = "rds.mysql.xlarge"
  vpc_id    = huaweicloud_vpc.desktop_vpc.id
  subnet_id = huaweicloud_vpc_subnet.data.id

  # Conceptual HA fields, verify exact provider schema
  availability_zone_mode = "multi"
  # primary/standby mode according to provider version
  security_group_id  = huaweicloud_networking_secgroup.data_sg.id

}
```

### What this means

- **1 RDS instance**
- **1 primary + 1 standby**
- inside the instance, create:
  - `wi_db`
  - `auth_db`
  - `dms_db`
  - `hdc_db`

### Why this is better

Compared with four separate instances:

- cheaper
- easier to manage
- still has HA at the instance level
- enough for this scale in most cases

---

## 10. VAG ECS

```hcl
resource "huaweicloud_compute_instance" "vag_nodes" {
  count       = 3
  name        = "vag-${count.index}"
  flavor_name = "c6.large"

  network {
    uuid = huaweicloud_vpc_subnet.gateway.id
  }
}
```

VAG remains on ECS rather than Kubernetes because it is:

- high-bandwidth
- long-connection
- latency-sensitive
- data-plane oriented

---

## 11. Desktop VM Pool

```hcl
resource "huaweicloud_compute_instance" "desktop_vm" {
  count       = 100
  name        = "desktop-${count.index}"
  flavor_name = "c6.large"

  network {
    uuid = huaweicloud_vpc_subnet.desktop.id
  }
}
```

---

## 12. Final Recommended Traffic Model

```text
Internet
   ↓
CCE LoadBalancer Service (WI)
   ↓
WI Pods

Internet
   ↓
L4 Load Balancer
   ↓
VAG ECS
   ↓
Desktop VMs

Service Pods
   ↓
Redis Cluster / RDS Primary-Standby
```

---

## 13. Final Architecture Recommendations

### Route tables
- default VPC routing is enough initially
- keep route table resource explicit if you want clean IaC
- add custom routes only when the topology becomes more complex

### Security groups
- the original single HTTP rule was too weak
- use role-based SGs
- limit both inter-subnet and intra-role traffic
- do not allow wide-open data subnet access
- do not allow direct Internet ingress to desktop VMs or databases

### Redis
- use cluster mode
- avoid single-node deployment

### Database
- use one RDS instance with primary/standby
- create four logical databases inside it
