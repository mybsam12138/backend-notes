# Data Synchronization Guide

## 1. What is Data Synchronization
Data synchronization is the process of keeping data consistent across multiple systems, databases, or services.

---

## 2. Common Scenarios

### 2.1 System Integration
- CRM ↔ ERP
- Payment system ↔ Order system

### 2.2 Microservices Architecture
- Service A updates data → Service B needs the same data

### 2.3 Data Migration / System Upgrade
- Old system → New system
- Hybrid period (both systems running)

### 2.4 Reporting / Data Warehouse
- OLTP DB → Data Warehouse
- Near real-time or batch sync

### 2.5 Multi-region / Multi-active Systems
- Data sync between regions for high availability

---

## 3. Data Sync Strategies

### 3.1 Batch Sync
- Scheduled jobs (cron)
- Suitable for:
  - Non-real-time requirements
  - Large data volume

### 3.2 Real-time Sync (Event-driven)
- Message Queue (Kafka, RabbitMQ)
- Publish/Subscribe pattern

### 3.3 CDC (Change Data Capture)
- Capture DB changes (INSERT/UPDATE/DELETE)
- Tools:
  - Debezium
  - Canal
- Near real-time

### 3.4 API-based Sync
- System A calls System B API
- Simple but tightly coupled

### 3.5 Database-level Sync
- Replication (MySQL binlog, PostgreSQL logical replication)

### 3.6 Remote Table Link (DB Link / Foreign Table)
- Directly access remote database tables from local database
- Examples:
  - Oracle DB Link
  - PostgreSQL Foreign Data Wrapper (FDW)
  - MySQL FEDERATED table
- Features:
  - Query remote data in real-time (no duplication)
  - Join local + remote tables
- Suitable for:
  - Low latency requirement but low write volume
  - Simple integration without building sync pipeline

---

## 4. When to Use What

| Scenario | Recommended Approach |
|--------|---------------------|
| Simple system integration | API |
| High decoupling required | MQ |
| DB-level consistency | CDC |
| Large data nightly sync | Batch |
| Cross-region sync | Replication + CDC |
| Quick integration / low volume | Remote Table Link |

---

## 5. Key Challenges

### 5.1 Data Consistency
- Eventual consistency vs strong consistency

### 5.2 Data Transformation
- Different schema between systems

### 5.3 Idempotency
- Avoid duplicate processing

### 5.4 Performance
- Remote table may introduce latency

### 5.5 Failure Handling
- Network issues impact remote queries

---

## 6. Best Practices

- Use unique IDs (UUID)
- Design idempotent consumers
- Add retry + DLQ
- Monitor sync lag
- Avoid heavy joins on remote tables
- Cache remote data if needed

---

## 7. Simple Architecture Example

Producer → Message Queue → Consumer → Target DB

OR

Application → Remote Table Link → Remote DB

---

## 8. Summary

Data synchronization strategies include:
- Data movement: Batch / CDC / MQ
- Data access: API / Remote Table Link

Choosing depends on:
- Real-time requirement
- Data volume
- System coupling
- Performance considerations
