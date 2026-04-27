# ETL (Extract, Transform, Load) - Overview

## 1. What is ETL?

ETL stands for:

- **Extract** – Get data from source systems
- **Transform** – Clean, convert, and process data
- **Load** – Store data into a target system (usually a Data Warehouse)

---

## 2. Basic Flow

```text
Data Sources → Extract → Transform → Load → Data Warehouse
```

---

## 3. Step-by-Step Explanation

---

### 3.1 Extract

Retrieve data from different sources:

- Databases (MySQL, Oracle)
- APIs
- Files (CSV, JSON)
- Logs

```text
Goal: Collect raw data
```

---

### 3.2 Transform

Process the data:

- Clean invalid data
- Standardize formats
- Join multiple datasets
- Aggregate metrics
- Apply business logic

Example:

```text
"01-01-2026" → "2026-01-01"
"CLICK_BTN" → "click_button"
```

```text
Goal: Convert raw data into usable format
```

---

### 3.3 Load

Store processed data into target system:

- Data Warehouse
- Analytics DB

```text
Goal: Make data ready for querying and reporting
```

---

## 4. Types of ETL

---

### 4.1 Batch ETL

- Runs periodically (hourly/daily)
- Processes large volumes

```text
Example: Daily sales report
```

---

### 4.2 Real-time / Streaming ETL

- Processes data continuously
- Low latency

```text
Example: User activity tracking
```

---

## 5. ETL vs ELT

---

### ETL

```text
Transform BEFORE loading
```

```text
Extract → Transform → Load
```

---

### ELT

```text
Transform AFTER loading
```

```text
Extract → Load → Transform
```

---

## 6. Where ETL is Used

- Data Warehousing
- Reporting systems
- Business intelligence (BI)
- Data integration across systems

---

## 7. Common Tools

- Apache Airflow (workflow orchestration)
- Apache NiFi (data flow)
- Talend (ETL tool)
- Custom scripts (Java, Python)

---

## 8. Advantages

- Clean and structured data
- Optimized for analytics
- Centralized data processing

---

## 9. Challenges

- Complex pipeline maintenance
- Performance issues at scale
- Data quality problems
- Hard to adapt to changing requirements

---

## 10. Modern Evolution

Traditional ETL is evolving toward:

- ELT (used with Data Lakes)
- Streaming pipelines (Kafka-based)
- Data Lakehouse architectures

---

## 11. One-line Summary

> ETL is the process of extracting data from sources, transforming it into a usable format, and loading it into a system for analytics and reporting.
