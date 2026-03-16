# Switch vs Router --- Quick Summary

## 1. What is a Switch

A **switch** is a network device that connects devices within the **same
local network (LAN)** and forwards data based on **MAC addresses**.

### Key Characteristics

-   Operates mainly at **OSI Layer 2 (Data Link Layer)**
-   Uses a **MAC address table**
-   Connects devices inside a **local network**
-   Fast packet forwarding within the same subnet

### Basic Function

When a frame arrives, the switch:

1.  Reads the **destination MAC address**
2.  Looks it up in the **MAC table**
3.  Forwards the frame to the correct port

### Example

    PC1 ──┐
    PC2 ──┼── Switch ── Server
    PC3 ──┘

All devices are in the **same network**.

------------------------------------------------------------------------

## 2. What is a Router

A **router** is a network device that connects **different networks**
and forwards packets based on **IP addresses**.

### Key Characteristics

-   Operates mainly at **OSI Layer 3 (Network Layer)**
-   Uses a **routing table**
-   Connects **different networks or subnets**
-   Determines the best path for packets

### Basic Function

When a packet arrives, the router:

1.  Reads the **destination IP address**
2.  Looks it up in the **routing table**
3.  Sends the packet to the **next hop network**

### Example

    Home Network
       │
     Router
       │
    Internet

The router enables communication **between networks**.

------------------------------------------------------------------------

## 3. Key Differences

  Feature        Switch                   Router
  -------------- ------------------------ ----------------------------
  OSI Layer      Layer 2                  Layer 3
  Address Type   MAC Address              IP Address
  Purpose        Connect devices in LAN   Connect different networks
  Table Used     MAC Table                Routing Table
  Typical Use    Office LAN               Internet gateway

------------------------------------------------------------------------

## 4. Simple Analogy

Think of a **building and cities**.

-   **Switch** → delivers mail **inside the same building**
-   **Router** → sends mail **between different cities**

------------------------------------------------------------------------

## 5. Typical Network Architecture

    Devices
      │
    Switch
      │
    Router
      │
    Internet

-   **Switch** handles internal communication
-   **Router** connects the network to external networks

------------------------------------------------------------------------

## 6. Summary

**Switch** - Connects devices inside a LAN - Uses MAC addresses - Works
mainly at Layer 2

**Router** - Connects different networks - Uses IP addresses - Works
mainly at Layer 3
