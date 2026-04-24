# What Data Should Be Migrated (Legacy → New System)

## 1. Core Principle

Not all data should be migrated.

Migration should be **selective**, based on:
- Business value
- Usage frequency
- Data lifecycle
- Migration cost

---

## 2. Data That MUST Be Migrated

### 2.1 Master Data
Examples:
- Customer
- Product
- Account
- Policy

Reason:
- Core business entities
- Required across systems
- Used as references (foreign keys)

---

### 2.2 Active / In-Progress Data
Examples:
- Active policies
- Ongoing orders
- Pending transactions
- Claims in progress

Reason:
- Business must continue after migration
- Users still interact with these records

---

### 2.3 Reference Data
Examples:
- Code tables (status, types)
- Configuration data
- Dropdown values
- Product rules / rating factors

Reason:
- Required for system logic
- Ensures consistency of business rules

---

## 3. Data That May NOT Need Full Migration

### 3.1 Historical Data (Partial Migration)
Examples:
- Expired policies
- Completed orders
- Closed tickets

Strategy:
- Migrate recent data (e.g., last 1–2 years)
- Keep older data in legacy system (read-only)

---

### 3.2 Logs / Audit Data (Do NOT Migrate)
Examples:
- System logs
- Access logs
- Debug logs

Reason:
- Large volume
- Low business value

Alternative:
- Archive to cold storage or data lake

---

### 3.3 Derived / Computed Data (Do NOT Migrate)
Examples:
- Aggregated reports
- Calculated fields
- Cached values

Reason:
- Can be recalculated
- Avoid inconsistency

---

### 3.4 Temporary Data (Do NOT Migrate)
Examples:
- Session data
- Temp tables
- Cache

---

## 4. ID Strategy

### Option A: Keep Original IDs (Recommended)
- No mapping needed
- Simpler migration

### Option B: New IDs + Mapping Table
Use when:
- Data model changes significantly
- ID conflicts exist

---

## 5. Typical Migration Strategy

### Phase 1 – Initial Migration
- Master data
- Reference data
- Recent active data

### Phase 2 – Data Synchronization
- Use CDC or MQ
- Keep systems consistent

### Phase 3 – Gradual Cutover
- New data only goes to new system

### Phase 4 – Legacy Read-Only
- Old system keeps historical data

---

## 6. Summary

Data migration should focus on:
- Master data
- Active transactional data
- Reference data

Avoid migrating:
- Logs
- Temporary data
- Derived data

Historical data:
- Migrate partially or keep in legacy system
