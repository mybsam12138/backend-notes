# Health Check

## Definition

Health Check is the **mechanism by which a distributed system continuously monitors whether each service instance is alive and ready to handle traffic**, automatically removing unhealthy instances from the load balancer.

Instead of waiting for users to report errors:
```
❌ Without health check:
User request → dead service → error 500 → user complains

✅ With health check:
Service dies → system detects it → removes from rotation → user never hits it
```

---

## Purpose

| Purpose | Explanation |
|---|---|
| **Detect failures automatically** | Know a service is down before users do |
| **Remove bad instances** | Stop routing traffic to unhealthy pods |
| **Auto-recovery** | Restart crashed services automatically |
| **Zero-downtime deploys** | Only route to new instances when they are truly ready |
| **Dependency awareness** | Know if DB/Redis/downstream services are reachable |
| **Graceful startup** | Don't send traffic to a service that hasn't finished starting yet |

> In short — **Health Check is the immune system of a distributed system**, constantly checking and self-healing.

---

## Two Types of Health Checks

| Type | What it does | Who triggers it |
|---|---|---|
| **Active** | System proactively pings the service | Load balancer / orchestrator |
| **Passive** | System watches real traffic for failures | Proxy / load balancer |

---

## Three Probe Types (K8s terminology, applies broadly)

| Probe | Question it answers | Action on failure |
|---|---|---|
| **Liveness** | Is the service alive? | Restart the container |
| **Readiness** | Is the service ready for traffic? | Remove from load balancer |
| **Startup** | Has the service finished starting? | Delay liveness/readiness checks |

---

## Implementation in Spring Cloud — Spring Boot Actuator

Spring Boot uses **Actuator** to expose health endpoints that Eureka and load balancers can poll.

### Setup

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health, info
  endpoint:
    health:
      show-details: always   # show details of each health component
```

### Basic Health Endpoint

```bash
GET /actuator/health

# Response
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

Spring Boot **auto-detects** common dependencies and adds them automatically:

| Dependency | Auto health indicator |
|---|---|
| DataSource (MySQL etc.) | DB connectivity check |
| Redis | Redis ping check |
| RabbitMQ / Kafka | Broker connectivity check |
| Elasticsearch | Cluster health check |

### Liveness vs Readiness in Spring Boot

Spring Boot 2.3+ has built-in liveness and readiness support:

```yaml
management:
  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true
```

```bash
# Liveness — is the app alive?
GET /actuator/health/liveness
→ { "status": "UP" }

# Readiness — is the app ready for traffic?
GET /actuator/health/readiness
→ { "status": "UP" }
```

### Custom Health Indicator

```java
@Component
public class PaymentGatewayHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        boolean gatewayReachable = checkPaymentGateway();

        if (gatewayReachable) {
            return Health.up()
                .withDetail("gateway", "reachable")
                .build();
        } else {
            return Health.down()
                .withDetail("gateway", "unreachable")
                .withDetail("reason", "connection timeout")
                .build();
        }
    }

    private boolean checkPaymentGateway() {
        // your check logic here
    }
}
```

```bash
GET /actuator/health
→ {
    "status": "DOWN",
    "components": {
      "paymentGateway": {
        "status": "DOWN",
        "details": { "gateway": "unreachable" }
      }
    }
  }
```

### How Eureka Uses Health Check

```
Spring Boot app → sends heartbeat to Eureka every 30s
Eureka → if no heartbeat for 90s → marks instance as DOWN
Ribbon → reads Eureka registry → skips DOWN instances
```

```yaml
# Fine-tune Eureka health check behaviour
eureka:
  client:
    healthcheck:
      enabled: true    # Eureka uses /actuator/health, not just heartbeat
  instance:
    lease-renewal-interval-in-seconds: 30    # heartbeat interval
    lease-expiration-duration-in-seconds: 90 # time before marked DOWN
```

---

## Implementation in Kubernetes — Probes

Kubernetes provides **three built-in probes** that are configured directly in the Pod spec.

