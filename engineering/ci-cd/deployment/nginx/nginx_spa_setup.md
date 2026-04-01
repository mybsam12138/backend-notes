# Nginx Setup for SPA (Industry Standard)

## 1. Overview

Typical SPA deployment separates:

- **index.html** → always fresh (no-cache)
- **static assets (JS/CSS/images)** → long-term cache (hashed + immutable)

---

## 2. Folder Structure

```
/dist
  index.html
  /assets
    main.abc123.js
    vendor.xyz456.js
    style.def789.css
```

---

## 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/app/dist;
    index index.html;

    # 1. Serve index.html (no cache)
    location / {
        try_files $uri /index.html;
        add_header Cache-Control "no-cache";
    }

    # 2. Static assets (long cache)
    location /assets/ {
        add_header Cache-Control "max-age=31536000, immutable";
    }

    # 3. Optional: gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

---

## 4. Key Points

### index.html

- Must always be fresh
- Contains references to latest JS/CSS
- Prevents version mismatch

```
Cache-Control: no-cache
```

---

### JS / CSS / Assets

- Use hashed filenames
- Safe for long-term caching

```
Cache-Control: max-age=31536000, immutable
```

---

## 5. Request Flow

### First Visit

1. Request index.html → network
2. Load JS/CSS → network
3. Cache assets

---

### After Deployment

1. Request index.html → always latest
2. HTML references new JS (new hash)
3. Browser downloads new assets
4. Old cache ignored

---

## 6. Why This Works

- HTML stays fresh
- Assets are cached aggressively
- Hash ensures cache invalidation
- No version mismatch

---

## 7. Common Mistakes

❌ Caching index.html  
→ user loads old JS

❌ Not using hashed filenames  
→ cache not invalidated

❌ Disabling cache for JS  
→ slow performance

---

## 8. Summary

```
index.html → no-cache
assets → long cache + immutable + hash
SPA routing → try_files /index.html
```
