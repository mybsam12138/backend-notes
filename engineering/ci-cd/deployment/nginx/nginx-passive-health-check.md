# Nginx Passive Health Check & Failure Trigger Summary

---

## 1. What is Passive Health Check?

Nginx uses **passive health check** by default.

> Passive health check means:
> Nginx determines whether a backend server is healthy **based on real client requests**, not by actively probing the server.

---

## 2. Key Characteristics

- No background health check (no periodic `/health` requests)
- Based on actual traffic
- Reactive (detects failure after it happens)
- Simple but may cause a few failed requests before detection

---

## 3. Core Configuration

```nginx
upstream backend {
    server app1:8080 max_fails=3 fail_timeout=10s;
    server app2:8080 max_fails=3 fail_timeout=10s;
}
```

---

## 4. Failure Trigger Conditions

### 4.1 Transport-Level Errors (Default = FAILURE)

These are considered failures by default:

#### Connection Errors
- connection refused
- no route to host

#### Timeout Errors
- connect timeout
- read timeout

#### Network Errors
- connection reset
- upstream closed connection unexpectedly

---

### 4.2 HTTP Status Codes (Default = NOT FAILURE)

By default, these are **NOT treated as failures**:

- HTTP 500
- HTTP 502
- HTTP 503
- HTTP 504

Reason:
> Server is still reachable, only business logic failed

---

### 4.3 Custom Failure Conditions

You can configure HTTP errors as failures:

```nginx
proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
```

After this:
- HTTP 5xx can trigger retry and failure counting

---

## 5. Failure Detection Logic

### Step 1 — Count failures

- If failures reach `max_fails`
- Within a recent period (not strictly sliding window)

👉 Server is marked **UNAVAILABLE**

---

### Step 2 — Down period

- Server is excluded from load balancing
- Duration = `fail_timeout`

---

### Step 3 — Recovery

- After `fail_timeout`
- Nginx will try the server again with a new request

---

## 6. Default Values

If not configured:

- `max_fails = 1`
- `fail_timeout = 10s`

---

## 7. Retry Behavior

Nginx may retry another upstream server when failure occurs:

```nginx
proxy_next_upstream error timeout;
```

Flow:

```
User → Nginx → app1 (fail) → retry → app2 (success)
```

---

## 8. Response Behavior

| Scenario | Result |
|--------|-------|
| One backend fails | Retry another server |
| All backends fail | 502 Bad Gateway |
| Timeout | 504 Gateway Timeout |
| HTTP 500 (default) | Return 500 directly |

---

## 9. Limitations of Passive Health Check

- Failure detected only after real request fails
- May impact some users
- No proactive recovery detection
- Depends on traffic volume

---

## 10. Best Practices

### Use Short Timeouts

```nginx
proxy_connect_timeout 1s;
proxy_read_timeout 3s;
```

→ Faster failure detection

---

### Tune Failure Parameters

```nginx
max_fails=2 fail_timeout=5s;
```

→ Faster failover and recovery

---

### Be Careful with HTTP 500 Retry

- Safe for: GET / idempotent APIs
- Risky for: POST / payment / transaction APIs

---

## 11. One Sentence Summary

> Nginx passive health check detects failures based on real request errors (connection issues and timeouts by default), marks servers unavailable after reaching a threshold, and recovers them after a cooldown period without using active probing.