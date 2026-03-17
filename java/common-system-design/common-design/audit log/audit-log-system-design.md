# Audit Log Design in Admin Backend Systems
## From Business Requirement to System Design

### Category
System Design

### Tags
Audit Log, Enterprise Backend, Admin System, Business Understanding, Data Modeling

---

## 1. Background

In enterprise admin backend systems, an **audit log** is not just a technical feature, but a core system capability.
It exists to support:

- Accountability
- Compliance and auditing
- Operational traceability
- Risk investigation and rollback analysis

A good audit log design must translate **business requirements** into **clear, scalable system structures**.

---

## 2. Two Levels of Auditing (Separation of Concerns)

Audit requirements should be clearly separated into two layers.

### 2.1 Entity-Level Audit (Basic Metadata)

This level focuses on **data lifecycle metadata**, usually stored directly on the business table.

Typical fields include:

- created_at
- created_by
- updated_at
- updated_by

Characteristics:

- Low storage cost
- Always enabled
- Automatically maintained
- Answers “who” and “when” at a high level

This layer is **technical auditing**, not business auditing.

---

### 2.2 Operation-Level Audit Log (Business Audit)

This layer records **every meaningful user operation** in a separate audit table.

It captures:

- Who performed the operation
- What entity was affected
- What type of action occurred (CREATE / UPDATE / DELETE)
- What exactly changed

Key properties:

- Append-only (never updated or deleted)
- Independent from business tables
- Designed for audit review and investigation

---

## 3. Core Design Principle: Record Changes, Not Snapshots

A critical requirement for audit logs is **readability**.

Instead of storing full object snapshots for every update, the system should record **only the fields that actually changed**.

### Why field-level diff matters:

- Reduces storage size
- Improves audit clarity
- Aligns with how auditors read change history
- Avoids noise from unchanged fields

This makes the audit log a **business-readable history**, not a raw data dump.

---

## 4. Operation-Specific Audit Strategies

### 4.1 CREATE

For create operations, there is no previous state.
The audit log can store the newly created data as a snapshot.

Purpose:
- Preserve original creation state
- Support future investigations

---

### 4.2 UPDATE

For update operations, only changed fields are recorded.

Each changed field contains:
- Old value
- New value

Unchanged fields are intentionally excluded.

This design ensures that the audit log clearly answers:
“What did the user change?”

---

### 4.3 DELETE

For delete operations, the system records the state **before deletion**.

This allows:
- Post-delete investigation
- Understanding what data was removed
- Compliance verification

---

## 5. JSON-Based Change Storage

Audit logs typically store change details in a JSON column.

Reasons:

- Supports multiple entity types with one table
- Flexible schema for future expansion
- Easy to render dynamically in UI
- Avoids frequent schema changes

This approach is widely adopted in enterprise systems.

---

## 6. Audit Log as a System Design Topic

Although audit logs originate from business requirements, their implementation requires system design decisions:

- Data modeling strategy
- Storage structure
- Change detection approach
- Readability vs completeness trade-off

This makes audit log design a **business-driven system design problem**, not a framework-specific implementation detail.

---

## 7. Conclusion

A well-designed audit log system:

- Separates technical auditing from business auditing
- Records meaningful changes instead of full snapshots
- Balances compliance, performance, and usability
- Serves both auditors and engineers

Audit logs are a clear example of how **business understanding directly shapes system design**.
