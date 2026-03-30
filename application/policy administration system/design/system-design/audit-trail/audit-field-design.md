# Audit Field Design Using Interceptor

## Goal

Automatically populate audit fields in database tables without writing repetitive code in every service or mapper.

Typical audit fields:

- created_by
- created_time
- updated_by
- updated_time

These fields record **who created or modified the data and when the change occurred**.

---

# Common Audit Fields

Most business tables should include the following fields.

| Field | Description |
|------|------|
| created_by | User who created the record |
| created_time | Creation timestamp |
| updated_by | Last user who modified the record |
| updated_time | Last modification timestamp |

Example table:

```
policy
```

| column | description |
|------|------|
| policy_id | primary key |
| policy_no | policy number |
| product_id | product reference |
| created_by | record creator |
| created_time | creation time |
| updated_by | last updater |
| updated_time | last update time |

---

# Design Principle

Audit fields should be filled **automatically**, not manually.

Bad approach:

```
policy.setCreatedBy(userId);
policy.setCreatedTime(now);
```

This creates repetitive code across the entire system.

Better approach:

Use a **database interceptor** to fill audit fields automatically.

---

# Architecture

```
Frontend
↓
Controller
↓
Service
↓
Mapper / Repository
↓
ORM Interceptor
↓
Database
```

The interceptor automatically populates audit fields before executing SQL.

---

# Interceptor Responsibilities

### When INSERT happens

Automatically fill:

```
created_by
created_time
updated_by
updated_time
```

Example:

Before insert:

```
policy_no = POL123
```

After interceptor:

```
policy_no = POL123
created_by = user001
created_time = 2026-03-12 10:00:00
updated_by = user001
updated_time = 2026-03-12 10:00:00
```

---

### When UPDATE happens

Automatically update:

```
updated_by
updated_time
```

Example:

Before update:

```
sum_insured = 100000
```

After interceptor:

```
sum_insured = 120000
updated_by = user002
updated_time = 2026-03-12 11:30:00
```

---

# Interceptor Implementation Idea

The interceptor reads the **current user information** from a request context.

Example context object:

```
RequestContext
  userId
  tenantId
  traceId
```

Interceptor logic:

```
if operation == INSERT
    set created_by
    set created_time
    set updated_by
    set updated_time

if operation == UPDATE
    set updated_by
    set updated_time
```

---

# Base Entity Design

To standardize audit fields, a base entity class is usually defined.

Example:

```
BaseEntity
```

```
createdBy
createdTime
updatedBy
updatedTime
```

Business entities extend the base class.

Example:

```
Policy extends BaseEntity
Client extends BaseEntity
Product extends BaseEntity
```

This ensures all important tables share consistent audit fields.

---

# Example Entity

```
Policy
```

```
policyId
policyNo
productId
createdBy
createdTime
updatedBy
updatedTime
```

When the mapper executes SQL, the interceptor automatically fills these fields.

---

# Tables That Should Have Audit Fields

Audit fields should be included in **business tables**.

Examples:

```
policy
client
product
quotation
payment
endorsement
```

These tables represent business data and require traceability.

---

# Tables That Usually Do Not Need Audit Fields

Technical or system tables may not need audit fields.

Examples:

```
menu
dictionary
system_config
cache
session
```

These tables are not business-critical.

---

# Benefits of Interceptor-Based Audit Fields

Advantages:

- Eliminates repetitive code
- Ensures consistent audit data
- Reduces developer mistakes
- Centralized audit logic
- Easy to maintain

---

# Summary

The interceptor-based audit field design provides a simple and reliable way to maintain creation and modification metadata.

Key ideas:

- Add standard audit fields to business tables
- Use an interceptor to populate them automatically
- Store user information in a request context
- Use a base entity to standardize audit fields

This approach ensures **consistent tracking of data creation and updates across the system**.