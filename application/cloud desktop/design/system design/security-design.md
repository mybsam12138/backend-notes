# VDI System Database Security Design (Confidentiality & Integrity)

## 1. Security Level Model

Most systems implement security roughly according to the required protection level.

| Security Level | Typical Protection |
|---|---|
| Normal enterprise systems | Confidentiality only |
| Financial / regulated systems | Confidentiality + strong audit |
| Government / high-security | Confidentiality + integrity |
| Military / classified systems | Confidentiality + integrity + non-repudiation |

In practice:

- **Confidentiality** is almost always required.
- **Integrity protection** is typically added only for higher-security environments.

This document focuses only on:

- **Confidentiality**
- **Integrity**

---

# 2. Confidentiality

## 2.1 Purpose

Confidentiality means:

> Prevent sensitive information from being read directly if the database is accessed by unauthorized parties.

Even if the database is leaked or an attacker gains read access, the sensitive data should remain unusable.

Typical techniques:

- field encryption
- password hashing
- secret storage
- secure key management

---

## 2.2 Typical Confidential Fields in a VDI System

Confidentiality is usually applied to **credentials, tokens, secrets, and connection information**.

### User Authentication Data

Table example: `user`

Sensitive fields:

- `password_hash`
- `mfa_secret`
- `recovery_secret`
- `auth_token`

Notes:

- passwords should be stored as **one-way hash**, not decryptable encryption.

---

### Session and Authentication Tokens

Table example: `session`

Sensitive fields:

- `session_token`
- `refresh_token`
- `access_token`
- `device_token`

Purpose:

Prevent attackers from hijacking user sessions.

---

### VM Connection Credentials

Table example: `vm_connection`

Sensitive fields:

- `vm_password`
- `guest_os_password`
- `console_ticket`
- `agent_secret`

These credentials allow access to virtual desktops and must be protected.

---

### Certificates and API Secrets

Table example: `certificate_store`

Sensitive fields:

- `private_key`
- `client_secret`
- `api_secret`
- `keystore_password`

These values allow system authentication or infrastructure access.

---

## 2.3 Fields Usually Not Encrypted

Fields commonly used for search, filtering, and joins are usually **not encrypted**:

- `username`
- `vm_name`
- `status`
- `created_time`
- `updated_time`
- `policy_name`
- `pool_name`

Encrypting them makes queries inefficient and often unnecessary.

---

## 2.4 Query Design Rule

A common rule in system design:

> Do not rely on encrypted confidential fields for searching or filtering.

Search should normally use identifiers or metadata fields such as:

- `user_id`
- `username`
- `vm_id`
- `vm_name`
- `pool_id`
- `status`
- `created_time`

Encrypted fields should mainly be used for:

- secure storage
- retrieval by primary key
- decryption only when needed.

---

# 3. Integrity

## 3.1 Purpose

Integrity means:

> Detect whether important data has been modified outside the system or tampered with illegally.

Typical techniques:

- hash
- HMAC
- integrity verification field (e.g. `data_hash`)

Example calculation:
data_hash = HMAC(important_fields, secret_key)

When data is read, the system recalculates the hash and compares it with the stored value.

If they do not match, the system detects possible tampering.

---

## 3.2 Tables That Typically Need Integrity Protection

Integrity is usually applied to **critical configuration tables** rather than every table.

### VM Configuration

Table example: `vm_instance`

Reason:

VM ownership, assignment, and security level must not be modified outside the platform.

Important fields often included in integrity calculation:

- `vm_id`
- `vm_name`
- `host_id`
- `assigned_user_id`
- `desktop_pool_id`
- `security_level`
- `status`

---

### Security Policy

Table example: `desktop_policy`

Reason:

Security policies control behavior such as clipboard, USB, printing, and file transfer.

Important fields:

- `clipboard_enabled`
- `usb_enabled`
- `file_transfer_enabled`
- `printing_enabled`
- `watermark_enabled`
- `screen_capture_policy`

Unauthorized changes could bypass security restrictions.

---

### System Configuration

Table example: `system_config`

Reason:

Global parameters affect system security and behavior.

Important fields:

- `config_key`
- `config_value`
- `security_scope`
- `policy_group`

---

### Network Configuration

Table example: `network_config`

Reason:

Network configuration determines VM connectivity and isolation.

Important fields:

- `network_id`
- `subnet`
- `gateway`
- `security_zone`
- `desktop_pool_id`

---

### Desktop Resource Pool

Table example: `desktop_pool`

Reason:

Defines VM allocation and resource control.

Important fields:

- `pool_id`
- `cpu`
- `memory`
- `storage`
- `image_id`
- `policy_id`

---

## 3.3 Tables Usually Not Protected by Row-Level Integrity

Tables with frequent updates usually do not benefit from row-level integrity checks:

- `session`
- `temporary_token`
- `monitoring_metrics`
- `cache_tables`

These tables change frequently and integrity verification may add unnecessary overhead.

---

# 4. Integrity Verification Strategy

Integrity verification should be applied selectively.

Recommended approach:

### Critical configuration read
query record
→ recompute integrity hash
→ compare with stored value
→ if valid: return result
→ if invalid: raise security alert


This is appropriate for:

- VM configuration reads
- security policy loading
- system configuration reads

---

### Bulk queries and list pages

Integrity verification is usually skipped or delayed.

Examples:

- VM list pages
- monitoring dashboards
- large paginated queries

Reason:

- verifying every row can create unnecessary overhead.

---

# 5. Implementation Approach

A common design uses ORM or database interceptors.

Typical uses:

### Encryption interceptor

Automatically:

- encrypt fields before insert/update
- decrypt fields after select

Example tools:

- MyBatis interceptor
- JPA attribute converter
- ORM type handler

---

### Integrity interceptor

Automatically:

- calculate `data_hash` on insert/update
- verify `data_hash` when loading protected entities

Usually applied only to selected tables.

Annotations can be used to mark protected entities, for example:

- `@EncryptedField`
- `@IntegrityProtected`

---

# 6. Practical Security Design Summary

For a typical secure VDI platform:

### Confidentiality

Encrypt sensitive fields such as:

- passwords
- tokens
- secrets
- private keys
- VM connection credentials

---

### Integrity

Protect critical configuration tables such as:

- `vm_instance`
- `desktop_policy`
- `system_config`
- `network_config`
- `desktop_pool`

---

### Query Design

Search operations should normally rely on **non-confidential metadata fields**, not encrypted values.

---

### Verification Strategy

For critical configuration reads:
verify integrity
→ then return data


For large list queries:

- verification may be skipped or limited.

---

This design provides a practical balance between **security, performance, and maintainability** in a VDI platform database.

