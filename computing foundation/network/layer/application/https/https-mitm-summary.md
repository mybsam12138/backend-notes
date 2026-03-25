# How HTTPS Prevents Man-in-the-Middle (MITM) Attacks

## 1. Core Idea

HTTPS prevents intermediate (man-in-the-middle) attacks by combining:

- **Encryption** → protects confidentiality
- **Authentication** → verifies server identity
- **Integrity** → detects tampering

---

## 2. TLS Handshake (Foundation of HTTPS)

When a client connects to an HTTPS server:

1. Client sends request (ClientHello)
2. Server responds with:
   - Certificate (contains public key)
3. Client verifies certificate
4. Client generates a session key
5. Session key is encrypted using server’s public key
6. Both sides use this session key for encrypted communication

---

## 3. Authentication (Prevents Impersonation)

The server provides a **digital certificate** issued by a trusted Certificate Authority (CA).

- Client verifies:
  - Certificate is valid
  - Domain matches
  - Certificate is signed by trusted CA

👉 Prevents attacker from pretending to be the server

---

## 4. Encryption (Prevents Eavesdropping)

After handshake:

- All data is encrypted using a symmetric key (session key)

Even if attacker intercepts traffic:

- Cannot read content without the key

---

## 5. Integrity Protection (Prevents Tampering)

HTTPS uses:

- MAC (Message Authentication Code) or AEAD

Each message includes integrity verification:

- If data is modified → verification fails → connection drops

---

## 6. Why MITM Attack Fails

### Scenario:

Attacker tries to intercept and modify traffic

---

### Problem 1: Cannot forge certificate

- Needs valid certificate for the domain
- Cannot generate trusted certificate without CA

---

### Problem 2: Cannot decrypt data

- Session key is encrypted with server’s public key
- Attacker does not have private key

---

### Problem 3: Cannot modify data

- Integrity check will fail
- Connection will be terminated

---

## 7. Summary

HTTPS prevents MITM attacks through:

- **Authentication** → verify server identity (certificate)
- **Encryption** → protect data confidentiality
- **Integrity** → detect any modification

---

## 8. One-line takeaway

> HTTPS prevents man-in-the-middle attacks by using certificates to verify identity and encryption with integrity checks to ensure secure and untampered communication.