### Liveness Probe

Answers: **"Is this container still alive?"**
Action on failure: **K8s restarts the container**

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30    # wait 30s before first check (let app start)
  periodSeconds: 10          # check every 10s
  failureThreshold: 3        # restart after 3 consecutive failures
  timeoutSeconds: 5          # timeout per check
```

### Readiness Probe

Answers: **"Is this container ready to receive traffic?"**
Action on failure: **K8s removes Pod from Service Endpoints (stops routing traffic)**

```yaml
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3
  successThreshold: 1        # how many successes to mark as ready again
```

### Startup Probe

Answers: **"Has the container finished starting up?"**
Action: **Delays liveness/readiness checks until startup succeeds**
Use for: **slow-starting apps (legacy apps, heavy JVM startup)**

```yaml
startupProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  failureThreshold: 30       # allow up to 30 * 10s = 5 minutes to start
  periodSeconds: 10
```

### Three Probe Methods

```yaml
# Method 1: HTTP GET (most common)
httpGet:
  path: /actuator/health
  port: 8080

# Method 2: TCP Socket (for non-HTTP services)
tcpSocket:
  port: 3306

# Method 3: Exec command
exec:
  command:
    - cat
    - /tmp/healthy
```

### Full Example — All Three Probes Together

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  containers:
    - name: order-service
      image: order-service:1.0
      ports:
        - containerPort: 8080
      startupProbe:
        httpGet:
          path: /actuator/health
          port: 8080
        failureThreshold: 30
        periodSeconds: 10
      livenessProbe:
        httpGet:
          path: /actuator/health/liveness
          port: 8080
        initialDelaySeconds: 0    # startup probe handles the delay
        periodSeconds: 10
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /actuator/health/readiness
          port: 8080
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 3
```

---

## How K8s Probes Work Together

```
Pod starts
    ↓
Startup Probe runs
    → keeps checking until success
    → liveness + readiness are paused during this time
    ↓
Startup succeeds
    ↓
Liveness + Readiness probes begin
    ↓
Readiness passes → Pod added to Service Endpoints → traffic flows in
    ↓
(later) Liveness fails 3 times → K8s restarts container
(later) Readiness fails → Pod removed from Endpoints → no traffic
```

---

## Spring Cloud vs Kubernetes — Health Check

| Feature | Spring Cloud (Actuator + Eureka) | Kubernetes (Probes) |
|---|---|---|
| **Liveness check** | Eureka heartbeat | livenessProbe |
| **Readiness check** | `/actuator/health` via Eureka | readinessProbe |
| **Startup handling** | `initialDelaySeconds` workaround | startupProbe (clean solution) |
| **Auto restart** | ❌ Eureka just marks DOWN | ✅ K8s restarts container |
| **Remove from LB** | ✅ Eureka marks instance DOWN | ✅ Removed from Endpoints |
| **Custom checks** | ✅ Custom HealthIndicator | ⚠️ Limited (only HTTP/TCP/exec) |
| **Dependency checks** | ✅ Auto (DB, Redis, MQ) | ❌ Not built-in |
| **Extra setup** | Actuator dependency | No extra setup |

---

## Key Concepts Summary

| Concept | Meaning |
|---|---|
| **Liveness** | Is the service alive? Restart if not |
| **Readiness** | Is the service ready for traffic? Remove from LB if not |
| **Startup Probe** | Give slow apps time to start before liveness kicks in |
| **Heartbeat** | Periodic signal saying "I'm still alive" |
| **Health Indicator** | Custom logic to check a specific dependency |
| **Self-healing** | System automatically restarts or removes failed instances |

---

## Rule of Thumb

```
Always define both liveness and readiness probes in K8s
→ liveness  = is it broken? (restart)
→ readiness = is it ready?  (traffic)

Never point both at the same endpoint!
→ liveness failing = restart (destructive)
→ readiness failing = just stop traffic (safe)
→ if DB goes down, readiness should fail (stop traffic)
→ but liveness should stay UP (no need to restart the app)
```
