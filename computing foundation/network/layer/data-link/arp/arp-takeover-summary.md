# ARP Takeover (VIP Failover) --- Summary

## 1. What is ARP Takeover

**ARP takeover** is a technique used in high‑availability systems where
one server takes control of a **Virtual IP (VIP)** after another server
fails.

It works by **sending Gratuitous ARP messages to update the network's IP
→ MAC mapping**, so traffic is redirected to the new server.

In simple terms:

> ARP takeover allows a backup server to immediately receive traffic for
> a shared IP address when the primary server fails.

------------------------------------------------------------------------

## 2. Why ARP Takeover is Needed

In high‑availability architectures, multiple servers may share a
**Virtual IP (VIP)** that clients use to connect to a service.

Example:

-   VIP: `10.0.0.100`
-   Server A: `10.0.0.11`
-   Server B: `10.0.0.12`

Clients always connect to the VIP:

    Client → 10.0.0.100

Only one server owns the VIP at a time.

If the active server fails, the backup server must **quickly take
control of the VIP and redirect traffic**.

------------------------------------------------------------------------

## 3. How ARP Takeover Works

### Step 1 --- Primary server owns the VIP

The primary load balancer (Server A) holds the virtual IP.

    VIP 10.0.0.100 → MAC_A

Clients store this mapping in their ARP cache.

------------------------------------------------------------------------

### Step 2 --- Primary server fails

The backup server detects the failure using a **heartbeat mechanism**
(for example VRRP or Keepalived).

------------------------------------------------------------------------

### Step 3 --- Backup server takes the VIP

The backup server assigns the VIP to its network interface.

Example command in Linux:

    ip addr add 10.0.0.100/24 dev eth0

------------------------------------------------------------------------

### Step 4 --- Send Gratuitous ARP

The backup server broadcasts a **Gratuitous ARP** message:

    10.0.0.100 is at MAC_B

This tells the entire local network that the VIP now belongs to the new
MAC address.

------------------------------------------------------------------------

### Step 5 --- Network updates ARP tables

Switches and hosts update their ARP cache:

    10.0.0.100 → MAC_B

Traffic automatically starts flowing to the backup server.

------------------------------------------------------------------------

## 4. Role of Gratuitous ARP

Gratuitous ARP is essential because many devices cache ARP entries.

Without sending it, clients might still believe:

    10.0.0.100 → MAC_A

which would cause traffic to be sent to the failed server.

------------------------------------------------------------------------

## 5. Typical Architecture

            VIP 10.0.0.100
                  │
              Switch
               /   \
         Server A  Server B
          (MASTER) (BACKUP)

If Server A fails:

1.  Server B becomes MASTER
2.  Server B sends Gratuitous ARP
3.  Network updates IP → MAC mapping
4.  Clients automatically send traffic to Server B

------------------------------------------------------------------------

## 6. Common Technologies Using ARP Takeover

ARP takeover is commonly used with:

-   **Keepalived**
-   **VRRP (Virtual Router Redundancy Protocol)**
-   **LVS (Linux Virtual Server)**
-   **HAProxy high‑availability setups**

These systems combine:

-   heartbeat detection
-   VIP switching
-   Gratuitous ARP announcements

------------------------------------------------------------------------

## 7. Limitations

ARP takeover works only inside a **Layer 2 network** (same broadcast
domain).

It does not work across routers or different subnets.

Because of this, cloud environments typically use **SDN routing or load
balancers instead of ARP takeover**.

------------------------------------------------------------------------

## 8. Summary

ARP takeover is a failover mechanism that allows a backup server to take
control of a virtual IP address.

Key ideas:

-   A **VIP** represents a service address shared by multiple servers
-   A **heartbeat system** detects failures
-   The backup server **binds the VIP**
-   A **Gratuitous ARP broadcast updates IP → MAC mappings**
-   Traffic automatically shifts to the new server

This mechanism enables **fast failover without changing client
configuration**.
