# iptables – How It Works

## What iptables Is
iptables is a **user-space command-line tool** used to configure the Linux kernel’s packet filtering framework, netfilter.

iptables itself does not process packets. The kernel does. iptables only installs rules into the kernel.

---

## What Problem iptables Solves
iptables decides:
- Whether a packet should be accepted or dropped
- Whether it should be modified (NAT)
- Whether it should be forwarded or delivered locally

It enforces **security and traffic control policies**.

---

## Core Concepts

### Tables (Purpose)

| Table | Purpose |
|------|--------|
| filter | Allow / deny traffic |
| nat | Address and port translation |
| mangle | Modify packet metadata |
| raw | Bypass connection tracking |

---

### Chains (Checkpoints)

| Chain | When It Runs |
|------|--------------|
| PREROUTING | Packet just arrived |
| INPUT | Packet destined for local process |
| FORWARD | Packet passing through |
| OUTPUT | Packet created locally |
| POSTROUTING | Packet about to leave |

---

### Rules
Each rule is an IF–THEN statement:

IF packet matches conditions → THEN perform action

Rules are evaluated **top to bottom**. First match usually wins.

---

## Packet Flow (Simplified)

1. Packet arrives
2. PREROUTING rules run
3. Routing decision is made
4. Packet enters INPUT or FORWARD
5. Packet may be modified or dropped
6. POSTROUTING rules run

---

## Common iptables Rules and Explanation

### Allow established connections
```bash
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
```
Allows packets that belong to existing connections.

---

### Allow SSH
```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```
Allows incoming SSH connections.

---

### Drop all other incoming traffic
```bash
iptables -P INPUT DROP
```
Sets default policy to DROP for unmatched packets.

---

### Enable NAT (MASQUERADE)
```bash
iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -j MASQUERADE
```
Rewrites source IP for outbound traffic (typical for gateways).

---

### Port forwarding (DNAT)
```bash
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.0.2:80
```
Redirects traffic to an internal server.

---

## How iptables Processes Rules
- Rules are sequential
- Order matters
- Default policy applies if no rule matches

This makes rule organization critical.

---

## iptables vs IPVS

| Aspect | iptables | IPVS |
|------|---------|------|
| Primary role | Filtering / NAT | Load balancing |
| Matching | Linear rule scan | Hash-based lookup |
| Backend awareness | No | Yes |
| Typical use | Firewall, NAT | Service distribution |

---

## Typical Use Cases
- Host firewall
- NAT gateway
- Port forwarding
- Pre-filtering traffic before IPVS

---

## One-Line Summary
iptables is a rule-based control system that lets the Linux kernel inspect, modify, allow, or drop packets at fixed points in their lifecycle.

