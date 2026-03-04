# Slow SQL Analysis Guide for Backend Engineers

This document summarizes **how engineers detect and analyze slow SQL
queries**, how to determine whether an **index is used**, and how to
optimize queries.

Topics included:

-   How to detect slow SQL
-   How to analyze SQL execution plans
-   How to determine whether indexes are used
-   Real `EXPLAIN` output examples
-   Typical optimization workflow

------------------------------------------------------------------------

# 1. How Slow SQL Happens

A query usually becomes slow because of:

-   Full table scan
-   Missing index
-   Wrong index design
-   Large JOIN operations
-   Sorting without index
-   Returning too many rows

Example slow query:

``` sql
SELECT *
FROM orders
WHERE user_id = 1001;
```

If there is **no index on user_id**, the database scans the entire
table.

Time complexity:

    Full table scan → O(N)
    Index lookup → O(log N)

------------------------------------------------------------------------

# 2. How to Detect Slow SQL

## Method 1 --- Slow Query Log (MySQL)

Enable slow query log:

``` sql
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1;
```

Meaning:

-   Log queries that take longer than **1 second**.

Check slow query log file:

    /var/log/mysql/slow.log

Example slow query log entry:

    # Query_time: 3.214
    # Rows_examined: 200000
    SELECT *
    FROM orders
    WHERE user_id = 1001;

Important fields:

  Field           Meaning
  --------------- ----------------
  Query_time      Execution time
  Rows_examined   Rows scanned
  Rows_sent       Rows returned

If **Rows_examined is huge**, the query likely performs a **table
scan**.

------------------------------------------------------------------------

## Method 2 --- Application Monitoring

Slow queries can also be detected by:

-   APM tools (SkyWalking, NewRelic, Datadog)
-   Database monitoring dashboards
-   Logs in backend services

Example log:

    SQL execution time: 2.1s
    SELECT * FROM orders WHERE user_id = 1001;

------------------------------------------------------------------------

# 3. Analyze Query Using EXPLAIN

Once a slow SQL is found, engineers analyze it using:

    EXPLAIN

Example:

``` sql
EXPLAIN SELECT *
FROM orders
WHERE user_id = 1001;
```

------------------------------------------------------------------------

# 4. Example EXPLAIN Output

Example output (MySQL):

  id   select_type   table    type   possible_keys   key    rows     Extra
  ---- ------------- -------- ------ --------------- ------ -------- -------------
  1    SIMPLE        orders   ALL    NULL            NULL   200000   Using where

Important columns:

  Column   Meaning
  -------- ------------------------
  type     scan type
  key      index used
  rows     estimated rows scanned
  Extra    additional info

------------------------------------------------------------------------

# 5. Understanding Scan Types

`type` column is extremely important.

  Type    Meaning            Performance
  ------- ------------------ -------------
  ALL     full table scan    very slow
  index   index scan         slow
  range   index range scan   good
  ref     index lookup       good
  const   single row         excellent

Example of bad query:

    type = ALL

Meaning:

    database scans entire table

------------------------------------------------------------------------

# 6. Example: Query Without Index

Query:

``` sql
SELECT *
FROM orders
WHERE user_id = 1001;
```

EXPLAIN:

  type   key    rows
  ------ ------ --------
  ALL    NULL   200000

Interpretation:

-   No index used
-   Full table scan
-   200,000 rows scanned

------------------------------------------------------------------------

# 7. Add an Index

Create index:

``` sql
CREATE INDEX idx_orders_user_id
ON orders(user_id);
```

------------------------------------------------------------------------

# 8. Run EXPLAIN Again

``` sql
EXPLAIN SELECT *
FROM orders
WHERE user_id = 1001;
```

Example result:

  --------------------------------------------------------------------------------------------
  id   select_type    table    type   possible_keys        key                  rows   Extra
  ---- -------------- -------- ------ -------------------- -------------------- ------ -------
  1    SIMPLE         orders   ref    idx_orders_user_id   idx_orders_user_id   10     Using
                                                                                       where

  --------------------------------------------------------------------------------------------

Now:

  Field        Meaning
  ------------ ----------------------
  type = ref   index lookup
  key          index used
  rows = 10    only 10 rows scanned

Performance improvement is massive.

------------------------------------------------------------------------

# 9. Detect Whether Query Uses Index

Key indicators in EXPLAIN:

  Field           What to check
  --------------- ------------------------
  key             index name used
  possible_keys   candidate indexes
  type            scan method
  rows            estimated rows scanned

If:

    key = NULL
    type = ALL

Then:

    index is NOT used

------------------------------------------------------------------------

# 10. Example Covering Index Optimization

Query:

``` sql
SELECT user_id, created_at
FROM orders
WHERE user_id = 1001;
```

Index:

    (user_id, created_at)

EXPLAIN result:

  type   key                Extra
  ------ ------------------ -------------
  ref    idx_user_created   Using index

`Using index` means:

    Covering index
    No table lookup required

Very efficient.

------------------------------------------------------------------------

# 11. Real Slow Query Investigation Workflow

When a query is slow:

Step 1

    Find slow query in logs

Step 2

    Run EXPLAIN

Step 3

Check:

-   scan type
-   index usage
-   rows scanned

Step 4

Possible fixes:

-   add index
-   modify query
-   change index order
-   reduce returned rows
-   avoid SELECT \*

------------------------------------------------------------------------

# 12. Practical Optimization Example

Original query:

``` sql
SELECT *
FROM orders
WHERE status = 'PAID';
```

Bad index candidate:

    status

Because selectivity is low.

Better query pattern:

``` sql
SELECT *
FROM orders
WHERE user_id = 1001
AND status = 'PAID';
```

Index:

    (user_id, status)

This improves performance dramatically.

------------------------------------------------------------------------

# 13. Common Slow SQL Causes

  Cause                    Example
  ------------------------ ------------------------
  Missing index            WHERE user_id = ?
  Wrong index order        composite index misuse
  Too many rows returned   SELECT \*
  Sorting without index    ORDER BY created_at
  Low selectivity index    status column
  Large JOIN operations    multiple large tables

------------------------------------------------------------------------

# 14. Key Principle

When analyzing slow SQL, always ask:

1.  Does the query use an index?
2.  How many rows are scanned?
3.  Is the index design correct?
4.  Can a covering index be used?

The goal is to reduce:

    Rows scanned
    Disk IO
    Table lookups

------------------------------------------------------------------------

# 15. Quick Summary

  Step                Action
  ------------------- -----------------------
  Detect slow SQL     slow query log
  Analyze execution   EXPLAIN
  Check index usage   key column
  Check scan type     type column
  Optimize query      add or redesign index
