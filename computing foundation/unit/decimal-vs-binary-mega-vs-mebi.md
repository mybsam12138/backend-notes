# Decimal (SI) vs Binary (IEC) Units  
## Mega vs Mebi — When to Use Which

This document explains **when decimal units (MB, GB)** are used and **when binary units (MiB, GiB)** are used, with practical scenarios from operating systems, storage, memory, JVM, and Kubernetes.

---

## 1. Two Measurement Systems

### 1.1 Decimal Units (SI, Base-10)

Defined by the International System of Units (SI).

| Unit | Name | Bytes |
|----|----|----|
| KB | Kilobyte | 1,000 |
| MB | Megabyte | 1,000,000 |
| GB | Gigabyte | 1,000,000,000 |
| TB | Terabyte | 1,000,000,000,000 |

**Base:** 10  
**Used when:** capacity, size, throughput, or commercial specification.

---

### 1.2 Binary Units (IEC, Base-2)

Defined by the IEC (International Electrotechnical Commission).

| Unit | Name | Bytes |
|----|----|----|
| KiB | Kibibyte | 1,024 |
| MiB | Mebibyte | 1,048,576 |
| GiB | Gibibyte | 1,073,741,824 |
| TiB | Tebibyte | 1,099,511,627,776 |

**Base:** 2  
**Used when:** memory addressing, OS-level resource management.

---

## 2. When Decimal Units Are Used

Decimal units (KB, MB, GB) are used in the following scenarios:

### 2.1 Storage Devices
- SSD / HDD
- USB drives
- SD cards
- Cloud block storage

Example:
- A **50 GB disk** = 50 × 1,000³ bytes

---

### 2.2 Network and Throughput
- Network bandwidth (Mbps, Gbps)
- Disk I/O throughput
- File transfer speed

Example:
- 100 MB/s = 100,000,000 bytes per second

---

### 2.3 Commercial and UI Contexts
- Product specifications
- Pricing plans
- Cloud service marketing

---

## 3. When Binary Units Are Used

Binary units (KiB, MiB, GiB) are used in the following scenarios:

### 3.1 Memory (RAM)
- Physical RAM
- Virtual memory
- Page cache
- JVM heap

Example:
- “4 GB RAM” actually means **4 GiB**

---

### 3.2 Operating Systems
- Linux `free`, `top`
- Linux `df` (shows GiB by default)
- Page size (4 KiB, 2 MiB)

---

### 3.3 Kubernetes
- Memory requests/limits: `Mi`, `Gi`
- Ephemeral storage (internally binary)
- Explicit unit enforcement to avoid ambiguity

---

### 3.4 JVM and Runtime Systems
- `-Xmx4g` → 4 GiB
- Garbage collection regions
- Native memory tracking

---

## 4. Why the Confusion Exists

| Area | What is written | What is meant |
|----|----|----|
| RAM | GB | GiB |
| Disk | GB | GB |
| OS tools | GB | GiB |
| Kubernetes | Gi | GiB |

Memory kept binary naming for compatibility, while storage switched to decimal for standardization and marketing.

---

## 5. Practical Rules You Can Trust

1. **Disk says GB → decimal (1000-based)**
2. **Memory says GB → binary (1024-based)**
3. **If you see `Mi` or `Gi` → always binary**
4. **If billing or marketing is involved → decimal**
5. **If OS or kernel is involved → binary**

---

## 6. One-Line Summary

> **Decimal units describe capacity for humans.  
> Binary units describe memory for machines.**
