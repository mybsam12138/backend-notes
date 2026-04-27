# Distributed Storage - Principles Overview

## 1. What is Distributed Storage?

Distributed storage is a system that stores data across multiple machines (nodes) instead of a single server.

Single machine → limited capacity, single point of failure  
Multiple machines → scalable, reliable

---

## 2. Core Idea

Big data → split into smaller pieces → store across many nodes

---

## 3. Key Principles

### 3.1 Data Partitioning (Sharding)

Data is split into smaller chunks.

Example:
1 TB file → split into 100 blocks → stored on different nodes

Purpose:
- Parallel processing
- Scalable storage

---

### 3.2 Replication

Each data block is copied to multiple nodes.

Example:
Block A → Node1, Node2, Node3

Purpose:
- Fault tolerance
- High availability

---

### 3.3 Fault Tolerance

System continues working even if some nodes fail.

Node failure → data still available from replicas

---

### 3.4 Data Locality

Move computation to where data is stored.

Process data on Node1 instead of transferring data over network

Benefit:
- Faster processing
- Reduced network overhead

---

### 3.5 Scalability

System can grow by adding more machines.

More data → add more nodes

---

### 3.6 Consistency Models

Different systems choose different trade-offs:
- Strong consistency
- Eventual consistency

Based on CAP theorem

---

### 3.7 Metadata Management

Tracks:
- Where data blocks are stored
- Replication status

Example: NameNode (HDFS)

---

## 4. Architecture Example (HDFS)

Client → NameNode (metadata) → DataNodes (data storage)

---

## 5. Data Flow Example

### Write

1. Split file into blocks
2. Store blocks on multiple nodes
3. Replicate each block

### Read

1. Query metadata
2. Read blocks in parallel

---

## 6. Advantages

- High scalability
- Fault tolerance
- High throughput
- Cost-effective

---

## 7. Challenges

- Data consistency
- Network complexity
- Coordination overhead

---

## 8. When to Use

- Large data (TB/PB)
- High availability required
- Parallel processing needed

---

## 9. When NOT to Use

- Small data
- Simple systems

---

## 10. One-line Summary

Distributed storage splits data across multiple machines, replicates it for reliability, and enables scalable and parallel processing.
