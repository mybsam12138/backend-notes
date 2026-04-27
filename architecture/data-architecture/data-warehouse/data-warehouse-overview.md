# Data Warehouse - Overview

## 1. What is a Data Warehouse?

A **Data Warehouse (DW)** is a system designed for **data analysis and reporting**, rather than transactional operations.

> It stores **historical, structured data** optimized for querying and analytics.

---

## 2. OLTP vs OLAP

### OLTP (Online Transaction Processing)

* Used in business systems (e.g., PAS, CRM)
* Handles create / update / delete operations
* Optimized for fast writes and consistency

### OLAP (Online Analytical Processing)

* Used in data warehouse
* Handles complex queries and aggregations
* Optimized for read-heavy workloads

---

### Comparison

| Aspect            | OLTP                | OLAP                  |
| ----------------- | ------------------- | --------------------- |
| Purpose           | Business operations | Analytics & reporting |
| Data              | Current             | Historical            |
| Queries           | Simple              | Complex               |
| Performance focus | Write               | Read                  |

---

## 3. Why Do We Need a Data Warehouse?

### Problem with using business DB directly

* Complex joins across many tables
* Slow queries
* Impacts production performance
* Hard to maintain historical data

---

### Solution

```text id="o7r7az"
OLTP DB → ETL / CDC → Data Warehouse → BI / Reports
```

---

## 4. Core Components

---

### 4.1 Data Sources

* Business databases (OLTP)
* External systems
* Logs / APIs

---

### 4.2 ETL / Data Pipeline

* Extract data
* Transform data (clean, map, aggregate)
* Load into warehouse

---

### 4.3 Data Warehouse Storage

Stores structured analytical data

---

### 4.4 BI / Reporting Layer

* Dashboards
* Reports
* Data visualization

---

## 5. Data Modeling (Core Concept)

---

### 5.1 Fact Table

Stores measurable data

Examples:

* premium amount
* claim amount
* transaction count

---

### 5.2 Dimension Table

Stores descriptive attributes

Examples:

* time (day, month, year)
* product
* customer
* region

---

---

### 5.3 Star Schema

```text id="y9xxtc"
        dim_product
             |
dim_time — fact_premium — dim_customer
             |
        dim_region
```

---

👉 Benefits:

* Simple queries
* Fast aggregation
* Easy to extend

---

## 6. ETL vs CDC

---

### ETL (Batch)

* Runs periodically (daily/hourly)
* Good for large data processing

---

### CDC (Change Data Capture)

* Real-time or near real-time
* Captures database changes (insert/update/delete)

---

## 7. Common Technologies

---

### Data Warehouse

* Snowflake
* Amazon Redshift
* Google BigQuery
* ClickHouse

---

### Data Pipeline

* Apache Airflow
* Apache NiFi

---

### Streaming / CDC

* Apache Kafka
* Debezium

---

## 8. Architecture Overview

```text id="8uzm68"
[ OLTP Systems ]
        ↓
 ETL / CDC Pipeline
        ↓
[ Data Warehouse ]
        ↓
[ BI / Analytics ]
```

---

## 9. Key Characteristics

* Read-heavy workload
* Optimized for aggregation queries
* Stores historical data
* Denormalized schema (for performance)

---

## 10. When to Use a Data Warehouse

Use it when:

* You need reporting and analytics
* Data volume is large
* Queries are complex (multi-table, aggregation)
* You want to avoid impacting production systems

---

## 11. When NOT to Use It

Do NOT use it for:

* Real-time transactions
* Simple CRUD operations
* High-frequency updates

---

## 12. One-line Summary

> A Data Warehouse is a system that stores transformed and historical data from multiple sources, optimized for analytical queries and reporting.
