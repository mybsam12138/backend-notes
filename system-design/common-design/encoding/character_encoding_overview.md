# Character Encoding: Why It Appears Everywhere (JVM, Maven, Logback, Web)

This document explains **why character encoding must be specified in many layers of a system**, how text travels from **keyboard input to saved files**, and what common encodings (UTF‑8 / UTF‑16 / GBK) really mean—especially in systems mixing **Chinese and English**.

---

## 1. What Is Character Encoding (One‑Line Definition)

**Character encoding** defines how *characters* (e.g. `A`, `中`, `😊`) are mapped to *bytes* (`01001010`).

> Computers only store bytes. Encoding is the contract between bytes ↔ characters.

If two components **don’t use the same encoding**, text becomes **mojibake** (乱码).

---

## 2. Why Encoding Must Be Declared in So Many Places

Because **text crosses boundaries**.

Each boundary is an opportunity for misinterpretation if encoding is implicit.

```
Keyboard → OS → IDE → File → Compiler → JVM → Logs → HTTP → Browser
```

Encoding must be explicitly agreed upon **at every boundary**.

---

## 3. JVM Encoding (`-Dfile.encoding`)

### What it controls

The JVM default charset used by:

- `new String(byte[])`
- `String.getBytes()`
- File IO **without explicit Charset**
- Logging frameworks

### Why it exists

The JVM inherits encoding from the **OS locale**.

| OS / Locale | Default Encoding |
|------------|------------------|
| Linux (UTF‑8) | UTF‑8 |
| Windows zh_CN | GBK |
| Windows en_US | Cp1252 |

➡ Same Java code behaves differently on different machines.

### Best practice

```bash
-Dfile.encoding=UTF-8
```

But **do not rely on it**—always specify charset in code when possible.

---

## 4. Maven Compiler Encoding (`project.build.sourceEncoding`)

### What it controls

- How **.java source files** are read by `javac`
- Affects:
  - String literals
  - Comments
  - Annotations

### Example problem

```java
String msg = "中文"; // encoded as UTF‑8 in file
```

If Maven compiles using **GBK**, the bytes are misread.

### Correct configuration

```xml
<properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

This is **mandatory** for any team project.

---

## 5. Logback / Logging Encoding

### Why logs need encoding

Logs are written to:

- Console
- Files
- Docker stdout

If encoding mismatches:

- Chinese logs show as `???`
- ELK / Loki indexing breaks

### Example

```xml
<encoder>
  <pattern>%d %-5level %msg%n</pattern>
  <charset>UTF-8</charset>
</encoder>
```

### Why JVM encoding alone is not enough

Logging frameworks may:

- Encode independently
- Run in containers
- Write to different targets

➡ Always set explicitly.

---

## 6. Web Request & Response Encoding

### Request (Client → Server)

- Query params
- Form data
- JSON body

If encoding is wrong:

- Parameters corrupted
- Signature / hash verification fails

### Response (Server → Client)

```http
Content-Type: application/json; charset=UTF-8
```

If missing:

- Browser guesses
- Mobile apps decode incorrectly

### Golden rule

- HTTP headers define encoding
- Payload must match headers

---

## 7. From Keyboard to Saved File (End‑to‑End)

### Step‑by‑step

1. **Keyboard input**
   - Generates characters (Unicode code points)

2. **OS Input Method (IME)**
   - Converts keystrokes → Unicode text

3. **IDE (IntelliJ IDEA)**
   - Internally uses **UTF‑16**
   - Displays characters correctly

4. **File saving**
   - IDE encodes text → bytes (e.g. UTF‑8)
   - Written to disk

5. **Compiler / Tools**
   - Read bytes using declared encoding

➡ Corruption happens **only at encoding/decoding boundaries**.

---

## 8. UTF‑16, UTF‑8, GBK Explained

### Unicode (Concept)

- Universal character set
- Assigns each character a **code point**
- Example:
  - `中` → U+4E2D

Unicode ≠ encoding.

---

### UTF‑16

- Encoding used **inside JVM and IDEs**
- Java `char` = 16 bits
- Advantages:
  - Fast indexing
- Disadvantages:
  - Variable length (surrogate pairs)
  - Inefficient for ASCII

➡ **Do not use for files or protocols**.

---

### UTF‑8 (Recommended)

- Variable length (1–4 bytes)
- ASCII compatible
- Chinese = 3 bytes

**Advantages**:

- Universal standard
- Web native
- Linux / Docker friendly
- No ambiguity

➡ **Use everywhere externally**.

---

### GBK

- Legacy Chinese encoding
- Windows‑specific
- Not Unicode‑complete

**Problems**:

- Cannot represent all characters
- Breaks cross‑platform systems
- Fails in containers / cloud

➡ Avoid in modern systems.

---

## 9. Common Encodings Comparison

| Encoding | Scope | Chinese | Cross‑Platform | Recommended |
|--------|------|---------|----------------|-------------|
| UTF‑8 | Files / Web | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| UTF‑16 | JVM internal | ✅ | ❌ | ❌ |
| GBK | Legacy Windows | ✅ | ❌ | ❌ |

---

## 10. What Should You Use (Chinese + English Systems)

### Mandatory defaults

- **UTF‑8 everywhere**

### Explicit configuration checklist

- JVM: `-Dfile.encoding=UTF-8`
- Maven: `project.build.sourceEncoding=UTF-8`
- Logback: `<charset>UTF-8</charset>`
- HTTP: `Content-Type; charset=UTF-8`
- DB connection: UTF‑8
- IDE: UTF‑8

### Code rule

❌ Never rely on defaults

✅ Always specify charset when converting bytes ↔ strings

---

## 11. Mental Model (One Sentence)

> **Unicode is what characters mean; encoding is how bytes represent them.**

Specify encoding at every boundary, and encoding bugs disappear.

---

## 12. Final Recommendation

For modern Java + Web systems (Chinese + English):

> **UTF‑8 everywhere externally, UTF‑16 only internally (JVM).**

Anything else is technical debt.

