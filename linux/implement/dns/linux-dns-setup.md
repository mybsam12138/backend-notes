# Linux DNS Server Implementation Guide (Enterprise Internal Network)

## 1. Overview

This guide explains:

- How to build a **local DNS server** in Linux (using BIND)
- How to configure **VMs / nodes** to use it
- How to configure **containers (Docker / Kubernetes)** to use it

---

## 2. DNS Server Setup (BIND)

### 2.1 Install BIND

#### Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y bind9 bind9-utils bind9-dnsutils
```

#### CentOS / RHEL
```bash
sudo yum install -y bind bind-utils
```

---

### 2.2 Configure Main File

Edit:

```bash
sudo vim /etc/bind/named.conf.options
```

Example:

```conf
options {
    directory "/var/cache/bind";

    recursion yes;
    allow-query { any; };

    forwarders {
        8.8.8.8;
        1.1.1.1;
    };

    dnssec-validation auto;

    listen-on { any; };
};
```

👉 Meaning:

- `recursion yes` → allow internal clients to query
- `forwarders` → forward unknown domains to public DNS

---

### 2.3 Create Internal Zone

Edit:

```bash
sudo vim /etc/bind/named.conf.local
```

Add:

```conf
zone "internal.local" {
    type master;
    file "/etc/bind/db.internal.local";
};
```

---

### 2.4 Create Zone File

```bash
sudo cp /etc/bind/db.local /etc/bind/db.internal.local
sudo vim /etc/bind/db.internal.local
```

Example:

```conf
$TTL    604800
@       IN      SOA     ns.internal.local. admin.internal.local. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL

@       IN      NS      ns.internal.local.

ns      IN      A       10.0.0.10
db      IN      A       10.0.1.10
redis   IN      A       10.0.1.11
api     IN      A       10.0.2.10
```

---

### 2.5 Start DNS Server

```bash
sudo systemctl restart bind9
sudo systemctl enable bind9
```

---

### 2.6 Test DNS Server

```bash
dig @127.0.0.1 api.internal.local
```

---

## 3. Configure DNS on Linux Nodes

### 3.1 Temporary (for testing)

```bash
sudo vim /etc/resolv.conf
```

```conf
nameserver 10.0.0.10
nameserver 8.8.8.8
```

⚠️ This may be overwritten by system services.

---

### 3.2 Permanent (systemd-resolved)

```bash
sudo vim /etc/systemd/resolved.conf
```

```conf
[Resolve]
DNS=10.0.0.10 10.0.0.11
FallbackDNS=8.8.8.8
```

Apply:

```bash
sudo systemctl restart systemd-resolved
```

---

### 3.3 Using NetworkManager

```bash
nmcli con mod <connection-name> ipv4.dns "10.0.0.10 10.0.0.11"
nmcli con up <connection-name>
```

---

## 4. Configure DNS in Docker

### 4.1 Per Container

```bash
docker run --dns=10.0.0.10 nginx
```

---

### 4.2 Global Docker Daemon

Edit:

```bash
sudo vim /etc/docker/daemon.json
```

```json
{
  "dns": ["10.0.0.10", "8.8.8.8"]
}
```

Restart:

```bash
sudo systemctl restart docker
```

---

## 5. Configure DNS in Kubernetes

### 5.1 Default (CoreDNS)

Kubernetes already provides DNS via **CoreDNS**:

```bash
kubectl get pods -n kube-system | grep coredns
```

---

### 5.2 Forward to Internal DNS

Edit CoreDNS config:

```bash
kubectl edit configmap coredns -n kube-system
```

Example:

```conf
forward . 10.0.0.10 8.8.8.8
```

Apply:

```bash
kubectl rollout restart deployment coredns -n kube-system
```

---

### 5.3 Pod-Level DNS Override

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-dns
spec:
  dnsPolicy: None
  dnsConfig:
    nameservers:
      - 10.0.0.10
  containers:
    - name: app
      image: busybox
      command: ["sleep", "3600"]
```

---

## 6. High Availability (Recommended)

- Deploy **2 DNS servers**
- Example:

```conf
nameserver 10.0.0.10
nameserver 10.0.0.11
```

---

## 7. Best Practices

- Use internal domain: `internal.local` or `corp.local`
- Enable logging for audit
- Restrict recursion to internal network only
- Use caching to improve performance
- Combine with service discovery (Consul / Kubernetes)

---

## 8. Architecture Summary

```text
[ VM / Container ]
        |
        v
[ Internal DNS (BIND) ]
     |         |
     v         v
Internal     Public DNS
Records      (Forwarding)
```

---

## 9. Conclusion

- Enterprise systems **should use internal DNS**
- All nodes use it as **primary DNS**
- External queries are handled via **forwarding**
- Works across:
    - VM
    - Docker
    - Kubernetes

---