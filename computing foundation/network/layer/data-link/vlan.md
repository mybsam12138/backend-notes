# VLAN (Virtual Local Area Network) - Summary

## 1. What is VLAN?

A **VLAN (Virtual Local Area Network)** is a logical grouping of devices within a network that behave as if they are on the same physical LAN, even if they are physically separated.

It operates at **Layer 2 (Data Link Layer)** and is used to segment networks for better security and performance.

---

## 2. Why Use VLAN?

### 2.1 Network Isolation
- Devices in different VLANs **cannot communicate directly**
- Enhances security (e.g., HR vs Finance separation)

### 2.2 Broadcast Control
- Each VLAN is its own **broadcast domain**
- Reduces unnecessary network traffic

### 2.3 Flexibility
- Logical grouping instead of physical grouping
- Easier to manage and scale

---

## 3. How VLAN Works

- Each VLAN has a unique **VLAN ID (1–4094)**
- Switch ports are assigned to VLANs
- Devices connected to those ports belong to that VLAN

---

## 4. VLAN Types

### 4.1 Access Port
- Connects end devices (PC, server)
- Belongs to **one VLAN only**

### 4.2 Trunk Port
- Connects switches or switch ↔ router
- Carries **multiple VLANs**
- Uses **802.1Q tagging**

---

## 5. VLAN Tagging (802.1Q)

- Adds a **VLAN tag** to Ethernet frames
- Identifies which VLAN the traffic belongs to
- Used on trunk links

---

## 6. Inter-VLAN Communication

- VLANs are isolated by default
- Communication requires a **Layer 3 device**:
    - Router (Router-on-a-Stick)
    - Layer 3 Switch

---

## 7. Example

| Department | VLAN ID |
|-----------|--------|
| HR        | 10     |
| Finance   | 20     |
| IT        | 30     |

- Devices in different VLANs cannot communicate unless routing is configured

---

## 8. Advantages

- Improved security
- Reduced broadcast traffic
- Better performance
- Flexible network design

---

## 9. Disadvantages

- More complex configuration
- Requires Layer 3 routing for communication
- Misconfiguration may cause network issues

---

## 10. Key Concepts Summary

- VLAN = logical segmentation
- Each VLAN = separate broadcast domain
- Access port = single VLAN
- Trunk port = multiple VLANs (tagged)
- Inter-VLAN requires Layer 3 routing

---

## 11. Simple Diagram
