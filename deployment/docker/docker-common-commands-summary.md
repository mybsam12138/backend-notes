# Docker Common Commands Summary
*A practical command reference for daily development and deployment*

This document summarizes the **most commonly used Docker commands**, explains **what they do**, **when they run**, and **how they fit into the Docker mental model**.

---

## Image vs Container (Important First)

- **Image**: a template (read-only)
- **Container**: a running instance of an image

You build images, and you run containers.

---

## Image Lifecycle Commands

### Build an image

```bash
docker build -t web-demo-frontend:1.0.0 .
```

- `-t` → tag (image name:version)
- `.` → build context (current directory)
- Executes Dockerfile instructions

---

### List images

```bash
docker images
```

---

### Remove image

```bash
docker rmi IMAGE_ID
```

Remove unused images:

```bash
docker image prune
```

---

## Container Lifecycle Commands

### Run a container

```bash
docker run -d --name web-demo-frontend -p 80:80 web-demo-frontend
```

- `-d` → detached mode
- `--name` → container name
- `-p` → port mapping (DNAT)
- Last argument → image name

---

### List containers

Running containers:

```bash
docker ps
```

All containers:

```bash
docker ps -a
```

---

### Stop a container

```bash
docker stop web-demo-frontend
```

---

### Start a stopped container

```bash
docker start web-demo-frontend
```

---

### Restart a container

```bash
docker restart web-demo-frontend
```

---

### Remove a container

```bash
docker rm web-demo-frontend
```

Force remove (running):

```bash
docker rm -f web-demo-frontend
```

---

## Logs and Debugging

### View container logs

```bash
docker logs web-demo-frontend
```

Follow logs:

```bash
docker logs -f web-demo-frontend
```

---

### Enter a running container

```bash
docker exec -it web-demo-frontend /bin/sh
```

(or `/bin/bash` if available)

---

## Networking Commands

### Create a user-defined network

```bash
docker network create web-demo-net
```

---

### List networks

```bash
docker network ls
```

---

### Run container in a network

```bash
docker run --network web-demo-net web-demo-backend
```

Allows container-name DNS resolution.

---

## Volume & File Commands

### Mount host directory

```bash
docker run -v /host/path:/container/path image
```

Used for:
- logs
- persistent data
- local development

---

## System Cleanup

### Remove unused containers, images, networks

```bash
docker system prune
```

⚠️ Use carefully.

---

## Dockerfile Key Instructions (Quick Reminder)

| Instruction | Purpose |
|---|---|
| FROM | Base image |
| RUN | Build-time command |
| COPY | Copy files into image |
| CMD | Runtime command (PID 1) |
| EXPOSE | Document container port |

---

## Common Patterns

### Frontend (Nginx)

```bash
docker build -t web-demo-frontend .
docker run -d -p 80:80 web-demo-frontend
```

---

### Backend (Spring Boot)

```bash
docker build -t web-demo-backend .
docker run -d --network web-demo-net web-demo-backend
```

Backend stays private.

---

## Mental Model (Remember This)

> Build image → Run container → Expose only what you need

---

## Key Takeaways

- `docker build` creates images
- `docker run` creates containers
- `-p` controls inbound access
- Docker networks enable service discovery
- Containers are ephemeral, images are immutable

---

> **Mastering these commands means you understand Docker’s core workflow.**
