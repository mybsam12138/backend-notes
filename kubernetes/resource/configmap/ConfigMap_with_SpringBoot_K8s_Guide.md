# ConfigMap Usage with Spring Boot in Kubernetes

## 1. What is ConfigMap?

A **ConfigMap** is a Kubernetes object used to store non-sensitive
configuration data. It separates configuration from the container image,
allowing environment-specific settings without rebuilding Docker images.

------------------------------------------------------------------------

## 2. Why Use ConfigMap with Spring Boot?

Spring Boot reads configuration from multiple sources:

1.  Command-line arguments
2.  Environment variables
3.  External configuration files
4.  Internal `application.yaml`

ConfigMap can provide configuration as:

-   Environment variables
-   External YAML files (mounted as volumes)

This enables clean separation between:

-   Immutable container image
-   Environment-specific configuration

------------------------------------------------------------------------

## 3. Common Production Practice

### Recommended Pattern

-   Keep default config inside Docker image
-   Store environment-specific config in ConfigMap
-   Inject ConfigMap into Pod
-   Use rolling restart to activate changes

------------------------------------------------------------------------

## 4. Method 1 -- Inject as Environment Variables (Most Common)

### ConfigMap Example

``` yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: insurance-app-config
data:
  SPRING_PROFILES_ACTIVE: prod
  DB_HOST: mysql-service
  REDIS_HOST: redis-service
```

### Deployment Pod Template Example

``` yaml
spec:
  containers:
    - name: backend
      image: insurance-backend:1.0.0
      envFrom:
        - configMapRef:
            name: insurance-app-config
```

Spring Boot automatically reads environment variables.

------------------------------------------------------------------------

## 5. Method 2 -- Mount as application.yaml File

### ConfigMap with YAML Content

``` yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: insurance-yaml-config
data:
  application.yaml: |
    spring:
      datasource:
        url: jdbc:mysql://mysql-service:3306/insurance
```

### Deployment Volume Mount Example

``` yaml
spec:
  containers:
    - name: backend
      image: insurance-backend:1.0.0
      args:
        - "--spring.config.additional-location=/app/config/"
      volumeMounts:
        - name: config-volume
          mountPath: /app/config
  volumes:
    - name: config-volume
      configMap:
        name: insurance-yaml-config
```

Each key in the ConfigMap becomes a file inside `/app/config`.

------------------------------------------------------------------------

## 6. Configuration Priority in Spring Boot

Spring Boot resolves configuration in this order (highest to lowest):

1.  Command-line arguments (`args` in Kubernetes)
2.  Environment variables
3.  External configuration files
4.  Internal `application.yaml`

If the same property exists in multiple places, higher priority
overrides lower.

------------------------------------------------------------------------

## 7. Important Production Notes

-   ConfigMap is NOT encrypted.
-   ConfigMap changes do NOT automatically restart Pods.
-   Use `kubectl rollout restart deployment <name>` to apply changes.
-   Use Secret for passwords and sensitive data.
-   Use GitOps for version control of ConfigMap definitions.

------------------------------------------------------------------------

## 8. Architecture Summary

ConfigMap is designed for:

-   Infrastructure-level configuration
-   Environment differentiation (dev / test / prod)
-   Deployment-time configuration injection

It is NOT a dynamic configuration center or business rule engine.

------------------------------------------------------------------------

## 9. Best Practice Checklist

-   Do not bake environment config into Docker image
-   Use ConfigMap for non-sensitive data
-   Use Secret for credentials
-   Keep configuration under Git version control
-   Treat configuration change as a deployment event
-   Prefer rolling update for zero downtime

------------------------------------------------------------------------

End of Document
