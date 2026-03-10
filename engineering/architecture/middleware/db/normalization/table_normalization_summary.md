# Database Table Normalization Guide

## 1. Introduction

Table normalization is a **database design technique** used to reduce
redundancy and maintain data integrity by organizing tables and defining
relationships between them.

The most commonly used normalization levels in real systems are:

-   1NF (First Normal Form)
-   2NF (Second Normal Form)
-   3NF (Third Normal Form)
-   BCNF (Boyce--Codd Normal Form)

Most real production systems normalize to **3NF**, then sometimes
**denormalize** for performance.

------------------------------------------------------------------------

# 2. Key Concepts

## Candidate Key

A **candidate key** is a minimal set of attributes that can uniquely
identify a row in a table.

Example:

  student_id   email          name
  ------------ -------------- -------
  1            a@school.com   Alice
  2            b@school.com   Bob

Possible candidate keys:

-   student_id
-   email

Both uniquely identify a record.

One candidate key is usually chosen as the **primary key**.

------------------------------------------------------------------------

## Determinant

A **determinant** is an attribute (or set of attributes) that determines
another attribute.

If:

    A → B

It means:

> If we know **A**, we can determine **B**.

Example:

  course    teacher
  --------- ----------
  Math      Dr Smith
  Physics   Dr Lee

Functional dependency:

    course → teacher

Here **course** is the determinant.

------------------------------------------------------------------------

# 3. First Normal Form (1NF)

## Rule

A table is in **1NF** if:

-   Each column contains **atomic values**
-   No repeating groups
-   Each cell contains only **one value**

## Bad Example

  order_id   products
  ---------- -----------------
  1          iPhone, AirPods

This violates 1NF because a column contains multiple values.

## Correct (1NF)

  order_id   product
  ---------- ---------
  1          iPhone
  1          AirPods

Each column contains only one value.

------------------------------------------------------------------------

# 4. Second Normal Form (2NF)

## Rule

A table must:

-   Be in **1NF**
-   All non-key attributes must depend on the **entire primary key**

This mainly applies to **composite keys**.

## Example

Primary key: `(order_id, product_id)`

  order_id   product_id   product_name   quantity
  ---------- ------------ -------------- ----------

Problem:

    product_id → product_name

`product_name` depends only on `product_id`, not the whole key.

## Solution

Split the table.

### Orders

  order_id   product_id   quantity
  ---------- ------------ ----------

### Products

| product_id \| product_name \|

------------------------------------------------------------------------

# 5. Third Normal Form (3NF)

## Rule

A table must:

-   Be in **2NF**
-   Have **no transitive dependencies**

A transitive dependency occurs when:

    A → B
    B → C

So:

    A → C

## Example

  customer_id   zip_code   city
  ------------- ---------- ------

Dependency:

    zip_code → city

This creates a transitive dependency.

## Solution

Split the tables.

### Customers

  customer_id   zip_code
  ------------- ----------

### ZipCodes

| zip_code \| city \|

------------------------------------------------------------------------

# 6. Boyce--Codd Normal Form (BCNF)

## Rule

A table is in BCNF if:

> Every determinant is a candidate key.

## Example

  student   course   teacher
  --------- -------- ---------

Assume:

    course → teacher

Primary key:

    (student, course)

Here **course** determines teacher but is **not a candidate key**.

This violates BCNF.

## Solution

Split the tables.

### Courses

| course \| teacher \|

### StudentCourses

| student \| course \|

------------------------------------------------------------------------

# 7. Performance Tradeoffs (Normalization vs Denormalization)

Normalization improves:

-   data integrity
-   consistency
-   maintainability

But it may reduce performance because of **joins**.

Example normalized schema:

    Customers
    Products
    Orders
    OrderItems

To display order information you may need:

    Orders
    JOIN Customers
    JOIN OrderItems
    JOIN Products

Too many joins can slow queries.

------------------------------------------------------------------------

# 8. Denormalization for Performance

Sometimes we intentionally duplicate data.

Example:

  order_id   customer_name   product_name   price
  ---------- --------------- -------------- -------

Advantages:

-   fewer joins
-   faster queries
-   easier reporting

Disadvantages:

-   data redundancy
-   update anomalies
-   harder maintenance

------------------------------------------------------------------------

# 9. Practical Rule Used in Industry

Most systems follow:

    Design schema in 3NF
    Then denormalize carefully for performance

Typical cases where denormalization is used:

-   reporting tables
-   analytics systems
-   caching
-   read-heavy systems

------------------------------------------------------------------------

# 10. Quick Summary

  Normal Form   Rule
  ------------- ----------------------------------------
  1NF           Atomic columns
  2NF           No partial dependency on composite key
  3NF           No transitive dependency
  BCNF          Every determinant is a candidate key
