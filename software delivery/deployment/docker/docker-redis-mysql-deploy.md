# Docker Deployment: Redis & MySQL

This document describes how to deploy **Redis** and **MySQL** using Docker with
persistent storage, fixed ports, and automatic restart policies.

---

## Redis Deployment

### Command

```bash
docker run -d \
  --name redis \
  --network web-demo-net \
  --restart unless-stopped \
  -p 6379:6379 \
  -v /data/redis:/data \
  redis:7 \
  redis-server --appendonly yes
```

### Details

- Image: `redis:7`
- Port: `6379`
- Persistence: AOF enabled
- Data directory: `/data/redis` → `/data`
- Restart policy: `unless-stopped`

---

## MySQL Deployment

### Command

```bash
docker run -d \
  --name mysql \
  --restart unless-stopped \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=abcdtestdb \
  -v /data/mysql:/var/lib/mysql \
  mysql:8.0
```

### Details

- Image: `mysql:8.0`
- Port: `3306`
- User: `root`
- Password: `abcdtestdb`
- Data directory: `/data/mysql` → `/var/lib/mysql`
- Restart policy: `unless-stopped`
