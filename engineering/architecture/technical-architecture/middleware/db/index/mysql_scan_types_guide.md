# MySQL EXPLAIN Scan Types Guide

This document summarizes the common **scan types shown in MySQL
`EXPLAIN`**, their meaning, performance characteristics, and example
queries.

Understanding scan types is critical for **analyzing slow SQL queries
and index usage**.

------------------------------------------------------------------------

# Scan Type Performance Order

Best → Worst

    system
    const
    eq_ref
    ref
    range
    index
    ALL

------------------------------------------------------------------------

# 1. system

## Meaning

The table contains **only one row**.

MySQL treats the table as a constant.

## Example

Table:

  id   name
  ---- -------
  1    Alice

Query:

``` sql
SELECT * FROM single_row_table;
```

EXPLAIN example:

  type
  --------
  system

## Performance

Fastest possible access.

------------------------------------------------------------------------

# 2. const

## Meaning

A **unique index or primary key** is used to fetch **exactly one row**.

## Example

Table:

  id (PK)   name
  --------- -------
  1         Alice
  2         Bob

Query:

``` sql
SELECT * FROM users WHERE id = 1;
```

EXPLAIN:

  type    key
  ------- ---------
  const   PRIMARY

## Performance

Extremely fast.

------------------------------------------------------------------------

# 3. eq_ref

## Meaning

Used in **JOIN operations**.

For each row in the previous table, MySQL finds **exactly one matching
row using a unique index**.

## Example

Tables:

users

  id (PK)   name
  --------- ------

orders

  id   user_id
  ---- ---------

Query:

``` sql
SELECT *
FROM orders
JOIN users ON orders.user_id = users.id;
```

EXPLAIN:

  type
  --------
  eq_ref

## Performance

Very efficient join.

------------------------------------------------------------------------

# 4. ref

## Meaning

MySQL uses a **non‑unique index** to find matching rows.

Multiple rows may match.

## Example

Index:

``` sql
CREATE INDEX idx_user_id ON orders(user_id);
```

Query:

``` sql
SELECT *
FROM orders
WHERE user_id = 10;
```

EXPLAIN:

  type   key
  ------ -------------
  ref    idx_user_id

## Performance

Very good performance.

------------------------------------------------------------------------

# 5. range

## Meaning

MySQL scans **a range of values in an index**.

Used for comparisons like:

    >
    <
    BETWEEN
    IN

## Example

Index:

``` sql
CREATE INDEX idx_age ON users(age);
```

Query:

``` sql
SELECT *
FROM users
WHERE age BETWEEN 20 AND 30;
```

EXPLAIN:

  type    key
  ------- ---------
  range   idx_age

## Performance

Efficient because it still uses the index.

------------------------------------------------------------------------

# 6. index

## Meaning

MySQL scans the **entire index**.

Still better than table scan because indexes are smaller than table
rows.

## Example

Query:

``` sql
SELECT name
FROM users;
```

If there is an index on `name`, MySQL may scan the entire index.

EXPLAIN:

  type
  -------
  index

## Performance

Moderate performance.

Better than full table scan but still scans many rows.

------------------------------------------------------------------------

# 7. ALL

## Meaning

Full table scan.

MySQL reads **every row in the table**.

Usually indicates **missing or unusable index**.

## Example

Query:

``` sql
SELECT *
FROM orders
WHERE amount = 100;
```

No index exists.

EXPLAIN:

  type
  ------
  ALL

## Performance

Worst performance for large tables.

------------------------------------------------------------------------

# Practical Interpretation

When analyzing slow SQL queries:

Good scan types:

    const
    eq_ref
    ref
    range

Acceptable in some cases:

    index

Bad sign:

    ALL

Which usually means:

    Full table scan

------------------------------------------------------------------------

# Quick Summary Table

  Type     Meaning                   Performance
  -------- ------------------------- -------------
  system   single row table          best
  const    unique lookup             excellent
  eq_ref   unique join lookup        excellent
  ref      non‑unique index lookup   very good
  range    index range scan          good
  index    full index scan           moderate
  ALL      full table scan           worst

------------------------------------------------------------------------

# Key Optimization Goal

When tuning SQL queries, the goal is to ensure:

    type != ALL

and ideally:

    type = const / ref / range
