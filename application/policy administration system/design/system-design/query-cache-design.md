# Query Cache Design (Database-Based Search Query Storage)

## Goal

Allow users to **restore their previous search conditions** when revisiting a page.

Instead of storing search filters only in the frontend or browser storage, the system stores **search query JSON in the backend database**, so that:

- users can continue their previous search
- queries can be reused across sessions and devices
- frequently used filters can be restored quickly
- search conditions remain persistent

This design is commonly used in:

- Policy Administration Systems (PAS)
- CRM systems
- ERP systems
- Data analysis dashboards

---

# Core Idea

When a user performs a search on a page:

1. The **search query JSON** is stored in the database
2. The system associates the query with:
    - user
    - page
3. When the user revisits the page, the system retrieves the cached query
4. The frontend **populates the search input fields automatically**

---

# Architecture

Frontend  
↓  
User performs search  
↓  
Frontend sends query JSON  
↓  
Backend stores query JSON in database  
↓  
User revisits page  
↓  
Frontend requests cached query  
↓  
Backend returns query JSON  
↓  
Frontend populates input fields

---

# Query JSON Example

Example search query sent from frontend:

```
{
  "policyNo": "POL123",
  "clientName": "John",
  "product": "Motor",
  "status": "Active",
  "startDate": "2026-01-01",
  "endDate": "2026-03-01"
}
```

This JSON represents the user's filter conditions.

---

# Database Table Design

Example table:

```
query_cache
```

| column | description |
|------|------|
| id | primary key |
| user_id | user identifier |
| page_code | page identifier |
| query_json | stored query JSON |
| created_time | creation time |
| updated_time | last update time |

Example record:

| user_id | page_code | query_json |
|------|------|------|
| user01 | policy_search | {policyNo:"POL123",status:"Active"} |

---

# Page Code Design

Each searchable page should have a **unique page code**.

Examples:

```
policy_search
client_search
quotation_search
product_search
```

This ensures queries are cached separately per page.

---

# Backend API Design

### Save Query

```
POST /query-cache
```

Request:

```
{
  "pageCode": "policy_search",
  "query": {...}
}
```

Behavior:

- Save or update query cache for the user and page.

---

### Get Query Cache

```
GET /query-cache?pageCode=policy_search
```

Response:

```
{
  "query": {...}
}
```

The frontend uses this JSON to populate search fields.

---

# Frontend Behavior

When the page loads:

1. Request cached query
2. Populate input fields
3. Optionally execute search automatically

Example flow:

Page load  
↓  
Request `/query-cache`  
↓  
Receive query JSON  
↓  
Fill input boxes  
↓  
User can run search

---

# Optional Features

### 1 Recent Search History

Store multiple queries per page.

Example:

```
last 5 searches
```

Table:

```
query_cache_history
```

---

### 2 Named Saved Searches

Allow users to save queries with a name.

Example:

```
"My active policies"
"Motor policies this month"
```

Additional field:

```
query_name
```

---

### 3 Default Query

Allow a user to define a default filter when opening a page.

Example:

```
status = Active
```

---

# Data Lifecycle

Query caches are usually temporary.

Retention example:

```
30 days
```

Old queries can be cleaned automatically.

---

# Advantages

- Search conditions persist across sessions
- Works across multiple devices
- Improves user experience
- Enables reusable filters
- Simple implementation

---

# Limitations

- Requires database storage
- Must control query size
- May require cleanup strategy

---

# Summary

The query cache design stores **search conditions as JSON in the backend database**.

When a user revisits a page:

1. The system retrieves the cached query
2. The frontend populates the search inputs
3. The user can continue working with the same filter conditions

This approach improves usability for complex enterprise systems with frequent search operations.