# Monolith Project Localization Migration Guide

## 📌 Background

Current system stack:

- Application: Java Monolith
- Server: Apache Tomcat
- OS: Linux (CentOS)
- Database: MySQL
- Hardware: x86 (Intel/AMD)

Goal:

> Replace foreign technologies with domestic alternatives while keeping the system stable, secure, and maintainable.

---

# 🧠 1. Overall Strategy

Localization is NOT rewriting the system.

It is:

> Replacing infrastructure layer step by step with minimal impact on business logic.

Key principles:

- Keep business code unchanged as much as possible
- Replace components incrementally
- Validate each step with testing
- Ensure rollback capability

---

# 🧩 2. Target Architecture

| Layer        | Current        | Target Options                  |
|-------------|----------------|--------------------------------|
| CPU         | x86            | ARM (Kunpeng / Phytium)        |
| OS          | CentOS         | Kylin / UOS                    |
| Database    | MySQL          | GaussDB / OceanBase / DM       |
| Middleware  | Tomcat         | Keep or replace if required    |
| App         | Java Monolith  | No major change                |

---

# 🔄 3. Migration Steps (Recommended Order)

## Step 1: Environment Preparation

- Set up new servers with:
    - ARM CPU (if required)
    - Kylin or UOS OS
- Install Java runtime (ensure version compatibility)
- Install target database (GaussDB / OceanBase / DM)

---

## Step 2: Database Migration (Most Critical)

### Tasks:

- Analyze MySQL schema
- Convert schema to target database
- Migrate data (ETL tools or scripts)

### Key Challenges:

- SQL syntax differences
- Data type compatibility
- Index behavior
- Transaction and isolation differences

### Actions:

- Replace incompatible SQL
- Adjust ORM configurations (MyBatis / JPA)
- Test queries and performance

---

## Step 3: Application Adaptation

### Configuration Changes:

- Update JDBC driver
- Modify database connection URLs
- Adjust connection pool settings

### Code Changes (if needed):

- Fix database-specific SQL
- Remove MySQL-specific features (e.g., LIMIT syntax differences)

---

## Step 4: OS Compatibility

### Check:

- Shell scripts
- File paths
- Permissions
- Cron jobs

### Actions:

- Adapt scripts for new OS
- Verify system dependencies

---

## Step 5: Middleware (Tomcat)

### Option A (Recommended):
- Keep Tomcat (low risk)

### Option B:
- Replace with domestic middleware if required

### Actions:

- Validate deployment
- Check JVM parameters
- Test session handling and clustering

---

## Step 6: Hardware Migration (x86 → ARM)

### Risks:

- Native library incompatibility
- Performance differences

### Actions:

- Rebuild application for ARM if needed
- Verify third-party dependencies
- Conduct performance testing

---

## Step 7: Testing

### Required Testing:

- Functional testing
- Integration testing
- Performance testing
- Stability testing

### Focus Areas:

- Database queries
- Concurrency
- Transaction consistency

---

## Step 8: Deployment & Rollback Plan

### Deployment:

- Gradual rollout (canary or staging first)
- Monitor logs and metrics

### Rollback:

- Keep original system available
- Prepare data rollback strategy

---

# ⚠️ 4. Key Risks

- Database incompatibility (highest risk)
- Performance degradation
- Hidden dependency issues
- ARM architecture differences

---

# 💡 5. Best Practices

- Start with database proof-of-concept (POC)
- Use automated testing as much as possible
- Keep migration incremental
- Avoid changing business logic
- Document all changes

---

# 🚀 6. Key Takeaway

> Localization is mainly an infrastructure and compatibility migration, not a business rewrite.

The most critical part is:

- Database migration
- System stability
- Performance validation