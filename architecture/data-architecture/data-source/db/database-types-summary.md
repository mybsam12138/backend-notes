# Database Types Overview

## 1. Introduction

Databases can be broadly categorized into different types based on how they store and organize data.

The three most common types are:

- Relational Databases (SQL)
- Non-relational Databases (NoSQL)
- Time-series Databases

---

## 2. Relational Databases (SQL)

### Definition

A **relational database** stores data in structured tables with predefined schemas and relationships between tables.

- Data is organized into rows and columns
- Tables are related using keys (primary key, foreign key)
- Uses SQL for querying

---

### Example Data Structure

#### Table: policy

| policy_id | customer_id | premium | claim |
|----------|------------|---------|-------|
| 1        | 1001       | 1000    | 200   |
| 2        | 1002       | 2000    | 500   |

#### Table: customer

| customer_id | name   |
|------------|--------|
| 1001       | Alice  |
| 1002       | Bob    |

---

### Key Characteristics

- Strong schema (fixed structure)
- ACID transactions
- Supports joins between tables

---

### Common Systems

- MySQL
- PostgreSQL
- Oracle
- SQL Server

---

## 3. Non-relational Databases (NoSQL)

### Definition

A **non-relational database** stores data in flexible, schema-less formats such as documents, key-value pairs, or graphs.

- No fixed schema
- Designed for scalability and flexibility
- No joins (or limited joins)

---

### Example Data Structure (Document DB)

```json
{
  "policy_id": 1,
  "customer": {
    "id": 1001,
    "name": "Alice"
  },
  "premium": 1000,
  "claim": 200
}
```

---

### Types of NoSQL

- Document DB (MongoDB)
- Key-Value (Redis)
- Column store (Cassandra)
- Graph DB (Neo4j)

---

### Key Characteristics

- Flexible schema
- High scalability
- Faster for certain workloads

---

## 4. Time-series Databases

### Definition

A **time-series database** is optimized for storing and querying data that changes over time.

- Each record has a timestamp
- Designed for high write volume and time-based queries

---

### Example Data Structure

```text
timestamp           metric       value   host
2024-01-01 10:00    cpu_usage    60      server1
2024-01-01 10:01    cpu_usage    65      server1
2024-01-01 10:02    cpu_usage    70      server1
```

---

### Key Characteristics

- Time-based indexing
- Efficient aggregation over time (avg, max, min)
- High ingestion rate

---

### Common Systems

- InfluxDB
- Prometheus
- TimescaleDB

---

## 5. Comparison Summary

| Feature            | Relational DB | NoSQL DB | Time-series DB |
|-------------------|--------------|----------|----------------|
| Schema            | Fixed        | Flexible | Semi-fixed     |
| Structure         | Tables       | JSON / KV| Time-indexed   |
| Query Language    | SQL          | Varies   | Specialized    |
| Use Case          | Transactions | Flexible apps | Monitoring / metrics |
| Example           | MySQL        | MongoDB  | InfluxDB       |

---

## 6. Key Insight

> Different database types are optimized for different use cases.  
> Choosing the right one depends on data structure, query patterns, and scalability needs.

---

## 7. One-line Summary

> Relational = structured data  
> NoSQL = flexible data  
> Time-series = time-based data
