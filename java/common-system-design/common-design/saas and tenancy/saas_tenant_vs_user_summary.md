# SaaS Overview & TenantId vs UserId

## 1. What Is SaaS?

**SaaS (Software as a Service)** is a software delivery model where:

- One software system is deployed and operated by the provider
- Multiple customers access it over the network (usually the Internet)
- Customers do not manage infrastructure or deployments

Typical characteristics:

- Single codebase
- Centralized operation
- Subscription or contract-based usage
- Continuous delivery

Common examples:

- ERP systems
- CRM systems
- Insurance core / underwriting platforms
- HR / payroll platforms
- Huawei cloud desktop

---

## 2. The Core Problem SaaS Must Solve

The central challenge of SaaS is **safe sharing**:

> Multiple customers use the same system **without seeing or affecting each other**.

This leads directly to the concept of **tenancy**.

---

## 3. What Is a Tenant?

A **tenant** is the **primary isolation boundary** in a SaaS system.

A tenant defines:

- Data ownership
- Configuration scope
- Security boundary

If two requests belong to different tenants:

- Their data must never mix
- Their configuration may differ
- Their users are isolated

In practice, a tenant usually represents:

- One enterprise customer, or
- One personal customer (single-user tenant)

---

## 4. What Is TenantId?

**tenantId** is a technical identifier used to enforce tenant isolation.

It is:

- Infrastructure-level
- Request-scoped
- Cross-cutting

Typical uses:

- Filtering database queries
- Selecting tenant-specific configuration
- Enforcing cross-tenant access control
- Tagging logs and metrics

Example:

```sql
SELECT * FROM policy
WHERE tenant_id = ?;
```

---

## 5. What Is UserId?

**userId** identifies an individual user **inside a tenant**.

It represents:

- Identity
- Authentication subject
- Authorization target

userId is:

- Domain-level
- Business-facing
- Always scoped by tenant

A user **cannot exist without a tenant context** in a SaaS system.

---

## 6. TenantId vs UserId (Key Differences)

| Dimension | tenantId | userId |
|--------|--------|--------|
| Purpose | Data & config isolation | Identify a person or account |
| Scope | System / infrastructure | Business / domain |
| Cardinality | One tenant → many users | One user → one tenant |
| Isolation boundary | Yes | No |
| Used in DB filtering | Yes (mandatory) | Sometimes |
| Used in auth | Indirect | Direct |

---

## 7. Relationship Between Tenant and User

Typical relationship:

```text
Tenant
 ├── User A
 ├── User B
 └── User C
```

Rules:

- Every user belongs to exactly one tenant
- A tenant may have one or many users
- Cross-tenant user access is forbidden

---

## 8. Personal Users vs Enterprise Users

In SaaS systems:

- A **personal user** is often modeled as a tenant with one user
- An **enterprise** is a tenant with many users

Architecturally, they are treated the same:

- Same isolation rules
- Same tenantId concept

Only the business meaning differs.

---

## 9. When You Do NOT Need TenantId

A system does NOT need tenantId if:

- It is deployed per customer
- It serves only one organization
- Data is already physically isolated (per-DB, per-schema)

Adding tenantId in these cases increases complexity without benefit.

---

## 10. Summary

- SaaS systems serve multiple customers using a shared system
- Tenant is the architectural unit of isolation
- tenantId enforces data and configuration boundaries
- userId identifies individuals within a tenant
- tenantId answers "who must never mix"
- userId answers "who is acting"

---

**Key Rule**:

> If something controls data isolation, it is a tenant concern.  
> If something identifies a person, it is a user concern.

