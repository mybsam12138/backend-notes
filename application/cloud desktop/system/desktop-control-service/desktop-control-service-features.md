# Desktop Control Service (DCS / HDC) – Features

## 1. Overview

The **Desktop Control Service (DCS)**, also known as the **Desktop Communication Service (HDC)**, is the central component responsible for controlling and communicating with desktop virtual machines.

This service operates between the **control plane services** and the **desktop agents running inside VMs**.

Key characteristics:

- The **only service allowed to interact with desktop VMs**
- Maintains communication with **desktop agents**
- Coordinates **desktop sessions**
- Sends commands to desktops
- Collects desktop status and metrics

The Desktop Control Service communicates with:

- Desktop Management Service
- Web Interface Server
- Desktop Agents
- Redis (session storage)
- Database

The service does **not transfer desktop screen traffic**.  
Desktop streaming is handled by the **Access Gateway (VGA)**.

---

# 2. Core Responsibilities

The Desktop Control Service focuses on:

- Desktop agent communication
- Session coordination
- Command execution
- Desktop status reporting
- Token generation and validation

It acts as the **control channel between the cloud backend and desktop VMs**.

---

# 3. Core Features

## 3.1 Desktop Agent Communication

The Desktop Control Service maintains persistent communication with desktop agents running inside each VM.

The communication channel is typically implemented using:

- WebSocket
- gRPC
- long TCP connections

Responsibilities include:

- receiving agent heartbeat
- sending commands
- collecting system information
- maintaining connection state

Example communication flow:

```
Desktop Agent
     │
     ▼
Desktop Control Service
```

---

## 3.2 Desktop Heartbeat Monitoring

Desktop agents periodically send heartbeat messages to indicate that the VM is alive.

Typical heartbeat interval:

```
5–10 seconds
```

Heartbeat data may include:

- desktop ID
- CPU usage
- memory usage
- agent status
- timestamp

Example message:

```
{
  desktopId: vm-10231
  status: running
  cpu: 30%
  memory: 55%
}
```

The service updates desktop status in Redis.

---

## 3.3 Desktop Command Execution

The Desktop Control Service sends control commands to desktop agents.

Typical commands include:

- lock desktop
- log off user
- restart agent
- collect logs
- shutdown desktop
- restart desktop

Example command flow:

```
Desktop Management Service
      │
      ▼
Desktop Control Service
      │
      ▼
Desktop Agent
```

Example API:

```
POST /desktop/{id}/command
```

---

## 3.4 Session Token Generation

When a user launches a desktop, the Desktop Control Service generates a **session token**.

The token is used by the Access Gateway to establish the remote desktop connection.

Example token information:

```
sessionToken
desktopId
userId
expireTime
```

Tokens are stored in Redis.

Example Redis record:

```
session:token:abc123
```

Token TTL is typically short (30–120 seconds).

---

## 3.5 Session Validation Support

The Desktop Control Service supports session validation for the Access Gateway.

When the gateway receives a connection request, it may validate the token through:

- Redis lookup
- service API call

Example validation flow:

```
Client
   │
   ▼
VGA Gateway
   │
   ▼
Desktop Control Service
```

The service verifies:

- token validity
- desktop assignment
- session status

---

## 3.6 Desktop Status Reporting

The service maintains real-time desktop state information.

Typical desktop states:

- running
- stopped
- starting
- stopping
- disconnected
- error

Status information comes from:

- agent heartbeat
- infrastructure updates

Example API:

```
GET /desktop/{id}/status
```

---

## 3.7 Desktop Session Coordination

The Desktop Control Service coordinates the connection between:

- desktop client
- gateway
- desktop VM

Responsibilities include:

- verifying desktop availability
- generating session tokens
- notifying the desktop agent of incoming sessions
- preparing the desktop environment

Example session flow:

```
WI Server
   │
   ▼
Desktop Control Service
   │
   ▼
Desktop Agent
```

---

## 3.8 Desktop Event Handling

The service processes various desktop events.

Examples:

- desktop started
- desktop stopped
- agent disconnected
- session created
- session terminated

Events may trigger:

- status updates
- notifications
- monitoring alerts

---

## 3.9 Agent Registration

When a desktop VM starts, the agent registers itself with the Desktop Control Service.

Registration includes:

- desktop ID
- VM IP
- agent version
- capability information

Example message:

```
registerAgent(desktopId, vmIp)
```

After registration, the control service maintains the communication channel.

---

# 4. Interaction with Other Services

The Desktop Control Service communicates with multiple system components.

Example architecture:

```
WI Server
     │
     ▼
Desktop Management Service
     │
     ▼
Desktop Control Service
     │
     ▼
Desktop Agent
     │
     ▼
Desktop VM
```

It also interacts with:

```
Redis
Database
Access Gateway
```

---

# 5. Control Plane Role

The Desktop Control Service operates in the **control plane**.

Responsibilities include:

- desktop communication
- command delivery
- session coordination
- status monitoring

The service does **not handle streaming traffic**.

Streaming path:

```
Desktop Client
      │
      ▼
Access Gateway (VGA)
      │
      ▼
Desktop Agent
      │
      ▼
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
       ▼
 Desktop Control Service (HDC)
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

---

# 7. Summary

The **Desktop Control Service (HDC)** is the core communication component between the cloud platform and desktop VMs.

Its main responsibilities include:

- communicating with desktop agents
- monitoring desktop heartbeat
- executing desktop commands
- generating session tokens
- coordinating desktop sessions
- maintaining desktop status

This service ensures that cloud desktops can be securely controlled and monitored from the backend platform.