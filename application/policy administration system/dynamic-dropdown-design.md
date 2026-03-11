# Dynamic Dropdown Design (DICT + SERVICE Method Pattern)

## Problem

In enterprise systems (PAS, ERP, admin platforms), many UI fields require dropdown options.

Examples:

- Vehicle Type
- Agent List
- City
- Branch
- Product

Some dropdowns are **static reference data**, while others are **dynamic business data**.

A flexible system must allow dropdowns to be configured without hardcoding logic everywhere.

---

# Recommended Architecture

Use two dropdown source types:

- **DICT** → static dictionary tables
- **SERVICE** → backend service methods

Configuration only decides **which source to use**, not the SQL.

```
UI
 ↓
GET /dropdown/{dropdownKey}
 ↓
DropdownService
 ↓
dropdown_config
 ↓
DICT or SERVICE
 ↓
Return options
```

---

# 1 Dropdown Configuration Table

```
dropdown_config
```

| dropdown_key | source_type | source_ref |
|---|---|---|
| VEHICLE_TYPE | DICT | VEHICLE_TYPE |
| AGENT_LIST | SERVICE | agentService.listAgents |
| CITY_LIST | SERVICE | cityService.listCities |

Meaning:

```
VEHICLE_TYPE → dictionary lookup
AGENT_LIST → call agentService.listAgents()
CITY_LIST → call cityService.listCities()
```

---

# 2 DICT Source

DICT is used for **static reference data**.

Examples:

- gender
- vehicle type
- building material
- policy status

Dictionary tables:

```
dictionary_type
dictionary_item
```

Example query:

```sql
SELECT item_code AS value,
       item_name AS label
FROM dictionary_item
WHERE type_code = 'VEHICLE_TYPE'
ORDER BY display_order
```

Advantages:

- standardized lookup data
- easy caching
- stable values

---

# 3 SERVICE Source

SERVICE is used for **dynamic business data**.

Examples:

- agent list
- city list
- branch list
- available products

These often require:

- filtering
- permission checks
- joins
- business logic

Example configuration:

```
source_ref = agentService.listAgents
```

Example service implementation:

```java
@Service("agentService")
public class AgentService {

    public List<OptionDTO> listAgents() {
        return agentMapper.findActiveAgents();
    }

}
```

Dropdown service executes the method dynamically:

```
agentService.listAgents()
```

Advantages:

- SQL stays in backend code
- business logic supported
- easier debugging

---

# 4 Unified Dropdown API

Frontend always uses the same API:

```
GET /dropdown/{dropdownKey}
```

Example:

```
GET /dropdown/VEHICLE_TYPE
GET /dropdown/AGENT_LIST
```

Backend resolves the dropdown key and executes the corresponding source.

---

# 5 Why Not Store Raw SQL in Database

Some systems attempt to store SQL in configuration:

| dropdown_key | sql |
|---|---|
| AGENT_LIST | SELECT id,name FROM agent |

This approach causes several problems.

## SQL Cannot Be Reviewed

When SQL is stored in the database:

- developers cannot easily review it in code
- code review processes do not cover it
- it is unclear **who wrote the SQL**

This increases maintenance risk.

## Hard to Audit Queries

It becomes difficult to answer questions like:

```
Which queries access the agent table?
Which queries are slow?
Where is this SQL used?
```

SQL becomes scattered in configuration tables.

## Security Risk

Dynamic SQL may introduce **SQL injection risk** if parameters are improperly handled.

## Hard to Debug

Debugging requires tracing:

```
UI
↓
dropdown service
↓
configuration table
↓
SQL stored in database
↓
database execution
```

Instead of simply checking backend code.

## Hard to Enforce Permissions

Business logic such as:

```
only show agents in user's branch
```

is difficult to enforce in raw SQL stored in configuration.

---

# 6 Key Design Principle

Configuration should determine **what data to load**,  
but application code should control **how the query is executed**.

```
Configuration → dropdown key
Code → query logic
Database → stores data
```

---

# 7 Summary

The recommended dropdown architecture is:

```
dropdown_config
        ↓
DICT or SERVICE
        ↓
dictionary tables or backend services
        ↓
mapper SQL
        ↓
dropdown options
```

Benefits:

- safe and maintainable
- centralized dropdown API
- SQL remains in backend code
- configuration remains simple
- easier debugging and auditing

This design is widely used in enterprise systems such as **PAS, ERP, and SaaS platforms**.
