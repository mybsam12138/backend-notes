# Kubernetes Secret -- Complete Summary and Spring Boot Usage Guide

## 1. What Is a Kubernetes Secret?

In Kubernetes, a **Secret** is a resource designed to store sensitive
data such as:

-   Database passwords
-   API tokens
-   OAuth client secrets
-   TLS certificates
-   Private keys
-   Docker registry credentials

Secrets separate sensitive information from application images and
configuration files.

------------------------------------------------------------------------

## 2. Why Base64 Is Used

Secret `data` values must be Base64 encoded because:

-   Kubernetes API is JSON-based.
-   JSON safely supports only UTF-8 text.
-   Secret values may contain arbitrary binary data.

Base64 ensures binary-safe serialization inside JSON.

Important: Base64 is NOT encryption.

------------------------------------------------------------------------

## 3. Secret Types and How to Create Them

### 3.1 Opaque (default)

Generic key-value storage.

#### Create via kubectl:

``` bash
kubectl create secret generic db-secret   --from-literal=username=admin   --from-literal=password=123456
```

#### YAML Example:

``` yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  username: admin
  password: 123456
```

------------------------------------------------------------------------

### 3.2 kubernetes.io/tls

Used for TLS certificates (`tls.crt` and `tls.key`).

#### Create via kubectl:

``` bash
kubectl create secret tls my-tls-secret   --cert=server.crt   --key=server.key
```

#### YAML Example:

``` yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-tls-secret
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-cert>
  tls.key: <base64-encoded-key>
```

#### Common Usage (Ingress):

``` yaml
spec:
  tls:
    - hosts:
        - example.com
      secretName: my-tls-secret
```

------------------------------------------------------------------------

### 3.3 kubernetes.io/dockerconfigjson

Used for private image registry authentication.

#### Create via kubectl:

``` bash
kubectl create secret docker-registry my-reg-secret   --docker-server=docker.io   --docker-username=myuser   --docker-password=mypassword   --docker-email=myemail@example.com
```

#### YAML Example:

``` yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-reg-secret
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64-encoded-docker-config-json>
```

#### Usage in Pod:

``` yaml
spec:
  imagePullSecrets:
    - name: my-reg-secret
```

------------------------------------------------------------------------

## 4. How Secrets Are Used in Pods

There are three main ways:

### 4.1 As Environment Variables

``` yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

------------------------------------------------------------------------

### 4.2 Using envFrom (Bulk Import)

``` yaml
envFrom:
  - secretRef:
      name: db-secret
```

Optional prefix:

``` yaml
envFrom:
  - secretRef:
      name: db-secret
    prefix: DB_
```

------------------------------------------------------------------------

### 4.3 As Mounted Files (Recommended for Production)

``` yaml
volumes:
  - name: secret-volume
    secret:
      secretName: db-secret

volumeMounts:
  - name: secret-volume
    mountPath: /etc/secrets
    readOnly: true
```

Each key becomes a file:

    /etc/secrets/password

------------------------------------------------------------------------

## 5. Using Kubernetes Secret in Spring Boot

### 5.1 Using Environment Variables

``` yaml
stringData:
  SPRING_DATASOURCE_PASSWORD: password123
```

Spring Boot maps:

SPRING_DATASOURCE_PASSWORD → spring.datasource.password

------------------------------------------------------------------------

### 5.2 Using Mounted Files

Mount Secret as file and configure Spring Boot:

``` properties
spring.datasource.password=${DB_PASSWORD_FILE}
```

------------------------------------------------------------------------

## 6. Secret Update Behavior

-   Updating a Secret does NOT update environment variables in running
    Pods.
-   Pods must be restarted.
-   Mounted Secret volumes update automatically, but application may
    need reload logic.

------------------------------------------------------------------------

## 7. Production Best Practices

-   Never commit real secrets to Git.
-   Use `stringData` instead of manual Base64.
-   Enable encryption at rest.
-   Prefer mounted files for high security.
-   Consider external secret managers (Vault, cloud KMS).
-   Use least-privilege RBAC.

------------------------------------------------------------------------

End of Document.
