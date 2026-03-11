# Desktop Management Service – Features

## 1. Overview

The **Desktop Management Service (DMS)** is a backend service responsible for managing the lifecycle, allocation, and configuration of cloud desktops.

This service operates in the **control plane** of the cloud desktop system and is typically deployed in the cloud backend.

The Desktop Management Service communicates with:

- Web Interface Server (WI Server)
- Desktop Communication Service (HDC)
- Infrastructure / Virtualization Platform
- Database and Cache (Redis)

The service does **not handle desktop session traffic**.  
All remote desktop streaming is handled through the **Access Gateway (VGA)**.

---

# 2. Core Responsibilities

The Desktop Management Service focuses on:

- Desktop lifecycle management
- Desktop allocation to users
- Desktop state tracking
- Resource orchestration
- Policy enforcement

It acts as the **central controller for desktop resources**.

---

# 3. Core Features

## 3.1 Desktop Lifecycle Management

The Desktop Management Service manages the full lifecycle of desktop VMs.

Typical lifecycle operations include:

- Create desktop
- Start desktop
- Stop desktop
- Restart desktop
- Delete desktop

Example APIs:

```
POST /desktops
POST /desktops/{id}/start
POST /desktops/{id}/stop
POST /desktops/{id}/restart
DELETE /desktops/{id}
```

These operations usually call the **cloud infrastructure layer** (such as virtualization platforms or cloud compute services).

---

## 3.2 Desktop Allocation

The service assigns desktops to users.

Responsibilities include:

- Assign a desktop to a user
- Reassign desktops
- Maintain mapping between users and desktops
- Support dedicated or pooled desktops

Example logic:

```
userId → desktopId
```

Example API:

```
POST /assignDesktop
```

---

## 3.3 Desktop Status Tracking

The Desktop Management Service tracks the current state of each desktop.

Typical states include:

- Running
- Stopped
- Starting
- Stopping
- Error
- Disconnected

Status information is obtained from:

- HDC heartbeat reports
- Desktop agent status
- Infrastructure status

Example API:

```
GET /desktops/{id}/status
```

---

## 3.4 Desktop Resource Management

The service manages desktop resources such as:

- CPU allocation
- Memory allocation
- Disk size
- GPU resources
- Network configuration

Example configuration:

```
Desktop Profile
CPU: 4 cores
Memory: 8 GB
Disk: 100 GB
GPU: optional
```

Example API:

```
POST /desktopProfiles
```

---

## 3.5 Desktop Pool Management

The Desktop Management Service may support **desktop pools**.

A desktop pool is a group of desktops created from the same template.

Pool management features include:

- Create desktop pools
- Auto-scale pool size
- Assign desktops from pool
- Recycle unused desktops

Example API:

```
POST /desktopPools
GET /desktopPools
```

---

## 3.6 Desktop Template Management

Templates define the base image for new desktops.

The service supports:

- Register desktop templates
- Update templates
- Select template when creating desktops

Example template fields:

```
OS Image
Installed applications
Configuration settings
Security policies
```

Example API:

```
POST /desktopTemplates
```

---

## 3.7 Session Preparation

Before a user connects to a desktop, the Desktop Management Service prepares the session.

Responsibilities include:

- Checking desktop availability
- Ensuring the desktop is running
- Requesting session token creation from HDC
- Returning connection information

Example response to WI Server:

```
desktopId
gatewayAddress
sessionToken
protocol
```

---

## 3.8 Policy Enforcement

The service applies desktop usage policies.

Examples:

- Maximum session duration
- Idle timeout
- Allowed connection devices
- Network restrictions

Example configuration:

```
idleTimeout = 15 minutes
maxSessionDuration = 8 hours
```

---

## 3.9 User Desktop Dashboard Support

The Desktop Management Service provides information used by the user portal.

Typical information includes:

- Desktop list
- Desktop status
- Last login time
- Resource usage

Example API:

```
GET /desktops
```

---

# 4. Interaction with Other Services

The Desktop Management Service works with several other system components.

Example interaction:

```
WI Client
   │
   ▼
WI Server
   │
   ▼
Desktop Management Service
   │
   ├─ Infrastructure API
   │
   ├─ HDC (session creation)
   │
   └─ Redis / Database
```

Responsibilities of each interaction:

- WI Server → user requests
- HDC → session management and VM communication
- Infrastructure → VM lifecycle operations
- Redis → cache and session data
- Database → persistent desktop metadata

---

# 5. Control Plane Role

The Desktop Management Service operates only in the **control plane**.

Control plane responsibilities include:

- desktop provisioning
- resource allocation
- configuration management
- session preparation

The **data plane** (desktop screen streaming) is handled by:

```
VGA Gateway
Desktop Agent
Desktop VM
```

---

# 6. Architecture Summary

```
User PC
 └─ WI Client
       │
       ▼
 WI Server
       │
       ▼
 Desktop Management Service
       │
       ├─ Infrastructure API (VM control)
       ├─ HDC (session coordination)
       ├─ Redis (cache)
       └─ Database (metadata)

Session Streaming Path

WI Client
    │
    ▼
VGA Gateway
    │
    ▼
Desktop Agent
    │
    ▼
Desktop VM
```

---

# 7. Summary

The **Desktop Management Service** is the central controller of desktop resources in a cloud desktop system.

Its main responsibilities include:

- managing desktop lifecycle
- assigning desktops to users
- tracking desktop status
- managing desktop resources and templates
- preparing session connections
- enforcing desktop usage policies

This service ensures that cloud desktop infrastructure operates efficiently and securely.