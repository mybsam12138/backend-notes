# Why Use VIP Instead of DNS for Load Balancing

## 1. Overview

Both **VIP** and **DNS** can be used to direct traffic to service instances, but they solve different problems.

- **DNS** maps a **domain name** to one or more **IP addresses**
- **VIP (Virtual IP)** provides one **stable service IP** and lets the network or load balancer decide which backend node actually handles the traffic

In practice:

- **DNS** is often used for **name resolution** and sometimes coarse-grained traffic distribution
- **VIP** is used for **fast failover**, **high availability**, and **stable service access**

---

## 2. Why VIP Is Used Instead of DNS for Local Load Balancing / Failover

The biggest reason is:

> **VIP failover is much faster and more predictable than DNS-based failover.**

### With DNS load balancing

Example:

```text
api.company.com -> 203.0.113.10
api.company.com -> 203.0.113.11
api.company.com -> 203.0.113.12
```

A DNS server may return one IP or multiple IPs. Clients then cache the result locally.

If one backend fails, many clients may still continue using the failed IP until their DNS cache expires.

### With VIP

Example:

```text
api.company.com -> 203.0.113.10   (VIP)
```

Then internally:

```text
203.0.113.10 -> active load balancer / backend node
```

If the active node fails, the VIP can move to another node, or the load balancer can redirect traffic to healthy nodes without changing what the client connects to.

The client still uses the same IP.

---

## 3. DNS Caching Problem

DNS is heavily cached.

A client usually does **not** ask the DNS server for every request. Instead, it stores the result for a period of time based on the **TTL (Time To Live)** value.

Example:

```text
api.company.com -> 203.0.113.10
TTL = 300 seconds
```

This means the client may continue using `203.0.113.10` for up to **5 minutes** without asking DNS again.

If that IP becomes unavailable during the TTL period, traffic may still go to the failed destination.

That is why DNS alone is not ideal for fast HA failover.

---

## 4. What Is DNS TTL

**TTL (Time To Live)** is the number of seconds a DNS result may be cached before it should be refreshed.

Example:

```text
TTL = 60
```

means the DNS record may be cached for **60 seconds**.

After the TTL expires, the client, operating system, browser, or recursive DNS resolver may query DNS again.

---

## 5. How Long Does DNS Need to Refresh

The answer depends on the **TTL configuration** and the behavior of intermediate caches.

Common TTL ranges in practice:

| Scenario | Typical TTL |
|------|------|
| Very fast-changing records | 30–60 seconds |
| Normal production services | 300 seconds (5 minutes) |
| Stable infrastructure records | 3600 seconds (1 hour) or more |

So DNS refresh may take:

- tens of seconds
- minutes
- sometimes longer, depending on caching layers

Important note:

> Even if TTL is low, some clients, browsers, operating systems, or resolvers may not refresh exactly at that second.

So DNS failover is **eventually consistent**, not instant.

---

## 6. Why VIP Is Better for Fast Failover

VIP avoids the DNS cache problem because the client continues to connect to the same address.

Example:

```text
Client -> VIP 203.0.113.10
```

Behind the VIP:

- load balancer node A handles traffic now
- node A fails
- node B takes over or the traffic is rerouted internally

The client does not need to refresh DNS.

This makes VIP ideal for:

- local high availability
- active/standby failover
- active/active load balancers
- internal service stability

---

## 7. DNS vs VIP Comparison

| Feature | DNS Load Balancing | VIP / Load Balancer |
|------|------|------|
| Main role | Domain -> IP mapping | Stable service IP |
| Failover speed | Slow to medium | Fast |
| Affected by client cache | Yes | No |
| Good for global traffic distribution | Yes | Limited |
| Good for local HA failover | Weak | Strong |
| Client connection target changes | May change | Usually stays the same |

---

## 8. Real-World Practice

Modern systems often use **both DNS and VIP together**.

Example:

```text
Client
  ->
DNS
  ->
Public VIP / Load Balancer
  ->
Backend servers
```

In this model:

- **DNS** resolves the service name
- **VIP / load balancer** provides stable entry and fast failover

This is the most common production approach.

---

## 9. Summary

Use **VIP instead of DNS alone** when you need:

- fast failover
- high availability
- stable service entry
- minimal client-side impact

DNS caching is the main limitation of DNS-based failover.

Key point:

> **DNS tells the client which IP to connect to, but VIP makes sure that IP remains usable even if backend nodes change.**

TTL controls how long DNS records are cached, and common values range from **30 seconds to 1 hour or more** depending on the scenario.
