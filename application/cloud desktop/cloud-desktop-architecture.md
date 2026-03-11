# Cloud Desktop System Architecture (Updated)

## 1. Overview

This document describes the architecture of a cloud desktop system where responsibilities are clearly separated between client components, control services, and session transfer services.

Key principles:

- The **WI Client** runs on the user PC and provides the interface and client logic.
- The **WI Server** handles portal APIs and coordination with backend services.
- The **HDC (Desktop Control Service)** is the only service responsible for interacting with desktop VMs.
- The **VGA (Access Gateway)** only transfers desktop session traffic and does not manage desktops.
- Desktop sessions use a long-lived connection through the gateway.

---

# 2. System Components

## 2.1 WI Client (User PC)

The **WI Client** runs on the user's computer.

It contains:

- User interface
- Client-side logic
- API calls to backend services
- Remote desktop protocol client

Responsibilities:

- Display login interface
- Send authentication requests
- Display desktop list
- Request desktop launch
- Establish session connection through gateway

Components inside WI Client:

```
WI Client
 ├─ User Interface
 ├─ Client Logic
 ├─ API Client
 └─ Remote Desktop Protocol Engine
```

The WI Client communicates with:

- WI Server (control APIs)
- VGA Gateway (desktop session)

---

## 2.2 WI Server (Web Interface Service)

The **WI Server** is the backend portal service.

Responsibilities:

- Handle login requests
- Communicate with authentication service
- Retrieve desktop information
- Request session creation from HDC
- Return gateway connection information to the client

Example APIs:

```
POST /login
GET  /desktops
POST /createSession
POST /logout
```

The WI Server does not handle desktop session traffic.

---

## 2.3 HDC (Desktop Control Service)

The **HDC service** is the core desktop communication and control component.

HDC is the **only service that can interact with desktop VMs**.

Responsibilities:

- Maintain communication with desktop agents
- Generate session tokens
- Store session data
- Control VM interactions
- Send commands to desktop agents
- Manage desktop state

Example operations:

```
createSession(userId, desktopId)
validateSession(token)
sendCommandToDesktop()
collectDesktopStatus()
```

HDC communicates with:

- Desktop Agents inside VMs
- WI Server
- Redis (session storage)

---

## 2.4 VGA (Access Gateway)

The **VGA gateway** is responsible only for **desktop session transfer**.

It does not manage desktops and does not directly control VMs.

Responsibilities:

- Accept desktop session connections from clients
- Validate session tokens
- Transfer session traffic between client and VM
- Maintain streaming connections

Session traffic includes:

- Screen frames
- Keyboard input
- Mouse input
- Audio

Typical protocols:

- TCP
- UDP
- Remote desktop protocols (RDP / HDP / PCoIP)

VGA acts as a **traffic relay for desktop sessions**.

---

## 2.5 Desktop Agent

The **Desktop Agent** runs inside each desktop VM.

Responsibilities:

- Receive commands from HDC
- Maintain heartbeat with HDC
- Execute system operations
- Provide desktop data streams

Example functions:

```
sendHeartbeat()
executeCommand()
streamDesktop()
```

---

# 3. Session Establishment Flow

### Step 1 — User Login

```
WI Client
    │
    ▼
WI Server
    │
    ▼
Authentication Service
```

The user identity is verified.

---

### Step 2 — Desktop List Retrieval

```
WI Client
    │
    ▼
WI Server
    │
    ▼
Desktop Management / HDC
```

The available desktops are returned to the client.

---

### Step 3 — Session Creation

```
WI Client
    │
    ▼
WI Server
    │
    ▼
HDC
```

HDC generates a **session token**.

The token is stored in Redis.

Example:

```
sessionToken = abc123
desktopId = vm-10231
gateway = vga.example.com
```

WI Server returns this information to the client.

---

### Step 4 — Desktop Connection

```
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

The desktop session is established.

---

# 4. Communication Model

The architecture separates **control plane** and **data plane**.

### Control Plane

Handles management operations.

```
WI Client
   │
   ▼
WI Server
   │
   ▼
HDC
   │
   ▼
Desktop Agent
```

Examples:

- login
- desktop start
- session creation
- desktop commands

---

### Data Plane

Handles real-time desktop streaming.

```
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

Examples:

- screen updates
- keyboard input
- mouse movement
- audio

---

# 5. Architecture Summary

```
User PC
 └─ WI Client
       │
       │ API requests
       ▼
 WI Server
       │
       ▼
 HDC (Desktop Communication Service)
       │
       ▼
 Desktop Agent
       │
       ▼
 Desktop VM

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

Key design rules:

- WI Client contains UI and client logic.
- WI Server handles portal APIs.
- HDC is the only service that interacts with desktop VMs.
- VGA only transfers session traffic.
- Desktop sessions are long-lived connections.

---

# 6. Key Design Principles

1. **Control plane and data plane separation**
2. **Stateless gateways**
3. **Centralized VM interaction through HDC**
4. **Secure session tokens**
5. **Scalable session transfer through gateways**

This architecture allows the system to scale to thousands of concurrent cloud desktops.