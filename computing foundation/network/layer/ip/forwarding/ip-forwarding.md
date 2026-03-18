# IP Forwarding (Packet Forwarding)

## 1. Definition
IP forwarding is the process by which a device (such as a router or Linux server) receives a network packet and forwards it to another network instead of processing it locally.

> It allows a machine to act as a router.

---

## 2. Behavior

### Disabled (ip_forward = 0)
- Only processes packets addressed to itself
- Drops packets destined for other networks

### Enabled (ip_forward = 1)
- Forwards packets between network interfaces
- Acts as a gateway between networks

---

## 3. Example

```
Client (192.168.1.10)
        ↓
Linux Server (Gateway)
        ↓
Internet
```

- Client sends request to internet
- Server receives packet
- If IP forwarding is enabled → forwards packet
- If disabled → packet is dropped

---

## 4. Linux Configuration

### Check status
```bash
cat /proc/sys/net/ipv4/ip_forward
```

### Enable temporarily
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

### Enable permanently
Edit `/etc/sysctl.conf`:

```bash
net.ipv4.ip_forward = 1
```

Apply:
```bash
sysctl -p
```

---

## 5. Use Cases

### 5.1 Router / Gateway
- Connects multiple networks
- Core functionality of routers

### 5.2 NAT (Network Address Translation)
- Required for private network access to internet
- Works with iptables (MASQUERADE / SNAT)

### 5.3 Load Balancer (L4)
- Forwards traffic to backend servers

### 5.4 Cloud / VPC Networking
- Bastion host
- VPN gateway
- Kubernetes node routing

---

## 6. What IP Forwarding Does NOT Do

| Feature           | Description                        |
|------------------|----------------------------------|
| NAT              | Modifies IP addresses            |
| Load Balancing   | Chooses destination              |
| L7 Processing    | Inspects application data        |

---

## 7. Key Concept Relationship

```
IP Forwarding = "Can I pass packets?"
NAT            = "Do I modify packets?"
Load Balancer  = "Where should packets go?"
```

---

## 8. Summary

> IP forwarding enables a machine to forward packets between networks, allowing it to function as a router or gateway.
