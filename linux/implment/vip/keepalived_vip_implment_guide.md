# Keepalived VIP Configuration Guide (Linux)

## 1. Overview

This guide explains how to configure a **Virtual IP (VIP)** using **Keepalived + VRRP** on Linux.

### Goal:
- Provide **high availability (HA)** for Load Balancer
- Avoid **Single Point of Failure (SPOF)**
- Automatically failover when node or service fails

---

## 2. Architecture

LB1 (MASTER)        LB2 (BACKUP)
192.168.1.10        192.168.1.11

        ↓
   Virtual IP (VIP)
      192.168.1.100

- VIP floats between nodes
- Only one node owns VIP at a time
- Failover via Gratuitous ARP

---

## 3. Install Keepalived

```bash
sudo apt install keepalived -y
# or
sudo yum install keepalived -y
```

---

## 4. Enable IP Forwarding

```bash
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```

---

## 5. Keepalived Configuration

### 5.1 MASTER Node

`/etc/keepalived/keepalived.conf`

```conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass 123456
    }

    virtual_ipaddress {
        192.168.1.100
    }

    track_script {
        chk_nginx
    }
}
```

---

### 5.2 BACKUP Node

```conf
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 90
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass 123456
    }

    virtual_ipaddress {
        192.168.1.100
    }

    track_script {
        chk_nginx
    }
}
```

---

## 6. Health Check Script

```conf
vrrp_script chk_nginx {
    script "pidof nginx"
    interval 2
    weight -20
}
```

### Explanation:
- Check nginx every 2 seconds
- If nginx fails → reduce priority
- Trigger failover if needed

---

## 7. Start Keepalived

```bash
systemctl start keepalived
systemctl enable keepalived
```

---

## 8. Verify VIP

```bash
ip addr
```

- MASTER should have VIP
- BACKUP should NOT have VIP

---

## 9. Test Failover

```bash
systemctl stop keepalived
```

- BACKUP should take over VIP immediately

---

## 10. Important Notes

### 10.1 Same Subnet Requirement
- Both nodes must be in the same Layer 2 network

### 10.2 VIP is Layer 2
- Not suitable across AZ or different subnets

### 10.3 Split Brain Risk
- Both nodes may become MASTER if network is partitioned

---

## 11. Best Practices

- Use application-level health check (e.g., HTTP endpoint)
- Monitor Keepalived logs
- Combine with Nginx or HAProxy
- Consider cloud load balancer for multi-AZ setup

---

## 12. Summary

- Keepalived uses VRRP to manage VIP
- VIP ensures high availability
- Health checks prevent traffic to broken nodes
- Essential for production-grade systems
