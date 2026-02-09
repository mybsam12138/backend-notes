# Kubernetes Production Deployment – Common YAML Template

This document provides a **production-ready Kubernetes deployment template**.
It summarizes the most common objects and configurations used in real-world clusters.

---

## 1. Namespace

Isolate production workloads.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prod
```

---

## 2. Deployment

Key production characteristics:
- Explicit resource requests and limits
- Rolling update strategy
- Health probes
- Stateless container design

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: prod
  labels:
    app: my-app
spec:
  replicas: 3
  revisionHistoryLimit: 5

  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0

  selector:
    matchLabels:
      app: my-app

  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: app
          image: my-registry/my-app:1.0.0
          imagePullPolicy: IfNotPresent

          ports:
            - containerPort: 8080

          resources:
            requests:
              cpu: "200m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"

          env:
            - name: SPRING_PROFILES_ACTIVE
              value: prod

          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5

          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
```

---

## 3. Service

Provides stable access to Pods and enables load balancing.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  namespace: prod
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```

---

## 4. Horizontal Pod Autoscaler (HPA)

Automatically scales Pods based on CPU usage.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## 5. ConfigMap

Externalize configuration from the container image.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-app-config
  namespace: prod
data:
  application.yml: |
    server:
      port: 8080
```

---

## 6. Secret

Store sensitive data securely.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-app-secret
  namespace: prod
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQ=
```

---

## 7. Ingress

Expose services to external traffic.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  namespace: prod
spec:
  rules:
    - host: my-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 80
```

---

## 8. Production Checklist

- Resource requests and limits defined
- Readiness and liveness probes enabled
- Rolling update strategy configured
- HPA enabled
- Configuration externalized
- Secrets not baked into images
- Namespace isolation

---

## 9. Mental Model

Kubernetes does not “run containers” directly.
It **reconciles desired state through controllers** until the system matches the declaration.
