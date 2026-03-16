# Nginx Concepts: Upstream and Reverse Proxy

## 1. Why Nginx Uses the Term Upstream

In Nginx, **upstream** refers to the backend servers that receive
requests from Nginx.

Example configuration:

``` nginx
upstream backend {
    server 10.20.10.11;
    server 10.20.10.12;
    server 10.20.10.13;
}
```

### Meaning

-   `upstream` defines a **group of backend servers**
-   Nginx forwards client requests to this server group
-   The servers listed inside the `upstream` block are called **upstream
    servers**

### Request Flow

Client → Nginx → Backend Servers

### Why the name "Upstream"

The term comes from **network data flow terminology**, where
communication is described relative to the current system.

From the **Nginx perspective**:

Downstream → Clients sending requests to Nginx\
Upstream → Backend servers Nginx forwards requests to

So the flow becomes:

Client (Downstream) → Nginx → Backend Servers (Upstream)

In simple terms:

**Upstream = the backend servers that Nginx forwards requests to.**

### Purpose of Upstream

The upstream mechanism enables:

-   Load balancing
-   High availability
-   Service routing
-   Microservice gateway behavior

------------------------------------------------------------------------

## 2. Why Nginx Is Called a Reverse Proxy

To understand this, we need to compare **forward proxy** and **reverse
proxy**.

### Normal Internet Connection

Client → Server

### Forward Proxy

A **forward proxy** sits in front of the client and represents the
client.

Client → Forward Proxy → Internet Server

Example use cases:

-   corporate internet gateway
-   VPN access
-   privacy / anonymity
-   traffic filtering

The destination server sees the request as coming from the proxy instead
of the real client.

So the proxy **represents the client**.

### Reverse Proxy

A **reverse proxy** sits in front of the servers and represents the
server side.

Client → Reverse Proxy → Backend Server

Example with Nginx:

Client → Nginx → Application Server

The client thinks it is communicating with the server, but actually it
is communicating with the proxy in front of the server.

The proxy hides the backend servers.

### Why It Is Called "Reverse"

Because the proxy role is **reversed**.

Forward proxy protects or represents the **client side**.\
Reverse proxy protects or represents the **server side**.

Comparison:

  Proxy Type      Represents   Position
  --------------- ------------ ---------------------
  Forward Proxy   Client       In front of clients
  Reverse Proxy   Server       In front of servers

### Typical Reverse Proxy Architecture

Internet Users\
↓\
Reverse Proxy (Nginx)\
↓\
Backend Servers\
- App Server 1\
- App Server 2\
- App Server 3

### Functions of a Reverse Proxy

Reverse proxies typically provide:

-   Load balancing
-   SSL termination
-   Security filtering
-   Request routing
-   Caching
-   API gateway behavior

------------------------------------------------------------------------

## Summary

**Upstream in Nginx** - Represents backend servers - Defines a server
group - Used for load balancing and routing

**Reverse Proxy** - A proxy that represents the server side - Receives
client requests - Forwards requests to backend servers

Architecture example:

Client → Nginx (Reverse Proxy) → Upstream Servers
