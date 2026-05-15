# API Gateway

## Definition

An API Gateway is the **single entry point for all client requests into a distributed system**, sitting in front of all microservices and handling cross-cutting concerns centrally.

Instead of clients calling services directly:
```
❌ Without API Gateway:
Client → user-service:8081
Client → order-service:8082
Client → payment-service:8083
# Client needs to know every service address
# Every service handles auth, logging, rate limiting separately
```

With API Gateway:
```
✅ With API Gateway:
Client → API Gateway (single entry point)
    ↓
Gateway routes to the right service
# Client only knows one address
# Cross-cutting concerns handled in one place
```

---

## Purpose

| Purpose | Explanation |
|---|---|
| **Single entry point** | Clients only need to know one address |
| **Routing** | Route requests to the correct microservice |
| **Authentication** | Verify tokens/API keys once, not in every service |
| **Rate limiting** | Control request frequency per client |
| **Load balancing** | Distribute traffic across service instances |
| **SSL termination** | Handle HTTPS in one place |
| **Request/Response transformation** | Modify headers, body before forwarding |
| **Logging & Monitoring** | Centralized request tracing |
| **Circuit breaking** | Stop forwarding to unhealthy services |

> In short — **API Gateway is the traffic cop of your microservices**, handling everything that every service would otherwise need to do itself.

---

## How it Works (General Flow)

```
1. Client sends request to Gateway
2. Gateway authenticates the request
3. Gateway applies rate limiting
4. Gateway routes to the correct service based on path/header
5. Gateway forwards the request
6. Service responds to Gateway
7. Gateway transforms response if needed
8. Gateway returns response to Client
```

---

## Implementation in Spring Cloud — Spring Cloud Gateway

Spring Cloud Gateway is the **official API Gateway for Spring Cloud**, built on Spring WebFlux (reactive, non-blocking).

### Setup

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

### Basic Routing

```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service        # lb = load balanced via Eureka
          predicates:
            - Path=/api/users/**        # route if path matches
          filters:
            - StripPrefix=1             # remove /api prefix before forwarding

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
```

```
Client → GET /api/users/123
    ↓
Gateway matches Path=/api/users/**
    ↓
Strips /api prefix → /users/123
    ↓
Forwards to user-service/users/123
```

### Predicates — When to Route

```yaml
predicates:
  - Path=/api/users/**              # by path
  - Method=GET,POST                 # by HTTP method
  - Header=X-Request-Id, \d+        # by header
  - Host=**.example.com             # by host
  - Query=version, v2               # by query param
  - After=2024-01-01T00:00:00+08:00 # by time
```

### Filters — What to Do

```yaml
filters:
  - StripPrefix=1                   # remove path prefix
  - AddRequestHeader=X-User, admin  # add request header
  - AddResponseHeader=X-Response-Time, 100ms
  - RedirectTo=302, https://example.com
  - RewritePath=/api/(?<segment>.*), /$\{segment}
```

### Authentication Filter

```java
@Component
public class AuthFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest()
                               .getHeaders()
                               .getFirst("Authorization");

        if (token == null || !isValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();  // reject request
        }

        return chain.filter(exchange);  // pass through to service
    }

    @Override
    public int getOrder() {
        return -1;  // run first
    }
}
```

### Rate Limiting

```yaml
# requires Redis
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10    # 10 requests/second
                redis-rate-limiter.burstCapacity: 20    # max burst
                key-resolver: "#{@userKeyResolver}"     # rate limit per user
```

```java
@Bean
public KeyResolver userKeyResolver() {
    // rate limit by IP address
    return exchange -> Mono.just(
        exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
    );
}
```

### Circuit Breaker

```yaml
filters:
  - name: CircuitBreaker
    args:
      name: userServiceCB
      fallbackUri: forward:/fallback/users   # fallback when service is down
```

### Spring Cloud Gateway Architecture

```
Client
    ↓
Spring Cloud Gateway
    ├── GlobalFilters (auth, logging, rate limit)
    ├── Route Matching (predicates)
    ├── Route Filters (transform request/response)
    └── Load Balancer (via Eureka/K8s)
    ↓
Microservices
```

---

## Implementation in Kubernetes — Ingress + Ingress Controller

Kubernetes uses **Ingress** resource + **Ingress Controller** as its API Gateway solution.

### Ingress Resource

Defines routing rules:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /api/users(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: user-service
                port:
                  number: 80

          - path: /api/orders(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: order-service
                port:
                  number: 80
```

### Ingress Controller — Nginx

The most common Ingress Controller:

```yaml
# Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

```yaml
# Authentication via annotation
annotations:
  nginx.ingress.kubernetes.io/auth-url: "http://auth-service/validate"
  nginx.ingress.kubernetes.io/auth-signin: "http://auth-service/login"
```

```yaml
# Rate limiting
annotations:
  nginx.ingress.kubernetes.io/limit-rps: "10"           # 10 requests/second
  nginx.ingress.kubernetes.io/limit-connections: "5"    # max 5 connections
```

```yaml
# SSL termination
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: tls-secret    # K8s Secret containing cert and key
  rules:
    - host: api.example.com
```

### Ingress Controller — Istio Gateway (Advanced)

For more advanced gateway features:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: api-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - api.example.com
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: api-routing
spec:
  hosts:
    - api.example.com
  gateways:
    - api-gateway
  http:
    - match:
        - uri:
            prefix: /api/users
      route:
        - destination:
            host: user-service
    - match:
        - uri:
            prefix: /api/orders
      route:
        - destination:
            host: order-service
```

---

## Spring Cloud Gateway vs Kubernetes Ingress

| Feature | Spring Cloud Gateway | K8s Ingress (Nginx) | K8s Istio Gateway |
|---|---|---|---|
| **Routing** | ✅ Path, header, method | ✅ Path, host | ✅ Advanced |
| **Authentication** | ✅ Custom filter | ⚠️ External auth only | ✅ JWT built-in |
| **Rate limiting** | ✅ Built-in (Redis) | ✅ Annotation | ✅ Built-in |
| **Circuit breaker** | ✅ Built-in | ❌ | ✅ Built-in |
| **Load balancing** | ✅ Via Eureka/K8s | ✅ Via Service | ✅ Advanced |
| **SSL termination** | ✅ | ✅ | ✅ |
| **Request transformation** | ✅ Filters | ⚠️ Limited | ✅ |
| **K8s native** | ❌ Extra deployment | ✅ | ✅ |
| **Complexity** | Medium | Low | High |

---

## Key Concepts Summary

| Concept | Meaning |
|---|---|
| **Predicate** | Condition to match a route (path, header, method) |
| **Filter** | Action to perform on request/response |
| **Global Filter** | Filter applied to ALL routes (auth, logging) |
| **Route Filter** | Filter applied to specific route only |
| **Rate Limiter** | Controls how many requests per second per client |
| **Circuit Breaker** | Stops forwarding to unhealthy service, returns fallback |
| **SSL Termination** | Gateway handles HTTPS, forwards HTTP internally |
| **Ingress Controller** | K8s component that implements the Ingress rules |

---

## Rule of Thumb

```
On Kubernetes:
→ Simple routing, SSL, rate limiting → Nginx Ingress (simple, low overhead)
→ Advanced traffic management, auth, circuit breaker → Istio Gateway
→ Need Spring-specific features (Eureka, custom filters) → Spring Cloud Gateway

Not on Kubernetes:
→ Spring Cloud Gateway is the standard choice

Common hybrid:
→ Nginx Ingress as outer gateway (SSL, routing)
→ Spring Cloud Gateway as inner gateway (auth, rate limit, circuit breaker)
```
