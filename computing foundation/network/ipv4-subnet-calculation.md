# IPv4 Subnet Calculation – Step by Step

This document explains how to compute the subnet (network range) given an IPv4 address and a subnet mask.

---

## Example Input

```
IPv4 Address: 192.168.64.1
Subnet Mask: 255.255.240.0
```

---

## Step 1: Convert Subnet Mask to CIDR

Subnet mask in binary:

```
255 = 11111111
255 = 11111111
240 = 11110000
0   = 00000000
```

Count the number of `1` bits:

```
8 + 8 + 4 = 20
```

CIDR notation:

```
/20
```

So the address becomes:

```
192.168.64.1/20
```

---

## Step 2: Determine the Subnet Block Size

For the octet where the mask is not 255:

```
256 - 240 = 16
```

This means subnet boundaries increase by **16** in the third octet:

```
0, 16, 32, 48, 64, 80, ...
```

---

## Step 3: Find the Network Address

The third octet of the IP is `64`, which is exactly on a subnet boundary.

Set all host bits to `0`:

```
Network Address = 192.168.64.0
```

---

## Step 4: Find the Broadcast Address

Subnet range:
- Third octet: `64` to `79` (`64 + 16 - 1`)
- Fourth octet: `0` to `255`

Broadcast address:

```
192.168.79.255
```

---

## Step 5: Determine Usable IP Range

Exclude:
- Network address
- Broadcast address

Usable host range:

```
192.168.64.1 – 192.168.79.254
```

---

## Final Summary

| Item | Value |
|---|---|
| CIDR | /20 |
| Network Address | 192.168.64.0 |
| Broadcast Address | 192.168.79.255 |
| Usable IP Range | 192.168.64.1 – 192.168.79.254 |
| Total IPs | 4096 |
| Usable Hosts | 4094 |

---

## One Rule to Remember

Subnet mask `255.255.240.0` means:

> **The third octet increases in steps of 16**
