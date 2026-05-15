# Config Management

## Definition

Config Management is the **mechanism by which services in a distributed system externalize their configuration** — separating config from code so that settings can change without redeploying the application.

Instead of hardcoding:
```java
// ❌ hardcoded in code — requires redeploy to change
String dbUrl = "jdbc:mysql://192.168.1.10:3306/mydb";
int timeout = 5000;
```

Config is externalized:
```yaml
# ✅ lives outside the app — change without redeploying
db:
  url: jdbc:mysql://192.168.1.10:3306/mydb
timeout: 5000
```

---

## Purpose

| Purpose | Explanation |
|---|---|
| **Environment separation** | Different config for dev / staging / prod without code changes |
| **No redeploy on config change** | Update a timeout or feature flag without rebuilding the image |
| **Centralized management** | One place to manage config for all services |
| **Security** | Sensitive values (passwords, API keys) stored separately from code |
| **Auditability** | Track who changed what config and when |
| **Dynamic refresh** | Some implementations allow live config updates without restart |

> In short — **Config Management lets you treat config as a first-class concern**, separate from application logic.

---

## How it Works (General Flow)

```
1. Config is stored externally (Git repo, etcd, Vault, etc.)
2. Service starts → fetches its config from the central store
3. Config changes → either service refreshes automatically or on next restart
4. Secrets → stored encrypted, injected at runtime
```

---

## Implementation in Spring Cloud — Config Server

Spring Cloud uses a **centralized Config Server** backed by a Git repository (or filesystem, Vault, etc.).

### Components

| Component | Role |
|---|---|
| **Config Server** | Central server that serves config to all services |
| **Config Client** | Every microservice that fetches config from the server |
| **Git Repo** | Where config files actually live |

### How it Works

```
Git Repo (config files)
    ↑
Config Server  ←  fetches and serves config
    ↑
Microservices  ←  fetch their config on startup
```

### Setup

**Config Server:**
```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApp { }
```

```yaml
# application.yml
server:
  port: 8888
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          search-paths: '{application}'  # folder per service
```

**Config Client (any microservice):**
```xml
<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

```yaml
# bootstrap.yml (loaded before application.yml)
spring:
  application:
    name: order-service        # fetches order-service.yml from Git
  cloud:
    config:
      uri: http://config-server:8888
      profile: prod            # fetches order-service-prod.yml
```

**Git Repo Structure:**
```
config-repo/
├── order-service.yml          # default config
├── order-service-dev.yml      # dev profile
├── order-service-prod.yml     # prod profile
├── user-service.yml
└── user-service-prod.yml
```

**Accessing config in code:**
```java
@Value("${db.url}")
private String dbUrl;

// or with @ConfigurationProperties
@ConfigurationProperties(prefix = "db")
public class DbConfig {
    private String url;
    private int timeout;
}
```

### Dynamic Refresh (without restart)

```java
// Add @RefreshScope to beans that should reload on config change
@RestController
@RefreshScope
public class OrderController {
    @Value("${feature.newCheckout}")
    private boolean newCheckout;
}
```

```bash
# Trigger refresh via actuator endpoint
POST http://order-service/actuator/refresh

# Or use Spring Cloud Bus to broadcast refresh to ALL instances at once
POST http://config-server/actuator/bus-refresh
```

---

## Implementation in Kubernetes — ConfigMap & Secret

Kubernetes provides **native config management** through two resources:

| Resource | Use For |
|---|---|
| **ConfigMap** | Non-sensitive config (URLs, feature flags, timeouts) |
| **Secret** | Sensitive data (passwords, API keys, tokens) |

### ConfigMap

**Define a ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: order-service-config
data:
  DB_URL: "jdbc:mysql://mysql:3306/orders"
  TIMEOUT: "5000"
  FEATURE_NEW_CHECKOUT: "true"
  # or as a full config file
  application.yml: |
    db:
      url: jdbc:mysql://mysql:3306/orders
    timeout: 5000
```

**Inject into Pod as environment variables:**
```yaml
spec:
  containers:
    - name: order-service
      envFrom:
        - configMapRef:
            name: order-service-config   # all keys become env vars
```

**Or inject as a mounted file:**
```yaml
spec:
  containers:
    - name: order-service
      volumeMounts:
        - name: config-volume
          mountPath: /config             # app reads /config/application.yml
  volumes:
    - name: config-volume
      configMap:
        name: order-service-config
```

### Secret

**Define a Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: order-service-secrets
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQxMjM=   # base64 encoded
  API_KEY: c2VjcmV0a2V5MTIz
```

**Inject into Pod:**
```yaml
spec:
  containers:
    - name: order-service
      env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: order-service-secrets
              key: DB_PASSWORD
```

### Dynamic Refresh in Kubernetes

Unlike Spring Cloud Config, Kubernetes does **not** auto-refresh env vars when a ConfigMap changes. Options:

| Approach | Behaviour |
|---|---|
| **Restart Pod** | Most common — update ConfigMap, rollout restart |
| **Mounted file** | File updates automatically, app must watch for changes |
| **Reloader (tool)** | Tools like `Reloader` watch ConfigMaps and auto-restart Pods |

```bash
# Force restart after ConfigMap update
kubectl rollout restart deployment/order-service
```

---

## Spring Cloud vs Kubernetes — Config Management

| Feature | Spring Cloud Config Server | Kubernetes ConfigMap / Secret |
|---|---|---|
| **Storage backend** | Git, Vault, filesystem | etcd (internal to K8s) |
| **Config format** | YAML / Properties files in Git | YAML manifest or key-value |
| **Environment profiles** | Built-in (dev, prod, staging) | Separate ConfigMap per namespace/env |
| **Dynamic refresh** | ✅ Yes, via `/actuator/refresh` or Bus | ⚠️ Partial (mounted files update, env vars don't) |
| **Secrets management** | Needs Vault integration | ✅ Native Secret resource |
| **Audit trail** | ✅ Git history | ❌ Limited (need external tooling) |
| **Extra setup** | Yes (Config Server deployment) | No (built into K8s) |
| **Version history** | ✅ Full Git history | ❌ No built-in versioning |
| **Encryption** | Needs Vault or manual encryption | Base64 only (not true encryption) |

---

## Key Concepts Summary

| Concept | Meaning |
|---|---|
| **Config Server** | Central service that stores and serves config |
| **ConfigMap** | K8s resource for non-sensitive config |
| **Secret** | K8s resource for sensitive config (passwords, keys) |
| **Profile** | Environment-specific config (dev, prod, staging) |
| **Dynamic Refresh** | Updating config without restarting the service |
| **Externalized Config** | Config lives outside the application code/image |
| **Bootstrap Config** | Config loaded before the application itself starts |

---

## Rule of Thumb

```
Running on Kubernetes?
→ Use ConfigMap + Secret
→ Add Vault for production-grade secret management
→ Skip Spring Cloud Config Server

Not on Kubernetes?
→ Use Spring Cloud Config Server backed by Git
→ Add Spring Cloud Bus for live refresh across all instances
```
