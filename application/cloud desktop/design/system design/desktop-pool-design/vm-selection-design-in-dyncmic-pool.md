# VM Selection Design in Dynamic Desktop Pool (VDI / Cloud Desktop)

## 1. Goal

In a **Dynamic Desktop Pool**, a user can connect to **any available VM in the pool**.

When a user logs in, the system must select the **most suitable VM**.

The selection mechanism should ensure:

- fair VM utilization
- balanced resource usage
- avoidance of busy desktops
- fast user reconnect
- tolerance of delayed status updates (for example about 20 seconds)

Additionally, the system should **prefer reconnecting the user to the VM they previously used**, if that VM is still available.

---

## 2. Architecture for VM Status

VM status is collected from multiple components, but **HDC is the unified status aggregation point**.

Architecture:

```text
VM Agent
   ↓ report session status
HDC
   ↑ report connection status
VAG (Virtual Access Gateway)

HDC
   ↓ update combined VM status
Redis
   ↑
Scheduler / DMS query
```

Meaning:

- **VM Agent** reports **session status** to **HDC**
- **VAG** reports **connection status** to **HDC**
- **HDC** merges these states and writes the latest VM status into **Redis**
- **Scheduler / DMS** reads Redis for fast VM selection

Example Redis key:

```text
vm:status:{vmId}
```

Stored fields may include:

```text
runtime_status
session_status
connection_status
cpu_usage
memory_usage
last_connected_user
last_heartbeat_time
last_session_update_time
last_connection_update_time
```

---

## 3. VM Selection Strategy

When selecting a VM in a dynamic pool, the scheduler should follow these priorities:

```text
1. Prefer reconnecting the user to their last VM
2. VM must have no active user session
3. VM must not already be in connecting or connected state
4. VM should have lower resource usage
5. VM status must be recent enough
```

This balances:

- user experience
- resource efficiency
- scheduling safety

---

## 4. Preferred Reconnection Logic

When a user logs in, the scheduler should first check whether the user has a **last connected VM**.

Example:

```text
last_connected_user == current_user
```

If that VM is still reusable, it should be selected first.

Reusable conditions example:

```text
runtime_status == RUNNING
session_status == IDLE
connection_status == DISCONNECTED
```

In some implementations, if reconnect-to-previous-session is supported, another valid case may be:

```text
runtime_status == RUNNING
session_status == ACTIVE
connection_status == DISCONNECTED
last_connected_user == current_user
```

That means the user session still exists, but the client connection was lost, so the platform should reconnect that same user back to that VM.

Benefits:

- faster login
- better continuity
- possible warm cache reuse
- better user perception

---

## 5. Why Both Session Status and Connection Status Are Needed

Two status dimensions are needed because they describe different layers.

### Session Status

Session status describes the **OS login session state inside the VM**.

It is reported by:

```text
VM Agent → HDC
```

Typical enum:

| Session Status | Meaning |
|---|---|
| IDLE | no user logged in |
| ACTIVE | user logged in and session active |
| DISCONNECTED | session still exists but not currently interactive |
| LOGGING_IN | login in progress |
| LOGGING_OUT | logout in progress |

Notes:

- this is the **inside-VM user session state**
- it answers: **is there a user session in this VM?**

---

### Connection Status

Connection status describes the **remote desktop connection channel state**.

It is reported by:

```text
VAG → HDC
```

Typical enum:

| Connection Status | Meaning |
|---|---|
| DISCONNECTED | no active client connection |
| CONNECTING | client is establishing connection |
| CONNECTED | client is actively connected |
| TERMINATED | connection was explicitly ended |

Notes:

- this is the **client-to-gateway connection state**
- it answers: **is a client currently connecting or connected to this VM?**

---

## 6. Why Connection Status Is Important for VM Selection

Connection setup takes time.

Example timeline:

```text
T0  scheduler selects VM-201
T1  VAG starts connection
T2  remote protocol handshake
T5  session fully ready
```

During this time, the VM may still not have updated `session_status` yet.

If the scheduler uses only:

```text
session_status == IDLE
```

then another concurrent login request may still see the VM as available and select it again.

That causes duplicate assignment.

So `connection_status = CONNECTING` is very important, because it means:

```text
this VM has already been selected and is in use during connection establishment
```

Therefore, for safe scheduling:

```text
connection_status == CONNECTING
or
connection_status == CONNECTED
```

must both be treated as **not selectable**.

---

## 7. Example State Combinations

