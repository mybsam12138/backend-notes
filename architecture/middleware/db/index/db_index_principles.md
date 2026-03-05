# Database Index Design and Underlying Principles

## 1. Introduction

A **database index** is a data structure used to improve the speed of
data retrieval operations on a table.

Without indexes, the database must perform a **full table scan**,
meaning it reads every row to find matching data.

Indexes allow the database to locate rows much faster.

Typical improvement:

Full table scan: O(N)\
Index lookup (B‑Tree): O(log N)

However, indexes also introduce **trade‑offs**, such as slower writes
and additional storage.

------------------------------------------------------------------------

# 2. B‑Tree Index

Most relational databases (MySQL, PostgreSQL, Oracle) use **B‑Tree
indexes by default**.

A **B‑Tree (Balanced Tree)** is a tree structure where:

-   data is sorted
-   the tree remains balanced
-   searches are efficient

Simplified structure:

           25
         /    \
       20      30

When executing:

SELECT \* FROM users WHERE age = 25;

The database searches the tree instead of scanning the entire table.

Advantages:

-   fast lookup
-   efficient range queries
-   balanced structure

B‑Tree indexes support:

=, \>, \<, BETWEEN, ORDER BY

------------------------------------------------------------------------

# 3. Composite Index

A **composite index** is an index built on **multiple columns**.

Example:

CREATE INDEX idx_user_name_age\
ON users(name, age);

The index structure becomes:

(name, age)

Example data:

  name    age
  ------- -----
  Alice   20
  Alice   30
  Bob     25

------------------------------------------------------------------------

## Leftmost Prefix Rule

Composite indexes follow the **leftmost prefix rule**.

For index:

(name, age)

Supported queries:

WHERE name = 'Alice'\
WHERE name = 'Alice' AND age = 20\
WHERE name = 'Alice' AND age \> 20

Not supported efficiently:

WHERE age = 20

Because the index is sorted by **name first**.

------------------------------------------------------------------------

# 4. Covering Index

A **covering index** occurs when all required columns of a query exist
inside the index.

Example table:

  id   name   age
  ---- ------ -----

Index:

(name, age)

Query:

SELECT name, age\
FROM users\
WHERE name = 'Alice';

The database can return the result **directly from the index**.

This avoids accessing the table data.

This is called:

Index Only Scan

Benefits:

-   fewer disk reads
-   faster query performance

------------------------------------------------------------------------

# 5. Index Selectivity

**Selectivity** measures how unique the values in a column are.

Formula:

selectivity = distinct values / total rows

Example:

Table rows:

1,000,000

Column: gender

Values:

male\
female

Distinct values = 2

Selectivity:

2 / 1,000,000 = very low

Low selectivity indexes are usually **not useful**.

------------------------------------------------------------------------

## High Selectivity Example

Column:

email

Every row has a unique email.

Selectivity:

1,000,000 / 1,000,000 = 1

This is an **excellent index candidate**.

------------------------------------------------------------------------

# 6. When NOT to Add an Index

Indexes improve read performance but introduce costs.

## 1. Write Overhead

Every insert, update, or delete must update the index.

Example:

INSERT row

Database updates:

table\
+ index1\
+ index2\
+ index3

More indexes → slower writes.

------------------------------------------------------------------------

## 2. Storage Cost

Indexes require additional disk space.

Large systems may have indexes larger than the data itself.

------------------------------------------------------------------------

## 3. Low Selectivity Columns

Avoid indexing columns like:

gender\
status\
boolean fields

These columns usually contain very few distinct values.

------------------------------------------------------------------------

## 4. Small Tables

If a table contains only a small number of rows, a full table scan may
be faster than using an index.

------------------------------------------------------------------------

# 7. Real‑World Index Design Example

Example table:

orders

Columns:

id\
user_id\
status\
created_at\
amount

Typical query:

SELECT \*\
FROM orders\
WHERE user_id = ?\
ORDER BY created_at DESC;

Recommended index:

(user_id, created_at)

This allows efficient filtering and sorting.

------------------------------------------------------------------------

# 8. Practical Index Design Rules

Common rules used by experienced engineers:

1.  Index columns used in WHERE conditions
2.  Index columns used in JOIN conditions
3.  Index columns used in ORDER BY
4.  Prefer high selectivity columns
5.  Avoid too many indexes in write‑heavy systems

------------------------------------------------------------------------

# 9. Summary

  Concept           Meaning
  ----------------- ---------------------------------------------
  B‑Tree Index      Balanced tree structure for fast lookup
  Composite Index   Index built on multiple columns
  Covering Index    Query can be satisfied using only the index
  Selectivity       Measures uniqueness of indexed values
  Index Tradeoff    Faster reads but slower writes

------------------------------------------------------------------------

# 10. Key Idea

Indexes accelerate **read performance** but introduce **write overhead
and storage cost**.

Good database design balances:

-   query performance
-   write performance
-   storage usage
