# DNS Zone & DNS Records Summary

---

## 1. What is a DNS Zone?

### Definition

> A **DNS Zone** is a portion of the DNS namespace that is **managed by a specific DNS server**, including all its DNS records.

---

### Key Idea

- A **domain** is a name (e.g., `internal.local`)
- A **zone** is the **management boundary** of that domain

👉 One DNS server is **authoritative** for a zone

---

### Example

```text
Zone: internal.local

Contains:
- db.internal.local
- api.internal.local
- redis.internal.local
```

---

### Important Notes

- A zone can be:
    - a full domain (`internal.local`)
    - or a subdomain (`api.internal.local`)
- Zones can be **delegated** to different DNS servers

---

### Analogy

```text
DNS Zone = a department you manage
DNS Server = the manager
DNS Records = data inside the department
```

---

## 2. What is a DNS Record?

### Definition

> A **DNS Record** is a rule that maps a domain name to specific information (IP, server, alias, etc.)

---

### Format

```text
[name] [class] [type] [value]
```

Example:

```text
api   IN   A   10.0.2.10
```

---

## 3. Common DNS Record Types

---

### 3.1 A Record (Address Record)

```text
api.internal.local → 10.0.2.10
```

- Maps domain → IPv4 address
- Most commonly used

---

### 3.2 AAAA Record

```text
api.internal.local → 2001:db8::1
```

- Maps domain → IPv6 address

---

### 3.3 NS Record (Name Server)

```text
internal.local → ns.internal.local
```

- Defines which DNS server is responsible for the domain
- Points to **hostname**, not IP

---

### 3.4 SOA Record (Start of Authority)

```text
Primary DNS: ns.internal.local
Admin: admin.internal.local
```

- Defines:
    - authoritative DNS server
    - admin contact
    - synchronization rules
    - timing (refresh, retry, expire)

---

### 3.5 CNAME Record (Alias)

```text
www.internal.local → api.internal.local
```

- Creates an alias for another domain
- Does NOT point directly to IP

---

### 3.6 MX Record (Mail)

```text
internal.local → mail.internal.local
```

- Defines mail server for the domain

---

### 3.7 TXT Record

```text
"v=spf1 include:_spf.google.com ~all"
```

- Stores arbitrary text
- Used for verification (SPF, DKIM, etc.)

---

## 4. Zone File Structure

Example:

```conf
$TTL 604800

@ IN SOA ns.internal.local. admin.internal.local. (
    2         ; Serial
    604800    ; Refresh
    86400     ; Retry
    2419200   ; Expire
    604800 )  ; Negative Cache TTL

@ IN NS ns.internal.local.

ns    IN A 10.0.0.10
db    IN A 10.0.1.10
redis IN A 10.0.1.11
api   IN A 10.0.2.10
```

---

## 5. How DNS Resolution Works

```text
Client → DNS Server → Zone File → Return IP
```

Example:

```text
Query: api.internal.local
Answer: 10.0.2.10
```

---

## 6. Key Differences

| Concept | Meaning |
|--------|--------|
| Domain | Name (e.g., internal.local) |
| Zone | Managed part of domain |
| Record | Mapping rule inside zone |
| DNS Server | System that resolves queries |

---

## 7. Important Insights

- One zone contains **multiple DNS records**
- One domain can have **multiple IPs (multiple A records)**
- DNS does **not guarantee load balancing**
- DNS is **hierarchical and distributed**

---

## 8. One-line Summary

> DNS Zone = a managed domain scope  
> DNS Record = a mapping rule inside that scope

---