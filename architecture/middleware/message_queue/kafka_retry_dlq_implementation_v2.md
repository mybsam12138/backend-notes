# Kafka Retry Logic and Dead Letter Queue (DLQ) Implementation Guide

## 1. Overview

In Apache Kafka, retry and dead-letter handling are **not built into the
broker**.\
Kafka only provides:

-   message storage
-   message delivery
-   partitioned logs

**Retry logic and DLQ routing are implemented by the consumer
application.**

This document summarizes **two common retry strategies used in
production systems**.

------------------------------------------------------------------------

# 2. Basic Message Processing Flow

Normal Kafka processing:

Producer → Topic → Consumer → Business Logic

If processing succeeds:

process success → commit offset

If processing fails:

process fail → retry OR send to DLQ

------------------------------------------------------------------------

# 3. Strategy 1 --- Local Retry (Simple Retry)

This strategy retries **inside the consumer before committing the
offset**.

Flow:

poll message\
↓\
process message\
↓ fail\
retry locally several times\
↓ still fail\
send message to DLQ\
↓\
commit offset

Example pseudo-code:

    poll message

    for retry in 1..3:
        try:
            process(message)
            commit offset
            break
        except Exception:
            if retry == 3:
                send message to DLQ
                commit offset

Advantages:

-   simple implementation
-   no additional Kafka topics required
-   good for **short transient errors**

Disadvantages:

-   the partition is blocked while retries happen
-   messages behind the failed one cannot be processed
-   not suitable for long retry delays

Example blocking scenario:

Partition:

offset0 → A\
offset1 → B\
offset2 → C

If A retries several times, B and C cannot be processed until retry
finishes.

------------------------------------------------------------------------

# 4. Strategy 2 --- Retry Topic Pattern (Recommended for Large Systems)

A common production pattern is to move failed messages into **retry
topics**.

Example topic design:

order-events\
order-events-retry-10s\
order-events-retry-1m\
order-events-retry-10m\
order-events-dlq

Message flow:

order-events\
↓\
consumer\
↓ failure\
order-events-retry-10s\
↓ failure\
order-events-retry-1m\
↓ failure\
order-events-retry-10m\
↓ failure\
order-events-dlq

Each retry topic introduces a **delayed retry stage**.

Advantages:

-   prevents partition blocking
-   allows delayed retries
-   isolates problematic messages
-   scales well in distributed systems

------------------------------------------------------------------------

# 5. Dead Letter Queue (DLQ)

A Dead Letter Queue is a Kafka topic storing messages that **cannot be
processed after retries**.

Example:

order-events-dlq

Example DLQ message structure:

{ orderId: 12345, error: "Invalid payment state", retryCount: 3,
timestamp: "2026-03-05T10:30:00" }

DLQ messages are typically:

-   inspected manually
-   corrected
-   replayed later

------------------------------------------------------------------------

# 6. Hybrid Strategy (Common Production Practice)

Many systems combine both retry approaches.

Flow:

process message\
↓\
local retry (fast retries)\
↓ still fail\
send to retry topic\
↓ delayed retries\
↓ still fail\
send to DLQ

Architecture:

order-events\
↓\
consumer\
↓\
local retry (3 times)\
↓ fail\
order-events-retry-10s\
↓ fail\
order-events-retry-1m\
↓ fail\
order-events-dlq

This approach provides:

-   fast recovery for transient failures
-   delayed retry for temporary system outages
-   DLQ for permanent failures

------------------------------------------------------------------------

# 7. Spring Boot Kafka Example

Consumer with local retry:

``` java
@KafkaListener(topics = "order-events")
public void consume(String message) {

    int retry = 0;

    while (retry < 3) {
        try {
            process(message);
            return;
        } catch (Exception e) {
            retry++;
        }
    }

    kafkaTemplate.send("order-events-dlq", message);
}
```

Producer for retry topics:

``` java
kafkaTemplate.send("order-events-retry-10s", message);
```

Producer for DLQ:

``` java
kafkaTemplate.send("order-events-dlq", message);
```

------------------------------------------------------------------------

# 8. Monitoring

DLQ topics should always be monitored.

Important metrics:

-   DLQ message count
-   retry failure rate
-   consumer lag
-   retry throughput

Common tools:

-   Prometheus
-   Grafana
-   Kafka Manager

------------------------------------------------------------------------

# 9. Best Practices

Recommended practices:

1.  Always implement a DLQ topic
2.  Use local retry for quick transient failures
3.  Use retry topics for delayed retries
4.  Monitor DLQ messages carefully
5.  Build tools to replay DLQ messages

------------------------------------------------------------------------

# 10. Summary

Kafka itself does not implement retry logic.

Applications implement reliability using:

-   local retries inside consumers
-   retry topics for delayed retries
-   DLQ topics for permanent failures

This pattern ensures Kafka systems remain **reliable, scalable, and
fault-tolerant**.
