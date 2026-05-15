# Load Balancing

## Definition

Load Balancing is the **mechanism of distributing incoming requests across multiple instances of a service** to avoid overloading any single one.

Without it:
```
All requests → one instance → overloaded → slow or crash
```

With it:
```
Requests → Load Balancer → [instance1, instance2, instance3]
                            evenly distributed, no single point of failure
```

---

## Purpose

| Purpose | Explanation |
|---|---|
| **Availability** | If one instance dies, others still serve traffic |
| **Scalability** | Add more instances to handle more load |
| **Performance** | No single instance gets overwhelmed |
| **Zero downtime** | Rolling deploys — take instances down one by one |

---

## Strategies

| Strategy | How | Best for |
|---|---|---|
| **Round Robin** | Rotate through instances in order | General purpose, default |
| **Weighted Round Robin** | Some instances get more traffic | Instances with different capacity |
| **Least Connections** | Pick instance with fewest active requests | Long-lived connections |
| **IP Hash** | Same client always goes to same instance | Sticky sessions |
| **Random** | Pick randomly | Simple, works well at scale |

---

## Two Levels of Load Balancing

```
External (user → your system)     → Dedicated Load Balancer (AWS ALB, Nginx)
Internal (service → service)      → Built into service discovery (Eureka / kube-proxy)
```

### External Level
```
Users on internet
      ↓
  Load Balancer  (AWS ALB, Nginx, Cloudflare)
      ↓
[instance1]  [instance2]  [instance3]
```

### Internal Level (service to service)
```
Order Service
      ↓
  Load Balancer (client-side or proxy)
      ↓
[user-service:1]  [user-service:2]  [user-service:3]
```

---

## Implementation in Spring Cloud

Spring Cloud uses **Spring Cloud LoadBalancer** (client-side) — built into Eureka.

Since the Eureka client already caches the full list of instances locally, it picks one before making the call — no extra network hop needed.

### How it works

```
Local cache:
user-service → [192.168.1.10:8080, 192.168.1.11:8080, 192.168.1.12:8080]

Request → read local cache → pick one (Round Robin) → call directly
```

### Setup

Add dependency:
```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

Use `@LoadBalanced` on RestTemplate:
```java
@Bean
@LoadBalanced  // enables client-side load balancing
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// Call by service name — automatically load balanced
restTemplate.getForObject("http://user-service/users", List.class);
```

Or with WebClient:
```java
@Bean
@LoadBalanced
public WebClient.Builder webClientBuilder() {
    return WebClient.builder();
}
```

### Custom Strategy

```java
@Configuration
public class LoadBalancerConfig {

    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(
            Environment environment,
            LoadBalancerClientFactory factory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(
            factory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
    }
}
```

### Default Strategy
- **Round Robin** — rotates through instances in order

---

## Implementation in Kubernetes

K8s provides load balancing at multiple layers depending on what you need.

### Layer 1: kube-proxy (default, built-in)

Handles internal service-to-service load balancing automatically.

```
Pod calls "user-service"
  → K8s DNS resolves to ClusterIP
  → kube-proxy routes to one of the pods (iptables rules)
  → Round Robin by default
```

No config needed — works automatically when you define a Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service    # load balances across all matching pods
  ports:
    - port: 80
      targetPort: 8080
```

### Layer 2: Ingress Controller (external traffic + more strategies)

For external traffic and more control over routing:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: user-service-ingress
  annotations:
    nginx.ingress.kubernetes.io/load-balance: "round_robin"  # or "least_conn", "ip_hash"
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            pathType: Prefix
            backend:
              service:
                name: user-service
                port:
                  number: 80
```

Popular Ingress Controllers: **Nginx**, **Traefik**, **HAProxy**

### Layer 3: Service Mesh — Istio (advanced strategies)

For fine-grained traffic control:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN       # or ROUND_ROBIN, RANDOM, PASSTHROUGH
```

Weighted routing (canary deployments):
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  http:
    - route:
        - destination:
            host: user-service
            subset: v1
          weight: 90           # 90% to stable version
        - destination:
            host: user-service
            subset: v2
          weight: 10           # 10% to new version (canary)
```

---

## Spring Cloud vs Kubernetes — Load Balancing Comparison

| Feature | Spring Cloud LoadBalancer | K8s kube-proxy | K8s + Ingress | K8s + Istio |
|---|---|---|---|---|
| **Pattern** | Client-side | Server-side | Server-side | Server-side |
| **Round Robin** | ✅ | ✅ | ✅ | ✅ |
| **Random** | ✅ | ✅ | ✅ | ✅ |
| **Weighted** | ✅ | ❌ | ❌ | ✅ |
| **Least Connections** | ❌ | ❌ | ✅ | ✅ |
| **Sticky Sessions** | ❌ | ❌ | ✅ | ✅ |
| **Canary Deployments** | ❌ | ❌ | ⚠️ limited | ✅ |
| **Extra setup needed** | No | No | Yes (controller) | Yes (mesh) |
| **Network hops** | 1 (direct) | 2 (via proxy) | 2 (via proxy) | 2 (via proxy) |

---

## Key Takeaway

```
Simple app          → kube-proxy default is good enough
Need more control   → add Ingress Controller (Nginx, Traefik)
Need full traffic   → add Service Mesh (Istio)
management

Spring Cloud        → client does load balancing (no extra hop)
Kubernetes          → proxy does load balancing (one extra hop, but fast)
```

Load balancing and service discovery are tightly coupled — you can't pick an instance without knowing what instances exist.
