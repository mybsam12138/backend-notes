# VM Heartbeat System Design (VM Agent + HDC + DMS + WI)

## 1. Goal

Design a heartbeat mechanism that allows the platform to reliably determine the **runtime status of each VM**.

The system should allow:

- **HDC (Host Desktop Communication Service)** to track VM connectivity
- **DMS (Desktop Management Service)** to obtain VM runtime status
- **WI (Web Interface)** to display VM status

The system should detect states such as:

- VM running normally
- VM powered on but agent disconnected
- VM starting
- VM stopping
- VM unreachable
- VM unknown state

The heartbeat system should be:

- scalable
- loosely coupled
- real-time
- easy to query

---

## 2. Core Architecture

The heartbeat originates from the **VM Agent inside the VM**.

Architecture flow:

```
VM Agent
   ↓ heartbeat
HDC
   ↓ update VM status
Redis
   ↑
WI / DMS query
```

Responsibilities:

| Component | Responsibility |
|---|---|
| VM Agent | Send periodic heartbeat |
| HDC | Maintain VM connection and heartbeat state |
| Redis | Store latest VM runtime status |
| DMS | Manage VM lifecycle and query runtime status |
| WI | Display VM status |

Key principle:

> **HDC is the heartbeat owner and real-time status tracker.**

---

## 3. Why HDC Should Own Heartbeat

HDC is responsible for VM communication channels.

It already manages:

- VM agent connection
- desktop communication channel
- remote control traffic
- agent connectivity detection
- connection lifecycle

Because heartbeat flows through this channel, HDC naturally knows:

- agent connected
- agent disconnected
- heartbeat timeout

Therefore HDC is the correct service to maintain runtime status.

---

## 4. VM Agent Responsibilities

The VM Agent runs inside the guest OS.

Responsibilities:

- send heartbeat periodically
- report agent version
- report guest IP
- report hostname
- optionally report logged-in user

Example heartbeat payload:

```json
{
  "vmId": "vm-1001",
  "heartbeatTime": "2026-03-12T16:00:00Z",
  "guestIp": "10.10.1.15",
  "hostname": "WIN10-001",
  "agentVersion": "1.0.3",
  "currentUser": "sam"
}
```

---

## 5. HDC Responsibilities

HDC processes heartbeat messages.

Responsibilities:

- receive heartbeat
- validate VM identity
- detect connection state
- update last heartbeat time
- update runtime status
- store latest status in Redis

HDC should treat Redis as the **runtime status cache**.

---

## 6. Redis Status Storage

Redis stores the latest VM status.

Example key:

```
vm:status:{vmId}
```

Stored fields:

- runtimeStatus
- lastHeartbeatTime
- guestIp
- agentVersion
- currentUser

Example:

```
vm:status:vm-1001
```

Data:

```
runtimeStatus = RUNNING
lastHeartbeatTime = 2026-03-12T16:00:00Z
currentUser = sam
```

Recommended:

```
TTL = heartbeat_interval × 3
```

If heartbeat stops, Redis entry expires and VM becomes disconnected.

---

## 7. VM Status Model

Example runtime status model:

| Status | Meaning |
|---|---|
| PROVISIONING | VM being created |
| STARTING | VM booting |
| RUNNING | VM powered on and agent connected |
| AGENT_DISCONNECTED | VM powered on but agent lost |
| STOPPING | shutdown in progress |
| STOPPED | VM powered off |
| ERROR | abnormal state |
| UNKNOWN | state cannot be determined |

Status should consider both:

- hypervisor power state
- agent heartbeat state

---

## 8. Heartbeat Interval Design

Typical heartbeat interval:

```
10–15 seconds
```

Timeout rules example:

| Condition | Result |
|---|---|
| heartbeat ≤ 30s | healthy |
| 30–60s | suspect |
| > 60s | disconnected |

---

## 9. DMS Responsibilities

DMS should **not manage heartbeat directly**.

Instead DMS:

- manages VM lifecycle
- manages desktop pools
- manages policies
- queries runtime status from Redis
- combines runtime status with VM lifecycle state

Example:

```
GET VM status
→ read Redis vm:status
→ combine with VM lifecycle state
```

---

## 10. WI Responsibilities

WI displays VM status to users.

WI queries DMS APIs such as:

```
GET /api/v1/user/desktops
GET /api/v1/admin/vms
```

DMS retrieves runtime status from Redis and returns it.

Example response:

```json
{
  "vmId": "vm-1001",
  "vmName": "Desktop-001",
  "runtimeStatus": "RUNNING",
  "lastHeartbeatTime": "2026-03-12T16:00:00Z"
}
```

---

## 11. Failure Scenarios

### Agent stopped

VM powered on but heartbeat missing.

Status:

```
AGENT_DISCONNECTED
```

---

### Network jitter

Avoid disconnect on one missed heartbeat.

Use timeout thresholds.

---

### VM powered off

Hypervisor reports OFF.

Status:

```
STOPPED
```

---

## 12. Final Design Principles

Architecture summary:

```
VM Agent
   ↓ heartbeat
HDC
   ↓ update
Redis
   ↑
DMS / WI query
```

Design principles:

- HDC owns heartbeat state
- Redis stores runtime status
- DMS focuses on VM lifecycle
- WI only displays status
- services remain loosely coupled