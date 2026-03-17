# Desktop Pool Types Design (VDI / Cloud Desktop)

## 1. Goal

A **Desktop Pool** is a logical grouping of existing virtual desktops (VMs) used for user assignment and session management.

In this design model:

- VMs are **created outside the pool** (by infrastructure or provisioning systems).
- The pool only manages **assignment and session behavior**.
- The pool type determines **how users are mapped to desktops**.

Two primary pool types are commonly used:

```
Static Pool
Dynamic Pool
```

The difference mainly lies in **user-to-VM mapping behavior** and **session persistence strategy**.

---

# 2. Core Architecture

Typical architecture:

```
VM Provisioning System
      ↓
Create VM instances
      ↓
Add VMs into Desktop Pool
      ↓
Desktop Pool manages user assignment
```

Example:

```
VMs
 ├─ VM-101
 ├─ VM-102
 ├─ VM-103

Desktop Pool
 └─ contains VM-101, VM-102, VM-103
```

The pool controls **how users are assigned to these desktops**.

---

# 3. Static Pool

A **Static Pool** assigns **one fixed VM to one user**.

Example mapping:

```
User A → VM-101
User B → VM-102
User C → VM-103
```

Characteristics:

- each user always connects to the **same VM**
- user environment is persistent
- user-installed applications remain
- desktop settings remain

VMs are **not reset after logout**.

Example session flow:

```
User A login
↓
Connect VM-101
↓
User logs out
↓
Later login
↓
Reconnect VM-101
```

Because the VM is persistent, user data can remain directly in the VM.

However, many systems still store user profiles externally using:

```
FSLogix profile container
network volumes
user profile disks
```

This allows:

- easier backup
- profile portability
- disaster recovery

---

# 4. Dynamic Pool

A **Dynamic Pool** allows a user to connect to **any available VM in the pool**.

Example mapping:

```
User A → VM-201
User B → VM-202
User C → VM-201 (later session)
```

VM assignment is **temporary** and determined at login time.

Session flow example:

```
User login
↓
System selects available VM
↓
User session starts
↓
User logout
↓
VM returned to pool
```

Characteristics:

- users do not have fixed desktops
- VMs are shared among users
- environments are standardized
- desktops may be reset after logout

Because VMs may be reused, **user data should not be stored inside the VM**.

Instead, user state is stored externally using:

```
FSLogix profile containers
network home directories
cloud storage
user profile volumes
```

At login:

```
User profile volume mounted
```

At logout:

```
Profile saved back to storage
```

This allows users to retain their environment even when connecting to different VMs.

---

# 5. Comparison of Static vs Dynamic Pool

| Feature | Static Pool | Dynamic Pool |
|---|---|---|
| VM assignment | fixed VM per user | any VM in pool |
| desktop persistence | persistent | usually non-persistent |
| VM reuse | no | yes |
| user data storage | VM or external storage | external storage |
| environment customization | high | limited |
| resource efficiency | lower | higher |

---

# 6. Storage Strategy

User persistence can be implemented using external storage.

Typical approaches:

```
FSLogix profile container
network attached storage
user profile disk
cloud file storage
```

Architecture example:

```
User
 ↓
Desktop VM
 ↓
Mount user profile volume
 ↓
Profile data stored externally
```

This allows:

- consistent user environment
- VM reuse in dynamic pools
- centralized profile management

---

# 7. Pool Selection Principles

Administrators typically choose pool types based on workload requirements.

```
Static Pool → personalized desktops
Dynamic Pool → shared desktops
```

Examples:

```
Developers → Static Pool
Call Center → Dynamic Pool
Training Lab → Dynamic Pool
Designers → Static Pool
```

---

# 8. Summary

Desktop pools control **how users are mapped to virtual desktops**.

Key pool types:

```
Static Pool  → one user one VM
Dynamic Pool → one user any VM
```

VMs are provisioned outside the pool, and the pool manages assignment policies.

User persistence can be achieved through:

```
FSLogix
profile volumes
network storage
```

allowing both pool types to support user data retention while maintaining scalable desktop management.