| Session Status | Connection Status | Meaning |
|---|---|---|
| IDLE | DISCONNECTED | VM available |
| ACTIVE | CONNECTED | user actively using desktop |
| ACTIVE | DISCONNECTED | session exists, client disconnected |
| IDLE | CONNECTING | VM is being assigned / connection establishing |
| LOGGING_IN | CONNECTING | login in progress |
| LOGGING_OUT | DISCONNECTED | session closing |

For normal new allocation, the safest reusable state is usually:

```text
session_status == IDLE
AND connection_status == DISCONNECTED
```

---

## 8. Status Delay and Freshness

Because status updates may be delayed by heartbeat or event propagation, the scheduler must protect itself against stale data.

Recommended checks:

### 8.1 Heartbeat freshness

Only consider VMs with recent heartbeat:

```text
now - last_heartbeat_time < 60 seconds
```

### 8.2 Session status freshness

Only trust recent session updates:

```text
now - last_session_update_time < threshold
```

### 8.3 Connection status freshness

Only trust recent connection updates:

```text
now - last_connection_update_time < threshold
```

If status is too stale, the VM should be downgraded in priority or temporarily excluded.

---

## 9. Assignment Lock

To avoid race conditions across concurrent schedulers, use a short-lived assignment lock.

Example:

```text
set vm:assign_lock:{vmId}
TTL = 30 seconds
```

When a VM is chosen:

- create lock first
- then create session / start connection

If connection succeeds:

- keep normal runtime state

If connection fails:

- release lock
- try next candidate

This protects against:

- duplicate selection
- delayed status updates
- concurrent login conflicts

---

## 10. Resource-Based Selection

Among all eligible VMs, choose the one with lower resource usage.

Candidate metrics:

```text
cpu_usage
memory_usage
```

Simple scoring example:

```text
score = cpu_usage + memory_usage
```

Example:

| VM | CPU | Memory | Score |
|---|---|---|---|
| VM-201 | 20% | 30% | 50 |
| VM-203 | 10% | 25% | 35 |
| VM-207 | 15% | 20% | 35 |

Lower score means lighter VM load.

If scores are equal, use secondary rules such as:

- more recent heartbeat
- previous user match
- random tie-breaker
- round-robin tie-breaker

---

## 11. Recommended Selection Flow

Typical scheduling process:

```text
1. Check user's previous VM
2. If previous VM is reusable, try it first
3. Otherwise get pool VM list
4. Read VM status from Redis
5. Filter VMs by runtime_status
6. Filter VMs by session_status
7. Filter VMs by connection_status
8. Filter stale heartbeat/status VMs
9. Score remaining VMs by resource usage
10. Apply assignment lock to selected VM
11. Double-check session/connection state if needed
12. Create session and start connection
```

---

## 12. Example Filtering Rules

A VM is selectable only if all conditions are satisfied:

```text
runtime_status == RUNNING
session_status == IDLE
connection_status == DISCONNECTED
last_heartbeat_time is fresh
no active assignment lock
```

Reject VMs in these cases:

```text
runtime_status in (STOPPED, STARTING, ERROR, AGENT_DISCONNECTED)
session_status in (ACTIVE, LOGGING_IN, LOGGING_OUT, DISCONNECTED)
connection_status in (CONNECTING, CONNECTED)
```

Note:

- whether `session_status = DISCONNECTED` is reusable depends on product policy
- if disconnected-session reconnection is supported, such a VM is usually reserved for the same user, not reused by another user

---

## 13. Responsibility Summary

Clear role separation:

| Component | Responsibility |
|---|---|
| VM Agent | report session status, user state, basic resource data |
| VAG | report connection state |
| HDC | aggregate session + connection status and update Redis |
| Redis | provide fast status read for scheduling |
| Scheduler / DMS | select the most suitable VM |

So the correct model is:

```text
VM Agent → HDC : session status
VAG      → HDC : connection status
HDC      → Redis : combined VM status
Scheduler/DMS → Redis : read status for selection
```

---

## 14. Summary

Dynamic pool VM selection should balance **user experience, fairness, and system stability**.

Core scheduling rules:

```text
prefer previous VM of the same user
require runtime_status == RUNNING
require session_status == IDLE for new allocation
require connection_status == DISCONNECTED
ignore stale VM status
choose lower resource VM
protect selection using assignment lock
```

The most important architectural rule is:

```text
VM Agent reports session status to HDC
VAG reports connection status to HDC
HDC aggregates both and writes Redis
Scheduler reads Redis to select VM
```

This design makes VM selection safe even when:

- connection establishment takes time
- status updates are delayed
- multiple login requests happen concurrently
- reconnect-to-previous-VM behavior is preferred