# Unicode → UTF-8 / UTF-16 Translation (Detailed Process)

## 1. Unicode Basics

Unicode is an abstract character set.  
Each character is assigned a **code point** (`U+0000` to `U+10FFFF`).  
Unicode itself does **not** define storage or bytes.

Examples:
- `A` → `U+0041`
- `中` → `U+4E2D`
- `😀` → `U+1F600`

---

## 2. Unicode → UTF-8 (Step-by-Step Translation)

### 2.1 Determine Byte Length

| Code Point Range | UTF-8 Bytes |
|-----------------|------------|
| U+0000–U+007F | 1 |
| U+0080–U+07FF | 2 |
| U+0800–U+FFFF | 3 |
| U+10000–U+10FFFF | 4 |

---

### 2.2 Convert Code Point to Binary

Example: `中 (U+4E2D)`

```
Hex:    4E2D
Binary: 0100111000101101
```

Example: `😀 (U+1F600)`

```
Hex:    1F600
Binary: 000111110110000000000
```

---

### 2.3 Apply UTF-8 Bit Templates

| Bytes | Template |
|------|---------|
| 1 | 0xxxxxxx |
| 2 | 110xxxxx 10xxxxxx |
| 3 | 1110xxxx 10xxxxxx 10xxxxxx |
| 4 | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

Fill the `x` bits **from left to right** using the binary code point.

---

### 2.4 Example: `中`

```
Binary: 0100111000101101
Template: 1110xxxx 10xxxxxx 10xxxxxx

Result:
11100100 10111000 10101101
Hex: E4 B8 AD
```

---

### 2.5 Example: 😀

```
Binary: 000111110110000000000
Template: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

Result:
11110000 10011111 10011000 10000000
Hex: F0 9F 98 80
```

---

### 2.6 Key Properties of UTF-8

- ASCII compatible
- No endianness
- Continuation bytes always start with `10`
- Self-synchronizing and safe for streaming

---

## 3. Unicode → UTF-16 (Step-by-Step Translation)

### 3.1 BMP vs Non-BMP

| Range | Encoding |
|-----|---------|
| U+0000–U+FFFF | 1 × 16-bit unit |
| U+10000–U+10FFFF | Surrogate pair |

---

### 3.2 BMP Example: `中`

```
U+4E2D → 0x4E2D
```

Stored as one 16-bit unit.

---

### 3.3 Non-BMP Example: 😀

#### Step 1: Subtract 0x10000

```
0x1F600 - 0x10000 = 0x0F600
```

#### Step 2: Split into 10-bit values

```
Binary: 00001111011000000000
High: 0000111101
Low:  1000000000
```

#### Step 3: Add surrogate bases

```
High surrogate = 0xD800 + high = 0xD83D
Low  surrogate = 0xDC00 + low  = 0xDE00
```

Final UTF-16:
```
D83D DE00
```

---

## 4. UTF-8 vs UTF-16 Comparison

| Aspect | UTF-8 | UTF-16 |
|------|------|-------|
| Storage | 1–4 bytes | 2 or 4 bytes |
| ASCII | 1 byte | 2 bytes |
| Emoji | 4 bytes | 4 bytes |
| Endianness | No | Yes |
| Best for | Files, Network | JVM, JS memory |

---

## 5. Mental Model

> Unicode defines characters  
> UTF-8 encodes characters into bytes  
> UTF-16 encodes characters into 16-bit units

---

## 6. One-Line Summary

Unicode is the number; UTF-8 and UTF-16 are two different ways to pack that number into memory.
