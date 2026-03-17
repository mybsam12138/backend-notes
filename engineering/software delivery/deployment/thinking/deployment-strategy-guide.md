# Deployment Strategy Guide for Backend Systems

## 1. Overview

When deploying a system, the deployment architecture is not chosen randomly — it is driven by **non-functional requirements (NFRs)** such as availability, scalability, security, and cost.

This document summarizes:

- Key deployment decision factors
- Deployment models
- Mapping between scenarios and deployment strategies

---

## 2. Key Deployment Factors (Non-Functional Requirements)

### 2.1 Availability (High Availability, HA)

**Definition:** System uptime requirement (e.g., 99.9%, 99.99%)

**Impacts:**
- Single node → Low availability
- Multi-node + failover → High availability

**Typical Solutions:**
- Active-Standby
- Active-Active
- Load Balancer + Health Check

---

### 2.2 Scalability

**Definition:** Ability to handle increasing traffic

**Types:**
- Vertical scaling (scale up)
- Horizontal scaling (scale out)

**Impacts:**
- Monolith → Hard to scale
- Stateless services → Easy horizontal scaling

---

### 2.3 Performance

**Definition:** Response time and throughput

**Impacts:**
- Need caching (Redis)
- Need CDN / edge nodes
- Need database read replicas

---

### 2.4 Fault Tolerance

**Definition:** Ability to survive failures

**Impacts:**
- Multi-zone deployment
- Retry / circuit breaker
- Service redundancy

---

### 2.5 Consistency vs Availability (CAP Tradeoff)

**Scenarios:**
- Financial systems → Strong consistency
- Social/media systems → Eventual consistency

---

### 2.6 Security

**Definition:** Protection of system and data

**Impacts:**
- Network isolation (VPC, subnet)
- Bastion host
- No public exposure for internal services

---

### 2.7 Cost

**Tradeoff:**
- Higher availability = higher cost
- Simpler architecture = cheaper

---

### 2.8 Deployment Complexity

**Impacts:**
- Kubernetes → complex but powerful
- ECS/VM → simple but less flexible

---

## 3. Deployment Models

### 3.1 Single Node Deployment

**Architecture:**
- One server
- All components on same machine

**Pros:**
- Simple
- Low cost

**Cons:**
- No HA
- Not scalable

**Use Case:**
- Dev / testing
- Small internal tools

---

### 3.2 Active-Standby Deployment

**Architecture:**
- Primary node + standby node
- Failover via VIP or DNS

**Pros:**
- High availability
- Simple failover

**Cons:**
- Resource waste (standby idle)

**Use Case:**
- Traditional enterprise systems
- Databases (primary-replica)

---

### 3.3 Active-Active Deployment

**Architecture:**
- Multiple active nodes
- Load balanced

**Pros:**
- High availability
- Better resource utilization

**Cons:**
- Data consistency challenges

**Use Case:**
- Stateless services
- Web applications

---

### 3.4 Microservices + Kubernetes

**Architecture:**
- Services split by domain
- Managed by Kubernetes

**Pros:**
- High scalability
- Auto-healing
- Rolling updates

**Cons:**
- High complexity
- Requires DevOps maturity

**Use Case:**
- Large-scale systems
- Cloud-native applications

---

### 3.5 Serverless (FaaS)

**Architecture:**
- No server management
- Event-driven execution

**Pros:**
- Auto scaling
- Pay per use

**Cons:**
- Cold start latency
- Limited control

**Use Case:**
- Event-driven workloads
- APIs with irregular traffic

---

### 3.6 Multi-Region Deployment

**Architecture:**
- Deploy across regions
- DNS or global LB routing

**Pros:**
- Disaster recovery
- Global low latency

**Cons:**
- Complex data sync
- High cost

**Use Case:**
- Global systems
- Mission-critical systems

---

## 4. Scenario → Deployment Strategy Mapping

| Scenario | Key Requirement | Recommended Deployment |
|--------|----------------|----------------------|
| Small internal tool | Low cost | Single Node |
| Enterprise system | High availability | Active-Standby |
| Web application | Scalability | Active-Active |
| High traffic system | Auto scaling | Kubernetes |
| Global SaaS | Low latency + DR | Multi-Region |
| Event-driven system | Cost efficiency | Serverless |
| Financial system | Strong consistency | Active-Standby + DB replication |

---

## 5. Key Design Decisions

### 5.1 Stateless vs Stateful

- Stateless → Easy scaling (recommended)
- Stateful → Needs special handling (DB, Redis)

---

### 5.2 Database Deployment

| Mode | Description | Use Case |
|------|------------|----------|
| Single DB | One instance | Dev |
| Primary-Replica | Read/write split | Medium systems |
| Cluster | Distributed DB | Large systems |

---

### 5.3 Network Design

- VPC isolation
- Subnet segmentation:
    - Public subnet (LB)
    - Private subnet (services)
    - Data subnet (DB)

---

### 5.4 Load Balancing

| Type | Use Case |
|------|--------|
| L4 (TCP) | RDP, database |
| L7 (HTTP) | Web apps |

---

## 6. Recommended Evolution Path

```
Single Node
   ↓
Active-Standby
   ↓
Active-Active
   ↓
Microservices (Kubernetes)
   ↓
Multi-Region
```

---

## 7. Summary

Deployment strategy depends on:

- Availability requirement
- Traffic scale
- Budget
- System complexity
- Team capability

**Golden Rule:**
> Start simple → evolve as system grows

---

## 8. Quick Decision Guide

| Requirement | Choose |
|------------|-------|
| Fast launch | Single Node |
| Avoid downtime | Active-Standby |
| Handle traffic | Active-Active |
| Cloud-native scaling | Kubernetes |
| Global users | Multi-Region |
| Cost sensitive | Serverless |

---

END