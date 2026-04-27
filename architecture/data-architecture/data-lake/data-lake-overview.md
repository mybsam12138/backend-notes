# Data Lake - Overview

## 1. What is a Data Lake?

A **Data Lake** is a centralized storage system that can store large amounts of **raw data** in its original format.

It can store:

- Structured data
- Semi-structured data
- Unstructured data

Examples:

- Database records
- JSON files
- CSV files
- Logs
- Images
- Videos
- IoT data

---

## 2. Why Do We Need a Data Lake?

A traditional **Data Warehouse** usually requires data to be cleaned and structured before loading.

A **Data Lake** allows data to be stored first and processed later.

```text
Data Warehouse = clean first, store later
Data Lake      = store first, clean later
```

---

## 3. Core Idea

```text
Raw Data → Data Lake → Processing → Analytics / AI / Data Warehouse
```

The data lake acts as a large storage layer for different kinds of data.

---

## 4. Data Lake vs Data Warehouse

| Aspect | Data Lake | Data Warehouse |
|---|---|---|
| Data type | Raw, structured, semi-structured, unstructured | Cleaned and structured |
| Schema | Schema-on-read | Schema-on-write |
| Main use | Storage, exploration, AI, big data processing | Reporting and analytics |
| Cost | Usually cheaper | Usually more expensive |
| Users | Data engineers, data scientists | Analysts, business users |

---

## 5. Schema-on-Read vs Schema-on-Write

### Schema-on-Write

Used by data warehouses.

Data must be cleaned and modeled before it is loaded.

```text
Clean → Structure → Load → Query
```

---

### Schema-on-Read

Used by data lakes.

Data can be stored first, and the structure is applied when reading or processing it.

```text
Store raw data → Apply schema when needed
```

---

## 6. Typical Data Lake Architecture

```text
Data Sources
   ↓
Ingestion Layer
   ↓
Data Lake Storage
   ↓
Processing Layer
   ↓
Analytics / AI / Data Warehouse
```

---

## 7. Common Data Sources

- OLTP databases
- Application logs
- User behavior events
- Files
- APIs
- IoT devices
- External data providers

---

## 8. Common Data Lake Layers

### 8.1 Raw Zone

Stores original data without modification.

Purpose:

- Keep original source data
- Support reprocessing
- Preserve auditability

---

### 8.2 Cleansed Zone

Stores cleaned and standardized data.

Examples:

- Remove invalid records
- Convert date formats
- Standardize enum values

---

### 8.3 Curated Zone

Stores business-ready data.

This data can be used for:

- Analytics
- Machine learning
- Data warehouse loading
- BI reporting

---

## 9. Common Technologies

### Storage

- Amazon S3
- Azure Data Lake Storage
- Google Cloud Storage
- HDFS

---

### Processing

- Apache Spark
- Apache Flink
- Hadoop MapReduce

---

### Streaming / Ingestion

- Apache Kafka
- Apache NiFi
- Debezium

---

### Table Formats

- Apache Iceberg
- Delta Lake
- Apache Hudi

---

## 10. Data Lake and Big Data

Data lakes are commonly used in big data systems because they can store massive amounts of diverse data.

```text
Big Data Ecosystem
   ├── Data Lake
   ├── Kafka
   ├── Spark
   ├── Data Warehouse
   └── BI / AI
```

---

## 11. Data Lake and Data Warehouse Relationship

A data lake does not always replace a data warehouse.

In many systems, they work together:

```text
Raw data → Data Lake → Cleaned data → Data Warehouse → BI reports
```

The data lake is used for raw and large-scale data storage, while the data warehouse is used for structured analytics and reporting.

---

## 12. When to Use a Data Lake

Use a data lake when:

- You need to store large amounts of raw data
- Data formats are diverse
- You need big data processing
- You need machine learning or AI use cases
- You want to keep original data for future processing

---

## 13. When NOT to Use a Data Lake

Do not use a data lake when:

- You only need simple reporting
- Your data volume is small
- Your data is already clean and structured
- You do not have a clear data governance strategy

---

## 14. Common Problems

### 14.1 Data Swamp

A data lake can become a **data swamp** if data is stored without organization, metadata, or governance.

---

### 14.2 Poor Data Quality

Raw data may contain:

- Duplicates
- Missing values
- Invalid formats
- Inconsistent meanings

---

### 14.3 Difficult Data Discovery

Without metadata and cataloging, users may not know what data exists or how to use it.

---

## 15. Best Practices

- Organize data into zones
- Keep raw data immutable
- Add metadata and data catalog
- Apply access control
- Track data lineage
- Monitor data quality
- Define ownership for important datasets

---

## 16. One-line Summary

> A Data Lake is a large-scale storage system for raw and diverse data, commonly used in big data architecture, AI, and advanced analytics.
