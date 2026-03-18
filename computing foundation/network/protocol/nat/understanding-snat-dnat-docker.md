# Understanding SNAT and DNAT
*A clear explanation with Docker examples*

SNAT and DNAT are the two core mechanisms behind **NAT (Network Address Translation)**.
Understanding them explains:

- why Docker containers can access the internet by default
- why ports must be published with `-p`
- how inbound and outbound traffic are handled securely

---

## What Do SNAT and DNAT Mean?

### SNAT — Source Network Address Translation

> **SNAT rewrites the *source* IP address (and sometimes port)**  
> It is mainly used for **outbound (出站) traffic**.

---

### DNAT — Destination Network Address Translation

> **DNAT rewrites the *destination* IP address (and sometimes port)**  
> It is mainly used for **inbound (入站) traffic**.

---

## SNAT: Outbound Traffic Explained

### Scenario: Container accessing the internet

```
Container IP: 172.17.0.2
Host IP:      192.168.1.100
```

The container sends a request:

```
Source IP:      172.17.0.2
Destination IP: 8.8.8.8
```

### SNAT happens

The Docker host rewrites the packet:

```
Before SNAT:
  Src IP = 172.17.0.2

After SNAT:
  Src IP = 192.168.1.100
```

The external server replies to the host, and Docker maps the response back to the container.

### Key points about SNAT

- Enabled by default in Docker
- No `-p` required
- Hides container IPs
- Allows containers to access external services

---

## DNAT: Inbound Traffic Explained

### Scenario: Exposing a container service

```bash
docker run -p 8080:80 nginx
```

The browser sends a request:

```
Destination IP:   host-ip
Destination Port: 8080
```

### DNAT happens

Docker rewrites the packet:

```
Before DNAT:
  Dst IP   = host-ip
  Dst Port = 8080

After DNAT:
  Dst IP   = container-ip
  Dst Port = 80
```

The request now reaches the container service.

### Key points about DNAT

- Enabled only when ports are published
- Controls inbound access
- Without DNAT, containers are private
- DNAT is what makes services public

---

## SNAT vs DNAT (Side-by-Side)

| Feature | SNAT | DNAT |
|---|---|---|
| Full name | Source NAT | Destination NAT |
| Traffic direction | Outbound (出站) | Inbound (入站) |
| What is rewritten | Source IP / port | Destination IP / port |
| Docker default | ✅ Always on | ❌ Only with `-p` |
| Security role | Hide containers | Expose selected ports |

---

## How SNAT and DNAT Work Together

A complete request-response cycle uses **both**:

```
Browser
  ↓
DNAT (host → container)
  ↓
Application
  ↓
SNAT (container → host)
  ↓
Browser
```

This ensures connections remain consistent and secure.

---

## Where SNAT and DNAT Are Implemented

- Implemented by the **Linux kernel**
- Managed via:
  - `iptables`
  - `nftables`
- Docker only **configures the rules**, it does not modify packets itself

---

## Common Misunderstandings

❌ SNAT exposes containers  
❌ DNAT is always enabled  
❌ Containers need public IPs  

Correct understanding:
- SNAT enables outbound access
- DNAT enables controlled inbound access
- Containers remain private by default

---

## Mental Model

> **SNAT hides who you are.**  
> **DNAT decides who can reach you.**

---

## Key Takeaways

- SNAT and DNAT are two directions of NAT
- Docker always enables SNAT
- Docker enables DNAT only when ports are published
- This design provides secure-by-default networking

---

> **Once SNAT and DNAT are clear, Docker networking stops being confusing.**
