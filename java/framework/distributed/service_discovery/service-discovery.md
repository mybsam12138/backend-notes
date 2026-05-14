# Service Discovery

## Definition

Service Discovery is the **mechanism by which services in a distributed system automatically detect and locate each other** without hardcoded addresses.

Instead of hardcoding:
```
http://192.168.1.10:8080/users  ← breaks when IP changes
```

Services find each other by **name**:
```
http://user-service/users  ← always works
```

---

## Purpose

When you have many services running as multiple instances with dynamic IPs, you need a way to:

| Purpose | Explanation |
|---|---|
| **Avoid hardcoding IPs** | IPs change constantly in cloud/container environments |
| **Handle scaling** | New instances spin up, old ones go down dynamically |
| **Handle failures** | Dead instances should be automatically removed |
| **Enable communication** | Services need to find each other to work together |

> In short — **Service Discovery is the foundation of service-to-service communication** in microservices.

---

## How it Works (General Flow)

```
1. Service starts   → registers itself in a Registry (name + IP + port)
2. Service runs     → sends heartbeats to prove it's alive
3. Service crashes  → registry removes it after missed heartbeats
4. Another service  → looks up by name, gets current IP
5. Makes the call   → using the resolved address
```

---

## Two Patterns

### 1. Client-Side Discovery
- Client asks the registry directly, picks an instance, and calls it
- Client is responsible for load balancing
- Example: **Eureka** (Spring Cloud)

```
Client → Registry → gets list of instances → picks one → calls it directly
```

### 2. Server-Side Discovery
- Client calls a router/proxy, which asks the registry and forwards the request
- Client doesn't need to know about instances
- Example: **Kubernetes Service**, **AWS ALB**

```
Client → Load Balancer/Proxy → Registry → forwards to instance
```

---

## Implementation in Spring Cloud (Eureka)

Spring Cloud uses **Eureka** — a client-side service discovery tool.

### Components

| Component | Role |
|---|---|
| **Eureka Server** | The registry (central phone book) |
| **Eureka Client** | Every microservice that registers and looks up |

### How it works

```
Order Service → registers → Eureka Server
User Service  → registers → Eureka Server

Order Service → "where is User Service?" → Eureka Server
Eureka Server → "here are the instances"  → Order Service
Order Service → picks one instance → calls it directly
```

### Setup

**Eureka Server:**
```java
@SpringBootApplication
@EnableEurekaServer
public class RegistryApp { }
```

```yaml
# application.yml
server:
  port: 8761
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
```

**Eureka Client (any microservice):**
```java
@SpringBootApplication
@EnableDiscoveryClient
public class OrderServiceApp { }
```

```yaml
# application.yml
spring:
  application:
    name: order-service   # name others use to find you
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
```

**Calling another service by name:**
```java
@Autowired
private DiscoveryClient discoveryClient;

// or with RestTemplate + @LoadBalanced
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// Call by service name — no hardcoded IP
restTemplate.getForObject("http://user-service/users", List.class);
```

---

## Implementation in Kubernetes

Kubernetes provides **server-side service discovery** natively — no extra tools needed.

### How it works

```
Pod starts       → registered automatically by K8s
K8s Service      → acts as stable DNS entry + load balancer
Other Pod        → calls by service name via K8s DNS
kube-proxy       → routes to actual pod IP behind the scenes
```

### Setup

**Define a Service (acts as the registry entry):**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service       # this is the DNS name
spec:
  selector:
    app: user-service      # matches pods with this label
  ports:
    - port: 80
      targetPort: 8080
```

**Call by service name — K8s DNS resolves it:**
```java
// Inside a pod, just use the service name
restTemplate.getForObject("http://user-service/users", List.class);

// K8s DNS full format: service-name.namespace.svc.cluster.local
// http://user-service.default.svc.cluster.local/users
```

**No Eureka needed** — K8s handles registration, heartbeats, and removal automatically when pods start/stop.

---

## Spring Cloud vs Kubernetes — Service Discovery

| Feature | Spring Cloud (Eureka) | Kubernetes |
|---|---|---|
| **Pattern** | Client-side | Server-side |
| **Registry** | Eureka Server | etcd (internal) |
| **DNS** | Manual lookup | Built-in K8s DNS |
| **Health check** | Heartbeat to Eureka | Liveness/Readiness probes |
| **Load balancing** | Client does it | kube-proxy does it |
| **Extra setup** | Yes (Eureka Server) | No (built-in) |

> **Rule of thumb:** If you're on Kubernetes, use K8s Service Discovery and skip Eureka. If you're not on K8s, use Spring Cloud Eureka.

---

## Key Concepts Summary

| Concept | Meaning |
|---|---|
| **Service Registry** | Database storing all service locations |
| **Register** | Service announces itself on startup |
| **Heartbeat** | Service keeps sending "I'm alive" signals |
| **Deregister** | Service removed when it stops or crashes |
| **Lookup** | Client queries registry to find a service |
| **Health Check** | Verifying a service instance is actually healthy |
