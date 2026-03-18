# PAS Deployment Guide (On-Premise Architecture)

---

## 1. Deployment Overview

This document summarizes:

1. Infrastructure required
2. Deployment steps

Based on the PAS architecture:
- On-Premise
- Internal network only
- Monolith application
- App: Active-Active
- Redis: Primary-Standby
- DB: Primary-Standby

---

## 2. Infrastructure Required

### 2.1 Network

- Internal LAN / VPC
- Subnets:
  - Access subnet (Load Balancer)
  - Application subnet
  - Cache subnet
  - Data subnet
  - Management subnet

---

### 2.2 Compute Resources

- 2+ Application servers
- 1 Redis Primary + 1 Redis Standby
- 1 DB Primary + 1 DB Standby
- 1 Load Balancer (Nginx or hardware LB)

---

### 2.3 Supporting Systems

- Bastion Host
- Monitoring system
- Logging system
- Backup system

---

## 3. Deployment Steps

### Step 1 — Prepare Infrastructure

- Provision servers (VM or physical)
- Configure internal network and firewall
- Assign IPs and subnets

---

### Step 2 — Deploy Database

- Install DB (MySQL / PostgreSQL / Oracle)
- Configure Primary
- Configure Standby replication
- Test failover

---

### Step 3 — Deploy Redis

- Install Redis on two nodes
- Configure replication (Primary → Standby)
- Enable AOF for persistence
- Optional: configure Sentinel

---

### Step 4 — Deploy Application

- Build application (Spring Boot JAR)
- Deploy to multiple servers
- Configure:
  - DB connection
  - Redis connection
- Ensure stateless design

---

### Step 5 — Deploy Load Balancer (Nginx)

- Install Nginx
- Configure upstream:

```
upstream backend {
    server app1:8080 max_fails=2 fail_timeout=5s;
    server app2:8080 max_fails=2 fail_timeout=5s;
}
```

- Configure reverse proxy
- Tune timeout settings

---

### Step 6 — Configure Monitoring & Logging

- Setup metrics collection
- Setup log aggregation
- Setup alerting

---

### Step 7 — Testing

- Functional testing
- Load testing
- Failover testing:
  - stop app node
  - stop Redis
  - stop DB

---

### Step 8 — Go Live

- Switch traffic to production
- Monitor system
- Prepare rollback plan

---

## 4. Deployment Flow

User → Load Balancer → App → Redis / DB

---

## 5. Key Best Practices

- Use short timeout for fast failover
- Keep app stateless
- Always use DB and Redis replication
- Enable persistence (AOF)
- Test failover regularly

---

## 6. Summary

This deployment approach ensures:

- High availability
- Internal security
- Simplicity for enterprise environments
