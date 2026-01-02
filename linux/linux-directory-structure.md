# Linux Directory Structure — A Practical Guide for Backend Engineers

This article summarizes the **Linux directory structure** with a focus on **real-world backend usage**
(Java / Spring Boot / Docker), rather than Linux admin theory.

**Business Help:**
Understanding the Linux directory structure helps developers know where to place application files, log files, and data files, 
as well as where to locate system configuration files and installed software.

---

## 1. Is this directory layout default?

Yes.

Most Linux distributions (CentOS, RHEL, Ubuntu, Debian, etc.) follow the  
**Filesystem Hierarchy Standard (FHS)**.

The root directory `/` is created automatically during installation and has a **standard structure**.

---

## 2. The most important mental model

Before memorizing directories, remember this rule:

> **Who owns the software or data — the OS, or me?**

- **OS-owned** → managed by package manager → `/usr`
- **User / vendor-owned** → manually installed → `/opt`

This single rule explains most directory decisions.

---

## 3. Root (`/`) directory overview

The root directory is the top-level entry of the Linux filesystem.

You should **never store application files directly under `/`**.

---

## 4. Core system & kernel directories

These directories are managed by the kernel. Most of them are **virtual filesystems**.

| Directory | Purpose |
|---------|--------|
| `/boot` | Bootloader and kernel files |
| `/dev` | Device files (disks, terminals, USB) |
| `/proc` | Process and kernel information (virtual) |
| `/sys` | Kernel and device information |
| `/run` | Runtime state (PID files, sockets) |

> `/proc`, `/sys`, and `/run` do not persist on disk.

---

## 5. User and application data

| Directory | Purpose |
|---------|--------|
| `/home` | Home directories for normal users |
| `/root` | Home directory for root user |
| `/opt` | Optional / third-party software |
| `/srv` | Service data (rarely used in practice) |
| `/data` | Custom data directory (not FHS, but very common) |

### `/opt` in practice

Used for:
- Java applications
- Vendor software
- Manually installed tools

Example:
```
/opt/myapp/
├── app.jar
├── config/
├── logs/
└── data/
```

---

## 6. System binaries and libraries

| Directory | Purpose |
|---------|--------|
| `/bin` | Essential user commands |
| `/sbin` | System administration commands |
| `/lib` | Shared libraries |
| `/lib64` | 64-bit libraries |
| `/usr` | OS-managed userland programs and libraries |

### Important note

On modern Linux systems:
- `/bin`, `/sbin` are often symbolic links to `/usr/bin`
- `/usr` is **not** user home; it means *Unix System Resources*

---

## 7. Configuration, logs, and variable data

| Directory | Purpose |
|---------|--------|
| `/etc` | System-wide configuration files |
| `/var` | Variable data (logs, cache, DB files) |
| `/tmp` | Temporary files (often cleared on reboot) |
| `/lost+found` | Filesystem recovery (ext4) |

Examples:
```
/etc/nginx/nginx.conf
/var/log/messages
/var/log/myapp/app.log
```

---

## 8. Mount points

| Directory | Purpose |
|---------|--------|
| `/mnt` | Temporary manual mounts |
| `/media` | Auto-mounted removable devices |

---

## 9. Where should software be installed?

### `/usr`
- Installed by OS package manager (`yum`, `dnf`, `apt`)
- Managed by the operating system
- Should not be manually modified

### `/opt`
- Manually installed software
- Vendor-provided binaries
- Your own applications

Rule of thumb:

> **If the OS owns it → `/usr`**  
> **If you own it → `/opt`**

---

## 10. Recommended layout for backend applications

A practical layout for Java / Spring Boot apps:

```
/opt/myapp/
├── app.jar
├── config/
│   └── application-prod.yml
├── logs/
├── data/
└── run/
```

Optional (advanced):
- `logs` → symlink to `/var/log/myapp`
- `data` → symlink to `/data/myapp`

---

## 11. Summary

- Linux directory structure is **standard and predictable**
- `/usr` and `/opt` serve **different ownership models**
- Follow conventions, but prioritize **clarity and maintainability**
- For most backend engineers, this level of understanding is **more than enough**

---

**Key takeaway:**

> A good Linux layout lets you remove one directory  
> and clearly know *what is gone* and *what remains*.
