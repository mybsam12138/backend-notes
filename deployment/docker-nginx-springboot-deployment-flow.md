# End-to-End Deployment Flow  
*Frontend + Backend using Docker, Nginx, and Spring Boot JAR*

This document summarizes a clean, production-style deployment flow for a typical web system:

- Frontend: SPA (Vue / React / Vite)
- Backend: Spring Boot (executable JAR)
- Runtime: Docker
- Web server: Nginx

The goal is to achieve:
- Clear separation of frontend and backend
- No local environment pollution
- Predictable, repeatable deployment

---

## Overall Architecture

```
Browser
   ↓  (HTTP :80)
Nginx (Frontend Container)
   ├── Serve static files
   └── /api/* → Backend
               ↓
        Spring Boot (Backend Container :8080)
```

Key principles:
- Browser talks only to Nginx
- Backend is never exposed directly
- Nginx handles routing and proxying

---

## Part 1: Frontend Deployment Flow

### Step 1: Build frontend assets

```bash
npm install
npm run build
```

Output example:

```
dist/
├── index.html
├── assets/
```

---

### Step 2: Nginx configuration

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://web-demo-backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Step 3: Frontend Dockerfile

```dockerfile
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Step 4: Run frontend container

```bash
docker build -t web-demo-frontend .

docker run -d   --name web-demo-frontend   --network web-demo-net   -p 80:80   web-demo-frontend
```

---

## Part 2: Backend Deployment Flow

### Step 1: Package Spring Boot JAR

```bash
mvn clean package -DskipTests
java -jar target/web-demo-backend-1.0.0.jar
```

---

### Step 2: Backend Dockerfile

```dockerfile
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY app.jar /app/app.jar

EXPOSE 8080
ENV TZ=Asia/Shanghai

CMD ["java", "-jar", "/app/app.jar"]
```

---

### Step 3: Run backend container

```bash
docker build -t web-demo-backend:1 .

docker run -d   --name web-demo-backend   --network web-demo-net   -p 8080:8080   web-demo-backend:1
```

---

## Part 3: Docker Network

```bash
docker network create web-demo-net
```

Why:
- Container name resolution
- Stable Nginx → backend proxy

---

## Part 4: Port Strategy

| Component | Port |
|---------|------|
| Frontend | 80 |
| Backend | 8080 |

Best practice:
- Browser → Frontend only
- Backend hidden behind Nginx

---

## Part 5: Rebuild Workflow

### Frontend
```bash
npm run build
docker build -t web-demo-frontend .
docker rm -f web-demo-frontend
docker run ...
```

### Backend
```bash
mvn clean package
cp target/*.jar app.jar
docker build -t web-demo-backend:1 .
docker rm -f web-demo-backend
docker run ...
```

---

## Common Mistakes

- Expecting Docker to fix a broken JAR
- Using mirrorOf=* without full proxy repo
- Exposing backend directly
- Skipping java -jar verification

---

## Key Takeaways

- Maven builds artifacts
- Docker runs artifacts
- Containers are disposable
- Nginx is the single entry point

---

Once this flow is understood, deploying Java web systems becomes predictable and repeatable.
