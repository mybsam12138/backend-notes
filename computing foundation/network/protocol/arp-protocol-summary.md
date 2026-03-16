# ARP Protocol Summary

## 1. What is ARP

**ARP** stands for **Address Resolution Protocol**.

It is used in a local network to map an **IP address** to a **MAC address**.

In simple terms:

> ARP helps a device find the hardware address of another device in the same LAN.

Example:

- IP address: `192.168.1.20`
- MAC address: `AA:BB:CC:DD:EE:FF`

ARP answers the question:

> “Who has IP `192.168.1.20`? Tell me its MAC address.”

---

## 2. Why ARP is Needed

Applications usually communicate using **IP addresses**, but Ethernet communication inside a LAN uses **MAC addresses**.

That means a device must first convert:

```text
Destination IP -> Destination MAC
```

before sending the Ethernet frame.

Without ARP, a device would know the target IP but would not know where to send the frame on the local network.

---

## 3. Where ARP Works

ARP works only inside a **local broadcast domain**, usually the same **subnet / VLAN**.

It does **not** work across routers.

Example:

- PC1: `192.168.1.10/24`
- PC2: `192.168.1.20/24`

Since they are in the same subnet, ARP can be used.

If the destination is in another subnet, the sender does not ARP for the remote host directly.  
Instead, it ARPs for the **default gateway's MAC address**.

---

## 4. How ARP Works

### Step 1: Check whether the target is in the same subnet

The sender compares:

- its own IP and subnet mask
- the destination IP and subnet mask

If the destination is in the same subnet, it needs the target device's MAC address.

---

### Step 2: Check the local ARP cache

Before broadcasting, the sender checks its local **ARP cache**.

If an entry already exists, it can use the cached MAC address directly.

Example ARP cache entry:

```text
192.168.1.20 -> AA:BB:CC:DD:EE:FF
```

---

### Step 3: Send an ARP Request

If the MAC address is unknown, the sender broadcasts an ARP request.

Example request:

```text
Who has 192.168.1.20? Tell 192.168.1.10
```

This is sent as an Ethernet broadcast frame:

```text
Destination MAC = FF:FF:FF:FF:FF:FF
```

All devices in the same broadcast domain receive it.

---

### Step 4: The target replies with an ARP Reply

Only the device whose IP matches the request sends a reply.

Example reply:

```text
192.168.1.20 is at AA:BB:CC:DD:EE:FF
```

This reply is usually unicast back to the requester.

---

### Step 5: Store the result in the ARP cache

The sender stores the mapping locally:

```text
192.168.1.20 -> AA:BB:CC:DD:EE:FF
```

Future packets can use this cached entry until it expires.

---

## 5. ARP Cache

Every host usually maintains its own **ARP table / ARP cache**.

Important facts:

- It is stored locally on each device
- It only contains devices the host has communicated with
- Entries expire after some time
- A new ARP request is sent when the cache entry is missing or expired

Common commands:

### Windows

```bash
arp -a
```

### Linux

```bash
arp -a
ip neigh
```

---

## 6. ARP Packet Contents

A typical ARP message contains:

- Sender MAC address
- Sender IP address
- Target MAC address
- Target IP address
- Operation type (request or reply)

---

## 7. ARP and OSI Layer

ARP is usually considered a protocol between **Layer 2** and **Layer 3**.

Why:

- It resolves **Layer 3 IP addresses**
- It is carried inside **Layer 2 Ethernet frames**

So ARP is often informally called a **Layer 2.5 protocol**.

---

## 8. ARP Broadcast and Network Size

ARP requests are broadcast to all devices in the same broadcast domain.

That means in a very large Layer 2 network, many devices will receive ARP traffic even if they are not the target.

Because of this, large networks are usually segmented using:

- VLANs
- subnets
- routers / Layer 3 switches

This reduces unnecessary broadcast traffic.

---

## 9. ARP vs Switch MAC Table

These two are different:

### ARP Cache on a Host

Stores:

```text
IP -> MAC
```

Example:

```text
192.168.1.20 -> AA:BB:CC:DD:EE:FF
```

### MAC Address Table on a Switch

Stores:

```text
MAC -> Port
```

Example:

```text
AA:BB:CC:DD:EE:FF -> Port 5
```

Summary:

- ARP helps a host find a MAC address from an IP address
- A switch uses MAC addresses to decide which port to forward frames to

---

## 10. Gratuitous ARP

A **Gratuitous ARP** is an ARP message sent by a host about its own IP address.

It is commonly used to:

- update ARP caches
- detect duplicate IP addresses
- support VIP failover in HA systems

Example use case:

- Server A owns a VIP
- Server A fails
- Server B takes over the VIP
- Server B sends Gratuitous ARP so the network updates the IP-to-MAC mapping

---

## 11. Limitations of ARP

ARP has several limitations:

- It works only in the local network
- It relies on broadcast
- It can be abused by ARP spoofing / ARP poisoning attacks
- It does not scale well in very large Layer 2 domains

---

## 12. Security Risk: ARP Spoofing

Because ARP is trust-based, an attacker can send fake ARP replies such as:

```text
192.168.1.1 is at FA:KE:MA:CA:DD:RR
```

This can redirect traffic to the attacker.

This is called:

- ARP spoofing
- ARP poisoning

Common protections include:

- Dynamic ARP Inspection (DAI)
- static ARP entries in special cases
- network segmentation
- switch security features

---

## 13. Example End-to-End Flow

Suppose:

- PC1: `192.168.1.10`
- PC2: `192.168.1.20`

Flow:

1. PC1 wants to send data to `192.168.1.20`
2. PC1 checks its ARP cache
3. No entry found
4. PC1 broadcasts an ARP request
5. PC2 replies with its MAC address
6. PC1 stores the mapping
7. PC1 sends the real Ethernet frame using PC2's MAC address

---

## 14. Summary

ARP is the protocol that resolves:

```text
IP -> MAC
```

Key points:

- Used inside a local network
- Broadcast request, unicast reply
- Each host keeps its own ARP cache
- Required for Ethernet communication in the same subnet
- Does not work across routers
- Important but vulnerable to spoofing attacks
