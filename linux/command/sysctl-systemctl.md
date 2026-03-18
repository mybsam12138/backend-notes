# sysctl vs systemctl (Linux)

## 🧠 Core Difference

- **sysctl** → configure Linux **kernel parameters (runtime behavior)**
- **systemctl** → manage **services (process lifecycle)** via systemd

---

## 🔍 What is sysctl?

**sysctl = kernel tuning tool**

Used to:
- modify OS-level behavior
- adjust networking, memory, security settings

### Examples

```bash
sysctl -w net.ipv4.ip_forward=1
sysctl -w vm.swappiness=10
```

### Config files

- `/proc/sys/` (runtime view)
- `/etc/sysctl.conf`
- `/etc/sysctl.d/*.conf`

### Key characteristics

- affects **kernel**
- no process start/stop
- changes can be temporary or persistent

---

## ⚙️ What is systemctl?

**systemctl = service manager (systemd)**

Used to:
- start / stop / restart services
- check service status
- enable services at boot

### Examples

```bash
systemctl start nginx
systemctl restart keepalived
systemctl status docker
```

### Service definition

- `/etc/systemd/system/*.service`

### Key characteristics

- manages **processes (services)**
- controls lifecycle
- used for applications like nginx, mysql, keepalived

---

## 🆚 Comparison

| Feature | sysctl | systemctl |
|--------|--------|-----------|
| Purpose | Kernel tuning | Service management |
| Scope | OS kernel | User/system services |
| Controls | System behavior | Processes |
| Example | Enable IP forwarding | Start nginx |
| Command type | Configuration | Lifecycle control |
| Requires reboot | No (usually) | No |
| Config location | /etc/sysctl.conf | /etc/systemd/system |

---

## 🔗 How they work together

In real systems (e.g. HA setup):

```bash
# configure kernel behavior
sysctl -w net.ipv4.ip_nonlocal_bind=1

# start service
systemctl start keepalived
```

👉 sysctl prepares the environment  
👉 systemctl runs the service

---

## 🎯 One-line summary

- **sysctl = change how the system works**
- **systemctl = control what is running on the system**