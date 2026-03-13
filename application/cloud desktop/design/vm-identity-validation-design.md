# VM Identity Validation Design (Agent API Signature Method)

## 1. Goal

Ensure that requests sent from **VM Agent to HDC (Host Desktop Communication Service)** truly originate from the legitimate agent running inside a specific VM.

This validation mechanism is **not only used for heartbeat**, but for **all APIs that the VM Agent invokes on HDC**.

Typical agent APIs include:

- heartbeat reporting
- session reporting
- VM event reporting
- metrics reporting
- agent upgrade status reporting
- desktop readiness notification

Without identity validation, any machine could call these APIs and manipulate VM state.

The validation mechanism prevents:

- fake heartbeat injection
- VM status manipulation
- unauthorized agent impersonation
- replay attacks
- malicious API invocation

---

# 2. Why VM Identity Validation Is Needed

All **VM Agent → HDC APIs** must verify the VM identity.

Example APIs:

```
POST /agent/heartbeat
POST /agent/session
POST /agent/metrics
POST /agent/event
POST /agent/upgrade/status
```

If identity validation is missing, attackers could:

- send fake heartbeats to make a VM appear healthy
- report fake user sessions
- manipulate VM monitoring data
- trigger false VM events
- hide VM failures

Therefore the system must guarantee:

```
Only the legitimate VM agent can invoke APIs for its VM.
```

---

# 3. Core Idea

Each VM is assigned a **shared secret key** when it is created.

The VM Agent uses this secret to **sign every API request** sent to HDC.

HDC verifies the signature before processing the request.

Architecture:

```
VM Agent
   ↓ API request + signature
HDC
   ↓ verify signature
process request
```

This ensures the request truly comes from the correct VM agent.

---

# 4. Key Components

## VM Agent

Responsibilities:

- generate API request payload
- sign request using VM secret
- attach signature to request
- send request to HDC

---

## HDC

Responsibilities:

- receive agent API requests
- extract VM identity information
- verify request signature
- validate timestamp
- reject invalid requests
- process valid requests

---

# 5. Secret Key Provisioning

When a VM is provisioned:

1. The platform generates a **VM secret key**.

Example:

```
vmId = vm-1001
vmSecret = 9fa3c81b7c22...
```

2. The secret is injected into the VM agent environment.

Possible injection methods:

- cloud-init
- VM metadata service
- configuration file
- secure agent configuration

3. The secret is stored securely in the platform database.

Example table:

```
vm_instance
```

Fields:

- `vm_id`
- `vm_secret`

---

# 6. API Request Format

Each agent API request contains:

- VM identity
- timestamp
- payload
- signature

Example request:

```json
{
  "vmId": "vm-1001",
  "timestamp": 1710000000,
  "payload": {...},
  "signature": "f3c8ab239..."
}
```

---

# 7. Signature Generation

The VM Agent computes a signature using **HMAC-SHA256**.

Signature input:

```
vmId + timestamp + requestBody
```

Signature calculation:

```
signature = HMAC_SHA256(vmId + timestamp + requestBody, vmSecret)
```

Example:

```
signature = HMAC_SHA256("vm-10011710000000{payload}", vmSecret)
```

The resulting signature is attached to the request.

---

# 8. Identity Validation Flow

When HDC receives a request:

### Step 1 — Extract fields

```
vmId
timestamp
signature
payload
```

### Step 2 — Lookup VM secret

```
vmSecret = query vm_instance where vm_id = vmId
```

### Step 3 — Recalculate signature

```
expectedSignature = HMAC_SHA256(vmId + timestamp + payload, vmSecret)
```

### Step 4 — Compare signature

```
expectedSignature == signature
```

If equal:

```
request is valid
```

If not equal:

```
reject request
```

---

# 9. Replay Attack Prevention

Every request must include a timestamp.

Example rule:

```
abs(serverTime - timestamp) <= 60 seconds
```

If timestamp is too old or too far in the future:

```
reject request
```

This prevents attackers from replaying captured requests.

---

# 10. Request Acceptance Logic

HDC accepts an agent API request only if:

1. `vmId` exists
2. signature verification succeeds
3. timestamp is within allowed range

If valid:

```
process API request
```

If invalid:

```
reject request
log security warning
```

---

# 11. Example Validation Flow

```
VM Agent
   ↓
Generate timestamp
   ↓
Compute HMAC signature
   ↓
Send API request
   ↓
HDC receives request
   ↓
Lookup vmSecret
   ↓
Recalculate HMAC
   ↓
Compare signatures
   ↓
Accept or reject request
```

---

# 12. Security Properties

This design ensures:

| Threat | Protection |
|---|---|
| Fake API request | attacker does not know vmSecret |
| Message tampering | signature verification fails |
| VM impersonation | signature mismatch |
| Replay attack | timestamp validation |

---

# 13. Advantages of HMAC-Based Validation

Advantages:

- simple implementation
- fast verification
- minimal performance overhead
- suitable for high-frequency agent APIs
- scalable for large VDI environments

---

# 14. Recommended Security Practices

To strengthen the system:

- store `vmSecret` encrypted in database
- cache secrets in Redis for faster lookup
- enforce TLS for agent communication
- rotate VM secrets periodically
- log invalid signature attempts
- apply rate limiting on agent endpoints

---

# 15. Summary

VM identity validation is applied to **all VM Agent → HDC APIs**, not only heartbeat.

Design summary:

```
VM Agent signs API requests using vmSecret
↓
Request includes signature and timestamp
↓
HDC verifies signature using stored vmSecret
↓
Only verified requests are accepted
```

This mechanism guarantees that **only the legitimate VM agent can invoke APIs for its VM**.