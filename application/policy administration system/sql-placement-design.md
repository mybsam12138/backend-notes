# SQL Placement Design Guide (Service Layer + Mapper Layer)

This guide summarizes how to correctly organize SQL queries in a layered backend architecture such as:

Controller → Service → Mapper (Repository)

The goal is to keep the system **maintainable, understandable, and aligned with business domains**.

---

# 1. Layer Responsibilities

## Controller
Responsible for handling HTTP requests.

Examples:
- Receive API request
- Validate parameters
- Call service layer
- Return response

Controller should **NOT contain business logic or SQL**.

---

## Service Layer
Responsible for **business logic orchestration**.

Responsibilities:

- Decide what data is required
- Call mapper methods
- Combine results
- Implement business rules

Example:

```java
public OrderDetailDTO getOrderDetail(Long orderId) {
    return orderMapper.selectOrderDetail(orderId);
}
```

Service layer **should not contain SQL**.

---

## Mapper / Repository Layer

Responsible for **database access**.

Responsibilities:

- Execute SQL
- Map database results to DTO or entity
- Encapsulate data access logic

Example:

```java
OrderDetailDTO selectOrderDetail(Long orderId);
```

---

# 2. Core Rule for SQL Placement

When a SQL query joins multiple tables, determine:

1. **What is the main table**
2. **What business object is returned**

The SQL should belong to the **domain of the main business object**.

Rule:

```
Main Table = Domain Owner
```

---

# 3. Example

SQL example:

```sql
SELECT
    o.id,
    o.order_no,
    c.name,
    p.status
FROM orders o
LEFT JOIN customer c ON o.customer_id = c.id
LEFT JOIN payment p ON p.order_id = o.id
```

Main table:

```
orders
```

Therefore the SQL belongs to:

```
OrderMapper
OrderService
```

Even though the SQL joins:

- customer
- payment

The **domain is still Order**.

---

# 4. Why LEFT JOIN Is Common

Most business systems use **LEFT JOIN** because:

- The main entity must always appear
- Related data may not exist

Example:

```
Order
 ├─ Customer (optional)
 ├─ Payment (optional)
 └─ Shipment (optional)
```

SQL pattern:

```sql
FROM orders o
LEFT JOIN customer c
LEFT JOIN payment p
LEFT JOIN shipment s
```

Meaning:

The order should still be returned even if related records do not exist.

---

# 5. Domain Ownership Examples

| Main Table | Domain | Mapper |
|-------------|--------|--------|
| orders | Order | OrderMapper |
| policy | Policy | PolicyMapper |
| client | Client | ClientMapper |
| product | Product | ProductMapper |

Insurance PAS example:

```sql
SELECT
    p.policy_no,
    c.client_name,
    a.agent_name
FROM policy p
LEFT JOIN client c ON p.client_id = c.id
LEFT JOIN agent a ON p.agent_id = a.id
```

Main table:

```
policy
```

Mapper:

```
PolicyMapper
```

---

# 6. Identify the Domain by Return Object

Another practical rule:

```
The domain is determined by the returned object.
```

Examples:

| Return Object | Domain |
|---------------|--------|
| OrderDetailDTO | Order |
| PolicyDetailDTO | Policy |
| ClientProfileDTO | Client |
| ProductDTO | Product |

Example:

```java
PolicyDetailDTO getPolicyDetail(String policyNo);
```

Even if the SQL joins multiple tables, it still belongs to **Policy domain**.

---

# 7. When SQL Does NOT Belong to a Domain

Sometimes queries are **cross-domain**.

Examples:

- Dashboard statistics
- Reports
- Analytics
- Aggregated metrics

Example SQL:

```sql
SELECT
    COUNT(p.id) policy_count,
    SUM(pr.premium) total_premium,
    COUNT(c.id) client_count
FROM policy p
JOIN premium pr
JOIN client c
```

This is **not a Policy query**.

Instead create a **Query Mapper**.

Example:

```
DashboardQueryMapper
ReportQueryMapper
StatisticsQueryMapper
```

---

# 8. Query Mapper Pattern

For complex read queries:

```
domain/
   OrderService
   OrderMapper

domain/query/
   OrderQueryService
   OrderQueryMapper
```

Usage:

- Complex joins
- Search pages
- Reporting queries
- Dashboard queries

---

# 9. Common Mistake

Bad design:

```
Service calls multiple mappers
and assembles data in Java
```

Example:

```java
orderMapper.selectOrder()
customerMapper.selectCustomer()
paymentMapper.selectPayment()
```

Problems:

- Multiple database calls
- Poor performance
- Complex service logic

Better design:

```
Single SQL
Single Mapper
Single DTO
```

---

# 10. Recommended Rule Summary

Simple SQL:

```
Domain Mapper
```

Example:

```
OrderMapper
PolicyMapper
ClientMapper
```

Complex queries:

```
Query Mapper
```

Example:

```
OrderQueryMapper
PolicyQueryMapper
ReportQueryMapper
```

---

# 11. Final Design Rule

```
1. Identify the main business object
2. Identify the main table
3. Place the SQL in that domain's mapper
4. If query is cross-domain → use QueryMapper
```

This approach keeps the system:

- maintainable
- performant
- aligned with domain-driven design
- easier to understand for new developers
s