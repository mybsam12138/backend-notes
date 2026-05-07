# MyBatis vs MyBatis-Plus vs MyBatis-Flex

## Overview

| | MyBatis | MyBatis-Plus | MyBatis-Flex |
|---|---|---|---|
| **Type** | Core ORM framework | Enhancement on MyBatis | Enhancement on MyBatis |
| **Released** | 2010 | 2016 | 2022 |
| **Auto CRUD** | ✗ Manual SQL | ✓ Built-in BaseMapper | ✓ Built-in BaseMapper |
| **Query DSL** | XML / Annotations | QueryWrapper (chained) | QueryWrapper (SQL-like, stronger) |
| **Multi-table joins** | Manual SQL only | Limited (needs XML for complex joins) | First-class join support in DSL |
| **Pagination** | Manual or plugin | Built-in page plugin | Built-in, dialect-aware |
| **Code generation** | None built-in | MyBatis-Plus Generator | MyBatis-Flex Generator |
| **Logical delete** | ✗ | ✓ `@TableLogic` | ✓ `@Column(isLogicDelete)` |
| **Multi-datasource** | Manual config | Via dynamic-datasource plugin | Built-in, no extra plugin |
| **Performance** | Fastest (no overhead) | Good, some reflection cost | Good, lighter than MP |
| **Learning curve** | Medium (SQL knowledge required) | Low — lots of docs & community | Low–Medium (newer, fewer examples) |
| **Community** | Massive (global) | Very large (dominant in China) | Growing (newer) |

---

## MyBatis

**What it is:** The foundational ORM framework. Maps SQL to Java methods via XML or annotations. You write every SQL statement yourself.

**Key strengths:**
- Maximum SQL control and flexibility
- No "magic" — behavior is always predictable
- Fastest performance (zero abstraction overhead)
- Massive global community and documentation

**Key weaknesses:**
- High boilerplate — every CRUD must be written manually
- No built-in pagination or code generation
- Not suitable for rapid development

**Best for:** Projects with complex, highly tuned SQL; DBA-heavy teams; or legacy codebases that need full control.

---

## MyBatis-Plus

**What it is:** The most popular MyBatis extension in the Java ecosystem (especially China). Adds auto-CRUD, a fluent query builder, pagination, and more — with zero modification to existing MyBatis code.

**Key strengths:**
- Auto-generates CRUD via `BaseMapper<T>` — no SQL needed for simple operations
- `QueryWrapper` / `LambdaQueryWrapper` covers most query scenarios without writing SQL
- Built-in pagination plugin with multi-database dialect support
- Rich ecosystem: code generator, logical delete, optimistic lock, multi-tenant, etc.
- Mature and battle-tested — huge community and tutorials

**Key weaknesses:**
- Complex multi-table joins still require XML or manual SQL
- Some criticism of heavy reflection use causing slight startup overhead
- API design choices (e.g., `QueryWrapper`) can feel verbose for complex queries

**Best for:** Standard Spring Boot CRUD applications; teams wanting rapid development with a proven, well-documented tool.

---

## MyBatis-Flex

**What it is:** A newer (2022) MyBatis enhancement designed to address limitations in MyBatis-Plus. Focuses on a cleaner query DSL, better multi-table support, and a lighter architecture.

**Key strengths:**
- Stronger query DSL — `QueryChain` reads closer to real SQL and supports native `leftJoin().on()` syntax
- First-class multi-table join support without dropping into XML
- Multi-datasource support built-in (no extra plugin like `dynamic-datasource` required)
- Lighter than MyBatis-Plus — less reflection, faster startup
- APT (Annotation Processing Tool) generates type-safe table/column references

**Key weaknesses:**
- Newer — smaller community, fewer tutorials and examples
- Less mature ecosystem compared to MyBatis-Plus
- Fewer third-party integrations

**Best for:** New projects with complex multi-table queries; teams using multiple data sources; developers who found MyBatis-Plus limiting.

---

## Summary: How to Choose

```
Need full SQL control?
  └── Use MyBatis

Need rapid CRUD development with a large community?
  └── Use MyBatis-Plus

Need complex joins / multiple data sources / cleaner DSL?
  └── Use MyBatis-Flex
```

> **Note:** MyBatis-Plus and MyBatis-Flex are not mutually exclusive with MyBatis — both are built on top of it and remain fully compatible with raw MyBatis XML/annotation SQL when needed.
