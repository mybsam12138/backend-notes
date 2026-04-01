# Nginx Access Log Summary

## 🎯 What is Nginx Access Log

Nginx access log records **every HTTP request** handled by Nginx.

It is typically used for:

- traffic analysis
- debugging
- monitoring
- security auditing

---

# 🧠 Is it enabled by default?

👉 **Yes (in most cases)**

Default Nginx config usually includes:

```
access_log /var/log/nginx/access.log;
```

So:

- access log is **enabled by default**
- unless explicitly turned off

---

# 🧩 Basic Log Format

Default format is usually:

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
```

---

# 📄 Example Log

```
192.168.1.10 - - [30/Mar/2026:12:00:00 +0800] "GET /api/policy/search HTTP/1.1" 200 512 "-" "Mozilla/5.0"
```

---

# 🔍 Field Explanation

| Field | Meaning |
|------|------|
| remote_addr | client IP |
| remote_user | authenticated user (usually '-') |
| time_local | request time |
| request | method + URL + protocol |
| status | HTTP status code |
| body_bytes_sent | response size |
| http_referer | previous page |
| http_user_agent | browser info |

---

# ⚡ Commonly Added Fields (Recommended)

In real production, we usually extend the log format:

```
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '$request_time $upstream_response_time '
                '$http_x_forwarded_for $request_id';
```

---

# 🔥 Important Fields

| Field | Why important |
|------|------|
| request_time | total request time |
| upstream_response_time | backend service time |
| request_id | trace request |
| http_x_forwarded_for | real client IP |

---

# 🚀 Best Practice Format

```
log_format json escape=json
'{
    "time":"$time_local",
    "remote_addr":"$remote_addr",
    "method":"$request_method",
    "uri":"$request_uri",
    "status":$status,
    "request_time":$request_time,
    "upstream_time":"$upstream_response_time",
    "trace_id":"$request_id"
}';
```

---

# ⚠️ Performance Consideration

- Access log is **high frequency**
- Must remain lightweight
- Avoid logging request/response body

---

# 🧠 Key Takeaway

> Nginx access log is enabled by default and records basic request information like IP, URL, status, and latency. It is lightweight and suitable for production use.

---

# ✅ Summary

- Enabled by default ✅
- Records all requests ✅
- Lightweight ✅
- Used for monitoring and debugging ✅
