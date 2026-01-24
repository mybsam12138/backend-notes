# Understanding Nginx Configuration
*A practical guide for frontend, backend, and Docker deployments*

This document summarizes **core Nginx configuration concepts** you commonly encounter when:
- deploying frontend (SPA) applications
- reverse proxying to backend services
- running Nginx inside Docker

It focuses on **how Nginx thinks**, not just syntax.

---

## What Is Nginx?

Nginx is:
- a web server
- a reverse proxy
- a load balancer

At its core, it:
> **listens on ports, matches requests, and decides how to handle them**

---

## Where Nginx Configuration Lives

### Main config

```
/etc/nginx/nginx.conf
```

This is the **entry point**.

It usually includes:

```nginx
include /etc/nginx/conf.d/*.conf;
```

---

### Site / app configs (most important)

```
/etc/nginx/conf.d/default.conf
```

In Docker images, **this is the file you usually override**.

---

## Basic Nginx Configuration Structure

```nginx
server {
    listen 80;

    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```

Hierarchy:

```
nginx
 └── server
      └── location
```

---

## server Block

```nginx
server {
    listen 80;
    server_name example.com;
}
```

- Defines a virtual server
- `listen` → port
- `server_name` → domain matching

---

## location Block

```nginx
location /api/ {
    proxy_pass http://backend:8080;
}
```

- Matches request paths
- Decides how to handle them
- Can:
  - serve files
  - proxy requests
  - return responses

---

## Serving Frontend (SPA)

Typical frontend config:

```nginx
location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

### What `try_files` means

```
try_files $uri $uri/ /index.html;
```

Order:
1. try exact file
2. try directory
3. fallback to `index.html`

This is **required for SPA routing** (Vue / React).

---

## Reverse Proxy to Backend

```nginx
location /api/ {
    proxy_pass http://web-demo-backend:8080;
}
```

What happens:
- Browser calls `/api/...`
- Nginx forwards request to backend
- Backend response is returned to browser

Backend is **not exposed publicly**.

---

## proxy_pass Key Notes

```nginx
proxy_pass http://backend:8080;
```

- Uses **Docker DNS** (container name)
- Requires user-defined bridge network
- Works only inside Docker network

---

## Common Proxy Headers (Recommended)

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

Why:
- preserve client IP
- support HTTPS termination
- backend logging correctness

---

## Exposing Files vs Exposing Services

Important distinction:

- `root` → exposes static files
- `proxy_pass` → forwards requests

Nginx does **not** expose the whole filesystem — only what `root` points to.

---

## Docker + Nginx Common Pattern

### Dockerfile

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Runtime

```bash
docker run -p 80:80 web-demo-frontend
```

Only port 80 is public.

---

## Common Mistakes

❌ Forgetting `try_files` for SPA  
❌ Using IP instead of container name  
❌ Publishing backend ports unnecessarily  
❌ Confusing NAT with proxying  

---

## Mental Model

> **Nginx is a traffic router.**
> - static files → file system
> - dynamic requests → backend services

---

## Key Takeaways

- `nginx.conf` includes site configs
- `default.conf` is the main app config in Docker
- `server` defines virtual servers
- `location` defines routing logic
- `try_files` enables SPA routing
- `proxy_pass` enables backend access without exposure

---

> **Once you understand Nginx config structure, deployment becomes predictable and safe.**
