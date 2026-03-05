# CAP Theorem Explained

## 1. What is CAP Theorem

CAP Theorem states that a **distributed system** cannot simultaneously
guarantee all three of the following properties:

-----------------------------------------------------------------------
  Property                            Meaning
----------------------------------- -----------------------------------
  Consistency (C)                     Every read receives the most recent
                                      write or an error. All nodes see
                                      the same data at the same time.

  Availability (A)                    Every request receives a response,
                                      even if some nodes fail.

  Partition Tolerance (P)             The system continues operating even
                                      if network partitions occur between nodes.

**Key idea:**

When a **network partition happens**, the system must choose between:

-   Consistency
-   Availability

It cannot guarantee both at the same time.

Therefore in practice:

    Distributed System = must tolerate P
    → choose either CP or AP

------------------------------------------------------------------------

# 2. Why Partition Tolerance is Mandatory

In real distributed systems:

-   nodes run on different machines
-   network failures are unavoidable
-   packet loss or delays can split the cluster

Example:

    Node A -----X----- Node B
         (network partition)

If the nodes cannot communicate, the system must decide:

-   Should we **reject requests** to keep data consistent? → CP
-   Should we **continue serving requests** but risk inconsistent data?
    → AP

------------------------------------------------------------------------

# 3. Three CAP Models

## CP System (Consistency + Partition Tolerance)

Prioritizes **correct data** over availability.

When partition happens: - some requests are rejected - system may become
temporarily unavailable

### Example Systems

-   Google Spanner
-   HBase
-   ZooKeeper
-   etcd

### Typical Use Cases

-   financial transactions
-   inventory systems
-   strong consistency databases
-   distributed locks

Example:

    Bank transfer system
    Balance must always be correct
    → choose CP

------------------------------------------------------------------------

## AP System (Availability + Partition Tolerance)

Prioritizes **always responding to requests**, even if data becomes
temporarily inconsistent.

When partition happens:

-   different nodes may accept writes
-   data will be synchronized later

This is called:

    Eventual Consistency

### Example Systems

-   Cassandra
-   DynamoDB
-   CouchDB
-   many NoSQL systems

### Typical Use Cases

-   social media feeds
-   logging systems
-   recommendation systems
-   large-scale analytics

Example:

    Twitter likes
    Temporary inconsistency is acceptable
    → choose AP

------------------------------------------------------------------------

## CA System (Consistency + Availability)

Possible **only if there is no network partition**.

But real distributed systems **always face partitions**, so CA systems
are typically:

-   single-node databases
-   tightly coupled clusters

Examples:

-   traditional relational databases
-   single-node MySQL
-   single-node PostgreSQL

------------------------------------------------------------------------

# 4. How CAP Guides Distributed System Design

CAP is not a strict rule but a **design guideline**.

When designing distributed systems, engineers must answer:

### Question 1

What happens if the network breaks?

### Question 2

Should the system:

-   reject requests to keep data correct?
-   or continue running but allow temporary inconsistency?

------------------------------------------------------------------------

# 5. Example: Order System vs Inventory System

Imagine an e-commerce system.

### Option 1 --- Strong Consistency (CP)

    Order Service → Inventory Service
           |
           | synchronous call
           |
    Order confirmed only if inventory deducted

Advantages

-   data always correct

Disadvantages

-   if inventory service fails
-   order cannot be created

------------------------------------------------------------------------

### Option 2 --- Event Driven (AP)

    Order Service → Message Queue → Inventory Service

Flow:

1.  order created
2.  event sent to queue
3.  inventory reduced asynchronously

Advantages

-   high availability
-   better scalability

Disadvantages

Possible scenario:

    Order success
    Inventory update failed

System must handle:

-   retries
-   compensation
-   reconciliation jobs

------------------------------------------------------------------------

# 6. CAP in Real System Architecture

In practice systems combine different models.

Example microservice architecture:

  Component             CAP choice
--------------------- ------------
  Payment service       CP
  Order service         CP
  Notification system   AP
  Logging system        AP
  Analytics system      AP

This allows:

-   critical data → strong consistency
-   non‑critical features → high availability

------------------------------------------------------------------------

# 7. Key Takeaways

1.  CAP applies **only to distributed systems**
2.  **Network partitions are unavoidable**
3.  During a partition you must choose:

```{=html}
<!-- -->
```
    Consistency OR Availability

4.  Most real systems mix **CP and AP components**
5.  CAP helps architects decide **when to use sync vs async
    communication**

Example rule:

    Strong correctness → CP → synchronous calls
    
    High throughput → AP → message queues / eventual consistency

------------------------------------------------------------------------

# 8. Simple Mental Model

               Consistency
                    |
                    |
                    |
     Availability -------- Partition Tolerance

Distributed systems **must support P**, so the real tradeoff is:

    CP vs AP

------------------------------------------------------------------------

# 9. Simple Real-World Analogy

Imagine two bank branches.

If network breaks:

Option 1:

    Stop withdrawals
    → consistency guaranteed

Option 2:

    Allow withdrawals
    → balance may become incorrect

This is exactly the **CAP tradeoff**.
