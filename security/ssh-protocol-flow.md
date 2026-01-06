# SSH Protocol: End-to-End Flow Explained

## What is SSH?

**SSH (Secure Shell)** is an **application-layer protocol** used to securely access remote systems, execute commands, and transfer data over an insecure network.

SSH runs **on top of TCP (usually port 22)** and integrates cryptography directly into the protocol.

**Business Help:**
Understanding the SSH protocol helps engineers clearly grasp how data is securely transmitted over untrusted networks. It provides practical insight into choosing 
appropriate mechanisms for key exchange, authentication, data confidentiality, and data integrity, enabling the design of secure communication channels that balance security,
performance, and maintainability in real-world systems.


---

## Core Design Principle

> **Asymmetric cryptography establishes trust and keys;  
> symmetric cryptography transports all real data.**

SSH never sends sensitive data in plaintext once encryption is enabled.

---

## SSH Connection Flow (Step by Step)

### 1. TCP Connection Establishment

The SSH client first establishes a TCP connection to the server:

Client → Server : TCP connect (port 22)

At this stage:
- No encryption
- No authentication
- Only a reliable byte stream

---

### 2. Algorithm Negotiation

Client and server exchange supported algorithms:

- Key exchange: Diffie–Hellman (DH / ECDH)
- Encryption: AES / ChaCha20
- Integrity: HMAC / AEAD
- Compression: optional

Both sides agree on a secure algorithm set.

---

### 3. Key Exchange (Diffie–Hellman / ECDH)

**Purpose:** Securely derive a shared symmetric session key over an insecure network.

Process:
1. Client generates a random ephemeral secret `a`
2. Client sends its **key exchange public value** (DH: `g^a mod p`, ECDH: `a·G`)
3. Server sends its **key exchange public value** (DH: `g^b mod p`, ECDH: `b·G`)
4. Both sides compute the same **shared secret** (DH: `g^(ab) mod p`, ECDH: `ab·G`)
5. Session keys are derived using a **KDF**

Important properties:
- No session key is transmitted
- No long-term identity keys are used
- Perfect Forward Secrecy (PFS)

Encryption is enabled immediately after this step.

---

### 4. Server Authentication

**Purpose:** Prevent man-in-the-middle attacks.

- Server signs handshake data using its private key
- Client verifies the signature using the server’s public key
- Server identity is confirmed

This step uses **asymmetric digital signatures**, not encryption.

---

### 5. Client Authentication

**Purpose:** Prove the client’s identity.

Common methods:
- Public key authentication (recommended)
- Password authentication (legacy)

Public key authentication flow:
1. Server sends an authentication challenge
2. Client signs the challenge with its private key
3. Server verifies the signature using the client’s public key

Private keys never leave the client.

---

### 6. Secure Data Transmission

After authentication succeeds:

- SSH uses **only symmetric encryption**
- The session key from the key exchange is used
- All traffic is encrypted and integrity-protected

Encrypted data includes:
- Shell input/output
- Command execution results
- File transfers (SCP / SFTP)
- Port forwarding traffic

---

### 7. SSH Channels and Multiplexing

SSH supports multiple logical channels over a single TCP connection:

- Interactive shell
- Remote command execution
- File transfer
- Port forwarding

All channels share the same encrypted tunnel.

---

### 8. Rekeying and Session Termination

For long-lived connections:
- SSH periodically performs rekeying
- New session keys are derived

When the session ends:
- All keys are discarded
- TCP connection is closed

---

## Cryptography Summary

| Purpose | Mechanism | Crypto Type |
|------|----------|------------|
| Key exchange | DH / ECDH | Asymmetric math |
| Authentication | Digital signature | Asymmetric |
| Data confidentiality | AES / ChaCha20 | Symmetric |
| Data integrity | HMAC / AEAD | Symmetric + hash |
| Bulk data transfer | Session key encryption | Symmetric |

---

## Protocol Layer Classification

SSH is an **application-layer protocol**.

Reason:
- Defines its own message formats
- Handles authentication, encryption, and integrity
- Runs over TCP as a transport

Even though SSH is frequently discussed in networking contexts, it is logically categorized at the **application layer**, similar to HTTPS.

---

## Final Takeaway

> **SSH uses asymmetric cryptography to establish trust and keys,  
> then relies entirely on symmetric cryptography to securely transmit all data.**
