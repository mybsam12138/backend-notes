# Apache Kafka -- Key Features Summary

## 1. Overview

Apache Kafka is a distributed event streaming platform designed for
**high-throughput, fault-tolerant, and scalable message processing**.\
It is commonly used in **microservice architectures, event-driven
systems, log aggregation, and data pipelines**.

------------------------------------------------------------------------

# 2. Core Kafka Concepts

## Broker

A **Kafka Broker** is a server that stores and serves messages.

-   A Kafka cluster consists of multiple brokers.
-   Brokers manage topic partitions and replication.
-   Clients communicate with brokers to produce or consume messages.

## Topic

A **Topic** is a logical category for messages.

Example:

    order-created
    payment-completed
    user-login-events

Topics are divided into **partitions**.

## Partition

Partitions allow Kafka to achieve **parallelism and scalability**.

Features: - Messages in one partition are **ordered** - Each partition
can be stored on different brokers - Producers can send messages to
different partitions

Example:

Topic: `order-events`

Partition 0\
Partition 1\
Partition 2

## Producer

A **Producer** sends messages to Kafka topics.

Responsibilities: - Choose which topic to send messages to - Optionally
choose partition - Handle retries

Example workflow:

    Application → Kafka Producer → Kafka Topic

## Consumer

A **Consumer** reads messages from Kafka topics.

Consumers pull messages from Kafka using **offsets**.

Example:

    Kafka Topic → Consumer → Application Logic

## Consumer Group

A **Consumer Group** allows multiple consumers to share workload.

Key idea: - Each partition can only be consumed by **one consumer in the
group** - Different groups can consume the same data independently

Example:

Consumer Group A - Consumer 1 → Partition 0 - Consumer 2 → Partition 1

Consumer Group B - Consumer 1 → Partition 0 - Consumer 2 → Partition 1

------------------------------------------------------------------------

# 3. Key Features of Kafka

## 3.1 High Throughput

Kafka is optimized for **very high data throughput**.

Reasons: - Sequential disk writes - Batch message processing - Zero-copy
transfer - Efficient network protocol

Typical usage: - Millions of messages per second.

------------------------------------------------------------------------

## 3.2 Horizontal Scalability

Kafka clusters scale horizontally by adding brokers.

Example:

    Broker 1
    Broker 2
    Broker 3

New partitions can be distributed across brokers.

Benefits: - Increased throughput - Increased storage capacity

------------------------------------------------------------------------

## 3.3 Fault Tolerance (Replication)

Kafka replicates partitions across brokers.

Example:

Partition Leader → Broker 1\
Replica → Broker 2\
Replica → Broker 3

If the leader fails: - One replica becomes the new leader.

This ensures **high availability**.

------------------------------------------------------------------------

## 3.4 Message Persistence

Kafka stores messages on disk.

Messages are **not deleted immediately after consumption**.

Instead they follow **retention policies**.

Example:

    retain messages for 7 days
    retain messages for 100GB

This allows replaying events.

------------------------------------------------------------------------

## 3.5 Ordering Guarantee

Kafka guarantees **message ordering within a partition**.

Example:

Partition 0:

    msg1
    msg2
    msg3

Consumers will read in the same order.

Note: Ordering across multiple partitions is **not guaranteed**.

------------------------------------------------------------------------

## 3.6 Consumer Offset Management

Kafka tracks the **offset** of each message.

Example:

Partition 0

    offset 0 → message A
    offset 1 → message B
    offset 2 → message C

Consumers store offsets to know where to continue reading.

Benefits: - Resume consumption - Replay messages - Fault recovery

------------------------------------------------------------------------

## 3.7 Message Replay

Because Kafka stores data for a retention period, consumers can replay
events.

Example scenarios:

-   Reprocessing failed data
-   Rebuilding database state
-   Debugging historical events

------------------------------------------------------------------------

## 3.8 Decoupling Services

Kafka allows **asynchronous communication** between services.

Example:

Without Kafka

    Order Service → Payment Service → Inventory Service

With Kafka

    Order Service → Kafka → Payment Service
                           → Inventory Service

Benefits: - Loose coupling - Independent scaling - Improved resilience

------------------------------------------------------------------------

# 4. Enterprise Best Practices

## Topic Design

Good topic naming:

    order-created
    order-paid
    order-shipped

Avoid overly generic topics.

------------------------------------------------------------------------

## Partition Strategy

Choose partitions based on key.

Example:

    orderId
    userId

Ensures related events go to the same partition.

------------------------------------------------------------------------

## Dead Letter Queue (DLQ)

Failed messages should be sent to a **DLQ topic**.

Example:

    order-events
    order-events-dlq

This prevents data loss.

------------------------------------------------------------------------

## Monitoring

Important metrics:

-   consumer lag
-   broker disk usage
-   message throughput
-   replication status

Common monitoring tools:

-   Prometheus
-   Grafana
-   Kafka Manager

------------------------------------------------------------------------

# 5. Spring Boot Kafka Example

## Producer Example

``` java
@Autowired
private KafkaTemplate<String, String> kafkaTemplate;

public void sendMessage(String message) {
    kafkaTemplate.send("order-events", message);
}
```

## Consumer Example

``` java
@KafkaListener(topics = "order-events", groupId = "order-service")
public void consume(String message) {
    System.out.println("Received message: " + message);
}
```

------------------------------------------------------------------------

# 6. When Kafka Is Suitable

Kafka is best used when:

-   High throughput event streaming is required
-   Systems need asynchronous processing
-   Multiple services need the same event data
-   Event replay capability is needed
-   Microservices require loose coupling

Typical use cases:

-   Microservice communication
-   Event sourcing
-   Log aggregation
-   Real-time analytics
-   Data pipelines
