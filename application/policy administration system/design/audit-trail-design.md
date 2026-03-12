# Audit Trail Design (Diff-Based) for Enterprise Systems

## Goal

Track important business data changes while minimizing storage and performance impact.

Instead of storing full data snapshots, the system stores **only the field differences (diff)** when data changes.

This design is commonly used in enterprise systems such as:

- Policy Administration Systems (PAS)
- ERP systems
- Financial systems
- Compliance-heavy applications

---

# Core Architecture

Frontend  
↓  
DTO  
↓  
Service Layer (@Audit annotation)  
↓  
AOP Interceptor  
↓  
Load old entity from database  
↓  
Execute business logic  
↓  
Load new entity  
↓  
Compare entity fields  
↓  
Record changed fields  
↓  
Insert into audit_log table

The audit logic is **centralized in AOP**, so business services do not need to implement audit code.

---

# Service Layer Annotation

Audit interception is triggered by annotating service methods.

Example:

    @Audit(entity = "Policy")
    public void updatePolicy(PolicyUpdateRequest request) {
        policyRepository.update(request);
    }

The AOP interceptor performs the following steps automatically:

1. Get the entity ID from the method parameters
2. Load the **old entity state** from the database
3. Execute the service method
4. Load the **new entity state**
5. Compare the fields
6. Store the differences in the audit log

---

# Field Difference Comparison

The audit system compares the **old entity object** with the **new entity object**.

Example:

Old entity

    sumInsured = 100000
    premium = 500

New entity

    sumInsured = 120000
    premium = 500

Detected difference

    sumInsured
    100000 → 120000

Only changed fields are recorded.

---

# Audit Log Table Design

Example table structure:

Table: audit_log

| Column | Description |
|------|------|
| id | log id |
| entity_type | business entity (Policy, Client, etc.) |
| entity_id | primary identifier |
| field_name | changed field |
| old_value | value before change |
| new_value | value after change |
| changed_by | user id |
| changed_time | timestamp |

Example record:

| entity_type | entity_id | field_name | old_value | new_value |
|-------------|-----------|-----------|-----------|-----------|
| Policy | POL123 | sumInsured | 100000 | 120000 |

---

# Why Compare Entity Instead of Database Columns

The audit comparison should use **entity objects**, not database column names.

Correct architecture:

Frontend JSON  
↓  
DTO  
↓  
Domain Entity  
↓  
Database Table

Example:

Frontend JSON

    {
      "sumInsured": 120000
    }

Entity

    sumInsured

Database

    sum_insured

This keeps the system **loosely coupled** and avoids exposing database schema to the frontend.

---

# Ignoring Non-Business Fields

Some fields should not trigger audit logs.

Examples:

- updateTime
- updateUser
- version
- lastModified

These can be ignored using annotations.

Example:

    @AuditIgnore
    private LocalDateTime updateTime;

---

# Entities That Should Be Audited

Audit should only apply to **business-critical tables**.

Examples:

    policy
    client
    payment
    quotation
    endorsement

These tables affect:

- legal contracts
- financial records
- regulatory compliance

---

# Tables That Should NOT Be Audited

Technical or configuration tables usually do not require auditing.

Examples:

    menu
    system_config
    dictionary
    cache
    session

Auditing these tables would create unnecessary logs.

---

# Handling Multiple Field Changes

If multiple fields change in one operation, the audit system records each change.

Example policy update:

    sumInsured: 100000 → 120000
    premium: 500 → 600
    deductible: 1000 → 1500

Audit records:

    POL123 sumInsured 100000 → 120000
    POL123 premium 500 → 600
    POL123 deductible 1000 → 1500

---

# Key Design Principles

1. Do not expose database column names to the frontend  
   Use DTO and entity objects.

2. Compare entity objects instead of raw SQL rows.

3. Store only changed fields to reduce storage usage.

4. Use AOP interception to avoid duplicated audit code.

5. Allow fields to be excluded from audit logging.

6. Apply audit only to business-critical entities.

---

# Benefits of Diff-Based Audit

Advantages:

- Lower storage usage compared to full snapshots
- Simple and generic audit framework
- Easy integration into service layer
- Clear traceability of data changes
- Minimal impact on existing business logic

---

# Summary

The diff-based audit trail approach provides a lightweight and maintainable way to track business data changes.

By combining:

- Service layer annotations
- AOP interception
- entity comparison
- structured audit logging

the system can provide **full traceability of critical data changes** while keeping the implementation clean and efficient.